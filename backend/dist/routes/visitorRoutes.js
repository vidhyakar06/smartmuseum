"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_js_1 = require("../config/db.js");
const router = (0, express_1.Router)();
// Get active visitors (admin view)
router.get('/', (req, res) => {
    res.json({
        success: true,
        count: db_js_1.dbStore.visitors.length,
        data: db_js_1.dbStore.visitors
    });
});
// Update visitor location / beacon simulation
router.post('/location', (req, res) => {
    const { sessionId, location, beaconId } = req.body;
    const visitor = db_js_1.dbStore.visitors.find(v => v.sessionId === sessionId);
    if (visitor) {
        if (location)
            visitor.currentLocation = location;
        if (beaconId)
            visitor.currentBeaconId = beaconId;
        visitor.lastActiveAt = new Date().toISOString();
    }
    res.json({ success: true, visitor });
});
exports.default = router;
