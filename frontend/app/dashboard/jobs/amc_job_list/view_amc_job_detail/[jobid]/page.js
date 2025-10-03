"use client";

import JobDetailPage from "@/components/Jobs/JobDetailPage";
import { useParams } from "next/navigation";

export default function JobDetailPageWrapper() {
  const params = useParams();
  const { jobid } = params; // matches your folder [jobid] dynamic route

  return (
    <div className="w-full h-screen">
      {/* Pass jobId as prop */}
      <JobDetailPage jobId={jobid} />
    </div>
  );
}
