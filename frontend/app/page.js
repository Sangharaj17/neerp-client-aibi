'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Get tenant from current hostname
    const hostname = window.location.hostname;
    const tenant = hostname.replace(/^www\./i, '');

    // If we have a valid tenant (not localhost), redirect to tenant-specific login
    if (tenant && !tenant.includes('localhost')) {
      router.push(`/${tenant}/login`);
    } else {
      // For localhost or no tenant, redirect to general login
      router.push('/login');
    }
  }, [router]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
