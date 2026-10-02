import React, { useMemo, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useCommerce } from '../../hooks/useCommerce';
import { usePaystack } from '../../hooks/usePaystack';
import { useWallet } from '../../hooks/useWallet';
import type { CheckoutFormData } from '../../types';

interface CheckoutPageProps {
  onNavigate: (tab: string) => void;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount);

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { cartItems, cartSubtotal, placeOrder } = useCommerce();
  const { initializePayment, isConfigured } = usePaystack();
  const { wallet, spendFunds } = useWallet(user?.id || 'guest_wallet');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: user?.location?.split(',')[0]?.trim() || '',
    state: user?.location?.split(',')[1]?.trim() || '',
    deliveryNote: '',
    paymentMethod: 'transfer'
  });

  const serviceFee = useMemo(() => Math.round(cartSubtotal * 0.05), [cartSubtotal]);
  const deliveryFee = useMemo(() => (cartItems.length > 0 ? 2500 : 0), [cartItems.length]);
  const total = cartSubtotal + serviceFee + deliveryFee;

  const handleChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData((currentData) => ({ ...currentData, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (cartItems.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    if (!user) {
      setError('Sign in to continue with checkout.');
      return;
    }

    if ((formData.paymentMethod === 'card' || formData.paymentMethod === 'transfer') && !isConfigured) {
      setError('Paystack is not configured yet. Add `VITE_PAYSTACK_PUBLIC_KEY` first.');
      return;
    }

    if (formData.paymentMethod === 'wallet' && (!wallet || wallet.balance < total)) {
      setError('Insufficient wallet balance for this order.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (formData.paymentMethod === 'wallet') {
        const paymentResult = await spendFunds(total, `Marketplace order payment for ${cartItems.length} item(s)`);

        if (!paymentResult.success) {
          setError(paymentResult.message || 'Wallet payment failed.');
          setIsSubmitting(false);
          return;
        }

        placeOrder(formData, paymentResult.reference);
        setIsSubmitting(false);
        onNavigate('orders');
        return;
      }

      const paystackChannels =
        formData.paymentMethod === 'card'
          ? ['card']
          : ['bank_transfer', 'bank'];

      await initializePayment({
        email: formData.email,
        amount: total,
        firstName: formData.fullName.split(' ')[0],
        lastName: formData.fullName.split(' ').slice(1).join(' '),
        phone: formData.phone,
        channels: paystackChannels,
        onSuccess: (reference) => {
          placeOrder(formData, reference);
          setIsSubmitting(false);
          onNavigate('orders');
        },
        onClose: () => {
          setIsSubmitting(false);
        },
        onError: (message) => {
          setError(message);
          setIsSubmitting(false);
        },
        metadata: {
          order_type: 'marketplace_checkout',
          item_count: cartItems.length,
          customer_name: formData.fullName
        }
      });
    } catch (checkoutError) {
      console.error('Checkout payment failed:', checkoutError);
      setError('Unable to start payment. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="bg-white border border-slate-200 shadow-sm p-8 text-center">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Nothing to check out</h1>
        <p className="text-gray-500 mb-6">Add something to your cart before opening checkout.</p>
        <button
          onClick={() => onNavigate('marketplace')}
          className="px-5 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:from-purple-700 hover:to-blue-700 transition-all"
        >
          Go to Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="grid xl:grid-cols-[1.2fr_0.9fr] gap-4">
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 shadow-sm p-5 space-y-5">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Checkout</h1>
          <p className="text-sm text-gray-500 mt-1">Complete your order details and confirm payment.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            value={formData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            placeholder="Full name"
            className="px-4 py-3 border border-gray-300 outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <input
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="Email address"
            className="px-4 py-3 border border-gray-300 outline-none focus:ring-2 focus:ring-purple-500"
            type="email"
            required
          />
          <input
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="Phone number"
            className="px-4 py-3 border border-gray-300 outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <input
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="Delivery address"
            className="px-4 py-3 border border-gray-300 outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <input
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            placeholder="City"
            className="px-4 py-3 border border-gray-300 outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <input
            value={formData.state}
            onChange={(e) => handleChange('state', e.target.value)}
            placeholder="State"
            className="px-4 py-3 border border-gray-300 outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        <textarea
          value={formData.deliveryNote}
          onChange={(e) => handleChange('deliveryNote', e.target.value)}
          placeholder="Delivery note or order instructions"
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 outline-none focus:ring-2 focus:ring-purple-500"
        />

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Payment Method</h2>
          <div className="grid md:grid-cols-3 gap-3">
            {[
              { id: 'transfer', label: 'Bank Transfer' },
              { id: 'wallet', label: 'Wallet' },
              { id: 'card', label: 'Card' }
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleChange('paymentMethod', option.id)}
                className={`px-4 py-3 border text-sm font-medium transition-colors ${
                  formData.paymentMethod === option.id
                    ? 'border-purple-600 bg-purple-50 text-purple-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          {formData.paymentMethod === 'wallet' && wallet && (
            <p className="text-sm text-gray-500 mt-3">
              Wallet balance: <span className="font-medium text-gray-900">{formatCurrency(wallet.balance)}</span>
            </p>
          )}
        </div>

        {error && <div className="px-4 py-3 bg-red-50 text-red-700 border border-red-200">{error}</div>}

        {!isConfigured && formData.paymentMethod !== 'wallet' && (
          <div className="px-4 py-3 bg-amber-50 text-amber-800 border border-amber-200">
            Add `VITE_PAYSTACK_PUBLIC_KEY` to enable Paystack checkout.
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-60"
          >
            {isSubmitting ? 'Processing payment...' : 'Place Order'}
          </button>
          <button
            type="button"
            onClick={() => onNavigate('cart')}
            className="px-5 py-3 border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Back to Cart
          </button>
        </div>
      </form>

      <div className="bg-white border border-slate-200 shadow-sm p-5 space-y-4 h-fit">
        <h2 className="text-lg font-semibold text-gray-900">Order Review</h2>
        <div className="space-y-3">
          {cartItems.map((item) => (
            <div key={item.productId} className="flex items-start justify-between gap-3 border-b border-gray-100 pb-3">
              <div>
                <p className="font-medium text-gray-900">{item.title}</p>
                <p className="text-sm text-gray-500">{item.quantity} x {formatCurrency(item.price)}</p>
              </div>
              <p className="font-semibold text-gray-900">{formatCurrency(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(cartSubtotal)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Service fee</span>
            <span>{formatCurrency(serviceFee)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Delivery fee</span>
            <span>{formatCurrency(deliveryFee)}</span>
          </div>
          <div className="pt-3 border-t border-gray-200 flex items-center justify-between text-base font-semibold text-gray-900">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
