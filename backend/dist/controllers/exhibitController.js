"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteExhibit = exports.updateExhibit = exports.createExhibit = exports.getExhibitQR = exports.getExhibitById = exports.getExhibits = void 0;
const db_js_1 = require("../config/db.js");
const qrService_js_1 = require("../services/qrService.js");
const getExhibits = async (req, res) => {
    try {
        const { galleryId, category, search, highlight } = req.query;
        let list = [...db_js_1.dbStore.exhibits];
        if (galleryId) {
            list = list.filter(e => e.galleryId.toLowerCase() === String(galleryId).toLowerCase());
        }
        if (category) {
            list = list.filter(e => e.category.toLowerCase().includes(String(category).toLowerCase()));
        }
        if (highlight === 'true') {
            list = list.filter(e => e.highlight);
        }
        if (search) {
            const q = String(search).toLowerCase();
            list = list.filter(e => e.title.toLowerCase().includes(q) ||
                e.artist.toLowerCase().includes(q) ||
                e.category.toLowerCase().includes(q) ||
                e.exhibitId.toLowerCase().includes(q));
        }
        res.json({
            success: true,
            count: list.length,
            data: list
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getExhibits = getExhibits;
const getExhibitById = async (req, res) => {
    try {
        const { id } = req.params;
        const exhibit = db_js_1.dbStore.exhibits.find(e => e.exhibitId.toLowerCase() === id.toLowerCase() || e.id.toLowerCase() === id.toLowerCase());
        if (!exhibit) {
            res.status(404).json({ success: false, message: 'Exhibit not found' });
            return;
        }
        // Log exhibit-view event in analytics
        db_js_1.dbStore.analytics.push({
            id: `EVT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            sessionId: req.headers['x-session-id'] ? String(req.headers['x-session-id']) : 'session_anon',
            eventType: 'exhibit-view',
            exhibitId: exhibit.exhibitId,
            galleryId: exhibit.galleryId,
            timestamp: new Date().toISOString()
        });
        res.json({ success: true, data: exhibit });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getExhibitById = getExhibitById;
const getExhibitQR = async (req, res) => {
    try {
        const { id } = req.params;
        const exhibit = db_js_1.dbStore.exhibits.find(e => e.exhibitId.toLowerCase() === id.toLowerCase() || e.id.toLowerCase() === id.toLowerCase());
        if (!exhibit) {
            res.status(404).json({ success: false, message: 'Exhibit not found' });
            return;
        }
        const host = req.get('host') || 'localhost:5173';
        const protocol = req.protocol || 'http';
        const targetUrl = `${protocol}://${host}/exhibit/${exhibit.exhibitId}`;
        const qrDataUrl = await (0, qrService_js_1.generateQRCodeDataUrl)(targetUrl);
        res.json({
            success: true,
            exhibitId: exhibit.exhibitId,
            title: exhibit.title,
            targetUrl,
            qrDataUrl
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getExhibitQR = getExhibitQR;
const createExhibit = async (req, res) => {
    try {
        const newExhibit = {
            ...req.body,
            id: `EX-${Date.now()}`,
            exhibitId: req.body.exhibitId || `EX0${db_js_1.dbStore.exhibits.length + 1}`,
            createdAt: new Date().toISOString()
        };
        db_js_1.dbStore.exhibits.push(newExhibit);
        res.status(201).json({ success: true, data: newExhibit });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createExhibit = createExhibit;
const updateExhibit = async (req, res) => {
    try {
        const { id } = req.params;
        const index = db_js_1.dbStore.exhibits.findIndex(e => e.exhibitId.toLowerCase() === id.toLowerCase() || e.id.toLowerCase() === id.toLowerCase());
        if (index === -1) {
            res.status(404).json({ success: false, message: 'Exhibit not found' });
            return;
        }
        db_js_1.dbStore.exhibits[index] = { ...db_js_1.dbStore.exhibits[index], ...req.body };
        res.json({ success: true, data: db_js_1.dbStore.exhibits[index] });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateExhibit = updateExhibit;
const deleteExhibit = async (req, res) => {
    try {
        const { id } = req.params;
        const index = db_js_1.dbStore.exhibits.findIndex(e => e.exhibitId.toLowerCase() === id.toLowerCase() || e.id.toLowerCase() === id.toLowerCase());
        if (index === -1) {
            res.status(404).json({ success: false, message: 'Exhibit not found' });
            return;
        }
        const removed = db_js_1.dbStore.exhibits.splice(index, 1);
        res.json({ success: true, data: removed[0] });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteExhibit = deleteExhibit;
