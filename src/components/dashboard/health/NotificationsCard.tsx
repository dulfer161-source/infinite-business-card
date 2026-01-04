import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface NotificationsCardProps {
  notificationsEnabled: boolean;
  isSending: boolean;
  onToggle: (enabled: boolean) => void;
  onTest: () => void;
}

const NotificationsCard = ({ notificationsEnabled, isSending, onToggle, onTest }: NotificationsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="Bell" size={20} />
          Уведомления о проблемах
        </CardTitle>
        <CardDescription>
          Автоматическая отправка email при обнаружении ошибок
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div className="space-y-1">
            <p className="font-medium">Email-уведомления</p>
            <p className="text-xs text-muted-foreground">
              {notificationsEnabled 
                ? 'Администратор получит письмо при сбое функций' 
                : 'Уведомления отключены'}
            </p>
          </div>
          <Button
            variant={notificationsEnabled ? 'default' : 'outline'}
            onClick={() => onToggle(!notificationsEnabled)}
            className={notificationsEnabled ? 'bg-green' : ''}
          >
            <Icon name={notificationsEnabled ? 'Check' : 'X'} size={16} className="mr-2" />
            {notificationsEnabled ? 'Включено' : 'Выключено'}
          </Button>
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={onTest}
          disabled={isSending}
        >
          {isSending ? (
            <>
              <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
              Отправка...
            </>
          ) : (
            <>
              <Icon name="Send" size={16} className="mr-2" />
              Отправить тестовое уведомление
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default NotificationsCard;
