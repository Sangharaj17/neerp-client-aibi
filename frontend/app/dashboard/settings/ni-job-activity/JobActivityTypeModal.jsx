"use client";

import { useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-hot-toast";

export default function JobActivityTypeModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    typeName: "",
    status: true,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.typeName.trim()) {
      toast.error("Type Name is required");
      return;
    }

    await axiosInstance.post("/api/ni-job-activity-types", form);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-96 p-4">
        <h3 className="text-lg font-semibold mb-4">Add Job Activity Type</h3>

        <div className="mb-3">
          <label className="block text-sm mb-1">Type Name</label>
          <input
            name="typeName"
            value={form.typeName}
            onChange={handleChange}
            className="w-full border px-3 py-2 text-sm rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value === "true" })
            }
            className="w-full border px-3 py-2 text-sm rounded"
          >
            <option value="true">ACTIVE</option>
            <option value="false">INACTIVE</option>
          </select>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-indigo-600 text-white rounded text-sm"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
