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

export default function ControlPanelPage() {
  const API_URL = "/api/control-panel-types";
  // const API_OPERATOR_URL = API + "operator-elevator";
  // const API_machine_URL = API + "type-of-lift";

  const initialForm = {
    controlPanelType: "",
    operatorTypeId: "",
    machineTypeId: "",
    capacityTypeId: "",
    personCapacityId: "",
    weightId: "",
    price: "",
  };

  const [form, setForm] = useState(initialForm);
  const [controlPanelType, setControlPanelType] = useState("");
  const [controlPanelTypes, setControlPanelTypes] = useState([]);
  const [operatorTypes, setOperatorTypes] = useState([]);
  const [machineTypes, setMachineTypes] = useState([]);
  const [capacityTypes, setCapacityTypes] = useState([]);
  const [personCapacities, setPersonCapacities] = useState([]);
  const [weightCapacities, setWeightCapacities] = useState([]);
  const [editId, setEditId] = useState(null);
  const [typeSearch, setTypeSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const columns = [
    {
      key: "controlPanelType",
      label: "Control Panel Type",
      sortable: true,
      align: "text-left",
    },
    {
      key: "operatorTypeName",
      label: "Operator Type",
      sortable: true,
      align: "text-left",
    },
    {
      key: "machineTypeName",
      label: "Machine Type",
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
    {
      key: "price",
      label: "Price",
      sortable: true,
      align: "text-left",
    },
  ];

  //=============================================
  const fetchAll = async () => {
    const tenant = localStorage.getItem("tenant");
    try {
      const [capacityTypeRes, personRes, weightRes, machineRes, operatorRes] =
        await Promise.all([
          axiosInstance.get("/api/capacityTypes"),
          axiosInstance.get("/api/personCapacity"),
          axiosInstance.get("/api/weights"),
          axiosInstance.get("/api/type-of-lift"),
          axiosInstance.get("/api/operator-elevator"),
        ]);

      const capTypes = Array.isArray(capacityTypeRes.data?.data)
        ? capacityTypeRes.data.data
        : [];

      setCapacityTypes(capTypes);
      setPersonCapacities(
        Array.isArray(personRes.data?.data) ? personRes.data.data : []
      );
      setWeightCapacities(
        Array.isArray(weightRes.data?.data) ? weightRes.data.data : []
      );
      setMachineTypes(
        Array.isArray(machineRes.data?.data) ? machineRes.data.data : []
      );
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
          //machineType: "",
        }));
      }
    } catch (err) {
      console.error("Failed to fetch control panel data", err);
    } finally {
      setLoading(false);
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
      formKey: "personId",
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

  const fetchControlPanel = async () => {
    setLoading(null);
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(API_URL, {
        withCredentials: true,
      });

      const types = Array.isArray(data)
        ? data
        : data?.data || data?.controlPanelType || [];

      setControlPanelTypes(types);
    } catch (err) {
      console.error("Failed to fetch COntrol panel types", err);
      setControlPanelTypes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchControlPanel();
  }, []);

  const filtered = controlPanelTypes.filter((t) =>
    t?.controlPanelType?.toLowerCase().includes(typeSearch.toLowerCase())
  );

  const transformed = useMemo(() => {
    return filtered.map((item) => ({
      ...item,
      capacityType: item.capacityTypeName,
      capacityValue:
        item.capacityTypeName === "Person"
          ? item.personCapacityName || "N/A"
          : `${item.weightName || "N/A"}`,
      personCapacityId: item.personCapacityId,
      weightId: item.weightId,
    }));
  }, [filtered]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isNaN(form.controlPanelType)) {
      toast.error("Control Panel Type must be a string.");
      return;
    }

    const price = parseInt(form.price);
    if (isNaN(price) || price <= 0) {
      toast.error("Price must be a valid positive integer.");
      return;
    }

    if (
      !form.controlPanelType?.trim() ||
      !form.capacityTypeId ||
      !form.price ||
      !form.machineTypeId
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

    const selectedValueId = form[selectedCapacity.formKey];
    if (!selectedValueId || isNaN(selectedValueId)) {
      toast.error(
        `Please select a valid ${selectedCapacity.type.toLowerCase()} capacity.`
      );
      return;
    }

    const newItem = {
      id: editId || null,
      controlPanelType: form.controlPanelType.toUpperCase(),
      operatorTypeId: parseInt(form.operatorTypeId),
      machineTypeId: parseInt(form.machineTypeId),
      capacityTypeId: parseInt(form.capacityTypeId),
      [selectedCapacity.fieldKey]: parseInt(selectedValueId),
      price: price,
    };

    // Duplicate check
    const duplicate = controlPanelTypes.some(
      (s) => s.controlPanelType === newItem.controlPanelType && s.id !== editId
    );

    if (duplicate) {
      toast.error("Control Panel Type already exists.");
      return;
    }

    try {
      const url = editId ? `${API_URL}/${editId}` : API_URL;
      const method = editId ? "put" : "post";

      const { data: result } = await axiosInstance[method](url, newItem, {
        withCredentials: true, // ✅ equivalent of fetch credentials: "include"
      });

      toast.success(result.message || "Control Panel Type saved successfully");

      fetchControlPanel();

      // Reset form
      setEditId(null);
      setForm({
        controlPanelType: "",
        machineTypeId: "",
        operatorTypeId: "",
        capacityTypeId: capacityTypes.length > 0 ? capacityTypes[0].id : "",
        personCapacityId: "",
        weightId: "",
        price: "",
      });
    } catch (error) {
      console.error("Error saving ARD Device:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to save Control Panel Type."
      );
    }
  };

  const handleEdit = (item) => {
    const machineType = machineTypes.find(
      (mt) => mt.liftTypeName === item.machineTypeName
    );
    const operatorType = operatorTypes.find(
      (ot) => ot.name === item.operatorTypeName
    );
    const capacityType = capacityTypes.find(
      (ct) => ct.type === item.capacityTypeName
    );

    let selectedCapacityId = "";

    if (item.capacityTypeName === "Person") {
      const personCapacity = personCapacities.find(
        (pc) => pc.displayName === item.personCapacityName
      );
      selectedCapacityId = personCapacity?.id || "";
    } else if (item.capacityTypeName === "Weight") {
      const weightCapacity = weightCapacities.find(
        (wc) => wc.weightValue === item.weightName
      );
      selectedCapacityId = weightCapacity?.id || "";
    }

    // Get the form key dynamically from the capacityOptionsMap
    const capacityMeta = capacityOptionsMap[item.capacityTypeName];
    const dynamicFormKey = capacityMeta ? capacityMeta.formKey : "";

    // Set the form state using the found IDs and the dynamic key
    setForm({
      controlPanelType: item.controlPanelType,
      machineTypeId: machineType?.id || "",
      operatorTypeId: operatorType?.id || "",
      capacityTypeId: capacityType?.id || "",
      // Use the dynamic formKey and the selectedCapacityId
      [dynamicFormKey]: selectedCapacityId,
      price: item.price,
      // Reset the other capacity field to an empty string to avoid conflicts
      personCapacityId:
        dynamicFormKey === "personCapacityId" ? selectedCapacityId : "",
      weightId: dynamicFormKey === "weightId" ? selectedCapacityId : "",
    });

    setEditId(item.id);
  };

  const handleDelete = (id) => {
    const selected = controlPanelTypes.find((d) => d.id === id);
    if (!selected) {
      toast.error("Invalid Control Panel Type selected for deletion");
      return;
    }

    //setData(data.filter((item) => item.id !== id));
    //setEditId(null);

    confirmDeleteWithToast(selected.controlPanelType, async () => {
      try {
        await axiosInstance.delete(`${API_URL}/${id}`);

        toast.success(`${selected.controlPanelType} deleted successfully`);

        if (editId === id) {
          setControlPanelType("");
          setEditId(null);
        }

        fetchControlPanel();
      } catch (error) {
        console.error("Error deleting Control Panel Type:", error);
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Failed to delete Control Panel Type."
        );
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
        title="Control Panel Type Configuration"
        description="Manage control panel types based on person & weight capacity."
        icon={SlidersHorizontal}
      />

      {/* Form Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        {/* Cabin SubType Form */}
        <ResponsiveForm onSubmit={handleSubmit}>
          <FormInput
            type="text"
            placeholder="Enter Control Panel Type"
            value={form.controlPanelType}
            onChange={(e) =>
              setForm({ ...form, controlPanelType: e.target.value })
            }
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

          <FormSelect
            value={form.machineTypeId || ""}
            onChange={(e) =>
              setForm({ ...form, machineTypeId: e.target.value })
            }
            required
          >
            <option value="" disabled>
              Select Machine Type
            </option>
            {machineTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.liftTypeName}
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
        title="Control Panel List"
        columns={columns}
        data={transformed}
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
