import React from 'react';
import { Camera, Home, BarChart3, User, Shield, Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: 'home' | 'detect' | 'dashboard' | 'profile' | 'admin') => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-gray-900/80 border-gray-700'
          : 'bg-white/80 border-gray-200'
      }`}
    >
      <div className="px-4 py-3">
        {/* Top bar with logo, nav, and theme toggle all in one row */}
        <div className="flex items-center justify-between w-full">
          {/* Logo Section */}
          <div className="flex items-center space-x-2">
            <div
              className={`p-2 rounded-full ${
                theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'
              }`}
            >
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none">BillboardGuard</h1>
              <p
                className={`text-xs ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                } leading-none`}
              >
                Protecting Urban Landscapes
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-x-6">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'home'
                  ? theme === 'dark'
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-500 text-white'
                  : theme === 'dark'
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-xs font-medium">Home</span>
            </button>

            <button
              onClick={() => setActiveTab('detect')}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'detect'
                  ? theme === 'dark'
                    ? 'bg-orange-600 text-white'
                    : 'bg-orange-500 text-white'
                  : theme === 'dark'
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Camera className="w-5 h-5" />
              <span className="text-xs font-medium">Detect</span>
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'dashboard'
                  ? theme === 'dark'
                    ? 'bg-green-600 text-white'
                    : 'bg-green-500 text-white'
                  : theme === 'dark'
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span className="text-xs font-medium">Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'profile'
                  ? theme === 'dark'
                    ? 'bg-purple-600 text-white'
                    : 'bg-purple-500 text-white'
                  : theme === 'dark'
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-xs font-medium">Profile</span>
            </button>

            {user?.role === 'admin' && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === 'admin'
                    ? theme === 'dark'
                      ? 'bg-red-600 text-white'
                      : 'bg-red-500 text-white'
                    : theme === 'dark'
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Shield className="w-5 h-5" />
                <span className="text-xs font-medium">Admin</span>
              </button>
            )}
          </nav>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-colors flex items-center justify-center ${
              theme === 'dark'
                ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
