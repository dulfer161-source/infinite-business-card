import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface HeroProps {
  onGetStarted: () => void;
}

const Hero = ({ onGetStarted }: HeroProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      <div className="absolute inset-0 gradient-corporate opacity-95"></div>
      
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue/30 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-[500px] h-[500px] bg-blue-dark/20 rounded-full blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gray-700/10 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center justify-center mb-8">
            <div className="text-8xl md:text-9xl font-bold gradient-text mb-4 relative animate-shimmer">
              <span className="relative">∞7</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-[1.1] tracking-tight">
            Бесконечные возможности
            <br />
            <span className="gradient-text">вашей визитки</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            Создайте премиальную цифровую визитку с QR-кодом, аналитикой и реферальной программой за минуты
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
            <Button 
              size="lg" 
              className="gradient-bg text-white hover:opacity-90 text-lg px-10 py-7 rounded-xl font-semibold shadow-2xl shadow-cyan/30 transition-all duration-300 hover:scale-105 hover:shadow-cyan/50"
              onClick={onGetStarted}
            >
              Создать визитку
              <Icon name="ArrowRight" className="ml-2" size={22} />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 text-lg px-10 py-7 rounded-xl backdrop-blur-sm transition-all duration-300"
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Смотреть тарифы
            </Button>
          </div>

          <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24">
            <div className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:bg-white/10 hover:border-blue/50 hover:scale-105 hover:shadow-xl hover:shadow-blue/20">
              <div className="w-14 h-14 bg-blue rounded-xl flex items-center justify-center mb-5 mx-auto shadow-lg shadow-blue/30 group-hover:scale-110 transition-transform duration-300">
                <Icon name="Smartphone" className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">QR-код с контактами</h3>
              <p className="text-white/70 leading-relaxed">
                Мгновенное добавление в телефонную книгу через QR
              </p>
            </div>

            <div className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:bg-white/10 hover:border-blue-light/50 hover:scale-105 hover:shadow-xl hover:shadow-blue-light/20">
              <div className="w-14 h-14 bg-blue-light rounded-xl flex items-center justify-center mb-5 mx-auto shadow-lg shadow-blue-light/30 group-hover:scale-110 transition-transform duration-300">
                <Icon name="Share2" className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Аналитика просмотров</h3>
              <p className="text-white/70 leading-relaxed">
                Отслеживайте кто и откуда смотрит вашу визитку
              </p>
            </div>

            <div className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:bg-white/10 hover:border-blue/50 hover:scale-105 hover:shadow-xl hover:shadow-blue/20">
              <div className="w-14 h-14 bg-gradient-to-br from-blue to-blue-light rounded-xl flex items-center justify-center mb-5 mx-auto shadow-lg shadow-blue/30 group-hover:scale-110 transition-transform duration-300">
                <Icon name="Sparkles" className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">AI-генерация макетов</h3>
              <p className="text-white/70 leading-relaxed">
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