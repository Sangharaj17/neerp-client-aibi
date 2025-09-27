"use client";
import React, { useState, useEffect, useMemo } from "react";
import { SlidersHorizontal } from "lucide-react";
import { toast } from "react-hot-toast";
import ReusableTable from "@/components/UI/ReusableTable";
import PageHeader from "@/components/UI/PageHeader";
import ResponsiveForm from "@/components/UI/ResponsiveForm";
import { confirmDeleteWithToast } from "@/components/UI/toastUtils";
import {
  FormInput,
  FormButton,
  FormSelect,
} from "@/components/UI/FormElements";
import axiosInstance from "@/utils/axiosInstance";
import { API_ENDPOINTS } from "@/utils/apiEndpoints";

export default function LightFittingsPage() {
  //const API_URL = "/api/light-fittings";
  ` `;
  const API_URL = API_ENDPOINTS.LIGHT_FITTINGS;

  const initialForm = {
    lightFitting: "",
    price: "",
  };

  const [form, setForm] = useState(initialForm);
  const [lightFitting, setLightFitting] = useState([]);
  const [editId, setEditId] = useState(null);
  const [typeSearch, setTypeSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const columns = [
    {
      key: "name",
      label: "Light Fitting",
      sortable: true,
      align: "text-left",
    },
    { key: "price", label: "Price", sortable: true, align: "text-left" },
  ];


  const fetchLightFittings = async () => {
    setLoading(null);
    try {
      setLoading(true);

      const res = await axiosInstance.get(API_URL);

      const data = res.data;
      const types = Array.isArray(data)
        ? data
        : data?.data || data?.name || [];

        setLightFitting(types);
    } catch (err) {
      console.error("Failed to fetch light fitting", err);
      setLightFitting([]);
      toast.error("Error fetching light fitting");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLightFittings();
  }, []);

  const filtereddate = lightFitting.filter((t) =>
    t?.name?.toLowerCase().includes(typeSearch.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isNaN(form.lightFitting)) {
      toast.error("Light Fitting Name must be a string.");
      return;
    }

    const price = parseInt(form.price);
    if (isNaN(price) || price <= 0) {
      toast.error("Price must be a valid positive integer.");
      return;
    }

    if (
      !form.lightFitting?.trim() ||
      !form.price 
    ) {
      toast.error("All fields are required.");
      return;
    }

    const newItem = {
      id: editId || null,
      name: form.lightFitting.toUpperCase(),
      price: price,
    };

    // Duplicate check
    const duplicate = lightFitting.some(
      (s) =>
        s.name === newItem.lightFitting &&
        s.id !== editId
    );

    if (duplicate) {
      toast.error("Light fitting Name already exists.");
      return;
    }

    try {
      const url = editId ? `${API_URL}/${editId}` : `${API_URL}`; // relative URL
      const method = editId ? "put" : "post";

      const response = await axiosInstance[method](url, newItem); // axios auto stringifies body

      const result = response.data;

      toast.success(result.message || "Counter Weight Name saved successfully");

      fetchLightFittings();

      // ✅ Reset form
      setEditId(null);
      setForm(initialForm);
    } catch (error) {
      console.error("Error saving Light Fitting:", error);
      toast.error(
        error.response?.data?.message || "Failed to save Light Fitting."
      );
    }
  };

  const handleEdit = (item) => {
    setForm({
      lightFitting: item.name,
      price: item.price,
    });
    setEditId(item.id);
  };

  const handleDelete = (id) => {
    const selected = lightFitting.find((d) => d.id === id);
    if (!selected) {
      toast.error("Invalid Light fitting selected for deletion");
      return;
    }

    confirmDeleteWithToast(selected.name, async () => {
      try {
        await axiosInstance.delete(`${API_URL}/${id}`);

        toast.success(`${selected.name} deleted successfully`);

        if (editId === id) {
          setLightFitting("");
          setEditId(null);
        }

        fetchLightFittings();
      } catch (error) {
        console.error("Delete failed:", error);
        toast.error(error.response?.data?.message || "Delete failed");
      }
    });
  };

  return (
    <div className="space-y-8 w-full p-6 min-h-screen">
      {/* Header */}
      <PageHeader
        title="Light Fittings"
        description="Add and manage Light Fittings and pricing entries."
        icon={SlidersHorizontal}
      />

      {/* Form Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        {/* Cabin SubType Form */}
        <ResponsiveForm onSubmit={handleSubmit}>
          <FormInput
            type="text"
            placeholder="Light Fitting"
            value={form.lightFitting}
            onChange={(e) =>
              setForm({ ...form, lightFitting: e.target.value })
            }
            required
          />

          {/* Price */}
          <FormInput
            type="number"
            placeholder="Enter Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />

          <div className="col-span-auto gap-2 flex items-center">
            {/* Submit Button */}
            <FormButton variant="primary">
              {editId ? "Update" : "Add"}
            </FormButton>

            {/* Cancel Button */}
            {editId && (
              <FormButton
                type="button"
                variant="secondary"
                onClick={() => {
                  setEditId(null);
                  setForm({
                    newCounterWeightName: "",
                    capacityTypeId:
                      capacityTypes.length > 0 ? capacityTypes[0].id : "",
                    personCapacityId: "",
                    weightId: "",
                    quantity: "",
                    price: "",
                  });
                }}
              >
                Cancel
              </FormButton>
            )}
          </div>
        </ResponsiveForm>
      </div>

      {/* Table Section */}
      <ReusableTable
        title="Light Fitting List"
        columns={columns}
        data={filtereddate}
        onEdit={(item) => handleEdit(item)}
        onDelete={(id) => handleDelete(id)}
        searchTerm={typeSearch}
        onSearchChange={setTypeSearch}
        height="250px"
        pageSize={10}
        combineActions={false}
        loading={loading}
      />
    </div>
  );
}
