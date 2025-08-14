import React from 'react';
import { User, Award, TrendingUp, MapPin, Settings, LogOut } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const Profile: React.FC = () => {
  const { theme } = useTheme();
  const { user, logout } = useAuth();

  const achievements = [
    { icon: Award, title: 'First Reporter', desc: 'Submit your first report' },
    { icon: TrendingUp, title: 'Top Contributor', desc: 'Earn 100+ points' },
    { icon: MapPin, title: 'City Guardian', desc: 'Report from 5+ locations' }
  ];

  const recentActivity = [
    { action: 'Reported unauthorized billboard', location: 'MG Road', points: 10, time: '2h ago' },
    { action: 'Report verified by authority', location: 'Brigade Road', points: 5, time: '1d ago' },
    { action: 'Earned achievement badge', location: '', points: 25, time: '3d ago' }
  ];

  if (!user) {
    return (
      <div className="pt-32 pb-8 px-4">
        <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow text-center">
          <h2 className="text-xl font-bold mb-2">Profile</h2>
          <p className="text-gray-500">You are not logged in.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Profile Header */}
        <div className={`p-6 rounded-xl backdrop-blur-sm border mb-6 ${
          theme === 'dark' 
            ? 'bg-gray-800/50 border-gray-700' 
            : 'bg-white/50 border-gray-200'
        }`}>
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {user.email}
              </p>
              <p className="text-sm text-blue-500 font-medium capitalize">
                {user.role}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-500">{user.points}</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Points Earned
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-500">{user.reportsSubmitted}</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Reports Submitted
              </p>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className={`p-6 rounded-xl backdrop-blur-sm border mb-6 ${
          theme === 'dark' 
            ? 'bg-gray-800/50 border-gray-700' 
            : 'bg-white/50 border-gray-200'
        }`}>
          <h3 className="text-lg font-semibold mb-4">Achievements</h3>
          <div className="space-y-3">
            {achievements.map((achievement, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  index === 0 ? 'bg-yellow-100 text-yellow-600' :
                  index === 1 ? 'bg-green-100 text-green-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  <achievement.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">{achievement.title}</p>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {achievement.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className={`p-6 rounded-xl backdrop-blur-sm border mb-6 ${
          theme === 'dark' 
            ? 'bg-gray-800/50 border-gray-700' 
            : 'bg-white/50 border-gray-200'
        }`}>
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">+{activity.points}</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{activity.action}</p>
                  {activity.location && (
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {activity.location}
                    </p>
                  )}
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Settings & Logout */}
        <div className="space-y-3">
          <button className={`w-full flex items-center space-x-3 p-4 rounded-xl transition-colors ${
            theme === 'dark' 
              ? 'bg-gray-800/50 hover:bg-gray-700/50' 
              : 'bg-white/50 hover:bg-gray-50'
          }`}>
            <Settings className="w-5 h-5 text-blue-500" />
            <span>Settings & Privacy</span>
          </button>

          <button 
            onClick={logout}
            className={`w-full flex items-center space-x-3 p-4 rounded-xl transition-colors ${
              theme === 'dark' 
                ? 'bg-red-900/30 hover:bg-red-900/40 text-red-400' 
                : 'bg-red-50 hover:bg-red-100 text-red-600'
            }`}
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;