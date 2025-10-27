"use client";
import React from "react";
import { useParams } from "next/navigation";

import AddRenewalJobActivityForm from "@/components/Jobs/AddRenewalJobActivityForm";

export default function AddNewJobsPage() {
  const params = useParams();
  const renewalJobId = params.renewalJobId; // assuming your route is like /jobs/[jobId]/add

  return (
    <div className="w-full h-screen">
      {/* Pass jobId as prop */}
      <AddRenewalJobActivityForm renewalJobId={renewalJobId} />
    </div>
  );
}
