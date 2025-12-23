import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { paymentService } from '@/lib/payment';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planName: string;
  planPrice: number;
  billingPeriod: 'monthly' | 'yearly';
}

const PaymentModal = ({ 
  open, 
  onOpenChange, 
  planName, 
  planPrice,
  billingPeriod 
}: PaymentModalProps) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'sbp'>('card');
  const [showSetupAlert, setShowSetupAlert] = useState(false);
  
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  const [userDetails, setUserDetails] = useState({
    email: '',
    phone: ''
  });

  const handleProceedToPayment = () => {
    if (!userDetails.email || !userDetails.phone) {
      toast.error('Заполните все поля');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userDetails.email)) {
      toast.error('Некорректный email');
      return;
    }
    setStep('payment');
  };

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      const payment = await paymentService.createPayment({
        amount: planPrice,
        description: `Подписка ${planName} (${billingPeriod === 'monthly' ? 'месяц' : 'год'})`,
        email: userDetails.email,
        phone: userDetails.phone,
        return_url: window.location.origin + '?payment=success'
      });

      const paymentWindow = paymentService.openPaymentWindow(payment.confirmation_url);
      
      if (!paymentWindow) {
        toast.error('Разрешите всплывающие окна для оплаты');
        setLoading(false);
        return;
      }

      toast.info('Завершите оплату в открывшемся окне', { duration: 5000 });

      paymentService.pollPaymentStatus(
        payment.payment_id,
        (status) => {
          console.log('Payment status:', status);
        }
      ).then((finalStatus) => {
        if (finalStatus.paid) {
          setStep('success');
          setLoading(false);
          if (paymentWindow && !paymentWindow.closed) {
            paymentWindow.close();
          }
          
          setTimeout(() => {
            toast.success(`Подписка "${planName}" активирована!`);
            onOpenChange(false);
            setStep('details');
          }, 3000);
        }
      }).catch((error) => {
        toast.error(error.message || 'Ошибка при оплате');
        setLoading(false);
        if (paymentWindow && !paymentWindow.closed) {
          paymentWindow.close();
        }
      });

    } catch (error: any) {
      const errorMessage = error.message || 'Ошибка при создании платежа';
      
      if (errorMessage.includes('не настроена') || errorMessage.includes('not configured')) {
        setShowSetupAlert(true);
        toast.error('Платёжная система не настроена');
      } else {
        toast.error(errorMessage);
      }
      
      setLoading(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.substring(0, 19);
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    
    if (cleaned.length === 0) return '';
    
    let formatted = '+7';
    if (cleaned.length > 1) {
      formatted += ' (' + cleaned.substring(1, 4);
    }
    if (cleaned.length >= 5) {
      formatted += ') ' + cleaned.substring(4, 7);
    }
    if (cleaned.length >= 8) {
      formatted += '-' + cleaned.substring(7, 9);
    }
    if (cleaned.length >= 10) {
      formatted += '-' + cleaned.substring(9, 11);
    }
    
    return formatted;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        {step === 'details' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Icon name="CreditCard" size={20} />
                Оформление подписки
              </DialogTitle>
              <DialogDescription>
                Выбран тариф: <strong>{planName}</strong>
              </DialogDescription>
            </DialogHeader>

            {showSetupAlert && (
              <Alert className="border-yellow/20 bg-yellow/10">
                <Icon name="AlertCircle" size={18} className="text-yellow" />
                <AlertTitle className="text-yellow">Требуется настройка</AlertTitle>
                <AlertDescription className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Для приёма платежей необходимо настроить интеграцию с ЮKassa
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      onOpenChange(false);
                      navigate('/yookassa-setup');
                    }}
                  >
                    <Icon name="Settings" size={14} className="mr-2" />
                    Перейти к настройке
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue/10 to-green/10 rounded-lg p-4 border border-blue/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Стоимость</span>
                  <span className="text-2xl font-bold">{planPrice} ₽</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Период оплаты</span>
                  <span>{billingPeriod === 'monthly' ? 'Ежемесячно' : 'Ежегодно'}</span>
                </div>
                {billingPeriod === 'yearly' && (
                  <Badge className="gradient-bg text-white mt-2 text-xs">
                    Экономия 17% • {Math.round(planPrice / 12)} ₽/мес
                  </Badge>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email для чеков</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={userDetails.email}
                    onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Телефон</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+7 (999) 123-45-67"
                    value={userDetails.phone}
                    onChange={(e) => {
                      const formatted = formatPhone(e.target.value);
                      setUserDetails({ ...userDetails, phone: formatted });
                    }}
                    maxLength={18}
                  />
                </div>
              </div>

              <div className="bg-blue/5 border border-blue/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Icon name="Gift" size={16} className="text-blue flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-muted-foreground">
                    <strong>14 дней бесплатно</strong> — пробный период без привязки карты. 
                    Отмените в любой момент до окончания пробного периода.
                  </div>
                </div>
              </div>

              <Button onClick={handleProceedToPayment} className="w-full gradient-bg text-white">
                Продолжить к оплате
                <Icon name="ArrowRight" className="ml-2" size={18} />
              </Button>
            </div>
          </>
        )}

        {step === 'payment' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Icon name="Lock" size={20} className="text-green" />
                Безопасная оплата
              </DialogTitle>
              <DialogDescription>
                Ваши данные защищены SSL-шифрованием
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="flex gap-2">
                <Button
                  variant={paymentMethod === 'card' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setPaymentMethod('card')}
                >
                  <Icon name="CreditCard" className="mr-2" size={16} />
                  Картой
                </Button>
                <Button
                  variant={paymentMethod === 'sbp' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setPaymentMethod('sbp')}
                >
                  <Icon name="Smartphone" className="mr-2" size={16} />
                  СБП
                </Button>
              </div>

              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="card-number">Номер карты</Label>
                    <Input
                      id="card-number"
                      placeholder="0000 0000 0000 0000"
                      value={cardData.number}
                      onChange={(e) => setCardData({ 
                        ...cardData, 
                        number: formatCardNumber(e.target.value) 
                      })}
                      maxLength={19}
                    />
                  </div>
                  <div>
                    <Label htmlFor="card-name">Имя на карте</Label>
                    <Input
                      id="card-name"
                      placeholder="IVAN IVANOV"
                      value={cardData.name}
                      onChange={(e) => setCardData({ 
                        ...cardData, 
                        name: e.target.value.toUpperCase() 
                      })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Срок действия</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        value={cardData.expiry}
                        onChange={(e) => setCardData({ 
                          ...cardData, 
                          expiry: formatExpiry(e.target.value) 
                        })}
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        type="password"
                        value={cardData.cvv}
                        onChange={(e) => setCardData({ 
                          ...cardData, 
                          cvv: e.target.value.replace(/\D/g, '').substring(0, 3) 
                        })}
                        maxLength={3}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground pt-2">
                    <Icon name="Lock" size={14} className="text-green" />
                    <span>Принимаем:</span>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">Visa</Badge>
                      <Badge variant="outline" className="text-xs">MasterCard</Badge>
                      <Badge variant="outline" className="text-xs">МИР</Badge>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'sbp' && (
                <div className="text-center py-8 space-y-4">
                  <div className="w-48 h-48 bg-muted rounded-lg mx-auto flex items-center justify-center">
                    <Icon name="QrCode" size={64} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Отсканируйте QR-код</p>
                    <p className="text-sm text-muted-foreground">
                      Откройте приложение банка и отсканируйте код для оплаты
                    </p>
                  </div>
                </div>
              )}

              <Separator />

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">К оплате</span>
                <span className="text-xl font-bold">{planPrice} ₽</span>
              </div>

              <Button 
                onClick={handlePayment} 
                className="w-full gradient-bg text-white"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Icon name="Loader2" className="mr-2 animate-spin" size={18} />
                    Обработка...
                  </>
                ) : (
                  <>
                    <Icon name="Lock" className="mr-2" size={18} />
                    Оплатить {planPrice} ₽
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Нажимая кнопку, вы соглашаетесь с{' '}
                <a href="#" className="text-blue hover:underline">условиями подписки</a>
              </p>
            </div>
          </>
        )}

        {step === 'success' && (
          <div className="text-center py-8 space-y-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green to-blue flex items-center justify-center mx-auto">
              <Icon name="Check" size={40} className="text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Оплата прошла успешно!</h3>
              <p className="text-muted-foreground">
                Подписка <strong>{planName}</strong> активирована
              </p>
            </div>
            <div className="bg-green/10 border border-green/20 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                Чек отправлен на <strong>{userDetails.email}</strong>
              </p>
            </div>
            <Button 
              onClick={() => {
                onOpenChange(false);
                setStep('details');
              }} 
              className="w-full"
            >
              Продолжить
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;