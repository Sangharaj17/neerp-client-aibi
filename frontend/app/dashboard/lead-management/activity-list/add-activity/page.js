"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { Save, X, List } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import toast from "react-hot-toast";
import PageHeader from "@/components/UI/PageHeader";

function AddActivityContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const params = useParams();

    const [leadId, setLeadId] = useState("");
    const [todoId, setTodoId] = useState("");
    const [leadName, setLeadName] = useState("");
    const [salesEnggName, setSalesEnggName] = useState("");
    const [leadCompanyName, setLeadCompanyName] = useState("");
    const [siteName, setSiteName] = useState("");
    const [siteAddress, setSiteAddress] = useState("");
    const [contactNo, setContactNo] = useState("");
    const [emailId, setEmailId] = useState("");
    const [leadStage, setLeadStage] = useState("");
    const [leadType, setLeadType] = useState("");
    const [todoName, setTodoName] = useState("");
    const [venue, setVenue] = useState("");
    const [feedback, setFeedback] = useState("");

    const [todoOptions, setTodoOptions] = useState([]);
    const [loading, setLoading] = useState(false);

    const [isButtonMode, setIsButtonMode] = useState(false);

    useEffect(() => {
        const qLeadId = searchParams?.get("leadId");
        const qTodoId = searchParams?.get("todoId");

        if (qLeadId && qTodoId) {
            setIsButtonMode(true);
            fetchPrefill(qLeadId, qTodoId);
        } else {
            fetchTodoOptions();
        }
    }, []);

    const fetchPrefill = async (lId, tId) => {
        try {
            setLoading(true);
            const res = await axiosInstance.get(
                "/api/leadmanagement/lead-activity/addLeadActivityGetData",
                { params: { leadId: Number(lId), todoId: Number(tId) } }
            );
            const d = res.data || {};

            setLeadId(Number(d.leadId ?? lId));
            setTodoId(Number(d.todoId ?? tId));

            // Map backend field names correctly
            setLeadName(d.customerName ?? d.contactName ?? "");
            setLeadCompanyName(d.leadCompName ?? "");
            setSalesEnggName(d.salesEnggName ?? "");
            setSiteName(d.siteName ?? "");
            setSiteAddress(d.siteAddress ?? "");
            setContactNo(d.contactNo ?? "");
            setEmailId(d.emailid ?? "");
            setLeadStage(d.leadStage ?? "");
            setLeadType(d.leadType ?? "");
            setTodoName(d.todoName ?? "");
            setVenue(d.venue ?? "");
            setFeedback("");
        } catch (err) {
            toast.error("Failed to load lead/todo data");
        } finally {
            setLoading(false);
        }
    };

    const fetchTodoOptions = async () => {
        try {
            const res = await axiosInstance.get("/api/leadmanagement/lead-todos", {
                params: { search: "", page: 0, size: 1000 },
            });
            setTodoOptions(res.data?.data || []);
        } catch (err) {
            console.error("Failed to fetch todo options", err);
        }
    };

    const handleTodoSelect = async (e) => {
        const selectedTodoId = e.target.value;
        setTodoId(selectedTodoId || "");
        setFeedback("");
        if (!selectedTodoId) {
            setLeadId("");
            setLeadName("");
            setLeadCompanyName("");
            setSalesEnggName("");
            setSiteName("");
            setSiteAddress("");
            setContactNo("");
            setEmailId("");
            setLeadStage("");
            setLeadType("");
            setTodoName("");
            setVenue("");
            return;
        }

        const selected = todoOptions.find((t) => String(t.todoId) === String(selectedTodoId));
        const selLeadId = selected?.leadId ?? selected?.lead?.leadId;

        if (selLeadId) {
            await fetchPrefill(selLeadId, selectedTodoId);
        } else {
            await fetchPrefill("", selectedTodoId);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Get current date and time for the activity
        const now = new Date();
        const activityDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
        const activityTime = now.toTimeString().split(' ')[0].substring(0, 5); // HH:MM

        const payload = {
            leadId: leadId ? Number(leadId) : null,
            todoId: todoId ? Number(todoId) : null,
            feedback: feedback?.trim() || "",
            activityDate: activityDate,
            activityTime: activityTime,
        };

        try {
            setLoading(true);
            await axiosInstance.post("/api/leadmanagement/lead-activity", payload);
            toast.success("Activity created successfully.");
            router.push(`/dashboard/lead-management/activity-list`);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to create activity.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <PageHeader title="Add Activity" description="Create a new lead activity" />

            <div className="px-6 py-5">
                {/* Lead Info Card */}
                <div className="border border-neutral-200 rounded-lg overflow-hidden mb-6">
                    <div className="bg-neutral-50 px-4 py-3 border-b border-neutral-200">
                        <h3 className="text-sm font-medium text-neutral-700">Lead Information</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 text-sm">
                        <div className="p-3 border-b border-r border-neutral-200">
                            <span className="text-neutral-500">Lead Type</span>
                            <p className="font-medium text-neutral-900 mt-0.5">{leadType || "-"}</p>
                        </div>
                        <div className="p-3 border-b border-r border-neutral-200">
                            <span className="text-neutral-500">Contact No</span>
                            <p className="font-medium text-neutral-900 mt-0.5">{contactNo || "-"}</p>
                        </div>
                        <div className="p-3 border-b border-r border-neutral-200">
                            <span className="text-neutral-500">Sales Engineer</span>
                            <p className="font-medium text-neutral-900 mt-0.5">{salesEnggName || "-"}</p>
                        </div>
                        <div className="p-3 border-b border-neutral-200">
                            <span className="text-neutral-500">Site Name</span>
                            <p className="font-medium text-neutral-900 mt-0.5">{siteName || "-"}</p>
                        </div>
                        <div className="p-3 border-b border-r border-neutral-200">
                            <span className="text-neutral-500">Company</span>
                            <p className="font-medium text-neutral-900 mt-0.5">{leadCompanyName || "-"}</p>
                        </div>
                        <div className="p-3 border-b border-r border-neutral-200">
                            <span className="text-neutral-500">Site Address</span>
                            <p className="font-medium text-neutral-900 mt-0.5">{siteAddress || "-"}</p>
                        </div>
                        <div className="p-3 border-b border-r border-neutral-200">
                            <span className="text-neutral-500">Lead Name</span>
                            <p className="font-medium text-neutral-900 mt-0.5">{leadName || "-"}</p>
                        </div>
                        <div className="p-3 border-b border-neutral-200">
                            <span className="text-neutral-500">Lead Stage</span>
                            <p className="font-medium text-neutral-900 mt-0.5">{leadStage || "-"}</p>
                        </div>
                        <div className="p-3 border-r border-neutral-200">
                            <span className="text-neutral-500">Email</span>
                            <p className="font-medium text-neutral-900 mt-0.5">{emailId || "-"}</p>
                        </div>
                        <div className="p-3">
                            <span className="text-neutral-500">Venue</span>
                            <p className="font-medium text-neutral-900 mt-0.5">{venue || "-"}</p>
                        </div>
                    </div>
                </div>

                {/* Activity Form */}
                <form onSubmit={handleSubmit} className="border border-neutral-200 rounded-lg overflow-hidden">
                    <div className="bg-neutral-50 px-4 py-3 border-b border-neutral-200">
                        <h3 className="text-sm font-medium text-neutral-700">Activity Details</h3>
                    </div>

                    <div className="p-5 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Lead Name</label>
                                <input
                                    type="text"
                                    value={leadName}
                                    disabled
                                    className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm bg-neutral-100 text-neutral-600"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Todo Name</label>
                                {isButtonMode ? (
                                    <input
                                        type="text"
                                        value={todoName}
                                        disabled
                                        className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm bg-neutral-100 text-neutral-600"
                                    />
                                ) : (
                                    <select
                                        value={todoId}
                                        onChange={handleTodoSelect}
                                        className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-200"
                                    >
                                        <option value="">Please Select</option>
                                        {todoOptions.map((t) => (
                                            <option key={t.todoId} value={t.todoId}>
                                                {t.purpose || `Todo ${t.todoId}`} — {t.customerName ?? ""}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">
                                Feedback <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-200"
                                rows={3}
                                required
                                placeholder="Enter your feedback..."
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between px-5 py-4 border-t border-neutral-200 bg-neutral-50">
                        <p className="text-xs text-neutral-500">
                            Fields marked with <span className="text-red-500">*</span> are mandatory
                        </p>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => router.push(`/dashboard/lead-management/to-do-list`)}
                                className="px-4 py-2 text-sm font-medium text-neutral-600 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition flex items-center gap-1"
                                disabled={loading}
                            >
                                <X size={16} /> Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => router.push(`/dashboard/lead-management/activity-list`)}
                                className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition flex items-center gap-1"
                            >
                                <List size={16} /> View Activity List
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition flex items-center gap-1 disabled:opacity-50"
                                disabled={loading}
                            >
                                <Save size={16} /> {loading ? "Saving..." : "Submit"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function AddActivityPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-neutral-600">Loading...</div>
            </div>
        }>
            <AddActivityContent />
        </Suspense>
    );
}
