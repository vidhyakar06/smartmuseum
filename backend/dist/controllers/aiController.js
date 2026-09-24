"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAIChat = void 0;
const aiService_js_1 = require("../services/aiService.js");
const db_js_1 = require("../config/db.js");
const handleAIChat = async (req, res) => {
    try {
        const { message, exhibitId, language, history } = req.body;
        if (!message || typeof message !== 'string') {
            res.status(400).json({ success: false, message: 'Message is required' });
            return;
        }
        const sessionId = req.headers['x-session-id'] || 'session_demo_web';
        const result = await (0, aiService_js_1.askAIGuide)({
            message,
            exhibitId,
            language: language || 'en',
            history: Array.isArray(history) ? history : []
        });
        // Track analytics event
        db_js_1.dbStore.analytics.push({
            id: `EVT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            sessionId,
            eventType: 'ai-question',
            exhibitId,
            metadata: { query: message, answerLength: result.answer.length, source: result.source },
            timestamp: new Date().toISOString()
        });
        res.json({
            success: true,
            data: result
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.handleAIChat = handleAIChat;
