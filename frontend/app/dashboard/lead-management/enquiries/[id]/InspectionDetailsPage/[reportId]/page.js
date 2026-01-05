"use client";

import React from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import InspectionReportTable from "@/components/Inspection/InspectionReportTable";
import { ArrowLeft, Home } from "lucide-react";

export default function InspectionDetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Path param
  const reportId = params.reportId;

  // Query params (NEW)
  const customer = searchParams.get("customer");
  const site = searchParams.get("site");

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Go Back"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>

            <div>
              <h1 className="text-lg font-bold text-gray-900">
                Report Viewer
              </h1>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                Digital Inspection Management
              </p>
            </div>
          </div>

         
        </div>
      </nav>


      {/* Main Table Component */}
      <div className="mt-4">
        {reportId ? (
          <InspectionReportTable
            reportId={reportId}
            customer={customer}
            site={site}
          />
        ) : (
          <div className="flex justify-center p-20">
            <p className="text-red-500">Invalid Report ID.</p>
          </div>
        )}
      </div>
    </main>
  );
}
