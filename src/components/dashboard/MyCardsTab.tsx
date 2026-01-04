import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import CardItem from './cards/CardItem';
import CreateCardDialog from './cards/CreateCardDialog';
import DeleteCardDialog from './cards/DeleteCardDialog';
import { CardData, NewCardForm, EmptyCardsState, formatPhone, fetchWithRetry } from './cards';

const MyCardsTab = () => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<CardData | null>(null);
  const [newCard, setNewCard] = useState<NewCardForm>({
    name: '',
    position: '',
    company: '',
    phone: '',
    email: '',
    website: '',
    description: '',
    logo_url: ''
  });
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    setLoading(true);
    try {
      const authToken = localStorage.getItem('auth_token');
      const response = await fetchWithRetry('https://functions.poehali.dev/1b1c5f28-bcb7-48d0-9437-b01ccc89239f', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': authToken || ''
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCards(data.cards || []);
      } else {
        toast.error('Не удалось загрузить визитки');
      }
    } catch (error) {
      toast.error('Не удалось загрузить визитки');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCard = async () => {
    if (!newCard.name) {
      toast.error('Укажите имя');
      return;
    }

    setCreating(true);
    try {
      const authToken = localStorage.getItem('auth_token');
      const response = await fetchWithRetry('https://functions.poehali.dev/1b1c5f28-bcb7-48d0-9437-b01ccc89239f', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': authToken || ''
        },
        body: JSON.stringify(newCard)
      });

      if (response.ok) {
        toast.success('Визитка создана!');
        setCreateDialogOpen(false);
        setNewCard({
          name: '',
          position: '',
          company: '',
          phone: '',
          email: '',
          website: '',
          description: '',
          logo_url: ''
        });
        loadCards();
      } else {
        const errorData = await response.json();
        console.error('Create card error:', errorData);
        throw new Error(errorData.error || 'Failed to create');
      }
    } catch (error) {
      console.error('Create card exception:', error);
      toast.error('Не удалось создать визитку');
    } finally {
      setCreating(false);
    }
  };

  const copyCardLink = (id: number) => {
    const url = `${window.location.origin}/card/${id}`;
    navigator.clipboard.writeText(url);
    localStorage.setItem('card_shared', 'true');
    toast.success('Ссылка скопирована!');
  };

  const editCard = (id: number) => {
    // Trigger edit tab switch with card ID
    window.dispatchEvent(new CustomEvent('editCard', { detail: { cardId: id } }));
  };

  const previewCard = (id: number) => {
    // Open card in new tab for preview
    window.open(`/card/${id}`, '_blank');
  };

  const handleDeleteClick = (card: CardData) => {
    setCardToDelete(card);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!cardToDelete) return;

    setDeleting(true);
    try {
      const authToken = localStorage.getItem('auth_token');
      const response = await fetchWithRetry('https://functions.poehali.dev/687d39ad-03bb-4587-a6f7-8eece4855a60', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': authToken || ''
        },
        body: JSON.stringify({ id: cardToDelete.id })
      });

      if (response.ok) {
        toast.success('Визитка удалена');
        setDeleteDialogOpen(false);
        setCardToDelete(null);
        loadCards();
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      toast.error('Не удалось удалить визитку');
    } finally {
      setDeleting(false);
    }
  };

  const handleDuplicateCard = async (card: CardData) => {
    try {
      const authToken = localStorage.getItem('auth_token');
      const response = await fetch('https://functions.poehali.dev/1b1c5f28-bcb7-48d0-9437-b01ccc89239f', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': authToken || ''
        },
        body: JSON.stringify({
          name: `${card.name} (копия)`,
          position: card.position || '',
          company: card.company || '',
          phone: card.phone || '',
          email: card.email || '',
          website: card.website || '',
          description: card.description || '',
          logo_url: card.logo_url || ''
        })
      });

      if (response.ok) {
        toast.success('Визитка продублирована!');
        loadCards();
      } else {
        throw new Error('Failed to duplicate');
      }
    } catch (error) {
      toast.error('Не удалось дублировать визитку');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
          <p className="text-muted-foreground">Загрузка визиток...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Мои визитки</h2>
          <p className="text-muted-foreground">Управляйте несколькими визитками для разных целей</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} className="bg-gold text-black hover:bg-gold/90">
          <Icon name="Plus" size={18} className="mr-2" />
          Создать визитку
        </Button>
      </div>

      {/* Cards Grid */}
      {cards.length === 0 ? (
        <EmptyCardsState onCreateClick={() => setCreateDialogOpen(true)} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <CardItem
              key={card.id}
              card={card}
              onEdit={editCard}
              onPreview={previewCard}
              onCopyLink={copyCardLink}
              onDuplicate={handleDuplicateCard}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* Create Card Dialog */}
      <CreateCardDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        newCard={newCard}
        onNewCardChange={setNewCard}
        creating={creating}
        onCreateCard={handleCreateCard}
        formatPhone={formatPhone}
      />

      {/* Delete Card Dialog */}
      <DeleteCardDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        card={cardToDelete}
        deleting={deleting}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default MyCardsTab;