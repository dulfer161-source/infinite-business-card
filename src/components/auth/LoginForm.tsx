import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface LoginFormProps {
  loginData: { email: string; password: string };
  setLoginData: (data: { email: string; password: string }) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export default function LoginForm({ loginData, setLoginData, onSubmit, isLoading }: LoginFormProps) {
  const handleEmailInvalid = (e: React.InvalidEvent<HTMLInputElement>) => {
    e.target.setCustomValidity('Пожалуйста, введите корректный email');
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.setCustomValidity('');
    setLoginData({ ...loginData, email: e.target.value });
  };

  const handlePasswordInvalid = (e: React.InvalidEvent<HTMLInputElement>) => {
    e.target.setCustomValidity('Пожалуйста, введите пароль');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.setCustomValidity('');
    setLoginData({ ...loginData, password: e.target.value });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="login-email">Email</Label>
        <Input
          id="login-email"
          type="email"
          placeholder="ivan@company.ru"
          value={loginData.email}
          onChange={handleEmailChange}
          onInvalid={handleEmailInvalid}
          required
        />
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label htmlFor="login-password">Пароль</Label>
          <a href="/forgot-password" className="text-xs text-indigo-600 hover:text-indigo-700">
            Забыли пароль?
          </a>
        </div>
        <Input
          id="login-password"
          type="password"
          placeholder="••••••••"
          value={loginData.password}
          onChange={handlePasswordChange}
          onInvalid={handlePasswordInvalid}
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
  );
}