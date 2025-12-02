"use client";
import React from "react";

import Dashboard from "@/components/Dashboard/Dashboard";

export default function DashboardDataPage() {

  return (
    <div className="w-full h-screen bg-neutral-50">
      {/* Pass id as prop */}
      <Dashboard />
    </div>
  );
}
