import { Exhibit, Gallery, DashboardData, Ticket, SupportedLanguage } from '../types/index.js';

const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

// Generate or retrieve persistent visitor session id
export function getVisitorSessionId(): string {
  let sessionId = localStorage.getItem('smart_museum_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    localStorage.setItem('smart_museum_session_id', sessionId);
  }
  return sessionId;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const sessionId = getVisitorSessionId();
  const token = localStorage.getItem('smart_museum_admin_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-session-id': sessionId,
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}));
    throw new Error(errBody.message || `API error ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  // Exhibits
  async getExhibits(params?: { category?: string; galleryId?: string; search?: string; highlight?: boolean }): Promise<{ success: boolean; data: Exhibit[] }> {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.galleryId) query.append('galleryId', params.galleryId);
    if (params?.search) query.append('search', params.search);
    if (params?.highlight) query.append('highlight', 'true');

    return request<{ success: boolean; data: Exhibit[] }>(`/exhibits?${query.toString()}`);
  },

  async getExhibit(id: string): Promise<{ success: boolean; data: Exhibit }> {
    return request<{ success: boolean; data: Exhibit }>(`/exhibits/${id}`);
  },

  async getExhibitQR(id: string): Promise<{ success: boolean; targetUrl: string; qrDataUrl: string; title: string }> {
    return request<{ success: boolean; targetUrl: string; qrDataUrl: string; title: string }>(`/exhibits/${id}/qr`);
  },

  async createExhibit(data: Partial<Exhibit>): Promise<{ success: boolean; data: Exhibit }> {
    return request<{ success: boolean; data: Exhibit }>('/exhibits', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async updateExhibit(id: string, data: Partial<Exhibit>): Promise<{ success: boolean; data: Exhibit }> {
    return request<{ success: boolean; data: Exhibit }>(`/exhibits/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  async deleteExhibit(id: string): Promise<{ success: boolean; data: Exhibit }> {
    return request<{ success: boolean; data: Exhibit }>(`/exhibits/${id}`, {
      method: 'DELETE'
    });
  },

  // Galleries
  async getGalleries(): Promise<{ success: boolean; data: Gallery[] }> {
    return request<{ success: boolean; data: Gallery[] }>('/galleries');
  },

  async getGallery(id: string): Promise<{ success: boolean; data: Gallery }> {
    return request<{ success: boolean; data: Gallery }>(`/galleries/${id}`);
  },

  async updateGalleryOccupancy(id: string, occupancy: number): Promise<{ success: boolean; data: Gallery }> {
    return request<{ success: boolean; data: Gallery }>(`/galleries/${id}/occupancy`, {
      method: 'PATCH',
      body: JSON.stringify({ occupancy })
    });
  },

  // AI Conversational Guide
  async chatAI(payload: {
    message: string;
    exhibitId?: string;
    language?: SupportedLanguage;
    history?: Array<{ sender: 'user' | 'assistant'; text: string }>;
  }): Promise<{ success: boolean; data: { answer: string; relatedExhibits: any[]; source: string } }> {
    return request<{ success: boolean; data: { answer: string; relatedExhibits: any[]; source: string } }>('/ai/chat', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  // Analytics
  async track(eventType: string, exhibitId?: string, galleryId?: string, metadata?: Record<string, any>): Promise<void> {
    try {
      await request('/analytics/event', {
        method: 'POST',
        body: JSON.stringify({ eventType, exhibitId, galleryId, metadata })
      });
    } catch {
      // Background analytics fail quietly
    }
  },

  async getDashboard(): Promise<{ success: boolean; data: DashboardData }> {
    return request<{ success: boolean; data: DashboardData }>('/analytics/dashboard');
  },

  // Tickets
  async getTickets(): Promise<{ success: boolean; summary: any; data: Ticket[] }> {
    return request<{ success: boolean; summary: any; data: Ticket[] }>('/tickets');
  },

  async getTicket(id: string): Promise<{ success: boolean; data: Ticket & { qrDataUrl?: string; ticketUrl?: string; valid?: boolean } }> {
    return request<{ success: boolean; data: Ticket & { qrDataUrl?: string; ticketUrl?: string; valid?: boolean } }>(`/tickets/${id}`);
  },

  async validateTicket(id: string): Promise<{ success: boolean; data: Ticket; valid: boolean; message: string }> {
    return request<{ success: boolean; data: Ticket; valid: boolean; message: string }>(`/tickets/${id}/validate`, {
      method: 'POST'
    });
  },

  async createTicket(payload: { visitorName: string; visitorEmail?: string; ticketType: string; amount: number }): Promise<{ success: boolean; data: Ticket & { qrDataUrl?: string; ticketUrl?: string } }> {
    return request<{ success: boolean; data: Ticket & { qrDataUrl?: string; ticketUrl?: string } }>('/tickets', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  // Admin Auth
  async loginAdmin(credentials: { email: string; password: string }): Promise<{ success: boolean; token: string; user: any }> {
    return request<{ success: boolean; token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }
};
