import React, { useState } from 'react';
import { Camera, Home, BarChart3, User, Shield, Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: 'home' | 'detect' | 'dashboard' | 'profile' | 'admin') => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const navButton = (
    label: string,
    icon: React.ReactNode,
    tab: 'home' | 'detect' | 'dashboard' | 'profile' | 'admin',
    activeColor: string
  ) => (
    <button
      onClick={() => {
        setActiveTab(tab);
        setMenuOpen(false); // close menu on mobile
      }}
      className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors w-full sm:w-auto ${
        activeTab === tab
          ? theme === 'dark'
            ? `${activeColor} text-white`
            : `${activeColor} text-white`
          : theme === 'dark'
          ? 'text-gray-400 hover:text-white'
          : 'text-gray-600 hover:text-gray-900'
      }`}
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </button>
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-gray-900/80 border-gray-700'
          : 'bg-white/80 border-gray-200'
      }`}
    >
      <div className="px-4 py-3">
        <div className="flex items-center justify-between w-full">
          {/* Logo */}
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

          {/* Desktop Nav */}
          <nav className="hidden sm:flex items-center gap-x-6">
            {navButton('Home', <Home className="w-5 h-5" />, 'home', 'bg-blue-500')}
            {navButton('Detect', <Camera className="w-5 h-5" />, 'detect', 'bg-orange-500')}
            {navButton('Dashboard', <BarChart3 className="w-5 h-5" />, 'dashboard', 'bg-green-500')}
            {navButton('Profile', <User className="w-5 h-5" />, 'profile', 'bg-purple-500')}
            {user?.role === 'admin' &&
              navButton('Admin', <Shield className="w-5 h-5" />, 'admin', 'bg-red-500')}
          </nav>

          {/* Theme Toggle & Hamburger */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors flex items-center justify-center ${
                theme === 'dark'
                  ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="sm:hidden p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="sm:hidden mt-3 flex flex-col gap-2">
            {navButton('Home', <Home className="w-5 h-5" />, 'home', 'bg-blue-500')}
            {navButton('Detect', <Camera className="w-5 h-5" />, 'detect', 'bg-orange-500')}
            {navButton('Dashboard', <BarChart3 className="w-5 h-5" />, 'dashboard', 'bg-green-500')}
            {navButton('Profile', <User className="w-5 h-5" />, 'profile', 'bg-purple-500')}
            {user?.role === 'admin' &&
              navButton('Admin', <Shield className="w-5 h-5" />, 'admin', 'bg-red-500')}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
