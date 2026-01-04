import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { SubscriptionData } from './types';

interface UsageStatsCardProps {
  subscription: SubscriptionData;
}

const UsageStatsCard = ({ subscription }: UsageStatsCardProps) => {
  const viewsPercent = (subscription.features.views.used / subscription.features.views.limit) * 100;
  const cardsPercent = (subscription.features.cards.used / subscription.features.cards.limit) * 100;
  const storagePercent = (subscription.features.storage.used / subscription.features.storage.limit) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="TrendingUp" size={20} />
          Использование ресурсов
        </CardTitle>
        <CardDescription>Лимиты текущего тарифа</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Визитки</span>
            <span className="font-medium">
              {subscription.features.cards.used} / {subscription.features.cards.limit}
            </span>
          </div>
          <Progress value={cardsPercent} />
        </div>

        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Просмотры (месяц)</span>
            <span className="font-medium">
              {subscription.features.views.used} / {subscription.features.views.limit}
            </span>
          </div>
          <Progress value={viewsPercent} />
        </div>

        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Хранилище</span>
            <span className="font-medium">
              {subscription.features.storage.used} МБ / {subscription.features.storage.limit} МБ
            </span>
          </div>
          <Progress value={storagePercent} />
        </div>

        {viewsPercent > 70 && (
          <div className="bg-orange/10 border border-orange/20 rounded-lg p-3 mt-4">
            <div className="flex items-start gap-2">
              <Icon name="AlertCircle" size={16} className="text-orange flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">
                Вы использовали {viewsPercent.toFixed(0)}% лимита просмотров. 
                Улучшите тариф для неограниченных просмотров.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UsageStatsCard;
