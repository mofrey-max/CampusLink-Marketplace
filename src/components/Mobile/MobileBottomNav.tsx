import React from 'react';
import { FolderOpen, Home, MessageCircle, Search, ShoppingCart, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCommerce } from '../../hooks/useCommerce';

interface MobileBottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeTab, onTabChange }) => {
  const { user } = useAuth();
  const { cartCount } = useCommerce();

  const navItems = React.useMemo(() => {
    const baseItems = [
      { id: 'dashboard', label: 'Home', Icon: Home },
      { id: 'messages', label: 'Messages', Icon: MessageCircle },
      { id: 'profile', label: 'Profile', Icon: User },
    ];

    if (user?.role === 'super_admin') return baseItems;

    if (user?.userType === 'student') {
      return [
        { id: 'dashboard', label: 'Home', Icon: Home },
        { id: 'marketplace', label: 'Market', Icon: Search },
        { id: 'cart', label: 'Cart', Icon: ShoppingCart, badge: cartCount },
        { id: 'messages', label: 'Messages', Icon: MessageCircle },
        { id: 'profile', label: 'Profile', Icon: User },
      ];
    }

    return [
      { id: 'dashboard', label: 'Home', Icon: Home },
      { id: 'projects', label: 'Projects', Icon: FolderOpen },
      { id: 'messages', label: 'Messages', Icon: MessageCircle },
      { id: 'profile', label: 'Profile', Icon: User },
    ];
  }, [cartCount, user?.role, user?.userType]);

  return (
    <div className="fixed bottom-0 left-0 right-0 px-3 py-2 safe-area-pb z-50">
      <div className="glass-panel max-w-md mx-auto px-2 py-1.5 flex justify-around items-center">
        {navItems.map(({ id, label, Icon, badge }) => {
          const hasBadge = typeof badge === 'number' && badge > 0;

          return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex flex-col items-center justify-center p-2 transition-all min-w-0 flex-1 touch-target ${
              activeTab === id
                ? 'text-slate-900 bg-white shadow-[0_10px_24px_rgba(130,148,184,0.18)]'
                : 'text-slate-500 hover:text-slate-900 hover:bg-white/70'
            }`}
          >
            <div
              className={`relative flex items-center justify-center mb-0.5 ${
                id === 'cart' ? 'w-7 h-7' : ''
              }`}
            >
              <Icon
                className={`w-5 h-5 ${activeTab === id ? 'text-cyan-600' : ''} ${
                  id === 'cart' && hasBadge ? 'scale-[0.92]' : ''
                }`}
              />
              {id === 'cart' && hasBadge ? (
                <span className="absolute inset-0 flex items-center justify-center text-[9px] font-semibold text-white">
                  {badge > 9 ? '9+' : badge}
                </span>
              ) : null}
              {id !== 'cart' && hasBadge ? (
                <span className="absolute -top-2 -right-3 bg-gradient-to-r from-violet-500 to-cyan-400 text-white text-[10px] rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center shadow-[0_0_16px_rgba(96,165,250,0.38)]">
                  {badge > 9 ? '9+' : badge}
                </span>
              ) : null}
            </div>
            <span className="text-xs font-medium truncate">{label}</span>
          </button>
          );
        })}
      </div>
    </div>
  );
};
