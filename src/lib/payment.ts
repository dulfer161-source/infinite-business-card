const PAYMENT_API_URL = 'https://functions.poehali.dev/5bc46a0f-1084-4325-9a7b-460cfa14c2a8';

export interface CreatePaymentParams {
  amount: number;
  description: string;
  email?: string;
  phone?: string;
  return_url?: string;
}

export interface PaymentResponse {
  payment_id: string;
  status: string;
  confirmation_url: string;
  amount: string;
  currency: string;
}

export interface PaymentStatus {
  payment_id: string;
  status: string;
  paid: boolean;
  amount: string;
  created_at: string;
}

class PaymentService {
  async createPayment(params: CreatePaymentParams): Promise<PaymentResponse> {
    const response = await fetch(`${PAYMENT_API_URL}?action=create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: params.amount,
        description: params.description,
        email: params.email,
        phone: params.phone,
        return_url: params.return_url || window.location.origin
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Payment creation error:', error);
      throw new Error(error.error || error.message || 'Ошибка создания платежа');
    }

    return response.json();
  }

  async getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    const response = await fetch(`${PAYMENT_API_URL}?action=status&payment_id=${paymentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Ошибка получения статуса платежа');
    }

    return response.json();
  }

  async pollPaymentStatus(
    paymentId: string, 
    onUpdate: (status: PaymentStatus) => void,
    maxAttempts = 60,
    interval = 2000
  ): Promise<PaymentStatus> {
    let attempts = 0;

    return new Promise((resolve, reject) => {
      const checkStatus = async () => {
        try {
          const status = await this.getPaymentStatus(paymentId);
          onUpdate(status);

          if (status.paid || status.status === 'succeeded') {
            resolve(status);
            return;
          }

          if (status.status === 'canceled' || status.status === 'failed') {
            reject(new Error('Платёж отменён или не выполнен'));
            return;
          }

          attempts++;
          if (attempts >= maxAttempts) {
            reject(new Error('Превышено время ожидания платежа'));
            return;
          }

          setTimeout(checkStatus, interval);
        } catch (error) {
          reject(error);
        }
      };

      checkStatus();
    });
  }

  openPaymentWindow(confirmationUrl: string): Window | null {
    const width = 600;
    const height = 800;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    return window.open(
      confirmationUrl,
      'YooKassaPayment',
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );
  }
}

export const paymentService = new PaymentService();