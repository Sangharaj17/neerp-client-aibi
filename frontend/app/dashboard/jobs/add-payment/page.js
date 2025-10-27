"use client";
import React from "react";

import AddPayment from "@/components/Jobs/AddPayment";

export default function AddPaymentPage() {

  return (
    <div className="w-full h-screen">
      {/* Pass id as prop */}
      <AddPayment  />
    </div>
  );
}
