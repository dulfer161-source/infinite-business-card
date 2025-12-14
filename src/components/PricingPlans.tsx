import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface PricingPlansProps {
  currentPlan?: string;
  onSelectPlan?: (planId: string) => void;
}

const PricingPlans = ({ currentPlan = 'free', onSelectPlan }: PricingPlansProps) => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      id: 'free',
      name: 'Базовый',
      description: 'Для знакомства с сервисом',
      icon: 'Zap',
      color: 'from-gray-500 to-gray-600',
      price: { monthly: 0, yearly: 0 },
      features: [
        { text: '1 цифровая визитка', included: true },
        { text: 'Базовая аналитика', included: true },
        { text: 'QR-код визитки', included: true },
        { text: 'До 100 просмотров/месяц', included: true },
        { text: 'Водяной знак visitka.site', included: true },
        { text: 'Кастомный домен', included: false },
        { text: 'Расширенная аналитика', included: false },
        { text: 'Экспорт в PDF/Excel', included: false },
        { text: 'Приоритетная поддержка', included: false }
      ]
    },
    {
      id: 'pro',
      name: 'Профессиональный',
      description: 'Для активного использования',
      icon: 'Star',
      color: 'from-blue to-purple-500',
      price: { monthly: 490, yearly: 4900 },
      popular: true,
      features: [
        { text: 'До 5 визиток', included: true },
        { text: 'Расширенная аналитика', included: true },
        { text: 'Неограниченные просмотры', included: true },
        { text: 'Без водяных знаков', included: true },
        { text: 'Экспорт в PDF/Excel', included: true },
        { text: 'Кастомный домен', included: true },
        { text: 'Интеграции (CRM, Email)', included: true },
        { text: 'Push-уведомления', included: true },
        { text: 'Приоритетная поддержка', included: true }
      ]
    },
    {
      id: 'business',
      name: 'Бизнес',
      description: 'Для команд и компаний',
      icon: 'Briefcase',
      color: 'from-orange to-pink-500',
      price: { monthly: 1490, yearly: 14900 },
      features: [
        { text: 'Неограниченно визиток', included: true },
        { text: 'Все из Pro тарифа', included: true },
        { text: 'Командная работа (до 10 человек)', included: true },
        { text: 'Белый label (свой брендинг)', included: true },
        { text: 'API доступ', included: true },
        { text: 'Персональный менеджер', included: true },
        { text: 'Кастомные интеграции', included: true },
        { text: 'SLA 99.9%', included: true },
        { text: 'Приоритет в разработке фич', included: true }
      ]
    }
  ];

  const handleSelectPlan = (planId: string) => {
    if (planId === currentPlan) {
      toast.info('Это ваш текущий тариф');
      return;
    }

    if (onSelectPlan) {
      onSelectPlan(planId);
    } else {
      toast.success(`Выбран тариф: ${plans.find(p => p.id === planId)?.name}`);
    }
  };

  const getDiscount = () => {
    return billingPeriod === 'yearly' ? '17%' : '0%';
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold gradient-text">Тарифные планы</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Выберите план, который подходит для ваших задач. Все тарифы можно изменить в любое время.
        </p>

        <div className="flex items-center justify-center gap-4">
          <span className={`text-sm font-medium ${billingPeriod === 'monthly' ? 'text-foreground' : 'text-muted-foreground'}`}>
            Ежемесячно
          </span>
          <Switch
            checked={billingPeriod === 'yearly'}
            onCheckedChange={(checked) => setBillingPeriod(checked ? 'yearly' : 'monthly')}
          />
          <span className={`text-sm font-medium ${billingPeriod === 'yearly' ? 'text-foreground' : 'text-muted-foreground'}`}>
            Ежегодно
          </span>
          {billingPeriod === 'yearly' && (
            <Badge className="gradient-bg text-white">
              Экономия {getDiscount()}
            </Badge>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`relative h-full ${plan.popular ? 'border-blue shadow-lg shadow-blue/20' : ''} ${currentPlan === plan.id ? 'ring-2 ring-green' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="gradient-bg text-white px-4 py-1">
                    <Icon name="TrendingUp" size={14} className="mr-1" />
                    Популярный
                  </Badge>
                </div>
              )}

              {currentPlan === plan.id && (
                <div className="absolute -top-4 right-4">
                  <Badge variant="outline" className="border-green text-green">
                    <Icon name="Check" size={14} className="mr-1" />
                    Текущий
                  </Badge>
                </div>
              )}

              <CardHeader>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4`}>
                  <Icon name={plan.icon as any} size={28} className="text-white" />
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>

                <div className="pt-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">
                      {plan.price[billingPeriod] === 0 ? 'Бесплатно' : `${plan.price[billingPeriod]} ₽`}
                    </span>
                    {plan.price[billingPeriod] > 0 && (
                      <span className="text-muted-foreground">
                        /{billingPeriod === 'monthly' ? 'мес' : 'год'}
                      </span>
                    )}
                  </div>
                  {billingPeriod === 'yearly' && plan.price.yearly > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {Math.round(plan.price.yearly / 12)} ₽/месяц
                    </p>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <Button
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full ${
                    plan.popular 
                      ? 'gradient-bg text-white' 
                      : currentPlan === plan.id
                      ? 'bg-muted text-muted-foreground'
                      : ''
                  }`}
                  variant={plan.popular ? 'default' : currentPlan === plan.id ? 'outline' : 'outline'}
                  disabled={currentPlan === plan.id}
                >
                  {currentPlan === plan.id ? (
                    <>
                      <Icon name="Check" className="mr-2" size={18} />
                      Активный план
                    </>
                  ) : plan.price[billingPeriod] === 0 ? (
                    'Текущий план'
                  ) : plan.id === 'business' ? (
                    <>
                      <Icon name="Mail" className="mr-2" size={18} />
                      Связаться с нами
                    </>
                  ) : (
                    <>
                      <Icon name="CreditCard" className="mr-2" size={18} />
                      Выбрать план
                    </>
                  )}
                </Button>

                <div className="space-y-3 pt-4 border-t">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Icon
                        name={feature.included ? 'Check' : 'X'}
                        size={18}
                        className={`flex-shrink-0 mt-0.5 ${
                          feature.included ? 'text-green' : 'text-muted-foreground'
                        }`}
                      />
                      <span className={`text-sm ${feature.included ? '' : 'text-muted-foreground line-through'}`}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-blue/10 to-green/10 rounded-xl p-6 border border-blue/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue to-green flex items-center justify-center flex-shrink-0">
            <Icon name="Gift" size={24} className="text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-2">Специальное предложение</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Приведите друга — получите <strong>+30 дней Premium тарифа</strong> бесплатно. 
              Ваш друг также получит скидку 20% на первый месяц.
            </p>
            <Button variant="outline" size="sm">
              <Icon name="Users" className="mr-2" size={16} />
              Пригласить друга
            </Button>
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-3">
          Все платные тарифы включают 14-дневный пробный период
        </p>
        <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Icon name="Shield" size={14} />
            Безопасные платежи
          </div>
          <div className="flex items-center gap-2">
            <Icon name="RefreshCw" size={14} />
            Отмена в любой момент
          </div>
          <div className="flex items-center gap-2">
            <Icon name="CreditCard" size={14} />
            Visa, MasterCard, МИР
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPlans;
