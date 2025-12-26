import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import FadeIn from '@/components/animations/FadeIn';
import ScaleIn from '@/components/animations/ScaleIn';
import AnimatedCard from '@/components/ui/animated-card';

interface PricingProps {
  onSelectPlan: (planName: string, price: string) => void;
}

const Pricing = ({ onSelectPlan }: PricingProps) => {
  const plans = [
    {
      name: 'Базовый',
      price: '0',
      description: 'Для начала работы с цифровой визиткой',
      features: [
        'Регистрация визитки',
        'QR-код с контактами',
        'Шеринг в мессенджеры',
        'Просмотр статистики',
        'Загрузка макетов',
        'Генерация макетов с ИИ',
        '❌ Брендинг платформы'
      ],
      cta: 'Начать бесплатно',
      popular: false,
      canRemoveBranding: false
    },
    {
      name: 'Премиум',
      price: '790',
      period: 'в год',
      description: 'Безлимитные макеты + монетизация рекламы',
      features: [
        'Всё из Базового',
        'Безлимитные макеты с ИИ',
        '✅ Персональный брендинг',
        '✅ Отключение брендинга платформы',
        'Продажа рекламы на визитке',
        'Управление рекламными зонами',
        'Приоритетная поддержка',
        'Расширенная аналитика'
      ],
      cta: 'Подключить Премиум',
      popular: true,
      canRemoveBranding: true
    },
    {
      name: 'Бизнес',
      price: '1990',
      period: 'в год',
      description: 'Для команд до 10 человек',
      features: [
        'Всё из Премиум',
        '✅ Полный контроль брендинга',
        '10 визиток сотрудников',
        'Единый корп. стиль',
        'Командная панель управления',
        'Аналитика по команде',
        'Приоритетная поддержка'
      ],
      cta: 'Для команды',
      popular: false,
      canRemoveBranding: true
    },
    {
      name: 'Корпоративный',
      price: 'от 9990',
      period: 'в год',
      description: 'Для компаний от 50 сотрудников',
      features: [
        'Всё из Бизнес',
        'Безлимитное кол-во визиток',
        'Интеграция с Active Directory',
        'API для автоматизации',
        'Единая аналитика компании',
        'Персональный менеджер',
        'SLA 99.9%'
      ],
      cta: 'Связаться с нами',
      popular: false,
      canRemoveBranding: true
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <FadeIn>
            <Badge className="mb-4 bg-green/10 text-green border-green/20 font-semibold">Тарифы</Badge>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
              Выберите свой план
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              От бесплатного старта до корпоративного решения
            </p>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <ScaleIn key={index} delay={index * 0.1}>
              <Card 
              key={index}
              className={`relative overflow-hidden transition-all duration-300 hover:scale-105 ${
                plan.popular 
                  ? 'border-2 border-blue shadow-2xl shadow-blue/30 bg-gradient-to-br from-card to-blue/5' 
                  : 'border border-border hover:border-green/50 hover:shadow-lg hover:shadow-green/10'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 gradient-bg text-white text-xs font-semibold px-4 py-1.5 rounded-bl-lg shadow-lg">
                  Популярный
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="text-base">{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className={`text-4xl font-bold ${plan.popular ? 'gradient-text' : ''}`}>{plan.price}₽</span>
                  {plan.period && <span className="text-muted-foreground ml-2">{plan.period}</span>}
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Icon 
                        name="Check" 
                        className={`${plan.popular ? 'text-blue' : 'text-green'} mt-0.5 flex-shrink-0`}
                        size={20}
                      />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  onClick={() => onSelectPlan(plan.name, plan.price)}
                  className={`w-full ${
                    plan.popular
                      ? 'bg-gold text-black hover:bg-gold/90'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {plan.cta}
                </Button>
              </CardFooter>
                <Button 
                  className={`w-full font-semibold transition-all duration-300 ${
                    plan.popular 
                      ? 'gradient-bg text-white hover:opacity-90 shadow-lg shadow-blue/30 hover:shadow-green/50' 
                      : 'gradient-accent text-white hover:opacity-90 shadow-lg shadow-orange/30'
                  }`}
                  onClick={() => onSelectPlan(plan.name, plan.price)}
                  disabled={plan.name === 'Базовый'}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
            </ScaleIn>
          ))}
        </div>

        <div className="mt-16 text-center text-muted-foreground">
          <p className="text-sm">Все тарифы включают SSL-шифрование и резервное копирование данных</p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;