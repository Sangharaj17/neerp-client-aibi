'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Eye,
  Pencil,
  Trash2,
  FileText,
  FileSearch,
  Search,
  Loader2,
  ChevronUp,
  ChevronDown,
  Plus,
  Download
} from 'lucide-react';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';

import ConfirmDeleteModal from '@/components/AMC/ConfirmDeleteModal';
import EditLead from '@/components/AMC/EditLead';
import axiosInstance from '@/utils/axiosInstance';
import PageHeader from '@/components/UI/PageHeader';

export default function LeadListPage() {
  const [search, setSearch] = useState('');
  const [loadingBtn, setLoadingBtn] = useState(null);
  const { tenant } = useParams();
  const router = useRouter();

  const [leads, setLeads] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [originalLeadsDataForExport, setOriginalLeadsDataForExport] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const confirmDelete = (id) => {
    setDeleteId(id);
    setModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axiosInstance.delete(`/api/leadmanagement/leads/${deleteId}`);
      toast.success("Lead deleted successfully.");
      setModalOpen(false);
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete.");
      setModalOpen(false);
    }
  };

  const handleCancel = () => {
    setModalOpen(false);
    setDeleteId(null);
  };

  const [originalLeadsData, setOriginalLeadsData] = useState([]);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await axiosInstance.get('/api/leadmanagement/leads', {
          params: { search, page, size },
        });

        const { data, totalPages, totalElements } = response.data;
        setOriginalLeadsData(data);

        const formattedLeads = data.map((entry) => ({
          id: entry.leadId,
          date: new Date(entry.leadDate).toLocaleDateString('en-GB'),
          dateRaw: entry.leadDate,
          customer: `${entry.salutations ?? ''} ${entry.customerName ?? ''}`.trim(),
          site: entry.siteName ?? '-',
          source: entry.leadSource?.sourceName ?? '-',
          type: entry.leadType ?? '-',
          stage: entry.leadStage?.stageName ?? '-',
          number: entry.contactNo ?? '-',
          executive: entry.activityBy?.employeeName ?? '-',
          status: entry.status ?? 'Open',
        }));

        setOriginalLeadsDataForExport(data);

        let sortedLeads = formattedLeads;
        if (sortField) {
          sortedLeads = [...formattedLeads].sort((a, b) => {
            let aVal = a[sortField];
            let bVal = b[sortField];
            if (sortField === 'date') {
              aVal = a.dateRaw;
              bVal = b.dateRaw;
            }
            if (aVal == null) aVal = '';
            if (bVal == null) bVal = '';
            if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
            return 0;
          });
        }

        setLeads(sortedLeads);
        setTotalPages(totalPages);
        setTotalElements(totalElements);
      } catch (error) {
        console.error('Error fetching leads:', error);
      }
    };

    fetchLeads();
  }, [search, page, size, refreshKey, sortField, sortDirection]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleExportToExcel = async () => {
    try {
      setLoadingBtn('export-');
      const response = await axiosInstance.get('/api/leadmanagement/leads', {
        params: { search: '', page: 0, size: 10000 },
      });

      const allLeads = response.data.data || [];

      // Format data for Excel
      const data = allLeads.map((lead, index) => ({
        'Sr. No.': index + 1,
        'Lead ID': lead.leadId || '',
        'Date': new Date(lead.leadDate).toLocaleDateString('en-GB'),
        'Customer': `${lead.salutations || ''} ${lead.customerName || ''}`.trim(),
        'Site': lead.siteName || '-',
        'Source': lead.leadSource?.sourceName || '-',
        'Lead Type': lead.leadType || '-',
        'Stage': lead.leadStage?.stageName || '-',
        'Contact Number': lead.contactNo || '-',
        'Executive': lead.activityBy?.employeeName || '-',
        'Status': lead.status || 'Open'
      }));

      // Create worksheet and workbook
      const ws = XLSX.utils.json_to_sheet(data);

      // Set column widths
      ws['!cols'] = [
        { wch: 8 },   // Sr. No.
        { wch: 10 },  // Lead ID
        { wch: 12 },  // Date
        { wch: 25 },  // Customer
        { wch: 20 },  // Site
        { wch: 15 },  // Source
        { wch: 15 },  // Lead Type
        { wch: 15 },  // Stage
        { wch: 15 },  // Contact Number
        { wch: 18 },  // Executive
        { wch: 10 },  // Status
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Leads');
      XLSX.writeFile(wb, `Leads_Export_${new Date().toISOString().split('T')[0]}.xlsx`);

      toast.success('Leads exported successfully!');
      setLoadingBtn(null);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export leads');
      setLoadingBtn(null);
    }
  };

  const handleButtonClick = async (type, id = null) => {
    setLoadingBtn(`${type}-${id || ''}`);
    if (type === 'export') {
      handleExportToExcel();
      return;
    } else if (type === 'add') {
      router.push(`/dashboard/lead-management/lead-list/add-lead`);
    } else if (type === 'view-enquiry') {
      router.push(
        `/dashboard/lead-management/enquiries/${id}?customer=${encodeURIComponent(
          leads.find((l) => l.id === id).customer
        )}&site=${encodeURIComponent(leads.find((l) => l.id === id).site)}`
      );
    }
  };

  const handleRouteToAddLeadAndEnquiry = () => {
    router.push(`/dashboard/lead-management/lead-list/add-lead-with-enquiry`);
  };

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [action, setAction] = useState('Edit');

  const handleEditLeadClick = (leadId, action) => {
    const lead = originalLeadsData.find((l) => l.leadId === leadId);
    setSelectedLead(lead);
    setEditModalOpen(true);
    setLoadingBtn('');
    setAction(action || 'Edit');
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedLead(null);
  };

  const [enquiryTypes, setEnquiryTypes] = useState([]);

  useEffect(() => {
    axiosInstance.get('/api/enquiry-types')
      .then((res) => setEnquiryTypes(res.data))
      .catch((err) => console.error('Failed to fetch enquiry types', err));
  }, []);

  const handleAddEnquiry = (id, leadType, customer, site) => {
    const selectedCategoryObj = enquiryTypes.find(
      (type) => type.enquiryTypeName === leadType
    );

    const basePath = `/dashboard/lead-management/enquiries/${id}/add`;
    const enquiryTypeName = selectedCategoryObj?.enquiryTypeName;
    const enquiryTypeId = selectedCategoryObj?.enquiryTypeId;

    if (!enquiryTypeName || !enquiryTypeId) {
      toast.error("Please select a valid enquiry category.");
      return;
    }

    const queryParams = [
      `customer=${customer}`,
      `site=${site}`,
      `enquiryTypeId=${enquiryTypeId}`,
      `enquiryTypeName=${encodeURIComponent(enquiryTypeName)}`
    ];

    const fullPath = `${basePath}/${encodeURIComponent(enquiryTypeName)}?${queryParams.join('&')}`;
    router.push(fullPath);
  };

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Page Header */}
        <PageHeader
          title="Lead List"
          description={`${totalElements} total leads`}
        />

        <div className="px-6 py-5">
          {/* Actions Bar */}
          <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
            <div className="flex gap-2">
              <button
                onClick={() => handleButtonClick('add')}
                className="bg-neutral-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-neutral-800 transition flex items-center gap-2"
              >
                {loadingBtn === 'add-' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Add Lead
              </button>

              <button
                onClick={() => handleButtonClick('export')}
                className="bg-white border border-neutral-300 text-neutral-700 px-4 py-2 rounded-lg text-sm hover:bg-neutral-50 transition flex items-center gap-2"
              >
                {loadingBtn === 'export-' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                Export
              </button>

              <button
                onClick={() => { handleRouteToAddLeadAndEnquiry(); setLoadingBtn('add-lead-and-enquiry'); }}
                className="bg-white border border-neutral-300 text-neutral-700 px-4 py-2 rounded-lg text-sm hover:bg-neutral-50 transition flex items-center gap-2"
              >
                {loadingBtn === 'add-lead-and-enquiry' && <Loader2 className="w-4 h-4 animate-spin" />}
                Add Lead & Enquiry
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search leads..."
                  value={search}
                  onChange={handleSearchChange}
                  className="pl-9 pr-4 py-2 border border-neutral-300 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-neutral-200 transition"
                />
              </div>
              <select
                value={size}
                onChange={(e) => { setSize(parseInt(e.target.value)); setPage(0); }}
                className="px-3 py-2 border border-neutral-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-neutral-200 transition"
              >
                {[5, 10, 20, 50].map((s) => (
                  <option key={s} value={s}>Show {s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-auto border border-neutral-200 rounded-lg">
            <table className="min-w-[1200px] w-full text-sm">
              <thead className="bg-neutral-50 text-neutral-600">
                <tr>
                  {[
                    { label: '#', sortable: false },
                    { label: 'Date', sortable: true, field: 'date' },
                    { label: 'Customer', sortable: true, field: 'customer' },
                    { label: 'Site', sortable: true, field: 'site' },
                    { label: 'Source', sortable: true, field: 'source' },
                    { label: 'Type', sortable: true, field: 'type' },
                    { label: 'Stage', sortable: true, field: 'stage' },
                    { label: 'Contact', sortable: true, field: 'number' },
                    { label: 'Executive', sortable: true, field: 'executive' },
                    { label: 'Actions', sortable: false },
                    { label: 'Enquiry', sortable: false },
                  ].map((head, i) => (
                    <th
                      key={i}
                      className={`text-left px-4 py-3 text-xs font-medium uppercase tracking-wide border-b border-neutral-200 ${head.sortable ? 'cursor-pointer hover:bg-neutral-100 select-none' : ''}`}
                      onClick={() => head.sortable && handleSort(head.field)}
                    >
                      <div className="flex items-center gap-1">
                        <span>{head.label}</span>
                        {head.sortable && (
                          <div className="flex flex-col -space-y-1">
                            <ChevronUp className={`w-3 h-3 ${sortField === head.field && sortDirection === 'asc' ? 'text-neutral-900' : 'text-neutral-300'}`} />
                            <ChevronDown className={`w-3 h-3 ${sortField === head.field && sortDirection === 'desc' ? 'text-neutral-900' : 'text-neutral-300'}`} />
                          </div>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {leads.map((lead, index) => {
                  const isInactive = lead.status && lead.status.toLowerCase() !== 'active';
                  return (
                    <tr key={lead.id} className={`hover:bg-neutral-50 transition ${isInactive ? 'bg-red-50 border-l-4 border-l-red-500' : ''}`}>
                      <td className="px-4 py-3 text-neutral-500">{page * size + index + 1}</td>
                      <td className={`px-4 py-3 ${isInactive ? 'text-red-600' : 'text-neutral-700'}`}>{lead.date}</td>
                      <td className={`px-4 py-3 font-medium ${isInactive ? 'text-red-600' : 'text-neutral-900'}`}>{lead.customer}</td>
                      <td className={`px-4 py-3 ${isInactive ? 'text-red-600' : 'text-neutral-700'}`}>{lead.site}</td>
                      <td className={`px-4 py-3 ${isInactive ? 'text-red-600' : 'text-neutral-700'}`}>{lead.source}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">{lead.type}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${isInactive ? 'bg-red-100 text-red-700' : 'bg-amber-50 text-amber-700'}`}>
                          {lead.stage}
                        </span>
                      </td>
                      <td className={`px-4 py-3 ${isInactive ? 'text-red-600' : 'text-neutral-700'}`}>{lead.number}</td>
                      <td className={`px-4 py-3 ${isInactive ? 'text-red-600' : 'text-neutral-700'}`}>{lead.executive}</td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => { router.push(`/dashboard/lead-management/lead-list/leadDetails/${lead.id}`); setLoadingBtn(`view-${lead.id}`); }}
                            className="p-1.5 hover:bg-blue-50 rounded-lg transition"
                            title="View"
                          >
                            {loadingBtn === `view-${lead.id}` ? <Loader2 className="w-4 h-4 animate-spin text-blue-500" /> : <Eye className="w-4 h-4 text-blue-500" />}
                          </button>
                          <button
                            onClick={() => handleEditLeadClick(lead.id, 'Edit')}
                            className="p-1.5 hover:bg-emerald-50 rounded-lg transition"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4 text-emerald-500" />
                          </button>
                          <button
                            onClick={() => confirmDelete(lead.id)}
                            className="p-1.5 hover:bg-red-50 rounded-lg transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => { handleAddEnquiry(lead.id, lead.type, lead.customer, lead.site); setLoadingBtn(`enquiry-detail-${lead.id}`); }}
                            className="p-1.5 hover:bg-orange-50 rounded-lg transition"
                            title="Add Enquiry"
                          >
                            {loadingBtn === `enquiry-detail-${lead.id}` ? <Loader2 className="w-4 h-4 animate-spin text-orange-500" /> : <FileText className="w-4 h-4 text-orange-500" />}
                          </button>
                          <button
                            onClick={() => { handleButtonClick('view-enquiry', lead.id); setLoadingBtn(`view-enquiry-${lead.id}`); }}
                            className="p-1.5 hover:bg-purple-50 rounded-lg transition"
                            title="View Enquiries"
                          >
                            {loadingBtn === `view-enquiry-${lead.id}` ? <Loader2 className="w-4 h-4 animate-spin text-purple-500" /> : <FileSearch className="w-4 h-4 text-purple-500" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-5 flex justify-between items-center">
            <p className="text-sm text-neutral-500">
              Showing {page * size + 1} to {Math.min((page + 1) * size, totalElements)} of {totalElements} leads
            </p>
            <div className="flex gap-1">
              <button
                disabled={page === 0}
                onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                className="px-3 py-1.5 border border-neutral-300 rounded-lg text-sm hover:bg-neutral-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const pageNum = page < 3 ? i : page - 2 + i;
                if (pageNum >= totalPages) return null;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-3 py-1.5 border rounded-lg text-sm transition ${pageNum === page ? 'bg-neutral-900 text-white border-neutral-900' : 'border-neutral-300 hover:bg-neutral-50'}`}
                  >
                    {pageNum + 1}
                  </button>
                );
              })}
              <button
                disabled={page === totalPages - 1}
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
                className="px-3 py-1.5 border border-neutral-300 rounded-lg text-sm hover:bg-neutral-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <ConfirmDeleteModal
        isOpen={modalOpen}
        onCancel={handleCancel}
        onConfirm={handleConfirmDelete}
      />

      {/* Edit Modal */}
      {editModalOpen && selectedLead && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={closeEditModal}
        >
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-7xl max-h-[90vh] overflow-y-auto p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeEditModal}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 text-2xl"
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-lg font-medium text-neutral-800 mb-4">{action} Lead</h2>
            <EditLead leadData={selectedLead} closeEditModal={closeEditModal} action={action} />
          </div>
        </div>
      )}
    </>
  );
}
