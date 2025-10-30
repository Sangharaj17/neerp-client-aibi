
"use client"; // add this at the very top
import React from 'react';
import { useParams } from 'next/navigation';

import MaterialQuotationList from '@/components/Quatations/MaterialQuotationList';
export default function MaterialQuotationListPage() {

  return (
    <div className="w-full h-screen">
      <MaterialQuotationList />
    </div>
  );
}
