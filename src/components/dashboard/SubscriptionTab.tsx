import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import PricingPlans from '../PricingPlans';
import PricingComparison from '../PricingComparison';
import PaymentModal from '../PaymentModal';
import SubscriptionNotifications from './SubscriptionNotifications';
import { subscriptionMonitor } from '@/lib/subscriptionMonitor';
import { SubscriptionData, Invoice, SelectedPlan, CurrentPlanCard, UsageStatsCard, InvoiceHistory } from './subscription';

const SubscriptionTab = () => {
  const navigate = useNavigate();
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlan>({ name: '', price: 0, period: 'monthly' });
  const [currentPlan] = useState('free');

  const subscription: SubscriptionData = {
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

  useEffect(() => {
    subscriptionMonitor.start({
      plan: subscription.plan,
      status: subscription.status as 'active' | 'expiring' | 'expired',
      endDate: subscription.endDate,
      features: subscription.features
    });

    return () => {
      subscriptionMonitor.stop();
    };
  }, []);

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

  const invoices: Invoice[] = [
    { id: '1', date: '2024-11-01', amount: 490, status: 'paid', plan: 'Профессиональный' },
    { id: '2', date: '2024-10-01', amount: 490, status: 'paid', plan: 'Профессиональный' },
    { id: '3', date: '2024-09-01', amount: 490, status: 'paid', plan: 'Профессиональный' }
  ];

  const handleUpgrade = () => {
    console.log('Navigate to pricing plans');
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <CurrentPlanCard subscription={subscription} onUpgrade={handleUpgrade} />
        <UsageStatsCard subscription={subscription} />
      </div>

      <SubscriptionNotifications />

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
          <InvoiceHistory invoices={invoices} />
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

            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer p-3 hover:bg-muted/30 rounded-lg">
                <span className="text-sm font-medium">Как настроить платежную систему?</span>
                <Icon name="ChevronDown" size={16} className="group-open:rotate-180 transition-transform" />
              </summary>
              <p className="text-sm text-muted-foreground p-3">
                Для приёма оплаты нужно подключить ЮKassa. Следуйте инструкции по настройке.
              </p>
            </details>

            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/yookassa-setup')}
              >
                <Icon name="Settings" className="mr-2" size={16} />
                Настроить ЮKassa
              </Button>
              
              <Button variant="outline" className="w-full">
                <Icon name="MessageCircle" className="mr-2" size={16} />
                Задать вопрос в поддержку
              </Button>
            </div>
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