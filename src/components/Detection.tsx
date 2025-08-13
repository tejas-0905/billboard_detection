import React, { useState, useRef, useCallback } from 'react';
import { Camera, Upload, MapPin, Clock, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLocation } from '../contexts/LocationContext';
import CameraDetection from './CameraDetection';

interface DetectionResult {
  violations: string[];
  confidence: number;
  billboardSize: { width: number; height: number };
  isAuthorized: boolean;
  permitNumber?: string;
}

type Mode = 'upload' | 'live';

const Detection: React.FC = () => {
  const { theme } = useTheme();
  const { location } = useLocation();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<Mode>('upload');
  const [capturedFrame, setCapturedFrame] = useState<string | null>(null);

  // For CameraDetection
  const cameraRef = useRef<any>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        analyzeImage();
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = () => {
    setIsAnalyzing(true);
    setDetectionResult(null);

    // Simulate AI analysis
    setTimeout(() => {
      const mockResult: DetectionResult = {
        violations: [
          'Billboard size exceeds 40 sq ft limit',
          'Missing QR code with permit details',
          'Located within 100m of traffic junction'
        ],
        confidence: 72,
        billboardSize: { width: 12, height: 8 },
        isAuthorized: false
      };
      setDetectionResult(mockResult);
      setIsAnalyzing(false);
    }, 3000);
  };

  // Capture current frame from CameraDetection
  const handleCaptureFrame = useCallback(() => {
    if (cameraRef.current) {
      const video = cameraRef.current.video;
      if (video) {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = canvas.toDataURL('image/jpeg');
          setCapturedFrame(imageData);
          setSelectedImage(imageData);
          analyzeImage();
        }
      }
    }
  }, [cameraRef]);

  const submitReport = () => {
    const reportData = {
      image: selectedImage,
      location: location ? {
        lat: location.coords.latitude,
        lng: location.coords.longitude
      } : null,
      timestamp: new Date().toISOString(),
      violations: detectionResult?.violations,
      confidence: detectionResult?.confidence
    };

    // Simulate report submission
    alert('Report submitted successfully! You earned 10 points.');
    setSelectedImage(null);
    setDetectionResult(null);
    setCapturedFrame(null);
  };

  return (
    <div className="pt-32 pb-8 px-4">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Billboard Detection</h2>

        {/* Mode Switch */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setMode('upload')}
            className={`px-4 py-2 rounded-l-xl font-semibold border transition-colors ${
              mode === 'upload'
                ? 'bg-blue-500 text-white'
                : theme === 'dark'
                  ? 'bg-gray-800 text-gray-300 border-gray-700'
                  : 'bg-gray-100 text-gray-700 border-gray-300'
            }`}
          >
            Upload
          </button>
          <button
            onClick={() => setMode('live')}
            className={`px-4 py-2 rounded-r-xl font-semibold border transition-colors ${
              mode === 'live'
                ? 'bg-blue-500 text-white'
                : theme === 'dark'
                  ? 'bg-gray-800 text-gray-300 border-gray-700'
                  : 'bg-gray-100 text-gray-700 border-gray-300'
            }`}
          >
            Live Camera
          </button>
        </div>

        {/* Upload Mode */}
        {mode === 'upload' && !selectedImage && (
          <div className="space-y-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 border-2 border-dashed transition-colors ${
                theme === 'dark'
                  ? 'border-gray-600 hover:border-gray-500 text-gray-300'
                  : 'border-gray-300 hover:border-gray-400 text-gray-600'
              }`}
            >
              <Upload className="w-6 h-6" />
              <span>Upload Image</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        )}

        {/* Live Camera Mode */}
        {mode === 'live' && (
          <div className="space-y-4">
            <div className="relative rounded-xl overflow-hidden">
              <CameraDetection ref={cameraRef} />
              <div className="absolute inset-0 flex items-end justify-center pb-4 pointer-events-none" />
            </div>
            <button
              onClick={handleCaptureFrame}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-colors"
            >
              <Camera className="w-6 h-6" />
              <span>Capture & Analyze</span>
            </button>
            {capturedFrame && (
              <div className="mt-4">
                <img
                  src={capturedFrame}
                  alt="Captured frame"
                  className="w-full h-64 object-cover rounded-xl"
                />
              </div>
            )}
          </div>
        )}

        {/* Show selected image and analysis */}
        {selectedImage && (
          <div className="space-y-4">
            <div className="relative">
              <img
                src={selectedImage}
                alt="Captured billboard"
                className="w-full h-64 object-cover rounded-xl"
              />
              {!isAnalyzing && !detectionResult && (
                <button
                  onClick={() => {
                    setSelectedImage(null);
                    setCapturedFrame(null);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {isAnalyzing && (
              <div className={`p-6 rounded-xl backdrop-blur-sm border ${
                theme === 'dark' 
                  ? 'bg-gray-800/50 border-gray-700' 
                  : 'bg-white/50 border-gray-200'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  <span>Analyzing billboard for violations...</span>
                </div>
              </div>
            )}

            {detectionResult && (
              <div className={`p-6 rounded-xl backdrop-blur-sm border ${
                theme === 'dark' 
                  ? 'bg-gray-800/50 border-gray-700' 
                  : 'bg-white/50 border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">Analysis Results</h3>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    detectionResult.isAuthorized
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {detectionResult.isAuthorized ? 'Authorized' : 'Unauthorized'}
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">
                      {location ? 
                        `${location.coords.latitude.toFixed(6)}, ${location.coords.longitude.toFixed(6)}` : 
                        'Location unavailable'
                      }
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-green-500" />
                    <span className="text-sm">{new Date().toLocaleString()}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-purple-500" />
                    <span className="text-sm">Confidence: {detectionResult.confidence}%</span>
                  </div>
                </div>

                {detectionResult.violations.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium mb-2 flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      <span>Violations Detected:</span>
                    </h4>
                    <ul className="space-y-1">
                      {detectionResult.violations.map((violation, index) => (
                        <li key={index} className={`text-sm ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          • {violation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex space-x-3">
                  <button
                    onClick={submitReport}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition-colors"
                  >
                    Submit Report
                  </button>
                  <button
                    onClick={() => {
                      setSelectedImage(null);
                      setDetectionResult(null);
                      setCapturedFrame(null);
                    }}
                    className={`px-6 py-3 rounded-xl font-semibold border transition-colors ${
                      theme === 'dark'
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-800'
                        : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Detection;