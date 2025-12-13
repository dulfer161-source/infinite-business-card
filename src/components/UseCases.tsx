import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const UseCases = () => {
  const useCases = [
    {
      title: 'Для предпринимателей',
      icon: 'Briefcase',
      color: 'blue',
      description: 'Профессиональная визитка для роста бизнеса',
      features: [
        'QR-код для мгновенного сохранения контактов',
        'Портфолио работ и отзывы клиентов',
        'Сбор заявок через встроенные формы',
        'Аналитика источников трафика',
        'Интеграция с CRM системами'
      ],
      stats: [
        { value: '+47%', label: 'рост конверсий' },
        { value: '3 мин', label: 'на создание' }
      ]
    },
    {
      title: 'Для агентств и команд',
      icon: 'Users',
      color: 'green',
      description: 'Единый корпоративный стиль для всей команды',
      features: [
        'Визитки для всех сотрудников в едином стиле',
        'Централизованное управление из одной панели',
        'Командная аналитика и отчёты',
        'Интеграция с Active Directory',
        'Массовое обновление информации'
      ],
      stats: [
        { value: 'до 50', label: 'сотрудников' },
        { value: '1 день', label: 'внедрение' }
      ]
    },
    {
      title: 'Для корпораций',
      icon: 'Building2',
      color: 'orange',
      description: 'Масштабируемое решение для крупного бизнеса',
      features: [
        'Безлимитное количество визиток',
        'API для автоматизации и интеграций',
        'Персональный менеджер поддержки',
        'SLA 99.9% и приоритетная поддержка',
        'Детальная аналитика по подразделениям'
      ],
      stats: [
        { value: '500+', label: 'сотрудников' },
        { value: '99.9%', label: 'uptime SLA' }
      ]
    }
  ];

  const colorMap = {
    blue: {
      badge: 'bg-blue/10 text-blue border-blue/20',
      icon: 'bg-blue',
      card: 'border-blue/20 hover:border-blue/50 hover:shadow-blue/10',
      accent: 'text-blue'
    },
    green: {
      badge: 'bg-green/10 text-green border-green/20',
      icon: 'bg-green',
      card: 'border-green/20 hover:border-green/50 hover:shadow-green/10',
      accent: 'text-green'
    },
    orange: {
      badge: 'bg-orange/10 text-orange border-orange/20',
      icon: 'gradient-accent',
      card: 'border-orange/20 hover:border-orange/50 hover:shadow-orange/10',
      accent: 'text-orange'
    }
  };

  return (
    <section className="py-24 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <Badge className="mb-4 gradient-bg text-white font-semibold border-0">Решения</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Для каждого бизнеса
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Профессиональные цифровые визитки для роста вашего бизнеса
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {useCases.map((useCase, index) => {
            const colors = colorMap[useCase.color as keyof typeof colorMap];
            return (
              <Card 
                key={index}
                className={`border transition-all duration-300 hover:scale-105 hover:shadow-xl ${colors.card}`}
              >
                <CardHeader>
                  <div className={`w-16 h-16 ${colors.icon} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon name={useCase.icon as any} className="text-white" size={32} />
                  </div>
                  <CardTitle className="text-2xl">{useCase.title}</CardTitle>
                  <CardDescription className="text-base">{useCase.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {useCase.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Icon 
                          name="Check" 
                          className={`${colors.accent} mt-0.5 flex-shrink-0`}
                          size={20}
                        />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    {useCase.stats.map((stat, idx) => (
                      <div key={idx} className="text-center">
                        <div className={`text-2xl font-bold ${colors.accent}`}>{stat.value}</div>
                        <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <div className="bg-card border border-green/20 rounded-lg p-6 text-center hover:border-green/40 transition-colors">
            <div className="text-3xl font-bold gradient-text mb-2">10 000+</div>
            <div className="text-sm text-muted-foreground">Активных визиток</div>
          </div>
          <div className="bg-card border border-blue/20 rounded-lg p-6 text-center hover:border-blue/40 transition-colors">
            <div className="text-3xl font-bold gradient-text mb-2">500+</div>
            <div className="text-sm text-muted-foreground">Компаний-клиентов</div>
          </div>
          <div className="bg-card border border-orange/20 rounded-lg p-6 text-center hover:border-orange/40 transition-colors">
            <div className="text-3xl font-bold gradient-text mb-2">99.9%</div>
            <div className="text-sm text-muted-foreground">Uptime сервиса</div>
          </div>
          <div className="bg-card border border-green/20 rounded-lg p-6 text-center hover:border-green/40 transition-colors">
            <div className="text-3xl font-bold gradient-text mb-2">24/7</div>
            <div className="text-sm text-muted-foreground">Техподдержка</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UseCases;
