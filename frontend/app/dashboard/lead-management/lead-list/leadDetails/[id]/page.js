
"use client"; // add this at the very top
import React from 'react';
import { useParams } from 'next/navigation';
import LeadDetails from '@/components/AMC/LeadDetails';

export default function LeadDetailsPage() {
  const { id } = useParams(); // matches the [id].js or [id]/page.js folder structure

  return (
    <div className="w-full h-screen">
      <LeadDetails leadId={id} />
    </div>
  );
}
