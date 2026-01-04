import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { TeamStats } from './types';

interface TeamStatsGridProps {
  stats: TeamStats;
}

const TeamStatsGrid = ({ stats }: TeamStatsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="border-gold/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Icon name="Users" className="text-gold" size={18} />
            Всего визиток
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gold">{stats.totalMembers}</div>
          <p className="text-xs text-muted-foreground mt-1">из 20 доступных</p>
        </CardContent>
      </Card>

      <Card className="border-gold/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Icon name="UserCheck" className="text-gold" size={18} />
            Активные
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gold">{stats.activeMembers}</div>
          <p className="text-xs text-muted-foreground mt-1">используют визитки</p>
        </CardContent>
      </Card>

      <Card className="border-gold/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Icon name="Eye" className="text-gold" size={18} />
            Всего просмотров
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gold">{stats.totalViews}</div>
          <p className="text-xs text-muted-foreground mt-1">за всё время</p>
        </CardContent>
      </Card>

      <Card className="border-gold/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Icon name="Plus" className="text-gold" size={18} />
            Доступно мест
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gold">{stats.availableSlots}</div>
          <p className="text-xs text-muted-foreground mt-1">можно добавить</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamStatsGrid;
