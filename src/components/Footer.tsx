import { useState } from 'react';
import Icon from '@/components/ui/icon';
import PrivacyPolicy from './PrivacyPolicy';

const Footer = () => {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  return (
    <footer className="bg-gradient-to-br from-blue-darker to-blue-dark text-white py-12 border-t border-green/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold gradient-text">∞7</span>
              <span className="text-xl font-semibold">visitka.site</span>
            </div>
            <p className="text-gray-300 text-sm">
              Бесконечные возможности вашей цифровой визитки
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-green">Продукт</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#features" className="hover:text-green transition-colors">Возможности</a></li>
              <li><a href="#pricing" className="hover:text-green transition-colors">Тарифы</a></li>
              <li><a href="#faq" className="hover:text-green transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-green">Компания</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#about" className="hover:text-green transition-colors">О нас</a></li>
              <li><a href="#contacts" className="hover:text-green transition-colors">Контакты</a></li>
              <li>
                <button 
                  onClick={() => setPrivacyOpen(true)} 
                  className="hover:text-green transition-colors text-left"
                >
                  Политика конфиденциальности
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setPrivacyOpen(true)} 
                  className="hover:text-green transition-colors text-left"
                >
                  Обработка персональных данных
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-green">Соцсети</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-blue/10 rounded-lg flex items-center justify-center hover:bg-blue/20 transition-all duration-300 hover:scale-110">
                <Icon name="Send" className="text-blue" size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-green/10 rounded-lg flex items-center justify-center hover:bg-green/20 transition-all duration-300 hover:scale-110">
                <Icon name="Mail" className="text-green" size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-orange/10 rounded-lg flex items-center justify-center hover:bg-orange/20 transition-all duration-300 hover:scale-110">
                <Icon name="Phone" className="text-orange" size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-green/10 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 visitka.site. Все права защищены.</p>
        </div>
      </div>
      
      <PrivacyPolicy open={privacyOpen} onOpenChange={setPrivacyOpen} />
    </footer>
  );
};

export default Footer;