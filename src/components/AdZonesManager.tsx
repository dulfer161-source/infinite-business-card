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

interface AdZonesManagerProps {
  cardId: number;
}

const AdZonesManager = ({ cardId }: AdZonesManagerProps) => {
  const [zones, setZones] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [zoneName, setZoneName] = useState('');
  const [zonePosition, setZonePosition] = useState<'header' | 'footer' | 'sidebar' | 'content'>('content');
  const { toast } = useToast();

  const loadZones = async () => {
    try {
      setLoading(true);
      const response = await api.getAdZones(cardId);
      setZones(response.zones || []);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить рекламные зоны',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadZones();
  }, [cardId]);

  const handleCreateZone = async () => {
    if (!zoneName.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Укажите название зоны',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      await api.createAdZone(cardId, zoneName, zonePosition);
      toast({
        title: 'Успешно',
        description: 'Рекламная зона создана',
      });
      setZoneName('');
      loadZones();
    } catch (error: any) {
      if (error.message?.includes('Premium subscription required')) {
        toast({
          title: 'Требуется Премиум',
          description: 'Функция доступна только на тарифе Премиум',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Ошибка',
          description: 'Не удалось создать зону',
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const positionLabels = {
    header: 'Шапка',
    footer: 'Подвал',
    sidebar: 'Боковая панель',
    content: 'Контент',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="DollarSign" size={24} />
          Рекламные зоны
        </CardTitle>
        <CardDescription>
          Создавайте зоны для продажи рекламы на вашей визитке (только Премиум)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
          <div className="space-y-2">
            <Label htmlFor="zone-name">Название зоны</Label>
            <Input
              id="zone-name"
              placeholder="Например: Баннер в шапке"
              value={zoneName}
              onChange={(e) => setZoneName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="zone-position">Расположение</Label>
            <Select value={zonePosition} onValueChange={(value: any) => setZonePosition(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="header">Шапка</SelectItem>
                <SelectItem value="footer">Подвал</SelectItem>
                <SelectItem value="sidebar">Боковая панель</SelectItem>
                <SelectItem value="content">Контент</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleCreateZone} disabled={loading} className="w-full">
            <Icon name="Plus" size={18} className="mr-2" />
            Создать зону
          </Button>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold">Мои рекламные зоны ({zones.length})</h4>
          {loading && <p className="text-muted-foreground text-sm">Загрузка...</p>}
          {!loading && zones.length === 0 && (
            <div className="text-center p-8 bg-muted/30 rounded-lg">
              <Icon name="TrendingUp" size={48} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground text-sm mb-2">Зон пока нет</p>
              <p className="text-xs text-muted-foreground">
                Создайте зону и начните зарабатывать на рекламе
              </p>
            </div>
          )}
          {!loading && zones.map((zone) => (
            <div
              key={zone.id}
              className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border hover:border-green/50 transition-colors"
            >
              <div>
                <p className="font-medium">{zone.zone_name}</p>
                <p className="text-sm text-muted-foreground">
                  {positionLabels[zone.zone_position as keyof typeof positionLabels]}
                </p>
              </div>
              <Badge variant={zone.is_enabled ? 'default' : 'secondary'}>
                {zone.is_enabled ? 'Активна' : 'Выключена'}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdZonesManager;
