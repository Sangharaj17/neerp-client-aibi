"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import {
  FaPrint,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaChevronLeft,
  FaChevronRight,
  FaSyncAlt,
} from "react-icons/fa";
import { RefreshCw, FileText } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import { formatDate, formatDateShort } from "@/utils/common";
import InvoiceModal from "./InvoiceModal";

const InvoiceListPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const invoiceRef = useRef();

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

  const [summary, setSummary] = useState({
    totalInvoices: 0,
    paidInvoices: 0,
    pendingInvoices: 0,
    totalAmountReceived: 0,
  });

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCounts, setLoadingCounts] = useState(false);

  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalPages: 0,
    totalElements: 0,
  });

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState(""); // For input display
  const [sortBy, setSortBy] = useState("createdAt");
  const [direction, setDirection] = useState("desc");
  const prevSearchRef = useRef("");

  const fetchSummary = async () => {
    try {
      setLoadingCounts(true);
      const res = await axiosInstance.get("/api/ni-invoices/summary");
      if (res.data.success) setSummary(res.data.data);
    } catch (error) {
      console.error("Error fetching invoice counts:", error);
    } finally {
      setLoadingCounts(false);
    }
  };

  /*
   * ✅ CLIENT-SIDE SORTING LOGIC
   * Sorts the currently fetched page data locally.
   */
  const sortedInvoices = useMemo(() => {
    if (!sortBy) return invoices;

    return [...invoices].sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      // Special handling for "Invoice For" column
      if (sortBy === "payFor") {
        valA = a.jobId;
        valB = b.jobId;
      } else {
        valA = a[sortBy];
        valB = b[sortBy];
      }

      // 1️⃣ Handle null / undefined
      if (valA == null && valB == null) return 0;
      if (valA == null) return 1;
      if (valB == null) return -1;

      // 2️⃣ Date sorting (ISO or yyyy-mm-dd)
      if (sortBy.toLowerCase().includes("date")) {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }

      // 3️⃣ Numeric sorting (amounts, ids)
      else if (typeof valA === "number" && typeof valB === "number") {
        // already numbers
      } else if (!isNaN(valA) && !isNaN(valB)) {
        valA = Number(valA);
        valB = Number(valB);
      }

      // 4️⃣ Boolean sorting
      else if (typeof valA === "boolean" && typeof valB === "boolean") {
        valA = valA ? 1 : 0;
        valB = valB ? 1 : 0;
      }

      // 5️⃣ String sorting (case-insensitive)
      else {
        valA = String(valA).toLowerCase();
        valB = String(valB).toLowerCase();
      }

      if (valA < valB) return direction === "asc" ? -1 : 1;
      if (valA > valB) return direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [invoices, sortBy, direction]);

  // const sortedInvoices = [...invoices].sort((a, b) => {
  //   let valA = a[sortBy];
  //   let valB = b[sortBy];

  //   // Handle null/undefined values safely
  //   if (valA === null || valA === undefined) valA = "";
  //   if (valB === null || valB === undefined) valB = "";

  //   // Specific handling for dates (if string is ISO format or standard date string)
  //   if (sortBy === "invoiceDate" || sortBy === "createdAt") {
  //     valA = new Date(valA).getTime();
  //     valB = new Date(valB).getTime();
  //   }

  //   // Numeric sorting for amounts
  //   if (sortBy === "totalAmount") {
  //     valA = Number(valA) || 0;
  //     valB = Number(valB) || 0;
  //   }

  //   // String sorting (case-insensitive)
  //   if (typeof valA === "string") {
  //     valA = valA.toLowerCase();
  //     valB = valB.toLowerCase();
  //   }

  //   if (valA < valB) return direction === "asc" ? -1 : 1;
  //   if (valA > valB) return direction === "asc" ? 1 : -1;
  //   return 0;
  // });

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/api/ni-invoices", {
        params: {
          page: pagination.page,
          size: pagination.size,
          search: search || null,
          // sortBy,  <-- REMOVED: We want to fetch data as-is (or default order)
          // direction, <-- REMOVED: and sort locally on the client.
        },
      });

      console.log("res.data", res.data);
      if (res.data.success) {
        const data = res.data.data;
        console.log("data", data);
        console.log("data.content", data.content);
        setInvoices(data.content);
        setPagination({
          page: data.page,
          size: data.size,
          totalPages: data.totalPages,
          totalElements: data.totalElements,
        });
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  // ✅ Debounced search - wait 500ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      const value = searchInput.trim();
      setSearch(value.length > 0 ? value : "");
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // ✅ Reset to page 0 when search changes
  useEffect(() => {
    if (search !== prevSearchRef.current) {
      prevSearchRef.current = search;
      setPagination((prev) => ({ ...prev, page: 0 }));
    }
  }, [search]);

  // ✅ Refetch list when filters change (NOTE: Removed sortBy/direction dependency)
  useEffect(() => {
    fetchInvoices();
  }, [pagination.page, pagination.size, search]); // Removed sortBy, direction

  const handleRowsChange = (e) => {
    const newSize = Number(e.target.value);

    setPagination((prev) => ({
      ...prev,
      page: 0, // reset to first page
      size: newSize,
    }));
  };

  const handleSort = (column) => {
    // Just updates state, which triggers re-render and re-sort of `sortedInvoices`
    if (sortBy === column) {
      setDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setDirection("asc");
    }
    // No need to reset page on local sort
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handlePrintPdf = (invoice) => {
    console.log("Invoice ID to print:", invoice.invoiceId);
    setSelectedInvoiceId(invoice.invoiceId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Optionally reset the selected ID when closing the modal
    setSelectedInvoiceId(null);
  };

  return (
    <div className="p-6 sm:p-8 bg-gray-10 min-h-screen">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-2">
        New Installation Invoices
      </h1>

      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Invoice Summary</h2>
        <button
          onClick={fetchSummary}
          disabled={loadingCounts}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-50"
        >
          <FaSyncAlt
            className={`w-4 h-4 ${loadingCounts ? "animate-spin" : ""}`}
          />
          <span>Refresh</span>
        </button>
      </div>

      {summary ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <SummaryCard
            title="Total Invoices"
            value={summary.totalInvoices}
            color="blue"
          />
          <SummaryCard
            title="Paid Invoices"
            value={summary.paidInvoices}
            color="green"
          />
          <SummaryCard
            title="Pending Invoices"
            value={summary.pendingInvoices}
            color="yellow"
          />
          <SummaryCard
            title="Total Amount Received"
            value={`₹${Number(summary.totalAmountReceived).toFixed(2)}`}
            color="purple"
          />
        </div>
      ) : (
        <p className="text-gray-500 mb-8">Loading summary...</p>
      )}

      {/* Invoice List */}
      <div className="bg-white rounded-xl shadow-md p-5">
        <h2 className="text-lg font-semibold mb-4">Invoices List</h2>
        {loading ? (
          <div className="text-center py-10 text-lg text-blue-600">
            <div
              className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full"
              role="status"
            ></div>
            <p className="mt-2">Loading Invoices...</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <input
                type="text"
                autoFocus
                placeholder="Search by invoice number, customer, site, address, amount..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="flex-grow border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-4 py-2 rounded-lg transition duration-150 ease-in-out sm:w-1/3 w-1/2"
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

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 text-gray-600 text-sm border-b">
                  <tr>
                    {[
                      { key: "#", sortable: false, align: "center" },
                      {
                        key: "invoiceNo",
                        label: "Invoice No",
                        sortable: true,
                        align: "left",
                      },
                      {
                        key: "customerName",
                        label: "Customer Name",
                        sortable: true,
                        align: "left",
                      },
                      {
                        key: "siteName",
                        label: "Site Name",
                        sortable: true,
                        align: "left",
                      },
                      {
                        key: "siteAddress",
                        label: "Site Address",
                        sortable: true,
                        align: "left",
                      },
                      {
                        key: "invoiceDate",
                        label: "Invoice Date",
                        sortable: true,
                        align: "center",
                      },
                      {
                        key: "totalAmount",
                        label: "Total Amount",
                        sortable: true,
                        align: "right",
                      },
                      {
                        key: "payFor",
                        label: "Invoice For",
                        sortable: true,
                        align: "center",
                      },
                      {
                        key: "status",
                        label: "Status",
                        sortable: true,
                        align: "center",
                      },
                      {
                        key: "action",
                        label: "Action",
                        sortable: false,
                        align: "center",
                      },
                    ].map((col) => (
                      // <th
                      //   key={col.key}
                      //   onClick={() => col.sortable && handleSort(col.key)}
                      //   className={`px-6 py-2 text-${
                      //     col.align
                      //   } text-xs font-medium text-gray-800 uppercase tracking-wider ${
                      //     col.sortable
                      //       ? "cursor-pointer hover:bg-gray-100 transition duration-150"
                      //       : ""
                      //   }`}
                      // >
                      //   <div
                      //     className={`flex items-center ${
                      //       col.align === "center"
                      //         ? "justify-center"
                      //         : col.align === "right"
                      //         ? "justify-end"
                      //         : ""
                      //     }`}
                      //   >
                      //     {col.label}
                      //     {col.sortable &&
                      //       getSortIcon(col.key, sortBy, direction)}
                      //   </div>
                      // </th>
                      <th
                        key={col.key}
                        onClick={() => col.sortable && handleSort(col.key)}
                        className={`px-6 py-2 ${
                          col.sortable ? "cursor-pointer hover:bg-gray-100" : ""
                        }`}
                      >
                        <div className="flex items-center">
                          {col.label}
                          {col.sortable &&
                            getSortIcon(col.key, sortBy, direction)}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedInvoices.length > 0 ? (
                    sortedInvoices.map((inv, idx) => (
                      <tr
                        key={inv.invoiceId}
                        className="hover:bg-blue-50 transition duration-100 ease-in-out even:bg-gray-50"
                      >
                        <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                          {idx + 1 + pagination.page * pagination.size}
                        </td>

                        <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-800 font-semibold">
                          {inv.invoiceNo}
                        </td>

                        <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-700 font-medium">
                          {inv.customerName || "-"}
                        </td>

                        <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-700">
                          {inv.siteName || "N/A"}
                        </td>

                        <td className="px-6 py-2 text-xs text-gray-500 max-w-xs truncate">
                          {inv.siteAddress || "-"}
                        </td>

                        <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 text-center">
                          {formatDateShort(inv.invoiceDate)}
                        </td>

                        <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900 font-mono text-right">
                          <span className="font-bold">
                            ₹{inv.totalAmount?.toFixed(2) || "0.00"}
                          </span>
                        </td>

                        <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900 font-mono text-right">
                          <span className="font-bold">
                            {/* {inv.payFor}[Job:{inv.jobId}] */}
                            Job:{inv.jobId}
                          </span>
                        </td>

                        <td className="px-6 py-2 whitespace-nowrap text-center">
                          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs">
                            {inv.status}
                          </span>
                        </td>
                        <td className="px-6 py-2 whitespace-nowrap text-center text-sm font-medium">
                          <button
                            onClick={() => handlePrintPdf(inv)} // Calls the handler with the invoice ID
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
                        No invoices data found .
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
              <span>
                Showing 1 to {invoices.length} of {invoices.length} results
              </span>
              <div className="flex gap-2">
                <button className="px-3 py-1 border rounded-md">‹</button>
                <button className="px-3 py-1 bg-blue-600 text-white rounded-md">
                  1
                </button>
                <button className="px-3 py-1 border rounded-md">›</button>
              </div>
            </div> */}
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
                  of{" "}
                  <span className="font-medium">
                    {pagination.totalElements}
                  </span>{" "}
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

                  {Array.from(
                    { length: pagination.totalPages },
                    (_, idx) => idx
                  )
                    .filter(
                      (idx) =>
                        idx === 0 ||
                        idx === pagination.totalPages - 1 ||
                        (idx >= pagination.page - 1 &&
                          idx <= pagination.page + 1)
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
          </>
        )}
      </div>

      {isModalOpen && (
        <InvoiceModal invoiceId={selectedInvoiceId} onClose={closeModal} />
      )}
    </div>
  );
};

/* ================= SUMMARY CARD ================= */

const SummaryCard = ({ title, value, color }) => {
  const colors = {
    blue: "border-blue-500 text-blue-600",
    green: "border-green-500 text-green-600",
    yellow: "border-yellow-500 text-yellow-600",
    purple: "border-purple-500 text-purple-600",
  };

  return (
    <div
      className={`bg-white p-4 rounded-xl shadow-md border-l-4 ${colors[color]}`}
    >
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
};

export default InvoiceListPage;
