'use client';

import { useState, useEffect } from 'react';
import axiosInstance from '@/utils/axiosInstance';

export default function SetupScreen({ tenant, onComplete, isFirstTime = false }) {
  const [status, setStatus] = useState({
    message: isFirstTime ? 'Setting up your system for the first time...' : 'Updating your system...',
    progress: 0,
    currentStep: 'starting'
  });
  const [error, setError] = useState('');

  useEffect(() => {
    let pollInterval;
    let attemptCount = 0;
    const maxAttempts = 60; // 60 attempts * 2 seconds = 2 minutes max

    const pollStatus = async () => {
      try {
        attemptCount++;

        const response = await axiosInstance.get('/api/tenants/init-status', {
          headers: { 'X-Tenant': tenant },
          withCredentials: true
        });

        const data = response.data;
        console.log('[SetupScreen] Status:', data);

        if (data.initialized === true) {
          // Setup complete!
          setStatus({
            message: 'Setup complete! Redirecting...',
            progress: 100,
            currentStep: 'completed'
          });

          // Wait a moment to show completion
          setTimeout(() => {
            clearInterval(pollInterval);
            onComplete();
          }, 1000);
        } else {
          // Update progress
          setStatus({
            message: data.message || 'Setting up your system...',
            progress: data.progress || Math.min((attemptCount / maxAttempts) * 100, 95),
            currentStep: data.currentStep || 'in_progress'
          });

          // Check if we've exceeded max attempts
          if (attemptCount >= maxAttempts) {
            clearInterval(pollInterval);
            setError('Setup is taking longer than expected. Please refresh the page and try again.');
          }
        }
      } catch (err) {
        console.error('[SetupScreen] Polling error:', err);

        // Don't show error on first few attempts (network might be settling)
        if (attemptCount > 3) {
          setError('Error checking setup status. Please refresh the page.');
          clearInterval(pollInterval);
        }
      }
    };

    // Start polling immediately, then every 2 seconds
    pollStatus();
    pollInterval = setInterval(pollStatus, 2000);

    // Cleanup on unmount
    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [tenant, onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">

        {/* Icon/Spinner */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
          {isFirstTime ? 'Setting Up Your System' : 'System Update'}
        </h2>

        {/* Message */}
        <p className="text-center text-gray-600 mb-6">
          {status.message}
        </p>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{Math.round(status.progress)}%</span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-out"
              style={{ width: `${status.progress}%` }}
            />
          </div>
        </div>

        {/* Current Step */}
        {status.currentStep && status.currentStep !== 'starting' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-blue-800 text-center">
              {getStepMessage(status.currentStep)}
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-red-800 text-center">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 w-full bg-red-600 text-white text-sm font-medium py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        )}

        {/* Info Text */}
        <p className="text-xs text-gray-500 text-center leading-relaxed">
          {isFirstTime ? (
            <>
              We're setting up your workspace for the first time.
              This includes creating your database tables and configuring default settings.
              <br />
              <span className="font-medium">This usually takes 1-2 minutes.</span>
            </>
          ) : (
            <>
              We're applying the latest updates to your system.
              <br />
              <span className="font-medium">This should only take a few moments.</span>
            </>
          )}
        </p>

        {/* Dots animation */}
        <div className="flex justify-center mt-6 space-x-2">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}

// Helper function to convert step names to readable messages
function getStepMessage(step) {
  const messages = {
    'starting': 'Initializing...',
    'creating_schema': 'Creating database schema...',
    'creating_tables': 'Creating database tables...',
    'inserting_defaults': 'Setting up default data...',
    'finalizing': 'Finalizing setup...',
    'completed': 'Setup complete!',
    'error': 'An error occurred',
    'in_progress': 'Processing...'
  };

  return messages[step] || 'Setting up your system...';
}
