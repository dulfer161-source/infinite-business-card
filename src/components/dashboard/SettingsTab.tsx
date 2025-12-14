import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import NotificationSettings from '../NotificationSettings';
import PrivacySettings from './settings/PrivacySettings';
import ProfileSettings from './settings/ProfileSettings';
import ApiKeysSettings from './settings/ApiKeysSettings';
import AppearanceSettings from './settings/AppearanceSettings';

const SettingsTab = () => {
  const [settings, setSettings] = useState({
    publicProfile: true,
    showEmail: true,
    showPhone: true,
    showWebsite: true,
    allowLeadCapture: true,
    showInSearch: true,
    analyticsEnabled: true
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    const saved = localStorage.getItem('privacy_settings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load settings:', e);
      }
    }
  };

  const saveSettings = (newSettings: typeof settings) => {
    setSettings(newSettings);
    localStorage.setItem('privacy_settings', JSON.stringify(newSettings));
    toast.success('Настройки сохранены');
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="notifications">
            <Icon name="Bell" className="mr-2" size={16} />
            <span className="hidden sm:inline">Уведомления</span>
          </TabsTrigger>
          <TabsTrigger value="privacy">
            <Icon name="Lock" className="mr-2" size={16} />
            <span className="hidden sm:inline">Приватность</span>
          </TabsTrigger>
          <TabsTrigger value="profile">
            <Icon name="User" className="mr-2" size={16} />
            <span className="hidden sm:inline">Профиль</span>
          </TabsTrigger>
          <TabsTrigger value="api">
            <Icon name="Key" className="mr-2" size={16} />
            <span className="hidden sm:inline">API</span>
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Icon name="Palette" className="mr-2" size={16} />
            <span className="hidden sm:inline">Интерфейс</span>
          </TabsTrigger>
          <TabsTrigger value="data">
            <Icon name="Database" className="mr-2" size={16} />
            <span className="hidden sm:inline">Данные</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-6">
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <PrivacySettings settings={settings} onSettingsChange={saveSettings} />
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <ProfileSettings />
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <ApiKeysSettings />
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <AppearanceSettings />
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <AppearanceSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsTab;
