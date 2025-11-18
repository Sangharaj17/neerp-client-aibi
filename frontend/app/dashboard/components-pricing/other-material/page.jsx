"use client";
import React, { useState, useEffect, useMemo } from "react";
import { SlidersHorizontal, SquareStack } from "lucide-react";
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

  const API_OTHER_MATERIAL_MAIN_TYPE = API_ENDPOINTS.OTHER_MATERIAL_MAIN_TYPE;

  //--------------Other matrial type------------------------

  const [materialMainType, setMaterialMainType] = useState([]);
  const [formMaterialMainType, setFormMaterialMainType] = useState({
    materialMainType: "",
    ruleExpression: "",
  });
  const [editIdMaterialMainType, setEditIdMaterialMainType] = useState(null);
  const [searchMaterialMainType, setSearchMaterialMainType] = useState("");

  useEffect(() => {
    const fetchOtherMaterialMainTypes = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(API_OTHER_MATERIAL_MAIN_TYPE);

        setMaterialMainType(response.data?.data || []);
      } catch (error) {
        console.error("Error fetching Other Material Main Types:", error);
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Something went wrong while fetching data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOtherMaterialMainTypes();
  }, []);

  const columnsMaterialMainType = [
    {
      key: "materialMainType",
      label: "Material Main Type",
      render: (item) => (
        <span>
          {item.materialMainType}
          {item.systemDefined && (
            <span className="text-gray-500 text-xs ml-2">(Not Editable)</span>
          )}
        </span>
      ),
    },
    { key: "ruleExpression", label: "Rule Expression" },
    {
      key: "active",
      label: "Status",
      render: (item) => (
        <span className={item.active ? "text-green-600" : "text-red-600"}>
          {item.active ? "✔" : "✖"}
        </span>
      ),
    },
    {
      key: "toggleStatus",
      label: "Toggle Status",
      render: (item) => (
        <button
          className={`px-2 py-1 rounded text-xs font-medium ${
            item.active ? "bg-red-500 text-white" : "bg-green-500 text-white"
          }`}
          onClick={() => handleToggleStatus(item)}
        >
          {item.active ? "Click To Deactivate" : "Click To Activate"}
        </button>
      ),
    },
  ];

  const handleSubmitMaterialMainType = async (e) => {
    e.preventDefault();

    const newValue = formMaterialMainType.materialMainType?.trim();
    const ruleExp = formMaterialMainType.ruleExpression?.trim();

    // ✅ Validation
    if (!newValue) {
      toast.error("Material main type name is required!");
      return;
    }
    if (/^\d+$/.test(newValue)) {
      toast.error("Material main type name cannot be only numbers!");
      return;
    }

    // ✅ Unique check
    if (
      materialMainType.some(
        (f) =>
          f.materialMainType.toLowerCase() === newValue.toLowerCase() &&
          f.id !== editIdMaterialMainType
      )
    ) {
      toast.error("Material main type name must be unique!");
      return;
    }

    try {
      if (editIdMaterialMainType) {
        // Update
        const res = await axiosInstance.put(
          `${API_OTHER_MATERIAL_MAIN_TYPE}/${editIdMaterialMainType}`,
          {
            materialMainType: newValue,
            ruleExpression: ruleExp, // <-- include this
            active: true,
          }
        );

        setMaterialMainType((prev) =>
          prev.map((f) => (f.id === editIdMaterialMainType ? res.data.data : f))
        );
        toast.success("Material Main Type updated successfully!");

        await fetchOtherMaterials();

        setEditIdMaterialMainType(null);
      } else {
        // Add new
        const res = await axiosInstance.post(API_OTHER_MATERIAL_MAIN_TYPE, {
          materialMainType: newValue,
          ruleExpression: ruleExp, // <-- include this
          active: true,
        });

        setMaterialMainType((prev) => [...prev, res.data.data]);
        toast.success("Material Main Type added successfully!");

        await fetchOtherMaterials();
      }

      // Reset form
      setFormMaterialMainType({ materialMainType: "", ruleExpression: "" });
    } catch (err) {
      toast.error("Error while saving Material Main Type!");
    }
  };

  const handleEditMaterialMainType = (item) => {
    if (item.systemDefined) {
      toast.error("This item is system-defined and cannot be edited.");
      return;
    }
    setFormMaterialMainType({
      materialMainType: item.materialMainType || "",
      ruleExpression: item.ruleExpression || "",
    });
    setEditIdMaterialMainType(item.id);
  };

  const handleDeleteMaterialMainType = (id) => {
    const selected = materialMainType.find((m) => m.id === id);
    if (!selected) return;

    // Check if this type is used in otherMaterials
    const isUsed = otherMaterials.some((m) => m.otherMaterialMainId === id);
    if (isUsed) {
      toast.error(
        "Cannot delete this Material Main Type because it is used in Other Materials."
      );
      return;
    }

    // Show confirmation toast
    confirmDeleteWithToast(selected.materialMainType, async () => {
      try {
        await axiosInstance.delete(`${API_OTHER_MATERIAL_MAIN_TYPE}/${id}`, {
          headers: { "X-Tenant": localStorage.getItem("tenant") },
        });

        // Remove from state
        setMaterialMainType((prev) => prev.filter((f) => f.id !== id));
        setFormMaterialMainType({ materialMainType: "", ruleExpression: "" });

        toast.success(`${selected.materialMainType} deleted successfully!`);
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Delete failed!");
      }
    });
  };

  const filteredMaterialMainType = materialMainType.filter(
    (mainType) =>
      (mainType.materialMainType?.toLowerCase() || "").includes(
        searchMaterialMainType.toLowerCase()
      ) || String(mainType.id || "").includes(searchMaterialMainType)
  );

  // Add this new function to your parent component
  const handleToggleStatus = async (mainType) => {
    try {
      const res = await axiosInstance.put(
        `${API_OTHER_MATERIAL_MAIN_TYPE}/${mainType.id}`,
        { ...mainType, active: !mainType.active },
        { headers: { "X-Tenant": localStorage.getItem("tenant") } }
      );

      setMaterialMainType((prev) =>
        prev.map((f) => (f.id === mainType.id ? res.data.data : f))
      );

      toast.success("Status updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status!");
    }
  };

  //--------------------other materials------------------------
  // const initialForm = {
  //   otherMaterialMainId: "",
  //   otherMaterialName: "",
  //   operatorTypeId: "",
  //   liftType: "",
  //   capacityTypeId: "",
  //   personCapacityId: "", // ID of selected person capacity
  //   //personId: "",
  //   weightId: "",
  //   floor: "",
  //   quantity: "",
  //   price: "",
  //   quantityDisabled: false,
  //   isOthersSelected: true,
  // };
  // const [form, setForm] = useState(initialForm);

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
      key: "otherMaterialMainName",
      label: "Other Material Type",
      sortable: true,
      align: "text-left",
    },
    {
      key: "otherMaterialName",
      label: "Other Material Name",
      sortable: true,
      align: "text-left",
    },
    {
      key: "otherMaterialDisplayName",
      label: "Display Name",
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
      key: "floors",
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

  const defaultOthers = materialMainType.find(
    (m) => m.materialMainType === "Others"
  );

  const initialForm = {
    otherMaterialMainId: defaultOthers ? defaultOthers.id : "",
    otherMaterialName: "",
    otherMaterialDisplayName: "",
    operatorTypeId: "",
    liftType: "",
    capacityTypeId: "",
    personCapacityId: "",
    weightId: "",
    floor: "",
    quantity: "",
    price: "",
    quantityDisabled: false,
    isOthersSelected: true, // since default is Others
  };
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (materialMainType.length > 0) {
      const others = materialMainType.find(
        (m) =>
          m.materialMainType === "Others" || m.materialMainType === "Machines"
      );
      if (others) {
        setForm((prevForm) => ({
          ...prevForm,
          otherMaterialMainId: others.id,
          isOthersSelected: true,
        }));
      }
    }
  }, [materialMainType]);

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

  const transformed = useMemo(() => {
    return otherMaterials
      .filter((t) =>
        t?.otherMaterialMainName
          ?.toLowerCase()
          .includes(typeSearch.toLowerCase())
      )
      .map((item) => ({
        ...item,
        operatorTypeName: item.operatorTypeName || "N/A",
        otherMaterialName: item.otherMaterialName || "N/A",
        otherMaterialDisplayName: item.otherMaterialDisplayName || "N/A",
        machineRoomName: item.machineRoomName || "N/A",
        capacityTypeName: item.capacityTypeName || "N/A",
        capacityType: item.capacityTypeName || "N/A",
        capacityValue:
          item.capacityTypeName === "Person"
            ? item.personCapacityName || "N/A"
            : item.capacityTypeName === "Weight"
            ? item.weightName || "N/A"
            : "N/A",
        floorsLabel: item.floorsLabel || "N/A",
        quantity: item.quantity || "0",
        price: item.price != null ? item.price : 0,
      }));
  }, [otherMaterials, typeSearch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedMaterial = materialMainType.find(
      (m) => m.id === parseInt(form.otherMaterialMainId, 10)
    );

    if (!selectedMaterial) {
      toast.error("Please select Other Material Type.");
      return;
    }

    const isOthers =
      selectedMaterial.materialMainType === "Others" ||
      selectedMaterial.materialMainType === "Machines";
    console.log(isOthers, "-----isOthers----");
    console.log(selectedMaterial, "-----selectedMaterial----");
    console.log(
      selectedMaterial.materialMainType,
      "-----selectedMaterial.materialMainType----"
    );

    const price = parseInt(form.price);
    if (isNaN(price) || price < 0) {
      toast.error("Price must be a valid positive integer.");
      return;
    }

    // Conditional mandatory fields only if Others
    let selectedCapacityKey = null;
    if (isOthers) {
      const capacityType = capacityTypes.find(
        (ct) => ct.id === parseInt(form.capacityTypeId)
      );
      const selectedCapacityKey =
        capacityOptionsMap[capacityType?.type]?.formKey;

      if (
        !form.operatorTypeId ||
        !form.capacityTypeId ||
        !form[selectedCapacityKey] ||
        !form.otherMaterialName ||
        !form.floor
      ) {
        toast.error(
          "Other Material Name, Operator Type, Capacity Type, Capacity Value, and Floor are required for 'Others'."
        );
        return;
      }

      // 1️⃣ Duplicate Other Material Name check
      const nameDuplicate = otherMaterials.some((m) => {
        return (
          m.id !== editId &&
          m.otherMaterialMainId === parseInt(form.otherMaterialMainId, 10) &&
          m.otherMaterialName?.trim().toLowerCase() ===
            form.otherMaterialName.trim().toLowerCase()
        );
      });

      if (nameDuplicate) {
        toast.error("Duplicate 'Other Material Name' is not allowed.");
        return;
      }

      const duplicate = otherMaterials.some((m) => {
        return (
          m.id !== editId &&
          m.otherMaterialMainId === parseInt(form.otherMaterialMainId, 10) &&
          // m.otherMaterialName?.trim().toLowerCase() ===
          //   form.otherMaterialName.trim().toLowerCase() &&
          parseInt(m.operatorTypeId) === parseInt(form.operatorTypeId) &&
          parseInt(m.capacityTypeId) === parseInt(form.capacityTypeId) &&
          parseInt(m[selectedCapacityKey]) ===
            parseInt(form[selectedCapacityKey]) &&
          m.floorsLabel?.trim() ===
            floors.find((f) => f.id === parseInt(form.floor))?.floorName
        );
      });

      if (duplicate) {
        toast.error(
          "Duplicate material is not allowed for the same floor/operator/capacity combination."
        );
        return;
      }
    } else {
      console.log(
        editId,
        "----------id--------",
        form.otherMaterialMainId,
        "----non-others-----",
        otherMaterials
      );
      // Only one entry allowed for non-Others
      const exists = otherMaterials.some(
        (s) =>
          s.otherMaterialMainId === parseInt(form.otherMaterialMainId, 10) &&
          s.otherMaterialName.trim().toLowerCase() ===
            form.otherMaterialName.trim().toLowerCase() &&
          (editId ? s.id !== editId : true)
      );
      console.log(exists, "----------exists--------");
      if (exists) {
        toast.error(
          `Only one entry is allowed for '${selectedMaterial.materialMainType}'.`
        );
        return;
      }
    }

    // Prepare payload
    const selectedCapacity = capacityTypes.find(
      (ct) => ct.id === form.capacityTypeId
    );
    const capacityMeta = selectedCapacity
      ? capacityOptionsMap[selectedCapacity.type]
      : null;

    const newItem = {
      id: editId || null,
      otherMaterialMainId: parseInt(form.otherMaterialMainId, 10),
      otherMaterialName: form.otherMaterialName,
      otherMaterialDisplayName: form.otherMaterialDisplayName,
      price: parseInt(form.price, 10),
      quantity: parseInt(form.quantity, 10),
      ...(isOthers && form.operatorTypeId
        ? { operatorTypeId: parseInt(form.operatorTypeId, 10) }
        : {}),
      ...(isOthers && form.capacityTypeId
        ? { capacityTypeId: parseInt(form.capacityTypeId, 10) }
        : {}),
      ...(isOthers && capacityMeta && form[capacityMeta.formKey]
        ? { [capacityMeta.formKey]: parseInt(form[capacityMeta.formKey], 10) }
        : {}),
      ...(form.liftType ? { machineRoomId: parseInt(form.liftType, 10) } : {}),
      ...(form.floor ? { floorsId: parseInt(form.floor, 10) } : {}),
    };

    try {
      const url = editId
        ? `${API_OTHER_MATERIAL}/${editId}`
        : API_OTHER_MATERIAL;
      const method = editId ? "put" : "post";

      const response = await axiosInstance({ url, method, data: newItem });

      toast.success(response.data.message || "Material saved successfully");
      fetchOtherMaterials();
      setEditId(null);

      // Reset form
      const defaultCapacityType = capacityTypes[0];
      const capacityMetaOnReset = capacityOptionsMap[defaultCapacityType.type];
      setForm({
        ...initialForm,
        capacityTypeId: defaultCapacityType.id,
      });
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

    // Determine if 'Others'
    const selectedMaterial = materialMainType.find(
      (m) => m.id === item.otherMaterialMainId
    );
    const isOthers =
      selectedMaterial?.materialMainType === "Others" ||
      selectedMaterial?.materialMainType === "Machines";

    setForm({
      otherMaterialMainId: item.otherMaterialMainId || "",
      // Set otherMaterialName: empty for Others, else show material type
      // otherMaterialName: isOthers
      //   ? ""
      //   : selectedMaterial?.materialMainType || "",
      otherMaterialName: item.otherMaterialName || "",
      otherMaterialDisplayName: item.otherMaterialDisplayName || "",
      liftType: liftType?.id || "",
      operatorTypeId: operatorType?.id || "",
      capacityTypeId: capacityType?.id || "",
      [dynamicFormKey]: selectedCapacityId,
      personCapacityId:
        dynamicFormKey === "personCapacityId" ? selectedCapacityId : "",
      weightId: dynamicFormKey === "weightId" ? selectedCapacityId : "",
      floor: floor ? floor.id : "",
      quantity: item.quantity,
      price: item.price,
      quantityDisabled: false,
      isOthersSelected: isOthers,
    });
    setEditId(item.id);
  };

  const resetForm = () => {
    const defaultCapacityType = capacityTypes[0];
    const defaultMaterial = materialMainType[0];

    const isOthers =
      defaultMaterial?.materialMainType === "Others" ||
      defaultMaterial?.materialMainType === "Machines";

    setForm({
      ...initialForm,
      otherMaterialMainId: defaultMaterial?.id || "",
      otherMaterialName: isOthers
        ? ""
        : defaultMaterial?.materialMainType || "", // auto-set for non-Others
      otherMaterialDisplayName: "",
      capacityTypeId: defaultCapacityType?.id || "",
      quantityDisabled: false,
      isOthersSelected: isOthers,
    });

    setEditId(null);
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

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-800 flex items-center gap-2 mb-3">
          <SquareStack className="w-5 h-5 text-gray-600" />
          Other Matrials Types
        </h2>

        <ResponsiveForm
          onSubmit={handleSubmitMaterialMainType}
          className="flex flex-wrap items-center gap-4 max-w-3xl"
        >
          {/* Material Type */}
          <FormInput
            type="text"
            label="Material Type"
            value={formMaterialMainType.materialMainType}
            onChange={(e) =>
              setFormMaterialMainType({
                ...formMaterialMainType,
                materialMainType: e.target.value,
              })
            }
            placeholder="Enter Material Type Name"
            required
          />

          {/* Rule Expression */}
          <FormInput
            type="text"
            label="Rule Expression"
            value={formMaterialMainType.ruleExpression}
            onChange={(e) =>
              setFormMaterialMainType({
                ...formMaterialMainType,
                ruleExpression: e.target.value,
              })
            }
            placeholder="Enter Rule Expression"
          />

          {/* Buttons */}
          <div className="col-span-auto gap-2 flex items-center">
            <FormButton type="submit" variant="primary">
              {editIdMaterialMainType ? "Update" : "Add Material Type"}
            </FormButton>

            <FormButton
              type="button"
              variant="secondary"
              onClick={() => {
                setEditIdMaterialMainType(null);
                setFormMaterialMainType({
                  materialMainType: "",
                  ruleExpression: "",
                });
              }}
            >
              Cancel
            </FormButton>
          </div>
        </ResponsiveForm>

        <ReusableTable
          title="Material Main Type List"
          columns={columnsMaterialMainType}
          data={filteredMaterialMainType}
          onEdit={handleEditMaterialMainType}
          onDelete={handleDeleteMaterialMainType}
          searchTerm={searchMaterialMainType}
          onSearchChange={setSearchMaterialMainType}
          height="350px"
          combineActions={false}
          inlineEditing={false}
          loading={loading}
        />
      </div>

      {/* Form Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-800 flex items-center gap-2 mb-3">
          <SquareStack className="w-5 h-5 text-gray-600" />
          Other Matrials
        </h2>
        {/* Other material Type Form */}
        <ResponsiveForm onSubmit={handleSubmit}>
          {/* <FormInput
            type="text"
            placeholder="Other Material Name"
            value={form.materialType}
            onChange={(e) => setForm({ ...form, materialType: e.target.value })}
            required
          /> */}

          <FormSelect
            value={form.otherMaterialMainId || ""}
            onChange={(e) => {
              const selectedId = e.target.value;
              const selectedMaterial = materialMainType.find(
                (m) => m.id === parseInt(selectedId, 10)
              );

              // If "Truffing" is selected, set quantity = 1 and disable input
              const isTruffing =
                selectedMaterial?.materialMainType === "Truffing";
              const isOthers =
                selectedMaterial?.materialMainType === "Others" ||
                selectedMaterial?.materialMainType === "Machines";

              setForm({
                ...form,
                otherMaterialMainId: selectedId,
                otherMaterialName: isOthers
                  ? "" // keep empty for manual input
                  : selectedMaterial?.materialMainType, // auto-set for non-Others
                quantity: isTruffing ? 1 : "", // keep current value if not Truffing
                quantityDisabled: isTruffing, // store disabled state in form
                isOthersSelected: isOthers,
              });
            }}
            required
          >
            <option value="" disabled>
              Select Other Material Type
            </option>
            {materialMainType.map((type) => (
              <option key={type.id} value={type.id}>
                {type.materialMainType}
              </option>
            ))}
          </FormSelect>

          <FormInput
            placeholder="Enter Other Matrial Name"
            value={form.otherMaterialName || ""}
            onChange={(e) =>
              setForm({ ...form, otherMaterialName: e.target.value })
            }
            required
            // disabled={form.quantityDisabled}
          />

          <FormInput
            placeholder="Enter Display Name"
            label="Display Name"
            value={form.otherMaterialDisplayName || ""}
            onChange={(e) =>
              setForm({ ...form, otherMaterialDisplayName: e.target.value })
            }
            required
          />

          {/* Only show these fields if 'Others' is selected */}
          {form.isOthersSelected && (
            <>
              <FormSelect
                value={form.operatorTypeId || ""}
                onChange={(e) =>
                  setForm({ ...form, operatorTypeId: e.target.value })
                }
                // required
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
                // required
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
                // required
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
                  // required
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
                // required
              >
                <option value="" disabled>
                  Select Floor
                </option>
                {floors.map((type) => (
                  <option key={type.id} value={type.id}>
                    {/* {type.floorName} */}
                    {type.id}
                  </option>
                ))}
              </FormSelect>
            </>
          )}
          {/* Quantity */}
          <FormInput
            type="number"
            placeholder="Enter Quantity"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            // required
            disabled={form.quantityDisabled}
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
              onClick={resetForm}
              // onClick={() => {
              //   setEditId(null);
              //   setForm({
              //     ...initialForm,
              //     capacityTypeId:
              //       capacityTypes.length > 0 ? capacityTypes[0].id : "",
              //   });
              // }}
            >
              Cancel
            </FormButton>
            {/* )} */}
          </div>
        </ResponsiveForm>

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
    </div>
  );
}
