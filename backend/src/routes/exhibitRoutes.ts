import { Router } from 'express';
import {
  getExhibits,
  getExhibitById,
  getExhibitQR,
  createExhibit,
  updateExhibit,
  deleteExhibit
} from '../controllers/exhibitController.js';

const router = Router();

router.get('/', getExhibits);
router.get('/:id', getExhibitById);
router.get('/:id/qr', getExhibitQR);
router.post('/', createExhibit);
router.put('/:id', updateExhibit);
router.delete('/:id', deleteExhibit);

export default router;
