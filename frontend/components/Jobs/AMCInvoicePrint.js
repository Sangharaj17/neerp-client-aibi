import { useState, useEffect } from 'react';
import axiosInstance from '@/utils/axiosInstance';

// Helper function to format currency
const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '0.00';
  // Ensure we can parse it as a number before fixing the decimal places
  return parseFloat(amount).toFixed(2);
};

// --- INVOICE COMPONENT ---
const AMCInvoicePrint = ({ invoiceId = 1 }) => {
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        setLoading(true);
        // Using the configured axiosInstance to hit the API
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

  if (loading) return <div className="max-w-4xl mx-auto p-4 text-center">Loading Invoice...</div>;
  if (error) return <div className="max-w-4xl mx-auto p-4 text-center text-red-600 font-bold">{error}</div>;
  if (!invoiceData) return <div className="max-w-4xl mx-auto p-4 text-center">No invoice data available.</div>;

  const data = invoiceData; // Simplify access

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-xl">
      {/* Back To List & Header */}
      <div className="mb-4 print:hidden">
        <a href="#" className="text-blue-600 hover:underline">
          <span className="font-bold">Back To List</span> &gt;&gt;
        </a>
        <h1 className="text-2xl font-bold inline-block ml-2">Payment Invoice</h1>
      </div>
      <button 
        onClick={() => window.print()}
        className="mb-4 py-1 px-3 border border-gray-400 hover:bg-gray-100 text-sm print:hidden"
      >
        Print Invoice
      </button>

      {/* --- INVOICE TABLE --- */}
      <table className="w-full border-collapse border border-black text-sm">
        {/* Tax Invoice Header */}
        <thead>
          <tr>
            <th className="border border-black p-1 text-left w-1/2 bg-gray-50" colSpan="2"></th>
            <th className="border border-black p-1 text-center bg-gray-200" colSpan="2">
              TAX INVOICE
            </th>
          </tr>
        </thead>
        <tbody>
          {/* Company Details */}
          <tr>
            <td className="border border-black p-1 align-top w-1/2" colSpan="2">
              <p className="font-bold text-base">{data.companyName}</p>
              <p className="text-xs">
                **Address**: {data.officeAddress || 'N/A'} <br />
                **E-mail**: {data.e_mail} <br />
                **Contact No**: {data.contact_No}
              </p>
            </td>
            <td className="border border-black p-1 align-top w-1/4">
              <p className="font-bold">Invoice No.</p>
              <p>Dated</p>
              <p className="font-bold">Purchase Order No.</p>
              <p>Dated</p>
              <p className="font-bold">Delivery Challan No.</p>
              <p>Dated</p>
            </td>
            <td className="border border-black p-1 align-top w-1/4">
              <p>{data.invoice_No}</p>
              <p>{data.dated}</p>
              <p>{data.purchaseOrderNo}</p>
              <p></p>
              <p>{data.deliveryChallanNo}</p>
              <p></p>
            </td>
          </tr>

          {/* GSTIN and Site Details */}
          <tr>
            <td className="border border-black p-1 align-top w-1/2" colSpan="2">
              **GSTIN/UIN**: <span className="font-bold">{data.gstin_UIN}</span>
              <br />
              **Buyer Address**: {data.buyerAddress || 'N/A'}
              <br />
              **GSTIN**: {data.gstin || 'N/A'}
              <br />
              **Contact No**: {data.buyerContactNo || 'N/A'}
            </td>
            <td className="border border-black p-1 align-top w-1/2" colSpan="2">
              **Site Name / Ship To**:
              <br />
              <span className="font-bold">{data.sitename}</span>
              <br />
              {data.siteaddress || 'N/A'}
            </td>
          </tr>

          {/* Particulars Table Header */}
          <tr className="bg-gray-100 font-bold text-center">
            <td className="border border-black p-1 w-2/5">Particulars</td>
            <td className="border border-black p-1 w-[8%]">HSN/SAC</td>
            <td className="border border-black p-1 w-[8%]">Quantity</td>
            <td className="border border-black p-1 w-[12%]">Rate</td>
            <td className="border border-black p-1 w-[8%]">Per</td>
            <td className="border border-black p-1 w-[12%]">Amount</td>
          </tr>

          {/* Particulars Row */}
          <tr>
            <td className="border border-black p-1">
              {data.particulars.split('\n').map((item, index) => (
                <div key={index}>{item}</div>
              ))}
            </td>
            <td className="border border-black p-1 text-center">{data.hsn_SAC}</td>
            <td className="border border-black p-1 text-center">{data.quantity}</td>
            <td className="border border-black p-1 text-right">{formatCurrency(data.rate)}</td>
            <td className="border border-black p-1 text-center">{data.per || '0'}</td>
            <td className="border border-black p-1 text-right">{formatCurrency(data.amount)}</td>
          </tr>

          {/* Blank space/Row */}
          <tr>
            <td className="border border-black p-1 h-12 align-top" colSpan="4"></td>
            <td className="border border-black p-1 align-top font-bold text-right" colSpan="1">Sub Total</td>
            <td className="border border-black p-1 align-top text-right font-bold">{formatCurrency(data.subTotal)}</td>
          </tr>

          {/* Tax Breakdown */}
          <tr>
            <td className="border border-black p-1 align-top" rowSpan="3" colSpan="4">
              <p className="font-bold">Amount Chargeable (in words)</p>
              <p>{data.amountChargeableInWords}</p>
              <p className="mt-2 font-bold">Bank Details:</p>
              <p>**Name**: {data.name}</p>
              <p>**A/C Number**: {data.accountNumber}</p>
              <p>**Branch**: {data.branch}</p>
              <p>**IFSC CODE**: {data.ifsc_CODE}</p>
            </td>
            <td className="border border-black p-1 text-right">{data.cgst_Str}</td>
            <td className="border border-black p-1 text-right">{formatCurrency(data.cgst_Amount)}</td>
          </tr>
          <tr>
            <td className="border border-black p-1 text-right">{data.sgst_Str}</td>
            <td className="border border-black p-1 text-right">{formatCurrency(data.sgst_Amount)}</td>
          </tr>
          <tr>
            <td className="border border-black p-1 text-right">Rounded off</td>
            <td className="border border-black p-1 text-right">{formatCurrency(data.roundOffValue)}</td>
          </tr>

          {/* Grand Total */}
          <tr className="bg-gray-100 font-bold">
            <td className="border border-black p-1 text-right" colSpan="4">Grand Total</td>
            <td className="border border-black p-1 text-right" colSpan="1">{formatCurrency(data.grandTotal)}</td>
            <td className="border border-black p-1 text-center">E. & O. E.</td>
          </tr>

          {/* Declaration and Signature */}
          <tr>
            <td className="border border-black p-1 align-top w-1/2" colSpan="3">
              <p className="font-bold">Declaration</p>
              <p className="text-xs">We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.</p>
            </td>
            <td className="border border-black p-1 align-top w-1/2 text-right" colSpan="3">
              <p className="font-bold mb-8">For {data.for}</p>
              <p className="text-xs italic">This is computer generated invoice no signature required</p>
              <p className="text-center mt-2 border-t border-black pt-1">Authorised Signatory</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AMCInvoicePrint;