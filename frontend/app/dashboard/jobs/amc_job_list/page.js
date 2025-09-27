"use client";
import React from "react";

import AmcJobList from "@/components/Jobs/AmcJobList";

export default function AddNewJobsPage() {

  return (
    <div className="w-full h-screen">
      {/* Pass id as prop */}
      <AmcJobList  />
    </div>
  );
}
