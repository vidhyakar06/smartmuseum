import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from '../src/config/db.js';
import exhibitRoutes from '../src/routes/exhibitRoutes.js';
import galleryRoutes from '../src/routes/galleryRoutes.js';
import aiRoutes from '../src/routes/aiRoutes.js';
import analyticsRoutes from '../src/routes/analyticsRoutes.js';
import ticketRoutes from '../src/routes/ticketRoutes.js';
import visitorRoutes from '../src/routes/visitorRoutes.js';
import authRoutes from '../src/routes/authRoutes.js';
import audioRoutes from '../src/routes/audioRoutes.js';
import { aiRateLimiter } from '../src/middleware/rateLimit.js';
import { errorHandler } from '../src/middleware/errorHandler.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-session-id']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    system: 'Smart Museum & Interactive Art Guide API',
    timestamp: new Date().toISOString(),
    demoMode: process.env.DEMO_MODE === 'true' || !process.env.GROQ_API_KEY
  });
});

app.use('/api/exhibits', exhibitRoutes);
app.use('/api/galleries', galleryRoutes);
app.use('/api/ai', aiRateLimiter, aiRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/visitors', visitorRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/audio', audioRoutes);

app.use(errorHandler);

connectDB();

export default app;
