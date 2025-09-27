"use client";
import React, { Suspense } from "react";

import BreakdownTodoForm from "@/components/Jobs/BreakdownTodoForm";

export const dynamic = 'force-dynamic';
export default function AddNewJobsPage() {

  return (
    <div className="w-full h-screen">
      <Suspense fallback={<div className="p-4">Loading...</div>}>
        <BreakdownTodoForm />
      </Suspense>
    </div>
  );
}
