import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CommunicationTestsProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  results: any;
  setResults: (results: any) => void;
  toast: any;
}

const CommunicationTests = ({ loading, setLoading, results, setResults, toast }: CommunicationTestsProps) => {
  // Тест 8: Отправка email уведомления
  const [notifEmail, setNotifEmail] = useState('test@example.com');
  const [notifSubject, setNotifSubject] = useState('Тестовое уведомление');
  const [notifMessage, setNotifMessage] = useState('Это тестовое письмо от системы визиток');
  
  const testEmailNotification = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/74c49dcb-78dd-46f7-9f32-46f1dffa39be', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: notifEmail,
          subject: notifSubject,
          message: notifMessage,
        }),
      });
      const data = await response.json();
      setResults({ ...results, emailNotif: data });
      
      if (response.ok) {
        toast({
          title: '✅ Email отправлен',
          description: `Письмо отправлено на ${notifEmail}`,
        });
      } else {
        toast({
          title: '⚠️ Ошибка',
          description: data.error || 'Неизвестная ошибка',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: '❌ Ошибка сети',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Тест 9: Создание платежа ЮКасса
  const [paymentAmount, setPaymentAmount] = useState('100');
  const [paymentEmail, setPaymentEmail] = useState('test@example.com');
  
  const testCreatePayment = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/5bc46a0f-1084-4325-9a7b-460cfa14c2a8?action=create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(paymentAmount),
          description: 'Тестовый платёж',
          email: paymentEmail,
          return_url: window.location.origin + '/test-functions',
        }),
      });
      const data = await response.json();
      setResults({ ...results, payment: data });
      
      if (response.ok && data.confirmation_url) {
        toast({
          title: '✅ Платёж создан',
          description: 'Ссылка на оплату получена',
        });
        if (window.confirm('Открыть страницу оплаты ЮКасса?')) {
          window.open(data.confirmation_url, '_blank');
        }
      } else {
        toast({
          title: '⚠️ Ошибка',
          description: data.error || 'Неизвестная ошибка',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: '❌ Ошибка сети',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Тест 8: Email уведомления */}
      <Card>
        <CardHeader>
          <CardTitle>8️⃣ Email уведомления</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Email получателя</Label>
            <Input value={notifEmail} onChange={(e) => setNotifEmail(e.target.value)} />
          </div>
          <div>
            <Label>Тема письма</Label>
            <Input value={notifSubject} onChange={(e) => setNotifSubject(e.target.value)} />
          </div>
          <div>
            <Label>Сообщение</Label>
            <Input value={notifMessage} onChange={(e) => setNotifMessage(e.target.value)} />
          </div>
          <Button onClick={testEmailNotification} disabled={loading} className="w-full">
            Отправить письмо
          </Button>
          {results.emailNotif && (
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40">
              {JSON.stringify(results.emailNotif, null, 2)}
            </pre>
          )}
        </CardContent>
      </Card>

      {/* Тест 9: ЮКасса платежи */}
      <Card className="border-green-200">
        <CardHeader>
          <CardTitle>9️⃣ Создание платежа ЮКасса</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Сумма платежа (₽)</Label>
            <Input 
              type="number" 
              value={paymentAmount} 
              onChange={(e) => setPaymentAmount(e.target.value)} 
              placeholder="100"
            />
          </div>
          <div>
            <Label>Email для чека</Label>
            <Input value={paymentEmail} onChange={(e) => setPaymentEmail(e.target.value)} />
          </div>
          <p className="text-sm text-gray-600">
            Создаст реальный платёж в ЮКассе. Откроется окно оплаты.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-xs">
            <p className="font-semibold text-green-800 mb-1">⚠️ Важно:</p>
            <ul className="list-disc list-inside space-y-1 text-green-700">
              <li>Нужны секреты YOOKASSA_SHOP_ID и YOOKASSA_SECRET_KEY</li>
              <li>Это тестовый режим - используйте тестовые карты ЮКассы</li>
              <li>Тестовая карта: 5555 5555 5555 4444, срок 12/24, CVV 123</li>
            </ul>
          </div>
          <Button onClick={testCreatePayment} disabled={loading} className="w-full bg-green-600 hover:bg-green-700">
            💳 Создать платёж
          </Button>
          {results.payment && (
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40">
              {JSON.stringify(results.payment, null, 2)}
            </pre>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default CommunicationTests;
