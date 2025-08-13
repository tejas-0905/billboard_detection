import React, { useState } from 'react';
import { MapPin, TrendingUp, AlertTriangle, Clock, Filter } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface Report {
  id: string;
  location: string;
  timestamp: string;
  status: 'pending' | 'verified' | 'resolved';
  violations: string[];
  reporter: string;
}

const Dashboard: React.FC = () => {
  const { theme } = useTheme();
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified' | 'resolved'>('all');

  const reports: Report[] = [
    {
      id: '1',
      location: 'MG Road, Bangalore',
      timestamp: '2 hours ago',
      status: 'pending',
      violations: ['Size violation', 'Missing permit'],
      reporter: 'Citizen A'
    },
    {
      id: '2',
      location: 'CP, Delhi',
      timestamp: '5 hours ago',
      status: 'verified',
      violations: ['Proximity to junction'],
      reporter: 'Citizen B'
    },
    {
      id: '3',
      location: 'Marine Drive, Mumbai',
      timestamp: '1 day ago',
      status: 'resolved',
      violations: ['Content violation'],
      reporter: 'Citizen C'
    }
  ];

  const filteredReports = filter === 'all' ? reports : reports.filter(r => r.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'verified': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="pt-32 pb-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Public Dashboard</h2>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className={`p-4 rounded-xl backdrop-blur-sm border ${
            theme === 'dark' 
              ? 'bg-gray-800/50 border-gray-700' 
              : 'bg-white/50 border-gray-200'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <span className="font-medium">Total Reports</span>
            </div>
            <p className="text-2xl font-bold">1,247</p>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              +15% from last month
            </p>
          </div>

          <div className={`p-4 rounded-xl backdrop-blur-sm border ${
            theme === 'dark' 
              ? 'bg-gray-800/50 border-gray-700' 
              : 'bg-white/50 border-gray-200'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-5 h-5 text-yellow-500" />
              <span className="font-medium">Pending</span>
            </div>
            <p className="text-2xl font-bold">234</p>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Awaiting review
            </p>
          </div>

          <div className={`p-4 rounded-xl backdrop-blur-sm border ${
            theme === 'dark' 
              ? 'bg-gray-800/50 border-gray-700' 
              : 'bg-white/50 border-gray-200'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              <span className="font-medium">Verified</span>
            </div>
            <p className="text-2xl font-bold">321</p>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Under action
            </p>
          </div>

          <div className={`p-4 rounded-xl backdrop-blur-sm border ${
            theme === 'dark' 
              ? 'bg-gray-800/50 border-gray-700' 
              : 'bg-white/50 border-gray-200'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="font-medium">Resolved</span>
            </div>
            <p className="text-2xl font-bold">692</p>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Successfully resolved
            </p>
          </div>
        </div>

        {/* Heatmap Placeholder */}
        <div className={`p-6 rounded-xl backdrop-blur-sm border mb-6 ${
          theme === 'dark' 
            ? 'bg-gray-800/50 border-gray-700' 
            : 'bg-white/50 border-gray-200'
        }`}>
          <h3 className="text-lg font-semibold mb-4">Violation Heatmap</h3>
          <div className={`h-48 rounded-lg flex items-center justify-center ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
          }`}>
            <MapPin className="w-12 h-12 text-gray-500" />
            <span className={`ml-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Interactive map coming soon
            </span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2 mb-6 overflow-x-auto">
          {['all', 'pending', 'verified', 'resolved'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                filter === status
                  ? 'bg-blue-500 text-white'
                  : theme === 'dark'
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className={`p-4 rounded-xl backdrop-blur-sm border ${
                theme === 'dark' 
                  ? 'bg-gray-800/50 border-gray-700' 
                  : 'bg-white/50 border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium">{report.location}</h4>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Reported by {report.reporter} • {report.timestamp}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                  {report.status}
                </span>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium">Violations:</p>
                <ul className={`text-sm space-y-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {report.violations.map((violation, index) => (
                    <li key={index}>• {violation}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;