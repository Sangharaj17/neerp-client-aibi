// ModernizationQuotationClient.js

'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import OncallCreate from './OncallCreate';
// New component receives PROPS that are already resolved on the server
export default function OncallQuotationClient({ pathSegments }) {
  
  // Access the array directly, which is now a clean prop
  const combinedEnquiryId = pathSegments[0] || '';
  const leadId = pathSegments[1] || ''; 
  
  const searchParams = useSearchParams();

  const customer = searchParams.get('customer') || '';
  const site = searchParams.get('site') || '';

  // ... (Your console logs remain here)

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      <OncallCreate
        leadId={leadId}
        combinedEnquiryId={combinedEnquiryId}
        customer={customer}
        site={site}
      />
    </div>
  );
}