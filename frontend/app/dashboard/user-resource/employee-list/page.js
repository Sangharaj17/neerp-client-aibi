'use client';

import { useEffect, useMemo, useState } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import * as XLSX from 'xlsx';

function EmployeeListPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [debug, setDebug] = useState({ baseURL: '', fired: false, lastStatus: '', count: 0 });
  const [form, setForm] = useState({
    employeeName: '',
    contactNumber: '',
    emailId: '',
    address: '',
    username: '',
    password: '',
    employeeCode: '',
    active: true,
  });

  useEffect(() => {
    // Debug: show axios baseURL and signal mount
    try {
      console.log('[EmployeeList] mounted, baseURL =', axiosInstance.defaults.baseURL);
      setDebug(d => ({ ...d, baseURL: axiosInstance.defaults.baseURL || '' }));
    } catch (_) {}

    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axiosInstance.get('/api/employees');
        console.log('[EmployeeList] GET /api/employees →', res.status, res.data);
        setEmployees(Array.isArray(res.data) ? res.data : []);
        setDebug(d => ({ ...d, fired: true, lastStatus: String(res.status), count: Array.isArray(res.data) ? res.data.length : 0 }));
      } catch (e) {
        console.error('[EmployeeList] Failed to load employees', e);
        setError('Failed to load employees');
        setDebug(d => ({ ...d, fired: true, lastStatus: 'error' }));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    console.log('[EmployeeList] employees state:', employees);
  }, [employees]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return employees;
    return employees.filter(e =>
      [e.employeeName, e.emailId, e.contactNumber, e.employeeCode, e.username]
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
      Role: e.role?.roleName || '',
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
      const payload = {
        ...form,
        address: form.address || '-',
        emailId: form.emailId || '-',
        contactNumber: form.contactNumber || '-',
        empPhoto: 'N/A',
        dob: '2000-01-01',
        joiningDate: '2000-01-01',
      };
      const res = await axiosInstance.post('/api/employees', payload);
      setEmployees(prev => [res.data, ...prev]);
      setShowAdd(false);
      setForm({ employeeName: '', contactNumber: '', emailId: '', address: '', username: '', password: '', employeeCode: '', active: true });
    } catch (e) {
      console.error('[EmployeeList] Save error:', e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Employee List</h1>
        <div className="flex items-center gap-2">
          <button onClick={exportToExcel} className="h-9 px-3 rounded-md border border-gray-200 bg-white text-sm text-gray-700 hover:bg-gray-50 shadow-sm">Export to Excel</button>
          <button onClick={() => setShowAdd(true)} className="h-9 px-3 rounded-md bg-gray-900 text-white text-sm hover:bg-gray-800 shadow-sm">Add New Employee</button>
        </div>
      </div>

      <div className="text-xs text-gray-500 border border-gray-200 rounded-md p-2 bg-white shadow-sm">
        <div>API baseURL: {debug.baseURL || '(empty)'} </div>
        <div>Request fired: {String(debug.fired)} | status: {debug.lastStatus} | rows: {debug.count}</div>
        <button
          className="mt-2 h-7 px-2 rounded-md border border-gray-200 bg-white hover:bg-gray-50"
          onClick={async () => {
            try {
              const r = await axiosInstance.get('/api/employees');
              console.log('[EmployeeList] Manual GET /api/employees →', r.status, r.data);
              setEmployees(Array.isArray(r.data) ? r.data : []);
              setDebug(d => ({ ...d, fired: true, lastStatus: String(r.status), count: Array.isArray(r.data) ? r.data.length : 0 }));
            } catch (e) {
              console.error('[EmployeeList] Manual GET error', e);
              setDebug(d => ({ ...d, fired: true, lastStatus: 'error' }));
            }
          }}
        >Test request</button>
      </div>

      <div className="flex items-center gap-3">
        <label className="text-sm text-gray-600">Show</label>
        <select
          className="h-9 rounded-md border border-gray-300 bg-white px-2 text-sm shadow-sm"
          value={pageSize}
          onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
        >
          {[10, 25, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
        <span className="text-sm text-gray-600">entries</span>
        <div className="ml-auto relative">
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search..."
            className="h-9 w-64 rounded-md border border-gray-300 bg-white pl-3 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 shadow-sm"
          />
        </div>
      </div>

      <div className="border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-3 text-left text-xs font-medium uppercase tracking-wide">Sr.No.</th>
                <th className="p-3 text-left text-xs font-medium uppercase tracking-wide">Name</th>
                <th className="p-3 text-left text-xs font-medium uppercase tracking-wide">Role</th>
                <th className="p-3 text-left text-xs font-medium uppercase tracking-wide">Mobile No.</th>
                <th className="p-3 text-left text-xs font-medium uppercase tracking-wide">Email Id</th>
                <th className="p-3 text-left text-xs font-medium uppercase tracking-wide">Address</th>
                <th className="p-3 text-left text-xs font-medium uppercase tracking-wide">Username</th>
                <th className="p-3 text-left text-xs font-medium uppercase tracking-wide">Status</th>
                <th className="p-3 text-left text-xs font-medium uppercase tracking-wide">Employee Code</th>
                <th className="p-3 text-left text-xs font-medium uppercase tracking-wide">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan="10" className="p-6 text-center text-gray-500">Loading...</td></tr>
              )}
              {!loading && pageRows.length === 0 && (
                <tr><td colSpan="10" className="p-6 text-center text-gray-500">No data</td></tr>
              )}
              {!loading && pageRows.map((e, idx) => (
                <tr key={e.employeeId || idx} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="p-3">{start + idx + 1}</td>
                  <td className="p-3 whitespace-nowrap">{e.employeeName}</td>
                  <td className="p-3">{e.role?.roleName || '-'}</td>
                  <td className="p-3">{e.contactNumber}</td>
                  <td className="p-3">{e.emailId}</td>
                  <td className="p-3 max-w-xs truncate" title={e.address}>{e.address}</td>
                  <td className="p-3">{e.username}</td>
                  <td className="p-3">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs border ${e.active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                      {e.active ? 'Active' : 'Deactivate'}
                    </span>
                  </td>
                  <td className="p-3">{e.employeeCode}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <button className="h-8 px-2 rounded-md border border-gray-200 bg-white text-xs hover:bg-gray-50 shadow-sm">Edit</button>
                      <button className="h-8 px-2 rounded-md border border-gray-200 bg-white text-xs text-red-600 hover:bg-red-50 shadow-sm">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between p-3 border-t border-gray-200 text-sm bg-gray-50">
          <div>Showing {pageRows.length === 0 ? 0 : start + 1} to {start + pageRows.length} of {filtered.length} entries</div>
          <div className="flex items-center gap-2">
            <button disabled={currentPage === 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="h-8 px-2 rounded-md border border-gray-200 bg-white disabled:opacity-50 hover:bg-gray-50 shadow-sm">Previous</button>
            <div className="px-2">{currentPage} / {totalPages}</div>
            <button disabled={currentPage === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="h-8 px-2 rounded-md border border-gray-200 bg-white disabled:opacity-50 hover:bg-gray-50 shadow-sm">Next</button>
          </div>
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="w-full max-w-2xl rounded-lg bg-white p-4 shadow">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Add New Employee</h2>
              <button onClick={() => setShowAdd(false)} className="h-8 w-8 rounded-md border">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <TextField label="Name" value={form.employeeName} onChange={v => setForm(f => ({ ...f, employeeName: v }))} />
              <TextField label="Employee Code" value={form.employeeCode} onChange={v => setForm(f => ({ ...f, employeeCode: v }))} />
              <TextField label="Mobile No." value={form.contactNumber} onChange={v => setForm(f => ({ ...f, contactNumber: v }))} />
              <TextField label="Email Id" value={form.emailId} onChange={v => setForm(f => ({ ...f, emailId: v }))} />
              <TextField label="Username" value={form.username} onChange={v => setForm(f => ({ ...f, username: v }))} />
              <TextField label="Password" type="password" value={form.password} onChange={v => setForm(f => ({ ...f, password: v }))} />
              <div className="col-span-2">
                <label className="block text-xs text-gray-600 mb-1">Address</label>
                <textarea className="w-full rounded-md border px-3 py-2 text-sm" rows="3" value={form.address} onChange={(e) => setForm(f => ({ ...f, address: e.target.value }))} />
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <input id="active" type="checkbox" checked={form.active} onChange={(e) => setForm(f => ({ ...f, active: e.target.checked }))} />
                <label htmlFor="active" className="text-sm">Active</label>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button onClick={() => setShowAdd(false)} className="h-9 px-3 rounded-md border text-sm">Cancel</button>
              <button disabled={saving} onClick={handleSave} className="h-9 px-3 rounded-md bg-blue-600 text-white text-sm disabled:opacity-50">{saving ? 'Saving...' : 'Save'}</button>
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
      <label className="block text-xs text-gray-600 mb-1">{label}</label>
      <input
        type={type}
        className="w-full h-9 rounded-md border px-3 text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default function Page() {
  return <EmployeeListPage />;
}