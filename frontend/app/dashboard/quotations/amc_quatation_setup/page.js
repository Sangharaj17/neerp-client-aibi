
"use client"; // add this at the very top
import React from 'react';
import { useParams } from 'next/navigation';
import QuotationSetupComponent from '@/components/AmcQuatation/QuotationSetupComponent';

export default function AMCQuotationListPage() {

  return (
    <div className="w-full h-screen">
      <QuotationSetupComponent />
    </div>
  );
}
