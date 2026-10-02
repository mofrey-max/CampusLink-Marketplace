import { useState, useEffect } from 'react';

interface AndroidFeatures {
  isAndroid: boolean;
  isInstalled: boolean;
  canInstall: boolean;
  supportsNotifications: boolean;
  installApp: () => Promise<void>;
  requestNotificationPermission: () => Promise<NotificationPermission>;
}

export const useAndroidFeatures = (): AndroidFeatures => {
  const [isAndroid, setIsAndroid] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Detect Android
    const androidCheck = /Android/i.test(navigator.userAgent);
    setIsAndroid(androidCheck);

    // Check if app is installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebApp = (window.navigator as any).standalone === true;
    setIsInstalled(isStandalone || isInWebApp);

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setCanInstall(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installApp = async (): Promise<void> => {
    if (!deferredPrompt) {
      throw new Error('Install prompt not available');
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      }
      
      setDeferredPrompt(null);
      setCanInstall(false);
    } catch (error) {
      console.error('Installation failed:', error);
      throw error;
    }
  };

  const requestNotificationPermission = async (): Promise<NotificationPermission> => {
    if (!('Notification' in window)) {
      throw new Error('Notifications not supported');
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission === 'denied') {
      return 'denied';
    }

    const permission = await Notification.requestPermission();
    return permission;
  };

  const supportsNotifications = 'Notification' in window && 'serviceWorker' in navigator;

  return {
    isAndroid,
    isInstalled,
    canInstall,
    supportsNotifications,
    installApp,
    requestNotificationPermission
  };
};