export interface SecretStatus {
  name: string;
  description: string;
  status: 'configured' | 'missing' | 'checking';
  category: 'auth' | 'payment' | 'email' | 'storage';
}

export interface CloudFunction {
  name: string;
  status: 'healthy' | 'error' | 'checking';
  requests: number;
}

export const categoryIcons = {
  auth: 'ShieldCheck',
  payment: 'CreditCard',
  email: 'Mail',
  storage: 'Database'
} as const;

export const categoryLabels = {
  auth: 'Авторизация',
  payment: 'Платежи',
  email: 'Email',
  storage: 'Хранилище'
} as const;
