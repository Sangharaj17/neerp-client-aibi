'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '@/utils/axiosInstance';

export default function CompanyLogo() {
  const [logoUrl, setLogoUrl] = useState(null);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await axiosInstance.get('/api/v1/settings/COMPANY_SETTINGS_1/logo');
        
        if (response.data?.logo) {
          setLogoUrl(response.data.logo);
        }
      } catch (err) {
        console.error('Failed to load logo:', err);
      }
    };

    fetchLogo();
  }, []);

  return (
    <div className="flex items-center h-full">
      {logoUrl ? (
        <img
          src={logoUrl}
          alt="Company Logo"
          // --- V- Responsive Fix V ---
          // 1. max-h-full: Limits height to the parent's available height (h-16 minus padding).
          // 2. max-w-full: Limits width to the parent's available width.
          // 3. w-auto and h-auto: Keeps dimensions flexible.
          // 4. object-contain: Ensures the whole logo is visible without cropping.
          className="max-h-full max-w-full w-auto h-auto object-contain"
          // --- ^- Responsive Fix ^ ---
        />
      ) : (
        <div className="text-gray-400 text-xs italic font-medium">No Logo</div>
      )}
    </div>
  );
}