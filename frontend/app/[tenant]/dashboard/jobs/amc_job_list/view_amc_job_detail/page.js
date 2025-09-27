"use client";

import { useSearchParams } from "next/navigation";
import JobDetailPage from "@/components/Jobs/JobDetailPage";

export default function JobDetailPageWrapper() {
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId"); // Get jobId from URL

  return (
    <div className="w-full h-screen">
      {/* Pass jobId as prop */}
      <JobDetailPage jobId={jobId} />
    </div>
  );
}
