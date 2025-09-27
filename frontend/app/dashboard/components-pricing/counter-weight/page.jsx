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

export default function CounterWeightPage() {
  //const API_URL = "/api/new-counter-weights";
  ` `;
  const API_URL = API_ENDPOINTS.NEW_COUNTER_WEIGHTS;
  const initialForm = {
    newCounterWeightName: "",
    capacityTypeId: "",
    personCapacityId: "", // ID of selected person capacity
    weightId: "",
    quantity: "",
    price: "",
  };

  const [form, setForm] = useState(initialForm);
  const [counterWeights, setCounterWeights] = useState([]);
  const [capacityTypes, setCapacityTypes] = useState([]);
  const [personCapacities, setPersonCapacities] = useState([]);
  const [weightCapacities, setWeightCapacities] = useState([]);
  const [editId, setEditId] = useState(null);
  const [typeSearch, setTypeSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const columnscounterWeight = [
    {
      key: "newCounterWeightName",
      label: "Counter Weight Name",
      sortable: true,
      align: "text-left",
    },
    {
      key: "capacityTypeName",
      label: "Capacity Type",
      sortable: true,
      align: "text-left",
    },
    {
      key: "capacityValue",
      label: "Capacity Value",
      sortable: true,
      align: "text-left",
    },
    { key: "quantity", label: "Quantity", sortable: true, align: "text-left" },
    { key: "price", label: "Price", sortable: true, align: "text-left" },
  ];

  //=============================================
  const fetchAll = async () => {
    const tenant = localStorage.getItem("tenant");
    try {
      const [capacityTypeRes, personRes, weightRes] = await Promise.all([
        // axiosInstance.get("/api/capacityTypes"),
        // axiosInstance.get("/api/personCapacity"),
        // axiosInstance.get("/api/weights"),
        
        axiosInstance.get(API_ENDPOINTS.CAPACITY_TYPES),
        axiosInstance.get(API_ENDPOINTS.PERSON_CAPACITY),
        axiosInstance.get(API_ENDPOINTS.WEIGHTS),
      ]);

      const capTypesData = capacityTypeRes.data;
      const persons = personRes.data;
      const weights = weightRes.data;

      const capTypes = Array.isArray(capTypesData?.data)
        ? capTypesData.data
        : [];

      setCapacityTypes(capTypes);
      setPersonCapacities(Array.isArray(persons?.data) ? persons.data : []);
      setWeightCapacities(Array.isArray(weights?.data) ? weights.data : []);

      // ✅ Set default capacity type to first value (if exists)
      if (capTypes.length > 0) {
        setForm((prevForm) => ({
          ...prevForm,
          capacityTypeId: capTypes[0].id,
          personCapacityId: "",
          weightId: "",
        }));
      }
    } catch (err) {
      console.error("Failed to fetch capacity data", err);
      toast.error("Error loading capacity data");
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const capacityOptionsMap = {
    Person: {
      data: personCapacities,
      label: "Select Persons",
      valueKey: "displayName",
      formKey: "personCapacityId",
      fieldKey: "personCapacityId",
    },
    Weight: {
      data: weightCapacities,
      label: "Select Weight",
      valueKey: "weightValue",
      formKey: "weightId",
      fieldKey: "weightId",
    },
  };

  const selectedType = capacityTypes.find(
    (ct) => ct.id === form.capacityTypeId
  );

  const capacityMeta = selectedType
    ? capacityOptionsMap[selectedType.type]
    : null;

  //==================================

  const fetchCounterWeights = async () => {
    setLoading(null);
    try {
      setLoading(true);

      const res = await axiosInstance.get(API_URL);

      const data = res.data;
      const types = Array.isArray(data)
        ? data
        : data?.data || data?.counterWeight || [];

      setCounterWeights(types);
    } catch (err) {
      console.error("Failed to fetch Counter Weights", err);
      setCounterWeights([]);
      toast.error("Error fetching Counter Weights");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounterWeights();
  }, []);

  const filteredcounterWeights = counterWeights.filter((t) =>
    t?.newCounterWeightName?.toLowerCase().includes(typeSearch.toLowerCase())
  );

  const transformedcounterWeight = useMemo(() => {
    return filteredcounterWeights.map((item) => ({
      ...item,
      counterWeight: item.newCounterWeightName,
      capacityType: item.capacityTypeName,
      capacityValue:
        item.capacityTypeName === "Person"
          ? item.personCapacityName || "N/A"
          : `${item.weightName || "N/A"}`,
      personCapacityId: item.personCapacityId || null,
      weightId: item.weightId || null,
    }));
  }, [filteredcounterWeights]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isNaN(form.newCounterWeightName)) {
      toast.error("Counter Weight Name must be a string.");
      return;
    }

    const price = parseInt(form.price);
    if (isNaN(price) || price <= 0) {
      toast.error("Price must be a valid positive integer.");
      return;
    }

    if (
      !form.newCounterWeightName?.trim() ||
      !form.capacityTypeId ||
      !form.price ||
      !form.quantity
    ) {
      toast.error("All fields are required.");
      return;
    }

    // Find selected capacity type
    const selectedCapacity = capacityTypes.find(
      (ct) => ct.id === form.capacityTypeId
    );

    if (!selectedCapacity) {
      toast.error("Invalid Capacity Type selected.");
      return;
    }

    // ✅ Get the correct formKey from the capacityOptionsMap
    const capacityMeta = capacityOptionsMap[selectedCapacity.type];

    // ✅ Use the correct formKey to get the value from the form state
    const selectedValueId = form[capacityMeta.formKey];
    if (!selectedValueId || isNaN(selectedValueId)) {
      toast.error(
        `Please select a valid ${selectedCapacity.type.toLowerCase()} capacity.`
      );
      return;
    }

    const newItem = {
      id: editId || null,
      newCounterWeightName: form.newCounterWeightName.toUpperCase(),
      capacityTypeId: parseInt(form.capacityTypeId),
      [capacityMeta.fieldKey]: parseInt(selectedValueId),
      quantity: form.quantity,
      price: price,
    };

    // Duplicate check
    const duplicate = counterWeights.some(
      (s) =>
        s.newCounterWeightName === newItem.newCounterWeightName &&
        s.id !== editId
    );

    if (duplicate) {
      toast.error("Counter Weight Name already exists.");
      return;
    }

    try {
      const url = editId ? `${API_URL}/${editId}` : `${API_URL}`; // relative URL
      const method = editId ? "put" : "post";

      const response = await axiosInstance[method](url, newItem); // axios auto stringifies body

      const result = response.data;

      toast.success(result.message || "Counter Weight Name saved successfully");

      fetchCounterWeights();

      // ✅ Reset form
      setEditId(null);
      setForm({
        newCounterWeightName: "",
        capacityTypeId: capacityTypes.length > 0 ? capacityTypes[0].id : "",
        personCapacityId: "",
        weightId: "",
        quantity: "",
        price: "",
      });
    } catch (error) {
      console.error("Error saving Counter Weight:", error);
      toast.error(
        error.response?.data?.message || "Failed to save Counter Weight."
      );
    }
  };

  const handleEdit = (item) => {
    const selectedCapacityType = capacityTypes.find(
      (ct) => ct.id === item.capacityTypeId
    );
    const isPerson = selectedCapacityType?.type === "Person";
    setForm({
      newCounterWeightName: item.newCounterWeightName,
      capacityTypeId: item.capacityTypeId,
      personCapacityId: isPerson ? item.personCapacityId : "",
      weightId: !isPerson ? item.weightId : "",
      quantity: item.quantity,
      price: item.price,
    });
    setEditId(item.id);
  };

  const handleDelete = (id) => {
    const selected = counterWeights.find((d) => d.id === id);
    if (!selected) {
      toast.error("Invalid Counter Weight selected for deletion");
      return;
    }

    //setData(data.filter((item) => item.id !== id));
    //setEditId(null);

    confirmDeleteWithToast(selected.newCounterWeightName, async () => {
      try {
        await axiosInstance.delete(`${API_URL}/${id}`);

        toast.success(`${selected.newCounterWeightName} deleted successfully`);

        if (editId === id) {
          setCounterWeights("");
          setEditId(null);
        }

        fetchCounterWeights();
      } catch (error) {
        console.error("Delete failed:", error);
        toast.error(error.response?.data?.message || "Delete failed");
      }
    });
  };

  const handleCapacityTypeChange = (e) => {
    const selectedId = parseInt(e.target.value);
    setForm((prevForm) => ({
      ...prevForm,
      capacityTypeId: selectedId,
      personCapacityId: "",
      weightId: "",
    }));
  };

  return (
    <div className="space-y-8 w-full p-6 min-h-screen">
      {/* Header */}
      <PageHeader
        title="Counter Weight"
        description="Add and manage elevator counter weight entries."
        icon={SlidersHorizontal}
      />

      {/* Form Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        {/* Cabin SubType Form */}
        <ResponsiveForm onSubmit={handleSubmit}>
          <FormInput
            type="text"
            placeholder="Counter Weight Name"
            value={form.newCounterWeightName}
            onChange={(e) =>
              setForm({ ...form, newCounterWeightName: e.target.value })
            }
            required
          />

          {/* Capacity Type */}
          <FormSelect
            value={form.capacityTypeId}
            onChange={handleCapacityTypeChange}
            required
          >
            <option value="" disabled>
              Select Capacity Type
            </option>
            {capacityTypes.map((ct) => (
              <option key={ct.id} value={ct.id}>
                {ct.type}
              </option>
            ))}
          </FormSelect>

          {/* Conditional Capacity Meta Select */}
          {capacityMeta && (
            <FormSelect
              value={form[capacityMeta.formKey] || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  [capacityMeta.formKey]: e.target.value,
                })
              }
              required
            >
              <option value="" disabled>
                {capacityMeta.label}
              </option>
              {capacityMeta.data.map((item) => (
                <option key={item.id} value={item.id}>
                  {item[capacityMeta.valueKey]}
                </option>
              ))}
            </FormSelect>
          )}

          {/* Quantity */}
          <FormInput
            type="number"
            placeholder="Enter Quantity"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
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
        title="Counter Weight List"
        columns={columnscounterWeight}
        data={transformedcounterWeight}
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
