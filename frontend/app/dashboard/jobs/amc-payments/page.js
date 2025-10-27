"use client";
import React from "react";

import PaymentsList from "@/components/Jobs/PaymentsList";

export default function AddInvoicesPage() {

  return (
    <div className="w-full h-screen">
      {/* Pass id as prop */}
      <PaymentsList  />
    </div>
  );
}
