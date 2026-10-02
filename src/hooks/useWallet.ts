import { useState, useEffect } from 'react';
import { Wallet, Transaction } from '../types';

export const useWallet = (userId: string) => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const walletStorageKey = `campuslink_wallet_${userId}`;

  useEffect(() => {
    // Initialize wallet data
    const initializeWallet = () => {
      const storedWallet = localStorage.getItem(walletStorageKey);

      if (storedWallet) {
        try {
          const parsedWallet = JSON.parse(storedWallet) as Wallet;
          setWallet({
            ...parsedWallet,
            transactions: parsedWallet.transactions.map((transaction) => ({
              ...transaction,
              createdAt: new Date(transaction.createdAt)
            }))
          });
          setIsLoading(false);
          return;
        } catch (parseError) {
          console.error('Failed to parse wallet storage:', parseError);
        }
      }

      const mockWallet: Wallet = {
        id: `wallet_${userId}`,
        userId,
        balance: 15750.00,
        currency: 'NGN',
        accountNumber: '2087654321',
        bankName: 'First Bank',
        accountName: 'John Doe',
        transactions: [
          {
            id: 'txn_001',
            type: 'earning',
            amount: 5000,
            currency: 'NGN',
            status: 'completed',
            description: 'Payment for Data Analysis Project',
            reference: 'REF_001',
            createdAt: new Date(Date.now() - 86400000)
          },
          {
            id: 'txn_002',
            type: 'deposit',
            amount: 10000,
            currency: 'NGN',
            status: 'completed',
            description: 'Wallet Top-up via Paystack',
            reference: 'REF_002',
            createdAt: new Date(Date.now() - 172800000)
          },
          {
            id: 'txn_003',
            type: 'withdrawal',
            amount: 2500,
            currency: 'NGN',
            status: 'completed',
            description: 'Withdrawal to Bank Account',
            reference: 'REF_003',
            createdAt: new Date(Date.now() - 259200000)
          }
        ]
      };
      
      setWallet(mockWallet);
      localStorage.setItem(walletStorageKey, JSON.stringify(mockWallet));
      setIsLoading(false);
    };

    initializeWallet();
  }, [userId, walletStorageKey]);

  useEffect(() => {
    if (!wallet) return;
    localStorage.setItem(walletStorageKey, JSON.stringify(wallet));
  }, [wallet, walletStorageKey]);

  const depositFunds = async (amount: number): Promise<{ success: boolean; reference?: string; message?: string }> => {
    try {
      setIsLoading(true);
      
      // In a real app, this would integrate with Paystack
      const reference = `DEP_${Date.now()}`;
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newTransaction: Transaction = {
        id: `txn_${Date.now()}`,
        type: 'deposit',
        amount,
        currency: 'NGN',
        status: 'completed',
        description: 'Wallet Top-up via Paystack',
        reference,
        createdAt: new Date()
      };

      if (wallet) {
        setWallet({
          ...wallet,
          balance: wallet.balance + amount,
          transactions: [newTransaction, ...wallet.transactions]
        });
      }

      setIsLoading(false);
      return { success: true, reference };
    } catch (error) {
      setIsLoading(false);
      return { success: false, message: 'Deposit failed. Please try again.' };
    }
  };

  const withdrawFunds = async (amount: number, bankDetails: { accountNumber: string; bankName: string; accountName: string }): Promise<{ success: boolean; reference?: string; message?: string }> => {
    try {
      setIsLoading(true);

      if (!wallet || wallet.balance < amount) {
        setIsLoading(false);
        return { success: false, message: 'Insufficient balance' };
      }

      const reference = `WTH_${Date.now()}`;
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newTransaction: Transaction = {
        id: `txn_${Date.now()}`,
        type: 'withdrawal',
        amount,
        currency: 'NGN',
        status: 'completed',
        description: `Withdrawal to ${bankDetails.bankName}`,
        reference,
        createdAt: new Date()
      };

      setWallet({
        ...wallet,
        balance: wallet.balance - amount,
        transactions: [newTransaction, ...wallet.transactions]
      });

      setIsLoading(false);
      return { success: true, reference };
    } catch (error) {
      setIsLoading(false);
      return { success: false, message: 'Withdrawal failed. Please try again.' };
    }
  };

  const spendFunds = async (
    amount: number,
    description: string
  ): Promise<{ success: boolean; reference?: string; message?: string }> => {
    try {
      setIsLoading(true);

      if (!wallet || wallet.balance < amount) {
        setIsLoading(false);
        return { success: false, message: 'Insufficient wallet balance' };
      }

      const reference = `PMT_${Date.now()}`;
      await new Promise(resolve => setTimeout(resolve, 500));

      const newTransaction: Transaction = {
        id: `txn_${Date.now()}`,
        type: 'payment',
        amount,
        currency: 'NGN',
        status: 'completed',
        description,
        reference,
        createdAt: new Date()
      };

      setWallet({
        ...wallet,
        balance: wallet.balance - amount,
        transactions: [newTransaction, ...wallet.transactions]
      });

      setIsLoading(false);
      return { success: true, reference };
    } catch (spendError) {
      console.error('Wallet payment failed:', spendError);
      setIsLoading(false);
      return { success: false, message: 'Wallet payment failed. Please try again.' };
    }
  };

  return {
    wallet,
    isLoading,
    error,
    depositFunds,
    withdrawFunds,
    spendFunds
  };
};
