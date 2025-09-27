"use client";
import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";

export default function BreakdownTodoForm() {
  let prefilledJobId = "";
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    prefilledJobId = params.get("jobId") || "";
  }

  const [formData, setFormData] = useState({
    userId: "", // new field
    purpose: "",
    todoDate: "",
    time: "",
    venue: "",
    jobActivityTypeId: "",
    status: 0,
    complaintName: "",
    complaintMob: "",
    jobId: prefilledJobId || "",
    liftIds: [],
  });

  const [sites, setSites] = useState([]);
  const [lifts, setLifts] = useState([]);
  const [loadingLifts, setLoadingLifts] = useState(false);
  const [selectAllLifts, setSelectAllLifts] = useState(false);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [jobSearch, setJobSearch] = useState("");

  const [users, setUsers] = useState([]);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [userSearch, setUserSearch] = useState("");

  // Fetch all sites & jobs
  useEffect(() => {
    const fetchSites = async () => {
      try {
        const res = await axiosInstance.get("/api/amc-jobs/getAllActiveJobs");
        setSites(res.data);
      } catch (error) {
        console.error("Failed to fetch sites:", error);
      }
    };
    fetchSites();
  }, []);

  // Fetch lifts when jobId changes
  useEffect(() => {
    const fetchLifts = async () => {
      if (!formData.jobId) return;
      setLoadingLifts(true);
      setSelectAllLifts(false);
      try {
        const res = await axiosInstance.get(
          `/api/amc-jobs/getAllLiftsForAddBreakDownTodo`,
          { params: { jobId: formData.jobId } }
        );
        setLifts(res.data);
        setFormData((prev) => ({ ...prev, liftIds: [] }));
      } catch (error) {
        console.error("Failed to fetch lifts:", error);
      } finally {
        setLoadingLifts(false);
      }
    };
    fetchLifts();
  }, [formData.jobId]);

  // Fetch users (executives)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get("/api/employees/executives");
        setUsers(res.data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "liftIds") {
      const updatedLiftIds = checked
        ? [...formData.liftIds, Number(value)]
        : formData.liftIds.filter((id) => id !== Number(value));
      setFormData({ ...formData, liftIds: updatedLiftIds });
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectAllLifts(checked);
    setFormData({
      ...formData,
      liftIds: checked ? lifts.map((lift) => lift.enquiryId) : [],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/api/breakdown-todo", formData);
      alert("✅ Breakdown Todo added successfully!");
      setFormData((prev) => ({
        ...prev,
        purpose: "",
        todoDate: "",
        time: "",
        venue: "",
        complaintName: "",
        complaintMob: "",
        liftIds: [],
        userId: "",
      }));
      setSelectAllLifts(false);
      setJobSearch("");
      setUserSearch("");
    } catch (error) {
      console.error("Failed to add Breakdown Todo:", error);
      alert("❌ Failed to add Breakdown Todo.");
    }
  };

  const selectedJobLabel = formData.jobId
    ? sites.find((s) => s.jobId === formData.jobId)?.customerName +
      " - " +
      sites.find((s) => s.jobId === formData.jobId)?.siteName
    : "";

  // ✅ Fix: use employeeId instead of id
  const selectedUserLabel = formData.userId
    ? users.find((u) => u.employeeId === formData.userId)?.employeeName || ""
    : "";

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
        Add Breakdown Todo
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Job Selection */}
        <div className="relative">
          <label className="block text-sm font-semibold mb-2">Select Job*</label>
          <input
            type="text"
            value={dropdownOpen ? jobSearch : selectedJobLabel}
            onChange={(e) => {
              setJobSearch(e.target.value);
              setDropdownOpen(true);
            }}
            onFocus={() => setDropdownOpen(true)}
            placeholder="Search Job..."
            className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-400"
          />
          {dropdownOpen && (
            <div className="absolute z-10 w-full max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-xl mt-1 shadow-lg">
              {sites
                .filter(
                  (site) =>
                    site.customerName.toLowerCase().includes(jobSearch.toLowerCase()) ||
                    site.siteName.toLowerCase().includes(jobSearch.toLowerCase())
                )
                .map((site) => (
                  <div
                    key={site.jobId}
                    onClick={() => {
                      setFormData({ ...formData, jobId: site.jobId });
                      setDropdownOpen(false);
                      setJobSearch("");
                    }}
                    className="cursor-pointer px-3 py-2 hover:bg-blue-100"
                  >
                    {site.customerName} - {site.siteName} (Job #{site.jobId})
                  </div>
                ))}
              {sites.filter(
                (site) =>
                  site.customerName.toLowerCase().includes(jobSearch.toLowerCase()) ||
                  site.siteName.toLowerCase().includes(jobSearch.toLowerCase())
              ).length === 0 && (
                <div className="px-3 py-2 text-gray-500">No jobs found</div>
              )}
            </div>
          )}
        </div>

        {/* User Selection */}
        <div className="relative">
          <label className="block text-sm font-semibold mb-2">Select User*</label>
          <input
            type="text"
            value={userDropdownOpen ? userSearch : selectedUserLabel}
            onChange={(e) => {
              setUserSearch(e.target.value);
              setUserDropdownOpen(true);
            }}
            onFocus={() => setUserDropdownOpen(true)}
            placeholder="Search User..."
            className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-400"
          />
          {userDropdownOpen && (
            <div className="absolute z-10 w-full max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-xl mt-1 shadow-lg">
              {users
                .filter((user) =>
                  user.employeeName.toLowerCase().includes(userSearch.toLowerCase())
                )
                .map((user) => (
                  <div
                    key={user.employeeId}
                    onClick={() => {
                      setFormData({ ...formData, userId: user.employeeId });
                      setUserDropdownOpen(false);
                      setUserSearch(""); // reset search after selection
                    }}
                    className="cursor-pointer px-3 py-2 hover:bg-blue-100"
                  >
                    {user.employeeName} (ID: {user.employeeId})
                  </div>
                ))}
              {users.filter((user) =>
                user.employeeName.toLowerCase().includes(userSearch.toLowerCase())
              ).length === 0 && (
                <div className="px-3 py-2 text-gray-500">No users found</div>
              )}
            </div>
          )}
        </div>

        {/* Lift Selection */}
        {formData.jobId && (
          <div>
            <label className="block text-sm font-semibold mb-2">Select Lifts*</label>
            {loadingLifts ? (
              <p className="text-gray-500 text-sm">Loading lifts...</p>
            ) : lifts.length > 0 ? (
              <div className="border border-gray-200 rounded-2xl p-3 bg-gray-50">
                <label className="flex items-center mb-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectAllLifts}
                    onChange={handleSelectAll}
                    className="mr-2 w-5 h-5 accent-blue-600"
                  />
                  <span className="text-sm font-medium">Select All Lifts</span>
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-72 overflow-y-auto">
                  {lifts.map((lift, index) => (
                    <label
                      key={lift.enquiryId}
                      className={`flex flex-col items-center justify-center border rounded-xl p-3 text-center cursor-pointer hover:shadow-lg transition-all ${
                        formData.liftIds.includes(lift.enquiryId)
                          ? "bg-blue-100 border-blue-400"
                          : "bg-white"
                      }`}
                    >
                      <input
                        type="checkbox"
                        name="liftIds"
                        value={lift.enquiryId}
                        checked={formData.liftIds.includes(lift.enquiryId)}
                        onChange={handleChange}
                        className="mb-1 w-4 h-4 accent-blue-600"
                      />
                      <span className="text-sm font-medium">
                        {lift.liftName || `Lift ${index + 1}`}
                      </span>
                      <span className="text-xs text-gray-500">
                        {lift.capacityValue} | {lift.typeOfElevators}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No lifts found for this job.</p>
            )}
          </div>
        )}

        {/* Purpose & Date/Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Purpose*</label>
            <input
              type="text"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Todo Date*</label>
            <input
              type="date"
              name="todoDate"
              value={formData.todoDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Time</label>
            <input
              type="text"
              name="time"
              value={formData.time}
              onChange={handleChange}
              placeholder="HH:MM"
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Venue</label>
            <input
              type="text"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Complaint Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Complaint Name</label>
            <input
              type="text"
              name="complaintName"
              value={formData.complaintName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Complaint Mobile</label>
            <input
              type="text"
              name="complaintMob"
              value={formData.complaintMob}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="status"
            checked={formData.status}
            onChange={handleChange}
            className="w-4 h-4 accent-blue-600"
          />
          <label className="text-sm font-medium">Active</label>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-2xl shadow-lg transition-all"
        >
          Save Breakdown Todo
        </button>
      </form>
    </div>
  );
}
