'use client';

import { useState, useEffect } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaFilePdf,
  FaEnvelope,
  FaFileInvoice,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaThumbsUp, // Import the Thumbs Up icon
} from 'react-icons/fa';
import { FiChevronLeft, FiChevronRight, FiSearch } from 'react-icons/fi';
import ActionModal from '../AMC/ActionModal';
import MaterialQuotationPrint from '../Jobs/MaterialQuotationPrint';

// Helper function to render the correct sort icon
const getSortIcon = (field, currentSortBy, currentDirection) => {
  if (currentSortBy !== field) return <FaSort className="w-3 h-3 text-gray-400 ml-1" />;
  if (currentDirection === 'asc') return <FaSortUp className="w-3 h-3 text-blue-500 ml-1" />;
  return <FaSortDown className="w-3 h-3 text-blue-500 ml-1" />;
};

const MaterialQuotationList = () => {
  const [quotations, setQuotations] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState('modQuotId');
  const [direction, setDirection] = useState('desc');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchQuotations();
  }, [page, size, sortBy, direction, search]);

  const fetchQuotations = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/api/amc/material-quotation/getAll', {
        params: { search, page, size, sortBy, direction },
      });
      setQuotations(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (error) {
      console.error('Error fetching Material Quotations:', error);
      // Optional: Add a toast notification or user-friendly error message here
    } finally {
      setLoading(false);
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

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0); // Reset to first page on new search
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  const handleSizeChange = (e) => {
    setSize(parseInt(e.target.value));
    setPage(0); // Reset to first page on size change
  };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);


    const closeModal = () => {
    setIsModalOpen(false);
    setSelectedInvoiceId(null);
    };

  const handleGeneratePdf = (quotationId) => {
    setSelectedInvoiceId(quotationId);
    setIsModalOpen(true);
    };

  // Function to toggle isFinal status (placeholder for actual API call)
  const toggleIsFinal = async (quotationId, currentIsFinal) => {
    // In a real application, you would make an API call here to update the backend
    console.log(`Toggling isFinal for quotation ${quotationId} from ${currentIsFinal} to ${1 - currentIsFinal}`);
    // Example:
    // try {
    //   await axiosInstance.put(`/api/amc/material-quotation/toggleIsFinal/${quotationId}`, { isFinal: 1 - currentIsFinal });
    //   fetchQuotations(); // Refresh the list after update
    // } catch (error) {
    //   console.error('Error toggling isFinal:', error);
    // }

    // For demonstration, we'll just update the local state for a visual effect
    setQuotations(prevQuotations =>
      prevQuotations.map(q =>
        q.modQuotId === quotationId ? { ...q, isFinal: 1 - currentIsFinal } : q
      )
    );
  };


  const currentEntriesStart = page * size + 1;
  const currentEntriesEnd = Math.min((page + 1) * size, page * size + quotations.length);
  // Assuming totalElements is available from the API response for accurate count
  const totalItems = totalPages * size; 

  return (
    <div className="p-4 sm:p-8 bg-white shadow-xl rounded-2xl border border-gray-100 max-w-full mx-auto">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Material Quotations 📄
          </h2>
          <p className="text-gray-500 mt-1">Manage and track all material quotations easily.</p>
        </div>

        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by customer or site..."
            value={search}
            onChange={handleSearchChange}
            className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-xl text-sm 
                        focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-lg">
        <table className="min-w-full text-sm text-gray-700 divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-center font-bold text-gray-600 uppercase tracking-wider">#</th>
              {/* Sortable Headers */}
              {[
                { label: 'Quotation No', field: 'quatationNo' },
                { label: 'Date', field: 'quatationDate' },
              ].map(({ label, field }) => (
                <th
                  key={field}
                  className="p-4 text-left font-bold text-gray-600 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap"
                  onClick={() => handleSort(field)}
                >
                  <div className="flex items-center">
                    {label}
                    {getSortIcon(field, sortBy, direction)}
                  </div>
                </th>
              ))}
              {/* Non-Sortable Headers */}
              {[
                'Customer',
                'Site',
                'GST',
                'Work Period',
                'HSN/SAC',
                'Final Status', // Changed from 'Is Final'
                'Final Date',
                'Actions',
              ].map((header) => (
                <th
                  key={header}
                  className={`p-4 font-bold text-gray-600 uppercase tracking-wider ${
                    header === 'Actions' || header === 'GST' || header === 'Final Status'
                      ? 'text-center'
                      : 'text-left'
                  }`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="11" className="text-center py-10 text-lg text-blue-500 font-medium">
                  <div className="flex justify-center items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading Quotations...
                  </div>
                </td>
              </tr>
            ) : quotations.length > 0 ? (
              quotations.map((q, index) => (
                <tr
                  key={q.modQuotId}
                  className="hover:bg-blue-50 transition-colors duration-150 group"
                >
                  <td className="p-4 text-center font-medium text-gray-600">
                    {page * size + index + 1}
                  </td>
                  <td className="p-4 font-semibold text-gray-900 whitespace-nowrap">
                    {q.quatationNo}
                  </td>
                  <td className="p-4 text-gray-500 whitespace-nowrap">
                    {q.quatationDate || 'N/A'}
                  </td>
                  <td className="p-4 font-medium text-gray-700">{q.customerName || 'N/A'}</td>
                  <td className="p-4 text-gray-600">{q.siteName || 'N/A'}</td>
                  <td className="p-4 text-center font-mono">{q.gst}%</td>
                  <td className="p-4 text-gray-600 whitespace-nowrap">{q.workPeriod || 'N/A'}</td>
                  <td className="p-4 font-mono text-gray-600">{q.hsnCode || 'N/A'}</td>
                  {/* Final Status with ThumbsUp button */}
                  <td className="p-4 text-center">
                    <button
                      onClick={() => toggleIsFinal(q.modQuotId, q.isFinal)}
                      className={`
                        p-2 rounded-full text-lg 
                        ${q.isFinal === 1 
                            ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'
                        }
                        transition duration-200 ease-in-out transform hover:scale-110
                        focus:outline-none focus:ring-2 focus:ring-offset-2 
                        ${q.isFinal === 1 ? 'focus:ring-green-500' : 'focus:ring-gray-400'}
                      `}
                      title={q.isFinal === 1 ? 'Quotation is Final' : 'Mark as Final'}
                    >
                      <FaThumbsUp />
                    </button>
                  </td>
                  <td className="p-4 text-center text-gray-500 whitespace-nowrap">
                    {q.quotFinalDate || '-'}
                  </td>
                  <td className="p-4 text-center whitespace-nowrap">
                    <div className="flex justify-center space-x-3 text-lg">
                      <button
                        className="p-1 rounded-full text-blue-500 hover:bg-blue-100 transition duration-150"
                        title="View Details"
                        // onClick={() => handleView(q.modQuotId)}
                      >
                        <FaEye />
                      </button>
                      <button
                        className="p-1 rounded-full text-green-500 hover:bg-green-100 transition duration-150"
                        title="Edit Quotation"
                        // onClick={() => handleEdit(q.modQuotId)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="p-1 rounded-full text-red-500 hover:bg-red-100 transition duration-150"
                        title="Delete Quotation"
                        // onClick={() => handleDelete(q.modQuotId)}
                      >
                        <FaTrash />
                      </button>
                      <button
                        className="p-1 rounded-full text-orange-500 hover:bg-orange-100 transition duration-150"
                        title="Generate PDF"
                         onClick={() => handleGeneratePdf(q.modQuotId)}
                      >
                        <FaFilePdf />
                      </button>
                      <button
                        className="p-1 rounded-full text-indigo-500 hover:bg-indigo-100 transition duration-150"
                        title="Generate Invoice"
                        // onClick={() => handleGenerateInvoice(q.modQuotId)}
                      >
                        <FaFileInvoice />
                      </button>
                      <button
                        className="p-1 rounded-full text-purple-500 hover:bg-purple-100 transition duration-150"
                        title="Email Quotation"
                        // onClick={() => handleEmail(q.modQuotId)}
                      >
                        <FaEnvelope />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="text-center py-10 text-gray-500 text-lg">
                  <div className="flex flex-col items-center">
                    <FaFileInvoice className="w-8 h-8 mb-2 text-gray-400" />
                    No quotations found for your criteria.
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200 gap-3 text-sm text-gray-700">
        {/* Page Info */}
        <div className="font-medium">
          Showing{' '}
          <b className="text-gray-900">{currentEntriesStart}</b> -{' '}
          <b className="text-gray-900">{currentEntriesEnd}</b> of{' '}
          <b className="text-gray-900">{totalItems || 'many'}</b> entries
        </div>

        <div className="flex items-center space-x-4">
          {/* Size Selector */}
          <select
            value={size}
            onChange={handleSizeChange}
            className="border border-gray-300 bg-white px-3 py-1.5 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition cursor-pointer"
          >
            {[5, 10, 20, 50].map((s) => (
              <option key={s} value={s}>
                {s} / page
              </option>
            ))}
          </select>

          {/* Pagination Buttons */}
          <div className="flex items-center space-x-1">
            <button
              disabled={page === 0}
              onClick={() => handlePageChange(page - 1)}
              className="p-2 border border-gray-300 rounded-lg bg-white hover:bg-blue-50 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
            <span className="px-3 py-1.5 font-semibold text-gray-800">
              {page + 1} / {totalPages}
            </span>
            <button
              disabled={page >= totalPages - 1 || totalPages === 0}
              onClick={() => handlePageChange(page + 1)}
              className="p-2 border border-gray-300 rounded-lg bg-white hover:bg-blue-50 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
       <ActionModal 
              isOpen={isModalOpen} 
              onCancel={closeModal} // Closes the modal when clicking outside
            >
              {/* Pass the AMCInvoicePrint component as children */}
              {selectedInvoiceId !== null && (
                <MaterialQuotationPrint quotationId={selectedInvoiceId}  onCancel={closeModal}/>
              )}
              
              {/* Add a close button inside the modal content for better UX (optional) */}
              {/* <div className="flex justify-end pt-4 print:hidden">
                  <button
                      onClick={closeModal}
                      className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                      Close Preview
                  </button>
              </div> */}
            </ActionModal>
    </div>
  );
};

export default MaterialQuotationList;