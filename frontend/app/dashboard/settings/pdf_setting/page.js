"use client";
import React from "react";

import AmcQuotationPdfSetting from "@/components/AmcQuatation/pdf/AmcQuotationPdfSetting";

export default function AMCQuotationPdfSettingPage() {
 
  return (
    <div className="w-full h-screen">
      {/* Pass id as prop */}
      <AmcQuotationPdfSetting />
    </div>
  );
}
