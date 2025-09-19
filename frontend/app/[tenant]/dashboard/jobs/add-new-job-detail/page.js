"use client";
import React from "react";

import AddJobDetails from "@/components/Jobs/AddJobDetails";

export default function AddNewJobsPage() {

  return (
    <div className="w-full h-screen">
      {/* Pass id as prop */}
      <AddJobDetails  />
    </div>
  );
}
