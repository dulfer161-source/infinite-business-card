import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { motion, AnimatePresence } from 'framer-motion';

interface OnboardingFlowProps {
  open: boolean;
  onComplete: () => void;
  userName?: string;
}

const OnboardingFlow = ({ open, onComplete, userName = 'друг' }: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setIsVisible(true);
      setCurrentStep(0);
    }
  }, [open]);

  const steps = [
    {
      title: `Привет, ${userName}! 👋`,
      description: 'Добро пожаловать в visitka.site',
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-green/10 to-blue/10 rounded-xl p-6 border border-green/20">
            <h3 className="font-semibold mb-3">🎉 Вы успешно зарегистрировались!</h3>
            <p className="text-sm text-muted-foreground">
              Сейчас мы за 2 минуты покажем, как создать профессиональную визитку 
              и начать привлекать клиентов
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl mb-2">⚡</div>
              <div className="text-xs font-medium">Быстро</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl mb-2">🎨</div>
              <div className="text-xs font-medium">Красиво</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl mb-2">📱</div>
              <div className="text-xs font-medium">Удобно</div>
            </div>
          </div>
        </div>
      ),
      icon: 'Sparkles',
      color: 'from-green to-blue'
    },
    {
      title: 'Что вы получаете',
      description: 'Все возможности в одном месте',
      content: (
        <div className="space-y-3">
          {[
            { icon: 'CreditCard', text: 'Цифровая визитка с вашими контактами', color: 'text-green' },
            { icon: 'QrCode', text: 'QR-код для мгновенного обмена', color: 'text-blue' },
            { icon: 'Share2', text: 'Шаринг в соцсети и мессенджеры', color: 'text-purple-500' },
            { icon: 'BarChart3', text: 'Аналитика просмотров и переходов', color: 'text-orange' },
            { icon: 'Users', text: 'Сбор лидов от заинтересованных клиентов', color: 'text-green' }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
            >
              <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center">
                <Icon name={item.icon as any} size={20} className={item.color} />
              </div>
              <span className="text-sm font-medium">{item.text}</span>
            </motion.div>
          ))}
        </div>
      ),
      icon: 'Gift',
      color: 'from-blue to-purple-500'
    },
    {
      title: 'Как это работает',
      description: 'Три простых шага',
      content: (
        <div className="space-y-4">
          {[
            {
              step: '1',
              title: 'Заполните данные',
              description: 'Имя, должность, контакты — всё как на обычной визитке',
              icon: 'Edit3'
            },
            {
              step: '2',
              title: 'Настройте дизайн',
              description: 'Выберите из 37 шаблонов, сгенерируйте через AI или загрузите свой',
              icon: 'Palette'
            },
            {
              step: '3',
              title: 'Делитесь и получайте лиды',
              description: 'Отправляйте ссылку или QR-код клиентам',
              icon: 'Send'
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className="relative pl-12"
            >
              <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-gradient-to-br from-green to-blue flex items-center justify-center text-white font-bold text-sm">
                {item.step}
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name={item.icon as any} size={16} className="text-blue" />
                  <h4 className="font-semibold text-sm">{item.title}</h4>
                </div>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      ),
      icon: 'Zap',
      color: 'from-orange to-pink-500'
    },
    {
      title: 'Готовы начать?',
      description: 'Выберите, что вам удобнее',
      content: (
        <div className="space-y-4">
          <div className="grid gap-3">
            <button
              onClick={() => {
                handleComplete('tour');
              }}
              className="group relative overflow-hidden bg-gradient-to-br from-green to-blue text-white rounded-xl p-6 text-left transition-transform hover:scale-105"
            >
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <Icon name="Route" size={24} />
                  <h4 className="font-bold text-lg">Интерактивный тур</h4>
                </div>
                <p className="text-sm text-white/80">
                  Проведём вас по интерфейсу пошагово (2 минуты)
                </p>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform" />
            </button>

            <button
              onClick={() => {
                handleComplete('video');
              }}
              className="group relative overflow-hidden bg-gradient-to-br from-blue to-purple-500 text-white rounded-xl p-6 text-left transition-transform hover:scale-105"
            >
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <Icon name="PlayCircle" size={24} />
                  <h4 className="font-bold text-lg">Видео-инструкция</h4>
                </div>
                <p className="text-sm text-white/80">
                  Посмотрите короткое видео о возможностях (2 минуты)
                </p>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform" />
            </button>

            <button
              onClick={() => {
                handleComplete('skip');
              }}
              className="p-4 rounded-xl border-2 border-dashed border-muted-foreground/30 hover:border-blue/50 hover:bg-muted/50 transition-colors text-center"
            >
              <p className="text-sm font-medium text-muted-foreground">
                Пропустить — я разберусь сам
              </p>
            </button>
          </div>

          <div className="bg-blue/5 border border-blue/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Icon name="Lightbulb" size={20} className="text-blue flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">
                <strong>Совет:</strong> Рекомендуем пройти тур или посмотреть видео — 
                так вы быстрее освоите все возможности и создадите эффективную визитку
              </p>
            </div>
          </div>
        </div>
      ),
      icon: 'Rocket',
      color: 'from-green to-blue'
    }
  ];

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = (choice: 'tour' | 'video' | 'skip') => {
    setIsVisible(false);
    setTimeout(() => {
      onComplete();
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('onboarding_completed', 'true');
        localStorage.setItem('onboarding_choice', choice);
      }
    }, 300);
  };

  return (
    <Dialog open={isVisible} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl" hideClose>
        <VisuallyHidden>
          <DialogTitle>{currentStepData.title}</DialogTitle>
          <DialogDescription>{currentStepData.description}</DialogDescription>
        </VisuallyHidden>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${currentStepData.color} flex items-center justify-center`}>
                  <Icon name={currentStepData.icon as any} size={28} className="text-white" />
                </div>
                <div className="text-sm text-muted-foreground">
                  Шаг {currentStep + 1} из {steps.length}
                </div>
              </div>
              
              <Progress value={progress} className="h-2" />
              
              <div className="pt-2">
                <h2 className="text-2xl font-bold mb-1">{currentStepData.title}</h2>
                <p className="text-muted-foreground">{currentStepData.description}</p>
              </div>
            </div>

            <div className="min-h-[300px]">
              {currentStepData.content}
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 0}
              >
                <Icon name="ChevronLeft" className="mr-2" size={18} />
                Назад
              </Button>

              {currentStep < steps.length - 1 ? (
                <Button onClick={handleNext} className="gradient-bg text-white">
                  Далее
                  <Icon name="ChevronRight" className="ml-2" size={18} />
                </Button>
              ) : null}
            </div>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingFlow;