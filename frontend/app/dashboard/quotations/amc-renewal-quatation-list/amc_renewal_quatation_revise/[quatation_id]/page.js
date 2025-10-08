"use client";
import React from "react";
import { useParams } from "next/navigation";
import AmcQuotationEditForm from "@/components/AmcQuatation/AmcQuotationEditForm";

export default function AMCRenewalQuotationEditPage() {
  const params = useParams();
  const { quatation_id } = params; // <-- this gives you the quotation id from URL

  return (
    <div className="w-full h-screen">
      {/* Pass id as prop */}
      <AmcQuotationEditForm quotationId={quatation_id} renewalRevise={true}/>
    </div>
  );
}
