import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface CardData {
  id: number;
  name: string;
  position?: string;
  company?: string;
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
  logo_url?: string;
  view_count: number;
  created_at: string;
}

interface CardItemProps {
  card: CardData;
  onOpen: (id: number) => void;
  onCopyLink: (id: number) => void;
  onDuplicate: (card: CardData) => void;
  onDelete: (card: CardData) => void;
}

const CardItem = ({ card, onOpen, onCopyLink, onDuplicate, onDelete }: CardItemProps) => {
  return (
    <Card key={card.id} className="border-gold/20 hover:border-gold/40 transition-colors">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          {card.logo_url ? (
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gold/20">
              <img src={card.logo_url} alt={card.name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center border-2 border-gold/20">
              <Icon name="User" size={32} className="text-gold/60" />
            </div>
          )}
          <Badge variant="outline" className="text-xs">
            <Icon name="Eye" size={12} className="mr-1" />
            {card.view_count}
          </Badge>
        </div>
        <CardTitle className="text-lg">{card.name}</CardTitle>
        <CardDescription>
          {card.position && <span>{card.position}</span>}
          {card.position && card.company && <span> • </span>}
          {card.company && <span>{card.company}</span>}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4 text-sm">
          {card.phone && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Icon name="Phone" size={14} />
              <span>{card.phone}</span>
            </div>
          )}
          {card.email && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Icon name="Mail" size={14} />
              <span className="truncate">{card.email}</span>
            </div>
          )}
          {card.website && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Icon name="Globe" size={14} />
              <span className="truncate">{card.website}</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => onOpen(card.id)}
            className="w-full bg-gold text-black hover:bg-gold/90"
          >
            <Icon name="Edit" size={14} className="mr-2" />
            Редактировать
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCopyLink(card.id)}
            className="w-full"
          >
            <Icon name="Copy" size={14} className="mr-2" />
            Скопировать ссылку
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDuplicate(card)}
            className="w-full text-gold hover:text-gold hover:bg-gold/10"
          >
            <Icon name="CopyPlus" size={14} className="mr-2" />
            Дублировать
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(card)}
            className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Icon name="Trash2" size={14} className="mr-2" />
            Удалить
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardItem;
