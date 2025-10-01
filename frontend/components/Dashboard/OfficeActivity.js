'use client'

import { useEffect, useState } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import { Search, Plus, Edit2 } from 'lucide-react';
import ActionModal from '../AMC/ActionModal';

// Reusable Todo Item
const TodoItem = ({ item }) => (
  <div className="flex items-center justify-between gap-3 bg-white rounded px-3 py-2 mb-2 border border-gray-200 hover:bg-gray-50">
    <div className="flex items-center gap-3">
      <div className="text-gray-400">¦¦</div>
      <div className="text-sm text-gray-800">
        <div className="font-medium">{item.description || 'Activity'}</div>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <div className="px-2 py-1 rounded text-xs bg-green-100 text-green-700">
        {item.todoDate || 'ASAP'}
      </div>
      <button className="p-1 rounded bg-white border border-blue-200 hover:bg-blue-50">
        <Edit2 className="w-4 h-4 text-blue-600" />
      </button>
    </div>
  </div>
);

export default function OfficeActivity() {
  // --- Office Activities
  const [activities, setActivities] = useState([]);
  const [activitiesPage, setActivitiesPage] = useState(0);
  const [activitiesSize, setActivitiesSize] = useState(10);
  const [activitiesTotalPages, setActivitiesTotalPages] = useState(0);
  const [activitiesSearch, setActivitiesSearch] = useState('');
  const [activitiesLoading, setActivitiesLoading] = useState(false);

  // --- Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [purpose, setPurpose] = useState('');
  const [todoDate, setTodoDate] = useState('');

  // Fetch office activities
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setActivitiesLoading(true);
        const res = await axiosInstance.get('/api/dashboard/pendingOfficeActivities', {
          params: { page: activitiesPage, size: activitiesSize, search: activitiesSearch },
        });
        setActivities(res.data.content || []);
        setActivitiesTotalPages(res.data.totalPages ?? 0);
      } catch (err) {
        console.error('Error fetching office activities:', err);
      } finally {
        setActivitiesLoading(false);
      }
    };
    fetchActivities();
  }, [activitiesPage, activitiesSize, activitiesSearch]);

  // Create new activity
  const handleCreateActivity = async () => {
    if (!purpose || !todoDate) {
      alert('Please fill all fields!');
      return;
    }

    try {
      await axiosInstance.post('/api/office-activities/create', { purpose, todoDate });
      setIsModalOpen(false);
      setPurpose('');
      setTodoDate('');
      setActivitiesPage(0); // reset to first page
      // Refresh list
      const res = await axiosInstance.get('/api/dashboard/pendingOfficeActivities', {
        params: { page: 0, size: activitiesSize, search: activitiesSearch },
      });
      setActivities(res.data.content || []);
      setActivitiesTotalPages(res.data.totalPages ?? 0);
    } catch (err) {
      console.error('Error creating activity:', err);
    }
  };

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Office Activities */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="flex items-center justify-between bg-blue-600 text-white px-4 py-3 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="p-1 bg-blue-700 rounded text-sm">📋</div>
            <div className="font-semibold">Office Activities</div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded hover:bg-blue-100"
          >
            + Add Activity
          </button>
        </div>

        <div className="p-4">
          {/* Search + Size */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 w-full md:w-80">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search activity..."
                  value={activitiesSearch}
                  onChange={(e) => {
                    setActivitiesSearch(e.target.value);
                    setActivitiesPage(0);
                  }}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              <select
                value={activitiesSize}
                onChange={(e) => {
                  setActivitiesSize(Number(e.target.value));
                  setActivitiesPage(0);
                }}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                {[5, 10, 20].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* List */}
          <div className="min-h-[200px]">
            {activitiesLoading ? (
              <div className="text-center py-8 text-gray-500">Loading activities...</div>
            ) : activities.length > 0 ? (
              activities.map((t, idx) => <TodoItem key={idx} item={t} />)
            ) : (
              <div className="text-center py-8 text-gray-500">No office activities</div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-3 text-sm">
            <div className="text-gray-600">
              Page {activitiesPage + 1} of {Math.max(1, activitiesTotalPages)}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActivitiesPage((p) => Math.max(0, p - 1))}
                disabled={activitiesPage === 0}
                className={`px-3 py-1 rounded border text-sm ${activitiesPage === 0 ? 'text-gray-400 bg-gray-100 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
              >
                Prev
              </button>
              <button
                onClick={() => setActivitiesPage((p) => (p + 1 < activitiesTotalPages ? p + 1 : p))}
                disabled={activitiesPage + 1 >= activitiesTotalPages}
                className={`px-3 py-1 rounded border text-sm ${activitiesPage + 1 >= activitiesTotalPages ? 'text-gray-400 bg-gray-100 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Missed Activities (empty for now) */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="flex items-center justify-between bg-blue-600 text-white px-4 py-3 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="p-1 bg-blue-700 rounded text-sm">📌</div>
            <div className="font-semibold">Missed Activities</div>
          </div>
        </div>

        <div className="p-4 min-h-[200px] text-center text-gray-500">
          No missed activities
        </div>
      </div>

      {/* Modal for creating activity */}
      <ActionModal isOpen={isModalOpen} onCancel={() => setIsModalOpen(false)}>
        <h2 className="text-lg font-semibold mb-4">Create Office Activity</h2>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Purpose</label>
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter activity purpose"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">ToDo Date</label>
            <input
              type="date"
              value={todoDate}
              onChange={(e) => setTodoDate(e.target.value)}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="flex justify-end gap-3 mt-2">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded border hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateActivity}
              className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
            >
              Create
            </button>
          </div>
        </div>
      </ActionModal>
    </div>
  );
}
