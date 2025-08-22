import React, { useState, useEffect } from 'react';
import { MapPin, TrendingUp, AlertTriangle, Clock, User, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
// If you want to use the map, uncomment these lines and ensure the dependencies/components exist:
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import LocationPicker, { Coords } from '../components/LocationPicker';
// import '../lib/leafletIcons';

interface Report {
  id: string;
  location: string;
  timestamp: string;
  status: 'pending' | 'verified' | 'resolved';
  priority: 'high' | 'medium' | 'low';
  violations: string[];
  reporter: string;
  reporterEmail: string;
  reporterPhone: string;
  description: string;
  photo?: string;
  // coords?: { lat: number; lng: number }; // Uncomment if using map
}

const initialReports: Report[] = [
  {
    id: '1',
    location: 'MG Road, Bangalore',
    timestamp: '2 hours ago',
    status: 'pending',
    priority: 'high',
    violations: ['Size violation', 'Missing permit'],
    reporter: 'Citizen A',
    reporterEmail: 'citizena@example.com',
    reporterPhone: '123-456-7890',
    description: 'Large billboard without proper permits blocking traffic view',
    photo: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: '2',
    location: 'CP, Delhi',
    timestamp: '5 hours ago',
    status: 'verified',
    priority: 'medium',
    violations: ['Proximity to junction'],
    reporter: 'Citizen B',
    reporterEmail: 'citizenb@example.com',
    reporterPhone: '234-567-8901',
    description: 'Unauthorized digital billboard displaying inappropriate content',
    photo: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: '3',
    location: 'Marine Drive, Mumbai',
    timestamp: '1 day ago',
    status: 'resolved',
    priority: 'low',
    violations: ['Content violation'],
    reporter: 'Citizen C',
    reporterEmail: 'citizenc@example.com',
    reporterPhone: '345-678-9012',
    description: 'Old billboard structure appears to be safety hazard',
    photo: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80'
  }
];

// Normalize user reports from localStorage to match the Report interface
function getUserReports(): Report[] {
  try {
    const data = localStorage.getItem('user-reports');
    if (!data) return [];
    return JSON.parse(data).map((r: any) => ({
      id: r.id || Date.now().toString(),
      location: r.location || 'Unknown',
      timestamp: r.timestamp || new Date().toLocaleString(),
      status: (r.status === 'pending' || r.status === 'verified' || r.status === 'resolved') ? r.status : 'pending',
      priority: (r.priority === 'high' || r.priority === 'medium' || r.priority === 'low') ? r.priority : 'medium',
      violations: Array.isArray(r.violations) ? r.violations : (r.violations ? [r.violations] : []),
      reporter: r.reporter || r.fullName || 'Anonymous',
      reporterEmail: r.reporterEmail || r.email || '',
      reporterPhone: r.reporterPhone || r.phone || '',
      description: r.description || (Array.isArray(r.violations) && r.violations.length > 0 ? r.violations[0] : ''),
      photo: r.photo || r.image || undefined,
      // coords: r.coords, // Uncomment if using map
    }));
  } catch {
    return [];
  }
}

function saveUserReport(report: Report) {
  const reports = getUserReports();
  reports.unshift(report);
  localStorage.setItem('user-reports', JSON.stringify(reports));
}

const Dashboard: React.FC = () => {
  const { theme } = useTheme();
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified' | 'resolved'>('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [reports, setReports] = useState<Report[]>([]);

  // On mount, load reports from localStorage and merge with static
  useEffect(() => {
    const userReports = getUserReports();
    setReports([...userReports, ...initialReports]);
  }, []);

  // When a new report is submitted, add to state and localStorage
  const handleReportSubmit = (report: any) => {
    // Normalize the incoming report in case it's from Detection.tsx
    const normalized: Report = {
      id: report.id || Date.now().toString(),
      location: report.location || 'Unknown',
      timestamp: report.timestamp || new Date().toLocaleString(),
      status: (report.status === 'pending' || report.status === 'verified' || report.status === 'resolved') ? report.status : 'pending',
      priority: (report.priority === 'high' || report.priority === 'medium' || report.priority === 'low') ? report.priority : 'medium',
      violations: Array.isArray(report.violations) ? report.violations : (report.violations ? [report.violations] : []),
      reporter: report.reporter || report.fullName || 'Anonymous',
      reporterEmail: report.reporterEmail || report.email || '',
      reporterPhone: report.reporterPhone || report.phone || '',
      description: report.description || (Array.isArray(report.violations) && report.violations.length > 0 ? report.violations[0] : ''),
      photo: report.photo || report.image || undefined,
      // coords: report.coords, // Uncomment if using map
    };
    saveUserReport(normalized);
    setReports([normalized, ...reports]);
  };

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
            <p className="text-2xl font-bold">{reports.length}</p>
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
            <p className="text-2xl font-bold">{reports.filter(r => r.status === 'pending').length}</p>
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
            <p className="text-2xl font-bold">{reports.filter(r => r.status === 'verified').length}</p>
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
            <p className="text-2xl font-bold">{reports.filter(r => r.status === 'resolved').length}</p>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Successfully resolved
            </p>
          </div>
        </div>

        {/* Heatmap Placeholder (no map) */}
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
              <button
                className="mt-3 text-blue-600 font-semibold hover:underline flex items-center gap-1"
                onClick={() => setSelectedReport(report)}
              >
                <span>👁️</span> View Details
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Report Details */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className={`rounded-2xl shadow-2xl max-w-lg w-full p-6 relative transition-colors
            ${theme === 'dark' ? 'bg-gray-900 text-gray-100 border border-gray-700' : 'bg-white text-gray-900 border border-gray-200'}`}>
            <button
              className={`absolute top-4 right-4 transition-colors ${
                theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-700'
              }`}
              onClick={() => setSelectedReport(null)}
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-xl font-bold mb-4 border-b pb-2">Report Details</h3>
            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="font-semibold mb-1">Reporter</div>
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4" />
                  <span>{selectedReport.reporter}</span>
                </div>
                <div className="mt-3">
                  <div className="font-semibold mb-1">Location</div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedReport.location}</span>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="font-semibold mb-1">Priority</div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedReport.priority === 'high'
                      ? 'bg-red-500/20 text-red-600'
                      : selectedReport.priority === 'medium'
                        ? 'bg-yellow-500/20 text-yellow-600'
                        : 'bg-green-500/20 text-green-600'
                  }`}>
                    {selectedReport.priority.charAt(0).toUpperCase() + selectedReport.priority.slice(1)}
                  </span>
                </div>
                <div className="mt-3">
                  <div className="font-semibold mb-1">Status</div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedReport.status)}`}>
                    {selectedReport.status.charAt(0).toUpperCase() + selectedReport.status.slice(1)}
                  </span>
                </div>
                <div className="mt-3">
                  <div className="font-semibold mb-1">Timeline</div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>Reported: {selectedReport.timestamp}</span>
                  </div>
                </div>
              </div>
              <div>
                {/* Captured By section */}
                {selectedReport.photo && (
                  <div>
                    <div className="font-semibold mb-1">Captured By</div>
                    <div className="flex items-center gap-2 text-sm mb-2">
                      <User className="w-4 h-4" />
                      <span>{selectedReport.reporter}</span>
                    </div>
                    <div className="font-semibold mb-1">Billboard Photo</div>
                    <img
                      src={selectedReport.photo}
                      alt="Billboard"
                      className={`w-full h-40 object-cover rounded-lg border ${
                        theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
                      }`}
                    />
                  </div>
                )}
                <div className="mt-3">
                  <div className="font-semibold mb-1">Violations</div>
                  <ul className="text-sm list-disc list-inside">
                    {selectedReport.violations.map((v, i) => (
                      <li key={i}>{v}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-3">
                  <div className="font-semibold mb-1">Description</div>
                  <div className="text-sm">{selectedReport.description}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;