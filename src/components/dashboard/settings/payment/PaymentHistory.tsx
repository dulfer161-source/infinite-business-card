import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

const PaymentHistory = () => {
  const transactions = [
    { id: 1, date: '2024-01-15', amount: 299, status: 'completed', plan: 'Месяц' },
    { id: 2, date: '2023-12-15', amount: 299, status: 'completed', plan: 'Месяц' },
    { id: 3, date: '2023-11-15', amount: 759, status: 'completed', plan: '3 месяца' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="History" size={20} />
          История платежей
        </CardTitle>
        <CardDescription>
          Все ваши транзакции и подписки
        </CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Receipt" size={48} className="mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">
              История платежей пуста
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <Icon name="CheckCircle2" size={20} className="text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{transaction.plan}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{transaction.amount} ₽</p>
                    <Badge variant="outline" className="text-xs">
                      Оплачено
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentHistory;
