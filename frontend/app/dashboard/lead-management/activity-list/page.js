"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Loader2, X, ChevronLeft, ChevronRight } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import PageHeader from "@/components/UI/PageHeader";
import toast from "react-hot-toast";

export default function ActivityListPage() {
    const [search, setSearch] = useState("");
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [modalStep, setModalStep] = useState(1);
    const [saving, setSaving] = useState(false);
    const [feedback, setFeedback] = useState("");
    const [formErrors, setFormErrors] = useState({});

    // Todo Selection State
    const [todos, setTodos] = useState([]);
    const [todoSearch, setTodoSearch] = useState("");
    const [todoPage, setTodoPage] = useState(0);
    const [todoTotalPages, setTodoTotalPages] = useState(0);
    const [todoTotalElements, setTodoTotalElements] = useState(0);
    const [todoLoading, setTodoLoading] = useState(false);
    const [selectedTodo, setSelectedTodo] = useState(null);

    useEffect(() => {
        fetchActivities();
    }, [search, currentPage, pageSize]);

    const fetchActivities = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("/api/leadmanagement/lead-activity/leadTodoActivitylist", {
                params: { search, page: currentPage, size: pageSize }
            });

            const groupedData = res.data?.data || [];
            console.log("Activity List API Response:", res.data);
            console.log("Grouped Data:", groupedData);
            const flatActivities = [];

            groupedData.forEach(lead => {
                const leadName = lead.customerName || lead.leadCompanyName || "-";
                const todoWithActivities = lead.leadTodoWithActivities || [];
                const feedbacks = [];
                todoWithActivities.forEach(item => {
                    if (item.leadTodoActivity?.feedback) {
                        feedbacks.push(item.leadTodoActivity.feedback);
                    }
                });

                if (feedbacks.length > 0 || todoWithActivities.length > 0) {
                    flatActivities.push({
                        leadName,
                        feedback1: feedbacks[0] || "-",
                        feedback2: feedbacks[1] || "-",
                        feedback3: feedbacks[2] || "-",
                        feedback4: feedbacks[3] || "-",
                    });
                }
            });

            setActivities(flatActivities);
            setTotalPages(res.data?.totalPages || 0);
            setTotalElements(res.data?.totalElements || 0);
        } catch (error) {
            console.error("Error fetching activities:", error);
            setActivities([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchTodos = async () => {
        try {
            setTodoLoading(true);
            const res = await axiosInstance.get("/api/leadmanagement/lead-todos", {
                params: { search: todoSearch, page: todoPage, size: 5 }
            });
            setTodos(res.data?.data || []);
            setTodoTotalPages(res.data?.totalPages || 0);
            setTodoTotalElements(res.data?.totalElements || 0);
        } catch (err) {
            console.error("Failed to fetch todos", err);
            setTodos([]);
        } finally {
            setTodoLoading(false);
        }
    };

    useEffect(() => {
        if (showModal) {
            fetchTodos();
        }
    }, [showModal, todoSearch, todoPage]);

    const openModal = () => {
        setShowModal(true);
        setModalStep(1);
        setSelectedTodo(null);
        setFeedback("");
        setFormErrors({});
        setTodoSearch("");
        setTodoPage(0);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedTodo(null);
        setModalStep(1);
    };

    const handleSelectTodo = (todo) => {
        setSelectedTodo(todo);
        setFormErrors({});
    };

    const handleContinue = () => {
        if (!selectedTodo) {
            setFormErrors({ todo: "Please select a To-Do" });
            return;
        }
        setModalStep(2);
    };

    const handleSubmit = async () => {
        if (!feedback.trim()) {
            setFormErrors({ feedback: "Feedback is required" });
            return;
        }

        // Get current date and time
        const now = new Date();
        const activityDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
        const activityTime = now.toTimeString().split(' ')[0].substring(0, 5); // HH:MM

        const payload = {
            leadId: selectedTodo.leadId ? Number(selectedTodo.leadId) : null,
            todoId: selectedTodo.todoId ? Number(selectedTodo.todoId) : null,
            feedback: feedback.trim(),
            activityDate: activityDate,
            activityTime: activityTime,
        };

        try {
            setSaving(true);
            await axiosInstance.post("/api/leadmanagement/lead-activity", payload);
            toast.success("Activity saved successfully!");
            closeModal();
            fetchActivities();
        } catch (err) {
            console.error("Submit error:", err);
            toast.error(err?.response?.data?.message || "Failed to save activity.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <PageHeader title="Lead Activity List" description={`${totalElements} activities`} />

            <div className="px-6 py-5">
                {/* Actions Bar */}
                <div className="flex flex-wrap justify-between items-center mb-5 gap-3">
                    <button
                        onClick={openModal}
                        className="bg-neutral-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-neutral-800 transition flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Activity
                    </button>

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
                            onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(0); }}
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
                                    <td colSpan={6} className="text-center py-10 text-neutral-500">No activities found.</td>
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

            {/* Add Activity Modal - Simple Clean Design */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={closeModal}>
                    <div
                        className="bg-white w-full max-w-md rounded-lg shadow-xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200">
                            <h2 className="text-base font-semibold text-neutral-900">
                                {modalStep === 1 ? "Select To-Do" : "Add Feedback"}
                            </h2>
                            <button onClick={closeModal} className="p-1 hover:bg-neutral-100 rounded transition">
                                <X className="w-5 h-5 text-neutral-500" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-5">
                            {modalStep === 1 ? (
                                <div className="space-y-4">
                                    {/* Search */}
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                                        <input
                                            type="text"
                                            placeholder="Search todos..."
                                            value={todoSearch}
                                            onChange={(e) => { setTodoSearch(e.target.value); setTodoPage(0); }}
                                            className="w-full pl-9 pr-4 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-200"
                                        />
                                    </div>

                                    {/* Todo List */}
                                    <div className="border border-neutral-200 rounded-lg overflow-hidden">
                                        {todoLoading ? (
                                            <div className="py-8 text-center">
                                                <Loader2 className="w-5 h-5 animate-spin mx-auto text-neutral-400" />
                                            </div>
                                        ) : todos.length === 0 ? (
                                            <div className="py-8 text-center text-neutral-500 text-sm">No todos found</div>
                                        ) : (
                                            <div className="max-h-48 overflow-y-auto divide-y divide-neutral-100">
                                                {todos.map((todo) => (
                                                    <button
                                                        key={todo.todoId}
                                                        onClick={() => handleSelectTodo(todo)}
                                                        className={`w-full text-left px-4 py-3 hover:bg-neutral-50 transition ${selectedTodo?.todoId === todo.todoId ? 'bg-blue-50 border-l-2 border-l-blue-500' : ''}`}
                                                    >
                                                        <div className="font-medium text-neutral-800 text-sm">
                                                            {todo.customerName || todo.leadCompanyName || "Unknown"}
                                                        </div>
                                                        <div className="text-xs text-neutral-500 mt-0.5">
                                                            {todo.purpose || "No purpose"} • {todo.todoDate || ""}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {/* Pagination */}
                                        {todos.length > 0 && (
                                            <div className="flex items-center justify-between px-3 py-2 bg-neutral-50 border-t border-neutral-200">
                                                <span className="text-xs text-neutral-500">
                                                    Page {todoPage + 1} of {Math.max(1, todoTotalPages)}
                                                </span>
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => setTodoPage(p => Math.max(0, p - 1))}
                                                        disabled={todoPage === 0}
                                                        className="px-2 py-1 text-xs border border-neutral-300 rounded hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        Prev
                                                    </button>
                                                    <button
                                                        onClick={() => setTodoPage(p => p + 1 < todoTotalPages ? p + 1 : p)}
                                                        disabled={todoPage + 1 >= todoTotalPages}
                                                        className="px-2 py-1 text-xs border border-neutral-300 rounded hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        Next
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {formErrors.todo && <p className="text-xs text-red-500">{formErrors.todo}</p>}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {/* Selected Todo Info */}
                                    <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3">
                                        <div className="text-xs text-neutral-500 mb-1">Selected To-Do</div>
                                        <div className="font-medium text-neutral-800 text-sm">
                                            {selectedTodo?.customerName || selectedTodo?.leadCompanyName}
                                        </div>
                                        <div className="text-xs text-neutral-500">{selectedTodo?.purpose}</div>
                                    </div>

                                    {/* Feedback */}
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                                            Feedback <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            value={feedback}
                                            onChange={(e) => { setFeedback(e.target.value); setFormErrors({}); }}
                                            className={`w-full border px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-200 ${formErrors.feedback ? 'border-red-400' : 'border-neutral-300'}`}
                                            rows={4}
                                            placeholder="Enter your feedback..."
                                        />
                                        {formErrors.feedback && <p className="text-xs text-red-500 mt-1">{formErrors.feedback}</p>}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between px-5 py-4 border-t border-neutral-200 bg-neutral-50">
                            {modalStep === 1 ? (
                                <>
                                    <button onClick={closeModal} className="px-4 py-2 text-sm text-neutral-600 hover:text-neutral-900">
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleContinue}
                                        disabled={!selectedTodo}
                                        className="px-4 py-2 text-sm bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Continue
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => setModalStep(1)} className="px-4 py-2 text-sm text-neutral-600 hover:text-neutral-900 flex items-center gap-1">
                                        <ChevronLeft className="w-4 h-4" /> Back
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={saving}
                                        className="px-4 py-2 text-sm bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                                        {saving ? "Saving..." : "Save Activity"}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
