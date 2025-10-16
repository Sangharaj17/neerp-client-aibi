"use client";

import { useState, useEffect, useRef } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { ChevronLeft, ChevronRight, Search, Zap, Repeat2, Wrench, ShieldCheck } from "lucide-react";

// Configuration
const PAGE_SIZE = 5;

// --- Helper Functions ---

const formatTableData = (data, page, size) =>
  data.map((item, index) => ({
    ...item,
    srNo: page * size + index + 1,
  }));

// Pagination Controls Component
const PaginationControls = ({ currentPage, totalPages, onPrev, onNext, totalElements }) => {
  if (totalPages <= 1 && totalElements <= PAGE_SIZE) return null;

  const start = currentPage * PAGE_SIZE + 1;
  const end = Math.min((currentPage + 1) * PAGE_SIZE, totalElements);

  return (
    <div className="flex justify-between items-center mt-4 p-3 border-t border-gray-100 bg-white rounded-b-xl">
      <div className="text-sm text-gray-500">
        Showing <span className="font-semibold text-gray-700">{start}</span> to <span className="font-semibold text-gray-700">{end}</span> of{" "}
        <span className="font-semibold text-gray-700">{totalElements}</span> results
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={onPrev}
          disabled={currentPage === 0}
          className={`p-1.5 rounded-lg transition-all text-sm font-medium ${
            currentPage === 0
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white border border-gray-300 hover:bg-indigo-50 hover:border-indigo-500 text-gray-700"
          }`}
        >
          <ChevronLeft className="w-4 h-4 inline-block align-middle" /> Prev
        </button>
        <span className="text-sm font-medium text-gray-700 px-2">
          {currentPage + 1} / {totalPages}
        </span>
        <button
          onClick={onNext}
          disabled={currentPage >= totalPages - 1}
          className={`p-1.5 rounded-lg transition-all text-sm font-medium ${
            currentPage >= totalPages - 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white border border-gray-300 hover:bg-indigo-50 hover:border-indigo-500 text-gray-700"
          }`}
        >
          Next <ChevronRight className="w-4 h-4 inline-block align-middle" />
        </button>
      </div>
    </div>
  );
};

export default function JobActivityEmployeeDashboard() {
  // -------------------- STATE --------------------
  const [employeeList, setEmployeeList] = useState([]);
  const [empId, setEmpId] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [counts, setCounts] = useState({});
  const [nonRenewalData, setNonRenewalData] = useState([]);
  const [renewalData, setRenewalData] = useState([]);

  const [nonRenewalTotalElements, setNonRenewalTotalElements] = useState(0);
  const [renewalTotalElements, setRenewalTotalElements] = useState(0);

  const [nonRenewalPage, setNonRenewalPage] = useState(0);
  const [renewalPage, setRenewalPage] = useState(0);

  const [loading, setLoading] = useState(false);

  // Ref to track if the initial load is complete (used to prevent double fetch on page 0 reset)
  const isInitialLoad = useRef(true); 

  // -------------------- FETCH EMPLOYEES --------------------
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axiosInstance.get("/api/employees/executives");
        setEmployeeList(res.data || []);
        if (res.data.length > 0) setEmpId(res.data[0].employeeId);
      } catch (err) {
        console.error("Error fetching employees:", err);
        setEmployeeList([]);
      }
    };
    fetchEmployees();
  }, []);

  // -------------------- FETCH DATA LOGIC --------------------

  // Function to fetch ONLY the paged list data (Non-Renewal and Renewal)
  const fetchPagedData = async (nonPage, renPage, currentSearchTerm) => {
    if (!empId) return;
    try {
      // Set loading state only if it's not the initial load or a specific pagination/search call
      setLoading(true); 
      const commonParams = { empId, startDate, endDate, searchTerm: currentSearchTerm };

      const [nonRes, renRes] = await Promise.all([
        axiosInstance.get("/api/jobs/employeeActivityReports/employee-activity/non-renewal-data", {
          params: { ...commonParams, page: nonPage, size: PAGE_SIZE },
        }),
        axiosInstance.get("/api/jobs/employeeActivityReports/employee-activity/renewal-data", {
          params: { ...commonParams, page: renPage, size: PAGE_SIZE },
        }),
      ]);

      setNonRenewalData(nonRes.data.content || []);
      setNonRenewalTotalElements(nonRes.data.totalElements || 0);
      setRenewalData(renRes.data.content || []);
      setRenewalTotalElements(renRes.data.totalElements || 0);
    } catch (err) {
      console.error("Error fetching paged data:", err);
      setNonRenewalData([]);
      setRenewalData([]);
      setNonRenewalTotalElements(0);
      setRenewalTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  // 1. useEffect for Filter Change (EmpId, Dates) - Fetches Counts and Resets Pages
  useEffect(() => {
    if (!empId) return;

    const fetchCountsAndReset = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch Counts (Only depends on empId, Dates)
        const countRes = await axiosInstance.get("/api/jobs/employeeActivityReports/employee-activity/counts", {
          params: { empId, startDate, endDate },
        });
        setCounts(countRes.data);

        // 2. Reset Pagination to 0
        setNonRenewalPage(0);
        setRenewalPage(0);
        
        // 3. Manually fetch initial lists for page 0
        fetchPagedData(0, 0, searchTerm);
        
      } catch (err) {
        console.error("Error fetching counts/initial data:", err);
        setCounts({});
      } finally {
        setLoading(false);
        isInitialLoad.current = false; // Initial load is done
      }
    };
    
    // This runs on core filter changes.
    fetchCountsAndReset();
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [empId, startDate, endDate]); 


  // 2. useEffect for Search Term and Pagination Change
  // This handles search filtering and table pagination without re-fetching counts.
  useEffect(() => {
    if (!empId || isInitialLoad.current) return; // Skip if still loading based on EmpId/Dates

    const handleDataFetch = () => {
        // If the pages are 0, it means either we just loaded or the main filter ran.
        // We ensure a fetch happens when searchTerm or pagination changes.
        fetchPagedData(nonRenewalPage, renewalPage, searchTerm);
    };

    // This runs when nonRenewalPage, renewalPage, or searchTerm changes.
    handleDataFetch();
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nonRenewalPage, renewalPage, searchTerm]);

  // -------------------- PAGINATION --------------------
  const nonRenewalTotalPages = Math.ceil(nonRenewalTotalElements / PAGE_SIZE);
  const renewalTotalPages = Math.ceil(renewalTotalElements / PAGE_SIZE);

  const handleNonRenewalPrev = () => setNonRenewalPage((prev) => Math.max(0, prev - 1));
  const handleNonRenewalNext = () => setNonRenewalPage((prev) => Math.min(nonRenewalTotalPages - 1, prev + 1));
  const handleRenewalPrev = () => setRenewalPage((prev) => Math.max(0, prev - 1));
  const handleRenewalNext = () => setRenewalPage((prev) => Math.min(renewalTotalPages - 1, prev + 1));

  // -------------------- COMPONENTS --------------------
  const DashboardCard = ({ title, count, colorClass, icon: Icon }) => (
    <div className="bg-white shadow-lg rounded-xl p-4 transition-all duration-300 border border-gray-100 hover:shadow-xl hover:border-indigo-100 flex items-center space-x-4">
        <div className={`p-3 rounded-full ${colorClass.iconBg} ${colorClass.iconColor}`}>
            <Icon className="w-5 h-5" />
        </div>
        <div className="flex flex-col justify-center">
            <h3 className="text-gray-500 text-xs font-medium tracking-wide leading-tight">{title}</h3>
            <p className="text-3xl font-extrabold text-gray-900 mt-0.5 leading-none">{count || 0}</p>
        </div>
    </div>
  );

  const DataTable = ({ title, data, currentPage, totalPages, totalElements, onPrev, onNext }) => {
    const formattedData = formatTableData(data, currentPage, PAGE_SIZE);

    return (
      <div className="flex flex-col">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
        <div className="overflow-hidden bg-white shadow-2xl rounded-xl border border-gray-200 flex-grow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-indigo-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-indigo-700 w-16">
                    Sr No
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-indigo-700">Date</th>
                  <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-indigo-700">Customer</th>
                  <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-indigo-700">Site</th>
                  <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-indigo-700">Type</th>
                  <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-indigo-700">By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {formattedData.length > 0 ? (
                  formattedData.map((item) => (
                    <tr key={item.srNo} className="hover:bg-gray-50 transition duration-150">
                      <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-500 font-medium">{item.srNo}</td>
                      <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-900">{item.activityDate}</td>
                      <td className="px-5 py-3 whitespace-nowrap text-sm font-medium text-indigo-600">{item.customerName}</td>
                      <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-900">{item.siteName}</td>
                      <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-900">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.activityType.toLowerCase().includes('renewal') ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                            {item.activityType}
                        </span>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-900">{item.activityBy}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-gray-500 py-10 text-md">
                      No data found for the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <PaginationControls currentPage={currentPage} totalPages={totalPages} onPrev={onPrev} onNext={onNext} totalElements={totalElements} />
        </div>
      </div>
    );
  };

  // -------------------- RENDER --------------------
  return (
    <div className="min-h-screen bg-gray-100 p-6 sm:p-10">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 border-b border-gray-300 pb-3">Employee Activity Dashboard ✨</h1>

      {/* Filter Inputs */}
      <div className="bg-white shadow-xl rounded-xl p-6 mb-8 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Filter Controls</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Employee Dropdown */}
          <div className="flex flex-col">
            <label htmlFor="empId" className="text-sm font-medium text-gray-700 mb-1">
              Employee Executive
            </label>
            <select
              id="empId"
              value={empId || ""}
              onChange={(e) => setEmpId(Number(e.target.value))}
              className="border border-gray-300 p-2.5 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 shadow-sm bg-white"
            >
              {employeeList.map((emp) => (
                <option key={emp.employeeId} value={emp.employeeId}>
                  {emp.employeeName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="startDate" className="text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-300 p-2.5 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 shadow-sm bg-white"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="endDate" className="text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-300 p-2.5 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 shadow-sm bg-white"
            />
          </div>
          
          {/* Search */}
          <div className="flex flex-col">
            <label htmlFor="searchTerm" className="text-sm font-medium text-gray-700 mb-1">Search Activity</label>
            <div className="relative">
                <input
                    id="searchTerm"
                    type="text"
                    placeholder="Customer, Site, Type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-300 p-2.5 pl-10 w-full rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 shadow-sm bg-white"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-white bg-opacity-70 z-50 flex justify-center items-center backdrop-blur-sm">
            <div className="flex items-center p-4 bg-white rounded-xl shadow-2xl border border-indigo-100">
                <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <div className="text-lg font-semibold text-indigo-600">Loading dashboard data...</div>
            </div>
        </div>
      )}

      {/* Dashboard Cards */}
      {!loading && (
        <>
          <h2 className="text-2xl font-bold text-gray-800 mb-5">Activity Totals Overview</h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 mb-10">
            <DashboardCard 
                title="Non-Renewal Jobs" 
                count={counts.totalNonRenewalJobActivityCount} 
                colorClass={{ iconBg: 'bg-blue-100', iconColor: 'text-blue-600' }} 
                icon={Zap} 
            />
            <DashboardCard 
                title="Renewal Jobs" 
                count={counts.totalRenewalJobActivityCount} 
                colorClass={{ iconBg: 'bg-green-100', iconColor: 'text-green-600' }} 
                icon={ShieldCheck} 
            />
            <DashboardCard 
                title="Non-Renewal Services" 
                count={counts.totalNonRenewalServiceActivityCount} 
                colorClass={{ iconBg: 'bg-yellow-100', iconColor: 'text-yellow-600' }} 
                icon={Wrench} 
            />
            <DashboardCard 
                title="Renewal Services" 
                count={counts.totalRenewalServiceActivityCount} 
                colorClass={{ iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600' }} 
                icon={Repeat2} 
            />
            <DashboardCard 
                title="Non-Renewal Breakdowns" 
                count={counts.totalNonRenewalBreakdownActivityRenewalCount} 
                colorClass={{ iconBg: 'bg-red-100', iconColor: 'text-red-600' }} 
                icon={Zap} 
            />
            <DashboardCard 
                title="Renewal Breakdowns" 
                count={counts.totalRenewalBreakdownActivityCount} 
                colorClass={{ iconBg: 'bg-purple-100', iconColor: 'text-purple-600' }} 
                icon={ShieldCheck} 
            />
          </div>
        </>
      )}

      {/* Tables */}
      {!loading && (
        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
          <DataTable
            title="Non-Renewal Activities Details"
            data={nonRenewalData}
            currentPage={nonRenewalPage}
            totalPages={nonRenewalTotalPages}
            totalElements={nonRenewalTotalElements}
            onPrev={handleNonRenewalPrev}
            onNext={handleNonRenewalNext}
          />

          <DataTable
            title="Renewal Activities Details"
            data={renewalData}
            currentPage={renewalPage}
            totalPages={renewalTotalPages}
            totalElements={renewalTotalElements}
            onPrev={handleRenewalPrev}
            onNext={handleRenewalNext}
          />
        </div>
      )}
    </div>
  );
}