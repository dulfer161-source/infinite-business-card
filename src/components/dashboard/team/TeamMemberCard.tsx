import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { TeamMember } from './types';

interface TeamMemberCardProps {
  member: TeamMember;
}

const TeamMemberCard = ({ member }: TeamMemberCardProps) => {
  const getStatusBadge = (status: TeamMember['status']) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="border-green-500 text-green-500">Активна</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Ожидает</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="border-gray-500 text-gray-500">Неактивна</Badge>;
    }
  };

  return (
    <Card className="border-border">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
              <Icon name="User" className="text-gold" size={24} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold">{member.name}</h4>
                {getStatusBadge(member.status)}
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {member.position} • {member.department}
              </p>
              <p className="text-xs text-muted-foreground">
                {member.email}
              </p>
            </div>

            <div className="hidden md:flex items-center gap-6 text-sm">
              <div className="text-center">
                <p className="font-semibold text-gold">{member.views}</p>
                <p className="text-xs text-muted-foreground">просмотров</p>
              </div>
              <div className="text-center min-w-[100px]">
                <p className="text-xs text-muted-foreground">{member.lastActive}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-4">
            <Button variant="ghost" size="icon" title="Просмотреть визитку">
              <Icon name="Eye" size={18} />
            </Button>
            <Button variant="ghost" size="icon" title="Редактировать">
              <Icon name="Edit" size={18} />
            </Button>
            <Button variant="ghost" size="icon" title="Настройки доступа">
              <Icon name="Settings" size={18} />
            </Button>
            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" title="Удалить">
              <Icon name="Trash2" size={18} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamMemberCard;
