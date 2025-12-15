"use client";

import React, { useState, useEffect, useMemo } from "react";
import { FanIcon, SlidersHorizontal, SquareStack } from "lucide-react";
import toast from "react-hot-toast";
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

export default function AirManagement() {
  const [loading, setLoading] = useState(true);

  // Air Type form state
  const [airTypes, setAirTypes] = useState([]);
  const [airTypeForm, setAirTypeForm] = useState({ name: "", status: true });
  const [editAirTypeId, setEditAirTypeId] = useState(null);
  const [airTypeSearch, setAirTypeSearch] = useState("");
  const [airSystemSearch, setAirSystemSearch] = useState("");

  const [airSystems, setAirSystems] = useState([]);
  const [capacityTypes, setCapacityTypes] = useState([]);
  const [personCapacities, setPersonCapacities] = useState([]);
  const [weightCapacities, setWeightCapacities] = useState([]);
  const [editAirSystemId, setEditAirSystemId] = useState(null);
  // Air System form state
  const initialAirSystem = {
    capacityTypeId: "",
    personCapacityId: "",
    weightId: "",
    price: "",
    airTypeId: "",
    quantity: "",
  };
  const [airSystemForm, setAirSystemForm] = useState(initialAirSystem);

  // const API_CAPACITY_URL = "/api/capacityTypes";
  // const API_WEIGHTS_URL = "/api/weights";
  // const API_PERSON_CAPACITY_URL = "/api/personCapacity";
  const API_CAPACITY_URL = API_ENDPOINTS.CAPACITY_TYPES;
  const API_WEIGHTS_URL = API_ENDPOINTS.WEIGHTS;
  const API_PERSON_CAPACITY_URL = API_ENDPOINTS.PERSON_CAPACITY;

  const columnsAirType = [
    {
      key: "name",
      label: "Name",
      sortable: true,
      align: "text-left",
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      align: "text-center",
      render: (item) =>
        item.status === true || item.status === "true" ? "Active" : "Inactive",
    },
  ];

  const columnsAirSystem = [
    {
      key: "airTypeName",
      label: "Air Type",
      sortable: true,
      align: "text-center",
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
      key: "quantity",
      label: "Quantity",
      sortable: true,
      align: "text-center",
    },
    {
      key: "price",
      label: "Price",
      sortable: true,
      align: "text-center",
    },
  ];

  const setDefaultCap = () => {
    if (capacityTypes.length > 0) {
      const defaultCapacityType = capacityTypes[0];
      const capacityMeta = capacityOptionsMap[defaultCapacityType.type];

      // Set the form state with the default values from the fetched data
      setAirSystemForm((prevForm) => ({
        ...prevForm,
        capacityTypeId: defaultCapacityType.id,
        // Use null to prevent the "controlled to uncontrolled" error
        // if the data for the associated capacity is empty.
        // [capacityMeta.formKey]:
        //   capacityMeta.data.length > 0 ? capacityMeta.data[0].id : null,
        // Reset the other capacity IDs to null as a clean-up step.
        personCapacityId: null,
        weightId: null,
      }));
    }
  };

  useEffect(() => {
    setDefaultCap();
  }, [capacityTypes]);

  // Fetch data
  useEffect(() => {
    setLoading(true);
    fetchAirTypes();
    fetchAirSystems();
    fetchCapacityData();
    setLoading(false);
  }, []);

  const fetchAirTypes = async () => {
    try {
      //const res = await axiosInstance.get("/api/air-type", {
      const res = await axiosInstance.get(API_ENDPOINTS.AIR_TYPE, {});

      if (res.data.success) {
        setAirTypes(res.data.data);
        // console.log(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch Air Types:", err);
    }
  };

  const fetchAirSystems = async () => {
    try {
      // const res = await axiosInstance.get("/api/air-system", {
      const res = await axiosInstance.get(API_ENDPOINTS.AIR_SYSTEM, {});

      if (res.data.success) {
        setAirSystems(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch Air Systems:", err);
    }
  };

  const fetchCapacityData = async () => {
    try {
      const tenant = localStorage.getItem("tenant");

      const [capRes, personRes, weightRes] = await Promise.all([
        axiosInstance.get(API_CAPACITY_URL, {}),
        axiosInstance.get(API_PERSON_CAPACITY_URL, {}),
        axiosInstance.get(API_WEIGHTS_URL, {}),
      ]);

      const capData = capRes.data;
      const personData = personRes.data;
      const weightData = weightRes.data;

      const capTypes = Array.isArray(capData?.data) ? capData.data : [];
      setCapacityTypes(capTypes);

      if (personData.success) {
        setPersonCapacities(
          Array.isArray(personData?.data) ? personData.data : []
        );
      }

      if (weightData.success) {
        setWeightCapacities(
          Array.isArray(weightData?.data) ? weightData.data : []
        );
      }

      // ✅ Set default capacity type to first value (if exists)
      if (capTypes.length > 0) {
        const firstCapacityType = capTypes[0];
        const capacityMeta = capacityOptionsMap[firstCapacityType.type];

        setAirSystemForm((prevForm) => ({
          ...prevForm,
          capacityTypeId: firstCapacityType.id,
          personCapacityId: null, // Clear other capacity IDs
          weightId: null,
          ...(capacityMeta && capacityMeta.data.length > 0
            ? { [capacityMeta.formKey]: capacityMeta.data[0].id }
            : {}),
        }));
      }
    } catch (err) {
      console.error("Error fetching capacity data:", err);
    }
  };

  // Handle AirType Submit
  const handleAirTypeSubmit = async (e) => {
    e.preventDefault();

    if (!airTypeForm.name.trim()) {
      toast.error("Air Type name cannot be empty");
      return;
    }

    const tenant = localStorage.getItem("tenant");
    const method = editAirTypeId ? "PUT" : "POST";
    // const url = editAirTypeId
    //   ? `/api/air-type/${editAirTypeId}`
    //   : "/api/air-type";
    const url = editAirTypeId
      ? `${API_ENDPOINTS.AIR_TYPE}/${editAirTypeId}`
      : API_ENDPOINTS.AIR_TYPE;

    const httpMethod = method.toLowerCase();

    const res = await axiosInstance[httpMethod](url, airTypeForm, {});

    if (res.data.success) {
      toast.success(
        `Air Type ${editAirTypeId ? "updated" : "created"} successfully`
      );
      fetchAirTypes();
      setAirTypeForm({ name: "", status: true });
      setEditAirTypeId(null);
    } else {
      toast.error(res.data.message || "Error saving Air Type");
    }
  };

  // Handle AirSystem Submit
  const handleAirSystemSubmit = async (e) => {
    e.preventDefault();

    // 1. Data Validation (unchanged)
    const price = parseInt(airSystemForm.price, 10);
    const quantity = parseInt(airSystemForm.quantity, 10);
    const airTypeId = parseInt(airSystemForm.airTypeId, 10);
    const capacityTypeId = parseInt(airSystemForm.capacityTypeId, 10);

    if (
      !airTypeId ||
      !capacityTypeId ||
      isNaN(price) ||
      price <= 0 ||
      isNaN(quantity) ||
      quantity <= 0
    ) {
      toast.error("All fields must be valid and positive.");
      return;
    }

    const selectedCapacity = capacityTypes.find(
      (ct) => ct.id === capacityTypeId
    );

    if (!selectedCapacity) {
      toast.error("Invalid Capacity Type selected.");
      return;
    }

    const selectedValueId = airSystemForm[capacityMeta.formKey];

    if (!selectedValueId || isNaN(parseInt(selectedValueId, 10))) {
      toast.error(
        `Please select a valid ${selectedCapacity.type.toLowerCase()} capacity.`
      );
      return;
    }

    // 2. Construct Payload
    const newAirSystem = {
      id: editAirSystemId || null,
      airTypeId: airTypeId,
      price: price,
      quantity: quantity,
      capacityTypeId: capacityTypeId,
      [capacityMeta.formKey]: parseInt(selectedValueId, 10),
    };

    // 3. Duplicate Check
    const duplicate = airSystems.some((s) => {
      // Check if a system with the same type, capacity type, and value already exists.
      const isSameType = s.airTypeId === newAirSystem.airTypeId;
      const isSameCapacityType =
        s.capacityTypeId === newAirSystem.capacityTypeId;

      // Check the specific capacity value (personId or weightId)
      const isSameCapacityValue =
        newAirSystem.capacityTypeId === 1
          ? s.personCapacityId === newAirSystem.personId
          : s.weightId === newAirSystem.weightId;

      // For edits, make sure we're not comparing against the item being edited.
      const isNotSelf = s.id !== editAirSystemId;

      return (
        isSameType && isSameCapacityType && isSameCapacityValue && isNotSelf
      );
    });

    if (duplicate) {
      toast.error("An Air System with this configuration already exists.");
      return;
    }

    // 4. API Call
    try {
      const method = editAirSystemId ? "put" : "post";
      // const url = editAirSystemId
      //   ? `/api/air-system/${editAirSystemId}`
      //   : "/api/air-system";
      const url = editAirSystemId
        ? `${API_ENDPOINTS.AIR_SYSTEM}/${editAirSystemId}`
        : API_ENDPOINTS.AIR_SYSTEM;

      const res = await axiosInstance[method](url, newAirSystem);

      const result = res.data;

      if (!result.success) {
        throw new Error(result.message || "Something went wrong.");
      }

      toast.success(
        result.message ||
          `Air System ${editAirSystemId ? "updated" : "created"}`
      );

      // 5. Update state and reset form
      if (editAirSystemId) {
        setAirSystems((prev) =>
          prev.map((s) => (s.id === editAirSystemId ? result.data : s))
        );
      } else {
        setAirSystems((prev) => [...prev, result.data]);
      }

      setEditAirSystemId(null);
      const defaultCapacityType = capacityTypes[0];
      const capacityMeta = capacityOptionsMap[defaultCapacityType.type];

      setAirSystemForm({
        airTypeId: "",
        price: "",
        quantity: "",
        capacityTypeId: defaultCapacityType.id,
        [capacityMeta.formKey]:
          capacityMeta.data.length > 0 ? capacityMeta.data[0].id : "",
        personCapacityId: "",
        weightId: "",
      });
    } catch (err) {
      console.error("Error saving air system:", err);
      toast.error(err.message || "Failed to save Air System");
    }
  };

  const handleDelete = async (type, id) => {
    if (!id || isNaN(id)) {
      toast.error("Invalid ID for deletion.");
      console.error("Invalid delete ID:", id);
      return;
    }

    // Just in case you need to do type-specific usage checks later
    if (type === "airType") {
      // Example: check if any air systems use this air type
      const inUse = airSystems.some((sys) => sys.airTypeId === id);
      if (inUse) {
        toast.error("Cannot delete. This Air Type is in use by an Air System.");
        return;
      }
    }

    const selectedItem =
      type === "airType"
        ? airTypes.find((a) => a.id === id)
        : airSystems.find((s) => s.id === id);

    if (!selectedItem) {
      toast.error(
        `${type === "airType" ? "Air Type" : "Air System"} not found.`
      );
      return;
    }
    //console.log("==delete====>", selectedItem);

    confirmDeleteWithToast(
      selectedItem.name || selectedItem.airTypeName || "this item",
      async () => {
        try {
          // const url =
          //   type === "airType"
          //     ? `/api/air-type/${id}`
          //     : `/api/air-system/${id}`;
          const url =
            type === "airType"
              ? `${API_ENDPOINTS.AIR_TYPE}/${id}`
              : `${API_ENDPOINTS.AIR_SYSTEM}/${id}`;

          const res = await axiosInstance.delete(url, {});

          const result = res.data;

          if (!result.success) {
            throw new Error(result.message || "Failed to delete");
          }

          toast.success(
            `${
              type === "airType" ? "Air Type" : "Air System"
            } deleted successfully`
          );

          // Refresh list
          if (type === "airType") {
            fetchAirTypes();
          } else {
            fetchAirSystems();
          }
        } catch (err) {
          console.error(err);
          toast.error(
            err.response?.data?.message || err.message || "Error deleting"
          );
        }
      }
    );
  };

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
    (ct) => ct.id === airSystemForm.capacityTypeId
  );
  // console.log(selectedType);
  // console.log(capacityOptionsMap);
  const capacityMeta = selectedType
    ? capacityOptionsMap[selectedType.type]
    : null;

  const transformedAirSystems = useMemo(() => {
    // Check if the data exists before transforming
    if (!airSystems || airSystems.length === 0) return [];
    //console.log("---------->", airSystems);
    return airSystems.map((item) => {
      let capacityValue = "N/A";

      if (item.capacityTypeId === 1) {
        capacityValue = item.personCapacityName || "N/A";
      } else if (item.capacityTypeId === 2) {
        capacityValue = `${item.weightName}` || "N/A";
      }

      return {
        ...item,
        capacityValue: capacityValue,
      };
    });
  }, [airSystems]);

  return (
    <div className="space-y-8 w-full p-6 min-h-screen">
      <PageHeader
        title="Air System Types"
        description="Manage air system types for various passenger capacities."
        icon={FanIcon}
      />
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6"> */}
      {/* Air Type Section */}
      {/* <div className="border rounded-lg p-4 shadow-sm"> */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-800 flex items-center gap-2">
          <SquareStack className="w-5 h-5 text-gray-600" />
          Air Types
        </h2>
        <ResponsiveForm
          onSubmit={handleAirTypeSubmit}
          columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          className="mt-4"
        >
          <FormInput
            type="text"
            placeholder="Enter Air Type Name"
            value={airTypeForm.name || ""}
            onChange={(e) =>
              setAirTypeForm({ ...airTypeForm, name: e.target.value })
            }
          />
          <FormSelect
            value={airTypeForm.status ? "true" : "false"}
            onChange={(e) =>
              setAirTypeForm({
                ...airTypeForm,
                status: e.target.value === "true",
              })
            }
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </FormSelect>

          <div className="col-span-auto gap-2 flex items-center">
            <FormButton type="submit" variant="primary">
              {editAirTypeId ? "Update" : "Add"}
            </FormButton>
            {/* {editAirTypeId && ( */}
            <FormButton
              type="button"
              variant="secondary"
              onClick={() => {
                setEditAirTypeId(null);
                setAirTypeForm({ name: "", status: true });
              }}
            >
              Cancel
            </FormButton>
            {/* )} */}
          </div>
        </ResponsiveForm>

        <ReusableTable
          title="Air Type List"
          columns={columnsAirType}
          data={airTypes}
          onEdit={(item) => {
            const originalItem = airTypes.find((t) => t.id === item.id);
            if (originalItem) {
              setEditAirTypeId(originalItem.id);
              setAirTypeForm({
                name: originalItem.name,
                status: originalItem.status,
              });
            }
          }}
          onDelete={(id) => handleDelete("airType", id)}
          searchTerm={airTypeSearch}
          onSearchChange={setAirTypeSearch}
          height="250px"
          pageSize={10}
          combineActions={false}
          loading={loading}
        />
      </div>

      {/* Air System Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Manage Air Systems</h2>
        <ResponsiveForm
          onSubmit={handleAirSystemSubmit}
          columns="grid-cols-1 sm:grid-cols-2"
        >
          <FormSelect
            value={airSystemForm.airTypeId}
            onChange={(e) =>
              setAirSystemForm({
                ...airSystemForm,
                airTypeId: parseInt(e.target.value),
              })
            }
          >
            <option value="">Select Air Type</option>
            {airTypes
              .filter((t) => t.status === true || t.status === "true")
              .map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
          </FormSelect>

          {/* Capacity Type Select */}
          <FormSelect
            value={airSystemForm.capacityTypeId}
            onChange={(e) => {
              const selectedId = parseInt(e.target.value);
              const selectedType = capacityTypes.find(
                (ct) => ct.id === selectedId
              );
              const meta = selectedType
                ? capacityOptionsMap[selectedType.type]
                : null;

              setAirSystemForm({
                ...airSystemForm,
                capacityTypeId: selectedId,
                personCapacityId: null,
                weightId: null,
                ...(meta && meta.data.length > 0
                  ? { [meta.formKey]: meta.data[0].id } // set first option as default
                  : {}),
              });
            }}
          >
            <option value="" disabled>
              Select Capacity Type
            </option>
            {capacityTypes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.type}
              </option>
            ))}
          </FormSelect>

          {/* Conditional Capacity Meta Select */}
          {capacityMeta && (
            <FormSelect
              value={airSystemForm[capacityMeta.formKey] || ""}
              onChange={(e) =>
                setAirSystemForm({
                  ...airSystemForm,
                  [capacityMeta.formKey]: parseInt(e.target.value),
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

          <FormInput
            type="number"
            placeholder="Price"
            value={airSystemForm.price}
            onChange={(e) =>
              setAirSystemForm({ ...airSystemForm, price: e.target.value })
            }
          />
          <FormInput
            type="text"
            placeholder="Quantity"
            value={airSystemForm.quantity}
            onChange={(e) =>
              setAirSystemForm({ ...airSystemForm, quantity: e.target.value })
            }
          />
          <div className="col-span-auto gap-2 flex items-center">
            <FormButton type="submit" variant="primary">
              {editAirSystemId ? "Update" : "Add"}
            </FormButton>
            {/* {editAirSystemId && ( */}
            <FormButton
              type="button"
              variant="secondary"
              onClick={() => {
                setEditAirSystemId(null);
                setAirSystemForm(initialAirSystem);
                setDefaultCap();
              }}
            >
              Cancel
            </FormButton>
            {/* )} */}
          </div>
        </ResponsiveForm>
        {/* {console.log(airSystems, "========", transformedAirSystems)} */}

        <ReusableTable
          title="Air System List"
          columns={columnsAirSystem}
          data={transformedAirSystems}
          onEdit={(item) => {
            let dynamicCapacityKey = {}; // Assuming capacityTypeId: 1 is 'Person' (uses personCapacityId)
            if (item.capacityTypeId === 1) {
              // Map the database field 'personCapacityId' to the form field 'personId'
              dynamicCapacityKey = { personId: item.personCapacityId }; // Assuming capacityTypeId: 2 is 'Weight' (uses weightId)
            } else if (item.capacityTypeId === 2) {
              // Map the database field 'weightId' to the form field 'weightId'
              dynamicCapacityKey = { weightId: item.weightId };
            }
            // This is the correct logic for editing an Air System
            setEditAirSystemId(item.id);
            setAirSystemForm({
              airTypeId: item.airTypeId,
              capacityTypeId: item.capacityTypeId,
              personCapacityId: item.personCapacityId, // Assuming data includes this or is derived
              weightId: item.weightId, // Assuming data includes this or is derived
              price: item.price,
              quantity: item.quantity,
              ...dynamicCapacityKey,
            });
          }}
          onDelete={(id) => handleDelete("airSystem", id)}
          searchTerm={airSystemSearch}
          onSearchChange={setAirSystemSearch}
          height="250px"
          pageSize={10}
          combineActions={false}
          loading={loading}
        />
      </div>
      {/* </div> */}
    </div>
  );
}
