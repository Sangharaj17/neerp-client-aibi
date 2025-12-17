// pages/amc-quotations/index.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import axiosInstance from '../../utils/axiosInstance';
import { useRouter } from 'next/navigation';
import ConfirmDeleteModal from '../AMC/ConfirmDeleteModal';
import { toast } from 'react-hot-toast';
import { Loader2, FileText, RefreshCw, ThumbsUp, ThumbsDown, Mail, Eye, Pencil, Trash2 } from 'lucide-react';
import AmcQuotationView from './AmcQuotationView';
import { AlignJustify } from 'lucide-react';

import ActionModal from '../AMC/ActionModal';
import AmcQuotationPdfSettingPreviewAndPrint from './pdf/AmcQuotationPdfSettingPreviewAndPrint';

export default function AMCQuotationList() {
  const router = useRouter();
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortColumn, setSortColumn] = useState('quatationDate');
  const [mapSortColumn, setMapSortColumn] = useState('quatationDate');

  const [sortDirection, setSortDirection] = useState('DESC');
  const [refreshKey, setRefreshKey] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedQuotationId, setSelectedQuotationId] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(null);

  useEffect(() => {
    fetchQuotations();
  }, [currentPage, searchTerm, pageSize, mapSortColumn, sortDirection, refreshKey]);

  //   const fetchQuotations = async () => {
  //   try {
  //     setLoading(true);
  //     setError(null);

  //     const params = {
  //       search: searchTerm,
  //       page: currentPage,
  //       size: pageSize,
  //       sort: `${sortColumn},${sortDirection}`,
  //     };

  //     let dateSearch = "2025-09-24";

  //     //dateSearch = null;

  //     if (dateSearch) {
  //       params.dateSearch = dateSearch; // send only if user selected a date
  //     }

  //     const response = await axiosInstance.get('/api/amc/quotation/initial/search', { params });

  //     setQuotations(response.data.content);
  //     setTotalPages(response.data.totalPages);
  //     setTotalElements(response.data.totalElements);
  //   } catch (err) {
  //     console.error('Error fetching quotations:', err);
  //     setError('Failed to load quotations. Please try again later.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchQuotations = async () => {
    try {
      setLoading(true);
      setError(null);

      // Regex to check if searchTerm is a date in YYYY-MM-DD format
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      let dateSearch = "";
      let textSearch = searchTerm; // separate variable for non-date search

      // If user enters a date, use it as dateSearch
      if (dateRegex.test(searchTerm)) {
        dateSearch = searchTerm;
        textSearch = ""; // clear text search if it's a date
      }

      const params = {
        search: textSearch,
        page: currentPage,
        size: pageSize,
        sort: `${mapSortColumn},${sortDirection}`,
      };

      if (dateSearch) {
        params.dateSearch = dateSearch; // include only if date is present
      }

      const response = await axiosInstance.get('/api/amc/quotation/initial/search', { params });

      setQuotations(response.data.content);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
    } catch (err) {
      console.error('Error fetching quotations:', err);
      setError('Failed to load quotations. Please try again later.');
    } finally {
      setLoading(false);
    }
  };


  // const fetchQuotations = async () => {
  //   try {
  //     setLoading(true);
  //     setError(null);

  //     const params = {
  //       search: searchTerm,
  //       page: currentPage,
  //       size: pageSize,
  //       sort: `${sortColumn},${sortDirection}`,
  //     };

  //     // Regex to check if the search term is a date in YYYY-MM-DD format
  //     const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  //     if (searchTerm && dateRegex.test(searchTerm)) {
  //       params.dateSearch = "2025-09-24"; // treat as date if format matches
  //       params.search = ''; // optionally clear search if it's just a date
  //     }

  //     const response = await axiosInstance.get('/api/amc/quotation/initial/search', { params });

  //     setQuotations(response.data.content);
  //     setTotalPages(response.data.totalPages);
  //     setTotalElements(response.data.totalElements);
  //   } catch (err) {
  //     console.error('Error fetching quotations:', err);
  //     setError('Failed to load quotations. Please try again later.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };





  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getPageNumbers = () => {
    return Array.from({ length: totalPages }, (_, i) => i);
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortColumn(column);
      setMapSortColumn(sortFieldMap[column]);
      setSortDirection('ASC');
    }
  };

  const renderSortIcon = (column) => {
    if (sortColumn !== column) return null;
    return sortDirection === 'ASC' ? ' ▲' : ' ▼';
  };

  const handleEdit = (quotationId) => {
    let tenant = localStorage.getItem('tenant');
    router.push(`/dashboard/quotations/amc_quatation_list/amc_quatation_edit/${quotationId}`);
  };

  const handleRevise = (quotationId) => {
    let tenant = localStorage.getItem('tenant');
    router.push(`/dashboard/quotations/amc_quatation_list/revise/${quotationId}`);
  };

  const handleClickRevision = (quotationId) => {
    let tenant = localStorage.getItem('tenant');
    router.push(`/dashboard/quotations/amc_quatation_list/revise_quatation_list/${quotationId}`);
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setModalOpen(true);
  };

  const handleConfirmDeleteAmcQuotation = async () => {
    try {
      await axiosInstance.delete(`/api/amc/quotation/initial/${deleteId}`);
      toast.success('AMC Quotation deleted successfully.');
      setModalOpen(false);
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete.');
      setModalOpen(false);
    }
  };

  const handleCancel = () => {
    setModalOpen(false);
    setDeleteId(null);
  };

  const closeModal = () => setSelectedQuotationId(null);

  const handleFinalize = async (quotationId) => {
    try {
      // setLoading(true);
      setLoadingBtn(`final-${quotationId}`);
      const res = await axiosInstance.put(`/api/amc/quotation/initial/${quotationId}/finalize`);
      toast.success("Quotation finalized successfully!");
      fetchQuotations(); // ✅ Re-fetch the quotations list
    } catch (error) {
      console.error("Error finalizing quotation:", error);
      toast.error("Failed to finalize quotation");
    } finally {
      // setLoading(false);
    }
  };

  const [isWithoutLetterhead, setIsWithoutLetterhead] = useState(false);
  const [isWithLetterHead, setIsWithLetterHead] = useState(false);
  const [siteName, setSiteName] = useState('');

  const [amcQuotationId, setAmcQuotationId] = useState(null);

  const sortFieldMap = {
    customerName: 'lead.customerName',
    siteName: 'site.siteName',
    employeeName: 'createdBy.employeeName',
    areaName: 'lead.area.areaName',
    quotationDate: 'quatationDate',
    makeOfElevator: 'makeOfElevator.name',
    forecastMonth: 'forecastMonth',

  };


  return (
    <div className="min-h-screen">
      <Head>
        <title>AMC Quotation Management</title>
      </Head>

      <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">AMC Quotation List</h1>

        {/* Search & Page Size */}
        <div className="bg-white p-3 rounded-lg shadow mb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <form onSubmit={handleSearch} className="flex items-center">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className="pl-8 pr-2 py-1 rounded border border-gray-300 text-xs w-48 focus:ring-1 focus:ring-blue-500"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
                </svg>
              </div>
              <div className="ml-2 text-xs text-gray-600 hidden md:block">
                Showing {quotations.length} of {totalElements}
              </div>
            </form>

            <div className="flex items-center gap-2 text-xs">
              <span>Records:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(0);
                }}
                className="px-2 py-1 border border-gray-300 rounded bg-white text-xs"
              >
                {[5, 10, 25, 50, 100].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded shadow overflow-x-auto">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 py-8">{error}</div>
          ) : quotations.length === 0 ? (
            <div className="text-center text-gray-600 py-8">No quotations found.</div>
          ) : (
            <table className="min-w-full text-xs">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 py-2 text-left font-medium text-gray-600">S.No</th>
                  <th className="px-2 py-2 cursor-pointer" onClick={() => handleSort('quotationDate')}>
                    Date{renderSortIcon('quotationDate')}
                  </th>
                  <th className="px-2 py-2 cursor-pointer" onClick={() => handleSort('customerName')}>
                    Customer{renderSortIcon('customerName')}
                  </th>
                  <th className="px-2 py-2 cursor-pointer" onClick={() => handleSort('siteName')}>
                    Site{renderSortIcon('siteName')}
                  </th>
                  <th className="px-2 py-2 cursor-pointer" onClick={() => handleSort('employeeName')}>
                    Generated By{renderSortIcon('employeeName')}
                  </th>
                  <th className="px-2 py-2 cursor-pointer" onClick={() => handleSort('areaName')}>
                    Place{renderSortIcon('areaName')}
                  </th>
                  <th className="px-2 py-2 cursor-pointer" onClick={() => handleSort('makeOfElevator')}>
                    Make{renderSortIcon('makeOfElevator')}
                  </th>

                  <th className="px-2 py-2">AMC Period</th>
                  <th className="px-2 py-2 cursor-pointer" onClick={() => handleSort('forecastMonth')}>
                    Forecast{renderSortIcon('forecastMonth')}
                  </th>
                  <th colSpan="2" className="px-2 py-2 text-center font-medium text-gray-700">
                    Generate Quotation
                  </th>
                  <th className="px-2 py-2 text-center">Revise</th>
                  <th className="px-2 py-2 text-center">Revision</th>
                  <th className="px-2 py-2 text-center">Is Final</th>
                  <th className="px-2 py-2 text-center">Preview Mail</th>
                  <th className="px-2 py-2 text-left">Actions</th>
                </tr>
                <tr className="bg-gray-100">
                  <th colSpan="9"></th>
                  <th className="px-2 py-1 text-center">PDF</th>
                  <th className="px-2 py-1 text-center">No Letterhead</th>
                  <th colSpan="5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {quotations.map((q, i) => (
                  <tr key={q.id} className="hover:bg-gray-50">
                    <td className="px-2 py-2">{currentPage * pageSize + i + 1}</td>
                    <td className="px-2 py-2">{formatDate(q.quatationDate)}</td>
                    <td className="px-2 py-2">{q.customerName || '-'}</td>
                    <td className="px-2 py-2">{q.siteName || '-'}</td>
                    <td className="px-2 py-2">{q.employeeName || '-'}</td>
                    <td className="px-2 py-2">{q.place || '-'}</td>
                    <td className="px-2 py-2">{q.makeOfElevator || '-'}</td>
                    <td className="px-2 py-2">{q.amcPeriod || '-'}</td>
                    <td className="px-2 py-2">{q.forecastMonth || '-'}</td>
                    <td className="px-2 py-2 text-center">
                      <button onClick={() => {
                        setSiteName(q.siteName);
                        setIsWithLetterHead(true);
                        setAmcQuotationId(q.id);
                        //generatePDF(q.id, true)
                      }
                      } className="bg-sky-400 hover:bg-sky-500 text-white p-1 rounded">
                        <FileText className="w-4 h-4" />
                      </button>
                    </td>
                    <td className="px-2 py-2 text-center">
                      <button onClick={() => {
                        // generatePDF(q.id, false);
                        setSiteName(q.siteName);
                        setIsWithoutLetterhead(true);
                        setAmcQuotationId(q.id);
                      }

                      } className="bg-sky-400 hover:bg-sky-500 text-white p-1 rounded">
                        <FileText className="w-4 h-4" />
                      </button>
                    </td>
                    <td className="px-2 py-2 text-center">
                      {!q.isRevised ? (
                        <button
                          disabled={q.isFinal === 1}
                          title={q.isFinal === 1 ? "Cannot revise because this is final" : "Revise"}
                          onClick={() => {
                            if (q.isFinal === 1) return;

                            handleRevise(q.id);
                            setLoadingBtn(`revise-${q.id}`);
                          }}
                          className={`p-1 rounded flex items-center justify-center w-6 h-7 transition
    ${q.isFinal === 1
                              ? "bg-gray-300 cursor-not-allowed"
                              : "bg-sky-400 hover:bg-sky-500 text-white"}
  `}
                        >
                          {loadingBtn === `revise-${q.id}` ? (
                            <Loader2 className="w-4 h-4 animate-spin text-white" />
                          ) : (
                            <RefreshCw className="w-4 h-4" />
                          )}
                        </button>


                      ) : (
                        <span className="text-gray-400 text-xs">NA</span>
                      )}
                    </td>
                    <td className="px-2 py-2 text-center">
                      {q.isRevised ? (
                        <button
                          onClick={() => {
                            handleClickRevision(q.id);
                            setLoadingBtn(`revise-${q.id}`);
                          }}
                          className="bg-sky-400 hover:bg-sky-500 text-white p-1 rounded flex items-center justify-center w-6 h-7"
                        >
                          {loadingBtn === `revise-${q.id}` ? (
                            <Loader2 className="w-4 h-4 animate-spin text-white" />
                          ) : (
                            <AlignJustify className="w-4 h-4" />
                          )}
                        </button>
                      ) : (
                        <span className="text-gray-400 text-xs">NA</span>
                      )}
                    </td>
                    <td className="px-2 py-2 text-center">
                      {q.isFinal ? (
                        <ThumbsUp
                          className="w-4 h-4 text-green-600"
                          fill="currentColor"
                          stroke="currentColor"
                        />
                      ) : loadingBtn === `final-${q.id}` ? (
                        <Loader2 className="w-4 h-4 animate-spin text-sky-500 " />
                      ) : (
                        <ThumbsDown onClick={() => handleFinalize(q.id)} className="w-4 h-4 text-gray-400" />

                      )}
                    </td>
                    <td className="px-2 py-2 text-center">
                      <button onClick={() => previewMail(q.id)} className="bg-green-400 hover:bg-green-500 text-white p-1 rounded">
                        <Mail className="w-4 h-4" />
                      </button>
                    </td>
                    <td className="px-2 py-2">
                      <div className="flex gap-1">
                        <button onClick={() => setSelectedQuotationId(q.id)} className="text-blue-600 hover:text-blue-900 p-0.5">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          disabled={q.isFinal === 1}
                          title={q.isFinal === 1 ? "Cannot edit because this is final" : "Edit"}
                          onClick={() => {
                            if (q.isFinal === 1) return;

                            handleEdit(q.id);
                            setLoadingBtn(`edit-${q.id}`);
                          }}
                          className={`p-0.5 transition
    ${q.isFinal === 1
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-blue-600 hover:text-blue-900"}
  `}
                        >
                          {loadingBtn === `edit-${q.id}` ? (
                            <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                          ) : (
                            <Pencil className="w-4 h-4" />
                          )}
                        </button>

                        <button
                          disabled={q.isFinal === 1}
                          title={q.isFinal === 1 ? "Cannot delete because this is final" : "Delete"}
                          onClick={() => {
                            if (q.isFinal === 1) return;

                            confirmDelete(q.id);
                            setLoadingBtn(`delete-${q.id}`);
                          }}
                          className={`p-0.5 transition
    ${q.isFinal === 1
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-purple-600 hover:text-purple-900"}
  `}
                        >
                          {loadingBtn === `delete-${q.id}` ? (
                            <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 mt-4">
          <div className="text-xs text-gray-700">
            Page {currentPage + 1} of {totalPages}
          </div>
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
              disabled={currentPage === 0}
              className={`px-2 py-1 rounded ${currentPage === 0 ? 'bg-gray-200 text-gray-400' : 'bg-white border border-gray-300 hover:bg-gray-50'}`}
            >
              Prev
            </button>
            {getPageNumbers().map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`px-2 py-1 rounded border ${p === currentPage ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
              >
                {p + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
              disabled={currentPage >= totalPages - 1}
              className={`px-2 py-1 rounded ${currentPage >= totalPages - 1 ? 'bg-gray-200 text-gray-400' : 'bg-white border border-gray-300 hover:bg-gray-50'}`}
            >
              Next
            </button>
          </div>
        </div>
      </main>

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal isOpen={modalOpen} onCancel={handleCancel} onConfirm={handleConfirmDeleteAmcQuotation} />



      {/* Action Modal */}
      <ActionModal
        isOpen={isWithoutLetterhead || isWithLetterHead}
        onCancel={() => {
          setIsWithoutLetterhead(false);
          setIsWithLetterHead(false);
        }}
        title="Generate AMC Quotation PDF"

      >
        <AmcQuotationPdfSettingPreviewAndPrint
          amcQuotationId={amcQuotationId}
          siteName={siteName}
          isWithoutLetterhead={isWithoutLetterhead}
          isWithLetterHead={isWithLetterHead}
        />

      </ActionModal>



      {/* Quotation View Modal */}
      {selectedQuotationId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-200/40 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative bg-white w-11/12 max-w-6xl rounded-xl shadow-2xl p-4 max-h-[90vh] overflow-y-auto">
            <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold" onClick={closeModal}>
              ✕
            </button>
            <AmcQuotationView params={{ quotationId: selectedQuotationId }} />
          </div>
        </div>
      )}
    </div>
  );
}
