import axiosInstance from "@/utils/axiosInstance";
import { useEffect, useRef, useState } from "react";
import InvoiceTemplate from "./InvoiceTemplate";

const InvoiceModal = ({ invoiceId, onClose }) => {
  const invoiceRef = useRef();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoice();
  }, [invoiceId]);

  const fetchInvoice = async () => {
    try {
      const res = await axiosInstance.get(`/api/ni-invoices/${invoiceId}`);
      if (res.data.success) {
        setInvoice(res.data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const printContent = invoiceRef.current.innerHTML;
    const printWindow = window.open("", "", "width=900,height=650");
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice</title>
          <style>
            table { width:100%; border-collapse:collapse; font-size:13px; }
            th, td { border:1px solid #000; padding:6px; vertical-align:top; }
            body { font-family: Arial, sans-serif; }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg">Loading invoice...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-[90%] max-w-5xl rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-3 border-b">
          <h2 className="text-lg font-semibold">Payment Invoice</h2>
          <div className="space-x-2">
            <button
              onClick={handlePrint}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Print
            </button>
            <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
              Close
            </button>
          </div>
        </div>

        {/* Invoice Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          <div ref={invoiceRef}>
            <InvoiceTemplate invoice={invoice} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
