import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Referral {
  id: number;
  email: string;
  created_at: string;
}

interface ReferralStats {
  referral_code: string;
  referral_count: number;
  referrals: Referral[];
}

const ReferralTab = () => {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const authToken = localStorage.getItem('auth_token');
      const response = await fetch('https://functions.poehali.dev/23b645b0-210f-48d9-8e8f-2fe667959c5a', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': authToken || ''
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      toast.error('Не удалось загрузить статистику');
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    if (!stats?.referral_code) return;
    const link = `${window.location.origin}/?ref=${stats.referral_code}`;
    navigator.clipboard.writeText(link);
    toast.success('Реферальная ссылка скопирована!');
  };

  const copyReferralCode = () => {
    if (!stats?.referral_code) return;
    navigator.clipboard.writeText(stats.referral_code);
    toast.success('Реферальный код скопирован!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
          <p className="text-muted-foreground">Загрузка статистики...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <Card className="border-destructive/50">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Icon name="AlertCircle" size={64} className="text-destructive/40 mb-4" />
          <h3 className="text-xl font-bold mb-2">Ошибка загрузки</h3>
          <p className="text-muted-foreground mb-6">Не удалось загрузить реферальную статистику</p>
          <Button onClick={loadStats} variant="outline">
            <Icon name="RefreshCw" size={18} className="mr-2" />
            Попробовать снова
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Реферальная программа</h2>
        <p className="text-muted-foreground">Приглашайте друзей и получайте бонусы</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Referral Code Card */}
        <Card className="border-gold/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Gift" size={24} className="text-gold" />
              Ваш реферальный код
            </CardTitle>
            <CardDescription>Поделитесь этим кодом с друзьями</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={stats.referral_code}
                readOnly
                className="text-xl font-bold text-center tracking-wider"
              />
              <Button onClick={copyReferralCode} variant="outline" size="icon">
                <Icon name="Copy" size={18} />
              </Button>
            </div>
            <Button
              onClick={copyReferralLink}
              className="w-full bg-gold text-black hover:bg-gold/90"
            >
              <Icon name="Link" size={18} className="mr-2" />
              Скопировать реферальную ссылку
            </Button>
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card className="border-gold/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Users" size={24} className="text-gold" />
              Статистика приглашений
            </CardTitle>
            <CardDescription>Количество зарегистрированных по вашей ссылке</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-5xl font-bold text-gold mb-2">{stats.referral_count}</div>
              <p className="text-muted-foreground">
                {stats.referral_count === 1 ? 'приглашённый' : 'приглашённых'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referrals List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="UserCheck" size={24} />
            Ваши рефералы
          </CardTitle>
          <CardDescription>
            Список пользователей, зарегистрированных по вашей ссылке
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stats.referrals.length === 0 ? (
            <div className="text-center py-8">
              <Icon name="UserX" size={48} className="mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-muted-foreground">Пока никто не зарегистрировался по вашей ссылке</p>
              <p className="text-sm text-muted-foreground mt-2">
                Поделитесь реферальной ссылкой, чтобы пригласить друзей
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.referrals.map((referral, index) => (
                <div
                  key={referral.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:border-gold/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center border-2 border-gold/20">
                      <span className="text-sm font-bold text-gold">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{referral.email}</p>
                      <p className="text-xs text-muted-foreground">
                        Зарегистрирован: {new Date(referral.created_at).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                  </div>
                  <Icon name="CheckCircle" size={20} className="text-green-500" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* How it works */}
      <Card className="bg-gradient-to-br from-gold/5 to-gold/10 border-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Info" size={24} className="text-gold" />
            Как это работает?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gold text-black flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <p className="font-medium">Поделитесь ссылкой</p>
              <p className="text-sm text-muted-foreground">
                Скопируйте реферальную ссылку и отправьте друзьям
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gold text-black flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <p className="font-medium">Друзья регистрируются</p>
              <p className="text-sm text-muted-foreground">
                При регистрации они автоматически становятся вашими рефералами
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gold text-black flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <p className="font-medium">Получайте бонусы</p>
              <p className="text-sm text-muted-foreground">
                За каждого приглашённого друга вы получаете награды
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferralTab;
