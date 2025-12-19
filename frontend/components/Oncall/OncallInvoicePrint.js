'use client';

import { useState, useEffect } from 'react';
import axiosInstance from '@/utils/axiosInstance';

const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(parseFloat(amount))) return '0.00';
  return parseFloat(amount).toFixed(2);
};

// Component name changed from ModernizationInvoicePrint to OncallInvoicePrint
const OncallInvoicePrint = ({ invoiceId = 2, onBackToList }) => { // invoiceId should be onCallId now
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Base API path
  const API_BASE_PATH = '/api/oncall';

  useEffect(() => {
    const fetchInvoiceData = async () => {
      if (!invoiceId) {
        setError('Invoice ID (onCallId) missing.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // API path updated to the new Oncall endpoint: /api/oncall/invoice/{onCallId}
        const response = await axiosInstance.get(`${API_BASE_PATH}/invoice/${invoiceId}`);
        setInvoiceData(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching oncall invoice data:', err);
        setError('Failed to fetch oncall invoice data.');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoiceData();
  }, [invoiceId]);

  if (loading)
    return <div className="w-full mx-auto p-4 text-center text-gray-700">Loading Oncall Invoice...</div>;
  if (error)
    return <div className="w-full mx-auto p-4 text-center text-red-600 font-bold">{error}</div>;
  if (!invoiceData)
    return <div className="w-full mx-auto p-4 text-center text-gray-700">No oncall invoice data available.</div>;

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
      {/* PRINT STYLES */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 0 !important;
            padding: 0 !important;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>

      <div className="w-full max-w-[210mm] mx-auto p-4 bg-white shadow-xl font-sans text-gray-800 print:shadow-none print:p-0">
        {/* Header (Print Controls) */}
        <div className="mb-4 border-b border-gray-300 pb-3 print:hidden flex justify-between items-center">
          <button
            type="button"
            onClick={onBackToList}
            className="text-blue-600 hover:underline text-sm font-semibold"
          >
            Back To List &gt;&gt;
          </button>

          <button
            onClick={() => window.print()}
            className="py-1.5 px-4 border border-blue-500 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition text-sm font-medium"
          >
            Print Invoice
          </button>
        </div>

        {/* Main Title (Updated text) */}
        <h1 className="text-2xl font-extrabold text-center text-gray-900 mb-3 tracking-wide">
          ONCALL INVOICE {/* Text updated */}
        </h1>

        {/* Invoice Table */}
        <table className="w-full border border-gray-400 border-collapse text-sm">
          <thead>
            <tr>
              <th colSpan="3" className="border border-gray-400 bg-gray-50 p-2"></th>
              <th
                colSpan="3"
                className="border border-gray-400 p-2 text-center bg-gray-100 font-bold text-base text-gray-700"
              >
                TAX INVOICE
              </th>
            </tr>
          </thead>

          <tbody>
            {/* Seller & Invoice Details */}
            <tr className="bg-gray-50">
              <td colSpan="3" className="border border-gray-400 p-3 align-top">
                <p className="font-bold text-blue-700 text-base mb-1">{data.companyName}</p>
                <p className="text-xs leading-5">
                  <strong>Address:</strong> {data.officeAddress || 'N/A'} <br />
                  <strong>E-mail:</strong>{' '}
                  <span className="text-blue-600">{data.email}</span> <br />
                  <strong>Contact No:</strong> {data.contactNo}
                </p>
              </td>
              <td className="border border-gray-400 p-3 align-top font-bold text-gray-600 w-[25%]">
                <p>Invoice No.</p>
                <p>Dated</p>
                <p className="mt-2">Purchase Order No.</p>
                <p>Delivery Challan No.</p>
              </td>
              <td colSpan="2" className="border border-gray-400 p-3 align-top w-[25%] font-semibold">
                <p>{data.invoiceNo}</p>
                <p>{data.dated}</p>
                <p className="mt-2">{data.purchaseOrderNo || 'N/A'}</p>
                <p>{data.deliveryChallanNo || 'N/A'}</p>
              </td>
            </tr>

            {/* GSTIN & Buyer Details */}
            <tr>
              <td colSpan="3" className="border border-gray-400 p-3 align-top bg-white">
                <p className="text-xs">
                  <strong>GSTIN/UIN:</strong> {data.gstin_UIN || 'N/A'}
                </p>
                <p className="text-xs">
                  <strong>Buyer Address:</strong> {data.buyerAddress || 'N/A'}
                </p>
                <p className="text-xs">
                  <strong>Buyer GSTIN:</strong> {data.gstin || 'N/A'}
                </p>
                <p className="text-xs">
                  <strong>Contact No:</strong> {data.buyerContactNo || 'N/A'}
                </p>
              </td>
              <td colSpan="3" className="border border-gray-400 p-3 align-top bg-white">
                <p className="font-bold text-gray-600">Site Name / Ship To:</p>
                <p className="font-semibold text-gray-900">{data.siteName}</p>
                <p className="text-xs">{data.siteAddress || 'N/A'}</p>
              </td>
            </tr>

            {/* Table Header */}
            <tr className="bg-blue-50 font-bold text-gray-700 text-center">
              <td className={`border border-gray-400 p-2 ${colWidths.particulars}`}>Particulars</td>
              <td className={`border border-gray-400 p-2 ${colWidths.hsn}`}>HSN/SAC</td>
              <td className={`border border-gray-400 p-2 ${colWidths.qty}`}>Qty</td>
              <td className={`border border-gray-400 p-2 ${colWidths.rate}`}>Rate</td>
              <td className={`border border-gray-400 p-2 ${colWidths.per}`}>Per</td>
              <td className={`border border-gray-400 p-2 ${colWidths.amount}`}>Amount</td>
            </tr>

            {/* Material Rows */}
            {data.materialDetails?.length > 0 ? (
              data.materialDetails.map((item, i) => (
                <tr key={i}>
                  <td className="border border-gray-400 p-2 text-gray-700">{item.particulars}</td>
                  <td className="border border-gray-400 p-2 text-center">{item.hsnSac}</td>
                  <td className="border border-gray-400 p-2 text-center">{item.quantity}</td>
                  <td className="border border-gray-400 p-2 text-right">
                    {formatCurrency(item.rate)}
                  </td>
                  <td className="border border-gray-400 p-2 text-center">{item.per || 'Nos'}</td>
                  <td className="border border-gray-400 p-2 text-right font-semibold">
                    {formatCurrency(item.amount)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="border border-gray-400 text-center text-gray-500 py-4 italic"
                >
                  No Material Details Provided
                </td>
              </tr>
            )}

            {/* Subtotal */}
            <tr>
              <td colSpan="4" className="border border-gray-400 p-2 bg-white"></td>
              <td className="border border-gray-400 p-2 text-right font-bold bg-gray-50">Sub Total</td>
              <td className="border border-gray-400 p-2 text-right font-bold bg-gray-50">
                {formatCurrency(data.subTotal)}
              </td>
            </tr>

            {/* Tax Breakdown */}
            <tr>
              <td rowSpan="3" colSpan="4" className="border border-gray-400 p-3 align-top">
                <p className="font-bold text-gray-700 mb-1">Bank Details:</p>
                <p className="text-xs leading-5">
                  <strong>Name:</strong> {data.name || 'N/A'} <br />
                  <strong>A/C Number:</strong> {data.accountNumber || 'N/A'} <br />
                  <strong>Branch:</strong> {data.branch || 'N/A'} <br />
                  <strong>IFSC CODE:</strong> {data.ifscCode || 'N/A'}
                </p>
              </td>
              <td className="border border-gray-400 p-1 text-right text-xs bg-gray-50">
                {data.cgstStr}
              </td>
              <td className="border border-gray-400 p-1 text-right text-xs font-semibold bg-gray-50">
                {formatCurrency(data.cgstAmount)}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-400 p-1 text-right text-xs bg-gray-50">
                {data.sgstStr}
              </td>
              <td className="border border-gray-400 p-1 text-right text-xs font-semibold bg-gray-50">
                {formatCurrency(data.sgstAmount)}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-400 p-1 text-right text-xs bg-gray-50">Rounded off</td>
              <td className="border border-gray-400 p-1 text-right text-xs font-semibold bg-gray-50">
                {formatCurrency(data.roundOffValue)}
              </td>
            </tr>

            {/* Grand Total */}
            <tr className="bg-blue-100 font-bold text-gray-900">
              <td colSpan="4" className="border border-gray-400 p-2">
                <p className="text-sm font-semibold mb-1">Amount Chargeable (in words):</p>
                <p className="italic">{data.amountChargeableInWords}</p>
              </td>
              <td className="border border-gray-400 p-2 text-right">GRAND TOTAL</td>
              <td className="border border-gray-400 p-2 text-right font-extrabold text-base">
                {formatCurrency(data.grandTotal)}
              </td>
            </tr>

            {/* Declaration */}
            <tr>
              <td colSpan="3" className="border border-gray-400 p-3 align-top">
                <p className="font-bold mb-1 text-gray-700">
                  Terms & Conditions / Declaration
                </p>
                <p className="text-xs italic text-gray-600 leading-5">
                  The above price is valid for 30 days. Payment is due upon receipt of the final
                  invoice. We declare that this invoice shows the actual price of the goods described
                  and that all particulars are true and correct.
                </p>
                <p className="text-[10px] mt-4 italic text-gray-500">
                  This is a computer generated invoice, no signature required.
                </p>
              </td>
              <td colSpan="3" className="border border-gray-400 p-3 text-right align-bottom">
                <p className="font-bold text-gray-800 mb-10">For {data.forCompany}</p>
                <p className="text-xs font-semibold border-t border-gray-500 pt-1">
                  Authorised Signatory
                </p>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Close Button */}
        <div className="flex justify-end pt-4 print:hidden">
          <button
            onClick={onBackToList}
            className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            Close Preview
          </button>
        </div>
      </div>
    </>
  );
};

export default OncallInvoicePrint;