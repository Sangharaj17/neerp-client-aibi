'use client';

import { useState, useEffect, useCallback } from 'react';
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
  FaThumbsUp,
} from 'react-icons/fa';
import { FiChevronLeft, FiChevronRight, FiSearch } from 'react-icons/fi';
import ActionModal from '../AMC/ActionModal';
import MaterialQuotationPrint from '../Jobs/MaterialQuotationPrint';
import MaterialQuotationDetails from './MaterialQuotationDetails';
import MaterialQuotationEditForm from './MaterialQuotationEditForm';

import toast from 'react-hot-toast';

// Utility to format numbers as currency (simple example)
const formatCurrency = (amount) => {
    if (typeof amount !== 'number') return '-';
    // Using toLocaleString for basic currency formatting (e.g., adds commas)
    return amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// Utility to get the sort icon
const getSortIcon = (field, currentSortBy, currentDirection) => {
  if (currentSortBy !== field)
    return <FaSort className="w-3 h-3 text-gray-400 ml-1" />;
  if (currentDirection === 'asc')
    return <FaSortUp className="w-3 h-3 text-blue-500 ml-1" />;
  return <FaSortDown className="w-3 h-3 text-blue-500 ml-1" />;
};

// Define table headers with new financial columns
const TABLE_HEADERS = [
  { label: 'Quotation No', field: 'quatationNo', sortable: true, className: 'text-left' },
  { label: 'Date', field: 'quatationDate', sortable: true, className: 'text-left' },
  { label: 'Customer', field: 'customerName', sortable: false, className: 'text-left' },
  { label: 'Site', field: 'siteName', sortable: false, className: 'text-left' },
  { label: 'GST %', field: 'gst', sortable: false, className: 'text-center' },
  { label: 'Work Period', field: 'workPeriod', sortable: false, className: 'text-left' },
  
  // --- NEW FINANCIAL COLUMNS ---
  { label: 'Sub Total', field: 'subTotal', sortable: true, className: 'text-right' },
  { label: 'GST Amount', field: 'gstAmount', sortable: true, className: 'text-right' },
  { label: 'Grand Total', field: 'grandTotal', sortable: true, className: 'text-right' },
  // -----------------------------
  
  { label: 'Final', field: 'isFinal', sortable: false, className: 'text-center' },
  { label: 'Final Date', field: 'quotFinalDate', sortable: false, className: 'text-center' },
  { label: 'Actions', field: 'actions', sortable: false, className: 'text-center' },
];

const MaterialQuotationList = () => {
  const [quotations, setQuotations] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0); 
  const [sortBy, setSortBy] = useState('modQuotId');
  const [direction, setDirection] = useState('desc');
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuotationId, setSelectedQuotationId] = useState(null);
  const [selectedQuotationData, setSelectedQuotationData] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  
  // Calculate the total number of columns for colSpan
  const TOTAL_COLUMNS = TABLE_HEADERS.length + 1; // +1 for the leading '#' column


  const fetchQuotations = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(
        '/api/amc/material-quotation/getAll',
        { params: { search, page, size, sortBy, direction } }
      );
      setQuotations(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
      setTotalElements(res.data.totalElements || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [page, size, sortBy, direction, search]);

  useEffect(() => {
    fetchQuotations();
  }, [fetchQuotations]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setDirection(direction === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setDirection('asc');
    }
  };

  const handleView = (id) => {
    // 1. Find the quotation from our current state list
    const quotation = quotations.find((q) => q.modQuotId === id);
    
    if (quotation) {
      setModalMode('view');
      setSelectedQuotationId(id);
      setSelectedQuotationData(quotation); // Pass the existing data directly
      setIsModalOpen(true);
    }
  };

  const handleEdit = (id) => {
  // Find the quotation object from the list we already fetched
  const quotation = quotations.find((q) => q.modQuotId === id);
  
  if (quotation) {
    setModalMode('edit');
    setSelectedQuotationId(id);
    setSelectedQuotationData(quotation); // This contains details and workPeriods
    setIsModalOpen(true);
  }
};

  const handleGenerateInvoice = async (id) => {
    try {
      setModalLoading(true);
      setIsModalOpen(true);
      setModalMode('print');
      setSelectedQuotationId(id);
      const res = await axiosInstance.get(`/api/amc/material-quotation/getMaterialRepairQuatationPdfData/${id}`);
      setSelectedQuotationData(res.data);
    } catch (error) {
        console.error("Error fetching quotation data for PDF:", error);
    } finally {
      setModalLoading(false);
    }
  };

  const handleGeneratePdf = async (id) => {
    try {
     
    } catch (error) {
        console.error("Error fetching quotation data for PDF:", error);
    } finally {
      setModalLoading(false);
    }
  };

  const toggleIsFinal = async (id, isFinal) => {
  try {
    alert("Marking as Final is irreversible. Proceed?"+isFinal);
    await axiosInstance.patch(
      `/api/amc/material-quotation/updateIsFinal/${id}`,
      null, // no request body
      {
        params: {
          isFinal: isFinal, // toggle boolean
        },
      }
    );

    fetchQuotations();
  } catch (error) {
    console.error("Error toggling final status:", error);
  }
};


  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedQuotationData(null);
    setSelectedQuotationId(null);
    setModalMode('view');
  };

  // Calculate entries range
  const currentEntriesStart = totalElements > 0 ? page * size + 1 : 0;
  const currentEntriesEnd = Math.min(
    (page + 1) * size,
    page * size + quotations.length
  );
  
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0); // Reset to first page on search
  };

  const handleDelete = async (id) => {
  // // Simple confirmation before deleting
  // if (!confirm("Are you sure you want to delete this quotation? This action cannot be undone.")) {
  //   return;
  // }

  try {
    await axiosInstance.delete(`/api/amc/material-quotation/delete/${id}`);
    
    // Show success toast
    toast.success("Quotation deleted successfully");
    
    // Refresh the list to reflect changes
    fetchQuotations(); 
  } catch (error) {
    console.error("Delete error:", error);
    toast.error("Failed to delete quotation. It might be linked to other records.");
  }
};


  return (
    <div className="p-4 pt-10 bg-white shadow-xl rounded-xl border border-gray-100 max-w-full mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3">
        <h2 className="text-xl font-bold text-gray-800">
          📋 Material Quotations
        </h2>

        <div className="relative w-full md:w-64">
          <FiSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={handleSearchChange}
            placeholder="Search Quotation No, Customer, Site..."
            className="pl-8 pr-3 py-1.5 w-full border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full text-xs text-gray-700 divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 py-2 text-center font-semibold">#</th>
              {TABLE_HEADERS.map(({ label, field, sortable, className }) => (
                <th
                  key={field}
                  onClick={sortable ? () => handleSort(field) : undefined}
                  className={`px-2 py-2 font-semibold whitespace-nowrap ${className} ${sortable ? 'cursor-pointer hover:bg-gray-100 transition' : ''}`}
                >
                  <div className={`flex items-center ${className === 'text-right' ? 'justify-end' : 'justify-start'}`}>
                    {label}
                    {sortable && getSortIcon(field, sortBy, direction)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={TOTAL_COLUMNS} className="text-center py-8 text-blue-500">
                  <div className="flex items-center justify-center space-x-2">
                     <svg className="animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Loading Quotations...</span>
                  </div>
                </td>
              </tr>
            ) : quotations.length > 0 ? (
              quotations.map((q, i) => (
                <tr key={q.modQuotId} className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition-colors">
                  <td className="px-2 py-2 text-center">{page * size + i + 1}</td>
                  <td className="px-2 py-2 font-medium whitespace-nowrap text-left">{q.quatationNo}</td>
                  <td className="px-2 py-2 whitespace-nowrap text-left">{q.quatationDate || '-'}</td>
                  <td className="px-2 py-2 text-left">{q.customerName}</td>
                  <td className="px-2 py-2 text-left">{q.siteName}</td>
                  <td className="px-2 py-2 text-center">{q.gst ? `${q.gst}%` : '-'}</td>
                  <td className="px-2 py-2 text-left">{q.workPeriod || '-'}</td>
                  
                  {/* --- NEW FINANCIAL DATA --- */}
                  <td className="px-2 py-2 text-right font-medium whitespace-nowrap">
                    {formatCurrency(q.subTotal)}
                  </td>
                  <td className="px-2 py-2 text-right whitespace-nowrap">
                    {formatCurrency(q.gstAmount)}
                  </td>
                  <td className="px-2 py-2 text-right font-bold text-gray-900 whitespace-nowrap">
                    {formatCurrency(q.grandTotal)}
                  </td>
                  {/* ---------------------------- */}

                  {/* Final Status Toggle */}
                  <td className="px-2 py-2 text-center">
                  <button
  onClick={() => {
    if (q.isFinal === 0) {
      toggleIsFinal(q.modQuotId, true);
    }
  }}
  title={q.isFinal === 0 ? 'Mark as Final' : 'Already Final'}
  disabled={q.isFinal === 1}
  className={`p-1 rounded-full text-sm transition-colors duration-200 ${
    q.isFinal === 1
      ? 'bg-green-100 text-green-600 cursor-not-allowed'
      : 'bg-gray-100 text-gray-400 hover:bg-gray-200 cursor-pointer'
  }`}
>
  <FaThumbsUp className="w-3 h-3" />
</button>

                  </td>

                  <td className="px-2 py-2 text-center whitespace-nowrap">{q.quotFinalDate || '-'}</td>

                  {/* Actions */}
                  <td className="px-2 py-2 text-center">
                    <div className="flex justify-center gap-1.5 text-base">
                      {/* View */}
                      <button
                        title="View Details"
                        onClick={() => handleView(q.modQuotId)}
                        className="p-1 rounded hover:bg-blue-100 transition-colors"
                      >
                        <FaEye className="text-blue-500 w-4 h-4" />
                      </button>
                      {/* Generate PDF */}
                      <button
                        title="Generate PDF"
                        onClick={() => handleGeneratePdf(q.modQuotId)}
                        className="p-1 rounded hover:bg-orange-100 transition-colors"
                      >
                        <FaFilePdf className="text-orange-500 w-4 h-4" />
                      </button>
                     {/* Edit */}
<button
  onClick={() => {
    if (q.isFinal === 0) {
      handleEdit(q.modQuotId);
    }
  }}
  title={
    q.isFinal === 1
      ? 'This quotation is finalized and cannot be edited.'
      : 'Edit Quotation'
  }
  disabled={q.isFinal === 1}
  className={`p-1 rounded transition-colors ${
    q.isFinal === 1
      ? 'cursor-not-allowed bg-gray-100'
      : 'hover:bg-green-100'
  }`}
>
  <FaEdit
    className={`w-4 h-4 ${
      q.isFinal === 1 ? 'text-gray-400' : 'text-green-500'
    }`}
  />
</button>

{/* Delete */}
<button
  onClick={() => {
    if (q.isFinal === 0) {
      handleDelete(q.modQuotId);
    }
  }}
  title={
    q.isFinal === 1
      ? 'This quotation is finalized and cannot be deleted.'
      : 'Delete Quotation'
  }
  disabled={q.isFinal === 1}
  className={`p-1 rounded transition-colors ${
    q.isFinal === 1
      ? 'cursor-not-allowed bg-gray-100'
      : 'hover:bg-red-100'
  }`}
>
  <FaTrash
    className={`w-4 h-4 ${
      q.isFinal === 1 ? 'text-gray-400' : 'text-red-500'
    }`}
  />
</button>

                      {/* Invoice/Email - Placeholder actions */}
                      <button
                        title="Generate Invoice"
                        className="p-1 rounded hover:bg-indigo-100 transition-colors"
                         onClick={() => handleGenerateInvoice(q.modQuotId)}
                      >
                        <FaFileInvoice className="text-indigo-500 w-4 h-4" />
                      </button>
                      <button
                        title="Email Quotation"
                        className="p-1 rounded hover:bg-purple-100 transition-colors"
                      >
                        <FaEnvelope className="text-purple-500 w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={TOTAL_COLUMNS} className="text-center py-6 text-gray-500">
                  No material quotations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-xs space-y-2 sm:space-y-0">
        <span className="text-gray-600">
          Showing **{currentEntriesStart} - {currentEntriesEnd}** of **{totalElements}** results
        </span>

        <div className="flex items-center gap-4">
          {/* Size Selector */}
          <div className="flex items-center gap-2">
             <label htmlFor="pageSize" className="text-gray-600">Per page:</label>
             <select
               id="pageSize"
               value={size}
               onChange={(e) => {
                 setSize(+e.target.value);
                 setPage(0);
               }}
               className="border border-gray-300 rounded px-2 py-1 text-xs focus:ring-blue-500 focus:border-blue-500"
             >
               {[5, 10, 20, 50].map((s) => (
                 <option key={s} value={s}>{s}</option>
               ))}
             </select>
          </div>
          
          <div className="flex items-center gap-2">
             {/* Previous Button */}
             <button
               disabled={page === 0}
               onClick={() => setPage(page - 1)}
               title="Previous Page"
               className="p-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
             >
               <FiChevronLeft className="w-4 h-4" />
             </button>

             <span className="font-semibold text-gray-800">
               {totalPages > 0 ? `${page + 1} / ${totalPages}` : '0 / 0'}
             </span>

             {/* Next Button */}
             <button
               disabled={page + 1 >= totalPages || totalPages === 0}
               onClick={() => setPage(page + 1)}
               title="Next Page"
               className="p-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
             >
               <FiChevronRight className="w-4 h-4" />
             </button>
          </div>
        </div>
      </div>

      <ActionModal
  isOpen={isModalOpen}
  onCancel={closeModal}
  // Dynamically set title based on the current mode
  title={
    modalMode === 'view' ? '🔍 Quotation Details' : 
    modalMode === 'edit' ? '✏️ Edit Material Quotation' : 
    '🖨️ Preview Quotation'
  }
>
  {/* VIEW MODE: Simple display of data */}
  {modalMode === 'view' && selectedQuotationData && (
    <MaterialQuotationDetails quotation={selectedQuotationData} />
  )}

  {/* EDIT MODE: Form with inputs to change data */}
  {modalMode === 'edit' && selectedQuotationData && (
    <MaterialQuotationEditForm 
      quotationData={selectedQuotationData} 
      onClose={closeModal} 
      onRefresh={fetchQuotations} // Passing refresh function to update list after save
    />
  )}

  {/* PRINT MODE: PDF Preview */}
  {modalMode === 'print' && selectedQuotationData && (
    <MaterialQuotationPrint
      quotationId={selectedQuotationId}
      onCancel={closeModal}
      quotationData={selectedQuotationData}
    />
  )}
</ActionModal>


    </div>
  );
};

export default MaterialQuotationList;