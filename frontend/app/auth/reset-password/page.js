'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from '@/components/UI/Input';
import { getTenant } from '@/utils/tenant';
import axiosInstance from '@/utils/axiosInstance';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [tenant, setTenant] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validating, setValidating] = useState(true);

  useEffect(() => {
    // Read URL parameters from client-side window.location
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tokenParam = params.get('token');
      const tenantParam = params.get('tenant') || getTenant();
      
      setTenant(tenantParam || '');
      
      if (tokenParam) {
        setToken(tokenParam);
        setValidating(false);
      } else {
        setError('Invalid or missing reset token. Please request a new password reset link.');
        setValidating(false);
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      // Call Java backend directly
      const response = await axiosInstance.post(
        '/api/password-reset/reset',
        { token, password },
        {
          headers: {
            'X-Tenant': tenant || '',
          },
        }
      );

      if (response.data.success || response.data.message) {
        setSuccess(true);
        setTimeout(() => {
          router.push(`/auth/login`);
        }, 3000);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.message || 
                          err.message || 
                          'Failed to reset password. The link may have expired.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-neutral-200 border-t-neutral-900 mx-auto"></div>
          <p className="mt-3 text-sm text-neutral-600">Validating reset link...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-[400px]">
          
          <div className="text-center space-y-6">
            {/* Success Icon */}
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            {/* Content */}
            <div className="space-y-3">
              <h1 className="text-xl font-semibold text-neutral-900">Password reset</h1>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Your password has been successfully reset
              </p>
              <p className="text-xs text-neutral-500">
                Redirecting to login...
              </p>
            </div>

            {/* Manual Link */}
            <Link 
              href="/auth/login"
              className="inline-block text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              Go to login
            </Link>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-[400px]">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-xl font-semibold text-neutral-900 mb-2">
            Reset password
          </h1>
          <p className="text-sm text-neutral-600">
            Enter your new password below
          </p>
        </div>

        {/* Form Container */}
        <div className="space-y-6">
          
          {/* Error Message */}
          {error && (
            <div className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700" htmlFor="password">
                New password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full"
              />
              <p className="text-xs text-neutral-500">At least 6 characters</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700" htmlFor="confirmPassword">
                Confirm password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-neutral-900 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-neutral-900"
              disabled={loading || !token}
            >
              {loading ? 'Resetting...' : 'Reset password'}
            </button>

          </form>

          {/* Back to Login Link */}
          <div className="text-center">
            <Link 
              href="/auth/login"
              className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              Back to login
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}