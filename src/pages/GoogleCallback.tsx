import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import PageLoader from '@/components/PageLoader';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [error, setError] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const errorParam = urlParams.get('error');

      if (errorParam) {
        setError('Авторизация отменена');
        setTimeout(() => navigate('/'), 3000);
        return;
      }

      if (!code) {
        setError('Не получен код авторизации');
        setTimeout(() => navigate('/'), 3000);
        return;
      }

      try {
        const redirectUri = window.location.origin + '/auth/google';
        const response = await fetch(
          `https://functions.poehali.dev/2faff2e2-9012-406b-bd38-07f4be72099b?action=callback&code=${encodeURIComponent(code)}&redirect_uri=${encodeURIComponent(redirectUri)}`
        );

        if (!response.ok) {
          throw new Error('Ошибка авторизации');
        }

        const data = await response.json();

        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          
          toast({
            title: 'Вход выполнен',
            description: `Добро пожаловать, ${data.user.name}!`,
          });

          navigate('/');
          window.location.reload();
        } else {
          throw new Error('Не получен токен');
        }
      } catch (error: any) {
        console.error('Google callback error:', error);
        setError(error.message || 'Ошибка авторизации');
        setTimeout(() => navigate('/'), 3000);
      }
    };

    handleCallback();
  }, [navigate, toast]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Ошибка</h1>
          <p className="text-muted-foreground">{error}</p>
          <p className="text-sm text-muted-foreground mt-2">Перенаправление на главную...</p>
        </div>
      </div>
    );
  }

  return <PageLoader />;
};

export default GoogleCallback;
