"use client";

import { useState, useEffect } from "react";
import {
  FaPrint,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaChevronLeft,
  FaChevronRight,
  FaSyncAlt,
} from "react-icons/fa";
import axiosInstance from "@/utils/axiosInstance";

const getSortIcon = (column, sortBy, direction) => {
  if (sortBy === column) {
    return direction === "asc" ? (
      <FaSortUp className="ml-1" />
    ) : (
      <FaSortDown className="ml-1" />
    );
  }
  return <FaSort className="ml-1 text-gray-400" />;
};

const AmcInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [counts, setCounts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingCounts, setLoadingCounts] = useState(false);

  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalPages: 0,
    totalElements: 0,
  });

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("invoiceDate");
  const [direction, setDirection] = useState("desc");

  // ✅ Fetch summary counts
  const fetchCounts = async () => {
    try {
      setLoadingCounts(true);
      const response = await axiosInstance.get("/api/amc/invoices/counts");
      setCounts(response.data);
    } catch (error) {
      console.error("Error fetching invoice counts:", error);
    } finally {
      setLoadingCounts(false);
    }
  };

  // ✅ Fetch invoice list
  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/amc/invoices/getAllInvoices", {
        params: {
          page: pagination.page,
          size: pagination.size,
          search: search || null,
          sortBy,
          direction,
        },
      });
      const data = response.data;
      setInvoices(data.content);
      setPagination((prev) => ({
        ...prev,
        page: data.number,
        size: data.size,
        totalPages: data.totalPages,
        totalElements: data.totalElements,
      }));
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Initial load
  useEffect(() => {
    fetchCounts();
  }, []);

  // ✅ Refetch list when filters change
  useEffect(() => {
    fetchInvoices();
  }, [pagination.page, pagination.size, search, sortBy, direction]);

  const getPaymentStatus = (isCleared) => {
    if (isCleared === 1) {
      return (
        <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
          Paid
        </span>
      );
    }
    if (isCleared === 0) {
      return (
        <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
          Pending
        </span>
      );
    }
    return <span className="text-gray-500">-</span>;
  };

  const handlePrintPdf = (invoiceId) => {
    alert(`Initiating PDF download for Invoice ID: ${invoiceId}`);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setDirection(direction === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setDirection("asc");
    }
    setPagination((prev) => ({ ...prev, page: 0 }));
  };

  const handleRowsChange = (e) => {
    setPagination({ ...pagination, size: Number(e.target.value), page: 0 });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      setPagination({ ...pagination, page: newPage });
    }
  };

  return (
    <div className="p-6 sm:p-8 bg-gray-10 min-h-screen">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-2">
        AMC Invoice
      </h1>

      {/* ✅ Summary Section */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Invoice Summary</h2>
        <button
          onClick={fetchCounts}
          disabled={loadingCounts}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-50"
        >
          <FaSyncAlt className={`w-4 h-4 ${loadingCounts ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {counts ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white shadow-md rounded-xl p-4 border-l-4 border-blue-500">
            <h3 className="text-gray-500 text-sm">Total Invoices</h3>
            <p className="text-2xl font-bold text-gray-900">{counts.totalInvoices}</p>
          </div>
          <div className="bg-white shadow-md rounded-xl p-4 border-l-4 border-green-500">
            <h3 className="text-gray-500 text-sm">Paid Invoices</h3>
            <p className="text-2xl font-bold text-green-700">{counts.paidInvoices}</p>
          </div>
          <div className="bg-white shadow-md rounded-xl p-4 border-l-4 border-yellow-500">
            <h3 className="text-gray-500 text-sm">Pending Invoices</h3>
            <p className="text-2xl font-bold text-yellow-700">{counts.pendingInvoices}</p>
          </div>
          <div className="bg-white shadow-md rounded-xl p-4 border-l-4 border-purple-500">
            <h3 className="text-gray-500 text-sm">Total Amount Received</h3>
            <p className="text-2xl font-bold text-purple-700">
              ₹{counts.totalAmountReceived.toFixed(2)}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 mb-8">Loading summary...</p>
      )}

      {/* ✅ Table Section (Your Original Code) */}
      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="p-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Invoices List</h2>
        </div>

        {/* Search + Rows per page */}
        <div className="p-5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <input
            type="text"
            placeholder="Search by invoice number or site name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPagination((prev) => ({ ...prev, page: 0 }));
            }}
            className="flex-grow border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-4 py-2 rounded-lg transition duration-150 ease-in-out sm:w-1/3 w-full"
          />
          <div className="flex items-center space-x-2">
            <span className="text-gray-600 text-sm">Rows per page:</span>
            <select
              value={pagination.size}
              onChange={handleRowsChange}
              className="border border-gray-300 px-3 py-2 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {[5, 10, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-10 text-lg text-blue-600">
              <div
                className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full"
                role="status"
              ></div>
              <p className="mt-2">Loading Invoices...</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    { key: "#", sortable: false, align: "center" },
                    { key: "invoiceNo", label: "Invoice No", sortable: true, align: "left" },
                    { key: "siteName", label: "Site Name", sortable: true, align: "left" },
                    { key: "siteAddress", label: "Site Address", sortable: false, align: "left" },
                    { key: "invoiceDate", label: "Invoice Date", sortable: true, align: "center" },
                    { key: "totalAmt", label: "Total Amount", sortable: false, align: "right" },
                    { key: "isCleared", label: "Status", sortable: false, align: "center" },
                    { key: "action", label: "Action", sortable: false, align: "center" },
                  ].map((col) => (
                    <th
                      key={col.key}
                      onClick={() => col.sortable && handleSort(col.key)}
                      className={`px-6 py-2 text-${col.align} text-xs font-medium text-gray-500 uppercase tracking-wider ${
                        col.sortable
                          ? "cursor-pointer hover:bg-gray-100 transition duration-150"
                          : ""
                      }`}
                    >
                      <div
                        className={`flex items-center ${
                          col.align === "center"
                            ? "justify-center"
                            : col.align === "right"
                            ? "justify-end"
                            : ""
                        }`}
                      >
                        {col.label}
                        {col.sortable && getSortIcon(col.key, sortBy, direction)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.length > 0 ? (
                  invoices.map((invoice, i) => (
                    <tr
                      key={invoice.invoiceId}
                      className="hover:bg-blue-50 transition duration-100 ease-in-out even:bg-gray-50"
                    >
                      <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                        {i + 1 + pagination.page * pagination.size}
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-800 font-semibold">
                        {invoice.invoiceNo}
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-700">
                        {invoice.siteName || "N/A"}
                      </td>
                      <td className="px-6 py-2 text-xs text-gray-500 max-w-xs truncate">
                        {invoice.siteAddress || "-"}
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 text-center">
                        {invoice.invoiceDate}
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900 font-mono text-right">
                        <span className="font-bold">
                          ₹{invoice.totalAmt?.toFixed(2) || "0.00"}
                        </span>
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-center">
                        {getPaymentStatus(invoice.isCleared)}
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-center text-sm font-medium">
                        <button
                          onClick={() => handlePrintPdf(invoice.invoiceId)}
                          className="text-blue-600 hover:text-blue-900 transition duration-150 p-1 rounded-full hover:bg-blue-100"
                          title="Print Invoice PDF"
                        >
                          <FaPrint className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className="text-center py-10 text-gray-500 text-lg"
                    >
                      No invoices found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 0 && (
          <div className="p-5 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center text-sm">
            <div className="text-gray-600 mb-2 sm:mb-0">
              Showing{" "}
              <span className="font-medium">
                {Math.min(
                  pagination.page * pagination.size + 1,
                  pagination.totalElements
                )}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(
                  (pagination.page + 1) * pagination.size,
                  pagination.totalElements
                )}
              </span>{" "}
              of <span className="font-medium">{pagination.totalElements}</span>{" "}
              results
            </div>

            <div className="flex items-center space-x-2">
              <button
                disabled={pagination.page === 0}
                onClick={() => handlePageChange(pagination.page - 1)}
                className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <FaChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: pagination.totalPages }, (_, idx) => idx)
                .filter(
                  (idx) =>
                    idx === 0 ||
                    idx === pagination.totalPages - 1 ||
                    (idx >= pagination.page - 1 && idx <= pagination.page + 1)
                )
                .map((idx, index, array) => (
                  <span key={idx}>
                    {index > 0 && array[index - 1] < idx - 1 && (
                      <span className="px-1 text-gray-500">...</span>
                    )}
                    <button
                      onClick={() => handlePageChange(idx)}
                      className={`px-4 py-2 rounded-lg font-medium transition ${
                        idx === pagination.page
                          ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                          : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  </span>
                ))}

              <button
                disabled={pagination.page === pagination.totalPages - 1}
                onClick={() => handlePageChange(pagination.page + 1)}
                className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <FaChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AmcInvoices;
