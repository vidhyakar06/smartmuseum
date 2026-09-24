import { Request, Response } from 'express';
import { dbStore } from '../config/db.js';

export const getGalleries = async (req: Request, res: Response): Promise<void> => {
  try {
    const galleriesWithCrowd = dbStore.galleries.map(g => {
      const occupancyRatio = g.currentOccupancy / g.capacity;
      let status: 'Low' | 'Normal' | 'High Traffic' | 'Crowded' = 'Normal';
      let alertLevel: 'green' | 'yellow' | 'red' = 'green';
      let recommendation = '';

      if (occupancyRatio >= 1.0) {
        status = 'High Traffic';
        alertLevel = 'red';
        const altGallery = dbStore.galleries.find(a => a.galleryId === g.recommendedAlternative);
        recommendation = `High crowd density! Consider visiting ${altGallery ? altGallery.name : 'Gallery D'} first to avoid delays.`;
      } else if (occupancyRatio >= 0.8) {
        status = 'High Traffic';
        alertLevel = 'yellow';
        recommendation = 'Approaching capacity. Please maintain flow.';
      } else if (occupancyRatio < 0.4) {
        status = 'Low';
        alertLevel = 'green';
        recommendation = 'Ideal time to explore masterpieces peacefully.';
      }

      return {
        ...g,
        occupancyRatio: Math.round(occupancyRatio * 100),
        status,
        alertLevel,
        recommendation
      };
    });

    res.json({
      success: true,
      data: galleriesWithCrowd
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getGalleryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const gallery = dbStore.galleries.find(
      g => g.galleryId.toLowerCase() === id.toLowerCase() || g.id.toLowerCase() === id.toLowerCase()
    );

    if (!gallery) {
      res.status(404).json({ success: false, message: 'Gallery not found' });
      return;
    }

    const exhibitsInGallery = dbStore.exhibits.filter(
      e => e.galleryId.toLowerCase() === gallery.galleryId.toLowerCase()
    );

    res.json({
      success: true,
      data: {
        ...gallery,
        exhibits: exhibitsInGallery
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateGalleryOccupancy = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { occupancy, capacity } = req.body;
    const gallery = dbStore.galleries.find(
      g => g.galleryId.toLowerCase() === id.toLowerCase() || g.id.toLowerCase() === id.toLowerCase()
    );

    if (!gallery) {
      res.status(404).json({ success: false, message: 'Gallery not found' });
      return;
    }

    if (occupancy !== undefined) gallery.currentOccupancy = Number(occupancy);
    if (capacity !== undefined) gallery.capacity = Number(capacity);

    res.json({ success: true, data: gallery });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
