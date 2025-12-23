import SubscriptionPlans from './payment/SubscriptionPlans';
import PaymentHistory from './payment/PaymentHistory';
import BillingInfoForm from './payment/BillingInfoForm';

const PaymentSettings = () => {
  return (
    <div className="space-y-6">
      <SubscriptionPlans />
      <PaymentHistory />
      <BillingInfoForm />
    </div>
  );
};

export default PaymentSettings;
