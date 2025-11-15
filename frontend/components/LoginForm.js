'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import initStatesAndCities from '@/utils/InitStatesAndCities';
import axiosInstance from "@/utils/axiosInstance";
import axiosAdmin from "@/utils/axiosAdmin";
import Input from '@/components/UI/Input';

export default function LoginForm({ tenant, clientName: initialClientName = '' }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [clientName, setClientName] = useState(initialClientName);

  useEffect(() => {
    // Fetch client configuration
    if (tenant) {
      const fetchClientConfig = async () => {
        try {
          const response = await axiosAdmin.get(`/api/clients/domain/${tenant}/with-subscription-check`, {
            headers: { "X-Tenant": tenant },
          });
          // Client name is nested in client object
          const name = response.data?.client?.clientName || response.data?.clientName;
          if (name) {
            setClientName(name);
          }
        } catch (err) {
          // Silently fail - client name is optional
          console.log("Could not fetch client config:", err);
        }
      };
      fetchClientConfig();
    }
  }, [tenant]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setFormError('');
    setLoading(true);

    try {
      const res = await axiosInstance.post(
        "/api/login",
        { email, password },
        {
          headers: {
            "X-Tenant": tenant,
          },
          withCredentials: true,
        }
      );

      if (res.status === 202 || res.data?.requiresInitialization) {
        // Initialization needed - poll silently in background
        const start = Date.now();
        const maxWaitTime = 120000; // 2 minutes
        let lastStatus = null;

        while (Date.now() - start < maxWaitTime) {
          await new Promise(r => setTimeout(r, 2000));
          try {
            const st = await axiosInstance.get('/api/tenants/init-status', {
              headers: { 'X-Tenant': tenant },
              withCredentials: true
            });
            lastStatus = st.data;
            console.log('Initialization status:', st.data);

            if (st.data?.initialized === true) {
              // Retry login automatically after initialization
              try {
                const loginRes = await axiosInstance.post(
                  "/api/login",
                  { email, password },
                  {
                    headers: {
                      "X-Tenant": tenant,
                    },
                    withCredentials: true,
                  }
                );
                if (loginRes.data) {
                  const { clientId, username, userEmail, token, clientName } = loginRes.data;
                  localStorage.setItem("tenant", tenant);
                  localStorage.setItem(`${tenant}_clientId`, clientId);
                  localStorage.setItem(`${tenant}_username`, username);
                  localStorage.setItem(`${tenant}_userEmail`, userEmail);
                  localStorage.setItem(`${tenant}_token`, token);
                  localStorage.setItem(`${tenant}_clientName`, clientName);
                  try {
                    await initStatesAndCities();
                  } catch (err) {
                    console.error("Login error (await initStatesAndCities()):", err);
                  }
                  router.push(`/dashboard/dashboard-data`);
                  return;
                }
              } catch (retryErr) {
                console.error("Retry login error:", retryErr);
                setFormError(retryErr.response?.data?.error || retryErr.response?.data?.message || "Setup complete! Please try logging in again.");
                setLoading(false);
                return;
              }
            }
          } catch (pollErr) {
            console.warn("Polling error (will retry):", pollErr.response?.data || pollErr.message);
            // Continue polling unless it's a critical error
          }
        }
        setLoading(false);
        const timeoutError = new Error(
          lastStatus?.message ||
          'Initialization is taking longer than expected. Please try again in a few moments.'
        );
        throw timeoutError;
      }

      if (res.data) {
        const { clientId, username, userEmail, token, clientName } = res.data;
        localStorage.setItem("tenant", tenant);
        localStorage.setItem(`${tenant}_clientId`, clientId);
        localStorage.setItem(`${tenant}_username`, username);
        localStorage.setItem(`${tenant}_userEmail`, userEmail);
        localStorage.setItem(`${tenant}_token`, token);
        localStorage.setItem(`${tenant}_clientName`, clientName);

        try {
          await initStatesAndCities();
        } catch (err) {
          console.error("Login error (await initStatesAndCities()):", err);
        }

        router.push(`/dashboard/dashboard-data`);
      } else {
        throw new Error(res.data?.error || "Login failed");
      }
    } catch (err) {
      console.error("❌ Network or Backend Error:", err);
      console.error("❌ Error details:", err.response?.data || err.message);

      // Handle different error scenarios gracefully
      let errorMessage = "An error occurred. Please try again.";

      if (err.response) {
        // Server responded with error status
        const status = err.response.status;
        const data = err.response.data;

        switch (status) {
          case 401:
            // Unauthorized - wrong credentials
            errorMessage = data?.error || data?.message || "Invalid email or password. Please check your credentials and try again.";
            break;
          case 403:
            // Forbidden
            errorMessage = data?.error || data?.message || "Access denied. Please contact your administrator.";
            break;
          case 404:
            // Not found
            errorMessage = data?.error || data?.message || "Service not found. Please check your connection.";
            break;
          case 429:
            // Too many requests
            errorMessage = data?.error || data?.message || "Too many login attempts. Please wait a moment and try again.";
            break;
          case 500:
          case 502:
          case 503:
            // Server errors
            errorMessage = data?.error || data?.message || "Server error. Please try again in a few moments.";
            break;
          default:
            // Other errors - use backend message if available
            errorMessage = data?.error || data?.message || `Login failed (${status}). Please try again.`;
        }
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = "Could not connect to server. Please check your internet connection and ensure the backend is running.";
      } else {
        // Error setting up the request
        errorMessage = err.message || "An unexpected error occurred. Please try again.";
      }

      setFormError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col p-4">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-[400px]">

          {/* Logo/Brand */}
          <div className="text-center mb-12">
            <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">
              {clientName || 'NEERP'}
            </h1>
          </div>

          {/* Form Container */}
          <div className="space-y-6">

            {/* Error Message */}
            {formError && (
              <div className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg border border-red-100">
                {formError}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">

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

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700" htmlFor="password">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full"
                />
                <div className="text-right">
                  <Link
                    href="/auth/forgot-password"
                    className="text-xs text-neutral-600 hover:text-neutral-900 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-neutral-900 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-neutral-900"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Continue'}
              </button>

            </form>

          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="text-center space-y-2 py-4">
        <p className="text-xs text-neutral-500 mb-2">
          Secure access to your workspace
        </p>
        <div className="flex flex-col items-center gap-1 text-[10px] text-neutral-400">
          <p>© {new Date().getFullYear()} Nexa Software. All rights reserved. Protected by enterprise-grade security</p>

        </div>
      </div>

    </div>
  );
}