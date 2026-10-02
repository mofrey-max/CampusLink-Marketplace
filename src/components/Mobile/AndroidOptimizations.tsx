import React, { useEffect } from 'react';

export const AndroidOptimizations: React.FC = () => {
  useEffect(() => {
    // Android-specific optimizations
    const optimizeForAndroid = () => {
      // Prevent zoom on input focus
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      if (viewportMeta) {
        viewportMeta.setAttribute('content', 
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
        );
      }

      // Handle Android back button
      const handleBackButton = (e: PopStateEvent) => {
        // Custom back button handling for Android
        if (window.history.length > 1) {
          // Let the browser handle normal navigation
          return;
        } else {
          // Prevent app from closing, show confirmation
          e.preventDefault();
          if (confirm('Are you sure you want to exit CampusLink?')) {
            window.close();
          }
        }
      };

      window.addEventListener('popstate', handleBackButton);

      // Android keyboard handling
      const handleResize = () => {
        // Adjust viewport when keyboard appears
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      };

      window.addEventListener('resize', handleResize);
      handleResize(); // Initial call

      // Android status bar color
      const setStatusBarColor = () => {
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
          metaThemeColor.setAttribute('content', '#7c3aed');
        }
      };

      setStatusBarColor();

      // Cleanup
      return () => {
        window.removeEventListener('popstate', handleBackButton);
        window.removeEventListener('resize', handleResize);
      };
    };

    // Only apply optimizations on Android
    const isAndroid = /Android/i.test(navigator.userAgent);
    if (isAndroid) {
      optimizeForAndroid();
    }
  }, []);

  return null; // This component doesn't render anything
};