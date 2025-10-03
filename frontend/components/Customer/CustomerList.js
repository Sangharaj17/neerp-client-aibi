"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import ActionModal from "../AMC/ActionModal";

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sortBy, setSortBy] = useState("customerName");
  const [direction, setDirection] = useState("asc");
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const [selectedCustomerSites, setSelectedCustomerSites] = useState([]);
  const [sitesModalOpen, setSitesModalOpen] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [activateModalOpen, setActivateModalOpen] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [editForm, setEditForm] = useState({
    customerName: "",
    emailId: "",
    contactNumber: "",
    gstNo: "",
    address: "",
  });

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/api/customers/getAllCustomers", {
        params: { search, page, size, sortBy, direction },
      });
      setCustomers(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {
      console.error("Error fetching customers", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page, size, sortBy, direction]);

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
      fetchCustomers();
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
      fetchCustomers();
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
      fetchCustomers();
    } catch (err) {
      console.error("Error toggling customer status", err);
    }
  };

  return (
    <div className="p-6">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Customer List</h1>
        <div className="mt-4 sm:mt-0">
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => {
              setPage(0);
              fetchCustomers();
            }}
            className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            Search
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-md">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Sr. No.</th>
              {[
                { key: "customerName", label: "Name" },
                { key: "emailId", label: "Email" },
                { key: "contactNumber", label: "Contact" },
                { key: "gstNo", label: "GST No" },
                { key: "address", label: "Address" },
                { key: "sites", label: "Sites" },
                { key: "actions", label: "Actions" },
              ].map((col) => (
                <th
                  key={col.key}
                  onClick={["sites", "actions"].includes(col.key) ? undefined : () => handleSort(col.key)}
                  className={`px-6 py-3 ${
                    ["sites", "actions"].includes(col.key) ? "" : "cursor-pointer hover:bg-gray-200 transition"
                  }`}
                >
                  <div className="flex items-center">
                    {col.label}
                    {sortBy === col.key && (
                      <span className="ml-1 text-gray-500">{direction === "asc" ? "▲" : "▼"}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-6 text-gray-500 italic">
                  Loading...
                </td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-6 text-gray-500 italic">
                  No customers found
                </td>
              </tr>
            ) : (
              customers.map((c, index) => (
                <tr key={c.customerId} className="border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4">{page * size + index + 1}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{c.customerName}</td>
                  <td className="px-6 py-4">{c.emailId}</td>
                  <td className="px-6 py-4">{c.contactNumber}</td>
                  <td className="px-6 py-4">{c.gstNo}</td>
                  <td className="px-6 py-4">{c.address}</td>
                  <td className="px-6 py-4">
                    {c.sites && c.sites.length > 0 ? (
                      <button
                        onClick={() => handleViewSites(c.sites)}
                        className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                      >
                        View Sites ({c.sites.length})
                      </button>
                    ) : (
                      <span className="text-gray-400 italic">No sites</span>
                    )}
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => handleEditCustomer(c)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCustomer(c)}
                      className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleActivateCustomer(c)}
                      className={`px-3 py-1 rounded-lg text-white transition ${
                        c.active ? "bg-gray-500 hover:bg-gray-600" : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {c.active ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <button
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
          className={`px-4 py-2 rounded-lg shadow ${
            page === 0
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {page + 1} of {totalPages}
        </span>
        <button
          disabled={page + 1 >= totalPages}
          onClick={() => setPage(page + 1)}
          className={`px-4 py-2 rounded-lg shadow ${
            page + 1 >= totalPages
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Next
        </button>
      </div>

      {/* Modals */}
      <ActionModal isOpen={sitesModalOpen} onCancel={() => setSitesModalOpen(false)}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {selectedCustomerSites.map((site) => (
            <div
              key={site.siteId}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition flex flex-col"
            >
              <h3 className="font-semibold text-gray-800">{site.siteName}</h3>
              <p className="text-gray-500 text-sm">{site.address || "No address"}</p>
            </div>
          ))}
        </div>
      </ActionModal>

      <ActionModal isOpen={editModalOpen} onCancel={() => setEditModalOpen(false)}>
        <div className="space-y-4">
          {["customerName", "emailId", "contactNumber", "gstNo", "address"].map((field) => (
            <div key={field}>
              <label className="block text-gray-700 text-sm mb-1">{field}</label>
              <input
                type="text"
                value={editForm[field]}
                onChange={(e) => setEditForm({ ...editForm, [field]: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setEditModalOpen(false)}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleEditSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Save
            </button>
          </div>
        </div>
      </ActionModal>

      <ActionModal isOpen={deleteModalOpen} onCancel={() => setDeleteModalOpen(false)}>
        <div className="space-y-4">
          <p>
            Are you sure you want to delete <strong>{selectedCustomer?.customerName}</strong>?
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        </div>
      </ActionModal>

      <ActionModal isOpen={activateModalOpen} onCancel={() => setActivateModalOpen(false)}>
        <div className="space-y-4">
          <p>
            Are you sure you want to {selectedCustomer?.active ? "deactivate" : "activate"}{" "}
            <strong>{selectedCustomer?.customerName}</strong>?
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setActivateModalOpen(false)}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              onClick={confirmActivate}
              className={`px-4 py-2 text-white rounded-lg transition ${
                selectedCustomer?.active ? "bg-gray-500 hover:bg-gray-600" : "bg-blue-600 hover:bg-blue-700"
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
