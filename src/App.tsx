import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { LocationProvider } from './contexts/LocationContext';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Detection from './components/Detection';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import AdminPanel from './components/AdminPanel';
import PrivacyNotice from './components/PrivacyNotice';

type Tab = 'home' | 'detect' | 'dashboard' | 'profile' | 'admin';

function AppContent() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [showPrivacyNotice, setShowPrivacyNotice] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    // Check if user has accepted privacy notice
    const hasAcceptedPrivacy = localStorage.getItem('billboard-app-privacy-accepted');
    if (!hasAcceptedPrivacy) {
      setShowPrivacyNotice(true);
    }
  }, []);

  const handlePrivacyAccept = () => {
    localStorage.setItem('billboard-app-privacy-accepted', 'true');
    setShowPrivacyNotice(false);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 text-white' 
        : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-gray-900'
    }`}>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="pb-20">
        {activeTab === 'home' && <Hero onStartDetection={() => setActiveTab('detect')} />}
        {activeTab === 'detect' && <Detection />}
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'profile' && <Profile />}
        {activeTab === 'admin' && <AdminPanel />}
      </main>

      {showPrivacyNotice && (
        <PrivacyNotice 
          onAccept={handlePrivacyAccept}
          onDecline={() => setShowPrivacyNotice(false)}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LocationProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LocationProvider>
    </ThemeProvider>
  );
}

export default App;