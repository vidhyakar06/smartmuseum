import { Router } from 'express';
import {
  getGalleries,
  getGalleryById,
  updateGalleryOccupancy
} from '../controllers/galleryController.js';

const router = Router();

router.get('/', getGalleries);
router.get('/:id', getGalleryById);
router.patch('/:id/occupancy', updateGalleryOccupancy);

export default router;
