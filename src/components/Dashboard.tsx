import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import BusinessCardTab from './dashboard/BusinessCardTab';
import MyCardsTab from './dashboard/MyCardsTab';
import EditTab from './dashboard/EditTab';
import DesignTab from './dashboard/DesignTab';
import AnalyticsTab from './dashboard/AnalyticsTab';

import TemplatesTab from './dashboard/TemplatesTab';
import TemplatesAndAdsTab from './dashboard/TemplatesAndAdsTab';
import IntegrationsTab from './dashboard/IntegrationsTab';
import TeamManagementTab from './dashboard/TeamManagementTab';
import PortfolioTab from './dashboard/PortfolioTab';
import LeadsTab from './dashboard/LeadsTab';
import Reviews from './Reviews';
import AnalyticsDashboard from './AnalyticsDashboard';
import OnboardingFlow from './OnboardingFlow';
import DemoTour from './DemoTour';
import VideoDemo from './VideoDemo';
import WelcomeNotification from './WelcomeNotification';
import HelpButton from './HelpButton';
import ProgressTracker from './ProgressTracker';
import SettingsTab from './dashboard/SettingsTab';
import SubscriptionTab from './dashboard/SubscriptionTab';
import SystemHealthTab from './dashboard/SystemHealthTab';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard = ({ onLogout }: DashboardProps) => {
  const [userInfo, setUserInfo] = useState(() => {
    // Получаем имя пользователя из user (регистрация/логин)
    const userStr = localStorage.getItem('user');
    let userName = 'Друг';
    
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        userName = user.name || 'Друг';
      } catch {}
    }
    
    // Проверяем сохраненные данные визитки
    const saved = localStorage.getItem('userInfo');
    if (saved) {
      try {
        const parsedInfo = JSON.parse(saved);
        // Обновляем имя из user, если оно отличается
        return {
          ...parsedInfo,
          name: userName
        };
      } catch {
        // Если не удалось распарсить, используем дефолтные значения
      }
    }
    
    return {
      name: userName,
      position: 'Генеральный директор',
      company: 'ООО "Инновационные решения"',
      phone: '+7 (999) 123-45-67',
      email: 'ivan@company.ru',
      website: 'company.ru',
      description: 'Предлагаем комплексные решения в области IT-консалтинга и автоматизации бизнес-процессов'
    };
  });

  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [activeTab, setActiveTab] = useState('my-cards');
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);

  useEffect(() => {
    const onboardingCompleted = localStorage.getItem('onboarding_completed');
    if (!onboardingCompleted) {
      setShowOnboarding(true);
    }
  }, []);

  useEffect(() => {
    const handleEditCard = (event: CustomEvent) => {
      const { cardId } = event.detail;
      setSelectedCardId(cardId);
      setActiveTab('edit');
    };

    window.addEventListener('editCard', handleEditCard as EventListener);
    return () => window.removeEventListener('editCard', handleEditCard as EventListener);
  }, []);

  useEffect(() => {
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
  }, [userInfo]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    const choice = localStorage.getItem('onboarding_choice');
    
    if (choice === 'tour') {
      setTimeout(() => setShowTour(true), 500);
    } else if (choice === 'video') {
      setTimeout(() => setShowVideo(true), 500);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-green/20 bg-background/90 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo size="md" />
          <div className="flex items-center gap-2 md:gap-4">
            <ThemeToggle />
            <HelpButton 
              onStartTour={() => setShowTour(true)}
              onWatchVideo={() => setShowVideo(true)}
              onViewAnalytics={() => setAnalyticsOpen(true)}
            />
            <Badge variant="outline" className="border-green text-green font-semibold hidden sm:flex">Базовый тариф</Badge>
            <Button variant="ghost" className="hover:text-green" onClick={onLogout}>
              <Icon name="LogOut" className="mr-0 sm:mr-2" size={18} />
              <span className="hidden sm:inline">Выйти</span>
            </Button>
          </div>
        </div>
      </header>

      <AnalyticsDashboard open={analyticsOpen} onOpenChange={setAnalyticsOpen} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 gradient-text">Личный кабинет</h1>
          <p className="text-muted-foreground">Управляйте своей цифровой визиткой</p>
        </div>

        <ProgressTracker userInfo={userInfo} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="flex flex-wrap justify-start gap-2 h-auto w-full bg-muted/50 p-2">
            <TabsTrigger value="my-cards" className="flex-shrink-0">
              <Icon name="FolderOpen" size={18} />
              <span className="ml-2">Мои визитки</span>
            </TabsTrigger>
            <TabsTrigger value="card" className="flex-shrink-0">
              <Icon name="CreditCard" size={18} />
              <span className="ml-2">Визитка</span>
            </TabsTrigger>
            <TabsTrigger value="edit" className="flex-shrink-0">
              <Icon name="Edit" size={18} />
              <span className="ml-2">Редактировать</span>
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex-shrink-0">
              <Icon name="LayoutTemplate" size={18} />
              <span className="ml-2">Шаблоны</span>
            </TabsTrigger>
            <TabsTrigger value="templates-ads" className="flex-shrink-0">
              <Icon name="FileImage" size={18} />
              <span className="ml-2 flex items-center gap-1">
                Макеты
                <Badge className="ml-1 text-xs bg-green/20 text-green">NEW</Badge>
              </span>
            </TabsTrigger>
            <TabsTrigger value="design" className="flex-shrink-0">
              <Icon name="Palette" size={18} />
              <span className="ml-2">Дизайн</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex-shrink-0">
              <Icon name="BarChart" size={18} />
              <span className="ml-2">Аналитика</span>
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex-shrink-0">
              <Icon name="Plug" size={18} />
              <span className="ml-2">Интеграции</span>
            </TabsTrigger>
            <TabsTrigger value="team" className="flex-shrink-0">
              <Icon name="Users" size={18} />
              <span className="ml-2">Команда</span>
            </TabsTrigger>
            <TabsTrigger value="leads" className="flex-shrink-0">
              <Icon name="Inbox" size={18} />
              <span className="ml-2">Лиды</span>
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="flex-shrink-0">
              <Icon name="Briefcase" size={18} />
              <span className="ml-2">Портфолио</span>
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex-shrink-0">
              <Icon name="Star" size={18} />
              <span className="ml-2">Отзывы</span>
            </TabsTrigger>
            <TabsTrigger value="subscription" className="flex-shrink-0">
              <Icon name="Sparkles" size={18} />
              <span className="ml-2">Подписка</span>
            </TabsTrigger>

            <TabsTrigger value="settings" className="flex-shrink-0">
              <Icon name="Settings" size={18} />
              <span className="ml-2">Настройки</span>
            </TabsTrigger>
            <TabsTrigger value="health" className="flex-shrink-0">
              <Icon name="Activity" size={18} />
              <span className="ml-2">Система</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-cards" className="space-y-6">
            <MyCardsTab />
          </TabsContent>

          <TabsContent value="card" className="space-y-6">
            <BusinessCardTab userInfo={userInfo} />
          </TabsContent>

          <TabsContent value="edit" className="space-y-6">
            <EditTab userInfo={userInfo} setUserInfo={setUserInfo} selectedCardId={selectedCardId} />
          </TabsContent>

          <TabsContent value="design" className="space-y-6">
            <DesignTab />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsTab />
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <TemplatesTab onApplyTemplate={(template) => {
              localStorage.setItem('design_completed', 'true');
              alert(`Применён шаблон: ${template.name}`);
            }} />
          </TabsContent>

          <TabsContent value="templates-ads" className="space-y-6">
            <TemplatesAndAdsTab />
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <IntegrationsTab />
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <TeamManagementTab />
          </TabsContent>

          <TabsContent value="leads" className="space-y-6">
            <LeadsTab />
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            <PortfolioTab />
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <Reviews />
          </TabsContent>

          <TabsContent value="subscription" className="space-y-6">
            <SubscriptionTab />
          </TabsContent>



          <TabsContent value="settings" className="space-y-6">
            <SettingsTab />
          </TabsContent>

          <TabsContent value="health" className="space-y-6">
            <SystemHealthTab />
          </TabsContent>
        </Tabs>
      </main>

      <OnboardingFlow 
        open={showOnboarding} 
        onComplete={handleOnboardingComplete}
        userName={userInfo.name.split(' ')[0]}
      />

      <DemoTour 
        open={showTour} 
        onOpenChange={setShowTour}
        plan="basic"
        onComplete={() => setShowTour(false)}
      />

      <VideoDemo 
        open={showVideo} 
        onOpenChange={setShowVideo}
      />

      <WelcomeNotification 
        userName={userInfo.name.split(' ')[0]}
        onStartTour={() => setShowTour(true)}
      />
    </div>
  );
};

export default Dashboard;