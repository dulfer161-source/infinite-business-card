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
  
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ email: '', password: '', name: '' });

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
      await api.register(registerData.email, registerData.password, registerData.name);
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
    </Dialog>
  );
};

export default AuthDialog;