"use client";
import React, { Suspense } from "react";

import AddJobDetails from "@/components/Jobs/AddJobDetails";

export default function AddNewJobsPage() {

  return (
    <div className="w-full h-screen">
      {/* Pass id as prop */}
      <Suspense fallback={<div>Loading...</div>}>
        <AddJobDetails />
      </Suspense>
    </div>
  );
}
