import { Router } from 'express';
import { getTickets, getTicketById, validateTicket, createTicket } from '../controllers/ticketController.js';

const router = Router();

router.get('/', getTickets);
router.post('/', createTicket);
router.get('/:id', getTicketById);
router.post('/:id/validate', validateTicket);

export default router;
