"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Pencil, Trash2, Plus } from 'lucide-react';
import FilterDropdown from '@/components/Filter/FilterDropdown';

import { useRouter, useParams } from "next/navigation";
import axiosInstance from '@/utils/axiosInstance';

export default function TodoListPage() {
  const [todos, setTodos] = useState([]);
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [filtered, setFiltered] = useState([]);
  const [columnFilters, setColumnFilters] = useState({});
  const [sortConfig, setSortConfig] = useState(null);
  const router = useRouter();
  const params = useParams();
  const tenant = params?.tenant;

  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [todos, search, columnFilters, sortConfig]);

  const fetchTodos = async () => {
    try {
      const res = await axiosInstance.get('/api/leadmanagement/lead-todos', {
        params: { search: '', page: 0, size: 1000 },
      });
      setTodos(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch todos', err);
    }
  };

  const applyFilter = () => {
    const lower = search.toLowerCase();
    let f = todos.filter((todo) => {
      const customer = (todo.customerName || '').toLowerCase();
      const company = (todo.leadCompanyName || '').toLowerCase();
      return customer.includes(lower) || company.includes(lower);
    });

    Object.entries(columnFilters).forEach(([key, { values }]) => {
      if (values && values.length > 0) {
        f = f.filter((todo) => values.includes(todo[key] || ''));
      }
    });

    if (sortConfig) {
      f = [...f].sort((a, b) => {
        const aVal = a[sortConfig.key] || '';
        const bVal = b[sortConfig.key] || '';
        return sortConfig.direction === 'asc'
          ? aVal.localeCompare(bVal, undefined, { numeric: true, sensitivity: 'base' })
          : bVal.localeCompare(aVal, undefined, { numeric: true, sensitivity: 'base' });
      });
    }

    setFiltered(f);
    setCurrentPage(0);
  };

  const handleColumnFilter = (columnKey, values, sortDir) => {
    setColumnFilters((prev) => ({
      ...prev,
      [columnKey]: { values }
    }));

    if (sortDir) {
      setSortConfig({ key: columnKey, direction: sortDir });
    }
  };

  const paginated = filtered.slice(currentPage * pageSize, currentPage * pageSize + pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  const handleDelete = async (todoId) => {
    if (!confirm('Are you sure you want to delete this To-Do?')) return;
    try {
      await axiosInstance.delete(`/api/leadmanagement/lead-todos/${todoId}`);
      fetchTodos();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  // <-- UPDATED: async handler to ensure we have leadId then navigate with both leadId & todoId
  const handleAddActivity = async (todo) => {
    try {
      // Some todo objects may already contain leadId; use it if present
      let leadId = todo.leadId ?? todo.lead?.leadId ?? todo.leadId;

      // If leadId not present on the row, fetch todo detail to get leadId
      if (!leadId) {
        try {
          const res = await axios.get(`https://neerp-client-aibi-backend.scrollconnect.com/api/leadmanagement/lead-todos/${todo.todoId}`);
          const detail = res.data || res.data?.data || {};
          leadId = detail.leadId ?? detail.lead?.leadId ?? detail.leadId;
        } catch (err) {
          console.warn('Could not fetch todo detail to get leadId', err);
        }
      }

      if (!leadId) {
        // fallback: still navigate but without leadId (backend endpoint requires leadId; ideally you must have it)
        router.push(`/${tenant}/dashboard/lead-management/activity-list/add-activity?todoId=${todo.todoId}`);
      } else {
        router.push(`/${tenant}/dashboard/lead-management/activity-list/add-activity?leadId=${leadId}&todoId=${todo.todoId}`);
      }
    } catch (err) {
      console.error('Failed to navigate to add activity', err);
    }
  };

  return (
    <div className="p-6 max-w-full mx-auto">
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <h1 className="text-2xl font-semibold">To Do List</h1>
        <div className="flex gap-4 flex-wrap items-center">
          <Link href={`/${tenant}/dashboard/lead-management/to-do-list/add`}>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Add To Do
            </button>
          </Link>
          <div className="flex items-center gap-2">
            <label className="text-sm">Show</label>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(0);
              }}
              className="border p-1 rounded text-sm"
            >
              {[10, 25, 50, 100].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            <span className="text-sm">entries</span>
          </div>
          <div className="ml-4">
            <div className="flex items-center border rounded overflow-hidden">
              <input
                type="text"
                placeholder="SEARCH:"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-2 py-1 text-sm outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto border rounded">
        <table className="min-w-[1000px] w-full text-sm border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="bg-gray-200 text-left px-3 py-2 border border-gray-300 font-medium">Sr.No.</th>
              {[
                { key: 'customerName', label: 'Customer Name' },
                { key: 'leadCompanyName', label: 'Lead Company Name' },
                { key: 'activityByEmpName', label: 'Executive Name' },
                { key: 'purpose', label: 'To Do Purpose' },
                { key: 'todoDate', label: 'To Do Date' },
                { key: 'time', label: 'To Do Time' },
                { key: 'venue', label: 'Venue' }
              ].map(col => (
                <th key={col.key} className="bg-gray-200 text-left px-3 py-2 border border-gray-300 font-medium">
                  <div className="flex items-center">
                    {col.label}
                    <FilterDropdown
                      columnKey={col.key}
                      columnData={todos.map(t => t[col.key] || '')}
                      onFilter={handleColumnFilter}
                    />
                  </div>
                </th>
              ))}
              <th className="bg-gray-200 text-left px-3 py-2 border border-gray-300 font-medium">Edit Details</th>
              <th className="bg-gray-200 text-left px-3 py-2 border border-gray-300 font-medium">Do Activity</th>
              <th className="bg-gray-200 text-left px-3 py-2 border border-gray-300 font-medium">Delete</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((todo, idx) => (
              <tr key={todo.todoId} className="hover:bg-gray-50">
                <td className="px-3 py-2 border border-gray-300">{currentPage * pageSize + idx + 1}</td>
                <td className="px-3 py-2 border border-gray-300">{todo.customerName || '-'}</td>
                <td className="px-3 py-2 border border-gray-300">{todo.leadCompanyName || '-'}</td>
                <td className="px-3 py-2 border border-gray-300">{todo.activityByEmpName || '-'}</td>
                <td className="px-3 py-2 border border-gray-300">{todo.purpose}</td>
                <td className="px-3 py-2 border border-gray-300">{todo.todoDate}</td>
                <td className="px-3 py-2 border border-gray-300">{todo.time}</td>
                <td className="px-3 py-2 border border-gray-300">{todo.venue}</td>
                <td className="px-3 py-2 border border-gray-300">
                  <button className="flex items-center gap-1 text-blue-600 hover:underline">
                    <Pencil className="w-4 h-4" /> Edit
                  </button>
                </td>
                <td className="px-3 py-2 border border-gray-300">
                  <button
                    onClick={() => handleAddActivity(todo)}
                    className="flex items-center gap-1 text-green-600 hover:underline"
                  >
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </td>
                <td className="px-3 py-2 border border-gray-300">
                  <button
                    className="flex items-center gap-1 text-red-600 hover:underline"
                    onClick={() => handleDelete(todo.todoId)}
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={11} className="text-center py-4">No records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between flex-wrap gap-2">
        <div className="text-sm">
          Showing {filtered.length === 0 ? 0 : currentPage * pageSize + 1} to{' '}
          {Math.min((currentPage + 1) * pageSize, filtered.length)} of {filtered.length} entries
        </div>
        <div className="flex gap-1">
          <button disabled={currentPage === 0} onClick={() => setCurrentPage((p) => Math.max(0, p - 1))} className="px-3 py-1 border rounded disabled:opacity-50">
            Previous
          </button>
          <div className="px-3 py-1 border rounded bg-gray-200">{currentPage + 1}</div>
          <button disabled={currentPage + 1 >= totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))} className="px-3 py-1 border rounded disabled:opacity-50">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
