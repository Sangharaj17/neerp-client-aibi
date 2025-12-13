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

export default function EmployeeDetailsPage({ params }) {
    // Params and SearchParams
    const unwrappedParams = use(params);
    const empId = parseInt(unwrappedParams.empId);
    const searchParams = useSearchParams();
    const router = useRouter();

    const startDate = searchParams.get('startDate') || dayjs().startOf('month').format('YYYY-MM-DD');
    const endDate = searchParams.get('endDate') || dayjs().endOf('month').format('YYYY-MM-DD');
    const empName = searchParams.get('empName') || 'Employee';

    // State
    const [activeTab, setActiveTab] = useState('initial'); // 'initial' | 'renewal'
    const [activityFilter, setActivityFilter] = useState('service'); // 'service' | 'breakdown'
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(false);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(9); // 9 for grid (3x3), 10 for table

    useEffect(() => {
        fetchData();
    }, [empId, startDate, endDate, activeTab, activityFilter]);

    // Handle Tab Change resets page
    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab, activityFilter, viewMode]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const typeParam = activityFilter;
            let data = [];
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
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                            <span className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-lg">
                                {empName.charAt(0)}
                            </span>
                            {empName}
                        </h1>
                        <p className="text-slate-500 text-sm mt-1 ml-14">
                            Detailed Activity Report ({startDate} to {endDate})
                        </p>
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
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
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
                                <div key={index} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-3">
                                        <h4 className="font-semibold text-slate-800 text-lg flex-1 line-clamp-1" title={activity.customerName}>
                                            {activity.customerName}
                                        </h4>
                                        <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded whitespace-nowrap ml-2">
                                            {activity.activityDate}
                                        </span>
                                    </div>

                                    <div className="text-sm text-slate-500 mb-3 flex items-start h-10">
                                        <MapPin className="w-4 h-4 mr-1 text-slate-400 mt-0.5 flex-shrink-0" />
                                        <span className="line-clamp-2" title={`${activity.siteName} - ${activity.siteaddress}`}>
                                            {activity.siteName} • {activity.siteaddress}
                                        </span>
                                    </div>

                                    <div className="flex-1 space-y-3">
                                        <div className="bg-slate-50 p-2 rounded text-xs">
                                            <span className="font-semibold text-slate-500 uppercase block mb-1">Technicians</span>
                                            <div className="flex flex-wrap gap-1">
                                                {activity.assignedTechnicians?.length > 0 ? activity.assignedTechnicians.map((t, i) => (
                                                    <span key={i} className="bg-white border px-1.5 py-0.5 rounded text-slate-700">{t.name}</span>
                                                )) : <span className="italic text-slate-400">None</span>}
                                            </div>
                                        </div>
                                        {activity.description && (
                                            <p className="text-sm text-slate-600 line-clamp-2" title={activity.description}>
                                                {activity.description}
                                            </p>
                                        )}
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                                        <span>By: {activity.activityBy}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                                    <tr>
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
                                            ? 'bg-blue-600 text-white shadow-sm'
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
