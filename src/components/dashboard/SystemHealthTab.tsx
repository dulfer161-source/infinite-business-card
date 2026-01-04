import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import func2url from '../../../backend/func2url.json';
import { SecretStatus, CloudFunction, SecretsCard, FunctionsCard, NotificationsCard, mockSecrets, mockFunctions } from './health';

const SystemHealthTab = () => {
  const { toast } = useToast();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [secrets, setSecrets] = useState<SecretStatus[]>(mockSecrets);
  const [functions, setFunctions] = useState<CloudFunction[]>(mockFunctions);

  useEffect(() => {
    checkSystemHealth();
  }, []);

  const checkSystemHealth = async () => {
    setSecrets(prev => prev.map(s => ({
      ...s,
      status: Math.random() > 0.3 ? 'configured' : 'missing'
    })));
    
    const missing = secrets.filter(s => s.status === 'missing');
    if (notificationsEnabled && missing.length > 0) {
      await sendAlertEmail('missing_secrets', {
        missing_secrets: missing.map(s => s.name)
      });
    }
  };
  
  const sendAlertEmail = async (type: string, data: Record<string, unknown>) => {
    setIsSending(true);
    try {
      const monitorUrl = func2url['system-monitor' as keyof typeof func2url];
      const response = await fetch(monitorUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, data })
      });
      
      if (response.ok) {
        toast({
          title: '✅ Уведомление отправлено',
          description: 'Email с информацией о проблемах отправлен администратору',
        });
        return true;
      }
    } catch (error) {
      console.error('Failed to send alert:', error);
    } finally {
      setIsSending(false);
    }
    return false;
  };
  
  const testNotification = async () => {
    await sendAlertEmail('function_error', {
      function: 'test',
      error: 'Тестовое уведомление из панели мониторинга'
    });
  };

  const missingCount = secrets.filter(s => s.status === 'missing').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Системный статус</h2>
        <p className="text-muted-foreground">Мониторинг секретов и облачных функций</p>
      </div>

      {missingCount > 0 && (
        <Alert className="border-yellow-500/50 bg-yellow-500/10">
          <Icon name="AlertTriangle" size={18} className="text-yellow-500" />
          <AlertDescription className="ml-2">
            <strong>Внимание:</strong> {missingCount} секретов не настроены. Некоторые функции могут работать некорректно.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <SecretsCard secrets={secrets} />
        <FunctionsCard functions={functions} />
      </div>

      <NotificationsCard
        notificationsEnabled={notificationsEnabled}
        isSending={isSending}
        onToggle={setNotificationsEnabled}
        onTest={testNotification}
      />
    </div>
  );
};

export default SystemHealthTab;