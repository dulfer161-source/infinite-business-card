import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import Icon from '@/components/ui/icon';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Введите email');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/063b09be-f07e-478c-a626-807980d111e1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'forgot_password', email })
      });

      if (response.ok) {
        setSent(true);
        toast.success('Инструкции отправлены на почту');
      } else {
        throw new Error('Failed');
      }
    } catch (error) {
      toast.error('Ошибка отправки');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Mail" className="text-green-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Проверьте почту</h1>
          <p className="text-gray-600 mb-6">
            Мы отправили инструкции по восстановлению пароля на <strong>{email}</strong>
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
          >
            <Icon name="ArrowLeft" size={20} />
            Вернуться ко входу
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Забыли пароль?</h1>
          <p className="text-gray-600">
            Введите ваш email, и мы отправим инструкции по восстановлению
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="you@example.com"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Отправка...' : 'Отправить инструкции'}
          </button>

          <div className="text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm"
            >
              <Icon name="ArrowLeft" size={16} />
              Вернуться ко входу
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
