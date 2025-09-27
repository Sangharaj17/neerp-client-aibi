
"use client"; // add this at the very top
import React from 'react';
import { useParams } from 'next/navigation';
import GridBoxComponent from '@/components/AMC/GridBoxComponent';

export default function LeadSettingPage() {
  const { id } = useParams(); // matches the [id].js or [id]/page.js folder structure

  return (
    <div className="w-full h-screen">
      <GridBoxComponent  />
    </div>
  );
}
