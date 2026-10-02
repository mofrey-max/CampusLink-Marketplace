import React from 'react';
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { useCommerce } from '../../hooks/useCommerce';

interface CartPageProps {
  onNavigate: (tab: string) => void;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount);

export const CartPage: React.FC<CartPageProps> = ({ onNavigate }) => {
  const { cartItems, cartSubtotal, updateQuantity, removeFromCart, clearCart } = useCommerce();

  const serviceFee = Math.round(cartSubtotal * 0.05);
  const deliveryFee = cartItems.length > 0 ? 2500 : 0;
  const total = cartSubtotal + serviceFee + deliveryFee;

  if (cartItems.length === 0) {
    return (
      <div className="bg-white border border-slate-200 shadow-sm p-8 text-center">
        <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add services or goods from the marketplace to begin checkout.</p>
        <button
          onClick={() => onNavigate('marketplace')}
          className="px-5 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:from-purple-700 hover:to-blue-700 transition-all"
        >
          Return to Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="grid xl:grid-cols-[1.7fr_0.9fr] gap-4">
      <div className="space-y-4">
        <div className="bg-white border border-slate-200 shadow-sm p-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Shopping Cart</h1>
            <p className="text-sm text-gray-500">{cartItems.length} items ready for checkout</p>
          </div>
          <button
            onClick={clearCart}
            className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
          >
            Clear cart
          </button>
        </div>

        {cartItems.map((item) => (
          <div key={item.productId} className="bg-white border border-slate-200 shadow-sm p-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-purple-100 text-purple-700 text-xs font-semibold uppercase">
                    {item.itemType}
                  </span>
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium">
                    {item.category}
                  </span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{item.title}</h2>
                  <p className="text-sm text-gray-500">Sold by {item.sellerName}</p>
                </div>
                <p className="text-sm text-gray-600">{item.description}</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <span>{item.location}</span>
                  <span>{item.delivery}</span>
                </div>
              </div>

              <div className="flex flex-col items-start md:items-end gap-4">
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(item.price)}</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="p-2 border border-gray-300 hover:bg-gray-50 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-semibold text-gray-900">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="p-2 border border-gray-300 hover:bg-gray-50 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="inline-flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="bg-white border border-slate-200 shadow-sm p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(cartSubtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Service fee</span>
              <span>{formatCurrency(serviceFee)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Delivery</span>
              <span>{formatCurrency(deliveryFee)}</span>
            </div>
            <div className="pt-3 border-t border-gray-200 flex items-center justify-between text-base font-semibold text-gray-900">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
          <button
            onClick={() => onNavigate('checkout')}
            className="w-full mt-5 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:from-purple-700 hover:to-blue-700 transition-all"
          >
            Proceed to Checkout
          </button>
          <button
            onClick={() => onNavigate('marketplace')}
            className="w-full mt-3 px-4 py-3 border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};
