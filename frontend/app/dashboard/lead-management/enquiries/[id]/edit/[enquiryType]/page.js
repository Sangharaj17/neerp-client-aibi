'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import EditEnquiryForm from "@/components/AMC/EditEnquiryForm";

function EditEnquiryTypePageContent() {
  const { enquiryType } = useParams(); // From folder segment: [enquiryType]
  const searchParams = useSearchParams();

  const enquiryTypeId = searchParams.get('enquiryTypeId');
  const enquiryTypeName = searchParams.get('enquiryTypeName');
  const customer = searchParams.get('customer');
  const site = searchParams.get('site');
  const action = searchParams.get('action');

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        {action} {enquiryTypeName || enquiryType} Enquiry
      </h1>

      <EditEnquiryForm
        enquiryTypeId={parseInt(enquiryTypeId)}
        enquiryTypeName={enquiryTypeName || enquiryType}
        customer={customer}
        site={site}
        action={action}
      />
    </div>
  );
}

export default function EditEnquiryTypePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <EditEnquiryTypePageContent />
    </Suspense>
  );
}
