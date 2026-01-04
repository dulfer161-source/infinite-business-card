import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { SecretStatus, categoryIcons, categoryLabels } from './types';

interface SecretsCardProps {
  secrets: SecretStatus[];
}

const SecretsCard = ({ secrets }: SecretsCardProps) => {
  const missingCount = secrets.filter(s => s.status === 'missing').length;

  const groupedSecrets = secrets.reduce((acc, secret) => {
    if (!acc[secret.category]) acc[secret.category] = [];
    acc[secret.category].push(secret);
    return acc;
  }, {} as Record<string, SecretStatus[]>);

  return (
    <Card className="border-green/20">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Icon name="Key" size={20} className="text-green" />
            Секреты
          </span>
          <Badge variant={missingCount === 0 ? 'default' : 'destructive'}>
            {secrets.length - missingCount}/{secrets.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(groupedSecrets).map(([category, items]) => (
          <div key={category} className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Icon name={categoryIcons[category as keyof typeof categoryIcons]} size={16} className="text-muted-foreground" />
              {categoryLabels[category as keyof typeof categoryLabels]}
            </div>
            <div className="space-y-1 ml-6">
              {items.map(secret => (
                <div key={secret.name} className="flex items-center justify-between text-sm py-1">
                  <span className="text-muted-foreground">{secret.description}</span>
                  {secret.status === 'configured' ? (
                    <Badge variant="outline" className="border-green text-green">
                      <Icon name="Check" size={12} className="mr-1" />
                      Настроен
                    </Badge>
                  ) : secret.status === 'missing' ? (
                    <Badge variant="destructive" className="text-xs">
                      <Icon name="X" size={12} className="mr-1" />
                      Отсутствует
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      <Icon name="Loader2" size={12} className="mr-1 animate-spin" />
                      Проверка
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default SecretsCard;
