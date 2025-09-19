'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import axiosInstance from '@/utils/axiosInstance';

export default function UpdateLeadStatus({ closeModal, leadId, handleStatusUpdated }) {
  const { tenant } = useParams();

  const [statuses, setStatuses] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [error, setError] = useState('');

  // Fetch all statuses
  useEffect(() => {
    axiosInstance
      .get('/api/leadmanagement/lead-status')
      .then((res) => setStatuses(res.data || []))
      .catch((e) => console.error('Failed to fetch statuses', e));
  }, []);

  const handleSubmit = async () => {
    setError('');
    if (!selectedStatus) {
      setError('Please select a status.');
      return;
    }

    try {
      const res = await axiosInstance.put(
        `/api/leadmanagement/leads/${leadId}/updateStatus`,
        {},
        { params: { statusId: selectedStatus } }
      );

      const updatedLead = res.data;
      toast.success(
        `Lead status updated to "${updatedLead.statusName || 'Updated'}" successfully.`
      );

      handleStatusUpdated(updatedLead);
      closeModal();
    } catch (err) {
      console.error('Submit error:', err);
      const msg = err.response?.data || err.message;
      setError(
        `Failed to update: ${typeof msg === 'string' ? msg : JSON.stringify(msg)}`
      );
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">Update Lead Status</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg">
          {error}
        </div>
      )}

      {/* Status Dropdown */}
      <div className="mb-6">
        <label className="block font-semibold mb-2 text-gray-700">Select Status</label>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">-- Choose Status --</option>
          {statuses.map((status) => (
            <option key={status.id} value={status.id}>
              {status.statusName}
            </option>
          ))}
        </select>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all"
        >
          Update Status
        </button>
      </div>
    </div>
  );
}
