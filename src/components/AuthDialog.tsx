import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import PrivacyPolicy from './PrivacyPolicy';
import DemoAccountsDialog from './DemoAccountsDialog';
import LoginForm from './auth/LoginForm';
import RegisterForm from './auth/RegisterForm';
import SocialAuthButtons from './auth/SocialAuthButtons';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const AuthDialog = ({ open, onOpenChange, onSuccess }: AuthDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);
  const [demoAccountsOpen, setDemoAccountsOpen] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ email: '', password: '', name: '', referralCode: '' });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode) {
      setRegisterData(prev => ({ ...prev, referralCode: refCode }));
    }
  }, []);

  const handleDemoAccountSelect = async (account: any) => {
    setLoginData({ email: account.email, password: account.password });
    setIsLoading(true);

    try {
      await api.login(account.email, account.password);
      toast({
        title: 'Вход выполнен',
        description: `Добро пожаловать, ${account.name}!`,
      });
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: 'Ошибка входа',
        description: 'Не удалось войти в демо-аккаунт',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.login(loginData.email, loginData.password);
      toast({
        title: 'Успешный вход',
        description: 'Добро пожаловать в личный кабинет!',
      });
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: 'Ошибка входа',
        description: error.message || 'Проверьте email и пароль',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreedToPolicy) {
      toast({
        title: 'Требуется согласие',
        description: 'Необходимо согласиться с политикой обработки персональных данных',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);

    try {
      await api.register(registerData.email, registerData.password, registerData.name, registerData.referralCode);
      toast({
        title: 'Регистрация успешна',
        description: 'Ваш аккаунт создан! Добро пожаловать!',
      });
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: 'Ошибка регистрации',
        description: error.message || 'Попробуйте другой email',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVKAuth = async () => {
    try {
      const redirectUri = window.location.origin + '/auth/vk';
      console.log('VK Auth: redirect_uri =', redirectUri);
      
      const response = await fetch('https://functions.poehali.dev/74d0ac96-7cc9-4254-86f4-508ca9a70f55?redirect_uri=' + encodeURIComponent(redirectUri));
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('VK Auth Error:', errorData);
        throw new Error(errorData.error || 'Ошибка подключения к VK');
      }
      
      const data = await response.json();
      console.log('VK Auth response:', data);
      
      if (data.auth_url) {
        console.log('Redirecting to VK:', data.auth_url);
        window.location.href = data.auth_url;
      } else {
        throw new Error('Не получен URL авторизации от VK');
      }
    } catch (error: any) {
      console.error('VK Auth error:', error);
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось подключиться к VK',
        variant: 'destructive',
      });
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const redirectUri = window.location.origin + '/auth/google';
      const response = await fetch(`https://functions.poehali.dev/2faff2e2-9012-406b-bd38-07f4be72099b?action=login&redirect_uri=${encodeURIComponent(redirectUri)}`);
      
      if (!response.ok) {
        throw new Error('Ошибка подключения к Google');
      }
      
      const data = await response.json();
      if (data.auth_url) {
        window.location.href = data.auth_url;
      }
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось подключиться к Google',
        variant: 'destructive',
      });
    }
  };

  const handleYandexAuth = async () => {
    try {
      const redirectUri = window.location.origin + '/auth/yandex';
      const response = await fetch(`https://functions.poehali.dev/6fc83860-fe65-4faa-9951-577ec8b00f94?action=login&redirect_uri=${encodeURIComponent(redirectUri)}`);
      
      if (!response.ok) {
        throw new Error('Ошибка подключения к Яндекс');
      }
      
      const data = await response.json();
      if (data.auth_url) {
        window.location.href = data.auth_url;
      }
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось подключиться к Яндекс',
        variant: 'destructive',
      });
    }
  };

  const handleTelegramAuth = (userData: any) => {
    fetch('https://functions.poehali.dev/1f1f10e9-7be0-4c16-91b6-f53673e8b2ea', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    })
    .then(res => res.json())
    .then(data => {
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        toast({
          title: 'Вход выполнен',
          description: `Добро пожаловать, ${data.user.name}!`,
        });
        onSuccess();
        onOpenChange(false);
        window.location.reload();
      }
    })
    .catch(error => {
      toast({
        title: 'Ошибка',
        description: 'Не удалось войти через Telegram',
        variant: 'destructive',
      });
    });
  };

  useEffect(() => {
    if (open && typeof window !== 'undefined' && (window as any).Telegram) {
      const container = document.getElementById('telegram-login-container');
      if (container && !container.hasChildNodes()) {
        const script = document.createElement('script');
        script.src = 'https://telegram.org/js/telegram-widget.js?22';
        script.setAttribute('data-telegram-login', 'YOUR_BOT_USERNAME');
        script.setAttribute('data-size', 'large');
        script.setAttribute('data-radius', '8');
        script.setAttribute('data-onauth', 'handleTelegramAuth(user)');
        script.setAttribute('data-request-access', 'write');
        script.async = true;
        container.appendChild(script);
        
        (window as any).handleTelegramAuth = handleTelegramAuth;
      }
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-gold">∞7</span>
            <span>visitka.site</span>
          </DialogTitle>
          <DialogDescription>
            Войдите или создайте аккаунт для управления визитками
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="login">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Вход</TabsTrigger>
            <TabsTrigger value="register">Регистрация</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <LoginForm
              loginData={loginData}
              setLoginData={setLoginData}
              onSubmit={handleLogin}
              isLoading={isLoading}
            />
            <SocialAuthButtons
              onVKAuth={handleVKAuth}
              onGoogleAuth={handleGoogleAuth}
              onYandexAuth={handleYandexAuth}
              onDemoAccountsOpen={() => setDemoAccountsOpen(true)}
            />
          </TabsContent>

          <TabsContent value="register">
            <RegisterForm
              registerData={registerData}
              setRegisterData={setRegisterData}
              onSubmit={handleRegister}
              isLoading={isLoading}
              agreedToPolicy={agreedToPolicy}
              setAgreedToPolicy={setAgreedToPolicy}
              onPrivacyOpen={() => setPrivacyOpen(true)}
            />
            <SocialAuthButtons
              onVKAuth={handleVKAuth}
              onGoogleAuth={handleGoogleAuth}
              onYandexAuth={handleYandexAuth}
              onDemoAccountsOpen={() => setDemoAccountsOpen(true)}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>

      <PrivacyPolicy open={privacyOpen} onOpenChange={setPrivacyOpen} />
      <DemoAccountsDialog 
        open={demoAccountsOpen} 
        onOpenChange={setDemoAccountsOpen}
        onSelectAccount={handleDemoAccountSelect}
      />
    </Dialog>
  );
};

export default AuthDialog;