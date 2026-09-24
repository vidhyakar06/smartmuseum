import { Router } from 'express';
import { trackEvent, getDashboardAnalytics } from '../controllers/analyticsController.js';

const router = Router();

router.post('/visit', trackEvent);
router.post('/exhibit-view', trackEvent);
router.post('/ai-question', trackEvent);
router.post('/audio', trackEvent);
router.post('/qr-scan', trackEvent);
router.post('/event', trackEvent);
router.get('/dashboard', getDashboardAnalytics);

export default router;
