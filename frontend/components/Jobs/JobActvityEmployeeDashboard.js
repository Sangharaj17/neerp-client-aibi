"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

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
  if (totalPages <= 1) return null;

  const start = currentPage * PAGE_SIZE + 1;
  const end = Math.min((currentPage + 1) * PAGE_SIZE, totalElements);

  return (
    <div className="flex justify-between items-center mt-3 p-2 border-t border-gray-200 bg-gray-50 rounded-b-lg">
      <div className="text-sm text-gray-600">
        Showing <span className="font-semibold">{start}</span> to <span className="font-semibold">{end}</span> of{" "}
        <span className="font-semibold">{totalElements}</span> results
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={onPrev}
          disabled={currentPage === 0}
          className={`p-1.5 rounded-full border transition-colors ${
            currentPage === 0 ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-white hover:bg-gray-100 text-gray-700"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-medium text-gray-700">
          Page {currentPage + 1} of {totalPages}
        </span>
        <button
          onClick={onNext}
          disabled={currentPage >= totalPages - 1}
          className={`p-1.5 rounded-full border transition-colors ${
            currentPage >= totalPages - 1 ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-white hover:bg-gray-100 text-gray-700"
          }`}
        >
          <ChevronRight className="w-4 h-4" />
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

  // -------------------- FETCH DASHBOARD DATA --------------------
  useEffect(() => {
    if (!empId) return;

    if (nonRenewalPage !== 0 || renewalPage !== 0) {
      setNonRenewalPage(0);
      setRenewalPage(0);
    } else {
      fetchAllData(nonRenewalPage, renewalPage);
    }
  }, [empId, startDate, endDate, searchTerm]);

  useEffect(() => {
    if (!empId) return;
    fetchAllData(nonRenewalPage, renewalPage);
  }, [nonRenewalPage, renewalPage]);

  const fetchAllData = async (nonPage, renPage) => {
    try {
      setLoading(true);
      const commonParams = { empId, startDate, endDate, searchTerm };

      const [countRes, nonRes, renRes] = await Promise.all([
        axiosInstance.get("/api/jobs/employeeActivityReports/employee-activity/counts", {
          params: { empId, startDate, endDate },
        }),
        axiosInstance.get("/api/jobs/employeeActivityReports/employee-activity/non-renewal-data", {
          params: { ...commonParams, page: nonPage, size: PAGE_SIZE },
        }),
        axiosInstance.get("/api/jobs/employeeActivityReports/employee-activity/renewal-data", {
          params: { ...commonParams, page: renPage, size: PAGE_SIZE },
        }),
      ]);

      setCounts(countRes.data);
      setNonRenewalData(nonRes.data.content || []);
      setNonRenewalTotalElements(nonRes.data.totalElements || 0);
      setRenewalData(renRes.data.content || []);
      setRenewalTotalElements(renRes.data.totalElements || 0);
    } catch (err) {
      console.error("Error fetching data:", err);
      setCounts({});
      setNonRenewalData([]);
      setRenewalData([]);
      setNonRenewalTotalElements(0);
      setRenewalTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  // -------------------- PAGINATION --------------------
  const nonRenewalTotalPages = Math.ceil(nonRenewalTotalElements / PAGE_SIZE);
  const renewalTotalPages = Math.ceil(renewalTotalElements / PAGE_SIZE);

  const handleNonRenewalPrev = () => setNonRenewalPage((prev) => Math.max(0, prev - 1));
  const handleNonRenewalNext = () => setNonRenewalPage((prev) => Math.min(nonRenewalTotalPages - 1, prev + 1));
  const handleRenewalPrev = () => setRenewalPage((prev) => Math.max(0, prev - 1));
  const handleRenewalNext = () => setRenewalPage((prev) => Math.min(renewalTotalPages - 1, prev + 1));

  // -------------------- COMPONENTS --------------------
  const DashboardCard = ({ title, count, colorClass }) => (
    <div className={`bg-white shadow-lg rounded-xl p-5 border-l-4 ${colorClass} transition-shadow duration-300 hover:shadow-xl`}>
      <h3 className="text-gray-600 text-sm font-medium uppercase tracking-wider">{title}</h3>
      <p className="text-4xl font-extrabold text-gray-900 mt-1">{count || 0}</p>
    </div>
  );

  const DataTable = ({ title, data, currentPage, totalPages, totalElements, onPrev, onNext }) => {
    const formattedData = formatTableData(data, currentPage, PAGE_SIZE);

    return (
      <div className="flex flex-col">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
        <div className="overflow-hidden bg-white shadow-lg rounded-xl border border-gray-200 flex-grow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 w-12">
                    Sr No
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Date</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Customer</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Site</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Type</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {formattedData.length > 0 ? (
                  formattedData.map((item) => (
                    <tr key={item.srNo} className="hover:bg-gray-50 transition duration-150">
                      <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-500 font-medium">{item.srNo}</td>
                      <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-900">{item.activityDate}</td>
                      <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-900">{item.customerName}</td>
                      <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-900">{item.siteName}</td>
                      <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-900">{item.activityType}</td>
                      <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-900">{item.activityBy}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-gray-500 py-6 text-sm">
                      No data found for the current filter/page.
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
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 border-b pb-2">Employee Activity Dashboard 📊</h1>

      {/* Filter Inputs */}
      <div className="bg-white shadow-lg rounded-xl p-6 mb-8 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Filter Controls</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Employee Dropdown */}
          <div className="flex flex-col">
            <label htmlFor="empId" className="text-sm font-medium text-gray-700 mb-1">
              Employee
            </label>
            <select
              id="empId"
              value={empId || ""}
              onChange={(e) => setEmpId(Number(e.target.value))}
              className="border border-gray-300 p-2 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
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
              className="border border-gray-300 p-2 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="endDate" className="text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-300 p-2 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            />
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-6">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <div className="text-indigo-600 font-medium">Loading data... Please wait.</div>
        </div>
      )}

      {/* Dashboard Cards */}
      {!loading && (
        <>
          <h2 className="text-2xl font-bold text-gray-800 mb-5">Activity Totals</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-10">
            <DashboardCard title="Non-Renewal Jobs" count={counts.totalNonRenewalJobActivityCount} colorClass="border-blue-500" />
            <DashboardCard title="Renewal Jobs" count={counts.totalRenewalJobActivityCount} colorClass="border-green-500" />
            <DashboardCard title="Non-Renewal Services" count={counts.totalNonRenewalServiceActivityCount} colorClass="border-yellow-500" />
            <DashboardCard title="Renewal Services" count={counts.totalRenewalServiceActivityCount} colorClass="border-indigo-500" />
            <DashboardCard title="Non-Renewal Breakdowns" count={counts.totalNonRenewalBreakdownActivityRenewalCount} colorClass="border-pink-500" />
            <DashboardCard title="Renewal Breakdowns" count={counts.totalRenewalBreakdownActivityCount} colorClass="border-purple-500" />
          </div>
        </>
      )}

      {/* Search */}
      <div className="flex justify-end items-center mb-6">
        <div className="relative w-full max-w-md">
          <input
            id="searchTerm"
            type="text"
            placeholder="Search Customer, Site, Type, By..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 p-2 pl-10 w-full rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 shadow-sm"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>

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
