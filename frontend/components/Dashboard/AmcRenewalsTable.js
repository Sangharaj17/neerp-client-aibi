"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import axiosInstance from "@/utils/axiosInstance";
// Importing icons
import { ArrowUp, ArrowDown, Search, ChevronLeft, ChevronRight, Trash2, Repeat2 } from "lucide-react"; 

// Helper component for sort icon
const SortIcon = ({ column, sortBy, direction }) => {
  if (sortBy !== column) {
    return null; 
  }
  return direction === "asc" ? <ArrowUp className="w-4 h-4 ml-1 inline" /> : <ArrowDown className="w-4 h-4 ml-1 inline" />;
};

const AmcRenewalsTable = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10); 
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState("endDate");
  const [direction, setDirection] = useState("asc");
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/api/dashboard/amc-renewals", {
        params: { search, page, size, sortBy, direction },
      });
      
      const totalPagesFromApi = response.data.totalPages || 0; 
      
      setData(response.data.content);
      setTotalPages(totalPagesFromApi);

      if (page >= totalPagesFromApi && totalPagesFromApi > 0) {
        setPage(0);
      } else if (totalPagesFromApi === 0) {
          setPage(0); 
      }

    } catch (error) {
      console.error("Error fetching AMC renewals data:", error);
      setData([]);
      setTotalPages(0);
      setPage(0);
    }
    setLoading(false);
  }, [search, page, size, sortBy, direction]); 

  useEffect(() => {
    fetchData();
  }, [fetchData]); 

  const handleSort = (column) => {
    if (sortBy === column) {
      setDirection(direction === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setDirection("asc");
    }
    setPage(0); 
  };
  
  const handleSizeChange = (newSize) => {
    setSize(Number(newSize));
    setPage(0); 
  };
  
  const handleRenew = (amcJobId) => {
    // **IMPORTANT: Implement your renewal logic here (e.g., opening a modal, navigating to a renewal form, or calling an API)**
    alert(`[ACTION] Initiating renewal process for AMC Job ID: ${amcJobId}`);
    console.log(`Renewal action triggered for Job ID: ${amcJobId}`);
  };

  const handleDelete = async (amcJobId) => {
    if (window.confirm(`Are you sure you want to delete AMC Job ID: ${amcJobId}? This action cannot be undone.`)) {
      setLoading(true);
      try {
        // **IMPORTANT: Replace this with your actual DELETE API call**
        // await axiosInstance.delete(`/api/dashboard/amc-renewals/${amcJobId}`);
        console.log(`[ACTION] Deleting record for Job ID: ${amcJobId}`);
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
        fetchData(); 
      } catch (error) {
        console.error(`Error deleting AMC record ${amcJobId}:`, error);
        alert(`Failed to delete record ${amcJobId}. See console for details.`);
        setLoading(false);
      }
    }
  };

  // --- REFINED: Conditional styling AND text for Remaining Days ---
  const getRemainingDaysDisplay = (days) => {
    const absDays = Math.abs(days);
    
    if (days < 0) {
      return { 
        text: "EXPIRED", 
        class: 'bg-red-600 text-white font-bold border border-red-800' // Darker red for EXPIRED
      };
    } else if (days < 30) {
      return { 
        text: `${absDays} days to expire`, 
        class: 'bg-red-100 text-red-700 font-semibold border border-red-300' // Urgent
      };
    } else if (days < 90) {
      return { 
        text: `${absDays} days remaining`, 
        class: 'bg-yellow-100 text-yellow-700 font-medium border border-yellow-300' // Warning
      };
    }
    return { 
      text: `${absDays} days remaining`, 
      class: 'bg-green-100 text-green-700 font-medium border border-green-300' // Good
    };
  };

  const tableHeaders = [
    { key: "jobId", label: "Job ID" },
    { key: "customerName", label: "Customer" },
    { key: "customerSiteName", label: "Site" },
    { key: "amcPeriod", label: "AMC Period" },
    { key: "jobAmount", label: "Amount" },
    { key: "remainingDays", label: "Remaining Days" },
    { key: "status", label: "Status" }, // Status column restored
    { key: "actions", label: "Actions" }, // Actions column for Renew and Delete
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        {/* Header and Search */}
        <div className="p-5 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <h2 className="text-2xl font-semibold text-gray-800">AMC Renewal Tracking 🔔</h2>
          
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Customer or Site..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            />
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            {/* Table Header (Thead) */}
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                {tableHeaders.map((header) => (
                  <th
                    key={header.key}
                    className={`py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider ${['actions', 'status'].includes(header.key) ? '' : 'cursor-pointer hover:bg-gray-200'} transition duration-150`}
                    onClick={() => !['actions', 'status'].includes(header.key) && handleSort(header.key)}
                  >
                    <span className="flex items-center">
                      {header.label}
                      {!['actions', 'status'].includes(header.key) && <SortIcon column={header.key} sortBy={sortBy} direction={direction} />}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            
            {/* Table Body (Tbody) */}
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={tableHeaders.length} className="text-center py-10 text-lg text-blue-600">
                    <span className="animate-pulse">Loading data...</span>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={tableHeaders.length} className="text-center py-10 text-lg text-gray-500">
                    No renewal records found for your search. 😔
                  </td>
                </tr>
              ) : (
                data.map((item, index) => {
                  const daysDisplay = getRemainingDaysDisplay(item.remainingDays);
                  return (
                  <tr 
                    key={item.amcJobId} 
                    className={`hover:bg-blue-50 transition duration-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  >
                    <td className="py-3 px-6 whitespace-nowrap text-sm font-medium text-gray-900">{item.amcJobId}</td>
                    <td className="py-3 px-6 whitespace-nowrap text-sm text-gray-600 font-semibold">{item.customerName}</td>
                    <td className="py-3 px-6 whitespace-nowrap text-sm text-gray-600">{item.customerSiteName}</td>
                    <td className="py-3 px-6 whitespace-nowrap text-sm text-gray-600">{item.amcPeriod}</td>
                    <td className="py-3 px-6 whitespace-nowrap text-sm text-green-700 font-bold">
                      ₹{item.amount ? item.amount.toLocaleString('en-IN') : 'N/A'}
                    </td>
                    {/* --- UPDATED: Remaining Days Display --- */}
                    <td className="py-3 px-6 whitespace-nowrap">
                      <span className={`inline-flex items-center justify-center px-3 py-1.5 w-40 rounded-full text-xs uppercase ${daysDisplay.class}`}>
                        {daysDisplay.text}
                      </span>
                    </td>
                    {/* --- RESTORED: Status Column --- */}
                    <td className="py-3 px-6 whitespace-nowrap text-sm text-gray-500">
                      --- 
                    </td>
                    {/* --- UPDATED: Action Buttons (Renewal and Delete) --- */}
                    <td className="py-3 px-6 whitespace-nowrap text-sm flex space-x-2">
                      <button
                        onClick={() => handleRenew(item.amcJobId)}
                        disabled={loading}
                        className="flex items-center justify-center px-3 py-1 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition duration-150 disabled:opacity-50 text-xs font-medium"
                      >
                        <Repeat2 className="w-4 h-4 mr-1" />
                        Renew
                      </button>
                      
                      <button
                        onClick={() => handleDelete(item.amcJobId)}
                        disabled={loading}
                        className="text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-md p-1 transition duration-150 disabled:opacity-50"
                        aria-label={`Delete AMC Job ID ${item.amcJobId}`}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination and Footer */}
        <div className="p-5 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
          
          {/* Rows Per Page Selector */}
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Rows per page:</span>
            <select
              value={size}
              onChange={(e) => handleSizeChange(e.target.value)}
              className="border border-gray-300 rounded-lg p-1.5 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>

          <div className="text-sm text-gray-600">
            {totalPages > 0 ? (
              <>
                Showing <span className="font-semibold">{(page * size) + 1}</span> to <span className="font-semibold">{(page * size) + data.length}</span> (Page <span className="font-semibold">{page + 1}</span> of <span className="font-semibold">{totalPages}</span>)
              </>
            ) : (
                <span className="font-semibold">No results to show.</span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 0 || totalPages === 0}
              className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <span className="px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-100 rounded-lg border border-blue-300">
              {page + 1}
            </span>

            <button
              onClick={() => setPage(page + 1)}
              disabled={page + 1 >= totalPages || totalPages === 0}
              className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
              aria-label="Next Page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmcRenewalsTable;