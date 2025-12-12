import Icon from '@/components/ui/icon';

const Footer = () => {
  return (
    <footer className="bg-secondary text-white py-12 border-t border-gold/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold text-gold">∞7</span>
              <span className="text-xl font-semibold">visitka.site</span>
            </div>
            <p className="text-gray-400 text-sm">
              Бесконечные возможности вашей цифровой визитки
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-gold">Продукт</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#features" className="hover:text-gold transition-colors">Возможности</a></li>
              <li><a href="#pricing" className="hover:text-gold transition-colors">Тарифы</a></li>
              <li><a href="#faq" className="hover:text-gold transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-gold">Компания</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#about" className="hover:text-gold transition-colors">О нас</a></li>
              <li><a href="#contacts" className="hover:text-gold transition-colors">Контакты</a></li>
              <li><a href="#privacy" className="hover:text-gold transition-colors">Политика конфиденциальности</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-gold">Соцсети</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center hover:bg-gold/20 transition-colors">
                <Icon name="Send" className="text-gold" size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center hover:bg-gold/20 transition-colors">
                <Icon name="Mail" className="text-gold" size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center hover:bg-gold/20 transition-colors">
                <Icon name="Phone" className="text-gold" size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gold/10 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 visitka.site. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;