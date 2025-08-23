import React, { useState, useRef, useCallback } from 'react';
import { Camera, Upload, MapPin, Clock, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLocation } from '../contexts/LocationContext';
import { useAuth } from '../contexts/AuthContext';
import CameraDetection from './CameraDetection';

interface DetectionResult {
  violations: string[];
  confidence: number;
  billboardSize: { width: number; height: number };
  isAuthorized: boolean;
  permitNumber?: string;
}

interface UserReport {
  id: string;
  location: string;
  timestamp: string;
  status: string;
  priority: string;
  violations: string[];
  reporter: string;
  reporterEmail: string;
  reporterPhone: string;
  description: string;
  photo: string | null;
}

type Mode = 'upload' | 'live';

const VIOLATION_POOL = [
  'Billboard size exceeds 40 sq ft limit',
  'Missing QR code with permit details',
  'Located within 100m of traffic junction',
  'Unauthorized content displayed',
  'Billboard not registered with authority',
  'Obstructing traffic sign visibility'
];

function getRandomViolations() {
  // Randomly select 0-3 violations
  const count = Math.floor(Math.random() * 4);
  const shuffled = [...VIOLATION_POOL].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function getRandomConfidence() {
  // Random confidence between 60 and 99
  return Math.floor(Math.random() * 40) + 60;
}

const priorities = [
  { value: "high", label: "High - Urgent violation" },
  { value: "medium", label: "Medium - Standard violation" },
  { value: "low", label: "Low - Minor issue" }
];

function saveReportToStorage(report: UserReport) {
  const reports: UserReport[] = JSON.parse(localStorage.getItem("user-reports") || "[]");
  reports.unshift(report);
  localStorage.setItem("user-reports", JSON.stringify(reports));
}

const Detection: React.FC = () => {
  const { theme } = useTheme();
  const { location } = useLocation();
  const { user, addReport } = useAuth();
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

  // This function is used for both upload and camera
  const analyzeImage = () => {
    setIsAnalyzing(true);
    setDetectionResult(null);

    setTimeout(() => {
      const violations = getRandomViolations();
      const confidence = getRandomConfidence();
      const isAuthorized = violations.length === 0;
      const mockResult: DetectionResult = {
        violations,
        confidence,
        billboardSize: { width: Math.floor(Math.random() * 20) + 5, height: Math.floor(Math.random() * 10) + 5 },
        isAuthorized
      };
      setDetectionResult(mockResult);
      setIsAnalyzing(false);
    }, 2000);
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

  const submitReport = async () => {
    setReportLoading(true);
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

    await addReport(10);

    setSelectedImage(null);
    setDetectionResult(null);
    setCapturedFrame(null);

    setReportSuccess(true);
    setReportLoading(false);
    setTimeout(() => setReportSuccess(false), 3000);
  };

  const [form, setForm] = useState<UserReport>({
    id: "",
    location: "",
    timestamp: "",
    status: "pending",
    priority: "medium",
    violations: [],
    reporter: "",
    reporterEmail: "",
    reporterPhone: "",
    description: "",
    photo: null,
  });
  const [formSuccess, setFormSuccess] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false); // New state to control access to upload/camera
  const [reportSuccess, setReportSuccess] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setForm(f => ({ ...f, photo: ev.target?.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.reporter || !form.reporterEmail || !form.location || !form.description) {
      setFormSuccess(false);
      return;
    }
    const report: UserReport = {
      ...form,
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString(),
      status: "pending",
      violations: [form.description],
    };
    saveReportToStorage(report);
    setForm({
      id: "",
      location: "",
      timestamp: "",
      status: "pending",
      priority: "medium",
      violations: [],
      reporter: "",
      reporterEmail: "",
      reporterPhone: "",
      description: "",
      photo: null,
    });
    setFormSuccess(true);
    setReportSubmitted(true); // Allow access to upload/camera
    setTimeout(() => setFormSuccess(false), 2000);
  };

  return (
    <div className="pt-32 pb-8 px-4">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Billboard Detection</h2>

        {/* Success message */}
        {reportSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-green-100 text-green-800 font-medium text-center shadow">
            ✅ Report submitted successfully! You earned 10 points.
          </div>
        )}

        {/* Organized, modern loading overlay */}
        {reportLoading && (
          <div className="fixed inset-0 flex items-center justify-center z-50"
            style={{
              backgroundColor: theme === 'dark' ? 'rgba(30,41,59,0.85)' : 'rgba(255,255,255,0.85)'
            }}
          >
            <div className={`rounded-2xl shadow-2xl border px-8 py-8 flex flex-col items-center
              ${theme === 'dark' ? 'bg-blue-700 border-blue-900' : 'bg-white border-blue-200'}`}>
              <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mb-6"></div>
              <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>Submitting Report</h3>
              <p className={`text-sm text-center mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Your report is being processed.<br />Thank you for helping keep the city compliant!
              </p>
            </div>
          </div>
        )}

        {/* Report Form */}
        {!reportSubmitted && (
          <form
            onSubmit={handleFormSubmit}
            className={`rounded-xl shadow p-6 mb-8 max-w-2xl mx-auto transition-colors ${
              theme === 'dark'
                ? 'bg-gray-800/90 border border-gray-700'
                : 'bg-white border border-gray-200'
            }`}
          >
            <h2 className="text-xl font-bold mb-1">Report Unauthorized Billboard</h2>
            <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Help us maintain urban compliance by reporting unauthorized or problematic billboards in your area.
            </p>
            <div className="mb-4">
              <h3 className="font-semibold mb-2 flex items-center gap-2">Your Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name <span className="text-red-500">*</span></label>
                  <input
                    className={`w-full border rounded px-3 py-2 transition-colors ${
                      theme === 'dark'
                        ? 'bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-400'
                        : 'bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-400'
                    }`}
                    name="reporter"
                    value={form.reporter}
                    onChange={handleFormChange}
                    required
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number</label>
                  <input
                    className={`w-full border rounded px-3 py-2 transition-colors ${
                      theme === 'dark'
                        ? 'bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-400'
                        : 'bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-400'
                    }`}
                    name="reporterPhone"
                    value={form.reporterPhone}
                    onChange={handleFormChange}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
              <label className="block text-sm font-medium mb-1">Email Address <span className="text-red-500">*</span></label>
              <input
                className={`w-full border rounded px-3 py-2 mb-2 transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-400'
                    : 'bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-400'
                }`}
                name="reporterEmail"
                value={form.reporterEmail}
                onChange={handleFormChange}
                required
                placeholder="your.email@example.com"
              />
            </div>
            <div className="mb-4">
              <h3 className="font-semibold mb-2 flex items-center gap-2">Billboard Location</h3>
              <label className="block text-sm font-medium mb-1">Address or Location Description <span className="text-red-500">*</span></label>
              <input
                className={`w-full border rounded px-3 py-2 transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-400'
                    : 'bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-400'
                }`}
                name="location"
                value={form.location}
                onChange={handleFormChange}
                required
                placeholder="123 Main St, City, State or describe the location"
              />
            </div>
            <div className="mb-4">
              <h3 className="font-semibold mb-2 flex items-center gap-2">Report Details</h3>
              <label className="block text-sm font-medium mb-1">Priority Level</label>
              <select
                className={`w-full border rounded px-3 py-2 mb-2 transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-900 border-gray-700 text-gray-100'
                    : 'bg-gray-50 border-gray-300 text-gray-800'
                }`}
                name="priority"
                value={form.priority}
                onChange={handleFormChange}
              >
                {priorities.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
              <label className="block text-sm font-medium mb-1">Description of Issue <span className="text-red-500">*</span></label>
              <textarea
                className={`w-full border rounded px-3 py-2 mb-2 transition-colors min-h-[40px] ${
                  theme === 'dark'
                    ? 'bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-400'
                    : 'bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-400'
                }`}
                name="description"
                value={form.description}
                onChange={handleFormChange}
                required
                placeholder="Please describe the billboard issue in detail..."
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700"
            >
              Submit Report
            </button>
            {formSuccess && <div className="text-green-600 mt-2">Report submitted!</div>}
          </form>
        )}

        {/* Show upload/camera only after report is submitted */}
        {reportSubmitted && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default Detection;