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
  hero_html?: string;
  hero_css?: string;
  about_html?: string;
  about_css?: string;
  services_html?: string;
  services_css?: string;
  contacts_html?: string;
  contacts_css?: string;
  full_html?: string;
  full_css?: string;
}

export type TargetSection = 'hero' | 'about' | 'services' | 'contacts' | 'full';
export type TemplateType = 'library' | 'ai' | 'upload';