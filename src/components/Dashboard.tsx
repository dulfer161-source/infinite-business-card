import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import Logo from './Logo';
import BusinessCardTab from './dashboard/BusinessCardTab';
import MyCardsTab from './dashboard/MyCardsTab';
import EditTab from './dashboard/EditTab';
import DesignTab from './dashboard/DesignTab';
import AnalyticsTab from './dashboard/AnalyticsTab';
import ReferralTab from './dashboard/ReferralTab';
import TemplatesTab from './dashboard/TemplatesTab';
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
    const saved = localStorage.getItem('userInfo');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Если не удалось распарсить, используем дефолтные значения
      }
    }
    return {
      name: 'Иван Петров',
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

  useEffect(() => {
    const onboardingCompleted = localStorage.getItem('onboarding_completed');
    if (!onboardingCompleted) {
      setShowOnboarding(true);
    }
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
          <div className="flex items-center gap-4">
            <HelpButton 
              onStartTour={() => setShowTour(true)}
              onWatchVideo={() => setShowVideo(true)}
              onViewAnalytics={() => setAnalyticsOpen(true)}
            />
            <Badge variant="outline" className="border-green text-green font-semibold">Базовый тариф</Badge>
            <Button variant="ghost" className="hover:text-green" onClick={onLogout}>
              <Icon name="LogOut" className="mr-2" size={18} />
              Выйти
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

        <Tabs defaultValue="my-cards" className="space-y-6">
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
            <TabsTrigger value="referral" className="flex-shrink-0">
              <Icon name="Gift" size={18} />
              <span className="ml-2">Реферал</span>
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
            <EditTab userInfo={userInfo} setUserInfo={setUserInfo} />
          </TabsContent>

          <TabsContent value="design" className="space-y-6">
            <DesignTab />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsTab />
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <TemplatesTab onApplyTemplate={(template) => alert(`Применён шаблон: ${template.name}`)} />
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

          <TabsContent value="referral" className="space-y-6">
            <ReferralTab />
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