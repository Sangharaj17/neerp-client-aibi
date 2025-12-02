"use client";

import { useEffect, useState, useRef } from "react";
import Input from "@/components/UI/Input";
import axiosInstance from "@/utils/axiosInstance";
import { Loader2, Calendar, Search } from "lucide-react";
import toast from "react-hot-toast";

const API_EMPLOYEE_ATTENDANCE = "/api/employee-attendance";
const API_EMPLOYEES = "/api/employees";

export default function EmployeeAttendanceListPage() {
  const [employees, setEmployees] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const hasInitialLoad = useRef(false);

  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    employeeId: "",
  });

  // Get current month dates as default
  useEffect(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    setFilters({
      fromDate: firstDay.toISOString().split('T')[0],
      toDate: lastDay.toISOString().split('T')[0],
      employeeId: "",
    });
  }, []);

  useEffect(() => {
    loadEmployees();
  }, []);

  // Auto-load attendance data when dates are set (on initial load)
  useEffect(() => {
    if (filters.fromDate && filters.toDate && employees.length > 0 && !hasInitialLoad.current) {
      // Only auto-load once when dates are first set
      hasInitialLoad.current = true;
      
      const loadAttendanceData = async () => {
        setSearching(true);
        try {
          const params = new URLSearchParams({
            fromDate: filters.fromDate,
            toDate: filters.toDate,
          });
          
          if (filters.employeeId) {
            params.append("employeeId", filters.employeeId);
          }

          const res = await axiosInstance.get(`${API_EMPLOYEE_ATTENDANCE}?${params}`);
          const data = Array.isArray(res.data) ? res.data : [];
          setAttendanceData(data);
          
          if (data.length === 0) {
            toast.info("No attendance data found for the selected period.");
          }
        } catch (error) {
          console.error("Failed to fetch attendance", error);
          toast.error("Failed to fetch attendance data.");
        } finally {
          setSearching(false);
        }
      };
      
      loadAttendanceData();
    }
  }, [filters.fromDate, filters.toDate, filters.employeeId, employees.length]);

  const loadEmployees = async () => {
    try {
      const res = await axiosInstance.get(API_EMPLOYEES);
      const data = Array.isArray(res.data) ? res.data : [];
      setEmployees(data);
    } catch (error) {
      console.error("Failed to fetch employees", error);
      toast.error("Could not fetch employees.");
    }
  };

  const handleSearch = async () => {
    if (!filters.fromDate || !filters.toDate) {
      toast.error("Please select from date and to date.");
      return;
    }

    setSearching(true);
    try {
      const params = new URLSearchParams({
        fromDate: filters.fromDate,
        toDate: filters.toDate,
      });
      
      if (filters.employeeId) {
        params.append("employeeId", filters.employeeId);
      }

      const res = await axiosInstance.get(`${API_EMPLOYEE_ATTENDANCE}?${params}`);
      const data = Array.isArray(res.data) ? res.data : [];
      setAttendanceData(data);
      
      if (data.length === 0) {
        toast.info("No attendance data found for the selected period.");
      }
    } catch (error) {
      console.error("Failed to fetch attendance", error);
      toast.error("Failed to fetch attendance data.");
    } finally {
      setSearching(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Generate days array for the selected date range
  const getDaysInRange = () => {
    if (!filters.fromDate || !filters.toDate) return [];
    
    const days = [];
    const start = new Date(filters.fromDate);
    const end = new Date(filters.toDate);
    const current = new Date(start);

    while (current <= end) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  const days = getDaysInRange();

  // Get month name for display
  const getMonthYear = () => {
    if (!filters.fromDate) return "";
    const date = new Date(filters.fromDate);
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return `${monthNames[date.getMonth()]}-${date.getFullYear()}`;
  };

  // Format day of week abbreviation
  const getDayAbbr = (date) => {
    const abbr = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    return abbr[date.getDay()];
  };

  // Check if date is Sunday
  const isSunday = (date) => date.getDay() === 0;

  // Get attendance status for a specific date
  const getAttendanceStatus = (employee, date) => {
    const dateKey = date.toISOString().split('T')[0];
    return employee.dailyAttendance?.[dateKey] || "-";
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "P":
        return "bg-green-100 text-green-800";
      case "A":
        return "bg-orange-100 text-orange-800";
      case "L":
        return "bg-red-100 text-red-800";
      case "-":
        return "bg-gray-100 text-gray-500";
      default:
        return "bg-white text-gray-700";
    }
  };

  return (
    <div className="max-w-full mx-auto p-4 sm:p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-gray-900">All Employee Attendance</h1>
        <p className="text-sm text-gray-600">
          View and manage employee attendance records by date range.
        </p>
      </header>

      {/* Filter Section */}
      <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From Date<span className="text-red-500">*</span>
            </label>
            <Input
              type="date"
              name="fromDate"
              value={filters.fromDate}
              onChange={handleFilterChange}
              className="w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To Date<span className="text-red-500">*</span>
            </label>
            <Input
              type="date"
              name="toDate"
              value={filters.toDate}
              onChange={handleFilterChange}
              className="w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employee Name<span className="text-red-500">*</span>
            </label>
            <select
              name="employeeId"
              value={filters.employeeId}
              onChange={handleFilterChange}
              className="w-full flex h-9 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">please select</option>
              {employees.map((employee) => (
                <option key={employee.employeeId} value={employee.employeeId}>
                  {employee.employeeName}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleSearch}
              disabled={searching}
              className="w-full inline-flex h-10 items-center justify-center gap-2 rounded-md bg-gray-900 px-4 text-sm font-semibold text-white shadow hover:bg-gray-800 disabled:opacity-50"
            >
              {searching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Attendance Table */}
      {attendanceData.length > 0 && (
        <section className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
            <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
              Employee Attendance Of {getMonthYear()} Month
            </h2>
            <span className="text-xs text-gray-500">
              {attendanceData.length} {attendanceData.length === 1 ? "employee" : "employees"}
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-3 py-2 border border-gray-200 text-left font-medium text-gray-700 min-w-[150px]">
                    Date → Name ↓
                  </th>
                  {days.map((day) => (
                    <th
                      key={day.toISOString()}
                      className={`px-2 py-2 border border-gray-200 text-center font-medium text-xs min-w-[60px] ${
                        isSunday(day)
                          ? "bg-red-500 text-white"
                          : "text-gray-700"
                      }`}
                    >
                      <div className="flex flex-col">
                        <span>{String(day.getDate()).padStart(2, "0")}</span>
                        <span className="text-[10px]">{getDayAbbr(day)}</span>
                      </div>
                    </th>
                  ))}
                  <th className="px-3 py-2 border border-gray-200 text-center font-medium text-gray-700 bg-green-100 min-w-[80px]">
                    Present
                  </th>
                  <th className="px-3 py-2 border border-gray-200 text-center font-medium text-gray-700 bg-orange-100 min-w-[80px]">
                    Absent
                  </th>
                  <th className="px-3 py-2 border border-gray-200 text-center font-medium text-gray-700 bg-red-100 min-w-[80px]">
                    Leave
                  </th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.map((employee) => (
                  <tr
                    key={employee.employeeId}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-3 py-2 border border-gray-200 font-medium text-gray-800">
                      {employee.employeeName}
                    </td>
                    {days.map((day) => {
                      const status = getAttendanceStatus(employee, day);
                      return (
                        <td
                          key={`${employee.employeeId}-${day.toISOString()}`}
                          className={`px-2 py-2 border border-gray-200 text-center text-xs ${
                            isSunday(day)
                              ? "bg-red-500 text-white"
                              : getStatusColor(status)
                          }`}
                        >
                          {status}
                        </td>
                      );
                    })}
                    <td className="px-3 py-2 border border-gray-200 text-center bg-green-50 font-medium text-green-700">
                      {employee.present || 0}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 text-center bg-orange-50 font-medium text-orange-700">
                      {employee.absent || 0}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 text-center bg-red-50 font-medium text-red-700">
                      {employee.leave || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {attendanceData.length === 0 && !searching && filters.fromDate && filters.toDate && (
        <div className="text-center py-12 text-gray-500">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p>No attendance data available. Click Search to load attendance records.</p>
        </div>
      )}
    </div>
  );
}
