import React, { useState, useEffect } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import toast from 'react-hot-toast';
import { Plus, Trash2, Save, ChevronDown, ChevronRight, Edit2, X } from 'lucide-react';

const InspectionReportSettings = () => {
    const [activeTab, setActiveTab] = useState('categories'); // 'categories' | 'statuses'
    const [loading, setLoading] = useState(false);

    // Categories State
    const [categories, setCategories] = useState([]);
    const [expandedCategories, setExpandedCategories] = useState({});

    // Statuses State
    const [statuses, setStatuses] = useState([]);

    useEffect(() => {
        if (activeTab === 'categories') fetchCategories();
        else fetchStatuses();
    }, [activeTab]);

    // --- Data Fetching ---

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get('/api/inspection-report/categories/categories-with-checkpoints');
            setCategories(res.data || []);
        } catch (error) {
            toast.error('Failed to fetch categories');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStatuses = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get('/api/inspection-checkpoint-status/getAllCheckPointsStatuses');
            setStatuses(res.data || []);
        } catch (error) {
            toast.error('Failed to fetch statuses');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // --- Category Handlers ---

    const toggleCategory = (catId) => {
        setExpandedCategories(prev => ({ ...prev, [catId]: !prev[catId] }));
    };

    const handleAddCategory = () => {
        const newCat = {
            inspectionReportCategoryDto: { id: null, categoryName: '' },
            inspectionCategoryCheckpointDtos: [],
            isNew: true
        };
        setCategories([...categories, newCat]);
    };

    const handleCategoryNameChange = (index, val) => {
        const newCats = [...categories];
        newCats[index] = {
            ...newCats[index],
            inspectionReportCategoryDto: {
                ...newCats[index].inspectionReportCategoryDto,
                categoryName: val
            }
        };
        setCategories(newCats);
    };

    const handleSaveCategories = async () => {
        if (categories.some(cat => !cat.inspectionReportCategoryDto.categoryName.trim())) {
            toast.error('All categories must have a name');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                inspectionReportCategoryAndCheckpointsDtos: categories
            };

            await axiosInstance.post('/api/inspection-report/categories/create-or-update', payload);
            toast.success('Categories saved successfully');
            fetchCategories(); // Refresh to get IDs
        } catch (error) {
            toast.error('Failed to save categories');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCategory = async (catId) => {
        if (!window.confirm('Are you sure? This will delete the category and all its checkpoints.')) return;
        setLoading(true);
        try {
            await axiosInstance.delete(`/api/inspection-report/categories/${catId}`);
            toast.success('Category deleted');
            fetchCategories();
        } catch (error) {
            toast.error('Failed to delete category');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveNewCategory = (index) => {
        const newCats = [...categories];
        newCats.splice(index, 1);
        setCategories(newCats);
    };


    // --- Checkpoint Handlers ---

    const handleAddCheckpoint = (catIndex) => {
        const newCats = [...categories];
        // Create deep copy of the category to mutate safely
        const updatedCat = {
            ...newCats[catIndex],
            inspectionCategoryCheckpointDtos: [
                ...newCats[catIndex].inspectionCategoryCheckpointDtos,
                { id: null, checkpointName: '', isNew: true }
            ]
        };
        newCats[catIndex] = updatedCat;
        setCategories(newCats);

        // Ensure expanded
        const catId = updatedCat.inspectionReportCategoryDto.id;
        if (catId) setExpandedCategories(prev => ({ ...prev, [catId]: true }));
    };

    const handleCheckpointNameChange = (catIndex, cpIndex, val) => {
        const newCats = [...categories];
        const updatedCheckpoints = [...newCats[catIndex].inspectionCategoryCheckpointDtos];
        updatedCheckpoints[cpIndex] = { ...updatedCheckpoints[cpIndex], checkpointName: val };

        newCats[catIndex] = {
            ...newCats[catIndex],
            inspectionCategoryCheckpointDtos: updatedCheckpoints
        };
        setCategories(newCats);
    };

    const handleDeleteCheckpoint = async (catIndex, cpIndex) => {
        const cat = categories[catIndex];
        const cp = cat.inspectionCategoryCheckpointDtos[cpIndex];

        if (cp.id) {
            if (!window.confirm('Delete this checkpoint?')) return;
            setLoading(true);
            try {
                await axiosInstance.delete(`/api/inspection-report/categories/checkpoint/${cp.id}`);
                toast.success('Checkpoint deleted');
                fetchCategories();
            } catch (error) {
                toast.error('Failed to delete checkpoint');
            } finally {
                setLoading(false);
            }
        } else {
            // Just remove from UI if it's new
            const newCats = [...categories];
            const updatedCheckpoints = [...newCats[catIndex].inspectionCategoryCheckpointDtos];
            updatedCheckpoints.splice(cpIndex, 1);
            newCats[catIndex] = {
                ...newCats[catIndex],
                inspectionCategoryCheckpointDtos: updatedCheckpoints
            };
            setCategories(newCats);
        }
    };


    // --- Status Handlers ---

    const handleAddStatus = () => {
        setStatuses([...statuses, { id: null, statusName: '', isNew: true }]);
    };

    const handleStatusChange = (index, val) => {
        const newStatuses = [...statuses];
        newStatuses[index] = { ...newStatuses[index], statusName: val };
        setStatuses(newStatuses);
    };

    const handleSaveStatuses = async () => {
        const invalid = statuses.some(s => !s.statusName.trim());
        if (invalid) {
            toast.error('All statuses must have a name');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                inspectionCheckpointStatusDtos: statuses
            };
            await axiosInstance.post('/api/inspection-checkpoint-status/create-or-update', payload);
            toast.success('Statuses saved successfully');
            fetchStatuses();
        } catch (error) {
            toast.error('Failed to save statuses');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteStatus = async (index) => {
        const status = statuses[index];
        if (status.id) {
            if (!window.confirm('Delete this status?')) return;
            setLoading(true);
            try {
                await axiosInstance.delete(`/api/inspection-checkpoint-status/${status.id}`);
                toast.success('Status deleted');
                fetchStatuses();
            } catch (error) {
                toast.error('Failed to delete status');
            } finally {
                setLoading(false);
            }
        } else {
            const newStatuses = [...statuses];
            newStatuses.splice(index, 1);
            setStatuses(newStatuses);
        }
    };


    return (
        <div className="bg-white rounded-lg shadow-sm w-full">
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('categories')}
                    className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === 'categories' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Categories & Checkpoints
                </button>
                <button
                    onClick={() => setActiveTab('statuses')}
                    className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === 'statuses' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Statuses
                </button>
            </div>

            <div className="p-6">
                {activeTab === 'categories' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium text-gray-800">Inspection Categories</h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleAddCategory}
                                    className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm font-medium transition-colors"
                                >
                                    <Plus size={16} /> Add Category
                                </button>
                                <button
                                    onClick={handleSaveCategories}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium shadow-sm transition-colors"
                                >
                                    <Save size={16} /> Save Changes
                                </button>
                            </div>
                        </div>

                        {categories.length === 0 && !loading && <p className="text-gray-500">No categories found.</p>}

                        <div className="space-y-4">
                            {categories.map((cat, catIndex) => {
                                const catId = cat.inspectionReportCategoryDto.id;
                                const isExpanded = catId ? expandedCategories[catId] : true; // New categories always expanded

                                return (
                                    <div key={catId || `new-cat-${catIndex}`} className="border border-gray-200 rounded-lg bg-gray-50 overflow-hidden">
                                        {/* Category Header / Row */}
                                        <div className="flex items-center gap-4 p-4 bg-white border-b border-gray-100">
                                            <button
                                                disabled={!catId}
                                                onClick={() => catId && toggleCategory(catId)}
                                                className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                                            >
                                                {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                                            </button>

                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    value={cat.inspectionReportCategoryDto.categoryName}
                                                    onChange={(e) => handleCategoryNameChange(catIndex, e.target.value)}
                                                    placeholder="Category Name"
                                                    className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                                                />
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {catId ? (
                                                    <button
                                                        onClick={() => handleDeleteCategory(catId)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                                                        title="Delete Category"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleRemoveNewCategory(catIndex)}
                                                        className="p-2 text-gray-400 hover:text-gray-600"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Checkpoints List (Collapsible) */}
                                        {isExpanded && (
                                            <div className="p-4 pl-12 space-y-3">
                                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Checkpoints</h4>

                                                {cat.inspectionCategoryCheckpointDtos.map((cp, cpIndex) => (
                                                    <div key={cp.id || `new-cp-${cpIndex}`} className="flex items-center gap-3">
                                                        <div className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs font-bold">
                                                            {cpIndex + 1}
                                                        </div>
                                                        <div className="flex-1">
                                                            <input
                                                                type="text"
                                                                value={cp.checkpointName}
                                                                onChange={(e) => handleCheckpointNameChange(catIndex, cpIndex, e.target.value)}
                                                                placeholder="Checkpoint Description"
                                                                className="w-full px-3 py-1.5 border rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                                                            />
                                                        </div>
                                                        <button
                                                            onClick={() => handleDeleteCheckpoint(catIndex, cpIndex)}
                                                            className="text-gray-400 hover:text-red-500"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                ))}

                                                <div className="pt-2">
                                                    <button
                                                        onClick={() => handleAddCheckpoint(catIndex)}
                                                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium"
                                                    >
                                                        <Plus size={14} /> Add Checkpoint
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {activeTab === 'statuses' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium text-gray-800">Checkpoint Statuses</h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleAddStatus}
                                    className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm font-medium transition-colors"
                                >
                                    <Plus size={16} /> Add Status
                                </button>
                                <button
                                    onClick={handleSaveStatuses}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium shadow-sm transition-colors"
                                >
                                    <Save size={16} /> Save Changes
                                </button>
                            </div>
                        </div>

                        <div className="border rounded-lg overflow-hidden">
                            <table className="min-w-full text-sm">
                                <thead className="bg-gray-50 text-gray-700">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-medium">ID</th>
                                        <th className="px-4 py-3 text-left font-medium">Status Name</th>
                                        <th className="px-4 py-3 text-center font-medium w-24">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {statuses.map((status, index) => (
                                        <tr key={index} className="bg-white hover:bg-gray-50">
                                            <td className="px-4 py-2 text-gray-500">
                                                {status.id || <span className="text-blue-500 text-xs font-bold">NEW</span>}
                                            </td>
                                            <td className="px-4 py-2">
                                                <input
                                                    type="text"
                                                    value={status.statusName}
                                                    onChange={(e) => handleStatusChange(index, e.target.value)}
                                                    className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                                    placeholder="Status Name (e.g., Good, Bad, N/A)"
                                                />
                                            </td>
                                            <td className="px-4 py-2 text-center">
                                                <button
                                                    onClick={() => handleDeleteStatus(index)}
                                                    className="text-gray-400 hover:text-red-600 transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {statuses.length === 0 && <div className="p-4 text-center text-gray-500">No statuses defined</div>}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InspectionReportSettings;
