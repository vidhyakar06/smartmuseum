export interface Exhibit {
  id: string;
  exhibitId: string;
  title: string;
  artist: string;
  year: number | string;
  category: string;
  description: string;
  longDescription?: string;
  images: string[];
  audioUrl?: string;
  audioDuration?: number; // seconds
  galleryId: string;
  location: string;
  coordinates: { x: number; y: number; floor?: number };
  highlight?: boolean;
  featured?: boolean;
  translations?: Record<string, {
    title: string;
    description: string;
    category?: string;
    artistBio?: string;
  }>;
  curatorNotes?: string;
  medium?: string;
  dimensions?: string;
  createdAt: string;
}

export interface Gallery {
  id: string;
  galleryId: string;
  name: string;
  description: string;
  floor: number;
  capacity: number;
  currentOccupancy: number;
  themeColor?: string;
  beaconId: string;
  coordinates: { x: number; y: number; width: number; height: number };
  recommendedAlternative?: string;
}

export interface Visitor {
  id: string;
  sessionId: string;
  language: string;
  currentLocation: string; // e.g. "Gallery A"
  currentBeaconId?: string;
  startedAt: string;
  lastActiveAt: string;
  favorites: string[]; // exhibitIds
  visitedExhibits: string[];
  deviceInfo?: string;
}

export interface AnalyticsEvent {
  id: string;
  sessionId: string;
  eventType: 'visit' | 'exhibit-view' | 'ai-question' | 'audio' | 'qr-scan' | 'navigation' | 'language-change';
  exhibitId?: string;
  galleryId?: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface Ticket {
  id: string;
  ticketId: string;
  visitorName: string;
  visitorEmail?: string;
  ticketType: 'Standard' | 'Student' | 'Senior' | 'VIP' | 'Family';
  amount: number;
  status: 'Completed' | 'Pending' | 'Cancelled';
  date: string;
  time: string;
  createdAt: string;
}

export interface AIConversation {
  id: string;
  sessionId: string;
  exhibitId?: string;
  messages: Array<{
    sender: 'user' | 'assistant';
    text: string;
    timestamp: string;
    language?: string;
  }>;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'curator' | 'staff';
  createdAt: string;
}
