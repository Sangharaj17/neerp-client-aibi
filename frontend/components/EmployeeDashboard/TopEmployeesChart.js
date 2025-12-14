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

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-slate-100 shadow-xl rounded-lg">
                    <p className="font-semibold text-slate-800 mb-2">{label}</p>
                    {payload.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm mb-1">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="text-slate-500 capitalize">{entry.name}:</span>
                            <span className="font-medium text-slate-700">{entry.value}</span>
                        </div>
                    ))}
                    <div className="mt-2 pt-2 border-t border-slate-100 flex justify-between items-center text-sm font-medium">
                        <span className="text-slate-500">Total:</span>
                        <span className="text-slate-800">
                            {payload.reduce((sum, entry) => sum + entry.value, 0)}
                        </span>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm h-full">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">Top Employees by Activity</h3>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                        barSize={32}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="empname"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12 }}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        <Bar
                            dataKey="serviceActivityCount"
                            name="Service"
                            stackId="a"
                            fill="#6366f1" // Indigo 500
                            radius={[0, 0, 4, 4]} // Rounded bottom for bottom stack? No, usually middle is straight
                        />
                        <Bar
                            dataKey="breakDownActivityCount"
                            name="Breakdown"
                            stackId="a"
                            fill="#ec4899" // Pink 500
                            radius={[4, 4, 0, 0]} // Rounded top
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
