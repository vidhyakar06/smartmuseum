import { Request, Response } from 'express';
import { askAIGuide } from '../services/aiService.js';
import { dbStore } from '../config/db.js';

export const handleAIChat = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, exhibitId, language, history } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ success: false, message: 'Message is required' });
      return;
    }

    const sessionId = (req.headers['x-session-id'] as string) || 'session_demo_web';

    const result = await askAIGuide({
      message,
      exhibitId,
      language: language || 'en',
      history: Array.isArray(history) ? history : []
    });

    // Track analytics event
    dbStore.analytics.push({
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
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
