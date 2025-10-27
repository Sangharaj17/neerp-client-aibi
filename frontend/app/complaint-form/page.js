import ComplaintForm from "@/components/Jobs/ComplaintForm";

/**
 * Page component for the /complaint-form route.
 * It uses the 'async' keyword to correctly handle the dynamic searchParams.
 */
export default async function ComplaintFormPage({ searchParams }) {
    
    // Extract data from the URL query string
    const { jobId, renewalId, customerName, siteName } = searchParams;
    
    // Pass the extracted data down to the ComplaintForm component
    return (
        <ComplaintForm
            jobId={jobId}
            renewalId={renewalId}
            customerName={customerName}
            siteName={siteName}
        />
    );
}