import React, { useState, useEffect } from 'react';
import { Bell, X, Settings } from 'lucide-react';
import { useAndroidFeatures } from '../../hooks/useAndroidFeatures';

export const AndroidNotifications: React.FC = () => {
  const { isAndroid, supportsNotifications, requestNotificationPermission } = useAndroidFeatures();
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if (!isAndroid || !supportsNotifications) return;

    // Check current notification permission
    setNotificationPermission(Notification.permission);

    // Show notification prompt after user has been active for a while
    const timer = setTimeout(() => {
      if (Notification.permission === 'default') {
        setShowNotificationPrompt(true);
      }
    }, 10000); // Show after 10 seconds

    return () => clearTimeout(timer);
  }, [isAndroid, supportsNotifications]);

  const handleEnableNotifications = async () => {
    try {
      const permission = await requestNotificationPermission();
      setNotificationPermission(permission);
      
      if (permission === 'granted') {
        // Show a test notification
        new Notification('CampusLink Notifications Enabled!', {
          body: 'You\'ll now receive updates about messages, projects, and more.',
          icon: '/icons/icon-192x192.png',
          badge: '/icons/badge-72x72.png'
        });
      }
      
      setShowNotificationPrompt(false);
    } catch (error) {
      console.error('Failed to enable notifications:', error);
    }
  };

  const handleDismiss = () => {
    setShowNotificationPrompt(false);
    // Don't show again for this session
    sessionStorage.setItem('notificationPromptDismissed', 'true');
  };

  // Don't show if not Android, notifications not supported, or already handled
  if (!isAndroid || !supportsNotifications || notificationPermission !== 'default' || !showNotificationPrompt) {
    return null;
  }

  // Check if user already dismissed this session
  if (sessionStorage.getItem('notificationPromptDismissed')) {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 right-4 z-50">
      <div className="bg-white rounded-2xl p-4 shadow-2xl border border-gray-200">
        <div className="flex items-start space-x-3">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Bell className="w-6 h-6 text-blue-600" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 mb-1">Stay Updated</h3>
            <p className="text-gray-600 text-sm mb-3">
              Enable notifications to get instant updates about new messages, project applications, and important announcements.
            </p>
            
            <div className="flex space-x-2">
              <button
                onClick={handleEnableNotifications}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors"
              >
                <Bell className="w-4 h-4" />
                <span>Enable</span>
              </button>
              
              <button
                onClick={handleDismiss}
                className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors"
              >
                <span>Later</span>
              </button>
            </div>
          </div>
          
          <button
            onClick={handleDismiss}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
};