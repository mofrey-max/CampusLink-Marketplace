import { useEffect, useMemo, useState } from 'react';
import type { BillingPlan } from '../types';

const PREMIUM_PLANS_STORAGE_KEY = 'campuslink_premium_plans';

const defaultPlans: BillingPlan[] = [
  {
    id: 'monthly',
    name: 'Premium Monthly',
    price: 2500,
    currency: 'NGN',
    interval: 'monthly',
    features: [
      'Priority project visibility',
      'Advanced profile analytics',
      'Unlimited project applications',
      'Premium badge on profile',
      'Priority customer support',
      'Access to exclusive events',
      'Advanced search filters',
      'Data export capabilities'
    ]
  },
  {
    id: 'yearly',
    name: 'Premium Yearly',
    price: 25000,
    currency: 'NGN',
    interval: 'yearly',
    popular: true,
    features: [
      'All monthly features included',
      '2 months free (save 17%)',
      'Priority project visibility',
      'Advanced profile analytics',
      'Unlimited project applications',
      'Premium badge on profile',
      'Priority customer support',
      'Access to exclusive events',
      'Advanced search filters',
      'Data export capabilities',
      'Quarterly business reports',
      'Early access to new features'
    ]
  }
];

const safeReadPlans = () => {
  const storedPlans = localStorage.getItem(PREMIUM_PLANS_STORAGE_KEY);
  if (!storedPlans) return defaultPlans;

  try {
    const parsedPlans = JSON.parse(storedPlans) as BillingPlan[];
    if (!Array.isArray(parsedPlans) || parsedPlans.length === 0) return defaultPlans;
    return parsedPlans;
  } catch (error) {
    console.error('Failed to parse premium plans:', error);
    return defaultPlans;
  }
};

export const usePremiumPlans = () => {
  const [plans, setPlans] = useState<BillingPlan[]>(defaultPlans);

  useEffect(() => {
    setPlans(safeReadPlans());
  }, []);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === PREMIUM_PLANS_STORAGE_KEY) {
        setPlans(safeReadPlans());
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const updatePlanPrice = (planId: BillingPlan['id'], price: number) => {
    const sanitizedPrice = Number.isFinite(price) && price > 0 ? Math.round(price) : 0;

    setPlans((currentPlans) => {
      const updatedPlans = currentPlans.map((plan) =>
        plan.id === planId ? { ...plan, price: sanitizedPrice } : plan
      );
      localStorage.setItem(PREMIUM_PLANS_STORAGE_KEY, JSON.stringify(updatedPlans));
      return updatedPlans;
    });
  };

  const resetPlans = () => {
    localStorage.setItem(PREMIUM_PLANS_STORAGE_KEY, JSON.stringify(defaultPlans));
    setPlans(defaultPlans);
  };

  const planMap = useMemo(
    () => Object.fromEntries(plans.map((plan) => [plan.id, plan])) as Record<string, BillingPlan>,
    [plans]
  );

  return {
    plans,
    planMap,
    updatePlanPrice,
    resetPlans
  };
};
