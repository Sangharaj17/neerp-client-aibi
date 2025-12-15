"use client";
import React, { Suspense } from "react";

import AddPayment from "@/components/Jobs/AddPayment";

export default function AddPaymentPage() {

  return (
    <div className="w-full h-screen">
      {/* Pass id as prop */}
      <Suspense fallback={<div>Loading...</div>}>
        <AddPayment />
      </Suspense>
    </div>
  );
}
