"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Loader2 } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import PageHeader from "@/components/UI/PageHeader";

export default function ActivityListPage() {
    const [search, setSearch] = useState("");
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    useEffect(() => {
        fetchActivities();
    }, [search, currentPage, pageSize]);

    const fetchActivities = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("/api/leadmanagement/lead-activity/leadTodoActivitylist", {
                params: { search, page: currentPage, size: pageSize }
            });
            setActivities(res.data?.data || []);
            setTotalPages(res.data?.totalPages || 0);
            setTotalElements(res.data?.totalElements || 0);
        } catch (error) {
            console.error("Error fetching activities:", error);
            setActivities([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <PageHeader title="Lead Activity List" description={`${totalElements} activities`} />

            <div className="px-6 py-5">
                {/* Actions Bar */}
                <div className="flex flex-wrap justify-between items-center mb-5 gap-3">
                    <Link href="./activity-list/add-activity">
                        <button className="bg-neutral-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-neutral-800 transition flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Add Activity
                        </button>
                    </Link>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search activities..."
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setCurrentPage(0); }}
                                className="pl-9 pr-4 py-2 border border-neutral-300 rounded-lg text-sm w-72 focus:outline-none focus:ring-2 focus:ring-neutral-200 transition"
                            />
                        </div>

                        <select
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(Number(e.target.value));
                                setCurrentPage(0);
                            }}
                            className="px-3 py-2 border border-neutral-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-neutral-200 transition"
                        >
                            {[10, 25, 50, 100].map((n) => (
                                <option key={n} value={n}>Show {n}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto border border-neutral-200 rounded-lg">
                    <table className="min-w-full w-full text-sm">
                        <thead>
                            <tr className="bg-neutral-100">
                                <th className="text-left px-4 py-3 font-semibold text-neutral-700 border-b border-neutral-200 w-16">Sr.</th>
                                <th className="text-left px-4 py-3 font-semibold text-neutral-700 border-b border-neutral-200">Lead Name</th>
                                <th className="text-left px-4 py-3 font-semibold text-neutral-700 border-b border-neutral-200">Feedback 1</th>
                                <th className="text-left px-4 py-3 font-semibold text-neutral-700 border-b border-neutral-200">Feedback 2</th>
                                <th className="text-left px-4 py-3 font-semibold text-neutral-700 border-b border-neutral-200">Feedback 3</th>
                                <th className="text-left px-4 py-3 font-semibold text-neutral-700 border-b border-neutral-200">Feedback 4</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-10">
                                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-neutral-400" />
                                        <p className="text-neutral-500 mt-2">Loading...</p>
                                    </td>
                                </tr>
                            ) : activities.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-10 text-neutral-500">
                                        No activities found.
                                    </td>
                                </tr>
                            ) : (
                                activities.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-neutral-50 transition border-b border-neutral-100">
                                        <td className="px-4 py-3 text-neutral-600">{currentPage * pageSize + idx + 1}</td>
                                        <td className="px-4 py-3 font-medium text-neutral-900">{item.leadName || "-"}</td>
                                        <td className="px-4 py-3 text-neutral-600">{item.feedback1 || "-"}</td>
                                        <td className="px-4 py-3 text-neutral-600">{item.feedback2 || "-"}</td>
                                        <td className="px-4 py-3 text-neutral-600">{item.feedback3 || "-"}</td>
                                        <td className="px-4 py-3 text-neutral-600">{item.feedback4 || "-"}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-5 flex items-center justify-between flex-wrap gap-2">
                    <p className="text-sm text-neutral-500">
                        Showing {totalElements === 0 ? 0 : currentPage * pageSize + 1} to{" "}
                        {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} entries
                    </p>
                    <div className="flex gap-1">
                        <button
                            disabled={currentPage === 0}
                            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                            className="px-3 py-1.5 border border-neutral-300 rounded-lg text-sm hover:bg-neutral-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <div className="px-3 py-1.5 border border-neutral-900 bg-neutral-900 text-white rounded-lg text-sm">{currentPage + 1}</div>
                        <button
                            disabled={currentPage + 1 >= totalPages}
                            onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                            className="px-3 py-1.5 border border-neutral-300 rounded-lg text-sm hover:bg-neutral-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
