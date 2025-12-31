"use client";

import React, { useEffect, useState, useMemo } from "react";
import axiosInstance from "@/utils/axiosInstance";
import {
  FaSort,
  FaSortUp,
  FaSortDown,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaSpinner,
  FaEye,
  FaTimes,
} from "react-icons/fa";
import { formatDateShort, formatJobNo } from "@/utils/common";
import { getTenant } from "@/utils/tenant";
import ActionModal from "@/components/AMC/ActionModal";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  })
    .format(amount || 0)
    .replace("₹", "₹ ");
};

export default function NiPaymentPage() {
  // Store ALL data from backend
  const [allPayments, setAllPayments] = useState([]);

  // UI State
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState(""); // For debounced search
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [companyName, setCompanyName] = useState("");

  // Sorting
  const [sortBy, setSortBy] = useState("paymentId");
  const [sortDir, setSortDir] = useState("desc");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    const fetchCompanyName = async () => {
      const tenant = getTenant();
      if (!tenant) return;
      try {
        const res = await axiosInstance.get(
          `/api/v1/settings/COMPANY_SETTINGS_1/company-name`
        );
        if (res.data.success) {
          setCompanyName(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch company name", err);
      }
    };
    fetchCompanyName();
  }, []);

  useEffect(() => {
    // debounce search
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(0); // Reset to first page on search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      // Fetch ALL payments (simulate with large page size) for client-side processing
      const res = await axiosInstance.get(
        `/api/job-payments/getAllPaymentsPaged`,
        {
          params: {
            search: "", // Empty search to get all locally
            page: 0,
            size: 10000, // Large size to fetch all records
            sort: "paymentId,desc", // Default backend sort
          },
        }
      );
      setAllPayments(res.data.content);
    } catch (err) {
      console.error("Error fetching payments:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- Client-Side Processing ---
  const filteredAndSortedData = useMemo(() => {
    let data = [...allPayments];

    // 1. Filter
    if (search.trim()) {
      const lowerSearch = search.toLowerCase().trim();
      data = data.filter((p) => {
        // Prepare searchable strings from formatting functions
        const formattedJob = formatJobNo(p, companyName) || "";
        const formattedDate = formatDateShort(p.paymentDate) || ""; // e.g., "31 Dec 2025" or similar
        const amountStr = p.amountPaid ? p.amountPaid.toString() : "";

        return (
          // Search in raw ID
          // p.paymentId.toString().includes(lowerSearch) ||
          // Search in formatted Job No
          formattedJob.toLowerCase().includes(lowerSearch) ||
          // Search in Job Type
          (p.jobType && p.jobType.toLowerCase().includes(lowerSearch)) ||
          // Search in Customer Name
          (p.customerName &&
            p.customerName.toLowerCase().includes(lowerSearch)) ||
          // Search in Formatted Date (Matches "31" or "Dec")
          formattedDate.toLowerCase().includes(lowerSearch) ||
          // Search in Payment Type
          (p.paymentType &&
            p.paymentType.toLowerCase().includes(lowerSearch)) ||
          // Search in Amount
          amountStr.includes(lowerSearch)
        );
      });
    }

    // 2. Sort
    data.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      // Handle specific column cases
      if (sortBy === "jobNo") {
        // Sort by formatted job no string
        valA = formatJobNo(a, companyName);
        valB = formatJobNo(b, companyName);
      } else if (sortBy === "customerName") {
        valA = (a.customerName || "").toLowerCase();
        valB = (b.customerName || "").toLowerCase();
      } else if (sortBy === "paymentDate") {
        valA = a.paymentDate ? new Date(a.paymentDate).getTime() : 0;
        valB = b.paymentDate ? new Date(b.paymentDate).getTime() : 0;
      } else if (sortBy === "amountPaid") {
        valA = a.amountPaid || 0;
        valB = b.amountPaid || 0;
      }

      if (valA < valB) return sortDir === "asc" ? -1 : 1;
      if (valA > valB) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return data;
  }, [allPayments, search, sortBy, sortDir, companyName]);

  // 3. Paginate
  const totalElements = filteredAndSortedData.length;
  const totalPages = Math.ceil(totalElements / size);
  const paginatedPayments = filteredAndSortedData.slice(
    page * size,
    page * size + size
  );
  // -----------------------------

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  const handleSort = (columnKey) => {
    if (sortBy === columnKey) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(columnKey);
      setSortDir("asc");
    }
  };

  const openModal = (payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPayment(null);
  };

  const columns = [
    { key: null, label: "Sr.No.", sortable: false },
    { key: "jobNo", label: "Job No", sortable: true },
    { key: "jobType", label: "Job Type", sortable: true },
    { key: "customerName", label: "Customer Name", sortable: true },
    { key: "paymentDate", label: "Payment Date", sortable: true },
    { key: "paymentType", label: "Payment Type", sortable: true },
    { key: "amountPaid", label: "Amount", sortable: true },
    { key: "paymentCleared", label: "Payment Cleared", sortable: true },
    { key: null, label: "View", sortable: false },
  ];

  const getSortIcon = (columnKey) => {
    if (sortBy !== columnKey) return <FaSort className="text-gray-300" />;
    return sortDir === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  return (
    // <div className="w-full h-screen p-6 bg-gray-50 flex flex-col">
    <div className="p-6 sm:p-8 bg-gray-10 min-h-screen">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-2">
        New Installation Payment List
      </h1>

      <div className="bg-white rounded-xl shadow-md p-5 flex flex-col flex-grow overflow-hidden">
        {/* Search and Controls */}
        <div className="flex justify-between items-center mb-4">
          <div className="relative w-full sm:w-1/3">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by Invoice No, Customer, Site, Amount..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <select
            value={size}
            onChange={(e) => {
              setPage(0);
              setSize(Number(e.target.value));
            }}
            className="ml-4 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {[10, 20, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n} Rows
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="flex-grow overflow-auto border rounded-lg border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 sticky top-0">
            <thead className="bg-gray-100">
              <tr>
                {columns.map((col, index) => (
                  <th
                    key={index}
                    onClick={() => col.sortable && handleSort(col.key)}
                    className={`px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap ${
                      col.sortable ? "cursor-pointer hover:bg-gray-200" : ""
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      {col.sortable && getSortIcon(col.key)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan="9"
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <FaSpinner className="animate-spin text-2xl mb-2 text-blue-500" />
                      Loading...
                    </div>
                  </td>
                </tr>
              ) : paginatedPayments.length > 0 ? (
                paginatedPayments.map((p, index) => (
                  <tr
                    key={p.paymentId}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {page * size + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {/* {p.jobNo || "-"} */}
                      {formatJobNo(p, companyName)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {p.jobType || "New Installation"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                      {p.customerName || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {formatDateShort(p.paymentDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {p.paymentType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      {formatCurrency(p.amountPaid)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold  text-center">
                      <span
                        className={
                          p.paymentCleared ? "text-green-600" : "text-red-600"
                        }
                      >
                        {p.paymentCleared ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <button
                        onClick={() => openModal(p)}
                        className="bg-[#5bc0de] hover:bg-[#46b8da] text-white px-3 py-1 rounded shadow text-xs font-semibold uppercase tracking-wide transition-all"
                      >
                        view Detail
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="9"
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    No payments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 0 && (
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-600">
              Showing <span className="font-medium">{page * size + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min((page + 1) * size, totalElements)}
              </span>{" "}
              of <span className="font-medium">{totalElements}</span> results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 0}
                className="px-3 py-1 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors"
              >
                <FaChevronLeft />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i)
                .filter(
                  (i) =>
                    i === 0 || i === totalPages - 1 || Math.abs(page - i) <= 1
                )
                .map((i, idx, arr) => (
                  <React.Fragment key={i}>
                    {idx > 0 && arr[idx - 1] !== i - 1 && (
                      <span className="px-2 text-gray-400">...</span>
                    )}
                    <button
                      onClick={() => handlePageChange(i)}
                      className={`px-3 py-1 border rounded-md text-sm font-medium transition-colors ${
                        page === i
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-gray-300 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {i + 1}
                    </button>
                  </React.Fragment>
                ))}
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages - 1}
                className="px-3 py-1 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedPayment && (
        <ActionModal
          isOpen={isModalOpen}
          onCancel={closeModal}
          title={`Payment Detail For Job No. ${selectedPayment.jobNo}`}
        >
          <div className="border border-gray-200 rounded-sm overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-2 divide-x divide-gray-200 border-b border-gray-200">
              <div className="p-3 bg-gray-300 font-bold text-gray-700 text-sm">
                Name
              </div>
              <div className="p-3 bg-gray-300 font-bold text-gray-700 text-sm">
                Particular
              </div>
            </div>

            {/* Job No */}
            <div className="grid grid-cols-2 divide-x divide-gray-200 border-b">
              <div className="p-3 bg-gray-50 font-bold text-gray-600 text-sm">
                Job No
              </div>
              <div className="p-3 bg-white text-gray-800 text-sm font-medium">
                {/* {selectedPayment.jobNo} */}
                {formatJobNo(selectedPayment, companyName)}
              </div>
            </div>

            {/* Job Type */}
            <div className="grid grid-cols-2 divide-x divide-gray-200 border-b">
              <div className="p-3 bg-gray-50 font-bold text-gray-600 text-sm">
                Job Type
              </div>
              <div className="p-3 bg-white text-gray-800 text-sm font-medium">
                {selectedPayment.jobType || "New Installation"}
              </div>
            </div>

            {/* Customer Name */}
            <div className="grid grid-cols-2 divide-x divide-gray-200 border-b">
              <div className="p-3 bg-gray-50 font-bold text-gray-600 text-sm">
                Customer Name
              </div>
              <div className="p-3 bg-white text-gray-800 text-sm font-medium">
                {selectedPayment.customerName || "N/A"}
              </div>
            </div>

            {/* Payment Date */}
            <div className="grid grid-cols-2 divide-x divide-gray-200 border-b">
              <div className="p-3 bg-gray-50 font-bold text-gray-600 text-sm">
                Payment Date
              </div>
              <div className="p-3 bg-white text-gray-800 text-sm font-medium">
                {formatDateShort(selectedPayment.paymentDate)}
              </div>
            </div>

            {/* Amount Paid */}
            <div className="grid grid-cols-2 divide-x divide-gray-200 border-b">
              <div className="p-3 bg-gray-50 font-bold text-gray-600 text-sm">
                Amount Paid
              </div>
              <div className="p-3 bg-white text-gray-800 text-sm font-medium">
                {formatCurrency(selectedPayment.amountPaid)}
              </div>
            </div>

            {/* Payment Type */}
            <div className="grid grid-cols-2 divide-x divide-gray-200">
              <div className="p-3 bg-gray-50 font-bold text-gray-600 text-sm">
                Payment Type
              </div>
              <div className="p-3 bg-white text-gray-800 text-sm font-medium">
                {selectedPayment.paymentType}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={closeModal}
              className="bg-[#d9534f] hover:bg-[#c9302c] text-white px-4 py-2 rounded shadow flex items-center transition-colors"
            >
              <FaTimes className="mr-2" /> Close
            </button>
          </div>
        </ActionModal>
      )}
    </div>
  );
}
