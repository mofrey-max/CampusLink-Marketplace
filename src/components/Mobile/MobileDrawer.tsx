import React from 'react';
import { X, User, Settings, HelpCircle, LogOut, Star, CreditCard } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name: string;
    email: string;
    avatar?: string;
    isPremium?: boolean;
  };
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  user
}) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    onClose();
  };

  const menuItems = [
    { icon: User, label: 'Profile', action: () => {} },
    { icon: Star, label: 'Upgrade to Premium', action: () => {}, highlight: !user.isPremium },
    { icon: CreditCard, label: 'Billing', action: () => {} },
    { icon: Settings, label: 'Settings', action: () => {} },
    { icon: HelpCircle, label: 'Help & Support', action: () => {} },
    { icon: LogOut, label: 'Sign Out', action: handleLogout, danger: true }
  ];

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      <div className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 transform transition-transform duration-300">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                {user.name.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{user.name}</h3>
              <p className="text-sm text-gray-500">{user.email}</p>
              {user.isPremium && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mt-1">
                  <Star className="w-3 h-3 mr-1" />
                  Premium
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="py-4">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={item.action}
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
                item.danger ? 'text-red-600' : 'text-gray-700'
              } ${item.highlight ? 'bg-purple-50 text-purple-600' : ''}`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span className="font-medium">{item.label}</span>
              {item.highlight && (
                <span className="ml-auto bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                  New
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};