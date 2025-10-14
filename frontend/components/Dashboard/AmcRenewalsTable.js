"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import axiosInstance from "@/utils/axiosInstance";
// Importing icons
import { ArrowUp, ArrowDown, Search, ChevronLeft, ChevronRight, Trash2, Repeat2 } from "lucide-react";

import { useRouter } from "next/navigation";

// Define an enum or constant for the view types
const VIEW_TYPE = {
  RENEWALS: "amcRenewals", // Original /api/dashboard/amc-renewals
  RENEWED_LIST: "amcRenewalsRenewals", // New /api/dashboard/amc-renewal-renewals
};

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
  // NEW STATE: To track the active view/API endpoint
  const [currentView, setCurrentView] = useState(VIEW_TYPE.RENEWALS); 

  const router = useRouter();

  // Determine the API endpoint based on the currentView state
  const getApiEndpoint = () => {
    switch (currentView) {
      case VIEW_TYPE.RENEWED_LIST:
        return "/api/dashboard/amc-renewal-renewals";
      case VIEW_TYPE.RENEWALS:
      default:
        return "/api/dashboard/amc-renewals";
    }
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    // Reset page to 0 when search, sort, or direction changes
    // Only reset page here if it's the *first* call or a non-pagination change.
    // However, since `fetchData` is called in `useEffect` and depends on `page`,
    // the page management is a bit tricky. We'll rely on the setters for page,
    // search, sort, etc., to call `fetchData` via `useEffect`.

    const endpoint = getApiEndpoint();

    try {
      const response = await axiosInstance.get(endpoint, {
        params: { search, page, size, sortBy, direction },
      });
      
      const totalPagesFromApi = response.data.totalPages || 0;
      
      setData(response.data.content);
      setTotalPages(totalPagesFromApi);

      if (page >= totalPagesFromApi && totalPagesFromApi > 0) {
        // If the current page is out of bounds after a filter/sort change, reset to 0
        setPage(0);
      } else if (totalPagesFromApi === 0) {
          setPage(0);
      }

    } catch (error) {
      console.error(`Error fetching ${currentView} data:`, error);
      setData([]);
      setTotalPages(0);
      setPage(0);
    }
    setLoading(false);
  }, [search, page, size, sortBy, direction, currentView]); // Include currentView in dependencies

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handler for switching views
  const handleViewChange = (view) => {
    if (currentView !== view) {
      setCurrentView(view);
      setPage(0); // Reset pagination when switching views
      setSearch(""); // Optionally clear search when switching views
    }
  };

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
  
  // Get the primary job ID key based on the current view
  const getPrimaryJobKey = (item) => {
    return currentView === VIEW_TYPE.RENEWED_LIST ? item.renewalJobId : item.amcJobId;
  };

  // The item ID to display in the table (prefers amcJobId for RENEWALS, renewalJobId for RENEWED_LIST)
  const getDisplayJobId = (item) => {

    if(item.renewalJobId){
      return item.renewalJobId;
    }else
    return item.amcJobId ;
  };

  // Use the item's primary ID for the delete action
  const getActionId = (item) => {
    return currentView === VIEW_TYPE.RENEWED_LIST ? item.renewalJobId : item.amcJobId;
  };
  
  // The renewal action now takes the whole item to get the correct IDs
  const handleRenew = (item) => {
    const jobID = getPrimaryJobKey(item);
    // Replace null/undefined with '0' for safety
    const primaryQid = item.quatationid || '0';
    const secondaryQid = item.reviseQuatationId || '0'; 
    const jobID_safe = jobID || '0';

    // Combine them into a single route
    let path = `/dashboard/dashboard-data/amc_renewals_list/add_amc_renewal_form/${primaryQid}/${secondaryQid}/${jobID_safe}`;

    if(item.renewalJobId){
      path = `/dashboard/dashboard-data/amc_renewals_list/add_amc_renewal_renewal_form/${primaryQid}/${secondaryQid}/${jobID_safe}/${item.renewalJobId}`;
    }
    // Navigate
    router.push(path);
  };


  const handleDelete = async (item) => {
    const primaryId = getActionId(item);
    const idLabel = currentView === VIEW_TYPE.RENEWED_LIST ? 'Renewal Job ID' : 'AMC Job ID';

    if (!primaryId) {
        alert("Cannot delete: Missing primary ID.");
        return;
    }

    if (window.confirm(`Are you sure you want to delete ${idLabel}: ${primaryId}? This action cannot be undone.`)) {
      setLoading(true);
      try {
        // **IMPORTANT: API path and parameter might be different for the renewalJobId delete!
        // Assuming the same endpoint logic for now, but you may need two separate DELETE endpoints.**
        // For simplicity, I'll use the amcJobId in the log, but you'd need the actual ID here.
        // E.g., const deleteEndpoint = currentView === VIEW_TYPE.RENEWED_LIST ? `/api/renewal-renewals/${primaryId}` : `/api/amc-renewals/${primaryId}`;
        
        console.log(`[ACTION] Deleting record for ${idLabel}: ${primaryId} from view: ${currentView}`);
        // await axiosInstance.delete(deleteEndpoint); // **Uncomment and correct this line**
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
        fetchData();
      } catch (error) {
        console.error(`Error deleting AMC record ${primaryId}:`, error);
        alert(`Failed to delete record ${primaryId}. See console for details.`);
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
    { key: "jobId", label: currentView === VIEW_TYPE.RENEWED_LIST ? "Renewal Job ID" : "AMC Job ID" }, // Dynamic header
    { key: "customerName", label: "Customer" },
    { key: "customerSiteName", label: "Site" },
    { key: "amcPeriod", label: "AMC Period" },
    { key: "jobAmount", label: "Amount" },
    { key: "remainingDays", label: "Remaining Days" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Actions" },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        
        {/* Header, View Buttons, and Search */}
        <div className="p-5 border-b border-gray-200 flex flex-col space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">AMC Renewal Tracking 🔔</h2>
          
          {/* View Toggle Buttons */}
          <div className="flex space-x-3 mb-4 border-b pb-4">
            <button
              onClick={() => handleViewChange(VIEW_TYPE.RENEWALS)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                currentView === VIEW_TYPE.RENEWALS
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              AMC Jobs Renewal
            </button>
            <button
              onClick={() => handleViewChange(VIEW_TYPE.RENEWED_LIST)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                currentView === VIEW_TYPE.RENEWED_LIST
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              AMC Renewal Jobs Renewals
            </button>
          </div>

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
                    No renewal records found for your search in this view. 😔
                  </td>
                </tr>
              ) : (
                data.map((item, index) => {
                  const daysDisplay = getRemainingDaysDisplay(item.remainingDays);
                  const jobId = getDisplayJobId(item); // Use the function to get the correct ID
                  
                  return (
                    <tr 
                      key={jobId || index} // Fallback to index if both IDs are null/undefined
                      className={`hover:bg-blue-50 transition duration-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                    >
                      <td className="py-3 px-6 whitespace-nowrap text-sm font-medium text-gray-900">{jobId || 'N/A'}</td>
                      <td className="py-3 px-6 whitespace-nowrap text-sm text-gray-600 font-semibold">{item.customerName}</td>
                      <td className="py-3 px-6 whitespace-nowrap text-sm text-gray-600">{item.customerSiteName}</td>
                      <td className="py-3 px-6 whitespace-nowrap text-sm text-gray-600">{item.amcPeriod}</td>
                      <td className="py-3 px-6 whitespace-nowrap text-sm text-green-700 font-bold">
                        ₹{item.amount ? item.amount.toLocaleString('en-IN') : 'N/A'}
                      </td>
                      {/* --- Remaining Days Display --- */}
                      <td className="py-3 px-6 whitespace-nowrap">
                        <span className={`inline-flex items-center justify-center px-3 py-1.5 w-40 rounded-full text-xs uppercase ${daysDisplay.class}`}>
                          {daysDisplay.text}
                        </span>
                      </td>
                      {/* --- Status Column --- */}
                      <td className="py-3 px-6 whitespace-nowrap text-sm text-gray-500">
                        {item.status || '---'}
                      </td>
                      {/* --- Action Buttons (Renewal and Delete) --- */}
                      <td className="py-3 px-6 whitespace-nowrap text-sm flex space-x-2">
                        <button
                          onClick={() => handleRenew(item)} // Pass the whole item
                          disabled={loading || !jobId} // Disable if loading or no valid ID
                          className="flex items-center justify-center px-3 py-1 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition duration-150 disabled:opacity-50 text-xs font-medium"
                        >
                          <Repeat2 className="w-4 h-4 mr-1" />
                          Renew
                        </button>
                        
                        <button
                          onClick={() => handleDelete(item)} // Pass the whole item
                          disabled={loading || !jobId} // Disable if loading or no valid ID
                          className="text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-md p-1 transition duration-150 disabled:opacity-50"
                          aria-label={`Delete record ${jobId}`}
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