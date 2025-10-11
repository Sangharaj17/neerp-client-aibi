"use client";

import RenewalJobDetailPage from "@/components/Jobs/RenewalJobDetailPage";
import { useParams } from "next/navigation";

export default function JobDetailPageWrapper() {
  const params = useParams();
  const { jobid } = params; // matches your folder [jobid] dynamic route

  return (
    <div className="w-full h-screen">
      {/* Pass jobId as prop */}
      <RenewalJobDetailPage jobId={jobid} />
    </div>
  );
}
