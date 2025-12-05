import React, { useState, useEffect } from 'react';
import { Save, FileText } from 'lucide-react';
import axiosInstance from '@/utils/axiosInstance';
import toast from 'react-hot-toast';

const InspectionReportSystem = ({
  combinedEnquiryId: combinedEnquiryIdProp,
  reportId = null,
  mode = 'create', // 'create' | 'edit' | 'view'
  onBack = null
}) => {
  const [activeTab, setActiveTab] = useState('create');
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(false);

  // Create/Update Report State
  const [combinedEnquiryId] = useState(combinedEnquiryIdProp || '');
  const [inspectionReportId, setInspectionReportId] = useState(null);
  const [lifts, setLifts] = useState([]);
  const [availableLifts, setAvailableLifts] = useState([]);

  // Fetch initial data
  useEffect(() => {
    fetchCategories();
    fetchStatuses();
  }, []);

  // Auto-load report when reportId is provided (wait for categories to load first)
  useEffect(() => {
    if (reportId && mode !== 'create' && categories.length > 0) {
      fetchReportForEdit(reportId);
    }
  }, [reportId, mode, categories]);

  // Auto-load lifts when creating new report
  useEffect(() => {
    if (mode === 'create' && combinedEnquiryId && lifts.length === 0) {
      fetchLiftsForCombinedEnquiry(combinedEnquiryId);
    }
  }, [mode, combinedEnquiryId]);

  // Determine if fields should be disabled
  const isViewMode = mode === 'view';

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/inspection-report/categories-with-checkpoints');
      setCategories(response.data || []);
    } catch (err) {
      toast.error('Failed to fetch categories: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatuses = async () => {
    try {
      const response = await axiosInstance.get('/api/inspection-report/getAllCheckPointsStatuses');
      setStatuses(response.data || []);
    } catch (err) {
      toast.error('Failed to fetch statuses: ' + err.message);
    }
  };

  const fetchLiftsForCombinedEnquiry = async (combinedEnqId) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/api/inspection-report/add-lifts-data/${combinedEnqId}`);
      const liftDatas = response.data?.liftDatas || [];

      if (liftDatas.length > 0) {
        const transformedLifts = liftDatas.map(liftData => ({
          enquiryId: liftData.enquiryId,
          liftName: liftData.liftName,
          capacityValue: liftData.capacityValue,
          typeOfElevators: liftData.typeOfElevators,
          noOfFloors: liftData.noOfFloors,
          repeatLiftId: null,
          checkpoints: initializeCheckpoints()
        }));

        setLifts(transformedLifts);
        setAvailableLifts(liftDatas);
        toast.success(`Successfully loaded ${liftDatas.length} lift(s)`);
      } else {
        setLifts([]);
        setAvailableLifts([]);
        toast.error('No lifts found for this combined enquiry');
      }
    } catch (err) {
      toast.error('Failed to fetch lifts: ' + err.message);
      setLifts([]);
      setAvailableLifts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchReportForEdit = async (reportId) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/api/inspection-report/edit/${reportId}`);
      const data = response.data || [];

      if (data.length > 0) {
        // First pass: Create a map of database ID -> enquiryId
        const dbIdToEnquiryIdMap = {};
        data.forEach(item => {
          if (item.inspectionReportRepeatLiftDto) {
            const dbId = item.inspectionReportRepeatLiftDto.id;
            const enquiryId = item.inspectionReportRepeatLiftDto.enquiryId;
            if (dbId && enquiryId) {
              dbIdToEnquiryIdMap[dbId] = enquiryId;
            }
          }
        });

        // Second pass: Transform lifts and convert repeatLiftId from DB ID to enquiryId
        const transformedLifts = data.map(item => {
          // Enrich checkpoints with category and checkpoint names
          const enrichedCheckpoints = (item.inspectionReportDtos || []).map(cp => {
            // Find the category and checkpoint details from categories state
            let categoryName = '';
            let checkpointName = '';

            categories.forEach(category => {
              if (category.inspectionCategoryCheckpointDtos) {
                const checkpoint = category.inspectionCategoryCheckpointDtos.find(
                  c => c.id === cp.checkpointId
                );
                if (checkpoint) {
                  categoryName = category.inspectionReportCategoryDto?.categoryName || '';
                  checkpointName = checkpoint.checkpointName || '';
                }
              }
            });

            return {
              ...cp,
              categoryName,
              checkpointName
            };
          });

          // Convert repeatLiftId from database ID to enquiryId for dropdown
          const repeatLiftDbId = item.inspectionReportRepeatLiftDto?.repeatLiftId;
          const repeatLiftEnquiryId = repeatLiftDbId ? dbIdToEnquiryIdMap[repeatLiftDbId] : null;

          return {
            id: item.inspectionReportRepeatLiftDto?.id,
            enquiryId: item.inspectionReportRepeatLiftDto?.enquiryId || '',
            repeatLiftId: repeatLiftEnquiryId, // Use enquiryId for dropdown display
            repeatLiftDbId: repeatLiftDbId, // Store original DB ID for submission
            checkpoints: enrichedCheckpoints
          };
        });

        setLifts(transformedLifts);
        setInspectionReportId(reportId);
        setActiveTab('create');
        toast.success('Report loaded successfully');
      }
    } catch (err) {
      toast.error('Failed to fetch report: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const initializeCheckpoints = () => {
    const checkpoints = [];
    categories.forEach(category => {
      if (category.inspectionCategoryCheckpointDtos) {
        category.inspectionCategoryCheckpointDtos.forEach(checkpoint => {
          checkpoints.push({
            id: null,
            checkpointId: checkpoint.id,
            checkpointName: checkpoint.checkpointName,
            categoryName: category.inspectionReportCategoryDto?.categoryName,
            statusId: statuses[0]?.id || null,
            remark: '',
            repeatLiftId: null
          });
        });
      }
    });
    return checkpoints;
  };



  const updateLift = (index, field, value) => {
    const newLifts = [...lifts];
    newLifts[index][field] = value;

    if (field === 'repeatLiftId' && value) {
      const sourceLiftIndex = newLifts.findIndex(l => l.enquiryId === parseInt(value));

      if (sourceLiftIndex !== -1 && newLifts[sourceLiftIndex].checkpoints) {
        const copiedCheckpoints = newLifts[sourceLiftIndex].checkpoints.map(cp => ({
          ...cp,
          id: null,
          repeatLiftId: null
        }));

        newLifts[index].checkpoints = copiedCheckpoints;
        toast.success(`Copied data from Lift #${sourceLiftIndex + 1}`);
      }
    }

    setLifts(newLifts);
  };

  const updateCheckpoint = (liftIndex, checkpointIndex, field, value) => {
    const newLifts = [...lifts];
    if (!newLifts[liftIndex].checkpoints) {
      newLifts[liftIndex].checkpoints = initializeCheckpoints();
    }
    newLifts[liftIndex].checkpoints[checkpointIndex][field] = value;
    setLifts(newLifts);
  };

  const initializeLiftCheckpoints = (liftIndex) => {
    const newLifts = [...lifts];
    if (!newLifts[liftIndex].checkpoints || newLifts[liftIndex].checkpoints.length === 0) {
      newLifts[liftIndex].checkpoints = initializeCheckpoints();
      setLifts(newLifts);
    }
  };

  const handleSubmit = async () => {
    if (!inspectionReportId && !combinedEnquiryId) {
      toast.error('Please enter Combined Enquiry ID');
      return;
    }

    if (lifts.some(lift => !lift.enquiryId)) {
      toast.error('All lifts must have an Enquiry ID');
      return;
    }

    try {
      setLoading(true);

      // For edit mode, create a map of enquiryId -> database ID
      const enquiryIdToDbIdMap = {};
      if (inspectionReportId) {
        lifts.forEach(lift => {
          if (lift.id && lift.enquiryId) {
            enquiryIdToDbIdMap[lift.enquiryId] = lift.id;
          }
        });
      }

      const payload = {
        inspectionReportAndRepeatLiftsWrapperDtos: lifts.map(lift => {
          // Determine the correct repeatLiftId to send
          let repeatLiftIdToSend = null;
          if (lift.repeatLiftId) {
            if (inspectionReportId) {
              // EDIT mode: Convert enquiryId back to database ID
              repeatLiftIdToSend = enquiryIdToDbIdMap[lift.repeatLiftId] || null;
            } else {
              // CREATE mode: Use enquiryId directly
              repeatLiftIdToSend = parseInt(lift.repeatLiftId);
            }
          }

          return {
            inspectionReportRepeatLiftDto: {
              id: lift.id || null,
              enquiryId: parseInt(lift.enquiryId),
              repeatLiftId: repeatLiftIdToSend,
              inspectionReportsId: inspectionReportId
            },
            inspectionReportDtos: (lift.checkpoints || []).map(cp => ({
              id: cp.id || null,
              checkpointId: cp.checkpointId,
              statusId: cp.statusId,
              remark: cp.remark || '',
              repeatLiftId: cp.repeatLiftId || null
            }))
          };
        })
      };

      const url = `/api/inspection-report/save?${inspectionReportId ? `inspectionReportId=${inspectionReportId}` : `combinedEnquiryId=${combinedEnquiryId}`}`;

      const response = await axiosInstance.post(url, payload);

      toast.success(response.data || 'Report saved successfully');

      if (!inspectionReportId) {
        setLifts([]);
        setAvailableLifts([]);
      }
    } catch (err) {
      toast.error('Failed to save: ' + (err.response?.data || err.message));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setLifts([]);
    setInspectionReportId(null);
    setAvailableLifts([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-gray-100">
          {/* Back Button */}
          {onBack && (
            <div className="px-6 pt-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Reports List
              </button>
            </div>
          )}

          {/* Header */}
          <div className="px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Inspection Reports</h1>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-100">
            <div className="flex px-6">
              <button
                onClick={() => setActiveTab('create')}
                className={`py-3 px-4 text-sm font-medium border-b-2 transition-all ${activeTab === 'create'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                Create / Edit
              </button>
              <button
                onClick={() => setActiveTab('load')}
                className={`py-3 px-4 text-sm font-medium border-b-2 transition-all ${activeTab === 'load'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                Load Report
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'create' ? (
              <div className="space-y-6">
                {/* Report Info */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Combined Enquiry ID
                      </label>
                      <input
                        type="number"
                        value={combinedEnquiryId}
                        disabled
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-100 text-gray-500"
                        placeholder="Enter ID"
                      />
                    </div>
                    {inspectionReportId && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Report ID
                        </label>
                        <input
                          type="text"
                          value={inspectionReportId}
                          disabled
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-100 text-gray-500"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={resetForm}
                      className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
                    >
                      Reset Form
                    </button>
                  </div>
                </div>

                {/* Lifts */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold text-gray-900">
                      Lifts {lifts.length > 0 && <span className="text-sm text-gray-400 font-normal ml-2">({lifts.length})</span>}
                    </h2>
                  </div>

                  {lifts.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                      <p className="text-sm text-gray-500">No lifts loaded. Enter Combined Enquiry ID to get started.</p>
                    </div>
                  ) : (
                    lifts.map((lift, liftIndex) => (
                      <div key={liftIndex} className="bg-white border border-gray-200 rounded-lg p-5 space-y-4 shadow-sm hover:shadow-md transition-shadow">
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">Lift #{liftIndex + 1}</h3>
                          {lift.liftName && (
                            <p className="text-xs text-gray-500 mt-1">
                              {lift.liftName} • {lift.typeOfElevators} • {lift.capacityValue} • {lift.noOfFloors} floors
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">
                              Enquiry ID <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              value={lift.enquiryId}
                              onChange={(e) => updateLift(liftIndex, 'enquiryId', e.target.value)}
                              disabled={availableLifts.length > 0}
                              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                              placeholder="Enter ID"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">
                              Copy From Lift
                            </label>
                            <select
                              value={lift.repeatLiftId ? String(lift.repeatLiftId) : ''}
                              onChange={(e) => updateLift(liftIndex, 'repeatLiftId', e.target.value || null)}
                              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="">Select lift</option>
                              {lifts.map((l, idx) => (
                                idx !== liftIndex && l.enquiryId && (
                                  <option key={idx} value={String(l.enquiryId)}>
                                    Lift #{idx + 1} - {l.enquiryId} {l.liftName ? `(${l.liftName})` : ''}
                                  </option>
                                )
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Checkpoints */}
                        <div className="pt-3 border-t border-gray-100">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-medium text-gray-900">
                              Checkpoints
                              {lift.repeatLiftId && (
                                <span className="ml-2 text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">
                                  Copied
                                </span>
                              )}
                            </h4>
                            {(!lift.checkpoints || lift.checkpoints.length === 0) && (
                              <button
                                onClick={() => initializeLiftCheckpoints(liftIndex)}
                                className="text-xs px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                Initialize
                              </button>
                            )}
                          </div>

                          {lift.checkpoints && lift.checkpoints.length > 0 ? (
                            <div className="overflow-x-auto -mx-5 px-5">
                              <table className="w-full text-xs">
                                <thead>
                                  <tr className="border-b border-gray-200">
                                    <th className="px-3 py-2 text-left font-medium text-gray-700 bg-gray-50">Category</th>
                                    <th className="px-3 py-2 text-left font-medium text-gray-700 bg-gray-50">Checkpoint</th>
                                    <th className="px-3 py-2 text-left font-medium text-gray-700 bg-gray-50">Status</th>
                                    <th className="px-3 py-2 text-left font-medium text-gray-700 bg-gray-50">Remark</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                  {lift.checkpoints.map((checkpoint, cpIndex) => (
                                    <tr key={cpIndex} className="hover:bg-gray-50 transition-colors">
                                      <td className="px-3 py-2.5 text-gray-600">{checkpoint.categoryName}</td>
                                      <td className="px-3 py-2.5 text-gray-900">{checkpoint.checkpointName}</td>
                                      <td className="px-3 py-2.5">
                                        <select
                                          value={checkpoint.statusId || ''}
                                          onChange={(e) => updateCheckpoint(liftIndex, cpIndex, 'statusId', parseInt(e.target.value))}
                                          className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                          <option value="">Select</option>
                                          {statuses.map(status => (
                                            <option key={status.id} value={status.id}>
                                              {status.statusName}
                                            </option>
                                          ))}
                                        </select>
                                      </td>
                                      <td className="px-3 py-2.5">
                                        <input
                                          type="text"
                                          value={checkpoint.remark || ''}
                                          onChange={(e) => updateCheckpoint(liftIndex, cpIndex, 'remark', e.target.value)}
                                          className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                          placeholder="Remark"
                                        />
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <p className="text-xs text-gray-500 py-4 text-center bg-gray-50 rounded-lg">
                              Click "Initialize" to add checkpoints
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Submit Button */}
                {lifts.length > 0 && (
                  <div className="flex justify-end pt-4 border-t border-gray-100">
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex items-center gap-2 px-5 py-2.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      <Save className="w-4 h-4" />
                      {loading ? 'Saving...' : (inspectionReportId ? 'Update' : 'Create')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4 max-w-xl">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Report ID
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      placeholder="Enter report ID"
                      className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.target.value) {
                          fetchReportForEdit(parseInt(e.target.value));
                        }
                      }}
                      id="loadReportId"
                    />
                    <button
                      onClick={() => {
                        const id = document.getElementById('loadReportId').value;
                        if (id) fetchReportForEdit(parseInt(id));
                      }}
                      className="px-5 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Load
                    </button>
                  </div>
                </div>

                {loading && (
                  <div className="text-center py-12">
                    <div className="inline-block w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-3 text-sm text-gray-600">Loading...</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspectionReportSystem;