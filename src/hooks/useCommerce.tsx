import { createContext, createElement, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { CartItem, CheckoutFormData, MarketplaceProduct, Order } from '../types';

const CART_STORAGE_KEY = 'campuslink_cart';
const ORDER_STORAGE_KEY = 'campuslink_orders';

interface CommerceContextValue {
  cartItems: CartItem[];
  orders: Order[];
  cartCount: number;
  cartSubtotal: number;
  addToCart: (product: MarketplaceProduct) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (checkout: CheckoutFormData, paymentReference?: string) => Order;
}

const CommerceContext = createContext<CommerceContextValue | undefined>(undefined);

const safeParse = <T,>(value: string | null, fallback: T): T => {
  if (!value) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.error('Failed to parse commerce storage:', error);
    return fallback;
  }
};

export const CommerceProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setCartItems(safeParse<CartItem[]>(localStorage.getItem(CART_STORAGE_KEY), []));
    setOrders(safeParse<Order[]>(localStorage.getItem(ORDER_STORAGE_KEY), []));
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  const addToCart = (product: MarketplaceProduct) => {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.productId === product.id);

      if (existingItem) {
        return currentItems.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...currentItems,
        {
          id: `cart-${product.id}`,
          productId: product.id,
          title: product.title,
          sellerName: product.sellerName,
          itemType: product.itemType,
          category: product.category,
          description: product.description,
          location: product.location,
          delivery: product.delivery,
          price: product.price,
          quantity: 1,
          imageAccent: product.imageAccent,
          imageUrl: product.imageUrl
        }
      ];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems((currentItems) => currentItems.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const placeOrder = (checkout: CheckoutFormData, paymentReference?: string) => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const serviceFee = Math.round(subtotal * 0.05);
    const deliveryFee = subtotal > 0 ? 2500 : 0;
    const total = subtotal + serviceFee + deliveryFee;

    const order: Order = {
      id: `ORD-${Date.now()}`,
      items: cartItems,
      subtotal,
      serviceFee,
      deliveryFee,
      total,
      status: 'processing',
      paymentStatus: checkout.paymentMethod === 'wallet' || paymentReference ? 'paid' : 'pending',
      paymentReference,
      checkout,
      createdAt: new Date().toISOString(),
      estimatedDelivery: 'Within 2-3 business days'
    };

    setOrders((currentOrders) => [order, ...currentOrders]);
    setCartItems([]);

    return order;
  };

  const cartCount = useMemo(
    () => cartItems.reduce((count, item) => count + item.quantity, 0),
    [cartItems]
  );

  const cartSubtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  const value = useMemo(
    () => ({
      cartItems,
      orders,
      cartCount,
      cartSubtotal,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      placeOrder
    }),
    [cartCount, cartItems, cartSubtotal, orders]
  );

  return createElement(CommerceContext.Provider, { value }, children);
};

export const useCommerce = () => {
  const context = useContext(CommerceContext);

  if (!context) {
    throw new Error('useCommerce must be used within a CommerceProvider');
  }

  return context;
};
