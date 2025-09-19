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

export default function TypeOfLift() {
  const [liftType, setLiftType] = useState("");
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [liftTypes, setLiftTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "/api/type-of-lift";

  const sanitize = (value) => value.trim().toUpperCase();

  const fetchLiftTypes = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`${API_URL}`);
      setLiftTypes(res.data?.data || []);
    } catch (error) {
      console.error("Error fetching lift types:", error);
      toast.error("Error loading lift types");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiftTypes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = sanitize(liftType);
    if (!name) {
      toast.error("Lift Type cannot be empty");
      return;
    }

    const isDuplicate = liftTypes.some(
      (lt) => lt.liftTypeName === name && lt.id !== editId
    );
    if (isDuplicate) {
      toast.error("Lift Type already exists");
      return;
    }

    try {
      const method = editId ? "put" : "post";
      const url = editId ? `${API_URL}/${editId}` : `${API_URL}`;

      const res = await axiosInstance[method](url, { liftTypeName: name });

      toast.success(`Lift Type ${editId ? "updated" : "created"}`);
      setLiftType("");
      fetchLiftTypes();
      setEditId(null);
    } catch (err) {
      console.error("Error saving lift type:", err);
      const message =
        err.response?.data?.message || err.message || "Something went wrong";
      toast.error(message);
    }
  };

  const handleEdit = (liftTypeObj) => {
    //console.log("Editing ID:", liftTypeObj);
    const numericId = Number(liftTypeObj.id); // ensure number
    const found = liftTypes.find((l) => l.id === numericId);
    if (!found) {
      toast.error("Lift Type not found");
      return;
    }
    setLiftType(found.liftTypeName);
    setEditId(numericId);
  };

  const handleCancel = () => {
    setLiftType("");
    setEditId(null);
  };

  const handleDelete = (id) => {
    const selected = liftTypes.find((d) => d.id === id);
    if (!selected) {
      toast.error("Invalid lift type selected for deletion");
      return;
    }

    confirmDeleteWithToast(selected.liftTypeName, async () => {
      try {
        await axiosInstance.delete(`${API_URL}/${id}`);

        toast.success("Lift Type deleted");

        if (editId === id) {
          setLiftType("");
          setEditId(null);
        }

        fetchLiftTypes();
      } catch (err) {
        console.error("Error deleting lift type:", err);
        const message =
          err.response?.data?.message ||
          err.message ||
          "Error deleting lift type";
        toast.error(message);
      }
    });
  };

  const filteredList = liftTypes.filter((lt) =>
    lt.liftTypeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 w-full p-6 min-h-screen">
      {/* Header */}
      <PageHeader
        title="Lift Types"
        description="Manage and categorize types of lifts."
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
            placeholder="Enter Lift Type"
            value={liftType || ""}
            onChange={(e) => setLiftType(e.target.value)}
          />
          <div className="col-span-auto gap-2 flex items-center">
            {editId ? (
              <FormButton variant="primary">Update</FormButton>
            ) : (
              <FormButton variant="primary">ADD</FormButton>
            )}

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
        title="Lift Type List"
        columns={[
          {
            key: "liftTypeName",
            label: "Lift Type",
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
