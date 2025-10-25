"use client";

import { useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { Search, ChevronDown, CheckCircle, XCircle, DollarSign, Calendar, CreditCard, Loader2, Info } from 'lucide-react'; // Added Info icon

export default function AddPayment() {
  const [jobType, setJobType] = useState(""); // "amc" or "new"
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [jobSearch, setJobSearch] = useState("");
  const [jobDropdownOpen, setJobDropdownOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Payment fields
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [paymentType, setPaymentType] = useState("Cash");
  const [isCleared, setIsCleared] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for payment submission

  // --- Utility Functions (Keeping existing logic) ---

  const handleJobTypeChange = async (e) => {
    const selected = e.target.value;
    setJobType(selected);
    setJobSearch("");
    setSelectedJob(null);
    setInvoices([]);
    setSelectedInvoice(null);
    setJobs([]);
    setFilteredJobs([]);
    setLoading(true);

    try {
      if (selected === "amc") {
        const [activeJobsRes, renewalJobsRes] = await Promise.all([
          axiosInstance.get("/api/payments/getAllActiveJobs"),
          axiosInstance.get("/api/payments/getAllActiveRenewalJobs"),
        ]);

        const mergedData = [
          ...activeJobsRes.data.map((j) => ({
            id: j.jobId,
            selectDetailForJob: `${j.customerName} - ${j.siteName} (Job)`,
            type: "job",
            mailId: j.mailId,
          })),
          ...renewalJobsRes.data.map((j) => ({
            id: j.renewalJobId,
            selectDetailForJob: `${j.customerName} - ${j.siteName} (Renewal)`,
            type: "renewal",
            mailId: j.mailId,
          })),
        ];

        setJobs(mergedData);
        setFilteredJobs(mergedData);
      } else if (selected === "new") {
        const res = await axiosInstance.get("/api/payments/getAllActiveJobs");
        const jobsList = res.data.map((j) => ({
          id: j.jobId,
          selectDetailForJob: `${j.customerName} - ${j.siteName} (Job)`,
          type: "job",
          mailId: j.mailId,
        }));
        setJobs(jobsList);
        setFilteredJobs(jobsList);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleJobSearch = (value) => {
    setJobSearch(value);
    const lower = value.toLowerCase();
    const filtered = jobs.filter((j) =>
      j.selectDetailForJob.toLowerCase().includes(lower)
    );
    setFilteredJobs(filtered);
  };

  const handleJobSelect = async (job) => {
    setSelectedJob(job);
    setJobSearch(job.selectDetailForJob);
    setJobDropdownOpen(false);
    setInvoices([]);
    setSelectedInvoice(null);
    setLoadingInvoices(true);

    try {
      let res;
      if (job.type === "renewal") {
        res = await axiosInstance.get(
          `/api/payments/invoices/by-renewal-job/${job.id}`
        );
      } else {
        res = await axiosInstance.get(
          `/api/payments/invoices/by-job/${job.id}`
        );
      }

      if (res?.data && Array.isArray(res.data)) {
        setInvoices(res.data);

        // Auto-select if only one invoice
        if (res.data.length === 1) {
          setSelectedInvoice(res.data[0]);
        }
      } else {
        setInvoices([]);
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
      setInvoices([]);
    } finally {
      setLoadingInvoices(false);
    }
  };

  const handleSubmitPayment = (e) => {
    e.preventDefault();
    if (!selectedInvoice) {
      alert("Please select an invoice.");
      return;
    }
    // Logic to submit the payment
    setIsSubmitting(true);
    console.log("Submitting Payment:", {
      invoiceId: selectedInvoice.invoiceId,
      jobId: selectedJob.id,
      jobType: selectedJob.type,
      paymentDate,
      paymentType,
      isCleared,
      amount: selectedInvoice.totalAmt,
    });

    // Simulate API call delay
    setTimeout(() => {
        setIsSubmitting(false);
        alert(`Payment of ₹${selectedInvoice.totalAmt} submitted for Invoice ${selectedInvoice.invoiceNo}`);
        // Optionally reset form here
    }, 2000);
  };
  // --- End Utility Functions ---

  return (
    <div className="p-6 md:p-10 bg-gray-10 min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 flex items-center">
        <DollarSign className="w-7 h-7 mr-3 text-blue-600" />
        Record New Customer Payment
      </h2>
      
      <form onSubmit={handleSubmitPayment}>
        {/* Main 2-Column Layout for Job/Invoice Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            
          {/* COLUMN 1: Job Type Selection & Search Card (Always visible) */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 h-fit">
            <h3 className="text-xl font-semibold mb-5 text-gray-700 flex items-center">
                <Info className="w-5 h-5 mr-2 text-blue-500"/>
                1. Select Job Type and Search
            </h3>

            {/* Job Type Selection */}
            <div className="mb-6 flex flex-wrap gap-4 items-center">
              <p className="text-md font-medium text-gray-600">Category:</p>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="jobType"
                  value="amc"
                  checked={jobType === "amc"}
                  onChange={handleJobTypeChange}
                  className="mr-2 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className="text-gray-700 font-medium">AMC / Renewal</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="jobType"
                  value="new"
                  checked={jobType === "new"}
                  onChange={handleJobTypeChange}
                  className="mr-2 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className="text-gray-700 font-medium">New Installation</span>
              </label>
            </div>

            {/* Loading indicator */}
            {loading && (
              <div className="text-blue-600 mb-4 flex items-center">
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Loading jobs, please wait...
              </div>
            )}

            {/* Searchable Dropdown */}
            {jobType && !loading && (
              <div className="relative mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  <span className="font-bold">Search Job:</span> Customer Name - Site Name *
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={jobSearch}
                    onChange={(e) => handleJobSearch(e.target.value)}
                    onFocus={() => setJobDropdownOpen(true)}
                    onBlur={() => setTimeout(() => setJobDropdownOpen(false), 150)}
                    placeholder="Search by Customer or Site Name..."
                    className="w-full border border-gray-300 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-150"
                    aria-label="Search Job"
                  />
                  <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 transition-transform duration-200 ${jobDropdownOpen ? 'rotate-180' : 'rotate-0'}`} />
                </div>
                
                {jobDropdownOpen && (
                  <ul className="absolute z-20 bg-white border border-gray-300 rounded-lg shadow-xl w-full mt-1 max-h-60 overflow-y-auto divide-y divide-gray-100">
                    {filteredJobs.length > 0 ? (
                      filteredJobs.map((job, index) => (
                        <li
                          key={index}
                          className="px-4 py-3 text-gray-800 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition duration-150 text-sm"
                          onClick={() => handleJobSelect(job)}
                        >
                          {job.selectDetailForJob}
                        </li>
                      ))
                    ) : (
                      <li className="px-4 py-3 text-gray-500 text-sm italic text-center">
                        No matching jobs found
                      </li>
                    )}
                  </ul>
                )}
              </div>
            )}

            {/* Selected Job Info */}
            {selectedJob && (
              <div className="mt-5 p-4 border-l-4 border-blue-500 bg-blue-50 rounded">
                <p className="text-sm font-semibold text-blue-700">
                  **Job Selected:**
                </p>
                <p className="text-md text-gray-700">
                  {selectedJob.selectDetailForJob}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Email:</span> {selectedJob.mailId}
                </p>
              </div>
            )}
          </div>

          {/* COLUMN 2: Invoice Selection Card (Conditional visibility) */}
          {selectedJob && (
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-xl font-semibold mb-5 text-gray-700 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-blue-500"/>
                  2. Select Invoice to Pay
              </h3>

              {loadingInvoices && (
                <div className="text-blue-600 mt-4 flex items-center justify-center py-4">
                  <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                  Fetching invoices...
                </div>
              )}

              {!loadingInvoices && invoices.length > 0 && (
                <div className="grid gap-4 max-h-96 overflow-y-auto pr-2"> {/* Added max-height and scroll for compact view */}
                  {invoices.map((inv, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedInvoice(inv)}
                      className={`border rounded-xl p-4 shadow-sm cursor-pointer transition-all duration-200 relative ${
                        selectedInvoice?.invoiceId === inv.invoiceId
                          ? "border-blue-600 ring-4 ring-blue-100 bg-blue-50"
                          : "border-gray-300 hover:shadow-md hover:border-blue-400 bg-white"
                      }`}
                    >
                      <p className="font-extrabold text-lg text-gray-900 mb-1 leading-tight">
                        {inv.invoiceNo || "INV-N/A"}
                      </p>
                      <p className="text-sm text-gray-600">
                        **Date:** {inv.invoiceDate || "N/A"}
                      </p>
                      <p className="text-md text-gray-800 font-bold mt-1">
                        **Amount:** ₹{inv.totalAmt ? inv.totalAmt.toLocaleString('en-IN') : 0}
                      </p>
                      <div
                        className={`text-xs font-medium mt-2 p-1 rounded inline-flex items-center ${
                          inv.isCleared === 1 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {inv.isCleared === 1 ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                        {inv.isCleared === 1 ? "Cleared" : "Pending"}
                      </div>
                      {selectedInvoice?.invoiceId === inv.invoiceId && (
                        <div className="absolute top-2 right-2 text-blue-600">
                          <CheckCircle className="w-6 h-6 fill-blue-600 stroke-white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* No Invoices Found */}
              {!loadingInvoices && invoices.length === 0 && (
                <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 rounded text-center font-medium">
                  <span className="font-bold">Heads up!</span> No invoices found for this job.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Full-Width Section 3: Payment Input Details Card */}
        {selectedInvoice && (
          <div className="bg-white border rounded-xl shadow-lg p-6 border-gray-200">
            <h3 className="text-xl font-semibold mb-6 text-gray-700 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-blue-500"/>
                3. Enter Payment Information
            </h3>

            <div className="grid md:grid-cols-4 gap-6">
              {/* Payment Date */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" /> Payment Date*
                </label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 bg-white focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Payment Amount (Read-only) */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center">
                  <DollarSign className="w-4 h-4 mr-1" /> Payment Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 font-bold">₹</span>
                  <input
                    type="text"
                    value={selectedInvoice.totalAmt ? selectedInvoice.totalAmt.toLocaleString('en-IN') : '0'}
                    readOnly
                    className="w-full border border-gray-300 rounded-lg p-3 pl-7 bg-gray-100 font-semibold text-lg text-green-700"
                  />
                </div>
              </div>

              {/* Payment Cleared */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" /> Payment Cleared?
                </label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer border border-gray-300 rounded-full py-2 px-4 transition-colors duration-150 hover:bg-gray-50">
                    <input
                      type="radio"
                      name="isCleared"
                      value="yes"
                      checked={isCleared === true}
                      onChange={() => setIsCleared(true)}
                      className="text-green-500 focus:ring-green-500"
                    />
                    <span className="text-gray-700 font-medium">Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer border border-gray-300 rounded-full py-2 px-4 transition-colors duration-150 hover:bg-gray-50">
                    <input
                      type="radio"
                      name="isCleared"
                      value="no"
                      checked={isCleared === false}
                      onChange={() => setIsCleared(false)}
                      className="text-red-500 focus:ring-red-500"
                    />
                    <span className="text-gray-700 font-medium">No</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
                <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center">
                    <CreditCard className="w-4 h-4 mr-1" /> Select Payment Type*
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {["Cash", "Cheque", "DD", "NEFT"].map((type) => (
                        <div
                            key={type}
                            onClick={() => setPaymentType(type)}
                            className={`border rounded-lg p-3 text-center cursor-pointer transition-all duration-200 font-medium ${
                                paymentType === type
                                    ? "bg-blue-600 text-white shadow-md border-blue-600"
                                    : "hover:bg-blue-50 hover:text-blue-700 border-gray-300 text-gray-700"
                            }`}
                        >
                            {type}
                        </div>
                    ))}
                </div>
            </div>

            {/* Submit Button */}
            <div className="mt-10 pt-6 border-t border-gray-200">
                <button
                    type="submit"
                    disabled={isSubmitting || !selectedInvoice}
                    className={`w-full py-3 px-4 rounded-lg text-white font-semibold flex items-center justify-center transition duration-200 ${
                        isSubmitting || !selectedInvoice
                            ? 'bg-blue-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 shadow-md'
                    }`}
                >
                    {isSubmitting ? (
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    ) : (
                        <DollarSign className="w-5 h-5 mr-2" />
                    )}
                    {isSubmitting ? 'Processing Payment...' : 'Record Payment'}
                </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}