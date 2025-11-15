'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axiosInstance from '@/utils/axiosInstance';
import { toast } from 'react-hot-toast';

export default function ChangePasswordPage() {
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changeLoading, setChangeLoading] = useState(false);
  const [emailMissing, setEmailMissing] = useState(false);
  const [tenant, setTenant] = useState('');

  useEffect(() => {
    try {
      if (typeof window === 'undefined') {
        return;
      }
      const storedTenant = localStorage.getItem('tenant');
      if (!storedTenant) {
        setEmailMissing(true);
        return;
      }
      setTenant(storedTenant);
      const storedEmail = localStorage.getItem(`${storedTenant}_userEmail`);
      if (!storedEmail) {
        setEmailMissing(true);
        return;
      }
      setEmail(storedEmail);
      setEmailMissing(false);
    } catch (error) {
      console.error('Error loading user email:', error);
      setEmailMissing(true);
    }
  }, []);

  const clearPasswordFields = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    if (!email) {
      toast.error('No employee email found. Please sign in again.');
      setEmailMissing(true);
      return;
    }
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New password and confirmation do not match.');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('New password should be at least 6 characters long.');
      return;
    }
    if (newPassword === currentPassword) {
      toast.error('New password must be different from the current password.');
      return;
    }

    setChangeLoading(true);
    try {
      await axiosInstance.post('/api/employees/change-password', {
        email,
        currentPassword,
        newPassword,
      });
      toast.success('Password updated successfully.');
      clearPasswordFields();
    } catch (error) {
      let message = 'Failed to update password. Please try again.';
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          message = error.response.data;
        } else if (error.response.data?.message) {
          message = error.response.data.message;
        } else if (error.response.data?.error) {
          message = error.response.data.error;
        }
      }
      toast.error(message);
    } finally {
      setChangeLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-white flex flex-col p-4">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-[500px]">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">Change Password</h1>
            <p className="text-sm text-neutral-500 mt-2">
              Update your account password. Make sure to choose a strong, unique password.
            </p>
          </div>

          {/* Form Container */}
          <div className="space-y-6">
            
            {/* User Info */}
            <div className="text-center">
              <p className="text-xs text-neutral-500">
                Logged in as <span className="font-medium text-neutral-700">{email || 'unknown user'}</span>
              </p>
            </div>

            {/* Forgot Password Link */}
            <div className="text-center">
              <Link
                href="/auth/forgot-password"
                className="text-xs text-blue-600 hover:text-blue-900 transition-colors underline"
              >
                Forgot current password?
              </Link>
            </div>

            {/* Error Message */}
            {emailMissing && (
              <div className="text-sm text-yellow-600 bg-yellow-50 px-4 py-3 rounded-lg border border-yellow-100">
                We could not determine the logged-in employee. Please sign out and sign back in, then try again.
              </div>
            )}

            {!emailMissing && (
              <form onSubmit={handleChangePassword} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700" htmlFor="email">
                    Employee Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    readOnly
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-100 px-4 py-2 text-sm text-neutral-600 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700" htmlFor="currentPassword">
                    Current Password
                  </label>
                  <input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                    className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                    placeholder="Enter your current password"
                    autoComplete="current-password"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700" htmlFor="newPassword">
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                    placeholder="Enter a new password"
                    autoComplete="new-password"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700" htmlFor="confirmPassword">
                    Confirm New Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                    placeholder="Re-enter the new password"
                    autoComplete="new-password"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    className="h-9 px-4 rounded-lg border border-neutral-200 bg-white text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
                    onClick={clearPasswordFields}
                    disabled={changeLoading}
                  >
                    Clear
                  </button>
                  <button
                    type="submit"
                    disabled={changeLoading}
                    className="h-9 px-4 rounded-lg bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-neutral-900"
                  >
                    {changeLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}