import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import ExportMenu from '@/components/ExportMenu';

const AppearanceSettings = () => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [language, setLanguage] = useState('ru');

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = () => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system';
    const savedLang = localStorage.getItem('language');
    if (savedTheme) setTheme(savedTheme);
    if (savedLang) setLanguage(savedLang);
  };

  const changeTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    toast.success('Тема оформления изменена');
  };

  const changeLanguage = (newLang: string) => {
    setLanguage(newLang);
    localStorage.setItem('language', newLang);
    toast.success('Язык интерфейса изменён');
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Palette" size={20} />
            Оформление интерфейса
          </CardTitle>
          <CardDescription>
            Настройте внешний вид под свои предпочтения
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-semibold mb-3">Тема оформления</h4>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => changeTheme('light')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  theme === 'light'
                    ? 'border-blue bg-blue/5'
                    : 'border-muted hover:border-blue/50'
                }`}
              >
                <Icon name="Sun" size={24} className="mx-auto mb-2" />
                <p className="text-sm font-medium">Светлая</p>
              </button>
              <button
                onClick={() => changeTheme('dark')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  theme === 'dark'
                    ? 'border-blue bg-blue/5'
                    : 'border-muted hover:border-blue/50'
                }`}
              >
                <Icon name="Moon" size={24} className="mx-auto mb-2" />
                <p className="text-sm font-medium">Тёмная</p>
              </button>
              <button
                onClick={() => changeTheme('system')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  theme === 'system'
                    ? 'border-blue bg-blue/5'
                    : 'border-muted hover:border-blue/50'
                }`}
              >
                <Icon name="Laptop" size={24} className="mx-auto mb-2" />
                <p className="text-sm font-medium">Системная</p>
              </button>
            </div>
          </div>

          <div className="border-t pt-6">
            <h4 className="font-semibold mb-3">Язык интерфейса</h4>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => changeLanguage('ru')}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  language === 'ru'
                    ? 'border-blue bg-blue/5'
                    : 'border-muted hover:border-blue/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🇷🇺</div>
                  <div>
                    <p className="font-semibold text-sm">Русский</p>
                    <p className="text-xs text-muted-foreground">Russian</p>
                  </div>
                </div>
              </button>
              <button
                onClick={() => changeLanguage('en')}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  language === 'en'
                    ? 'border-blue bg-blue/5'
                    : 'border-muted hover:border-blue/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🇬🇧</div>
                  <div>
                    <p className="font-semibold text-sm">English</p>
                    <p className="text-xs text-muted-foreground">Английский</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-blue/5 border border-blue/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Icon name="Sparkles" size={16} className="text-blue flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">
                Настройки интерфейса применяются мгновенно и сохраняются в вашем браузере
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Download" size={20} />
            Экспорт данных
          </CardTitle>
          <CardDescription>
            Скачайте все ваши данные в удобном формате
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            <div className="p-4 rounded-lg border">
              <div className="flex items-start gap-3 mb-3">
                <Icon name="CreditCard" size={20} className="text-green" />
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-1">Визитка</h4>
                  <p className="text-xs text-muted-foreground">
                    Экспорт визитки в PDF или vCard
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Icon name="FileText" className="mr-2" size={14} />
                  PDF
                </Button>
                <Button variant="outline" size="sm">
                  <Icon name="Download" className="mr-2" size={14} />
                  vCard
                </Button>
              </div>
            </div>

            <div className="p-4 rounded-lg border">
              <div className="flex items-start gap-3 mb-3">
                <Icon name="BarChart3" size={20} className="text-blue" />
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-1">Аналитика</h4>
                  <p className="text-xs text-muted-foreground">
                    Экспорт статистики просмотров
                  </p>
                </div>
              </div>
              <ExportMenu 
                type="analytics"
                analyticsData={[]}
              />
            </div>

            <div className="p-4 rounded-lg border">
              <div className="flex items-start gap-3 mb-3">
                <Icon name="Users" size={20} className="text-purple-500" />
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-1">Лиды</h4>
                  <p className="text-xs text-muted-foreground">
                    Экспорт списка всех лидов
                  </p>
                </div>
              </div>
              <ExportMenu 
                type="leads"
                leadsData={[]}
              />
            </div>
          </div>

          <div className="bg-orange/10 border border-orange/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Icon name="AlertCircle" size={16} className="text-orange flex-shrink-0 mt-0.5" />
              <div className="text-xs text-muted-foreground">
                <p className="font-semibold mb-1">Экспорт всех данных</p>
                <p className="mb-3">
                  Получите полную копию всех данных вашего аккаунта в соответствии с GDPR
                </p>
                <Button variant="outline" size="sm">
                  <Icon name="Package" className="mr-2" size={14} />
                  Запросить архив
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default AppearanceSettings;
