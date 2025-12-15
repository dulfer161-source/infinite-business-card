import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const TestAI = () => {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError('');
    setImageUrl('');

    try {
      const response = await fetch('https://functions.poehali.dev/72ff8548-9116-4284-8a41-2cb3d308cfc5', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': 'test-user-123'
        },
        body: JSON.stringify({ prompt })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка генерации');
      }

      setImageUrl(data.image_url);
    } catch (err: any) {
      setError(err.message || 'Не удалось сгенерировать изображение');
      console.error('Generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">Тест GigaChat</h1>
          <p className="text-muted-foreground">Генерация изображений через API Сбера</p>
        </div>

        <Card className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Описание изображения</label>
            <Input
              placeholder="Например: красный спортивный автомобиль на закате"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            />
          </div>

          <Button 
            onClick={handleGenerate} 
            disabled={loading || !prompt.trim()}
            className="w-full"
          >
            {loading ? (
              <>
                <Icon name="Loader2" className="mr-2 animate-spin" size={18} />
                Генерация...
              </>
            ) : (
              <>
                <Icon name="Sparkles" className="mr-2" size={18} />
                Сгенерировать
              </>
            )}
          </Button>

          {error && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-lg flex items-start gap-2">
              <Icon name="AlertCircle" size={18} className="mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {imageUrl && (
            <div className="space-y-4">
              <div className="bg-muted/30 p-4 rounded-lg">
                <img 
                  src={imageUrl} 
                  alt="Generated" 
                  className="w-full rounded-lg shadow-lg"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => window.open(imageUrl, '_blank')}
                >
                  <Icon name="ExternalLink" className="mr-2" size={18} />
                  Открыть
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    navigator.clipboard.writeText(imageUrl);
                  }}
                >
                  <Icon name="Copy" className="mr-2" size={18} />
                  Скопировать URL
                </Button>
              </div>
            </div>
          )}
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>Статус API: GigaChat подключен</p>
          <p className="mt-2">URL функции: https://functions.poehali.dev/72ff8548-9116-4284-8a41-2cb3d308cfc5</p>
        </div>
      </div>
    </div>
  );
};

export default TestAI;
