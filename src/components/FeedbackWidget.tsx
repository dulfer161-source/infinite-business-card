import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://functions.poehali.dev/d4e7pfgv8eppfgjj9crj/auth?action=feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          email,
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setMessage('');
        setEmail('');
        setTimeout(() => {
          setIsOpen(false);
          setSubmitted(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Feedback error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gold text-black p-4 rounded-full shadow-lg hover:bg-gold/90 transition-all hover:scale-110 z-50"
        aria-label="Сообщить об ошибке"
      >
        <Icon name="MessageCircle" size={24} />
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Сообщить об ошибке</DialogTitle>
            <DialogDescription>
              Опишите проблему, с которой вы столкнулись. Мы постараемся исправить её как можно скорее.
            </DialogDescription>
          </DialogHeader>

          {submitted ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                <Icon name="Check" size={32} className="text-green-500" />
              </div>
              <p className="text-center text-green-500 font-medium">
                Спасибо! Ваше сообщение отправлено
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email (необязательно)
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Описание проблемы *
                </label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Опишите, что пошло не так..."
                  required
                  rows={5}
                  className="resize-none"
                />
              </div>

              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  disabled={isSubmitting}
                >
                  Отмена
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !message.trim()}
                  className="bg-gold text-black hover:bg-gold/90"
                >
                  {isSubmitting ? (
                    <>
                      <Icon name="Loader2" size={16} className="animate-spin mr-2" />
                      Отправка...
                    </>
                  ) : (
                    'Отправить'
                  )}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}