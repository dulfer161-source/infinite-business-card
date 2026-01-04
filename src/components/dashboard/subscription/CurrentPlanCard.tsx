import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { SubscriptionData } from './types';

interface CurrentPlanCardProps {
  subscription: SubscriptionData;
  onUpgrade: () => void;
}

const CurrentPlanCard = ({ subscription, onUpgrade }: CurrentPlanCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Icon name="CreditCard" size={20} />
              Текущая подписка
            </CardTitle>
            <CardDescription>Ваш активный тарифный план</CardDescription>
          </div>
          <Badge className="gradient-bg text-white">
            {subscription.plan}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Статус</span>
            <Badge variant="outline" className="border-green text-green">
              <Icon name="Check" size={12} className="mr-1" />
              Активна
            </Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Начало подписки</span>
            <span className="font-medium">
              {new Date(subscription.startDate).toLocaleDateString('ru-RU')}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Продление</span>
            <span className="font-medium">
              {subscription.endDate 
                ? new Date(subscription.endDate).toLocaleDateString('ru-RU')
                : 'Бессрочно'}
            </span>
          </div>
        </div>

        <Button onClick={onUpgrade} className="w-full gradient-bg text-white">
          <Icon name="Sparkles" className="mr-2" size={18} />
          Улучшить тариф
        </Button>
      </CardContent>
    </Card>
  );
};

export default CurrentPlanCard;
