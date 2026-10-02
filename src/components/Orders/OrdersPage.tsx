import React from 'react';
import { PackageCheck } from 'lucide-react';
import { useCommerce } from '../../hooks/useCommerce';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount);

const formatDate = (value: string) =>
  new Date(value).toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' });

interface OrdersPageProps {
  onNavigate: (tab: string) => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({ onNavigate }) => {
  const { orders } = useCommerce();

  if (orders.length === 0) {
    return (
      <div className="bg-white border border-slate-200 shadow-sm p-8 text-center">
        <PackageCheck className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">No orders yet</h1>
        <p className="text-gray-500 mb-6">Completed orders will appear here after checkout.</p>
        <button
          onClick={() => onNavigate('marketplace')}
          className="px-5 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:from-purple-700 hover:to-blue-700 transition-all"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 shadow-sm p-5">
        <h1 className="text-2xl font-semibold text-gray-900">My Orders</h1>
        <p className="text-sm text-gray-500 mt-1">Track placed orders and recent checkout activity.</p>
      </div>

      {orders.map((order) => (
        <div key={order.id} className="bg-white border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <p className="text-sm text-gray-500">{order.id}</p>
              <h2 className="text-lg font-semibold text-gray-900">{formatDate(order.createdAt)}</h2>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="px-3 py-1 bg-amber-50 text-amber-700 font-medium uppercase">
                {order.status}
              </span>
              <span className="px-3 py-1 bg-slate-100 text-slate-700 font-medium">
                {order.estimatedDelivery}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={`${order.id}-${item.productId}`} className="flex items-start justify-between gap-3 border-b border-gray-100 pb-3">
                <div>
                  <p className="font-medium text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-500">
                    {item.quantity} x {formatCurrency(item.price)} · {item.sellerName}
                  </p>
                </div>
                <p className="font-semibold text-gray-900">{formatCurrency(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 border border-gray-100 p-4">
              <p className="font-medium text-gray-900 mb-2">Delivery details</p>
              <p className="text-gray-600">{order.checkout.fullName}</p>
              <p className="text-gray-600">{order.checkout.phone}</p>
              <p className="text-gray-600">{order.checkout.address}</p>
              <p className="text-gray-600">{order.checkout.city}, {order.checkout.state}</p>
            </div>
            <div className="bg-gray-50 border border-gray-100 p-4 space-y-2">
              <p className="font-medium text-gray-900">Payment summary</p>
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Service fee</span>
                <span>{formatCurrency(order.serviceFee)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery fee</span>
                <span>{formatCurrency(order.deliveryFee)}</span>
              </div>
              <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
