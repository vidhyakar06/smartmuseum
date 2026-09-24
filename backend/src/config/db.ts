import mongoose from 'mongoose';
import { seedGalleries, seedExhibits, seedVisitors, seedAnalytics, seedTickets } from '../data/seedData.js';
import { Exhibit, Gallery, Visitor, AnalyticsEvent, Ticket } from '../models/types.js';

// In-Memory Database Store
class DatabaseStore {
  public galleries: Gallery[] = JSON.parse(JSON.stringify(seedGalleries));
  public exhibits: Exhibit[] = JSON.parse(JSON.stringify(seedExhibits));
  public visitors: Visitor[] = JSON.parse(JSON.stringify(seedVisitors));
  public analytics: AnalyticsEvent[] = JSON.parse(JSON.stringify(seedAnalytics));
  public tickets: Ticket[] = JSON.parse(JSON.stringify(seedTickets));
  public isConnectedToMongo: boolean = false;

  public reset() {
    this.galleries = JSON.parse(JSON.stringify(seedGalleries));
    this.exhibits = JSON.parse(JSON.stringify(seedExhibits));
    this.visitors = JSON.parse(JSON.stringify(seedVisitors));
    this.analytics = JSON.parse(JSON.stringify(seedAnalytics));
    this.tickets = JSON.parse(JSON.stringify(seedTickets));
  }
}

export const dbStore = new DatabaseStore();

export async function connectDB(): Promise<void> {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri || process.env.DEMO_MODE === 'true') {
    console.log('🏛️  [Database] Operating in Standalone In-Memory Museum Store (Demo Mode)');
    dbStore.isConnectedToMongo = false;
    return;
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    dbStore.isConnectedToMongo = true;
    console.log('✅ [Database] Successfully connected to MongoDB Atlas');
  } catch (err: any) {
    console.warn('⚠️  [Database] Could not connect to MongoDB Atlas (' + (err.message || err) + '). Seamlessly falling back to In-Memory Museum Store.');
    dbStore.isConnectedToMongo = false;
  }
}
