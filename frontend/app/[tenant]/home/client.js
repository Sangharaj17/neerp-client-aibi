'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function HomePageClient() {
  const { tenant } = useParams();
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [modules, setModules] = useState([]);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tenant) return;

    const userKey = `${tenant}_username`;
    const modulesKey = `${tenant}_modules`;
    const tokenKey = `${tenant}_token`;

    const storedUsername = localStorage.getItem(userKey);
    const storedModules = localStorage.getItem(modulesKey);
    const storedToken = localStorage.getItem(tokenKey);

    console.log("📦 Retrieved from localStorage:", storedUsername, storedModules, storedToken);

    if (!storedUsername || !storedModules || !storedToken) {
      router.push(`/${tenant}/login`);
      return;
    }

    setUsername(storedUsername);
    setToken(storedToken);

    try {
      const parsedModules = JSON.parse(storedModules);
      setModules(parsedModules);
    } catch (err) {
      console.error("❌ Failed to parse modules from localStorage:", err);
      setModules([]);
    } finally {
      setLoading(false);
    }
  }, [tenant, router]);

  const logout = async () => {
    try {
      const tokenKey = `${tenant}_token`;
      const token = localStorage.getItem(tokenKey);

      const res = await axiosInstance.post("/api/logout", null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = res.data;

      // Clear localStorage for this tenant
      localStorage.removeItem(`${tenant}_username`);
      localStorage.removeItem(`${tenant}_modules`);
      localStorage.removeItem(`${tenant}_token`);

      router.push(`/${tenant}/login`);
    } catch (error) {
      console.error("Logout failed:", error);
      alert(error.response?.data?.error || "Logout failed!");
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4">
      <h1>Welcome to {tenant}'s Home Page</h1>

      <h2 className="text-xl mb-2">
        Logged in as <span className="font-bold text-red-600">{username}</span>
      </h2>

      <p className="text-sm text-gray-600 mb-4">
        Token: <code className="break-all">{token}</code>
      </p>

      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Accessible Modules:</h2>
        <ul className="list-disc list-inside text-blue-700">
          {modules.map((mod, index) => (
            <li key={index}>{mod}</li>
          ))}
        </ul>
      </div>

      <button
        className="mt-6 bg-red-500 text-white py-2 px-4 rounded"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
}
