import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import Logo from './Logo';
import BusinessCardTab from './dashboard/BusinessCardTab';
import EditTab from './dashboard/EditTab';
import DesignTab from './dashboard/DesignTab';
import AnalyticsTab from './dashboard/AnalyticsTab';

import TemplatesTab from './dashboard/TemplatesTab';
import IntegrationsTab from './dashboard/IntegrationsTab';
import TeamManagementTab from './dashboard/TeamManagementTab';
import PortfolioTab from './dashboard/PortfolioTab';
import LeadsTab from './dashboard/LeadsTab';
import Reviews from './Reviews';
import DemoTour from './DemoTour';
import VideoDemo from './VideoDemo';
import AnimatedTooltips from './AnimatedTooltips';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DemoDashboardProps {
  onExit: () => void;
  plan: 'free' | 'basic' | 'pro';
}

const DemoDashboard = ({ onExit, plan }: DemoDashboardProps) => {
  const [showTour, setShowTour] = useState(false);
  const [tourCompleted, setTourCompleted] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showTooltips, setShowTooltips] = useState(false);

  useEffect(() => {
    setShowTour(true);
  }, []);

  const handleTourComplete = () => {
    setTourCompleted(true);
    setTimeout(() => {
      setShowTooltips(true);
    }, 1000);
  };

  const handleTooltipsComplete = () => {
    setShowTooltips(false);
  };

  const [userInfo, setUserInfo] = useState({
    name: 'Демо Пользователь',
    position: 'Тестовая должность',
    company: 'Демо Компания',
    phone: '+7 (999) 000-00-00',
    email: 'demo@example.com',
    website: 'demo.site',
    description: 'Это демонстрационный режим для тестирования возможностей платформы'
  });

  const planConfig = {
    free: {
      name: 'Бесплатный',
      color: 'gray',
      tabs: ['card', 'edit', 'templates', 'analytics']
    },
    basic: {
      name: 'Базовый', 
      color: 'green',
      tabs: ['card', 'edit', 'templates', 'design', 'analytics', 'portfolio', 'leads', 'reviews']
    },
    pro: {
      name: 'Профессиональный',
      color: 'blue',
      tabs: ['card', 'edit', 'templates', 'design', 'analytics', 'integrations', 'team', 'portfolio', 'leads', 'reviews']
    }
  };

  const currentPlan = planConfig[plan];
  const isTabAvailable = (tabId: string) => currentPlan.tabs.includes(tabId);

  const TabTriggerWithLock = ({ value, icon, label, locked }: { 
    value: string; 
    icon: string; 
    label: string;
    locked?: boolean;
  }) => (
    <TabsTrigger value={value} disabled={locked} className="relative">
      <Icon name={icon as any} className="mr-2" size={18} />
      <span className="hidden sm:inline">{label}</span>
      {locked && (
        <Icon name="Lock" className="ml-2 text-muted-foreground" size={14} />
      )}
    </TabsTrigger>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-green/20 bg-background/90 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo size="md" />
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="hover:text-orange" onClick={() => setShowVideo(true)}>
              <Icon name="PlayCircle" className="mr-2" size={16} />
              Видео
            </Button>
            <Button variant="ghost" size="sm" className="hover:text-blue" onClick={() => setShowTour(true)}>
              <Icon name="HelpCircle" className="mr-2" size={16} />
              Тур
            </Button>
            <Badge variant="outline" className="border-orange text-orange font-semibold">
              <Icon name="Eye" className="mr-1" size={14} />
              Демо: {currentPlan.name}
            </Badge>
            <Button variant="ghost" className="hover:text-green" onClick={onExit}>
              <Icon name="LogOut" className="mr-2" size={18} />
              Выйти из демо
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Alert className="mb-6 border-blue/30 bg-blue/5">
          <Icon name="Info" className="text-blue" size={18} />
          <AlertDescription>
            <span className="font-semibold">Демо-режим: {currentPlan.name} тариф</span>
            <br />
            Вы можете протестировать все доступные функции. Данные не сохраняются после выхода.
            {plan === 'free' && ' Некоторые вкладки заблокированы — они доступны в платных тарифах.'}
          </AlertDescription>
        </Alert>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 gradient-text">Демо-кабинет</h1>
          <p className="text-muted-foreground">Тестирование возможностей платформы</p>
        </div>

        <Tabs defaultValue="card" className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-11 w-full">
            <TabTriggerWithLock value="card" icon="CreditCard" label="Визитка" />
            <TabTriggerWithLock value="edit" icon="Edit" label="Редактировать" />
            <TabTriggerWithLock value="templates" icon="LayoutTemplate" label="Шаблоны" />
            <TabTriggerWithLock value="design" icon="Palette" label="Дизайн" locked={!isTabAvailable('design')} />
            <TabTriggerWithLock value="analytics" icon="BarChart" label="Аналитика" />
            <TabTriggerWithLock value="integrations" icon="Plug" label="Интеграции" locked={!isTabAvailable('integrations')} />
            <TabTriggerWithLock value="team" icon="Users" label="Команда" locked={!isTabAvailable('team')} />
            <TabTriggerWithLock value="leads" icon="Inbox" label="Лиды" locked={!isTabAvailable('leads')} />
            <TabTriggerWithLock value="portfolio" icon="Briefcase" label="Портфолио" locked={!isTabAvailable('portfolio')} />
            <TabTriggerWithLock value="reviews" icon="Star" label="Отзывы" locked={!isTabAvailable('reviews')} />

          </TabsList>

          <TabsContent value="card" className="space-y-6">
            <BusinessCardTab userInfo={userInfo} />
          </TabsContent>

          <TabsContent value="edit" className="space-y-6">
            <EditTab userInfo={userInfo} setUserInfo={setUserInfo} />
          </TabsContent>

          <TabsContent value="design" className="space-y-6">
            {isTabAvailable('design') ? (
              <DesignTab />
            ) : (
              <LockedFeature feature="Дизайн" />
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsTab />
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <TemplatesTab onApplyTemplate={(template) => alert(`В демо-режиме: применён шаблон ${template.name}`)} />
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            {isTabAvailable('integrations') ? (
              <IntegrationsTab />
            ) : (
              <LockedFeature feature="Интеграции" />
            )}
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            {isTabAvailable('team') ? (
              <TeamManagementTab />
            ) : (
              <LockedFeature feature="Управление командой" />
            )}
          </TabsContent>

          <TabsContent value="leads" className="space-y-6">
            {isTabAvailable('leads') ? (
              <LeadsTab />
            ) : (
              <LockedFeature feature="Лиды" />
            )}
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            {isTabAvailable('portfolio') ? (
              <PortfolioTab />
            ) : (
              <LockedFeature feature="Портфолио" />
            )}
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            {isTabAvailable('reviews') ? (
              <Reviews />
            ) : (
              <LockedFeature feature="Отзывы" />
            )}
          </TabsContent>


        </Tabs>
      </main>

      <DemoTour
        open={showTour}
        onOpenChange={setShowTour}
        plan={plan}
        onComplete={handleTourComplete}
      />

      <VideoDemo
        open={showVideo}
        onOpenChange={setShowVideo}
      />

      <AnimatedTooltips
        enabled={showTooltips}
        steps={[
          {
            target: '[data-value="card"]',
            title: 'Визитка',
            description: 'Здесь отображается ваша визитка — это то, что видят клиенты',
            icon: 'CreditCard',
            position: 'bottom'
          },
          {
            target: '[data-value="edit"]',
            title: 'Редактирование',
            description: 'Нажмите сюда, чтобы изменить данные вашей визитки',
            icon: 'Edit',
            position: 'bottom'
          },
          {
            target: '[data-value="analytics"]',
            title: 'Аналитика',
            description: 'Отслеживайте просмотры и эффективность визитки',
            icon: 'BarChart',
            position: 'bottom'
          }
        ]}
        onComplete={handleTooltipsComplete}
      />
    </div>
  );
};

const LockedFeature = ({ feature }: { feature: string }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
      <Icon name="Lock" className="text-muted-foreground" size={40} />
    </div>
    <h3 className="text-2xl font-bold mb-2">{feature}</h3>
    <p className="text-muted-foreground mb-6 max-w-md">
      Эта функция доступна в платных тарифах. Завершите демо и выберите подходящий тариф, чтобы получить доступ.
    </p>
    <Button className="gradient-bg text-white hover:opacity-90">
      Посмотреть тарифы
    </Button>
  </div>
);

export default DemoDashboard;