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
  audioDuration?: number;
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
  createdAt?: string;
}

export interface Gallery {
  id: string;
  galleryId: string;
  name: string;
  description: string;
  floor: number;
  capacity: number;
  currentOccupancy: number;
  occupancyRatio?: number;
  status?: 'Low' | 'Normal' | 'High Traffic' | 'Crowded';
  alertLevel?: 'green' | 'yellow' | 'red';
  recommendation?: string;
  themeColor?: string;
  beaconId: string;
  coordinates: { x: number; y: number; width: number; height: number };
  recommendedAlternative?: string;
  exhibits?: Exhibit[];
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
  qrDataUrl?: string;
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

export interface DashboardData {
  summary: {
    totalVisitors: number;
    liveVisitors: number;
    qrScans: number;
    aiQuestions: number;
    audioPlays: number;
    mostPopularExhibit: string;
    crowdBottleneckAlert: {
      galleryId: string;
      name: string;
      message: string;
    } | null;
  };
  popularExhibits: Array<{
    exhibitId: string;
    title: string;
    artist: string;
    views: number;
  }>;
  hourlyTraffic: Array<{
    hour: string;
    visitors: number;
    aiChats: number;
    audioPlays: number;
  }>;
  languageDistribution: Array<{
    language: string;
    count: number;
    percentage: number;
  }>;
  galleryTraffic: Array<{
    galleryId: string;
    name: string;
    current: number;
    capacity: number;
    occupancyPercentage: number;
    isBottleneck: boolean;
  }>;
  recentEvents: AnalyticsEvent[];
}

export type SupportedLanguage = 'en' | 'ta' | 'hi' | 'ml' | 'te' | 'kn' | 'fr' | 'de' | 'es';
