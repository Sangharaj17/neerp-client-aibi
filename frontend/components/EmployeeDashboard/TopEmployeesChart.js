"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function TopEmployeesChart({ data }) {
    if (!data || !data.emplActivityDatas || data.emplActivityDatas.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 bg-white rounded-lg border border-slate-200 text-slate-500">
                No data available for the selected period
            </div>
        );
    }

    // Transform data if needed, or pass directly if structure matches Recharts expectation
    // Recharts expects array of objects
    const chartData = data.emplActivityDatas;

    return (
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm h-full">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Top Employees by Activity</h3>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" />
                        <YAxis
                            dataKey="empname"
                            type="category"
                            width={150}
                            tick={{ fontSize: 12 }}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend />
                        <Bar dataKey="serviceActivityCount" name="Service" stackId="a" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                        <Bar dataKey="breakDownActivityCount" name="Breakdown" stackId="a" fill="#ef4444" radius={[0, 4, 4, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
