import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard = ({ onLogout }: DashboardProps) => {
  const [userInfo, setUserInfo] = useState({
    name: 'Иван Петров',
    position: 'Генеральный директор',
    company: 'ООО "Инновационные решения"',
    phone: '+7 (999) 123-45-67',
    email: 'ivan@company.ru',
    website: 'company.ru',
    description: 'Предлагаем комплексные решения в области IT-консалтинга и автоматизации бизнес-процессов'
  });

  const messengers = [
    { name: 'Telegram', icon: 'Send', color: 'text-blue-500', url: `https://t.me/share/url?url=${encodeURIComponent(window.location.origin)}&text=${encodeURIComponent(`Моя визитка: ${userInfo.name}`)}` },
    { name: 'VK', icon: 'Share2', color: 'text-blue-600', url: `https://vk.com/share.php?url=${encodeURIComponent(window.location.origin)}&title=${encodeURIComponent(userInfo.name)}` },
    { name: 'Одноклассники', icon: 'Users', color: 'text-orange-500', url: `https://connect.ok.ru/offer?url=${encodeURIComponent(window.location.origin)}&title=${encodeURIComponent(userInfo.name)}` },
    { name: 'Скопировать ссылку', icon: 'Link', color: 'text-gray-500', url: '' }
  ];

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=BEGIN:VCARD%0AVERSION:3.0%0AFN:${encodeURIComponent(userInfo.name)}%0ATEL:${encodeURIComponent(userInfo.phone)}%0AEMAIL:${encodeURIComponent(userInfo.email)}%0AEND:VCARD`;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gold">∞7</span>
            <span className="text-xl font-semibold">visitka.site</span>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="border-gold text-gold">Базовый тариф</Badge>
            <Button variant="ghost" onClick={onLogout}>
              <Icon name="LogOut" className="mr-2" size={18} />
              Выйти
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Личный кабинет</h1>
          <p className="text-muted-foreground">Управляйте своей цифровой визиткой</p>
        </div>

        <Tabs defaultValue="card" className="space-y-6">
          <TabsList>
            <TabsTrigger value="card">
              <Icon name="CreditCard" className="mr-2" size={18} />
              Моя визитка
            </TabsTrigger>
            <TabsTrigger value="edit">
              <Icon name="Edit" className="mr-2" size={18} />
              Редактировать
            </TabsTrigger>
            <TabsTrigger value="media">
              <Icon name="Image" className="mr-2" size={18} />
              Макеты
            </TabsTrigger>
            <TabsTrigger value="upgrade">
              <Icon name="Sparkles" className="mr-2" size={18} />
              Подписка
            </TabsTrigger>
          </TabsList>

          <TabsContent value="card" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="border-gold/20 shadow-lg">
                  <CardHeader className="bg-gradient-to-br from-black to-secondary text-white">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-2xl mb-2">{userInfo.name}</CardTitle>
                        <CardDescription className="text-gray-300 text-base">
                          {userInfo.position}
                        </CardDescription>
                        <p className="text-gold font-semibold mt-1">{userInfo.company}</p>
                      </div>
                      <div className="text-4xl">∞7</div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center">
                          <Icon name="Phone" className="text-gold" size={20} />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Телефон</p>
                          <p className="font-semibold">{userInfo.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center">
                          <Icon name="Mail" className="text-gold" size={20} />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-semibold">{userInfo.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center">
                          <Icon name="Globe" className="text-gold" size={20} />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Веб-сайт</p>
                          <p className="font-semibold">{userInfo.website}</p>
                        </div>
                      </div>
                      <div className="pt-4 border-t">
                        <p className="text-sm text-muted-foreground mb-2">О компании</p>
                        <p className="text-sm">{userInfo.description}</p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <p className="text-sm font-semibold mb-3">Поделиться визиткой</p>
                      <div className="flex gap-3">
                        {messengers.map((messenger) => (
                          <Button
                            key={messenger.name}
                            variant="outline"
                            size="icon"
                            className="hover-scale"
                            title={messenger.name}
                            onClick={() => {
                              if (messenger.name === 'Скопировать ссылку') {
                                navigator.clipboard.writeText(window.location.origin);
                                alert('Ссылка скопирована!');
                              } else {
                                window.open(messenger.url, '_blank');
                              }
                            }}
                          >
                            <Icon name={messenger.icon as any} className={messenger.color} size={20} />
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="border-gold/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon name="QrCode" className="text-gold" size={24} />
                      QR-код визитки
                    </CardTitle>
                    <CardDescription>
                      Отсканируйте для быстрого добавления контакта
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-white p-4 rounded-lg">
                      <img 
                        src={qrCodeUrl} 
                        alt="QR код визитки" 
                        className="w-full h-auto"
                      />
                    </div>
                    <Button className="w-full mt-4 bg-gold text-black hover:bg-gold/90">
                      <Icon name="Download" className="mr-2" size={18} />
                      Скачать QR-код
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="edit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Редактировать информацию</CardTitle>
                <CardDescription>Обновите данные вашей визитки</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">ФИО</Label>
                    <Input 
                      id="name" 
                      value={userInfo.name}
                      onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="position">Должность</Label>
                    <Input 
                      id="position" 
                      value={userInfo.position}
                      onChange={(e) => setUserInfo({...userInfo, position: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Компания</Label>
                    <Input 
                      id="company" 
                      value={userInfo.company}
                      onChange={(e) => setUserInfo({...userInfo, company: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Телефон</Label>
                    <Input 
                      id="phone" 
                      value={userInfo.phone}
                      onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email"
                      value={userInfo.email}
                      onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Веб-сайт</Label>
                    <Input 
                      id="website" 
                      value={userInfo.website}
                      onChange={(e) => setUserInfo({...userInfo, website: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Описание предложения</Label>
                  <Textarea 
                    id="description" 
                    rows={4}
                    value={userInfo.description}
                    onChange={(e) => setUserInfo({...userInfo, description: e.target.value})}
                  />
                </div>
                <Button className="bg-gold text-black hover:bg-gold/90">
                  <Icon name="Save" className="mr-2" size={18} />
                  Сохранить изменения
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="media" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Макеты и логотипы</CardTitle>
                <CardDescription>Загрузите изображения для вашей визитки за 79₽</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-gold/50 transition-colors cursor-pointer">
                  <Icon name="Upload" className="mx-auto mb-4 text-muted-foreground" size={48} />
                  <p className="text-lg font-semibold mb-2">Загрузить макет</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Поддерживаются форматы: JPG, PNG, SVG (макс. 5 МБ)
                  </p>
                  <Button className="bg-gold text-black hover:bg-gold/90">
                    Выбрать файл (79₽)
                  </Button>
                </div>

                <div className="mt-6">
                  <p className="text-sm text-muted-foreground">Загруженных изображений пока нет</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upgrade" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-gold shadow-lg shadow-gold/20">
                <CardHeader>
                  <Badge className="w-fit mb-2 bg-gold text-black">Популярный</Badge>
                  <CardTitle className="text-2xl">Премиум</CardTitle>
                  <CardDescription>AI-генерация макетов и логотипов</CardDescription>
                  <div className="pt-4">
                    <span className="text-4xl font-bold">790₽</span>
                    <span className="text-muted-foreground ml-2">в год</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2">
                      <Icon name="Check" className="text-gold mt-0.5" size={20} />
                      <span className="text-sm">AI-генерация изображений</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Check" className="text-gold mt-0.5" size={20} />
                      <span className="text-sm">Безлимитные макеты с ИИ</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Check" className="text-gold mt-0.5" size={20} />
                      <span className="text-sm">Приоритетная поддержка</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Check" className="text-gold mt-0.5" size={20} />
                      <span className="text-sm">Расширенная аналитика</span>
                    </li>
                  </ul>
                  <Button className="w-full bg-gold text-black hover:bg-gold/90">
                    <Icon name="Sparkles" className="mr-2" size={18} />
                    Подключить Премиум
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Корпоративный</CardTitle>
                  <CardDescription>Пакет для команды из 20 сотрудников</CardDescription>
                  <div className="pt-4">
                    <span className="text-4xl font-bold">970₽</span>
                    <span className="text-muted-foreground ml-2">в год</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2">
                      <Icon name="Check" className="text-primary mt-0.5" size={20} />
                      <span className="text-sm">20 регистраций сотрудников</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Check" className="text-primary mt-0.5" size={20} />
                      <span className="text-sm">Единый дизайн компании</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Check" className="text-primary mt-0.5" size={20} />
                      <span className="text-sm">Корпоративные макеты</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Check" className="text-primary mt-0.5" size={20} />
                      <span className="text-sm">Персональный менеджер</span>
                    </li>
                  </ul>
                  <Button className="w-full" variant="outline">
                    <Icon name="Building" className="mr-2" size={18} />
                    Оформить для команды
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;