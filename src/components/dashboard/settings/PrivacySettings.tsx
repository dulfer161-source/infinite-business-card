import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';

interface PrivacySettingsProps {
  settings: {
    publicProfile: boolean;
    showEmail: boolean;
    showPhone: boolean;
    showWebsite: boolean;
    allowLeadCapture: boolean;
    showInSearch: boolean;
    analyticsEnabled: boolean;
  };
  onSettingsChange: (settings: PrivacySettingsProps['settings']) => void;
}

const PrivacySettings = ({ settings, onSettingsChange }: PrivacySettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="Eye" size={20} />
          Видимость визитки
        </CardTitle>
        <CardDescription>
          Управляйте тем, кто может видеть вашу визитку и какую информацию
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 rounded-lg border">
          <div className="flex-1">
            <p className="font-medium text-sm mb-1">Публичный профиль</p>
            <p className="text-xs text-muted-foreground">
              Визитка доступна по ссылке всем
            </p>
          </div>
          <Switch
            checked={settings.publicProfile}
            onCheckedChange={(checked) => 
              onSettingsChange({ ...settings, publicProfile: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg border">
          <div className="flex-1">
            <p className="font-medium text-sm mb-1">Показывать email</p>
            <p className="text-xs text-muted-foreground">
              Email будет виден посетителям
            </p>
          </div>
          <Switch
            checked={settings.showEmail}
            onCheckedChange={(checked) => 
              onSettingsChange({ ...settings, showEmail: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg border">
          <div className="flex-1">
            <p className="font-medium text-sm mb-1">Показывать телефон</p>
            <p className="text-xs text-muted-foreground">
              Телефон будет виден посетителям
            </p>
          </div>
          <Switch
            checked={settings.showPhone}
            onCheckedChange={(checked) => 
              onSettingsChange({ ...settings, showPhone: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg border">
          <div className="flex-1">
            <p className="font-medium text-sm mb-1">Сбор лидов</p>
            <p className="text-xs text-muted-foreground">
              Посетители могут оставить контакты
            </p>
          </div>
          <Switch
            checked={settings.allowLeadCapture}
            onCheckedChange={(checked) => 
              onSettingsChange({ ...settings, allowLeadCapture: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg border">
          <div className="flex-1">
            <p className="font-medium text-sm mb-1">Показывать в поиске</p>
            <p className="text-xs text-muted-foreground">
              Визитка доступна в поиске visitka.site
            </p>
          </div>
          <Switch
            checked={settings.showInSearch}
            onCheckedChange={(checked) => 
              onSettingsChange({ ...settings, showInSearch: checked })
            }
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PrivacySettings;
