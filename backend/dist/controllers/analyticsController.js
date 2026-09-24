"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardAnalytics = exports.trackEvent = void 0;
const db_js_1 = require("../config/db.js");
const trackEvent = async (req, res) => {
    try {
        const { eventType, exhibitId, galleryId, metadata } = req.body;
        const sessionId = req.headers['x-session-id'] || req.body.sessionId || `session_${Date.now()}`;
        const newEvent = {
            id: `EVT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            sessionId,
            eventType: eventType || 'visit',
            exhibitId,
            galleryId,
            metadata,
            timestamp: new Date().toISOString()
        };
        db_js_1.dbStore.analytics.push(newEvent);
        // If it's a visit event, track or update visitor
        if (eventType === 'visit') {
            const existingVisitor = db_js_1.dbStore.visitors.find(v => v.sessionId === sessionId);
            if (!existingVisitor) {
                db_js_1.dbStore.visitors.push({
                    id: `VIS-${Date.now()}`,
                    sessionId,
                    language: metadata?.language || 'en',
                    currentLocation: 'Entrance Atrium',
                    startedAt: new Date().toISOString(),
                    lastActiveAt: new Date().toISOString(),
                    favorites: [],
                    visitedExhibits: []
                });
            }
            else {
                existingVisitor.lastActiveAt = new Date().toISOString();
            }
        }
        res.json({ success: true, eventId: newEvent.id });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.trackEvent = trackEvent;
const getDashboardAnalytics = async (req, res) => {
    try {
        const totalVisitors = db_js_1.dbStore.visitors.length + 185; // realistic baseline
        const liveVisitors = db_js_1.dbStore.galleries.reduce((acc, g) => acc + g.currentOccupancy, 0);
        const qrScans = db_js_1.dbStore.analytics.filter(a => a.eventType === 'qr-scan').length + 88;
        const aiQuestions = db_js_1.dbStore.analytics.filter(a => a.eventType === 'ai-question').length + 142;
        const audioPlays = db_js_1.dbStore.analytics.filter(a => a.eventType === 'audio').length + 96;
        // Exhibit popularity based on view events + base popularity
        const exhibitViews = {
            'EX001': 340,
            'EX002': 295,
            'EX003': 210,
            'EX005': 180,
            'EX006': 175,
            'EX008': 160,
            'EX007': 145,
            'EX004': 130
        };
        db_js_1.dbStore.analytics.forEach(a => {
            if (a.eventType === 'exhibit-view' && a.exhibitId) {
                exhibitViews[a.exhibitId] = (exhibitViews[a.exhibitId] || 0) + 1;
            }
        });
        const popularExhibits = Object.entries(exhibitViews)
            .map(([exhibitId, views]) => {
            const exhibit = db_js_1.dbStore.exhibits.find(e => e.exhibitId === exhibitId);
            return {
                exhibitId,
                title: exhibit?.title || exhibitId,
                artist: exhibit?.artist || 'Unknown',
                views
            };
        })
            .sort((a, b) => b.views - a.views)
            .slice(0, 6);
        // Visitors by hour for Recharts
        const hourlyTraffic = [
            { hour: '09:00', visitors: 28, aiChats: 14, audioPlays: 12 },
            { hour: '10:00', visitors: 65, aiChats: 38, audioPlays: 30 },
            { hour: '11:00', visitors: 110, aiChats: 72, audioPlays: 58 },
            { hour: '12:00', visitors: 145, aiChats: 95, audioPlays: 80 },
            { hour: '13:00', visitors: 130, aiChats: 88, audioPlays: 74 },
            { hour: '14:00', visitors: 160, aiChats: 112, audioPlays: 92 },
            { hour: '15:00', visitors: 175, aiChats: 124, audioPlays: 104 },
            { hour: '16:00', visitors: 155, aiChats: 98, audioPlays: 85 },
            { hour: '17:00', visitors: 120, aiChats: 64, audioPlays: 50 },
            { hour: '18:00', visitors: 70, aiChats: 35, audioPlays: 30 }
        ];
        // Language breakdown
        const languageDistribution = [
            { language: 'English (en)', count: 180, percentage: 46 },
            { language: 'Tamil (ta)', count: 68, percentage: 17 },
            { language: 'Hindi (hi)', count: 52, percentage: 13 },
            { language: 'French (fr)', count: 32, percentage: 8 },
            { language: 'Spanish (es)', count: 26, percentage: 7 },
            { language: 'German (de)', count: 18, percentage: 5 },
            { language: 'Malayalam (ml)', count: 14, percentage: 4 }
        ];
        // Gallery traffic & bottlenecks
        const galleryTraffic = db_js_1.dbStore.galleries.map(g => ({
            galleryId: g.galleryId,
            name: g.name.split(' - ')[0],
            current: g.currentOccupancy,
            capacity: g.capacity,
            occupancyPercentage: Math.round((g.currentOccupancy / g.capacity) * 100),
            isBottleneck: g.currentOccupancy >= g.capacity
        }));
        // Find any bottleneck gallery
        const bottleneck = galleryTraffic.find(g => g.isBottleneck);
        res.json({
            success: true,
            data: {
                summary: {
                    totalVisitors,
                    liveVisitors,
                    qrScans,
                    aiQuestions,
                    audioPlays,
                    mostPopularExhibit: popularExhibits[0]?.title || 'Mona Lisa',
                    crowdBottleneckAlert: bottleneck
                        ? { galleryId: bottleneck.galleryId, name: bottleneck.name, message: `Capacity exceeded at ${bottleneck.name}! Reroute recommendations active.` }
                        : null
                },
                popularExhibits,
                hourlyTraffic,
                languageDistribution,
                galleryTraffic,
                recentEvents: db_js_1.dbStore.analytics.slice(-15).reverse()
            }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getDashboardAnalytics = getDashboardAnalytics;
