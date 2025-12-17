"use client";

import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Pencil, Trash2, Plus, Search, X, RotateCcw, Loader2, ChevronDown } from 'lucide-react';
import PageHeader from '@/components/UI/PageHeader';
import FilterDropdown from '@/components/Filter/FilterDropdown';
import { useRouter, useParams } from "next/navigation";
import axiosInstance from '@/utils/axiosInstance';
import toast from 'react-hot-toast';

export default function TodoListPage() {
  const [todos, setTodos] = useState([]);
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [sortConfig, setSortConfig] = useState({ key: 'todoDate', direction: 'desc' }); // Default: latest first
  const [columnFilters, setColumnFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [leads, setLeads] = useState([]);
  const [executives, setExecutives] = useState([]);
  const [leadSearch, setLeadSearch] = useState('');
  const [showLeadDropdown, setShowLeadDropdown] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    leadId: '',
    activityByEmpId: '',
    purpose: '',
    todoDate: '',
    time: '',
    venue: '',
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchTodos();
    fetchLeads();
    fetchExecutives();
  }, []);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/api/leadmanagement/lead-todos', {
        params: { search: '', page: 0, size: 1000 },
      });
      setTodos(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch todos', err);
      toast.error('Failed to load To-Do list');
    } finally {
      setLoading(false);
    }
  };

  const fetchLeads = async () => {
    try {
      const res = await axiosInstance.get('/api/leadmanagement/leads', {
        params: { search: '', page: 0, size: 500 },
      });
      setLeads(res.data.data || []);
    } catch (e) {
      console.error('Failed to fetch leads', e);
    }
  };

  const fetchExecutives = async () => {
    try {
      const res = await axiosInstance.get('/api/employees/executives');
      const formatted = res.data.map((emp) => ({
        employeeId: emp.employeeId,
        employeeName: emp.employeeName,
      }));
      setExecutives(formatted);
    } catch (e) {
      console.error('Failed to fetch executives', e);
    }
  };

  // Filter and sort data
  const filteredAndSorted = useMemo(() => {
    const lower = search.toLowerCase();

    // Search across ALL columns
    let filtered = todos.filter((todo) => {
      const searchFields = [
        todo.customerName,
        todo.leadCompanyName,
        todo.activityByEmpName,
        todo.purpose,
        todo.todoDate,
        todo.time,
        todo.venue
      ];
      return searchFields.some(field =>
        (field || '').toLowerCase().includes(lower)
      );
    });

    // Apply column filters
    Object.entries(columnFilters).forEach(([key, { values }]) => {
      if (values && values.length > 0) {
        filtered = filtered.filter((todo) => values.includes(todo[key] || ''));
      }
    });

    // Sort - default by date descending (latest first)
    if (sortConfig) {
      filtered = [...filtered].sort((a, b) => {
        let aVal = a[sortConfig.key] || '';
        let bVal = b[sortConfig.key] || '';

        // Special handling for date sorting
        if (sortConfig.key === 'todoDate') {
          aVal = new Date(aVal).getTime() || 0;
          bVal = new Date(bVal).getTime() || 0;
          return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
        }

        return sortConfig.direction === 'asc'
          ? String(aVal).localeCompare(String(bVal), undefined, { numeric: true, sensitivity: 'base' })
          : String(bVal).localeCompare(String(aVal), undefined, { numeric: true, sensitivity: 'base' });
      });
    }

    return filtered;
  }, [todos, search, sortConfig, columnFilters]);

  const paginated = filteredAndSorted.slice(currentPage * pageSize, currentPage * pageSize + pageSize);
  const totalPages = Math.ceil(filteredAndSorted.length / pageSize);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleResetFilters = () => {
    setSearch('');
    setSortConfig({ key: 'todoDate', direction: 'desc' });
    setColumnFilters({});
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

  const handleDelete = async (todoId) => {
    if (!confirm('Are you sure you want to delete this To-Do?')) return;
    try {
      await axiosInstance.delete(`/api/leadmanagement/lead-todos/${todoId}`);
      toast.success('To-Do deleted successfully');
      fetchTodos();
    } catch (err) {
      console.error('Delete failed', err);
      toast.error('Failed to delete To-Do');
    }
  };

  // Modal handlers
  const openAddModal = () => {
    setEditingTodo(null);
    setForm({
      leadId: '',
      activityByEmpId: '',
      purpose: '',
      todoDate: new Date().toISOString().split('T')[0],
      time: '',
      venue: '',
    });
    setFormErrors({});
    setLeadSearch('');
    setShowModal(true);
  };

  const openEditModal = (todo) => {
    setEditingTodo(todo);
    setForm({
      leadId: todo.leadId || '',
      activityByEmpId: todo.activityByEmpId || '',
      purpose: todo.purpose || '',
      todoDate: todo.todoDate || '',
      time: todo.time || '',
      venue: todo.venue || '',
    });
    setFormErrors({});
    setLeadSearch('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTodo(null);
    setFormErrors({});
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const selectLead = (lead) => {
    setForm(f => ({ ...f, leadId: lead.leadId }));
    setLeadSearch(`${lead.leadCompanyName} - ${lead.siteName}`);
    setShowLeadDropdown(false);
  };

  const filteredLeads = useMemo(() => {
    if (!leadSearch) return leads;
    const lower = leadSearch.toLowerCase();
    return leads.filter(lead =>
      (lead.leadCompanyName || '').toLowerCase().includes(lower) ||
      (lead.siteName || '').toLowerCase().includes(lower) ||
      (lead.customerName || '').toLowerCase().includes(lower)
    );
  }, [leads, leadSearch]);

  const validateForm = () => {
    const errors = {};
    if (!form.leadId) errors.leadId = 'Lead is required';
    if (!form.activityByEmpId) errors.activityByEmpId = 'Executive is required';
    if (!form.purpose) errors.purpose = 'Purpose is required';
    if (!form.todoDate) errors.todoDate = 'Date is required';
    if (!form.time) errors.time = 'Time is required';
    if (!form.venue) errors.venue = 'Venue is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSaving(true);
    const payload = {
      leadId: parseInt(form.leadId, 10),
      activityByEmpId: parseInt(form.activityByEmpId, 10),
      purpose: form.purpose.toUpperCase(),
      todoDate: form.todoDate,
      time: form.time,
      venue: form.venue.toUpperCase(),
    };

    try {
      if (editingTodo) {
        await axiosInstance.put(`/api/leadmanagement/lead-todos/${editingTodo.todoId}`, payload);
        toast.success('To-Do updated successfully');
      } else {
        await axiosInstance.post('/api/leadmanagement/lead-todos', payload);
        toast.success('To-Do added successfully');
      }
      closeModal();
      fetchTodos();
    } catch (err) {
      console.error('Submit error:', err);
      const msg = err.response?.data || err.message;
      toast.error(`Failed to save: ${typeof msg === 'string' ? msg : JSON.stringify(msg)}`);
    } finally {
      setSaving(false);
    }
  };

  const handleAddActivity = async (todo) => {
    try {
      let leadId = todo.leadId ?? todo.lead?.leadId;
      if (!leadId) {
        try {
          const res = await axiosInstance.get(`/api/leadmanagement/lead-todos/${todo.todoId}`);
          const detail = res.data || res.data?.data || {};
          leadId = detail.leadId ?? detail.lead?.leadId;
        } catch (err) {
          console.warn('Could not fetch todo detail to get leadId', err);
        }
      }
      if (leadId) {
        router.push(`/dashboard/lead-management/activity-list/add-activity?leadId=${leadId}&todoId=${todo.todoId}`);
      } else {
        router.push(`/dashboard/lead-management/activity-list/add-activity?todoId=${todo.todoId}`);
      }
    } catch (err) {
      console.error('Failed to navigate to add activity', err);
      toast.error('Failed to navigate');
    }
  };

  const selectedLead = leads.find((l) => String(l.leadId) === String(form.leadId));

  const columns = [
    { key: 'customerName', label: 'Customer Name' },
    { key: 'leadCompanyName', label: 'Company' },
    { key: 'activityByEmpName', label: 'Executive' },
    { key: 'purpose', label: 'Purpose' },
    { key: 'todoDate', label: 'Date' },
    { key: 'time', label: 'Time' },
    { key: 'venue', label: 'Venue' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <PageHeader title="To Do List" description={`${filteredAndSorted.length} tasks`} />

      <div className="px-6 py-5">
        {/* Actions Bar */}
        <div className="flex flex-wrap justify-between items-center mb-5 gap-3">
          <button
            onClick={openAddModal}
            className="bg-neutral-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-neutral-800 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add To Do
          </button>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search all columns..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(0); }}
                className="pl-9 pr-4 py-2 border border-neutral-300 rounded-lg text-sm w-72 focus:outline-none focus:ring-2 focus:ring-neutral-200 transition"
              />
            </div>

            <button
              onClick={handleResetFilters}
              className="px-3 py-2 border border-neutral-300 rounded-lg text-sm hover:bg-neutral-50 transition flex items-center gap-2 text-neutral-600"
              title="Reset Filters"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>

            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(0);
              }}
              className="px-3 py-2 border border-neutral-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-neutral-200 transition"
            >
              {[10, 25, 50, 100].map((n) => (
                <option key={n} value={n}>Show {n}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-neutral-200 rounded-lg">
          <table className="min-w-full w-full text-sm">
            <thead>
              <tr className="bg-neutral-100">
                <th className="text-left px-4 py-3 font-semibold text-neutral-700 border-b border-neutral-200 w-16">Sr.</th>
                {columns.map(col => (
                  <th
                    key={col.key}
                    className="text-left px-4 py-3 font-semibold text-neutral-700 border-b border-neutral-200"
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      <FilterDropdown
                        columnKey={col.key}
                        columnData={todos.map(t => t[col.key] || '')}
                        onFilter={handleColumnFilter}
                      />
                    </div>
                  </th>
                ))}
                <th className="text-center px-4 py-3 font-semibold text-neutral-700 border-b border-neutral-200 w-28">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length + 2} className="text-center py-10">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-neutral-400" />
                    <p className="text-neutral-500 mt-2">Loading...</p>
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 2} className="text-center py-10 text-neutral-500">
                    No tasks found.
                  </td>
                </tr>
              ) : (
                paginated.map((todo, idx) => (
                  <tr key={todo.todoId} className="hover:bg-neutral-50 transition border-b border-neutral-100">
                    <td className="px-4 py-3 text-neutral-600">{currentPage * pageSize + idx + 1}</td>
                    <td className="px-4 py-3">{todo.customerName || '-'}</td>
                    <td className="px-4 py-3">{todo.leadCompanyName || '-'}</td>
                    <td className="px-4 py-3">{todo.activityByEmpName || '-'}</td>
                    <td className="px-4 py-3">{todo.purpose || '-'}</td>
                    <td className="px-4 py-3">{todo.todoDate || '-'}</td>
                    <td className="px-4 py-3">{todo.time || '-'}</td>
                    <td className="px-4 py-3">{todo.venue || '-'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => openEditModal(todo)}
                          className="p-1.5 hover:bg-blue-100 rounded transition"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4 text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleAddActivity(todo)}
                          className="p-1.5 hover:bg-green-100 rounded transition"
                          title="Add Activity"
                        >
                          <Plus className="w-4 h-4 text-green-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(todo.todoId)}
                          className="p-1.5 hover:bg-red-100 rounded transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-5 flex items-center justify-between flex-wrap gap-2">
          <p className="text-sm text-neutral-500">
            Showing {filteredAndSorted.length === 0 ? 0 : currentPage * pageSize + 1} to{' '}
            {Math.min((currentPage + 1) * pageSize, filteredAndSorted.length)} of {filteredAndSorted.length} entries
          </p>
          <div className="flex gap-1">
            <button
              disabled={currentPage === 0}
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              className="px-3 py-1.5 border border-neutral-300 rounded-lg text-sm hover:bg-neutral-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="px-3 py-1.5 border border-neutral-900 bg-neutral-900 text-white rounded-lg text-sm">{currentPage + 1}</div>
            <button
              disabled={currentPage + 1 >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
              className="px-3 py-1.5 border border-neutral-300 rounded-lg text-sm hover:bg-neutral-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div
            className="bg-white w-full max-w-lg rounded-xl shadow-xl overflow-hidden animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
              <h2 className="text-lg font-semibold text-neutral-900">
                {editingTodo ? 'Edit To-Do' : 'Add New To-Do'}
              </h2>
              <button onClick={closeModal} className="p-1 hover:bg-neutral-100 rounded transition">
                <X className="w-5 h-5 text-neutral-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Lead Selection with Search */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Select Lead <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search leads by company or site..."
                    value={leadSearch}
                    onChange={(e) => {
                      setLeadSearch(e.target.value);
                      setShowLeadDropdown(true);
                    }}
                    onFocus={() => setShowLeadDropdown(true)}
                    className={`w-full border px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-200 transition ${formErrors.leadId ? 'border-red-400 bg-red-50' : 'border-neutral-300'
                      }`}
                  />
                  {showLeadDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {filteredLeads.length === 0 ? (
                        <div className="px-3 py-2 text-sm text-neutral-500">No leads found</div>
                      ) : (
                        filteredLeads.slice(0, 20).map((lead) => (
                          <button
                            key={lead.leadId}
                            onClick={() => selectLead(lead)}
                            className={`w-full text-left px-3 py-2 text-sm hover:bg-neutral-100 transition ${form.leadId === lead.leadId ? 'bg-neutral-100 font-medium' : ''
                              }`}
                          >
                            <div className="font-medium">{lead.leadCompanyName}</div>
                            <div className="text-xs text-neutral-500">{lead.siteName} • {lead.customerName}</div>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
                {selectedLead && (
                  <p className="text-xs text-green-600 mt-1">Selected: {selectedLead.leadCompanyName}</p>
                )}
                {formErrors.leadId && <p className="text-xs text-red-500 mt-1">{formErrors.leadId}</p>}
              </div>

              {/* Executive */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Select Executive <span className="text-red-500">*</span>
                </label>
                <select
                  name="activityByEmpId"
                  value={form.activityByEmpId}
                  onChange={handleFormChange}
                  className={`w-full border px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-200 transition ${formErrors.activityByEmpId ? 'border-red-400 bg-red-50' : 'border-neutral-300'
                    }`}
                >
                  <option value="">Select Executive</option>
                  {executives.map((emp) => (
                    <option key={emp.employeeId} value={emp.employeeId}>
                      {emp.employeeName}
                    </option>
                  ))}
                </select>
                {formErrors.activityByEmpId && <p className="text-xs text-red-500 mt-1">{formErrors.activityByEmpId}</p>}
              </div>

              {/* Purpose */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Purpose <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="purpose"
                  value={form.purpose}
                  onChange={handleFormChange}
                  placeholder="Enter purpose"
                  className={`w-full border px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-200 transition uppercase ${formErrors.purpose ? 'border-red-400 bg-red-50' : 'border-neutral-300'
                    }`}
                />
                {formErrors.purpose && <p className="text-xs text-red-500 mt-1">{formErrors.purpose}</p>}
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="todoDate"
                    value={form.todoDate}
                    onChange={handleFormChange}
                    className={`w-full border px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-200 transition ${formErrors.todoDate ? 'border-red-400 bg-red-50' : 'border-neutral-300'
                      }`}
                  />
                  {formErrors.todoDate && <p className="text-xs text-red-500 mt-1">{formErrors.todoDate}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={form.time}
                    onChange={handleFormChange}
                    className={`w-full border px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-200 transition ${formErrors.time ? 'border-red-400 bg-red-50' : 'border-neutral-300'
                      }`}
                  />
                  {formErrors.time && <p className="text-xs text-red-500 mt-1">{formErrors.time}</p>}
                </div>
              </div>

              {/* Venue */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Venue <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="venue"
                  value={form.venue}
                  onChange={handleFormChange}
                  placeholder="Enter venue"
                  className={`w-full border px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-200 transition uppercase ${formErrors.venue ? 'border-red-400 bg-red-50' : 'border-neutral-300'
                    }`}
                />
                {formErrors.venue && <p className="text-xs text-red-500 mt-1">{formErrors.venue}</p>}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-200 bg-neutral-50">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-200 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="px-4 py-2 text-sm bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition disabled:opacity-50 flex items-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {saving ? 'Saving...' : editingTodo ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
