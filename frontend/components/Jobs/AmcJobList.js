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

// Base API endpoints
const AMC_JOBS_API = '/api/amc-jobs/getAllJobs';
const AMC_RENEWAL_JOBS_API = '/api/amc-renewal-jobs/getAllRenewalJobs';

export default function AmcJobList({isAmcJobRenewal}) {
  const router = useRouter();

 /// alert(isAmcJobRenewal);
  // State for active tab
// State for active tab
  const [activeTab, setActiveTab] = useState(
    isAmcJobRenewal === false || isAmcJobRenewal === 'false' ? 
    'amcJobs' : 
    'amcRenewalJobs'
  ); 
  // --- Common Paging/Search State for BOTH Lists ---
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  // --- AMC Jobs List State ---
  const [amcJobs, setAmcJobs] = useState([]);
  const [amcSortBy, setAmcSortBy] = useState('jobId');
  const [amcDirection, setAmcDirection] = useState('desc');

  // --- AMC Renewal Jobs List State ---
  const [renewalJobs, setRenewalJobs] = useState([]);
  const [renewalSortBy, setRenewalSortBy] = useState('renewalJobId');
  const [renewalDirection, setRenewalDirection] = useState('desc');

  // --- Common Loading/Error State ---
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

    const [loadingBtn, setLoadingBtn] = useState(null);


  /**
   * Fetches the appropriate job list based on the active tab and current state.
   */
  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    let textSearch = search;
    let dateSearch = "";

    if (dateRegex.test(search)) {
      dateSearch = search;
      textSearch = "";
    }

    let url;
    let sortByField;
    let directionField;

    if (activeTab === 'amcJobs') {
      url = AMC_JOBS_API;
      sortByField = amcSortBy;
      directionField = amcDirection;
    } else { // 'amcRenewalJobs'
      url = AMC_RENEWAL_JOBS_API;
      sortByField = renewalSortBy;
      directionField = renewalDirection;
    }

    const params = {
      search: textSearch,
      page,
      size,
      sortBy: sortByField,
      direction: directionField,
    };

    if (dateSearch) {
      params.dateSearch = dateSearch;
    }

    try {
      const res = await axiosInstance.get(url, { params });

      if (activeTab === 'amcJobs') {
        setAmcJobs(res.data.content || []);
      } else {
        setRenewalJobs(res.data.content || []);
      }
      setTotalPages(res.data.totalPages || 0);

    } catch (err) {
      console.error(`Error fetching ${activeTab}:`, err);
      setError(`Failed to load ${activeTab === 'amcJobs' ? 'AMC Jobs' : 'AMC Renewal Jobs'}`);
    } finally {
      setLoading(false);
    }
  }, [activeTab, search, page, size, amcSortBy, amcDirection, renewalSortBy, renewalDirection]);

  // useEffect to trigger data fetch when dependencies change
  useEffect(() => {
    // Reset page to 0 when search, size, sort field, or tab changes
    if (page !== 0) {
      setPage(0);
      return; // Let the page change trigger the fetch
    }
    fetchJobs();
  }, [search, size, amcSortBy, amcDirection, renewalSortBy, renewalDirection, activeTab, page, fetchJobs]);

  /**
   * Handles sorting logic for the active table.
   */
  const handleSort = (field) => {
    if (activeTab === 'amcJobs') {
      if (amcSortBy === field) {
        setAmcDirection(amcDirection === 'asc' ? 'desc' : 'asc');
      } else {
        setAmcSortBy(field);
        setAmcDirection('asc');
      }
    } else { // 'amcRenewalJobs'
      if (renewalSortBy === field) {
        setRenewalDirection(renewalDirection === 'asc' ? 'desc' : 'asc');
      } else {
        setRenewalSortBy(field);
        setRenewalDirection('asc');
      }
    }
    setPage(0); // Reset to first page on sort change
  };

  /**
   * Changes the active tab and resets state for the new list.
   */
  const handleTabChange = (tab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setSearch(''); // Clear search on tab switch
    setPage(0); // Reset pagination on tab switch
    setTotalPages(0); // Clear total pages
    setError(null); // Clear any previous error
  };

  // Determine current list data and sort state based on active tab
  const currentJobs = activeTab === 'amcJobs' ? amcJobs : renewalJobs;
  const currentSortBy = activeTab === 'amcJobs' ? amcSortBy : renewalSortBy;
  const currentDirection = activeTab === 'amcJobs' ? amcDirection : renewalDirection;

  // Determine the key for the ID field (jobId or renewalJobId)
  const idKey = activeTab === 'amcJobs' ? 'jobId' : 'renewalJobId';

  // Columns definition (same for both lists)
  const columns = [
    { key: 'sr.no', label: 'Sr No' },
    { key: 'jobType', label: 'Job Type' },
    { key: 'customerName', label: 'Customer' },
    { key: 'siteName', label: 'Site Name' },
    { key: 'siteAddress', label: 'Address' },
    { key: 'place', label: 'Place' },
    { key: 'serviceEngineers', label: 'Engineers' },
    { key: 'jobAmount', label: 'Amount' },
    { key: 'paymentTerm', label: 'Payment Term' },
    { key: 'startDate', label: 'Start Date' },
    { key: 'endDate', label: 'End Date' },
    { key: 'jobStatus', label: 'Status' },
    { key: 'actions', label: 'Actions' }, // Combined column
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-500';
      case 'WIP':
        return 'bg-blue-500';
      case 'Hold':
      case 'Renewed': // Assuming 'Renewed' could be a renewal status
        return 'bg-yellow-500';
      case 'Pre Service':
        return 'bg-indigo-500';
      case 'Option':
        return 'bg-gray-500';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <div className="p-4 bg-gray-10 min-h-screen">
   <div className="flex justify-between items-end mb-4 border-b border-gray-300">
    {/* Left-aligned Tabs */}
    <div className="flex gap-4">
        {/* AMC Jobs List Tab */}
        <button
            onClick={() => handleTabChange('amcJobs')}
            className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors ${
                activeTab === 'amcJobs'
                    ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white'
                    : 'text-gray-600 hover:text-indigo-600'
            }`}
        >
            AMC Jobs List
        </button>

        {/* AMC Renewal Jobs List Tab */}
        <button
            onClick={() => handleTabChange('amcRenewalJobs')}
            className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors ${
                activeTab === 'amcRenewalJobs'
                    ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white'
                    : 'text-gray-600 hover:text-indigo-600'
            }`}
        >
            AMC Renewal Jobs List
        </button>
    </div>

    {/* Buttons pushed to the far right */}
    <div className="flex gap-4 mb-1">
        {/* Employee Job Task Details Button (Treated as a secondary filter/action) */}
        <button
            onClick={() => {
              router.push('/dashboard/jobs/amc-jobs-activity-emp-report');
            }}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'employeeJobTaskDetails'
                    ? 'bg-slate-700 text-white shadow' // Active state
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300' // Inactive state
            }`}
        >
            Employee Job Task Details
        </button>

        {/* Export to Excel Button (Key action, using a common 'Success/Export' green color) */}
        <button
            onClick={() => handleTabChange('exportToExcel')} // You'll need to define this function
            className="px-3 py-1 text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow"
        >
            Export to Excel
        </button>
    </div>
</div>
{/* End Tabs */}

      {/* Search & Page Size */}
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
          onChange={(e) => setSize(parseInt(e.target.value))}
          className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
        >
          {[10, 25, 50, 100].map((s) => (
            <option key={s} value={s}>
              {s} per page
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-indigo-100 text-gray-700 uppercase text-xs font-semibold">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="px-3 py-2 text-left cursor-pointer hover:bg-indigo-200 transition-colors whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {currentSortBy === col.key && (
                      <span>{currentDirection === 'asc' ? '▲' : '▼'}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-6 text-gray-400">
                  Loading {activeTab === 'amcJobs' ? 'AMC Jobs' : 'Renewal Jobs'}...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-6 text-red-500">
                  {error}
                </td>
              </tr>
            ) : currentJobs.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-6 text-gray-400">
                  No {activeTab === 'amcJobs' ? 'AMC Jobs' : 'Renewal Jobs'} found
                </td>
              </tr>
            ) : (
              currentJobs.map((job, index) => (
                <tr key={job[idKey]} className="hover:bg-gray-50 transition-colors">
                  {/* Sr No */}
                  <td className="px-3 py-2">{page * size + index + 1}</td>
                  {/* Data Cells */}
                  <td className="px-3 py-2">{job.jobType || '-'}</td>
                  <td className="px-3 py-2 font-medium">{job.customerName}</td>
                  <td className="px-3 py-2">{job.siteName}</td>
                  <td className="px-3 py-2">{job.siteAddress || '-'}</td>
                  <td className="px-3 py-2">{job.place || '-'}</td>
                  <td className="px-3 py-2 text-center">
                    {job.serviceEngineers && job.serviceEngineers.length > 0 ? (
                      <span
                        title={job.serviceEngineers.join(', ')}
                        className="text-gray-600 hover:text-indigo-600 cursor-pointer"
                      >
                        <User className="w-4 h-4 inline" />
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-3 py-2">₹{job.jobAmount}</td>
                  <td className="px-3 py-2">{job.paymentTerm}</td>
                  <td className="px-3 py-2 text-red-500 font-semibold">{job.startDate}</td>
                  <td className="px-3 py-2 text-red-500 font-semibold">{job.endDate || '-'}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-white text-xs font-semibold ${getStatusColor(
                        job.jobStatus
                      )}`}
                    >
                      {job.jobStatus}
                    </span>
                  </td>

                  {/* Combined Actions */}
                  <td className="px-3 py-2 text-center">
                    <div className="flex items-center justify-center gap-3">
                      {/* View Button */}
                      <button
                        onClick={() => {
                          const id = job[idKey];
                            setLoadingBtn(`view-${id}`);
                          const path = activeTab === 'amcJobs'
                            ? `/dashboard/jobs/amc_job_list/view_amc_job_detail/${id}`
                            : `/dashboard/jobs/amc_job_list/view_amc_renewal_job_detail/${id}`; // Adjust path for renewal job detail if needed
                          router.push(path);
                        }}
                        title="View"
                      >
                        
{loadingBtn === `view-${job[idKey]}` ? 
<Loader2 className="w-4 h-4 animate-spin text-orange-500" /> : <Eye className="w-4 h-4 text-blue-500" />}

                      </button>

                      
                      {/* Invoice Button */}
                      <button title="Invoice">
                        <FileText className="w-4 h-4 text-green-500" />
                      </button>
                      {/* Delete Button */}
                      <button title="Delete Job">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                      {/* Edit Button */}
                      <button title="Edit AMC Start/End Date">
                        <Pencil className="w-4 h-4 text-yellow-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-2 text-sm">
        <div>
          Page {page + 1} of {totalPages}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-3 py-1 rounded-lg bg-indigo-100 hover:bg-indigo-200 disabled:opacity-50 transition-colors"
          >
            Prev
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1 || totalPages === 0}
            className="px-3 py-1 rounded-lg bg-indigo-100 hover:bg-indigo-200 disabled:opacity-50 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}