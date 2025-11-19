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

export default function CounterFrameType() {
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [counterFrameTypes, setCounterFrameTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [wireRopes, setWireRopes] = useState([]);
  const [operators, setOperators] = useState([]);
  const [capacityTypes, setCapacityTypes] = useState([]);
  const [personCapacities, setPersonCapacities] = useState([]);
  const [weightCapacities, setWeightCapacities] = useState([]);

  const API_URL = API_ENDPOINTS.COUNTER_FRAME_TYPES;

  const columnsArdDevice = [
    {
      key: "counterFrameTypeName",
      label: "Counter Frame Type",
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

  const initialForm = {
    counterFrameTypeId: "",
    operatorTypeId: "",
    capacityTypeId: 1, // default = Person
    personCapacityId: "", // ID of selected person capacity
    weightId: "",
    counterFrameName: "",
    price: "",
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchDropdowns = async () => {
    try {
      const [wrRes, opRes, ctRes, pcRes, wRes] = await Promise.all([
        axiosInstance.get(API_ENDPOINTS.WIRE_ROPE_TYPES),
        axiosInstance.get(API_ENDPOINTS.OPERATOR),
        axiosInstance.get(API_ENDPOINTS.CAPACITY_TYPES),
        axiosInstance.get(API_ENDPOINTS.PERSON_CAPACITY),
        axiosInstance.get(API_ENDPOINTS.WEIGHTS),
      ]);

      setWireRopes(wrRes.data?.data || []);
      setOperators(opRes.data?.data || []);

      const capTypesData = ctRes.data;
      const persons = pcRes.data;
      const weights = wRes.data;

      const capTypes = Array.isArray(capTypesData?.data)
        ? capTypesData.data
        : [];

      setCapacityTypes(capTypes);
      setPersonCapacities(Array.isArray(persons?.data) ? persons.data : []);
      setWeightCapacities(Array.isArray(weights?.data) ? weights.data : []);

      if (capTypes.length > 0) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          capacityTypeId: capTypes[0].id,
          personCapacityId: "",
          weightId: "",
        }));
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching dropdown data");
    }
  };

  useEffect(() => {
    fetchDropdowns();
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
      valueKey: "weightFull",
      formKey: "weightId",
    },
  };

  const selectedType = capacityTypes.find(
    (ct) => ct.id === formData.capacityTypeId
  );

  const capacityMeta = selectedType
    ? capacityOptionsMap[selectedType.type]
    : null;

  const sanitize = (value) => value.trim().toUpperCase();

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

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      counterFrameTypeId: Number(formData.counterFrameTypeId),
      operatorTypeId: Number(formData.operatorTypeId),
      capacityTypeId: Number(formData.capacityTypeId),
      price: Number(formData.price),
    };

    if (formData.capacityTypeId === 1) {
      payload.personCapacityId = Number(formData.personCapacityId);
    } else {
      payload.weightId = Number(formData.weightId);
    }

    // Unique validation before saving
    const exists = counterFrameTypes.some((item) => {
      return (
        item.counterFrameTypeId === payload.counterFrameTypeId &&
        item.operatorTypeId === payload.operatorTypeId &&
        item.capacityTypeId === payload.capacityTypeId &&
        (payload.personCapacityId
          ? item.personCapacityId === payload.personCapacityId
          : item.weightId === payload.weightId) &&
        item.id !== editId
      );
    });

    if (exists) {
      toast.error("Duplicate entry exists for same combination");
      return;
    }

    try {
      if (editId) {
        await axiosInstance.put(`${API_URL}/${editId}`, payload);
        toast.success("Counter Frame updated");
      } else {
        await axiosInstance.post(API_URL, payload);
        toast.success("Counter Frame created");
      }
      setFormData(initialForm);
      setEditId(null);
      fetchCounterFrameTypes();
    } catch (err) {
      console.error("Error saving Counter Frame Type:", err);
      toast.error(err.response?.data?.message || "Error saving Counter Frame");
    }
  };

  const handleEdit = (row) => {
    setFormData({
      counterFrameTypeId: row.counterFrameTypeId,
      operatorTypeId: row.operatorTypeId,
      capacityTypeId: row.capacityTypeId,
      personCapacityId: row.personCapacityId || "",
      weightId: row.weightId || "",
      price: row.price,
    });
    setEditId(row.id);
  };

  // const handleEdit = (counterFrameTypeObj) => {
  //   const numericId = Number(counterFrameTypeObj.id); // ensure number
  //   const found = counterFrameTypes.find((l) => l.id === numericId);
  //   if (!found) {
  //     toast.error("Counter Frame Type not found");
  //     return;
  //   }
  //   setCounterFrameType(found.frameTypeName);
  //   setEditId(numericId);
  // };

  const handleCancel = () => {
    setFormData(initialForm);
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
 
  const filteredList = counterFrameTypes.filter((item) => {
    const term = searchTerm.toLowerCase();

    return (
      item.counterFrameTypeName?.toLowerCase().includes(term) ||
      item.operatorTypeName?.toLowerCase().includes(term) ||
      item.capacityTypeName?.toLowerCase().includes(term) ||
      item.personCapacityName?.toLowerCase().includes(term) ||
      item.weightName?.toLowerCase().includes(term) ||
      String(item.price)?.toLowerCase().includes(term)
    );
  });

  const handleCapacityTypeChange = (e) => {
    const selectedId = parseInt(e.target.value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      capacityTypeId: selectedId,
      personCapacityId: "",
      weightId: "",
    }));
  };

  useEffect(() => {
    console.log("Current formData:", formData);
  }, [formData]);

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
          <FormSelect
            value={formData.counterFrameTypeId || ""}
            onChange={(e) =>
              setFormData({ ...formData, counterFrameTypeId: e.target.value })
            }
            required
          >
            <option value="" disabled>
              Select Counter Frame Type (Wire Rope Type)
            </option>
            {wireRopes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.wireRopeType}
              </option>
            ))}
          </FormSelect>

          <FormSelect
            value={formData.operatorTypeId || ""}
            onChange={(e) =>
              setFormData({ ...formData, operatorTypeId: e.target.value })
            }
            required
          >
            <option value="" disabled>
              Select Operator Type
            </option>
            {operators.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </FormSelect>

          {/* Capacity Type */}
          <FormSelect
            value={formData.capacityTypeId}
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
              value={formData[capacityMeta.formKey] || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
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
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            required
          />

          {/* <FormInput
            type="text"
            placeholder="Enter Counter Frame Type"
            value={counterFrameType || ""}
            onChange={(e) => setCounterFrameType(e.target.value)}
          /> */}
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
        title="Counter Frame Type List"
        columns={[
          { key: "counterFrameTypeName", label: "Counter Frame Type" },
          { key: "operatorTypeName", label: "Operator" },
          { key: "capacityTypeName", label: "Capacity Type" },
          {
            key: "capacityValue",
            label: "Capacity Value",
            render: (row) => row.personCapacityName || row.weightName || "-",
          },
          { key: "price", label: "Price" },
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
