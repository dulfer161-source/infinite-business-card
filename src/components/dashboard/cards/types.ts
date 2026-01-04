export interface CardData {
  id: number;
  name: string;
  position?: string;
  company?: string;
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
  logo_url?: string;
  view_count: number;
  created_at: string;
}

export interface NewCardForm {
  name: string;
  position: string;
  company: string;
  phone: string;
  email: string;
  website: string;
  description: string;
  logo_url: string;
}
