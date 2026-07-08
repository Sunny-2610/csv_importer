'use client';

import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

interface ApiStatus {
  status: string;
  message: string;
  timestamp: string;
  environment: string;
}

export default function Home() {
  const [apiStatus, setApiStatus] = useState<ApiStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkApiHealth();
  }, []);

  const checkApiHealth = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/health`);
      if (!response.ok) throw new Error('API is not responding');
      const data = await response.json();
      setApiStatus(data);
      setError(null);
      toast.success('Connected to backend!');
    } catch (err) {
      setError('Cannot connect to backend server. Make sure it is running.');
      console.error('API Health Check Error:', err);
      toast.error('Failed to connect to backend');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
            <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI-Powered CSV Importer
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload any CSV and let AI intelligently map it to GrowEasy CRM format
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              ✅ Frontend Ready
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              ⏳ Waiting for Backend
            </span>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">System Status</h2>
            <button
              onClick={checkApiHealth}
              disabled={loading}
              className="px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
            >
              {loading ? 'Checking...' : 'Refresh'}
            </button>
          </div>

          <div className="space-y-4">
            {/* Backend Status */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  loading ? 'bg-yellow-400 animate-pulse' :
                  error ? 'bg-red-500' :
                  apiStatus ? 'bg-green-500' : 'bg-gray-400'
                }`} />
                <span className="font-medium text-gray-700">Backend Server</span>
              </div>
              <span className="text-sm text-gray-500">
                {loading ? 'Checking...' :
                 error ? '❌ Offline' :
                 apiStatus ? `✅ Online (${apiStatus.environment})` : 'Unknown'}
              </span>
            </div>

            {/* API Response */}
            {apiStatus && !error && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-2 text-green-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-medium">Connected successfully</span>
                </div>
                <div className="mt-2 text-sm text-green-600">
                  <p>Message: {apiStatus.message}</p>
                  <p>Timestamp: {new Date(apiStatus.timestamp).toLocaleString()}</p>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center space-x-2 text-red-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">Connection Error</span>
                </div>
                <p className="mt-2 text-sm text-red-600">{error}</p>
                <div className="mt-2 text-sm text-red-500">
                  <p>Try these fixes:</p>
                  <ul className="list-disc list-inside ml-2">
                    <li>Make sure backend is running on port 5000</li>
                    <li>Check if CORS is enabled</li>
                    <li>Verify .env.local has correct API URL</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Next Steps */}
            {!error && apiStatus && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-medium text-blue-700 mb-2">🚀 Ready for Stage 2</h3>
                <p className="text-sm text-blue-600">
                  CSV upload functionality is coming next! We'll add drag & drop upload and CSV preview.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Built with Next.js 14, Express, and OpenAI</p>
        </div>
      </div>
    </main>
  );
}