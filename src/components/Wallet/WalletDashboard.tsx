import React, { useState } from 'react';
import { Wallet, CreditCard, ArrowUpRight, ArrowDownLeft, Plus, Minus, Eye, EyeOff, History } from 'lucide-react';
import { useWallet } from '../../hooks/useWallet';
import { usePaystack } from '../../hooks/usePaystack';
import { DepositModal } from './DepositModal';
import { WithdrawModal } from './WithdrawModal';

interface WalletDashboardProps {
  userId: string;
  userEmail: string;
}

export const WalletDashboard: React.FC<WalletDashboardProps> = ({ userId, userEmail }) => {
  const { wallet, isLoading, depositFunds, withdrawFunds } = useWallet(userId);
  const { initializePayment, isConfigured } = usePaystack();
  const [showBalance, setShowBalance] = useState(true);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="w-4 h-4 text-green-600" />;
      case 'withdrawal':
        return <ArrowUpRight className="w-4 h-4 text-red-600" />;
      case 'earning':
        return <Plus className="w-4 h-4 text-blue-600" />;
      case 'payment':
        return <Minus className="w-4 h-4 text-orange-600" />;
      default:
        return <History className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'deposit':
      case 'earning':
        return 'text-green-600';
      case 'withdrawal':
      case 'payment':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleDeposit = async (amount: number, method: 'card' | 'transfer' | 'ussd') => {
    setPaymentError('');

    const channels =
      method === 'card'
        ? ['card']
        : method === 'transfer'
          ? ['bank_transfer', 'bank']
          : ['ussd'];

    await initializePayment({
      email: userEmail,
      amount,
      channels,
      onSuccess: async (reference) => {
        await depositFunds(amount);
        setShowDepositModal(false);
      },
      onClose: () => {
        console.log('Payment cancelled');
      },
      onError: (message) => {
        setPaymentError(message);
      },
      metadata: {
        userId,
        type: 'wallet_deposit'
      }
    });
  };

  const handleWithdraw = async (amount: number, bankDetails: any) => {
    const result = await withdrawFunds(amount, bankDetails);
    if (result.success) {
      setShowWithdrawModal(false);
    }
    return result;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-12 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
        <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Wallet Not Found</h3>
        <p className="text-gray-500">Unable to load wallet information</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Wallet Balance Card */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Wallet className="w-6 h-6" />
            <h2 className="text-lg font-semibold">CampusLink Wallet</h2>
          </div>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        <div className="mb-6">
          <p className="text-purple-200 text-sm mb-1">Available Balance</p>
          <h3 className="text-3xl font-bold">
            {showBalance ? formatCurrency(wallet.balance) : '₦ ****'}
          </h3>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => setShowDepositModal(true)}
            className="flex-1 bg-white bg-opacity-20 hover:bg-opacity-30 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Deposit</span>
          </button>
          <button
            onClick={() => setShowWithdrawModal(true)}
            className="flex-1 bg-white bg-opacity-20 hover:bg-opacity-30 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <Minus className="w-5 h-5" />
            <span>Withdraw</span>
          </button>
        </div>
      </div>

      {/* Bank Account Info */}
      {!isConfigured && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl">
          Add `VITE_PAYSTACK_PUBLIC_KEY` to enable live wallet top-up with Paystack.
        </div>
      )}

      {paymentError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl">
          {paymentError}
        </div>
      )}

      {wallet.accountNumber && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Linked Bank Account
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Account Number</p>
              <p className="font-medium text-gray-900">{wallet.accountNumber}</p>
            </div>
            <div>
              <p className="text-gray-500">Bank Name</p>
              <p className="font-medium text-gray-900">{wallet.bankName}</p>
            </div>
            <div>
              <p className="text-gray-500">Account Name</p>
              <p className="font-medium text-gray-900">{wallet.accountName}</p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <History className="w-5 h-5 mr-2" />
          Recent Transactions
        </h3>
        
        {wallet.transactions.length === 0 ? (
          <div className="text-center py-8">
            <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {wallet.transactions.slice(0, 10).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-sm text-gray-500">
                      {transaction.createdAt.toLocaleDateString()} • {transaction.reference}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                    {transaction.type === 'deposit' || transaction.type === 'earning' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </p>
                  <p className={`text-xs capitalize ${
                    transaction.status === 'completed' ? 'text-green-600' :
                    transaction.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {transaction.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <DepositModal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        onDeposit={handleDeposit}
      />

      <WithdrawModal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        onWithdraw={handleWithdraw}
        currentBalance={wallet.balance}
        bankDetails={{
          accountNumber: wallet.accountNumber || '',
          bankName: wallet.bankName || '',
          accountName: wallet.accountName || ''
        }}
      />
    </div>
  );
};
