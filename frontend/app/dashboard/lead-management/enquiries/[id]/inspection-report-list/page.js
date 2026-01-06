'use client';

import React from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import InspectionReportsList from '@/components/Inspection/InspectionReportsList';

export default function InspectionReportListPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  // dynamic route param
  const { id } = params;

  // query params from URL
  const selectedCombinedEnquiryId = searchParams.get('combinedEnquiryId');
  const customerFromSearchParam = searchParams.get('customer');
  const siteFromSearchParam = searchParams.get('site');

  const handleSelectReport = (reportId, mode) => {

    // Common params for create / edit
    const queryParams = new URLSearchParams({
      combinedEnquiryId: selectedCombinedEnquiryId,
      mode: mode,
    }).toString();

    // ✅ VIEW MODE
    if (mode === 'view' && reportId) {

      const viewParams = new URLSearchParams({
        customer: customerFromSearchParam,
        site: siteFromSearchParam,
      }).toString();

      router.push(
        `/dashboard/lead-management/enquiries/${id}/InspectionDetailsPage/${reportId}?${viewParams}`
      );

    } else {

      // ✅ CREATE / EDIT MODE
      router.push(
        `/dashboard/lead-management/enquiries/${id}/inspection-report?reportId=${reportId || ''}&${queryParams}`
      );
    }
  };

  return (
    <div className="w-full h-screen">
      <InspectionReportsList
        combinedEnquiryId={selectedCombinedEnquiryId}
        onSelectReport={handleSelectReport}
        customer={customerFromSearchParam}
        site={siteFromSearchParam}
      />
    </div>
  );
}
