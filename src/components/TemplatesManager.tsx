import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface TemplatesManagerProps {
  cardId: number;
}

const TemplatesManager = ({ cardId }: TemplatesManagerProps) => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [templateUrl, setTemplateUrl] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [generatedPreview, setGeneratedPreview] = useState('');
  const { toast } = useToast();

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const response = await api.getCardTemplates(cardId);
      setTemplates(response.templates || []);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить макеты',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, [cardId]);

  const handleUploadTemplate = async () => {
    if (!templateUrl.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Укажите URL макета',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      await api.createCardTemplate(cardId, templateUrl, 'uploaded');
      toast({
        title: 'Успешно',
        description: 'Макет добавлен',
      });
      setTemplateUrl('');
      loadTemplates();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить макет',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTemplate = async () => {
    if (!aiPrompt.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Опишите, какой макет вы хотите создать',
        variant: 'destructive',
      });
      return;
    }

    try {
      setGenerating(true);
      const response = await fetch('https://functions.yandexcloud.net/d4eo6b4i1hqhsl4lf9nm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt }),
      });

      const data = await response.json();
      
      if (data.image_url) {
        setGeneratedPreview(data.image_url);
        toast({
          title: 'Готово!',
          description: 'Макет сгенерирован. Проверьте и сохраните.',
        });
      } else {
        throw new Error('No image URL');
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сгенерировать макет',
        variant: 'destructive',
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveGenerated = async () => {
    if (!generatedPreview) return;

    try {
      setLoading(true);
      await api.createCardTemplate(cardId, generatedPreview, 'generated');
      toast({
        title: 'Успешно',
        description: 'Макет сохранён',
      });
      setGeneratedPreview('');
      setAiPrompt('');
      loadTemplates();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить макет',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="FileImage" size={24} />
          Макеты визитки
        </CardTitle>
        <CardDescription>
          Загружайте свои макеты или генерируйте с помощью ИИ
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="generate">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate">
              <Icon name="Sparkles" size={16} className="mr-2" />
              Генерация ИИ
            </TabsTrigger>
            <TabsTrigger value="upload">
              <Icon name="Upload" size={16} className="mr-2" />
              Загрузка
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-4">
            <div className="space-y-4 p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-primary/20">
              <div className="space-y-2">
                <Label htmlFor="ai-prompt">Опишите макет визитки</Label>
                <Textarea
                  id="ai-prompt"
                  placeholder="Пример: Современная визитка для IT-специалиста в синих тонах с минималистичным дизайном"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Чем подробнее описание, тем точнее результат
                </p>
              </div>
              <Button 
                onClick={handleGenerateTemplate} 
                disabled={generating || !aiPrompt.trim()} 
                className="w-full"
              >
                {generating ? (
                  <>
                    <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
                    Генерация...
                  </>
                ) : (
                  <>
                    <Icon name="Sparkles" size={18} className="mr-2" />
                    Сгенерировать макет
                  </>
                )}
              </Button>
            </div>

            {generatedPreview && (
              <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Предпросмотр</h4>
                  <Badge variant="outline" className="bg-primary/10">
                    <Icon name="Sparkles" size={12} className="mr-1" />
                    ИИ
                  </Badge>
                </div>
                <img
                  src={generatedPreview}
                  alt="Generated template"
                  className="w-full rounded-lg border"
                />
                <div className="flex gap-2">
                  <Button onClick={handleSaveGenerated} disabled={loading} className="flex-1">
                    <Icon name="Save" size={18} className="mr-2" />
                    Сохранить
                  </Button>
                  <Button 
                    onClick={() => setGeneratedPreview('')} 
                    variant="outline"
                    className="flex-1"
                  >
                    <Icon name="X" size={18} className="mr-2" />
                    Отменить
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="template-url">URL макета</Label>
                <Input
                  id="template-url"
                  placeholder="https://example.com/template.jpg"
                  value={templateUrl}
                  onChange={(e) => setTemplateUrl(e.target.value)}
                />
              </div>
              <Button onClick={handleUploadTemplate} disabled={loading} className="w-full">
                <Icon name="Upload" size={18} className="mr-2" />
                Добавить макет
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="space-y-3">
          <h4 className="font-semibold">Мои макеты ({templates.length})</h4>
          {loading && <p className="text-muted-foreground text-sm">Загрузка...</p>}
          {!loading && templates.length === 0 && (
            <p className="text-muted-foreground text-sm">Макетов пока нет</p>
          )}
          {!loading && templates.map((template) => (
            <div
              key={template.id}
              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <img
                  src={template.preview_url || template.template_url}
                  alt="Template preview"
                  className="w-16 h-16 object-cover rounded border"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">
                      {template.template_type === 'generated' ? 'ИИ макет' : 'Загруженный макет'}
                    </p>
                    {template.template_type === 'generated' && (
                      <Badge variant="outline" className="bg-primary/10 text-[10px] px-1.5 py-0">
                        <Icon name="Sparkles" size={10} className="mr-0.5" />
                        AI
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(template.created_at).toLocaleDateString('ru-RU')}
                  </p>
                </div>
              </div>
              <Badge variant={template.is_active ? 'default' : 'secondary'}>
                {template.is_active ? 'Активен' : 'Неактивен'}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplatesManager;
