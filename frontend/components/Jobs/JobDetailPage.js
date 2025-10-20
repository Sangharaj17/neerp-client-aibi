"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
import ActionModal from "../AMC/ActionModal"; // Assuming this path is correct
import QrCodeGenerator from "./QrCodeGenerator"; // Correctly using your QrCodeGenerator component

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

import autoTable from "jspdf-autotable";

const JobDetailPage = ({ jobId }) => {
  const router = useRouter();
  const [jobDetails, setJobDetails] = useState(null);
  const [jobActivities, setJobActivities] = useState([]);
  const [liftDatas, setLiftDatas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLiftModalOpen, setIsLiftModalOpen] = useState(false);

  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  // NEW STATE for QR Code Modal
  const [isQrModalOpen, setIsQrModalOpen] = useState(false); // <--- New State

  const [employeeDtos, setEmployeeDtos] = useState([]);

  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        const finalUrl = `/api/jobs/initial/amc-job-activities/job-detail/${jobId}`;
        const response = await axiosInstance.get(finalUrl);

        const data = response.data;
        setJobDetails(data.jobDetails || {});
        setJobActivities(data.jobActivities || []);
        setLiftDatas(data.liftDatas || []);
        setEmployeeDtos(data.employeeDtos || []);
      } catch (error) {
        console.error("Error fetching job detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetail();
  }, [jobId]);

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  if (!jobDetails || !jobDetails.jobNo) {
    // Also check for jobNo to ensure data is ready for QR code
    return (
      <div className="p-4 text-center text-red-500">
        Job details not found or incomplete.
      </div>
    );
  }

  // Handlers for Navigation and Export (keeping original logic)
  const handleBack = () =>
    router.push(`/dashboard/jobs/amc_job_list/false`);

  const handleAddActivity = () =>
    router.push(`/dashboard/jobs/add-job-activity/${jobId}`);

  const exportJobActivityToExcel = () => {
    exportToExcel();
  };

  const exportActivityDetailsToPDF = () => {
    exportToPDF();
  };

  const exportToExcel = () => {
    if (!jobActivities || jobActivities.length === 0) return;

    // Convert to worksheet
    const worksheet = XLSX.utils.json_to_sheet(
      jobActivities.map((act) => ({
        ID: act.id,
        Date: act.date,
        "Activity By": act.activityBy,
        "Activity Type": act.activityType,
        "Service Type": act.serviceType,
        Description: act.description,
        Remark: act.remark,
        "Report URL": act.reportUrl,
        "Lift Name": act.liftName ?? "",
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Job Activities");
    XLSX.writeFile(workbook, "JobActivities.xlsx");
  };

  const exportToPDF = () => {
    if (!jobActivities || jobActivities.length === 0) return;

    const doc = new jsPDF();
    const tableColumn = [
      "ID",
      "Date",
      "Activity By",
      "Activity Type",
      "Service Type",
      "Description",
      "Remark",
      "Report URL",
      "Lift Name",
    ];

    const tableRows = jobActivities.map((act) => [
      act.id,
      act.date,
      act.activityBy,
      act.activityType,
      act.serviceType,
      act.description,
      act.remark,
      act.reportUrl,
      act.liftName ?? "",
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.text("Job Activities Report", 14, 15);
    doc.save("JobActivities.pdf");
  };

  // NEW HANDLER for QR Code
  const handleGenerateQrCode = () => {
    setIsQrModalOpen(true);
  };
  
  // Data for the QrCodeGenerator component
  // Use jobDetails.jobNo for the non-renewal job ID as requested.
  // We'll use the unique jobId prop for renewalId to satisfy the component's required props.
  const qrCodeProps = {
    jobId: jobId,  // Non-renewal job ID
    renewalId: 0 || "N/A", // Using the unique database ID to satisfy the required prop
    customerName: jobDetails.customerName || "N/A",
    siteName: jobDetails.siteName || "N/A",
  };


  return (
    <div className="p-4 space-y-6">
      {/* Top Buttons */}
      <div className="flex flex-wrap justify-center gap-2">
        {[
          "Generate QR Code", // Button is here
          "Add Quotation for Repair",
          "Add Job Activity",
          "Back To List",
          "Export Job Activity to Excel",
          "Export Activity Details to PDF",
        ].map((label, idx) => (
          <button
            key={idx}
            onClick={
              label === "Back To List"
                ? handleBack
                : label === "Add Job Activity"
                ? handleAddActivity
                : label === "Export Job Activity to Excel"
                ? exportJobActivityToExcel
                : label === "Export Activity Details to PDF"
                ? exportActivityDetailsToPDF
                : label === "Generate QR Code" // <--- Trigger the Modal
                ? handleGenerateQrCode
                : null
            }
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded"
          >
            {label}
          </button>
        ))}
      </div>

      {/* Job Details (omitted for brevity, assume no change) */}
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <div className="flex justify-between items-center bg-gray-100 px-3 py-2">
          <h2 className="text-sm font-semibold text-gray-700">
            Job Information
          </h2>
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
            {jobDetails.jobStatus || "-"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-0">
          {/* Left Column */}
          <div className="border-r border-gray-300">
            {[
              ["Job No", jobDetails.jobNo],
              ["Customer Name", jobDetails.customerName],
              ["Site Name", jobDetails.siteName],
              ["Order Date", jobDetails.orderDate],
              ["Number of Lift", jobDetails.numberOfLift],
              [
                "Job Lift Detail",
                <button
                  className="text-blue-600 hover:underline text-sm"
                  onClick={() => setIsLiftModalOpen(true)}
                  key="view-lift-details"
                >
                  View Lift Details
                </button>,
              ],
              ["Sales Executive", jobDetails.salesExecutive],
              [
                "Service Engineers",
                <button
                  className="text-blue-600 hover:underline text-sm"
                  onClick={() => setIsEmployeeModalOpen(true)}
                  key="view-employee-details"
                >
                  View Employee Details
                </button>,
              ],
            ].map(([label, value], i) => (
              <div key={i} className="flex border-b border-gray-300">
                <div className="w-1/2 bg-gray-100 px-3 py-2 text-sm font-medium">
                  {label}
                </div>
                <div className="w-1/2 px-3 py-2 text-sm">{value ?? "-"}</div>
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div>
            {[
              ["Job Type", jobDetails.jobType],
              ["Site Address", jobDetails.siteAddress],
              ["Start Date", jobDetails.startDate],
              ["End Date", jobDetails.endDate],
              ["Job Amount", jobDetails.jobAmount],
              ["Received Amount", jobDetails.receivedAmount],
              ["Balance Amount", jobDetails.balanceAmount],
              ["Pending Service", jobDetails.pendingService],
            ].map(([label, value], i) => (
              <div key={i} className="flex border-b border-gray-300">
                <div className="w-1/2 bg-gray-100 px-3 py-2 text-sm font-medium">
                  {label}
                </div>
                <div className="w-1/2 px-3 py-2 text-sm">{value ?? "-"}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Job Activities Table (omitted for brevity, assume no change) */}
      <div className="flex justify-center">
        <div className="w-full max-w-6xl mx-auto">
          <h2 className="text-lg font-semibold mb-2 text-center">
            Job Activity Details
          </h2>
          <div className="overflow-x-auto border border-gray-300 rounded-lg">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  {[
                    "Sr.No",
                    "Date/Time",
                    "Activity By",
                    "Activity Type",
                    "Service Type",
                    "Description",
                    "Remark",
                    "Lift Name",
                    "Report",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-4 py-2 border border-gray-300 text-sm font-medium text-left"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {jobActivities.length > 0 ? (
                  jobActivities.map((activity, idx) => (
                    <tr key={activity.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border border-gray-300 text-sm">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-2 border border-gray-300 text-sm">
                        {activity.date}
                      </td>
                      <td className="px-4 py-2 border border-gray-300 text-sm">
                        {activity.activityBy}
                      </td>
                      <td className="px-4 py-2 border border-gray-300 text-sm">
                        {activity.activityType}
                      </td>
                      <td className="px-4 py-2 border border-gray-300 text-sm">
                        {activity.serviceType}
                      </td>
                      <td className="px-4 py-2 border border-gray-300 text-sm">
                        {activity.description}
                      </td>
                      <td className="px-4 py-2 border border-gray-300 text-sm">
                        {activity.remark || "-"}
                      </td>
                      <td className="px-4 py-2 border border-gray-300 text-sm">
                        {activity.liftName || "-"}
                      </td>

                      <td className="px-4 py-2 border border-gray-300 text-center">
                        {activity.reportUrl ? (
                          <a
                            href={activity.reportUrl}
                            className="text-blue-600 text-xs hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Pdf
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-4 py-2 text-center text-gray-500"
                    >
                      No activities found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* QR Code Generation Modal */}
      <ActionModal
        isOpen={isQrModalOpen}
        onCancel={() => setIsQrModalOpen(false)}
      >
        <div className="flex flex-col items-center p-4">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
            Generate Job QR Code
          </h2>
          <div className="p-4 border-2 border-gray-200 rounded-lg bg-white shadow-xl">
            {/* QrCodeGenerator is called here with the correct props */}
            <QrCodeGenerator {...qrCodeProps} />
          </div>
        </div>
      </ActionModal>
      {/* Employee Modal (omitted for brevity) */}
      <ActionModal
        isOpen={isEmployeeModalOpen}
        onCancel={() => setIsEmployeeModalOpen(false)}
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Employee Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {employeeDtos.length > 0 ? (
            employeeDtos.map((emp, index) => (
              <div
                key={emp.employeeId || index}
                className="relative border rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300 p-5 overflow-hidden"
              >
                {/* Gradient Header */}
                <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-t-2xl flex items-center px-5 text-white font-bold text-lg">
                  Employee {index + 1}
                </div>

                <div className="mt-14 grid grid-cols-1 gap-4">
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-sm mb-1">Name</span>
                    <span className="text-gray-800 font-medium">
                      {emp.name || "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-sm mb-1">Role</span>
                    <span className="text-gray-800 font-medium">
                      {emp.role || "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-sm mb-1">Address</span>
                    <span className="text-gray-800 font-medium">
                      {emp.address || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No employee data found.
            </p>
          )}
        </div>
      </ActionModal>
      {/* Lift Modal (omitted for brevity) */}
      <ActionModal
        isOpen={isLiftModalOpen}
        onCancel={() => setIsLiftModalOpen(false)}
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Lift Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {liftDatas.length > 0 ? (
            liftDatas.map((lift, index) => (
              <div
                key={index}
                className="relative border rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300 p-5 overflow-hidden"
              >
                {/* Gradient Header */}
                <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-t-2xl flex items-center px-5 text-white font-bold text-lg">
                  Lift {index + 1}
                </div>

                <div className="mt-14 grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-sm mb-1">
                      Lift Name
                    </span>
                    <span className="text-gray-800 font-medium">
                      {lift.liftName || "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-sm mb-1">Capacity</span>
                    <span className="text-gray-800 font-medium">
                      {lift.capacityValue || "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-sm mb-1">Type</span>
                    <span className="text-gray-800 font-medium">
                      {lift.typeOfElevators || "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-sm mb-1">Floors</span>
                    <span className="text-gray-800 font-medium">
                      {lift.noOfFloors || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No lift data found.
            </p>
          )}
        </div>
      </ActionModal>
    </div>
  );
};

export default JobDetailPage;