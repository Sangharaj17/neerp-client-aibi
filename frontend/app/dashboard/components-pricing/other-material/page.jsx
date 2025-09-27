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

export default function OtherMaterialPage() {
  // const API_OPERATOR = "/api/operator-elevator";
  // const API_LIFT_TYPE = "/api/type-of-lift";
  // const API_CAPACITY_TYPE = "/api/capacityTypes";
  // const API_PERSON_CAPACITY = "/api/personCapacity";
  // const API_WEIGHTS = "/api/weights";
  // const API_FLOOR = "/api/floors";
  // const API_OTHER_MATERIAL = "/api/other-material";
  const API_OPERATOR = API_ENDPOINTS.OPERATOR;
  const API_LIFT_TYPE = API_ENDPOINTS.TYPE_OF_LIFT;
  const API_CAPACITY_TYPE = API_ENDPOINTS.CAPACITY_TYPES;
  const API_PERSON_CAPACITY = API_ENDPOINTS.PERSON_CAPACITY;
  const API_WEIGHTS = API_ENDPOINTS.WEIGHTS;
  const API_FLOOR = API_ENDPOINTS.FLOORS;
  const API_OTHER_MATERIAL = API_ENDPOINTS.OTHER_MATERIAL;

  const initialForm = {
    materialType: "",
    operatorTypeId: "",
    liftType: "",
    capacityTypeId: "",
    personCapacityId: "", // ID of selected person capacity
    //personId: "",
    weightId: "",
    floor: "",
    quantity: "",
    price: "",
  };
  const [form, setForm] = useState(initialForm);

  const [liftTypes, setLiftTypes] = useState([]);
  const [operatorTypes, setOperatorTypes] = useState([]);
  const [capacityTypes, setCapacityTypes] = useState([]);
  const [personCapacities, setPersonCapacities] = useState([]);
  const [weightCapacities, setWeightCapacities] = useState([]);
  const [floors, setFloors] = useState([]);

  const [otherMaterials, setOtherMaterials] = useState([]);

  const [editId, setEditId] = useState(null);
  const [typeSearch, setTypeSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const columnsDetails = [
    {
      key: "materialType",
      label: "Other Material Name",
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
      key: "machineRoomName",
      label: "Lift Type",
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
      key: "floorsLabel",
      label: "Floor",
      sortable: true,
      align: "text-left",
    },
    {
      key: "quantity",
      label: "Quantity",
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

  const fetchOtherMaterials = async () => {
    setLoading(null);
    try {
      setLoading(true);

      const { data } = await axiosInstance.get(API_OTHER_MATERIAL);
      const materials = Array.isArray(data)
        ? data
        : data?.data || data?.otherMaterials || [];

      setOtherMaterials(materials);
    } catch (err) {
      console.error("Failed to fetch Other Materials", err);
      setOtherMaterials([]);
    } finally {
      setLoading(false);
    }
  };

  //=============================================
  const fetchAll = async () => {
    const tenant = localStorage.getItem("tenant");

    try {
      const [
        operatorRes,
        liftTypeRes,
        capacityTypeRes,
        personRes,
        weightRes,
        floorRes,
      ] = await Promise.all([
        axiosInstance.get(API_OPERATOR),
        axiosInstance.get(API_LIFT_TYPE),
        axiosInstance.get(API_CAPACITY_TYPE),
        axiosInstance.get(API_PERSON_CAPACITY),
        axiosInstance.get(API_WEIGHTS),
        axiosInstance.get(API_FLOOR),
      ]);

      // Update states safely (fallback to empty array if not valid)
      // setOperatorTypes(
      //   Array.isArray(operatorData?.data) ? operatorData.data : []
      // );
      // setLiftTypes(Array.isArray(liftTypeData?.data) ? liftTypeData.data : []);
      // const capTypes = Array.isArray(capTypesData?.data)
      //   ? capTypesData.data
      //   : [];
      // setCapacityTypes(capTypes);
      // setPersonCapacities(Array.isArray(persons?.data) ? persons.data : []);
      // setWeightCapacities(Array.isArray(weights?.data) ? weights.data : []);
      // setFloors(Array.isArray(floorData?.data) ? floorData.data : []);

      const operators = Array.isArray(operatorRes.data?.data)
        ? operatorRes.data.data
        : [];
      setOperatorTypes(operators);

      setLiftTypes(
        Array.isArray(liftTypeRes.data?.data) ? liftTypeRes.data.data : []
      );

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
      setFloors(Array.isArray(floorRes.data?.data) ? floorRes.data.data : []);

      // ✅ Set default capacity type if exists
      if (capTypes.length > 0) {
        setForm((prevForm) => ({
          ...prevForm,
          //operatorTypeId: operators.length > 0 ? operators[0].id : "",
          capacityTypeId: capTypes.length > 0 ? capTypes[0].id : "",
          personCapacityId: "",
          weightId: "",
        }));
      }
    } catch (err) {
      console.error("❌ Failed to fetch data:", err);
    }
  };

  useEffect(() => {
    fetchOtherMaterials();
    fetchAll();
  }, []);

  const capacityOptionsMap = {
    Person: {
      data: personCapacities,
      label: "Select Persons",
      valueKey: "displayName",
      //formKey: "personId",
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

  const filteredData = otherMaterials.filter((t) =>
    t?.materialType?.toLowerCase().includes(typeSearch.toLowerCase())
  );

  const transformed = useMemo(() => {
    return filteredData.map((item) => ({
      ...item,
      capacityType: item.capacityTypeName,
      capacityValue:
        item.capacityTypeName === "Person"
          ? item.personCapacityName || "N/A"
          : `${item.weightName || "N/A"}`,
    }));
  }, [filteredData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isNaN(form.materialType)) {
      toast.error("Material Name must be a string.");
      return;
    }

    const price = parseInt(form.price);
    if (isNaN(price) || price <= 0) {
      toast.error("Price must be a valid positive integer.");
      return;
    }
    console.log("------00------>",form);

    if (
      !form.materialType?.trim() ||
      !String(form.operatorTypeId).trim() ||
      !String(form.liftType).trim() ||
      !String(form.capacityTypeId).trim() ||
      !String(form.floor).trim() ||
      !String(form.price).trim() ||
      !String(form.quantity).trim() 
      //!String(form.machineTypeId).trim() 
      //!String(form.personCapacityId).trim()
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

    // Use the correct dynamic key from capacityOptionsMap
    const capacityMeta = capacityOptionsMap[selectedCapacity.type];
    const selectedValueId = form[capacityMeta.formKey];

    if (!selectedValueId || isNaN(parseInt(selectedValueId, 10))) {
      toast.error(
        `Please select a valid ${selectedCapacity.type.toLowerCase()} capacity.`
      );
      return;
    }

    // const newItem = {
    //   id: editId || null,
    //   materialType: form.materialType.toUpperCase(),
    //   operatorTypeId: form.operatorTypeId,
    //   machineRoomId: form.liftType,
    //   capacityTypeId: parseInt(form.capacityTypeId),
    //   [selectedCapacity.fieldKey]: parseInt(selectedValueId),
    //   floorsId: form.floor,
    //   quantity: form.quantity,
    //   price: price,
    // };
    
    const normalize = (str) => str.replace(/\s+/g, " ").trim().toUpperCase();
    console.log(capacityMeta.formKey,"----vvvv-----",parseInt(selectedValueId, 10));
    

    const newItem = {
      id: editId || null,
      materialType: normalize(form.materialType).toUpperCase(),
      operatorTypeId: parseInt(form.operatorTypeId, 10),
      machineRoomId: parseInt(form.liftType, 10),
      capacityTypeId: parseInt(form.capacityTypeId, 10),
      [capacityMeta.formKey]: parseInt(selectedValueId, 10),
      floorsId: parseInt(form.floor, 10),
      quantity: parseInt(form.quantity, 10),
      price: parseInt(form.price, 10),
    };

    // Duplicate check
    // const duplicate = otherMaterials.some(
    //   (s) => s.materialType === newItem.materialType && s.id !== editId
    // );

    // 1️⃣ First check: materialType duplicate
    const materialTypeExists = otherMaterials.some(
      (s) =>
        normalize(s.materialType) === normalize(newItem.materialType) &&
        s.id !== editId
    );

    if (materialTypeExists) {
      toast.error("This Material Type already exists.");
      return;
    }

    // 2️⃣ Then check full combination
    const duplicate = otherMaterials.some((s) => {
      const isPerson = Number(newItem.capacityTypeId) === 1;

      const newCapacityId = isPerson
        ? Number(form.personCapacityId)
        : Number(form.weightId);

      const existingCapacityId = isPerson
        ? Number(s.personCapacityId)
        : Number(s.weightId);

      console.log("newItem:", JSON.stringify(newItem));
      console.log("existing:", JSON.stringify(s));
      console.log("form:", form);

      console.log(
        Number(s.operatorTypeId),
        "....existing....:",
        Number(newItem.operatorTypeId),
        Number(s.operatorTypeId) === Number(newItem.operatorTypeId)
      );

      console.log(
        Number(s.capacityTypeId),
        "....existing....:",
        Number(newItem.capacityTypeId),
        Number(s.capacityTypeId) === Number(newItem.capacityTypeId)
      );

      console.log(
        Number(existingCapacityId),
        "....existing...:",
        Number(existingCapacityId) === Number(newCapacityId),
        Number(existingCapacityId) === Number(newCapacityId)
      );

      console.log(
        Number(s.machineRoomId),
        "....existing...:",
        Number(newItem.machineRoomId),
        Number(newItem.machineRoomId),
        Number(s.machineRoomId) === Number(newItem.machineRoomId)
      );

      return (
        Number(s.operatorTypeId) === Number(newItem.operatorTypeId) &&
        Number(s.capacityTypeId) === Number(newItem.capacityTypeId) &&
        Number(existingCapacityId) === Number(newCapacityId) &&
        Number(s.machineRoomId) === Number(newItem.machineRoomId) &&
        s.id !== editId
      );
    });

    if (duplicate) {
      toast.error("This Material combination already exists.");
      return;
    }

    try {
      const url = editId
        ? `${API_OTHER_MATERIAL}/${editId}`
        : API_OTHER_MATERIAL;
      const method = editId ? "put" : "post";

      const response = await axiosInstance({
        url,
        method,
        data: newItem,
      });

      toast.success(
        response.data.message || "Material Name saved successfully"
      );

      fetchOtherMaterials();

      // Reset form
      setEditId(null);
      const defaultCapacityType = capacityTypes[0];
      const capacityMetaOnReset = capacityOptionsMap[defaultCapacityType.type];
      setForm({
        ...initialForm,
        capacityTypeId: defaultCapacityType.id,
        [capacityMetaOnReset.formKey]:
          capacityMetaOnReset.data.length > 0
            ? capacityMetaOnReset.data[0].id
            : "",
      });
      // setForm({
      //   ...initialForm,
      //   capacityTypeId: capacityTypes.length > 0 ? capacityTypes[0].id : "",
      // });
    } catch (error) {
      console.error("Error saving Material:", error);
      toast.error(error.message || "Failed to save Material.");
    }
  };

  const handleEdit = (item) => {
    console.log(item);
    const liftType = liftTypes.find(
      (mt) => mt.liftTypeName === item.machineRoomName
    );
    const operatorType = operatorTypes.find(
      (ot) => ot.name === item.operatorTypeName
    );

    const floor = floors.find((f) => f.floorName === item.floorsLabel);

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
      const cleanWeight = item.weightName.replace(/\s*Kg/i, ""); // remove " Kg"
      const weightCapacity = weightCapacities.find(
        (wc) => String(wc.weightValue) === cleanWeight
      );
      selectedCapacityId = weightCapacity?.id || "";
    }

    // Get the form key dynamically from the capacityOptionsMap
    const capacityMeta = capacityOptionsMap[item.capacityTypeName];
    const dynamicFormKey = capacityMeta ? capacityMeta.formKey : "";

    const isPerson = item.capacityType === "Person";
    setForm({
      materialType: item.materialType,
      liftType: liftType?.id || "",
      operatorTypeId: operatorType?.id || "",
      capacityTypeId: capacityType?.id || "",
      [dynamicFormKey]: selectedCapacityId,
      personId: dynamicFormKey === "personId" ? selectedCapacityId : "",
      weightId: dynamicFormKey === "weightId" ? selectedCapacityId : "",
      floor: floor ? floor.id : "",
      quantity: item.quantity,
      price: item.price,
    });
    setEditId(item.id);
  };

  const handleDelete = (id) => {
    const selected = otherMaterials.find((d) => d.id === id);
    if (!selected) {
      toast.error("Invalid material selected for deletion");
      return;
    }

    confirmDeleteWithToast(selected.materialType, async () => {
      try {
        await axiosInstance.delete(`${API_OTHER_MATERIAL}/${id}`);

        toast.success(`${selected.materialType} deleted successfully`);

        if (editId === id) {
          setOtherMaterials("");
          setEditId(null);
        }

        fetchOtherMaterials();
      } catch (err) {
        toast.error(err.message);
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
        title="Other Material Configuration"
        description="Manage and list other elevator materials."
        icon={SlidersHorizontal}
      />

      {/* Form Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        {/* Cabin SubType Form */}
        <ResponsiveForm onSubmit={handleSubmit}>
          <FormInput
            type="text"
            placeholder="Other Material Name"
            value={form.materialType}
            onChange={(e) => setForm({ ...form, materialType: e.target.value })}
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
            value={form.liftType || ""}
            onChange={(e) => setForm({ ...form, liftType: e.target.value })}
            required
          >
            <option value="" disabled>
              Select Lift Type
            </option>
            {liftTypes.map((type) => (
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
            {/* {editId && ( */}
              <FormButton
                type="button"
                variant="secondary"
                onClick={() => {
                  setEditId(null);
                  setForm({
                    ...initialForm,
                    capacityTypeId:
                      capacityTypes.length > 0 ? capacityTypes[0].id : "",
                  });
                }}
              >
                Cancel
              </FormButton>
            {/* )} */}
          </div>
        </ResponsiveForm>
      </div>

      {/* Table Section */}
      <ReusableTable
        title="Other Material List"
        columns={columnsDetails}
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
