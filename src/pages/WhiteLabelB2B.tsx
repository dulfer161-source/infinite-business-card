import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import Logo from '@/components/Logo';
import Footer from '@/components/Footer';

const WhiteLabelB2B = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    employees: '10-50'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // TODO: Send to backend
  };

  const features = [
    {
      icon: 'Palette',
      title: 'Полный ребрендинг',
      description: 'Ваш логотип, цвета и домен'
    },
    {
      icon: 'Users',
      title: 'Управление сотрудниками',
      description: 'Централизованная панель администратора'
    },
    {
      icon: 'Shield',
      title: 'Безопасность данных',
      description: 'Корпоративная защита информации'
    },
    {
      icon: 'BarChart3',
      title: 'Аналитика команды',
      description: 'Отслеживание эффективности визиток'
    },
    {
      icon: 'Globe',
      title: 'Кастомный домен',
      description: 'cards.yourcompany.com'
    },
    {
      icon: 'Headphones',
      title: 'Приоритетная поддержка',
      description: 'Личный менеджер и SLA 99.9%'
    }
  ];

  const pricing = [
    {
      name: 'Стартап',
      employees: '10-50',
      price: '9 990',
      features: [
        'До 50 сотрудников',
        '5 визиток на сотрудника',
        'Ваш логотип и цвета',
        'Поддомен',
        'Базовая аналитика',
        'Email поддержка'
      ]
    },
    {
      name: 'Бизнес',
      employees: '50-200',
      price: '29 990',
      popular: true,
      features: [
        'До 200 сотрудников',
        'Безлимитные визитки',
        'Полный ребрендинг',
        'Кастомный домен',
        'Расширенная аналитика',
        'Приоритетная поддержка',
        'API доступ'
      ]
    },
    {
      name: 'Корпорация',
      employees: '200+',
      price: 'По запросу',
      features: [
        'Безлимит сотрудников',
        'Все возможности Бизнес',
        'Интеграция с Active Directory',
        'SSO авторизация',
        'Персональный менеджер',
        'SLA 99.9%',
        'Индивидуальные доработки'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-gold/20 sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo size="lg" />
          <Button className="bg-gold text-black hover:bg-gold/90">
            <Icon name="Phone" size={16} className="mr-2" />
            Связаться
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-blue/5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-gold/10 text-gold border-gold/20 text-sm">
              White-Label Решение
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
              Цифровые визитки для вашей компании
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Готовая платформа под вашим брендом для создания визиток сотрудников
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gold text-black hover:bg-gold/90 text-lg px-8">
                <Icon name="Calendar" size={20} className="mr-2" />
                Записаться на демо
              </Button>
              <Button size="lg" variant="outline" className="border-gold/50 text-lg px-8">
                <Icon name="FileText" size={20} className="mr-2" />
                Скачать презентацию
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Все инструменты для вашего бизнеса
            </h2>
            <p className="text-xl text-muted-foreground">
              Полный контроль над брендингом и управлением
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="border-gold/20 hover:border-gold/40 transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center mb-4">
                    <Icon name={feature.icon as any} size={24} className="text-gold" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Прозрачная тарификация
            </h2>
            <p className="text-xl text-muted-foreground">
              Выберите план под размер вашей компании
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {pricing.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative ${
                  plan.popular 
                    ? 'border-2 border-gold shadow-xl shadow-gold/20 scale-105' 
                    : 'border-gold/20'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gold text-black px-4 py-1">Популярный</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="text-base">{plan.employees} сотрудников</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.price !== 'По запросу' && <span className="text-muted-foreground"> ₽/мес</span>}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Icon name="Check" size={20} className="text-green mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full mt-6 ${
                      plan.popular 
                        ? 'bg-gold text-black hover:bg-gold/90' 
                        : 'bg-muted text-foreground hover:bg-muted/80'
                    }`}
                  >
                    {plan.price === 'По запросу' ? 'Связаться' : 'Выбрать план'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="border-gold/20">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl">Получить консультацию</CardTitle>
                <CardDescription className="text-base">
                  Оставьте заявку, и наш менеджер свяжется с вами в течение часа
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Название компании *</Label>
                      <Input
                        id="companyName"
                        required
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        placeholder="ООО Ромашка"
                        className="border-gold/20 focus-visible:ring-gold/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactName">Ваше имя *</Label>
                      <Input
                        id="contactName"
                        required
                        value={formData.contactName}
                        onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                        placeholder="Иван Иванов"
                        className="border-gold/20 focus-visible:ring-gold/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="admin@company.com"
                        className="border-gold/20 focus-visible:ring-gold/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Телефон *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+7 (999) 123-45-67"
                        className="border-gold/20 focus-visible:ring-gold/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employees">Количество сотрудников</Label>
                    <select
                      id="employees"
                      value={formData.employees}
                      onChange={(e) => setFormData({ ...formData, employees: e.target.value })}
                      className="w-full h-10 px-3 py-2 text-sm bg-background border border-gold/20 rounded-md focus:outline-none focus:ring-2 focus:ring-gold/50"
                    >
                      <option value="1-10">1-10</option>
                      <option value="10-50">10-50</option>
                      <option value="50-200">50-200</option>
                      <option value="200+">200+</option>
                    </select>
                  </div>

                  <Button type="submit" className="w-full bg-gold text-black hover:bg-gold/90">
                    <Icon name="Send" size={16} className="mr-2" />
                    Отправить заявку
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default WhiteLabelB2B;
