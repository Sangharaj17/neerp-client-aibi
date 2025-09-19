'use client';

import { useParams, useSearchParams } from 'next/navigation';
import AddAmcEnquiryForm from "@/components/AMC/AddAmcEnquiryForm";

export default function AddEnquiryTypePage() {
  const { enqType } = useParams(); // From folder name [enqType]
  const searchParams = useSearchParams();

  const enquiryTypeId = searchParams.get('enquiryTypeId');
  const enquiryTypeName = searchParams.get('enquiryTypeName');

    // Fetch query params
  const customer = encodeURIComponent(searchParams.get('customer') || '');
  const site = encodeURIComponent(searchParams.get('site') || '');
  const { id, tenant } = useParams();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Add {enquiryTypeName || enqType} Enquiry</h1>

      <AddAmcEnquiryForm
        enquiryTypeId={parseInt(enquiryTypeId)}
        enquiryTypeName={enquiryTypeName || enqType}
        customer={customer}
        site={site}
        leadId={id}
      />
    </div>
  );
}
