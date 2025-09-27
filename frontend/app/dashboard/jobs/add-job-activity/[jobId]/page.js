"use client";
import React from "react";
import { useParams } from "next/navigation";

import AddJobActivityForm from "@/components/Jobs/AddJobActivityForm";

export default function AddNewJobsPage() {
  const params = useParams();
  const jobId = params.jobId; // assuming your route is like /jobs/[jobId]/add

  return (
    <div className="w-full h-screen">
      {/* Pass jobId as prop */}
      <AddJobActivityForm jobId={jobId} />
    </div>
  );
}
