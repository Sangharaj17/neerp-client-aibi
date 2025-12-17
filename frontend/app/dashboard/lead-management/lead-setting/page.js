
"use client"; // add this at the very top
import React from 'react';
import { useParams } from 'next/navigation';
import GridBoxComponent from '@/components/AMC/GridBoxComponent';
import PageHeader from '@/components/UI/PageHeader';

export default function LeadSettingPage() {
  const { id } = useParams(); // matches the [id].js or [id]/page.js folder structure

  return (
    <div className="min-h-screen bg-white">
      <PageHeader title="Lead Settings" description="Configure lead management options" />
      <div className="px-6 py-5">
        <GridBoxComponent />
      </div>
    </div>
  );
}
