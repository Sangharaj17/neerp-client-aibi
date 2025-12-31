"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
import { getTenant } from "@/utils/tenant";
import { toast } from "react-hot-toast";

const InvoiceDetailPage = () => {
  const router = useRouter();
  const { jobId } = useParams();

  const [tenant] = useState(getTenant());
  const [clientId, setClientId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [jobDetails, setJobDetails] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [balanceAmount, setBalanceAmount] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // const storedId = localStorage.getItem(
    //   tenant ? `${tenant}_userId` : "userId"
    // );

    const storedClient = localStorage.getItem(
      tenant ? `${tenant}_clientId` : "clientId"
    );
    if (storedClient) {
      setClientId(storedClient);
    }

    const storedUser = localStorage.getItem(
      tenant ? `${tenant}_userId` : "userId"
    );
    if (storedUser) {
      setUserId(storedUser);
    }
  }, []);

  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  const [form, setForm] = useState({
    leadId: jobDetails?.leadId,
    combinedEnquiryId: jobDetails?.combinedEnquiryId,
    niQuotationId: jobDetails?.niQuotationId,
    quotationNo: jobDetails?.quotationNo,
    jobId: jobDetails?.jobId,
    invoiceDate: getTodayDate(),
    amountToPay: "",
  });

  /* ================= FETCH JOB ================= */
  const fetchJobDetail = async () => {
    try {
      const res = await axiosInstance.get(`/api/jobs/${jobId}/invoice`);

      const jobDetails1 = res.data.data;
      const jobAmount = jobDetails1?.jobAmount ?? 0;
      const paidAmount = jobDetails1?.paidAmount ?? 0;
      const pwdAmount = jobDetails1?.pwdAmount ?? 0;
      console.log(jobDetails1);
      setJobDetails(jobDetails1);

      const totalAmount = jobAmount - pwdAmount;
      const balanceAmount = jobAmount - paidAmount - pwdAmount;

      setTotalAmount(totalAmount);
      setBalanceAmount(balanceAmount);
    } catch (err) {
      toast.error("Failed to load job invoice details");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchJobDetail();
  }, [jobId]);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    setSubmitting(true);

    if (!form.invoiceDate || !form.amountToPay) {
      toast.error("Please fill all mandatory fields");
      return;
    }

    if (Number(form.amountToPay) > balanceAmount) {
      toast.error("Amount to pay cannot be greater than balance amount");
      return;
    }

    if (Number(form.amountToPay) < 0) {
      toast.error("Amount to pay cannot be less than 0");
      return;
    }

    const payload = {
      leadId: jobDetails.leadId ?? null,
      combinedEnquiryId: jobDetails.combinedEnquiryId ?? null,
      quotationId: jobDetails.niQuotationId ?? null,
      quotationNo: jobDetails.quotationNo ?? null,

      jobId: Number(jobId),
      invoiceDate: form.invoiceDate,

      amount: Number(form.amountToPay),

      // totalAmount: totalAmount,
      // paidAmount: Number(form.amountToPay),
      // balanceAmount: balanceAmount - Number(form.amountToPay),

      createdBy: userId,
      payFor: "New Installation",
    };

    try {
      console.log("payload", payload);
      await axiosInstance.post("/api/ni-invoices", payload);
      toast.success("Invoice added successfully");
      //router.back();
      router.push("/dashboard/ni-invoice/list");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add invoice");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!jobDetails) return null;

  /* ================= UI ================= */
  return (
    <div className="min-h-screen flex justify-center items-start bg-gray-100 pt-10">
      <div className="bg-white w-full max-w-xl rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-6 text-center">
          Add Invoice For [Job {jobId}]{" "}
          <span className="text-blue-600">
            {jobDetails?.customerName || "N/A"}
          </span>
          , Site{" "}
          <span className="text-blue-600">{jobDetails?.siteName || "N/A"}</span>
        </h2>

        <div className="space-y-4">
          {/* Total Amount */}
          <div className="flex items-center justify-between">
            <label className="font-medium">Total Amount</label>
            <input
              type="text"
              value={totalAmount}
              disabled
              className="border rounded px-3 py-2 w-72 bg-gray-100"
            />
          </div>

          {/* Balance Amount */}
          <div className="flex items-center justify-between">
            <label className="font-medium">Balance Amount</label>
            <input
              type="text"
              value={balanceAmount}
              disabled
              className="border rounded px-3 py-2 w-72 bg-gray-100"
            />
          </div>

          {/* Invoice Date */}
          <div className="flex items-center justify-between">
            <label className="font-medium">
              Invoice Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="invoiceDate"
              value={form.invoiceDate}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-72"
            />
          </div>

          {/* Amount To Pay */}
          <div className="flex items-center justify-between">
            <label className="font-medium">
              Amount To Pay <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="amountToPay"
              value={form.amountToPay}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-72"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className={`flex items-center gap-2 bg-sky-500 text-white px-6 py-2 rounded 
    hover:bg-sky-600 disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {submitting && (
              <svg
                className="animate-spin h-4 w-4 text-white"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            )}

            <span>{submitting ? "Submitting" : "Submit"}</span>
          </button>
          <button
            onClick={() => router.back()}
            className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
          >
            Cancel
          </button>
        </div>

        <p className="text-red-600 text-sm mt-4">* Fields are required</p>
      </div>
    </div>
  );
};

export default InvoiceDetailPage;
