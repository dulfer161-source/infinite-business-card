import { useState } from 'react';
import Icon from '@/components/ui/icon';
import PrivacyPolicy from './PrivacyPolicy';

const Footer = () => {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  return (
    <footer className="bg-gradient-to-br from-blue-dark to-navy text-white py-12 border-t border-teal/20">
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
            <h4 className="font-semibold mb-4 text-teal">Продукт</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#features" className="hover:text-teal transition-colors">Возможности</a></li>
              <li><a href="#pricing" className="hover:text-teal transition-colors">Тарифы</a></li>
              <li><a href="#faq" className="hover:text-teal transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-teal">Компания</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#about" className="hover:text-teal transition-colors">О нас</a></li>
              <li><a href="#contacts" className="hover:text-teal transition-colors">Контакты</a></li>
              <li>
                <button 
                  onClick={() => setPrivacyOpen(true)} 
                  className="hover:text-teal transition-colors text-left"
                >
                  Политика конфиденциальности
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setPrivacyOpen(true)} 
                  className="hover:text-teal transition-colors text-left"
                >
                  Обработка персональных данных
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-teal">Соцсети</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-teal/10 rounded-lg flex items-center justify-center hover:bg-teal/20 transition-all duration-300 hover:scale-110">
                <Icon name="Send" className="text-teal" size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-purple/10 rounded-lg flex items-center justify-center hover:bg-purple/20 transition-all duration-300 hover:scale-110">
                <Icon name="Mail" className="text-purple" size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-blue/10 rounded-lg flex items-center justify-center hover:bg-blue/20 transition-all duration-300 hover:scale-110">
                <Icon name="Phone" className="text-blue" size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-teal/10 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 visitka.site. Все права защищены.</p>
        </div>
      </div>
      
      <PrivacyPolicy open={privacyOpen} onOpenChange={setPrivacyOpen} />
    </footer>
  );
};

export default Footer;