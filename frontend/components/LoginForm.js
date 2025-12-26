'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { RefreshCw, Loader2, ArrowLeft } from 'lucide-react';
import initStatesAndCities from '@/utils/InitStatesAndCities';
import axiosInstance from "@/utils/axiosInstance";
import axiosAdmin from "@/utils/axiosAdmin";
import Input from '@/components/UI/Input';
import SetupScreen from '@/components/SetupScreen';
import Image from 'next/image';

// Dashboard Skeleton Component for Background
const DashboardSkeleton = () => {
  return (
    <div className="absolute inset-0 bg-neutral-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-7 w-48 bg-neutral-200/60 rounded-md"></div>
          <div className="h-4 w-80 bg-neutral-100 rounded mt-2"></div>
        </div>

        {/* Stat Cards Skeleton */}
        <div className="grid grid-cols-4 gap-5 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-neutral-200/40 rounded-xl h-36"></div>
          ))}
        </div>

        {/* Content Section Skeleton */}
        <div className="bg-white/60 rounded-xl border border-neutral-200/50 mb-6">
          <div className="px-6 py-4 border-b border-neutral-100">
            <div className="h-5 w-36 bg-neutral-200/60 rounded"></div>
          </div>
          <div className="p-6 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-neutral-100/60 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Loading status messages
const loadingMessages = [
  'Verifying credentials',
  'Establishing secure connection',
  'Loading workspace',
  'Preparing dashboard'
];

// Professional Login Splash Screen Component
const LoginSplash = ({ clientName }) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Smooth progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => prev >= 90 ? 90 : prev + 2);
    }, 150);

    // Cycle through messages
    const messageInterval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % loadingMessages.length);
    }, 2000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50">
      {/* Background Dashboard Skeleton */}
      <DashboardSkeleton />

      {/* Clean Frosted Overlay */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">

        {/* Minimal Rounded Loader */}
        <div className="relative mb-10">
          {/* Outer ring - static */}
          <div className="w-16 h-16 rounded-full border-[3px] border-neutral-200"></div>

          {/* Spinning arc */}
          <div className="absolute inset-0">
            <svg className="w-16 h-16 animate-spin" style={{ animationDuration: '1s' }} viewBox="0 0 64 64">
              <circle
                cx="32"
                cy="32"
                r="29"
                fill="none"
                stroke="#171717"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="45 135"
              />
            </svg>
          </div>
        </div>

        {/* Company Name */}
        <h1 className="text-2xl font-semibold text-neutral-900 mb-2 tracking-tight">
          {clientName || 'NEERP'}
        </h1>

        {/* Status Message */}
        <p className="text-sm text-neutral-500 mb-8 h-5 transition-opacity duration-300">
          {loadingMessages[messageIndex]}
        </p>

        {/* Minimal Progress Bar */}
        <div className="w-52">
          <div className="h-1 bg-neutral-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-neutral-900 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Subtle Footer */}
        <p className="absolute bottom-8 text-xs text-neutral-400">
          Please wait while we prepare your workspace
        </p>
      </div>
    </div>
  );
};

export default function LoginForm({ tenant, clientName: initialClientName = '' }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const [formError, setFormError] = useState('');
  const [captchaError, setCaptchaError] = useState('');
  const [clientName, setClientName] = useState(initialClientName);
  const [showSetup, setShowSetup] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(false);

  const [captchaSessionId, setCaptchaSessionId] = useState('');
  const [captchaCode, setCaptchaCode] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaLoading, setCaptchaLoading] = useState(false);

  const fetchCaptcha = useCallback(async () => {
    setCaptchaLoading(true);
    try {
      const res = await axiosInstance.get('/api/captcha/generate', {
        headers: { "X-Tenant": tenant },
      });
      setCaptchaSessionId(res.data.sessionId);
      setCaptchaCode(res.data.captchaCode);
      setCaptchaInput('');
    } catch (err) {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
      let code = '';
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setCaptchaCode(code);
      setCaptchaSessionId('');
    } finally {
      setCaptchaLoading(false);
    }
  }, [tenant]);

  useEffect(() => {
    fetchCaptcha();
  }, [fetchCaptcha]);

  useEffect(() => {
    if (tenant) {
      const fetchClientConfig = async () => {
        try {
          const response = await axiosAdmin.get(`/api/clients/domain/${tenant}/with-subscription-check`, {
            headers: { "X-Tenant": tenant },
          });
          const name = response.data?.client?.clientName || response.data?.clientName;
          if (name) setClientName(name);
        } catch (err) { }
      };
      fetchClientConfig();
    }
  }, [tenant]);

  const handleSetupComplete = async () => {
    setShowSetup(false);
    setShowSplash(true);

    try {
      const loginRes = await axiosInstance.post("/api/login", { email, password }, {
        headers: { "X-Tenant": tenant },
        withCredentials: true,
      });

      if (loginRes.data) {
        const { clientId, username, userEmail, token, clientName, userId } = loginRes.data;
        localStorage.setItem("tenant", tenant);
        localStorage.setItem(`${tenant}_clientId`, clientId);
        localStorage.setItem(`${tenant}_username`, username);
        localStorage.setItem(`${tenant}_userEmail`, userEmail);
        localStorage.setItem(`${tenant}_userId`, userId);
        localStorage.setItem(`${tenant}_token`, token);
        localStorage.setItem(`${tenant}_clientName`, clientName);

        // ✅ Set first-party cookie for middleware authentication
        const maxAge = 60 * 60 * 24; // 1 day in seconds
        document.cookie = `token=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;

        try { await initStatesAndCities(); } catch (err) { }
        router.push(`/dashboard/dashboard-data`);
      }
    } catch (err) {
      setShowSplash(false);
      setFormError('Setup complete! Please try logging in again.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setFormError('');
    setCaptchaError('');

    if (!captchaInput.trim()) {
      setCaptchaError('Please enter the code');
      return;
    }

    if (!captchaSessionId && captchaInput.toLowerCase() !== captchaCode.toLowerCase()) {
      setCaptchaError('Incorrect code, try again');
      fetchCaptcha();
      return;
    }

    setLoading(true);
    setShowSplash(true);

    try {
      const res = await axiosInstance.post("/api/login", {
        email, password,
        captchaSessionId: captchaSessionId || undefined,
        captchaInput
      }, {
        headers: { "X-Tenant": tenant },
        withCredentials: true,
      });

      if (res.status === 202 || res.data?.requiresInitialization) {
        setIsFirstTime(res.data?.isFirstTime || false);
        setShowSetup(true);
        setShowSplash(false);
        setLoading(false);
        return;
      }

      if (res.data) {
        const { clientId, username, userEmail, token, clientName, userId } = res.data;
        localStorage.setItem("tenant", tenant);
        localStorage.setItem(`${tenant}_clientId`, clientId);
        localStorage.setItem(`${tenant}_username`, username);
        localStorage.setItem(`${tenant}_userEmail`, userEmail);
        localStorage.setItem(`${tenant}_userId`, userId);
        localStorage.setItem(`${tenant}_token`, token);
        localStorage.setItem(`${tenant}_clientName`, clientName);

        // ✅ Set first-party cookie for middleware authentication
        // Cross-origin API cookies are not accessible to Next.js middleware,
        // so we set our own cookie on the frontend domain
        const maxAge = 60 * 60 * 24; // 1 day in seconds
        document.cookie = `token=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;

        try { await initStatesAndCities(); } catch (err) { }
        router.push(`/dashboard/dashboard-data`);
      } else {
        throw new Error("Login failed");
      }
    } catch (err) {
      setShowSplash(false);
      let errorMessage = "An error occurred. Please try again.";

      if (err.response) {
        const status = err.response.status;
        const data = err.response.data;

        switch (status) {
          case 400:
            setCaptchaError('Incorrect code, try again');
            setLoading(false);
            fetchCaptcha();
            return;
          case 401:
            errorMessage = data?.error || data?.message || "Invalid email or password.";
            break;
          case 403:
            errorMessage = data?.error || data?.message || "Access denied.";
            break;
          case 404:
            errorMessage = data?.error || data?.message || "Service not found.";
            break;
          case 429:
            errorMessage = data?.error || data?.message || "Too many attempts.";
            break;
          default:
            errorMessage = data?.error || data?.message || "Login failed.";
        }
      } else if (err.request) {
        errorMessage = "Could not connect to server.";
      }

      setFormError(errorMessage);
      setLoading(false);
      fetchCaptcha();
    }
  };

  if (showSplash) return <LoginSplash clientName={clientName} />;
  if (showSetup) return <SetupScreen tenant={tenant} onComplete={handleSetupComplete} isFirstTime={isFirstTime} />;

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Panel - Image/Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/login-image.png"
            alt="Business background"
            width={1200}
            height={1200}
            objectFit="cover"
            className='object-cover h-full w-full'
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/60" />
        </div>
        <div className="relative z-10 flex flex-col justify-end p-12 text-white">
          <h2 className="text-4xl font-bold mb-4">Welcome to {clientName || 'NEERP'}</h2>
          <p className="text-lg text-white/90 max-w-md">
            Streamline your business operations with our comprehensive enterprise resource planning solution.
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-[420px]">



          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">Log in</h1>
            <p className="text-neutral-500">
              Welcome back to <span className="text-neutral-900 font-medium">{clientName || 'NEERP'}</span>
            </p>
          </div>

          {/* Error Alert */}
          {formError && (
            <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 px-4 py-3 rounded-xl border border-red-200 mb-6">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{formError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700" htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-neutral-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-neutral-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
              />
              <div className="text-right">
                <Link href="/auth/forgot-password" className="text-xs text-neutral-600 hover:text-neutral-900 transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Captcha */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">Security code</label>
              <div className="flex items-center gap-3">
                <div
                  className="flex-1 h-12 rounded-xl flex items-center justify-center select-none border border-neutral-200"
                  style={{
                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 30 Q15 20 30 30 T60 30' stroke='%23e2e8f0' fill='none' stroke-width='1'/%3E%3Cpath d='M0 15 Q15 5 30 15 T60 15' stroke='%23e2e8f0' fill='none' stroke-width='1'/%3E%3Cpath d='M0 45 Q15 35 30 45 T60 45' stroke='%23e2e8f0' fill='none' stroke-width='1'/%3E%3C/svg%3E")`,
                  }}
                >
                  {captchaLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-neutral-400" />
                  ) : (
                    <span className="text-xl font-mono font-bold tracking-[0.25em] text-neutral-700">
                      {captchaCode}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={fetchCaptcha}
                  disabled={captchaLoading}
                  className="h-12 w-12 flex items-center justify-center text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors disabled:opacity-50 border border-neutral-200"
                  title="Refresh code"
                >
                  <RefreshCw className={`w-4 h-4 ${captchaLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
              <input
                id="captcha"
                type="text"
                placeholder="Type the code above"
                value={captchaInput}
                onChange={(e) => { setCaptchaInput(e.target.value); setCaptchaError(''); }}
                required
                autoComplete="off"
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all ${captchaError ? 'border-red-500 focus:ring-red-400' : 'border-neutral-300 focus:ring-neutral-900 focus:border-transparent'}`}
              />
              {captchaError && <p className="text-xs text-red-500">{captchaError}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold py-3.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-neutral-500">
              Secure access to your workspace
            </p>
          </div>

          <div className="mt-6 text-center text-xs text-neutral-400">
            © {new Date().getFullYear()} Nexa Software. All rights reserved.
          </div>

        </div>
      </div>
    </div>
  );
}