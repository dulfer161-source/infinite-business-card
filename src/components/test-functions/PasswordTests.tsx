import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PasswordTestsProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  results: any;
  setResults: (results: any) => void;
  toast: any;
}

const PasswordTests = ({ loading, setLoading, results, setResults, toast }: PasswordTestsProps) => {
  // Тест 6: Восстановление пароля - запрос
  const [resetEmail, setResetEmail] = useState('test@example.com');
  
  const testPasswordReset = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/af64e807-c8f1-475d-b790-dd5179abb17c', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'request',
          email: resetEmail,
        }),
      });
      const data = await response.json();
      setResults({ ...results, passwordReset: data });
      
      if (response.ok) {
        toast({
          title: '✅ Письмо отправлено',
          description: `Код восстановления отправлен на ${resetEmail}`,
        });
      } else {
        toast({
          title: '⚠️ Ошибка',
          description: data.error || 'Неизвестная ошибка',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: '❌ Ошибка сети',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Тест 7: Проверка кода восстановления
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('NewPass123!');
  
  const testPasswordVerify = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/af64e807-c8f1-475d-b790-dd5179abb17c', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify',
          email: resetEmail,
          code: resetCode,
          new_password: newPassword,
        }),
      });
      const data = await response.json();
      setResults({ ...results, passwordVerify: data });
      
      if (response.ok) {
        toast({
          title: '✅ Пароль изменён',
          description: 'Новый пароль успешно установлен',
        });
      } else {
        toast({
          title: '⚠️ Ошибка',
          description: data.error || 'Неизвестная ошибка',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: '❌ Ошибка сети',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Тест 6: Восстановление пароля - запрос */}
      <Card>
        <CardHeader>
          <CardTitle>6️⃣ Восстановление пароля</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} />
          </div>
          <p className="text-sm text-gray-600">
            Отправит код восстановления на указанный email
          </p>
          <Button onClick={testPasswordReset} disabled={loading} className="w-full">
            Отправить код
          </Button>
          {results.passwordReset && (
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40">
              {JSON.stringify(results.passwordReset, null, 2)}
            </pre>
          )}
        </CardContent>
      </Card>

      {/* Тест 7: Проверка кода восстановления */}
      <Card>
        <CardHeader>
          <CardTitle>7️⃣ Смена пароля по коду</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Код из email</Label>
            <Input value={resetCode} onChange={(e) => setResetCode(e.target.value)} placeholder="123456" />
          </div>
          <div>
            <Label>Новый пароль</Label>
            <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          <p className="text-sm text-gray-600">
            Сначала получите код через тест 6
          </p>
          <Button onClick={testPasswordVerify} disabled={loading} className="w-full">
            Сменить пароль
          </Button>
          {results.passwordVerify && (
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40">
              {JSON.stringify(results.passwordVerify, null, 2)}
            </pre>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default PasswordTests;
