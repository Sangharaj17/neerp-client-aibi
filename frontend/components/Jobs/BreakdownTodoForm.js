"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";

export default function BreakdownTodoForm({ onClose }) {
  const searchParams = useSearchParams();
  const prefilledJobId = searchParams.get("jobId");

  const [formData, setFormData] = useState({
    userId: "",
    purpose: "",
    todoDate: "",
    time: "",
    venue: "",
    jobActivityTypeId: "",
    status: 0,
    complaintName: "",
    complaintMob: "",
    // Initialize both with prefilled ID for now, will be resolved by logic
    jobId: prefilledJobId || "", 
    renewalJobId: prefilledJobId || "", 
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

  // --- Utility to determine if a job is a Renewal Job ---
  const isRenewalJob = (job) => job.renewal === "renewal";
  const getJobIdentifier = (job) => isRenewalJob(job) ? job.renewalJobId : job.jobId;


  // Fetch all sites & jobs
 useEffect(() => {
  const fetchJobs = async () => {
    try {
      const [amcJobsRes, renewalJobsRes] = await Promise.all([
        axiosInstance.get("/api/amc-jobs/getAllActiveJobs"),
        axiosInstance.get("/api/amc-renewal-jobs/getAllActiveRenewalJobs"),
      ]);

      // Combine as-is without adding extra fields
      const combinedJobs = [
        ...(amcJobsRes.data || []),
        ...(renewalJobsRes.data || [])
      ];

      setSites(combinedJobs);
    } catch (error) {
      console.error("Failed to fetch job data:", error);
    }
  };

  fetchJobs();
}, []);


  // Fetch lifts when jobId OR renewalJobId changes
  useEffect(() => {
    const fetchLifts = async () => {
      const jobIdToFetch = formData.jobId || formData.renewalJobId;
      if (!jobIdToFetch) {
        setLifts([]); 
        setFormData((prev) => ({ ...prev, liftIds: [] }));
        return; 
      }


       const selectedJob = sites.find((site)=>{

        if(formData.jobId){
          if(site.renewal === ""){
            if(site.jobId === jobIdToFetch){
              return site;
            }
          }
        }else{
           if(site.renewal === "renewal"){
            if( site.renewalJobId === jobIdToFetch){
              return site;
            }
          }
        }
      })

      
      if (selectedJob) {
        setFormData((prev) => ({
          ...prev,
          jobId: isRenewalJob(selectedJob) ? "" : selectedJob.jobId,
          renewalJobId: isRenewalJob(selectedJob) ? selectedJob.renewalJobId : "",
        }));
      }

      setLoadingLifts(true);
      setSelectAllLifts(false);

      try {
        let res;

        if (formData.jobId && !formData.renewalJobId) {
          // AMC job
          res = await axiosInstance.get(
            `/api/amc-jobs/getAllLiftsForAddBreakDownTodo`,
            { params: { jobId: formData.jobId } }
          );
        } else if (formData.renewalJobId && !formData.jobId) {
          // Renewal job
          res = await axiosInstance.get(
            `/api/amc-renewal-jobs/getAllRenewalLiftsForAddBreakDownTodo`,
            { params: { jobId: formData.renewalJobId } }
          );
        }

        setLifts(res?.data || []);
        setFormData((prev) => ({ ...prev, liftIds: [] }));
      } catch (error) {
        console.error("Failed to fetch lifts:", error);
      } finally {
        setLoadingLifts(false);
      }
    };

    fetchLifts();
  }, [formData.jobId, formData.renewalJobId, sites]);


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
      setFormData({ ...formData, [name]: checked ? 1 : 0 }); 
    } else if (name === "time") {
      const formattedTime = value.length === 5 ? value + ":00" : value;
      setFormData({ ...formData, [name]: formattedTime });
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

  // 🚀 MAJOR CHANGE: Conditionally call the correct API endpoint
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation check
    if (!formData.jobId && !formData.renewalJobId) {
        alert("Please select a job.");
        return;
    }
    if (!formData.userId) {
        alert("Please select a user.");
        return;
    }
    if (lifts.length > 0 && formData.liftIds.length === 0) {
        alert("Please select at least one lift.");
        return;
    }

    try {
      let apiEndpoint;
      
      // Determine the correct API endpoint based on the selected job ID
      if (formData.renewalJobId) {
        // Use the new API for Renewal Jobs
        apiEndpoint = "/api/renewal/breakdown-todo"; 
      } else if (formData.jobId) {
        // Use the existing API for AMC Jobs
        apiEndpoint = "/api/breakdown-todo"; 
      } else {
        // This should not happen if validation passes, but good practice
        alert("Error: No job type determined for submission.");
        return;
      }

      await axiosInstance.post(apiEndpoint, formData);
      
      // Clear specific form fields after successful submission
      setFormData((prev) => ({
        ...prev,
        purpose: "",
        todoDate: "",
        time: "",
        venue: "",
        complaintName: "",
        complaintMob: "",
        userId: "",
      }));
      setSelectAllLifts(false);
      
      // Optional: Add a success alert
       alert("✅ Breakdown Todo added successfully!");
      //onClose(); // Close the modal after successful submission

    } catch (error) {
      console.error("Failed to add Breakdown Todo:", error);
      alert("❌ Failed to add Breakdown Todo.");
    }
  };

  const selectedJob = sites.find(
    (s) => s.jobId === formData.jobId || s.renewalJobId === formData.renewalJobId
  );

  const selectedJobLabel = selectedJob
    ? `${selectedJob.customerName} - ${selectedJob.siteName} (${isRenewalJob(selectedJob) ? 'Renewal' : 'AMC'} Job #${getJobIdentifier(selectedJob)})`
    : "";


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
            onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
            placeholder="Search Job..."
            className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-400"
            required
          />
          {dropdownOpen && (
            <div className="absolute z-10 w-full max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-xl mt-1 shadow-lg">
              {sites
                .filter(
                  (site) =>
                    site.customerName.toLowerCase().includes(jobSearch.toLowerCase()) ||
                    site.siteName.toLowerCase().includes(jobSearch.toLowerCase()) ||
                    String(getJobIdentifier(site)).includes(jobSearch)
                )
                .map((site) => {
                  const isRenewal = isRenewalJob(site);
                  const id = getJobIdentifier(site);
                  const typeLabel = isRenewal ? "Amc Renewal" : "AMC";

                  return (
                    <div
                      key={`${typeLabel}-${id}`}
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          jobId: isRenewal ? "" : id,
                          renewalJobId: isRenewal ? id : "",
                          liftIds: [],
                        }));
                        setDropdownOpen(false);
                        setJobSearch("");
                      }}
                      className="cursor-pointer px-3 py-2 hover:bg-blue-100"
                    >
                      {site.customerName} - {site.siteName} (Job #{id}, {typeLabel})
                    </div>
                  );
                })}

              {sites.filter(
                (site) =>
                  site.customerName.toLowerCase().includes(jobSearch.toLowerCase()) ||
                  site.siteName.toLowerCase().includes(jobSearch.toLowerCase()) ||
                  String(getJobIdentifier(site)).includes(jobSearch)
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
            onBlur={() => setTimeout(() => setUserDropdownOpen(false), 200)}
            placeholder="Search User..."
            className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-400"
            required
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
                      setUserSearch("");
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
        {(formData.jobId || formData.renewalJobId) && (
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
              <p className="text-gray-500 text-sm">No lifts found for the selected job.</p>
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
            <label className="block text-sm font-semibold mb-2">Time*</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-400"
              required
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
            checked={formData.status === 1} 
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