import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import Logo from '@/components/Logo';
import { Helmet } from 'react-helmet-async';
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
}

const PublicCard = () => {
  const { id } = useParams<{ id: string }>();
  const [card, setCard] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadForm, setLeadForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submittingLead, setSubmittingLead] = useState(false);

  useEffect(() => {
    const fetchCard = async () => {
      if (!id) return;
      
      try {
        const response = await fetch(`https://functions.poehali.dev/1b1c5f28-bcb7-48d0-9437-b01ccc89239f/${id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
          throw new Error('Визитка не найдена');
        }

        const data = await response.json();
        setCard(data.card);
        
        // Track view
        await fetch(`https://functions.poehali.dev/1b1c5f28-bcb7-48d0-9437-b01ccc89239f/${id}/view`, {
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

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!leadForm.name || (!leadForm.email && !leadForm.phone)) {
      toast.error('Укажите имя и хотя бы один контакт');
      return;
    }

    setSubmittingLead(true);
    try {
      const response = await fetch('https://functions.poehali.dev/fab78694-2899-42fa-b327-8aad2ebfa9bb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          card_id: card?.id,
          ...leadForm,
          source: 'direct'
        })
      });

      if (response.ok) {
        toast.success('Спасибо! Ваша заявка отправлена');
        setLeadForm({ name: '', email: '', phone: '', message: '' });
        setShowLeadForm(false);
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      toast.error('Ошибка отправки. Попробуйте ещё раз');
    } finally {
      setSubmittingLead(false);
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
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-4">
              <Logo size="md" />
            </div>
            <Badge variant="outline" className="border-gold/50 text-gold/80">
              <Icon name="Eye" size={14} className="mr-1" />
              {card.view_count} просмотров
            </Badge>
          </div>

          {/* Main Card */}
          <Card className="overflow-hidden border-2 border-gold/20 shadow-xl">
            {/* Avatar/Logo Section */}
            <div className="bg-gradient-to-r from-gold/10 to-gold/5 p-8 text-center">
              {card.logo_url ? (
                <img 
                  src={card.logo_url} 
                  alt={card.name}
                  className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-gold/30 shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 mx-auto rounded-full bg-gold/20 flex items-center justify-center border-4 border-gold/30 shadow-lg">
                  <span className="text-5xl font-bold text-gold">
                    {card.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="p-8 space-y-6">
              {/* Name & Position */}
              <div className="text-center">
                <h1 className="text-3xl font-bold mb-2">{card.name}</h1>
                {card.position && (
                  <p className="text-xl text-gold mb-1">{card.position}</p>
                )}
                {card.company && (
                  <p className="text-lg text-muted-foreground">{card.company}</p>
                )}
              </div>

              {/* Description */}
              {card.description && (
                <div className="bg-muted/30 rounded-lg p-4 text-center">
                  <p className="text-foreground/90">{card.description}</p>
                </div>
              )}

              {/* Contact Buttons */}
              <div className="grid grid-cols-1 gap-3">
                {card.phone && (
                  <Button
                    onClick={() => handleContact('phone')}
                    className="w-full bg-gold hover:bg-gold/90 text-black font-semibold h-14 text-lg"
                  >
                    <Icon name="Phone" className="mr-3" size={20} />
                    {card.phone}
                  </Button>
                )}

                {card.email && (
                  <Button
                    onClick={() => handleContact('email')}
                    variant="outline"
                    className="w-full border-2 border-gold/50 hover:bg-gold/10 h-14 text-lg"
                  >
                    <Icon name="Mail" className="mr-3" size={20} />
                    {card.email}
                  </Button>
                )}

                {card.website && (
                  <Button
                    onClick={() => handleContact('website')}
                    variant="outline"
                    className="w-full border-2 border-gold/50 hover:bg-gold/10 h-14 text-lg"
                  >
                    <Icon name="Globe" className="mr-3" size={20} />
                    {card.website}
                  </Button>
                )}
              </div>

              {/* Share Button */}
              <Button
                onClick={shareCard}
                variant="ghost"
                className="w-full"
              >
                <Icon name="Share2" className="mr-2" size={18} />
                Поделиться визиткой
              </Button>
            </div>
          </Card>

          {/* Lead Form */}
          {!showLeadForm ? (
            <Card className="overflow-hidden border-2 border-gold/20 shadow-xl mt-6">
              <div className="bg-gradient-to-r from-gold/10 to-gold/5 p-6 text-center">
                <Icon name="MessageSquare" size={40} className="mx-auto mb-3 text-gold" />
                <h3 className="text-xl font-bold mb-2">Есть вопросы?</h3>
                <p className="text-muted-foreground mb-4">Оставьте свои контакты, и мы свяжемся с вами</p>
                <Button
                  onClick={() => setShowLeadForm(true)}
                  className="bg-gold text-black hover:bg-gold/90 font-semibold"
                >
                  <Icon name="Edit" className="mr-2" size={18} />
                  Оставить заявку
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="overflow-hidden border-2 border-gold/20 shadow-xl mt-6">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Icon name="MessageSquare" size={24} className="text-gold" />
                    Оставить заявку
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowLeadForm(false)}
                  >
                    <Icon name="X" size={20} />
                  </Button>
                </div>
                
                <form onSubmit={handleSubmitLead} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Имя *</label>
                    <Input
                      value={leadForm.name}
                      onChange={(e) => setLeadForm({...leadForm, name: e.target.value})}
                      placeholder="Ваше имя"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email</label>
                    <Input
                      type="email"
                      value={leadForm.email}
                      onChange={(e) => setLeadForm({...leadForm, email: e.target.value})}
                      placeholder="example@mail.com"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Телефон</label>
                    <Input
                      type="tel"
                      value={leadForm.phone}
                      onChange={(e) => setLeadForm({...leadForm, phone: e.target.value})}
                      placeholder="+7 (999) 123-45-67"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Сообщение</label>
                    <Textarea
                      value={leadForm.message}
                      onChange={(e) => setLeadForm({...leadForm, message: e.target.value})}
                      placeholder="Расскажите о вашем вопросе..."
                      rows={4}
                    />
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    * Укажите хотя бы один контакт: email или телефон
                  </p>
                  
                  <Button
                    type="submit"
                    className="w-full bg-gold text-black hover:bg-gold/90 font-semibold"
                    disabled={submittingLead}
                  >
                    {submittingLead ? 'Отправка...' : 'Отправить заявку'}
                  </Button>
                </form>
              </div>
            </Card>
          )}

          {/* Footer CTA */}
          <div className="mt-8 text-center">
            <p className="text-muted-foreground mb-4">Создайте свою цифровую визитку за 2 минуты</p>
            <Button 
              onClick={() => window.location.href = '/'}
              className="bg-gold text-black hover:bg-gold/90 font-semibold"
            >
              <Icon name="Sparkles" className="mr-2" size={18} />
              Создать бесплатно
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PublicCard;