"use client";
import React, { Suspense } from "react";

import BreakdownTodoForm from "@/components/Jobs/BreakdownTodoForm";

export default function AddNewJobsPage() {
  return (
    <div className="w-full h-screen">
      {/* Pass id as prop */}
      <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
        <BreakdownTodoForm  />
      </Suspense>
    </div>
  );
}
