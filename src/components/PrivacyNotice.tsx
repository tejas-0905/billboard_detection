import React from 'react';
import { Shield, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface PrivacyNoticeProps {
  onAccept: () => void;
  onDecline: () => void;
}

const PrivacyNotice: React.FC<PrivacyNoticeProps> = ({ onAccept, onDecline }) => {
  const { theme } = useTheme();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`max-w-md w-full rounded-xl p-6 ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6 text-blue-500" />
            <h3 className="text-lg font-semibold">Privacy Notice</h3>
          </div>
          <button
            onClick={onDecline}
            className={`p-1 rounded-full hover:bg-gray-100 ${
              theme === 'dark' ? 'hover:bg-gray-700' : ''
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className={`space-y-4 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          <p>
            <strong>Data Collection:</strong> We collect images, location data, and timestamps when you report billboards. This data is used solely for enforcement purposes.
          </p>
          
          <p>
            <strong>Privacy Protection:</strong> We implement facial blurring and anonymization techniques to protect individual privacy in submitted images.
          </p>
          
          <p>
            <strong>Data Sharing:</strong> Your reports may be shared with relevant municipal authorities for enforcement actions. Personal information is kept confidential.
          </p>
          
          <p>
            <strong>Data Security:</strong> All data is encrypted and stored securely. We follow industry-standard security practices to protect your information.
          </p>
          
          <p>
            <strong>Your Rights:</strong> You can request deletion of your data at any time by contacting our support team.
          </p>
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={onAccept}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold transition-colors"
          >
            Accept & Continue
          </button>
          <button
            onClick={onDecline}
            className={`flex-1 py-3 rounded-xl font-semibold border transition-colors ${
              theme === 'dark'
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyNotice;