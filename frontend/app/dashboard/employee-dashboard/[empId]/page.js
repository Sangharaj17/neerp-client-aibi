"use client";

import { useState, useEffect, use } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
    ArrowLeft, LayoutGrid, Table as TableIcon,
    Calendar, MapPin, User, FileText, CheckCircle, AlertTriangle,
    ChevronLeft, ChevronRight
} from 'lucide-react';
import { getActivities, getRenewalJobActivities } from '@/services/employeeDashboardApi';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';

export default function EmployeeDetailsPage({ params }) {
    // Params and SearchParams
    const unwrappedParams = use(params);
    const empId = parseInt(unwrappedParams.empId);
    const searchParams = useSearchParams();
    const router = useRouter();

    const initialStartDate = searchParams.get('startDate') || dayjs().startOf('month').format('YYYY-MM-DD');
    const initialEndDate = searchParams.get('endDate') || dayjs().endOf('month').format('YYYY-MM-DD');
    const empName = searchParams.get('empName') || 'Employee';

    // State
    const [activeTab, setActiveTab] = useState('initial'); // 'initial' | 'renewal'
    const [activityFilter, setActivityFilter] = useState('service'); // 'service' | 'breakdown'
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(false);

    // Date filter state (default from URL or current month)
    const [filterDates, setFilterDates] = useState({
        startDate: initialStartDate,
        endDate: initialEndDate
    });

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(9); // 9 for grid (3x3), 10 for table

    useEffect(() => {
        fetchData();
        // Update URL query params without navigation to keep URL in sync (optional but good UI)
        // For now, we just rely on local state fetching
    }, [empId, filterDates.startDate, filterDates.endDate, activeTab, activityFilter]);

    // Handle Tab Change resets page
    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab, activityFilter, viewMode]);

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setFilterDates(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleExportToExcel = () => {
        if (!activities || activities.length === 0) return;

        // Flatten data for Excel
        const excelData = activities.map((item, index) => ({
            "Sr No": index + 1,
            "Date": item.activityDate,
            "Customer Name": item.customerName,
            "Site Name": item.siteName,
            "Site Address": item.siteaddress,
            "Technicians": item.assignedTechnicians?.map(t => t.name).join(", ") || "",
            "Status": "Completed",
            "Description": item.description,
            "Activity By": item.activityBy
        }));

        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Activities");

        const fileName = `Activity_Report_${empName.replace(/\s+/g, '_')}_${filterDates.startDate}_${filterDates.endDate}.xlsx`;
        XLSX.writeFile(wb, fileName);
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const typeParam = activityFilter;
            let data = [];
            const { startDate, endDate } = filterDates;

            if (activeTab === 'initial') {
                data = await getActivities(startDate, endDate, empId, typeParam);
            } else {
                data = await getRenewalJobActivities(startDate, endDate, empId, typeParam);
            }
            setActivities(data || []);
        } catch (error) {
            console.error("Error fetching activities", error);
        } finally {
            setLoading(false);
        }
    };

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = activities.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(activities.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                                <span className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-lg">
                                    {empName.charAt(0)}
                                </span>
                                {empName}
                            </h1>
                            <p className="text-slate-500 text-sm mt-1 ml-14">
                                Detailed Activity Report • <span className="font-semibold text-slate-800">{activities.length} Activities Found</span>
                            </p>
                        </div>
                    </div>

                    {/* Date Filters */}
                    <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-md border border-slate-200 ml-14 md:ml-0">
                        <Calendar className="text-slate-400 w-4 h-4" />
                        <div className="flex items-center gap-2">
                            <input
                                type="date"
                                name="startDate"
                                value={filterDates.startDate}
                                onChange={handleDateChange}
                                className="bg-transparent text-sm text-slate-700 outline-none cursor-pointer"
                            />
                            <span className="text-slate-400">-</span>
                            <input
                                type="date"
                                name="endDate"
                                value={filterDates.endDate}
                                onChange={handleDateChange}
                                className="bg-transparent text-sm text-slate-700 outline-none cursor-pointer"
                            />
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-2 ml-14">
                    <div className="flex gap-4 items-center w-full md:w-auto">
                        {/* Tabs */}
                        <div className="flex p-1 bg-slate-100 rounded-lg">
                            <button
                                onClick={() => setActiveTab('initial')}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'initial'
                                    ? 'bg-white text-slate-900 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                Initial Jobs
                            </button>
                            <button
                                onClick={() => setActiveTab('renewal')}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'renewal'
                                    ? 'bg-white text-slate-900 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                Renewal Jobs
                            </button>
                        </div>

                        {/* Activity Filter */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setActivityFilter('service')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${activityFilter === 'service'
                                    ? 'bg-green-50 border-green-200 text-green-700'
                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                <CheckCircle className="w-3.5 h-3.5" /> Service
                            </button>
                            <button
                                onClick={() => setActivityFilter('breakdown')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${activityFilter === 'breakdown'
                                    ? 'bg-red-50 border-red-200 text-red-700'
                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                <AlertTriangle className="w-3.5 h-3.5" /> Breakdown
                            </button>
                        </div>

                        {/* Export Button */}
                        <button
                            onClick={handleExportToExcel}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors bg-white shadow-sm"
                            title="Export to Excel"
                        >
                            <FileText className="w-3.5 h-3.5 text-green-600" /> Export Excel
                        </button>
                    </div>

                    {/* View Toggle */}
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        <button
                            onClick={() => { setViewMode('grid'); setItemsPerPage(9); }}
                            className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'
                                }`}
                            title="Grid View"
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => { setViewMode('table'); setItemsPerPage(10); }}
                            className={`p-2 rounded-md transition-all ${viewMode === 'table' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'
                                }`}
                            title="Table View"
                        >
                            <TableIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : activities.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-lg border border-slate-200 text-slate-500">
                    No activities found for the selected criteria.
                </div>
            ) : (
                <>
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {currentItems.map((activity, index) => (
                                <div key={index} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full overflow-hidden">
                                    <div className="bg-slate-50 px-5 py-3 border-b border-slate-100 flex justify-between items-center">
                                        <span className="font-semibold text-slate-700">
                                            Activity Details
                                        </span>
                                        <span className="text-xs font-medium text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">
                                            {activity.activityDate}
                                        </span>
                                    </div>

                                    <div className="p-5 flex-1 space-y-3">
                                        {/* Key: Value pairs */}
                                        <div className="grid gap-3 text-sm">
                                            <div className="grid grid-cols-[90px_1fr] gap-2">
                                                <span className="text-slate-400 font-medium">Customer:</span>
                                                <span className="text-slate-800 font-medium truncate" title={activity.customerName}>
                                                    {activity.customerName}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-[90px_1fr] gap-2">
                                                <span className="text-slate-400 font-medium">Site:</span>
                                                <span className="text-slate-700 font-medium line-clamp-2" title={`${activity.siteName} - ${activity.siteaddress}`}>
                                                    {activity.siteName}, {activity.siteaddress}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-[90px_1fr] gap-2">
                                                <span className="text-slate-400 font-medium">Techs:</span>
                                                <div className="flex flex-wrap gap-1">
                                                    {activity.assignedTechnicians?.length > 0 ? activity.assignedTechnicians.map((t, i) => (
                                                        <span key={i} className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded text-xs">{t.name}</span>
                                                    )) : <span className="italic text-slate-400">None</span>}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-[90px_1fr] gap-2">
                                                <span className="text-slate-400 font-medium">Status:</span>
                                                <span className="text-slate-700">Completed</span>
                                            </div>

                                            <div className="grid grid-cols-[90px_1fr] gap-2">
                                                <span className="text-slate-400 font-medium">Desc:</span>
                                                <span className="text-slate-600 line-clamp-2" title={activity.description}>
                                                    {activity.description || "No description provided"}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-[90px_1fr] gap-2">
                                                <span className="text-slate-400 font-medium">Activity By:</span>
                                                <span className="text-slate-700 flex items-center gap-1">
                                                    <User className="w-3 h-3 text-slate-400" /> {activity.activityBy}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                                    <tr>
                                        <th className="px-4 py-3 w-16">Sr No</th>
                                        <th className="px-4 py-3">Date</th>
                                        <th className="px-4 py-3">Customer</th>
                                        <th className="px-4 py-3">Site</th>
                                        <th className="px-4 py-3">Technicians</th>
                                        <th className="px-4 py-3">Description</th>
                                        <th className="px-4 py-3">Entry By</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {currentItems.map((activity, index) => (
                                        <tr key={index} className="hover:bg-slate-50">
                                            <td className="px-4 py-3 font-medium text-slate-500">
                                                {(currentPage - 1) * itemsPerPage + index + 1}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap font-medium text-slate-700">{activity.activityDate}</td>
                                            <td className="px-4 py-3 text-slate-800 font-semibold">{activity.customerName}</td>
                                            <td className="px-4 py-3 text-slate-600">
                                                <div className="flex flex-col">
                                                    <span>{activity.siteName}</span>
                                                    <span className="text-xs text-slate-400">{activity.siteaddress}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-wrap gap-1 max-w-[200px]">
                                                    {activity.assignedTechnicians?.map((t, i) => (
                                                        <span key={i} className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">{t.name}</span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-slate-600 max-w-xs truncate" title={activity.description}>
                                                {activity.description}
                                            </td>
                                            <td className="px-4 py-3 text-slate-500">{activity.activityBy}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination Controls */}
                    <div className="flex justify-between items-center mt-6 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                        <span className="text-sm text-slate-500">
                            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, activities.length)} of {activities.length} entries
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="p-2 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                // Simple pagination showing max 5 pages logic could be improved strictly but fine for now
                                let p = i + 1;
                                if (totalPages > 5 && currentPage > 3) {
                                    p = currentPage - 2 + i;
                                }
                                if (p > totalPages) return null;

                                return (
                                    <button
                                        key={p}
                                        onClick={() => handlePageChange(p)}
                                        className={`w-8 h-8 rounded text-sm font-medium transition-colors ${currentPage === p
                                            ? 'bg-indigo-600 text-white shadow-sm'
                                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                                            }`}
                                    >
                                        {p}
                                    </button>
                                );
                            })}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="p-2 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
