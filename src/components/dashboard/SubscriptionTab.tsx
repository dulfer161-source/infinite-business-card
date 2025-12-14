import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import PricingPlans from '../PricingPlans';
import PricingComparison from '../PricingComparison';
import PaymentModal from '../PaymentModal';

const SubscriptionTab = () => {
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState({ name: '', price: 0, period: 'monthly' as 'monthly' | 'yearly' });
  const [currentPlan] = useState('free');

  const subscription = {
    plan: 'Базовый',
    status: 'active',
    startDate: '2024-12-01',
    endDate: null,
    features: {
      cards: { used: 1, limit: 1 },
      views: { used: 47, limit: 100 },
      storage: { used: 2.3, limit: 100 }
    }
  };

  const handleSelectPlan = (planId: string) => {
    const plans: Record<string, { name: string; price: number }> = {
      pro: { name: 'Профессиональный', price: 490 },
      business: { name: 'Бизнес', price: 1490 }
    };

    if (plans[planId]) {
      setSelectedPlan({ ...plans[planId], period: 'monthly' });
      setShowPayment(true);
    }
  };

  const invoices = [
    { id: '1', date: '2024-11-01', amount: 490, status: 'paid', plan: 'Профессиональный' },
    { id: '2', date: '2024-10-01', amount: 490, status: 'paid', plan: 'Профессиональный' },
    { id: '3', date: '2024-09-01', amount: 490, status: 'paid', plan: 'Профессиональный' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
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
                <span className="font-medium">Бессрочно</span>
              </div>
            </div>

            <Button className="w-full gradient-bg text-white">
              <Icon name="Sparkles" className="mr-2" size={18} />
              Улучшить тариф
            </Button>
          </CardContent>
        </Card>

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
              <Progress 
                value={(subscription.features.cards.used / subscription.features.cards.limit) * 100} 
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Просмотры (месяц)</span>
                <span className="font-medium">
                  {subscription.features.views.used} / {subscription.features.views.limit}
                </span>
              </div>
              <Progress 
                value={(subscription.features.views.used / subscription.features.views.limit) * 100} 
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Хранилище</span>
                <span className="font-medium">
                  {subscription.features.storage.used} МБ / {subscription.features.storage.limit} МБ
                </span>
              </div>
              <Progress 
                value={(subscription.features.storage.used / subscription.features.storage.limit) * 100} 
              />
            </div>

            <div className="bg-orange/10 border border-orange/20 rounded-lg p-3 mt-4">
              <div className="flex items-start gap-2">
                <Icon name="AlertCircle" size={16} className="text-orange flex-shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  Вы использовали {subscription.features.views.used}% лимита просмотров. 
                  Улучшите тариф для неограниченных просмотров.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="plans" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="plans">
            <Icon name="Package" className="mr-2" size={16} />
            Тарифы
          </TabsTrigger>
          <TabsTrigger value="comparison">
            <Icon name="Table" className="mr-2" size={16} />
            Сравнение
          </TabsTrigger>
          <TabsTrigger value="history">
            <Icon name="Receipt" className="mr-2" size={16} />
            История платежей
          </TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="mt-6">
          <PricingPlans currentPlan={currentPlan} onSelectPlan={handleSelectPlan} />
        </TabsContent>

        <TabsContent value="comparison" className="mt-6">
          <PricingComparison onSelectPlan={handleSelectPlan} />
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Receipt" size={20} />
                История платежей
              </CardTitle>
              <CardDescription>
                Все ваши транзакции и чеки
              </CardDescription>
            </CardHeader>
            <CardContent>
              {invoices.length === 0 ? (
                <div className="text-center py-12">
                  <Icon name="Receipt" size={48} className="mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground mb-4">У вас пока нет платежей</p>
                  <Button variant="outline">
                    <Icon name="CreditCard" className="mr-2" size={16} />
                    Выбрать тариф
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {invoices.map((invoice) => (
                    <div 
                      key={invoice.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-green/10 flex items-center justify-center">
                          <Icon name="Check" size={20} className="text-green" />
                        </div>
                        <div>
                          <p className="font-medium">{invoice.plan}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(invoice.date).toLocaleDateString('ru-RU', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold">{invoice.amount} ₽</span>
                        <Button variant="ghost" size="sm">
                          <Icon name="Download" size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Gift" size={20} />
              Реферальная программа
            </CardTitle>
            <CardDescription>
              Приглашайте друзей и получайте бонусы
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gradient-to-br from-blue/10 to-green/10 rounded-lg p-4 border border-blue/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue to-green flex items-center justify-center text-white font-bold text-lg">
                  +30
                </div>
                <div>
                  <p className="font-semibold">Дней Premium</p>
                  <p className="text-xs text-muted-foreground">За каждого друга</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Ваш друг получит скидку 20% на первый месяц
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Input 
                value="https://visitka.site/ref/YOUR_CODE" 
                readOnly 
                className="flex-1"
              />
              <Button size="icon">
                <Icon name="Copy" size={16} />
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-2xl font-bold">0</p>
                <p className="text-xs text-muted-foreground">Приглашено</p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-2xl font-bold">0</p>
                <p className="text-xs text-muted-foreground">Активных</p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-2xl font-bold">0</p>
                <p className="text-xs text-muted-foreground">Бонусов</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="HelpCircle" size={20} />
              Частые вопросы
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer p-3 hover:bg-muted/30 rounded-lg">
                <span className="text-sm font-medium">Как отменить подписку?</span>
                <Icon name="ChevronDown" size={16} className="group-open:rotate-180 transition-transform" />
              </summary>
              <p className="text-sm text-muted-foreground p-3">
                Перейдите в раздел "Подписка" и нажмите "Отменить подписку". 
                Вы сможете пользоваться Premium до конца оплаченного периода.
              </p>
            </details>

            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer p-3 hover:bg-muted/30 rounded-lg">
                <span className="text-sm font-medium">Можно ли вернуть деньги?</span>
                <Icon name="ChevronDown" size={16} className="group-open:rotate-180 transition-transform" />
              </summary>
              <p className="text-sm text-muted-foreground p-3">
                Да, мы возвращаем деньги в течение 14 дней после оплаты, если вы не удовлетворены сервисом.
              </p>
            </details>

            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer p-3 hover:bg-muted/30 rounded-lg">
                <span className="text-sm font-medium">Что будет после окончания пробного периода?</span>
                <Icon name="ChevronDown" size={16} className="group-open:rotate-180 transition-transform" />
              </summary>
              <p className="text-sm text-muted-foreground p-3">
                Автоматически начнётся оплачиваемая подписка. Мы предупредим вас за 3 дня до списания.
              </p>
            </details>

            <Button variant="outline" className="w-full">
              <Icon name="MessageCircle" className="mr-2" size={16} />
              Задать вопрос в поддержку
            </Button>
          </CardContent>
        </Card>
      </div>

      <PaymentModal
        open={showPayment}
        onOpenChange={setShowPayment}
        planName={selectedPlan.name}
        planPrice={selectedPlan.price}
        billingPeriod={selectedPlan.period}
      />
    </div>
  );
};

export default SubscriptionTab;
