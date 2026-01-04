export interface SubscriptionData {
  plan: string;
  status: 'active' | 'expiring' | 'expired';
  startDate: string;
  endDate: string | null;
  features: {
    cards: { used: number; limit: number };
    views: { used: number; limit: number };
    storage: { used: number; limit: number };
  };
}

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  plan: string;
}

export interface SelectedPlan {
  name: string;
  price: number;
  period: 'monthly' | 'yearly';
}
