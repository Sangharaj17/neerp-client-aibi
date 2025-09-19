// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";

// export default function ActivityListPage() {
//   const [search, setSearch] = useState("");
//   const [activities, setActivities] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchActivities();
//   }, [search]);

//   const fetchActivities = async () => {
//     try {
//       setLoading(true);

//       // Base URL from environment or default to localhost:8080
//       const baseUrl =
//         process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

//       // Correct backend API endpoint for Activity List
//       const url = `${baseUrl}/api/leadmanagement/lead-activity/leadTodoActivitylist?search=${encodeURIComponent(
//         search
//       )}&page=0&size=10`;

//       const res = await fetch(url);

//       if (!res.ok) {
//         const errorText = await res.text();
//         console.error(`❌ API Error (${res.status} ${res.statusText}):`, errorText);
//         throw new Error(`API returned status ${res.status}`);
//       }

//       let data;
//       try {
//         data = await res.json();
//       } catch {
//         const rawText = await res.text();
//         console.error("❌ Response was not valid JSON. Raw response:", rawText);
//         throw new Error("Response is not valid JSON");
//       }

//       // PaginatedResponse<LeadTodoAndActivityData> → .data is the list
//       setActivities(data.data || []);
//     } catch (error) {
//       console.error("Error fetching activities:", error);
//       setActivities([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-4">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg font-semibold">Lead Activity List</h2>
//         <Link href="./activity-list/add-activity">
//           <button className="bg-blue-500 text-white px-4 py-2 rounded">
//             Add Activity
//           </button>
//         </Link>
//       </div>

//       {/* Search + Page Size */}
//       <div className="flex items-center gap-2 mb-3">
//         <label className="text-sm font-medium">Show</label>
//         <select className="border rounded p-1 text-sm">
//           <option>10</option>
//           <option>25</option>
//           <option>50</option>
//         </select>
//         <span className="text-sm">entries</span>

//         <div className="ml-auto flex items-center gap-1">
//           <label className="text-sm font-medium">Search:</label>
//           <input
//             type="text"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="border rounded p-1 text-sm"
//           />
//         </div>
//       </div>

//       {/* Table */}
//       <div className="border rounded overflow-hidden shadow-sm bg-white">
//         <table className="w-full border-collapse border border-gray-300 text-sm">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="border border-gray-300 p-2 w-12">Sr. No.</th>
//               <th className="border border-gray-300 p-2">Lead Name</th>
//               <th className="border border-gray-300 p-2">Feedback 1</th>
//               <th className="border border-gray-300 p-2">Feedback 2</th>
//               <th className="border border-gray-300 p-2">Feedback 3</th>
//               <th className="border border-gray-300 p-2">Feedback 4</th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr>
//                 <td colSpan="6" className="text-center p-4">
//                   Loading...
//                 </td>
//               </tr>
//             ) : activities.length === 0 ? (
//               <tr>
//                 <td colSpan="6" className="text-center p-4">
//                   No activities found.
//                 </td>
//               </tr>
//             ) : (
//               activities.map((item, idx) => (
//                 <tr key={idx} className="hover:bg-gray-50">
//                   <td className="border border-gray-300 p-2 text-center">
//                     {idx + 1}
//                   </td>
//                   <td className="border border-gray-300 p-2">
//                     {item.leadName}
//                   </td>
//                   <td className="border border-gray-300 p-2">
//                     {item.feedback1}
//                   </td>
//                   <td className="border border-gray-300 p-2">
//                     {item.feedback2}
//                   </td>
//                   <td className="border border-gray-300 p-2">
//                     {item.feedback3}
//                   </td>
//                   <td className="border border-gray-300 p-2">
//                     {item.feedback4}
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>

//         {/* Pagination */}
//         <div className="flex items-center justify-between p-2 text-sm">
//           <div>Showing 1 to {activities.length} entries</div>
//           <div className="flex gap-1">
//             <button className="px-2 py-1 border rounded bg-gray-200">
//               Previous
//             </button>
//             <button className="px-2 py-1 border rounded bg-blue-500 text-white">
//               1
//             </button>
//             <button className="px-2 py-1 border rounded">Next</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
