"use client";
import React from "react";
import { useParams } from "next/navigation";
import AmcQuotationEditForm from "@/components/AmcQuatation/AmcQuotationEditForm";

export default function AMCRenewalQuotationRevisionPage() {
  const params = useParams();
  const { revised_quatation_id , quotationId} = params; // <-- this gives you the quotation id from URL

  return (
    <div className="w-full h-screen">
      {/* Pass id as prop */}
      <AmcQuotationEditForm quotationId={revised_quatation_id} 
      qid = {quotationId} renewalRevision = {true}/>
    </div>
  );
}
