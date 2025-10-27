"use client";
import React from "react";

import AmcRenewalsTable from "@/components/Dashboard/AmcRenewalsTable";

export default function DashboardDataPage() {

  return (
    <div className="w-full h-screen">
      {/* Pass id as prop */}
      <AmcRenewalsTable  />
    </div>
  );
}
