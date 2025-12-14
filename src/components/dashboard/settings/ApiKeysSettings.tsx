import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

const ApiKeysSettings = () => {
  const [apiKeys, setApiKeys] = useState<{id: string; name: string; key: string; created: string}[]>([]);

  useEffect(() => {
    loadApiKeys();
  }, []);

  const loadApiKeys = () => {
    const saved = localStorage.getItem('api_keys');
    if (saved) {
      try {
        setApiKeys(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load API keys:', e);
      }
    }
  };

  const generateApiKey = () => {
    const key = 'vst_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const newKey = {
      id: Date.now().toString(),
      name: `API Ключ ${apiKeys.length + 1}`,
      key,
      created: new Date().toISOString()
    };
    const updated = [...apiKeys, newKey];
    setApiKeys(updated);
    localStorage.setItem('api_keys', JSON.stringify(updated));
    toast.success('API ключ создан');
  };

  const deleteApiKey = (id: string) => {
    const updated = apiKeys.filter(k => k.id !== id);
    setApiKeys(updated);
    localStorage.setItem('api_keys', JSON.stringify(updated));
    toast.success('API ключ удалён');
  };

  const copyApiKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success('Ключ скопирован');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Key" size={20} />
              API ключи
            </CardTitle>
            <CardDescription>
              Используйте API для интеграции с внешними сервисами
            </CardDescription>
          </div>
          <Button onClick={generateApiKey} size="sm">
            <Icon name="Plus" className="mr-2" size={16} />
            Создать ключ
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {apiKeys.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Key" size={48} className="mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground mb-4">
              У вас пока нет API ключей
            </p>
            <Button onClick={generateApiKey} variant="outline">
              <Icon name="Plus" className="mr-2" size={16} />
              Создать первый ключ
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {apiKeys.map((apiKey) => (
              <div key={apiKey.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-sm">{apiKey.name}</p>
                      <Badge variant="outline" className="text-xs">
                        Активен
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Создан: {new Date(apiKey.created).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteApiKey(apiKey.id)}
                  >
                    <Icon name="Trash2" size={16} className="text-red-500" />
                  </Button>
                </div>
                <div className="bg-muted rounded p-3 flex items-center gap-2">
                  <code className="flex-1 text-xs font-mono truncate">
                    {apiKey.key}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyApiKey(apiKey.key)}
                  >
                    <Icon name="Copy" size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="bg-blue/5 border border-blue/20 rounded-lg p-4 mt-4">
          <div className="flex items-start gap-3">
            <Icon name="Info" size={16} className="text-blue flex-shrink-0 mt-0.5" />
            <div className="text-xs text-muted-foreground">
              <p className="font-semibold mb-1">Документация API</p>
              <p>Используйте API ключи для доступа к данным вашей визитки через REST API. 
              Добавляйте заголовок <code className="bg-muted px-1 py-0.5 rounded">Authorization: Bearer YOUR_KEY</code> к запросам.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiKeysSettings;
