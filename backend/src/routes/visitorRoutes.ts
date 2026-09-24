import { Router, Request, Response } from 'express';
import { dbStore } from '../config/db.js';

const router = Router();

// Get active visitors (admin view)
router.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    count: dbStore.visitors.length,
    data: dbStore.visitors
  });
});

// Update visitor location / beacon simulation
router.post('/location', (req: Request, res: Response) => {
  const { sessionId, location, beaconId } = req.body;
  const visitor = dbStore.visitors.find(v => v.sessionId === sessionId);
  if (visitor) {
    if (location) visitor.currentLocation = location;
    if (beaconId) visitor.currentBeaconId = beaconId;
    visitor.lastActiveAt = new Date().toISOString();
  }
  res.json({ success: true, visitor });
});

export default router;
