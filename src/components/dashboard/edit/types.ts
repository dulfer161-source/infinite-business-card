export interface UserInfo {
  name: string;
  position: string;
  company: string;
  phone: string;
  email: string;
  website: string;
  description: string;
}

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
  custom_branding?: any;
  hide_platform_branding?: boolean;
}

export type TargetSection = 'hero' | 'about' | 'services' | 'contacts' | 'full';
export type TemplateType = 'library' | 'ai' | 'upload';
