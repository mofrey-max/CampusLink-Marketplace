import React, { useState } from 'react';
import { X, CreditCard, Smartphone, Building } from 'lucide-react';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeposit: (amount: number, method: 'card' | 'transfer' | 'ussd') => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  onClose,
  onDeposit
}) => {
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('card');

  const quickAmounts = [1000, 2500, 5000, 10000, 25000, 50000];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const depositAmount = parseFloat(amount);
    
    if (depositAmount < 100) {
      alert('Minimum deposit amount is ₦100');
      return;
    }
    
    if (depositAmount > 500000) {
      alert('Maximum deposit amount is ₦500,000');
      return;
    }

    onDeposit(depositAmount, selectedMethod as 'card' | 'transfer' | 'ussd');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(value);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Deposit Funds</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Payment Method Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setSelectedMethod('card')}
                className={`p-3 border rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                  selectedMethod === 'card'
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <CreditCard className="w-6 h-6" />
                <span className="text-xs font-medium">Card</span>
              </button>
              
              <button
                type="button"
                onClick={() => setSelectedMethod('transfer')}
                className={`p-3 border rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                  selectedMethod === 'transfer'
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Building className="w-6 h-6" />
                <span className="text-xs font-medium">Transfer</span>
              </button>
              
              <button
                type="button"
                onClick={() => setSelectedMethod('ussd')}
                className={`p-3 border rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                  selectedMethod === 'ussd'
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Smartphone className="w-6 h-6" />
                <span className="text-xs font-medium">USSD</span>
              </button>
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (₦)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              min="100"
              max="500000"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-lg font-medium"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Minimum: ₦100 • Maximum: ₦500,000
            </p>
          </div>

          {/* Quick Amount Buttons */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Quick Select
            </label>
            <div className="grid grid-cols-3 gap-2">
              {quickAmounts.map((quickAmount) => (
                <button
                  key={quickAmount}
                  type="button"
                  onClick={() => setAmount(quickAmount.toString())}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:border-purple-500 hover:text-purple-600 transition-colors"
                >
                  {formatCurrency(quickAmount)}
                </button>
              ))}
            </div>
          </div>

          {/* Transaction Fee Info */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Transaction Details</h4>
            <div className="space-y-1 text-sm text-blue-800">
              <div className="flex justify-between">
                <span>Amount:</span>
                <span>{amount ? formatCurrency(parseFloat(amount)) : '₦0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span>Transaction Fee:</span>
                <span>₦0.00</span>
              </div>
              <div className="flex justify-between font-medium border-t border-blue-200 pt-1">
                <span>Total:</span>
                <span>{amount ? formatCurrency(parseFloat(amount)) : '₦0.00'}</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!amount || parseFloat(amount) < 100}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Proceed to Payment
          </button>
        </form>
      </div>
    </div>
  );
};
