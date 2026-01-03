"use client";
import { useEffect, useState, useCallback, useMemo } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import {
  Loader2,
  Eye,
  FileText,
  Trash2,
  Pencil,
  User,
  Send,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getTenant } from "@/utils/tenant";
import * as XLSX from "xlsx";
import { formatJobNo, TruncatedTextWithTooltip } from "@/utils/common";

// API Endpoint for New Installation Jobs
const JOBS_API = '/api/jobs';

export default function NiJobList() {
  const router = useRouter();

  // State
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(null);
  const [companyName, setCompanyName] = useState("");

  // Pagination & Search
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState(""); // Debounce input
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Sorting
  const [sortBy, setSortBy] = useState('jobId');
  const [direction, setDirection] = useState('desc');

  // Debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Reset page on search change
  useEffect(() => {
    setPage(0);
  }, [search]);


  /**
   * Fetch Jobs (Server-Side Pagination)
   */
  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await axiosInstance.get(JOBS_API, {
        params: {
          page: page,
          size: size,
          search: search || null,
          paged: true // ✅ Use server-side pagination
        }
      });

      if (res.data.success) {
        const data = res.data.data;
        // Check if response is paginated (it should be due to paged=true)
        if (data.content) {
          setJobs(data.content);
          setTotalPages(data.totalPages);
          setTotalElements(data.totalElements);
        } else {
          // Fallback if backend didn't return page (e.g. error in param)
          setJobs(data);
        }
      }
    } catch (err) {
      console.error("Error fetching NI Jobs:", err);
      setError("Failed to load New Installation Jobs");
    } finally {
      setLoading(false);
    }
  }, [search, page, size]); // ✅ Removed sortBy/direction from deps

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Client-Side Sorting of the Fetched Page
  const sortedJobs = useMemo(() => {
    if (!sortBy) return jobs;

    return [...jobs].sort((a, b) => {
      const valA = a[sortBy];
      const valB = b[sortBy];

      if (valA == null) return 1;
      if (valB == null) return -1;

      if (typeof valA === "number") {
        return direction === "asc" ? valA - valB : valB - valA;
      }

      return direction === "asc"
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [jobs, sortBy, direction]);

  // const sortedJobs = [...jobs].sort((a, b) => {
  //   let valA, valB;

  //   // ✅ Special Handling for 'jobNo' to sort by the FORMATTED string
  //   if (sortBy === 'jobNo') {
  //     valA = formatJobNo(a, companyName);
  //     valB = formatJobNo(b, companyName);
  //   } else {
  //     valA = a[sortBy];
  //     valB = b[sortBy];
  //   }

  //   // Handle nulls
  //   if (valA == null) valA = "";
  //   if (valB == null) valB = "";

  //   // Numeric checks
  //   if (sortBy === 'jobId' || sortBy === 'jobAmount') {
  //     valA = Number(valA) || 0;
  //     valB = Number(valB) || 0;
  //   }
  //   // Date checks usually strings in JSON, but simple comparison works for ISO YYYY-MM-DD
  //   // If format is differnet, might need Date.parse

  //   // String case insensitive
  //   if (typeof valA === 'string') {
  //     valA = valA.toLowerCase();
  //     valB = valB.toLowerCase();
  //   }

  //   if (valA < valB) return direction === 'asc' ? -1 : 1;
  //   if (valA > valB) return direction === 'asc' ? 1 : -1;
  //   return 0;
  // });


  // Fetch Company Name


  useEffect(() => {
    const fetchCompanyName = async () => {
      const tenant = getTenant();
      if (!tenant) return;
      try {
        const res = await axiosInstance.get(`/api/v1/settings/COMPANY_SETTINGS_1/company-name`);
        if (res.data.success) {
          setCompanyName(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch company name", err);
      }
    };
    fetchCompanyName();
  }, []);


  const handleSort = (field) => {
    if (sortBy === field) {
      setDirection(direction === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setDirection('asc');
    }
  };

  const handleExportExcel = () => {
    if (!sortedJobs || sortedJobs.length === 0) {
      alert("No job data available to export");
      return;
    }

    // 👉 Prepare export data
    const exportData = sortedJobs.map((job, index) => ({
      "Sr No": index + 1,
      "Job No": formatJobNo(job, companyName),
      "Job Type": job.jobTypeName || "-",
      "Customer": job.customerName || "-",
      "Job Amount": job.jobAmount ?? "-",
      "Status": job.jobStatus || "-",
      "Payment Term": job.paymentTerm || "-",
      "Start Date": job.startDate || "-"
    }));

    // 👉 Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // 👉 Style Header Row
    const headers = Object.keys(exportData[0]);
    headers.forEach((header, index) => {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: index });
      if (!worksheet[cellAddress]) return;

      worksheet[cellAddress].s = {
        font: {
          bold: true,
          color: { rgb: "FFFFFF" }
        },
        fill: {
          fgColor: { rgb: "1D4ED8" } // Professional Blue
        },
        alignment: {
          horizontal: "center",
          vertical: "center"
        }
      };
    });

    // 👉 Auto column width
    worksheet["!cols"] = headers.map(header => ({
      wch: Math.max(header.length + 5, 20)
    }));

    // 👉 Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "NI Jobs");

    // 👉 Download file
    XLSX.writeFile(workbook, "New_Installation_Job_List.xlsx");
  };


  const columns = [
    { key: 'jobId', label: 'Job ID' }, // Using ID as proxy for Sr No if needed or index
    { key: 'jobNo', label: 'Job No' },
    { key: 'jobTypeName', label: 'Job Type' },
    { key: 'customerName', label: 'Customer' },
    { key: 'siteName', label: 'Site' },
    { key: 'siteAddress', label: 'Address' }, // Correct key from DTO? DTO has siteAddress
    // { key: 'jobAmount', label: 'Amount' },
    { key: 'jobStatus', label: 'Status' },
    { key: 'paymentTerm', label: 'Payment Term' }, // ID? name?
    // { key: 'startDate', label: 'Start Date' },
    // { key: 'customerName', label: 'Customer' }, // Missing in DTO
    // { key: 'siteName', label: 'Site' },         // Missing in DTO
    { key: 'actions', label: 'Actions' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'WIP': return 'bg-blue-500';
      case 'Completed': return 'bg-green-500';
      case 'Hold': return 'bg-yellow-500';
      default: return 'bg-gray-300';
    }
  };

  return (
    // <div className="p-4 bg-gray-10 min-h-screen">
    <div className="p-6 sm:p-8 bg-gray-10 min-h-screen">

      <h1 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-2">
        New Installation Job List
      </h1>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search jobs (Job No, Customer, Site, Type, Status)..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full md:w-1/3 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
        />

        <div className="flex items-center gap-3">

          {/* Export Button */}
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-3 py-2 text-sm
                 bg-indigo-100 text-indigo-700 
                 hover:bg-indigo-200 rounded-lg transition"
          >
            📥 Export to Excel
          </button>

          {/* Page Size */}
          <select
            value={size}
            onChange={(e) => {
              setSize(parseInt(e.target.value));
              setPage(0);
            }}
            className="p-2 rounded-lg border border-gray-300 
                 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
          >
            {[10, 25, 50, 100].map((s) => (
              <option key={s} value={s}>{s} per page</option>
            ))}
          </select>

        </div>
      </div>

      <div className="relative overflow-x-auto rounded-lg shadow-lg">

        {/* <table className="min-w-full bg-white text-sm"> */}
        <table className="table-fixed w-full bg-white text-sm">
          <thead className="bg-indigo-100 text-gray-700 uppercase text-xs font-semibold">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.key !== "actions" && handleSort(col.key)}

                  className={`${col.key === "jobId" ? "px-2 w-16" : "px-3"}  py-2 text-center 
          ${col.key !== "actions" ? "cursor-pointer hover:bg-indigo-200" : ""}
          transition-colors whitespace-nowrap`}
                >
                  <div className="flex items-center justify-center gap-1">
                    {col.label}
                    {sortBy === col.key && (
                      <span className="text-[10px]">
                        {direction === "asc" ? "▲" : "▼"}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-6 text-gray-400">Loading...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-6 text-red-500">{error}</td>
              </tr>
            ) : sortedJobs.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-6 text-gray-400">No jobs found</td>
              </tr>
            ) : (
              sortedJobs.map((job, index) => (
                <tr key={job.jobId} className="hover:bg-gray-50 transition-colors text-center">
                  <td className="px-2 py-2 text-center w-16">{job.jobId}</td>
                  <td className="px-3 py-2 font-medium">
                    {formatJobNo(job, companyName)}
                  </td>
                  <td className="px-3 py-2 text-center">{job.jobTypeName}</td>
                  <td className="px-3 py-2 text-center max-w-xs"><TruncatedTextWithTooltip
                    text={job.customerName}
                    maxLength={30}
                  /></td>
                  <td className="px-3 py-2 text-center max-w-xs">
                    <TruncatedTextWithTooltip
                      text={job.siteName}
                      maxLength={30}
                    />
                  </td>
                  <td className="px-3 py-2 max-w-xs"><TruncatedTextWithTooltip
                    text={job.siteAddress}
                    maxLength={30}
                  /></td>
                  {/* <td className="px-3 py-2">₹{job.jobAmount}</td> */}
                  <td className="px-3 py-2">
                    <span className={`px-2 py-1 rounded-full text-white text-xs font-semibold ${getStatusColor(job.jobStatus)}`}>
                      {job.jobStatus}
                    </span>
                  </td>
                  <td className="px-3 py-2">{job.paymentTerm}</td>
                  {/* <td className="px-3 py-2 text-red-500 font-semibold">{job.startDate}</td> */}

                  <td className="px-3 py-2 text-center">
                    <div className="flex items-center justify-center gap-3">

                      <button title="View" className="flex flex-col items-center"
                        onClick={() => {
                          setLoadingBtn(`view-${job.jobId}`);
                          router.push(`/dashboard/jobs/ni_job_list/view/${job.jobId}`);
                        }}>
                        {loadingBtn === `view-${job.jobId}` ? (
                          <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                        ) : (
                          <Eye className="w-4 h-4 text-blue-500" />
                        )}
                        <span className="text-[10px] text-gray-600">View</span>
                      </button>

                      <button title="Invoice" className="flex flex-col items-center"
                        onClick={() => {
                          setLoadingBtn(`invoice-${job.jobId}`);
                          // router.push(`/dashboard/jobs/ni_job_list/invoice/${job.jobId}`);
                          router.push(`/dashboard/jobs/ni-invoice/${job.jobId}`);
                        }}>
                        {loadingBtn === `invoice-${job.jobId}` ? (
                          <Loader2 className="w-4 h-4 text-green-500 animate-spin" />
                        ) : (
                          <FileText className="w-4 h-4 text-green-500" />
                        )}
                        <span className="text-[10px] text-gray-600">Invoice</span>
                      </button>

                      <button title="Hand Over" className="flex flex-col items-center"
                        onClick={() => {
                          setLoadingBtn(`handover-${job.jobId}`);
                          router.push(`/dashboard/jobs/ni_job_list/handover/${job.jobId}`);
                        }}>
                        {loadingBtn === `handover-${job.jobId}` ? (
                          <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4 text-indigo-500" />
                        )}

                        <span className="text-[10px] text-gray-600">Hand Over</span>
                      </button>

                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-2 text-sm">
        <div>
          Showing {Math.min(page * size + 1, totalElements)} to {Math.min((page + 1) * size, totalElements)} of {totalElements} results
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-3 py-1 rounded-lg bg-indigo-100 hover:bg-indigo-200 disabled:opacity-50 transition-colors"
          >
            Prev
          </button>

          {/* Simple pagination UI - Page numbers can be improved if needed, but Prev/Next suffices for basics */}

          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="px-3 py-1 rounded-lg bg-indigo-100 hover:bg-indigo-200 disabled:opacity-50 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
