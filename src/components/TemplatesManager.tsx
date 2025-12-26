import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface TemplatesManagerProps {
  cardId: number;
}

const TemplatesManager = ({ cardId }: TemplatesManagerProps) => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [templateUrl, setTemplateUrl] = useState('');
  const [templateType, setTemplateType] = useState<'uploaded' | 'generated'>('uploaded');
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

  const handleCreateTemplate = async () => {
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
      await api.createCardTemplate(cardId, templateUrl, templateType);
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
          <div className="space-y-2">
            <Label htmlFor="template-type">Тип макета</Label>
            <Select value={templateType} onValueChange={(value: any) => setTemplateType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="uploaded">Загруженный</SelectItem>
                <SelectItem value="generated">Сгенерированный ИИ</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleCreateTemplate} disabled={loading} className="w-full">
            <Icon name="Plus" size={18} className="mr-2" />
            Добавить макет
          </Button>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold">Мои макеты ({templates.length})</h4>
          {loading && <p className="text-muted-foreground text-sm">Загрузка...</p>}
          {!loading && templates.length === 0 && (
            <p className="text-muted-foreground text-sm">Макетов пока нет</p>
          )}
          {!loading && templates.map((template) => (
            <div
              key={template.id}
              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <img
                  src={template.preview_url || template.template_url}
                  alt="Template preview"
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <p className="font-medium text-sm">
                    {template.template_type === 'generated' ? 'ИИ макет' : 'Загруженный макет'}
                  </p>
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
