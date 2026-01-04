import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/icon';

interface RegisterFormProps {
  registerData: { email: string; password: string; name: string; referralCode: string };
  setRegisterData: (data: { email: string; password: string; name: string; referralCode: string }) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  agreedToPolicy: boolean;
  setAgreedToPolicy: (agreed: boolean) => void;
  onPrivacyOpen: () => void;
}

export default function RegisterForm({ 
  registerData, 
  setRegisterData, 
  onSubmit, 
  isLoading, 
  agreedToPolicy, 
  setAgreedToPolicy,
  onPrivacyOpen 
}: RegisterFormProps) {
  const handleNameInvalid = (e: React.InvalidEvent<HTMLInputElement>) => {
    e.target.setCustomValidity('Пожалуйста, введите ваше имя');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.setCustomValidity('');
    setRegisterData({ ...registerData, name: e.target.value });
  };

  const handleEmailInvalid = (e: React.InvalidEvent<HTMLInputElement>) => {
    e.target.setCustomValidity('Пожалуйста, введите корректный email');
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.setCustomValidity('');
    setRegisterData({ ...registerData, email: e.target.value });
  };

  const handlePasswordInvalid = (e: React.InvalidEvent<HTMLInputElement>) => {
    if (e.target.validity.valueMissing) {
      e.target.setCustomValidity('Пожалуйста, введите пароль');
    } else if (e.target.validity.tooShort) {
      e.target.setCustomValidity('Пароль должен содержать минимум 6 символов');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.setCustomValidity('');
    setRegisterData({ ...registerData, password: e.target.value });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="register-name">Имя</Label>
        <Input
          id="register-name"
          type="text"
          placeholder="Иван Петров"
          value={registerData.name}
          onChange={handleNameChange}
          onInvalid={handleNameInvalid}
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
          onChange={handleEmailChange}
          onInvalid={handleEmailInvalid}
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
          onChange={handlePasswordChange}
          onInvalid={handlePasswordInvalid}
          required
          minLength={6}
        />
      </div>
      <div>
        <Label htmlFor="referral-code">Реферальный код (необязательно)</Label>
        <Input
          id="referral-code"
          type="text"
          placeholder="ABC12345"
          value={registerData.referralCode}
          onChange={(e) => setRegisterData({ ...registerData, referralCode: e.target.value })}
        />
      </div>
      <div className="flex items-start space-x-2">
        <Checkbox 
          id="privacy-policy" 
          checked={agreedToPolicy}
          onCheckedChange={(checked) => setAgreedToPolicy(checked as boolean)}
        />
        <label htmlFor="privacy-policy" className="text-sm leading-none">
          Согласен с{' '}
          <button 
            type="button"
            onClick={onPrivacyOpen}
            className="text-indigo-600 hover:text-indigo-700 underline"
          >
            политикой обработки персональных данных
          </button>
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
  );
}