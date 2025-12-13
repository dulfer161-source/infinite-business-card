import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

interface TooltipStep {
  target: string;
  title: string;
  description: string;
  icon: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

interface AnimatedTooltipsProps {
  steps: TooltipStep[];
  enabled: boolean;
  onComplete: () => void;
}

const AnimatedTooltips = ({ steps, enabled, onComplete }: AnimatedTooltipsProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled || currentStep >= steps.length) return;

    const targetElement = document.querySelector(steps[currentStep].target);
    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      const position = steps[currentStep].position;

      let x = 0;
      let y = 0;

      switch (position) {
        case 'top':
          x = rect.left + rect.width / 2;
          y = rect.top - 20;
          break;
        case 'bottom':
          x = rect.left + rect.width / 2;
          y = rect.bottom + 20;
          break;
        case 'left':
          x = rect.left - 20;
          y = rect.top + rect.height / 2;
          break;
        case 'right':
          x = rect.right + 20;
          y = rect.top + rect.height / 2;
          break;
      }

      setTooltipPosition({ x, y });

      targetElement.classList.add('tooltip-highlight');
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

      return () => {
        targetElement.classList.remove('tooltip-highlight');
      };
    }
  }, [currentStep, enabled, steps]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  if (!enabled || currentStep >= steps.length) return null;

  const step = steps[currentStep];

  return (
    <>
      <style>{`
        .tooltip-highlight {
          position: relative;
          z-index: 9999;
          animation: pulse-ring 2s infinite;
        }

        @keyframes pulse-ring {
          0% {
            box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.7);
          }
          50% {
            box-shadow: 0 0 0 15px rgba(74, 222, 128, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(74, 222, 128, 0);
          }
        }
      `}</style>

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className="fixed z-[10000] pointer-events-none"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="pointer-events-auto bg-background border-2 border-green shadow-2xl rounded-xl p-6 max-w-sm">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-green/20 flex items-center justify-center flex-shrink-0">
                <Icon name={step.icon as any} size={24} className="text-green" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-4 border-t">
              <div className="flex gap-1">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 rounded-full transition-all ${
                      index === currentStep
                        ? 'w-6 bg-green'
                        : index < currentStep
                        ? 'w-1.5 bg-green/50'
                        : 'w-1.5 bg-muted'
                    }`}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSkip}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Пропустить
                </Button>
                <Button
                  size="sm"
                  onClick={handleNext}
                  className="gradient-bg text-white"
                >
                  {currentStep < steps.length - 1 ? 'Далее' : 'Готово'}
                  <Icon name="ArrowRight" className="ml-2" size={16} />
                </Button>
              </div>
            </div>
          </div>

          <motion.div
            className="absolute w-3 h-3 bg-green rotate-45"
            style={{
              [step.position === 'top' ? 'bottom' : step.position === 'bottom' ? 'top' : 'left']: '-6px',
              left: step.position === 'top' || step.position === 'bottom' ? '50%' : 'auto',
              transform: step.position === 'top' || step.position === 'bottom' ? 'translateX(-50%)' : 'translateY(-50%)'
            }}
          />
        </motion.div>
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]"
        onClick={handleSkip}
      />
    </>
  );
};

export default AnimatedTooltips;
