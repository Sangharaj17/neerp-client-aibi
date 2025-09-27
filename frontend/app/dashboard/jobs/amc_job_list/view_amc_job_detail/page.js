"use client";

import JobDetailPage from "@/components/Jobs/JobDetailPage";

export default function JobDetailPageWrapper() {
  let jobId = "";
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    jobId = params.get("jobId") || "";
  }

  return (
    <div className="w-full h-screen">
      {/* Pass jobId as prop */}
      <JobDetailPage jobId={jobId} />
    </div>
  );
}
