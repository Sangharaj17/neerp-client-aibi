'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Input from '@/components/UI/Input';
import { getTenant } from '@/utils/tenant';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const tenant = searchParams.get('tenant') || getTenant();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Call Next.js API route directly (not backend)
      const response = await fetch('/api/password-reset/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant': tenant || '',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send reset link');
      }

      if (data.success || data.message) {
        setSuccess(true);
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to send reset link. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
              <h1 className="text-xl font-semibold text-neutral-900">Check your email</h1>
              <p className="text-sm text-neutral-600 leading-relaxed">
                We sent a password reset link to <span className="font-medium text-neutral-900">{email}</span>
              </p>
              <p className="text-xs text-neutral-500">
                The link will expire in 1 hour
              </p>
            </div>

            {/* Back to Login */}
            <Link 
              href={`/auth/login${tenant ? `?tenant=${tenant}` : ''}`}
              className="inline-block text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              Back to login
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
            Forgot password?
          </h1>
          <p className="text-sm text-neutral-600">
            Enter your email to receive a reset link
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
              <label className="text-sm font-medium text-neutral-700" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-neutral-900 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-neutral-900"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send reset link'}
            </button>

          </form>

          {/* Back to Login Link */}
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