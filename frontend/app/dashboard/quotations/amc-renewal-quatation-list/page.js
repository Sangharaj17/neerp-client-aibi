"use client";
import React from "react";
import { useParams } from "next/navigation";

import AMCRenewalQuotationList from "@/components/AmcQuatation/AMCRenewalQuotationList";

export default function AMCRenewalQuatationListPage() {
  
  return (
    <div className="w-full h-screen">
      {/* Pass id as prop */}
      <AMCRenewalQuotationList />
    </div>
  );
}
