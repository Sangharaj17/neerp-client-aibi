'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import initStatesAndCities from '@/utils/InitStatesAndCities';
import axiosInstance from "@/utils/axiosInstance";
import axiosAdmin from "@/utils/axiosAdmin";

export default function LoginForm({ tenant, clientName: initialClientName = '' }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [clientName, setClientName] = useState(initialClientName);


  useEffect(() => {
    // If client name wasn't passed as prop, try to fetch it
    if (!clientName && tenant) {
      const fetchClientName = async () => {
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
          console.log("Could not fetch client name:", err);
        }
      };
      fetchClientName();
    }
  }, [tenant, clientName]);

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
        while (Date.now() - start < 120000) {
          await new Promise(r => setTimeout(r, 2000));
          try {
            const st = await axiosInstance.get('/api/tenants/init-status', { headers: { 'X-Tenant': tenant } });
            if (st.data?.initialized) {
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
                setFormError("Setup complete! Please try logging in again.");
                setLoading(false);
                return;
              }
            }
          } catch (_) { /* swallow polling errors */ }
        }
        setLoading(false);
        throw new Error('Initialization is taking longer than expected. Please try again.');
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
      console.error("❌ Error details:", err.response?.data);
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.message || 
                          err.message ||
                          "Could not connect to server. Please ensure backend is running.";
      setFormError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="mb-8 text-center">
            {clientName && (
              <div className="mb-4">
                <p className="text-base font-semibold text-blue-600">{clientName}</p>
              </div>
            )}
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Sign in</h1>
            <p className="text-sm text-gray-500">Enter your credentials to access your account</p>
          </div>

          {formError && (
            <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
              {formError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2.5 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
