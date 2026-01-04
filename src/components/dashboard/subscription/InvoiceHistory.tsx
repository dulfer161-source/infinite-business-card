import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { Invoice } from './types';

interface InvoiceHistoryProps {
  invoices: Invoice[];
}

const InvoiceHistory = ({ invoices }: InvoiceHistoryProps) => {
  const handleDownloadInvoice = (invoiceId: string) => {
    console.log('Download invoice:', invoiceId);
  };

  return (
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
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Поиск по дате или плану..."
                className="flex-1"
              />
              <Button variant="outline" size="icon">
                <Icon name="Search" size={18} />
              </Button>
            </div>

            <div className="space-y-3">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon name="Receipt" size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{invoice.plan}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(invoice.date).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold">{invoice.amount} ₽</p>
                      <Badge
                        variant={invoice.status === 'paid' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {invoice.status === 'paid' ? 'Оплачен' : 'Ожидается'}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDownloadInvoice(invoice.id)}
                    >
                      <Icon name="Download" size={18} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InvoiceHistory;
