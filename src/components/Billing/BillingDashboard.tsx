import React, { useState } from 'react';
import { CreditCard, Star, Check, Zap, Shield, TrendingUp } from 'lucide-react';
import { usePaystack } from '../../hooks/usePaystack';
import { usePremiumPlans } from '../../hooks/usePremiumPlans';

interface BillingDashboardProps {
  userEmail: string;
  isPremium: boolean;
  onUpgrade: () => void;
}

export const BillingDashboard: React.FC<BillingDashboardProps> = ({
  userEmail,
  isPremium,
  onUpgrade
}) => {
  const { initializePayment, isConfigured } = usePaystack();
  const [paymentError, setPaymentError] = useState('');
  const { plans, planMap } = usePremiumPlans();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const handleSubscribe = (plan: BillingPlan) => {
    setPaymentError('');

    initializePayment({
      email: userEmail,
      amount: plan.price,
      channels: ['card', 'bank_transfer', 'bank'],
      onSuccess: (reference) => {
        console.log('Payment successful:', reference);
        onUpgrade();
      },
      onClose: () => {
        console.log('Payment cancelled');
      },
      onError: (message) => {
        setPaymentError(message);
      },
      metadata: {
        planId: plan.id,
        planName: plan.name,
        type: 'subscription'
      }
    });
  };

  if (isPremium) {
    return (
      <div className="space-y-6">
        {/* Current Plan */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-6 text-white">
          <div className="flex items-center space-x-3 mb-4">
            <Star className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">Premium Member</h2>
              <p className="text-yellow-100">You're enjoying all premium features</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <Zap className="w-6 h-6 mb-2" />
              <h3 className="font-semibold">Priority Visibility</h3>
              <p className="text-sm text-yellow-100">Your projects appear first</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <TrendingUp className="w-6 h-6 mb-2" />
              <h3 className="font-semibold">Advanced Analytics</h3>
              <p className="text-sm text-yellow-100">Detailed performance insights</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <Shield className="w-6 h-6 mb-2" />
              <h3 className="font-semibold">Priority Support</h3>
              <p className="text-sm text-yellow-100">24/7 premium assistance</p>
            </div>
          </div>
        </div>

        {/* Billing History */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Billing History
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Premium Monthly Subscription</p>
                <p className="text-sm text-gray-500">January 15, 2024</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{formatCurrency(planMap.monthly?.price || 0)}</p>
                <p className="text-sm text-green-600">Paid</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Premium Monthly Subscription</p>
                <p className="text-sm text-gray-500">December 15, 2023</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{formatCurrency(planMap.monthly?.price || 0)}</p>
                <p className="text-sm text-green-600">Paid</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!isConfigured && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl">
          Add `VITE_PAYSTACK_PUBLIC_KEY` to enable Paystack subscription payments.
        </div>
      )}

      {paymentError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl">
          {paymentError}
        </div>
      )}

      {/* Upgrade CTA */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Upgrade to Premium</h2>
        <p className="text-purple-100 mb-4">
          Unlock advanced features and get priority access to opportunities
        </p>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <Check className="w-4 h-4" />
            <span>Priority visibility</span>
          </div>
          <div className="flex items-center space-x-1">
            <Check className="w-4 h-4" />
            <span>Advanced analytics</span>
          </div>
          <div className="flex items-center space-x-1">
            <Check className="w-4 h-4" />
            <span>Premium support</span>
          </div>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white rounded-2xl p-6 shadow-sm border-2 transition-all ${
              plan.popular
                ? 'border-purple-500 ring-2 ring-purple-100'
                : 'border-gray-200 hover:border-purple-300'
            }`}
          >
            {plan.popular && (
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium px-3 py-1 rounded-full inline-block mb-4">
                Most Popular
              </div>
            )}
            
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-gray-900">
                  {formatCurrency(plan.price)}
                </span>
                <span className="text-gray-500">/{plan.interval}</span>
              </div>
              {plan.interval === 'yearly' && (
                <p className="text-sm text-green-600 font-medium mt-1">
                  Save 17% compared to monthly
                </p>
              )}
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe(plan)}
              className={`w-full py-3 rounded-lg font-medium transition-all ${
                plan.popular
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              Subscribe Now
            </button>
          </div>
        ))}
      </div>

      {/* Payment Security */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex items-center justify-center space-x-6">
          <div className="flex items-center space-x-2 text-gray-600">
            <Shield className="w-5 h-5" />
            <span className="text-sm">Secure Payment</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <CreditCard className="w-5 h-5" />
            <span className="text-sm">Powered by Paystack</span>
          </div>
        </div>
        <p className="text-center text-xs text-gray-500 mt-2">
          Your payment information is encrypted and secure. Cancel anytime.
        </p>
      </div>
    </div>
  );
};
