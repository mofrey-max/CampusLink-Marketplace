import React, { useState } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import { useAuth } from './hooks/useAuth';
import { LoginForm } from './components/Auth/LoginForm';
import { RegisterForm } from './components/Auth/RegisterForm';
import { Sidebar } from './components/Navigation/Sidebar';
import { Header } from './components/Navigation/Header';
import { MobileHeader } from './components/Mobile/MobileHeader';
import { MobileBottomNav } from './components/Mobile/MobileBottomNav';
import { VerificationBanner } from './components/Auth/VerificationBanner';
import { Dashboard } from './components/Dashboard/Dashboard';
import { SuperAdminDashboard } from './components/Dashboard/SuperAdminDashboard';
import { ExpertDashboard } from './components/Dashboard/ExpertDashboard';
import { InstitutionDashboard } from './components/Dashboard/InstitutionDashboard';
import { Projects } from './components/Projects/Projects';
import { Messages } from './components/Messages/Messages';
import { Marketplace } from './components/Marketplace/Marketplace';
import { MarketplaceCategoryPage } from './components/Marketplace/MarketplaceCategoryPage';
import { CartPage } from './components/Cart/CartPage';
import { CheckoutPage } from './components/Checkout/CheckoutPage';
import { OrdersPage } from './components/Orders/OrdersPage';
import { DataAnalysis } from './components/DataAnalysis/DataAnalysis';
import { Accommodation } from './components/Accommodation/Accommodation';
import { News } from './components/News/News';
import { Profile } from './components/Profile/Profile';
import { WalletDashboard } from './components/Wallet/WalletDashboard';
import { BillingDashboard } from './components/Billing/BillingDashboard';
import { LegalPage } from './components/Legal/LegalPage';
import { LoadingSpinner } from './components/UI/LoadingSpinner';
import { getMarketplaceCategoryIdFromTab, isMarketplaceCategoryTab } from './components/Marketplace/marketplaceData';

const getDefaultTab = (user?: { role?: string; userType?: string } | null) => {
  if (!user) return 'marketplace';
  if (user.role === 'super_admin') return 'dashboard';
  if (user.userType === 'student') return 'marketplace';
  return 'dashboard';
};

function App() {
  const [error, setError] = useState<string | null>(null);

  const { 
    user, 
    isLoading, 
    isAuthenticated, 
    login, 
    register, 
    updateUser,
    logout 
  } = useAuth();

  const [showRegister, setShowRegister] = useState(false);
  const [showAuthScreen, setShowAuthScreen] = useState(false);
  const [activeTab, setActiveTab] = useState(getDefaultTab(user));
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const legalTabs = ['privacy-policy', 'terms-and-conditions', 'return-policy'];

  // Error boundary for rendering errors
  const handleRenderError = (error: Error) => {
    console.error('Render error:', error);
    setError(`Rendering error: ${error.message}`);
  };

  // Safe tab change with error handling
  const handleTabChange = (tab: string) => {
    try {
      setActiveTab(tab);
      setShowMobileMenu(false);
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error('Tab change error:', error);
      setError('Failed to change tab');
    }
  };

  // Safe logout with error handling
  const handleLogout = () => {
    try {
      logout();
      setShowAuthScreen(false);
      setActiveTab(getDefaultTab(null));
      setError(null);
    } catch (error) {
      console.error('Logout error:', error);
      setError('Failed to logout');
    }
  };

  React.useEffect(() => {
    setActiveTab(getDefaultTab(user));
  }, [user]);

  React.useEffect(() => {
    if (user) {
      setShowAuthScreen(false);
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen futuristic-app flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen futuristic-app flex items-center justify-center p-4">
        <div className="glass-panel neo-card p-6 max-w-md w-full text-center text-white">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-slate-300 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              window.location.reload();
            }}
            className="px-4 py-2 bg-gradient-to-r from-violet-600 to-cyan-500 text-white hover:from-violet-500 hover:to-cyan-400 transition-colors neon-button"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    try {
      if (legalTabs.includes(activeTab)) {
        return (
          <div className="min-h-screen futuristic-app px-4 sm:px-6 lg:px-8 xl:px-10 py-6">
            <LegalPage
              policy={activeTab as 'privacy-policy' | 'terms-and-conditions' | 'return-policy'}
              onNavigate={handleTabChange}
            />
          </div>
        );
      }

      if (isMarketplaceCategoryTab(activeTab)) {
        const categoryId = getMarketplaceCategoryIdFromTab(activeTab);
        if (categoryId) {
          return (
            <div className="min-h-screen futuristic-app px-4 sm:px-6 lg:px-8 xl:px-10 py-6">
              <MarketplaceCategoryPage
                categoryId={categoryId}
                onNavigate={handleTabChange}
                onSignInClick={() => {
                  setShowRegister(false);
                  setShowAuthScreen(true);
                }}
              />
            </div>
          );
        }
      }

      if (!showAuthScreen) {
        return (
          <div className="min-h-screen futuristic-app px-4 sm:px-6 lg:px-8 xl:px-10">
            <Marketplace
              onNavigate={handleTabChange}
              onSignInClick={() => {
                setShowRegister(false);
                setShowAuthScreen(true);
              }}
              onRegisterClick={() => {
                setShowRegister(true);
                setShowAuthScreen(true);
              }}
            />
          </div>
        );
      }

      return showRegister ? (
        <RegisterForm 
          onRegister={register}
          onSwitchToLogin={() => setShowRegister(false)}
          onOpenLegalPage={handleTabChange}
        />
      ) : (
        <LoginForm 
          onLogin={login}
          onSwitchToRegister={() => setShowRegister(true)}
        />
      );
    } catch (error) {
      handleRenderError(error as Error);
      return null;
    }
  }

  const renderContent = () => {
    try {
      if (!user) return null;

      if (legalTabs.includes(activeTab)) {
        return (
          <LegalPage
            policy={activeTab as 'privacy-policy' | 'terms-and-conditions' | 'return-policy'}
            onNavigate={handleTabChange}
          />
        );
      }

      if (isMarketplaceCategoryTab(activeTab)) {
        const categoryId = getMarketplaceCategoryIdFromTab(activeTab);
        if (categoryId) {
          return <MarketplaceCategoryPage categoryId={categoryId} onNavigate={handleTabChange} />;
        }
      }

      // Super Admin Dashboard
      if (user.role === 'super_admin') {
        switch (activeTab) {
          case 'dashboard':
            return <SuperAdminDashboard onNavigate={setActiveTab} />;
          case 'profile':
            return <Profile />;
          case 'messages':
            return <Messages />;
          case 'wallet':
            return <WalletDashboard userId={user.id} userEmail={user.email} />;
          case 'billing':
            return <BillingDashboard 
              userEmail={user.email} 
              isPremium={user.isPremium} 
              onUpgrade={() => updateUser({ isPremium: true })} 
            />;
          default:
            return <SuperAdminDashboard onNavigate={setActiveTab} />;
        }
      }

      // Expert Dashboard
      if (user.userType === 'expert') {
        switch (activeTab) {
          case 'dashboard':
            return <ExpertDashboard onNavigate={setActiveTab} />;
          case 'projects':
            return <Projects />;
          case 'messages':
            return <Messages />;
          case 'profile':
            return <Profile />;
          case 'wallet':
            return <WalletDashboard userId={user.id} userEmail={user.email} />;
          case 'billing':
            return <BillingDashboard 
              userEmail={user.email} 
              isPremium={user.isPremium} 
              onUpgrade={() => updateUser({ isPremium: true })} 
            />;
          default:
            return <ExpertDashboard onNavigate={setActiveTab} />;
        }
      }

      // Institution Dashboard
      if (user.userType === 'institution') {
        switch (activeTab) {
          case 'dashboard':
            return <InstitutionDashboard onNavigate={setActiveTab} />;
          case 'projects':
            return <Projects />;
          case 'messages':
            return <Messages />;
          case 'profile':
            return <Profile />;
          case 'wallet':
            return <WalletDashboard userId={user.id} userEmail={user.email} />;
          case 'billing':
            return <BillingDashboard 
              userEmail={user.email} 
              isPremium={user.isPremium} 
              onUpgrade={() => updateUser({ isPremium: true })} 
            />;
          default:
            return <InstitutionDashboard onNavigate={setActiveTab} />;
        }
      }

      // Student Dashboard (default)
      switch (activeTab) {
        case 'dashboard':
          return <Dashboard />;
        case 'projects':
          return <Projects />;
        case 'messages':
          return <Messages />;
        case 'marketplace':
          return <Marketplace onNavigate={handleTabChange} />;
        case 'cart':
          return <CartPage onNavigate={handleTabChange} />;
        case 'checkout':
          return <CheckoutPage onNavigate={handleTabChange} />;
        case 'orders':
          return <OrdersPage onNavigate={handleTabChange} />;
        case 'data-analysis':
          return <DataAnalysis onNavigate={handleTabChange} />;
        case 'accommodation':
          return <Accommodation />;
        case 'news':
          return <News />;
        case 'profile':
          return <Profile />;
        case 'wallet':
          return <WalletDashboard userId={user.id} userEmail={user.email} />;
        case 'billing':
          return <BillingDashboard 
            userEmail={user.email} 
            isPremium={user.isPremium} 
            onUpgrade={() => updateUser({ isPremium: true })} 
          />;
        default:
          return <Dashboard />;
      }
    } catch (error) {
      console.error('Content rendering error:', error);
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Content Error</h3>
            <p className="text-gray-600 mb-4">Failed to load this section</p>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      );
    }
  };

  try {
    return (
      <ErrorBoundary>
        <div className="min-h-screen futuristic-app">
          {/* Verification Banner */}
          {user && !user.isVerified && <VerificationBanner />}
          
          {/* Mobile Header */}
          <div className="lg:hidden">
            <MobileHeader 
              title="CampusLink"
              onMenuClick={() => setShowMobileMenu(true)}
              onNotificationClick={() => handleTabChange('messages')}
              onSearchClick={() => handleTabChange(user?.userType === 'student' ? 'marketplace' : 'messages')}
              onCartClick={() => handleTabChange('cart')}
              notificationCount={3}
            />
          </div>

          <div className="flex h-screen pt-16 lg:pt-0">
            {/* Desktop Sidebar */}
            <div className="hidden lg:flex lg:flex-shrink-0">
              <Sidebar 
                activeTab={activeTab}
                onTabChange={handleTabChange}
                onLogout={handleLogout}
              />
            </div>

            {/* Mobile Sidebar Overlay */}
            {showMobileMenu && (
              <div className="lg:hidden fixed inset-0 z-50 flex">
                <div
                  className="fixed inset-0 bg-gray-600 bg-opacity-75"
                  onClick={() => setShowMobileMenu(false)}
                />
                <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
                  <Sidebar 
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                    onLogout={handleLogout}
                    isMobile={true}
                  />
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Desktop Header */}
              <div className="hidden lg:block">
                <Header 
                  onNotificationClick={() => handleTabChange('messages')}
                  onSearchClick={() => handleTabChange(user?.userType === 'student' ? 'marketplace' : 'messages')}
                  onCartClick={() => handleTabChange('cart')}
                  notificationCount={3}
                />
              </div>
              
              {/* Content Area */}
              <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">
                <div className="container mx-auto px-4 py-6 lg:py-8">
                  {renderContent()}
                </div>
              </main>
            </div>
          </div>

          {/* Mobile Bottom Navigation */}
          <div className="lg:hidden">
            <MobileBottomNav 
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </div>
        </div>
      </ErrorBoundary>
    );
  } catch (error) {
    handleRenderError(error as Error);
    return null;
  }
}

export default App;
