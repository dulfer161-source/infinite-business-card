import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import FadeIn from '@/components/animations/FadeIn';
import StaggerContainer, { StaggerItem } from '@/components/animations/StaggerContainer';
import MagneticButton from '@/components/ui/magnetic-button';
import SmoothScrollProgress from '@/components/ui/smooth-scroll';

interface HeroProps {
  onGetStarted: () => void;
  onStartDemo: () => void;
}

const Hero = ({ onGetStarted, onStartDemo }: HeroProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      <SmoothScrollProgress />
      <div className="absolute inset-0 gradient-corporate opacity-95"></div>
      
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green/20 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-[500px] h-[500px] bg-blue-light/20 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue/10 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <FadeIn>
            <div className="inline-flex items-center justify-center mb-8">
              <div className="text-8xl md:text-9xl font-bold gradient-text mb-4 relative animate-shimmer">
                <span className="relative">∞7</span>
              </div>
            </div>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
              Бесконечные связи - <br />Умные возможности!
              <br />
              <span className="gradient-text">с партнёром visitka.site</span>
            </h1>
          </FadeIn>
          
          <FadeIn delay={0.3}>
            <p className="text-xl md:text-2xl text-white/80 mb-4 max-w-3xl mx-auto font-light leading-relaxed">
              Профессиональные визитки для роста бизнеса
            </p>
          </FadeIn>
          
          <FadeIn delay={0.4}>
            <p className="text-base md:text-lg text-white/60 mb-12 max-w-2xl mx-auto">
              Экспертное решение для предпринимателей, агентств и корпораций. QR-коды, аналитика, интеграции и автоматизация.
            </p>
          </FadeIn>

          <FadeIn delay={0.5}>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
              <MagneticButton 
                className="gradient-bg text-white text-lg px-10 py-7 rounded-xl font-semibold shadow-2xl shadow-blue/30"
                onClick={onGetStarted}
              >
                Создать визитку
                <Icon name="ArrowRight" className="ml-2" size={22} />
              </MagneticButton>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-green/80 text-white hover:bg-green/10 hover:border-green text-lg px-10 py-7 rounded-xl backdrop-blur-sm"
                onClick={onStartDemo}
              >
                <Icon name="PlayCircle" className="mr-2" size={22} />
                Попробовать демо
              </Button>
            </div>
          </FadeIn>

          <StaggerContainer staggerDelay={0.15}>
            <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24">
              <StaggerItem>
                <div className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:bg-white/10 hover:border-green/50 hover:scale-105 hover:shadow-xl hover:shadow-green/20">
                  <div className="w-14 h-14 bg-green rounded-xl flex items-center justify-center mb-5 mx-auto shadow-lg shadow-green/30 group-hover:scale-110 transition-transform duration-300">
                    <Icon name="Smartphone" className="text-white" size={28} />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">QR-код с контактами</h3>
                  <p className="text-white/70 leading-relaxed">
                    Мгновенное добавление в телефонную книгу через QR
                  </p>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:bg-white/10 hover:border-blue/50 hover:scale-105 hover:shadow-xl hover:shadow-blue/20">
                  <div className="w-14 h-14 gradient-bg rounded-xl flex items-center justify-center mb-5 mx-auto shadow-lg shadow-blue/30 group-hover:scale-110 transition-transform duration-300">
                    <Icon name="Share2" className="text-white" size={28} />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">Аналитика просмотров</h3>
                  <p className="text-white/70 leading-relaxed">
                    Отслеживайте кто и откуда смотрит вашу визитку
                  </p>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:bg-white/10 hover:border-orange/50 hover:scale-105 hover:shadow-xl hover:shadow-orange/20">
                  <div className="w-14 h-14 gradient-accent rounded-xl flex items-center justify-center mb-5 mx-auto shadow-lg shadow-orange/30 group-hover:scale-110 transition-transform duration-300">
                    <Icon name="Sparkles" className="text-white" size={28} />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">AI-генерация макетов</h3>
                  <p className="text-white/70 leading-relaxed">
                    Создавайте уникальные изображения и логотипы с ИИ
                  </p>
                </div>
              </StaggerItem>
            </div>
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
};

export default Hero;