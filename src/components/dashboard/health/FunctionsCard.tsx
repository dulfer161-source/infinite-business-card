import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { CloudFunction } from './types';

interface FunctionsCardProps {
  functions: CloudFunction[];
}

const FunctionsCard = ({ functions }: FunctionsCardProps) => {
  const healthyCount = functions.filter(f => f.status === 'healthy').length;

  return (
    <Card className="border-green/20">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Icon name="CloudCog" size={20} className="text-green" />
            Облачные функции
          </span>
          <Badge variant="default" className="bg-green">
            {healthyCount}/{functions.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {functions.map(func => (
          <div key={func.name} className="flex items-center justify-between text-sm py-2 border-b border-border/50 last:border-0">
            <span className="font-mono text-muted-foreground">/{func.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{func.requests} req</span>
              <Badge variant="outline" className="border-green text-green">
                <Icon name="Check" size={12} className="mr-1" />
                Активна
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default FunctionsCard;
