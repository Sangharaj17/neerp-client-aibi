"use client";
import { useState, useEffect } from "react";
import { SlidersHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import ReusableTable from "@/components/UI/ReusableTable";
import PageHeader from "@/components/UI/PageHeader";
import { confirmDeleteWithToast } from "@/components/UI/toastUtils";
import ResponsiveForm from "@/components/UI/ResponsiveForm";
import { FormInput, FormButton } from "@/components/UI/FormElements";
import axiosInstance from "@/utils/axiosInstance";

export default function MachineRoomType() {
  const [machineRoomType, setMachineRoomType] = useState("");
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [machineRoomTypes, setMachineRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const sanitize = (value) => value.trim().toUpperCase();

  const API_MACHINE_ROOM = "/api/machine-rooms";

  const fetchMachineRoomTypes = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(API_MACHINE_ROOM);
      setMachineRoomTypes(res.data?.data || []);
    } catch (error) {
      console.error("Error loading machine room types:", error);
      toast.error(
        error.response?.data?.message || "Error loading machine room types"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMachineRoomTypes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = sanitize(machineRoomType);
    if (!name) {
      toast.error("Machine Room Type cannot be empty");
      return;
    }

    const isDuplicate = machineRoomTypes.some(
      (lt) => lt.machineRoomName === name && lt.id !== editId
    );
    if (isDuplicate) {
      toast.error("Machine Room Type already exists");
      return;
    }

    try {
      const method = editId ? "PUT" : "POST";
      const url = editId
        ? `${API_MACHINE_ROOM}/${editId}`
        : `${API_MACHINE_ROOM}`;

      const payload = { machineRoomName: name };

      const res = editId
        ? await axiosInstance.put(url, payload)
        : await axiosInstance.post(url, payload);

      toast.success(`Machine Room Type ${editId ? "updated" : "created"}`);
      setMachineRoomType("");
      fetchMachineRoomTypes();
    } catch (err) {
      console.error("Error saving machine room:", err);
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (machineRoomTypeObj) => {
    const numericId = Number(machineRoomTypeObj.id);
    const found = machineRoomTypes.find((l) => l.id === numericId);

    if (!found) {
      toast.error("Machine Room Type not found");
      return;
    }

    setMachineRoomType(found.machineRoomName);
    setEditId(numericId);
  };

  const handleCancel = () => {
    setMachineRoomType("");
    setEditId(null);
  };

  const handleDelete = (id) => {
    confirmDeleteWithToast("this lift type", async () => {
      try {
        await axiosInstance.delete(`${API_MACHINE_ROOM}/${id}`);

        toast.success("Machine Room Type deleted");

        if (editId === id) {
          setMachineRoomType("");
          setEditId(null);
        }

        fetchMachineRoomTypes();
      } catch (err) {
        console.error("Error deleting machine room:", err);
        toast.error(
          err.response?.data?.message || "Error deleting machine room"
        );
      }
    });
  };

  const filteredList = machineRoomTypes.filter((lt) =>
    lt.machineRoomName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 w-full p-6 min-h-screen">
      {/* Header */}
      <PageHeader
        title="Machine Room Type"
        description="Manage machine room type."
        icon={SlidersHorizontal}
      />

      {/* Form Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <ResponsiveForm
          onSubmit={handleSubmit}
          columns="grid-cols-1 sm:grid-cols-[auto_auto_auto]" // keeps buttons next to input on desktop
          gap="gap-4"
        >
          <FormInput
            type="text"
            placeholder="Enter Machine Room Type"
            value={machineRoomType}
            onChange={(e) => setMachineRoomType(e.target.value)}
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
        title="Machine Room Type List"
        columns={[
          {
            key: "machineRoomName",
            label: "Machine Room",
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
