import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

const ProfileSettings = () => {
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [emailData, setEmailData] = useState({
    newEmail: '',
    password: ''
  });

  const handleChangePassword = () => {
    if (!passwordData.current || !passwordData.new || !passwordData.confirm) {
      toast.error('Заполните все поля');
      return;
    }
    if (passwordData.new !== passwordData.confirm) {
      toast.error('Пароли не совпадают');
      return;
    }
    if (passwordData.new.length < 8) {
      toast.error('Пароль должен содержать минимум 8 символов');
      return;
    }
    toast.success('Пароль успешно изменён');
    setPasswordData({ current: '', new: '', confirm: '' });
  };

  const handleChangeEmail = () => {
    if (!emailData.newEmail || !emailData.password) {
      toast.error('Заполните все поля');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailData.newEmail)) {
      toast.error('Некорректный email');
      return;
    }
    toast.success('Email успешно изменён');
    setEmailData({ newEmail: '', password: '' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="User" size={20} />
          Настройки аккаунта
        </CardTitle>
        <CardDescription>
          Управление учётной записью и безопасностью
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-4">Изменить пароль</h4>
            <div className="space-y-3">
              <div>
                <Label htmlFor="current-password">Текущий пароль</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={passwordData.current}
                  onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                  placeholder="Введите текущий пароль"
                />
              </div>
              <div>
                <Label htmlFor="new-password">Новый пароль</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={passwordData.new}
                  onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                  placeholder="Минимум 8 символов"
                />
              </div>
              <div>
                <Label htmlFor="confirm-password">Подтвердите пароль</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={passwordData.confirm}
                  onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                  placeholder="Повторите новый пароль"
                />
              </div>
              <Button onClick={handleChangePassword} className="w-full">
                <Icon name="Key" className="mr-2" size={18} />
                Сменить пароль
              </Button>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-semibold mb-4">Изменить email</h4>
            <div className="space-y-3">
              <div>
                <Label htmlFor="new-email">Новый email</Label>
                <Input
                  id="new-email"
                  type="email"
                  value={emailData.newEmail}
                  onChange={(e) => setEmailData({ ...emailData, newEmail: e.target.value })}
                  placeholder="new@example.com"
                />
              </div>
              <div>
                <Label htmlFor="confirm-email-password">Подтвердите паролем</Label>
                <Input
                  id="confirm-email-password"
                  type="password"
                  value={emailData.password}
                  onChange={(e) => setEmailData({ ...emailData, password: e.target.value })}
                  placeholder="Введите текущий пароль"
                />
              </div>
              <Button onClick={handleChangeEmail} className="w-full">
                <Icon name="Mail" className="mr-2" size={18} />
                Изменить email
              </Button>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-semibold mb-2">Двухфакторная аутентификация</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Дополнительная защита вашего аккаунта
            </p>
            <Button variant="outline" className="w-full">
              <Icon name="Shield" className="mr-2" size={18} />
              Настроить 2FA
            </Button>
          </div>
        </div>

        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mt-6">
          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
            <Icon name="AlertTriangle" size={16} className="text-red-500" />
            Опасная зона
          </h4>
          <p className="text-xs text-muted-foreground mb-3">
            Необратимые действия с вашим аккаунтом
          </p>
          <Button variant="destructive" size="sm">
            <Icon name="Trash2" className="mr-2" size={14} />
            Удалить аккаунт
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSettings;
