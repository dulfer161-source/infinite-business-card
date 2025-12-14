import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface PricingComparisonProps {
  onSelectPlan?: (planId: string) => void;
}

const PricingComparison = ({ onSelectPlan }: PricingComparisonProps) => {
  const features = [
    {
      category: 'Основные возможности',
      items: [
        { name: 'Количество визиток', free: '1', pro: '5', business: 'Неограничено' },
        { name: 'Просмотры в месяц', free: '100', pro: '∞', business: '∞' },
        { name: 'QR-код визитки', free: true, pro: true, business: true },
        { name: 'Шаринг в соцсети', free: true, pro: true, business: true },
        { name: 'Водяной знак', free: true, pro: false, business: false }
      ]
    },
    {
      category: 'Аналитика',
      items: [
        { name: 'Базовая аналитика', free: true, pro: true, business: true },
        { name: 'Расширенная аналитика', free: false, pro: true, business: true },
        { name: 'Экспорт в PDF/Excel', free: false, pro: true, business: true },
        { name: 'История за всё время', free: '7 дней', pro: '1 год', business: '∞' },
        { name: 'Конверсия лидов', free: false, pro: true, business: true },
        { name: 'Тепловая карта кликов', free: false, pro: false, business: true }
      ]
    },
    {
      category: 'Персонализация',
      items: [
        { name: 'Готовые шаблоны', free: '3', pro: '20', business: '∞' },
        { name: 'Кастомный дизайн', free: false, pro: true, business: true },
        { name: 'Свой домен', free: false, pro: true, business: true },
        { name: 'Белый label', free: false, pro: false, business: true },
        { name: 'Собственный CSS', free: false, pro: false, business: true }
      ]
    },
    {
      category: 'Интеграции',
      items: [
        { name: 'Email уведомления', free: true, pro: true, business: true },
        { name: 'Push-уведомления', free: false, pro: true, business: true },
        { name: 'CRM интеграция', free: false, pro: true, business: true },
        { name: 'Webhook', free: false, pro: false, business: true },
        { name: 'API доступ', free: false, pro: false, business: true },
        { name: 'Zapier/Make.com', free: false, pro: false, business: true }
      ]
    },
    {
      category: 'Команда',
      items: [
        { name: 'Пользователей', free: '1', pro: '1', business: '10' },
        { name: 'Общий доступ', free: false, pro: false, business: true },
        { name: 'Роли и права', free: false, pro: false, business: true },
        { name: 'Командная статистика', free: false, pro: false, business: true }
      ]
    },
    {
      category: 'Поддержка',
      items: [
        { name: 'База знаний', free: true, pro: true, business: true },
        { name: 'Email поддержка', free: '48ч', pro: '24ч', business: '2ч' },
        { name: 'Чат поддержка', free: false, pro: true, business: true },
        { name: 'Видеозвонок', free: false, pro: false, business: true },
        { name: 'Персональный менеджер', free: false, pro: false, business: true },
        { name: 'SLA гарантия', free: false, pro: false, business: '99.9%' }
      ]
    }
  ];

  const renderValue = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Icon name="Check" size={20} className="text-green" />
      ) : (
        <Icon name="Minus" size={20} className="text-muted-foreground" />
      );
    }
    return <span className="text-sm font-medium">{value}</span>;
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold gradient-text">Детальное сравнение тарифов</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Изучите все возможности каждого плана и выберите оптимальный вариант
        </p>
      </div>

      <Card>
        <CardHeader className="bg-muted/30">
          <div className="grid grid-cols-4 gap-4 items-center">
            <div>
              <CardTitle className="text-lg">Возможность</CardTitle>
            </div>
            <div className="text-center">
              <Badge variant="outline" className="mb-2">Базовый</Badge>
              <p className="text-2xl font-bold">Бесплатно</p>
            </div>
            <div className="text-center">
              <Badge className="gradient-bg text-white mb-2">Профессиональный</Badge>
              <p className="text-2xl font-bold">490 ₽<span className="text-sm font-normal text-muted-foreground">/мес</span></p>
            </div>
            <div className="text-center">
              <Badge variant="outline" className="border-orange text-orange mb-2">Бизнес</Badge>
              <p className="text-2xl font-bold">1490 ₽<span className="text-sm font-normal text-muted-foreground">/мес</span></p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {features.map((category, categoryIndex) => (
            <div key={categoryIndex} className={categoryIndex > 0 ? 'border-t' : ''}>
              <div className="bg-muted/20 px-6 py-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Icon name="Package" size={16} className="text-blue" />
                  {category.category}
                </h3>
              </div>
              {category.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className={`grid grid-cols-4 gap-4 items-center px-6 py-4 ${
                    itemIndex % 2 === 0 ? 'bg-muted/5' : ''
                  }`}
                >
                  <div className="text-sm">{item.name}</div>
                  <div className="flex justify-center">{renderValue(item.free)}</div>
                  <div className="flex justify-center">{renderValue(item.pro)}</div>
                  <div className="flex justify-center">{renderValue(item.business)}</div>
                </div>
              ))}
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-lg">Базовый</CardTitle>
            <CardDescription>Для знакомства</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" disabled>
              <Icon name="Check" className="mr-2" size={16} />
              Текущий план
            </Button>
          </CardContent>
        </Card>

        <Card className="text-center border-blue shadow-lg shadow-blue/20">
          <CardHeader>
            <Badge className="gradient-bg text-white mx-auto mb-2">Популярный</Badge>
            <CardTitle className="text-lg">Профессиональный</CardTitle>
            <CardDescription>Для активных пользователей</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full gradient-bg text-white"
              onClick={() => onSelectPlan?.('pro')}
            >
              <Icon name="CreditCard" className="mr-2" size={16} />
              Выбрать план
            </Button>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-lg">Бизнес</CardTitle>
            <CardDescription>Для команд</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => onSelectPlan?.('business')}
            >
              <Icon name="Mail" className="mr-2" size={16} />
              Связаться с нами
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="bg-gradient-to-br from-green/10 to-blue/10 rounded-xl p-6 border border-green/20">
        <div className="flex items-start gap-4">
          <Icon name="HelpCircle" size={24} className="text-green flex-shrink-0" />
          <div>
            <h3 className="font-semibold mb-2">Не уверены, какой план выбрать?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Попробуйте Premium тариф бесплатно в течение 14 дней. Без привязки карты, 
              автоматическая отмена в конце пробного периода.
            </p>
            <Button size="sm">
              <Icon name="PlayCircle" className="mr-2" size={16} />
              Начать пробный период
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingComparison;
