import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

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

const MyCardsTab = () => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<CardData | null>(null);
  const [newCard, setNewCard] = useState({
    name: '',
    position: '',
    company: '',
    phone: '',
    email: '',
    website: '',
    description: ''
  });
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadCards();
  }, []);

  const fetchWithRetry = async (url: string, options: RequestInit, maxRetries = 3): Promise<Response> => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await fetch(url, options);
        if (response.status === 503 && i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
          continue;
        }
        return response;
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
    throw new Error('Max retries reached');
  };

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
          description: ''
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

  const openCard = (id: number) => {
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
          description: card.description || ''
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
        <Card className="border-2 border-dashed border-gold/30">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Icon name="CreditCard" size={64} className="text-gold/40 mb-4" />
            <h3 className="text-xl font-bold mb-2">У вас пока нет визиток</h3>
            <p className="text-muted-foreground mb-6 text-center">
              Создайте свою первую цифровую визитку
            </p>
            <Button onClick={() => setCreateDialogOpen(true)} className="bg-gold text-black hover:bg-gold/90">
              <Icon name="Plus" size={18} className="mr-2" />
              Создать первую визитку
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <Card key={card.id} className="border-gold/20 hover:border-gold/40 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  {card.logo_url ? (
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gold/20">
                      <img src={card.logo_url} alt={card.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center border-2 border-gold/20">
                      <Icon name="User" size={24} className="text-gold/60" />
                    </div>
                  )}
                  <Badge variant="outline" className="border-gold/50 text-gold/80">
                    <Icon name="Eye" size={12} className="mr-1" />
                    {card.view_count}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{card.name}</CardTitle>
                {card.position && (
                  <CardDescription className="text-sm">{card.position}</CardDescription>
                )}
                {card.company && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <Icon name="Briefcase" size={12} />
                    {card.company}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openCard(card.id)}
                    className="w-full"
                  >
                    <Icon name="ExternalLink" size={14} className="mr-2" />
                    Открыть
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => openCard(card.id)}
                    className="w-full bg-gold text-black hover:bg-gold/90"
                  >
                    <Icon name="Edit" size={14} className="mr-2" />
                    Редактировать
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyCardLink(card.id)}
                    className="w-full"
                  >
                    <Icon name="Copy" size={14} className="mr-2" />
                    Скопировать ссылку
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDuplicateCard(card)}
                    className="w-full text-gold hover:text-gold hover:bg-gold/10"
                  >
                    <Icon name="CopyPlus" size={14} className="mr-2" />
                    Дублировать
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteClick(card)}
                    className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Icon name="Trash2" size={14} className="mr-2" />
                    Удалить
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Card Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Создать новую визитку</DialogTitle>
            <DialogDescription>
              Заполните информацию для вашей новой визитки
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-2">Имя *</label>
              <Input
                value={newCard.name}
                onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
                placeholder="Иван Иванов"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Должность</label>
              <Input
                value={newCard.position}
                onChange={(e) => setNewCard({ ...newCard, position: e.target.value })}
                placeholder="Менеджер по продажам"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Компания</label>
              <Input
                value={newCard.company}
                onChange={(e) => setNewCard({ ...newCard, company: e.target.value })}
                placeholder="ООО «Компания»"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Телефон</label>
              <Input
                type="tel"
                value={newCard.phone}
                onChange={(e) => setNewCard({ ...newCard, phone: e.target.value })}
                placeholder="+7 (900) 123-45-67"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                value={newCard.email}
                onChange={(e) => setNewCard({ ...newCard, email: e.target.value })}
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Сайт</label>
              <Input
                value={newCard.website}
                onChange={(e) => setNewCard({ ...newCard, website: e.target.value })}
                placeholder="example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">О себе</label>
              <Textarea
                value={newCard.description}
                onChange={(e) => setNewCard({ ...newCard, description: e.target.value })}
                placeholder="Расскажите о себе..."
                rows={4}
                className="resize-none"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setCreateDialogOpen(false)}
                disabled={creating}
                className="flex-1"
              >
                Отмена
              </Button>
              <Button
                onClick={handleCreateCard}
                disabled={creating}
                className="flex-1 bg-gold text-black hover:bg-gold/90"
              >
                {creating ? (
                  <>
                    <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
                    Создание...
                  </>
                ) : (
                  <>
                    <Icon name="Check" size={18} className="mr-2" />
                    Создать
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить визитку?</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить визитку <strong>{cardToDelete?.name}</strong>?
              Это действие необратимо.
            </DialogDescription>
          </DialogHeader>

          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleting}
              className="flex-1"
            >
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="flex-1"
            >
              {deleting ? (
                <>
                  <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
                  Удаление...
                </>
              ) : (
                <>
                  <Icon name="Trash2" size={18} className="mr-2" />
                  Удалить
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyCardsTab;