"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import JobActivityTypeModal from "./JobActivityTypeModal";
import { confirmDeleteWithToast } from "@/components/UI/toastUtils";
import { toast } from "react-hot-toast";
import { Edit, Trash2, Save, X } from "lucide-react";

export default function NiJobActivityType() {
  const [data, setData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editRow, setEditRow] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch list
  const fetchData = async () => {
    const res = await axiosInstance.get("/api/ni-job-activity-types");
    setData(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Inline edit
  const handleEdit = (row) => {
    setEditingId(row.id);
    setEditRow({
      ...row,
      status: Boolean(row.status), // ensure boolean
    });
  };

  const handleEditChange = (e) => {
    setEditRow({ ...editRow, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const toastId = toast.loading("Updating Job Activity Type...");

    try {
      await axiosInstance.put(
        `/api/ni-job-activity-types/${editingId}`,
        editRow
      );

      toast.success("Job Activity Type updated successfully", {
        id: toastId,
      });

      setEditingId(null);
      await fetchData();
    } catch (err) {
      console.error("Update failed:", err);
      toast.error(
        err.response?.data?.message || "Failed to update Job Activity Type",
        { id: toastId }
      );
    }
  };

  // Delete
  const handleDelete = async (row) => {
    // if (!window.confirm("Are you sure?")) return;
    // await axiosInstance.delete(`/api/ni-job-activity-types/${id}`);

    confirmDeleteWithToast("Job Activity Type " + row.typeName, async () => {
      try {
        // 🔹 Delete request
        await axiosInstance.delete(`/api/ni-job-activity-types/${row.id}`);

        toast.success("Job Activity Type deleted successfully");

        fetchData();
      } catch (err) {
        console.error("Error deleting Job Activity Type:", err);
        toast.error(
          err.response?.data?.message || "Error deleting Job Activity Type"
        );
      }
    });
  };

  return (
    <div className="min-h-screen flex justify-center items-start bg-gray-100 pt-8">
      <div className="bg-white w-full max-w-5xl rounded-xl shadow-lg p-6 mt-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 mt-4">
          <h2 className="text-lg font-semibold">Job Activity Types</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded text-sm"
          >
            + Add New Job Activity Type
          </button>
        </div>

        {/* Table */}
        <div className="flex justify-center">
          <div className="w-full max-w-3xl border rounded overflow-x-auto max-h-[calc(100vh-240px)] overflow-y-auto mt-6 mb-6">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Type Name</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {data.map((row) => (
                  <tr key={row.id} className="border-t">
                    <td className="p-2">
                      {editingId === row.id ? (
                        <input
                          name="typeName"
                          value={editRow.typeName}
                          onChange={handleEditChange}
                          className="border px-2 py-1 w-full"
                        />
                      ) : (
                        row.typeName
                      )}
                    </td>

                    <td className="p-2">
                      {editingId === row.id ? (
                        <select
                          name="status"
                          value={String(editRow.status)}
                          onChange={(e) =>
                            setEditRow({
                              ...editRow,
                              status: e.target.value === "true",
                            })
                          }
                          className="border px-2 py-1 w-full"
                        >
                          <option value="true">ACTIVE</option>
                          <option value="false">INACTIVE</option>
                        </select>
                      ) : row.status ? (
                        "ACTIVE"
                      ) : (
                        "INACTIVE"
                      )}
                    </td>

                    <td className="p-2 text-center w-[250px]">
                      {editingId === row.id ? (
                        <div className="flex justify-center gap-8">
                          <button
                            onClick={handleUpdate}
                            className="flex items-center gap-2 text-green-600 hover:text-green-800"
                          >
                            <Save size={18} />
                            <span>Save</span>
                          </button>

                          <button
                            onClick={() => setEditingId(null)}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                          >
                            <X size={18} />
                            <span>Cancel</span>
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-center gap-8">
                          <button
                            onClick={() => handleEdit(row)}
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                          >
                            <Edit size={18} />
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={() => handleDelete(row)}
                            className="flex items-center gap-2 text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={18} />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}

                {data.length === 0 && (
                  <tr>
                    <td colSpan="3" className="text-center p-4 text-gray-500">
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Modal */}
        {isModalOpen && (
          <JobActivityTypeModal
            onClose={() => setIsModalOpen(false)}
            onSuccess={fetchData}
          />
        )}
      </div>
    </div>
  );
}
