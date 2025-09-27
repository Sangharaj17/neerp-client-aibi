"use client";
import React from "react";
import { useParams } from "next/navigation";
import RevisedQuotationList from "@/components/AmcQuatation/RevisedQuotationList";

export default function AMCQuotationReviseQuatationListPage() {
  const params = useParams();
  const { quotationId } = params; // <-- this gives you the quotation id from URL


  return (
    <div className="w-full h-screen">
      {/* Pass id as prop */}
      <RevisedQuotationList quotationId={quotationId} />
    </div>
  );
}
