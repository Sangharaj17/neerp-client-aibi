"use client";

import { useState, useRef, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import ActionModal from "@/components/AMC/ActionModal";
import { getTenant } from "@/utils/tenant";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-hot-toast";
import {
  sanitizeText,
  hasAlphabet,
  isOnlyDigitsOrSpecialChars,
} from "@/utils/common";

export default function NiJobActivityModal({
  isOpen,
  onClose,
  jobId,
  activityType,
  onSubmit,
}) {
  const sigRef = useRef(null);
  const fileInputRef = useRef(null);

  const [userId, setUserId] = useState(0);
  const [tenant, setTenant] = useState(getTenant());
  const [clientId, setClientId] = useState(0);

  const [executives, setExecutives] = useState([]);

  const [jobActivityTypes, setJobActivityTypes] = useState([]);

  const [jobTypeId, setJobTypeId] = useState(activityType);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  useEffect(() => {
    // const tenant = getTenant();
    const storedId = localStorage.getItem(
      tenant ? `${tenant}_userId` : "userId"
    );

    const storedClient = localStorage.getItem(
      tenant ? `${tenant}_clientId` : "clientId"
    );
    if (storedClient) {
      setClientId(storedClient);
    }

    if (!storedId) {
      onClose();
      toast.error("Session expired. Please login again.");
    }
    if (storedId && storedId !== userId) {
      setUserId(storedId);
      setForm((prev) => ({
        ...prev,
        createdBy: Number(userId),
      }));
    }
  }, [userId]);

  useEffect(() => {
    axiosInstance.get("/api/employees/executives").then((res) => {
      const formatted = res.data.map((emp) => ({
        value: emp.employeeId,
        label: emp.employeeName,
      }));
      setExecutives(formatted);
    });

    axiosInstance
      .get("/api/ni-job-activity-types")
      .then((res) => {
        // const formatted = res.data.map((type) => ({
        //   value: type.id,
        //   label: type.typeName,
        // }));
        const formatted = res.data
          .filter((t) => t.status === true)
          .map((t) => ({
            value: t.id,
            label: t.typeName,
          }));
        setJobActivityTypes(formatted);
      })
      .catch((err) => console.error("Error fetching job activity types", err));
  }, []);

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const [form, setForm] = useState({
    // activityType: jobTypeId,
    activityType: "",
    activityDate: getTodayDate(),
    title: "",
    description: "",
    executive: "",
    remark: "",
    signaturePersonName: "",
    signature: null,
    images: [],
    signatureUrl: "",
    createdBy: userId,
  });

  const initialFormState = {
    // activityType: jobTypeId || "",
    activityType: "",
    activityDate: getTodayDate(),
    title: "",
    description: "",
    executive: "",
    remark: "",
    signaturePersonName: "",
    signature: null,
    images: [],
    signatureUrl: "",
    createdBy: userId,
  };

  useEffect(() => {
    if (!isOpen) return;

    if (isOpen) {
      setForm((prev) => ({
        ...initialFormState,
        //activityType: jobTypeId || prev.activityType,

        activityType: activityType || prev.activityType || "",
        createdBy: userId,
      }));
      setErrors({});
      if (sigRef.current) sigRef.current.clear();
      setPreviewImage(null);
      setIsFilePicking(false);
    }
  }, [isOpen, userId, activityType]);

  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);

  const [isFilePicking, setIsFilePicking] = useState(false);

  const validateImageFile = (file) => {
    if (!file) {
      return "File is required";
    }
    console.log("FILE:", file);
    console.log("FILE TYPE:", file.type);
    console.log("FILE SIZE:", file.size);

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return "Only JPG, JPEG, PNG, WEBP images are allowed";
    }

    if (file.size > MAX_FILE_SIZE) {
      return "File size must be less than 5MB";
    }

    return null; // valid
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  /* ================= SIGNATURE ================= */
  const saveSignature = () => {
    const dataUrl = sigRef.current.getTrimmedCanvas().toDataURL("image/png");
    setForm({ ...form, signature: dataUrl });
  };

  const getSignatureBlob = () =>
    new Promise((resolve) => {
      if (!sigRef.current || sigRef.current.isEmpty()) {
        resolve(null);
        return;
      }

      sigRef.current.getCanvas().toBlob(
        (blob) => resolve(blob),
        "image/png",
        0.8 // compression
      );
    });

  // const getSignatureBlob = async () => {
  //   if (!sigRef.current || sigRef.current.isEmpty()) return null;

  //   // 1️⃣ Get base64 safely
  //   const dataUrl = sigRef.current.toDataURL("image/png");

  //   // 2️⃣ Convert Base64 → Blob
  //   const blob = await (await fetch(dataUrl)).blob();

  //   return blob;
  // };

  const getSignatureBase64 = () => {
    if (!sigRef.current || sigRef.current.isEmpty()) return null;
    // return sigRef.current.getTrimmedCanvas().toDataURL("image/png");
    return sigRef.current.toDataURL("image/png");
  };

  const clearSignature = () => {
    sigRef.current.clear();
    setForm({
      ...form,
      signature: null,
      signaturePersonName: "",
      signatureUrl: "",
    });
  };

  /* ================= IMAGE UPLOAD ================= */
  const handleImageUpload = (e) => {
    setIsFilePicking(false);
    const files = Array.from(e.target.files);

    if (form.images.length + files.length > 5) {
      //alert("Maximum 5 images allowed");
      toast.error("Maximum 5 images allowed");
      return;
    }

    // const mapped = files.map((file) => ({
    //   file,
    //   preview: URL.createObjectURL(file),
    // }));

    // setForm({ ...form, images: [...form.images, ...mapped] });

    console.log("FILES:", files);
    console.log("FILES LENGTH:", files.length);
    const validImages = [];

    for (const file of files) {
      const error = validateImageFile(file);

      if (error) {
        toast.error(`${file.name}: ${error}`);
        continue; // skip invalid file
      }

      validImages.push({
        file,
        preview: URL.createObjectURL(file),
      });
    }

    if (validImages.length > 0) {
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...validImages],
      }));
    }

    e.target.value = ""; // reset input
  };

  const removeImage = (index) => {
    const updated = [...form.images];
    updated.splice(index, 1);
    setForm({ ...form, images: updated });
  };

  const validate = async () => {
    console.log("VALIDATION START");

    const err = {};

    const sanitizedForm = { ...form };

    if (!sigRef.current || sigRef.current.isEmpty()) {
      toast.error("Please provide a signature");
      return;
    }

    if (!form.createdBy || Number(form.createdBy) <= 0) {
      err.createdBy = "User session expired. Please login again.";
    }

    console.log("FORM:", form);
    if (!form.activityType) err.activityType = "Activity Type is required";
    if (!form.activityDate) err.activityDate = "Activity Date is required";
    if (!form.executive) err.executive = "Executive is required";

    const fieldsToValidate = [
      { key: "title", label: "Activity Title" },
      { key: "description", label: "Description" },
      { key: "remark", label: "Remark" },
      { key: "signaturePersonName", label: "Signature person name" },
    ];

    fieldsToValidate.forEach(({ key, label }) => {
      const sanitizedValue = sanitizeText(form[key]);
      sanitizedForm[key] = sanitizedValue;

      if (!sanitizedValue) {
        err[key] = `${label} is required`;
      } else if (isOnlyDigitsOrSpecialChars(sanitizedValue)) {
        err[key] = `${label} must contain at least one alphabet`;
      }
    });

    const signatureBlob = await getSignatureBlob();
    console.log("SIGNATURE BLOB:", signatureBlob);

    if (!signatureBlob) err.signature = "Signature is required";

    if (form.images.length > 5) err.images = "Maximum 5 images allowed";

    setErrors(err);

    if (Object.keys(err).length === 0) {
      setForm(sanitizedForm);
    }

    console.log("VALIDATION ERRORS:", err);

    return Object.keys(err).length === 0;
  };

  // const handleSubmit = () => {
  //   if (!validate()) return;

  //   onSubmit({
  //     jobId,
  //     ...form,
  //   });
  // };

  // const handleSubmit = async () => {
  //   console.log("SUBMIT CLICKED");

  //   const valid = await validate();
  //   console.log("VALIDATION RESULT:", valid);

  //   if (!valid) return;

  //   console.log("AFTER VALIDATION");

  //   const payload = buildActivityPayload();
  //   console.log("PAYLOAD:", payload);

  //   try {
  //     const formData = new FormData();

  //     formData.append(
  //       "activity",
  //       new Blob([JSON.stringify(payload)], { type: "application/json" })
  //     );

  //     form.images.forEach((img) => {
  //       formData.append("photos", img.file);
  //     });

  //     console.log("FORMDATA READY");

  //     if (onSubmit) {
  //       onSubmit(formData);
  //     }

  //     onClose();
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Failed to save job activity");
  //   }
  // };

  const handleSubmit = async () => {
    console.log("SUBMIT CLICKED");

    const valid = await validate();
    if (!valid) return;

    let activityId = null;
    let creationToastId = null;

    try {
      // 1️⃣ CREATE ACTIVITY (JSON)
      creationToastId = toast.loading("Creating activity...");
      const activityRes = await axiosInstance.post(
        "/api/job-activities",
        buildActivityPayload()
      );

      const updatedActivities = activityRes.data?.data;
      if (!updatedActivities || updatedActivities.length === 0) {
        throw new Error("Activities list missing");
      }

      console.log("ACTIVITIES:", updatedActivities);
      console.log("ACTIVITIES LENGTH:", updatedActivities.length);
      console.log("ACTIVITY ID:", updatedActivities?.jobActivityId);

      activityId = updatedActivities?.jobActivityId;

      if (!activityId) throw new Error("Activity ID missing");

      toast.success("Activity created successfully", { id: creationToastId });

      // 2️⃣ UPLOAD PHOTOS (MULTIPART)
      if (form.images.length > 0) {
        const photoToastId = toast.loading(
          `Uploading ${form.images.length} photo(s)...`
        );
        try {
          const photoFormData = new FormData();
          form.images.forEach((img) => {
            photoFormData.append("photos", img.file);
          });

          await axiosInstance.post(
            `/api/job-activities/${clientId}/${jobId}/${activityId}/photos`,
            photoFormData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
          toast.success("Photos uploaded successfully", { id: photoToastId });
        } catch (photoError) {
          toast.error("Failed to upload photos", { id: photoToastId });
          throw photoError;
        }
      }

      // 3️⃣ UPLOAD SIGNATURE (if exists)
      const signatureBlob = await getSignatureBlob();
      console.log("Signature blob:", signatureBlob, signatureBlob?.size);

      if (signatureBlob) {
        const sigToastId = toast.loading("Uploading signature...");
        try {
          const sigFormData = new FormData();
          sigFormData.append("signature", signatureBlob, "signature.png");

          await axiosInstance.post(
            `/api/job-activities/${clientId}/${jobId}/${activityId}/signature`,
            sigFormData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          toast.success("Signature uploaded successfully", { id: sigToastId });
        } catch (sigError) {
          toast.error("Failed to upload signature", { id: sigToastId });
          throw sigError;
        }
      }

      // 4️⃣ SEND EMAIL AUTOMATICALLY
      const emailToastId = toast.loading("Sending email to customer...");
      try {
        const response = await axiosInstance.post(
          `/api/job-activities/${activityId}/send-activity-email`
        );

        if (response.data.success) {
          toast.success("Email sent successfully!", { id: emailToastId });
        } else {
          toast.error(response.data.message || "Email failed to send", {
            id: emailToastId,
          });
        }
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
        const errorMessage =
          emailError.response?.data?.message ||
          "Activity created but email failed to send";
        toast.error(errorMessage, { id: emailToastId });
        // Don't fail the entire operation if email fails
      }

      onSubmit(updatedActivities);

      toast.success("Job Activity completed successfully!");
      onClose();
    } catch (err) {
      console.error(err);

      // 🔴 Rollback activity if photo/signature upload failed
      if (activityId) {
        const rollbackToastId = toast.loading("Rolling back activity...");
        try {
          await axiosInstance.delete(`/api/job-activities/${activityId}`);
          toast.error("Activity creation failed and was rolled back", {
            id: rollbackToastId,
          });
        } catch (rollbackError) {
          toast.error("Failed to rollback activity", { id: rollbackToastId });
        }
      }

      if (creationToastId) {
        toast.error(
          err?.response?.data?.message || "Failed to save job activity",
          { id: creationToastId }
        );
      } else {
        toast.error(
          err?.response?.data?.message || "Failed to save job activity"
        );
      }
    }
  };

  const openFilePicker = () => {
    setIsFilePicking(true);
    fileInputRef.current?.click();
  };

  const buildActivityPayload = () => ({
    jobId,
    jobActivityTypeId: Number(form.activityType),
    activityDate: form.activityDate,
    activityTitle: form.title,
    activityDescription: form.description,
    jobActivityBy: Number(form.executive),
    remark: form.remark,
    mailSent: false,
    createdBy: userId, // from auth

    signaturePersonName: form.signaturePersonName,
    // signatureBase64: getSignatureBase64(),
    // signatureUrl: getSignatureBlob(),
  });

  const buildPhotoFormData = () => {
    const fd = new FormData();
    form.images.forEach((img) => fd.append("photos", img.file));
    return fd;
  };

  return (
    <>
      <ActionModal isOpen={isOpen} onCancel={onClose}>
        <div className="relative">
          <h2 className="text-xl font-bold text-gray-800 text-center mb-6">
            Add Job Activity
          </h2>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-0 right-0 text-gray-500 hover:text-blue-600 hover:scale-125 transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* FORM */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Job No */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Job No <span className="text-red-500">*</span>
            </label>
            <input
              value={jobId}
              disabled
              className="w-full bg-gray-100 border rounded px-3 py-2 text-sm"
            />
          </div>

          {/* Activity Type */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Select Activity Type <span className="text-red-500">*</span>
            </label>
            <select
              name="activityType"
              value={form.activityType}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 text-sm ${
                errors.activityType ? "border-red-500" : ""
              }`}
            >
              <option value="">Please Select</option>
              {jobActivityTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            {errors.activityType && (
              <p className="text-xs text-red-500 mt-1">{errors.activityType}</p>
            )}
          </div>

          {/* Activity Date */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Activity Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="activityDate"
              value={form.activityDate}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 text-sm ${
                errors.activityDate ? "border-red-500" : ""
              }`}
            />
            {errors.activityDate && (
              <p className="text-xs text-red-500 mt-1">{errors.activityDate}</p>
            )}
          </div>

          {/* Executive */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Select Executive <span className="text-red-500">*</span>
            </label>
            <select
              name="executive"
              value={form.executive}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 text-sm ${
                errors.executive ? "border-red-500" : ""
              }`}
            >
              <option value="">Please Select</option>
              {executives.map((e) => (
                <option key={e.value} value={e.value}>
                  {e.label}
                </option>
              ))}
            </select>
            {errors.executive && (
              <p className="text-xs text-red-500 mt-1">{errors.executive}</p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Activity Title <span className="text-red-500">*</span>
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 text-sm ${
                errors.title ? "border-red-500" : ""
              }`}
            />
            {errors.title && (
              <p className="text-xs text-red-500 mt-1">{errors.title}</p>
            )}
          </div>

          {/* Remark */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Activity Remark <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={2}
              name="remark"
              value={form.remark}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 text-sm ${
                errors.remark ? "border-red-500" : ""
              }`}
            />
            {errors.remark && (
              <p className="text-xs text-red-500 mt-1">{errors.remark}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Activity Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              name="description"
              value={form.description}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 text-sm ${
                errors.description ? "border-red-500" : ""
              }`}
            />
            {errors.description && (
              <p className="text-xs text-red-500 mt-1">{errors.description}</p>
            )}
          </div>

          {/* ================= IMAGES (FULL ROW) ================= */}
          {/* <div className="md:col-span-2"> */}
          <div>
            <label className="label">Images </label>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              // accept="image/*"
              accept=".jpg,.jpeg,.png"
              // accept="image/jpeg,image/jpg,image/png,image/webp"
              className="hidden"
              onChange={handleImageUpload}
            />

            <div className="grid grid-cols-1 gap-4 items-start">
              {/* Upload Box */}
              <div
                onClick={openFilePicker}
                className="border-2 border-dashed border-blue-400 rounded-lg p-5 text-center cursor-pointer hover:bg-blue-50 transition"
              >
                {isFilePicking ? (
                  <div className="flex flex-col items-center gap-2">
                    <span className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-blue-600 font-medium">
                      Opening file picker...
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-blue-600 font-medium">
                      Click here to select images
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Max 5 images allowed
                    </p>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {form.images.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {form.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image.preview}
                        className="w-10 h-10 object-cover rounded border cursor-pointer"
                        onClick={() => setPreviewImage(image.preview)}
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ================= SIGNATURE (LAST FULL ROW) ================= */}
          {/* <div className="md:col-span-2"> */}
          <div>
            <label className="label">Signature *</label>

            <SignatureCanvas
              ref={sigRef}
              penColor="#000"
              minWidth={1.2}
              maxWidth={2.8}
              velocityFilterWeight={0.7} // 🔥 smooth strokes
              throttle={16} // 🔥 mobile friendly
              onEnd={() => {
                if (errors.signature) {
                  setErrors((prev) => ({ ...prev, signature: null }));
                }
              }}
              canvasProps={{
                width: 500,
                height: 200,
                className: `border rounded bg-white w-full ${
                  errors.signature ? "border-red-500" : ""
                }`,
              }}
            />
            {errors.signature && (
              <p className="text-xs text-red-500 mt-1">{errors.signature}</p>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">
                Signature Person Name <span className="text-red-500">*</span>
              </label>
              <input
                name="signaturePersonName"
                value={form.signaturePersonName}
                onChange={handleChange}
                className={`w-full border rounded px-3 py-2 text-sm ${
                  errors.signaturePersonName ? "border-red-500" : ""
                }`}
              />
              {errors.signaturePersonName && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.signaturePersonName}
                </p>
              )}
            </div>

            <div className="flex justify-center gap-3 mt-3">
              {/* <button
                onClick={saveSignature}
                className="px-4 py-1.5
                text-xs font-semibold
                bg-blue-500 text-white
                rounded
                cursor-pointer
                disabled:cursor-not-allowed
                hover:bg-blue-600
                transition"
              >
                Save Signature
              </button> */}
              <button
                onClick={clearSignature}
                className="px-4 py-1.5
                text-xs font-semibold
                bg-gray-500 text-white
                rounded
                cursor-pointer
                disabled:cursor-not-allowed
                hover:bg-gray-600
                transition"
              >
                Clear Signature
              </button>
            </div>
          </div>

          {/* ================= ACTION BUTTONS ================= */}
          <div className="md:col-span-3 flex justify-center gap-4 pt-6">
            <button
              onClick={handleSubmit}
              className="
                px-6 py-2
                text-sm font-medium
                bg-blue-600 text-white
                rounded-md
                cursor-pointer
                disabled:cursor-not-allowed
                hover:bg-blue-700
                hover:shadow-md
                transition-all duration-200
              "
            >
              Submit
            </button>

            <button
              onClick={onClose}
              className="px-6 py-2
                text-sm font-medium
                bg-gray-500 text-white
                rounded-md
                cursor-pointer
                disabled:cursor-not-allowed
                hover:bg-gray-600
                hover:shadow-md
                transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </ActionModal>

      {previewImage && (
        <ActionModal isOpen={true} onCancel={() => setPreviewImage(null)}>
          <div className="relative">
            {/* Close Button */}
            <button
              onClick={() => setPreviewImage(null)}
              className="
          absolute top-2 right-2 z-10
          w-8 h-8 flex items-center justify-center
          rounded-full bg-white/90
          text-gray-600 text-lg font-bold
          shadow
          hover:bg-red-500 hover:text-white
          transition
          cursor-pointer
        "
              aria-label="Close preview"
            >
              ✕
            </button>

            {/* Image */}
            <img
              src={previewImage}
              className="max-h-[80vh] mx-auto rounded-lg shadow-lg"
            />
          </div>
        </ActionModal>
      )}
    </>
  );
}
