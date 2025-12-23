import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface LeadFormSectionProps {
  cardId: number;
}

const LeadFormSection = ({ cardId }: LeadFormSectionProps) => {
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadForm, setLeadForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submittingLead, setSubmittingLead] = useState(false);

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    
    if (cleaned.length === 0) return '';
    
    let formatted = '+7';
    if (cleaned.length > 1) {
      formatted += ' (' + cleaned.substring(1, 4);
    }
    if (cleaned.length >= 5) {
      formatted += ') ' + cleaned.substring(4, 7);
    }
    if (cleaned.length >= 8) {
      formatted += '-' + cleaned.substring(7, 9);
    }
    if (cleaned.length >= 10) {
      formatted += '-' + cleaned.substring(9, 11);
    }
    
    return formatted;
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
          card_id: cardId,
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

  return (
    <>
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
              <h3 className="text-xl font-bold">Оставить заявку</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowLeadForm(false)}>
                <Icon name="X" size={18} />
              </Button>
            </div>
            
            <form onSubmit={handleSubmitLead} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Ваше имя *</label>
                <Input
                  value={leadForm.name}
                  onChange={(e) => setLeadForm({...leadForm, name: e.target.value})}
                  placeholder="Иван Иванов"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  type="email"
                  value={leadForm.email}
                  onChange={(e) => setLeadForm({...leadForm, email: e.target.value})}
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Телефон</label>
                <Input
                  type="tel"
                  value={leadForm.phone}
                  onChange={(e) => {
                    const formatted = formatPhone(e.target.value);
                    setLeadForm({...leadForm, phone: formatted});
                  }}
                  placeholder="+7 (900) 123-45-67"
                  maxLength={18}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Сообщение</label>
                <Textarea
                  value={leadForm.message}
                  onChange={(e) => setLeadForm({...leadForm, message: e.target.value})}
                  placeholder="Расскажите о вашем вопросе..."
                  rows={4}
                  className="resize-none"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gold text-black hover:bg-gold/90 font-semibold"
                disabled={submittingLead}
              >
                {submittingLead ? (
                  <>
                    <Icon name="Loader2" className="mr-2 animate-spin" size={18} />
                    Отправка...
                  </>
                ) : (
                  <>
                    <Icon name="Send" className="mr-2" size={18} />
                    Отправить заявку
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                * Обязательно укажите имя и хотя бы один контакт (email или телефон)
              </p>
            </form>
          </div>
        </Card>
      )}

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>Создайте свою цифровую визитку на</p>
        <a 
          href="https://visitka.site" 
          className="text-gold hover:text-gold/80 font-semibold transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          visitka.site
        </a>
      </div>
    </>
  );
};

export default LeadFormSection;