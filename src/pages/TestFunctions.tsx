import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const TestFunctions = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>({});
  
  // Тест 1: Проверка всех секретов
  const testSecrets = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/2676ce6b-3746-4d35-be91-a469ea700d28');
      const data = await response.json();
      setResults({ ...results, secrets: data });
      toast({
        title: '✅ Секреты проверены',
        description: `Настроено: ${data.summary.configured}/${data.summary.total}`,
      });
    } catch (error: any) {
      toast({
        title: '❌ Ошибка',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Тест 2: Регистрация
  const [regEmail, setRegEmail] = useState('test@example.com');
  const [regPassword, setRegPassword] = useState('Test123!');
  const [regName, setRegName] = useState('Тестовый Пользователь');
  
  const testRegister = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/063b09be-f07e-478c-a626-807980d111e1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          email: regEmail,
          password: regPassword,
          name: regName,
        }),
      });
      const data = await response.json();
      setResults({ ...results, register: data });
      
      if (response.ok) {
        toast({
          title: '✅ Регистрация успешна',
          description: `Email: ${data.user?.email}`,
        });
      } else {
        toast({
          title: '⚠️ Ошибка регистрации',
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

  // Тест 3: Вход
  const testLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/063b09be-f07e-478c-a626-807980d111e1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          email: regEmail,
          password: regPassword,
        }),
      });
      const data = await response.json();
      setResults({ ...results, login: data });
      
      if (response.ok) {
        toast({
          title: '✅ Вход выполнен',
          description: `Token: ${data.token?.substring(0, 20)}...`,
        });
        localStorage.setItem('auth_token', data.token);
      } else {
        toast({
          title: '⚠️ Ошибка входа',
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

  // Тест 4: Получение карточек
  const testGetCards = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('https://functions.poehali.dev/1b1c5f28-bcb7-48d0-9437-b01ccc89239f', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token || '',
        },
      });
      const data = await response.json();
      setResults({ ...results, cards: data });
      
      if (response.ok) {
        toast({
          title: '✅ Карточки загружены',
          description: `Найдено: ${data.cards?.length || 0} карточек`,
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

  // Тест 5: VK OAuth URL
  const testVKAuth = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/74d0ac96-7cc9-4254-86f4-508ca9a70f55?action=get_auth_url', {
        method: 'GET',
      });
      const data = await response.json();
      setResults({ ...results, vk: data });
      
      if (response.ok && data.auth_url) {
        toast({
          title: '✅ VK OAuth готов',
          description: 'URL для авторизации получен',
        });
        // Открываем в новой вкладке для теста
        window.open(data.auth_url, '_blank');
      } else {
        toast({
          title: '⚠️ Ошибка VK',
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

  // Тест 8: Отправка email уведомления
  const [notifEmail, setNotifEmail] = useState('test@example.com');
  const [notifSubject, setNotifSubject] = useState('Тестовое уведомление');
  const [notifMessage, setNotifMessage] = useState('Это тестовое письмо от системы визиток');
  
  const testEmailNotification = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/74c49dcb-78dd-46f7-9f32-46f1dffa39be', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: notifEmail,
          subject: notifSubject,
          message: notifMessage,
        }),
      });
      const data = await response.json();
      setResults({ ...results, emailNotif: data });
      
      if (response.ok) {
        toast({
          title: '✅ Email отправлен',
          description: `Письмо отправлено на ${notifEmail}`,
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

  // Тест 9: Создание платежа ЮКасса
  const [paymentAmount, setPaymentAmount] = useState('100');
  const [paymentEmail, setPaymentEmail] = useState('test@example.com');
  
  const testCreatePayment = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/5bc46a0f-1084-4325-9a7b-460cfa14c2a8?action=create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(paymentAmount),
          description: 'Тестовый платёж',
          email: paymentEmail,
          return_url: window.location.origin + '/test-functions',
        }),
      });
      const data = await response.json();
      setResults({ ...results, payment: data });
      
      if (response.ok && data.confirmation_url) {
        toast({
          title: '✅ Платёж создан',
          description: 'Ссылка на оплату получена',
        });
        // Открываем окно оплаты
        if (window.confirm('Открыть страницу оплаты ЮКасса?')) {
          window.open(data.confirmation_url, '_blank');
        }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold mb-2">🧪 Тестирование функций</h1>
          <p className="text-gray-600">Проверка всех backend сервисов</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Тест 1: Секреты */}
          <Card>
            <CardHeader>
              <CardTitle>1️⃣ Проверка секретов</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Проверяет наличие всех необходимых переменных окружения
              </p>
              <Button onClick={testSecrets} disabled={loading} className="w-full">
                Проверить секреты
              </Button>
              {results.secrets && (
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40">
                  {JSON.stringify(results.secrets, null, 2)}
                </pre>
              )}
            </CardContent>
          </Card>

          {/* Тест 2: Регистрация */}
          <Card>
            <CardHeader>
              <CardTitle>2️⃣ Регистрация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Email</Label>
                <Input value={regEmail} onChange={(e) => setRegEmail(e.target.value)} />
              </div>
              <div>
                <Label>Пароль</Label>
                <Input type="password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} />
              </div>
              <div>
                <Label>Имя</Label>
                <Input value={regName} onChange={(e) => setRegName(e.target.value)} />
              </div>
              <Button onClick={testRegister} disabled={loading} className="w-full">
                Зарегистрироваться
              </Button>
              {results.register && (
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40">
                  {JSON.stringify(results.register, null, 2)}
                </pre>
              )}
            </CardContent>
          </Card>

          {/* Тест 3: Вход */}
          <Card>
            <CardHeader>
              <CardTitle>3️⃣ Вход в систему</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Использует данные из формы регистрации
              </p>
              <Button onClick={testLogin} disabled={loading} className="w-full">
                Войти
              </Button>
              {results.login && (
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40">
                  {JSON.stringify(results.login, null, 2)}
                </pre>
              )}
            </CardContent>
          </Card>

          {/* Тест 4: Карточки */}
          <Card>
            <CardHeader>
              <CardTitle>4️⃣ Получение карточек</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Требует авторизации (сначала выполните вход)
              </p>
              <Button onClick={testGetCards} disabled={loading} className="w-full">
                Загрузить карточки
              </Button>
              {results.cards && (
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40">
                  {JSON.stringify(results.cards, null, 2)}
                </pre>
              )}
            </CardContent>
          </Card>

          {/* Тест 5: VK OAuth */}
          <Card>
            <CardHeader>
              <CardTitle>5️⃣ VK авторизация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Откроет окно авторизации ВКонтакте
              </p>
              <Button onClick={testVKAuth} disabled={loading} className="w-full" variant="outline">
                Войти через VK
              </Button>
              {results.vk && (
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40">
                  {JSON.stringify(results.vk, null, 2)}
                </pre>
              )}
            </CardContent>
          </Card>

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

          {/* Тест 8: Email уведомления */}
          <Card>
            <CardHeader>
              <CardTitle>8️⃣ Email уведомления</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Email получателя</Label>
                <Input value={notifEmail} onChange={(e) => setNotifEmail(e.target.value)} />
              </div>
              <div>
                <Label>Тема письма</Label>
                <Input value={notifSubject} onChange={(e) => setNotifSubject(e.target.value)} />
              </div>
              <div>
                <Label>Сообщение</Label>
                <Input value={notifMessage} onChange={(e) => setNotifMessage(e.target.value)} />
              </div>
              <Button onClick={testEmailNotification} disabled={loading} className="w-full">
                Отправить письмо
              </Button>
              {results.emailNotif && (
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40">
                  {JSON.stringify(results.emailNotif, null, 2)}
                </pre>
              )}
            </CardContent>
          </Card>

          {/* Тест 9: ЮКасса платежи */}
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle>9️⃣ Создание платежа ЮКасса</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Сумма платежа (₽)</Label>
                <Input 
                  type="number" 
                  value={paymentAmount} 
                  onChange={(e) => setPaymentAmount(e.target.value)} 
                  placeholder="100"
                />
              </div>
              <div>
                <Label>Email для чека</Label>
                <Input value={paymentEmail} onChange={(e) => setPaymentEmail(e.target.value)} />
              </div>
              <p className="text-sm text-gray-600">
                Создаст реальный платёж в ЮКассе. Откроется окно оплаты.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-xs">
                <p className="font-semibold text-green-800 mb-1">⚠️ Важно:</p>
                <ul className="list-disc list-inside space-y-1 text-green-700">
                  <li>Нужны секреты YOOKASSA_SHOP_ID и YOOKASSA_SECRET_KEY</li>
                  <li>Это тестовый режим - используйте тестовые карты ЮКассы</li>
                  <li>Тестовая карта: 5555 5555 5555 4444, срок 12/24, CVV 123</li>
                </ul>
              </div>
              <Button onClick={testCreatePayment} disabled={loading} className="w-full bg-green-600 hover:bg-green-700">
                💳 Создать платёж
              </Button>
              {results.payment && (
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40">
                  {JSON.stringify(results.payment, null, 2)}
                </pre>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Общие результаты */}
        <Card>
          <CardHeader>
            <CardTitle>📊 Все результаты</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-96">
              {JSON.stringify(results, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestFunctions;