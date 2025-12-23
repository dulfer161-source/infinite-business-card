import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

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

const BillingInfoForm = () => {
  const [billingInfo, setBillingInfo] = useState<BillingInfo>({
    type: 'individual',
    fullName: '',
    email: '',
    phone: '',
    address: ''
  });

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
    const savedBilling = localStorage.getItem('billing_info');
    if (savedBilling) {
      try {
        setBillingInfo(JSON.parse(savedBilling));
      } catch (e) {
        console.error('Failed to load billing info:', e);
      }
    }
  }, []);

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

  return (
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
      <CardContent>
        <Tabs
          value={billingInfo.type}
          onValueChange={(value) => setBillingInfo({ ...billingInfo, type: value as 'individual' | 'company' })}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="individual">Физ. лицо</TabsTrigger>
            <TabsTrigger value="company">Юр. лицо</TabsTrigger>
          </TabsList>

          <TabsContent value="individual" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">ФИО *</Label>
              <Input
                id="fullName"
                value={billingInfo.fullName}
                onChange={(e) => setBillingInfo({ ...billingInfo, fullName: e.target.value })}
                placeholder="Иванов Иван Иванович"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={billingInfo.email}
                onChange={(e) => setBillingInfo({ ...billingInfo, email: e.target.value })}
                placeholder="email@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Телефон *</Label>
              <Input
                id="phone"
                type="tel"
                value={billingInfo.phone}
                onChange={(e) => {
                  const formatted = formatPhone(e.target.value);
                  setBillingInfo({ ...billingInfo, phone: formatted });
                }}
                placeholder="+7 (900) 123-45-67"
                maxLength={18}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Адрес</Label>
              <Input
                id="address"
                value={billingInfo.address}
                onChange={(e) => setBillingInfo({ ...billingInfo, address: e.target.value })}
                placeholder="Город, улица, дом, квартира"
              />
            </div>

            <Button onClick={saveBillingInfo} className="w-full">
              <Icon name="Save" className="mr-2" size={16} />
              Сохранить информацию
            </Button>
          </TabsContent>

          <TabsContent value="company" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Название организации *</Label>
              <Input
                id="companyName"
                value={billingInfo.companyName || ''}
                onChange={(e) => setBillingInfo({ ...billingInfo, companyName: e.target.value })}
                placeholder='ООО "Компания"'
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="inn">ИНН *</Label>
                <Input
                  id="inn"
                  value={billingInfo.inn || ''}
                  onChange={(e) => setBillingInfo({ ...billingInfo, inn: e.target.value })}
                  placeholder="1234567890"
                  maxLength={12}
                />
              </div>

              <div className="space-y-2">
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

            <div className="space-y-2">
              <Label htmlFor="ogrn">ОГРН</Label>
              <Input
                id="ogrn"
                value={billingInfo.ogrn || ''}
                onChange={(e) => setBillingInfo({ ...billingInfo, ogrn: e.target.value })}
                placeholder="1234567890123"
                maxLength={13}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Контактное лицо *</Label>
              <Input
                id="fullName"
                value={billingInfo.fullName}
                onChange={(e) => setBillingInfo({ ...billingInfo, fullName: e.target.value })}
                placeholder="Иванов Иван Иванович"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={billingInfo.email}
                onChange={(e) => setBillingInfo({ ...billingInfo, email: e.target.value })}
                placeholder="email@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Телефон *</Label>
              <Input
                id="phone"
                type="tel"
                value={billingInfo.phone}
                onChange={(e) => {
                  const formatted = formatPhone(e.target.value);
                  setBillingInfo({ ...billingInfo, phone: formatted });
                }}
                placeholder="+7 (900) 123-45-67"
                maxLength={18}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Юридический адрес</Label>
              <Input
                id="address"
                value={billingInfo.address}
                onChange={(e) => setBillingInfo({ ...billingInfo, address: e.target.value })}
                placeholder="Город, улица, дом, офис"
              />
            </div>

            <div className="border-t pt-4">
              <p className="text-sm font-medium mb-3">Банковские реквизиты (опционально)</p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bankName">Наименование банка</Label>
                  <Input
                    id="bankName"
                    value={billingInfo.bankName || ''}
                    onChange={(e) => setBillingInfo({ ...billingInfo, bankName: e.target.value })}
                    placeholder="ПАО Сбербанк"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bik">БИК</Label>
                    <Input
                      id="bik"
                      value={billingInfo.bik || ''}
                      onChange={(e) => setBillingInfo({ ...billingInfo, bik: e.target.value })}
                      placeholder="044525225"
                      maxLength={9}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Расчётный счёт</Label>
                    <Input
                      id="accountNumber"
                      value={billingInfo.accountNumber || ''}
                      onChange={(e) => setBillingInfo({ ...billingInfo, accountNumber: e.target.value })}
                      placeholder="40702810..."
                      maxLength={20}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button onClick={saveBillingInfo} className="w-full">
              <Icon name="Save" className="mr-2" size={16} />
              Сохранить информацию
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BillingInfoForm;
