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
    return this.userId ? { 'X-User-Id': this.userId } : {};
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
}

export const api = new ApiService();