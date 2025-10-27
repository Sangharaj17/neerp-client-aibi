"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import {
  FaSort,
  FaSortUp,
  FaSortDown,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaSpinner,
  FaMoneyBillWave,
  FaCheckCircle,
  FaTimesCircle,
  FaRupeeSign, // Changed to Rupee Icon
  FaChevronDown, // Icon for Accordion
  FaChevronUp,
} from "react-icons/fa";

// Define the structure for the summary data
const initialSummary = {
  totalPaymentsCount: 0,
  clearedPaymentsCount: 0,
  unclearedPaymentsCount: 0,
  totalClearedAmount: 0.0,
  paymentTypeCounts: [],
};

export default function PaymentsList() {
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState(initialSummary);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [sortBy, setSortBy] = useState("paymentId");
  const [sortDir, setSortDir] = useState("asc");
  const [loading, setLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  
  // NEW STATE for Accordion
  const [showBreakdown, setShowBreakdown] = useState(false); 

  useEffect(() => {
    fetchPayments();
  }, [page, size, sortBy, sortDir, search]);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/api/payments/getAllPaymentsPaged`, {
        params: {
          search: search.trim(),
          page,
          size,
          sort: `${sortBy},${sortDir}`,
        },
      });
      setPayments(res.data.content);
      setTotalPages(res.data.totalPages);
      setTotalElements(res.data.totalElements);
    } catch (err) {
      console.error("Error fetching payments:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    setSummaryLoading(true);
    try {
      const res = await axiosInstance.get(`http://localhost:8080/api/payments/summary`);
      setSummary(res.data);
    } catch (err) {
      console.error("Error fetching summary:", err);
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDir("asc");
    }
  };

  const getSortIcon = (column) => {
    if (sortBy === column) {
      return sortDir === "asc" ? <FaSortUp className="ms-1" /> : <FaSortDown className="ms-1" />;
    }
    return <FaSort className="ms-1 text-gray-400" />;
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  // --- UPDATED: Helper to format currency for Rupees (INR) ---
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR', // Changed to INR
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Helper for date formatting (Existing)
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (e) {
      return dateString;
    }
  };

  // --- Dashboard Card Component (Slightly modified icon) ---
  const DashboardCard = ({ title, value, icon: Icon, colorClass, loading }) => (
    <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-100 transition duration-300 hover:shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          {loading ? (
            <FaSpinner className="animate-spin text-xl mt-1 text-gray-400" />
          ) : (
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          )}
        </div>
        <div className={`p-3 rounded-full ${colorClass} bg-opacity-10`}>
          <Icon className={`w-6 h-6 ${colorClass}`} />
        </div>
      </div>
    </div>
  );
  // ------------------------------------


  return (
    <div className="bg-gray-50 p-6 md:p-8 rounded-xl shadow-2xl ring-1 ring-gray-200 m-4">
      
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8 border-b pb-2">
        <span className="text-indigo-600">📊</span> Payments Overview Dashboard
      </h2>

      {/* --- Dashboard Cards Section --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          title="Total Payments"
          value={summaryLoading ? "" : summary.totalPaymentsCount.toLocaleString()}
          icon={FaMoneyBillWave}
          colorClass="text-indigo-600"
          loading={summaryLoading}
        />
        <DashboardCard
          title="Cleared Payments"
          value={summaryLoading ? "" : summary.clearedPaymentsCount.toLocaleString()}
          icon={FaCheckCircle}
          colorClass="text-green-600"
          loading={summaryLoading}
        />
        <DashboardCard
          title="Uncleared Payments"
          value={summaryLoading ? "" : summary.unclearedPaymentsCount.toLocaleString()}
          icon={FaTimesCircle}
          colorClass="text-red-600"
          loading={summaryLoading}
        />
        <DashboardCard
          title="Total Cleared Amount"
          // UPDATED: Use the new formatCurrency with Rupee symbol
          value={summaryLoading ? "" : formatCurrency(summary.totalClearedAmount)}
          icon={FaRupeeSign} // UPDATED: Use Rupee Icon
          colorClass="text-yellow-600"
          loading={summaryLoading}
        />
      </div>
      
      {/* --- Payment Method Breakdown (Accordion) --- */}
      <div className="mb-8 bg-white rounded-xl shadow-md border border-gray-200">
        
        {/* Accordion Header */}
        <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="w-full flex justify-between items-center p-4 text-left border-b hover:bg-gray-50 transition-colors duration-150 rounded-t-xl"
            aria-expanded={showBreakdown}
            aria-controls="breakdown-content"
        >
            <h3 className="text-xl font-semibold text-gray-800">Payment Method Breakdown</h3>
            {showBreakdown ? 
                <FaChevronUp className="text-indigo-600 w-5 h-5 transition-transform" /> : 
                <FaChevronDown className="text-indigo-600 w-5 h-5 transition-transform" />
            }
        </button>
        
        {/* Accordion Content (Conditionally Rendered) */}
        {showBreakdown && (
            <div id="breakdown-content" className="p-4 transition-all duration-300 ease-in-out">
                {summaryLoading ? (
                    <p className="text-gray-500 p-2"><FaSpinner className="animate-spin inline me-2" /> Loading breakdown...</p>
                ) : summary.paymentTypeCounts.length > 0 ? (
                    
                    // UPDATED: Use a clean list/grid layout for breakdown
                    <div className="space-y-3">
                        {summary.paymentTypeCounts.map((type) => (
                            <div 
                                key={type.paymentType} 
                                className="flex justify-between items-center p-3 bg-gray-50 border border-indigo-100 rounded-lg shadow-sm"
                            >
                                <div className="text-sm font-medium text-gray-700 flex items-center">
                                    <span className="text-lg font-semibold text-indigo-700 me-3">{type.paymentType}:</span>
                                    <span className="text-sm text-gray-600">{type.count} payments</span>
                                </div>
                                <span className="text-md font-bold text-gray-900">
                                    {formatCurrency(type.totalAmount)}
                                </span>
                            </div>
                        ))}
                    </div>

                ) : (
                    <p className="text-gray-500 p-2">No payment type breakdown available.</p>
                )}
            </div>
        )}
      </div>
      
      {/* --- Payments Transaction List (Original Content) --- */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2 mt-8">
        Transaction List
      </h2>

      {/* Search and Records per page (Original Content) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        
        {/* Search Input Group */}
        <div className="relative w-full md:w-80">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by invoice or customer..."
            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out shadow-sm"
            value={search}
            onChange={(e) => {
              setPage(0);
              setSearch(e.target.value);
            }}
          />
        </div>

        {/* Records per page Select Group */}
        <div className="flex items-center space-x-2">
          <label htmlFor="size-select" className="text-gray-600 font-medium whitespace-nowrap">
            Records per page:
          </label>
          <select
            id="size-select"
            value={size}
            onChange={(e) => {
              setPage(0);
              setSize(Number(e.target.value));
            }}
            className="border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Table (Original Content) */}
      <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          
          <thead className="bg-gray-50">
            <tr>
              {[{ label: "ID", key: "paymentId" }, { label: "Date", key: "paymentDate" }, { label: "Invoice No", key: "invoiceNo" }, 
                { label: "Pay For", key: "payFor" }, { label: "Payment Type", key: "paymentType" }, { label: "Amount Paid", key: "amountPaid" }, 
                { label: "Cleared", key: "paymentCleared" }, { label: "Customer", key: "customerName" }, { label: "Site", key: "siteName" }]
                .map(({ label, key }) => (
                  <th 
                    key={key}
                    onClick={() => handleSort(key)} 
                    className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 cursor-pointer select-none transition duration-150 ease-in-out ${key === 'amountPaid' ? 'text-right' : ''} ${key === 'invoiceNo' || key === 'paymentType' ? 'hidden md:table-cell' : ''} hover:bg-gray-100`}
                  >
                    <div className="flex items-center">
                        {label} {['paymentId', 'paymentDate', 'amountPaid'].includes(key) && getSortIcon(key)}
                    </div>
                  </th>
              ))}
            </tr>
          </thead>
          
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="9" className="p-6 text-center text-indigo-600 font-medium">
                  <FaSpinner className="animate-spin inline me-2" />
                  Loading payment data...
                </td>
              </tr>
            ) : payments.length > 0 ? (
              payments.map((p) => (
                <tr key={p.paymentId} className="hover:bg-indigo-50 transition duration-150 ease-in-out">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.paymentId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(p.paymentDate)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">{p.invoiceNo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.payFor}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm hidden md:table-cell">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${p.paymentType === 'CASH' ? 'bg-green-100 text-green-800' : p.paymentType === 'BANK_TRANSFER' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {p.paymentType}
                    </span>
                  </td>
                  {/* UPDATED: Currency formatted with Rupees */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700 text-right">{formatCurrency(p.amountPaid)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${p.paymentCleared ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {p.paymentCleared ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{p.customerName || "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.siteName || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="p-6 text-center text-gray-500">
                  <span className="text-2xl block mb-2">🤷‍♂️</span>
                  No payments found for the current filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination (Original Content) */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-6 p-4 border-t border-gray-200">
        
        {/* Total Records Info */}
        <div className="text-sm text-gray-700 mb-3 md:mb-0">
          Showing <b className="text-indigo-600">{(page * size) + 1} - {Math.min((page + 1) * size, totalElements)}</b> of <b className="text-indigo-600">{totalElements}</b> total records
        </div>
        
        {/* Pagination Controls */}
        <div className="flex items-center space-x-3">
          
          <button
            className={`p-2 border rounded-full transition duration-150 ease-in-out ${page === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-indigo-600 border-indigo-500 hover:bg-indigo-50'}`}
            disabled={page === 0}
            onClick={() => handlePageChange(page - 1)}
            aria-label="Previous Page"
          >
            <FaChevronLeft className="w-4 h-4" />
          </button>
          
          {/* Page Display */}
          <span className="text-sm font-medium text-gray-700">
            Page <b className="text-indigo-600">{page + 1}</b> of <b className="text-indigo-600">{totalPages || 1}</b>
          </span>
          
          <button
            className={`p-2 border rounded-full transition duration-150 ease-in-out ${page + 1 >= totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-indigo-600 border-indigo-500 hover:bg-indigo-50'}`}
            disabled={page + 1 >= totalPages}
            onClick={() => handlePageChange(page + 1)}
            aria-label="Next Page"
          >
            <FaChevronRight className="w-4 h-4" />
          </button>
          
        </div>
      </div>
    </div>
  );
}