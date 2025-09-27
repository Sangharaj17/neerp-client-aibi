"use client";
import { useState, useEffect } from "react";
import { SlidersHorizontal } from "lucide-react";
import { toast } from "react-hot-toast";
import ReusableTable from "@/components/UI/ReusableTable";
import PageHeader from "@/components/UI/PageHeader";
import { confirmDeleteWithToast } from "@/components/UI/toastUtils";
import ResponsiveForm from "@/components/UI/ResponsiveForm";
import {
  FormInput,
  FormButton,
  FormSelect,
} from "@/components/UI/FormElements";
import axiosInstance from "@/utils/axiosInstance";
import { API_ENDPOINTS } from "@/utils/apiEndpoints";

export default function GovernerSafetyRope() {
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [governorRopes, setGovernorRopes] = useState([]);
  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(true);

  const initials = {
    governorName: "",
    floor: "",
    quantity: "",
    price: "",
  };

  const [form, setForm] = useState(initials);

  const sanitize = (value) => value.trim().toUpperCase();

  // const API_URL = "/api/governor-ropes";
  // const API_FLOORS = "/api/floors";
  const API_URL = API_ENDPOINTS.GOVERNOR_ROPES;
  const API_FLOORS = API_ENDPOINTS.FLOORS;

  const columns = [
    {
      key: "governorName",
      label: "Governor Ropes",
      sortable: true,
      editable: false,
    },
    {
      key: "floorName",
      label: "Floor",
      sortable: true,
      editable: false,
    },
    {
      key: "quantity",
      label: "Quantity",
      sortable: true,
      editable: false,
    },
    {
      key: "price",
      label: "Price",
      sortable: true,
      editable: false,
    },
  ];

  const fetchGovernorRopes = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(API_URL);

      const formattedData = (res.data?.data || []).map((item) => ({
        ...item,
        quantity: `${item.quantity} mts`,
      }));

      setGovernorRopes(formattedData);
    } catch (error) {
      console.error("Error loading governorRopes types:", error);
      toast.error(
        error.response?.data?.message || "Error loading governorRopes types"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchFloors = async () => {
    try {
      const res = await axiosInstance.get(API_FLOORS);
      setFloors(res.data?.data || []);
    } catch (error) {
      console.error("Error loading floors:", error);
      toast.error(error.response?.data?.message || "Error loading floors");
    }
  };

  useEffect(() => {
    fetchGovernorRopes();
    fetchFloors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = sanitize(form.governorName);
    if (!name) {
      toast.error("Governor Ropes Type cannot be empty");
      return;
    }

    const floorIdNum = Number(form.floor);
    const floorObj = floors.find((f) => f.id === floorIdNum);
    const floorNameForCheck = floorObj ? floorObj.floorName : "";

    console.log(
      "floorIdNum:",
      floorIdNum,
      "floorNameForCheck:",
      floorNameForCheck
    );

    console.log(
      form,
      "//////////",
      floors,
      "========",
      floorNameForCheck,
      "---------",
      governorRopes
    );

    const isDuplicate = governorRopes.some(
      (lt) =>
        lt.governorName.trim().toUpperCase() === name.trim().toUpperCase() &&
        lt.id !== editId &&
        lt.floorName.trim().toUpperCase() ===
          floorNameForCheck.trim().toUpperCase()
    );

    if (isDuplicate) {
      toast.error("Governor Ropes Type already exists for this floor.");
      return;
    }

    try {
      const method = editId ? "put" : "post";
      const url = editId ? `${API_URL}/${editId}` : API_URL;

      const res = await axiosInstance({
        method,
        url,
        data: {
          governorName: name,
          floorId: form.floor,
          quantity: form.quantity,
          price: form.price,
        },
      });

      toast.success(`Governor Ropes Type ${editId ? "updated" : "created"}`);
      setForm(initials);
      setEditId("");
      fetchGovernorRopes();
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Error saving Governor Ropes Type"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (governorRopeObj) => {
    const numericId = Number(governorRopeObj.id);
    const found = governorRopes.find((l) => l.id === numericId);

    // Corrected: find the floor object and get its id
    const floorObj = floors.find(
      (ct) => ct.floorName === governorRopeObj.floorName
    );

    if (!found) {
      toast.error("Governor Ropes Type not found");
      return;
    }

    const quantityWithoutUnit = String(found.quantity).replace(
      /\s*mts\s*/i,
      ""
    );

    setForm({
      governorName: found.governorName,
      // floor: floorId,
      floor: floorObj?.id || "",
      quantity: quantityWithoutUnit,
      price: found.price,
    });

    setEditId(numericId);
  };

  const handleCancel = () => {
    setForm(initials);
    setEditId(null);
  };

  const handleDelete = (id) => {
    if (!id || isNaN(id)) {
      toast.error("Invalid ID for deletion.");
      return;
    }
    const selected = governorRopes.find((d) => d.id === id);
    if (!selected) {
      toast.error("Governor Ropes not found.");
      return;
    }
    confirmDeleteWithToast(selected.governorName, async () => {
      try {
        const res = await axiosInstance.delete(`${API_URL}/${id}`);

        toast.success("Governor Ropes deleted");

        if (editId === id) {
          setForm(initials);
          setEditId(null);
        }

        fetchGovernorRopes();
      } catch (err) {
        console.error(err);
        toast.error(
          err.response?.data?.message ||
            err.message ||
            "Error deleting Governor Ropes"
        );
      }
    });
  };

  // 2. Updated filteredList function
  const filteredList = governorRopes.filter((lt) =>
    lt.governorName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 w-full p-6 min-h-screen">
      {/* Header */}
      <PageHeader
        title="Governer Saftey Ropes"
        description="Manage Governer Saftey Ropes."
        icon={SlidersHorizontal}
      />

      {/* Form Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <ResponsiveForm
          onSubmit={handleSubmit}
          columns="grid-cols-1 sm:grid-cols-[auto_auto_auto]"
          gap="gap-4"
        >
          <FormInput
            type="text"
            placeholder="Enter Governor Ropes"
            value={form.governorName}
            onChange={(e) => setForm({ ...form, governorName: e.target.value })}
          />

          <FormSelect
            value={form.floor || ""}
            onChange={(e) => setForm({ ...form, floor: e.target.value })}
            required
          >
            <option value="" disabled>
              Select Floor
            </option>
            {floors.map((type) => (
              <option key={type.id} value={type.id}>
                {type.floorName}
              </option>
            ))}
          </FormSelect>
          <FormInput
            type="number"
            placeholder="Enter Quantity"
            value={form.quantity || ""}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            required
          />
          <FormInput
            type="number"
            placeholder="Enter Price"
            value={form.price || ""}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />

          <div className="col-span-auto gap-2 flex items-center">
            <FormButton variant="primary">
              {editId ? "Update" : "ADD"}
            </FormButton>

            {/* {editId && ( */}
              <FormButton
                type="button"
                variant="secondary"
                onClick={handleCancel}
              >
                Cancel
              </FormButton>
            {/* )} */}
          </div>
        </ResponsiveForm>
      </div>

      <ReusableTable
        title="Governer Saftey Ropes List"
        columns={columns}
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
