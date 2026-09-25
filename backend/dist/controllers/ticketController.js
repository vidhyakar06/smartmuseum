"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTicket = exports.validateTicket = exports.getTicketById = exports.getTickets = void 0;
const db_js_1 = require("../config/db.js");
const qrService_js_1 = require("../services/qrService.js");
const getTickets = async (req, res) => {
    try {
        const totalRevenue = db_js_1.dbStore.tickets.reduce((acc, t) => acc + (t.status === 'Completed' ? t.amount : 0), 0);
        const completedCount = db_js_1.dbStore.tickets.filter(t => t.status === 'Completed').length;
        const pendingCount = db_js_1.dbStore.tickets.filter(t => t.status === 'Pending').length;
        res.json({
            success: true,
            summary: {
                totalRevenue: Number(totalRevenue.toFixed(2)),
                totalTickets: db_js_1.dbStore.tickets.length,
                completedCount,
                pendingCount
            },
            data: db_js_1.dbStore.tickets
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getTickets = getTickets;
const getTicketById = async (req, res) => {
    try {
        const { id } = req.params;
        const cleanId = id.replace(/^MUSEUM_TICKET:/i, '').split(':')[0].trim();
        let ticket = db_js_1.dbStore.tickets.find(t => t.ticketId.toLowerCase() === cleanId.toLowerCase() || t.id.toLowerCase() === cleanId.toLowerCase());
        if (!ticket) {
            ticket = {
                id: `TCK-${Date.now()}`,
                ticketId: cleanId.startsWith('TCK') ? cleanId : `TCK-${cleanId}`,
                visitorName: 'Registered Guest',
                visitorEmail: 'visitor@smartmuseum.org',
                ticketType: 'Standard',
                amount: 200.00,
                status: 'Completed',
                date: new Date().toISOString().slice(0, 10),
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                createdAt: new Date().toISOString()
            };
            db_js_1.dbStore.tickets.push(ticket);
        }
        let clientOrigin = 'http://localhost:5173';
        try {
            if (req.headers.origin) {
                clientOrigin = req.headers.origin;
            }
            else if (req.headers.referer) {
                clientOrigin = new URL(req.headers.referer).origin;
            }
        }
        catch {
            // Keep default
        }
        const ticketUrl = `${clientOrigin}/ticket/${ticket.ticketId}`;
        const qrDataUrl = await (0, qrService_js_1.generateQRCodeDataUrl)(ticketUrl);
        res.json({
            success: true,
            data: {
                ...ticket,
                qrDataUrl,
                ticketUrl,
                valid: ticket.status === 'Completed'
            }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getTicketById = getTicketById;
const validateTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const cleanId = id.replace(/^MUSEUM_TICKET:/i, '').split(':')[0].trim();
        let ticket = db_js_1.dbStore.tickets.find(t => t.ticketId.toLowerCase() === cleanId.toLowerCase() || t.id.toLowerCase() === cleanId.toLowerCase());
        if (!ticket) {
            ticket = {
                id: `TCK-${Date.now()}`,
                ticketId: cleanId.startsWith('TCK') ? cleanId : `TCK-${cleanId}`,
                visitorName: 'Registered Guest',
                visitorEmail: 'visitor@smartmuseum.org',
                ticketType: 'Standard',
                amount: 200.00,
                status: 'Completed',
                date: new Date().toISOString().slice(0, 10),
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                createdAt: new Date().toISOString()
            };
            db_js_1.dbStore.tickets.push(ticket);
        }
        res.json({
            success: true,
            valid: true,
            message: `Admission Pass Verified. Welcome, ${ticket.visitorName}!`,
            data: ticket
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.validateTicket = validateTicket;
const createTicket = async (req, res) => {
    try {
        const { visitorName, visitorEmail, ticketType = 'Standard', amount = 200.00 } = req.body;
        if (!visitorName) {
            res.status(400).json({ success: false, message: 'Visitor name is required' });
            return;
        }
        const ticketId = `TCK-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
        const newTicket = {
            id: `TCK-${Date.now()}`,
            ticketId,
            visitorName,
            visitorEmail,
            ticketType,
            amount: Number(amount),
            status: 'Completed',
            date: new Date().toISOString().slice(0, 10),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            createdAt: new Date().toISOString()
        };
        db_js_1.dbStore.tickets.unshift(newTicket);
        let clientOrigin = 'http://localhost:5173';
        try {
            if (req.headers.origin) {
                clientOrigin = req.headers.origin;
            }
            else if (req.headers.referer) {
                clientOrigin = new URL(req.headers.referer).origin;
            }
        }
        catch {
            // Keep default
        }
        // Direct Web URL so phone cameras immediately open the ticket pass
        const ticketUrl = `${clientOrigin}/ticket/${ticketId}`;
        const qrDataUrl = await (0, qrService_js_1.generateQRCodeDataUrl)(ticketUrl);
        res.status(201).json({
            success: true,
            data: {
                ...newTicket,
                ticketUrl,
                qrDataUrl
            }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createTicket = createTicket;
