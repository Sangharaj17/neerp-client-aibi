'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import axiosInstance from '@/utils/axiosInstance';

export default function AddTodoPage() {
  const router = useRouter();
  const { tenant } = useParams();

  const [leads, setLeads] = useState([]);
  const [executives, setExecutives] = useState([]);
  const [form, setForm] = useState({
    leadId: '',
    activityByEmpId: '',
    purpose: '',
    todoDate: '',
    time: '',
    venue: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    // fetch leads
    axiosInstance
      .get('/api/leadmanagement/leads', {
        params: { search: '', page: 0, size: 50 },
      })
      .then((res) => setLeads(res.data.data || []))
      .catch((e) => console.error('Failed to fetch leads', e));

    // fetch executives
    axiosInstance
      .get('/api/employees/executives')
      .then((res) => {
        const formatted = res.data.map((emp) => ({
          employeeId: emp.employeeId,
          employeeName: emp.employeeName,
        }));
        setExecutives(formatted);
      })
      .catch((e) => console.error('Failed to fetch executives', e));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async () => {
    setError('');
    if (!form.leadId) {
      setError('Lead is required');
      return;
    }
    if (!form.activityByEmpId) {
      setError('Executive is required');
      return;
    }
    if (!form.purpose) {
      setError('Purpose is required');
      return;
    }
    if (!form.todoDate) {
      setError('Date is required');
      return;
    }
    if (!form.time) {
      setError('Time is required');
      return;
    }
    if (!form.venue) {
      setError('Venue is required');
      return;
    }

    const payload = {
      leadId: parseInt(form.leadId, 10),
      activityByEmpId: parseInt(form.activityByEmpId, 10),
      purpose: form.purpose,
      todoDate: form.todoDate,
      time: form.time,
      venue: form.venue,
    };

    const url = '/api/leadmanagement/lead-todos';
    console.log('Posting to', url, payload);

    try {
      await axiosInstance.post(url, payload, {
        headers: { 'Content-Type': 'application/json' },
      });
      router.push(`/${tenant}/dashboard/lead-management/to-do-list`);
    } catch (err) {
      console.error('Submit error:', err);
      const msg = err.response?.data || err.message;
      setError(`Failed to save: ${typeof msg === 'string' ? msg : JSON.stringify(msg)}`);
    }
  };

  // selected lead summary
  const selectedLead = leads.find((l) => String(l.leadId) === String(form.leadId));
  const customerDisplay = selectedLead
    ? `${selectedLead.salutations ?? ''} ${selectedLead.customerName ?? ''}`.trim()
    : '';
  const siteDisplay = selectedLead?.siteName || '';

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Add To-Do</h1>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      <div className="grid gap-6">
        <div>
  <label className="block font-medium mb-1">Select Lead</label>
  <select
    name="leadId"
    value={form.leadId}
    onChange={handleChange}
    className="w-full border p-2 rounded"
    required
  >
    <option value="">Select Lead</option>
    {leads.map((lead) => (
      <option key={lead.leadId} value={lead.leadId}>
        {lead.leadCompanyName} {lead.siteName}
      </option>
    ))}
  </select>
</div>



        <div>
          <label className="block font-medium mb-1">Select Executive</label>
          <select
            name="activityByEmpId"
            value={form.activityByEmpId}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select Executive</option>
            {executives.map((emp) => (
              <option key={emp.employeeId} value={emp.employeeId}>
                {emp.employeeName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Purpose</label>
          <input
            name="purpose"
            value={form.purpose}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Enter purpose"
            required
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-medium mb-1">Date</label>
            <input
              type="date"
              name="todoDate"
              value={form.todoDate}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block font-medium mb-1">Time</label>
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">Venue</label>
          <input
            name="venue"
            value={form.venue}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Enter venue"
            required
          />
        </div>

        <div>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
