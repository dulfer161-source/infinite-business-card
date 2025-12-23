import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AuthTestsProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  results: any;
  setResults: (results: any) => void;
  toast: any;
}

const AuthTests = ({ loading, setLoading, results, setResults, toast }: AuthTestsProps) => {
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

  return (
    <>
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
    </>
  );
};

export default AuthTests;
