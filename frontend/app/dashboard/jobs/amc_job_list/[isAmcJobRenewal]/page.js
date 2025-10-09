"use client";
import React from "react";

import AmcJobList from "@/components/Jobs/AmcJobList";
import { useParams } from "next/navigation";

export default function AmcJobListPage() {

  const params = useParams();
    const { isAmcJobRenewal } = params; // matches your folder [jobid] dynamic route
  

  return (
    <div className="w-full h-screen">
      {/* Pass id as prop */}
      <AmcJobList  isAmcJobRenewal  = {isAmcJobRenewal}/>
    </div>
  );
}
