import { useState } from 'react';
import { Bug, X, Send } from 'lucide-react';

export default function BugReportWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('https://functions.poehali.dev/063b09be-f07e-478c-a626-807980d111e1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'feedback',
          message: message.trim(),
          email: email.trim() || 'Не указан',
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        setSubmitStatus('success');
        setMessage('');
        setEmail('');
        setTimeout(() => {
          setIsOpen(false);
          setSubmitStatus('idle');
        }, 2000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Failed to send feedback:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-[#d4a574] to-[#b88a5e] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center z-50"
        aria-label="Сообщить об ошибке"
      >
        {isOpen ? <X size={24} /> : <Bug size={24} />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 bg-white rounded-lg shadow-2xl z-50 border border-gray-200">
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-[#d4a574] to-[#b88a5e] text-white rounded-t-lg">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Bug size={20} />
              Сообщить об ошибке
            </h3>
            <p className="text-sm text-white/90 mt-1">Опишите проблему, мы исправим её как можно скорее</p>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div>
              <label htmlFor="bug-message" className="block text-sm font-medium text-gray-700 mb-1">
                Описание проблемы *
              </label>
              <textarea
                id="bug-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Что пошло не так? Опишите подробно..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#d4a574] focus:border-transparent resize-none"
                rows={4}
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="bug-email" className="block text-sm font-medium text-gray-700 mb-1">
                Email (необязательно)
              </label>
              <input
                type="email"
                id="bug-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ваш email для связи"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#d4a574] focus:border-transparent"
                disabled={isSubmitting}
              />
            </div>

            {submitStatus === 'success' && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md text-sm">
                ✅ Спасибо! Ваше сообщение отправлено.
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md text-sm">
                ❌ Не удалось отправить. Попробуйте позже.
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !message.trim()}
              className="w-full bg-gradient-to-r from-[#d4a574] to-[#b88a5e] text-white py-2 px-4 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Отправка...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Отправить
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
