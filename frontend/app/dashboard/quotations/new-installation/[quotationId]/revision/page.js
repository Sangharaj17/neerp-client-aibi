"use client";

import { useParams } from "next/navigation";
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
  MinusCircle ,
} from "lucide-react";
import { useState, useMemo, useCallback } from "react";
import { generatePdfWithLetterhead } from "@/utils/pdfGeneratorWithHead";
import { generatePdfWithOutLetterhead } from "@/utils/pdfGeneratorWithoutHead";

export default function QuotationList() {
  const { tenant } = useParams();

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

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col h-full bg-white shadow-lg rounded-lg p-6">
      {/* Header and Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">All Quotation List</h2>
        <input
          type="text"
          placeholder="Search quotations..."
          className="border border-gray-300 px-4 py-2 rounded-lg text-base w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1); // Reset to first page on search
          }}
        />
      </div>

      {/* Scrollable Table Container */}
      <div className="flex-1 overflow-auto rounded-lg border border-gray-200 shadow-sm max-h-[calc(100vh-280px)]">
        <div className="min-w-[1200px] w-full">
          {" "}
          {/* Increased min-width for more columns */}
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-xs uppercase tracking-wide sticky top-0 z-10">
              <tr>
                {[
                  "Sr.No.",
                  "Date",
                  "Customer",
                  "Site",
                  "Generated By",
                  "Lift Type",
                  "Lift Rate",
                  "Edition", // Added Edition column
                  "View Material",
                  "Revise",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-4 py-3 font-semibold border-b border-gray-200 bg-gray-100 whitespace-nowrap"
                  >
                    {header}
                  </th>
                ))}
                <th
                  colSpan={2}
                  className="px-4 py-3 font-semibold border-b border-gray-200 text-center bg-gray-100"
                >
                  Generate PDF
                </th>
                <th className="px-4 py-3 font-semibold border-b border-gray-200 bg-gray-100 text-center">
                  Is Final
                </th>
                <th className="px-4 py-3 font-semibold border-b border-gray-200 bg-gray-100 text-center">
                  Actions
                </th>
              </tr>
              <tr className="bg-gray-50 sticky top-[3.3rem] z-10">
                {/* Adjusted top for sticky */}
                <th colSpan={10}></th>
                <th className="text-center px-4 py-2 border-b border-gray-200 bg-gray-50 whitespace-nowrap">
                  With Letterhead
                </th>
                <th className="text-center px-4 py-2 border-b border-gray-200 bg-gray-50 whitespace-nowrap">
                  Without Letterhead
                </th>
                <th colSpan={2}></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedData.length > 0 ? (
                paginatedData.map((row) => (
                  <tr
                    key={row.sr}
                    className="hover:bg-gray-50 transition-colors duration-150 text-xs sm:text-sm"
                  >
                    <td className="px-4 py-3 whitespace-nowrap">{row.sr}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{row.date}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {row.customer}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{row.site}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{row.by}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{row.type}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{row.rate}</td>
                    <td className="px-4 py-3 whitespace-nowrap font-medium text-blue-600">
                      {row.edition}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Link
                        href={`/dashboard/quotations/new-installation/${row.sr}/view-material`}
                        title="View Material"
                      >
                        <FileText className="h-5 w-5 text-sky-600 hover:text-sky-800 cursor-pointer mx-auto" />
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <RotateCcw
                        className="h-5 w-5 text-blue-600 hover:text-blue-800 cursor-pointer mx-auto"
                        title="Revise"
                        onClick={() =>
                          alert(`Revise functionality for SR: ${row.sr}`)
                        }
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <FileSignature
                        className="h-5 w-5 text-blue-600 hover:text-blue-800 cursor-pointer mx-auto"
                        title="Generate PDF With Letterhead"
                        onClick={() =>
                          generatePdfWithLetterhead({
                            sr: row.sr,
                            date: row.date,
                            customer: row.customer,
                            site: row.site,
                            contact: row.contact || "N/A",
                            amount: row.amount || "N/A",
                            gstPercent: row.gstPercent || "N/A",
                            gstAmount: row.gstAmount || "N/A",
                            finalAmount: row.finalAmount || "N/A",
                            loadPercent: row.loadPercent || "N/A",
                            loadAmount: row.loadAmount || "N/A",
                            materialsList: row.materialsList || [],
                          })
                        }
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <FileMinus
                        className="h-5 w-5 text-blue-600 hover:text-blue-800 cursor-pointer mx-auto"
                        title="Generate PDF Without Letterhead"
                        onClick={() =>
                          generatePdfWithOutLetterhead({
                            sr: row.sr,
                            date: row.date,
                            customer: row.customer,
                            site: row.site,
                            contact: row.contact || "N/A",
                            amount: row.amount || "N/A",
                            gstPercent: row.gstPercent || "N/A",
                            gstAmount: row.gstAmount || "N/A",
                            finalAmount: row.finalAmount || "N/A",
                            loadPercent: row.loadPercent || "N/A",
                            loadAmount: row.loadAmount || "N/A",
                            materialsList: row.materialsList || [],
                          })
                        }
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() =>
                          handleFinalizeQuotation(
                            row.sr,
                            row.customer,
                            row.site
                          )
                        }
                        title={row.isFinalized ? "Finalized" : "Mark as Final"}
                        disabled={row.disableFinalizeButton}
                        className={`p-1 rounded-full ${
                          row.isFinalized
                            ? "bg-green-100 text-green-600"
                            : row.disableFinalizeButton
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                        } transition-colors duration-150`}
                      >
                        {row.isFinalized ? (
                          <Lock className="h-5 w-5" />
                        ) : (
                          <MinusCircle  className="h-5 w-5" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center space-x-2 flex justify-center items-center">
                      <Mail
                        className="h-5 w-5 text-green-600 hover:text-green-800 cursor-pointer"
                        title="Send Mail"
                        onClick={() => alert(`Send mail for SR: ${row.sr}`)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="14" className="text-center py-6 text-gray-500">
                    No quotations found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {/* <div className="flex flex-col sm:flex-row justify-between items-center mt-6 text-sm gap-4">
        <div className="flex items-center gap-2">
          <span>Show:</span>
          <select
            className="border border-gray-300 px-3 py-1.5 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={35}>35</option>
            <option value={50}>50</option>
            <option value={allQuotationData.length}>All</option>
          </select>
          <span>entries</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 disabled:opacity-60 disabled:cursor-not-allowed text-gray-700 transition duration-150"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          {getPageNumbers().map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => goToPage(pageNumber)}
              className={`px-4 py-2 rounded-lg transition duration-150 ${
                currentPage === pageNumber
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-300"
              }`}
            >
              {pageNumber}
            </button>
          ))}

          <button
            className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 disabled:opacity-60 disabled:cursor-not-allowed text-gray-700 transition duration-150"
            onClick={goToNextPage}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next
          </button>
        </div>
      </div> */}
    </div>
  );
}
