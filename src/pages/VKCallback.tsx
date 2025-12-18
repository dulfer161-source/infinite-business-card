import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import Icon from '@/components/ui/icon';

const VKCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const code = searchParams.get('code');
    const errorParam = searchParams.get('error');
    
    if (errorParam) {
      setError('Вы отменили авторизацию через VK');
      setIsProcessing(false);
      setTimeout(() => navigate('/'), 3000);
      return;
    }

    if (!code) {
      setError('Код авторизации не получен от VK');
      setIsProcessing(false);
      setTimeout(() => navigate('/'), 3000);
      return;
    }

    const handleCallback = async () => {
      try {
        const redirectUri = window.location.origin + '/auth/vk';
        console.log('VK Callback: code =', code, 'redirect_uri =', redirectUri);
        
        const response = await fetch(
          'https://functions.poehali.dev/74d0ac96-7cc9-4254-86f4-508ca9a70f55',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              code,
              redirect_uri: redirectUri
            })
          }
        );

        console.log('VK Callback response status:', response.status);

        if (!response.ok) {
          const errorData = await response.json();
          console.error('VK Callback error data:', errorData);
          throw new Error(errorData.error || 'Ошибка авторизации');
        }

        const data = await response.json();
        console.log('VK Callback data:', data);

        if (data.error) {
          console.error('VK Callback error in response:', data.error);
          throw new Error(data.error);
        }

        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user_id', data.user.id.toString());
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Синхронизация с ApiService
        api.setAuth(data.token, data.user.id);

        // Показываем разные сообщения для новых и существующих пользователей
        if (data.is_new_user) {
          toast({
            title: '🎉 Добро пожаловать!',
            description: `Мы создали для вас визитку: visitka.site/${data.card_slug}`,
          });
        } else {
          toast({
            title: 'С возвращением!',
            description: `Рады видеть вас снова, ${data.user.name}!`,
          });
        }

        // Перенаправляем на визитку если есть slug
        setTimeout(() => {
          if (data.card_slug) {
            navigate(`/${data.card_slug}`);
          } else {
            navigate('/');
          }
          window.location.reload();
        }, 1500);

      } catch (err: any) {
        console.error('VK auth error:', err);
        setError(err.message || 'Не удалось войти через VK');
        setIsProcessing(false);
        
        toast({
          title: 'Ошибка авторизации',
          description: err.message || 'Не удалось войти через VK',
          variant: 'destructive',
        });

        setTimeout(() => navigate('/'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate, toast]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="bg-destructive/10 border border-destructive/50 p-8 rounded-lg max-w-md w-full mx-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-destructive/20 p-3 rounded-full">
              <Icon name="AlertCircle" size={24} className="text-destructive" />
            </div>
            <h2 className="text-xl font-bold text-destructive">Ошибка авторизации</h2>
          </div>
          <p className="text-muted-foreground mb-4">{error}</p>
          <p className="text-sm text-muted-foreground">
            Перенаправление на главную через 3 секунды...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md w-full mx-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#0077FF]/10 mb-6">
          <Icon name="Loader2" size={32} className="animate-spin text-[#0077FF]" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Авторизация через VK</h2>
        <p className="text-muted-foreground mb-4">
          {isProcessing ? 'Проверяем данные...' : 'Готово!'}
        </p>
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#0077FF] animate-pulse"></div>
          <div className="w-2 h-2 rounded-full bg-[#0077FF] animate-pulse delay-75"></div>
          <div className="w-2 h-2 rounded-full bg-[#0077FF] animate-pulse delay-150"></div>
        </div>
      </div>
    </div>
  );
};

export default VKCallback;