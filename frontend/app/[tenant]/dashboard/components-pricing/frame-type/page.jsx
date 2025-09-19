"use client";
import { useState, useEffect } from "react";
import { SlidersHorizontal } from "lucide-react";
import { toast } from "react-hot-toast";
import ReusableTable from "@/components/UI/ReusableTable";
import PageHeader from "@/components/UI/PageHeader";
import { confirmDeleteWithToast } from "@/components/UI/toastUtils";
import ResponsiveForm from "@/components/UI/ResponsiveForm";
import { FormInput, FormButton } from "@/components/UI/FormElements";
import axiosInstance from "@/utils/axiosInstance";

export default function CounterFrameType() {
  const [counterFrameType, setCounterFrameType] = useState("");
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [counterFrameTypes, setCounterFrameTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const sanitize = (value) => value.trim().toUpperCase();

  const API_URL = "/api/counter-frame-types";

  const fetchCounterFrameTypes = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get(API_URL);
      const data = res.data;
      const list = Array.isArray(data) ? data : data?.data || [];

      setCounterFrameTypes(list);
    } catch (error) {
      console.error("Error loading Counter Frame Types:", error);
      toast.error(
        error.response?.data?.message || "Error loading Counter Frame Types"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounterFrameTypes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = sanitize(counterFrameType);
    if (!name) {
      toast.error("Counter Frame Type cannot be empty");
      return;
    }

    const isDuplicate = counterFrameTypes.some(
      (lt) => lt.frameTypeName === name && lt.id !== editId
    );
    if (isDuplicate) {
      toast.error("Counter Frame Type already exists");
      return;
    }

    try {
      const method = editId ? "put" : "post";
      const url = editId ? `${API_URL}/${editId}` : `${API_URL}`;

      await axiosInstance[method](url, { frameTypeName: name });

      toast.success(`Counter Frame Type ${editId ? "updated" : "created"}`);
      setCounterFrameType("");
      setEditId("");
      fetchCounterFrameTypes();
    } catch (err) {
      console.error("Error saving Counter Frame Type:", err);
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleEdit = (counterFrameTypeObj) => {
    const numericId = Number(counterFrameTypeObj.id); // ensure number
    const found = counterFrameTypes.find((l) => l.id === numericId);
    if (!found) {
      toast.error("Counter Frame Type not found");
      return;
    }
    setCounterFrameType(found.frameTypeName);
    setEditId(numericId);
  };

  const handleCancel = () => {
    setCounterFrameType("");
    setEditId(null);
  };

  const handleDelete = (id) => {
    const selected = counterFrameTypes.find((d) => d.id === id);
    if (!selected) {
      toast.error("Invalid Counter Frame type selected for deletion");
      return;
    }

    confirmDeleteWithToast(selected.frameTypeName, async () => {
      try {
        await axiosInstance.delete(`${API_URL}/${id}`);

        toast.success("Counter Frame Type deleted");

        if (editId === id) {
          setCounterFrameType("");
          setEditId(null);
        }

        fetchCounterFrameTypes();
      } catch (err) {
        console.error("Error deleting Counter Frame Type:", err);
        toast.error(
          err.response?.data?.message || "Error deleting Counter Frame Type"
        );
      }
    });
  };

  const filteredList = counterFrameTypes.filter((lt) =>
    lt.frameTypeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 w-full p-6 min-h-screen">
      {/* Header */}
      <PageHeader
        title="Counter Frame Types"
        description="Manage and categorize types of counter frame."
        icon={SlidersHorizontal}
      />

      {/* Form Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <ResponsiveForm
          onSubmit={handleSubmit}
          columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-5"
          className="mt-4"
        >
          <FormInput
            type="text"
            placeholder="Enter Counter Frame Type"
            value={counterFrameType || ""}
            onChange={(e) => setCounterFrameType(e.target.value)}
          />
          <div className="col-span-auto gap-2 flex items-center">
            <FormButton variant="primary">
              {editId ? "Update" : "ADD"}
            </FormButton>

            {editId && (
              <FormButton
                type="button"
                variant="secondary"
                onClick={handleCancel}
              >
                Cancel
              </FormButton>
            )}
          </div>
        </ResponsiveForm>
      </div>

      <ReusableTable
        title="Counter Frame Type List"
        columns={[
          {
            key: "frameTypeName",
            label: "Counter Frame Type",
            sortable: true,
            editable: false,
          },
        ]}
        data={filteredList}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        height="350px"
        combineActions={false}
        inlineEditing={false}
        loading={loading}
      />
    </div>
  );
}
