"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import CustomerSiteTodoForm from "./CustomerSiteTodoForm";
import ActionModal from "../AMC/ActionModal";

export default function CustomerSiteTodoList() {
  const [todos, setTodos] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // 'list' or 'grid'

  const fetchTodos = async () => {
    try {
      const res = await axiosInstance.get(
        "/api/customer/customer-site-todos/serchAllCustomerSiteTodos",
        { params: { search, page, size: 10 } }
      );
      setTodos(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Error fetching todos:", err);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [page, search]);

  const renderStatus = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-semibold";
    switch (status.toLowerCase()) {
      case "pending":
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Pending</span>;
      case "completed":
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>Completed</span>;
      case "in-progress":
        return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>In Progress</span>;
      default:
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{status}</span>;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 rounded-2xl shadow-lg">

         {/* Heading */}
  <h1 className="text-3xl font-bold text-gray-800 mb-6">
    Customer Sites Todo List
  </h1>
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <input
          type="text"
          placeholder="Search by customer, site, or purpose..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded-lg shadow-md ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 hover:bg-gray-100'}`}
            onClick={() => setViewMode("list")}
          >
            List View
          </button>
          <button
            className={`px-4 py-2 rounded-lg shadow-md ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 hover:bg-gray-100'}`}
            onClick={() => setViewMode("grid")}
          >
            Grid View
          </button>
          <button
            type="button"
            className="bg-blue-600 text-white hover:bg-blue-700 px-5 py-2 rounded-lg shadow-md transition"
            onClick={() => setIsModalOpen(true)}
          >
            Add Todo
          </button>
        </div>
      </div>

      {/* List View */}
      {viewMode === "list" && (
        <div className="overflow-x-auto rounded-xl shadow-inner bg-white">
          <table className="w-full table-auto border-collapse">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-4 border-b border-gray-200">Sr. No</th>
                <th className="p-4 border-b border-gray-200">Customer</th>
                <th className="p-4 border-b border-gray-200">Site</th>
                <th className="p-4 border-b border-gray-200">Purpose</th>
                <th className="p-4 border-b border-gray-200">Date</th>
                <th className="p-4 border-b border-gray-200">Time</th>
                <th className="p-4 border-b border-gray-200">Status</th>
              </tr>
            </thead>
            <tbody>
              {todos.length > 0 ? (
                todos.map((t, idx) => (
                  <tr key={t.todoId} className="hover:bg-gray-50 transition">
                    <td className="p-4 border-b border-gray-200">{page * 10 + idx + 1}</td>
                    <td className="p-4 border-b border-gray-200">{t.customerName}</td>
                    <td className="p-4 border-b border-gray-200">{t.siteName}</td>
                    <td className="p-4 border-b border-gray-200">{t.purpose}</td>
                    <td className="p-4 border-b border-gray-200">{t.date}</td>
                    <td className="p-4 border-b border-gray-200">{t.time}</td>
                    <td className="p-4 border-b border-gray-200">{renderStatus(t.status)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center p-6 text-gray-400">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {todos.length > 0 ? (
            todos.map((t, idx) => (
              <div key={t.todoId} className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition relative">
                <div className="absolute top-2 right-3 text-sm text-gray-400 font-semibold">
                  #{page * 10 + idx + 1}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{t.customerName}</h3>
                <p className="text-gray-600 mb-1"><span className="font-semibold">Site:</span> {t.siteName}</p>
                <p className="text-gray-600 mb-1"><span className="font-semibold">Purpose:</span> {t.purpose}</p>
                <p className="text-gray-600 mb-1"><span className="font-semibold">Date:</span> {t.date}</p>
                <p className="text-gray-600 mb-2"><span className="font-semibold">Time:</span> {t.time}</p>
                <div className="mt-2">{renderStatus(t.status)}</div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-400 p-6">
              No records found
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6 gap-4">
        <button
          className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 transition"
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
          disabled={page === 0}
        >
          Previous
        </button>
        <span className="text-gray-700 font-medium">
          Page {page + 1} of {totalPages}
        </span>
        <button
          className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 transition"
          onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
          disabled={page >= totalPages - 1}
        >
          Next
        </button>
      </div>

      {/* ActionModal for Add Todo */}
      <ActionModal
        isOpen={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        title="Create Customer Site Todo"
      >
        <CustomerSiteTodoForm
          onSuccess={fetchTodos}
          onClose={() => setIsModalOpen(false)}
        />
      </ActionModal>
    </div>
  );
}
