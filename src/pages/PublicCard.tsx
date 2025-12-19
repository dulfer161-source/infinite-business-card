import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import CardViewMode from '@/components/card/CardViewMode';
import CardEditMode from '@/components/card/CardEditMode';
import LeadFormSection from '@/components/card/LeadFormSection';

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
}

const PublicCard = () => {
  const { id } = useParams<{ id: string }>();
  const [card, setCard] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editForm, setEditForm] = useState<CardData | null>(null);
  const [saving, setSaving] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchCard = async () => {
      if (!id) return;
      
      try {
        const response = await fetch(`https://functions.poehali.dev/1b1c5f28-bcb7-48d0-9437-b01ccc89239f?id=${id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
          throw new Error('Визитка не найдена');
        }

        const data = await response.json();
        setCard(data.card);
        setEditForm(data.card);
        
        // Проверяем владельца
        const authToken = localStorage.getItem('auth_token');
        const user = localStorage.getItem('user');
        if (authToken && user) {
          const userData = JSON.parse(user);
          setIsOwner(data.card.user_id === userData.id);
        }
        
        // Track view
        await fetch(`https://functions.poehali.dev/1b1c5f28-bcb7-48d0-9437-b01ccc89239f?id=${id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        }).catch(console.error);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки');
      } finally {
        setLoading(false);
      }
    };

    fetchCard();
  }, [id]);

  const handleContact = (type: 'phone' | 'email' | 'website') => {
    if (!card) return;
    
    if (type === 'phone' && card.phone) {
      window.location.href = `tel:${card.phone}`;
    } else if (type === 'email' && card.email) {
      window.location.href = `mailto:${card.email}`;
    } else if (type === 'website' && card.website) {
      window.open(`https://${card.website.replace(/^https?:\/\//, '')}`, '_blank');
    }
  };

  const shareCard = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: card?.name || 'Цифровая визитка',
          text: card?.description || 'Моя визитка на visitka.site',
          url
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('Ссылка скопирована!');
    }
  };

  const handleEditToggle = () => {
    if (isEditMode) {
      setEditForm(card);
    }
    setIsEditMode(!isEditMode);
  };

  const handleEditFormChange = (field: keyof CardData, value: string) => {
    if (!editForm) return;
    setEditForm({ ...editForm, [field]: value });
  };

  const handleSaveCard = async () => {
    if (!editForm) return;
    
    setSaving(true);
    try {
      const authToken = localStorage.getItem('auth_token');
      const response = await fetch('https://functions.poehali.dev/1b1c5f28-bcb7-48d0-9437-b01ccc89239f', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': authToken || ''
        },
        body: JSON.stringify({
          id: editForm.id,
          name: editForm.name,
          position: editForm.position || '',
          company: editForm.company || '',
          phone: editForm.phone || '',
          email: editForm.email || '',
          website: editForm.website || '',
          description: editForm.description || '',
          logo_url: editForm.logo_url || ''
        })
      });

      if (!response.ok) {
        throw new Error('Ошибка сохранения');
      }

      const data = await response.json();
      setCard(data.card);
      setEditForm(data.card);
      setIsEditMode(false);
      toast.success('Визитка обновлена!');
    } catch (error) {
      toast.error('Не удалось сохранить изменения');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-gold/5">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
          <p className="text-muted-foreground">Загрузка визитки...</p>
        </div>
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-gold/5 p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <Icon name="AlertCircle" size={48} className="mx-auto mb-4 text-destructive" />
          <h1 className="text-2xl font-bold mb-2">Визитка не найдена</h1>
          <p className="text-muted-foreground mb-6">{error || 'Проверьте правильность ссылки'}</p>
          <Button onClick={() => window.location.href = '/'} className="bg-gold text-black hover:bg-gold/90">
            Создать свою визитку
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{card.name} — Цифровая визитка</title>
        <meta name="description" content={card.description || `Визитка ${card.name}${card.position ? ` — ${card.position}` : ''}`} />
        <meta property="og:title" content={`${card.name} — Цифровая визитка`} />
        <meta property="og:description" content={card.description || `Свяжитесь с ${card.name}`} />
        <meta property="og:type" content="profile" />
        {card.logo_url && <meta property="og:image" content={card.logo_url} />}
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-gold/5 py-8 px-4">
        <div className="container max-w-2xl mx-auto">
          {isEditMode && editForm ? (
            <CardEditMode
              editForm={editForm}
              saving={saving}
              onEditFormChange={handleEditFormChange}
              onSave={handleSaveCard}
              onCancel={handleEditToggle}
            />
          ) : (
            <CardViewMode
              card={card}
              isOwner={isOwner}
              onEditToggle={handleEditToggle}
              onContact={handleContact}
              onShare={shareCard}
            />
          )}

          {!isEditMode && <LeadFormSection cardId={card.id} />}
        </div>
      </div>
    </>
  );
};

export default PublicCard;