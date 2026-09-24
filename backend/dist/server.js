"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_js_1 = require("./config/db.js");
const exhibitRoutes_js_1 = __importDefault(require("./routes/exhibitRoutes.js"));
const galleryRoutes_js_1 = __importDefault(require("./routes/galleryRoutes.js"));
const aiRoutes_js_1 = __importDefault(require("./routes/aiRoutes.js"));
const analyticsRoutes_js_1 = __importDefault(require("./routes/analyticsRoutes.js"));
const ticketRoutes_js_1 = __importDefault(require("./routes/ticketRoutes.js"));
const visitorRoutes_js_1 = __importDefault(require("./routes/visitorRoutes.js"));
const authRoutes_js_1 = __importDefault(require("./routes/authRoutes.js"));
const audioRoutes_js_1 = __importDefault(require("./routes/audioRoutes.js"));
const rateLimit_js_1 = require("./middleware/rateLimit.js");
const errorHandler_js_1 = require("./middleware/errorHandler.js");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Security & Parsing Middleware
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-session-id']
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use(express_1.default.static('public'));
// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        system: 'Smart Museum & Interactive Art Guide API',
        timestamp: new Date().toISOString(),
        demoMode: process.env.DEMO_MODE === 'true' || !process.env.GROQ_API_KEY
    });
});
// API Routes
app.use('/api/exhibits', exhibitRoutes_js_1.default);
app.use('/api/galleries', galleryRoutes_js_1.default);
app.use('/api/ai', rateLimit_js_1.aiRateLimiter, aiRoutes_js_1.default);
app.use('/api/analytics', analyticsRoutes_js_1.default);
app.use('/api/tickets', ticketRoutes_js_1.default);
app.use('/api/visitors', visitorRoutes_js_1.default);
app.use('/api/auth', authRoutes_js_1.default);
app.use('/api/audio', audioRoutes_js_1.default);
// Error Handling Middleware
app.use(errorHandler_js_1.errorHandler);
// Connect DB and Start Server
(0, db_js_1.connectDB)().then(() => {
    app.listen(PORT, () => {
        console.log(`====================================================`);
        console.log(`🏛️  Smart Museum & Interactive Art Guide API Online`);
        console.log(`🚀  Server running on http://localhost:${PORT}`);
        console.log(`🤖  AI Mode: ${process.env.GROQ_API_KEY ? 'Groq LLaMA 3.3 Active' : 'Autonomous Art Expert Engine (Offline/Demo Mode)'}`);
        console.log(`💾  Database: ${process.env.MONGODB_URI ? 'MongoDB Atlas' : 'In-Memory Museum Store'}`);
        console.log(`====================================================`);
    });
});
