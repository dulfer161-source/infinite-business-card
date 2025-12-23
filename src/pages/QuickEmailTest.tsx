import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const QuickEmailTest = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [testType, setTestType] = useState<'reset' | 'notification' | null>(null);

  // Тест восстановления пароля
  const testPasswordReset = async () => {
    if (!email) {
      toast({
        title: '⚠️ Введите email',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setTestType('reset');
    
    try {
      const response = await fetch('https://functions.poehali.dev/af64e807-c8f1-475d-b790-dd5179abb17c', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'request',
          email: email,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: '✅ Письмо отправлено!',
          description: `Проверьте почту ${email}. Код восстановления должен прийти в течение минуты.`,
          duration: 10000,
        });
      } else {
        toast({
          title: '❌ Ошибка отправки',
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
      setTestType(null);
    }
  };

  // Тест email уведомления
  const testEmailNotification = async () => {
    if (!email) {
      toast({
        title: '⚠️ Введите email',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setTestType('notification');
    
    try {
      const response = await fetch('https://functions.poehali.dev/74c49dcb-78dd-46f7-9f32-46f1dffa39be', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email,
          subject: '🧪 Тестовое письмо от Бесконечных визиток',
          message: 'Если вы получили это письмо, значит SMTP настроен правильно! ✅',
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: '✅ Уведомление отправлено!',
          description: `Проверьте почту ${email}. Письмо должно прийти в течение минуты.`,
          duration: 10000,
        });
      } else {
        toast({
          title: '❌ Ошибка отправки',
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
      setTestType(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-2xl">📧 Быстрый тест Email</CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Проверка работы SMTP после обновления пароля
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="email">Ваш email</Label>
            <Input
              id="email"
              type="email"
              placeholder="test@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2"
            />
          </div>

          <div className="space-y-3">
            <Button
              onClick={testPasswordReset}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {loading && testType === 'reset' ? '⏳ Отправка...' : '🔑 Тест восстановления пароля'}
            </Button>

            <Button
              onClick={testEmailNotification}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {loading && testType === 'notification' ? '⏳ Отправка...' : '✉️ Тест уведомления'}
            </Button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
            <p className="font-semibold text-blue-800 mb-2">💡 Как проверить:</p>
            <ol className="list-decimal list-inside space-y-1 text-blue-700">
              <li>Введите ваш email</li>
              <li>Нажмите любую кнопку</li>
              <li>Проверьте папку "Входящие"</li>
              <li>Если письма нет - проверьте "Спам"</li>
            </ol>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-xs space-y-2">
            <p className="font-semibold text-green-800">✅ Что должно работать:</p>
            <ul className="list-disc list-inside space-y-1 text-green-700">
              <li><strong>Тест 1:</strong> Письмо с 6-значным кодом</li>
              <li><strong>Тест 2:</strong> Простое текстовое уведомление</li>
              <li><strong>SMTP:</strong> smtp.mail.ru:465 (SSL)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickEmailTest;
