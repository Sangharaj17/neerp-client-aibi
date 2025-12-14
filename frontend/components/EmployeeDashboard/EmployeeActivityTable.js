"use client";

import { useState } from 'react';
import { ChevronDown, ChevronRight, Search, Filter } from 'lucide-react';

export default function EmployeeActivityTable({ data, onEmployeeClick, isLoading }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [navigatingEmpId, setNavigatingEmpId] = useState(null);

    const handleViewClick = (e, emp) => {
        e.stopPropagation(); // Prevent row click double trigger if row also has handler
        setNavigatingEmpId(emp.empId);
        onEmployeeClick(emp);
    };

    if (isLoading) {
        return (
            <div className="p-12 text-center text-slate-500">
                Loading employee data...
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="p-12 text-center text-slate-500 bg-white rounded-lg border border-slate-200">
                No employee activity data found for the selected period.
            </div>
        );
    }

    const filteredData = data.filter(emp =>
        emp.empName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between gap-4 items-center">
                <h3 className="text-lg font-semibold text-slate-800">
                    Employee Activity Details <span className="text-slate-500 text-sm font-normal ml-2">({data.length} Employees)</span>
                </h3>

                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search employee..."
                        className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                        <tr>
                            <th className="px-4 py-2 w-16">Sr No</th>
                            <th className="px-4 py-2">Employee Name</th>
                            <th className="px-4 py-2 text-center bg-blue-50/50">Assigned Service</th>
                            <th className="px-4 py-2 text-center bg-blue-50/50">Unassigned Service</th>
                            <th className="px-4 py-2 text-center bg-orange-50/50">Assigned Breakdown</th>
                            <th className="px-4 py-2 text-center bg-orange-50/50">Unassigned Breakdown</th>
                            <th className="px-4 py-2 text-center font-bold">Total Service</th>
                            <th className="px-4 py-2 text-center font-bold">Total Breakdown</th>
                            <th className="px-4 py-2 text-center">Total Assigned AMC</th>
                            <th className="px-4 py-2"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {filteredData.map((emp, index) => (
                            <tr
                                key={index}
                                className="hover:bg-slate-50 transition-colors cursor-pointer group"
                                onClick={(e) => handleViewClick(e, emp)}
                            >
                                <td className="px-4 py-2 font-medium text-slate-500">
                                    {index + 1}
                                </td>
                                <td className="px-4 py-2 font-medium text-slate-900">
                                    {emp.empName}
                                </td>
                                <td className="px-4 py-2 text-center bg-blue-50/30 text-blue-700 font-medium">
                                    {emp.assignedDoneServiceCounts || 0}
                                </td>
                                <td className="px-4 py-2 text-center bg-blue-50/30 text-blue-600">
                                    {emp.unassignedDoneServiceCounts || 0}
                                </td>
                                <td className="px-4 py-2 text-center bg-orange-50/30 text-orange-700 font-medium">
                                    {emp.assignedDoneBreakdownCounts || 0}
                                </td>
                                <td className="px-4 py-2 text-center bg-orange-50/30 text-orange-600">
                                    {emp.unassignedDoneBreakdownCounts || 0}
                                </td>
                                <td className="px-4 py-2 text-center font-bold text-slate-700">
                                    {emp.totalServiceDoneCounts || 0}
                                </td>
                                <td className="px-4 py-2 text-center font-bold text-slate-700">
                                    {emp.totalBreakDownDoneCounts || 0}
                                </td>
                                <td className="px-4 py-2 text-center text-slate-500">
                                    {emp.totalAssignedAmcJobs || 0}
                                </td>
                                <td className="px-4 py-2 text-right">
                                    <button
                                        className="px-3 py-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200 rounded text-xs font-semibold transition-colors shadow-sm flex items-center justify-center min-w-[60px]"
                                        disabled={navigatingEmpId === emp.empId}
                                    >
                                        {navigatingEmpId === emp.empId ? (
                                            <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            "View"
                                        )}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredData.length === 0 && (
                            <tr>
                                <td colSpan="9" className="px-6 py-8 text-center text-slate-500">
                                    No matching employees found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
