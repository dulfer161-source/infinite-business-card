import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import PaymentButton from '@/components/payment/PaymentButton';
import QRPaymentDialog from '@/components/payment/QRPaymentDialog';

const SubscriptionPlans = () => {
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ amount: number; description: string } | null>(null);

  const handleQRPayment = (amount: number, description: string) => {
    setSelectedPlan({ amount, description });
    setQrDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="CreditCard" size={20} />
          Оплата подписки
        </CardTitle>
        <CardDescription>
          Оплатите подписку через СБП или банковскую карту
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-lg">Месяц</CardTitle>
              <CardDescription>Базовый тариф</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold">299 ₽</div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Icon name="Check" size={16} className="text-green-500" />
                  До 10 визиток
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Check" size={16} className="text-green-500" />
                  Аналитика просмотров
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Check" size={16} className="text-green-500" />
                  Сбор лидов
                </li>
              </ul>
              <div className="space-y-2">
                <PaymentButton
                  amount={299}
                  description="Подписка на 1 месяц"
                  buttonText="Оплатить картой"
                  className="w-full"
                  onSuccess={() => toast.success('Оплата успешна!')}
                />
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleQRPayment(299, 'Подписка на 1 месяц')}
                >
                  <Icon name="QrCode" size={16} className="mr-2" />
                  Оплатить по QR (СБП)
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-gold relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="bg-gold text-black">Выгодно</Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-lg">3 месяца</CardTitle>
              <CardDescription>Скидка 15%</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-3xl font-bold">759 ₽</div>
                <div className="text-sm text-muted-foreground line-through">897 ₽</div>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Icon name="Check" size={16} className="text-green-500" />
                  До 10 визиток
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Check" size={16} className="text-green-500" />
                  Аналитика просмотров
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Check" size={16} className="text-green-500" />
                  Сбор лидов
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Check" size={16} className="text-green-500" />
                  Экономия 138 ₽
                </li>
              </ul>
              <div className="space-y-2">
                <PaymentButton
                  amount={759}
                  description="Подписка на 3 месяца"
                  buttonText="Оплатить картой"
                  className="w-full bg-gold text-black hover:bg-gold/90"
                  onSuccess={() => toast.success('Оплата успешна!')}
                />
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleQRPayment(759, 'Подписка на 3 месяца')}
                >
                  <Icon name="QrCode" size={16} className="mr-2" />
                  Оплатить по QR (СБП)
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-lg">Год</CardTitle>
              <CardDescription>Скидка 25%</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-3xl font-bold">2 691 ₽</div>
                <div className="text-sm text-muted-foreground line-through">3 588 ₽</div>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Icon name="Check" size={16} className="text-green-500" />
                  До 10 визиток
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Check" size={16} className="text-green-500" />
                  Аналитика просмотров
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Check" size={16} className="text-green-500" />
                  Сбор лидов
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Check" size={16} className="text-green-500" />
                  Экономия 897 ₽
                </li>
              </ul>
              <div className="space-y-2">
                <PaymentButton
                  amount={2691}
                  description="Подписка на 12 месяцев"
                  buttonText="Оплатить картой"
                  className="w-full"
                  onSuccess={() => toast.success('Оплата успешна!')}
                />
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleQRPayment(2691, 'Подписка на 12 месяцев')}
                >
                  <Icon name="QrCode" size={16} className="mr-2" />
                  Оплатить по QR (СБП)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <QRPaymentDialog
          open={qrDialogOpen}
          onOpenChange={setQrDialogOpen}
          amount={selectedPlan?.amount || 0}
          description={selectedPlan?.description || ''}
          onSuccess={() => toast.success('Оплата успешна!')}
        />

        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex gap-3">
            <Icon name="Info" size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="font-medium text-sm">Способы оплаты</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• СБП (Система быстрых платежей) — комиссия 0.4%</li>
                <li>• Банковские карты Visa, MasterCard, МИР — комиссия 2.8%</li>
                <li>• Безопасная оплата через ЮKassa (Яндекс)</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionPlans;