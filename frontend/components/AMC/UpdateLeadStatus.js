'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import axiosInstance from '@/utils/axiosInstance';

export default function UpdateLeadStatus({ closeModal, leadId, handleStatusUpdated, currentLead }) {
  const { tenant } = useParams();

  const [statuses, setStatuses] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [reason, setReason] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [error, setError] = useState('');

  // Fetch all statuses
  useEffect(() => {
    axiosInstance
      .get('/api/leadmanagement/lead-status')
      .then((res) => {
        const statusList = res.data || [];
        setStatuses(statusList);
        // Set default value to current lead status if available
        if (currentLead) {
          // Try to find status by status name string (e.g., "Open", "Closed")
          if (currentLead.status) {
            const currentStatusObj = statusList.find(s => 
              s.statusName?.toLowerCase() === currentLead.status?.toLowerCase()
            );
            if (currentStatusObj) {
              setSelectedStatus(String(currentStatusObj.id));
            }
          }
          // Also check leadStatus if it exists
          else if (currentLead.leadStatus && currentLead.leadStatus.id) {
            setSelectedStatus(String(currentLead.leadStatus.id));
          }
        }
      })
      .catch((e) => console.error('Failed to fetch statuses', e));
  }, [currentLead]);

  const handleSubmit = async () => {
    setError('');
    if (!selectedStatus) {
      setError('Please select a status.');
      return;
    }

    try {
      const selectedStatusObj = statuses.find((s) => s.id === Number(selectedStatus));
      const isClosed = selectedStatusObj?.statusName?.toLowerCase() === 'closed';

      if (isClosed) {
        // Validate reason and expiry date
        if (!reason.trim()) {
          setError('Please provide a reason for closing this lead.');
          return;
        }
        if (!expiryDate) {
          setError('Please select an expiry date.');
          return;
        }

        // ✅ Call new API for closing lead
        await axiosInstance.post(`/api/leadmanagement/leads/${leadId}/close`, {
          reason,
          expiryDate,
        });

        toast.success('Lead successfully marked as closed.');
       // handleStatusUpdated({ leadStatus: 'CLOSED' });
        closeModal();

      } else {
        // ✅ Call existing API for status update
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
      }
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
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
        Update Lead Status
      </h1>

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

      {/* Show extra fields only if status is Closed */}
      {(() => {
        const selectedStatusObj = statuses.find((s) => s.id === Number(selectedStatus));
        const isClosed = selectedStatusObj?.statusName?.toLowerCase() === 'closed';
        if (!isClosed) return null;

        return (
          <>
            <div className="mb-6">
              <label className="block font-semibold mb-2 text-gray-700">
                Reason for Closing
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter reason"
              />
            </div>

            <div className="mb-6">
              <label className="block font-semibold mb-2 text-gray-700">
                Expiry Date
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </>
        );
      })()}

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
