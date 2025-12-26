import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import TemplatesManager from '@/components/TemplatesManager';
import AdZonesManager from '@/components/AdZonesManager';
import { api } from '@/lib/api';

const TemplatesAndAdsTab = () => {
  const [cards, setCards] = useState<any[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      setLoading(true);
      const response = await api.getCards();
      const userCards = response.cards || [];
      setCards(userCards);
      
      if (userCards.length > 0 && !selectedCardId) {
        setSelectedCardId(userCards[0].id);
      }
    } catch (error) {
      console.error('Failed to load cards:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Icon name="Loader2" size={48} className="animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <Alert>
        <Icon name="Info" size={18} />
        <AlertDescription>
          Сначала создайте визитку во вкладке "Мои визитки"
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold gradient-text">Макеты и реклама</h2>
          <p className="text-muted-foreground">Управляйте дизайном и монетизацией визиток</p>
        </div>
        <div className="flex gap-2">
          {cards.map((card) => (
            <button
              key={card.id}
              onClick={() => setSelectedCardId(card.id)}
              className={`px-4 py-2 rounded-lg border transition-all ${
                selectedCardId === card.id
                  ? 'bg-green text-white border-green'
                  : 'bg-background border-border hover:border-green/50'
              }`}
            >
              {card.name}
            </button>
          ))}
        </div>
      </div>

      <Alert className="bg-blue/5 border-blue/20">
        <Icon name="Lightbulb" size={18} className="text-blue" />
        <AlertDescription>
          <strong>Базовый тариф:</strong> Загрузка и генерация макетов доступны.
          <br />
          <strong>Премиум:</strong> Безлимитные макеты + продажа рекламных мест на визитке.
        </AlertDescription>
      </Alert>

      {selectedCardId && (
        <div className="grid md:grid-cols-2 gap-6">
          <TemplatesManager cardId={selectedCardId} />
          <AdZonesManager cardId={selectedCardId} />
        </div>
      )}
    </div>
  );
};

export default TemplatesAndAdsTab;
