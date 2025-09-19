'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import axiosInstance from '@/utils/axiosInstance';

export default function AddTodo({closeModal , leadId}) {
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

   // Set leadId from props into form
  useEffect(() => {
    if (leadId) {
      setForm((prev) => ({
        ...prev,
        leadId: leadId
      }));
    }
  }, [leadId]);
  
  const [error, setError] = useState('');

  useEffect(() => {
    axiosInstance
      .get('/api/leadmanagement/leads', {
        params: { search: '', page: 0, size: 50 },
      })
      .then((res) => setLeads(res.data.data || []))
      .catch((e) => console.error('Failed to fetch leads', e));

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
    if (!form.leadId || !form.activityByEmpId || !form.purpose || !form.todoDate || !form.time || !form.venue) {
      setError('All fields are required.');
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

    try {
      await axiosInstance.post('/api/leadmanagement/lead-todos', payload, {
        headers: { 'Content-Type': 'application/json' },
      });
        toast.success("Todo added successfully.");

      closeModal();
      //router.push(`/${tenant}/dashboard/lead-management/to-do-list`);
    } catch (err) {
      console.error('Submit error:', err);
      const msg = err.response?.data || err.message;
      setError(`Failed to save: ${typeof msg === 'string' ? msg : JSON.stringify(msg)}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">Add To-Do</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid gap-6">
        {/* Lead Selection */}
        <div>
          <label className="block font-semibold mb-2 text-gray-700">Select Lead</label>
          <select
            name="leadId"
            value={form.leadId}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">-- Choose Lead --</option>
            {leads.map((lead) => (
              <option key={lead.leadId} value={lead.leadId}>
                {lead.leadCompanyName} {lead.siteName}
              </option>
            ))}
          </select>
        </div>

        {/* Executive Selection */}
        <div>
          <label className="block font-semibold mb-2 text-gray-700">Select Executive</label>
          <select
            name="activityByEmpId"
            value={form.activityByEmpId}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">-- Choose Executive --</option>
            {executives.map((emp) => (
              <option key={emp.employeeId} value={emp.employeeId}>
                {emp.employeeName}
              </option>
            ))}
          </select>
        </div>

        {/* Purpose */}
        <div>
          <label className="block font-semibold mb-2 text-gray-700">Purpose</label>
          <input
            name="purpose"
            value={form.purpose}
            onChange={handleChange}
            placeholder="Enter purpose"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Date & Time */}
        <div className="flex gap-6">
          <div className="flex-1">
            <label className="block font-semibold mb-2 text-gray-700">Date</label>
            <input
              type="date"
              name="todoDate"
              value={form.todoDate}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-2 text-gray-700">Time</label>
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Venue */}
        <div>
          <label className="block font-semibold mb-2 text-gray-700">Venue</label>
          <input
            name="venue"
            value={form.venue}
            onChange={handleChange}
            placeholder="Enter venue"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all"
          >
            Save To-Do
          </button>
        </div>
      </div>
    </div>
  );
}
