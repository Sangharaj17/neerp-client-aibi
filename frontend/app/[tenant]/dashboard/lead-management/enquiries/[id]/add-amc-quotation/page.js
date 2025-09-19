'use client';

import React from 'react';

import AmcQuotationForm from '@/components/AmcQuatation/AmcQuotationForm';
import { useParams } from 'next/navigation';

export default function AddAmcQuotationPage() {

   const {  tenant } = useParams();

  return (
    <div className="w-full h-screen">
      <AmcQuotationForm />
    </div>
  );
}
