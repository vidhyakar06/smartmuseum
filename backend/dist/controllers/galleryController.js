"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGalleryOccupancy = exports.getGalleryById = exports.getGalleries = void 0;
const db_js_1 = require("../config/db.js");
const getGalleries = async (req, res) => {
    try {
        const galleriesWithCrowd = db_js_1.dbStore.galleries.map(g => {
            const occupancyRatio = g.currentOccupancy / g.capacity;
            let status = 'Normal';
            let alertLevel = 'green';
            let recommendation = '';
            if (occupancyRatio >= 1.0) {
                status = 'High Traffic';
                alertLevel = 'red';
                const altGallery = db_js_1.dbStore.galleries.find(a => a.galleryId === g.recommendedAlternative);
                recommendation = `High crowd density! Consider visiting ${altGallery ? altGallery.name : 'Gallery D'} first to avoid delays.`;
            }
            else if (occupancyRatio >= 0.8) {
                status = 'High Traffic';
                alertLevel = 'yellow';
                recommendation = 'Approaching capacity. Please maintain flow.';
            }
            else if (occupancyRatio < 0.4) {
                status = 'Low';
                alertLevel = 'green';
                recommendation = 'Ideal time to explore masterpieces peacefully.';
            }
            return {
                ...g,
                occupancyRatio: Math.round(occupancyRatio * 100),
                status,
                alertLevel,
                recommendation
            };
        });
        res.json({
            success: true,
            data: galleriesWithCrowd
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getGalleries = getGalleries;
const getGalleryById = async (req, res) => {
    try {
        const { id } = req.params;
        const gallery = db_js_1.dbStore.galleries.find(g => g.galleryId.toLowerCase() === id.toLowerCase() || g.id.toLowerCase() === id.toLowerCase());
        if (!gallery) {
            res.status(404).json({ success: false, message: 'Gallery not found' });
            return;
        }
        const exhibitsInGallery = db_js_1.dbStore.exhibits.filter(e => e.galleryId.toLowerCase() === gallery.galleryId.toLowerCase());
        res.json({
            success: true,
            data: {
                ...gallery,
                exhibits: exhibitsInGallery
            }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getGalleryById = getGalleryById;
const updateGalleryOccupancy = async (req, res) => {
    try {
        const { id } = req.params;
        const { occupancy, capacity } = req.body;
        const gallery = db_js_1.dbStore.galleries.find(g => g.galleryId.toLowerCase() === id.toLowerCase() || g.id.toLowerCase() === id.toLowerCase());
        if (!gallery) {
            res.status(404).json({ success: false, message: 'Gallery not found' });
            return;
        }
        if (occupancy !== undefined)
            gallery.currentOccupancy = Number(occupancy);
        if (capacity !== undefined)
            gallery.capacity = Number(capacity);
        res.json({ success: true, data: gallery });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateGalleryOccupancy = updateGalleryOccupancy;
