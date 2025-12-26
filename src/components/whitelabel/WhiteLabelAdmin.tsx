import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface WhiteLabelClient {
  id: number;
  company_name: string;
  subdomain?: string;
  custom_domain?: string;
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
  contact_email: string;
  max_users: number;
  max_cards_per_user: number;
  monthly_price: number;
  is_active: boolean;
}

const WhiteLabelAdmin = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [client, setClient] = useState<WhiteLabelClient>({
    id: 0,
    company_name: '',
    primary_color: '#FFD700',
    secondary_color: '#000000',
    contact_email: '',
    max_users: 10,
    max_cards_per_user: 5,
    monthly_price: 0,
    is_active: true
  });

  const handleSave = async () => {
    console.log('Saving white-label client:', client);
    // TODO: API call to save
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">White-Label Управление</h1>
        <p className="text-muted-foreground">Настройка корпоративного брендинга для B2B клиентов</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="branding">Брендинг</TabsTrigger>
          <TabsTrigger value="limits">Лимиты</TabsTrigger>
          <TabsTrigger value="billing">Биллинг</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Основная информация</CardTitle>
              <CardDescription>Базовые данные о компании-клиенте</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Название компании</Label>
                  <Input
                    id="company-name"
                    value={client.company_name}
                    onChange={(e) => setClient({ ...client, company_name: e.target.value })}
                    placeholder="ООО Ромашка"
                    className="border-gold/20 focus-visible:ring-gold/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-email">Email контакта</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={client.contact_email}
                    onChange={(e) => setClient({ ...client, contact_email: e.target.value })}
                    placeholder="admin@company.com"
                    className="border-gold/20 focus-visible:ring-gold/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subdomain">Поддомен</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="subdomain"
                      value={client.subdomain || ''}
                      onChange={(e) => setClient({ ...client, subdomain: e.target.value })}
                      placeholder="company"
                      className="border-gold/20 focus-visible:ring-gold/50"
                    />
                    <span className="text-sm text-muted-foreground whitespace-nowrap">.visitka.site</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="custom-domain">Кастомный домен</Label>
                  <Input
                    id="custom-domain"
                    value={client.custom_domain || ''}
                    onChange={(e) => setClient({ ...client, custom_domain: e.target.value })}
                    placeholder="cards.company.com"
                    className="border-gold/20 focus-visible:ring-gold/50"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium">Статус клиента</p>
                  <p className="text-sm text-muted-foreground">Активность корпоративного аккаунта</p>
                </div>
                <Badge variant={client.is_active ? 'default' : 'outline'} className="bg-green text-white">
                  {client.is_active ? 'Активен' : 'Неактивен'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Branding Tab */}
        <TabsContent value="branding" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Настройки брендинга</CardTitle>
              <CardDescription>Персонализация внешнего вида для клиента</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="logo-url">URL логотипа</Label>
                <Input
                  id="logo-url"
                  type="url"
                  value={client.logo_url || ''}
                  onChange={(e) => setClient({ ...client, logo_url: e.target.value })}
                  placeholder="https://company.com/logo.png"
                  className="border-gold/20 focus-visible:ring-gold/50"
                />
                {client.logo_url && (
                  <div className="mt-2">
                    <img
                      src={client.logo_url}
                      alt="Logo preview"
                      className="h-16 object-contain border border-gold/20 rounded p-2"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Основной цвет</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primary-color"
                      type="color"
                      value={client.primary_color}
                      onChange={(e) => setClient({ ...client, primary_color: e.target.value })}
                      className="w-20 h-10 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={client.primary_color}
                      onChange={(e) => setClient({ ...client, primary_color: e.target.value })}
                      className="flex-1 border-gold/20 focus-visible:ring-gold/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondary-color">Вторичный цвет</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondary-color"
                      type="color"
                      value={client.secondary_color}
                      onChange={(e) => setClient({ ...client, secondary_color: e.target.value })}
                      className="w-20 h-10 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={client.secondary_color}
                      onChange={(e) => setClient({ ...client, secondary_color: e.target.value })}
                      className="flex-1 border-gold/20 focus-visible:ring-gold/50"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r rounded-lg" style={{ 
                backgroundColor: client.primary_color,
                color: client.secondary_color
              }}>
                <p className="text-center font-medium">Предпросмотр цветовой схемы</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Limits Tab */}
        <TabsContent value="limits" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Лимиты и ограничения</CardTitle>
              <CardDescription>Управление ресурсами для корпоративного клиента</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="max-users">Максимум пользователей</Label>
                  <Input
                    id="max-users"
                    type="number"
                    value={client.max_users}
                    onChange={(e) => setClient({ ...client, max_users: parseInt(e.target.value) || 0 })}
                    min="1"
                    className="border-gold/20 focus-visible:ring-gold/50"
                  />
                  <p className="text-xs text-muted-foreground">Количество сотрудников компании</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-cards">Визиток на пользователя</Label>
                  <Input
                    id="max-cards"
                    type="number"
                    value={client.max_cards_per_user}
                    onChange={(e) => setClient({ ...client, max_cards_per_user: parseInt(e.target.value) || 0 })}
                    min="1"
                    className="border-gold/20 focus-visible:ring-gold/50"
                  />
                  <p className="text-xs text-muted-foreground">Лимит визиток на одного сотрудника</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="p-4 bg-blue/10 border border-blue/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="Users" size={20} className="text-blue" />
                    <p className="font-medium">Всего визиток</p>
                  </div>
                  <p className="text-2xl font-bold">{client.max_users * client.max_cards_per_user}</p>
                  <p className="text-xs text-muted-foreground mt-1">Максимальная емкость</p>
                </div>

                <div className="p-4 bg-green/10 border border-green/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="TrendingUp" size={20} className="text-green" />
                    <p className="font-medium">Потенциал роста</p>
                  </div>
                  <p className="text-2xl font-bold">Безлимит</p>
                  <p className="text-xs text-muted-foreground mt-1">При обновлении тарифа</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Биллинг и тарификация</CardTitle>
              <CardDescription>Стоимость корпоративного обслуживания</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="monthly-price">Стоимость в месяц (₽)</Label>
                <Input
                  id="monthly-price"
                  type="number"
                  value={client.monthly_price}
                  onChange={(e) => setClient({ ...client, monthly_price: parseFloat(e.target.value) || 0 })}
                  min="0"
                  step="100"
                  className="border-gold/20 focus-visible:ring-gold/50"
                />
              </div>

              <div className="p-6 bg-gradient-to-br from-gold/10 to-gold/5 border-2 border-gold/20 rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Месячный платеж</p>
                  <p className="text-4xl font-bold text-gold mb-1">{client.monthly_price.toLocaleString('ru-RU')} ₽</p>
                  <p className="text-sm text-muted-foreground">
                    {client.max_users} пользователей × {client.max_cards_per_user} визиток
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <p className="text-2xl font-bold">{(client.monthly_price * 12).toLocaleString('ru-RU')} ₽</p>
                  <p className="text-xs text-muted-foreground mt-1">Годовой доход</p>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <p className="text-2xl font-bold">
                    {client.max_users > 0 ? Math.round(client.monthly_price / client.max_users) : 0} ₽
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">На пользователя</p>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <p className="text-2xl font-bold">
                    {(client.max_users * client.max_cards_per_user) > 0 
                      ? Math.round(client.monthly_price / (client.max_users * client.max_cards_per_user))
                      : 0} ₽
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">На визитку</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 flex justify-end gap-4">
        <Button variant="outline" className="border-gold/50">
          <Icon name="X" size={16} className="mr-2" />
          Отмена
        </Button>
        <Button onClick={handleSave} className="bg-gold text-black hover:bg-gold/90">
          <Icon name="Save" size={16} className="mr-2" />
          Сохранить изменения
        </Button>
      </div>
    </div>
  );
};

export default WhiteLabelAdmin;
