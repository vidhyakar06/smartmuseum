import { Router } from 'express';
import { handleAIChat } from '../controllers/aiController.js';

const router = Router();

router.post('/chat', handleAIChat);

export default router;
