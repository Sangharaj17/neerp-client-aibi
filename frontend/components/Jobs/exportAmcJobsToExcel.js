// utils/exportAmcJobs.js
import * as XLSX from "xlsx";
import axiosInstance from "@/utils/axiosInstance";

export const exportAmcJobsToExcel = async () => {
  try {
    const response = await axiosInstance.get("/api/amc-jobs/export", {
      responseType: "json",
    });

    const jobs = response.data;
    if (!jobs || jobs.length === 0) {
      alert("No records found to export.");
      return;
    }

    // Map the backend data keys to the desired Excel column headers
    const exportData = jobs.map((job, index) => {
      // 1. 'sr.no'
      const serialNumber = index + 1;

      // 2. 'serviceEngineers' needs to be joined with a comma (like in your 'title' attribute)
      const serviceEngineersList = 
        (job.serviceEngineers && job.serviceEngineers.length > 0)
          ? job.serviceEngineers.join(', ')
          : '-'; // Use '-' if empty, matching your table logic

      // 3. 'jobAmount' needs the '₹' removed for the excel export but the value should be present. 
      // It's a number in the JSON, so we just use the number or default to 0.
      const jobAmountValue = job.jobAmount || 0; // Use 0 or '' based on your preference for empty numbers

      // 4. Handle all other fields, using '-' for null/undefined as per your table logic
      
      return {
        "Sr No": serialNumber,
        "Job Type": job.jobType || '-', // Matches your table logic: job.jobType || '-'
        "Customer": job.customerName || '', // No default in table, but safe to use ''
        "Site Name": job.siteName || '',
        "Address": job.siteAddress || '-', // Matches your table logic: job.siteAddress || '-'
        "Place": job.place || '-', // Matches your table logic: job.place || '-'
        "Engineers": serviceEngineersList, // Custom formatted list
        "Amount": jobAmountValue, // Numeric value without '₹'
        "Payment Term": job.paymentTerm || '',
        "Start Date": job.startDate || '',
        "End Date": job.endDate || '-', // Matches your table logic: job.endDate || '-'
        "Status": job.jobStatus || '',
        // 'Actions' column is ignored as it's for the UI, not data export
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "AMC Jobs");

    // Fix column widths for better display (optional but recommended)
    const columnWidths = [
      { wch: 6 },  // Sr No
      { wch: 15 }, // Job Type
      { wch: 20 }, // Customer
      { wch: 20 }, // Site Name
      { wch: 25 }, // Address
      { wch: 15 }, // Place
      { wch: 35 }, // Engineers
      { wch: 12 }, // Amount
      { wch: 15 }, // Payment Term
      { wch: 12 }, // Start Date
      { wch: 12 }, // End Date
      { wch: 12 }, // Status
    ];
    worksheet['!cols'] = columnWidths;

    XLSX.writeFile(workbook, "AmcJobsExport.xlsx");
    alert("✅ AMC Jobs exported successfully!");
  } catch (error) {
    console.error("❌ Error exporting AMC Jobs:", error);
    alert("Failed to export AMC Jobs. Please try again.");
  }
};