const API_URLS = {
  auth: 'https://functions.poehali.dev/063b09be-f07e-478c-a626-807980d111e1',
  cards: 'https://functions.poehali.dev/1b1c5f28-bcb7-48d0-9437-b01ccc89239f',
  aiGenerate: 'https://functions.poehali.dev/72ff8548-9116-4284-8a41-2cb3d308cfc5',
  payments: 'https://functions.poehali.dev/9efe4a93-d56e-483d-a81b-8577be5f1d54',
};

export interface User {
  id: number;
  email: string;
  name: string;
}

export interface BusinessCard {
  id: number;
  user_id: number;
  name: string;
  position?: string;
  company?: string;
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
  logo_url?: string;
  qr_code_url?: string;
  view_count: number;
  created_at: string;
  updated_at: string;
}

class ApiService {
  private token: string | null = null;
  private userId: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
      this.userId = localStorage.getItem('user_id');
    }
  }

  private async fetchWithRetry(url: string, options: RequestInit, maxRetries = 3): Promise<Response> {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await fetch(url, options);
        
        if (response.status === 503 && attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
          continue;
        }
        
        return response;
      } catch (error) {
        lastError = error as Error;
        if (attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        }
      }
    }
    
    throw lastError || new Error('Failed to fetch after retries');
  }

  setAuth(token: string, userId: number) {
    this.token = token;
    this.userId = userId.toString();
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_id', userId.toString());
    }
  }

  clearAuth() {
    this.token = null;
    this.userId = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_id');
    }
  }

  getAuthHeaders() {
    return this.token ? { 'X-Auth-Token': this.token } : {};
  }

  async register(email: string, password: string, name: string, referralCode?: string): Promise<{ token: string; user: User }> {
    const response = await this.fetchWithRetry(API_URLS.auth, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'register', email, password, name, referral_code: referralCode || '' }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    const data = await response.json();
    this.setAuth(data.token, data.user.id);
    
    return data;
  }

  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const response = await this.fetchWithRetry(API_URLS.auth, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    const data = await response.json();
    this.setAuth(data.token, data.user.id);
    return data;
  }

  async getCards(): Promise<BusinessCard[]> {
    const response = await this.fetchWithRetry(API_URLS.cards, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch cards');
    }

    const data = await response.json();
    return data.cards || [];
  }

  async createCard(cardData: Partial<BusinessCard>): Promise<BusinessCard> {
    const response = await this.fetchWithRetry(API_URLS.cards, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(cardData),
    });

    if (!response.ok) {
      throw new Error('Failed to create card');
    }

    const data = await response.json();
    return data.card;
  }

  async updateCard(cardData: Partial<BusinessCard> & { id: number }): Promise<BusinessCard> {
    const response = await this.fetchWithRetry(API_URLS.cards, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(cardData),
    });

    if (!response.ok) {
      throw new Error('Failed to update card');
    }

    const data = await response.json();
    return data.card;
  }

  async generateImage(prompt: string): Promise<{ image_url: string; prompt: string }> {
    const response = await this.fetchWithRetry(API_URLS.aiGenerate, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate image');
    }

    return await response.json();
  }

  async createPayment(amount: number, paymentType: string, returnUrl?: string): Promise<{ payment: any; confirmation_url: string }> {
    const response = await this.fetchWithRetry(API_URLS.payments, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify({ amount, payment_type: paymentType, return_url: returnUrl }),
    });

    if (!response.ok) {
      throw new Error('Failed to create payment');
    }

    return await response.json();
  }

  isAuthenticated(): boolean {
    return !!this.token && !!this.userId;
  }

  getUserId(): number | null {
    return this.userId ? parseInt(this.userId, 10) : null;
  }

  // Templates
  async getCardTemplates(cardId: number) {
    const response = await this.fetchWithRetry(`${API_URLS.cards}/templates?card_id=${cardId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to get templates');
    }
    
    return await response.json();
  }

  async createCardTemplate(cardId: number, templateUrl: string, templateType: 'uploaded' | 'generated' = 'uploaded') {
    const response = await this.fetchWithRetry(`${API_URLS.cards}/templates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify({ card_id: cardId, template_url: templateUrl, template_type: templateType }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create template');
    }
    
    return await response.json();
  }

  // Ad Zones
  async getAdZones(cardId: number) {
    const response = await this.fetchWithRetry(`${API_URLS.cards}/ad-zones?card_id=${cardId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to get ad zones');
    }
    
    return await response.json();
  }

  async createAdZone(cardId: number, zoneName: string, zonePosition: 'header' | 'footer' | 'sidebar' | 'content') {
    const response = await this.fetchWithRetry(`${API_URLS.cards}/ad-zones`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify({ card_id: cardId, zone_name: zoneName, zone_position: zonePosition }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create ad zone');
    }
    
    return await response.json();
  }

  async createAdPlacement(adZoneId: number, advertiserName: string, advertiserEmail: string, adContent: string, adImageUrl: string, pricePerMonth: number) {
    const response = await this.fetchWithRetry(`${API_URLS.cards}/ad-placements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify({ 
        ad_zone_id: adZoneId, 
        advertiser_name: advertiserName, 
        advertiser_email: advertiserEmail, 
        ad_content: adContent, 
        ad_image_url: adImageUrl, 
        price_per_month: pricePerMonth 
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create ad placement');
    }
    
    return await response.json();
  }
}

export const api = new ApiService();