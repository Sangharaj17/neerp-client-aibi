// utils/exportAmcRenewalJobs.js
import * as XLSX from "xlsx";
import axiosInstance from "@/utils/axiosInstance";

export const exportAmcRenewalJobsToExcel = async () => {
  try {
    // 1. Fetch data from the new backend export endpoint
    const response = await axiosInstance.get("/api/amc-renewal-jobs/exportRenewal", {
      responseType: "json",
    });

    const jobs = response.data;
    if (!jobs || jobs.length === 0) {
      alert("No renewal records found to export.");
      return;
    }

    // 2. Map the backend JSON data to the desired Excel column headers
    const exportData = jobs.map((job, index) => {
      // Serial Number
      const serialNumber = index + 1;

      // Service Engineers: Join array into a comma-separated string, use '-' if empty
      const serviceEngineersList =
        (job.serviceEngineers && job.serviceEngineers.length > 0)
          ? job.serviceEngineers.join(', ')
          : '-';

      // Job Amount: Use the numeric value for proper Excel formatting (0 if null/undefined)
      const jobAmountValue = job.jobAmount || 0;

      // NOTE: Assuming AmcRenewalJobResponseDto has the same fields as AmcJobResponseDto
      // based on the structure provided in the initial request.

      return {
        "Sr No": serialNumber,
        "Job Type": job.jobType || '-',
        "Customer": job.customerName || '',
        "Site Name": job.siteName || '',
        "Address": job.siteAddress || '-',
        "Place": job.place || '-',
        "Engineers": serviceEngineersList,
        "Amount": jobAmountValue,
        "Payment Term": job.paymentTerm || '',
        "Start Date": job.startDate || '',
        "End Date": job.endDate || '-',
        "Status": job.jobStatus || '',
      };
    });

    // 3. Create the Excel workbook
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "AMC Renewal Jobs");

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

    // 4. Write and save the file
    XLSX.writeFile(workbook, "AmcRenewalJobsExport.xlsx");
    alert("✅ AMC Renewal Jobs exported successfully!");

  } catch (error) {
    console.error("❌ Error exporting AMC Renewal Jobs:", error);
    alert("Failed to export AMC Renewal Jobs. Please try again.");
  }
};