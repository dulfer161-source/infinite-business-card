import { useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import UseCases from '@/components/UseCases';
import Pricing from '@/components/Pricing';
import FAQ from '@/components/FAQ';
import Dashboard from '@/components/Dashboard';
import DemoDashboard from '@/components/DemoDashboard';
import DemoModeDialog from '@/components/DemoModeDialog';
import Footer from '@/components/Footer';
import AuthDialog from '@/components/AuthDialog';
import HelpCenter from '@/components/HelpCenter';
import Logo from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'demo'>('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [demoDialogOpen, setDemoDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: string } | null>(null);
  const [demoPlan, setDemoPlan] = useState<'free' | 'basic' | 'pro'>('basic');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (api.isAuthenticated()) {
      setIsLoggedIn(true);
      setCurrentView('dashboard');
    }
  }, []);

  const handleAuthSuccess = () => {
    setIsLoggedIn(true);
    setCurrentView('dashboard');
  };

  const handleOpenAuth = () => {
    setAuthDialogOpen(true);
  };

  const handleSelectPlan = async (planName: string, price: string) => {
    if (!isLoggedIn) {
      setAuthDialogOpen(true);
      return;
    }

    if (planName === 'Корпоративный') {
      window.location.href = 'mailto:sales@visitka.site?subject=Корпоративный тариф';
      return;
    }

    // Get subscription ID by plan name
    try {
      const { plans } = await api.getSubscriptionPlans();
      const plan = plans.find((p: any) => p.name === planName);
      
      setSelectedPlan({ name: planName, price, subscriptionId: plan?.id });
      setPaymentDialogOpen(true);
    } catch (error) {
      console.error('Failed to load plans:', error);
      setSelectedPlan({ name: planName, price });
      setPaymentDialogOpen(true);
    }
  };

  const handlePayment = async () => {
    if (!selectedPlan) return;

    setIsProcessingPayment(true);
    try {
      const priceNumber = parseFloat(selectedPlan.price.replace(/[^0-9]/g, ''));
      const response = await api.createPayment(
        priceNumber,
        selectedPlan.name,
        `${window.location.origin}/payment/success`,
        (selectedPlan as any).subscriptionId
      );

      if (response.confirmation_url) {
        window.location.href = response.confirmation_url;
      }
    } catch (error) {
      console.error('Payment error:', error);
      window.location.href = `/payment/error?message=${encodeURIComponent('Не удалось создать платёж')}`;
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleLogout = () => {
    api.clearAuth();
    setIsLoggedIn(false);
    setCurrentView('landing');
  };

  const handleStartDemo = (plan: 'free' | 'basic' | 'pro') => {
    setDemoPlan(plan);
    setCurrentView('demo');
  };

  const handleExitDemo = () => {
    setCurrentView('landing');
  };

  const handleOpenDemoDialog = () => {
    setDemoDialogOpen(true);
  };

  if (currentView === 'dashboard' && isLoggedIn) {
    return <Dashboard onLogout={handleLogout} />;
  }

  if (currentView === 'demo') {
    return <DemoDashboard onExit={handleExitDemo} plan={demoPlan} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 w-full bg-background/90 backdrop-blur-lg border-b border-border z-50">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo size="md" />
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="hover:text-green transition-colors font-medium">Возможности</a>
            <a href="#solutions" className="hover:text-blue transition-colors font-medium">Решения</a>
            <a href="#pricing" className="hover:text-green transition-colors font-medium">Тарифы</a>
            <a href="#faq" className="hover:text-blue transition-colors font-medium">FAQ</a>
            <a href="#contacts" className="hover:text-green transition-colors font-medium">Контакты</a>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <Button variant="ghost" className="hover:text-blue" onClick={handleOpenDemoDialog}>
              <Icon name="PlayCircle" className="mr-2" size={18} />
              Демо
            </Button>
            <Button variant="ghost" className="hover:text-green" onClick={handleOpenAuth}>Войти</Button>
            <Button className="gradient-bg text-white hover:opacity-90 shadow-lg shadow-blue/30 hover:shadow-green/50" onClick={handleOpenAuth}>
              Регистрация
            </Button>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Icon name={mobileMenuOpen ? "X" : "Menu"} size={24} />
          </Button>
        </nav>
        {mobileMenuOpen && (
          <div className="md:hidden bg-background/95 backdrop-blur-lg border-b border-border">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <a 
                href="#features" 
                className="hover:text-green transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Возможности
              </a>
              <a 
                href="#solutions" 
                className="hover:text-blue transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Решения
              </a>
              <a 
                href="#pricing" 
                className="hover:text-green transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Тарифы
              </a>
              <a 
                href="#faq" 
                className="hover:text-blue transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </a>
              <a 
                href="#contacts" 
                className="hover:text-green transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Контакты
              </a>
              <div className="flex flex-col gap-2 pt-2 border-t border-border">
                <Button 
                  variant="ghost" 
                  className="hover:text-blue w-full justify-start" 
                  onClick={() => {
                    handleOpenDemoDialog();
                    setMobileMenuOpen(false);
                  }}
                >
                  <Icon name="PlayCircle" className="mr-2" size={18} />
                  Демо
                </Button>
                <Button 
                  variant="ghost" 
                  className="hover:text-green w-full justify-start" 
                  onClick={() => {
                    handleOpenAuth();
                    setMobileMenuOpen(false);
                  }}
                >
                  Войти
                </Button>
                <Button 
                  className="gradient-bg text-white hover:opacity-90 shadow-lg shadow-blue/30 hover:shadow-green/50 w-full" 
                  onClick={() => {
                    handleOpenAuth();
                    setMobileMenuOpen(false);
                  }}
                >
                  Регистрация
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="pt-20">
        <Hero onGetStarted={handleOpenAuth} onStartDemo={handleOpenDemoDialog} />
        <UseCases />
        <Pricing onSelectPlan={handleSelectPlan} />
        <HelpCenter />
        <FAQ />
      </main>

      <Footer />
      
      <AuthDialog 
        open={authDialogOpen} 
        onOpenChange={setAuthDialogOpen} 
        onSuccess={handleAuthSuccess}
      />

      <DemoModeDialog
        open={demoDialogOpen}
        onOpenChange={setDemoDialogOpen}
        onSelectPlan={handleStartDemo}
      />

      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Подтверждение оплаты</DialogTitle>
            <DialogDescription>
              Вы выбрали тариф {selectedPlan?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-muted/30 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Тариф:</span>
                <span className="font-semibold">{selectedPlan?.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Стоимость:</span>
                <span className="text-2xl font-bold gradient-text">{selectedPlan?.price}₽</span>
              </div>
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Подписка активируется сразу после оплаты</p>
              <p>• Безопасная оплата через ЮKassa</p>
              <p>• Чек отправим на вашу почту</p>
            </div>

            <Button
              className="w-full gradient-accent text-white hover:opacity-90 shadow-lg shadow-orange/30"
              onClick={handlePayment}
              disabled={isProcessingPayment}
            >
              {isProcessingPayment ? 'Перенаправление...' : 'Перейти к оплате'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;