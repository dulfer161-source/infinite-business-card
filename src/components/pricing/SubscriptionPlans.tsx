import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface Plan {
  id: number;
  name: string;
  price: string;
  duration_days: number;
  features: any;
  can_remove_branding: boolean;
}

interface SubscriptionPlansProps {
  isAuthenticated: boolean;
  onAuthRequired: () => void;
}

const SubscriptionPlans = ({ isAuthenticated, onAuthRequired }: SubscriptionPlansProps) => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const { plans: loadedPlans } = await api.getSubscriptionPlans();
      setPlans(loadedPlans.sort((a: Plan, b: Plan) => parseFloat(a.price) - parseFloat(b.price)));
    } catch (error) {
      console.error('Failed to load plans:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить тарифы',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (plan: Plan) => {
    if (!isAuthenticated) {
      onAuthRequired();
      return;
    }

    if (parseFloat(plan.price) === 0) {
      toast({
        title: 'Базовый тариф',
        description: 'Вы уже используете базовый тариф',
      });
      return;
    }

    setSelectedPlan(plan);
    setConfirmDialogOpen(true);
  };

  const handleConfirmPayment = async () => {
    if (!selectedPlan) return;

    setProcessingPayment(true);
    try {
      const response = await api.createPayment(
        parseFloat(selectedPlan.price),
        `Подписка ${selectedPlan.name}`,
        `${window.location.origin}/payment/success`,
        selectedPlan.id
      );

      if (response.confirmation_url) {
        window.location.href = response.confirmation_url;
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: 'Ошибка оплаты',
        description: 'Не удалось создать платёж. Попробуйте снова.',
        variant: 'destructive'
      });
    } finally {
      setProcessingPayment(false);
      setConfirmDialogOpen(false);
    }
  };

  const getFeaturesList = (plan: Plan) => {
    const features = [];
    
    if (plan.features.max_cards) {
      features.push(`${plan.features.max_cards} ${plan.features.max_cards === 1 ? 'визитка' : 'визиток'}`);
    }
    
    if (plan.features.analytics) {
      features.push('Аналитика просмотров');
    }
    
    if (plan.can_remove_branding) {
      features.push('Персональный брендинг');
      features.push('Отключение брендинга платформы');
    }
    
    if (plan.features.qr_customization) {
      features.push('Кастомизация QR-кода');
    }
    
    if (plan.features.custom_domain) {
      features.push('Свой домен');
    }
    
    if (plan.features.priority_support) {
      features.push('Приоритетная поддержка');
    }

    // White-Label features
    if (plan.features.max_users) {
      features.push(`До ${plan.features.max_users} сотрудников`);
    }
    
    if (plan.features.max_cards_per_user === -1) {
      features.push('Безлимитные визитки');
    } else if (plan.features.max_cards_per_user) {
      features.push(`${plan.features.max_cards_per_user} визиток на сотрудника`);
    }
    
    if (plan.features.custom_branding) {
      features.push('Полный ребрендинг');
    }
    
    if (plan.features.subdomain) {
      features.push('Корпоративный поддомен');
    }
    
    if (plan.features.api_access) {
      features.push('API доступ');
    }

    return features;
  };

  const isPopular = (plan: Plan) => {
    return plan.name === 'Продвинутый' || plan.name === 'White-Label Бизнес';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Icon name="Loader2" className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative ${
              isPopular(plan)
                ? 'border-2 border-gold shadow-xl scale-105'
                : 'border-gold/20 hover:border-gold/40'
            } transition-all`}
          >
            {isPopular(plan) && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-gold text-black px-4 py-1">Популярный</Badge>
              </div>
            )}

            <CardHeader className="pt-8">
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>
                {plan.duration_days === 30 ? 'Месячная подписка' : `${plan.duration_days} дней`}
              </CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">{parseFloat(plan.price).toLocaleString('ru-RU')}</span>
                <span className="text-muted-foreground"> ₽</span>
                {plan.duration_days === 30 && <span className="text-muted-foreground">/мес</span>}
              </div>
            </CardHeader>

            <CardContent>
              <ul className="space-y-3">
                {getFeaturesList(plan).map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Icon name="Check" size={20} className="text-green mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter>
              <Button
                onClick={() => handleSelectPlan(plan)}
                disabled={parseFloat(plan.price) === 0}
                className={`w-full ${
                  isPopular(plan)
                    ? 'bg-gold text-black hover:bg-gold/90'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                {parseFloat(plan.price) === 0 ? (
                  <>
                    <Icon name="Check" size={16} className="mr-2" />
                    Текущий тариф
                  </>
                ) : (
                  <>
                    <Icon name="CreditCard" size={16} className="mr-2" />
                    Выбрать тариф
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подтверждение оплаты</DialogTitle>
            <DialogDescription>
              Вы выбрали тариф "{selectedPlan?.name}"
            </DialogDescription>
          </DialogHeader>

          {selectedPlan && (
            <div className="space-y-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Тариф</span>
                  <span className="font-medium">{selectedPlan.name}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Период</span>
                  <span className="font-medium">{selectedPlan.duration_days} дней</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-border">
                  <span className="text-sm text-muted-foreground">К оплате</span>
                  <span className="text-2xl font-bold text-gold">
                    {parseFloat(selectedPlan.price).toLocaleString('ru-RU')} ₽
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setConfirmDialogOpen(false)}
                  disabled={processingPayment}
                  className="flex-1"
                >
                  Отмена
                </Button>
                <Button
                  onClick={handleConfirmPayment}
                  disabled={processingPayment}
                  className="flex-1 bg-gold text-black hover:bg-gold/90"
                >
                  {processingPayment ? (
                    <>
                      <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                      Обработка...
                    </>
                  ) : (
                    <>
                      <Icon name="CreditCard" size={16} className="mr-2" />
                      Оплатить
                    </>
                  )}
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                После нажатия вы будете перенаправлены на страницу оплаты ЮКасса
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SubscriptionPlans;
