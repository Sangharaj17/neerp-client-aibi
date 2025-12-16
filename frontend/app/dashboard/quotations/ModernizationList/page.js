'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import { toast } from 'react-hot-toast';
import {
  FaSort, FaSortUp, FaSortDown, FaSearch, FaChevronLeft, FaChevronRight,
  FaEye, FaEdit, FaFilePdf, FaEnvelope, FaReceipt, FaThumbsUp, FaThumbsDown, FaCheckCircle, FaTimesCircle
} from 'react-icons/fa';

// Assuming you have saved ActionModal.js in a relevant path
import ActionModal from '@/components/AMC/ActionModal';

import ModernizationEdit from '@/components/Modernization/ModernizationEdit';
import ModernizationInvoicePrint from '@/components/Modernization/ModernizationInvoicePrint';

import ModernizationQuotationPdfPreview from '@/components/Modernization/ModernizationQuotationPdfPreview';

export default function ModernizationList() {
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [search, setSearch] = useState('');
  const [dateSearch, setDateSearch] = useState('');
  const [sortBy, setSortBy] = useState('id');
  const [direction, setDirection] = useState('desc');
  const [loading, setLoading] = useState(false);

  // State for View Modal (Unchanged)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [viewData, setViewData] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const [selectedIdForInvoice, setSelectedIdForInvoice] = useState(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  // ✅ Fetch List API (Unchanged)
  const fetchModernizations = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/api/modernization/getAll', {
        params: {
          search: search.trim(),
          dateSearch: dateSearch || null,
          page,
          size,
          sortBy,
          direction,
        },
      });

      setRecords(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
      setTotalElements(res.data.totalElements || 0);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [page, size, sortBy, direction, search, dateSearch]);

  useEffect(() => {
    fetchModernizations();
  }, [page, size, sortBy, direction, fetchModernizations]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (page === 0) {
      fetchModernizations();
    } else {
      setPage(0);
    }
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setDirection(direction === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setDirection('asc');
    }
  };

  const SortIcon = ({ field }) => {
    if (sortBy !== field) {
      return <FaSort className="text-gray-400 ml-1 group-hover:text-gray-600" size={10} />;
    }
    return direction === 'asc' ? (
      <FaSortUp className="text-sky-500 ml-1" size={10} />
    ) : (
      <FaSortDown className="text-sky-500 ml-1" size={10} />
    );
  };

  // --- NEW: Toggle Final State Handler ---
  const handleToggleFinal = async (id, currentStatus) => {
    const newStatus = !currentStatus;
    const action = newStatus ? 'Finalize' : 'Revert to Draft';

    // Optimistic UI update for immediate feedback
    const originalRecords = records;
    setRecords(records.map(r =>
      r.modernization.id === id
        ? { ...r, modernization: { ...r.modernization, isFinal: newStatus } }
        : r
    ));

    toast.loading(`${action}ing Quotation ${id}...`);

    try {
      // Assuming the API endpoint for toggling the final state is PATCH /api/modernization/updateIsFinal/{id}
      // and it expects a boolean value in the request body.
      await axiosInstance.patch(`/api/modernization/updateIsFinal/${id}`, null, {
        params: { isFinal: newStatus }
      });

      toast.dismiss();
      toast.success(`Quotation ${id} successfully marked as ${newStatus ? 'Final' : 'Draft'}!`);
      // We don't call fetchModernizations here to avoid table refresh/flicker.
    } catch (error) {
      toast.dismiss();
      console.error(`Failed to ${action} quotation:`, error);
      toast.error(`Failed to ${action} quotation ${id}.`);

      // Revert the UI update on failure
      setRecords(originalRecords);
    }
  };
  // ----------------------------------------

  // --- View Details Handler (Unchanged) ---
  const handleViewDetails = async (id) => {
    setViewData(null);
    setIsModalOpen(true);
    setModalLoading(true);
    try {
      const res = await axiosInstance.get(`/api/modernization/getModernizationQuotationById/${id}`);
      setViewData(res.data);
    } catch (error) {
      console.error('Failed to fetch details:', error);
      toast.error('Could not load modernization details.');
      setIsModalOpen(false);
    } finally {
      setModalLoading(false);
    }
  };
  // ------------------------------------------

  const [selectedIdForEdit, setSelectedIdForEdit] = useState(null);
  // --- Combined Action Handler (Updated) ---
  const handleAction = (action, id, isFinal, type = '') => {
    if (action === 'View') {
      handleViewDetails(id);
    } else if (action === 'Toggle Final') {
      handleToggleFinal(id, isFinal); // Pass ID and current isFinal status
    } else if (action === 'Edit') {
      setSelectedIdForEdit(id);
      setIsEditModalOpen(true);
    } else if (action === 'Invoice') {
      setSelectedIdForInvoice(id);
      setIsInvoiceModalOpen(true);
    }
    else {
      toast.success(`Action: ${action} on ID: ${id} ${type ? `(${type})` : ''}`);
    }
  };
  // ----------------------------------------------------

  // Helper functions (formatCurrency, BooleanDisplay, SortIcon) are the same

  // Helper for formatting currency
  const formatCurrency = (amount) => {
    return amount?.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }) || '₹ 0.00';
  };

  // Helper for boolean checks
  const BooleanDisplay = ({ value, label }) => (
    <div className="flex items-center text-sm font-medium">
      {label}:
      <span className={`ml-2 px-2 py-0.5 rounded-full ${value ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        {value ? 'YES' : 'NO'}
      </span>
    </div>
  );

  const [isWithoutLetterhead, setIsWithoutLetterhead] = useState(false);
  const [isWithLetterHead, setIsWithLetterHead] = useState(false);

  const [selectedModernizationId, setSelectedModernizationId] = useState(null);


  // Modal Content (ViewDetailsModalContent) is the same

  const ViewDetailsModalContent = () => {
    if (modalLoading) {
      return (
        <div className="flex justify-center items-center py-10 text-sky-500">
          <svg className="animate-spin h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="font-medium">Loading Quotation Details...</span>
        </div>
      );
    }

    if (!viewData) {
      return <div className="text-center py-10 text-gray-500">No data available.</div>;
    }

    const { modernization: m, details: d } = viewData;

    const InfoGridItem = ({ label, value, colorClass = 'text-gray-800' }) => (
      <div className="p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
        <p className="text-xs font-semibold uppercase text-gray-500">{label}</p>
        <p className={`text-md font-bold ${colorClass}`}>{value || '-'}</p>
      </div>
    );



    return (
      <div className="space-y-6">

        {/* 🌟 Top Summary Card */}
        <div className="p-5 bg-sky-100 rounded-xl shadow-lg border border-sky-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-bold uppercase text-sky-700">Quotation No.</p>
              <p className="text-3xl font-extrabold text-sky-800 tracking-tight">{m.quotationNo || '-'}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold uppercase text-sky-700">Amount Incl. GST</p>
              <p className="text-3xl font-extrabold text-sky-800 font-mono">{formatCurrency(m.amountWithGst)}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">Customer: <span className="font-semibold">{m.customerName || '-'}</span> | Site: <span className="font-semibold">{m.siteName || '-'}</span></p>
        </div>

        {/* General & Financial Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <InfoGridItem label="Quotation Date" value={m.quotationDate} />
          <InfoGridItem label="Subtotal Amount" value={formatCurrency(m.subtotal)} colorClass="text-green-700 font-mono" />
          <InfoGridItem label="GST Amount" value={formatCurrency(m.gstAmount)} colorClass="text-red-700 font-mono" />
          <InfoGridItem label="GST %" value={m.gstPercentage ? `${m.gstPercentage}%` : '-'} colorClass="text-gray-700" />

          <InfoGridItem label="Job ID" value={m.jobId} />
          <InfoGridItem label="Warranty" value={m.warranty ? `${m.warranty} Years` : '-'} />
          <InfoGridItem label="GST Applicable" value={m.gstApplicable} />
          <div className="p-3 bg-white border border-gray-100 rounded-lg shadow-sm flex items-center justify-center">
            <BooleanDisplay label="Status" value={m.isFinal} />
          </div>
        </div>

        {/* Note Section */}
        {m.note && (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-xs font-semibold uppercase text-gray-500 mb-1">Note / Instructions</p>
            <p className="text-sm italic text-gray-700">{m.note}</p>
          </div>
        )}

        {/* 🛠️ Material Details Grid (Card List) */}
        <div className="mt-6">
          <h3 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">Material Details ({d?.length || 0} Items)</h3>

          {d && d.length > 0 ? (
            <div className="space-y-4">
              {d.map((detail, index) => (
                <div key={detail.id} className="p-4 bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition duration-200">
                  <div className="grid grid-cols-2 md:grid-cols-7 gap-4 items-center">

                    {/* 1. Material Name (Main Info) */}
                    <div className="col-span-2 md:col-span-2">
                      <p className="text-xs font-semibold uppercase text-sky-600">Material Name</p>
                      <p className="text-lg font-bold text-gray-800">{detail.materialName || '-'}</p>
                    </div>

                    {/* 2. Quantity & UOM */}
                    <div className="text-center">
                      <p className="text-xs font-semibold uppercase text-gray-500">Qty / UOM</p>
                      <p className="text-md font-mono text-gray-700">{detail.quantity} / {detail.uom}</p>
                    </div>

                    {/* 3. HSN */}
                    <div className="text-center">
                      <p className="text-xs font-semibold uppercase text-gray-500">HSN</p>
                      <p className="text-md font-mono text-gray-700">{detail.hsn || '-'}</p>
                    </div>

                    {/* 4. Rate */}
                    <div className="text-right">
                      <p className="text-xs font-semibold uppercase text-gray-500">Rate</p>
                      <p className="text-md font-mono text-gray-700">{formatCurrency(detail.rate)}</p>
                    </div>

                    {/* 5. Amount */}
                    <div className="text-right">
                      <p className="text-xs font-semibold uppercase text-sky-600">Total Amount</p>
                      <p className="text-lg font-bold text-sky-800 font-mono">{formatCurrency(detail.amount)}</p>
                    </div>

                    {/* 6. Guarantee */}
                    <div className="text-center">
                      <p className="text-xs font-semibold uppercase text-gray-500">Guarantee</p>
                      <p className="text-md font-medium text-gray-700">{detail.guarantee || '-'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-4 p-4 bg-gray-50 rounded-lg">No detailed material records found.</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">

      <div className="max-w-9xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200">

        {/* 🔸 Header & Search Bar (Unchanged) */}
        <div className="p-5 bg-white border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <h4 className="text-2xl font-bold tracking-tight text-gray-800 mb-4 sm:mb-0">
            Modernization Quotations
          </h4>

          <form className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto" onSubmit={handleSearch}>
            <input
              type="text"
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-800 bg-white focus:ring-sky-500 focus:border-sky-500 transition placeholder-gray-500 w-full sm:w-64 shadow-sm"
              placeholder="Search customer or site..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <input
              type="date"
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-800 bg-white focus:ring-sky-500 focus:border-sky-500 transition placeholder-gray-500 w-full sm:w-44 shadow-sm"
              value={dateSearch}
              onChange={(e) => setDateSearch(e.target.value)}
            />

            <button
              className="flex items-center justify-center px-4 py-2 bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-600 transition duration-300 ease-in-out shadow-md shadow-sky-500/30 w-full sm:w-auto"
              type="submit"
            >
              <FaSearch className="mr-2" size={12} /> Search
            </button>
          </form>
        </div>

        {/* 🔸 Table Content */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {/* Data Columns (Unchanged) */}
                {[
                  { label: 'Quotation No', field: 'quotationNo', align: 'left' },
                  { label: 'Date', field: 'quotationDate', align: 'left' },
                  { label: 'Customer', field: 'customerName', align: 'left' },
                  { label: 'Site', field: 'siteName', align: 'left' },
                  { label: 'Amount', field: 'amount', align: 'right' },
                  { label: 'GST %', field: 'gstPercentage', align: 'center' },
                  { label: 'Amount + GST', field: 'amountWithGst', align: 'right' },
                  { label: 'Final', field: 'isFinal', align: 'center' },
                ].map(({ label, field, align }) => (
                  <th
                    key={field}
                    onClick={() => toggleSort(field)}
                    className={`px-6 py-3 text-${align} text-xs font-bold uppercase tracking-wider text-gray-500 cursor-pointer hover:bg-gray-100 transition duration-150 ease-in-out group`}
                  >
                    <div className="flex items-center" style={{ justifyContent: align === 'right' ? 'flex-end' : align === 'center' ? 'center' : 'flex-start' }}>
                      {label}
                      {(field === 'quotationNo' || field === 'quotationDate' || field === 'amount' || field === 'isFinal') && <SortIcon field={field} />}
                    </div>
                  </th>
                ))}
                {/* Actions Header */}
                <th className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center py-10">
                    <div className="flex justify-center items-center text-sky-500">
                      <svg className="animate-spin h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="font-medium">Loading Data...</span>
                    </div>
                  </td>
                </tr>
              ) : records.length > 0 ? (
                records.map((item, index) => (
                  <tr key={item.modernization.id} className="text-gray-700 transition duration-150 hover:bg-sky-50/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-sky-600">{item.modernization.quotationNo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{item.modernization.quotationDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{item.modernization.customerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{item.modernization.siteName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-mono font-medium">{item.modernization.amount?.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 })}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">{item.modernization.gstPercentage ?? '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-right font-mono text-sky-700">{item.modernization.amountWithGst?.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 })}</td>

                    {/* UPDATED: Toggle Final Icon Click Handler */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {item.modernization.isFinal ? (
                        <FaThumbsUp
                          className="inline-block text-green-500 cursor-pointer hover:text-green-600 transition"
                          title="Finalized"
                          size={18}
                        //onClick={() => handleAction('Toggle Final', item.modernization.id, item.modernization.isFinal)}
                        />
                      ) : (
                        <FaThumbsDown
                          className="inline-block text-red-500 cursor-pointer hover:text-red-600 transition"
                          title="Click to Finalize"
                          size={18}
                          onClick={() => handleAction('Toggle Final', item.modernization.id, item.modernization.isFinal)}
                        />
                      )}
                    </td>

                    {/* Actions Column (Unchanged) */}
                    {/* Actions Column (Modified) */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-3">
                        <button
                          title="View"
                          className="text-sky-500 hover:text-sky-600 transition"
                          onClick={() => handleAction('View', item.modernization.id)}
                        >
                          <FaEye size={16} />
                        </button>
                        {/* Edit */}
                        <button
                          title={
                            item.modernization.isFinal
                              ? 'Cannot edit because this record is final'
                              : 'Edit'
                          }
                          disabled={item.modernization.isFinal === true}
                          className={`transition 
    ${item.modernization.isFinal
                              ? 'text-gray-400 cursor-not-allowed'
                              : 'text-sky-500 hover:text-sky-600'
                            }`}
                          onClick={() => handleAction('Edit', item.modernization.id)}
                        >
                          <FaEdit size={16} />
                        </button>


                        {/* Separate Button for Letter Head FT */}
                        <button
                          title="Generate PDF: Letter Head FT"
                          className="text-sky-500 hover:text-sky-600 transition flex items-center"
                          onClick={() => {
                            // handleAction('Generate PDF', item.modernization.id, null, 'Letter Head FT')
                            setSelectedModernizationId(item.modernization.id);
                            setIsWithLetterHead(true);
                          }
                          }
                        >
                          <FaFilePdf size={16} />
                        </button>

                        {/* Separate Button for Letter Head FE */}
                        <button
                          title="Generate PDF: Letter Head FE"
                          className="text-sky-500 hover:text-sky-600 transition flex items-center"
                          onClick={() => {
                            // handleAction('Generate PDF', item.modernization.id, null, 'Letter Head FE')
                            setSelectedModernizationId(item.modernization.id);
                            setIsWithoutLetterhead(true);
                            setIsWithLetterHead(false);
                          }
                          }
                        >
                          <FaFilePdf size={16} />
                        </button>

                        <button
                          title="Send Mail"
                          className="text-sky-500 hover:text-sky-600 transition"
                          onClick={() => handleAction('Send Mail', item.modernization.id)}
                        >
                          <FaEnvelope size={16} />
                        </button>
                        <button
                          title="Invoice"
                          className="text-sky-500 hover:text-sky-600 transition"
                          onClick={() => handleAction('Invoice', item.modernization.id)}
                        >
                          <FaReceipt size={16} />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center text-gray-500 py-10 text-lg">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 🔸 Pagination Footer (Unchanged) */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center text-sm space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <label htmlFor="pageSize" className="text-gray-600">Rows per page:</label>
            <select
              id="pageSize"
              className="block w-auto py-1.5 text-base border-gray-300 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md bg-white text-gray-800 shadow-sm"
              value={size}
              onChange={(e) => {
                setSize(Number(e.target.value));
                setPage(0);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className="text-gray-600 ml-4">
              Showing <span className="font-semibold text-gray-800">{records.length}</span> of <span className="font-semibold text-gray-800">{totalElements}</span> results
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-gray-600 font-semibold">
              Page <span className="text-gray-800">{page + 1}</span> of <span className="text-gray-800">{totalPages || 1}</span>
            </span>
            <div className="flex space-x-1">
              <button
                className="p-2 border border-gray-300 rounded-md shadow-sm text-gray-600 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(p - 1, 0))}
              >
                <FaChevronLeft size={12} />
              </button>
              <button
                className="p-2 border border-gray-300 rounded-md shadow-sm text-gray-600 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
                disabled={page + 1 >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                <FaChevronRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 🛑 View Details Modal (Unchanged) */}
      <ActionModal
        isOpen={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        title={viewData?.modernization?.quotationNo ? `Quotation Dashboard: ${viewData.modernization.quotationNo}` : "Quotation Dashboard"}
      >
        <ViewDetailsModalContent />
      </ActionModal>
      {/* --------------------------- */}

      <ActionModal
        isOpen={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        title="Edit Modernization Quotation"
      >
        <ModernizationEdit id={selectedIdForEdit} onSave={() => {
          setIsEditModalOpen(false);
          fetchModernizations();
        }} />
      </ActionModal>
      {/* --------------------------- */}
      <ActionModal
        isOpen={isInvoiceModalOpen}
        onCancel={() => setIsInvoiceModalOpen(false)}
        title="Invoice Modernization Quotation"
      >
        <ModernizationInvoicePrint invoiceId={selectedIdForInvoice}
          onBackToList={() => {
            setIsInvoiceModalOpen(false);
            // fetchModernizations();
          }}
        />
      </ActionModal>
      {/* --------------------------- */}


      {/* Action Modal */}
      <ActionModal
        isOpen={isWithoutLetterhead || isWithLetterHead}
        onCancel={() => {
          setIsWithoutLetterhead(false);
          setIsWithLetterHead(false);
        }}
        title="Generate Modernization Quotation PDF"

      >
        <ModernizationQuotationPdfPreview
          modernizationId={selectedModernizationId}
          isWithLetterHead={isWithLetterHead}
        />

      </ActionModal>



    </div>
  );
}