"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function YearlyActivityChart({ data }) {
    if (!data || !data.monthlyActivityCounts || data.monthlyActivityCounts.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 bg-white rounded-lg border border-slate-200 text-slate-500">
                No yearly activity data available
            </div>
        );
    }

    // Backend returns data starting with Current Month (index 0). 
    // We want to display Current Month at the rightmost side (last).
    // So we rotate the array: move the first element to the end.
    const chartData = [
        ...data.monthlyActivityCounts.slice(1),
        data.monthlyActivityCounts[0]
    ];

    return (
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm h-full">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-slate-800">Yearly Activity Overview</h3>
                <span className="text-sm font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
                    {data.currentYear}
                </span>
            </div>

            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend />
                        <Bar dataKey="totalServicesCounts" name="Services" fill="#10b981" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="totalBreakDownsCounts" name="Breakdowns" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
