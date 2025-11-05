// app/dashboard/lead-management/enquiries/[id]/add-modernization/[...params]/page.js

import OncallQuotationClient from "@/components/Oncall/OncallQuotationClient";
// Note: This component is a Server Component (no 'use client')

// The 'params' object contains { id: '4', params: ['16', '4'] }
export default function AddOncallQuotationPage({ params }) { 

const { id, params: pathSegments } = params;

 // Log for verification (Server side console)
 console.log("Route ID:", id); // Should be '4'
 console.log("Path Segments:", pathSegments); // Should be ['16', '4']

return (
 // Pass the fully resolved array to your Client Component
<OncallQuotationClient 
 pathSegments={pathSegments || []} 
 />
);
}