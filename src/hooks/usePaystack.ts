import { useCallback, useMemo } from 'react';
import Paystack from '@paystack/inline-js';

type PaystackChannel = 'card' | 'bank' | 'ussd' | 'qr' | 'eft' | 'mobile_money' | 'bank_transfer' | 'apple_pay';

interface InitializePaymentOptions {
  email: string;
  amount: number;
  firstName?: string;
  lastName?: string;
  phone?: string;
  channels?: PaystackChannel[];
  onSuccess: (reference: string) => void;
  onClose: () => void;
  onError?: (message: string) => void;
  metadata?: Record<string, unknown>;
}

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '';

export const usePaystack = () => {
  const isConfigured = useMemo(
    () => Boolean(PAYSTACK_PUBLIC_KEY && !PAYSTACK_PUBLIC_KEY.includes('your_paystack_public_key')),
    []
  );

  const initializePayment = useCallback(async (options: InitializePaymentOptions) => {
    if (!isConfigured) {
      const message = 'Paystack is not configured yet. Add `VITE_PAYSTACK_PUBLIC_KEY` to your environment.';
      options.onError?.(message);
      return;
    }

    try {
      const popup = new Paystack();
      const reference = `CL-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

      await popup.checkout({
        key: PAYSTACK_PUBLIC_KEY,
        email: options.email,
        amount: Math.round(options.amount * 100),
        currency: 'NGN',
        reference,
        firstName: options.firstName,
        lastName: options.lastName,
        phone: options.phone,
        channels: options.channels,
        metadata: {
          ...options.metadata,
          custom_fields: Object.entries(options.metadata || {}).map(([key, value]) => ({
            display_name: key.replace(/_/g, ' '),
            variable_name: key,
            value: String(value)
          }))
        },
        onSuccess: (transaction: { reference: string }) => {
          options.onSuccess(transaction.reference);
        },
        onCancel: () => {
          options.onClose();
        },
        onError: (error: { message: string }) => {
          options.onError?.(error.message || 'Unable to initialize Paystack payment.');
        }
      });
    } catch (error) {
      console.error('Paystack checkout failed:', error);
      options.onError?.('Unable to initialize Paystack payment.');
    }
  }, [isConfigured]);

  return { initializePayment, isConfigured };
};
