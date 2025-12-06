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

  // Layout State
  const [selectedLiftIndex, setSelectedLiftIndex] = useState(0);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0); // Using index for easier navigation

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
      const response = await axiosInstance.get('/api/inspection-checkpoint-status/getAllCheckPointsStatuses');
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

        const transformedLifts = data.map(item => {
          const enrichedCheckpoints = (item.inspectionReportDtos || []).map(cp => {
            let categoryName = '';
            let checkpointName = '';
            let categoryId = null;

            categories.forEach(category => {
              if (category.inspectionCategoryCheckpointDtos) {
                const checkpoint = category.inspectionCategoryCheckpointDtos.find(
                  c => c.id === cp.checkpointId
                );
                if (checkpoint) {
                  categoryName = category.inspectionReportCategoryDto?.categoryName || '';
                  categoryId = category.inspectionReportCategoryDto?.id;
                  checkpointName = checkpoint.checkpointName || '';
                }
              }
            });

            return {
              ...cp,
              categoryName,
              categoryId,
              checkpointName
            };
          });

          const repeatLiftDbId = item.inspectionReportRepeatLiftDto?.repeatLiftId;
          const repeatLiftEnquiryId = repeatLiftDbId ? dbIdToEnquiryIdMap[repeatLiftDbId] : null;

          return {
            id: item.inspectionReportRepeatLiftDto?.id,
            enquiryId: item.inspectionReportRepeatLiftDto?.enquiryId || '',
            repeatLiftId: repeatLiftEnquiryId,
            repeatLiftDbId: repeatLiftDbId,
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
            categoryId: category.inspectionReportCategoryDto?.id, // Added for filtering
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

  // Helper to find absolute index of a checkpoint in the lift's checkpoint array
  const updateFilteredCheckpoint = (liftIndex, checkpointId, field, value) => {
    const newLifts = [...lifts];
    if (!newLifts[liftIndex].checkpoints) {
      newLifts[liftIndex].checkpoints = initializeCheckpoints();
    }

    // Find index by checkpointId since we are in a filtered view
    const cpIndex = newLifts[liftIndex].checkpoints.findIndex(c => c.checkpointId === checkpointId);

    if (cpIndex !== -1) {
      newLifts[liftIndex].checkpoints[cpIndex][field] = value;
      setLifts(newLifts);
    }
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
          let repeatLiftIdToSend = null;
          if (lift.repeatLiftId) {
            if (inspectionReportId) {
              repeatLiftIdToSend = enquiryIdToDbIdMap[lift.repeatLiftId] || null;
            } else {
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
        // Keeps user on page, maybe don't reset to avoid confusion in new layout?
        // Or reset and expect them to start over? Let's keep existing behavior for now.
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

  const getFilteredCheckpoints = () => {
    const selectedLift = lifts[selectedLiftIndex];
    const selectedCategory = categories[selectedCategoryIndex];

    if (!selectedLift || !selectedCategory || !selectedLift.checkpoints) return [];

    // Safety check for category object structure
    const catId = selectedCategory.inspectionReportCategoryDto?.id;
    return selectedLift.checkpoints.filter(cp => cp.categoryId === catId);
  };


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Inspection Report</h1>
            {combinedEnquiryId && <p className='text-xs text-gray-500'>Combined ID: {combinedEnquiryId} {inspectionReportId ? `| Report ID: ${inspectionReportId}` : ''}</p>}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {activeTab === 'create' && lifts.length > 0 && (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : 'Save Report'}
            </button>
          )}
          {onBack && (
            <button onClick={onBack} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm border border-gray-200">
              Back / Exit
            </button>
          )}
        </div>
      </div>

      {/* Tabs for Mode Switching */}
      <div className="bg-white border-b border-gray-200 px-6 shrink-0">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('create')}
            className={`py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'create' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Report Workspace
          </button>
          <button
            onClick={() => setActiveTab('load')}
            className={`py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'load' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Load Existing Report
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">

        {activeTab === 'create' ? (
          lifts.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-8">
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center max-w-md">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-blue-500" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Start Inspection Report</h2>
                <p className="text-gray-500 mb-6">No lifts loaded. Please ensure Combined Enquiry ID is passed or load an existing report.</p>
                <div className="flex justify-center gap-2">
                  <input
                    type="number"
                    placeholder="Combined Enquiry ID"
                    className="px-3 py-2 border rounded-md text-sm"
                    disabled // Start logic requires prop usually, enabled here for debugging if needed? No, kept disabled as per prev logic
                    value={combinedEnquiryId}
                  />
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* 1. Categories Column (Left) */}
              <div className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                  <h3 className="font-semibold text-gray-700 text-sm">Categories</h3>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {categories.map((cat, index) => (
                    <button
                      key={cat.inspectionReportCategoryDto.id}
                      onClick={() => setSelectedCategoryIndex(index)}
                      className={`w-full text-left px-4 py-3 text-sm border-l-4 transition-all ${selectedCategoryIndex === index
                        ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                        : 'border-transparent text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                      {cat.inspectionReportCategoryDto.categoryName}
                      <span className="block text-xs text-gray-400 font-normal mt-0.5">
                        {cat.inspectionCategoryCheckpointDtos?.length || 0} checkpoints
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Checkpoints Form (Center) - The WORKSPACE */}
              <div className="flex-1 bg-white flex flex-col overflow-hidden min-w-[400px]">
                {/* Workspace Header */}
                <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                  <div>
                    <h2 className="font-bold text-gray-800 text-lg">
                      {categories[selectedCategoryIndex]?.inspectionReportCategoryDto?.categoryName}
                    </h2>
                    <p className="text-xs text-gray-500">
                      Working on Lift #{selectedLiftIndex + 1}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Copy Logic could go here specifically for this category if needed, staying simple for now */}
                  </div>
                </div>

                {/* Scrollable Checkpoints Area */}
                <div className="flex-1 overflow-y-auto p-6">
                  {(!lifts[selectedLiftIndex].checkpoints || lifts[selectedLiftIndex].checkpoints.length === 0) ? (
                    <div className="text-center py-10">
                      <button
                        onClick={() => initializeLiftCheckpoints(selectedLiftIndex)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Initialize Checkpoints for Lift #{selectedLiftIndex + 1}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {getFilteredCheckpoints().length === 0 ? (
                        <p className="text-gray-500 text-center italic">No checkpoints in this category.</p>
                      ) : (
                        getFilteredCheckpoints().map((cp) => (
                          <div key={cp.checkpointId} className="bg-white border rounded-lg p-4 shadow-sm hover:border-blue-300 transition-colors">
                            <p className="text-sm font-medium text-gray-800 mb-3">{cp.checkpointName}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Status</label>
                                <select
                                  value={cp.statusId || ''}
                                  onChange={(e) => updateFilteredCheckpoint(selectedLiftIndex, cp.checkpointId, 'statusId', parseInt(e.target.value))}
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                >
                                  <option value="">Select Status</option>
                                  {statuses.map(s => (
                                    <option key={s.id} value={s.id}>{s.statusName}</option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Remark</label>
                                <input
                                  type="text"
                                  value={cp.remark || ''}
                                  onChange={(e) => updateFilteredCheckpoint(selectedLiftIndex, cp.checkpointId, 'remark', e.target.value)}
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                  placeholder="Add a remark..."
                                />
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Lifts List (Right) */}
              <div className="w-80 bg-gray-100 border-l border-gray-200 flex flex-col shrink-0">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="font-semibold text-gray-700 text-sm">Lifts ({lifts.length})</h3>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {lifts.map((lift, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedLiftIndex(index)}
                      className={`cursor-pointer rounded-xl border p-4 transition-all ${selectedLiftIndex === index
                        ? 'bg-white border-blue-500 shadow-md ring-1 ring-blue-500'
                        : 'bg-white border-gray-200 hover:border-blue-300 shadow-sm'
                        }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full ${selectedLiftIndex === index ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                          }`}>
                          {index + 1}
                        </span>
                        <span className="text-xs font-mono text-gray-400">
                          {lift.enquiryId || 'No ID'}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Enquiry ID</label>
                          <input
                            type="number"
                            value={lift.enquiryId}
                            onClick={(e) => e.stopPropagation()} // Prevent card selection when typing
                            onChange={(e) => updateLift(index, 'enquiryId', e.target.value)}
                            className="w-full px-2 py-1 text-xs border rounded bg-gray-50 focus:bg-white transition-colors"
                            placeholder="ID"
                          />
                        </div>
                        {lift.liftName && (
                          <p className="text-xs text-gray-600 font-medium truncate">{lift.liftName}</p>
                        )}
                        <div className="pt-2 border-t border-gray-100">
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Copy From</label>
                          <select
                            value={lift.repeatLiftId ? String(lift.repeatLiftId) : ''}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => updateLift(index, 'repeatLiftId', e.target.value || null)}
                            className="w-full text-xs p-1 border rounded bg-gray-50"
                          >
                            <option value="">Select...</option>
                            {lifts.map((l, idx) => (
                              idx !== index && l.enquiryId && (
                                <option key={idx} value={String(l.enquiryId)}>
                                  Lift #{idx + 1}
                                </option>
                              )
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )
        ) : (
          /* Load Report View (Simple centered form) */
          <div className="flex-1 bg-gray-50 flex items-center justify-center p-6">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Load Existing Report</h2>
              <div className="flex gap-3">
                <input
                  type="number"
                  placeholder="Enter Report ID"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Load'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InspectionReportSystem;