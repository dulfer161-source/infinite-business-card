import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface PaymentButtonProps {
  amount: number;
  description: string;
  buttonText?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
  variant?: 'default' | 'outline' | 'destructive' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const PaymentButton = ({
  amount,
  description,
  buttonText = 'Оплатить',
  onSuccess,
  onError,
  className,
  variant = 'default',
  size = 'default'
}: PaymentButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const authToken = localStorage.getItem('auth_token');
      
      if (!authToken) {
        toast.error('Необходима авторизация');
        setLoading(false);
        return;
      }

      const response = await fetch('https://functions.poehali.dev/f59b90f0-92f3-449d-a3fa-95873b623166', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': authToken
        },
        body: JSON.stringify({
          amount: amount,
          description: description,
          return_url: window.location.href
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка создания платежа');
      }

      const data = await response.json();
      
      if (data.confirmation_url) {
        window.location.href = data.confirmation_url;
      } else {
        throw new Error('Не удалось получить ссылку для оплаты');
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Не удалось создать платёж';
      toast.error(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={loading}
      className={className}
      variant={variant}
      size={size}
    >
      {loading ? (
        <>
          <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
          Подготовка...
        </>
      ) : (
        <>
          <Icon name="CreditCard" size={16} className="mr-2" />
          {buttonText} {amount} ₽
        </>
      )}
    </Button>
  );
};

export default PaymentButton;
