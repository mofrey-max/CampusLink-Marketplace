import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppiOS = (window.navigator as any).standalone === true;
    
    if (isStandalone || isInWebAppiOS) {
      setIsInstalled(true);
      return;
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show install prompt after a delay
      setTimeout(() => {
        setShowInstallPrompt(true);
      }, 3000);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    } catch (error) {
      console.error('Error during installation:', error);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Don't show again for this session
    sessionStorage.setItem('installPromptDismissed', 'true');
  };

  // Don't show if already installed or dismissed
  if (isInstalled || !showInstallPrompt || !deferredPrompt) {
    return null;
  }

  // Check if user already dismissed this session
  if (sessionStorage.getItem('installPromptDismissed')) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 lg:hidden">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-4 shadow-2xl text-white">
        <div className="flex items-start space-x-3">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Smartphone className="w-6 h-6" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white mb-1">Install CampusLink</h3>
            <p className="text-purple-100 text-sm mb-3">
              Get the full app experience with offline access and push notifications
            </p>
            
            <div className="flex space-x-2">
              <button
                onClick={handleInstallClick}
                className="flex items-center space-x-2 bg-white text-purple-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Install</span>
              </button>
              
              <button
                onClick={handleDismiss}
                className="flex items-center space-x-2 bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-opacity-30 transition-colors"
              >
                <span>Later</span>
              </button>
            </div>
          </div>
          
          <button
            onClick={handleDismiss}
            className="p-1 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};