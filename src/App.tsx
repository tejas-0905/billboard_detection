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
import CameraDetection from './components/CameraDetection'; // NEW: live camera component

type Tab = 'home' | 'detect' | 'dashboard' | 'profile' | 'admin';
type DetectionMode = 'upload' | 'camera';

function AppContent() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [showPrivacyNotice, setShowPrivacyNotice] = useState(false);
  const [detectionMode, setDetectionMode] = useState<DetectionMode>('upload'); // NEW
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

  // Small helper: when user starts detection from Hero, drop into Detect tab (defaults to last-used mode)
  const handleStartDetection = (mode?: DetectionMode) => {
    if (mode) setDetectionMode(mode);
    setActiveTab('detect');
  };

  const isDark = theme === 'dark';

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark
          ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 text-white'
          : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-gray-900'
      }`}
    >
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="pb-20">
        {activeTab === 'home' && <Hero onStartDetection={() => handleStartDetection()} />}

        {activeTab === 'detect' && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Toggle bar for Upload vs Live Camera */}
            <div
              className={`sticky top-0 z-20 mb-4 rounded-2xl px-2 py-2 sm:px-4 sm:py-3 backdrop-blur ${
                isDark
                  ? 'bg-white/5 border border-white/10'
                  : 'bg-white/70 border border-black/10 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-sm sm:text-base font-medium opacity-80">Mode:</span>
                <div className="inline-flex rounded-xl overflow-hidden border border-current/10">
                  <button
                    onClick={() => setDetectionMode('upload')}
                    className={`px-3 sm:px-4 py-2 text-sm sm:text-base transition ${
                      detectionMode === 'upload'
                        ? isDark
                          ? 'bg-white/10'
                          : 'bg-black/5'
                        : 'opacity-70 hover:opacity-90'
                    }`}
                  >
                    Upload
                  </button>
                  <button
                    onClick={() => setDetectionMode('camera')}
                    className={`px-3 sm:px-4 py-2 text-sm sm:text-base transition ${
                      detectionMode === 'camera'
                        ? isDark
                          ? 'bg-white/10'
                          : 'bg-black/5'
                        : 'opacity-70 hover:opacity-90'
                    }`}
                  >
                    Live Camera
                  </button>
                </div>

                {/* Quick tips / permissions hint */}
                {detectionMode === 'camera' && (
                  <span className="ml-auto text-xs sm:text-sm opacity-70">
                    Grant camera permission • Best in Chrome/Edge • Uses device back camera on mobile
                  </span>
                )}
              </div>
            </div>

            {/* Render the selected detection experience */}
            {detectionMode === 'upload' ? <Detection /> : <CameraDetection />}
          </div>
        )}

        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'profile' && <Profile />}
        {activeTab === 'admin' && <AdminPanel />}
      </main>

      {showPrivacyNotice && (
        <PrivacyNotice onAccept={handlePrivacyAccept} onDecline={() => setShowPrivacyNotice(false)} />
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
