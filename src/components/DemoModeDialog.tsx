import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface DemoModeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectPlan: (plan: 'free' | 'basic' | 'pro') => void;
}

const DemoModeDialog = ({ open, onOpenChange, onSelectPlan }: DemoModeDialogProps) => {
  const [selectedDemo, setSelectedDemo] = useState<'free' | 'basic' | 'pro' | null>(null);

  const demoPlans = [
    {
      id: 'free' as const,
      name: 'Бесплатный',
      color: 'gray',
      icon: 'Rocket',
      description: 'Базовые возможности для знакомства',
      features: [
        'Создание 1 визитки',
        'Базовый дизайн',
        'QR-код для визитки',
        'Публичная ссылка',
        'Базовая статистика'
      ],
      limitations: [
        'Реклама в визитке',
        'Базовые шаблоны',
        'Нет интеграций'
      ]
    },
    {
      id: 'basic' as const,
      name: 'Базовый',
      color: 'green',
      icon: 'Zap',
      description: 'Для предпринимателей и фрилансеров',
      features: [
        'До 5 визиток',
        'Премиум дизайн',
        'Портфолио и отзывы',
        'Форма сбора заявок',
        'Подробная аналитика',
        'Интеграция с соцсетями'
      ],
      limitations: [
        'Без рекламы',
        'Email поддержка',
        'Базовые интеграции'
      ]
    },
    {
      id: 'pro' as const,
      name: 'Профессиональный',
      color: 'blue',
      icon: 'Crown',
      description: 'Для команд и агентств',
      features: [
        'До 50 визиток',
        'Корпоративный дизайн',
        'Командное управление',
        'CRM интеграции',
        'Расширенная аналитика',
        'API доступ',
        'Приоритетная поддержка'
      ],
      limitations: [
        'Все возможности включены',
        'Поддержка 24/7',
        'Персональный менеджер'
      ]
    }
  ];

  const colorMap = {
    gray: {
      badge: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
      button: 'bg-gray-500 hover:bg-gray-600',
      icon: 'bg-gray-500'
    },
    green: {
      badge: 'bg-green/10 text-green border-green/20',
      button: 'bg-green hover:bg-green/90',
      icon: 'bg-green'
    },
    blue: {
      badge: 'bg-blue/10 text-blue border-blue/20',
      button: 'bg-blue hover:bg-blue/90',
      icon: 'bg-blue'
    }
  };

  const handleStartDemo = () => {
    if (selectedDemo) {
      onSelectPlan(selectedDemo);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl gradient-text">Демо-режим</DialogTitle>
          <DialogDescription className="text-base">
            Протестируйте все возможности тарифов без регистрации. Выберите тариф для демонстрации.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {demoPlans.map((plan) => {
            const colors = colorMap[plan.color as keyof typeof colorMap];
            const isSelected = selectedDemo === plan.id;

            return (
              <div
                key={plan.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  isSelected 
                    ? 'border-2 border-blue shadow-lg scale-105' 
                    : 'border-border hover:border-green/50'
                }`}
                onClick={() => setSelectedDemo(plan.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 ${colors.icon} rounded-lg flex items-center justify-center`}>
                    <Icon name={plan.icon as any} className="text-white" size={20} />
                  </div>
                  {isSelected && (
                    <Icon name="CheckCircle2" className="text-blue" size={24} />
                  )}
                </div>

                <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
                <p className="text-xs text-muted-foreground mb-3">{plan.description}</p>

                <Badge className={`${colors.badge} mb-3 text-xs`}>
                  Демо-доступ
                </Badge>

                <div className="space-y-2 mb-3">
                  <div className="text-xs font-semibold text-muted-foreground">Возможности:</div>
                  {plan.features.slice(0, 4).map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Icon name="Check" className="text-green flex-shrink-0 mt-0.5" size={14} />
                      <span className="text-xs">{feature}</span>
                    </div>
                  ))}
                  {plan.features.length > 4 && (
                    <div className="text-xs text-muted-foreground">
                      +{plan.features.length - 4} возможностей
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-muted/30 p-4 rounded-lg space-y-2">
          <div className="flex items-center gap-2">
            <Icon name="Info" className="text-blue" size={18} />
            <span className="font-semibold text-sm">Что входит в демо-режим:</span>
          </div>
          <ul className="text-sm text-muted-foreground space-y-1 ml-7">
            <li>• Полный доступ ко всем функциям выбранного тарифа</li>
            <li>• Тестовые данные и примеры использования</li>
            <li>• Возможность создать и отредактировать визитку</li>
            <li>• Просмотр аналитики и интеграций</li>
            <li>• Данные не сохраняются после закрытия демо-режима</li>
          </ul>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Отмена
          </Button>
          <Button
            className="flex-1 gradient-bg text-white hover:opacity-90"
            onClick={handleStartDemo}
            disabled={!selectedDemo}
          >
            <Icon name="PlayCircle" className="mr-2" size={18} />
            Начать демо
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DemoModeDialog;
