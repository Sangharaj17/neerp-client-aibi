import React, { useState, useEffect } from 'react';
import { Save, FileText, ChevronRight, CheckCircle2, AlertCircle, Loader2, ArrowLeft, Plus } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import axiosInstance from '@/utils/axiosInstance';
import toast from 'react-hot-toast';

import { useParams } from 'next/navigation';

const InspectionReportSystem = ({
  combinedEnquiryId: combinedEnquiryIdProp,
  reportId = null,
  mode = 'create',
  onBack = null,
  enquiryId = null
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const customerFromSearchParam = searchParams.get('customer');
  const siteFromSearchParam = searchParams.get('site');
  
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(false);

  // Layout State
  const [selectedLiftIndex, setSelectedLiftIndex] = useState(0);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);

  // Create/Update Report State
  const [combinedEnquiryId] = useState(combinedEnquiryIdProp || '');
  const [inspectionReportId, setInspectionReportId] = useState(null);
  const [lifts, setLifts] = useState([]);
  const [availableLifts, setAvailableLifts] = useState([]);

   const params = useParams();
 
    // dynamic route param
    const { id } = params;

  // Fetch initial data
  useEffect(() => {
    fetchCategories();
    fetchStatuses();
  }, []);

  useEffect(() => {
    if (reportId && mode !== 'create' && categories.length > 0) {
      fetchReportForEdit(reportId);
    }
  }, [reportId, mode, categories]);

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
       // setActiveTab('create');
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
            categoryId: category.inspectionReportCategoryDto?.id,
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

  const updateFilteredCheckpoint = (liftIndex, checkpointId, field, value) => {
    const newLifts = [...lifts];
    if (!newLifts[liftIndex].checkpoints) {
      newLifts[liftIndex].checkpoints = initializeCheckpoints();
    }

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

      // onBack && onBack();
      // Redirect after successful save
      if (id && combinedEnquiryId) {
        const queryParams = new URLSearchParams({
          combinedEnquiryId: combinedEnquiryId,
          customer: customerFromSearchParam,
          site: siteFromSearchParam,
        }).toString();

        router.push(
          `/dashboard/lead-management/enquiries/${id}/inspection-report-list?${queryParams}`
        );
       
      }
    } catch (err) {
      toast.error('Failed to save: ' + (err.response?.data || err.message));
    } finally {
      setLoading(false);
    }
  };

  const getFilteredCheckpoints = () => {
    const selectedLift = lifts[selectedLiftIndex];
    const selectedCategory = categories[selectedCategoryIndex];

    if (!selectedLift || !selectedCategory || !selectedLift.checkpoints) return [];

    const catId = selectedCategory.inspectionReportCategoryDto?.id;
    return selectedLift.checkpoints.filter(cp => cp.categoryId === catId);
  };

  const getCompletionStats = () => {
    const selectedLift = lifts[selectedLiftIndex];
    if (!selectedLift?.checkpoints) return { completed: 0, total: 0, percentage: 0 };

    const total = selectedLift.checkpoints.length;
    const completed = selectedLift.checkpoints.filter(cp => cp.statusId && cp.remark).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { completed, total, percentage };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 flex flex-col h-screen overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
        
        * {
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        .font-mono {
          font-family: 'JetBrains Mono', monospace;
        }

        .checkpoint-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          animation: slideIn 0.4s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .checkpoint-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.1);
        }

        .lift-card {
          transition: all 0.25s ease;
          position: relative;
          overflow: hidden;
        }

        .lift-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(180deg, #3b82f6, #8b5cf6);
          opacity: 0;
          transition: opacity 0.25s ease;
        }

        .lift-card.selected::before {
          opacity: 1;
        }

        .category-btn {
          position: relative;
          transition: all 0.2s ease;
        }

        .category-btn::after {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 0;
          background: linear-gradient(180deg, #3b82f6, #8b5cf6);
          transition: height 0.2s ease;
        }

        .category-btn.active::after {
          height: 60%;
        }

        .progress-ring {
          transition: stroke-dashoffset 0.5s ease;
        }

        input:focus, select:focus, textarea:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .glassmorphism {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
      `}</style>

      {/* Enhanced Header */}
      <div className="glassmorphism border-b border-white/60 px-6 py-4 flex justify-between items-center shrink-0 shadow-sm">
        <div className="flex items-center gap-4">
          {onBack && (
            <button 
              onClick={onBack}
              className="p-2 hover:bg-white/60 rounded-lg transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600 group-hover:text-slate-900 transition-colors" />
            </button>
          )}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg shadow-blue-500/25">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Inspection Report System</h1>
              {combinedEnquiryId && (
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs font-mono text-slate-500">ID: {combinedEnquiryId}</span>
                  {inspectionReportId && (
                    <>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs font-mono text-slate-500">Report: {inspectionReportId}</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {lifts.length > 0 && (
            <>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/60 rounded-lg border border-slate-200/50">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-slate-600">{lifts.length} Lifts</span>
                </div>
              </div>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {loading ? 'Saving...' : 'Save Report'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {lifts.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
              <p className="text-slate-600 font-medium">Loading inspection data...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Categories Sidebar */}
            <div className="w-72 glassmorphism border-r border-white/60 flex flex-col shrink-0">
                <div className="p-5 border-b border-slate-200/50">
                  <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Categories</h3>
                  <p className="text-xs text-slate-500 mt-1">{categories.length} total</p>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
                  {categories.map((cat, index) => (
                    <button
                      key={cat.inspectionReportCategoryDto.id}
                      onClick={() => setSelectedCategoryIndex(index)}
                      className={`category-btn w-full text-left px-4 py-3.5 rounded-xl transition-all ${
                        selectedCategoryIndex === index
                          ? 'active bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25'
                          : 'text-slate-700 hover:bg-white/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm">
                          {cat.inspectionReportCategoryDto.categoryName}
                        </span>
                        <ChevronRight className={`w-4 h-4 transition-transform ${
                          selectedCategoryIndex === index ? 'rotate-90' : ''
                        }`} />
                      </div>
                      <span className="block text-xs mt-1 opacity-75">
                        {cat.inspectionCategoryCheckpointDtos?.length || 0} checkpoints
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Checkpoint Workspace */}
              <div className="flex-1 flex flex-col overflow-hidden min-w-0 bg-gradient-to-br from-slate-50/50 to-blue-50/30">
                {/* Workspace Header */}
                <div className="glassmorphism p-5 border-b border-white/60 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="font-bold text-slate-900 text-xl truncate">
                          {categories[selectedCategoryIndex]?.inspectionReportCategoryDto?.categoryName}
                        </h2>
                        <div className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold">
                          {getFilteredCheckpoints().length} items
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600">Working on</span>
                        <span className="px-2.5 py-0.5 bg-white/80 border border-slate-200 rounded-md text-xs font-bold text-slate-700">
                          Lift #{selectedLiftIndex + 1}
                        </span>
                        {lifts[selectedLiftIndex]?.liftName && (
                          <>
                            <span className="text-slate-300">•</span>
                            <span className="text-sm text-slate-600 truncate">{lifts[selectedLiftIndex].liftName}</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {/* Progress Indicator */}
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Progress</div>
                        <div className="text-2xl font-bold text-slate-900 mt-0.5">
                          {getCompletionStats().percentage}%
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {getCompletionStats().completed} of {getCompletionStats().total}
                        </div>
                      </div>
                      <div className="relative w-16 h-16">
                        <svg className="w-16 h-16 transform -rotate-90">
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            stroke="currentColor"
                            strokeWidth="6"
                            fill="none"
                            className="text-slate-200"
                          />
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            stroke="currentColor"
                            strokeWidth="6"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 28}`}
                            strokeDashoffset={`${2 * Math.PI * 28 * (1 - getCompletionStats().percentage / 100)}`}
                            className="text-blue-600 progress-ring"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Checkpoints List */}
                <div className="flex-1 overflow-y-auto p-6">
                  {(!lifts[selectedLiftIndex].checkpoints || lifts[selectedLiftIndex].checkpoints.length === 0) ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Plus className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Initialize Checkpoints</h3>
                        <p className="text-slate-500 mb-6">Get started by initializing checkpoints for this lift</p>
                        <button
                          onClick={() => initializeLiftCheckpoints(selectedLiftIndex)}
                          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/25 font-semibold"
                        >
                          Initialize Lift #{selectedLiftIndex + 1}
                        </button>
                      </div>
                    </div>
                  ) : getFilteredCheckpoints().length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500">No checkpoints in this category</p>
                      </div>
                    </div>
                  ) : (
                    <div className="max-w-4xl mx-auto space-y-4">
                      {getFilteredCheckpoints().map((cp, idx) => (
                        <div
                          key={cp.checkpointId}
                          className="checkpoint-card bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md"
                          style={{ animationDelay: `${idx * 0.05}s` }}
                        >
                          <div className="flex items-start gap-3 mb-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                              <span className="text-xs font-bold text-slate-600">{idx + 1}</span>
                            </div>
                            <p className="flex-1 text-sm font-semibold text-slate-800 leading-relaxed pt-1">
                              {cp.checkpointName}
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                                Status
                              </label>
                              <select
                                value={cp.statusId || ''}
                                onChange={(e) => updateFilteredCheckpoint(selectedLiftIndex, cp.checkpointId, 'statusId', parseInt(e.target.value))}
                                className="w-full px-3 py-2.5 text-sm bg-white border-2 border-slate-200 rounded-lg focus:border-blue-500 transition-all font-medium"
                              >
                                <option value="">Select status...</option>
                                {statuses.map(s => (
                                  <option key={s.id} value={s.id}>{s.statusName}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                                Remark
                              </label>
                              <input
                                type="text"
                                value={cp.remark || ''}
                                onChange={(e) => updateFilteredCheckpoint(selectedLiftIndex, cp.checkpointId, 'remark', e.target.value)}
                                className="w-full px-3 py-2.5 text-sm bg-white border-2 border-slate-200 rounded-lg focus:border-blue-500 transition-all"
                                placeholder="Add notes..."
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Lifts Panel */}
              <div className="w-80 glassmorphism border-l border-white/60 flex flex-col shrink-0">
                <div className="p-5 border-b border-slate-200/50">
                  <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Lifts</h3>
                  <p className="text-xs text-slate-500 mt-1">{lifts.length} configured</p>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {lifts.map((lift, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedLiftIndex(index)}
                      className={`lift-card cursor-pointer rounded-xl border-2 p-4 transition-all ${
                        selectedLiftIndex === index
                          ? 'selected bg-white border-blue-500 shadow-lg shadow-blue-500/10'
                          : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${
                          selectedLiftIndex === index
                            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/25'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {index + 1}
                        </div>
                        {lift.enquiryId && (
                          <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-mono font-bold">
                            {lift.enquiryId}
                          </span>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                            Enquiry ID
                          </label>
                          <input
                            type="number"
                            value={lift.enquiryId}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => updateLift(index, 'enquiryId', e.target.value)}
                            className="w-full px-3 py-2 text-sm border-2 border-slate-200 rounded-lg focus:border-blue-500 transition-all bg-white"
                            placeholder="Enter ID..."
                          />
                        </div>

                        {lift.liftName && (
                          <div className="pt-2 border-t border-slate-100">
                            <p className="text-xs text-slate-600 font-medium truncate">
                              {lift.liftName}
                            </p>
                            {lift.typeOfElevators && (
                              <p className="text-xs text-slate-400 mt-0.5 truncate">
                                {lift.typeOfElevators}
                              </p>
                            )}
                          </div>
                        )}

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                            Copy From Lift
                          </label>
                          <select
                            value={lift.repeatLiftId ? String(lift.repeatLiftId) : ''}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => updateLift(index, 'repeatLiftId', e.target.value || null)}
                            className="w-full text-xs p-2 border-2 border-slate-200 rounded-lg focus:border-blue-500 transition-all bg-white"
                          >
                            <option value="">None</option>
                            {lifts.map((l, idx) => (
                              idx !== index && l.enquiryId && (
                                <option key={idx} value={String(l.enquiryId)}>
                                  Lift #{idx + 1} ({l.enquiryId})
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
          )}
      </div>
    </div>
  );
};

export default InspectionReportSystem;