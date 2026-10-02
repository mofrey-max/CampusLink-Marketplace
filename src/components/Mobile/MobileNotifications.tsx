import React from 'react';
import { X, Bell, MessageCircle, DollarSign, Home, BookOpen } from 'lucide-react';

interface Notification {
  id: string;
  type: 'message' | 'payment' | 'booking' | 'project' | 'general';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface MobileNotificationsProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export const MobileNotifications: React.FC<MobileNotificationsProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead
}) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'message': return MessageCircle;
      case 'payment': return DollarSign;
      case 'booking': return Home;
      case 'project': return BookOpen;
      default: return Bell;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'message': return 'text-blue-600 bg-blue-100';
      case 'payment': return 'text-green-600 bg-green-100';
      case 'booking': return 'text-purple-600 bg-purple-100';
      case 'project': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-50">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
        <div className="flex items-center space-x-2">
          {notifications.some(n => !n.read) && (
            <button
              onClick={onMarkAllAsRead}
              className="text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              Mark all read
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Bell className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-500 text-center">
              You're all caught up! Check back later for updates.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => {
              const Icon = getIcon(notification.type);
              const iconColor = getIconColor(notification.type);
              
              return (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => onMarkAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-sm font-medium ${
                          !notification.read ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full ml-2" />
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      
                      <p className="text-xs text-gray-500 mt-2">
                        {notification.timestamp.toLocaleDateString()} at{' '}
                        {notification.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};