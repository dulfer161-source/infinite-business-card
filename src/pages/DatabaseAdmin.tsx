import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';

const DatabaseAdmin = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);

  const clearSQL = `-- ВНИМАНИЕ: Удалит ВСЕ данные!
DELETE FROM t_p18253922_infinite_business_ca.auth_tokens;
DELETE FROM t_p18253922_infinite_business_ca.business_cards;
DELETE FROM t_p18253922_infinite_business_ca.card_leads;
DELETE FROM t_p18253922_infinite_business_ca.card_views;
DELETE FROM t_p18253922_infinite_business_ca.media_assets;
DELETE FROM t_p18253922_infinite_business_ca.password_reset_tokens;
DELETE FROM t_p18253922_infinite_business_ca.payments;
DELETE FROM t_p18253922_infinite_business_ca.quiz_answers;
DELETE FROM t_p18253922_infinite_business_ca.quiz_sessions;
DELETE FROM t_p18253922_infinite_business_ca.referrals;
DELETE FROM t_p18253922_infinite_business_ca.user_subscriptions;
DELETE FROM t_p18253922_infinite_business_ca.users;

ALTER SEQUENCE t_p18253922_infinite_business_ca.users_id_seq RESTART WITH 1;
ALTER SEQUENCE t_p18253922_infinite_business_ca.business_cards_id_seq RESTART WITH 1;
ALTER SEQUENCE t_p18253922_infinite_business_ca.auth_tokens_id_seq RESTART WITH 1;`;

  const getStats = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/a937916c-264f-43b2-931a-f8f4f6bb2177');
      const data = await response.json();
      setStats(data);
      toast({
        title: '✅ Статистика загружена',
        description: `Всего пользователей: ${data.stats?.users || 0}`,
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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(clearSQL);
    toast({
      title: '✅ Скопировано',
      description: 'SQL скрипт скопирован в буфер обмена',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold mb-2">🗄️ Администрирование БД</h1>
          <p className="text-gray-600">Управление тестовыми данными</p>
        </div>

        {/* Статистика */}
        <Card>
          <CardHeader>
            <CardTitle>📊 Текущая статистика базы данных</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={getStats} disabled={loading} className="w-full">
              Загрузить статистику
            </Button>
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-blue-600">{stats.stats?.users || 0}</div>
                  <div className="text-sm text-gray-600">Пользователей</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-green-600">{stats.stats?.cards || 0}</div>
                  <div className="text-sm text-gray-600">Визиток</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-purple-600">{stats.stats?.tokens || 0}</div>
                  <div className="text-sm text-gray-600">Токенов</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-yellow-600">{stats.stats?.subscriptions || 0}</div>
                  <div className="text-sm text-gray-600">Подписок</div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-red-600">{stats.stats?.payments || 0}</div>
                  <div className="text-sm text-gray-600">Платежей</div>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-indigo-600">{stats.stats?.views || 0}</div>
                  <div className="text-sm text-gray-600">Просмотров</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* SQL скрипт очистки */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">⚠️ Очистка базы данных</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-bold text-red-800 mb-2">ВНИМАНИЕ!</h3>
              <p className="text-sm text-red-700">
                Этот скрипт удалит ВСЕ данные из базы данных, включая:
              </p>
              <ul className="list-disc list-inside text-sm text-red-700 mt-2 space-y-1">
                <li>Всех пользователей</li>
                <li>Все визитки</li>
                <li>Все токены авторизации</li>
                <li>Всю историю платежей</li>
                <li>Все просмотры и аналитику</li>
              </ul>
              <p className="text-sm text-red-700 mt-2 font-semibold">
                Используйте только для тестирования!
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">SQL скрипт для выполнения:</label>
              <Textarea
                value={clearSQL}
                readOnly
                className="font-mono text-xs h-64"
              />
            </div>

            <div className="space-y-2">
              <Button onClick={copyToClipboard} variant="outline" className="w-full">
                📋 Скопировать SQL скрипт
              </Button>
              <div className="bg-gray-50 p-4 rounded-lg text-sm">
                <p className="font-semibold mb-2">Как использовать:</p>
                <ol className="list-decimal list-inside space-y-1 text-gray-700">
                  <li>Нажмите кнопку "Скопировать SQL скрипт"</li>
                  <li>Откройте интерфейс управления базой данных</li>
                  <li>Вставьте скрипт в SQL редактор</li>
                  <li>Выполните запрос</li>
                  <li>База данных будет очищена</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Результаты */}
        {stats && (
          <Card>
            <CardHeader>
              <CardTitle>📄 Полные данные</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-96">
                {JSON.stringify(stats, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DatabaseAdmin;
