import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface HeroProps {
  onGetStarted: () => void;
}

const Hero = ({ onGetStarted }: HeroProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-secondary to-black"></div>
      
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center justify-center mb-8">
            <div className="text-8xl md:text-9xl font-bold text-gold mb-4 relative">
              <div className="absolute inset-0 blur-2xl bg-gold opacity-50"></div>
              <span className="relative">∞7</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Бесконечные возможности
            <br />
            <span className="text-gold">вашей визитки</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Создайте премиальную цифровую визитку с QR-кодом, аналитикой и реферальной программой за минуты
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button 
              size="lg" 
              className="bg-gold text-black hover:bg-gold/90 text-lg px-8 py-6 hover-scale"
              onClick={onGetStarted}
            >
              Создать визитку
              <Icon name="ArrowRight" className="ml-2" size={20} />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-gold text-gold hover:bg-gold/10 text-lg px-8 py-6"
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Смотреть тарифы
            </Button>
          </div>

          <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
            <div className="bg-card/50 backdrop-blur-sm border border-gold/20 rounded-lg p-6 hover-scale">
              <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Icon name="Smartphone" className="text-gold" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">QR-код с контактами</h3>
              <p className="text-gray-400">
                Мгновенное добавление в телефонную книгу через QR
              </p>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-gold/20 rounded-lg p-6 hover-scale">
              <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Icon name="Share2" className="text-gold" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Аналитика просмотров</h3>
              <p className="text-gray-400">
                Отслеживайте кто и откуда смотрит вашу визитку
              </p>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-gold/20 rounded-lg p-6 hover-scale">
              <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Icon name="Sparkles" className="text-gold" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">AI-генерация макетов</h3>
              <p className="text-gray-400">
                Создавайте уникальные изображения и логотипы с ИИ
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;