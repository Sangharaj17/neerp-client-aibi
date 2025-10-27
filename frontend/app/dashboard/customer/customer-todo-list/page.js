"use client";
import React from "react";

import CustomerSiteTodoList from "@/components/Customer/CustomerSiteTodoList";

export default function CustomerSiteTodoListPage() {

  return (
    <div className="w-full h-screen">
      {/* Pass id as prop */}
      <CustomerSiteTodoList  />
    </div>
  );
}
