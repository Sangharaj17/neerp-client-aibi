'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from '@/components/UI/Input';
import { getTenant } from '@/utils/tenant';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [tenant, setTenant] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Read URL parameters from client-side window.location
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tokenParam = params.get('token');
      const tenantParam = params.get('tenant') || getTenant();
      
      setToken(tokenParam || '');
      setTenant(tenantParam || '');
      setMounted(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/password-reset/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant': tenant || '',
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }

      setSuccess(true);
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push(`/auth/login${tenant ? `?tenant=${tenant}` : ''}`);
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
          <p className="text-sm text-neutral-600 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-[400px] text-center space-y-4">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-neutral-900">Invalid reset link</h1>
          <p className="text-sm text-neutral-600">This password reset link is invalid or has expired.</p>
          <Link 
            href={`/auth/forgot-password${tenant ? `?tenant=${tenant}` : ''}`}
            className="inline-block text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-[400px] text-center space-y-6">
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="space-y-3">
            <h1 className="text-xl font-semibold text-neutral-900">Password reset successful</h1>
            <p className="text-sm text-neutral-600">Your password has been updated. Redirecting to login...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-[400px]">
        
        <div className="text-center mb-8">
          <h1 className="text-xl font-semibold text-neutral-900 mb-2">
            Reset your password
          </h1>
          <p className="text-sm text-neutral-600">
            Enter your new password below
          </p>
        </div>

        <div className="space-y-6">
          
          {error && (
            <div className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700" htmlFor="password">
                New Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-neutral-900 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-neutral-900"
              disabled={loading}
            >
              {loading ? 'Resetting...' : 'Reset password'}
            </button>

          </form>

          <div className="text-center">
            <Link 
              href={`/auth/login${tenant ? `?tenant=${tenant}` : ''}`}
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