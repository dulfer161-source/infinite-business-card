import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { TeamMember, TeamStats, TeamStatsGrid, TeamMemberCard, mockTeamMembers } from './team';

const TeamManagementTab = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const teamMembers: TeamMember[] = mockTeamMembers;

  const stats: TeamStats = {
    totalMembers: teamMembers.length,
    activeMembers: teamMembers.filter(m => m.status === 'active').length,
    totalViews: teamMembers.reduce((sum, m) => sum + m.views, 0),
    availableSlots: 15
  };

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <TeamStatsGrid stats={stats} />

      <Card className="border-gold/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Users" className="text-gold" size={24} />
                Управление командой
              </CardTitle>
              <CardDescription className="mt-1">
                Добавляйте сотрудников и управляйте их визитками
              </CardDescription>
            </div>
            <Button className="bg-gold text-black hover:bg-gold/90">
              <Icon name="UserPlus" className="mr-2" size={18} />
              Пригласить сотрудника
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Поиск по имени, email или отделу..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="border-gold/30">
              <Icon name="Filter" className="mr-2" size={18} />
              Фильтры
            </Button>
          </div>

          <div className="space-y-2">
            {filteredMembers.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-gold/20 bg-gold/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Icon name="Zap" className="text-gold" size={20} />
            Быстрые действия
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start h-auto py-4 border-gold/30">
              <div className="text-left">
                <div className="flex items-center gap-2 mb-1">
                  <Icon name="Upload" size={18} className="text-gold" />
                  <span className="font-semibold">Импорт из CSV</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Массовое добавление сотрудников
                </p>
              </div>
            </Button>

            <Button variant="outline" className="justify-start h-auto py-4 border-gold/30">
              <div className="text-left">
                <div className="flex items-center gap-2 mb-1">
                  <Icon name="Download" size={18} className="text-gold" />
                  <span className="font-semibold">Экспорт отчёта</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Статистика в Excel/CSV
                </p>
              </div>
            </Button>

            <Button variant="outline" className="justify-start h-auto py-4 border-gold/30">
              <div className="text-left">
                <div className="flex items-center gap-2 mb-1">
                  <Icon name="Mail" size={18} className="text-gold" />
                  <span className="font-semibold">Массовая рассылка</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Отправить инструкции команде
                </p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamManagementTab;