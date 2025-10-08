"use client";
import React from "react";
import { useParams } from "next/navigation";

import RevisedRenewalQuotationList from "@/components/AmcQuatation/RevisedRenewalQuotationList";

export default function AMCRenewalRevisedQuatationListPage() {
  const params = useParams();
  const { quotationId } = params; // <-- this gives you the quotation id from URL


  return (
    <div className="w-full h-screen">
      {/* Pass id as prop */}
      <RevisedRenewalQuotationList quotationId={quotationId} />
    </div>
  );
}
