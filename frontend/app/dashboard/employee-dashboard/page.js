"use client";

import { useState, useEffect } from 'react';
import {
    getTopEmployeesByActivity,
    getYearlyActivityData,
    getEmployeeActivitiesCounts
} from '@/services/employeeDashboardApi';
import TopEmployeesChart from '@/components/EmployeeDashboard/TopEmployeesChart';
import YearlyActivityChart from '@/components/EmployeeDashboard/YearlyActivityChart';
import EmployeeActivityTable from '@/components/EmployeeDashboard/EmployeeActivityTable';
import { Calendar } from 'lucide-react';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';

export default function EmployeeDashboardPage() {
    const [dateRange, setDateRange] = useState({
        startDate: dayjs().startOf('month').format('YYYY-MM-DD'),
        endDate: dayjs().endOf('month').format('YYYY-MM-DD')
    });

    const [topEmployeesData, setTopEmployeesData] = useState(null);
    const [yearlyActivityData, setYearlyActivityData] = useState(null);
    const [employeeActivitiesData, setEmployeeActivitiesData] = useState([]);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        fetchDashboardData();
    }, [dateRange]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const { startDate, endDate } = dateRange;

            const [topEmplRes, yearlyRes, emplActivitiesRes] = await Promise.all([
                getTopEmployeesByActivity(startDate, endDate),
                getYearlyActivityData(), // Yearly data doesn't depend on date range filter usually, or it's always "last 12 months" from backend
                getEmployeeActivitiesCounts(startDate, endDate)
            ]);

            setTopEmployeesData(topEmplRes);
            setYearlyActivityData(yearlyRes);
            setEmployeeActivitiesData(emplActivitiesRes || []);
        } catch (error) {
            console.error("Failed to load dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setDateRange(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEmployeeClick = (employee) => {
        // Navigate to details page with query params
        const query = new URLSearchParams({
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
            empName: employee.empName || ''
        }).toString();

        // Check if empId exists (we added it to DTO earlier)
        if (employee.empId) {
            router.push(`/dashboard/employee-dashboard/${employee.empId}?${query}`);
        } else {
            console.error("No employee ID found", employee);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header & Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Employee Activity Dashboard</h1>
                    <p className="text-slate-500">Overview of employee performance and job activities</p>
                </div>

                <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-md border border-slate-200">
                    <Calendar className="text-slate-400 w-4 h-4" />
                    <div className="flex items-center gap-2">
                        <input
                            type="date"
                            name="startDate"
                            value={dateRange.startDate}
                            onChange={handleDateChange}
                            className="bg-transparent text-sm text-slate-700 outline-none cursor-pointer"
                        />
                        <span className="text-slate-400">-</span>
                        <input
                            type="date"
                            name="endDate"
                            value={dateRange.endDate}
                            onChange={handleDateChange}
                            className="bg-transparent text-sm text-slate-700 outline-none cursor-pointer"
                        />
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-96">
                    <TopEmployeesChart data={topEmployeesData} />
                </div>
                <div className="h-96">
                    <YearlyActivityChart data={yearlyActivityData} />
                </div>
            </div>

            {/* Detailed Table Section */}
            <div>
                <EmployeeActivityTable
                    data={employeeActivitiesData}
                    onEmployeeClick={handleEmployeeClick} // Updated handler
                    isLoading={loading}
                />
            </div>

            {/* Modal Removed */}
        </div>
    );
}
