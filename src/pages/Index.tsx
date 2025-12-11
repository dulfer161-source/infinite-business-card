import { useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import Pricing from '@/components/Pricing';
import FAQ from '@/components/FAQ';
import Dashboard from '@/components/Dashboard';
import Footer from '@/components/Footer';
import AuthDialog from '@/components/AuthDialog';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';

const Index = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

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
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold">
              <span className="text-gold">∞7</span>
              <span className="ml-2">visitka.site</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="hover:text-gold transition-colors">Возможности</a>
            <a href="#pricing" className="hover:text-gold transition-colors">Тарифы</a>
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
        <Pricing onSelectPlan={handleOpenAuth} />
        <FAQ />
      </main>

      <Footer />
      
      <AuthDialog 
        open={authDialogOpen} 
        onOpenChange={setAuthDialogOpen} 
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default Index;