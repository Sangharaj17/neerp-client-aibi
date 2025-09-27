"use client";
import React from "react";

import BreakdownTodoForm from "@/components/Jobs/BreakdownTodoForm";
export default function AddNewJobsPage() {

  return (
    <div className="w-full h-screen">
      {/* Pass id as prop */}
      <BreakdownTodoForm  />
    </div>
  );
}
