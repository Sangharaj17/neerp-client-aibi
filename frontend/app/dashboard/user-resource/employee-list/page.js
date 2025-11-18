'use client';

import { useEffect, useMemo, useState } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import * as XLSX from 'xlsx';

function EmployeeListPage() {
  const [employees, setEmployees] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [showAdd, setShowAdd] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [form, setForm] = useState({
    employeeName: '',
    contactNumber: '',
    emailId: '',
    address: '',
    username: '',
    password: '',
    employeeCode: '',
    roleId: null,
    active: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [employeesRes, rolesRes] = await Promise.all([
          axiosInstance.get('/api/employees'),
          axiosInstance.get('/api/roles')
        ]);
        setEmployees(Array.isArray(employeesRes.data) ? employeesRes.data : []);
        setRoles(Array.isArray(rolesRes.data) ? rolesRes.data : []);
      } catch (e) {
        console.error('[EmployeeList] Failed to load data', e);
        setError('Failed to load employees');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return employees;
    return employees.filter(e =>
      [e.employeeName, e.emailId, e.contactNumber, e.employeeCode, e.username, e.role?.role]
        .filter(Boolean)
        .some(v => String(v).toLowerCase().includes(q))
    );
  }, [employees, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageRows = filtered.slice(start, start + pageSize);

  const exportToExcel = () => {
    if (filtered.length === 0) return;
    const data = filtered.map((e, i) => ({
      'Sr. No.': i + 1,
      Name: e.employeeName || '',
      Role: e.role?.role || '',
      'Mobile No.': e.contactNumber || '',
      'Email Id': e.emailId || '',
      Address: e.address || '',
      Username: e.username || '',
      Status: e.active ? 'Active' : 'Deactivate',
      'Employee Code': e.employeeCode || '',
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    ws['!cols'] = [
      { wch: 6 }, { wch: 22 }, { wch: 16 }, { wch: 14 }, { wch: 28 }, { wch: 30 }, { wch: 14 }, { wch: 10 }, { wch: 14 }
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Employees');
    XLSX.writeFile(wb, 'Employees.xlsx');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const selectedRole = roles.find(r => r.roleId === form.roleId);
      const payload = {
        ...form,
        address: form.address || '-',
        emailId: form.emailId || '-',
        contactNumber: form.contactNumber || '-',
        empPhoto: 'N/A',
        dob: '2000-01-01',
        joiningDate: '2000-01-01',
        role: selectedRole || null,
      };
      
      let res;
      if (editingEmployee) {
        // Update existing employee
        res = await axiosInstance.put(`/api/employees/${editingEmployee.employeeId}`, payload);
        setEmployees(prev => prev.map(emp => 
          emp.employeeId === editingEmployee.employeeId ? res.data : emp
        ));
        setEditingEmployee(null);
      } else {
        // Create new employee
        res = await axiosInstance.post('/api/employees', payload);
        setEmployees(prev => [res.data, ...prev]);
      }
      
      setShowAdd(false);
      resetForm();
    } catch (e) {
      console.error('[EmployeeList] Save error:', e);
      setError(e.response?.data?.message || 'Failed to save employee');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setForm({
      employeeName: employee.employeeName || '',
      contactNumber: employee.contactNumber || '',
      emailId: employee.emailId || '',
      address: employee.address || '',
      username: employee.username || '',
      password: '', // Don't pre-fill password
      employeeCode: employee.employeeCode || '',
      roleId: employee.role?.roleId || null,
      active: employee.active !== undefined ? employee.active : true,
    });
    setShowAdd(true);
  };

  const handleDelete = async (employeeId) => {
    if (!confirm('Are you sure you want to delete this employee?')) {
      return;
    }
    
    setDeleting(employeeId);
    try {
      await axiosInstance.delete(`/api/employees/${employeeId}`);
      setEmployees(prev => prev.filter(emp => emp.employeeId !== employeeId));
    } catch (e) {
      console.error('[EmployeeList] Delete error:', e);
      setError(e.response?.data?.message || 'Failed to delete employee');
    } finally {
      setDeleting(null);
    }
  };

  const resetForm = () => {
    setForm({
      employeeName: '',
      contactNumber: '',
      emailId: '',
      address: '',
      username: '',
      password: '',
      employeeCode: '',
      roleId: null,
      active: true,
    });
    setEditingEmployee(null);
  };

  const handleCloseModal = () => {
    setShowAdd(false);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1400px] mx-auto p-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">Employees</h1>
            <p className="text-sm text-neutral-500 mt-1">{filtered.length} total</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={exportToExcel} 
              className="h-9 px-4 rounded-lg border border-neutral-200 bg-white text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              Export
            </button>
            <button 
              onClick={() => setShowAdd(true)} 
              className="h-9 px-4 rounded-lg bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
            >
              Add Employee
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg border border-red-100">
            {error}
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-sm text-neutral-600">Show</span>
            <select
              className="h-9 rounded-lg border border-neutral-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
            >
              {[10, 25, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search employees..."
            className="h-9 w-80 rounded-lg border border-neutral-200 bg-white px-4 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
          />
        </div>

        {/* Table */}
        <div className="border border-neutral-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600">No.</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600">Mobile</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600">Address</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600">Username</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600">Code</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-100">
                {loading && (
                  <tr>
                    <td colSpan="10" className="px-4 py-12 text-center text-neutral-500">
                      Loading...
                    </td>
                  </tr>
                )}
                {!loading && pageRows.length === 0 && (
                  <tr>
                    <td colSpan="10" className="px-4 py-12 text-center text-neutral-500">
                      No employees found
                    </td>
                  </tr>
                )}
                {!loading && pageRows.map((e, idx) => (
                  <tr key={e.employeeId || idx} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-4 py-3 text-neutral-600">{start + idx + 1}</td>
                    <td className="px-4 py-3 font-medium text-neutral-900 whitespace-nowrap">{e.employeeName}</td>
                    <td className="px-4 py-3 text-neutral-600">{e.role?.role || '-'}</td>
                    <td className="px-4 py-3 text-neutral-600">{e.contactNumber}</td>
                    <td className="px-4 py-3 text-neutral-600">{e.emailId}</td>
                    <td className="px-4 py-3 text-neutral-600 max-w-xs truncate" title={e.address}>{e.address}</td>
                    <td className="px-4 py-3 text-neutral-600">{e.username}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        e.active 
                          ? 'bg-green-50 text-green-700' 
                          : 'bg-neutral-100 text-neutral-600'
                      }`}>
                        {e.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-neutral-600">{e.employeeCode}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleEdit(e)}
                          className="text-xs text-neutral-600 hover:text-neutral-900 transition-colors"
                        >
                          Edit
                        </button>
                        <span className="text-neutral-300">·</span>
                        <button 
                          onClick={() => handleDelete(e.employeeId)}
                          disabled={deleting === e.employeeId}
                          className="text-xs text-red-600 hover:text-red-700 transition-colors disabled:opacity-50"
                        >
                          {deleting === e.employeeId ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-200 bg-neutral-50">
            <div className="text-sm text-neutral-600">
              {pageRows.length === 0 ? 'No entries' : `${start + 1}–${start + pageRows.length} of ${filtered.length}`}
            </div>
            <div className="flex items-center gap-2">
              <button 
                disabled={currentPage === 1} 
                onClick={() => setPage(p => Math.max(1, p - 1))} 
                className="h-8 px-3 rounded-lg border border-neutral-200 bg-white text-sm text-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-50 transition-colors"
              >
                Previous
              </button>
              <div className="px-3 text-sm text-neutral-600">
                {currentPage} of {totalPages}
              </div>
              <button 
                disabled={currentPage === totalPages} 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
                className="h-8 px-3 rounded-lg border border-neutral-200 bg-white text-sm text-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Add Employee Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white shadow-2xl">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
              <h2 className="text-lg font-semibold text-neutral-900">
                {editingEmployee ? 'Edit Employee' : 'Add Employee'}
              </h2>
              <button 
                onClick={handleCloseModal} 
                className="h-8 w-8 rounded-lg hover:bg-neutral-100 transition-colors flex items-center justify-center text-neutral-500 hover:text-neutral-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6">
              <div className="grid grid-cols-2 gap-4">
                <TextField label="Name" value={form.employeeName} onChange={v => setForm(f => ({ ...f, employeeName: v }))} />
                <TextField label="Employee Code" value={form.employeeCode} onChange={v => setForm(f => ({ ...f, employeeCode: v }))} />
                <TextField label="Mobile" value={form.contactNumber} onChange={v => setForm(f => ({ ...f, contactNumber: v }))} />
                <TextField label="Email" value={form.emailId} onChange={v => setForm(f => ({ ...f, emailId: v }))} />
                <TextField label="Username" value={form.username} onChange={v => setForm(f => ({ ...f, username: v }))} />
                <TextField 
                  label={editingEmployee ? "Password (leave blank to keep current)" : "Password"} 
                  type="password" 
                  value={form.password} 
                  onChange={v => setForm(f => ({ ...f, password: v }))} 
                />
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Role</label>
                  <select
                    className="w-full h-9 rounded-lg border border-neutral-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                    value={form.roleId || ''}
                    onChange={(e) => setForm(f => ({ ...f, roleId: e.target.value ? Number(e.target.value) : null }))}
                  >
                    <option value="">Select a role</option>
                    {roles.map(role => (
                      <option key={role.roleId} value={role.roleId}>
                        {role.role}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Address</label>
                  <textarea 
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent resize-none" 
                    rows="3" 
                    value={form.address} 
                    onChange={(e) => setForm(f => ({ ...f, address: e.target.value }))} 
                  />
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <input 
                    id="active" 
                    type="checkbox" 
                    checked={form.active} 
                    onChange={(e) => setForm(f => ({ ...f, active: e.target.checked }))}
                    className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                  />
                  <label htmlFor="active" className="text-sm text-neutral-700">
                    Active employee
                  </label>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-200 bg-neutral-50">
              <button 
                onClick={handleCloseModal} 
                className="h-9 px-4 rounded-lg border border-neutral-200 bg-white text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                disabled={saving} 
                onClick={handleSave} 
                className="h-9 px-4 rounded-lg bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? 'Saving...' : editingEmployee ? 'Update Employee' : 'Save Employee'}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

function TextField({ label, type = 'text', value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-2">
        {label}
      </label>
      <input
        type={type}
        className="w-full h-9 rounded-lg border border-neutral-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default function Page() {
  return <EmployeeListPage />;
}