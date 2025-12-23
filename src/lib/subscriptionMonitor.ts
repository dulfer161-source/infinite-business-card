import { toast } from 'sonner';

export interface SubscriptionLimits {
  cards: { used: number; limit: number };
  views: { used: number; limit: number };
  storage: { used: number; limit: number };
}

export interface SubscriptionData {
  plan: string;
  status: 'active' | 'expiring' | 'expired';
  endDate: string | null;
  features: SubscriptionLimits;
}

class SubscriptionMonitor {
  private checkIntervalId: number | null = null;
  private lastCheck: Date | null = null;
  private readonly CHECK_INTERVAL = 3600000; // 1 час

  start(subscription: SubscriptionData) {
    if (this.checkIntervalId) {
      this.stop();
    }

    this.checkNow(subscription);

    this.checkIntervalId = window.setInterval(() => {
      this.checkNow(subscription);
    }, this.CHECK_INTERVAL);
  }

  stop() {
    if (this.checkIntervalId) {
      clearInterval(this.checkIntervalId);
      this.checkIntervalId = null;
    }
  }

  checkNow(subscription: SubscriptionData) {
    this.lastCheck = new Date();
    
    this.checkExpiringSubscription(subscription);
    this.checkLimitsWarning(subscription.features);
    this.checkLimitsReached(subscription.features);
  }

  private checkExpiringSubscription(subscription: SubscriptionData) {
    if (!subscription.endDate) return;

    const endDate = new Date(subscription.endDate);
    const now = new Date();
    const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    const notifiedKey = `subscription_expiring_notified_${daysLeft}`;
    const alreadyNotified = localStorage.getItem(notifiedKey) === 'true';

    if (daysLeft <= 7 && daysLeft > 0 && !alreadyNotified) {
      toast.warning(`Подписка заканчивается через ${daysLeft} дней`, {
        description: 'Продлите подписку, чтобы не потерять доступ к функциям',
        duration: 10000
      });
      localStorage.setItem(notifiedKey, 'true');
    }

    if (daysLeft === 0 && subscription.status === 'active') {
      toast.error('Подписка истекла', {
        description: 'Продлите подписку для продолжения использования',
        duration: 0
      });
    }
  }

  private checkLimitsWarning(limits: SubscriptionLimits) {
    this.checkResourceWarning('views', limits.views, 'просмотров');
    this.checkResourceWarning('storage', limits.storage, 'хранилища');
    this.checkResourceWarning('cards', limits.cards, 'визиток');
  }

  private checkResourceWarning(
    type: 'views' | 'storage' | 'cards',
    resource: { used: number; limit: number },
    label: string
  ) {
    const percentage = (resource.used / resource.limit) * 100;
    const warningKey = `${type}_warning_80_notified`;
    const alreadyNotified = localStorage.getItem(warningKey) === 'true';

    if (percentage >= 80 && percentage < 100 && !alreadyNotified) {
      toast.warning(`Приближается лимит ${label}`, {
        description: `Использовано ${resource.used} из ${resource.limit} (${Math.round(percentage)}%)`,
        action: {
          label: 'Улучшить тариф',
          onClick: () => {
            window.location.hash = '#subscription';
          }
        },
        duration: 10000
      });
      localStorage.setItem(warningKey, 'true');
    }

    if (percentage < 80) {
      localStorage.removeItem(warningKey);
    }
  }

  private checkLimitsReached(limits: SubscriptionLimits) {
    this.checkResourceReached('views', limits.views, 'просмотров');
    this.checkResourceReached('storage', limits.storage, 'хранилища');
    this.checkResourceReached('cards', limits.cards, 'визиток');
  }

  private checkResourceReached(
    type: 'views' | 'storage' | 'cards',
    resource: { used: number; limit: number },
    label: string
  ) {
    const reachedKey = `${type}_limit_reached_notified`;
    const alreadyNotified = localStorage.getItem(reachedKey) === 'true';

    if (resource.used >= resource.limit && !alreadyNotified) {
      toast.error(`Лимит ${label} исчерпан`, {
        description: 'Улучшите тариф для продолжения использования',
        action: {
          label: 'Улучшить',
          onClick: () => {
            window.location.hash = '#subscription';
          }
        },
        duration: 0
      });

      localStorage.setItem(reachedKey, 'true');
    }

    if (resource.used < resource.limit) {
      localStorage.removeItem(reachedKey);
    }
  }

  resetNotifications() {
    const keys = [
      'subscription_expiring_notified_7',
      'subscription_expiring_notified_3',
      'subscription_expiring_notified_1',
      'views_warning_80_notified',
      'storage_warning_80_notified',
      'cards_warning_80_notified',
      'views_limit_reached_notified',
      'storage_limit_reached_notified',
      'cards_limit_reached_notified'
    ];

    keys.forEach(key => localStorage.removeItem(key));
  }
}

export const subscriptionMonitor = new SubscriptionMonitor();