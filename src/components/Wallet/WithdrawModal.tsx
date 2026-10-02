import React, { useState } from 'react';
import { X, Building, AlertCircle } from 'lucide-react';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWithdraw: (amount: number, bankDetails: any) => Promise<{ success: boolean; message?: string }>;
  currentBalance: number;
  bankDetails: {
    accountNumber: string;
    bankName: string;
    accountName: string;
  };
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  onClose,
  onWithdraw,
  currentBalance,
  bankDetails
}) => {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const withdrawAmount = parseFloat(amount);
    
    if (withdrawAmount < 500) {
      setError('Minimum withdrawal amount is ₦500');
      return;
    }
    
    if (withdrawAmount > currentBalance) {
      setError('Insufficient balance');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await onWithdraw(withdrawAmount, bankDetails);
      
      if (!result.success) {
        setError(result.message || 'Withdrawal failed');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Withdraw Funds</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Current Balance */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Available Balance</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(currentBalance)}</p>
          </div>

          {/* Bank Account Details */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-3 flex items-center">
              <Building className="w-4 h-4 mr-2" />
              Withdrawal Destination
            </h4>
            <div className="space-y-2 text-sm text-blue-800">
              <div className="flex justify-between">
                <span>Bank:</span>
                <span className="font-medium">{bankDetails.bankName}</span>
              </div>
              <div className="flex justify-between">
                <span>Account:</span>
                <span className="font-medium">{bankDetails.accountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Name:</span>
                <span className="font-medium">{bankDetails.accountName}</span>
              </div>
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Withdrawal Amount (₦)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              min="500"
              max={currentBalance}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-lg font-medium"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Minimum: ₦500 • Maximum: {formatCurrency(currentBalance)}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Transaction Summary */}
          {amount && parseFloat(amount) >= 500 && (
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-yellow-900 mb-2">Transaction Summary</h4>
              <div className="space-y-1 text-sm text-yellow-800">
                <div className="flex justify-between">
                  <span>Withdrawal Amount:</span>
                  <span>{formatCurrency(parseFloat(amount))}</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing Fee:</span>
                  <span>₦50.00</span>
                </div>
                <div className="flex justify-between font-medium border-t border-yellow-200 pt-1">
                  <span>You'll Receive:</span>
                  <span>{formatCurrency(parseFloat(amount) - 50)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Processing Time Info */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-600">
              <strong>Processing Time:</strong> Withdrawals are typically processed within 1-3 business days.
              You'll receive an email confirmation once the transfer is completed.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!amount || parseFloat(amount) < 500 || parseFloat(amount) > currentBalance || isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : 'Confirm Withdrawal'}
          </button>
        </form>
      </div>
    </div>
  );
};