"use client";
import React from "react";

import AddJobActivityForm from "@/components/Jobs/AddJobActivityForm";

export default function AddNewJobsPage() {

  return (
    <div className="w-full h-screen">
      {/* Pass id as prop */}
      <AddJobActivityForm  />
    </div>
  );
}
