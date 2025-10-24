"use client";
import React from "react";

import AmcInvoices from "@/components/Jobs/AmcInvoices";

export default function AddInvoicesPage() {

  return (
    <div className="w-full h-screen">
      {/* Pass id as prop */}
      <AmcInvoices  />
    </div>
  );
}
