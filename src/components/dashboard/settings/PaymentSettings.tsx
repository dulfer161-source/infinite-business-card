import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank';
  name: string;
  details: string;
  isDefault: boolean;
  addedDate: string;
}

interface BillingInfo {
  type: 'individual' | 'company';
  fullName: string;
  email: string;
  phone: string;
  address: string;
  companyName?: string;
  inn?: string;
  kpp?: string;
  ogrn?: string;
  bankName?: string;
  bik?: string;
  accountNumber?: string;
}

const PaymentSettings = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [billingInfo, setBillingInfo] = useState<BillingInfo>({
    type: 'individual',
    fullName: '',
    email: '',
    phone: '',
    address: ''
  });
  const [autoRenew, setAutoRenew] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);

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

  useEffect(() => {
    loadPaymentSettings();
  }, []);

  const loadPaymentSettings = () => {
    const savedMethods = localStorage.getItem('payment_methods');
    const savedBilling = localStorage.getItem('billing_info');
    const savedAutoRenew = localStorage.getItem('auto_renew');

    if (savedMethods) {
      try {
        setPaymentMethods(JSON.parse(savedMethods));
      } catch (e) {
        console.error('Failed to load payment methods:', e);
      }
    }

    if (savedBilling) {
      try {
        setBillingInfo(JSON.parse(savedBilling));
      } catch (e) {
        console.error('Failed to load billing info:', e);
      }
    }

    if (savedAutoRenew) {
      setAutoRenew(savedAutoRenew === 'true');
    }
  };

  const saveBillingInfo = () => {
    if (!billingInfo.fullName || !billingInfo.email || !billingInfo.phone) {
      toast.error('Заполните обязательные поля');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(billingInfo.email)) {
      toast.error('Некорректный email');
      return;
    }

    if (billingInfo.type === 'company' && (!billingInfo.companyName || !billingInfo.inn)) {
      toast.error('Для юридического лица укажите название и ИНН');
      return;
    }

    localStorage.setItem('billing_info', JSON.stringify(billingInfo));
    toast.success('Платёжная информация сохранена');
  };

  const toggleAutoRenew = (enabled: boolean) => {
    setAutoRenew(enabled);
    localStorage.setItem('auto_renew', enabled.toString());
    toast.success(enabled ? 'Автопродление включено' : 'Автопродление отключено');
  };

  const setDefaultPaymentMethod = (id: string) => {
    const updated = paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id
    }));
    setPaymentMethods(updated);
    localStorage.setItem('payment_methods', JSON.stringify(updated));
    toast.success('Способ оплаты по умолчанию изменён');
  };

  const deletePaymentMethod = (id: string) => {
    const updated = paymentMethods.filter(m => m.id !== id);
    setPaymentMethods(updated);
    localStorage.setItem('payment_methods', JSON.stringify(updated));
    toast.success('Способ оплаты удалён');
  };

  const addPaymentMethod = () => {
    toast.info('Добавление карты будет доступно после интеграции платёжной системы');
    setShowAddCard(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="CreditCard" size={20} />
            Способы оплаты
          </CardTitle>
          <CardDescription>
            Управление картами и методами оплаты
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentMethods.length === 0 ? (
            <div className="text-center py-8">
              <Icon name="CreditCard" size={48} className="mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground mb-4">
                Способы оплаты не добавлены
              </p>
              <Button onClick={() => setShowAddCard(true)}>
                <Icon name="Plus" className="mr-2" size={16} />
                Добавить карту
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-12 h-8 rounded bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                          <Icon name="CreditCard" size={20} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-sm">{method.name}</p>
                            {method.isDefault && (
                              <Badge variant="outline" className="text-xs">
                                По умолчанию
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            {method.details}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Добавлена: {new Date(method.addedDate).toLocaleDateString('ru-RU')}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!method.isDefault && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDefaultPaymentMethod(method.id)}
                          >
                            По умолчанию
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deletePaymentMethod(method.id)}
                        >
                          <Icon name="Trash2" size={16} className="text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button onClick={() => setShowAddCard(true)} variant="outline" className="w-full">
                <Icon name="Plus" className="mr-2" size={16} />
                Добавить способ оплаты
              </Button>
            </>
          )}

          <div className="border-t pt-4 mt-4">
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex-1">
                <p className="font-medium text-sm mb-1">Автоматическое продление</p>
                <p className="text-xs text-muted-foreground">
                  Подписка будет автоматически продлена перед окончанием
                </p>
              </div>
              <Switch
                checked={autoRenew}
                onCheckedChange={toggleAutoRenew}
              />
            </div>
          </div>

          <div className="bg-blue/5 border border-blue/20 rounded-lg p-4 mt-4">
            <div className="flex items-start gap-3">
              <Icon name="Shield" size={16} className="text-blue flex-shrink-0 mt-0.5" />
              <div className="text-xs text-muted-foreground">
                <p className="font-semibold mb-1">Безопасность платежей</p>
                <p>
                  Все платёжные данные защищены по стандарту PCI DSS. 
                  Мы не храним данные вашей карты на наших серверах.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="FileText" size={20} />
            Платёжная информация
          </CardTitle>
          <CardDescription>
            Данные для выставления счетов и чеков
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setBillingInfo({ ...billingInfo, type: 'individual' })}
              className={`flex-1 p-4 rounded-lg border-2 transition-all text-left ${
                billingInfo.type === 'individual'
                  ? 'border-blue bg-blue/5'
                  : 'border-muted hover:border-blue/50'
              }`}
            >
              <Icon name="User" size={20} className="mb-2" />
              <p className="font-semibold text-sm">Физическое лицо</p>
            </button>
            <button
              onClick={() => setBillingInfo({ ...billingInfo, type: 'company' })}
              className={`flex-1 p-4 rounded-lg border-2 transition-all text-left ${
                billingInfo.type === 'company'
                  ? 'border-blue bg-blue/5'
                  : 'border-muted hover:border-blue/50'
              }`}
            >
              <Icon name="Building2" size={20} className="mb-2" />
              <p className="font-semibold text-sm">Юридическое лицо</p>
            </button>
          </div>

          <div className="space-y-3">
            {billingInfo.type === 'company' && (
              <>
                <div>
                  <Label htmlFor="company-name">Название организации *</Label>
                  <Input
                    id="company-name"
                    value={billingInfo.companyName || ''}
                    onChange={(e) => setBillingInfo({ ...billingInfo, companyName: e.target.value })}
                    placeholder="ООО «Ромашка»"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="inn">ИНН *</Label>
                    <Input
                      id="inn"
                      value={billingInfo.inn || ''}
                      onChange={(e) => setBillingInfo({ ...billingInfo, inn: e.target.value })}
                      placeholder="1234567890"
                      maxLength={12}
                    />
                  </div>
                  <div>
                    <Label htmlFor="kpp">КПП</Label>
                    <Input
                      id="kpp"
                      value={billingInfo.kpp || ''}
                      onChange={(e) => setBillingInfo({ ...billingInfo, kpp: e.target.value })}
                      placeholder="123456789"
                      maxLength={9}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="ogrn">ОГРН</Label>
                  <Input
                    id="ogrn"
                    value={billingInfo.ogrn || ''}
                    onChange={(e) => setBillingInfo({ ...billingInfo, ogrn: e.target.value })}
                    placeholder="1234567890123"
                    maxLength={13}
                  />
                </div>
              </>
            )}

            <div>
              <Label htmlFor="full-name">{billingInfo.type === 'company' ? 'Контактное лицо' : 'ФИО'} *</Label>
              <Input
                id="full-name"
                value={billingInfo.fullName}
                onChange={(e) => setBillingInfo({ ...billingInfo, fullName: e.target.value })}
                placeholder="Иванов Иван Иванович"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={billingInfo.email}
                  onChange={(e) => setBillingInfo({ ...billingInfo, email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Телефон *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={billingInfo.phone}
                  onChange={(e) => {
                    const formatted = formatPhone(e.target.value);
                    setBillingInfo({ ...billingInfo, phone: formatted });
                  }}
                  placeholder="+7 (999) 123-45-67"
                  maxLength={18}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Адрес {billingInfo.type === 'company' && '*'}</Label>
              <Input
                id="address"
                value={billingInfo.address}
                onChange={(e) => setBillingInfo({ ...billingInfo, address: e.target.value })}
                placeholder={billingInfo.type === 'company' ? 'Юридический адрес' : 'Адрес для доставки документов'}
              />
            </div>

            {billingInfo.type === 'company' && (
              <>
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-sm mb-3">Банковские реквизиты (опционально)</h4>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="bank-name">Название банка</Label>
                      <Input
                        id="bank-name"
                        value={billingInfo.bankName || ''}
                        onChange={(e) => setBillingInfo({ ...billingInfo, bankName: e.target.value })}
                        placeholder="ПАО Сбербанк"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="bik">БИК</Label>
                        <Input
                          id="bik"
                          value={billingInfo.bik || ''}
                          onChange={(e) => setBillingInfo({ ...billingInfo, bik: e.target.value })}
                          placeholder="044525225"
                          maxLength={9}
                        />
                      </div>
                      <div>
                        <Label htmlFor="account">Расчётный счёт</Label>
                        <Input
                          id="account"
                          value={billingInfo.accountNumber || ''}
                          onChange={(e) => setBillingInfo({ ...billingInfo, accountNumber: e.target.value })}
                          placeholder="40702810..."
                          maxLength={20}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <Button onClick={saveBillingInfo} className="w-full gradient-bg text-white">
            <Icon name="Save" className="mr-2" size={18} />
            Сохранить платёжную информацию
          </Button>

          <div className="bg-orange/10 border border-orange/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Icon name="AlertCircle" size={16} className="text-orange flex-shrink-0 mt-0.5" />
              <div className="text-xs text-muted-foreground">
                <p className="font-semibold mb-1">Важно</p>
                <p>
                  Эти данные будут использоваться для выставления счетов и формирования актов. 
                  Убедитесь, что все данные указаны корректно.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSettings;