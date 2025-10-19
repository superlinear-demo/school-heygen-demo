'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface EnvStatus {
  heygenApiKey: boolean;
  whatsappToken: boolean;
  whatsappPhoneId: string;
  phoneList: string;
  supabaseUrl: boolean;
  supabaseKey: boolean;
}

export default function StatusPage() {
  const [envStatus, setEnvStatus] = useState<EnvStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/test-env')
      .then(res => res.json())
      .then(data => {
        setEnvStatus(data.environment);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch environment status:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading environment status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Environment Status</h1>
          
          {envStatus && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg ${envStatus.heygenApiKey ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <h3 className="font-semibold text-gray-800">HeyGen API</h3>
                  <p className={`text-sm ${envStatus.heygenApiKey ? 'text-green-600' : 'text-red-600'}`}>
                    {envStatus.heygenApiKey ? '✅ Configured' : '❌ Missing API Key'}
                  </p>
                </div>

                <div className={`p-4 rounded-lg ${envStatus.whatsappToken ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                  <h3 className="font-semibold text-gray-800">WhatsApp API</h3>
                  <p className={`text-sm ${envStatus.whatsappToken ? 'text-green-600' : 'text-yellow-600'}`}>
                    {envStatus.whatsappToken ? '✅ Configured' : '⚠️ Missing Access Token'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Phone ID: {envStatus.whatsappPhoneId || 'Not set'}
                  </p>
                </div>

                <div className={`p-4 rounded-lg ${envStatus.supabaseUrl && envStatus.supabaseKey ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                  <h3 className="font-semibold text-gray-800">Supabase Database</h3>
                  <p className={`text-sm ${envStatus.supabaseUrl && envStatus.supabaseKey ? 'text-green-600' : 'text-yellow-600'}`}>
                    {envStatus.supabaseUrl && envStatus.supabaseKey ? '✅ Configured' : '⚠️ Missing Credentials'}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <h3 className="font-semibold text-gray-800">Demo Phone Numbers</h3>
                  <p className="text-sm text-blue-600">✅ Configured</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {envStatus.phoneList || 'Not set'}
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Setup Instructions</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Add your WhatsApp Business API access token to complete WhatsApp integration</li>
                  <li>• Set up Supabase database and add credentials for data storage</li>
                  <li>• The form is ready to use with HeyGen video generation</li>
                </ul>
              </div>

              <div className="mt-4 flex space-x-4">
                <Link
                  href="/"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Go to Form
                </Link>
                <a
                  href="/api/test-env"
                  target="_blank"
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  View API Status
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
