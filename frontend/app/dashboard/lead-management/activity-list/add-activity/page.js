// "use client";

// import { useState, useEffect } from "react";
// import { useSearchParams, useRouter, useParams } from "next/navigation";
// import { Save, X } from "lucide-react";
// import axios from "axios";
// import toast from "react-hot-toast";

// export default function AddActivityPage() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const params = useParams();
//   const tenant = params?.tenant;

//   const [leadId, setLeadId] = useState("");
//   const [todoId, setTodoId] = useState("");
//   const [leadName, setLeadName] = useState("");
//   const [salesEnggName, setSalesEnggName] = useState("");
//   const [leadCompanyName, setLeadCompanyName] = useState("");
//   const [siteName, setSiteName] = useState("");
//   const [siteAddress, setSiteAddress] = useState("");
//   const [contactNo, setContactNo] = useState("");
//   const [emailId, setEmailId] = useState("");
//   const [leadStage, setLeadStage] = useState("");
//   const [leadType, setLeadType] = useState("");
//   const [todoName, setTodoName] = useState("");
//   const [venue, setVenue] = useState("");
//   const [feedback, setFeedback] = useState("");

//   const [todoOptions, setTodoOptions] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [isButtonMode, setIsButtonMode] = useState(false);

//   useEffect(() => {
//     const qLeadId = searchParams?.get("leadId");
//     const qTodoId = searchParams?.get("todoId");

//     if (qLeadId && qTodoId) {
//       setIsButtonMode(true);
//       fetchPrefill(qLeadId, qTodoId);
//     } else {
//       fetchTodoOptions();
//     }
//   }, []);

//   const fetchPrefill = async (lId, tId) => {
//     try {
//       setLoading(true);
//       const res = await axios.get(
//         "https://neerp-client-aibi-backend.scrollconnect.com/api/leadmanagement/lead-activity/addLeadActivityGetData",
//         { params: { leadId: Number(lId), todoId: Number(tId) } }
//       );
//       const d = res.data || {};

//       // Always set IDs explicitly so backend accepts
//       setLeadId(Number(d.leadId ?? d.lead?.leadId ?? lId));
//       setTodoId(Number(d.todoId ?? d.todo?.todoId ?? tId));

//       // Lead name fallback: prefer company name if not set
//       const fetchedLeadName =
//         d.customerName ??
//         d.leadName ??
//         d.lead?.customerName ??
//         d.leadCompanyName ??
//         d.lead?.companyName ??
//         "";
//       setLeadName(fetchedLeadName);
//       setLeadCompanyName(d.leadCompanyName ?? d.lead?.companyName ?? "");
//       setSalesEnggName(d.activityByEmpName ?? d.assignedTo ?? "");
//       setSiteName(d.siteName ?? d.lead?.siteName ?? "");
//       setSiteAddress(d.siteAddress ?? d.lead?.siteAddress ?? "");
//       setContactNo(d.contactNo ?? d.lead?.contactNo ?? "");
//       setEmailId(d.email ?? d.lead?.email ?? "");
//       setLeadStage(d.leadStage ?? d.lead?.leadStage ?? "");
//       setLeadType(d.leadType ?? d.lead?.leadType ?? "");
//       setTodoName(d.todoName ?? d.purpose ?? d.todo?.purpose ?? "");
//       setVenue(d.venue ?? d.todo?.venue ?? "");
//       setFeedback("");
//     } catch (err) {
//       toast.error("Failed to load lead/todo data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchTodoOptions = async () => {
//     try {
//       const res = await axios.get("https://neerp-client-aibi-backend.scrollconnect.com/api/leadmanagement/lead-todos", {
//         params: { search: "", page: 0, size: 1000 },
//       });
//       setTodoOptions(res.data?.data || []);
//     } catch (err) {
//       console.error("Failed to fetch todo options", err);
//     }
//   };

//   const handleTodoSelect = async (e) => {
//     const selectedTodoId = e.target.value;
//     setTodoId(selectedTodoId || "");
//     setFeedback("");
//     if (!selectedTodoId) {
//       setLeadId("");
//       setLeadName("");
//       setLeadCompanyName("");
//       setSalesEnggName("");
//       setSiteName("");
//       setSiteAddress("");
//       setContactNo("");
//       setEmailId("");
//       setLeadStage("");
//       setLeadType("");
//       setTodoName("");
//       setVenue("");
//       return;
//     }

//     const selected = todoOptions.find((t) => String(t.todoId) === String(selectedTodoId));
//     const selLeadId = selected?.leadId ?? selected?.lead?.leadId;

//     if (selLeadId) {
//       await fetchPrefill(selLeadId, selectedTodoId);
//     } else {
//       await fetchPrefill("", selectedTodoId);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // ✅ Changed here: send null instead of undefined to avoid backend issues
//     const payload = {
//       leadId: leadId ? Number(leadId) : null,
//       todoId: todoId ? Number(todoId) : null,
//       todoName: todoName?.trim() || "",
//       feedback: feedback?.trim() || "",
//     };

//     try {
//       setLoading(true);
//       await axios.post("https://neerp-client-aibi-backend.scrollconnect.com/api/leadmanagement/lead-activity", payload);
//       toast.success("Activity created successfully.");
//       router.push(`/dashboard/lead-management/activity-list`);
//     } catch (err) {
//       toast.error(err?.response?.data?.message || "Failed to create activity.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-4">
//       <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
//         <span className="text-blue-600">📝</span> Create Activity
//       </h2>

//       <div className="border rounded shadow-sm bg-white overflow-hidden mb-4">
//         <table className="w-full border-collapse border border-gray-300 text-sm">
//           <tbody>
//             <tr>
//               <td className="border p-2 font-semibold w-1/6">Lead Type</td>
//               <td className="border p-2 w-1/3">{leadType || "-"}</td>
//               <td className="border p-2 font-semibold w-1/6">Contact No</td>
//               <td className="border p-2 w-1/3">{contactNo || "-"}</td>
//             </tr>
//             <tr>
//               <td className="border p-2">Sales Engg. Name</td>
//               <td className="border p-2">{salesEnggName || "-"}</td>
//               <td className="border p-2">Site Name</td>
//               <td className="border p-2">{siteName || "-"}</td>
//             </tr>
//             <tr>
//               <td className="border p-2">Lead Company Name</td>
//               <td className="border p-2">{leadCompanyName || "-"}</td>
//               <td className="border p-2">Site Address</td>
//               <td className="border p-2">{siteAddress || "-"}</td>
//             </tr>
//             <tr>
//               <td className="border p-2">Lead Name</td>
//               <td className="border p-2">{leadName || "-"}</td>
//               <td className="border p-2">Lead Stage</td>
//               <td className="border p-2">{leadStage || "-"}</td>
//             </tr>
//             <tr>
//               <td className="border p-2">Email Id</td>
//               <td className="border p-2">{emailId || "-"}</td>
//               <td className="border p-2">Venue</td>
//               <td className="border p-2">{venue || "-"}</td>
//             </tr>
//           </tbody>
//         </table>
//       </div>

//       <form onSubmit={handleSubmit} className="p-4 border rounded bg-white">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
//           <div>
//             <label className="font-semibold">Lead Name</label>
//             <input
//               type="text"
//               value={leadName}
//               disabled
//               className="w-full border rounded p-2 mt-1 bg-gray-100"
//             />
//           </div>

//           <div>
//             <label className="font-semibold">Todo Name</label>
//             {isButtonMode ? (
//               <input
//                 type="text"
//                 value={todoName}
//                 disabled
//                 className="w-full border rounded p-2 mt-1 bg-gray-100"
//               />
//             ) : (
//               <select
//                 value={todoId}
//                 onChange={handleTodoSelect}
//                 className="w-full border rounded p-2 mt-1"
//               >
//                 <option value="">Please Select</option>
//                 {todoOptions.map((t) => (
//                   <option key={t.todoId} value={t.todoId}>
//                     {t.purpose || `Todo ${t.todoId}`} — {t.customerName ?? ""}
//                   </option>
//                 ))}
//               </select>
//             )}
//           </div>

//           <div className="md:col-span-2">
//             <label className="font-semibold">
//               Feedback<span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               value={feedback}
//               onChange={(e) => setFeedback(e.target.value)}
//               className="w-full border rounded p-2 mt-1"
//               required
//             />
//           </div>
//         </div>

//         <div className="flex justify-between items-center px-4 pb-4 mt-4">
//           <p className="text-sm text-red-500">
//             <span className="font-semibold">Note:</span> Fields marked with{" "}
//             <span className="text-red-500">*</span> are Mandatory
//           </p>
//           <div className="flex gap-2">
//             <button
//               type="submit"
//               className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-1"
//               disabled={loading}
//             >
//               <Save size={16} /> {loading ? "Saving..." : "Submit"}
//             </button>
//             <button
//               type="button"
//               onClick={() => router.push(`/dashboard/lead-management/activity-list`)}
//               className="bg-red-500 text-white px-4 py-2 rounded flex items-center gap-1"
//               disabled={loading}
//             >
//               <X size={16} /> Cancel
//             </button>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// }
