import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import PrivacyPolicy from './PrivacyPolicy';
import DemoAccountsDialog from './DemoAccountsDialog';
import LoginForm from './auth/LoginForm';
import RegisterForm from './auth/RegisterForm';

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