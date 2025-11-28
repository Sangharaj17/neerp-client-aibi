"use client";

import { useEffect, useState } from "react";
import Input from "@/components/UI/Input";
import axiosInstance from "@/utils/axiosInstance";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const API_EMPLOYEE_OUT_TIME = "/api/employee-out-time";
const API_EMPLOYEES = "/api/employees";

export default function EmployeeOutTimePage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    employeeId: "",
    outTimeHours: "",
    outTimeMinutes: "",
    date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
    todaysSummary: "",
  });

  // Generate hours (0-23) and minutes (0-59) options
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(API_EMPLOYEES);
      const data = Array.isArray(res.data) ? res.data : [];
      setEmployees(data);
    } catch (error) {
      console.error("Failed to fetch employees", error);
      toast.error("Could not fetch employees.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Validation
    if (!formData.employeeId) {
      toast.error("Please select an employee.");
      return;
    }
    if (formData.outTimeHours === "" || formData.outTimeMinutes === "") {
      toast.error("Please select out time hours and minutes.");
      return;
    }
    if (!formData.date) {
      toast.error("Please select a date.");
      return;
    }
    
    // Check if date is in the past
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      toast.error("Cannot mark out-time for past dates. Please select today's date or a future date.");
      return;
    }
    
    if (!formData.todaysSummary.trim()) {
      toast.error("Please enter today's summary.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        employeeId: parseInt(formData.employeeId),
        outTimeHours: parseInt(formData.outTimeHours),
        outTimeMinutes: parseInt(formData.outTimeMinutes),
        date: formData.date,
        todaysSummary: formData.todaysSummary.trim(),
      };

      await axiosInstance.post(API_EMPLOYEE_OUT_TIME, payload);
      toast.success("Employee out time added successfully.");
      
      // Reset form
      setFormData({
        employeeId: "",
        outTimeHours: "",
        outTimeMinutes: "",
        date: new Date().toISOString().split('T')[0],
        todaysSummary: "",
      });
    } catch (error) {
      console.error("Failed to add employee out time", error);
      console.error("Error details:", {
        response: error.response?.data,
        status: error.response?.status,
        message: error.message
      });
      
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        let message = "Failed to add employee out time.";
        
        if (typeof data === 'string') {
          message = data;
        } else if (data?.message) {
          message = data.message;
        } else if (data?.error) {
          message = data.error;
        }
        
        if (status === 400) {
          toast.error(`Validation error: ${message}`);
        } else if (status >= 500) {
          toast.error(`Server error: ${message || 'Internal server error.'}`);
        } else {
          toast.error(`Error (${status}): ${message}`);
        }
      } else if (error.request) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error(`Failed to add employee out time: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-gray-900">Add Your Out time</h1>
        <p className="text-sm text-gray-600">
          Record employee out-time and today's summary for attendance tracking.
        </p>
      </header>

      {/* Form Section */}
      <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Select Employee */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Employee<span className="text-red-500">*</span>
            </label>
            <select
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              className="w-full flex h-9 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              required
              disabled={saving || loading}
            >
              <option value="">Please Select</option>
              {employees.map((employee) => (
                <option key={employee.employeeId} value={employee.employeeId}>
                  {employee.employeeName}
                </option>
              ))}
            </select>
          </div>

          {/* Out Time - Hours and Minutes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Out Time<span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Hours</label>
                <select
                  name="outTimeHours"
                  value={formData.outTimeHours}
                  onChange={handleChange}
                  className="w-full flex h-9 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                  disabled={saving}
                >
                  <option value="">Please Select</option>
                  {hours.map((hour) => (
                    <option key={hour} value={hour}>
                      {String(hour).padStart(2, "0")}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Minutes</label>
                <select
                  name="outTimeMinutes"
                  value={formData.outTimeMinutes}
                  onChange={handleChange}
                  className="w-full flex h-9 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                  disabled={saving}
                >
                  <option value="">Please Select</option>
                  {minutes.map((minute) => (
                    <option key={minute} value={minute}>
                      {String(minute).padStart(2, "0")}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date<span className="text-red-500">*</span>
            </label>
            <Input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full"
              required
              disabled={saving}
            />
          </div>

          {/* Today's Summary */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Todays Summery<span className="text-red-500">*</span>
            </label>
            <textarea
              name="todaysSummary"
              value={formData.todaysSummary}
              onChange={handleChange}
              rows={4}
              className="w-full flex rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
              placeholder="Enter today's summary..."
              required
              disabled={saving}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  employeeId: "",
                  outTimeHours: "",
                  outTimeMinutes: "",
                  date: new Date().toISOString().split('T')[0],
                  todaysSummary: "",
                });
              }}
              disabled={saving}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-gray-900 px-5 text-sm font-semibold text-white shadow hover:bg-gray-800 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}
              Submit
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
