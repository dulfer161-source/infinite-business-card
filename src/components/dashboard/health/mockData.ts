import { SecretStatus, CloudFunction } from './types';

export const mockSecrets: SecretStatus[] = [
  { name: 'VK_APP_ID', description: 'VK авторизация', status: 'checking', category: 'auth' },
  { name: 'VK_SECRET_KEY', description: 'VK защищённый ключ', status: 'checking', category: 'auth' },
  { name: 'YOOKASSA_SHOP_ID', description: 'ЮKassa магазин', status: 'checking', category: 'payment' },
  { name: 'YOOKASSA_SECRET_KEY', description: 'ЮKassa ключ', status: 'checking', category: 'payment' },
  { name: 'SMTP_HOST', description: 'SMTP сервер', status: 'checking', category: 'email' },
  { name: 'SMTP_PORT', description: 'SMTP порт', status: 'checking', category: 'email' },
  { name: 'SMTP_USER', description: 'SMTP логин', status: 'checking', category: 'email' },
  { name: 'SMTP_PASSWORD', description: 'SMTP пароль', status: 'checking', category: 'email' },
  { name: 'SMTP_FROM_EMAIL', description: 'Email отправителя', status: 'checking', category: 'email' },
  { name: 'AWS_ACCESS_KEY_ID', description: 'S3 доступ', status: 'checking', category: 'storage' },
  { name: 'AWS_SECRET_ACCESS_KEY', description: 'S3 ключ', status: 'checking', category: 'storage' },
];

export const mockFunctions: CloudFunction[] = [
  { name: 'auth', status: 'healthy', requests: 0 },
  { name: 'vk-auth', status: 'healthy', requests: 0 },
  { name: 'payment', status: 'healthy', requests: 0 },
  { name: 'email-notifications', status: 'healthy', requests: 0 },
  { name: 'cards', status: 'healthy', requests: 0 },
  { name: 'short-urls', status: 'healthy', requests: 0 },
  { name: 'qr-generator', status: 'healthy', requests: 0 },
  { name: 'analytics', status: 'healthy', requests: 0 },
];