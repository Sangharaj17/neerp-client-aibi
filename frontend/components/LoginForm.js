'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import initStatesAndCities from '@/utils/InitStatesAndCities';
import axiosInstance from "@/utils/axiosInstance";

export default function LoginForm({ tenant }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    //console.log("➡️ Starting login process...");
    try {
      const res = await axiosInstance.post(
        "/api/login",
        { email, password },
        {
          headers: {
            "X-Tenant": tenant,
          },
          withCredentials: true, // ensures cookies are sent
        }
      );

     // console.log("✅ Received response from backend:");

      if (res.data) {
        //console.log("✅ Login successful, storing data locally...");
        const { clientId, username, userEmail, token, clientName } = res.data;
        //console.log(res,"✅ Login successful, storing data locally...",clientId);

        localStorage.setItem("tenant", tenant);
        localStorage.setItem(`${tenant}_clientId`, clientId);
        localStorage.setItem(`${tenant}_username`, username);
        localStorage.setItem(`${tenant}_userEmail`, userEmail);
        localStorage.setItem(`${tenant}_token`, token);
        localStorage.setItem(`${tenant}_clientName`, clientName);

        try {
          // first time initialization
          await initStatesAndCities();

          // then continue login logic...
        } catch (err) {
          console.error("Login error (await initStatesAndCities()):", err);
        }

        //console.log("➡️ Redirecting to dashboard...");
        router.push(`/${tenant}/dashboard`);

      } else {
        const errorMessage = res.data?.error || "Login failed";
        alert(errorMessage);
        console.warn("⚠️ Login failed with message:", errorMessage);
      }

    } catch (err) {
      console.error("❌ Network or Backend Error:", err);

      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Could not connect to server. Please ensure backend is running.";

      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md max-w-md">
        <h1 className="text-2xl font-semibold mb-4 text-center">Login - Client: {tenant}</h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Email"
            className="border p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? '🔄 Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
