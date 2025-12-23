import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { notificationService } from '@/lib/notifications';
import { toast } from 'sonner';

const NotificationSettings = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [settings, setSettings] = useState({
    newLeads: true,
    newViews: false,
    payments: true,
    weeklyReports: true,
    subscriptionAlerts: true
  });

  useEffect(() => {
    checkPermission();
    loadSettings();
  }, []);

  const checkPermission = async () => {
    const enabled = await notificationService.init();
    setIsEnabled(enabled);
    setPermission(Notification.permission);
  };

  const loadSettings = () => {
    const saved = localStorage.getItem('notification_settings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load notification settings:', e);
      }
    }
  };

  const saveSettings = (newSettings: typeof settings) => {
    setSettings(newSettings);
    localStorage.setItem('notification_settings', JSON.stringify(newSettings));
  };

  const handleEnableNotifications = async () => {
    const granted = await notificationService.requestPermission();
    
    if (granted) {
      setIsEnabled(true);
      setPermission('granted');
      toast.success('Уведомления включены');
      
      // Показать тестовое уведомление
      await notificationService.show({
        title: '✅ Уведомления включены',
        body: 'Теперь вы будете получать важные обновления'
      });
    } else {
      toast.error('Доступ к уведомлениям запрещён');
    }
  };

  const handleDisableNotifications = () => {
    notificationService.disable();
    setIsEnabled(false);
    toast.info('Уведомления отключены');
  };

  const handleTestNotification = async () => {
    await notificationService.show({
      title: '🔔 Тестовое уведомление',
      body: 'Всё работает отлично!',
      requireInteraction: false
    });
    toast.success('Уведомление отправлено');
  };

  const notificationTypes = [
    {
      key: 'newLeads' as const,
      title: 'Новые лиды',
      description: 'Когда кто-то оставляет контакты через вашу визитку',
      icon: 'Users',
      color: 'text-green'
    },
    {
      key: 'newViews' as const,
      title: 'Просмотры визитки',
      description: 'При достижении новых вех просмотров (10, 50, 100+)',
      icon: 'Eye',
      color: 'text-blue'
    },
    {
      key: 'payments' as const,
      title: 'Платежи',
      description: 'Успешная оплата и активация подписки',
      icon: 'CreditCard',
      color: 'text-purple-500'
    },

    {
      key: 'weeklyReports' as const,
      title: 'Еженедельные отчёты',
      description: 'Сводка по активности каждую неделю',
      icon: 'BarChart3',
      color: 'text-blue'
    },
    {
      key: 'subscriptionAlerts' as const,
      title: 'Уведомления о подписке',
      description: 'Напоминания об окончании подписки',
      icon: 'Bell',
      color: 'text-red-500'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Bell" size={20} />
              Push-уведомления
            </CardTitle>
            <CardDescription>
              Получайте важные обновления в реальном времени
            </CardDescription>
          </div>
          {permission === 'granted' && (
            <Badge variant="outline" className="border-green text-green">
              <Icon name="Check" size={12} className="mr-1" />
              Включено
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {permission === 'denied' && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Icon name="AlertCircle" size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-sm mb-1">Уведомления заблокированы</p>
                <p className="text-xs text-muted-foreground mb-3">
                  Вы запретили доступ к уведомлениям. Чтобы включить их, измените настройки браузера.
                </p>
                <details className="text-xs text-muted-foreground">
                  <summary className="cursor-pointer hover:text-foreground">
                    Как разрешить уведомления?
                  </summary>
                  <ul className="mt-2 space-y-1 ml-4">
                    <li>1. Откройте настройки браузера</li>
                    <li>2. Найдите раздел "Уведомления" или "Разрешения"</li>
                    <li>3. Найдите visitka.site в списке сайтов</li>
                    <li>4. Измените разрешение на "Разрешить"</li>
                  </ul>
                </details>
              </div>
            </div>
          </div>
        )}

        {permission === 'default' && (
          <div className="bg-gradient-to-br from-blue/10 to-green/10 border border-blue/20 rounded-lg p-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue to-green flex items-center justify-center mx-auto">
                <Icon name="Bell" size={32} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Включите уведомления</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Не пропускайте важные события: новые лиды, просмотры визитки и платежи
                </p>
              </div>
              <Button 
                onClick={handleEnableNotifications}
                className="gradient-bg text-white"
              >
                <Icon name="Bell" className="mr-2" size={18} />
                Включить уведомления
              </Button>
            </div>
          </div>
        )}

        {permission === 'granted' && (
          <>
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Icon name="BellRing" size={20} className="text-green" />
                <div>
                  <p className="font-medium text-sm">Уведомления активны</p>
                  <p className="text-xs text-muted-foreground">
                    Вы будете получать важные обновления
                  </p>
                </div>
              </div>
              <Switch
                checked={isEnabled}
                onCheckedChange={(checked) => {
                  if (checked) {
                    handleEnableNotifications();
                  } else {
                    handleDisableNotifications();
                  }
                }}
              />
            </div>

            {isEnabled && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm">Типы уведомлений</h4>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleTestNotification}
                  >
                    <Icon name="Play" className="mr-2" size={14} />
                    Тест
                  </Button>
                </div>

                <div className="space-y-3">
                  {notificationTypes.map((type) => (
                    <div 
                      key={type.key}
                      className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/30 transition-colors"
                    >
                      <div className={`w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 ${type.color}`}>
                        <Icon name={type.icon as any} size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm mb-1">{type.title}</p>
                        <p className="text-xs text-muted-foreground">{type.description}</p>
                      </div>
                      <Switch
                        checked={settings[type.key]}
                        onCheckedChange={(checked) => {
                          saveSettings({ ...settings, [type.key]: checked });
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-blue/5 border border-blue/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Icon name="Info" size={16} className="text-blue flex-shrink-0 mt-0.5" />
                <div className="text-xs text-muted-foreground">
                  <strong>Важно:</strong> Уведомления работают, даже когда вы не на сайте. 
                  Вы можете отключить отдельные типы уведомлений, которые вам не нужны.
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;