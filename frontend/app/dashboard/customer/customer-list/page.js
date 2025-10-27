"use client";
import React from "react";

import CustomerList from "@/components/Customer/CustomerList";

export default function CustomerSiteTodoListPage() {

  return (
    <div className="w-full h-screen">
      {/* Pass id as prop */}
      <CustomerList  />
    </div>
  );
}
