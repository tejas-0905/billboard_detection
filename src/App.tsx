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

type Tab = "home" | "detect" | "dashboard" | "profile" | "admin" | "map"; 
type DetectionMode = "upload" | "camera";

function AppContent() {
  const { user } = useAuth();   // ✅ removed logout usage
  const [activeTab, setActiveTab] = React.useState<Tab>("home");
  const [showPrivacyNotice, setShowPrivacyNotice] = React.useState(false);
  const [detectionMode] = React.useState<DetectionMode>("upload"); // ✅ fixed default mode
  const { theme } = useTheme();

  React.useEffect(() => {
    const hasAcceptedPrivacy = localStorage.getItem("billboard-app-privacy-accepted");
    if (!hasAcceptedPrivacy) {
      setShowPrivacyNotice(true);
    }
  }, []);

  const handlePrivacyAccept = () => {
    localStorage.setItem("billboard-app-privacy-accepted", "true");
    setShowPrivacyNotice(false);
  };

  const handleStartDetection = () => {
    setActiveTab("detect");
  };

  const isDark = theme === "dark";

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark
          ? "bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 text-white"
          : "bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-gray-900"
      }`}
    >
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="pb-20">
        {activeTab === "home" && <Hero onStartDetection={handleStartDetection} />}
        
        {activeTab === "detect" && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* ✅ Only show Detection (removed buttons & extra UI) */}
            {detectionMode === "upload" ? <Detection /> : <CameraDetection />}
          </div>
        )}

        {activeTab === "dashboard" && <Dashboard />}
        {activeTab === "profile" && <Profile />}
        {activeTab === "admin" && <AdminPanel />}
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
