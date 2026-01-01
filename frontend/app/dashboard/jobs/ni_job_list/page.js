"use client";
import { useEffect, useState, useCallback } from 'react';
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
import { formatJobNo } from "@/utils/common";

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
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  // Sorting
  const [sortBy, setSortBy] = useState('jobId');
  const [direction, setDirection] = useState('desc');


  const initialRef = 'COMPANY_SETTINGS_1';


  const matchesSearch = (job, searchText) => {
    if (!searchText) return true;

    const lowerSearch = searchText.toLowerCase();

    // 🔹 Include formatted Job No
    const formattedJobNo = formatJobNo(job, companyName)?.toLowerCase() || "";

    // 🔹 Search formatted job no first
    if (formattedJobNo.includes(lowerSearch)) {
      return true;
    }

    // 🔹 Search remaining raw fields
    return Object.values(job).some(value =>
      value !== null &&
      value !== undefined &&
      String(value).toLowerCase().includes(lowerSearch)
    );
  };



  /**
   * Fetch Jobs
   */
  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Build params similar to AmcJobList (adjust as needed if backend supports searching/pagination)
      // Note: The current QuotationJobsController.getAll() implementation in the provided file 
      // is a simple list return without pagination support in the Controller code I saw.
      // However, to keep the UI consistent, I'll structure the call. 
      // If the backend returns a List, I might need to handle pagination client-side 
      // or assume the backend will be updated to support Pageable.
      // Based on the controller code I viewed: 
      // public ResponseEntity<ApiResponse<List<QuotationJobResponseDTO>>> getAll()
      // It returns a List, NOT a Page. So client-side pagination is safer for now 
      // unless I update the backend. I will implement client-side pagination for now 
      // to match the expected UI behavior if the list is small, or just display all.

      const res = await axiosInstance.get(JOBS_API);

      let allJobs = res.data.data || [];

      // Client-side filtering
      // if (search) {
      //   const lowerSearch = search.toLowerCase();
      //   allJobs = allJobs.filter(job =>
      //     (job.jobNo && job.jobNo.toLowerCase().includes(lowerSearch)) ||
      //     (job.customerName && job.customerName.toLowerCase().includes(lowerSearch)) || // Assuming these fields exist in DTO or need to be fetched? 
      //     // Wait, QuotationJobResponseDTO has IDs (customerId, siteId), not names.
      //     // This suggests I might need to fetch detailed info or the DTO needs names.
      //     // Looking at the DTO again:
      //     // private Integer customerId; private Integer siteId;
      //     // It DOES NOT have names. This is a potential issue for display.
      //     // I will use IDs for now or IDs placeholders.
      //     // Correction: The reference AmcJobList uses customerName.
      //     // The NI Job DTO I modified earlier has IDs.
      //     // I should double check if the transformer populates names?
      //     // The mapToResponse in QuotationJobsService sets IDs.
      //     // I will proceed with IDs/Values available and note this limitation.
      //     (job.jobTypeName && job.jobTypeName.toLowerCase().includes(lowerSearch))
      //   );
      // }

      if (search) {
        allJobs = allJobs.filter(job => matchesSearch(job, search));
      }

      // Client-side Sorting
      allJobs.sort((a, b) => {
        const aVal = a[sortBy] || '';
        const bVal = b[sortBy] || '';
        if (aVal < bVal) return direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return direction === 'asc' ? 1 : -1;
        return 0;
      });

      // Client-side Pagination
      const totalItems = allJobs.length;
      setTotalPages(Math.ceil(totalItems / size));
      const paginatedJobs = allJobs.slice(page * size, (page + 1) * size);

      setJobs(paginatedJobs);

    } catch (err) {
      console.error("Error fetching NI Jobs:", err);
      setError("Failed to load New Installation Jobs");
    } finally {
      setLoading(false);
    }
  }, [search, page, size, sortBy, direction]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

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

  // const formatJobNo = (job) => {
  //   if (!job || !job.startDate || !companyName) return job.jobNo;

  //   try {
  //     const startYear = new Date(job.startDate).getFullYear();
  //     const nextYear = startYear - 1999; // as per convention or just (startYear + 1).toString().slice(-2)?
  //     // User requested: (startDate year-startDateNextYear)
  //     // Usually financial year is 2024-25. 
  //     // Let's assume standard YYYY-YY format or YYYY-YYYY?
  //     // User example: jobNo as fetcedCompanyName:job.jobId(startDate year-startDateNextYear)
  //     // Example: SMASH:123(2024-2025) or (2024-25)?
  //     // I will use full year for now as it is safer: (2024-2025)

  //     const nextYearFull = startYear + 1;

  //     // job.jobId is integer.
  //     // jobNo as fetchedCompanyName:job.jobId(startDate year-startDateNextYear)

  //     return `${companyName}:${job.jobId}(${startYear}-${nextYearFull})`;

  //   } catch (e) {
  //     console.error("Error formatting job no", e);
  //     return job.jobNo;
  //   }
  // };


  const handleSort = (field) => {
    if (sortBy === field) {
      setDirection(direction === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setDirection('asc');
    }
  };

  const handleExportExcel = () => {
    if (!jobs || jobs.length === 0) {
      alert("No job data available to export");
      return;
    }

    // 👉 Prepare export data
    const exportData = jobs.map((job, index) => ({
      "Sr No": index + 1,
      // "Job ID": job.jobId,
      "Job No": formatJobNo(job, companyName),
      "Job Type": job.jobTypeName || "-",
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
    { key: 'siteName', label: 'Site' },
    { key: 'placeName', label: 'Place' },
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



      {/* Container Loader */}
      {/* {loadingBtn && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-lg">
          <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30 flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 text-white animate-spin" />
            <p className="text-white text-sm font-semibold">Loading...</p>
          </div>
        </div>
      )} */}

      <h1 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-2">
        New Installation Job List
      </h1>

      {/* <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-indigo-700 tracking-wide">
          New Installation Job List
        </h1>
      </div> */}

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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

        <table className="min-w-full bg-white text-sm">
          <thead className="bg-indigo-100 text-gray-700 uppercase text-xs font-semibold">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.key !== "actions" && handleSort(col.key)}

                  className={`px-3 py-2 text-center 
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
            ) : jobs.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-6 text-gray-400">No jobs found</td>
              </tr>
            ) : (
              jobs.map((job, index) => (
                <tr key={job.jobId} className="hover:bg-gray-50 transition-colors text-center">
                  <td className="px-3 py-2">{job.jobId}</td>
                  <td className="px-3 py-2 font-medium">
                    {formatJobNo(job, companyName)}
                    {/* Fallback to original if company name missing, visually distinct maybe? No, logic handles it return original */}
                  </td>
                  <td className="px-3 py-2">{job.jobTypeName}</td>
                  <td className="px-3 py-2">{job.siteName}</td>
                  <td className="px-3 py-2">{job.siteAddress}</td>
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
        <div>Page {page + 1} of {totalPages || 1}</div>
        <div className="flex gap-2">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-3 py-1 rounded-lg bg-indigo-100 hover:bg-indigo-200 disabled:opacity-50 transition-colors"
          >
            Prev
          </button>
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
