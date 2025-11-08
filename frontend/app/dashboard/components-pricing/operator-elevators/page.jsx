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
import { API_ENDPOINTS } from "@/utils/apiEndpoints";

export default function ElevatorOperation() {
  const [liftType, setLiftType] = useState("");
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [liftTypes, setLiftTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const sanitize = (value) => value.trim().toUpperCase();

  const fetchLiftTypes = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(API_ENDPOINTS.OPERATOR, {
        withCredentials: true,
      });
      setLiftTypes(res.data?.data || []);
    } catch (error) {
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
      (lt) => lt.name === name && lt.id !== editId
    );
    if (isDuplicate) {
      toast.error("Lift Type already exists");
      return;
    }

    try {
      const url = editId
        ? `${API_ENDPOINTS.OPERATOR}/${editId}`
        : `${API_ENDPOINTS.OPERATOR}`;

      const method = editId ? "put" : "post";

      const res = await axiosInstance[method](
        url,
        { name },
        {
          withCredentials: true,
        }
      );

      toast.success(`Lift Type ${editId ? "updated" : "created"}`);
      setLiftType("");
      fetchLiftTypes();
      setEditId(null);
    } catch (error) {
      console.error("Error saving Lift Type:", error);

      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (liftTypeObj) => {
    const numericId = Number(liftTypeObj.id); // ensure number
    const found = liftTypes.find((l) => l.id === numericId);
    if (!found) {
      toast.error("Lift Type not found");
      return;
    }
    setLiftType(found.name);
    setEditId(numericId);
  };

  const handleCancel = () => {
    setLiftType("");
    setEditId(null);
  };

  const handleDelete = (id) => {
    confirmDeleteWithToast("this lift type", async () => {
      try {
        const response = await axiosInstance.delete(`/api/operator-elevator/${id}`, {
        withCredentials: true,
        });

        toast.success("Lift Type deleted");

        if (editId === id) {
          setLiftType("");
          setEditId(null);
        }

        fetchLiftTypes();
      } catch (error) {
        if (error.response?.status === 409) {
          toast.error(
            error.response.data?.message || "Record is still referenced."
          );
        } else {
          console.error("Unexpected error:", error);
          toast.error("Error deleting lift type");
        }
      }
    });
  };

  const filteredList = liftTypes.filter((lt) =>
    lt.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 w-full p-6 min-h-screen">
      {/* Header */}
      <PageHeader
        title="Elevator Operation"
        description="Manage and categorize elevator operator."
        icon={SlidersHorizontal}
      />

      {/* Form Section */}
      <div>
        <ResponsiveForm
          onSubmit={handleSubmit}
          columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-5"
          className="mt-4"
        >
          <FormInput
            type="text"
            placeholder="Enter Elevator Operator Type"
            value={liftType}
            onChange={(e) => setLiftType(e.target.value)}
          />
          <div className="col-span-auto gap-2 flex items-center">
            {editId ? (
              <>
                <FormButton variant="primary">Update</FormButton>
                <FormButton
                  type="button"
                  variant="secondary"
                  onClick={handleCancel}
                >
                  Cancel
                </FormButton>
              </>
            ) : (
              <FormButton variant="primary">ADD</FormButton>
            )}
          </div>
        </ResponsiveForm>
      </div>

      <ReusableTable
        title="Elevator Operator List"
        columns={[
          {
            key: "name",
            label: "Elevator Operator",
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
        combineActions={false} // toggle this between true/false
        inlineEditing={false} // 🔥 Toggle here to enable/disable inline edit
        loading={loading}
      />
    </div>
  );
}
