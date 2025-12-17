'use client'

import { useEffect, useState, useCallback } from "react";
import axiosInstance from "@/utils/axiosInstance";
import ActionModal from "../AMC/ActionModal";
import {
  Search, Edit2, Eye, ArrowUpDown, Phone, Mail, MapPin
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

// --- Sortable Table Header ---
const SortableHeader = ({ label, sortKey, currentSort, currentDirection, onClick }) => (
  <th
    onClick={onClick}
    className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition whitespace-nowrap"
  >
    <div className="flex items-center space-x-1">
      <span>{label}</span>
      {currentSort === sortKey ? (
        <span className="text-blue-600">{currentDirection === "asc" ? "▲" : "▼"}</span>
      ) : (
        <ArrowUpDown className="w-3 h-3 text-gray-300" />
      )}
    </div>
  </th>
);

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sortBy, setSortBy] = useState("customerName");
  const [direction, setDirection] = useState("asc");
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [selectedCustomerSites, setSelectedCustomerSites] = useState([]);
  const [sitesModalOpen, setSitesModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Form state
  const [editForm, setEditForm] = useState({
    customerName: "", emailId: "", contactNumber: "", gstNo: "", address: "",
  });

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/api/customers/getAllCustomers", {
        params: { search: search || "", page, size, sortBy, direction }, 
      });
      setCustomers(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {
      console.error("Error fetching customers", err);
    } finally {
      setLoading(false);
    }
  }, [search, page, size, sortBy, direction]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setDirection(direction === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setDirection("asc");
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };

  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer);
    setEditForm({
      customerName: customer.customerName || "",
      emailId: customer.emailId || "",
      contactNumber: customer.contactNumber || "",
      gstNo: customer.gstNo || "",
      address: customer.address || "",
    });
    setEditModalOpen(true);
  };

  const handleEditSubmit = async () => {
    //const loadingToast = toast.loading("Updating customer...");
    try {
      const response = await axiosInstance.put(
        `/api/customers/updateCustomer/${selectedCustomer.customerId}`, 
        editForm
      );

      if (response.data.success) {
        toast.success(response.data.message || "Customer updated successfully");
        setEditModalOpen(false);
        fetchCustomers(); 
      } else {
        toast.error(response.data.message || "Failed to update customer");
      }
    } catch (err) {
      console.error("Error updating customer", err);
      const errorMsg = err.response?.data?.message || "Something went wrong";
      toast.error(errorMsg, { id: loadingToast });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 sm:p-6 text-sm">
      
      
      {/* Header Section */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Customer Directory</h1>
          <p className="text-xs text-gray-500">Manage and view customer records</p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search instantly..."
            value={search}
            onChange={handleSearchChange}
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left min-w-max border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 font-bold text-gray-500 uppercase w-12">No.</th>
                <SortableHeader label="Name" sortKey="customerName" currentSort={sortBy} currentDirection={direction} onClick={() => handleSort("customerName")} />
                <SortableHeader label="Phone" sortKey="contactNumber" currentSort={sortBy} currentDirection={direction} onClick={() => handleSort("contactNumber")} />
                <th className="px-4 py-3 font-bold text-gray-500 uppercase">Email</th>
                <th className="px-4 py-3 font-bold text-gray-500 uppercase">Address</th>
                <SortableHeader label="GST No" sortKey="gstNo" currentSort={sortBy} currentDirection={direction} onClick={() => handleSort("gstNo")} />
                <th className="px-4 py-3 font-bold text-gray-500 uppercase text-center">Status</th>
                <th className="px-4 py-3 font-bold text-gray-500 uppercase text-center">Sites</th>
                <th className="px-4 py-3 font-bold text-gray-500 uppercase text-center w-20">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={9} className="text-center py-10 text-gray-400 italic">Loading customers...</td></tr>
              ) : customers.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-10 text-gray-400">No customers found.</td></tr>
              ) : (
                customers.map((c, index) => (
                  <tr key={c.customerId} className="hover:bg-blue-50/20 transition-colors">
                    <td className="px-4 py-2 text-gray-400 font-medium">{page * size + index + 1}</td>
                    <td className="px-4 py-2 font-semibold text-gray-900">{c.customerName}</td>
                    <td className="px-4 py-2 text-gray-600">
                      <div className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-gray-400" /> {c.contactNumber || '-'}</div>
                    </td>
                    <td className="px-4 py-2 text-gray-600">
                      <div className="flex items-center gap-1.5"><Mail className="w-3 h-3 text-gray-400" /> {c.emailId || '-'}</div>
                    </td>
                    <td className="px-4 py-2 text-gray-500 max-w-[200px]">
                       <div className="truncate font-medium text-gray-600" title={c.address}>{c.address || '-'}</div>
                    </td>
                    <td className="px-4 py-2 text-gray-600 font-mono text-[11px]">
                       {c.gstNo || <span className="text-gray-300">N/A</span>}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        c.active ? "bg-green-50 text-green-600 border-green-100" : "bg-red-50 text-red-600 border-red-100"
                      }`}>
                        {c.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-center">
                      {c.sites?.length > 0 ? (
                        <button onClick={() => { setSelectedCustomerSites(c.sites); setSitesModalOpen(true); }} className="px-2 py-1 bg-white border border-gray-200 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition-all text-[11px] font-bold shadow-sm">
                           <Eye className="w-3 h-3 inline mr-1" /> {c.sites.length}
                        </button>
                      ) : <span className="text-gray-300">0</span>}
                    </td>
                    <td className="px-4 py-2 text-center">
                        <button onClick={() => handleEditCustomer(c)} className="p-1.5 bg-yellow-50 text-yellow-600 rounded-md hover:bg-yellow-600 hover:text-white transition shadow-sm" title="Edit">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center px-4 py-3 bg-gray-50 border-t border-gray-100 gap-3 text-xs">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5">
              <span className="text-gray-500">Rows:</span>
              <select value={size} onChange={(e) => { setSize(Number(e.target.value)); setPage(0); }} className="border border-gray-300 rounded px-1 py-0.5 outline-none bg-white">
                {[10, 20, 50].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <span className="text-gray-400 font-medium">Page {page + 1} of {totalPages}</span>
          </div>
          <div className="flex items-center gap-1">
            <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="px-3 py-1 bg-white border border-gray-200 rounded text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition">Previous</button>
            <button disabled={page + 1 >= totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-30 shadow-sm transition font-medium">Next</button>
          </div>
        </div>
      </div>

      {/* Sites Modal */}
      <ActionModal isOpen={sitesModalOpen} onCancel={() => setSitesModalOpen(false)} title="Assigned Customer Sites">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
          {selectedCustomerSites.map(site => (
            <div key={site.siteId} className="border border-gray-100 rounded-lg p-3 bg-gray-50">
              <h3 className="font-bold text-sm text-blue-700">{site.siteName}</h3>
              <p className="text-xs text-gray-500 flex items-start mt-1"><MapPin className="w-3 h-3 mr-1 mt-0.5 shrink-0" /> {site.address || "No address"}</p>
            </div>
          ))}
        </div>
      </ActionModal>

      {/* Edit Modal */}
      <ActionModal isOpen={editModalOpen} onCancel={() => setEditModalOpen(false)} title="Update Customer Details">
        <div className="space-y-4 text-xs">
          {["customerName", "emailId", "contactNumber", "gstNo", "address"].map((field) => (
            <div key={field}>
              <label className="block text-gray-600 font-bold mb-1 capitalize">{field.replace(/([A-Z])/g, ' $1')}:</label>
              <input 
                type="text" 
                value={editForm[field]} 
                onChange={(e) => setEditForm({ ...editForm, [field]: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" 
              />
            </div>
          ))}
          <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
            <button onClick={() => setEditModalOpen(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg font-bold">Cancel</button>
            <button onClick={handleEditSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-md">Update Customer</button>
          </div>
        </div>
      </ActionModal>

    </div>
  );
};

export default CustomerList;