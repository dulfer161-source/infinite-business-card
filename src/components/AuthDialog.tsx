import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const AuthDialog = ({ open, onOpenChange, onSuccess }: AuthDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
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
              <Button
                type="submit"
                className="w-full bg-gold text-black hover:bg-gold/90"
                disabled={isLoading}
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
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
