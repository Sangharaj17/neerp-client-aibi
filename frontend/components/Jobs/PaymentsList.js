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

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount || 0);
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
    <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
          {loading ? (
            <FaSpinner className="animate-spin text-xl mt-2 text-gray-400" />
          ) : (
            // Added specific logic for 'value' to ensure currency format consistency if needed, 
            // but 'value' passed is already formatted string or number in existing code.
            <p className="text-2xl font-bold text-gray-900 mt-2 tracking-tight">{value}</p>
          )}
        </div>
        <div className={`p-3.5 rounded-lg ${colorClass} bg-opacity-10 shadow-inner`}>
          <Icon className={`w-6 h-6 ${colorClass}`} />
        </div>
      </div>
    </div>
  );
  // ------------------------------------


  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <FaMoneyBillWave className="w-5 h-5" />
            </span>
            Payment Invoices
          </h2>
          <p className="text-sm text-gray-500 mt-1 ml-1">Manage and track all payment transactions.</p>
        </div>
        <div className="flex gap-2">
          {/* Future controls can go here */}
        </div>
      </div>

      {/* --- Dashboard Cards Section --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
          colorClass="text-red-500" // Adjusted red
          loading={summaryLoading}
        />
        <DashboardCard
          title="Total Amount"
          value={summaryLoading ? "" : formatCurrency(summary.totalClearedAmount)}
          icon={FaRupeeSign}
          colorClass="text-amber-500" // Adjusted yellow to amber
          loading={summaryLoading}
        />
      </div>

      {/* --- Payment Method Breakdown (Accordion) --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

        {/* Accordion Header */}
        <button
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="w-full flex justify-between items-center px-6 py-4 text-left hover:bg-gray-50/50 transition-colors duration-200"
          aria-expanded={showBreakdown}
          aria-controls="breakdown-content"
        >
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
              <FaMoneyBillWave className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-gray-800">Payment Breakdown</h3>
          </div>
          {showBreakdown ?
            <FaChevronUp className="text-gray-400 w-4 h-4 transition-transform" /> :
            <FaChevronDown className="text-gray-400 w-4 h-4 transition-transform" />
          }
        </button>

        {/* Accordion Content (Conditionally Rendered) */}
        {showBreakdown && (
          <div id="breakdown-content" className="px-6 pb-6 pt-2 border-t border-gray-100 animate-in slide-in-from-top-1">
            {summaryLoading ? (
              <p className="text-gray-500 py-4 flex items-center text-sm"><FaSpinner className="animate-spin mr-2" /> Loading breakdown...</p>
            ) : summary.paymentTypeCounts.length > 0 ? (

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                {summary.paymentTypeCounts.map((type) => (
                  <div
                    key={type.paymentType}
                    className="flex justify-between items-center p-4 bg-gray-50/80 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
                  >
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">{type.paymentType}</p>
                      <p className="text-sm font-medium text-gray-900">{type.count} txns</p>
                    </div>
                    <span className="text-base font-bold text-gray-900 tracking-tight">
                      {formatCurrency(type.totalAmount)}
                    </span>
                  </div>
                ))}
              </div>

            ) : (
              <p className="text-gray-500 py-4 text-sm">No payment type breakdown available.</p>
            )}
          </div>
        )}
      </div>

      {/* --- Payments Transaction List (Original Content) --- */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-gray-900">Transaction History</h3>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search transactions..."
                className="w-full sm:w-64 pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                value={search}
                onChange={(e) => {
                  setPage(0);
                  setSearch(e.target.value);
                }}
              />
            </div>
            <select
              value={size}
              onChange={(e) => {
                setPage(0);
                setSize(Number(e.target.value));
              }}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
            >
              {[5, 10, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n} per page
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table (Original Content) */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/50">
              <tr>
                {[{ label: "ID", key: "paymentId", align: 'left' }, { label: "Date", key: "paymentDate", align: 'left' }, { label: "Invoice No", key: "invoiceNo", align: 'left' },
                { label: "Pay For", key: "payFor", align: 'left' }, { label: "Payment Type", key: "paymentType", align: 'left' }, { label: "Amount", key: "amountPaid", align: 'right' },
                { label: "Status", key: "paymentCleared", align: 'center' }, { label: "Customer", key: "customerName", align: 'left' }, { label: "Site", key: "siteName", align: 'left' }]
                  .map(({ label, key, align }) => (
                    <th
                      key={key}
                      onClick={() => handleSort(key)}
                      className={`px-6 py-4 text-${align} text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer transition-colors hover:text-indigo-600 hover:bg-gray-100 ${key === 'invoiceNo' || key === 'paymentType' ? 'hidden md:table-cell' : ''}`}
                    >
                      <div className={`flex items-center gap-1 ${align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : 'justify-start'}`}>
                        {label} {['paymentId', 'paymentDate', 'amountPaid'].includes(key) && getSortIcon(key)}
                      </div>
                    </th>
                  ))}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="9" className="p-12 text-center text-indigo-600">
                    <div className="flex flex-col items-center justify-center">
                      <FaSpinner className="animate-spin w-8 h-8 mb-2" />
                      <span className="text-sm font-medium">Loading transactions...</span>
                    </div>
                  </td>
                </tr>
              ) : payments.length > 0 ? (
                payments.map((p) => (
                  <tr key={p.paymentId} className="group hover:bg-indigo-50/30 transition duration-150">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">#{p.paymentId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{formatDate(p.paymentDate)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 font-medium hidden md:table-cell">{p.invoiceNo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{p.payFor}</td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <span className={`px-2.5 py-0.5 inline-flex text-xs font-semibold rounded-full border ${p.paymentType === 'CASH' ? 'bg-green-50 text-green-700 border-green-100' : p.paymentType === 'BANK_TRANSFER' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-yellow-50 text-yellow-700 border-yellow-100'}`}>
                        {p.paymentType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900 text-right tracking-tight">{formatCurrency(p.amountPaid)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`px-2.5 py-0.5 inline-flex text-xs font-semibold rounded-full border ${p.paymentCleared ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                        {p.paymentCleared ? 'Cleared' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-medium">{p.customerName || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{p.siteName || "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="p-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-3xl mb-2 opacity-50">📋</span>
                      <p className="font-medium">No payments found</p>
                      <p className="text-xs mt-1">Try adjusting your search criteria</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination (Original Content) */}
        <div className="flex flex-col md:flex-row justify-between items-center px-6 py-4 border-t border-gray-100 bg-gray-50/30">

          <div className="text-xs text-gray-500 mb-3 md:mb-0 font-medium">
            Showing <span className="text-gray-900">{(page * size) + 1} - {Math.min((page + 1) * size, totalElements)}</span> of <span className="text-gray-900">{totalElements}</span>
          </div>

          <div className="flex items-center gap-2">

            <button
              className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={page === 0}
              onClick={() => handlePageChange(page - 1)}
              aria-label="Previous Page"
            >
              <FaChevronLeft className="w-3.5 h-3.5" />
            </button>

            <span className="text-xs font-medium text-gray-700 px-2">
              Page {page + 1} of {totalPages || 1}
            </span>

            <button
              className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={page + 1 >= totalPages}
              onClick={() => handlePageChange(page + 1)}
              aria-label="Next Page"
            >
              <FaChevronRight className="w-3.5 h-3.5" />
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}