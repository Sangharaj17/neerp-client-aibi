"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Pencil, Trash2, SlidersHorizontal, SquareStack } from "lucide-react";
import toast from "react-hot-toast";
import ReusableTable from "@/components/UI/ReusableTable";
import PageHeader from "@/components/UI/PageHeader";
import ResponsiveForm from "@/components/UI/ResponsiveForm";
import {
  FormInput,
  FormButton,
  FormSelect,
} from "@/components/UI/FormElements";
import axiosInstance from "@/utils/axiosInstance";
import { API_ENDPOINTS } from "@/utils/apiEndpoints";

export default function CabinTypeAndSubType() {
  // const API_URL = "/api/cabinType";
  // const API_URL_SUB = "/api/cabinSubType";
  const API_URL = API_ENDPOINTS.CABIN_TYPE;
  const API_URL_SUB = API_ENDPOINTS.CABIN_SUBTYPE;

  const [cabinTypes, setCabinTypes] = useState([]);
  const [cabinType, setCabinType] = useState("");
  const [capacityTypes, setCapacityTypes] = useState([]);
  const [personCapacities, setPersonCapacities] = useState([]);
  const [weightCapacities, setWeightCapacities] = useState([]);

  const [editTypeId, setEditTypeId] = useState(null);
  const [editSubId, setEditSubId] = useState(null);
  const [typeSearch, setTypeSearch] = useState("");
  const [subSearch, setSubSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    cabinType: "", // stores the ID
    cabinSubType: "",
    capacityTypeId: "", // stores the name (like "Person" or "Weight")
    //capacityTypeId: "", // stores the ID
    personCapacityId: "", // ID of selected person capacity
    weightId: "", // ID of selected weight capacity
    price: "",
  });

  const [cabinSubTypes, setCabinSubTypes] = useState([]);

  const fetchAll = async () => {
    setLoading(null);
    const tenant = localStorage.getItem("tenant");
    try {
      setLoading(true);

      const [capacityTypeRes, personRes, weightRes, subTypeRes] =
        await Promise.all([
          axiosInstance.get("/api/capacityTypes"),
          axiosInstance.get("/api/personCapacity"),
          axiosInstance.get("/api/weights"),
          axiosInstance.get(API_URL_SUB),
        ]);

      const capTypesData = capacityTypeRes.data;
      const persons = personRes.data;
      const weights = weightRes.data;
      const subTypes = subTypeRes.data;

      const capTypes = Array.isArray(capTypesData?.data)
        ? capTypesData.data
        : [];

      setCapacityTypes(capTypes);
      setPersonCapacities(Array.isArray(persons?.data) ? persons.data : []);
      setWeightCapacities(Array.isArray(weights?.data) ? weights.data : []);
      setCabinSubTypes(Array.isArray(subTypes?.data) ? subTypes.data : []);

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

  //const selectedType = capacityOptionsMap[form.capacityType];
  const selectedType = capacityTypes.find(
    (ct) => ct.id === form.capacityTypeId
  );
  // console.log(selectedType);
  // console.log(capacityOptionsMap);
  const capacityMeta = selectedType
    ? capacityOptionsMap[selectedType.type]
    : null;

  useEffect(() => {
    const fetchCabinTypes = async () => {
      try {
        const res = await axiosInstance.get(API_URL, {
          withCredentials: true, // ✅ same as `credentials: "include"`
        });

        const data = res.data;
        const types = Array.isArray(data)
          ? data
          : data?.data || data?.cabinTypes || [];

        setCabinTypes(types);
      } catch (err) {
        console.error("Failed to fetch cabin types", err);
        setCabinTypes([]);
      }
    };

    fetchCabinTypes();
  }, []);

  const filteredTypes = cabinTypes.filter((t) =>
    t?.cabinType?.toLowerCase().includes(typeSearch.toLowerCase())
  );

  const filteredSubTypes = cabinSubTypes.filter((item) => {
    const search = subSearch.toLowerCase();
    return (
      item.cabinSubName.toLowerCase().includes(search) ||
      item.cabinTypeDTO?.cabinType.toLowerCase().includes(search) ||
      item.capacityTypeDTO?.type.toLowerCase().includes(search)
    );
  });

  const fetchCabinSubTypes = async () => {
    try {
      const res = await axiosInstance.get(API_URL_SUB, {
        withCredentials: true,
      });

      const data = res.data;
      setCabinSubTypes(Array.isArray(data) ? data : data?.data || []);
    } catch (err) {
      console.error("Error fetching Cabin SubTypes:", err);
      setCabinSubTypes([]);
    }
  };

  const handleTypeSubmit = async (e) => {
    e.preventDefault();
    const name = cabinType.trim().toUpperCase();
    if (!name) return;

    const duplicate = cabinTypes.some(
      (t) => t.cabinType === name && t.id !== editTypeId
    );
    if (duplicate) return toast.error("Cabin Type already exists.");

    try {
      const url = editTypeId ? API_URL + `/${editTypeId}` : API_URL;
      const method = editTypeId ? "put" : "post";

      // 🔹 Save (create or update)
      await axiosInstance[method](url, { cabinType: name });

      // 🔹 Reset form state
      setCabinType("");
      setEditTypeId(null);

      // 🔹 Refresh cabin types
      const res = await axiosInstance.get(API_URL);
      const data = res.data;
      setCabinTypes(
        Array.isArray(data) ? data : data?.data || data?.cabinTypes || []
      );

      // 🔹 Refresh cabin subtypes so names reflect
      fetchCabinSubTypes();
    } catch (err) {
      console.error("Error saving cabin type:", err);
      toast.error("Error saving cabin type");
    }
  };

  // const handleTypeSubmit = async (e) => {
  //   e.preventDefault();
  //   const name = cabinType.trim().toUpperCase();
  //   if (!name) return;

  //   const duplicate = cabinTypes.some(
  //     (t) => t.cabinType === name && t.id !== editTypeId
  //   );
  //   if (duplicate) return alert("Cabin Type already exists.");

  //   try {
  //     const method = editTypeId ? "PUT" : "POST";
  //     const url = editTypeId ? `${API_URL}/${editTypeId}` : API_URL;
  //     await fetch(url, {
  //       method,
  //       headers: {
  //         "X-Tenant": localStorage.getItem("tenant"),
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ cabinType: name }),
  //     });

  //     setCabinType("");
  //     setEditTypeId(null);
  //     const res = await fetch(API_URL, {
  //       headers: {
  //         "X-Tenant": localStorage.getItem("tenant"),
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     const data = await res.json();
  //     setCabinTypes(
  //       Array.isArray(data) ? data : data?.data || data?.cabinTypes || []
  //     );
  //   } catch (err) {
  //     alert("Error saving cabin type");
  //   }
  // };

  const handleTypeEdit = (id) => {
    const type = cabinTypes.find((t) => t.id === id);
    setCabinType(type?.cabinType || "");
    setEditTypeId(id);
  };

  const handleTypeDelete = async (id) => {
    const hasSubType = cabinSubTypes.some((s) => s.cabinTypeDTO?.id === id);
    if (hasSubType)
      return toast.error("Cannot delete. Remove its subtypes first.");

    try {
      // 🔹 Delete the cabin type
      await axiosInstance.delete(API_URL + `/${id}`);

      // 🔹 Refresh cabin types
      const res = await axiosInstance.get(API_URL);
      const data = res.data;

      setCabinTypes(
        Array.isArray(data) ? data : data?.data || data?.cabinTypes || []
      );
    } catch (err) {
      console.error("Error deleting cabin type:", err);
      toast.error("Error deleting cabin type");
    }
    setCabinType("");
    setEditTypeId(null);
  };

  const handleSubSubmit = async (e) => {
    e.preventDefault();

    if (!isNaN(form.cabinSubType)) {
      toast.error("Cabin Subtype must be a string.");
      return;
    }

    const price = parseInt(form.price);
    if (isNaN(price) || price <= 0) {
      toast.error("Price must be a valid positive integer.");
      return;
    }

    if (
      !form.cabinType ||
      !form.cabinSubType?.trim() ||
      !form.capacityTypeId ||
      !form.price
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

    // Construct payload
    const newSubType = {
      id: editSubId || null,
      cabinSubName: form.cabinSubType.trim().toUpperCase(),
      cabinTypeId: parseInt(form.cabinType),
      capacityTypeId: parseInt(form.capacityTypeId),
      prize: price,
      [selectedCapacity.fieldKey]: parseInt(selectedValueId),
    };

    // Duplicate check
    const duplicateNM = cabinSubTypes.some(
      (s) =>
        s.cabinSubName === newSubType.cabinSubName &&
        s.cabinTypeDTO.id === newSubType.cabinTypeId &&
        s.id !== editSubId
    );

    if (duplicateNM) {
      toast.error("Cabin Subtype Name already exists for this Cabin Type.");
      return;
    }

    // Duplicate check (unique by cabinType + capacityTypeId + capacityValue)
    const duplicate = cabinSubTypes.some((s) => {
      const isPerson = Number(newSubType.capacityTypeId) === 1;

      // capacityValueId depends on type (personId or weightId)
      const newCapacityId = isPerson
        ? Number(newSubType.personCapacityId)
        : Number(newSubType.weightId);

      const existingCapacityId = isPerson
        ? Number(s.personCapacityDTO?.id)
        : Number(s.weightDTO?.id);

        // console.log(s,"<==s=====cabin=====newSubType===>",newSubType);
        // console.log(newCapacityId,"<==newCapacityId=====cabin=====existingCapacityId===>",existingCapacityId);
        // console.log(Number(s.cabinTypeDTO.id),"---------",Number(newSubType.cabinTypeId),"<==Number(s.cabinTypeDTO.id) === Number(newSubType.cabinTypeId)===>",Number(s.cabinTypeDTO.id) === Number(newSubType.cabinTypeId));
        // console.log(Number(s.capacityTypeDTO.id),"---------",Number(newSubType.capacityTypeId),"<==Number(s.capacityTypeDTO.id) === Number(newSubType.capacityTypeId)===>", Number(s.capacityTypeDTO.id) === Number(newSubType.capacityTypeId));
        // console.log(Number(existingCapacityId),"---------",Number(newCapacityId),"<==Number(existingCapacityId) === Number(newCapacityId)===>",Number(existingCapacityId) === Number(newCapacityId));
        
      return (
        Number(s.cabinTypeDTO.id) === Number(newSubType.cabinTypeId) &&
        Number(s.capacityTypeDTO.id) === Number(newSubType.capacityTypeId) &&
        Number(existingCapacityId) === Number(newCapacityId) &&
        s.id !== editSubId
      );
    });

    if (duplicate) {
      toast.error("This Cabin Type with the selected Capacity already exists.");
      return;
    }

    try {
      const url = editSubId ? API_URL_SUB + `/${editSubId}` : API_URL_SUB;
      const method = editSubId ? "put" : "post";

      const response = await axiosInstance[method](url, newSubType);
      const result = response.data;

      toast.success(result.message || "Cabin Subtype saved successfully");

      // 🔹 Update local state
      if (editSubId) {
        setCabinSubTypes((prev) =>
          prev.map((s) => (s.id === editSubId ? result.data : s))
        );
      } else {
        setCabinSubTypes((prev) => [...prev, result.data]);
      }

      // 🔹 Reset form
      setEditSubId(null);
      setForm({
        cabinType: "",
        cabinSubType: "",
        capacityTypeId: capacityTypes.length > 0 ? capacityTypes[0].id : "",
        personCapacityId: "",
        weightId: "",
        price: "",
      });
    } catch (error) {
      console.error("Error saving cabin subtype:", error);
      toast.error(
        error.response?.data?.message || "Failed to save cabin subtype."
      );
    }
  };

  const getPersonIdFromCapacity = (capacityStr) => {
    const capacity = personCapacities.find(
      (pc) => pc.displayText === capacityStr
    );
    return capacity ? capacity.id : "";
  };

  const handleSubEdit = (item) => {
    console.log(item);
    const isPerson = item.capacityTypeDTO.type === "Person";

    setForm({
      cabinType: item.cabinTypeDTO.id, // ID of selected Cabin Type
      cabinSubType: item.cabinSubName,
      capacityTypeId: item.capacityTypeDTO.id, // ID of selected Capacity Type
      personId:
        isPerson && item.personCapacityDTO ? item.personCapacityDTO.id : "", // your own logic to map text to ID
      weightId: !isPerson && item.weightDTO ? item.weightDTO.id : "",
      price: item.prize,
    });

    setEditSubId(item.id);
  };

  const columnsCabinType = [
    {
      key: "cabinType",
      label: "Cabin Type",
      align: "text-center",
      sortable: true,
    },
  ];

  const subTypeColumns = [
    {
      key: "cabinType",
      label: "Cabin Type",
      sortable: true,
      align: "text-left",
    },
    {
      key: "cabinSubName",
      label: "Cabin SubType",
      sortable: true,
      align: "text-left",
    },
    {
      key: "capacityType",
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
    { key: "prize", label: "Price", sortable: true, align: "text-left" },
  ];

  const transformedSubTypes = useMemo(() => {
    return filteredSubTypes.map((item) => ({
      ...item,
      cabinType: item.cabinTypeDTO?.cabinType,
      capacityType: item.capacityTypeDTO?.type,
      capacityValue:
        item.capacityTypeDTO?.type === "Person"
          ? item.personCapacityDTO?.displayName || "N/A"
          : `${item.weightDTO?.weightValue} Kg`,
    }));
  }, [filteredSubTypes]);

  const handleSubDelete = (id) => {
    toast(
      (t) => (
        <div className="text-sm">
          <p>Are you sure you want to delete this Cabin Sub Type?</p>
          <div className="flex justify-end gap-2 mt-2">
            <button
              className="px-3 py-1 bg-red-600 text-white rounded"
              onClick={async () => {
                toast.dismiss(t.id); // Close the toast

                try {
                  const res = await axiosInstance.delete(
                    API_URL_SUB + `/${id}`
                  );
                  const result = res.data;

                  setCabinSubTypes((prev) => prev.filter((s) => s.id !== id));

                  if (editSubId === id) {
                    setEditSubId(null);
                    setForm({
                      cabinType: "",
                      cabinSubType: "",
                      capacityTypeId:
                        capacityTypes.length > 0 ? capacityTypes[0].id : "",
                      personCapacityId: "",
                      weightId: "",
                      price: "",
                    });
                  }

                  toast.success(
                    result.message || "Cabin Sub Type deleted successfully"
                  );
                } catch (err) {
                  console.error("Error deleting Cabin SubType:", err);
                  toast.error(
                    err.response?.data?.message || "Failed to delete."
                  );
                }
              }}
            >
              Yes
            </button>
            <button
              className="px-3 py-1 bg-gray-300 rounded"
              onClick={() => toast.dismiss(t.id)}
            >
              No
            </button>
          </div>
        </div>
      ),
      { duration: 10000 }
    );
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
        title="Cabin Types & SubTypes - Price Management"
        description="Manage and categorize types of cabin and their subtypes."
        icon={SlidersHorizontal}
      />

      {/* Cabin Type Form Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-800 flex items-center gap-2">
          <SquareStack className="w-5 h-5 text-gray-600" /> Cabin Types
        </h2>
        <ResponsiveForm
          onSubmit={handleTypeSubmit}
          columns="grid-cols-1 sm:grid-cols-3"
        >
          <FormInput
            placeholder="Enter Cabin Type"
            value={cabinType}
            onChange={(e) => setCabinType(e.target.value)}
            required
          />

          <div className="col-span-auto gap-2 flex items-center">
            <FormButton type="submit">
              {editTypeId ? "Update" : "Add"}
            </FormButton>
            {/* {editTypeId && ( */}
            <FormButton
              type="button"
              variant="secondary"
              onClick={() => {
                setEditTypeId(null);
                setCabinType("");
              }}
            >
              Cancel
            </FormButton>
            {/* )} */}
          </div>
        </ResponsiveForm>

        <ReusableTable
          title="Cabin Type List"
          columns={columnsCabinType}
          data={filteredTypes}
          onEdit={(item) => handleTypeEdit(item.id)}
          onDelete={(id) => handleTypeDelete(id)}
          searchTerm={typeSearch}
          onSearchChange={setTypeSearch}
          height="250px"
          pageSize={10}
          combineActions={false}
          loading={loading}
        />
      </div>

      {/* Cabin SubType Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-800 flex items-center gap-2">
          <SquareStack className="w-5 h-5 text-gray-600" />
          Cabin SubTypes
        </h2>

        {/* Cabin SubType Form */}
        <ResponsiveForm onSubmit={handleSubSubmit}>
          {/* Cabin Type */}
          <FormSelect
            value={form.cabinType}
            onChange={(e) => setForm({ ...form, cabinType: e.target.value })}
            required
          >
            <option value="" disabled>
              Select Cabin Type
            </option>
            {cabinTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.cabinType}
              </option>
            ))}
          </FormSelect>

          {/* Cabin SubType */}
          <FormInput
            type="text"
            placeholder="Enter Cabin SubType"
            value={form.cabinSubType}
            onChange={(e) => setForm({ ...form, cabinSubType: e.target.value })}
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
              {editSubId ? "Update" : "Add"}
            </FormButton>

            {/* Cancel Button */}
            {/* {editSubId && ( */}
            <FormButton
              type="button"
              variant="secondary"
              onClick={() => {
                setEditSubId(null);
                setForm({
                  cabinType: "",
                  cabinSubType: "",
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
            {/* )} */}
          </div>
        </ResponsiveForm>

        <ReusableTable
          title="Cabin Subtype List"
          columns={subTypeColumns}
          data={transformedSubTypes}
          onEdit={(item) => handleSubEdit(item)}
          onDelete={(id) => handleSubDelete(id)}
          searchTerm={subSearch}
          onSearchChange={setSubSearch}
          pageSize={10}
          height="250px"
          loading={loading}
        />
      </div>
    </div>
  );
}
