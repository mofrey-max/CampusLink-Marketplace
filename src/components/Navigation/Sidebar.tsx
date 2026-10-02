import React from 'react';
import { 
  Home, 
  FolderOpen, 
  MessageSquare, 
  ShoppingBag, 
  ShoppingCart,
  BarChart3, 
  Building2, 
  Newspaper, 
  User, 
  Wallet, 
  CreditCard, 
  LogOut, 
  X,
  Star,
  GraduationCap,
  Package
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { VerifiedStudentBadge } from '../UI/VerifiedStudentBadge';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  isMobile?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  onTabChange, 
  onLogout, 
  isMobile = false 
}) => {
  const { user } = useAuth();

  if (!user) return null;

  const getNavigationItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
      { id: 'profile', label: 'Profile', icon: User },
      { id: 'wallet', label: 'Wallet', icon: Wallet },
      { id: 'billing', label: 'Billing', icon: CreditCard },
    ];

    // Super Admin gets minimal navigation
    if (user.role === 'super_admin') {
      return baseItems;
    }

    // Expert navigation
    if (user.userType === 'expert') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: Home },
        { id: 'projects', label: 'Projects', icon: FolderOpen },
        { id: 'messages', label: 'Messages', icon: MessageSquare },
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'wallet', label: 'Wallet', icon: Wallet },
        { id: 'billing', label: 'Billing', icon: CreditCard },
      ];
    }

    // Institution navigation
    if (user.userType === 'institution') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: Home },
        { id: 'projects', label: 'Projects', icon: FolderOpen },
        { id: 'messages', label: 'Messages', icon: MessageSquare },
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'wallet', label: 'Wallet', icon: Wallet },
        { id: 'billing', label: 'Billing', icon: CreditCard },
      ];
    }

    // Student navigation (default)
    return [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
      { id: 'projects', label: 'Projects', icon: FolderOpen },
      { id: 'messages', label: 'Messages', icon: MessageSquare },
      { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
        { id: 'cart', label: 'Cart', icon: ShoppingCart },
        { id: 'orders', label: 'Orders', icon: Package },
      { id: 'data-analysis', label: 'Data Analysis', icon: BarChart3 },
      { id: 'accommodation', label: 'Accommodation', icon: Building2 },
      { id: 'news', label: 'News', icon: Newspaper },
      { id: 'profile', label: 'Profile', icon: User },
      { id: 'wallet', label: 'Wallet', icon: Wallet },
      { id: 'billing', label: 'Billing', icon: CreditCard },
    ];
  };

  const navigationItems = getNavigationItems();

  const handleLogout = () => {
    console.log('Sidebar: Logout clicked');
    onLogout();
  };

  return (
    <div className="flex flex-col h-full glass-panel-strong w-72 text-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-200/80">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-[0_0_28px_rgba(104,82,255,0.35)] glow-ring">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.26em] text-cyan-700/70">Future Commerce</p>
            <h1 className="text-lg font-bold text-slate-900 text-neon">CampusLink</h1>
          </div>
        </div>
        {isMobile && (
          <button
            onClick={() => onTabChange(activeTab)}
            className="p-2 border border-slate-200 bg-white/80 hover:bg-white"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        )}
      </div>

      {/* User Info */}
      <div className="p-6 border-b border-slate-200/80">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-100 to-cyan-50 border border-slate-200 flex items-center justify-center">
            <User className="w-5 h-5 text-cyan-700" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">
              {user.name}
            </p>
            <div className="flex items-center space-x-1 flex-wrap">
              <p className="text-xs text-slate-500 capitalize">
                {user.userType}
              </p>
              {user.isPremium && (
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
              )}
              {user.userType === 'student' && user.isVerified && (
                <VerifiedStudentBadge compact />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-violet-100 to-cyan-50 text-slate-900 border border-violet-200 shadow-[0_14px_30px_rgba(130,148,184,0.18)]'
                  : 'text-slate-600 hover:bg-white/70 hover:text-slate-900 border border-transparent'
              }`}
            >
              <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-cyan-600' : 'text-slate-400'}`} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-200/80">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-3 text-sm font-medium text-rose-500 border border-slate-200 bg-white/70 hover:bg-rose-50 hover:text-rose-600 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5 text-rose-400" />
          Logout
        </button>
      </div>
    </div>
  );
};
