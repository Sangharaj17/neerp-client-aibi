"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";

export default function AmcRenewalQuotationView({ params }) {
  const { quotationId , revision} = params;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {

        let url = `/api/amc/quotation/renewal/${quotationId}`;

        if(revision == true){
          url = `/api/amc/quotation/renewal/revise/${quotationId}`;
        }

        const res = await axiosInstance.get(`${url}`);
        setData(res.data);
      } catch (error) {
        console.error("Failed to fetch AMC quotation", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [quotationId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-600 font-medium">Failed to load quotation details.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">

        {/* Blue Header */}
        <div className="bg-blue-800 text-white p-6">
          <h1 className="text-3xl font-bold">
             {revision == true ? "Revised " : ""}
            Quotation Details
            </h1>
        </div>

        {/* Question Details */}
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            {revision == true ? "Revised " : ""}
            Question Details
            </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <DetailItem label="Question Date" value={data.quatationDate} fallback="2025-06-01" />
            <DetailItem label="Type of Contract" value={data.typeContract} fallback="Non-Comprehensive" />
            <DetailItem label="Make of Directive" value={data.makeOfElevator} fallback="ICNE" />
            <DetailItem label="No. of Services" value={data.noOfServices} fallback="11" />
            <DetailItem label="From Date" value={data.fromDate} fallback="2025-06-01" />
            <DetailItem label="To Date" value={data.toDate} fallback="2025-06-30" />
            <DetailItem label="Payment Term" value={data.paymentTerm} fallback="Quantity" />
          </div>
        </div>

        {/* Amount Sections */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 border-b">
          <AmountCard
            title="Non-Comprehensive"
            amount={data.amountOrdinary}
            gst={data.gstOrdinary}
            finalAmount={data.finalOrdinary}
          />
          <AmountCard
            title="Semi-Comprehensive"
            amount={data.amountSemiComp}
            gst={data.gstSemi}
            finalAmount={data.finalSemiComp}
          />
          <AmountCard
            title="Comprehensive"
            amount={data.amountComp}
            gst={data.gstComp}
            finalAmount={data.finalComp}
          />
        </div>

        {/* Completed Quotations Table */}
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Lift Details</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  {[
                    "Lift Name", "Type of Lift", "Amount Ordinary", "GST Ordinary", "Total Amount Ordinary",
                    "Amount Semi", "GST Semi", "Total Amount Semi", "Amount Comp", "GST Comp", "Total Amount Comp", "Capacity"
                  ].map((col) => (
                    <th key={col} className="border border-gray-300 p-2 text-left text-xs font-medium text-gray-500 uppercase">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.combinedQuotations?.length > 0 ? (
                  data.combinedQuotations.map((cq, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="border border-gray-300 p-2">{`Lift ${index + 1}`}</td>
                    <td className="border border-gray-300 p-2">{cq.typeOfElevators || "Manual"}</td>
                      <td className="border border-gray-300 p-2">{cq.amountOrdinary || "0.00"}</td>
                      <td className="border border-gray-300 p-2">{cq.gstOrdinary || "0.00"}</td>
                      <td className="border border-gray-300 p-2">{cq.totalAmountOrdinary || "0.00"}</td>
                      <td className="border border-gray-300 p-2">{cq.amountSemi || "0.00"}</td>
                      <td className="border border-gray-300 p-2">{cq.gstSemi || "0.00"}</td>
                      <td className="border border-gray-300 p-2">{cq.totalAmountSemi || "0.00"}</td>
                      <td className="border border-gray-300 p-2">{cq.amountComp || "0.00"}</td>
                      <td className="border border-gray-300 p-2">{cq.gstComp || "0.00"}</td>
                      <td className="border border-gray-300 p-2">{cq.totalAmountComp || "0.00"}</td>
                      <td className="border border-gray-300 p-2">{cq.capacity || "Person/204 kg"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="12" className="border border-gray-300 p-4 text-center">No completed quotations found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-100 p-4 border-t flex justify-between items-center">
          <span className="text-sm text-gray-500">Quotation Viewer</span>
          <span className="text-sm font-medium text-gray-700">Status: 03/2025</span>
        </div>
      </div>
    </div>
  );
}

// Reusable components
const DetailItem = ({ label, value, fallback }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-medium">{value || fallback}</p>
  </div>
);

const AmountCard = ({ title, amount, gst, finalAmount }) => (
  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 shadow-sm">
    <h3 className="font-semibold text-blue-800 mb-3">{title}</h3>
    <div className="space-y-2">
      <div className="flex justify-between">
        <span className="text-gray-600">Amount:</span>
        <span className="font-medium">{amount?.toFixed(2) || "0.00"}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">GST:</span>
        <span className="font-medium">{gst?.toFixed(2) || "0.00"}</span>
      </div>
      <div className="flex justify-between border-t pt-2">
        <span className="text-gray-600 font-semibold">Final:</span>
        <span className="font-bold text-blue-800">{finalAmount?.toFixed(2) || "0.00"}</span>
      </div>
    </div>
  </div>
);
