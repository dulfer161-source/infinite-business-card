import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import Logo from '@/components/Logo';
import Footer from '@/components/Footer';
import SubscriptionPlans from '@/components/pricing/SubscriptionPlans';
import AuthDialog from '@/components/AuthDialog';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const SubscriptionsPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const authenticated = api.isAuthenticated();
    setIsAuthenticated(authenticated);

    if (authenticated) {
      try {
        const { subscriptions } = await api.getUserSubscriptions();
        if (subscriptions && subscriptions.length > 0) {
          setCurrentSubscription(subscriptions[0]);
        }
      } catch (error) {
        console.error('Failed to load subscription:', error);
      }
    }
    
    setLoading(false);
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    checkAuth();
  };

  const handleLogout = () => {
    api.clearAuth();
    setIsAuthenticated(false);
    setCurrentSubscription(null);
    toast({
      title: 'Вы вышли',
      description: 'До скорой встречи!'
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-gold/20 sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo size="lg" />
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" onClick={() => window.location.href = '/'}>
                  <Icon name="Home" size={16} className="mr-2" />
                  Главная
                </Button>
                <Button variant="outline" onClick={handleLogout}>
                  <Icon name="LogOut" size={16} className="mr-2" />
                  Выход
                </Button>
              </>
            ) : (
              <Button onClick={() => setAuthDialogOpen(true)} className="bg-gold text-black hover:bg-gold/90">
                <Icon name="LogIn" size={16} className="mr-2" />
                Войти
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-blue/5"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <Badge className="mb-4 bg-gold/10 text-gold border-gold/20">
                Тарифы и подписки
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
                Выберите свой тариф
              </h1>
              <p className="text-xl text-muted-foreground">
                От бесплатного до корпоративного решения под ключ
              </p>
            </div>

            {/* Current Subscription */}
            {isAuthenticated && currentSubscription && (
              <div className="max-w-2xl mx-auto mb-12">
                <Card className="border-gold/20 bg-gradient-to-br from-gold/5 to-transparent">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Ваша текущая подписка</CardTitle>
                        <CardDescription>Активна до {new Date(currentSubscription.expires_at).toLocaleDateString('ru-RU')}</CardDescription>
                      </div>
                      <Badge className="bg-green text-white">Активна</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold">{currentSubscription.name}</p>
                        <p className="text-muted-foreground">{currentSubscription.price} ₽/мес</p>
                      </div>
                      {currentSubscription.can_remove_branding && (
                        <div className="flex flex-col gap-1 text-right">
                          <Badge variant="outline" className="border-gold/50 text-gold">
                            <Icon name="Crown" size={12} className="mr-1" />
                            Премиум
                          </Badge>
                          <Badge variant="outline" className="border-green/50 text-green">
                            <Icon name="Palette" size={12} className="mr-1" />
                            Брендинг
                          </Badge>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </section>

        {/* Plans */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Icon name="Loader2" className="animate-spin" size={32} />
              </div>
            ) : (
              <SubscriptionPlans
                isAuthenticated={isAuthenticated}
                onAuthRequired={() => setAuthDialogOpen(true)}
              />
            )}
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">Часто задаваемые вопросы</h2>
              
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Как происходит оплата?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Оплата производится через ЮКасса. Принимаются банковские карты, электронные кошельки и СБП. 
                      После успешной оплаты подписка активируется автоматически.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Можно ли отменить подписку?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Подписка не продлевается автоматически. Вы можете пользоваться всеми возможностями до окончания оплаченного периода.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Что такое White-Label тарифы?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      White-Label тарифы предназначены для компаний, которые хотят использовать платформу под своим брендом. 
                      Включают полный ребрендинг, управление сотрудниками и корпоративные возможности.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Есть ли тестовый период?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Базовый тариф бесплатный и доступен всегда. Вы можете протестировать платформу перед покупкой платной подписки.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Auth Dialog */}
      <AuthDialog
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default SubscriptionsPage;
