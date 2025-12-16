'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import axiosInstance from '@/utils/axiosInstance';

export default function UpdateLeadStage({ closeModal, leadId, handleStageUpdated, currentLead }) {
  const { tenant } = useParams();

  const [stages, setStages] = useState([]);
  const [selectedStage, setSelectedStage] = useState('');
  const [error, setError] = useState('');

  // Fetch all lead stages
  useEffect(() => {
    axiosInstance
      .get('/api/leadmanagement/lead-stages')
      .then((res) => {
        setStages(res.data || []);
        // Set default value to current lead stage if available
        if (currentLead && currentLead.leadStage && currentLead.leadStage.stageId) {
          setSelectedStage(String(currentLead.leadStage.stageId));
        }
      })
      .catch((e) => console.error('Failed to fetch stages', e));
  }, [currentLead]);

  const handleSubmit = async () => {
    setError('');
    if (!selectedStage) {
      setError('Please select a stage.');
      return;
    }

    try {
      const res = await axiosInstance.put(
        `/api/leadmanagement/leads/${leadId}/stage`,
        {},
        { params: { stageId: selectedStage } }
      );

      const updatedLead = res.data;
      toast.success(
        `Lead stage updated to "${updatedLead.stageName || 'Updated'}" successfully.`
      );

      handleStageUpdated(updatedLead);
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
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
        Update Lead Stage
      </h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg">
          {error}
        </div>
      )}

      {/* Stage Dropdown */}
      <div className="mb-6">
        <label className="block font-semibold mb-2 text-gray-700">Select Stage</label>
        <select
          value={selectedStage}
          onChange={(e) => setSelectedStage(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">-- Choose Stage --</option>
         {stages.map((stage, index) => (
            <option key={stage.stageId ?? `stage-${index}`} value={stage.stageId}>
                {stage.stageName}
            </option>
            ))}

        </select>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all"
        >
          Update Stage
        </button>
      </div>
    </div>
  );
}
