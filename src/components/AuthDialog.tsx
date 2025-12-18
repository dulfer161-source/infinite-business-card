import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import PrivacyPolicy from './PrivacyPolicy';
import DemoAccountsDialog from './DemoAccountsDialog';

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

  // Check for referral code in URL
  useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode) {
      setRegisterData(prev => ({ ...prev, referralCode: refCode }));
    }
  });
  
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ email: '', password: '', name: '', referralCode: '' });

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
      const response = await fetch('https://functions.poehali.dev/74d0ac96-7cc9-4254-86f4-508ca9a70f55?redirect_uri=' + encodeURIComponent(window.location.origin + '/auth/vk'));
      const data = await response.json();
      if (data.auth_url) {
        window.location.href = data.auth_url;
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось подключиться к VK',
        variant: 'destructive',
      });
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
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="ivan@company.ru"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="login-password">Пароль</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gold text-black hover:bg-gold/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Icon name="Loader2" className="mr-2 animate-spin" size={18} />
                    Вход...
                  </>
                ) : (
                  'Войти'
                )}
              </Button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    или
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full border-[#0077FF] text-[#0077FF] hover:bg-[#0077FF] hover:text-white transition-colors"
                onClick={handleVKAuth}
              >
                <svg className="mr-2" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14c5.6 0 6.93-1.33 6.93-6.93V8.93C22 3.33 20.67 2 15.07 2zm3.45 14.22c-.63.47-1.29.7-1.97.7-.53 0-1.08-.14-1.65-.43-.97-.49-1.95-1.47-3.11-3.07-.54-.75-1.03-1.3-1.48-1.64-.41-.31-.78-.43-1.15-.38-.16.02-.37.14-.6.34l-.01 3.26c0 .45-.36.81-.81.81H6.67c-1.41 0-2.73-.53-3.82-1.53-1.3-1.19-2.47-2.99-3.48-5.35C-.99 6.81-.32 5.32.4 4.28c.41-.59 1.03-.91 1.74-.91h2.38c.74 0 1.36.54 1.47 1.27.22 1.45.68 2.78 1.38 3.95.18.3.4.43.67.43.09 0 .18-.01.27-.04.43-.14.66-.54.66-1.17V5.33c0-.6-.12-1.13-.37-1.58-.32-.58-.86-.9-1.53-.9h-.48c-.3 0-.55-.24-.55-.55 0-.3.25-.55.55-.55h.48c1.04 0 1.91.52 2.46 1.46.35.6.52 1.33.52 2.12v2.48c0 .97.43 1.54 1.17 1.54.25 0 .51-.07.79-.21.87-.43 1.63-1.45 2.52-3.4.59-1.29.94-2.43 1.05-3.39.08-.68.66-1.18 1.35-1.18h2.34c.17 0 .33.03.48.09.73.29 1.07 1.03.82 1.85-.44 1.43-1.14 2.77-2.09 3.97-.89 1.13-1.46 1.86-1.46 2.49 0 .43.2.83.65 1.32 1.39 1.51 2.3 2.59 2.77 3.29.49.73.62 1.39.38 1.96-.24.58-.77.92-1.46.92h-2.51c-.64 0-1.2-.31-1.58-.86-.38-.56-.94-1.36-1.69-2.41-.3-.42-.55-.68-.77-.81z"/>
                </svg>
                Войти через VK
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setDemoAccountsOpen(true)}
              >
                <Icon name="Users" className="mr-2" size={18} />
                Войти как тестовый пользователь
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <Label htmlFor="register-name">ФИО</Label>
                <Input
                  id="register-name"
                  placeholder="Иван Петров"
                  value={registerData.name}
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="ivan@company.ru"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="register-password">Пароль</Label>
                <Input
                  id="register-password"
                  type="password"
                  placeholder="••••••••"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="register-referral">Реферальный код (необязательно)</Label>
                <Input
                  id="register-referral"
                  placeholder="ABC12345"
                  value={registerData.referralCode}
                  onChange={(e) => setRegisterData({ ...registerData, referralCode: e.target.value.toUpperCase() })}
                  maxLength={8}
                />
              </div>
              
              <div className="flex items-start space-x-2 pt-2">
                <Checkbox 
                  id="privacy-policy" 
                  checked={agreedToPolicy}
                  onCheckedChange={(checked) => setAgreedToPolicy(checked as boolean)}
                />
                <label
                  htmlFor="privacy-policy"
                  className="text-sm leading-tight text-muted-foreground cursor-pointer"
                >
                  Я согласен с{' '}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setPrivacyOpen(true);
                    }}
                    className="text-gold hover:underline"
                  >
                    политикой обработки персональных данных
                  </button>
                  {' '}в соответствии с ФЗ-152
                </label>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-gold text-black hover:bg-gold/90"
                disabled={isLoading || !agreedToPolicy}
              >
                {isLoading ? (
                  <>
                    <Icon name="Loader2" className="mr-2 animate-spin" size={18} />
                    Регистрация...
                  </>
                ) : (
                  'Создать аккаунт'
                )}
              </Button>
            </form>
            
            <div className="mt-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Или войти через
                  </span>
                </div>
              </div>
              
              <Button
                type="button"
                variant="outline"
                className="w-full mt-4"
                onClick={handleVKAuth}
              >
                <Icon name="User" className="mr-2" size={18} />
                Войти через ВКонтакте
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
      
      <PrivacyPolicy open={privacyOpen} onOpenChange={setPrivacyOpen} />
      <DemoAccountsDialog 
        open={demoAccountsOpen}
        onOpenChange={setDemoAccountsOpen}
        onAccountSelect={handleDemoAccountSelect}
      />
    </Dialog>
  );
};

export default AuthDialog;