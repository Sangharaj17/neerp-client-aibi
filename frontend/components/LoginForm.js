'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ReCAPTCHA from 'react-google-recaptcha';
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
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [recaptchaSiteKey, setRecaptchaSiteKey] = useState(null);
  const [recaptchaError, setRecaptchaError] = useState(false);
  const [recaptchaEnabled, setRecaptchaEnabled] = useState(true);
  const recaptchaRef = useRef(null);

  useEffect(() => {
    // Fetch client configuration including reCAPTCHA site key
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
          // Fetch reCAPTCHA site key from client config
          const siteKey = response.data?.client?.recaptchaSiteKey ||
            response.data?.recaptchaSiteKey ||
            process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
          
          if (siteKey && siteKey !== '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI') {
            // Only set if we have a valid key (not the test key)
            setRecaptchaSiteKey(siteKey);
            setRecaptchaEnabled(true);
          } else {
            // No valid key - disable reCAPTCHA
            setRecaptchaEnabled(false);
            setRecaptchaSiteKey(null);
          }
        } catch (err) {
          // Silently fail - client name is optional
          console.log("Could not fetch client config:", err);
          // Check if we have an environment variable key
          const envKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
          if (envKey && envKey !== '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI') {
            setRecaptchaSiteKey(envKey);
            setRecaptchaEnabled(true);
          } else {
            // No valid key - disable reCAPTCHA
            setRecaptchaEnabled(false);
            setRecaptchaSiteKey(null);
          }
        }
      };
      fetchClientConfig();
    }
  }, [tenant]);

  // Monitor for reCAPTCHA domain errors in the DOM
  useEffect(() => {
    if (!recaptchaEnabled || !recaptchaSiteKey) return;

    const checkForRecaptchaError = () => {
      // Look for reCAPTCHA error messages in the DOM
      const recaptchaElements = document.querySelectorAll('.grecaptcha-badge, iframe[src*="recaptcha"]');
      recaptchaElements.forEach((el) => {
        const parent = el.closest('div');
        if (parent) {
          const text = parent.textContent || '';
          if (text.includes('Invalid domain') || text.includes('ERROR for site owner') || text.includes('site key')) {
            console.warn('reCAPTCHA domain error detected in DOM - disabling reCAPTCHA');
            setRecaptchaEnabled(false);
            setRecaptchaSiteKey(null);
            setRecaptchaError(true);
            setFormError('');
          }
        }
      });
    };

    // Check after a short delay to allow reCAPTCHA to render
    const timeoutId = setTimeout(checkForRecaptchaError, 2000);
    
    // Also check periodically
    const intervalId = setInterval(checkForRecaptchaError, 3000);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [recaptchaEnabled, recaptchaSiteKey]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setFormError('');

    // Validate reCAPTCHA only if it's enabled
    if (recaptchaEnabled && !recaptchaToken) {
      setFormError('Please complete the verification check below to continue.');
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      // Send reCAPTCHA token only if reCAPTCHA is enabled, otherwise send null
      const res = await axiosInstance.post(
        "/api/login",
        { email, password, recaptchaToken: recaptchaEnabled ? recaptchaToken : null },
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
                  { email, password, recaptchaToken: recaptchaEnabled ? recaptchaToken : null },
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
                // Reset reCAPTCHA on error
                setRecaptchaToken(null);
                if (recaptchaRef.current) {
                  recaptchaRef.current.reset();
                }
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
      // Reset reCAPTCHA on error so user can retry
      setRecaptchaToken(null);
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
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
                    href={`/auth/forgot-password${tenant ? `?tenant=${tenant}` : ''}`}
                    className="text-xs text-neutral-600 hover:text-neutral-900 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              {/* reCAPTCHA */}
              {recaptchaEnabled && recaptchaSiteKey && (
                <div className="pt-1">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={recaptchaSiteKey}
                    onChange={(token) => {
                      setRecaptchaToken(token);
                      setFormError('');
                      setRecaptchaError(false);
                    }}
                    onExpired={() => {
                      setRecaptchaToken(null);
                    }}
                    onError={() => {
                      console.warn('reCAPTCHA error detected');
                      setRecaptchaToken(null);
                      setRecaptchaError(true);
                      // Check if error is visible in DOM (domain mismatch errors show in the widget)
                      setTimeout(() => {
                        const recaptchaContainer = recaptchaRef.current?.widgetId 
                          ? document.querySelector(`#rc-imageselect, [data-sitekey="${recaptchaSiteKey}"]`)
                          : null;
                        const errorText = recaptchaContainer?.parentElement?.textContent || '';
                        
                        // If we see domain-related error text, disable reCAPTCHA
                        if (errorText.includes('Invalid domain') || errorText.includes('site key') || errorText.includes('ERROR for site owner')) {
                          console.warn('reCAPTCHA domain error detected - disabling reCAPTCHA for this tenant');
                          setRecaptchaEnabled(false);
                          setRecaptchaSiteKey(null);
                          setFormError(''); // Clear error to allow login without reCAPTCHA
                        } else {
                          setFormError('Verification failed. Please try again.');
                        }
                      }, 500);
                    }}
                  />
                  {recaptchaError && (
                    <p className="text-xs text-neutral-500 mt-1">
                      reCAPTCHA verification is optional for this tenant
                    </p>
                  )}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-neutral-900 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-neutral-900"
                disabled={loading || (recaptchaEnabled && !recaptchaToken)}
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