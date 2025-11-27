"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  RotateCcw,
  FileSignature,
  Mail,
  Lock,
  Unlock, // Use Unlock for non-finalized
  ArrowUpDown,
  Download, // Using Download for PDF
  Eye, // Using Eye for view material
  Edit3, // Using Edit3 for revision
  Pencil,      // Using for general Edit
  Trash2,   // Using for Delete
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { toast } from "react-hot-toast";
import { confirmActionWithToast } from "@/components/UI/toastUtils";
import { deleteQuotationApi, getPagewiseQuotations, finalizeQuotation } from "@/services/quotationApi";
import { formatDate, formatCurrency } from "@/utils/common";
import { generatePdf } from "@/utils/generatePdf"
import { generatePdfWithLetterhead } from "@/utils/pdfGeneratorWithHead";
import { generatePdfWithOutLetterhead } from "@/utils/pdfGeneratorWithoutHead";
import { getTenant } from "@/utils/tenant";

export default function QuotationList() {
  const router = useRouter();

  const [quotations, setQuotations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [totalPages, setTotalPages] = useState(1); // Initialize to 1 to prevent errors on first render
  const [totalElements, setTotalElements] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "desc" }); // Default sort
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPdfLoading, setIsPdfLoading] = useState(false);

  const [userId, setUserId] = useState(0);

  useEffect(() => {
    const tenant = getTenant();
    const storedId = localStorage.getItem(tenant ? `${tenant}_userId` : "userId");
    if (storedId && storedId !== userId) {
      setUserId(storedId);
    }
  }, [userId]);

  const fetchQuotations = async () => {
    setIsLoading(true);

    const sortString = `${sortConfig.key},${sortConfig.direction}`;

    try {
      // Call the new API function
      const response = await getPagewiseQuotations(
        currentPage - 1, // API expects 0-based page number
        itemsPerPage,
        sortString
      );

      if (response.success && response.data) {
        const paginationData = response.data;

        // 💡 Process only the content list
        const dataWithSr = (paginationData.content || []).map((item, index) => ({
          ...item,
          // SR number calculation changes: (page * size) + index + 1
          sr: (paginationData.currentPage * paginationData.pageSize) + index + 1
        }));

        setQuotations(dataWithSr);

        // 💡 Update pagination metadata
        setTotalPages(paginationData.totalPages);
        setTotalElements(paginationData.totalElements);
      } else {
        toast.error(response.message || "Could not load quotations.");
        setQuotations([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Critical fetch error:", error);
      toast.error("An unexpected error occurred while fetching data.");
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, [currentPage, itemsPerPage, sortConfig]); // 💡 Critical dependency array change!

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset page on search change
  };

  // 🔍 Search Filter
  const filteredData = useMemo(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return quotations.filter((item) =>
      Object.values(item).some(
        (value) =>
          (typeof value === "string" || typeof value === "number") &&
          String(value).toLowerCase().includes(lowerCaseQuery)
      )
    );
  }, [quotations, searchQuery]);

  // --- PDF generation handlers ---
  const getTenantId = () => {
    // Implement your logic to retrieve the active tenant ID
    return localStorage.getItem("tenant") || "default-tenant";
  };

  const generatePDF = (quotationMainId, includeLetterhead) => {
    const tenantId = getTenantId();
    if (!tenantId) {
      console.error("Tenant ID not available.");
      // toast.error("Tenant configuration missing.");
      return;
    }

    // Call the new backend API route
    const apiUrl = `/api/pdf-generation?quotationId=${quotationMainId}&includeLetterhead=${includeLetterhead}&tenant=${tenantId}`;

    // Trigger the PDF download/view in a new tab
    window.open(apiUrl, '_blank');

    // Optional: Add a toast notification for the user
    // toast.info("PDF generation started in the background...");
  };


  const handlePdfGeneration = (generatorFunction, includeLetterhead, row) => {
    // Only start if not already loading
    if (isPdfLoading) return;

    const onStart = () => setIsPdfLoading(true);
    const onComplete = () => setIsPdfLoading(false);

    // Pass the row data and the handlers to the utility function
    generatorFunction(row.id, includeLetterhead, onStart, onComplete);
  };

  const handleFinalize = (quotationId, quotationNo) => {
    const itemName = `Quotation No: ${quotationNo} (ID: ${quotationId})`;

    confirmActionWithToast(itemName, async () => {
      const TOAST_ID = `finalize-quote-${quotationId}`;

      try {
        toast.loading(`Finalizing ${itemName}...`, { id: TOAST_ID });
        const response = await finalizeQuotation(quotationId, userId);

        if (response.success) {
          toast.success(`${itemName} finalized successfully!`, { id: TOAST_ID });
          await fetchQuotations();
        } else {
          toast.error(response.message || `Finalization failed for ${itemName}.`, { id: TOAST_ID });
        }
      } catch (error) {
        toast.error(`Error finalizing ${itemName}.`, { id: TOAST_ID });
        console.error("Finalization error:", error);
      }
    }, "finalize");
  };

  const handleDeleteQuotation = (quotationId, quotationNo) => {
    const itemName = `Quotation No: ${quotationNo} (ID: ${quotationId})`;

    confirmActionWithToast(itemName, async () => {
      const TOAST_ID = `delete-quote-${quotationId}`;

      try {
        toast.loading(`Deleting ${itemName}...`, { id: TOAST_ID });

        const response = await deleteQuotationApi(quotationId, userId);

        if (response.success) {
          toast.success(`${itemName} deleted successfully!`, { id: TOAST_ID });
          await fetchQuotations();
          console.log(`Successful deletion of ${quotationId}. Refreshing list.`);
        } else {
          toast.error(response?.message || `Failed to delete ${itemName}.`, { id: TOAST_ID });
        }
      } catch (error) {
        console.error("Deletion error:", error);
        toast.error(`Error deleting ${itemName}.`, { id: TOAST_ID });
      }
    });
  };

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // --- Components ---

  const TableHeader = ({ keys }) => (
    <thead className="sticky top-0 z-20 bg-white border-b border-gray-200">
      <tr className="shadow-sm">
        {keys.map(({ key, label, className = '' }) => (
          <th
            key={key}
            className={`px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600 tracking-wider cursor-pointer hover:bg-gray-50 transition ${className}`}
            onClick={() => requestSort(key)}
          >
            <div className="flex items-center gap-1">
              {label}
              <ArrowUpDown
                className={`h-3 w-3 ${sortConfig.key === key ? "text-blue-600" : "text-gray-400"
                  }`}
              />
            </div>
          </th>
        ))}
        {/* Action Column Group */}
        <th colSpan={7} className="px-4 py-3 text-center text-xs font-semibold uppercase text-gray-600 tracking-wider">
          Actions
        </th>
        <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-gray-600 tracking-wider">
          Status
          <div className="text-center text-2xs font-semibold text-gray-500 tracking-wider">isFinalized</div>
        </th>
      </tr>
      {/* Cleaner Sub-Header for PDF */}
      <tr className="bg-gray-50 text-center text-xs font-medium text-gray-500 sticky top-[2.4rem] z-10">
        <th colSpan={7}></th>
        <th className="py-1">View</th>
        <th className="py-1">Revise</th>
        <th className="py-1 border-l border-r border-gray-200">PDF With Letterhead</th>
        <th className="py-1 border-r border-gray-200">PDF Without Letterhead</th>
        <th className="py-1">Mail</th>
        <th className="py-1">Edit</th>
        <th className="py-1">Delete</th>
      </tr>
    </thead>
  );

  return (
    <div className="w-full max-w-9xl mx-auto p-2 md:p-4">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">

        {/* Header & Search Bar */}
        <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-3xl font-bold text-blue-700 tracking-wide">
            Quotation List ({quotations.length} total)
          </h2>
          <input
            type="text"
            placeholder="🔍 Search in all columns..."
            className="border border-gray-300 px-4 py-2 rounded-xl w-full md:w-96 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-inner"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto max-h-[70vh]">
          <table className="min-w-full text-sm text-gray-700 table-auto">

            <TableHeader
              keys={[
                { key: "id", label: "Sr.No" },
                { key: "quotationDate", label: "Date" },
                { key: "customerName", label: "Customer" },
                { key: "siteName", label: "Site" },
                { key: "createdByEmployeeName", label: "Generated By" },
                { key: "quotationNo", label: "Lift Type" },
                { key: "totalAmount", label: "Lift Rate" },
              ]}
            />

            <tbody className="divide-y divide-gray-100">
              {quotations.length > 0 ? (
                quotations.map((row) => (
                  <tr
                    key={row.sr}
                    className="hover:bg-indigo-50 transition duration-150 text-gray-800"
                  >
                    <td className="px-4 py-3 font-medium">{row.sr}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{formatDate(row.quotationDate)}</td>
                    <td className="px-4 py-3 font-medium">{row.customerName}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{row.siteName}</td>
                    <td className="px-4 py-3">{row.createdByEmployeeName ? row.createdByEmployeeName.split(' - ')[0] : 'N/A'}</td>
                    <td className="px-4 py-3">
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{row.quotationNo}</span>
                    </td>
                    <td className="px-4 py-3 font-extrabold text-green-600 whitespace-nowrap">
                      {formatCurrency(row.totalAmount)}
                    </td>

                    {/* Action Buttons (Center aligned, consistent icons) */}

                    {/* 1. View Material */}
                    <td className="px-4 py-3 text-center">
                      <Link
                        href={`/dashboard/quotations/new-installation/${row.id}/view-material`}
                        title="View Material Details"
                      >
                        <Eye className="h-5 w-5 text-sky-600 hover:text-sky-800 mx-auto transition" />
                      </Link>
                    </td>

                    {/* 2. Revise Button (Disabled if Finalized) */}
                    <td className="px-4 py-3 text-center">
                      {row.isFinalized ? (
                        <span
                          title="Quotation is Finalized and cannot be Revised directly. A formal revision process may be required."
                          className="cursor-not-allowed inline-block"
                        >
                          <RotateCcw className="h-5 w-5 text-gray-400 mx-auto" />
                        </span>
                      ) : (
                        // <Link
                        //   href={`/dashboard/quotations/new-installation/${row.id}/revision`}
                        //   title="Create Revision of this Draft Quotation"
                        // >
                        //   <RotateCcw className="h-5 w-5 text-indigo-600 hover:text-indigo-800 mx-auto transition" />
                        // </Link>
                        <Link
                          href={`/dashboard/lead-management/enquiries/${row.leadId}/quotation/add/${row.combinedEnquiryId}?action=revision`}
                          title="Create Revision of this Draft Quotation"
                        >
                          <RotateCcw className="h-5 w-5 text-indigo-600 hover:text-indigo-800 mx-auto transition" />
                        </Link>

                      )}
                    </td>

                    {/* 3. PDF with Letterhead */}
                    <td className="px-4 py-3 text-center">
                      <Download
                        className="h-5 w-5 text-green-600 hover:text-green-700 mx-auto transition"
                        title="Download PDF With Letterhead"
                        onClick={() => generatePDF(row.id, true)}
                      />
                    </td>

                    {/* 4. PDF without Letterhead */}
                    <td className="px-4 py-3 text-center">
                      <FileSignature
                        className="h-5 w-5 text-cyan-500 hover:text-cyan-700 mx-auto cursor-pointer transition"
                        title="Download PDF Without Letterhead"
                        onClick={() => generatePDF(row.id, false, row)}
                      />
                    </td>

                    {/* 5. Send Mail */}
                    <td className="px-4 py-3 text-center">
                      <Mail className="h-5 w-5 text-blue-600 hover:text-blue-800 cursor-pointer mx-auto transition" title="Send Quotation via Email" />
                    </td>

                    {/* 6. Edit Button (Disabled if Finalized) */}
                    <td className="px-4 py-3 text-center">
                      {row.isFinalized ? (
                        <span
                          title="Quotation is Finalized and cannot be edited"
                          className="cursor-not-allowed inline-block"
                        >
                          <Pencil className="h-5 w-5 text-gray-400 mx-auto" />
                        </span>
                      ) : (
                        <Link
                          href={`/dashboard/lead-management/enquiries/${row.leadId}/quotation/add/${row.combinedEnquiryId}?action=edit`}
                          title="Edit Quotation"
                        >
                          <Pencil className="h-5 w-5 text-indigo-600 hover:text-indigo-800 mx-auto transition" />
                        </Link>
                      )}
                    </td>

                    {/* 7. Delete */}
                    <td className="px-4 py-3 text-center">
                      {row.isFinalized ? (
                        <span
                          title="Quotation is Finalized and cannot be delete"
                          className="cursor-not-allowed inline-block"
                        >
                          <Trash2 className="h-5 w-5 text-gray-400 mx-auto" />
                        </span>
                      ) : (
                        <button
                          onClick={() => handleDeleteQuotation(row.id, row.quotationNo)}
                          title="Delete Quotation"
                          className="mx-auto"
                        >
                          <Trash2 className="h-5 w-5 text-red-600 hover:text-red-800 mx-auto transition" />
                        </button>
                      )}


                    </td>

                    {/* 8. Status (Is Final) */}
                    <td className="px-4 py-3 text-center">
                      {row.isFinalized ? (
                        <Lock
                          className="h-5 w-5 text-red-500 mx-auto"
                          title="Finalized (Locked)"
                        />
                      ) : (
                        <button
                          onClick={() => handleFinalize(row.id, row.quotationNo)}
                          title="Click to Finalize this Quotation"
                          className="inline-block"
                        >
                          <Unlock
                            className="h-5 w-5 text-green-500 mx-auto hover:text-green-700 transition"
                          />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="14"
                    className="text-center py-10 text-gray-500 italic text-lg"
                  >
                    {quotations.length === 0 && searchQuery === ""
                      ? "No quotations found. Start by creating a new one."
                      : `No matching results found for "${searchQuery}".`}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* --- Footer and Pagination --- */}
        <div className="p-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center text-sm gap-4 bg-gray-50">

          {/* Items Per Page Selector */}
          <div className="text-gray-600">
            Showing {quotations.length} of {filteredData.length} results.
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-3">
            <select
              className="border border-gray-300 px-2 py-1 rounded-lg text-sm bg-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
              <option value={filteredData.length}>All</option>
            </select>

            <div className="flex items-center gap-1">
              <button
                className="p-2 border rounded-full bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                title="Previous Page"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
              </button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .slice(
                  Math.max(currentPage - 2, 0),
                  Math.min(currentPage + 3, totalPages)
                )
                .map((num) => (
                  <button
                    key={num}
                    onClick={() => setCurrentPage(num)}
                    className={`px-3 py-1 rounded-lg font-medium transition ${currentPage === num
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-white text-gray-700 hover:bg-indigo-100"
                      }`}
                  >
                    {num}
                  </button>
                ))}

              <button
                className="p-2 border rounded-full bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                title="Next Page"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
