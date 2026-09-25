import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import exhibitRoutes from './routes/exhibitRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import visitorRoutes from './routes/visitorRoutes.js';
import authRoutes from './routes/authRoutes.js';
import audioRoutes from './routes/audioRoutes.js';
import { aiRateLimiter } from './middleware/rateLimit.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-session-id']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static('public'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  const activeAi = process.env.GEMINI_API_KEY
    ? `gemini (${process.env.GEMINI_MODEL || 'gemini-2.5-flash'})`
    : process.env.GROQ_API_KEY
      ? 'groq-llama'
      : 'local-art-expert';

  res.json({
    status: 'online',
    system: 'Smart Museum & Interactive Art Guide API',
    timestamp: new Date().toISOString(),
    demoMode: process.env.DEMO_MODE === 'true' || (!process.env.GEMINI_API_KEY && !process.env.GROQ_API_KEY),
    aiEngine: activeAi
  });
});

// API Routes
app.use('/api/exhibits', exhibitRoutes);
app.use('/api/galleries', galleryRoutes);
app.use('/api/ai', aiRateLimiter, aiRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/visitors', visitorRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/audio', audioRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Connect DB and Start Server
connectDB().then(() => {
  app.listen(PORT, () => {
    const aiBanner = process.env.GEMINI_API_KEY
      ? `✨ Google Gemini AI Active (${process.env.GEMINI_MODEL || 'gemini-2.5-flash'})`
      : process.env.GROQ_API_KEY
        ? '⚡ Groq LLaMA 3.3 Active'
        : '🤖 Autonomous Art Expert Engine (Offline/Local Mode)';

    console.log(`====================================================`);
    console.log(`🏛️  Smart Museum & Interactive Art Guide API Online`);
    console.log(`🚀  Server running on http://localhost:${PORT}`);
    console.log(`🤖  AI Mode: ${aiBanner}`);
    console.log(`💾  Database: ${process.env.MONGODB_URI ? 'MongoDB Atlas' : 'In-Memory Museum Store'}`);
    console.log(`====================================================`);
  });
});
