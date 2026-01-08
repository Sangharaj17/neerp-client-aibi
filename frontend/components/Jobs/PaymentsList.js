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
  FaRupeeSign,
  FaChevronDown,
  FaChevronUp,
  FaFilter,
  FaDownload,
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
    return <FaSort className="ms-1 text-slate-400/60" />;
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

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

  const MetricCard = ({ title, value, icon: Icon, gradient, delay }) => (
    <div 
      className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-200/60 hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Gradient overlay on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
      
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500 mb-2">{title}</p>
          {summaryLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-8 w-24 bg-slate-200 animate-pulse rounded" />
            </div>
          ) : (
            <p className="text-3xl font-bold text-slate-900 tracking-tight">{value}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Bottom accent line */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
    </div>
  );

  const getPaymentTypeStyle = (type) => {
    const styles = {
      'CASH': 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
      'BANK_TRANSFER': 'bg-blue-50 text-blue-700 border-blue-200/60',
      'CHEQUE': 'bg-amber-50 text-amber-700 border-amber-200/60',
      'UPI': 'bg-purple-50 text-purple-700 border-purple-200/60',
    };
    return styles[type] || 'bg-slate-50 text-slate-700 border-slate-200/60';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Outfit', system-ui, -apple-system, sans-serif;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-up {
          animation: slideUp 0.6s ease-out forwards;
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header Section */}
        <div className="animate-slide-up">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                  <FaMoneyBillWave className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900">Payment Dashboard</h1>
              </div>
              <p className="text-slate-600 text-sm ml-1">Track and manage all your financial transactions in one place</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all duration-300 flex items-center gap-2 text-sm font-medium shadow-sm hover:shadow">
                <FaFilter className="w-3.5 h-3.5" />
                Filter
              </button>
              <button className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center gap-2 text-sm font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                <FaDownload className="w-3.5 h-3.5" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <MetricCard
            title="Total Payments"
            value={summaryLoading ? "" : summary.totalPaymentsCount.toLocaleString()}
            icon={FaMoneyBillWave}
            gradient="from-blue-500 to-blue-600"
            delay={0}
          />
          <MetricCard
            title="Cleared Payments"
            value={summaryLoading ? "" : summary.clearedPaymentsCount.toLocaleString()}
            icon={FaCheckCircle}
            gradient="from-emerald-500 to-emerald-600"
            delay={50}
          />
          <MetricCard
            title="Pending Payments"
            value={summaryLoading ? "" : summary.unclearedPaymentsCount.toLocaleString()}
            icon={FaTimesCircle}
            gradient="from-rose-500 to-rose-600"
            delay={100}
          />
          <MetricCard
            title="Total Amount"
            value={summaryLoading ? "" : formatCurrency(summary.totalClearedAmount)}
            icon={FaRupeeSign}
            gradient="from-amber-500 to-amber-600"
            delay={150}
          />
        </div>

        {/* Payment Breakdown Accordion */}
        <div className="animate-slide-up bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden" style={{ animationDelay: '200ms' }}>
          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="w-full flex justify-between items-center px-6 py-5 text-left hover:bg-slate-50/50 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors duration-300">
                <FaMoneyBillWave className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900">Payment Method Breakdown</h3>
                <p className="text-xs text-slate-500 mt-0.5">View detailed transaction categories</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {!summaryLoading && summary.paymentTypeCounts.length > 0 && (
                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                  {summary.paymentTypeCounts.length} categories
                </span>
              )}
              {showBreakdown ? (
                <FaChevronUp className="text-slate-400 w-4 h-4 transition-transform duration-300" />
              ) : (
                <FaChevronDown className="text-slate-400 w-4 h-4 transition-transform duration-300" />
              )}
            </div>
          </button>

          {showBreakdown && (
            <div className="px-6 pb-6 pt-2 border-t border-slate-100 animate-slide-up">
              {summaryLoading ? (
                <div className="flex items-center justify-center py-8">
                  <FaSpinner className="animate-spin w-6 h-6 text-blue-500" />
                </div>
              ) : summary.paymentTypeCounts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
                  {summary.paymentTypeCounts.map((type, index) => (
                    <div
                      key={type.paymentType}
                      className="relative p-5 rounded-xl bg-gradient-to-br from-slate-50 to-white border border-slate-200/60 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getPaymentTypeStyle(type.paymentType)} border`}>
                            {type.paymentType}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                          {type.count} txns
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-slate-900 tracking-tight">
                        {formatCurrency(type.totalAmount)}
                      </p>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-xl" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-slate-500 py-6 text-sm">No payment breakdown available</p>
              )}
            </div>
          )}
        </div>

        {/* Transactions Table */}
        <div className="animate-slide-up bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden" style={{ animationDelay: '250ms' }}>
          {/* Table Header */}
          <div className="px-6 py-5 border-b border-slate-100">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">Transaction History</h3>
                <p className="text-xs text-slate-500">All payment records and invoices</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative group">
                  <FaSearch className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Search by invoice, customer..."
                    className="w-full sm:w-72 pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
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
                  className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer hover:bg-white transition-all font-medium"
                >
                  {[5, 10, 20, 50].map((n) => (
                    <option key={n} value={n}>
                      {n} rows
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50/50">
                <tr>
                  {[
                    { label: "ID", key: "paymentId", align: 'left' },
                    { label: "Date", key: "paymentDate", align: 'left' },
                    { label: "Invoice", key: "invoiceNo", align: 'left' },
                    { label: "Description", key: "payFor", align: 'left' },
                    { label: "Method", key: "paymentType", align: 'left' },
                    { label: "Amount", key: "amountPaid", align: 'right' },
                    { label: "Status", key: "paymentCleared", align: 'center' },
                    { label: "Customer", key: "customerName", align: 'left' },
                    { label: "Site", key: "siteName", align: 'left' }
                  ].map(({ label, key, align }) => (
                    <th
                      key={key}
                      onClick={() => ['paymentId', 'paymentDate', 'amountPaid'].includes(key) && handleSort(key)}
                      className={`px-6 py-4 text-${align} text-xs font-bold text-slate-600 uppercase tracking-wider ${['paymentId', 'paymentDate', 'amountPaid'].includes(key) ? 'cursor-pointer hover:text-blue-600 hover:bg-slate-100/50 transition-colors' : ''} ${key === 'invoiceNo' || key === 'paymentType' ? 'hidden lg:table-cell' : ''}`}
                    >
                      <div className={`flex items-center gap-1 ${align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : 'justify-start'}`}>
                        {label}
                        {['paymentId', 'paymentDate', 'amountPaid'].includes(key) && getSortIcon(key)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan="9" className="p-16 text-center">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <FaSpinner className="animate-spin w-8 h-8 text-blue-500" />
                        <span className="text-sm font-medium text-slate-600">Loading transactions...</span>
                      </div>
                    </td>
                  </tr>
                ) : payments.length > 0 ? (
                  payments.map((p, index) => (
                    <tr 
                      key={p.paymentId} 
                      className="group hover:bg-blue-50/30 transition-colors duration-200"
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-semibold text-slate-900">#{p.paymentId}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-600 text-sm">
                        {formatDate(p.paymentDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                        <span className="font-medium text-slate-700 text-sm">{p.invoiceNo}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-600 text-sm">
                        {p.payFor}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getPaymentTypeStyle(p.paymentType)}`}>
                          {p.paymentType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="font-bold text-slate-900 text-sm">
                          {formatCurrency(p.amountPaid)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border ${
                          p.paymentCleared === "yes"
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                            : 'bg-rose-50 text-rose-700 border-rose-200/60'
                        }`}>
                          {p.paymentCleared === "yes" ? (
                            <>
                              <FaCheckCircle className="w-3 h-3" />
                              Cleared
                            </>
                          ) : (
                            <>
                              <FaTimesCircle className="w-3 h-3" />
                              Pending
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-700 font-medium text-sm">
                        {p.customerName || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-600 text-sm">
                        {p.siteName || "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="p-16 text-center">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                          <span className="text-3xl">📋</span>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 mb-1">No payments found</p>
                          <p className="text-sm text-slate-500">Try adjusting your search criteria</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-t border-slate-100 bg-slate-50/30 gap-4">
            <div className="text-sm text-slate-600 font-medium">
              Showing <span className="text-slate-900 font-semibold">{(page * size) + 1}</span> to{" "}
              <span className="text-slate-900 font-semibold">{Math.min((page + 1) * size, totalElements)}</span> of{" "}
              <span className="text-slate-900 font-semibold">{totalElements}</span> entries
            </div>

            <div className="flex items-center gap-2">
              <button
                className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:-translate-x-0.5"
                disabled={page === 0}
                onClick={() => handlePageChange(page - 1)}
                aria-label="Previous Page"
              >
                <FaChevronLeft className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-1">
                {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i;
                  } else if (page < 3) {
                    pageNum = i;
                  } else if (page > totalPages - 4) {
                    pageNum = totalPages - 5 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handlePageChange(pageNum)}
                      className={`min-w-[36px] h-9 px-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        page === pageNum
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                          : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                      }`}
                    >
                      {pageNum + 1}
                    </button>
                  );
                })}
              </div>

              <button
                className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:translate-x-0.5"
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
    </div>
  );
}