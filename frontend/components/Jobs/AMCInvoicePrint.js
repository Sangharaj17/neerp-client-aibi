// components/AMCInvoicePrint.js (Final Code for Print Margins and Page Break)
'use client';

import { useState, useEffect } from 'react';
import axiosInstance from '@/utils/axiosInstance'; 

// Helper function to format currency
const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '0.00';
  return parseFloat(amount).toFixed(2);
};

const AMCInvoicePrint = ({ invoiceId = 1 }) => {
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/api/amc/invoices/amc-pdf-data/${invoiceId}`); 
        setInvoiceData(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching invoice data:", err);
        setError("Failed to fetch invoice data. Please check the API endpoint and CORS settings.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoiceData();
  }, [invoiceId]);

  if (loading) return <div className="w-full mx-auto p-4 text-center text-gray-700">Loading Invoice...</div>;
  if (error) return <div className="w-full mx-auto p-4 text-center text-red-600 font-bold">{error}</div>;
  if (!invoiceData) return <div className="w-full mx-auto p-4 text-center text-gray-700">No invoice data available.</div>;

  const data = invoiceData;

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
      {/* 1. AGGRESSIVE PRINT STYLES TO REMOVE MARGINS AND BROWSER HEADERS/FOOTERS */}
      <style jsx global>{`
        @media print {
          /* Force zero page margins for PDF/print */
          @page {
            size: A4; /* Standard paper size */
            margin: 0 !important; 
            padding: 0 !important;
          }
          /* Ensure the body and HTML start at the edge */
          body, html {
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden; /* Prevent scrollbar artifacts in print */
          }
        }
      `}</style>

      {/* 2. Main content wrapper: print:p-0 and print:shadow-none removes container padding */}
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
            Print Invoice
          </button>
        </div>
        
        {/* Main Title - Reduced margin */}
        <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-4">PAYMENT INVOICE</h1>

        {/* --- INVOICE TABLE --- */}
        <table className="w-full border-collapse border border-gray-400 text-sm">
          
          {/* Tax Invoice Header */}
          <thead>
            <tr>
              <th className="border border-gray-400 p-2 text-left w-1/2 bg-gray-50" colSpan="3"></th>
              <th className="border border-gray-400 p-2 text-center bg-gray-100 font-bold text-base text-gray-700" colSpan="3">
                TAX INVOICE
              </th>
            </tr>
          </thead>
          
          <tbody>
            {/* Company Details (Seller) and Invoice Details - BREAK AVOID */}
            <tr className="bg-gray-50 break-inside-avoid">
              <td className="border border-gray-400 py-2 px-3 align-top whitespace-normal" colSpan="3">
                <p className="font-bold text-lg text-blue-700 mb-1">{data.companyName}</p>
                <p className="text-xs space-y-0.5">
                  **Address**: {data.officeAddress || 'N/A'} <br />
                  **E-mail**: <span className="text-blue-600">{data.e_mail}</span> <br />
                  **Contact No**: {data.contact_No}
                </p>
              </td>
              <td className="border border-gray-400 py-2 px-3 align-top w-[25%] font-bold text-gray-600">
                <p>Invoice No.</p>
                <p>Dated</p>
                <p className="mt-2">Purchase Order No.</p>
                <p>Delivery Challan No.</p>
              </td>
              <td className="border border-gray-400 py-2 px-3 align-top w-[25%] font-semibold" colSpan="2">
                <p>{data.invoice_No}</p>
                <p>{data.dated}</p>
                <p className="mt-2">{data.purchaseOrderNo || 'N/A'}</p>
                <p>{data.deliveryChallanNo || 'N/A'}</p>
              </td>
            </tr>

            {/* GSTIN and Site Details (Buyer) - BREAK AVOID */}
            <tr className="break-inside-avoid">
              <td className="border border-gray-400 py-2 px-3 align-top bg-white whitespace-normal" colSpan="3">
                <p>**GSTIN/UIN**: <span className="font-bold text-gray-900">{data.gstin_UIN}</span></p>
                <p className="mt-2 text-xs">**Buyer Address**: {data.buyerAddress || 'N/A'}</p>
                <p className="text-xs">**Buyer GSTIN**: {data.gstin || 'N/A'}</p>
                <p className="text-xs">**Contact No**: {data.buyerContactNo || 'N/A'}</p>
              </td>
              <td className="border border-gray-400 py-2 px-3 align-top bg-white whitespace-normal" colSpan="3">
                <p className="font-bold text-gray-600">Site Name / Ship To:</p>
                <span className="font-bold text-gray-900">{data.sitename}</span>
                <p className="text-xs">{data.siteaddress || 'N/A'}</p>
              </td>
            </tr>

            {/* Particulars Table Header (6 Columns) - BREAK AVOID */}
            <tr className="bg-blue-50 font-extrabold text-center text-gray-700 break-inside-avoid">
              <td className={`border border-gray-400 p-2 ${colWidths.particulars}`}>Particulars</td>
              <td className={`border border-gray-400 p-2 ${colWidths.hsn}`}>HSN/SAC</td>
              <td className={`border border-gray-400 p-2 ${colWidths.qty}`}>Quantity</td>
              <td className={`border border-gray-400 p-2 ${colWidths.rate}`}>Rate</td>
              <td className={`border border-gray-400 p-2 ${colWidths.per}`}>Per</td>
              <td className={`border border-gray-400 p-2 ${colWidths.amount}`}>Amount</td>
            </tr>

            {/* Particulars Row - BREAK AVOID */}
            <tr className="break-inside-avoid">
              <td className="border border-gray-400 p-2 align-top">
                {data.particulars.split('\n').map((item, index) => (
                  <div key={index} className="text-gray-700 whitespace-normal">{item}</div>
                ))}
              </td>
              <td className="border border-gray-400 p-2 text-center align-top">{data.hsn_SAC}</td>
              <td className="border border-gray-400 p-2 text-center align-top">{data.quantity}</td>
              <td className="border border-gray-400 p-2 text-right align-top">{formatCurrency(data.rate)}</td>
              <td className="border border-gray-400 p-2 text-center align-top">{data.per || '0'}</td>
              <td className="border border-gray-400 p-2 text-right align-top font-bold text-gray-800">{formatCurrency(data.amount)}</td>
            </tr>

            {/* Sub Total Row - BREAK AVOID */}
            <tr className="break-inside-avoid">
              {/* Spans 4 columns (Particulars, HSN, Qty, Rate) */}
              <td className="border border-gray-400 py-1 px-2 align-top text-xs text-gray-500" colSpan="4">
                <p className="font-bold text-gray-700">Amount Chargeable (in words):</p>
                <p className="italic text-base font-semibold whitespace-normal">{data.amountChargeableInWords}</p>
              </td>
              {/* Spans 1 column (Per) */}
              <td className="border border-gray-400 py-1 px-2 align-top font-bold text-right bg-gray-50" colSpan="1">Sub Total</td>
              {/* The Amount column */}
              <td className="border border-gray-400 py-1 px-2 align-top text-right font-bold bg-gray-50 text-gray-800">{formatCurrency(data.subTotal)}</td>
            </tr>

            {/* Tax Breakdown - BREAK AVOID */}
            <tr className="break-inside-avoid">
              {/* RowSpan 3 columns for Bank Details, spanning 4 columns wide */}
              <td className="border border-gray-400 py-1 px-2 align-top" rowSpan="3" colSpan="4">
                <p className="mt-1 font-bold text-gray-700">Bank Details:</p>
                <p className="text-xs leading-5">**Name**: {data.name}</p>
                <p className="text-xs leading-5">**A/C Number**: <span className="font-bold">{data.accountNumber}</span></p>
                <p className="text-xs leading-5">**Branch**: {data.branch}</p>
                <p className="text-xs leading-5">**IFSC CODE**: <span className="font-bold">{data.ifsc_CODE}</span></p>
              </td>
              {/* Spans 1 column (Per) */}
              <td className="border border-gray-400 p-1 text-right text-xs bg-gray-50" colSpan="1">{data.cgst_Str}</td>
              {/* The Amount column */}
              <td className="border border-gray-400 p-1 text-right text-xs font-semibold bg-gray-50">{formatCurrency(data.cgst_Amount)}</td>
            </tr>
            
            <tr className="break-inside-avoid">
              <td className="border border-gray-400 p-1 text-right text-xs bg-gray-50" colSpan="1">{data.sgst_Str}</td>
              <td className="border border-gray-400 p-1 text-right text-xs font-semibold bg-gray-50">{formatCurrency(data.sgst_Amount)}</td>
            </tr>
            <tr className="break-inside-avoid">
              <td className="border border-gray-400 p-1 text-right text-xs bg-gray-50" colSpan="1">Rounded off</td>
              <td className="border border-gray-400 p-1 text-right text-xs font-semibold bg-gray-50">{formatCurrency(data.roundOffValue)}</td>
            </tr>

            {/* Grand Total - BREAK AVOID */}
            <tr className="bg-blue-100 font-extrabold text-lg text-gray-900 border-t-2 border-blue-500 break-inside-avoid">
              {/* Spans 4 columns (Particulars, HSN, Qty, Rate) */}
              <td className="border border-gray-400 p-2 text-right" colSpan="4">GRAND TOTAL</td>
              
              {/* Spans 1 column (Per) - E. & O. E. */}
              <td className="border border-gray-400 p-2 text-center text-xs font-normal" colSpan="1">E. & O. E.</td>
              
              {/* The Grand Total AMOUNT in the final column (Amount) */}
              <td className="border border-gray-400 p-2 text-right">{formatCurrency(data.grandTotal)}</td>
            </tr>

            {/* Declaration and Signature - BREAK AVOID */}
            <tr className="break-inside-avoid">
              {/* Declaration spanning 3 columns */}
              <td className="border border-gray-400 py-2 px-3 align-top whitespace-normal" colSpan="3">
                <p className="font-bold text-gray-700 mb-1">Declaration</p>
                <p className="text-xs italic text-gray-600">We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.</p>
                <p className="text-[10px] mt-4 italic text-gray-500">This is computer generated invoice no signature required</p>
              </td>
              {/* Signature block spanning 3 columns */}
              <td className="border border-gray-400 py-2 px-3 align-top text-right" colSpan="3">
                <p className="font-bold text-gray-800 mb-8">For {data.for}</p>
                <p className="text-center mt-2 border-t border-gray-500 pt-1 text-xs font-semibold">Authorised Signatory</p>
              </td>
            </tr>
          </tbody>
        </table>
        
        {/* Close button for the modal preview (outside the table) */}
        <div className="flex justify-end pt-4 print:hidden">
          <button
            className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Close Preview
          </button>
        </div>
      </div>
    </>
  );
};

export default AMCInvoicePrint;