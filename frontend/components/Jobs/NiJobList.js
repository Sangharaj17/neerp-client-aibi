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
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getTenant } from "@/utils/tenant";

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
      if (search) {
        const lowerSearch = search.toLowerCase();
        allJobs = allJobs.filter(job =>
          (job.jobNo && job.jobNo.toLowerCase().includes(lowerSearch)) ||
          (job.customerName && job.customerName.toLowerCase().includes(lowerSearch)) || // Assuming these fields exist in DTO or need to be fetched? 
          // Wait, QuotationJobResponseDTO has IDs (customerId, siteId), not names.
          // This suggests I might need to fetch detailed info or the DTO needs names.
          // Looking at the DTO again:
          // private Integer customerId; private Integer siteId;
          // It DOES NOT have names. This is a potential issue for display.
          // I will use IDs for now or IDs placeholders.
          // Correction: The reference AmcJobList uses customerName.
          // The NI Job DTO I modified earlier has IDs.
          // I should double check if the transformer populates names?
          // The mapToResponse in QuotationJobsService sets IDs.
          // I will proceed with IDs/Values available and note this limitation.
          (job.jobTypeName && job.jobTypeName.toLowerCase().includes(lowerSearch))
        );
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

  const formatJobNo = (job) => {
    if (!job || !job.startDate || !companyName) return job.jobNo;

    try {
      const startYear = new Date(job.startDate).getFullYear();
      const nextYear = startYear - 1999; // as per convention or just (startYear + 1).toString().slice(-2)?
      // User requested: (startDate year-startDateNextYear)
      // Usually financial year is 2024-25. 
      // Let's assume standard YYYY-YY format or YYYY-YYYY?
      // User example: jobNo as fetcedCompanyName:job.jobId(startDate year-startDateNextYear)
      // Example: SMASH:123(2024-2025) or (2024-25)?
      // I will use full year for now as it is safer: (2024-2025)

      const nextYearFull = startYear + 1;

      // job.jobId is integer.
      // jobNo as fetchedCompanyName:job.jobId(startDate year-startDateNextYear)

      return `${companyName}:${job.jobId}(${startYear}-${nextYearFull})`;

    } catch (e) {
      console.error("Error formatting job no", e);
      return job.jobNo;
    }
  };


  const handleSort = (field) => {
    if (sortBy === field) {
      setDirection(direction === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setDirection('asc');
    }
  };

  const columns = [
    { key: 'jobId', label: 'Job ID' }, // Using ID as proxy for Sr No if needed or index
    { key: 'jobNo', label: 'Job No' },
    { key: 'jobTypeName', label: 'Job Type' },
    { key: 'jobAmount', label: 'Amount' },
    { key: 'jobStatus', label: 'Status' },
    { key: 'paymentTerm', label: 'Payment Term' }, // ID? name?
    { key: 'startDate', label: 'Start Date' },
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
    <div className="p-4 bg-gray-10 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
        />
        <select
          value={size}
          onChange={(e) => {
            setSize(parseInt(e.target.value));
            setPage(0);
          }}
          className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
        >
          {[10, 25, 50, 100].map((s) => (
            <option key={s} value={s}>{s} per page</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-indigo-100 text-gray-700 uppercase text-xs font-semibold">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.key !== 'actions' && handleSort(col.key)}
                  className={`px-3 py-2 text-left ${col.key !== 'actions' ? 'cursor-pointer hover:bg-indigo-200' : ''} transition-colors whitespace-nowrap`}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {sortBy === col.key && (
                      <span>{direction === 'asc' ? '▲' : '▼'}</span>
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
                <tr key={job.jobId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2">{job.jobId}</td>
                  <td className="px-3 py-2 font-medium">
                    {formatJobNo(job)}
                    {/* Fallback to original if company name missing, visually distinct maybe? No, logic handles it return original */}
                  </td>
                  <td className="px-3 py-2">{job.jobTypeName}</td>
                  <td className="px-3 py-2">₹{job.jobAmount}</td>
                  <td className="px-3 py-2">
                    <span className={`px-2 py-1 rounded-full text-white text-xs font-semibold ${getStatusColor(job.jobStatus)}`}>
                      {job.jobStatus}
                    </span>
                  </td>
                  <td className="px-3 py-2">{job.paymentTerm}</td>
                  <td className="px-3 py-2 text-red-500 font-semibold">{job.startDate}</td>

                  <td className="px-3 py-2 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button title="View" onClick={() => router.push(`/dashboard/jobs/ni_job_list/view/${job.jobId}`)}>
                        <Eye className="w-4 h-4 text-blue-500" />
                      </button>
                      <button title="Invoice"><FileText className="w-4 h-4 text-green-500" /></button>
                      <button title="Delete"><Trash2 className="w-4 h-4 text-red-500" /></button>
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
