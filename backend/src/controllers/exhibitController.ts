import { Request, Response } from 'express';
import { dbStore } from '../config/db.js';
import { Exhibit } from '../models/types.js';
import { generateQRCodeDataUrl } from '../services/qrService.js';

export const getExhibits = async (req: Request, res: Response): Promise<void> => {
  try {
    const { galleryId, category, search, highlight } = req.query;
    let list = [...dbStore.exhibits];

    if (galleryId) {
      list = list.filter(e => e.galleryId.toLowerCase() === String(galleryId).toLowerCase());
    }
    if (category) {
      list = list.filter(e => e.category.toLowerCase().includes(String(category).toLowerCase()));
    }
    if (highlight === 'true') {
      list = list.filter(e => e.highlight);
    }
    if (search) {
      const q = String(search).toLowerCase();
      list = list.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.artist.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        e.exhibitId.toLowerCase().includes(q)
      );
    }

    res.json({
      success: true,
      count: list.length,
      data: list
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getExhibitById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const exhibit = dbStore.exhibits.find(
      e => e.exhibitId.toLowerCase() === id.toLowerCase() || e.id.toLowerCase() === id.toLowerCase()
    );

    if (!exhibit) {
      res.status(404).json({ success: false, message: 'Exhibit not found' });
      return;
    }

    // Log exhibit-view event in analytics
    dbStore.analytics.push({
      id: `EVT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      sessionId: req.headers['x-session-id'] ? String(req.headers['x-session-id']) : 'session_anon',
      eventType: 'exhibit-view',
      exhibitId: exhibit.exhibitId,
      galleryId: exhibit.galleryId,
      timestamp: new Date().toISOString()
    });

    res.json({ success: true, data: exhibit });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getExhibitQR = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const exhibit = dbStore.exhibits.find(
      e => e.exhibitId.toLowerCase() === id.toLowerCase() || e.id.toLowerCase() === id.toLowerCase()
    );

    if (!exhibit) {
      res.status(404).json({ success: false, message: 'Exhibit not found' });
      return;
    }

    const host = req.get('host') || 'localhost:5173';
    const protocol = req.protocol || 'http';
    const targetUrl = `${protocol}://${host}/exhibit/${exhibit.exhibitId}`;
    const qrDataUrl = await generateQRCodeDataUrl(targetUrl);

    res.json({
      success: true,
      exhibitId: exhibit.exhibitId,
      title: exhibit.title,
      targetUrl,
      qrDataUrl
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createExhibit = async (req: Request, res: Response): Promise<void> => {
  try {
    const newExhibit: Exhibit = {
      ...req.body,
      id: `EX-${Date.now()}`,
      exhibitId: req.body.exhibitId || `EX0${dbStore.exhibits.length + 1}`,
      createdAt: new Date().toISOString()
    };
    dbStore.exhibits.push(newExhibit);
    res.status(201).json({ success: true, data: newExhibit });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateExhibit = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const index = dbStore.exhibits.findIndex(
      e => e.exhibitId.toLowerCase() === id.toLowerCase() || e.id.toLowerCase() === id.toLowerCase()
    );

    if (index === -1) {
      res.status(404).json({ success: false, message: 'Exhibit not found' });
      return;
    }

    dbStore.exhibits[index] = { ...dbStore.exhibits[index], ...req.body };
    res.json({ success: true, data: dbStore.exhibits[index] });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteExhibit = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const index = dbStore.exhibits.findIndex(
      e => e.exhibitId.toLowerCase() === id.toLowerCase() || e.id.toLowerCase() === id.toLowerCase()
    );

    if (index === -1) {
      res.status(404).json({ success: false, message: 'Exhibit not found' });
      return;
    }

    const removed = dbStore.exhibits.splice(index, 1);
    res.json({ success: true, data: removed[0] });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
