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
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

import ConfirmDeleteModal from '@/components/AMC/ConfirmDeleteModal';
import EditLead from '@/components/AMC/EditLead';
import axiosInstance from '@/utils/axiosInstance';

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

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0); // 👈 used to trigger re-fetch
  

  const confirmDelete = (id) => {
  setDeleteId(id);
  setModalOpen(true);
};

const handleConfirmDelete = async () => {
  try {
    await axiosInstance.delete(`/api/leadmanagement/leads/${deleteId}`);
    toast.success("Enquiry deleted successfully.");
    setModalOpen(false);
    setRefreshKey(prev => prev + 1); // 👈 trigger re-fetch
  } catch (err) {
    // toast.error(err?.response?.data || "Failed to delete.");
toast.error(err?.response?.data?.message || "Failed to delete.");

    setModalOpen(false);
  }
};

const handleCancel = () => {
  setModalOpen(false);
  setDeleteId(null);
};

  const [originalLeadsData , setOriginalLeadsData] = useState([]);


  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await axiosInstance.get('/api/leadmanagement/leads', {
          params: { search, page, size },
        });

        const { data, totalPages, totalElements } = response.data;

        setOriginalLeadsData(data); // Store original data for future use

        console.log('originalLeadsData Leads:', originalLeadsData);

        const formattedLeads = data.map((entry) => ({
          id: entry.leadId,
          date: new Date(entry.leadDate).toLocaleDateString('en-GB'),
          customer: `${entry.salutations ?? ''} ${entry.customerName ?? ''}`.trim(),
          site: entry.siteName ?? '-',
          source: entry.leadSource?.sourceName ?? '-',
          type: entry.leadType ?? '-',
          stage: entry.leadStage?.stageName ?? '-',
          number: entry.contactNo ?? '-',
          executive: entry.activityBy?.employeeName ?? '-',
        }));

        setLeads(formattedLeads);
        setTotalPages(totalPages);
        setTotalElements(totalElements);
      } catch (error) {
        console.error('Error fetching leads:', error);
      }
    };

    fetchLeads();
  }, [search, page, size , refreshKey]); // 

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };

  const handleButtonClick = async (type, id = null) => {
    setLoadingBtn(`${type}-${id || ''}`);
    if (type === 'export') {
      setTimeout(() => setLoadingBtn(null), 1500);
    } else if (type === 'add') {
      router.push(`/dashboard/lead-management/lead-list/add-lead`);
    } else if(type === 'delete') {

    }
     else if (type === 'view-enquiry') {
      router.push(
        `/dashboard/lead-management/enquiries/${id}?customer=${encodeURIComponent(
          leads.find((l) => l.id === id).customer
        )}&site=${encodeURIComponent(leads.find((l) => l.id === id).site)}`
      );
    }
  };

  const handleRouteToAddLeadAndEnquiry = () => {
    router.push(`/dashboard/lead-management/lead-list/add-lead-enquiry`);
  };


   const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [action , setAction] = useState('Edit'); // Default action is 'Edit'

  const handleEditLeadClick = ( leadId , action) => {
     // setLoadingBtn(`edit-${leadId}`);
      const lead = originalLeadsData.find((l) => l.leadId === leadId); // use the mapped object

      console.log('originalLeadsData lead for edit:', originalLeadsData);
      console.log('Selected lead for edit:', leadId);
      setSelectedLead(lead);
      setEditModalOpen(true);
      setLoadingBtn('');

      setAction(action || 'Edit'); // Set action based on the button clicked
  };
  

  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedLead(null);
  };

  
    const [enquiryTypes, setEnquiryTypes] = useState([]);
    
       useEffect(() => {
        axiosInstance.get('/api/enquiry-types')
          .then((res) => {
            setEnquiryTypes(res.data);
          })
          .catch((err) => console.error('Failed to fetch enquiry types', err));
      }, []);

  const handleAddEnquiry = (id , leadType , customer , site) => {
    //setAddEnquiryLoading(true);

    const selectedCategoryObj = enquiryTypes.find(
      (type) => type.enquiryTypeName === leadType
    );
  
    const basePath = `/dashboard/lead-management/enquiries/${id}/add`;
  
    // Extract type info
    const enquiryTypeName = selectedCategoryObj?.enquiryTypeName; // e.g., "AMC"
    const enquiryTypeId = selectedCategoryObj?.enquiryTypeId;
  
    if (!enquiryTypeName || !enquiryTypeId) {
      toast.error("Please select a valid enquiry category.");
      setAddEnquiryLoading(false);
      return;
    }
  
    // Fetch other query params
    // const customer = encodeURIComponent(searchParams.get('customer') || '');
    // const site = encodeURIComponent(searchParams.get('site') || '');
  
    // Build query string
    const queryParams = [
      `customer=${customer}`,
      `site=${site}`,
      `enquiryTypeId=${enquiryTypeId}`,
      `enquiryTypeName=${encodeURIComponent(enquiryTypeName)}`
    ];
  
    // Final path: /.../add/AMC?enquiryTypeId=1&enquiryTypeName=AMC&...
    const fullPath = `${basePath}/${encodeURIComponent(enquiryTypeName)}?${queryParams.join('&')}`;
    router.push(fullPath);
  };

  return (
    <>
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Lead List</h2>

      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => handleButtonClick('add')}
            className="bg-blue-100 text-blue-700 px-4 py-2 rounded-md text-sm hover:bg-blue-200 transition flex items-center gap-2"
          >
            {loadingBtn === 'add-' && <Loader2 className="w-4 h-4 animate-spin" />}
            Add New Lead
          </button>

          <button
            onClick={() => handleButtonClick('export')}
            className="bg-green-100 text-green-700 px-4 py-2 rounded-md text-sm hover:bg-green-200 transition flex items-center gap-2"
          >
            {loadingBtn === 'export-' && <Loader2 className="w-4 h-4 animate-spin" />}
            Export to Excel
          </button>

          <button
            onClick={()=>{handleRouteToAddLeadAndEnquiry(); setLoadingBtn('add-lead-and-enquiry');}}
            className="bg-green-100 text-green-700 px-4 py-2 rounded-md text-sm hover:bg-green-200 transition flex items-center gap-2"
          >
            {loadingBtn === 'add-lead-and-enquiry' && <Loader2 className="w-4 h-4 animate-spin" />}

            Add Lead & Enquiry
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={handleSearchChange}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm w-64 focus:outline-none focus:ring-1 focus:ring-blue-200 transition"
            />
          </div>
<div className="relative w-48">
  <select
    value={size}
    onChange={(e) => {
      setSize(parseInt(e.target.value));
      setPage(0);
    }}
    className="pl-3 pr-8 py-2 border border-gray-300 rounded-md shadow-sm text-sm w-full appearance-none focus:outline-none focus:ring-1 focus:ring-blue-200 transition bg-white"
  >
    {[5, 10, 20, 50].map((s) => (
      <option key={s} value={s}>
        Show {s}
      </option>
    ))}
  </select>

  {/* Custom dropdown arrow icon */}
  <svg
    className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none w-4 h-4 text-gray-400"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
  </svg>
</div>

        </div>
      </div>

      <div className="overflow-auto border border-gray-200 rounded-xl shadow-sm">
        <table className="min-w-[1200px] w-full text-sm border-separate border-spacing-0">
          <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10 shadow-sm">
            <tr>
              {[
                'Sr.No.',
                'Date',
                'Customer Name',
                'Site Name',
                'Source',
                'Lead Type',
                'Lead Stage',
                'Number',
                'Executive',
                'View/Edit/Delete',
                'Enquiry Detail',
                'View Enquiry',
              ].map((head, i) => (
                <th
                  key={i}
                  className="text-left px-3 py-3 border-b border-gray-100 whitespace-nowrap font-medium"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leads.map((lead, index) => (
              <tr
                key={lead.id}
                className="hover:bg-gray-50 transition border border-gray-100"
              >
                <td className="px-3 py-2 border border-gray-100">
                  {page * size + index + 1}
                </td>
                <td className="px-3 py-2 border border-gray-100">{lead.date}</td>
                <td className="px-3 py-2 border border-gray-100">{lead.customer}</td>
                <td className="px-3 py-2 border border-gray-100">{lead.site}</td>
                <td className="px-3 py-2 border border-gray-100">{lead.source}</td>
                <td className="px-3 py-2 border border-gray-100">{lead.type}</td>
                <td className="px-3 py-2 border border-gray-100 text-red-500 font-medium">
                  {lead.stage}
                </td>
                <td className="px-3 py-2 border border-gray-100">{lead.number}</td>
                <td className="px-3 py-2 border border-gray-100">{lead.executive}</td>

                <td className="px-3 py-2 border border-gray-100">
                  <div className="flex justify-center items-center gap-2">
                    <button
                 // Button
                    onClick={() => {
                      router.push(`/dashboard/lead-management/lead-list/leadDetails/${lead.id}`);
                      setLoadingBtn(`view-${lead.id}`);
                    }}

                      className="p-1 hover:bg-blue-100 rounded"
                    >
                      {loadingBtn === `view-${lead.id}` ? (
                        <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                      ) : (
                        <Eye className="w-4 h-4 text-blue-500" />
                      )}
                    </button>
                    {/* <button
                      onClick={() => handleButtonClick('edit', lead.id)}
                      className="p-1 hover:bg-green-100 rounded"
                    >
                      {loadingBtn === `edit-${lead.id}` ? (
                        <Loader2 className="w-4 h-4 animate-spin text-green-500" />
                      ) : (
                        <Pencil className="w-4 h-4 text-green-500" />
                      )}
                    </button> */}
                     <button
                  onClick={() => handleEditLeadClick(lead.id , 'Edit')}
                  className="p-1 hover:bg-green-100 rounded"
                >
                  {loadingBtn === `edit-${lead.leadId}` ? (
                    <Loader2 className="w-4 h-4 animate-spin text-green-500" />
                  ) : (
                    <Pencil className="w-4 h-4 text-green-500" />
                  )}
                </button>
                    <button
                      // onClick={() => handleButtonClick('delete', lead.id)}
                        onClick={() => confirmDelete(lead.id)}

                      className="p-1 hover:bg-red-100 rounded"
                    >
                      {loadingBtn === `delete-${lead.id}` ? (
                        <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                      ) : (
                        <Trash2 className="w-4 h-4 text-red-500" />
                      )}
                    </button>
                  </div>
                </td>

                <td className="px-3 py-2 border border-gray-100 text-center">
                  <button
                    onClick={() => 
                      {
                        handleAddEnquiry(lead.id , lead.type , lead.customer , lead.site)  
                        setLoadingBtn(`enquiry-detail-${lead.id}`);

                      }}

                       
                    className="p-1 hover:bg-orange-100 rounded"
                  >
                    {loadingBtn === `enquiry-detail-${lead.id}` ? (
                      <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                    ) : (
                      <FileText className="w-4 h-4 text-orange-500" />
                    )}
                  </button>
                </td>

                <td className="px-3 py-2 border border-gray-100 text-center">
                  <button
                    onClick={() => { 
                      handleButtonClick('view-enquiry', lead.id);
                      setLoadingBtn(`view-enquiry-${lead.id}`);
                    }}
                    className="p-1 hover:bg-purple-100 rounded"
                  >
                    {loadingBtn === `view-enquiry-${lead.id}` ? (
                      <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
                    ) : (
                      <FileSearch className="w-4 h-4 text-purple-500" />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-center gap-2 flex-wrap">
        <button
          disabled={page === 0}
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-100 transition disabled:opacity-50"
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i)}
            className={`px-3 py-1 border border-gray-300 rounded-md text-sm ${
              i === page ? 'bg-gray-200' : 'hover:bg-gray-100'
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={page === totalPages - 1}
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
          className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-100 transition disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
    {/* Modal Component */}
    <ConfirmDeleteModal
      isOpen={modalOpen}
      onCancel={handleCancel}
      onConfirm={handleConfirmDelete}
    />

  {editModalOpen && selectedLead && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
    onClick={closeEditModal} // Click outside = close
  >
    <div
      className="bg-white rounded-xl shadow-lg w-full max-w-7xl max-h-[90vh] overflow-y-auto p-6 animate-fadeIn relative"
      onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside
    >
      {/* Close button */}
      <button
        onClick={closeEditModal}
        className="absolute top-3 right-4 text-gray-500 hover:text-black text-xl"
        aria-label="Close"
      >
        &times;
      </button>

      {/* Optional Modal Title */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        {action} Lead
      </h2>

      {/* Scrollable area for large content */}
      <div className="space-y-4">
        <EditLead leadData={selectedLead} closeEditModal={closeEditModal} action={action}/>
      </div>
    </div>
  </div>
)}


    </>
  );
}
