"use client";

import { useState, useEffect } from 'react';
import { X, Calendar, MapPin, User, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { getActivities, getRenewalJobActivities } from '@/services/employeeDashboardApi';

export default function EmployeeDetailModal({ employee, dateRange, onClose }) {
    const [jobType, setJobType] = useState('initial'); // 'initial' or 'renewal'
    const [activityType, setActivityType] = useState('service'); // 'service' or 'breakdown'
    const [activities, setActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (employee && dateRange?.from && dateRange?.to) {
            fetchActivities();
        }
    }, [employee, dateRange, jobType, activityType]);

    const fetchActivities = async () => {
        if (!employee) return;

        setIsLoading(true);
        try {
            let data = [];
            const typeParam = activityType; // 'service' or 'breakdown'

            if (jobType === 'initial') {
                data = await getActivities(
                    dateRange.from,
                    dateRange.to,
                    employee.empId,
                    typeParam
                );
            } else {
                data = await getRenewalJobActivities(
                    dateRange.from,
                    dateRange.to,
                    employee.empId,
                    typeParam
                );
            }
            setActivities(data || []);
        } catch (error) {
            console.error("Error fetching details", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!employee) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col transform transition-all scale-100">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">
                                {employee.empName.charAt(0)}
                            </div>
                            {employee.empName}
                        </h2>
                        <p className="text-sm text-slate-500 mt-1 ml-10">
                            Activity Details • {dateRange.from} to {dateRange.to}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Controls Section */}
                <div className="p-4 bg-white border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
                    {/* Main Tabs (Job Type) */}
                    <div className="flex p-1 bg-slate-100 rounded-lg">
                        <button
                            onClick={() => setJobType('initial')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${jobType === 'initial'
                                    ? 'bg-white text-slate-900 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            Initial Jobs
                        </button>
                        <button
                            onClick={() => setJobType('renewal')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${jobType === 'renewal'
                                    ? 'bg-white text-slate-900 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            Renewal Jobs
                        </button>
                    </div>

                    {/* Activity Type Filters */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-500 font-medium mr-1">Activity Type:</span>
                        <button
                            onClick={() => setActivityType('service')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${activityType === 'service'
                                    ? 'bg-green-50 border-green-200 text-green-700'
                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Service
                        </button>
                        <button
                            onClick={() => setActivityType('breakdown')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${activityType === 'breakdown'
                                    ? 'bg-red-50 border-red-200 text-red-700'
                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Breakdown
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
                    {isLoading ? (
                        <div className="flex flex-col justify-center items-center h-48 text-slate-500">
                            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                            <span>Loading activities...</span>
                        </div>
                    ) : activities.length > 0 ? (
                        <div className="space-y-4">
                            {activities.map((activity, index) => (
                                <div key={index} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-slate-800 text-lg flex items-center gap-2">
                                                {activity.customerName}
                                            </h4>
                                            <div className="flex items-center text-slate-500 text-sm mt-1">
                                                <MapPin className="w-4 h-4 mr-1 text-slate-400" />
                                                {activity.siteName} • {activity.siteaddress}
                                            </div>
                                        </div>
                                        <span className="flex items-center text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 whitespace-nowrap ml-4">
                                            <Calendar className="w-3.5 h-3.5 mr-1.5" />
                                            {activity.activityDate}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 bg-slate-50 p-4 rounded-lg">
                                        <div>
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Assigned Technicians</span>
                                            <div className="flex flex-wrap gap-2">
                                                {activity.assignedTechnicians && activity.assignedTechnicians.length > 0 ? (
                                                    activity.assignedTechnicians.map((tech, idx) => (
                                                        <span key={idx} className="flex items-center text-sm text-slate-700 bg-white px-2 py-1 rounded border border-slate-200 shadow-sm">
                                                            <User className="w-3 h-3 mr-1.5 text-blue-400" />
                                                            {tech.empName}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-sm text-slate-400 italic">None assigned</span>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Performed By</span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">
                                                    {activity.activityBy ? activity.activityBy.charAt(0) : '?'}
                                                </div>
                                                <span className="text-sm text-slate-700 font-medium">
                                                    {activity.activityBy}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {activity.description && (
                                        <div className="mt-4 pt-3 border-t border-slate-100">
                                            <p className="text-sm text-slate-600 leading-relaxed flex items-start">
                                                <FileText className="w-4 h-4 mr-2 text-slate-400 mt-0.5 flex-shrink-0" />
                                                {activity.description}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                <FileText className="w-8 h-8 text-slate-300" />
                            </div>
                            <p className="text-lg font-medium text-slate-600">No activities found</p>
                            <p className="text-sm">Try changing the filter or date range.</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-100 bg-slate-50/50 rounded-b-xl flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium rounded-lg transition-colors shadow-sm"
                    >
                        Close Details
                    </button>
                </div>
            </div>
        </div>
    );
}
