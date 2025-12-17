import * as React from 'react';
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { initMetrika } from './lib/metrika'
import { notificationService } from './lib/notifications'

initMetrika();

// Инициализация уведомлений
notificationService.init().catch(err => {
  console.warn('Notifications init failed:', err);
});

// Регистрация Service Worker для PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('Service Worker зарегистрирован:', registration.scope);
        
        // Проверяем обновления каждую минуту
        setInterval(() => {
          registration.update();
        }, 60000);
        
        // Обработка обновления Service Worker
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Новая версия доступна, перезагружаем страницу
                console.log('Найдена новая версия, обновляем...');
                window.location.reload();
              }
            });
          }
        });
      })
      .catch((error) => {
        console.error('Ошибка регистрации Service Worker:', error);
      });
  });
}

createRoot(document.getElementById("root")!).render(<App />);