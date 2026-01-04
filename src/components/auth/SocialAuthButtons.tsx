import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface SocialAuthButtonsProps {
  onVKAuth: () => void;
  onDemoAccountsOpen: () => void;
  onTelegramAuth: (userData: any) => void;
}

export default function SocialAuthButtons({ 
  onVKAuth,
  onDemoAccountsOpen,
  onTelegramAuth
}: SocialAuthButtonsProps) {
  useEffect(() => {
    // Создаём глобальный callback ПЕРЕД загрузкой скрипта
    (window as any).onTelegramAuthCallback = (user: any) => {
      console.log('Telegram auth callback:', user);
      onTelegramAuth(user);
    };

    const container = document.getElementById('telegram-login-container');
    if (container && !container.hasChildNodes()) {
      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-widget.js?22';
      script.setAttribute('data-telegram-login', 'Visitka_sitebot');
      script.setAttribute('data-size', 'large');
      script.setAttribute('data-radius', '8');
      script.setAttribute('data-onauth', 'onTelegramAuthCallback(user)');
      script.setAttribute('data-request-access', 'write');
      script.async = true;
      container.appendChild(script);
    }

    return () => {
      // Очищаем глобальный callback при размонтировании
      delete (window as any).onTelegramAuthCallback;
    };
  }, [onTelegramAuth]);

  return (
    <>
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">или войдите через</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onVKAuth}
          className="w-full"
        >
          <Icon name="Mail" className="mr-2" size={18} />
          VK ID
        </Button>

        <div id="telegram-login-container" className="flex justify-center w-full"></div>
      </div>

      <div className="mt-4 text-center">
        <Button
          type="button"
          variant="link"
          onClick={onDemoAccountsOpen}
          className="text-xs text-gray-600 hover:text-gray-800"
        >
          <Icon name="Users" className="mr-1" size={14} />
          Демо-аккаунты для тестирования
        </Button>
      </div>
    </>
  );
}