import React from 'react';
import { Bell, Search, Menu, ShoppingCart } from 'lucide-react';
import { useCommerce } from '../../hooks/useCommerce';
import { useAuth } from '../../hooks/useAuth';

interface MobileHeaderProps {
  title: string;
  onMenuClick: () => void;
  onNotificationClick: () => void;
  onSearchClick: () => void;
  onCartClick: () => void;
  notificationCount?: number;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  title,
  onMenuClick,
  onNotificationClick,
  onSearchClick,
  onCartClick,
  notificationCount = 0
}) => {
  const { user } = useAuth();
  const { cartCount } = useCommerce();

  return (
    <div className="glass-panel border-x-0 border-t-0 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center space-x-3">
        <button
          onClick={onMenuClick}
          className="p-2.5 bg-white/70 border border-slate-200 hover:bg-white transition-colors"
        >
          <Menu className="w-6 h-6 text-slate-700" />
        </button>
        <div>
          <h1 className="text-lg font-semibold text-slate-900 truncate text-neon">{title}</h1>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={onSearchClick}
          className="p-2.5 bg-white/70 border border-slate-200 hover:bg-white transition-colors"
        >
          <Search className="w-5 h-5 text-slate-600" />
        </button>
        
        <button
          onClick={onNotificationClick}
          className="p-2.5 bg-white/70 border border-slate-200 hover:bg-white transition-colors relative"
        >
          <Bell className="w-5 h-5 text-slate-600" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-fuchsia-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-[0_0_16px_rgba(217,70,239,0.45)]">
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          )}
        </button>

        {user?.userType === 'student' && (
          <button
            onClick={onCartClick}
            className="p-2.5 bg-white/70 border border-slate-200 hover:bg-white transition-colors relative"
          >
            <ShoppingCart className="w-5 h-5 text-slate-600" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-violet-500 to-cyan-400 text-white text-xs rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center shadow-[0_0_18px_rgba(96,165,250,0.45)]">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
