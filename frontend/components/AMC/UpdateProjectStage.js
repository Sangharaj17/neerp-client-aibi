'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import axiosInstance from '@/utils/axiosInstance';

export default function UpdateProjectStage({ closeModal, leadId, handleStageUpdated, currentLead }) {
  const { tenant } = useParams();

  const [projectStages, setProjectStages] = useState([]);
  const [selectedStage, setSelectedStage] = useState('');
  const [error, setError] = useState('');

  // Fetch available project stages
  useEffect(() => {
    axiosInstance
      .get('/api/leadmanagement/project-stages')
      .then((res) => {
        setProjectStages(res.data || []);
        // Set default value to current project stage if available
        if (currentLead && currentLead.projectStage && currentLead.projectStage.id) {
          setSelectedStage(String(currentLead.projectStage.id));
        }
      })
      .catch((e) => console.error('Failed to fetch project stages', e));
  }, [currentLead]);

  const handleSubmit = async () => {
    setError('');

    if (!selectedStage) {
      setError('Please select a project stage.');
      return;
    }

        try {
        const res = await axiosInstance.put(
          `/api/leadmanagement/leads/${leadId}/updateProjectStage`,
          {},
          { params: { projectStageId: selectedStage } }
        );

        const updatedLead = res.data; // This is NewLeadsResponseDto

        toast.success(
          `Project stage updated to "${updatedLead.projectStageName || 'Updated'}" successfully.`
        );

        handleStageUpdated(updatedLead); // Pass the updated object instead of true
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
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">Update Project Stage</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg">
          {error}
        </div>
      )}

      {/* Project Stage Dropdown */}
      <div className="mb-6">
        <label className="block font-semibold mb-2 text-gray-700">Select Project Stage</label>
        <select
          value={selectedStage}
          onChange={(e) => setSelectedStage(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">-- Choose Stage --</option>
          {projectStages.map((stage) => (
            <option key={stage.id} value={stage.id}>
              {stage.stageName}
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
          Update Stage
        </button>
      </div>
    </div>
  );
}
