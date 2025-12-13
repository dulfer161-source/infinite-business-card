import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import Logo from './Logo';
import BusinessCardTab from './dashboard/BusinessCardTab';
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

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard = ({ onLogout }: DashboardProps) => {
  const [userInfo, setUserInfo] = useState({
    name: 'Иван Петров',
    position: 'Генеральный директор',
    company: 'ООО "Инновационные решения"',
    phone: '+7 (999) 123-45-67',
    email: 'ivan@company.ru',
    website: 'company.ru',
    description: 'Предлагаем комплексные решения в области IT-консалтинга и автоматизации бизнес-процессов'
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-teal/20 bg-background/90 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo size="md" />
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="border-teal text-teal font-semibold">Базовый тариф</Badge>
            <Button variant="ghost" className="hover:text-teal" onClick={onLogout}>
              <Icon name="LogOut" className="mr-2" size={18} />
              Выйти
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 gradient-text">Личный кабинет</h1>
          <p className="text-muted-foreground">Управляйте своей цифровой визиткой</p>
        </div>

        <Tabs defaultValue="card" className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-11 w-full">
            <TabsTrigger value="card">
              <Icon name="CreditCard" className="mr-2" size={18} />
              <span className="hidden sm:inline">Визитка</span>
            </TabsTrigger>
            <TabsTrigger value="edit">
              <Icon name="Edit" className="mr-2" size={18} />
              <span className="hidden sm:inline">Редактировать</span>
            </TabsTrigger>
            <TabsTrigger value="templates">
              <Icon name="LayoutTemplate" className="mr-2" size={18} />
              <span className="hidden sm:inline">Шаблоны</span>
            </TabsTrigger>
            <TabsTrigger value="design">
              <Icon name="Palette" className="mr-2" size={18} />
              <span className="hidden sm:inline">Дизайн</span>
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <Icon name="BarChart" className="mr-2" size={18} />
              <span className="hidden sm:inline">Аналитика</span>
            </TabsTrigger>
            <TabsTrigger value="integrations">
              <Icon name="Plug" className="mr-2" size={18} />
              <span className="hidden sm:inline">Интеграции</span>
            </TabsTrigger>
            <TabsTrigger value="team">
              <Icon name="Users" className="mr-2" size={18} />
              <span className="hidden sm:inline">Команда</span>
            </TabsTrigger>
            <TabsTrigger value="leads">
              <Icon name="Inbox" className="mr-2" size={18} />
              <span className="hidden sm:inline">Лиды</span>
            </TabsTrigger>
            <TabsTrigger value="portfolio">
              <Icon name="Briefcase" className="mr-2" size={18} />
              <span className="hidden sm:inline">Портфолио</span>
            </TabsTrigger>
            <TabsTrigger value="reviews">
              <Icon name="Star" className="mr-2" size={18} />
              <span className="hidden sm:inline">Отзывы</span>
            </TabsTrigger>
            <TabsTrigger value="referral">
              <Icon name="Gift" className="mr-2" size={18} />
              <span className="hidden sm:inline">Реферал</span>
            </TabsTrigger>
          </TabsList>

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

          <TabsContent value="referral" className="space-y-6">
            <ReferralTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;