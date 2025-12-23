import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { QRCodeSVG } from 'qrcode.react';

interface QRPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount: number;
  description: string;
  onSuccess?: () => void;
}

const QRPaymentDialog = ({
  open,
  onOpenChange,
  amount,
  description,
  onSuccess
}: QRPaymentDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [qrData, setQrData] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(false);

  const createQRPayment = async () => {
    setLoading(true);
    try {
      const authToken = localStorage.getItem('auth_token');
      
      if (!authToken) {
        toast.error('Необходима авторизация');
        return;
      }

      const response = await fetch('https://functions.poehali.dev/2563f5ea-b28f-49af-9698-b749d9b84f08', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': authToken
        },
        body: JSON.stringify({
          amount: amount,
          description: description
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка создания платежа');
      }

      const data = await response.json();
      setQrData(data.qr_data);
      setPaymentId(data.payment_id);
      
      startStatusPolling(data.payment_id);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Не удалось создать платёж';
      toast.error(errorMessage);
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  const startStatusPolling = (id: string) => {
    const interval = setInterval(async () => {
      setCheckingStatus(true);
      try {
        const authToken = localStorage.getItem('auth_token');
        const response = await fetch(`https://functions.poehali.dev/feb266c6-ab71-4e77-891f-1cac9cd9df97?payment_id=${id}`, {
          headers: {
            'X-Auth-Token': authToken || ''
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.payment.status === 'succeeded') {
            clearInterval(interval);
            toast.success('Оплата успешно завершена!');
            if (onSuccess) onSuccess();
            onOpenChange(false);
          }
        }
      } catch (error) {
        console.error('Status check error:', error);
      } finally {
        setCheckingStatus(false);
      }
    }, 3000);

    setTimeout(() => clearInterval(interval), 300000);
  };

  const handleDialogChange = (isOpen: boolean) => {
    if (!isOpen) {
      setQrData(null);
      setPaymentId(null);
    } else if (!qrData) {
      createQRPayment();
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Оплата через СБП</DialogTitle>
          <DialogDescription>
            Отсканируйте QR-код в приложении вашего банка
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Icon name="Loader2" size={48} className="animate-spin text-gold mb-4" />
              <p className="text-sm text-muted-foreground">Создание платежа...</p>
            </div>
          ) : qrData ? (
            <>
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="p-4 bg-white rounded-lg border-2 border-gold/20">
                  <QRCodeSVG
                    value={qrData}
                    size={256}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                
                <div className="text-center">
                  <p className="text-2xl font-bold mb-1">{amount} ₽</p>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex gap-3">
                  <Icon name="Info" size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm space-y-1">
                    <p className="font-medium">Как оплатить:</p>
                    <ol className="text-muted-foreground space-y-1 list-decimal list-inside">
                      <li>Откройте приложение вашего банка</li>
                      <li>Найдите раздел "Оплата по QR"</li>
                      <li>Отсканируйте код камерой телефона</li>
                      <li>Подтвердите платёж в приложении</li>
                    </ol>
                  </div>
                </div>
              </div>

              {checkingStatus && (
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Icon name="Loader2" size={16} className="animate-spin" />
                  <span>Ожидание оплаты...</span>
                </div>
              )}

              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="w-full"
              >
                Закрыть
              </Button>
            </>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRPaymentDialog;
