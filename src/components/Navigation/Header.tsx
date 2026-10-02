import React from 'react';
import { Bell, Search, ShoppingCart, User, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCommerce } from '../../hooks/useCommerce';
import { VerifiedStudentBadge } from '../UI/VerifiedStudentBadge';

interface HeaderProps {
  onNotificationClick: () => void;
  onSearchClick: () => void;
  onCartClick: () => void;
  notificationCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onNotificationClick,
  onSearchClick,
  onCartClick,
  notificationCount = 0
}) => {
  const { user, logout } = useAuth();
  const { cartCount } = useCommerce();

  const handleLogout = () => {
    console.log('Header: Logout button clicked');
    logout();
  };

  return (
    <div className="glass-panel border-x-0 border-t-0 px-5 py-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-violet-500/90 to-cyan-400/80 flex items-center justify-center glow-ring shadow-[0_0_28px_rgba(104,82,255,0.35)]">
          <span className="text-white font-bold text-sm">CL</span>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-cyan-700/70">Neural Commerce</p>
          <h1 className="text-lg font-semibold text-slate-900 truncate text-neon">
            CampusLink Dashboard
          </h1>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={onSearchClick}
          className="p-2.5 bg-white/70 border border-slate-200 hover:bg-white transition-colors"
          title="Search"
        >
          <Search className="w-5 h-5 text-slate-600" />
        </button>

        <button
          onClick={onNotificationClick}
          className="p-2.5 bg-white/70 border border-slate-200 hover:bg-white transition-colors relative"
          title="Notifications"
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
            title="Cart"
          >
            <ShoppingCart className="w-5 h-5 text-slate-600" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-violet-500 to-cyan-400 text-white text-xs rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center shadow-[0_0_18px_rgba(96,165,250,0.45)]">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </button>
        )}

        {user && (
          <div className="flex items-center space-x-3 ml-2 pl-3 border-l border-slate-200">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-100 to-cyan-50 border border-slate-200 flex items-center justify-center">
                <User className="w-5 h-5 text-cyan-700" />
              </div>
              <div className="hidden sm:flex sm:flex-col sm:gap-1">
                <span className="text-sm text-slate-700">
                  {user.name}
                </span>
                {user.userType === 'student' && user.isVerified && (
                  <VerifiedStudentBadge compact />
                )}
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="p-2.5 bg-white/70 border border-slate-200 hover:bg-rose-50 transition-colors text-rose-500 hover:text-rose-600"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
