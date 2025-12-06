// src/app/inspection/report/page.jsx (or InspectionReportPage.jsx)
"use client";

import React from 'react';
import { useSearchParams } from 'next/navigation'; // Use 'next/navigation' for App Router
import InspectionReportSystem from '@/components/Inspection/InspectionReportSystem';

export default function InspectionReportPage() {
  const searchParams = useSearchParams();

  // 1. Get props from the URL query parameters
  const combinedEnquiryId = searchParams.get('combinedEnquiryId');
  const reportId = searchParams.get('reportId');
  const mode = searchParams.get('mode') || 'view'; // Default to 'view' if mode is not passed

  // Function to handle the 'Back' action, typically handled by router.back() or a specific redirect
  const handleBack = () => {
    // This will take the user back to the previous page (the modal page)
    window.history.back();
    // If you need to navigate to a specific list page instead:
    // router.push('/path/to/report/list');
  };

  if (!combinedEnquiryId && !reportId) {
    // Optional: Handle case where required parameters are missing
    return (
      <div className="p-8 text-center">
        <p>Report parameters are missing. Please go back to the list.</p>
        <button onClick={handleBack} className="mt-4 p-2 bg-blue-500 text-white rounded">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-screen">
      <InspectionReportSystem
        combinedEnquiryId={combinedEnquiryId}
        reportId={reportId}
        mode={mode}
        onBack={handleBack} // Pass the 'onBack' function as a prop
      />
    </div>
  );
}