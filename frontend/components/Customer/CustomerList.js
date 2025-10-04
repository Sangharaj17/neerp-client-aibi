'use client'

import { useEffect, useState, useCallback } from "react";
import axiosInstance from "@/utils/axiosInstance";
import ActionModal from "../AMC/ActionModal";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Eye,
  ArrowUpDown,
  Phone,
  Mail,
  MapPin,
  Tag
} from "lucide-react";

// --- Custom Debounce Hook ---
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// --- Helper component for Sortable Table Headers ---
const SortableHeader = ({ label, sortKey, currentSort, currentDirection, onClick }) => (
  <th
    onClick={onClick}
    // Increased vertical padding (py-3) and kept text-xs for the header for contrast
    className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition duration-150 whitespace-nowrap"
  >
    <div className="flex items-center space-x-1">
      <span>{label}</span>
      {currentSort === sortKey ? (
        <span className="text-blue-600">
          {currentDirection === "asc" ? "▲" : "▼"}
        </span>
      ) : (
        <ArrowUpDown className="w-3 h-3 text-gray-400" />
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
  
  const debouncedSearchTerm = useDebounce(search, 500);

  // Modal states
  const [selectedCustomerSites, setSelectedCustomerSites] = useState([]);
  const [sitesModalOpen, setSitesModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [activateModalOpen, setActivateModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Form state
  const [editForm, setEditForm] = useState({
    customerName: "",
    emailId: "",
    contactNumber: "",
    gstNo: "",
    address: "",
  });

  const fetchCustomers = useCallback(async (currentSearch) => {
    setLoading(true);
    try {
      // Ensure search is a string (handle undefined if debounce runs too early)
      const searchTerm = currentSearch || ""; 
      const res = await axiosInstance.get("/api/customers/getAllCustomers", {
        params: { search: searchTerm, page, size, sortBy, direction }, 
      });
      setCustomers(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {
      console.error("Error fetching customers", err);
    } finally {
      setLoading(false);
    }
  }, [page, size, sortBy, direction]);

  useEffect(() => {
    fetchCustomers(search);
  }, [page, size, sortBy, direction, fetchCustomers, search]); // Added 'search' to handle initial load, but debounce logic is cleaner below

  // Logic to handle search change (debounced)
  useEffect(() => {
    if (debouncedSearchTerm !== undefined) {
      if (page !== 0) {
        // Reset to page 0 on new search, which will trigger fetchCustomers via the page effect
          setPage(0);
      } else {
          // If already on page 0, explicitly call fetchCustomers with the debounced term
          fetchCustomers(debouncedSearchTerm);
      }
    }
  }, [debouncedSearchTerm, fetchCustomers]);


  const handleSort = (field) => {
    if (sortBy === field) {
      setDirection(direction === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setDirection("asc");
    }
  };

  const handleViewSites = (sites) => {
    setSelectedCustomerSites(sites);
    setSitesModalOpen(true);
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
    try {
      await axiosInstance.put(`/api/customers/updateCustomer/${selectedCustomer.customerId}`, editForm);
      setEditModalOpen(false);
      // Pass the current search term to refetch the list correctly
      fetchCustomers(search); 
    } catch (err) {
      console.error("Error updating customer", err);
    }
  };

  const handleDeleteCustomer = (customer) => {
    setSelectedCustomer(customer);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axiosInstance.delete(`/api/customers/deleteCustomer/${selectedCustomer.customerId}`);
      setDeleteModalOpen(false);
      // Pass the current search term to refetch the list correctly
      fetchCustomers(search);
    } catch (err) {
      console.error("Error deleting customer", err);
    }
  };

  const handleActivateCustomer = (customer) => {
    setSelectedCustomer(customer);
    setActivateModalOpen(true);
  };

  const confirmActivate = async () => {
    try {
      await axiosInstance.patch(`/api/customers/toggleActive/${selectedCustomer.customerId}`);
      setActivateModalOpen(false);
      // Pass the current search term to refetch the list correctly
      fetchCustomers(search);
    } catch (err) {
      console.error("Error toggling customer status", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      
      {/* --- Header & Controls --- */}
      <div className="bg-white p-4 rounded-xl shadow-md mb-4 border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-3 md:mb-0">Customer Directory 🏢</h1>
          <button
            onClick={() => console.log("Navigate to Add Customer")} 
            className="flex items-center px-4 py-1.5 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition duration-150 font-semibold text-sm"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Customer
          </button>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search customers instantly..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg shadow-inner text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
          </div>
        </div>
      </div>
      
      {/* --- Table --- */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {/* FIX: Removed surrounding whitespace by placing <table> immediately after <div> */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase w-12">No.</th>
                <SortableHeader
                  label="Name"
                  sortKey="customerName"
                  currentSort={sortBy}
                  currentDirection={direction}
                  onClick={() => handleSort("customerName")}
                />
                <SortableHeader
                  label="Contact"
                  sortKey="contactNumber"
                  currentSort={sortBy}
                  currentDirection={direction}
                  onClick={() => handleSort("contactNumber")}
                />
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase w-64">Address / GST</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase w-16">Status</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase w-24">Sites</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase w-48">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500 italic">
                    <svg className="animate-spin h-4 w-4 text-blue-500 mx-auto mb-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Fetching data...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500 italic">
                    No customers found.
                  </td>
                </tr>
              ) : (
                customers.map((c, index) => (
                  <tr key={c.customerId} className="hover:bg-blue-50/50 transition duration-150">
                    <td className="px-4 py-3 font-medium text-gray-500">{page * size + index + 1}</td>
                    
                    {/* Name */}
                    <td className="px-4 py-3 font-semibold text-gray-900">{c.customerName}</td>
                    
                    {/* Contact & Email (Inline for compactness) */}
                    <td className="px-4 py-3 text-gray-700">
                       <div className="flex flex-col space-y-1">
                          <span className="inline-flex items-center">
                            <Phone className="w-3 h-3 mr-1 text-gray-400 shrink-0" />
                            <span className="truncate" title={c.contactNumber}>{c.contactNumber || 'N/A'}</span>
                          </span>
                          <span className="inline-flex items-center">
                            <Mail className="w-3 h-3 mr-1 text-gray-400 shrink-0" />
                            <span className="truncate" title={c.emailId}>{c.emailId || 'N/A'}</span>
                          </span>
                       </div>
                    </td>
                    
                    {/* Address & GST (Inline for compactness) */}
                    <td className="px-4 py-3 text-gray-700">
                      <div className="flex flex-col space-y-1">
                          <span className="inline-flex items-start">
                            <MapPin className="w-3 h-3 mt-1 mr-1 text-gray-400 shrink-0" />
                            <span className="line-clamp-2" title={c.address}>{c.address || 'N/A'}</span>
                          </span>
                          <span className="inline-flex items-center">
                            <Tag className="w-3 h-3 mr-1 text-gray-400 shrink-0" />
                            <span className="truncate" title={c.gstNo}>{c.gstNo || 'N/A'}</span>
                          </span>
                      </div>
                    </td>
                    
                    {/* Status */}
                    <td className="px-4 py-3 text-center">
                       <span className={`inline-flex items-center px-2 py-0.5 text-xs rounded-full font-semibold ${
                            c.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                       }`}>
                            {c.active ? 'Active' : 'Inactive'}
                       </span>
                    </td>
                    
                    {/* Sites Button */}
                    <td className="px-4 py-3 text-center">
                      {c.sites && c.sites.length > 0 ? (
                        <button
                          onClick={() => handleViewSites(c.sites)}
                          className="flex items-center justify-center mx-auto px-3 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 transition shadow-sm text-sm"
                          title="View Sites"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          ({c.sites.length})
                        </button>
                      ) : (
                        <span className="text-gray-400 text-sm italic">0</span>
                      )}
                    </td>
                    
                    {/* Actions in one row */}
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2 justify-center">
                        <button
                          onClick={() => handleEditCustomer(c)}
                          className="p-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition shadow-sm"
                          title="Edit Customer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCustomer(c)}
                          className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition shadow-sm"
                          title="Delete Customer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleActivateCustomer(c)}
                          className={`p-2 rounded-md text-white transition shadow-sm ${
                            c.active ? "bg-gray-500 hover:bg-gray-600" : "bg-blue-600 hover:bg-blue-700"
                          }`}
                            title={c.active ? "Deactivate Customer" : "Activate Customer"}
                        >
                          {c.active ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div> {/* closing overflow-x-auto div */}
      </div> {/* closing bg-white rounded-xl div */}

      {/* --- Pagination --- */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 p-3 bg-white rounded-xl shadow-sm border border-gray-100 text-sm">
        
        {/* Rows per page selector */}
        <div className="flex items-center space-x-3 mb-3 sm:mb-0">
          <span className="text-gray-600">Rows:</span>
          <select
            value={size}
            onChange={(e) => {
              setSize(Number(e.target.value));
              setPage(0);
            }}
            className="border border-gray-300 rounded-lg shadow-sm px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[5, 10, 20, 50].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        
        {/* Page status and navigation buttons */}
        <div className="flex items-center space-x-3">
          <span className="text-gray-700 font-medium">
            Page {page + 1} of {Math.max(1, totalPages)}
          </span>
          <button
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
            className={`px-3 py-1.5 rounded-lg shadow-md font-medium transition text-sm ${
              page === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Previous
          </button>
          <button
            disabled={page + 1 >= totalPages}
            onClick={() => setPage(page + 1)}
            className={`px-3 py-1.5 rounded-lg shadow-md font-medium transition text-sm ${
              page + 1 >= totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* --- Modals (Unchanged) --- */}
      
      <ActionModal isOpen={sitesModalOpen} onCancel={() => setSitesModalOpen(false)} title="Customer Sites">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto p-1 text-sm">
          {selectedCustomerSites.map((site) => (
            <div
              key={site.siteId}
              className="border border-gray-200 rounded-lg p-3 shadow-sm bg-gray-50"
            >
              <h3 className="font-bold text-base text-blue-700">{site.siteName}</h3>
              <p className="text-gray-600 flex items-start mt-1">
                  <MapPin className="w-3.5 h-3.5 mr-1.5 text-gray-400 shrink-0 mt-0.5" />
                  {site.address || "No address"}
              </p>
            </div>
          ))}
        </div>
      </ActionModal>

      <ActionModal isOpen={editModalOpen} onCancel={() => setEditModalOpen(false)} title={`Edit Customer: ${selectedCustomer?.customerName}`}>
        <div className="space-y-4 text-sm">
          {["customerName", "emailId", "contactNumber", "gstNo", "address"].map((field) => (
            <div key={field}>
              <label className="block text-gray-700 font-medium mb-1 capitalize">
                {field.replace(/([A-Z])/g, ' $1').trim()}:
              </label>
              <input
                type={field.includes('email') ? 'email' : field.includes('contact') ? 'tel' : 'text'}
                value={editForm[field]}
                onChange={(e) => setEditForm({ ...editForm, [field]: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
          ))}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setEditModalOpen(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleEditSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Save Changes
            </button>
          </div>
        </div>
      </ActionModal>

      <ActionModal isOpen={deleteModalOpen} onCancel={() => setDeleteModalOpen(false)} title="Confirm Deletion">
        <div className="space-y-3 text-center text-sm">
          <Trash2 className="w-10 h-10 text-red-500 mx-auto" />
          <p className="text-gray-800">
            Are you sure you want to delete <strong className="font-bold text-red-600">{selectedCustomer?.customerName}</strong>?
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </ActionModal>

      <ActionModal isOpen={activateModalOpen} onCancel={() => setActivateModalOpen(false)} title={`Confirm Status Change`}>
        <div className="space-y-3 text-center text-sm">
          <p className="text-gray-800">
            You are about to **{selectedCustomer?.active ? "DEACTIVATE" : "ACTIVATE"}**{" "}
            <strong className="font-bold">{selectedCustomer?.customerName}</strong>.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => setActivateModalOpen(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Cancel
            </button>
            <button
              onClick={confirmActivate}
              className={`px-4 py-2 text-white rounded-lg transition font-medium ${
                selectedCustomer?.active ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {selectedCustomer?.active ? "Deactivate" : "Activate"}
            </button>
          </div>
        </div>
      </ActionModal>
    </div>
  );
};

export default CustomerList;