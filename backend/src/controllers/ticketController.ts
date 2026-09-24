import { Request, Response } from 'express';
import { dbStore } from '../config/db.js';
import { Ticket } from '../models/types.js';
import { generateQRCodeDataUrl } from '../services/qrService.js';

export const getTickets = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalRevenue = dbStore.tickets.reduce((acc, t) => acc + (t.status === 'Completed' ? t.amount : 0), 0);
    const completedCount = dbStore.tickets.filter(t => t.status === 'Completed').length;
    const pendingCount = dbStore.tickets.filter(t => t.status === 'Pending').length;

    res.json({
      success: true,
      summary: {
        totalRevenue: Number(totalRevenue.toFixed(2)),
        totalTickets: dbStore.tickets.length,
        completedCount,
        pendingCount
      },
      data: dbStore.tickets
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    const { visitorName, visitorEmail, ticketType = 'Standard', amount = 200.00 } = req.body;

    if (!visitorName) {
      res.status(400).json({ success: false, message: 'Visitor name is required' });
      return;
    }

    const ticketId = `TCK-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTicket: Ticket = {
      id: `TCK-${Date.now()}`,
      ticketId,
      visitorName,
      visitorEmail,
      ticketType,
      amount: Number(amount),
      status: 'Completed',
      date: new Date().toISOString().slice(0, 10),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: new Date().toISOString()
    };

    dbStore.tickets.unshift(newTicket);

    const qrDataUrl = await generateQRCodeDataUrl(`MUSEUM_TICKET:${ticketId}:${visitorName}`);

    res.status(201).json({
      success: true,
      data: {
        ...newTicket,
        qrDataUrl
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
