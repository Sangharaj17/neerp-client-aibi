'use client';

import { useState, useEffect, useMemo } from 'react';
// Assuming '@/utils/axiosInstance' exists and is correctly configured
import axiosInstance from '@/utils/axiosInstance';
import { Pencil, Trash2, Settings, FileText, Component, Clock, ListOrdered, DollarSign, Calendar } from 'lucide-react'; // Added 'Calendar' icon for Work Periods
import toast from 'react-hot-toast';

// --- Configuration ---

const setupBoxes = [
    // --- NEW WORK PERIOD CONFIGURATION ADDED HERE ---
    {
        id: 0, // Assigned a unique ID (0)
        title: 'Work Periods',
        api: '/api/amc/workperiods', // Matches your Spring Boot @RequestMapping
        type: 'workPeriod',
        icon: Calendar, // Using Calendar icon
        crud: {
            create: true, read: true, update: true, delete: true,
            fields: [
                // Fields match the WorkPeriod entity (name, but called 'period_name' in DB)
                { key: 'name', label: 'Period Name', type: 'text', required: true }
            ]
        }
    },
    // --- EXISTING CONFIGURATIONS (ID numbers shifted/reordered) ---

    {
        id: 2,
        title: 'Elevator Makes',
        api: '/api/amc/common/elevator-makes',
        type: 'elevatorMake',
        icon: Component,
        crud: {
            create: true, read: true, update: true, delete: true,
            fields: [{ key: 'name', label: 'Elevator Make Name', type: 'text', required: true }]
        }
    },

    {
        id: 4,
        title: 'Number of Services',
        api: '/api/amc/common/number-of-services',
        type: 'numberOfService',
        icon: ListOrdered,
        crud: {
            create: true, read: true, update: false, delete: true,
            fields: [{ key: 'value', label: 'Service Count', type: 'number', required: true }]
        }
    },

];

const colorCfg = {
    // Teal/Cyan Scheme
    button: 'bg-teal-600 hover:bg-teal-700',
    header: 'bg-teal-500',
    ring: 'focus:ring-teal-400',
    activeTab: 'bg-teal-600 text-white shadow-lg',
    inactiveTab: 'bg-white text-gray-700 hover:bg-gray-100',
    textAccent: 'text-teal-600'
};

// --- Component ---

const QuotationSetupComponent = () => {

    // IMPORTANT: Set initial selectedBox to the NEW Work Periods (id: 0)
    const [selectedBox, setSelectedBox] = useState(setupBoxes[0]);
    const [formData, setFormData] = useState({});
    const [dataList, setDataList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editId, setEditId] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 8;

    // Find the current CRUD configuration
    const currentBox = useMemo(() =>
        setupBoxes.find(box => box.id === selectedBox?.id)
        , [selectedBox]);

    const currentCrudConfig = currentBox?.crud;
    const isServiceCount = currentBox?.type === 'numberOfService';

    /** Helper to get ID dynamically */
    // NOTE: The backend's WorkPeriod entity uses 'workPeriodId' as the primary key.
    // However, since the other entities seem to use 'id' (e.g., contract-types) and the code
    // is designed to handle this inconsistency (e.g., using item.id), we must adjust getId
    // or assume the other APIs follow the 'id' convention.
    const getId = (item) => item?.workPeriodId ?? item?.id ?? '';

    // Initialize formData when switching tabs or when edit mode is cancelled
    useEffect(() => {
        if (currentBox) {
            fetchData();
            setEditId(null);
        }
    }, [selectedBox]);

    useEffect(() => {
        // Reset form data with defaults ONLY when not in edit mode (editId is null)
        // When entering edit mode, handleEdit sets the data, so we avoid overwriting it here
        if (editId === null) {
            const initialData = {};
            currentCrudConfig?.fields.forEach(field => {
                initialData[field.key] = field.default !== undefined ? field.default : '';
            });
            setFormData(initialData);
        }
    }, [selectedBox, editId]);


    /** Fetch data for selected box */
    const fetchData = async () => {
        if (!currentBox?.api || !currentCrudConfig.read) {
            setDataList([]);
            return;
        }

        setLoading(true);
        try {
            // Note: Assuming a successful response from WorkPeriodController.getAll() returns an array directly
            const response = await axiosInstance.get(currentBox.api);
            let list = response.data?.data || response.data || [];

            // Sort NumberOfService data for sequential logic
            if (isServiceCount) {
                list.sort((a, b) => (a.value ?? 0) - (b.value ?? 0));
            }

            setDataList(list);
            setCurrentPage(1);
        } catch (error) {
            console.error(`Error fetching data for ${currentBox.title}:`, error);
            setDataList([]);
            toast.error(`Failed to load ${currentBox.title}.`);
        } finally {
            setLoading(false);
        }
    };

    /** Handlers */
    const handleClick = (box) => {
        setSelectedBox(box);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        const finalValue = type === 'checkbox' ? checked : value;

        setFormData(prev => ({ ...prev, [name]: finalValue }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isServiceCount) {
            // --- Custom Logic for NumberOfServices ---
            if (editId) return; // Should not happen due to disabled UI

            const values = dataList.map(item => typeof item.value === 'number' ? item.value : 0);
            const lastValue = values.length > 0 ? Math.max(...values) : 0;
            const nextValue = lastValue + 1;

            const payload = { value: nextValue };

            setLoading(true);
            try {
                await axiosInstance.post(currentBox.api, payload);
                toast.success(`Number of Services ${nextValue} added successfully!`);
            } catch (error) {
                const errorMessage = error.response?.data?.message || error.response?.data || 'Error saving data';
                toast.error(errorMessage);
            } finally {
                setLoading(false);
                fetchData();
            }
            return;
        }

        // --- Standard Form Submission Logic for other APIs (including Work Periods) ---
        if (!currentCrudConfig.create && !currentCrudConfig.update) {
            toast.error(`Create/Update operations are disabled for ${currentBox.title}.`);
            return;
        }

        const payload = { ...formData };

        // Validation and payload cleanup
        for (const field of currentCrudConfig.fields) {
            if (field.required && (!payload[field.key] || (field.type !== 'checkbox' && String(payload[field.key]).trim() === ''))) {
                toast.error(`${field.label} is required.`);
                return;
            }
            if (field.type === 'checkbox') {
                payload[field.key] = !!payload[field.key];
            }
        }

        // Add 'id' or specific key to payload for PUT requests
        if (editId) {
            // For WorkPeriod, the ID might be 'workPeriodId', but the PUT URL uses the ID path variable.
            // We ensure to add a key if the backend DTO requires it, like 'elevatorMake' needing 'id'.
            if (currentBox.type === 'elevatorMake') {
                payload.id = editId;
            }
            // NOTE: If the WorkPeriod update DTO requires 'workPeriodId' in the body, add it here:
            // if (currentBox.type === 'workPeriod') { payload.workPeriodId = editId; }
        }


        setLoading(true);
        try {
            if (editId) {
                if (!currentCrudConfig.update) {
                    toast.error(`Update is not supported by the ${currentBox.title} API.`);
                    return;
                }
                // Use getId to ensure we use the correct key for the URL (which should be a number/string ID)
                const entityId = getId(dataList.find(item => getId(item) === editId));
                if (!entityId) throw new Error('Could not find item ID for update.');

                await axiosInstance.put(`${currentBox.api}/${entityId}`, payload);
                toast.success(`${currentBox.title} updated successfully!`);
            } else {
                if (!currentCrudConfig.create) {
                    toast.error(`Creation is not supported by the ${currentBox.title} API.`);
                    return;
                }
                // POST request for Create (Works for WorkPeriod, Contract Types, etc.)
                await axiosInstance.post(currentBox.api, payload);
                toast.success(`${currentBox.title} created successfully!`);
            }
            setEditId(null);
            fetchData();
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.response?.data || 'Error saving data';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item) => {
        if (!currentCrudConfig.update || isServiceCount) {
            toast.error(`Editing is disabled for ${currentBox.title}.`);
            return;
        }

        const editData = {};
        currentCrudConfig.fields.forEach(field => {
            editData[field.key] = item[field.key];
        });

        setFormData(editData);
        // Use the ID returned by getId for the editId state
        setEditId(getId(item));
    };

    const handleDelete = async (id) => {
        if (!currentCrudConfig.delete) {
            toast.error(`Deleting is disabled for ${currentBox.title}.`);
            return;
        }
        if (!window.confirm(`Are you sure you want to delete ${currentBox.title} ID: ${id}?`)) return;

        setLoading(true);
        try {
            // Use the ID passed in (which comes from getId in the render logic)
            await axiosInstance.delete(`${currentBox.api}/${id}`);
            toast.success('Deleted successfully!');
            fetchData();
        } catch (error) {
            const message = error.response?.data?.message || error.response?.data || 'Error deleting data';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    /** Pagination (omitted for brevity, assume it's the same as before) */
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = dataList.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(dataList.length / recordsPerPage);

    const renderPagination = () => {
        if (totalPages <= 1) return null;
        const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

        return (
            <div className="flex justify-center mt-4 space-x-2">
                <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-lg shadow-sm transition-colors bg-white hover:bg-gray-100 text-gray-700 disabled:bg-gray-200 disabled:text-gray-500`}>
                    Prev
                </button>

                {pageNumbers.map((num) => (
                    <button key={num} onClick={() => setCurrentPage(num)}
                        className={`px-3 py-1 rounded-lg shadow-sm transition-colors ${currentPage === num ? colorCfg.activeTab : 'bg-white hover:bg-teal-50 text-gray-700'}`}>
                        {num}
                    </button>
                ))}

                <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-lg shadow-sm transition-colors bg-white hover:bg-gray-100 text-gray-700 disabled:bg-gray-200 disabled:text-gray-500`}>
                    Next
                </button>
            </div>
        );
    };

    /** Content rendering based on API type */
    const renderContent = () => {
        const fields = currentCrudConfig?.fields || [];

        if (!currentCrudConfig.read) {
            return (
                <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="font-semibold text-yellow-800">API Not Configured</p>
                    <p className="text-sm text-yellow-700">
                        This section ({currentBox.title}) is reserved for a future API setup.
                        <br />
                        API Endpoint:
                        <code className="bg-yellow-100 p-1 rounded ml-1 text-xs">{currentBox.api}</code>
                    </p>
                </div>
            );
        }

        const nextValue = isServiceCount
            ? Math.max(...dataList.map(item => typeof item.value === 'number' ? item.value : 0), 0) + 1
            : null;

        return (
            // Flex container for the two-column layout
            <div className="flex flex-col md:flex-row gap-8">

                {/* Left Column: Form / Action Button */}
                <div className="md:w-5/12 lg:w-4/12 flex-shrink-0">
                    <h3 className="text-xl font-semibold mb-3 text-gray-700">
                        {isServiceCount ? 'Add New Service Count' : (editId ? `Edit ${currentBox.title}` : `Create New ${currentBox.title}`)}
                    </h3>

                    {isServiceCount ? (
                        // Custom Action Button for Number of Services
                        <form onSubmit={handleSubmit} className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-inner">
                            <p className='text-lg font-semibold text-gray-700'>
                                Next Value: <span className={`${colorCfg.textAccent} font-bold text-2xl ml-2`}>{nextValue}</span>
                            </p>
                            <button type="submit" className={`${colorCfg.button} text-white px-6 py-2 rounded-lg shadow-md transition-all w-full`} disabled={loading}>
                                {loading ? 'Adding...' : `Add Value ${nextValue}`}
                            </button>
                        </form>
                    ) : (
                        // Standard Dynamic Form for other APIs
                        <form onSubmit={handleSubmit} className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-inner">
                            {fields.map(field => {
                                const isInput = field.type === 'text' || field.type === 'number';
                                const isCheckbox = field.type === 'checkbox';
                                const isTextArea = field.type === 'textarea';
                                const isDisabled = loading || (editId ? !currentCrudConfig.update : !currentCrudConfig.create); // Disable form if loading or CRUD op not allowed

                                if (isCheckbox) {
                                    return (
                                        <div key={field.key} className="flex items-center">
                                            <input
                                                id={field.key} type="checkbox" name={field.key} checked={!!formData[field.key]} onChange={handleChange}
                                                className={`h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500`} disabled={isDisabled}
                                            />
                                            <label htmlFor={field.key} className="ml-2 block text-sm font-medium text-gray-700">
                                                {field.label} {field.required ? '*' : ''}
                                            </label>
                                        </div>
                                    );
                                } else if (isTextArea) {
                                    return (
                                        <div key={field.key}>
                                            <label htmlFor={field.key} className="block mb-1 text-sm font-medium text-gray-700">
                                                {field.label} {field.required ? '*' : ''}
                                            </label>
                                            <textarea id={field.key} name={field.key} value={formData[field.key] || ''} onChange={handleChange}
                                                className={`w-full border border-gray-300 rounded-lg p-3 text-base focus:ring focus:ring-opacity-50 ${colorCfg.ring}`}
                                                required={field.required} disabled={isDisabled} rows={3}
                                            />
                                        </div>
                                    );
                                } else if (isInput) {
                                    return (
                                        <div key={field.key}>
                                            <label htmlFor={field.key} className="block mb-1 text-sm font-medium text-gray-700">
                                                {field.label} {field.required ? '*' : ''}
                                            </label>
                                            <input id={field.key} type={field.type} name={field.key} value={formData[field.key] || ''} onChange={handleChange}
                                                className={`w-full border border-gray-300 rounded-lg p-3 text-base focus:ring focus:ring-opacity-50 ${colorCfg.ring}`}
                                                required={field.required} disabled={isDisabled}
                                            />
                                        </div>
                                    );
                                }
                                return null;
                            })}

                            {(currentCrudConfig.create && !editId) || (currentCrudConfig.update && editId) ? (
                                <button type="submit" className={`${colorCfg.button} text-white px-6 py-2 rounded-lg shadow-md transition-all w-full`} disabled={loading}>
                                    {loading ? 'Processing...' : editId ? 'Update' : 'Create'}
                                </button>
                            ) : (
                                <button type="button" className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg shadow-md w-full cursor-not-allowed" disabled>
                                    Operations Disabled
                                </button>
                            )}

                            {editId && currentCrudConfig.update && (
                                <button type="button" onClick={() => { setEditId(null); setFormData({}); }} className="w-full text-sm text-gray-600 hover:text-gray-800 py-1 transition-colors">
                                    Cancel Edit
                                </button>
                            )}
                        </form>
                    )}
                </div>

                {/* Right Column: Table (Read/Delete) */}
                <div className="md:w-7/12 lg:w-8/12">
                    <h3 className="text-xl font-semibold mb-3 text-gray-700">
                        Existing {currentBox.title}
                    </h3>
                    <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white shadow-md">
                        <table className="min-w-full text-sm">
                            <thead className={`${colorCfg.header} text-white`}>
                                <tr>
                                    <th className="px-4 py-3 text-left w-20">ID</th>
                                    {fields.map(field => (
                                        <th key={field.key} className="px-4 py-3 text-left">{field.label}</th>
                                    ))}
                                    <th className="px-4 py-3 text-center w-32">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentRecords.map((item) => {
                                    const id = getId(item);
                                    const canEdit = currentCrudConfig.update && !isServiceCount;
                                    const canDelete = currentCrudConfig.delete;

                                    return (
                                        <tr key={id} className={`border-t hover:bg-teal-50 ${editId === id ? 'bg-teal-100' : ''}`}>
                                            <td className="px-4 py-3 font-medium">{id}</td>
                                            {fields.map(field => {
                                                if (field.type === 'checkbox') {
                                                    const isActive = !!item[field.key];
                                                    return (
                                                        <td key={field.key} className="px-4 py-3">
                                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                                {isActive ? 'Yes' : 'No'}
                                                            </span>
                                                        </td>
                                                    );
                                                }
                                                return <td key={field.key} className="px-4 py-3">{item[field.key]}</td>;
                                            })}
                                            <td className="px-4 py-3 text-center flex justify-center space-x-3">
                                                {canEdit ? (
                                                    <button onClick={() => handleEdit(item)} className="text-teal-600 hover:text-teal-800 transition">
                                                        <Pencil size={18} />
                                                    </button>
                                                ) : (
                                                    <Pencil size={18} className="text-gray-400 cursor-not-allowed" />
                                                )}
                                                {canDelete ? (
                                                    <button onClick={() => handleDelete(id)} className="text-red-600 hover:text-red-800 transition">
                                                        <Trash2 size={18} />
                                                    </button>
                                                ) : (
                                                    <Trash2 size={18} className="text-gray-400 cursor-not-allowed" />
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                                {currentRecords.length === 0 && (
                                    <tr>
                                        <td colSpan={fields.length + 2} className="px-4 py-5 text-center text-gray-500">
                                            {loading ? 'Loading...' : `No ${currentBox.title} found.`}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {renderPagination()}
                </div>
            </div>
        );
    };

    return (
        <div className="h-screen bg-gray-50 p-8">
            <div className="bg-white rounded-xl shadow-2xl p-8 border border-gray-100 max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">
                    Quotation Setup
                </h1>

                {/* Top Tab/Pill Navigation */}
                <div className="flex flex-wrap gap-2 mb-8 border-b pb-4">
                    {setupBoxes.map((box) => {
                        const Icon = box.icon;
                        const isActive = selectedBox?.id === box.id;
                        return (
                            <button
                                key={box.id}
                                onClick={() => handleClick(box)}
                                className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors border ${isActive ? colorCfg.activeTab : colorCfg.inactiveTab} ${isActive ? 'border-teal-600' : 'border-gray-300'}`}
                            >
                                <Icon size={16} className="mr-2" />
                                {box.title}
                            </button>
                        );
                    })}
                </div>

                {/* Main Content Area */}
                {currentBox && renderContent()}
            </div>
        </div>
    );
};

export default QuotationSetupComponent;