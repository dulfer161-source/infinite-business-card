import { useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import Pricing from '@/components/Pricing';
import FAQ from '@/components/FAQ';
import Dashboard from '@/components/Dashboard';
import Footer from '@/components/Footer';
import AuthDialog from '@/components/AuthDialog';
import HelpCenter from '@/components/HelpCenter';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const Index = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: string } | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

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

  const handleSelectPlan = (planName: string, price: string) => {
    if (!isLoggedIn) {
      setAuthDialogOpen(true);
      return;
    }

    if (planName === 'Корпоративный') {
      window.location.href = 'mailto:sales@visitka.site?subject=Корпоративный тариф';
      return;
    }

    setSelectedPlan({ name: planName, price });
    setPaymentDialogOpen(true);
  };

  const handlePayment = async () => {
    if (!selectedPlan) return;

    setIsProcessingPayment(true);
    try {
      const priceNumber = parseFloat(selectedPlan.price.replace(/[^0-9]/g, ''));
      const response = await api.createPayment(
        priceNumber,
        selectedPlan.name,
        `${window.location.origin}/payment/success`
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

  if (currentView === 'dashboard' && isLoggedIn) {
    return <Dashboard onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 w-full bg-background/80 backdrop-blur-lg border-b border-border z-50">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo size="md" />
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="hover:text-gold transition-colors">Возможности</a>
            <a href="#pricing" className="hover:text-gold transition-colors">Тарифы</a>
            <a href="#help" className="hover:text-gold transition-colors">Обучение</a>
            <a href="#faq" className="hover:text-gold transition-colors">FAQ</a>
            <a href="#contacts" className="hover:text-gold transition-colors">Контакты</a>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={handleOpenAuth}>Войти</Button>
            <Button className="bg-gold text-black hover:bg-gold/90" onClick={handleOpenAuth}>
              Регистрация
            </Button>
          </div>
        </nav>
      </header>

      <main className="pt-20">
        <Hero onGetStarted={handleOpenAuth} />
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
                <span className="text-2xl font-bold text-gold">{selectedPlan?.price}₽</span>
              </div>
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Подписка активируется сразу после оплаты</p>
              <p>• Безопасная оплата через ЮKassa</p>
              <p>• Чек отправим на вашу почту</p>
            </div>

            <Button
              className="w-full bg-gold text-black hover:bg-gold/90"
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