"use client";

import { useEffect, useState } from "react";
import Input from "@/components/UI/Input";
import axiosInstance from "@/utils/axiosInstance";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const API_EMPLOYEE_LEAVE = "/api/employee-leave";
const API_EMPLOYEES = "/api/employees";

export default function EmployeeLeaveEntryPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    employeeId: "",
    leaveType: "Full Day", // Default to "Full Day"
    leaveFromDate: "",
    leaveToDate: "",
    leaveReason: "",
  });

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
    if (!formData.leaveType) {
      toast.error("Please select a leave type.");
      return;
    }
    if (!formData.leaveFromDate) {
      toast.error("Please select leave from date.");
      return;
    }
    if (!formData.leaveToDate) {
      toast.error("Please select leave to date.");
      return;
    }
    if (!formData.leaveReason.trim()) {
      toast.error("Please enter leave reason.");
      return;
    }

    // Validate date range
    const fromDate = new Date(formData.leaveFromDate);
    const toDate = new Date(formData.leaveToDate);
    if (toDate < fromDate) {
      toast.error("Leave to date must be after or equal to leave from date.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        employeeId: parseInt(formData.employeeId),
        leaveType: formData.leaveType,
        leaveFromDate: formData.leaveFromDate,
        leaveToDate: formData.leaveToDate,
        leaveReason: formData.leaveReason.trim(),
      };

      await axiosInstance.post(API_EMPLOYEE_LEAVE, payload);
      toast.success("Employee leave added successfully.");
      
      // Reset form
      setFormData({
        employeeId: "",
        leaveType: "Full Day",
        leaveFromDate: "",
        leaveToDate: "",
        leaveReason: "",
      });
    } catch (error) {
      console.error("Failed to add employee leave", error);
      console.error("Error details:", {
        response: error.response?.data,
        status: error.response?.status,
        message: error.message
      });
      
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        let message = "Failed to add employee leave.";
        
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
        toast.error(`Failed to add employee leave: ${error.message || 'Unknown error'}`);
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
        <h1 className="text-2xl font-semibold text-gray-900">Add Employee Leave</h1>
        <p className="text-sm text-gray-600">
          Record employee leave entries for attendance management.
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

          {/* Leave Type - Radio Buttons */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Leave Type<span className="text-red-500">*</span>
            </label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="leaveType"
                  value="Full Day"
                  checked={formData.leaveType === "Full Day"}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  disabled={saving}
                />
                <span className="text-sm text-gray-700">Full Day</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="leaveType"
                  value="Half Day"
                  checked={formData.leaveType === "Half Day"}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  disabled={saving}
                />
                <span className="text-sm text-gray-700">Half Day</span>
              </label>
            </div>
          </div>

          {/* Leave From Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Leave From Date<span className="text-red-500">*</span>
            </label>
            <Input
              type="date"
              name="leaveFromDate"
              value={formData.leaveFromDate}
              onChange={handleChange}
              className="w-full"
              required
              disabled={saving}
            />
          </div>

          {/* Leave To Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Leave To Date<span className="text-red-500">*</span>
            </label>
            <Input
              type="date"
              name="leaveToDate"
              value={formData.leaveToDate}
              onChange={handleChange}
              className="w-full"
              required
              disabled={saving}
            />
          </div>

          {/* Leave Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Leave Reason<span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              name="leaveReason"
              value={formData.leaveReason}
              onChange={handleChange}
              placeholder="Leave Reason"
              className="w-full"
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
                  leaveType: "Full Day",
                  leaveFromDate: "",
                  leaveToDate: "",
                  leaveReason: "",
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
