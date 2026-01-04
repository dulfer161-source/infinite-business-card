import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface EmptyCardsStateProps {
  onCreateClick: () => void;
}

const EmptyCardsState = ({ onCreateClick }: EmptyCardsStateProps) => {
  return (
    <Card className="border-2 border-dashed border-gold/30">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Icon name="CreditCard" size={64} className="text-gold/40 mb-4" />
        <h3 className="text-xl font-bold mb-2">У вас пока нет визиток</h3>
        <p className="text-muted-foreground mb-6 text-center max-w-sm">
          Создайте свою первую цифровую визитку и делитесь ей с клиентами
        </p>
        <Button onClick={onCreateClick} className="bg-gold text-black hover:bg-gold/90">
          <Icon name="Plus" size={18} className="mr-2" />
          Создать первую визитку
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyCardsState;
