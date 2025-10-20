'use client';

import { useState, useEffect } from 'react';

interface SuccessScreenProps {
  formId: string;
  onRestart: () => void;
}

export default function SuccessScreen({ formId, onRestart }: SuccessScreenProps) {
  const [videoStatus, setVideoStatus] = useState<'processing' | 'completed' | 'failed'>('processing');
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isPolling, setIsPolling] = useState(true);
  const [pollCount, setPollCount] = useState(0);
  const [error, setError] = useState<string>('');

  // Browser persistence - check localStorage on mount
  useEffect(() => {
    const savedFormId = localStorage.getItem('currentFormId');
    const savedVideoStatus = localStorage.getItem('videoStatus');
    const savedVideoUrl = localStorage.getItem('videoUrl');
    
    if (savedFormId === formId) {
      if (savedVideoStatus === 'completed' && savedVideoUrl) {
        setVideoStatus('completed');
        setVideoUrl(savedVideoUrl);
        setIsPolling(false);
      } else if (savedVideoStatus === 'processing') {
        setVideoStatus('processing');
        setIsPolling(true);
      }
    }
  }, [formId]);

  useEffect(() => {
    if (!isPolling) return;

    const pollVideoStatus = async () => {
      try {
        console.log(`🔍 Polling video status for form ${formId} (attempt ${pollCount + 1})`);
        
        const response = await fetch(`/api/check-video-status?formId=${formId}`);
        const data = await response.json();
        
        if (data.success) {
          if (data.videoUrl) {
            console.log('✅ Video ready!', data.videoUrl);
            setVideoStatus('completed');
            setVideoUrl(data.videoUrl);
            setIsPolling(false);
            
            // Save to localStorage
            localStorage.setItem('currentFormId', formId);
            localStorage.setItem('videoStatus', 'completed');
            localStorage.setItem('videoUrl', data.videoUrl);
          } else {
            console.log('⏳ Video still processing...');
            setPollCount(prev => prev + 1);
            
            // Save processing state to localStorage
            localStorage.setItem('currentFormId', formId);
            localStorage.setItem('videoStatus', 'processing');
          }
        } else {
          console.error('❌ Error checking video status:', data.error);
          setError(data.error || 'Error checking video status');
        }
      } catch (error) {
        console.error('❌ Polling error:', error);
        setError('Error checking video status');
      }
    };

    // Start polling immediately, then every 10 seconds
    pollVideoStatus();
    const interval = setInterval(pollVideoStatus, 10000);

    return () => clearInterval(interval);
  }, [formId, isPolling, pollCount]);

  const copyVideoUrl = async () => {
    try {
      await navigator.clipboard.writeText(videoUrl);
      alert('Video URL copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy URL:', error);
      alert('Failed to copy URL. Please copy manually.');
    }
  };

  const handleClearAndRestart = () => {
    // Clear localStorage
    localStorage.removeItem('currentFormId');
    localStorage.removeItem('videoStatus');
    localStorage.removeItem('videoUrl');
    
    // Reset state
    setVideoStatus('processing');
    setVideoUrl('');
    setIsPolling(false);
    setPollCount(0);
    setError('');
    
    // Call restart function
    onRestart();
  };

  return (
    <div className="text-center space-y-8">
      {/* Success Header */}
      <div className="space-y-4">
        <div className="w-20 h-20 mx-auto bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center animate-pulse">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          Application Submitted Successfully!
        </h2>
        <p className="text-slate-600 text-lg">
          Thank you for your interest in Fortes Education. We&apos;re excited to welcome you to our community!
        </p>
      </div>

      {/* Video Generation Status */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-blue-200/30 p-8 space-y-6">
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-slate-800">
            🎬 Personalized Welcome Video
          </h3>
          
          {videoStatus === 'processing' && (
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="text-lg font-semibold text-slate-700">
                  Generating your personalized video...
                </span>
              </div>
              <p className="text-slate-600">
                This may take a few minutes. We&apos;re creating a special welcome message just for you!
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 font-medium">
                  ⏳ Please wait while we generate your personalized welcome video
                </p>
              </div>
            </div>
          )}

          {videoStatus === 'completed' && videoUrl && (
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-3 text-green-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-lg font-semibold">
                  Your video is ready!
                </span>
              </div>
              
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium mb-3">
                    🎉 Your personalized welcome video has been generated!
                  </p>
                  <div className="space-y-3">
                    <button
                      onClick={() => window.open(videoUrl, '_blank')}
                      className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-600 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/25"
                    >
                      🎬 View Video
                    </button>
                    <button
                      onClick={copyVideoUrl}
                      className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-600 focus:outline-none focus:ring-4 focus:ring-green-500/20 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-green-500/25"
                    >
                      📋 Copy Video URL
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-medium">
                ⚠️ {error}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-slate-50 rounded-xl p-6 space-y-4">
        <h4 className="text-lg font-semibold text-slate-800">What&apos;s Next?</h4>
        <ul className="text-slate-600 space-y-2 text-left">
          <li className="flex items-start space-x-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>We&apos;ll review your application and contact you soon</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>Check your WhatsApp for updates and the welcome video</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>Our team will reach out to schedule your campus visit</span>
          </li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onRestart}
            className="px-8 py-3 bg-gradient-to-r from-slate-500 to-slate-600 text-white font-semibold rounded-xl hover:from-slate-600 hover:to-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-500/20 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-slate-500/25"
          >
            Submit Another Application
          </button>
          <button
            onClick={handleClearAndRestart}
            className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-4 focus:ring-red-500/20 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-500/25"
          >
            Clear & Start Over
          </button>
        </div>
      </div>
    </div>
  );
}
