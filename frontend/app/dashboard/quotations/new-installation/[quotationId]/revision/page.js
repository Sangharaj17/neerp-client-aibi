"use client";

import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  RotateCcw,
  FileSignature,
  FileMinus,
  CheckCircle,
  Mail,
  CircleDashed,
  Lock,
  MinusCircle,
  ThumbsDown,
  ThumbsUp,
  CircleSlash,
  Trash2,
  Pencil,
  Download,
} from "lucide-react";
import { useEffect, useState, useMemo, useCallback } from "react";
import { fetchQuotationsByQuotationNo, finalizeQuotation, deleteQuotationApi } from "@/services/quotationApi";
import { toast } from "react-hot-toast";
import { confirmActionWithToast } from "@/components/UI/toastUtils";
import { getTenant } from "@/utils/tenant";

export default function QuotationList() {
  const { quotationId } = useParams();

  const searchParams = useSearchParams();
  const quotationNo = searchParams.get("quot") || "";
  const [data, setData] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true); // Start as true to show loader on mount
  const [userId, setUserId] = useState(null);

  // Get userId from localStorage
  useEffect(() => {
    const tenant = getTenant();
    const storedId = localStorage.getItem(tenant ? `${tenant}_userId` : "userId");
    if (storedId && storedId !== userId) {
      setUserId(storedId);
    }
  }, []);

  useEffect(() => {
    async function load() {
      setDataLoading(true);
      try {
        const result = await fetchQuotationsByQuotationNo(quotationNo);
        console.log("Fetched all quotations by quotation no", quotationNo, ":", result);

        if (result.success) {
          setData(result.data || []);
        } else {
          toast.error(result.message || "Failed to fetch quotations");
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setDataLoading(false);
      }
    }

    if (quotationNo) load();
  }, [quotationNo]);

  // Create a lookup map for parent quotation editions
  const parentEditionMap = useMemo(() => {
    const map = {};
    data.forEach(quotation => {
      map[quotation.id] = quotation.edition;
    });
    return map;
  }, [data]);

  // Check if any quotation in the group is finalized
  const hasAnyFinalized = useMemo(() => {
    return data.some(q => q.isFinalized);
  }, [data]);

  // Handle finalization
  const handleFinalize = async (quotationId, quotationNo) => {
    if (!userId) {
      toast.error("User ID not found. Please log in again.");
      return;
    }

    const itemName = `Quotation No: ${quotationNo} (ID: ${quotationId})`;

    confirmActionWithToast(itemName, async () => {
      const TOAST_ID = `finalize-quote-${quotationId}`;

      try {
        toast.loading(`Finalizing ${itemName}...`, { id: TOAST_ID });
        const response = await finalizeQuotation(quotationId, userId);

        if (response.success) {
          toast.success(`${itemName} finalized successfully!`, { id: TOAST_ID });
          // Reload quotations to get updated data
          const result = await fetchQuotationsByQuotationNo(quotationNo);
          if (result.success) {
            setData(result.data || []);
          }
        } else {
          toast.error(response.message || `Finalization failed for ${itemName}.`, { id: TOAST_ID });
        }
      } catch (error) {
        toast.error(`Error finalizing ${itemName}.`, { id: TOAST_ID });
        console.error("Finalization error:", error);
      }
    }, "finalize");
  };

  // --- PDF generation handlers ---
  const getTenantId = () => {
    // Implement your logic to retrieve the active tenant ID
    return localStorage.getItem("tenant") || "default-tenant";
  };

  const generatePDF = async (quotationMainId, includeLetterhead) => {
    setPageLoading(true);

    try {
      const tenantId = getTenantId();
      if (!tenantId) {
        console.error("Tenant ID not available.");
        setPageLoading(false);
        return;
      }

      console.log("Quotation ID:", quotationMainId);
      console.log("Include Letterhead:", includeLetterhead);
      console.log("Tenant ID:", tenantId);
      const apiUrl = `/api/pdf-generation?quotationId=${quotationMainId}&includeLetterhead=${includeLetterhead}&tenant=${tenantId}`;
      console.log("API URL:", apiUrl);

      // Open PDF in new tab
      window.open(apiUrl, "_blank");

    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      // Stop loading immediately since window.open can't be awaited
      setPageLoading(false);
    }
  };

  // Handle delete quotation
  const handleDelete = (quotationId, quotationNo) => {
    const itemName = `Quotation No: ${quotationNo} (ID: ${quotationId})`;

    confirmActionWithToast(itemName, async () => {
      const TOAST_ID = `delete-quote-${quotationId}`;

      try {
        toast.loading(`Deleting ${itemName}...`, { id: TOAST_ID });

        const response = await deleteQuotationApi(quotationId, userId);

        if (response.success) {
          toast.success(`${itemName} deleted successfully!`, { id: TOAST_ID });
          // Reload quotations to get updated data
          const result = await fetchQuotationsByQuotationNo(quotationNo);
          if (result.success) {
            setData(result.data || []);
          }
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



  // Mock Data - In a real application, this would come from an API call
  // Ensure this data structure is rich enough for PDF generation
  // Changed isFinalized to false for all items by default as per the requirement
  // "original is first one by default all are available for finalization" implies
  // that initially no quote is finalized, but the original edition can be chosen first.
  const [allQuotationData, setAllQuotationData] = useState([
    {
      sr: 1,
      date: "12-07-2025",
      customer: "MR.Kale",
      site: "TEST",
      by: "Owner",
      type: "Manual",
      rate: "688,146",
      edition: "Original", // This will be calculated, but good for initial state clarity
      isFinalized: false, // Changed to false: all are available for finalization initially
      contact: "9999955555",
      amount: "517110",
      gstPercent: "18",
      gstAmount: "93079",
      finalAmount: "610189",
      loadPercent: "20",
      loadAmount: "122037",
      materialsList: [
        // Example materials list for dynamic table
        {
          description: "DOOR SAFETUY SENSOR ONLY FOR AUTOMATIC LIFT",
          quantity: 1,
          unit: "Set",
          pricePerUnit: 7500,
          total: 7500,
        },
        {
          description: "FINAL LIMIT CAMP 10FT",
          quantity: 1,
          unit: "Set",
          pricePerUnit: 1250,
          total: 1250,
        },
        {
          description: "JUNCTION BOX & CARTOP JUNCTION AND MAINTENANCE BO",
          quantity: 1,
          unit: "Set",
          pricePerUnit: 3750,
          total: 3750,
        },
        {
          description: "PENCIL READ",
          quantity: 4,
          unit: "Set",
          pricePerUnit: 1000,
          total: 4000,
        },
        {
          description: "CAR & COUNTER WEIGHT GUIDE RAIL Â WITH HARDWARE:6",
          quantity: 7.5,
          unit: "Set",
          pricePerUnit: 40312.5,
          total: 302343.75,
        },
        // ... add all your materials from image_efcf2a.png here
      ],
    },
    {
      sr: 2,
      date: "12-07-2025",
      customer: "MR.Kale",
      site: "TEST",
      by: "Owner",
      type: "Manual",
      rate: "686,146",
      edition: "Revised 1",
      isFinalized: false,
      contact: "9999955555",
      amount: "517110",
      gstPercent: "18",
      gstAmount: "93079",
      finalAmount: "610189",
      loadPercent: "20",
      loadAmount: "122037",
      materialsList: [],
    },
    {
      sr: 3,
      date: "11-07-2025",
      customer: "MR.Kale",
      site: "TEST",
      by: "Owner",
      type: "Manual",
      rate: "687,146",
      edition: "Revised 2",
      isFinalized: false,
      contact: "9999955555",
      amount: "517110",
      gstPercent: "18",
      gstAmount: "93079",
      finalAmount: "610189",
      loadPercent: "20",
      loadAmount: "122037",
      materialsList: [],
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10); // Changed default to 10 for smaller list initially
  const [currentPage, setCurrentPage] = useState(1);

  // --- EDITION & FINALIZED LOGIC ---
  const processedQuotationData = useMemo(() => {
    const groupedByCustomerSite = allQuotationData.reduce((acc, quote) => {
      const key = `${quote.customer}-${quote.site}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(quote);
      return acc;
    }, {});

    let finalData = [];
    for (const key in groupedByCustomerSite) {
      const group = groupedByCustomerSite[key].sort((a, b) => {
        // Sort by date (descending)
        const dateA = new Date(a.date.split("-").reverse().join("-"));
        const dateB = new Date(b.date.split("-").reverse().join("-"));
        if (dateA > dateB) return -1;
        if (dateA < dateB) return 1;
        // If dates are the same, sort by SR (ascending) to ensure lower SR is considered "Original"
        return a.sr - b.sr;
      });

      // Determine edition
      group.forEach((quote, index) => {
        if (index === 0) {
          quote.edition = "Original";
        } else {
          quote.edition = `Revised ${index}`;
        }
      });

      // Find if any quote in the group is finalized
      const isAnyFinalized = group.some((q) => q.isFinalized);

      // Apply disabled state for 'Is Final' button
      group.forEach((quote) => {
        // Button is disabled if any quote in the group is finalized AND the current quote is NOT finalized
        quote.disableFinalizeButton = isAnyFinalized && !quote.isFinalized;
      });

      finalData = [...finalData, ...group];
    }
    // Re-sort the final data if needed, e.g., by SR number for consistent table display
    return finalData.sort((a, b) => a.sr - b.sr);
  }, [allQuotationData]);

  const handleFinalizeQuotation = useCallback(
    (srToFinalize, customer, site) => {
      setAllQuotationData((prevData) => {
        // Find the current finalized status within the group
        const currentFinalizedQuote = prevData.find(
          (q) => q.customer === customer && q.site === site && q.isFinalized
        );

        return prevData.map((quote) => {
          // If this quote belongs to the same customer/site group
          if (quote.customer === customer && quote.site === site) {
            // If another quote is already finalized and it's not the current one being clicked,
            // then this quote cannot be finalized.
            if (
              currentFinalizedQuote &&
              currentFinalizedQuote.sr !== srToFinalize
            ) {
              return quote; // Do not finalize if another in group is already finalized
            }
            // Toggle the clicked quote's isFinalized status.
            // If a quote is being un-finalized, then all others in the group become enabled again.
            // If a quote is being finalized, others will be disabled by the processedQuotationData logic.
            return {
              ...quote,
              isFinalized:
                quote.sr === srToFinalize ? !quote.isFinalized : false,
            };
          }
          return quote;
        });
      });
    },
    []
  );

  // --- SEARCH AND PAGINATION ---
  const filteredData = useMemo(() => {
    if (!searchQuery) {
      return processedQuotationData;
    }
    const lowerCaseQuery = searchQuery.toLowerCase();
    return processedQuotationData.filter((item) =>
      Object.values(item).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(lowerCaseQuery)
      )
    );
  }, [processedQuotationData, searchQuery]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, itemsPerPage, currentPage]);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when items per page changes
  };

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(1, prevPage - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prevPage) => Math.min(totalPages, prevPage + 1));
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  // Note: Assuming CheckCircle, CircleDashed, ThumbsUp, and ThumbsDown icons are imported (e.g., from 'lucide-react')

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col h-full bg-white shadow-lg rounded-lg p-6">

      {pageLoading && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="animate-spin h-12 w-12 border-4 border-white border-t-transparent rounded-full"></div>
        </div>
      )}

      {/* CARD BASED UI — NO TABLE */}
      {dataLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin h-16 w-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading quotations...</p>
          </div>
        </div>
      ) : data.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-center text-gray-500 text-lg">No quotations found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {data.map((row) => (
            <div
              key={row.id}
              className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-5 flex flex-col justify-between"
            >
              {/* Header Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  {/* 💡 START: EDITION DISPLAY LOGIC */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full 
                                bg-blue-100 text-blue-700">
                      {/* Display "Original" for Edition 0, or "Revision X" for X > 0 */}
                      {row.edition === 0
                        ? "Original"
                        : `Revision ${row.edition}`}
                    </span>

                    {/* 🔗 Parent Quotation Indicator */}
                    {row.edition > 0 && row.parentQuotationId && (
                      <span className="text-xs px-2 py-1 rounded-md bg-purple-50 text-purple-700 border border-purple-200"
                        title={`Revision of Quotation ID: ${row.parentQuotationId}`}>
                        ↳ from #{row.parentQuotationId} ({parentEditionMap[row.parentQuotationId] === 0 ? "Original" : `Revision ${parentEditionMap[row.parentQuotationId]}`})
                      </span>
                    )}
                  </div>
                  {/* 💡 END: EDITION DISPLAY LOGIC */}

                  {/* 💡 START: FINALIZED STATUS DISPLAY LOGIC (Thumbs Up/Down) */}
                  {/* 💡 FINAL STATUS DISPLAY */}
                  {row.isFinalized ? (
                    <div className="flex items-center gap-1 text-green-600" title="Finalized">
                      <ThumbsUp className="h-5 w-5 fill-current" />
                      <span className="text-sm font-semibold">Finalized</span>
                    </div>
                  ) : row.isSuperseded ? (
                    <div className="flex items-center gap-1 text-gray-500" title="Superseded">
                      <CircleSlash className="h-5 w-5" />
                      <span className="text-sm font-semibold">Revised</span>
                    </div>
                  ) : row.isDeleted ? (
                    <div className="flex items-center gap-1 text-red-700" title="Deleted">
                      <Trash2 className="h-5 w-5" />
                      <span className="text-sm font-semibold">Deleted</span>
                    </div>
                  ) : row.status === "SAVED" ? (
                    <div className="flex items-center gap-1 text-blue-600" title="Saved">
                      <CheckCircle className="h-5 w-5" />
                      <span className="text-sm font-semibold">Saved</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-orange-500" title="Draft">
                      <ThumbsDown className="h-5 w-5 fill-current" />
                      <span className="text-sm font-semibold">Draft</span>
                    </div>
                  )}

                  {/* 💡 END: FINALIZED STATUS DISPLAY LOGIC */}
                </div>

                <h3 className="text-lg font-bold text-gray-800">
                  {row.customerName}
                </h3>
                <p className="text-sm text-gray-500">Site: {row.siteName}</p>

                <div className="mt-3 space-y-1 text-sm text-gray-700">
                  <p><strong>Quotation ID:</strong> {row.id}</p>
                  <p><strong>Date:</strong> {row.quotationDate}</p>
                  <p><strong>Type:</strong> </p>
                  <p><strong>Rate:</strong> ₹{row.totalAmount}</p>
                </div>
              </div>

              {/* Action Buttons */}
              {/* ... (Action Buttons remain the same) ... */}

              <div className="mt-4 border-t pt-4 space-y-3">
                {/* View Material */}
                <Link
                  href={`/dashboard/quotations/new-installation/${row.id}/view-material`}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm"
                  onClick={() => setPageLoading(true)}
                >
                  <FileText className="h-4 w-4" />
                  View Material
                </Link>

                {/* Revise and Edit - Inline on same row */}
                <div className="flex items-start justify-between gap-3">
                  {/* Revise Button/Link - Left side */}
                  <div className="flex-1">
                    {row.status === "SAVED" && !hasAnyFinalized ? (
                      <Link
                        href={`/dashboard/lead-management/enquiries/${row.leadId}/quotation/add/${row.combinedEnquiryId}?action=revise&id=${row.id}`}
                        title="Create Revision of this Quotation"
                        className="flex items-center gap-2 text-orange-600 hover:text-orange-800 font-medium text-sm"
                        onClick={() => setPageLoading(true)}
                      >
                        <RotateCcw className="h-4 w-4" />
                        Revise
                      </Link>
                    ) : (
                      <div>
                        <div
                          title={hasAnyFinalized || row.status === "DELETED" || row.isDeleted === true ? "Cannot revise - a quotation in this group is finalized" : "Save the quotation first to enable revision"}
                          className="flex items-center gap-2 text-gray-400 cursor-not-allowed font-medium text-sm"
                        >
                          <RotateCcw className="h-4 w-4" />
                          Revise
                        </div>
                        <p className="text-xs text-yellow-500 mt-0.5 ml-6">
                          {hasAnyFinalized ? "Finalized quotation exists" : "Save the quotation to enable"}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Edit Button - Right side */}
                  {!hasAnyFinalized && row.status !== "DELETED" && row.isDeleted !== true ? (
                    <Link
                      href={`/dashboard/lead-management/enquiries/${row.leadId}/quotation/add/${row.combinedEnquiryId}?action=editRevision&id=${row.id}`}
                      title="Edit Quotation"
                      className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                      onClick={() => setPageLoading(true)}
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </Link>
                  ) : (
                    <div
                      title="Cannot edit - a quotation in this group is finalized"
                      className="flex items-center gap-2 text-gray-400 cursor-not-allowed font-medium text-sm"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </div>
                  )}
                </div>

                {/* Generate PDF */}
                <div className="flex justify-between gap-2">
                  {/* PDF With Letterhead */}
                  <button
                    onClick={() => generatePDF(row.id, true)}
                    title="Download PDF With Letterhead"
                    className="flex-1 flex items-center justify-center gap-2 py-2 
                                        rounded-lg bg-green-600 text-white hover:bg-green-700 text-sm transition"
                  >
                    <Download className="h-4 w-4" />
                    Letterhead
                  </button>

                  {/* PDF Without Letterhead */}
                  <button
                    onClick={() => generatePDF(row.id, false)}
                    title="Download PDF Without Letterhead"
                    className="flex-1 flex items-center justify-center gap-2 py-2 
                                        rounded-lg bg-cyan-500 text-white hover:bg-cyan-600 text-sm transition"
                  >
                    <FileSignature className="h-4 w-4" />
                    No Letterhead
                  </button>
                </div>

                {/* Mail and Delete - Inline on same row */}
                <div className="flex justify-between gap-2">
                  {/* Send Mail */}
                  <button
                    onClick={() => toast.info("Email functionality coming soon!")}
                    title="Send Quotation via Email"
                    className="flex-1 flex items-center justify-center gap-2 py-2 
                                        rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm transition"
                  >
                    <Mail className="h-4 w-4" />
                    Mail
                  </button>

                  {/* Delete Button */}
                  {hasAnyFinalized || row.status === "DELETED" || row.isDeleted === true ? (
                    <button
                      disabled
                      title="Cannot delete - a quotation in this group is finalized"
                      className="flex-1 flex items-center justify-center gap-2 py-2 
                                          rounded-lg bg-gray-300 text-gray-600 cursor-not-allowed text-sm"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDelete(row.id, quotationNo)}
                      title="Delete Quotation"
                      className="flex-1 flex items-center justify-center gap-2 py-2 
                                          rounded-lg bg-red-600 text-white hover:bg-red-700 text-sm transition"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  )}
                </div>


                {/* Finalize */}
                <button
                  onClick={() => handleFinalize(row.id, quotationNo)}
                  disabled={hasAnyFinalized || row.status === "DELETED" || row.isDeleted === true}
                  className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm
                                    ${hasAnyFinalized || row.status === "DELETED" || row.isDeleted === true
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : row.isFinalized
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-yellow-500 text-white hover:bg-yellow-600"
                    }`}
                >
                  {row.isFinalized ? (
                    <Lock className="h-4 w-4" />
                  ) : (
                    <MinusCircle className="h-4 w-4" />
                  )}
                  {row.isFinalized ? "Finalized" : "Mark Final"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
