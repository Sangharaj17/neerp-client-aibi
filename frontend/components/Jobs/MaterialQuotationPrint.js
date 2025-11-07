'use client';

import { useState, useEffect } from 'react';
import axiosInstance from '@/utils/axiosInstance'; 

// Helper function to format currency
const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(parseFloat(amount))) return '0.00';
  return parseFloat(amount).toFixed(2);
};

const MaterialQuotationPrint = ({ quotationId = 1  , onCancel}) => { // Changed prop name to quotationId
  const [quotationData, setQuotationData] = useState(null); // Changed state name
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuotationData = async () => {
      try {
        setLoading(true);
        // --- API Endpoint Change ---
        const apiUrl = `/api/amc/material-quotation/getMaterialRepairQuatationPdfData/${quotationId}`;
        const response = await axiosInstance.get(apiUrl); 
        // --- End API Endpoint Change ---
        setQuotationData(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching material quotation data:", err);
        setError("Failed to fetch material quotation data. Please check the API endpoint and CORS settings.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuotationData();
  }, [quotationId]); // Changed dependency

  if (loading) return <div className="w-full mx-auto p-4 text-center text-gray-700">Loading Quotation...</div>;
  if (error) return <div className="w-full mx-auto p-4 text-center text-red-600 font-bold">{error}</div>;
  if (!quotationData) return <div className="w-full mx-auto p-4 text-center text-gray-700">No quotation data available.</div>;

  const data = quotationData;

  const colWidths = {
    particulars: 'w-[35%]',
    hsn: 'w-[10%]',
    qty: 'w-[8%]',
    rate: 'w-[15%]',
    per: 'w-[8%]',
    amount: 'w-[24%]',
  };

  return (
    <>
      {/* AGGRESSIVE PRINT STYLES TO REMOVE MARGINS AND BROWSER HEADERS/FOOTERS (Kept for one-page fix) */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 0 !important; 
            padding: 0 !important;
          }
          body, html {
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden; 
          }
        }
      `}</style>

      <div className="w-full mx-auto p-4 bg-white shadow-2xl font-sans text-gray-800 print:p-0 print:shadow-none print:bg-transparent">
        
        {/* Header (Print Controls) */}
        <div className="mb-6 border-b border-gray-200 pb-3 print:hidden flex justify-between items-center">
          <div className="text-xl font-light text-gray-500">
            <a href="#" className="text-blue-600 hover:underline">
              <span className="font-semibold">Back To List</span> &gt;&gt;
            </a>
          </div>
          <button 
            onClick={() => window.print()}
            className="py-1 px-4 border border-blue-500 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition duration-150 text-sm font-medium"
          >
            Print Quotation
          </button>
        </div>
        
        {/* Main Title - Changed to QUOTATION */}
        <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-4">MATERIAL REPAIR QUOTATION</h1>

        {/* --- QUOTATION TABLE --- */}
        <table className="w-full border-collapse border border-gray-400 text-sm">
          
          {/* Tax Invoice Header - Changed to QUOTATION */}
          <thead>
            <tr>
              <th className="border border-gray-400 p-2 text-left w-1/2 bg-gray-50" colSpan="3"></th>
              <th className="border border-gray-400 p-2 text-center bg-gray-100 font-bold text-base text-gray-700" colSpan="3">
                QUOTATION
              </th>
            </tr>
          </thead>
          
          <tbody>
            {/* Company Details (Seller) and Quotation Details */}
            <tr className="bg-gray-50 break-inside-avoid">
              <td className="border border-gray-400 py-2 px-3 align-top whitespace-normal" colSpan="3">
                <p className="font-bold text-lg text-blue-700 mb-1">{data.companyName}</p>
                <p className="text-xs space-y-0.5">
                  **Address**: {data.officeAddress || 'N/A'} <br />
                  {/* --- Key Name Change: e_mail -> email --- */}
                  **E-mail**: <span className="text-blue-600">{data.email}</span> <br /> 
                  {/* --- Key Name Change: contact_No -> contactNo --- */}
                  **Contact No**: {data.contactNo}
                </p>
              </td>
              <td className="border border-gray-400 py-2 px-3 align-top w-[25%] font-bold text-gray-600">
                <p>Quotation No.</p>
                <p>Dated</p>
                <p className="mt-2">Purchase Order No.</p>
                <p>P.O. Dated</p> {/* Added Purchase Order Dated */}
              </td>
              <td className="border border-gray-400 py-2 px-3 align-top w-[25%] font-semibold" colSpan="2">
                {/* --- Key Name Change: invoice_No -> invoiceNo --- */}
                <p>{data.invoiceNo}</p> 
                <p>{data.dated}</p>
                <p className="mt-2">{data.purchaseOrderNo || 'N/A'}</p>
                {/* --- Key Name Change: purchaseOrderNoDated --- */}
                <p>{data.purchaseOrderNoDated || 'N/A'}</p> 
              </td>
            </tr>

            {/* GSTIN and Site Details (Buyer) - Added new row for Delivery Challan */}
            <tr className="break-inside-avoid">
                <td className="border border-gray-400 py-2 px-3 align-top bg-white whitespace-normal" colSpan="3">
                    <p>**GSTIN/UIN**: <span className="font-bold text-gray-900">{data.gstin_UIN || 'N/A'}</span></p>
                    <p className="mt-2 text-xs">**Buyer Address**: {data.buyerAddress || 'N/A'}</p>
                    <p className="text-xs">**Buyer GSTIN**: {data.gstin || 'N/A'}</p>
                    <p className="text-xs">**Contact No**: {data.buyerContactNo || 'N/A'}</p>
                </td>
                <td className="border border-gray-400 py-2 px-3 align-top bg-white whitespace-normal" colSpan="3">
                    <p className="font-bold text-gray-600">Site Name / Ship To:</p>
                    {/* --- Key Name Change: sitename -> siteName --- */}
                    <span className="font-bold text-gray-900">{data.siteName}</span> 
                    {/* --- Key Name Change: siteaddress -> siteAddress --- */}
                    <p className="text-xs">{data.siteAddress || 'N/A'}</p>
                    <p className="text-xs mt-2">**Delivery Challan No**: {data.deliveryChallanNo || 'N/A'}</p>
                    <p className="text-xs">**D.C. Dated**: {data.deliveryChallanNoDated || 'N/A'}</p>
                </td>
            </tr>

            {/* Particulars Table Header (6 Columns) */}
            <tr className="bg-blue-50 font-extrabold text-center text-gray-700 break-inside-avoid">
              <td className={`border border-gray-400 p-2 ${colWidths.particulars}`}>Particulars</td>
              <td className={`border border-gray-400 p-2 ${colWidths.hsn}`}>HSN/SAC</td>
              <td className={`border border-gray-400 p-2 ${colWidths.qty}`}>Quantity</td>
              <td className={`border border-gray-400 p-2 ${colWidths.rate}`}>Rate</td>
              <td className={`border border-gray-400 p-2 ${colWidths.per}`}>Per</td>
              <td className={`border border-gray-400 p-2 ${colWidths.amount}`}>Amount</td>
            </tr>

            {/* Particulars Rows (Looping over materialDetails) */}
            {data.materialDetails && data.materialDetails.length > 0 ? (
              data.materialDetails.map((item, index) => (
                <tr key={index} className="break-inside-avoid">
                  <td className="border border-gray-400 p-2 align-top">
                    <div className="text-gray-700 whitespace-normal">{item.particulars}</div>
                  </td>
                  {/* --- Using keys from materialDetails array objects --- */}
                  <td className="border border-gray-400 p-2 text-center align-top">{item.hsnSac}</td>
                  <td className="border border-gray-400 p-2 text-center align-top">{item.quantity}</td>
                  <td className="border border-gray-400 p-2 text-right align-top">{formatCurrency(item.rate)}</td>
                  <td className="border border-gray-400 p-2 text-center align-top">{item.per || '0'}</td>
                  <td className="border border-gray-400 p-2 text-right align-top font-bold text-gray-800">{formatCurrency(item.amount)}</td>
                </tr>
              ))
            ) : (
              <tr className="break-inside-avoid h-16">
                <td className="border border-gray-400 p-2 text-center text-gray-500" colSpan="6">No Material Details provided.</td>
              </tr>
            )}

            {/* Empty Spacer Rows (Optional: to fill up space if needed) */}
            {/* Note: In a real-world scenario, you might conditionally render a few empty rows here to fill an A4 page */}

            {/* Sub Total Row */}
            <tr className="break-inside-avoid">
              {/* Spans 4 columns (Particulars, HSN, Qty, Rate) - Blank Filler */}
              <td className="border border-gray-400 py-1 px-2 align-top text-xs text-gray-500 bg-white" colSpan="4">
                {/* Empty spacer */}
              </td>
              {/* Spans 1 column (Per) */}
              <td className="border border-gray-400 py-1 px-2 align-top font-bold text-right bg-gray-50" colSpan="1">Sub Total</td>
              {/* The Amount column */}
              <td className="border border-gray-400 py-1 px-2 align-top text-right font-bold bg-gray-50 text-gray-800">{formatCurrency(data.subTotal)}</td>
            </tr>

            {/* Tax Breakdown */}
            <tr className="break-inside-avoid">
              {/* RowSpan 3 columns for Bank Details, spanning 4 columns wide */}
              <td className="border border-gray-400 py-1 px-2 align-top" rowSpan="3" colSpan="4">
                <p className="mt-1 font-bold text-gray-700">Bank Details:</p>
                <p className="text-xs leading-5">**Name**: {data.name || 'N/A'}</p>
                <p className="text-xs leading-5">**A/C Number**: <span className="font-bold">{data.accountNumber || 'N/A'}</span></p>
                <p className="text-xs leading-5">**Branch**: {data.branch || 'N/A'}</p>
                {/* --- Key Name Change: ifsc_CODE -> ifscCode --- */}
                <p className="text-xs leading-5">**IFSC CODE**: <span className="font-bold">{data.ifscCode || 'N/A'}</span></p>
              </td>
              {/* Spans 1 column (Per) */}
              {/* --- Key Name Change: cgst_Str -> cgstStr --- */}
              <td className="border border-gray-400 p-1 text-right text-xs bg-gray-50" colSpan="1">{data.cgstStr}</td>
              {/* The Amount column */}
              {/* --- Key Name Change: cgst_Amount -> cgstAmount --- */}
              <td className="border border-gray-400 p-1 text-right text-xs font-semibold bg-gray-50">{formatCurrency(data.cgstAmount)}</td>
            </tr>
            
            <tr className="break-inside-avoid">
              {/* --- Key Name Change: sgst_Str -> sgstStr --- */}
              <td className="border border-gray-400 p-1 text-right text-xs bg-gray-50" colSpan="1">{data.sgstStr}</td>
              {/* --- Key Name Change: sgst_Amount -> sgstAmount --- */}
              <td className="border border-gray-400 p-1 text-right text-xs font-semibold bg-gray-50">{formatCurrency(data.sgstAmount)}</td>
            </tr>
            <tr className="break-inside-avoid">
              <td className="border border-gray-400 p-1 text-right text-xs bg-gray-50" colSpan="1">Rounded off</td>
              <td className="border border-gray-400 p-1 text-right text-xs font-semibold bg-gray-50">{formatCurrency(data.roundOffValue)}</td>
            </tr>

            {/* Grand Total */}
            <tr className="bg-blue-100 font-extrabold text-lg text-gray-900 border-t-2 border-blue-500 break-inside-avoid">
              {/* Cell 1: Amount in Words (ColSpans 4 columns) - White background to contrast */}
              <td className="border border-gray-400 py-1 px-2 align-top text-xs text-gray-500 bg-white" colSpan="4">
                <p className="font-bold text-gray-700">Amount Chargeable (in words):</p>
                <p className="italic text-base font-semibold whitespace-normal">{data.amountChargeableInWords}</p>
              </td>
              
              {/* Cell 2: GRAND TOTAL label (ColSpans 1 column) - Blue background */}
              <td className="border border-gray-400 p-2 text-right" colSpan="1">GRAND TOTAL</td>
              
              {/* Cell 3: Grand Total Amount (ColSpans 1 column, final column) - Blue background */}
              <td className="border border-gray-400 p-2 text-right">
                {formatCurrency(data.grandTotal)}
              </td>
            </tr>

            {/* Declaration and Signature */}
            <tr className="break-inside-avoid">
              {/* Declaration spanning 3 columns */}
              <td className="border border-gray-400 py-2 px-3 align-top whitespace-normal" colSpan="3">
                <p className="font-bold text-gray-700 mb-1">Terms & Conditions / Declaration</p>
                <p className="text-xs italic text-gray-600">The above price is valid for 30 days. Payment is due upon receipt of the final invoice. We declare that this quotation shows the actual price of the goods described and that all particulars are true and correct.</p>
                <p className="text-[10px] mt-4 italic text-gray-500">This is computer generated quotation, no signature required</p>
              </td>
              {/* Signature block spanning 3 columns */}
              <td className="border border-gray-400 py-2 px-3 align-top text-right" colSpan="3">
                {/* --- Key Name Change: for -> forCompany --- */}
                <p className="font-bold text-gray-800 mb-8">For {data.forCompany}</p>
                <p className="text-center mt-2 border-t border-gray-500 pt-1 text-xs font-semibold">Authorised Signatory</p>
              </td>
            </tr>
          </tbody>
        </table>
        
        {/* Close button for the modal preview (outside the table) */}
        <div className="flex justify-end pt-4 print:hidden">
          <button
            onClick={onCancel}
            className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Close Preview
          </button>
        </div>
      </div>
    </>
  );
};

export default MaterialQuotationPrint;