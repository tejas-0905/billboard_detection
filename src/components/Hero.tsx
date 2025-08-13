import React from 'react';
import { Camera, MapPin, AlertTriangle, Users, TrendingUp, Award } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

interface HeroProps {
  onStartDetection: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStartDetection }) => {
  const { theme } = useTheme();
  const { user } = useAuth();

  const stats = [
    { icon: AlertTriangle, label: 'Total Reports', value: '1,247', color: 'text-red-500' },
    { icon: Users, label: 'Active Citizens', value: '3,842', color: 'text-blue-500' },
    { icon: TrendingUp, label: 'Resolved Cases', value: '892', color: 'text-green-500' },
    { icon: Award, label: 'Your Points', value: user?.points || 0, color: 'text-orange-500' }
  ];

  return (
    <div className="pt-32 pb-8 px-4">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Protect Your City
        </h1>
        <p className={`text-lg mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          AI-powered detection of unauthorized billboards. Help keep urban landscapes clean and compliant.
        </p>
        
        <button
          onClick={onStartDetection}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center mx-auto space-x-2"
        >
          <Camera className="w-6 h-6" />
          <span>Start Detection</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`p-4 rounded-xl backdrop-blur-sm border transition-all duration-300 hover:scale-105 ${
              theme === 'dark' 
                ? 'bg-gray-800/50 border-gray-700' 
                : 'bg-white/50 border-gray-200'
            }`}
          >
            <div className="flex items-center space-x-3">
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {stat.label}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className={`p-6 rounded-xl backdrop-blur-sm border ${
        theme === 'dark' 
          ? 'bg-gray-800/50 border-gray-700' 
          : 'bg-white/50 border-gray-200'
      }`}>
        <h2 className="text-xl font-semibold mb-4">How It Works</h2>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-4">
            <div className="bg-blue-500 text-white rounded-full p-2 flex-shrink-0">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold">Capture & Detect</h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Use your camera to capture billboard images. Our AI analyzes compliance instantly.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="bg-green-500 text-white rounded-full p-2 flex-shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold">Automatic Geotagging</h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Location and timestamp are automatically captured for accurate reporting.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="bg-orange-500 text-white rounded-full p-2 flex-shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold">Instant Flagging</h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Violations are flagged immediately with detailed compliance reports.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;