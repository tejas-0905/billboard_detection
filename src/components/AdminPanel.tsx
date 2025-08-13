import React, { useState } from 'react';
import { Shield, CheckCircle, XCircle, Eye, MapPin, Clock } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface PendingReport {
  id: string;
  image: string;
  location: { lat: number; lng: number; address: string };
  timestamp: string;
  reporter: string;
  violations: string[];
  confidence: number;
  status: 'pending' | 'approved' | 'rejected';
}

const AdminPanel: React.FC = () => {
  const { theme } = useTheme();
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  const pendingReports: PendingReport[] = [
    {
      id: '1',
      image: 'https://images.pexels.com/photos/1666816/pexels-photo-1666816.jpeg',
      location: { 
        lat: 12.9716, 
        lng: 77.5946, 
        address: 'MG Road, Bangalore, Karnataka' 
      },
      timestamp: '2024-01-15T10:30:00Z',
      reporter: 'citizen@example.com',
      violations: ['Size exceeds 40 sq ft limit', 'Missing QR code'],
      confidence: 72,
      status: 'pending'
    },
    {
      id: '2',
      image: 'https://images.pexels.com/photos/2422915/pexels-photo-2422915.jpeg',
      location: { 
        lat: 28.6139, 
        lng: 77.2090, 
        address: 'Connaught Place, New Delhi' 
      },
      timestamp: '2024-01-15T09:15:00Z',
      reporter: 'reporter@gmail.com',
      violations: ['Located within 100m of traffic junction'],
      confidence: 87,
      status: 'pending'
    }
  ];

  const [reports, setReports] = useState(pendingReports);

  const handleAction = (reportId: string, action: 'approved' | 'rejected') => {
    setReports(prev => 
      prev.map(report => 
        report.id === reportId ? { ...report, status: action } : report
      )
    );
    setSelectedReport(null);
  };

  const selectedReportData = reports.find(r => r.id === selectedReport);

  return (
    <div className="pt-32 pb-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-3 mb-6">
          <Shield className="w-8 h-8 text-red-500" />
          <h2 className="text-2xl font-bold">Authority Dashboard</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Reports List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Pending Reports</h3>
            {reports.filter(r => r.status === 'pending').map((report) => (
              <div
                key={report.id}
                className={`p-4 rounded-xl backdrop-blur-sm border cursor-pointer transition-all hover:scale-[1.02] ${
                  selectedReport === report.id
                    ? 'ring-2 ring-blue-500'
                    : ''
                } ${
                  theme === 'dark' 
                    ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800/70' 
                    : 'bg-white/50 border-gray-200 hover:bg-white/70'
                }`}
                onClick={() => setSelectedReport(report.id)}
              >
                <div className="flex items-start space-x-3">
                  <img
                    src={report.image}
                    alt="Reported billboard"
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{report.location.address}</p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Reported by {report.reporter}
                        </p>
                      </div>
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        {report.status}
                      </span>
                    </div>
                    
                    <div className="mt-2 flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span className="text-xs">
                          {new Date(report.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span className="text-xs">{report.confidence}% confidence</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Report Details */}
          <div className={`p-6 rounded-xl backdrop-blur-sm border ${
            theme === 'dark' 
              ? 'bg-gray-800/50 border-gray-700' 
              : 'bg-white/50 border-gray-200'
          }`}>
            {selectedReportData ? (
              <div>
                <h3 className="text-lg font-semibold mb-4">Report Details</h3>
                
                <div className="space-y-4">
                  <img
                    src={selectedReportData.image}
                    alt="Reported billboard"
                    className="w-full h-48 object-cover rounded-lg"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {selectedReportData.location.address}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Reporter</p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {selectedReportData.reporter}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Detected Violations</p>
                    <ul className={`text-sm space-y-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {selectedReportData.violations.map((violation, index) => (
                        <li key={index}>• {violation}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">
                      {selectedReportData.location.lat.toFixed(6)}, {selectedReportData.location.lng.toFixed(6)}
                    </span>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={() => handleAction(selectedReportData.id, 'approved')}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-colors"
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleAction(selectedReportData.id, 'rejected')}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-colors"
                    >
                      <XCircle className="w-5 h-5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <Eye className={`w-12 h-12 mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
                <p className={`text-lg font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  Select a Report
                </p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                  Click on a report from the list to view details and take action
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;