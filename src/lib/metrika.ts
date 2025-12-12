// Yandex.Metrika integration for analytics

declare global {
  interface Window {
    ym?: (counterId: number, method: string, ...params: any[]) => void;
  }
}

export const METRIKA_ID = import.meta.env.VITE_YANDEX_METRIKA_ID || '';

export const initMetrika = (counterId?: string) => {
  const id = counterId || METRIKA_ID;
  
  if (!id || typeof window === 'undefined') return;

  (function (m, e, t, r, i, k, a) {
    m[i] =
      m[i] ||
      function () {
        (m[i].a = m[i].a || []).push(arguments);
      };
    m[i].l = 1 * new Date();
    for (let j = 0; j < document.scripts.length; j++) {
      if (document.scripts[j].src === r) {
        return;
      }
    }
    k = e.createElement(t);
    a = e.getElementsByTagName(t)[0];
    k.async = 1;
    k.src = r;
    a.parentNode.insertBefore(k, a);
  })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');

  window.ym?.(parseInt(id), 'init', {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true,
    trackHash: true,
  });
};

export const metrikaReachGoal = (goal: string, params?: Record<string, any>) => {
  if (!METRIKA_ID || typeof window === 'undefined') return;
  
  try {
    window.ym?.(parseInt(METRIKA_ID), 'reachGoal', goal, params);
  } catch (error) {
    console.error('Metrika goal error:', error);
  }
};

export const metrikaPageView = (url: string) => {
  if (!METRIKA_ID || typeof window === 'undefined') return;
  
  try {
    window.ym?.(parseInt(METRIKA_ID), 'hit', url);
  } catch (error) {
    console.error('Metrika page view error:', error);
  }
};

// Analytics goals for visitka.site
export const MetrikaGoals = {
  REGISTER: 'register',
  LOGIN: 'login',
  CREATE_CARD: 'create_card',
  UPGRADE_PLAN: 'upgrade_plan',
  PAYMENT_SUCCESS: 'payment_success',
  AI_GENERATE: 'ai_generate',
  SHARE_CARD: 'share_card',
} as const;
