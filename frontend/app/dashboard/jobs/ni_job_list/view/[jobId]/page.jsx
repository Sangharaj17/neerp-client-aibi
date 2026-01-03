"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";

import ActionModal from "@/components/AMC/ActionModal";
import MaterialQuotationForm from "@/components/Jobs/MaterialQuotationForm";
import { formatDate, formatDateShort } from "@/utils/common";
import NiJobActivityModal from "@/components/Jobs/NiJobActivityModal";
import JobActivityTable from "@/components/Jobs/JobActivityTable";
import { toast } from "react-hot-toast";
import { getTenant } from "@/utils/tenant";
import { Image as ImageIcon, Upload, Eye, Trash2, X } from "lucide-react";
import { FileText } from "lucide-react";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

import autoTable from "jspdf-autotable";
import { confirmDeleteWithToast } from "@/components/UI/toastUtils";

const JobDetailPage = () => {
  const router = useRouter();
  const { jobId } = useParams();
  const [tenant, setTenant] = useState(getTenant());
  const [clientId, setClientId] = useState(0);
  const [jobDetails, setJobDetails] = useState(null);
  const [jobTypeId, setJobTypeId] = useState(null);
  const [jobActivities, setJobActivities] = useState([]);
  const [liftDatas, setLiftDatas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLiftModalOpen, setIsLiftModalOpen] = useState(false);

  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);

  const [employeeDtos, setEmployeeDtos] = useState([]);
  const [loadingButton, setLoadingButton] = useState(null);

  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");

  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [isUploadDocOpen, setIsUploadDocOpen] = useState(false);
  const [jobDocuments, setJobDocuments] = useState([]); // fetched from backend
  const [imageDocs, setImageDocs] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const [isFilePicking, setIsFilePicking] = useState(false);
  const fileInputRef = useRef(null);

  const [isActivityOpen, setIsActivityOpen] = useState(false);

  const isImage = (filePath) => /\.(jpg|jpeg|png)$/i.test(filePath);

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryTitle, setGalleryTitle] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  const [textModalOpen, setTextModalOpen] = useState(false);
  const [textModalContent, setTextModalContent] = useState({
    title: "",
    text: "",
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  // Reset loading when preview opens
  useEffect(() => {
    if (previewUrl) {
      setIsPreviewLoading(true);
    }
  }, [previewUrl]);

  const [imageLoading, setImageLoading] = useState({});

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const fileUrl = `${API_BASE_URL}/api/job-activities/files/`;

  useEffect(() => {
    if (galleryOpen) {
      const initialLoading = {};
      galleryImages.forEach((_, index) => {
        initialLoading[index] = true;
      });
      setImageLoading(initialLoading);
    }
  }, [galleryOpen, galleryImages]);

  const renderTruncatedText = (text, title, limit = 30) => {
    if (!text) return "-";
    if (text.length <= limit) return text;
    return (
      <div>
        {text.substring(0, limit)}...
        <button
          className="text-blue-600 text-xs cursor-pointer hover:underline ml-1"
          onClick={() => {
            setTextModalContent({ title, text });
            setTextModalOpen(true);
          }}
          // onMouseEnter={() => {
          //   setTextModalContent({ title, text });
          //   setTextModalOpen(true);
          // }}
        >
          Read More
        </button>
      </div>
    );
  };

  const openPhotoGallery = async (photos) => {
    try {
      if (photos.length === 0) {
        toast.info("No images available");
        return;
      }

      setGalleryImages(photos); // Store full photo objects with IDs
      setGalleryTitle("Activity Images");
      setGalleryOpen(true);
    } catch (error) {
      console.error("Error opening gallery:", error);
      toast.error("Failed to open gallery");
    }
  };

  // const openPhotoGallery = async (jobId, activityId) => {
  //   try {
  //     const res = await axiosInstance.get(
  //       `/api/job-activities/${clientId}/${jobId}/${activityId}/photos`
  //     );

  //     const photos = res.data.data || [];

  //     if (photos.length === 0) {
  //       toast.info("No images available");
  //       return;
  //     }

  //     setGalleryImages(photos.map((p) => p.photoUrl));
  //     setGalleryTitle("Activity Images");
  //     setGalleryOpen(true);
  //   } catch (err) {
  //     toast.error("Failed to load images");
  //   }
  // };

  const openSignature = async (jobId, activityId) => {
    try {
      const res = await axiosInstance.get(
        `/api/job-activities/${clientId}/${jobId}/${activityId}/signature`
      );

      const { signatureUrl, signaturePersonName } = res.data.data;

      if (!signatureUrl) {
        toast.info("Signature not available");
        return;
      }

      setGalleryImages([signatureUrl]);
      setGalleryTitle(signaturePersonName + "'s Signature");
      setGalleryOpen(true);
    } catch (err) {
      toast.error("Failed to load signature");
    }
  };

  const fetchJobDetail = async () => {
    const storedId = localStorage.getItem(
      tenant ? `${tenant}_userId` : "userId"
    );

    const storedClient = localStorage.getItem(
      tenant ? `${tenant}_clientId` : "clientId"
    );
    if (storedClient) {
      setClientId(storedClient);
    }

    try {
      console.log("Fetching job detail for job ID:", jobId);
      const finalUrl = `/api/jobs/details/${jobId}`;
      const response = await axiosInstance.get(finalUrl);

      console.log("Response data:", response.data);
      const data = response.data.data;
      const documents = data.documents || [];

      setJobDetails(data.jobDetails || {});
      setJobActivities(data.jobActivities || []);
      setJobDocuments(documents); // ✅ Load documents from API
      setLiftDatas(data.liftDatas || []);
      setEmployeeDtos(data.employeeDtos || []);

      setJobTypeId(data.jobDetails.jobTypeId);

      const startYear = data?.jobDetails?.startDate
        ? new Date(data.jobDetails.startDate).getFullYear()
        : "";

      const endYear = startYear ? startYear + 1 : "";
      setStartYear(startYear);
      setEndYear(endYear);

      const imageDocs1 =
        documents?.filter((doc) => isImage(doc.filePath)) || [];

      setImageDocs(imageDocs1);
    } catch (error) {
      console.error("Error fetching job detail:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobDetail();
  }, [jobId]);

  useEffect(() => {
    if (isUploadDocOpen) {
      setLoadingButton(null);
    }
  }, [isUploadDocOpen]);

  useEffect(() => {
    if (isActivityOpen) {
      setLoadingButton(null);
    }
  }, [isActivityOpen]);

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  if (!jobDetails || !jobDetails.jobId) {
    // Also check for jobNo to ensure data is ready for QR code
    return (
      <div className="p-4 text-center text-red-500">
        Job details not found or incomplete.
      </div>
    );
  }

  // Handlers for Navigation and Export (keeping original logic)
  const handleBack = () => router.push(`/dashboard/jobs/ni_job_list`);

  // const handleAddActivity = () =>
  //   router.push(`/dashboard/jobs/add-job-activity/${jobId}`);

  // const handleAddActivity = (data) => {
  //   setIsActivityOpen(true);
  //   console.log("Submitting Job Activity:", data);
  //   // setIsActivityOpen(false);
  //   // TODO: API call here
  // };

  const handleOpenActivityModal = () => {
    setIsActivityOpen(true);
  };

  const handleActivitySubmit = () => {
    fetchJobDetail();
    // setIsActivityOpen(false); // Closed by modal itself
  };

  const buildExportData = () => {
    const jobInfo = [
      ["Job No", jobDetails.jobNoFormatted],
      ["Customer Name", jobDetails.customerName],
      ["Site Name", jobDetails.siteName],
      ["Job Type", jobDetails.jobTypeName],
      ["Job Status", jobDetails.jobStatus],
      ["Order Date", formatDateShort(jobDetails.orderDate)],
      ["Start Date", formatDateShort(jobDetails.startDate)],
      ["Sales Executive", jobDetails.salesExecutiveName],
      ["Service Engineer", jobDetails.serviceEngineerName],
      ["Job Amount", jobDetails.jobAmount],
      ["Paid Amount", jobDetails.paidAmount],
      [
        "Balance Amount",
        (
          Number(jobDetails.jobAmount || 0) - Number(jobDetails.paidAmount || 0)
        ).toFixed(2),
      ],
    ];

    const activities = jobActivities.map((act, idx) => ({
      "Sr No": idx + 1,
      Date: formatDateShort(act.createdAt),
      "Activity By": act.jobActivityByName,
      "Activity Type": act.activityType,
      "Activity Title": act.activityTitle,
      Description: act.activityDescription,
      Remark: act.remark,
      "Mail Sent": act.mailSent ?? "-",
    }));

    return { jobInfo, activities };
  };

  const exportJobActivityToExcel = () => {
    exportToExcel();
  };

  const exportActivityDetailsToPDF = () => {
    exportToPDF();
  };

  const exportToExcel = () => {
    const { jobInfo, activities } = buildExportData();

    const workbook = XLSX.utils.book_new();

    // Job Info Sheet
    const jobInfoSheet = XLSX.utils.aoa_to_sheet([
      ["Job Information"],
      [],
      ...jobInfo,
    ]);
    XLSX.utils.book_append_sheet(workbook, jobInfoSheet, "Job Info");

    // Activities Sheet
    const activitySheet = XLSX.utils.json_to_sheet(activities);
    XLSX.utils.book_append_sheet(workbook, activitySheet, "Job Activities");

    XLSX.writeFile(workbook, `NI_Job_${jobDetails.jobNoFormatted}.xlsx`);

    setLoadingButton(null);
  };

  const exportToPDF = () => {
    const { jobInfo, activities } = buildExportData();

    const doc = new jsPDF("p", "mm", "a4");

    doc.setFontSize(14);
    doc.text("NI Job Report", 14, 15);

    // Job Info Table
    autoTable(doc, {
      startY: 20,
      head: [["Field", "Value"]],
      body: jobInfo,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [41, 128, 185] },
    });

    // Activities Table
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [Object.keys(activities[0] || {})],
      body: activities.map(Object.values),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [52, 73, 94] },
    });

    doc.save(`NI_Job_${jobDetails.jobNoFormatted}.pdf`);

    setLoadingButton(null);
  };

  const handleUploadDocuments = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select files to upload");
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("files", file));

    const toastId = toast.loading("Uploading documents...");
    try {
      await axiosInstance.post(
        `/api/jobs/${clientId}/${jobDetails.jobId}/document`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Documents uploaded successfully!", { id: toastId });
      setSelectedFiles([]); // Clear selected files
      setIsUploadDocOpen(false);
      fetchJobDetail(); // Refresh to get updated documents
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload documents.", { id: toastId });
    }
  };

  const openFilePicker = () => {
    setIsFilePicking(true);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);

    // Check limit: existing DB docs + already selected + new files
    const totalCount =
      jobDocuments.length + selectedFiles.length + newFiles.length;

    if (totalCount > 10) {
      toast.error(
        `Maximum 10 documents allowed. You have ${jobDocuments.length} uploaded and ${selectedFiles.length} selected. Cannot add ${newFiles.length} more.`
      );
      setIsFilePicking(false);
      return;
    }

    // Accumulate files
    setSelectedFiles((prev) => [...prev, ...newFiles]);
    setIsFilePicking(false);

    // Reset input to allow selecting same file again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeSelectedFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteDocument = async (documentId) => {
    // if (!confirm("Are you sure you want to delete this document?")) {
    //   return;
    // }
    confirmDeleteWithToast("Document", async () => {
      const toastId = toast.loading("Deleting document...");
      try {
        await axiosInstance.delete(
          `/api/jobs/${clientId}/${jobDetails.jobId}/document/${documentId}`
        );

        toast.success("Document deleted successfully!", { id: toastId });
        fetchJobDetail(); // Refresh to update document list
      } catch (error) {
        console.error("Delete failed:", error);
        toast.error("Failed to delete document.", { id: toastId });
      }
    });
  };

  const handleSendMail = async (activityId) => {
    const toastId = toast.loading("Sending email...");
    console.log("activityId", activityId);
    try {
      const response = await axiosInstance.post(
        `/api/job-activities/${activityId}/send-activity-email`
      );
      //const response = null;

      if (response.data.success) {
        toast.success("Email sent successfully!", { id: toastId });
        fetchJobDetail(); // Refresh to update mailSent status
      } else {
        toast.error(response.data.message || "Failed to send email.", {
          id: toastId,
        });
      }
    } catch (error) {
      console.error("Send mail failed:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to send email.";
      toast.error(errorMessage, { id: toastId });
    }
  };

  const handleDeleteActivityPhoto = async (photoId) => {
    confirmDeleteWithToast("Photo", async () => {
      const toastId = toast.loading("Deleting photo...");
      try {
        await axiosInstance.delete(`/api/job-activities/photos/${photoId}`);

        toast.success("Photo deleted successfully!", { id: toastId });

        // Update gallery images
        setGalleryImages((prev) =>
          prev.filter((photo) => photo.photoId !== photoId)
        );

        // Refresh job details
        fetchJobDetail();
      } catch (error) {
        console.error("Delete photo failed:", error);
        toast.error("Failed to delete photo.", { id: toastId });
      }
    });
  };

  const handleButtonClick = async (label, action) => {
    setLoadingButton(label);

    //setTimeout(async () => {
    //try {
    await action();
    //} finally {
    //setLoadingButton(null);
    //}
    //}, 100);
  };

  const exportSingleActivityPDF = async (activity) => {
    const toastId = toast.loading("Generating PDF...");
    try {
      const doc = new jsPDF("p", "mm", "a4"); // Portrait mode is usually better for reports
      let y = 15;
      let endedMidPhotoRow = false;

      /* HEADER */
      doc.setFontSize(16);
      doc.setTextColor(41, 128, 185);
      doc.text("NI Job Activity Report", 14, y);
      y += 8;

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(
        `Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
        14,
        y
      );
      y += 10;

      /* JOB INFO */
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text("Job Information", 14, y);
      y += 4;

      autoTable(doc, {
        startY: y,
        head: [["Field", "Value", "Field", "Value"]],
        body: [
          [
            "Job No",
            jobDetails.jobNoFormatted || "-",
            "Order Date",
            formatDateShort(jobDetails.orderDate),
          ],
          [
            "Customer",
            jobDetails.customerName || "-",
            "Start Date",
            formatDateShort(jobDetails.startDate),
          ],
          [
            "Site Name",
            jobDetails.siteName || "-",
            "Job Type",
            jobDetails.jobTypeName || "-",
          ],
          [
            "Address",
            jobDetails.siteAddress || "-",
            "Status",
            jobDetails.jobStatus || "-",
          ],
          [
            "Sales Exec.",
            jobDetails.salesExecutiveName || "-",
            "Service Eng.",
            jobDetails.serviceEngineerName || "-",
          ],
          [
            "No of Lifts",
            liftDatas?.length || 0 || "-",
            "Job Amount",
            jobDetails.jobAmount || "-",
          ],
          [
            "Received Amount",
            jobDetails.paidAmount || "-",
            "Balance",
            (
              (Number(jobDetails?.jobAmount) || 0) -
              (Number(jobDetails?.paidAmount) || 0)
            ).toFixed(2) || "-",
          ],
        ],
        theme: "grid",
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: "bold",
        },
        styles: { fontSize: 9, cellPadding: 1.5 },
        columnStyles: {
          0: { fontStyle: "bold", width: 30 },
          2: { fontStyle: "bold", width: 30 },
        },
      });

      y = doc.lastAutoTable.finalY + 12;

      /* ACTIVITY INFO */
      doc.setFontSize(12);
      doc.text("Activity Details", 14, y);
      y += 4;

      autoTable(doc, {
        startY: y,
        head: [["Field", "Value"]],
        body: [
          ["Activity Date", formatDateShort(activity.createdAt)],
          ["Activity Type", activity.activityType || "-"],
          ["Executed By", activity.jobActivityByName || "-"],
          ["Title", activity.activityTitle || "-"],
          ["Description", activity.activityDescription || "-"],
          ["Remark", activity.remark || "-"],
        ],
        theme: "grid",
        headStyles: { fillColor: [52, 73, 94], textColor: 255 },
        styles: { fontSize: 9, cellPadding: 2 },
        columnStyles: { 0: { fontStyle: "bold", width: 40 } },
      });

      y = doc.lastAutoTable.finalY + 10;

      /* PHOTOS */
      if (activity.photos?.length > 0) {
        // Check space for header
        if (y > 270) {
          doc.addPage();
          y = 20;
        }

        doc.setFontSize(12);
        doc.text(`Activity Photos (${activity.photos.length})`, 14, y);
        y += 8;

        const images = await Promise.all(
          activity.photos.map((p) => loadImageSafe(fileUrl + p.photoUrl))
        );

        let x = 14;
        const imgWidth = 55;
        const imgHeight = 40;
        const gap = 5;

        for (const img of images) {
          if (!img) continue;

          // Check if current row fits on page, else new page
          if (y + imgHeight > 280) {
            doc.addPage();
            y = 20;
            x = 14;
          }

          try {
            doc.addImage(img.base64, img.format, x, y, imgWidth, imgHeight);
          } catch (e) {
            console.error("Add image failed", e);
          }

          x += imgWidth + gap;

          // Wrap to next line if max width reached
          if (x + imgWidth > 200) {
            x = 14;
            y += imgHeight + gap;
            endedMidPhotoRow = false;
          } else {
            endedMidPhotoRow = true;
          }
        }
        // Update y after images
        if (endedMidPhotoRow) {
          y += imgHeight + gap;
        }
        y += 10;
      }

      /* SIGNATURE */
      if (activity.signatureUrl) {
        // Ensure signature block usually fits (approx 40mm height)
        if (y + 40 > 280) {
          doc.addPage();
          y = 20;
        } else {
          // If we are essentially on a new line after images but not a new page, ensure some spacing
          // if (x > 14) y += 5;
          // Add a bit more buffer if we were mid-row

          if (endedMidPhotoRow) {
            y += 5;
          }
        }

        const sign = await loadImageSafe(fileUrl + activity.signatureUrl);
        if (sign) {
          doc.setFontSize(12);
          doc.text("Signature", 14, y);
          y += 5;

          try {
            doc.addImage(sign.base64, sign.format, 14, y, 50, 25);
          } catch (e) {
            console.error("Sign add failed", e);
          }

          y += 30;
          doc.setFontSize(10);
          doc.text(
            `Signed By: ${
              activity.signaturePersonName ||
              activity.jobActivityByName ||
              "Unknown"
            }`,
            14,
            y
          );
        }
      }

      doc.save(
        `Activity_${activity.jobActivityId}_${jobDetails.jobNoFormatted}.pdf`
      );
      toast.success("PDF generated successfully!", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF", { id: toastId });
    }
  };

  // ✅ IMPROVED loadImageSafe with better error handling
  const loadImageSafe = async (url) => {
    try {
      console.log("Loading image:", url); // Debug log

      // Fetch the image with proper headers
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "image/*",
        },
        mode: "cors", // Handle CORS
      });

      if (!res.ok) {
        console.error(`Failed to fetch image: ${res.status} ${res.statusText}`);
        throw new Error(`Image fetch failed: ${res.status}`);
      }

      const blob = await res.blob();

      // Validate blob type
      if (!blob.type.startsWith("image/")) {
        console.error("Invalid blob type:", blob.type);
        throw new Error("Invalid image type");
      }

      // Determine format
      const format = blob.type.includes("png") ? "PNG" : "JPEG";

      // Convert to base64
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          // Validate base64 result
          if (reader.result && typeof reader.result === "string") {
            resolve(reader.result);
          } else {
            reject(new Error("Invalid base64 result"));
          }
        };
        reader.onerror = () => reject(new Error("FileReader error"));
        reader.readAsDataURL(blob);
      });

      console.log("Image loaded successfully:", url); // Debug log
      return { base64, format };
    } catch (e) {
      console.error("Error loading image:", url, e);
      return null;
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-xl font-bold text-gray-800">
          NI Job Detail for{" "}
          <span className="text-blue-600">
            {jobDetails?.customerName || "N/A"}
          </span>
          , Site{" "}
          <span className="text-blue-600">{jobDetails?.siteName || "N/A"}</span>
          {startYear && (
            <span className="text-gray-600 font-medium">
              {" "}
              ({startYear}-{endYear})
            </span>
          )}
        </h1>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {[
          { label: "Add Job Activity", action: handleOpenActivityModal },
          {
            label: "Add Job Documents",
            action: () => setIsUploadDocOpen(true),
          },
          { label: "Back To List", action: handleBack },
          {
            label: "Export Job Activity to Excel",
            action: exportToExcel,
          },
          {
            label: "Export Activity Details to PDF",
            action: exportToPDF,
          },
        ].map(({ label, action }, idx) => (
          <button
            key={idx}
            onClick={() => handleButtonClick(label, action)}
            disabled={loadingButton === label}
            className="
              flex items-center gap-2
              bg-blue-500 hover:bg-blue-600
              disabled:bg-blue-300
              text-white text-sm font-medium
              px-4 py-2 rounded
              transition
              cursor-pointer
              disabled:cursor-not-allowed
            "
          >
            {label}

            {loadingButton === label && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
          </button>
        ))}
      </div>

      {/* Job Details (omitted for brevity, assume no change) */}
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <div className="flex justify-between items-center bg-gray-100 px-3 py-2">
          <h2 className="text-sm font-semibold text-gray-700">
            Job Information
          </h2>
          <div className="flex items-center gap-2">
            {jobDetails?.attachedDocumentCount > 0 ? (
              <button
                onClick={() => setIsDocModalOpen(true)}
                className="
                    flex items-center gap-1
                    text-blue-600 text-sm font-medium
                    hover:text-blue-800 hover:underline
                    transition
                    cursor-pointer
                  "
              >
                📎 View Documents
                <span className="text-gray-500">
                  ({jobDetails.attachedDocumentCount})
                </span>
              </button>
            ) : (
              <span className="text-gray-400 text-sm italic">
                No documents uploaded
              </span>
            )}

            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
              {jobDetails.jobStatus || "-"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Left Column */}
          <div className="border-r border-gray-300">
            {[
              ["Job No", jobDetails.jobNoFormatted],
              ["Job Type", jobDetails.jobTypeName],
              ["Job Status", jobDetails.jobStatus],
              ["Order Date", formatDateShort(jobDetails.orderDate)],
              ["Start Date", formatDateShort(jobDetails.startDate)],
              // [
              //   "Job Lift Detail",
              //   <button
              //     className="text-blue-600 hover:underline text-sm"
              //     onClick={() => setIsLiftModalOpen(true)}
              //     key="view-lift-details"
              //   >
              //     View Lift Details
              //   </button>,
              // ],
              ["Sales Executive", jobDetails.salesExecutiveName],
              ["Service Engineer", jobDetails.serviceEngineerName],
              // [
              //   "Service Engineers",
              //   <button
              //     className="text-blue-600 hover:underline text-sm"
              //     onClick={() => setIsEmployeeModalOpen(true)}
              //     key="view-employee-details"
              //   >
              //     View Employee Details
              //   </button>,
              // ],
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
              [
                "Number of Lift",
                <div className="flex items-center gap-2" key="lift-details">
                  <span>{liftDatas?.length || 0}</span>
                  <button
                    className="text-blue-600 hover:underline text-sm"
                    onClick={() => setIsLiftModalOpen(true)}
                  >
                    View Lift Details
                  </button>
                </div>,
              ],
              ["Customer Name", jobDetails.customerName],
              ["Site Name", jobDetails.siteName],
              ["Site Address", jobDetails.siteAddress],
              // ["End Date", jobDetails.endDate],
              ["Job Amount", jobDetails.jobAmount],
              ["Received Amount", jobDetails.paidAmount],
              [
                "Balance Amount",
                (
                  (Number(jobDetails?.jobAmount) || 0) -
                  (Number(jobDetails?.paidAmount) || 0)
                ).toFixed(2),
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
        </div>
      </div>

      {/* Job Activities Table (omitted for brevity, assume no change) */}
      <JobActivityTable
        jobActivities={jobActivities}
        formatDateShort={formatDateShort}
        renderTruncatedText={renderTruncatedText}
        openPhotoGallery={openPhotoGallery}
        setPreviewUrl={setPreviewUrl}
        exportSingleActivityPDF={exportSingleActivityPDF}
        handleSendMail={handleSendMail}
      />

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
        <div className="relative mb-6">
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            Lift Details
          </h2>

          {/* Close (X) Button */}
          <button
            onClick={() => setIsLiftModalOpen(false)}
            className="
              absolute top-0 right-0
              text-gray-500
              cursor-pointer
              transition-all duration-200 ease-in-out
              hover:text-blue-600
              hover:scale-125
              hover:font-bold
              focus:outline-none
            "
            aria-label="Close"
          >
            <strong className="text-2xl font-bold hover:text-blue-600">
              ✕
            </strong>
          </button>
        </div>
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

      <ActionModal
        isOpen={isUploadDocOpen}
        onCancel={() => {
          setIsUploadDocOpen(false);
          setSelectedFiles([]);
        }}
      >
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4 text-center">
            Upload Job Documents
          </h2>

          {jobDocuments.length + selectedFiles.length < 10 && (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.ppt,.pptx"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="space-y-4">
                {/* Status / Limit Info */}
                <div className="text-sm text-gray-600 text-center">
                  Total allowed: 10 files. <br />({jobDocuments.length} uploaded
                  + {selectedFiles.length} selected ={" "}
                  {jobDocuments.length + selectedFiles.length}/10)
                </div>

                {/* Select Files Button */}
                <div className="flex justify-center">
                  <button
                    onClick={openFilePicker}
                    disabled={jobDocuments.length + selectedFiles.length >= 10}
                    className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-200 transition disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    <Upload size={18} />
                    {jobDocuments.length + selectedFiles.length >= 10
                      ? "Limit Reached"
                      : "Select Files"}
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="space-y-4">
            {/* Existing Documents (from DB) */}
            {jobDocuments.length > 0 && (
              <div className="mt-2">
                <h3 className="text-sm font-semibold text-gray-700 mb-1">
                  Already Uploaded:
                </h3>
                <ul className="max-h-50 overflow-y-auto border rounded bg-gray-50 text-sm">
                  {jobDocuments.map((doc) => (
                    <li
                      key={doc.id}
                      className="flex justify-between items-center p-2 border-b last:border-b-0"
                    >
                      <span className="truncate text-gray-600 flex-1">
                        {doc.documentName}
                      </span>
                      <div className="flex items-center gap-2">
                        <a
                          href={
                            doc.filePath
                              ? `${
                                  axiosInstance.defaults.baseURL || ""
                                }/api/job-activities/files/${doc.filePath}`
                              : "#"
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-blue-500 hover:underline"
                        >
                          View
                        </a>
                        <button
                          onClick={() => handleDeleteDocument(doc.id)}
                          className="text-red-500 hover:text-red-700 text-xs font-bold px-2"
                          title="Delete document"
                        >
                          ✕
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Selected Files (to be uploaded) */}
            {selectedFiles.length > 0 && (
              <div className="mt-2">
                <h3 className="text-sm font-semibold text-gray-700 mb-1">
                  Selected for Upload:
                </h3>
                <ul className="max-h-32 overflow-y-auto border rounded bg-white text-sm">
                  {selectedFiles.map((file, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center p-2 border-b last:border-b-0"
                    >
                      <div className="flex items-center overflow-hidden">
                        <span className="truncate max-w-[200px]">
                          {file.name}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          {(file.size / 1024).toFixed(1)} KB
                        </span>
                      </div>
                      <button
                        onClick={() => removeSelectedFile(index)}
                        className="text-red-500 hover:text-red-700 text-xs font-bold px-2"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={handleUploadDocuments}
              disabled={selectedFiles.length === 0}
              className="
                bg-blue-600 hover:bg-blue-700
                disabled:bg-gray-400 disabled:cursor-not-allowed
                text-white font-medium
                px-6 py-2 rounded
                transition
              "
            >
              Upload{" "}
              {selectedFiles.length > 0 ? `(${selectedFiles.length})` : ""}
            </button>
            <button
              onClick={() => {
                setIsUploadDocOpen(false);
                setSelectedFiles([]);
              }}
              className="text-gray-600 hover:text-gray-800 font-medium px-4 py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      </ActionModal>

      <ActionModal
        isOpen={isDocModalOpen}
        onCancel={() => setIsDocModalOpen(false)}
      >
        <div className="relative mb-4">
          <h2 className="text-xl font-bold text-center">Job Documents</h2>

          {/* <button
            onClick={() => setIsDocModalOpen(false)}
            className="absolute top-0 right-0 hover:text-blue-600 hover:scale-125 transition cursor-pointer"
          >
            <X size={20} />
          </button> */}
        </div>

        {/* Image Gallery - Thumbnails */}
        {imageDocs.length > 0 && (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mb-6">
            {imageDocs.map((doc, idx) => (
              <div key={idx} className="relative group overflow-visible">
                <img
                  src={`${
                    axiosInstance.defaults.baseURL || ""
                  }/api/job-activities/files/${doc.filePath}`}
                  alt={doc.documentName}
                  className="w-full h-30 w-30 object-cover rounded shadow hover:scale-105 transition cursor-pointer"
                  onClick={() =>
                    setPreviewImage(
                      `${
                        axiosInstance.defaults.baseURL || ""
                      }/api/job-activities/files/${doc.filePath}`
                    )
                  }
                />
                {/* Delete button overlay */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteDocument(doc.id);
                  }}
                  className="
                    absolute 
                    -top-3 -right-3
                    bg-red-500 text-white 
                    rounded-full 
                    w-7 h-7
                    flex items-center justify-center
                    shadow-lg
                    opacity-50 group-hover:opacity-100
                    transition-all duration-200
                    hover:bg-red-600 hover:scale-110
                    z-10
                  "
                  title="Delete image"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Other Documents */}
        <ul className="space-y-2">
          {jobDocuments
            .filter((doc) => !isImage(doc.filePath))
            .map((doc, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center border p-2 rounded"
              >
                <span className="text-sm flex-1 truncate">
                  {doc.documentName}
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href={`${
                      axiosInstance.defaults.baseURL || ""
                    }/api/job-activities/files/${doc.filePath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1  text-blue-600 text-sm hover:underline"
                  >
                    <Eye size={14} />
                    <span>View</span>
                  </a>
                  <button
                    onClick={() => handleDeleteDocument(doc.id)}
                    className="flex items-center gap-1  text-red-500 hover:text-red-700 text-xs font-bold px-2"
                    title="Delete document"
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </button>
                </div>
              </li>
            ))}
        </ul>
      </ActionModal>

      <NiJobActivityModal
        isOpen={isActivityOpen}
        onClose={() => setIsActivityOpen(false)}
        jobId={jobId}
        activityType={jobTypeId}
        onSubmit={handleActivitySubmit}
      />

      {galleryOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full p-5 relative">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                {galleryTitle}
              </h2>
              <button
                onClick={() => setGalleryOpen(false)}
                className="text-gray-500 hover:text-red-600 text-xl"
              >
                ✕
              </button>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[65vh] overflow-y-auto">
              {galleryImages.map((photo, idx) => (
                <div
                  key={idx}
                  className="relative group cursor-pointer overflow-hidden rounded-lg border"
                  // onClick={() => setPreviewImage(photo.photoUrl)}
                  onClick={() => setPreviewImage(fileUrl + photo.photoUrl)}
                >
                  {/* Loader overlay */}
                  {imageLoading[idx] !== false && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70">
                      <span className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}

                  <img
                    src={fileUrl + photo.photoUrl}
                    alt="Activity"
                    onLoad={() =>
                      setImageLoading((prev) => ({ ...prev, [idx]: false }))
                    }
                    onError={() =>
                      setImageLoading((prev) => ({ ...prev, [idx]: false }))
                    }
                    className={`w-full h-40 object-cover transition-opacity duration-300
                    ${imageLoading[idx] !== false ? "opacity-0" : "opacity-100"}
                    group-hover:scale-110
                  `}
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      Click to view
                    </span>
                  </div>

                  {/* Delete button overlay */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteActivityPhoto(photo.photoId);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    title="Delete photo"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {textModalOpen && (
        <ActionModal
          isOpen={textModalOpen}
          onCancel={() => setTextModalOpen(false)}
        >
          <div className="relative">
            <h2 className="text-xl font-bold mb-4 text-center text-gray-800 border-b pb-2">
              {textModalContent.title}
            </h2>
            {/* Close (X) Button */}
            <button
              onClick={() => setTextModalOpen(false)}
              className="
              absolute top-0 right-0
              text-gray-500
              cursor-pointer
              transition-all duration-200 ease-in-out
              hover:text-blue-600
              hover:scale-125
              hover:font-bold
              focus:outline-none
            "
              aria-label="Close"
            >
              <strong className="text-2xl font-bold hover:text-blue-600">
                ✕
              </strong>
            </button>
            <div className="p-2 max-h-[60vh] overflow-y-auto text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
              {textModalContent.text}
            </div>
          </div>
        </ActionModal>
      )}

      {previewUrl && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg relative max-w-3xl min-h-[200px] flex items-center justify-center">
            <button
              className="absolute top-2 right-2 text-xl z-10 hover:text-red-500 transition-colors"
              onClick={() => {
                setPreviewUrl(null);
                setIsPreviewLoading(false);
              }}
            >
              ✕
            </button>

            {isPreviewLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50 z-0">
                <span className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            <img
              src={previewUrl}
              alt="Preview"
              className={`max-h-[80vh] object-contain transition-opacity duration-300 ${
                isPreviewLoading ? "opacity-0" : "opacity-100"
              }`}
              onLoad={() => setIsPreviewLoading(false)}
              onError={() => setIsPreviewLoading(false)}
            />
          </div>
        </div>
      )}

      {previewImage && (
        <div
          className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh] p-4">
            <button
              className="absolute -top-2 -right-2 bg-white rounded-full px-3 py-1 text-black hover:bg-red-500 hover:text-white"
              onClick={() => setPreviewImage(null)}
            >
              ✕
            </button>

            <img
              src={previewImage}
              alt="Full Preview"
              className="max-h-[85vh] max-w-full rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetailPage;
