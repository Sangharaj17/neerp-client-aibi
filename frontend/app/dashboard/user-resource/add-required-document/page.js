"use client";

import { useEffect, useState } from "react";
import Input from "@/components/UI/Input";
import ActionModal from "@/components/AMC/ActionModal";
import axiosInstance from "@/utils/axiosInstance";
import { Loader2, Pencil } from "lucide-react";
import toast from "react-hot-toast";

const API_REQUIRED_DOCUMENTS = "/api/required-documents";

export default function AddRequiredDocumentPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [documentName, setDocumentName] = useState("");

  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);
  const [editingName, setEditingName] = useState("");

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(API_REQUIRED_DOCUMENTS);
      // Handle successful response - empty array is fine, no error needed
      const data = Array.isArray(res.data) ? res.data : [];
      setDocuments(data);
    } catch (error) {
      console.error("Failed to fetch required documents", error);
      // Only show error for actual API failures, not for empty tables or 404
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        // Don't show error for 404 (table doesn't exist yet) - treat as empty
        if (status === 404) {
          // Table doesn't exist yet, just set empty array - no error message
          setDocuments([]);
        } else if (status >= 500) {
          // Server error - show error message
          toast.error("Server error. Please try again later.");
        } else if (status >= 400) {
          // Other client errors - show error message
          toast.error("Could not fetch required documents. Please try again.");
        } else {
          // Unknown error status - set empty array
          setDocuments([]);
        }
      } else if (error.request) {
        // Request was made but no response received (network error)
        toast.error("Network error. Please check your connection.");
        setDocuments([]);
      } else {
        // Other errors - set empty array without showing error
        setDocuments([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDocument = async (event) => {
    event.preventDefault();
    const trimmedName = documentName.trim();

    if (!trimmedName) {
      toast.error("Please enter a document name.");
      return;
    }

    // Check for duplicate document name (case-insensitive)
    const isDuplicate = documents.some(d =>
      d.documentName?.toLowerCase().trim() === trimmedName.toLowerCase()
    );
    if (isDuplicate) {
      toast.error("Document type already exists.");
      return;
    }

    setSaving(true);
    try {
      const res = await axiosInstance.post(API_REQUIRED_DOCUMENTS, {
        documentName: trimmedName,
      });
      const created = res.data;
      setDocuments((prev) => [created, ...prev]);
      setDocumentName("");
      toast.success("Required document created successfully.");
      // Reload the list to ensure we have the latest data
      loadDocuments();
    } catch (error) {
      console.error("Failed to create required document", error);
      console.error("Error details:", {
        response: error.response?.data,
        status: error.response?.status,
        message: error.message
      });
      // Show more detailed error message
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        let message = "Failed to create required document.";

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
        toast.error(`Failed to create required document: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setSaving(false);
    }
  };

  const openEditModal = (document) => {
    setEditingDocument(document);
    setEditingName(document.documentName);
    setEditModalOpen(true);
  };

  const handleUpdateDocument = async () => {
    const trimmedName = editingName.trim();
    if (!editingDocument || !trimmedName) {
      toast.error("Please enter a document name.");
      return;
    }

    // Check for duplicate document name (case-insensitive), excluding current document
    const isDuplicate = documents.some(d =>
      d.documentName?.toLowerCase().trim() === trimmedName.toLowerCase() &&
      d.documentId !== editingDocument.documentId
    );
    if (isDuplicate) {
      toast.error("Document type already exists.");
      return;
    }

    setSaving(true);
    try {
      await axiosInstance.put(`${API_REQUIRED_DOCUMENTS}/${editingDocument.documentId}`, {
        documentName: trimmedName,
      });
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.documentId === editingDocument.documentId
            ? { ...doc, documentName: trimmedName }
            : doc
        )
      );
      toast.success("Required document updated successfully.");
      setEditModalOpen(false);
      setEditingDocument(null);
      setEditingName("");
    } catch (error) {
      console.error("Failed to update required document", error);
      toast.error("Failed to update required document.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-gray-900">Add Required Document</h1>
        <p className="text-sm text-gray-600">
          Create and manage required document types for your organization.
        </p>
      </header>

      {/* Form Section */}
      <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <form onSubmit={handleCreateDocument} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type Of Document<span className="text-red-500">*</span>
            </label>
            <Input
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              placeholder="Type Of Document"
              className="w-full"
              required
              disabled={saving}
            />
          </div>
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
        </form>
      </section>

      {/* Document Type List Section */}
      <section className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
            Document Type List
          </h2>
          <span className="text-xs text-gray-500">
            {documents.length} {documents.length === 1 ? "document" : "documents"}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Sr.No.</th>
                <th className="px-4 py-3 text-left font-medium">Document Name</th>
                <th className="px-4 py-3 text-left font-medium">Edit</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-gray-400">
                    <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                    <p className="mt-2 text-xs">Loading documents…</p>
                  </td>
                </tr>
              ) : documents.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-gray-400">
                    No documents created yet.
                  </td>
                </tr>
              ) : (
                documents.map((document, index) => (
                  <tr
                    key={document.documentId ?? document.id ?? index}
                    className="border-t border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {document.documentName}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => openEditModal(document)}
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
          setEditingDocument(null);
          setEditingName("");
        }}
      >
        <div className="space-y-5">
          <header>
            <h3 className="text-lg font-semibold text-gray-900">Edit Required Document</h3>
            <p className="text-xs text-gray-500 mt-1">
              Update the document name.
            </p>
          </header>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Type Of Document<span className="text-red-500">*</span>
              </label>
              <Input
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                placeholder="Type Of Document"
                className="w-full"
                disabled={saving}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <button
              type="button"
              className="rounded bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 transition-colors"
              onClick={() => {
                setEditModalOpen(false);
                setEditingDocument(null);
                setEditingName("");
              }}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
              onClick={handleUpdateDocument}
              disabled={saving || !editingName.trim()}
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
