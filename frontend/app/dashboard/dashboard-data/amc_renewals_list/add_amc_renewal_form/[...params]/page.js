"use client";
import React from "react";
import { useParams } from "next/navigation";
import AmcQuotationEditForm from "@/components/AmcQuatation/AmcQuotationEditForm";

export default function AMCRenewalAddPage() {
  const params = useParams();
  const allParams = params.params || []; // for catch-all route

  // Destructure the array safely
  const [quatationid, revised_quatation_id, amcJobId] = allParams;

  // Handle placeholders
  const original_qid = quatationid !== "0" ? quatationid : null;
  const revised_qid = revised_quatation_id !== "0" ? revised_quatation_id : null;
  const job_id = amcJobId !== "0" ? amcJobId : null;

  // Determine which ID to load
  const qid_for_form = revised_qid || original_qid;

  const isQuatationIdPresent = !!original_qid;
  const isRevisedQuatationIdPresent = !!revised_qid;

  return (
    <div className="w-full h-screen">
      <AmcQuotationEditForm
        quotationId={qid_for_form}
        amcJobId={job_id}
        isQuatationIdPresent={isQuatationIdPresent}
        isRevisedQuatationIdPresent={isRevisedQuatationIdPresent}
        rawOriginalQid={original_qid}
        rawRevisedQid={revised_qid}
        renewal={true}
      />
    </div>
  );
}
