"use client"; // Needed because you're using a hook

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
import { useState, useMemo } from "react";
import { generatePdfWithLetterhead } from "@/utils/pdfGeneratorWithHead";
import { generatePdfWithOutLetterhead } from "@/utils/pdfGeneratorWithoutHead";

export default function QuotationList() {
  const { tenant } = useParams();
  const allQuotationData = [
    {
      sr: 1,
      date: "25-07-2025",
      customer: "Mr.MR.PRAYUSH",
      site: "BRAMAHA site Navi Mumbai",
      by: "Owner",
      type: "Manual",
      rate: "3,510,849.58",
      ////revision: "NA",
      isFinalized: true, // Added isFinalized status
    },
    {
      sr: 2,
      date: "24-07-2025",
      customer: "Mr.MR.PRAYUSH",
      site: "BRAMAHA site Navi Mumbai",
      by: "Owner",
      type: "Manual",
      rate: "3,510,849.58",
      ////revision: "NA",
      isFinalized: false, // Added isFinalized status (Not Finalized)
    },
    {
      sr: 3,
      date: "24-07-2025",
      customer: "Mr.MR.PRAYUSH",
      site: "BRAMAHA site Navi Mumbai",
      by: "Owner",
      type: "Manual",
      rate: "3,510,849.58",
      ////revision: "NA",
      isFinalized: true,
    },
    {
      sr: 4,
      date: "24-07-2025",
      customer: "Mr.MR.PRAYUSH",
      site: "BRAMAHA site Navi Mumbai",
      by: "Owner",
      type: "Manual",
      rate: "3,510,849.58",
      ////revision: "NA",
      isFinalized: false,
    },
    {
      sr: 5,
      date: "24-07-2025",
      customer: "Mr.MR.PRAYUSH",
      site: "BRAMAHA site Navi Mumbai",
      by: "Owner",
      type: "Manual",
      rate: "3,510,849.58",
      ////revision: "NA",
      isFinalized: true,
    },
    {
      sr: 6,
      date: "24-07-2025",
      customer: "Mr.MR.PRAYUSH",
      site: "BRAMAHA site Navi Mumbai",
      by: "Owner",
      type: "Manual",
      rate: "3,510,849.58",
      ////revision: "NA",
      isFinalized: false,
    },
    {
      sr: 7,
      date: "24-07-2025",
      customer: "Mr.MR.PRAYUSH",
      site: "BRAMAHA site Navi Mumbai",
      by: "Owner",
      type: "Manual",
      rate: "3,510,849.58",
      ////revision: "NA",
      isFinalized: true,
    },
    {
      sr: 8,
      date: "24-07-2025",
      customer: "Mr.MR.PRAYUSH",
      site: "BRAMAHA site Navi Mumbai",
      by: "Owner",
      type: "Manual",
      rate: "3,510,849.58",
      ////revision: "NA",
      isFinalized: false,
    },
    {
      sr: 9,
      date: "24-07-2025",
      customer: "Mr.MR.PRAYUSH",
      site: "BRAMAHA site Navi Mumbai",
      by: "Owner",
      type: "Manual",
      rate: "3,510,849.58",
      ////revision: "NA",
      isFinalized: true,
    },
    {
      sr: 10,
      date: "24-07-2025",
      customer: "Mr.MR.PRAYUSH",
      site: "BRAMAHA site Navi Mumbai",
      by: "Owner",
      type: "Manual",
      rate: "3,510,849.58",
      ////revision: "NA",
      isFinalized: false,
    },
    {
      sr: 11,
      date: "24-07-2025",
      customer: "Mr.MR.PRAYUSH",
      site: "BRAMAHA site Navi Mumbai",
      by: "Owner",
      type: "Manual",
      rate: "3,510,849.58",
      //revision: "NA",
      isFinalized: true,
    },
    {
      sr: 12,
      date: "24-07-2025",
      customer: "Mr.MR.PRAYUSH",
      site: "BRAMAHA site Navi Mumbai",
      by: "Owner",
      type: "Manual",
      rate: "3,510,849.58",
      //revision: "NA",
      isFinalized: false,
    },
    {
      sr: 13,
      date: "24-07-2025",
      customer: "Mr.MR.PRAYUSH",
      site: "BRAMAHA site Navi Mumbai",
      by: "Owner",
      type: "Manual",
      rate: "3,510,849.58",
      //revision: "NA",
      isFinalized: true,
    },
    {
      sr: 14,
      date: "24-07-2025",
      customer: "Mr.MR.PRAYUSH",
      site: "BRAMAHA site Navi Mumbai",
      by: "Owner",
      type: "Manual",
      rate: "3,510,849.58",
      //revision: "NA",
      isFinalized: false,
    },
    {
      sr: 15,
      date: "24-07-2025",
      customer: "Mr.MR.PRAYUSH",
      site: "BRAMAHA site Navi Mumbai",
      by: "Owner",
      type: "Manual",
      rate: "3,510,849.58",
      //revision: "NA",
      isFinalized: true,
    },
    {
      sr: 16,
      date: "24-07-2025",
      customer: "Mr.MR.PRAYUSH",
      site: "BRAMAHA site Navi Mumbai",
      by: "Owner",
      type: "Manual",
      rate: "3,510,849.58",
      //revision: "NA",
      isFinalized: false,
    },
    {
      sr: 17,
      date: "24-07-2025",
      customer: "Mr.MR.PRAYUSH",
      site: "BRAMAHA site Navi Mumbai",
      by: "Owner",
      type: "Manual",
      rate: "3,510,849.58",
      //revision: "NA",
      isFinalized: true,
    },
    {
      sr: 18,
      date: "24-07-2025",
      customer: "Mr.MR.PRAYUSH",
      site: "BRAMAHA site Navi Mumbai",
      by: "Owner",
      type: "Manual",
      rate: "3,510,849.58",
      //revision: "NA",
      isFinalized: false,
    },
    {
      sr: 19,
      date: "24-07-2025",
      customer: "Mr.MR.PRAYUSH",
      site: "BRAMAHA site Navi Mumbai",
      by: "Owner",
      type: "Manual",
      rate: "3,510,849.58",
      //revision: "NA",
      isFinalized: true,
    },
    {
      sr: 20,
      date: "24-07-2025",
      customer: "Mr.MR.PRAYUSH",
      site: "BRAMAHA site Navi Mumbai",
      by: "Owner",
      type: "Manual",
      rate: "3,510,849.58",
      //revision: "NA",
      isFinalized: false,
    },
    {
      sr: 21,
      date: "24-07-2025",
      customer: "Mr.MR.PRAYUSH",
      site: "BRAMAHA site Navi Mumbai",
      by: "Owner",
      type: "Manual",
      rate: "3,510,849.58",
      //revision: "NA",
      isFinalized: true,
    },
    {
      sr: 22,
      date: "24-07-2025",
      customer: "Mr.MR.PRAYUSH",
      site: "BRAMAHA site Navi Mumbai",
      by: "Owner",
      type: "Manual",
      rate: "3,510,849.58",
      //revision: "NA",
      isFinalized: false,
    },
    {
      sr: 23,
      date: "24-07-2025",
      customer: "Mr.MR.PRAYUSH",
      site: "BRAMAHA site Navi Mumbai",
      by: "Owner",
      type: "Manual",
      rate: "3,510,849.58",
      //revision: "NA",
      isFinalized: true,
    },
    {
      sr: 24,
      date: "24-07-2025",
      customer: "Mr.MR.PRAYUSH",
      site: "BRAMAHA site Navi Mumbai",
      by: "Owner",
      type: "Manual",
      rate: "3,510,849.58",
      //revision: "NA",
      isFinalized: false,
    },
    {
      sr: 25,
      date: "24-07-2025",
      customer: "Mr.MR.PRAYUSH",
      site: "BRAMAHA site Navi Mumbai",
      by: "Owner",
      type: "Manual",
      rate: "3,510,849.58",
      //revision: "NA",
      isFinalized: true,
    },
    {
      sr: 26,
      date: "24-07-2025",
      customer: "Mr.MR.PRAYUSH",
      site: "BRAMAHA site Navi Mumbai",
      by: "Owner",
      type: "Manual",
      rate: "3,510,849.58",
      //revision: "NA",
      isFinalized: false,
    },
    {
      sr: 27,
      date: "24-07-2025",
      customer: "Mr.MR.PRAYUSH",
      site: "BRAMAHA site Navi Mumbai",
      by: "Owner",
      type: "Manual",
      rate: "3,510,849.58",
      //revision: "NA",
      isFinalized: true,
    },
    {
      sr: 28,
      date: "24-07-2025",
      customer: "Mr.MR.PRAYUSH",
      site: "BRAMAHA site Navi Mumbai",
      by: "Owner",
      type: "Manual",
      rate: "3,510,849.58",
      //revision: "NA",
      isFinalized: false,
    },
    {
      sr: 29,
      date: "24-07-2025",
      customer: "Mr.MR.PRAYUSH",
      site: "BRAMAHA site Navi Mumbai",
      by: "Owner",
      type: "Manual",
      rate: "3,510,849.58",
      //revision: "NA",
      isFinalized: true,
    },
    {
      sr: 30,
      date: "24-07-2025",
      customer: "Mr.MR.PRAYUSH",
      site: "BRAMAHA site Navi Mumbai",
      by: "Owner",
      type: "Manual",
      rate: "3,510,849.58",
      //revision: "NA",
      isFinalized: false,
    },
    {
      sr: 31,
      date: "24-07-2025",
      customer: "Mr.MR.PRAYUSH",
      site: "BRAMAHA site Navi Mumbai",
      by: "Owner",
      type: "Manual",
      rate: "3,510,849.58",
      //revision: "NA",
      isFinalized: true,
    },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    if (!searchQuery) {
      return allQuotationData;
    }
    const lowerCaseQuery = searchQuery.toLowerCase();
    return allQuotationData.filter((item) =>
      Object.values(item).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(lowerCaseQuery)
      )
    );
  }, [allQuotationData, searchQuery]);

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
    <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-700">
          All Quotation List
        </h2>
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search..."
          className="border px-3 py-1.5 rounded-md text-sm w-full sm:w-64 focus:outline-none focus:ring focus:ring-blue-100"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1); // Reset to first page on search
          }}
        />
      </div>

      {/* Scrollable Table Container */}
      <div className="flex-1 overflow-auto rounded-lg border max-h-[calc(100vh-200px)]">
        <div className="min-w-[1000px] w-full">
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
                  "View Material",
                  "Revise",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-4 py-2 font-medium border-b bg-gray-100 whitespace-nowrap"
                  >
                    {header}
                  </th>
                ))}
                <th
                  colSpan={2}
                  className="px-4 py-2 font-medium border-b text-center bg-gray-100"
                >
                  Generate PDF
                </th>
                <th className="px-4 py-2 font-medium border-b bg-gray-100">
                  Is Final
                </th>
                <th className="px-4 py-2 font-medium border-b bg-gray-100">
                  Send Mail
                </th>
              </tr>
              <tr className="bg-gray-50 sticky top-[2.4rem] z-10">
                <th colSpan={9}></th>
                <th className="text-center px-4 py-2 border-b bg-gray-50 whitespace-nowrap">
                  With Letterhead
                </th>
                <th className="text-center px-4 py-2 border-b bg-gray-50 whitespace-nowrap">
                  Without Letterhead
                </th>
                <th colSpan={2}></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {paginatedData.length > 0 ? (
                paginatedData.map((row) => (
                  <tr
                    key={row.sr}
                    className="hover:bg-gray-50 text-xs sm:text-sm"
                  >
                    <td className="px-4 py-2 whitespace-nowrap">{row.sr}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{row.date}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {row.customer}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">{row.site}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{row.by}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{row.type}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{row.rate}</td>
                    <td className="px-4 py-2 text-center">
                      <Link
                        href={`/${tenant}/dashboard/quotations/new-installation/${row.sr}/view-material`}
                      >
                        <FileText
                          className="h-5 w-5 text-sky-600 hover:text-sky-800 cursor-pointer mx-auto"
                          title="View Material"
                        />
                      </Link>
                    </td>

                    <td className="px-4 py-2 text-center">
                      <Link
                        href={`/${tenant}/dashboard/quotations/new-installation/${row.sr}/revision`}
                      >
                        <RotateCcw
                          className="h-5 w-5 text-blue-600 hover:text-blue-800 cursor-pointer mx-auto"
                          title="Revise"
                        />
                      </Link>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <FileSignature
                        className="h-5 w-5 text-blue-600 hover:text-blue-800 cursor-pointer mx-auto"
                        title="With Letterhead"
                        onClick={() =>
                          generatePdfWithLetterhead({
                            sr: row.sr,
                            date: row.date,
                            customer: row.customer,
                            site: row.site,
                            contact: row.contact || "N/A", // Ensure contact is available in row data or provide default
                            amount: row.amount || "N/A", // Add these fields to your row data if they're dynamic
                            gstPercent: row.gstPercent || "N/A",
                            gstAmount: row.gstAmount || "N/A",
                            finalAmount: row.finalAmount || "N/A",
                            loadPercent: row.loadPercent || "N/A",
                            loadAmount: row.loadAmount || "N/A",
                            materialsList: row.materialsList || [], // Pass the actual materials list
                          })
                        }
                      />
                    </td>
                    <td className="px-4 py-2 text-center">
                      <FileMinus
                        className="h-5 w-5 text-blue-600 hover:text-blue-800 cursor-pointer mx-auto"
                        title="Without Letterhead"
                        onClick={() =>
                          generatePdfWithOutLetterhead({
                            sr: row.sr,
                            date: row.date,
                            customer: row.customer,
                            site: row.site,
                            contact: row.contact || "N/A", // Ensure contact is available in row data or provide default
                            amount: row.amount || "N/A", // Add these fields to your row data if they're dynamic
                            gstPercent: row.gstPercent || "N/A",
                            gstAmount: row.gstAmount || "N/A",
                            finalAmount: row.finalAmount || "N/A",
                            loadPercent: row.loadPercent || "N/A",
                            loadAmount: row.loadAmount || "N/A",
                            materialsList: row.materialsList || [], // Pass the actual materials list
                          })
                        }
                      />
                    </td>
                    {/* CONDITIONAL RENDERING FOR FINALIZED STATUS */}
                    <td className="px-4 py-2 text-center">
                      {row.isFinalized ? (
                        <Lock
                          className="h-5 w-5 text-green-500 mx-auto"
                          title="Finalized"
                        />
                      ) : (
                        <MinusCircle 
                          className="h-5 w-5 text-yellow-500 mx-auto" // Use a different color, e.g., yellow for pending
                          title="Not Finalized"
                        />
                      )}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <Mail
                        className="h-5 w-5 text-green-600 hover:text-green-800 cursor-pointer mx-auto"
                        title="Send Mail"
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="13" className="text-center py-4 text-gray-500">
                    No results found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 text-sm flex-wrap gap-2">
        <div>
          Show:{" "}
          <select
            className="border px-2 py-1 rounded text-sm"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
          >
            <option value={20}>20</option>
            <option value={35}>35</option>
            <option value={50}>50</option>
            <option value={allQuotationData.length}>All</option>
          </select>{" "}
          entries
        </div>
        <div className="space-x-2 flex items-center">
          <button
            className="px-3 py-1 border rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          {getPageNumbers().map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => goToPage(pageNumber)}
              className={`px-3 py-1 border rounded-md ${
                currentPage === pageNumber
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {pageNumber}
            </button>
          ))}

          <button
            className="px-3 py-1 border rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={goToNextPage}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}