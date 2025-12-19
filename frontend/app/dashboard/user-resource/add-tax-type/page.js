"use client";

import { useEffect, useState } from "react";
import Input from "@/components/UI/Input";
import ActionModal from "@/components/AMC/ActionModal";
import axiosInstance from "@/utils/axiosInstance";
import { Loader2, Pencil, X } from "lucide-react";
import toast from "react-hot-toast";

const API_TAX_TYPES = "/api/tax-types";

export default function AddTaxTypePage() {
  const [taxTypes, setTaxTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [taxName, setTaxName] = useState("");
  const [taxPercentage, setTaxPercentage] = useState("");

  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editingTaxType, setEditingTaxType] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [editingPercentage, setEditingPercentage] = useState("");

  useEffect(() => {
    loadTaxTypes();
  }, []);

  const loadTaxTypes = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(API_TAX_TYPES);
      // Handle successful response - empty array is fine, no error needed
      const data = Array.isArray(res.data) ? res.data : [];
      setTaxTypes(data);
    } catch (error) {
      console.error("Failed to fetch tax types", error);
      // Only show error for actual API failures, not for empty tables or 404
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        // Don't show error for 404 (table doesn't exist yet) - treat as empty
        if (status === 404) {
          // Table doesn't exist yet, just set empty array - no error message
          setTaxTypes([]);
        } else if (status >= 500) {
          // Server error - show error message
          toast.error("Server error. Please try again later.");
        } else if (status >= 400) {
          // Other client errors - show error message
          toast.error("Could not fetch tax types. Please try again.");
        } else {
          // Unknown error status - set empty array
          setTaxTypes([]);
        }
      } else if (error.request) {
        // Request was made but no response received (network error)
        toast.error("Network error. Please check your connection.");
        setTaxTypes([]);
      } else {
        // Other errors - set empty array without showing error
        setTaxTypes([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTaxType = async (event) => {
    event.preventDefault();
    const trimmedName = taxName.trim();

    if (!trimmedName || !taxPercentage.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const percentage = parseFloat(taxPercentage);
    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      toast.error("Tax percentage must be a valid number between 0 and 100.");
      return;
    }

    // Check for duplicate tax name (case-insensitive)
    const isDuplicate = taxTypes.some(t =>
      t.taxName?.toLowerCase().trim() === trimmedName.toLowerCase()
    );
    if (isDuplicate) {
      toast.error("Tax type already exists.");
      return;
    }

    setSaving(true);
    try {
      const res = await axiosInstance.post(API_TAX_TYPES, {
        taxName: trimmedName,
        taxPercentage: percentage,
      });
      const created = res.data;
      setTaxTypes((prev) => [created, ...prev]);
      setTaxName("");
      setTaxPercentage("");
      toast.success("Tax type created successfully.");
      // Reload the list to ensure we have the latest data
      loadTaxTypes();
    } catch (error) {
      console.error("Failed to create tax type", error);
      console.error("Error details:", {
        response: error.response?.data,
        status: error.response?.status,
        message: error.message
      });
      // Show more detailed error message
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        let message = "Failed to create tax type.";

        // Try to extract error message from different response formats
        if (typeof data === 'string') {
          message = data;
        } else if (data?.message) {
          message = data.message;
        } else if (data?.error) {
          message = data.error;
        } else if (data?.errors && typeof data.errors === 'object') {
          // Handle validation errors object
          const errorMessages = Object.values(data.errors).join(', ');
          message = `Validation errors: ${errorMessages}`;
        }

        if (status === 400) {
          toast.error(`Validation error: ${message}`);
        } else if (status === 409) {
          toast.error(`Conflict: ${message}`);
        } else if (status >= 500) {
          toast.error(`Server error: ${message || 'Internal server error. Please check server logs.'}`);
        } else {
          toast.error(`Error (${status}): ${message}`);
        }
      } else if (error.request) {
        toast.error("Network error. Please check your connection and ensure the server is running.");
      } else {
        toast.error(`Failed to create tax type: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setTaxName("");
    setTaxPercentage("");
  };

  const openEditModal = (taxType) => {
    setEditingTaxType(taxType);
    setEditingName(taxType.taxName);
    setEditingPercentage(taxType.taxPercentage.toString());
    setEditModalOpen(true);
  };

  const handleUpdateTaxType = async () => {
    const trimmedName = editingName.trim();
    if (!editingTaxType || !trimmedName || !editingPercentage.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const percentage = parseFloat(editingPercentage);
    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      toast.error("Tax percentage must be a valid number between 0 and 100.");
      return;
    }

    // Check for duplicate tax name (case-insensitive), excluding current tax type
    const isDuplicate = taxTypes.some(t =>
      t.taxName?.toLowerCase().trim() === trimmedName.toLowerCase() &&
      t.taxTypeId !== editingTaxType.taxTypeId
    );
    if (isDuplicate) {
      toast.error("Tax type already exists.");
      return;
    }

    setSaving(true);
    try {
      await axiosInstance.put(`${API_TAX_TYPES}/${editingTaxType.taxTypeId}`, {
        taxName: trimmedName,
        taxPercentage: percentage,
      });
      setTaxTypes((prev) =>
        prev.map((taxType) =>
          taxType.taxTypeId === editingTaxType.taxTypeId
            ? { ...taxType, taxName: trimmedName, taxPercentage: percentage }
            : taxType
        )
      );
      toast.success("Tax type updated successfully.");
      setEditModalOpen(false);
      setEditingTaxType(null);
      setEditingName("");
      setEditingPercentage("");
    } catch (error) {
      console.error("Failed to update tax type", error);
      toast.error("Failed to update tax type.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-gray-900">Add Tax Type</h1>
        <p className="text-sm text-gray-600">
          Create and manage tax types for your organization.
        </p>
      </header>

      {/* Form Section */}
      <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <form onSubmit={handleCreateTaxType} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tax Name<span className="text-red-500">*</span>
              </label>
              <Input
                value={taxName}
                onChange={(e) => setTaxName(e.target.value)}
                placeholder="Tax Name"
                className="w-full"
                required
                disabled={saving}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tax Percentage<span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={taxPercentage}
                onChange={(e) => setTaxPercentage(e.target.value)}
                placeholder="Tax Percentage"
                className="w-full"
                required
                disabled={saving}
              />
              <p className="text-xs text-gray-500 mt-1">(eg. 13%)</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-gray-900 px-5 text-sm font-semibold text-white shadow hover:bg-gray-800 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}
              Submit
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </section>

      {/* Tax Type List Section */}
      <section className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
            Tax Type List
          </h2>
          <span className="text-xs text-gray-500">
            {taxTypes.length} {taxTypes.length === 1 ? "type" : "types"}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Sr.No.</th>
                <th className="px-4 py-3 text-left font-medium">Tax Name</th>
                <th className="px-4 py-3 text-left font-medium">Tax Percentage</th>
                <th className="px-4 py-3 text-left font-medium">Edit</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-gray-400">
                    <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                    <p className="mt-2 text-xs">Loading tax types…</p>
                  </td>
                </tr>
              ) : taxTypes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-gray-400">
                    No tax types created yet.
                  </td>
                </tr>
              ) : (
                taxTypes.map((taxType, index) => (
                  <tr
                    key={taxType.taxTypeId ?? taxType.id ?? index}
                    className="border-t border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {taxType.taxName}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {taxType.taxPercentage}%
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => openEditModal(taxType)}
                        className="inline-flex items-center gap-1 rounded border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-blue-50"
                        disabled={saving}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Edit Modal */}
      <ActionModal
        isOpen={isEditModalOpen}
        onCancel={() => {
          setEditModalOpen(false);
          setEditingTaxType(null);
          setEditingName("");
          setEditingPercentage("");
        }}
      >
        <div className="space-y-5">
          <header>
            <h3 className="text-lg font-semibold text-gray-900">Edit Tax Type</h3>
            <p className="text-xs text-gray-500 mt-1">
              Update the tax type information.
            </p>
          </header>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Tax Name<span className="text-red-500">*</span>
              </label>
              <Input
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                placeholder="Tax Name"
                className="w-full"
                disabled={saving}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Tax Percentage<span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={editingPercentage}
                onChange={(e) => setEditingPercentage(e.target.value)}
                placeholder="Tax Percentage"
                className="w-full"
                disabled={saving}
              />
              <p className="text-xs text-red-500 mt-1">(eg. 13%)</p>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <button
              type="button"
              className="rounded bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 transition-colors"
              onClick={() => {
                setEditModalOpen(false);
                setEditingTaxType(null);
                setEditingName("");
                setEditingPercentage("");
              }}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
              onClick={handleUpdateTaxType}
              disabled={saving || !editingName.trim() || !editingPercentage.trim()}
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Changes
            </button>
          </div>
        </div>
      </ActionModal>
    </div>
  );
}
