"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTicket = exports.getTickets = void 0;
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
        const qrDataUrl = await (0, qrService_js_1.generateQRCodeDataUrl)(`MUSEUM_TICKET:${ticketId}:${visitorName}`);
        res.status(201).json({
            success: true,
            data: {
                ...newTicket,
                qrDataUrl
            }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createTicket = createTicket;
