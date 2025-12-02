"use client";
import React from "react";

import SiteExpenseDashboard from "@/components/SiteExpenses/SiteExpenseDashboard";

export default function SiteExpencesPage() {
 
  return (
    <div className="w-full h-screen">
      {/* Pass id as prop */}
      <SiteExpenseDashboard />
    </div>
  );
}
