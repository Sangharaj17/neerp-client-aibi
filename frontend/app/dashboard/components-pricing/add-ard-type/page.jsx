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

export default function ArdTypePage() {
  //const API_URL = "/api/ardDevice";
  const API_URL = API_ENDPOINTS.ARD_DEVICE;

  const initialForm = {
    ardDevice: "",
    operatorTypeId: "",
    capacityTypeId: "",
    personCapacityId: "", // ID of selected person capacity
    weightId: "",
    price: "",
  };

  const [form, setForm] = useState(initialForm);
  const [ardDevices, setArdDevices] = useState([]);
  const [ardDevice, setArdDevice] = useState("");
  const [operatorTypes, setOperatorTypes] = useState([]);
  const [capacityTypes, setCapacityTypes] = useState([]);
  const [personCapacities, setPersonCapacities] = useState([]);
  const [weightCapacities, setWeightCapacities] = useState([]);
  const [editId, setEditId] = useState(null);
  const [typeSearch, setTypeSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const columnsArdDevice = [
    {
      key: "ardDevice",
      label: "ARD Device",
      sortable: true,
      align: "text-left",
    },
    {
      key: "operatorElevatorName",
      label: "Operator Type",
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
    { key: "price", label: "Price", sortable: true, align: "text-left" },
  ];

  //=============================================
  const fetchAll = async () => {
    const tenant = localStorage.getItem("tenant");

    try {
      const [capacityTypeRes, personRes, weightRes, operatorRes] =
        await Promise.all([
          // axiosInstance.get("/api/capacityTypes"),
          // axiosInstance.get("/api/personCapacity"),
          // axiosInstance.get("/api/weights"),
          axiosInstance.get(API_ENDPOINTS.CAPACITY_TYPES),
          axiosInstance.get(API_ENDPOINTS.PERSON_CAPACITY),
          axiosInstance.get(API_ENDPOINTS.WEIGHTS),
          axiosInstance.get(`${API_ENDPOINTS.OPERATOR}`),
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
      setOperatorTypes(
        Array.isArray(operatorRes.data?.data) ? operatorRes.data.data : []
      );

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
    },
    Weight: {
      data: weightCapacities,
      label: "Select Weight",
      valueKey: "weightValue",
      formKey: "weightId",
    },
  };

  const selectedType = capacityTypes.find(
    (ct) => ct.id === form.capacityTypeId
  );

  const capacityMeta = selectedType
    ? capacityOptionsMap[selectedType.type]
    : null;

  //==================================

  const fetchArdDevices = async () => {
    setLoading(null);
    try {
      setLoading(true);
      const res = await axiosInstance.get(API_URL, {
        headers: {
          "X-Tenant": localStorage.getItem("tenant"),
        },
        withCredentials: true,
      });

      const data = res.data;
      const types = Array.isArray(data)
        ? data
        : data?.data || data?.ardDevice || [];
      setArdDevices(types);
    } catch (err) {
      console.error("Failed to fetch Ard Devices", err);
      setArdDevices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArdDevices();
  }, []);

  const filteredArdDevices = ardDevices.filter((t) =>
    t?.ardDevice?.toLowerCase().includes(typeSearch.toLowerCase())
  );

  const transformedArdDevice = useMemo(() => {
    return filteredArdDevices.map((item) => ({
      ...item,
      ardDevice: item.ardDevice,
      capacityType: item.capacityTypeName,
      operatorTypeId: item.operatorElevatorId,
      capacityValue:
        item.capacityTypeName === "Person"
          ? item.personCapacityName || "N/A"
          : `${item.weightName || "N/A"}`,
    }));
  }, [filteredArdDevices]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isNaN(form.ardDevice)) {
      toast.error("ARD Device must be a string.");
      return;
    }

    const price = parseInt(form.price);
    if (isNaN(price) || price <= 0) {
      toast.error("Price must be a valid positive integer.");
      return;
    }

    if (
      !form.ardDevice?.trim() ||
      !form.capacityTypeId ||
      !form.price ||
      !form.operatorTypeId
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

    // Determine the correct key based on the selected capacity type
    const capacityMeta = capacityOptionsMap[selectedCapacity.type];

    // Get the selected value from the form state using the correct key
    const selectedValueId = form[capacityMeta.formKey];

    if (!selectedValueId || isNaN(selectedValueId)) {
      toast.error(
        `Please select a valid ${selectedCapacity.type.toLowerCase()} capacity.`
      );
      return;
    }

    const newItem = {
      id: editId || null,
      ardDevice: form.ardDevice.toUpperCase(),
      operatorElevatorId: parseInt(form.operatorTypeId),
      capacityTypeId: parseInt(form.capacityTypeId),
      [selectedCapacity.fieldKey]: parseInt(selectedValueId),
      price: price,
    };

    // Duplicate check
    // Rule 1: Device name must be unique
    console.log(newItem.ardDevice+"===////===="+ardDevices);
    const nameDuplicate = ardDevices.some(
      (s) => s.ardDevice === newItem.ardDevice && s.id !== editId
    );

    // Rule 2: Operator + CapacityType + CapacityValue must be unique
    const combinationDuplicate = ardDevices.some((s) => {
      const existingCapacityValueId = s.personCapacityId || s.weightId; // depends on type
      return (
        s.operatorElevatorId === newItem.operatorElevatorId &&
        s.capacityTypeId === newItem.capacityTypeId &&
        existingCapacityValueId === newItem[selectedCapacity.fieldKey] &&
        s.id !== editId
      );
    });

    if (nameDuplicate) {
      toast.error("ARD Device name already exists.");
      return;
    }

    if (combinationDuplicate) {
      toast.error("This Operator + Capacity combination already exists.");
      return;
    }

    try {
      const url = editId ? `${API_URL}/${editId}` : API_URL;
      const method = editId ? "put" : "post";

      const response = await axiosInstance[method](url, newItem, {
        headers: {
          "X-Tenant": localStorage.getItem("tenant"),
        },
        withCredentials: true,
      });

      const result = response.data;

      toast.success(result.message || "ARD Device saved successfully");

      fetchArdDevices();

      // Reset form
      setEditId(null);
      setForm({
        ardDevice: "",
        operatorTypeId: "",
        capacityTypeId: capacityTypes.length > 0 ? capacityTypes[0].id : "",
        personCapacityId: "",
        weightId: "",
        price: "",
      });
    } catch (error) {
      console.error("Error saving ARD Device:", error);
      toast.error(error.message || "Failed to save ARD Device.");
    }
  };

  const handleEdit = (item) => {
    const isPerson = item.capacityType === "Person";
    console.log("------>>>,", item);
    setForm({
      ardDevice: item.ardDevice,
      operatorTypeId: item.operatorElevatorId,
      capacityTypeId: item.capacityTypeId,
      personCapacityId: isPerson ? item.personCapacityId : "",
      weightId: !isPerson ? item.weightId : "",
      price: item.price,
    });
    setEditId(item.id);
  };

  const handleDelete = (id) => {
    const selected = ardDevices.find((d) => d.id === id);
    if (!selected) {
      toast.error("Invalid Ard Device selected for deletion");
      return;
    }

    //setData(data.filter((item) => item.id !== id));
    //setEditId(null);

    confirmDeleteWithToast(selected.ardDevice, async () => {
      try {
        await axiosInstance.delete(`${API_URL}/${id}`, {
          headers: {
            "X-Tenant": localStorage.getItem("tenant"),
          },
          withCredentials: true,
        });

        toast.success(`${selected.ardDevice} deleted successfully`);

        if (editId === id) {
          setArdDevice("");
          setEditId(null);
        }

        fetchArdDevices();
      } catch (error) {
        console.error("Failed to delete ARD Device:", error);
        const errorMessage = error.response?.data?.message || "Delete failed";
        toast.error(errorMessage);
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
        title="Add ARD Type"
        description="Add automatic rescue device types by passenger capacity and price."
        icon={SlidersHorizontal}
      />

      {/* Form Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        {/* Cabin SubType Form */}
        <ResponsiveForm onSubmit={handleSubmit}>
          <FormInput
            type="text"
            placeholder="Enter ARD Type"
            value={form.ardDevice}
            onChange={(e) => setForm({ ...form, ardDevice: e.target.value })}
            required
          />

          <FormSelect
            value={form.operatorTypeId || ""}
            onChange={(e) =>
              setForm({ ...form, operatorTypeId: e.target.value })
            }
            required
          >
            <option value="" disabled>
              Select Operator Type
            </option>
            {operatorTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </FormSelect>

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
                    ardDevice: "",
                    capacityTypeId:
                      capacityTypes.length > 0 ? capacityTypes[0].id : "",
                    personCapacityId: "",
                    weightId: "",
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
        title="ARD Device List"
        columns={columnsArdDevice}
        data={transformedArdDevice}
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
