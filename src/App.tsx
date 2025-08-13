import React from "react";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { LocationProvider } from "./contexts/LocationContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import AuthScreen from "./components/AuthScreen";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Detection from "./components/Detection";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import AdminPanel from "./components/AdminPanel";
import PrivacyNotice from "./components/PrivacyNotice";
import CameraDetection from "./components/CameraDetection";

type Tab = 'home' | 'detect' | 'dashboard' | 'profile' | 'admin';
type DetectionMode = 'upload' | 'camera';

function AppContent() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = React.useState<Tab>('home');
  const [showPrivacyNotice, setShowPrivacyNotice] = React.useState(false);
  const [detectionMode, setDetectionMode] = React.useState<DetectionMode>('upload');
  const { theme } = useTheme();

  React.useEffect(() => {
    const hasAcceptedPrivacy = localStorage.getItem('billboard-app-privacy-accepted');
    if (!hasAcceptedPrivacy) {
      setShowPrivacyNotice(true);
    }
  }, []);

  const handlePrivacyAccept = () => {
    localStorage.setItem('billboard-app-privacy-accepted', 'true');
    setShowPrivacyNotice(false);
  };

  const handleStartDetection = (mode?: DetectionMode) => {
    if (mode) setDetectionMode(mode);
    setActiveTab('detect');
  };

  const isDark = theme === 'dark';

  if (!user) {
    return <AuthScreen />;
  }

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
          <>
            <div
              className={`sticky top-0 z-20 mb-4 rounded-2xl px-2 py-2 sm:px-4 sm:py-3 backdrop-blur mx-auto max-w-6xl
                ${isDark
                  ? 'bg-white/5 border border-white/10'
                  : 'bg-white/70 border border-black/10 shadow-sm'
                }`}
              style={{ left: 0, right: 0 }}
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
                {detectionMode === 'camera' && (
                  <span className="ml-auto text-xs sm:text-sm opacity-70">
                    (Live camera mode active)
                  </span>
                )}
                <button
                  onClick={logout}
                  className="ml-4 px-3 py-1 rounded bg-red-500 text-white text-xs"
                >
                  Logout
                </button>
              </div>
            </div>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              {detectionMode === 'upload' ? (
                <Detection />
              ) : (
                <CameraDetection />
              )}
            </div>
          </>
        )}
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