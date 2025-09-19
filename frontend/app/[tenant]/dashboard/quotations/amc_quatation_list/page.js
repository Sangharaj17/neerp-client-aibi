
"use client"; // add this at the very top
import React from 'react';
import { useParams } from 'next/navigation';
import AMCQuotationList from '@/components/AmcQuatation/AMCQuotationList';

export default function AMCQuotationListPage() {

  return (
    <div className="w-full h-screen">
      <AMCQuotationList />
    </div>
  );
}
