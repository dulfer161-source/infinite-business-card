import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface AITemplateGeneratorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetSection: 'hero' | 'about' | 'services' | 'contacts' | 'full';
  onTemplateGenerated: (html: string, css: string) => void;
  isPremium: boolean;
}

const AITemplateGenerator = ({ 
  open, 
  onOpenChange, 
  targetSection,
  onTemplateGenerated,
  isPremium
}: AITemplateGeneratorProps) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedPreview, setGeneratedPreview] = useState<{ html: string; css: string } | null>(null);

  const sectionExamples: Record<string, string> = {
    hero: 'Создай яркую шапку визитки с крупным фото, именем и должностью. Стиль: минимализм, цвет: синий',
    about: 'Блок "Обо мне" с фото слева, текстом справа, иконками достижений внизу. Стиль: современный',
    services: 'Карточки услуг 3 в ряд, с иконками, ценами и кнопкой "Заказать". Градиентный фон',
    contacts: 'Форма обратной связи с иконками соцсетей, картой и кнопками мессенджеров',
    full: 'Визитка для веб-дизайнера: hero с анимацией, портфолио, услуги, отзывы, контакты'
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Опишите, какой макет вы хотите создать');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      const authToken = localStorage.getItem('auth_token');
      const userStr = localStorage.getItem('user');
      let userId = '';
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          userId = user.id || '';
        } catch {}
      }
      
      const response = await fetch('https://functions.poehali.dev/72ff8548-9116-4284-8a41-2cb3d308cfc5', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': authToken || '',
          'X-User-Id': userId
        },
        body: JSON.stringify({
          action: 'generate_template',
          prompt,
          section: targetSection
        })
      });

      clearInterval(progressInterval);
      setGenerationProgress(100);

      if (!response.ok) {
        throw new Error('Failed to generate template');
      }

      const data = await response.json();
      
      setGeneratedPreview({
        html: data.html || '<div class="p-8 text-center"><h2>Ваш макет готов!</h2></div>',
        css: data.css || ''
      });

      toast.success('Макет успешно сгенерирован!');
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Не удалось сгенерировать макет. Попробуйте еще раз');
      setGenerationProgress(0);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = () => {
    if (generatedPreview) {
      onTemplateGenerated(generatedPreview.html, generatedPreview.css);
      toast.success('Макет применён к визитке!');
      onOpenChange(false);
      resetState();
    }
  };

  const resetState = () => {
    setPrompt('');
    setGeneratedPreview(null);
    setGenerationProgress(0);
  };

  const getSectionName = (section: string) => {
    const names: Record<string, string> = {
      hero: 'Шапка',
      about: 'О себе',
      services: 'Услуги',
      contacts: 'Контакты',
      full: 'Вся визитка'
    };
    return names[section] || section;
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      onOpenChange(isOpen);
      if (!isOpen) resetState();
    }}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="Sparkles" size={24} className="text-gold" />
            AI Генератор макетов
            <Badge variant="outline" className="border-gold text-gold ml-2">Premium</Badge>
          </DialogTitle>
          <DialogDescription>
            Создайте уникальный дизайн для раздела: <span className="font-semibold text-foreground">{getSectionName(targetSection)}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {!isPremium && (
            <Card className="border-gold/50 bg-gold/5">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                    <Icon name="Lock" size={20} className="text-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Функция доступна на Premium</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Генерация AI макетов, загрузка собственных дизайнов и расширенная библиотека доступны на тарифах "Базовый" и выше
                    </p>
                    <Button className="bg-gold text-black hover:bg-gold/90">
                      <Icon name="Crown" className="mr-2" size={16} />
                      Перейти на Premium
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="prompt" className="text-base font-semibold">
                Опишите желаемый макет
              </Label>
              <p className="text-sm text-muted-foreground mb-2">
                Чем подробнее описание, тем точнее результат
              </p>
              <Textarea
                id="prompt"
                placeholder={sectionExamples[targetSection]}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[120px]"
                disabled={!isPremium || isGenerating}
              />
            </div>

            {isGenerating && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Генерация макета...</span>
                  <span className="font-semibold">{generationProgress}%</span>
                </div>
                <Progress value={generationProgress} className="h-2" />
              </div>
            )}

            {generatedPreview && (
              <Card className="border-gold/30 bg-gradient-to-br from-gold/5 to-transparent">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Icon name="Eye" size={18} className="text-gold" />
                      Предварительный просмотр
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="text-xs"
                      >
                        <Icon name="RefreshCw" size={14} className="mr-1" />
                        Перегенерировать
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <div className="absolute -top-2 -right-2 bg-gold text-black text-xs font-semibold px-2 py-1 rounded-full shadow-lg z-10">
                      ✨ AI Generated
                    </div>
                    <div 
                      className="border-2 border-gold/20 rounded-xl p-6 bg-white shadow-sm min-h-[300px] max-h-[500px] overflow-y-auto"
                      dangerouslySetInnerHTML={{ __html: generatedPreview.html }}
                    />
                  </div>
                  
                  {generatedPreview.css && (
                    <details className="group">
                      <summary className="cursor-pointer text-sm font-semibold text-muted-foreground hover:text-foreground flex items-center gap-2">
                        <Icon name="Code" size={16} className="group-open:rotate-90 transition-transform" />
                        Дополнительный CSS
                      </summary>
                      <pre className="mt-2 p-4 bg-muted/50 rounded-lg text-xs overflow-x-auto border border-gold/10">
                        {generatedPreview.css}
                      </pre>
                    </details>
                  )}
                  
                  <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <Icon name="Info" size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-blue-800">
                      Вы можете применить этот макет или перегенерировать с другим описанием
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="flex gap-3">
            {!generatedPreview ? (
              <>
                <Button
                  onClick={handleGenerate}
                  disabled={!isPremium || isGenerating || !prompt.trim()}
                  className="flex-1 bg-gradient-to-r from-gold to-yellow-500 text-black hover:from-gold/90 hover:to-yellow-500/90 shadow-lg hover:shadow-xl transition-all"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2" />
                      Генерирую магию...
                    </>
                  ) : (
                    <>
                      <Icon name="Sparkles" className="mr-2" size={18} />
                      Сгенерировать макет
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Отмена
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={handleApply}
                  className="flex-1 bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl transition-all"
                >
                  <Icon name="Check" className="mr-2" size={18} />
                  Применить к визитке
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setGeneratedPreview(null);
                    setGenerationProgress(0);
                  }}
                  className="border-gray-300 hover:bg-gray-50"
                >
                  <Icon name="X" className="mr-2" size={16} />
                  Отменить
                </Button>
              </>
            )}
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Icon name="Lightbulb" size={16} />
              Примеры промптов
            </h4>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-gold">•</span>
                "Минималистичная шапка с крупным фото слева, ФИО и должность справа, градиент от синего к фиолетовому"
              </li>
              <li className="flex gap-2">
                <span className="text-gold">•</span>
                "Блок услуг: 4 карточки с иконками, короткое описание, цена внизу, кнопка 'Заказать'. Стиль: современный бизнес"
              </li>
              <li className="flex gap-2">
                <span className="text-gold">•</span>
                "Контактная форма с полями Имя/Email/Сообщение, кнопки WhatsApp и Telegram справа, тёмный фон"
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AITemplateGenerator;