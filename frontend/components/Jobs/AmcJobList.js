import { useEffect, useState } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import {
  Eye,
  FileText,
  Trash2,
  Pencil,
  User,
} from 'lucide-react';

import { useRouter } from 'next/navigation';

export default function AmcJobList() {

  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sortBy, setSortBy] = useState('jobId');
  const [direction, setDirection] = useState('desc');
  const [totalPages, setTotalPages] = useState(0);

  // const fetchJobs = async () => {
  //   try {
  //     setLoading(true);
  //     const res = await axiosInstance.get('/api/amc-jobs/getAllJobs', {
  //       params: { search, page, size, sortBy, direction },
  //     });
  //     setJobs(res.data.content || []);
  //     setTotalPages(res.data.totalPages || 0);
  //   } catch (err) {
  //     setError('Failed to load AMC Jobs');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchJobs = async () => {
  try {
    setLoading(true);
    setError(null);

    // Regex to detect date in YYYY-MM-DD format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    let textSearch = search; // normal search term
    let dateSearch = "";     // dateSearch param

    if (dateRegex.test(search)) {
      dateSearch = search;
      textSearch = ""; // clear text search if it's a date
    }

    const params = {
      search: textSearch,
      page,
      size,
      sortBy,
      direction,
    };

    if (dateSearch) {
      params.dateSearch = dateSearch; // include only if a date
    }

    const res = await axiosInstance.get('/api/amc-jobs/getAllJobs', { params });

    setJobs(res.data.content || []);
    setTotalPages(res.data.totalPages || 0);
    //setTotalElements(res.data.totalElements || 0);
  } catch (err) {
    console.error('Error fetching AMC Jobs:', err);
    setError('Failed to load AMC Jobs');
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchJobs();
  }, [search, page, size, sortBy, direction]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setDirection(direction === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setDirection('asc');
    }
  };

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
    <div className="p-4 bg-gray-100 min-h-screen">
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
                <td colSpan={columns.length} className="text-center py-6 text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-6 text-red-500">
                  {error}
                </td>
              </tr>
            ) : jobs.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-6 text-gray-400">
                  No jobs found
                </td>
              </tr>
            ) : (
              jobs.map((job, index) => (
                <tr key={job.jobId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2">{index + 1}</td>
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
                 {/* Combined Actions with default colors */}
<td className="px-3 py-2 text-center">
  <div className="flex items-center justify-center gap-3">
    <button  onClick={() => {
        router.push(`/${localStorage.getItem("tenant")}/dashboard/jobs/amc_job_list/view_amc_job_detail?jobId=${job.jobId}`);
    //router.push(`/${tenant}/dashboard/quotations/amc_quatation_list/revise_quatation_list/${qid}`);

      }} title="View">
      <Eye className="w-4 h-4 text-blue-500" />
    </button>
    <button title="Invoice">
      <FileText className="w-4 h-4 text-green-500" />
    </button>
    <button title="Delete Job">
      <Trash2 className="w-4 h-4 text-red-500" />
    </button>
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
