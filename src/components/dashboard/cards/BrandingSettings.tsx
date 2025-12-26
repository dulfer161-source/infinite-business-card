import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface BrandingData {
  enabled: boolean;
  logo_url?: string;
  brand_color?: string;
  brand_name?: string;
}

interface BrandingSettingsProps {
  cardId: number;
  currentBranding?: BrandingData;
  hidePlatformBranding?: boolean;
  canRemoveBranding: boolean;
  onSave: (branding: BrandingData, hidePlatform: boolean) => Promise<void>;
}

const BrandingSettings = ({
  cardId,
  currentBranding,
  hidePlatformBranding = false,
  canRemoveBranding,
  onSave
}: BrandingSettingsProps) => {
  const [branding, setBranding] = useState<BrandingData>({
    enabled: currentBranding?.enabled || false,
    logo_url: currentBranding?.logo_url || '',
    brand_color: currentBranding?.brand_color || '#FFD700',
    brand_name: currentBranding?.brand_name || ''
  });
  const [hidePlatform, setHidePlatform] = useState(hidePlatformBranding);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (currentBranding) {
      setBranding({
        enabled: currentBranding.enabled,
        logo_url: currentBranding.logo_url || '',
        brand_color: currentBranding.brand_color || '#FFD700',
        brand_name: currentBranding.brand_name || ''
      });
    }
  }, [currentBranding]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(branding, hidePlatform && canRemoveBranding);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="border-gold/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Брендирование визитки</CardTitle>
            <CardDescription>Настройте персональный брендинг вашей визитки</CardDescription>
          </div>
          {!canRemoveBranding && (
            <Badge variant="outline" className="text-xs">
              <Icon name="Lock" size={12} className="mr-1" />
              Продвинутый
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Включить брендирование */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="branding-enabled">Персональный брендинг</Label>
            <div className="text-sm text-muted-foreground">
              Добавьте свой логотип и цвета
            </div>
          </div>
          <Switch
            id="branding-enabled"
            checked={branding.enabled}
            onCheckedChange={(checked) => setBranding({ ...branding, enabled: checked })}
          />
        </div>

        {branding.enabled && (
          <>
            {/* Логотип */}
            <div className="space-y-2">
              <Label htmlFor="brand-logo">URL логотипа</Label>
              <Input
                id="brand-logo"
                type="url"
                placeholder="https://example.com/logo.png"
                value={branding.logo_url}
                onChange={(e) => setBranding({ ...branding, logo_url: e.target.value })}
                className="border-gold/20 focus-visible:ring-gold/50"
              />
              {branding.logo_url && (
                <div className="mt-2 flex items-center gap-2">
                  <img
                    src={branding.logo_url}
                    alt="Brand logo preview"
                    className="w-12 h-12 rounded object-cover border border-gold/20"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <span className="text-xs text-muted-foreground">Предпросмотр логотипа</span>
                </div>
              )}
            </div>

            {/* Название бренда */}
            <div className="space-y-2">
              <Label htmlFor="brand-name">Название бренда</Label>
              <Input
                id="brand-name"
                type="text"
                placeholder="Моя Компания"
                value={branding.brand_name}
                onChange={(e) => setBranding({ ...branding, brand_name: e.target.value })}
                className="border-gold/20 focus-visible:ring-gold/50"
              />
            </div>

            {/* Цвет бренда */}
            <div className="space-y-2">
              <Label htmlFor="brand-color">Цвет бренда</Label>
              <div className="flex gap-2">
                <Input
                  id="brand-color"
                  type="color"
                  value={branding.brand_color}
                  onChange={(e) => setBranding({ ...branding, brand_color: e.target.value })}
                  className="w-20 h-10 cursor-pointer"
                />
                <Input
                  type="text"
                  value={branding.brand_color}
                  onChange={(e) => setBranding({ ...branding, brand_color: e.target.value })}
                  placeholder="#FFD700"
                  className="flex-1 border-gold/20 focus-visible:ring-gold/50"
                />
              </div>
            </div>
          </>
        )}

        {/* Скрыть брендинг платформы */}
        <div className="border-t border-gold/20 pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Label htmlFor="hide-platform">Скрыть брендинг Infinite Cards</Label>
                {!canRemoveBranding && (
                  <Badge variant="outline" className="text-xs">
                    <Icon name="Crown" size={10} className="mr-1" />
                    PRO
                  </Badge>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                {canRemoveBranding
                  ? 'Уберите упоминание платформы с визитки'
                  : 'Доступно в тарифах "Продвинутый" и "Бизнес"'}
              </div>
            </div>
            <Switch
              id="hide-platform"
              checked={hidePlatform}
              disabled={!canRemoveBranding}
              onCheckedChange={setHidePlatform}
            />
          </div>

          {!canRemoveBranding && (
            <div className="mt-4 p-3 bg-gold/5 border border-gold/20 rounded-lg">
              <div className="flex items-start gap-2">
                <Icon name="Info" size={16} className="text-gold mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-gold">Обновите тариф</p>
                  <p className="text-muted-foreground mt-1">
                    Для отключения брендинга платформы перейдите на тариф "Продвинутый" (490₽/мес) или "Бизнес" (990₽/мес)
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Кнопка сохранения */}
        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-gold text-black hover:bg-gold/90"
        >
          {saving ? (
            <>
              <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
              Сохранение...
            </>
          ) : (
            <>
              <Icon name="Save" size={16} className="mr-2" />
              Сохранить настройки
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default BrandingSettings;
