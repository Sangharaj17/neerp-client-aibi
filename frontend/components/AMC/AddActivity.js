'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import axiosInstance from '@/utils/axiosInstance';

export default function AddActivity({ closeModal, leadId , handleActivityAdded , todoid}) {
  const { tenant } = useParams();


  const [todos, setTodos] = useState([]);
  const [executives, setExecutives] = useState([]);
  const [form, setForm] = useState({
    todoId: todoid || '',
    activityByEmpId: '',
    purpose: '',
    todoDate: '',
    time: '',
    venue: '',
  });
   // ✅ Keep todoId in sync with prop
  useEffect(() => {
    if (todoid) {
      setForm((prev) => ({
        ...prev,
        todoId: todoid,
      }));
    }
  }, [todoid]);
  const [error, setError] = useState('');

  // Fetch Todos by leadId
  useEffect(() => {
    if (!leadId) return;


    axiosInstance
      .get(`/api/leadmanagement/lead-todos/by-lead/${leadId}`)
      .then((res) => setTodos(res.data || []))
      .catch((e) => console.error('Failed to fetch todos', e));
  }, [leadId]);

  // Fetch Executives
  useEffect(() => {
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

    if (!form.todoId || !form.activityByEmpId || !form.purpose || !form.todoDate || !form.time || !form.venue) {
      setError('All fields are required.');
      return;
    }

    const payload = {
      leadId: parseInt(leadId, 10),
      todoId: parseInt(form.todoId, 10),
      feedback: form.purpose,
      activityDate: form.todoDate,
      activityTime: form.time,
    };

    try {
      await axiosInstance.post('/api/leadmanagement/lead-activity', payload, {
        headers: { 'Content-Type': 'application/json' },
      });
      toast.success('Activity added successfully.');
      handleActivityAdded(true);
      closeModal();
    } catch (err) {
      console.error('Submit error:', err);
      const msg = err.response?.data || err.message;
      setError(`Failed to save: ${typeof msg === 'string' ? msg : JSON.stringify(msg)}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">Add Activity</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg">{error}</div>
      )}

      <div className="grid gap-6">
        {/* Todo Dropdown */}
        <div>
          <label className="block font-semibold mb-2 text-gray-700">Select Todo</label>
          <select
            name="todoId"
            value={form.todoId}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">-- Choose Todo --</option>
            {todos.map((todo) => (
              <option key={todo.todoId} value={todo.todoId}>
                {todo.purpose} | {todo.todoDate}
              </option>
            ))}
          </select>
        </div>

        {/* Executive Dropdown */}
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
          <label className="block font-semibold mb-2 text-gray-700">Purpose / Feedback</label>
          <input
            name="purpose"
            value={form.purpose}
            onChange={handleChange}
            placeholder="Enter purpose or feedback"
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
            Save Activity
          </button>
        </div>
      </div>
    </div>
  );
}
