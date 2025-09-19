"use client";

import React, { useState, useEffect, useMemo } from "react";
import { SquareStack, SlidersHorizontal } from "lucide-react";
import PageHeader from "@/components/UI/PageHeader";
import ReusableTable from "@/components/UI/ReusableTable";
import { toast } from "react-hot-toast";
import { confirmDeleteWithToast } from "@/components/UI/toastUtils";
import ResponsiveForm from "@/components/UI/ResponsiveForm";
import {
  FormInput,
  FormButton,
  FormSelect,
} from "@/components/UI/FormElements";
import axiosInstance from "@/utils/axiosInstance";

const CarDoorManagement = () => {
  const API_OPERATOR_URL = "/api/operator-elevator";
  const API_URL = "/api/car-door-types";
  const API_SUBTYPE_URL = "/api/car-door-subTypes";

  const [operatorTypes, setOperatorTypes] = useState([]);
  const [carDoorTypes, setCarDoorTypes] = useState([]);
  const [carDoorSubTypes, setCarDoorSubTypes] = useState([]);

  const [editTypeId, setEditTypeId] = useState(null);
  const [editSubId, setEditSubId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [typeSearch, setTypeSearch] = useState("");
  const [subSearch, setSubSearch] = useState("");
  const [error, setError] = useState(false);

  const initialTypes = {
    operatorTypeId: "",
    carDoorType: "",
  };
  const initialSubTypes = {
    operatorTypeId: "",
    carDoorType: "",
    carDoorSubType: "",
    price: "",
  };

  const columnsCarDoorType = [
    {
      key: "operatorElevatorName",
      label: "Operator Type",
      sortable: true,
      align: "text-left",
    },
    {
      key: "carDoorType",
      label: "Car Door Type",
      align: "text-center",
      sortable: true,
    },
  ];

  const columnslandingDoorSubType = [
    {
      key: "operatorElevatorName",
      label: "Operator Type",
      sortable: true,
      align: "text-left",
    },
    {
      key: "carDoorType",
      label: "Car Door Type",
      align: "text-center",
      sortable: true,
    },
    {
      key: "carDoorSubType",
      label: "Car Door SubType",
      align: "text-center",
      sortable: true,
    },
    {
      key: "price",
      label: "Price",
      align: "text-center",
      sortable: true,
      render: (row) => (
        <span className="text-gray-700">
          {row.price ? `₹ ${parseFloat(row.price).toFixed(2)}` : "N/A"}
        </span>
      ),
    },
  ];

  const [typeForm, setTypeForm] = useState({ initialTypes });

  const [subForm, setSubForm] = useState({ initialSubTypes });

  // 1️⃣ Define fetchAll OUTSIDE useEffect so it can be reused
  const fetchAll = async () => {
    const tenant = localStorage.getItem("tenant");
    if (!tenant) {
      toast.error("Tenant not found in localStorage");
      return;
    }

    try {
      setLoading(true);

      // 🔹 Use axiosInstance to fetch all three resources concurrently
      const [operatorRes, carDoorTypeRes, carDoorSubTypeRes] =
        await Promise.all([
          axiosInstance.get(API_OPERATOR_URL),
          axiosInstance.get(API_URL),
          axiosInstance.get(API_SUBTYPE_URL),
        ]);

      const operatorList = Array.isArray(operatorRes.data?.data)
        ? operatorRes.data.data
        : [];

      const carTypeList = (
        Array.isArray(carDoorTypeRes.data?.data) ? carDoorTypeRes.data.data : []
      )
        .filter((item) => item.carDoorId || item.id)
        .map((item) => ({
          ...item,
          id: item.carDoorId || item.id,
          carDoorId: item.carDoorId || item.id,
        }));

      const carSubTypeList = (
        Array.isArray(carDoorSubTypeRes.data?.data)
          ? carDoorSubTypeRes.data.data
          : []
      )
        .filter((item) => item.carDoorSubTypeId || item.id)
        .map((item) => ({
          ...item,
          id: item.carDoorSubTypeId || item.id,
          carDoorSubTypeId: item.carDoorSubTypeId || item.id,
        }));

      setOperatorTypes(operatorList);
      setCarDoorTypes(carTypeList);
      setCarDoorSubTypes(carSubTypeList);
    } catch (err) {
      toast.error("Failed to fetch operator or door data.");
      console.error("Axios fetch error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // 2️⃣ Call once on mount
  useEffect(() => {
    fetchAll();
  }, []);

  const handleTypeSubmit = async (e) => {
    e.preventDefault();

    const name = typeForm.carDoorType.trim().toUpperCase();
    if (!name) {
      toast.error("Car Door Type cannot be empty");
      return;
    }

    if (!typeForm.operatorTypeId) {
      toast.error("Operator Type must be selected");
      return;
    }

    console.log("Submitting car door type:", name, typeForm);
    console.log("carDoorTypes:", carDoorTypes);
    console.log("editTypeId:", editTypeId);
    const isDuplicate = carDoorTypes.some(
      (t) =>
        t.carDoorType?.toUpperCase() === name &&
        t.operatorElevatorId == typeForm.operatorTypeId &&
        t.carDoorId !== editTypeId
    );

    if (isDuplicate) {
      toast.error("Car Door Type already exists with selected Operator.");
      return;
    }
    setLoading(true);
    try {
      const tenant = localStorage.getItem("tenant");
      const method = editTypeId ? "put" : "post"; // Axios methods are lowercase
      const url = editTypeId ? `${API_URL}/${editTypeId}` : API_URL;

      const { data } = await axiosInstance({
        url,
        method,
        data: {
          operatorElevatorId: typeForm.operatorTypeId,
          carDoorType: name,
          carDoorId: editTypeId || undefined,
        },
      });

      toast.success(
        editTypeId
          ? "Car Door Type updated successfully"
          : "Car Door Type added successfully"
      );

      await fetchAll();

      // setCarDoorTypes((prev) => {
      //   if (editTypeId) {
      //     return prev.map((t) => (t.carDoorId === editTypeId ? data.data : t));
      //   } else {
      //     return [...prev, data.data];
      //   }
      // });

      // // 🔹 Sync subtypes' operator name & car door type
      // setCarDoorSubTypes((prev) =>
      //   prev.map((sub) => {
      //     if (sub.carDoorTypeId === data.data.carDoorId) {
      //       return {
      //         ...sub,
      //         operatorElevatorId: data.data.operatorElevatorId,
      //         operatorElevatorName: data.data.operatorElevatorName, // so table updates instantly
      //         carDoorType: data.data.carDoorType, // update name
      //       };
      //     }
      //     return sub;
      //   })
      // );

      // setCarDoorTypes((prev) => {
      //   const updatedItem = {
      //     ...data.data,
      //     carDoorId: data.data.carDoorId || data.data.id,
      //     id: data.data.carDoorId || data.data.id,
      //   };
      //   if (editTypeId) {
      //     return prev.map((t) =>
      //       (t.carDoorId || t.id) === editTypeId ? updatedItem : t
      //     );
      //   } else {
      //     return [...prev, updatedItem];
      //   }
      // });

      // setCarDoorSubTypes((prev) =>
      //   prev.map((sub) =>
      //     sub.carDoorTypeId ===
      //     (editTypeId || data.data.carDoorId || data.data.id)
      //       ? { ...sub, carDoorType: name }
      //       : sub
      //   )
      // );

      setEditTypeId(null);
      setTypeForm(initialTypes);
    } catch (error) {
      console.error("Error saving landing door type:", error);
      toast.error(
        error.response?.data?.message || "Failed to save landing door type"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTypeEdit = (item) => {
    if (!item || !(item.carDoorId || item.id)) {
      toast.error("Invalid Car Door Type ID.");
      console.log("Invalid item for edit:", item);
      return;
    }
    console.log("Editing car door type:", item);

    setTypeForm({
      operatorTypeId: item.operatorElevatorId || "",
      carDoorType: item.carDoorType || "",
    });
    setEditTypeId(item.carDoorId || item.id);
    // Reset the subtype form when editing a type
    // setSubForm({
    //   operatorTypeId: "",
    //   landingDoorType: "",
    //   landingDoorSubType: "",
    //   price: "",
    // });
    // setEditSubId(null);
  };

  const handleTypeDelete = async (id) => {
    if (!id || isNaN(id)) {
      toast.error("Invalid ID for deletion.");
      console.log("Invalid delete ID:", id);
      return;
    }

    // Check if any subtypes are linked to this car door type
    const hasSubtypes = carDoorSubTypes.some((sub) => sub.carDoorTypeId === id);

    if (hasSubtypes) {
      toast.error("Cannot delete. This Car Door Type is in use by a subtype.");
      return;
    }

    const selected = carDoorTypes.find((d) => d.id === id);
    if (!selected) {
      toast.error("Car Door Type not found.");
      return;
    }

    confirmDeleteWithToast(selected.carDoorType, async () => {
      try {
        // 🔹 Delete the Car Door Type
        await axiosInstance.delete(`${API_URL}/${id}`);

        toast.success("Car Door Type deleted successfully");

        // 🔹 Refresh car door types
        const { data } = await axiosInstance.get(API_URL);
        setCarDoorTypes(Array.isArray(data?.data) ? data.data : []);
      } catch (err) {
        console.error(err);
        toast.error(
          err.response?.data?.message ||
            err.message ||
            "Error deleting Car Door Type"
        );
      }
    });
  };

  const handleSubSubmit = async (e) => {
    e.preventDefault();
    const name = subForm.carDoorSubType.trim().toUpperCase();
    if (!name) {
      toast.error("Car Door SubType cannot be empty");
      return;
    }
    if (!subForm.operatorTypeId) {
      toast.error("Operator Type must be selected");
      return;
    }
    if (!subForm.carDoorType) {
      toast.error("Car Door Type must be selected");
      return;
    }
    console.log("Submitting car door subtype:", name, subForm);
    console.log("carDoorSubTypes:", carDoorSubTypes);
    console.log("editSubId:", editSubId);

    const isDuplicate = carDoorSubTypes.some(
      (t) =>
        t.carDoorSubType?.toUpperCase() ===
          subForm.carDoorSubType.toUpperCase() &&
        t.operatorElevatorId == subForm.operatorTypeId &&
        t.carDoorTypeId == subForm.carDoorType &&
        t.id !== editSubId
    );
    if (isDuplicate) {
      toast.error(
        "Car Door SubType already exists with selected Operator and Car Door Type."
      );
      return;
    }
    setLoading(true);
    try {
      setLoading(true);

      const payload = {
        operatorElevatorId: subForm.operatorTypeId,
        carDoorTypeId: subForm.carDoorType,
        carDoorSubType: name,
        price: subForm.price,
        carDoorSubTypeId: editSubId || undefined,
      };

      const url = editSubId ? `${API_SUBTYPE_URL}/${editSubId}` : API_SUBTYPE_URL;

      const { data } = await axiosInstance({
        method: editSubId ? "put" : "post",
        url,
        data: payload,
      });

      toast.success(
        editSubId
          ? "Car Door SubType updated successfully"
          : "Car Door SubType added successfully"
      );

      setCarDoorSubTypes((prev) => {
        if (editSubId) {
          return prev.map((t) => (t.id === editSubId ? data.data : t));
        } else {
          return [...prev, data.data];
        }
      });

      setEditSubId(null);
      setSubForm(initialSubTypes);
    } catch (error) {
      console.error("Error saving car door subtype:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to save car door subtype"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubEdit = (item) => {
    if (!item || !item.id) {
      toast.error("Invalid Car Door SubType ID.");
      console.log("Invalid item for edit:", item);
      return;
    }
    console.log("Editing car door subtype:", item);
    setSubForm({
      operatorTypeId: item.operatorElevatorId || "",
      carDoorType: item.carDoorTypeId || "",
      carDoorSubType: item.carDoorSubType || "",
      price: item.price || "",
    });
    setEditSubId(item.id);
    // Reset the type form when editing a subtype
    setTypeForm(initialTypes);
    setEditTypeId(null);
  };
  const handleSubDelete = async (id) => {
    if (!id || isNaN(id)) {
      toast.error("Invalid ID for deletion.");
      console.log("Invalid delete ID:", id);
      return;
    }
    const selected = carDoorSubTypes.find((d) => d.id === id);
    if (!selected) {
      toast.error("Car Door SubType not found.");
      return;
    }
    confirmDeleteWithToast(selected.carDoorSubType, async () => {
      try {
        setLoading(true);

        // Delete the Car Door SubType
        await axiosInstance.delete(`${API_SUBTYPE_URL}/${id}`);

        toast.success("Car Door SubType deleted successfully");

        // Refresh Car Door SubTypes
        const { data } = await axiosInstance.get(API_SUBTYPE_URL);
        setCarDoorSubTypes(Array.isArray(data?.data) ? data.data : []);
      } catch (error) {
        console.error("Error deleting Car Door SubType:", error);
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Error deleting Car Door SubType"
        );
      } finally {
        setLoading(false);
      }
    });
  };

  const transformedSubTypes = useMemo(() => {
    return carDoorSubTypes.map((sub) => {
      const carDoorType = carDoorTypes.find(
        (type) => type.id === sub.carDoorTypeId
      );
      const operatorType = operatorTypes.find(
        (type) => type.id === sub.operatorElevatorId
      );
      return {
        ...sub,
        carDoorType: carDoorType ? carDoorType.carDoorType : "Unknown",
        operatorElevatorName: operatorType
          ? operatorType.name
          : "Unknown Operator",
        id: sub.id, // Ensure id is set for table operations
      };
    });
  }, [carDoorSubTypes, carDoorTypes, operatorTypes]);

  const filteredTypes = useMemo(() => {
    const term = typeSearch.toLowerCase();

    return carDoorTypes
      .filter((t) => {
        //console.log(t, "Filtering car door types with term:", term);
        const carDoorMatch = t?.carDoorType?.toLowerCase().includes(term);
        const operatorMatch = t?.operatorElevatorName
          ?.toLowerCase()
          .includes(term);
        return carDoorMatch || operatorMatch;
      })
      .map((t) => ({
        ...t,
        id: t.id,
      }));
  }, [carDoorTypes, typeSearch]);

  return (
    <div className="space-y-8 w-full p-6 min-h-screen">
      <PageHeader
        title="Car Door Types & SubTypes - Price Management"
        description="Manage and categorize types of car door and their subtypes."
        icon={SlidersHorizontal}
      />

      {/* Car Door Type Form Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-800 flex items-center gap-2">
          <SquareStack className="w-5 h-5 text-gray-600" />
          Car Door Types
        </h2>
        <ResponsiveForm
          onSubmit={handleTypeSubmit}
          columns="grid-cols-1 sm:grid-cols-3"
          gap="gap-4"
          className="mt-4 mb-3"
        >
          <FormSelect
            value={typeForm.operatorTypeId || ""}
            onChange={(e) =>
              setTypeForm({ ...typeForm, operatorTypeId: e.target.value })
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

          <FormInput
            type="text"
            placeholder="Enter Landing Door Type"
            value={typeForm.carDoorType || ""}
            onChange={(e) =>
              setTypeForm({ ...typeForm, carDoorType: e.target.value })
            }
            required
          />

          <div className="col-span-auto gap-2 flex items-center">
            <FormButton type="submit" variant="primary" className="w-auto">
              {editTypeId ? "Update" : "Add"}
            </FormButton>

            {editTypeId && (
              <FormButton
                type="button"
                variant="secondary"
                onClick={() => {
                  setEditTypeId(null);
                  setTypeForm({ operatorTypeId: "", carDoorType: "" });
                }}
                className="w-auto"
              >
                Cancel
              </FormButton>
            )}
          </div>
        </ResponsiveForm>

        <ReusableTable
          title="Car Door Type List"
          columns={columnsCarDoorType}
          data={filteredTypes}
          onEdit={(item) => handleTypeEdit(item)}
          onDelete={(id) => handleTypeDelete(id)}
          searchTerm={typeSearch}
          onSearchChange={setTypeSearch}
          height="250px"
          pageSize={10}
          combineActions={false}
          loading={loading}
        />
      </div>

      {/* Car Door SubType Form Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-800 flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-gray-600" />
          Car Door SubTypes
        </h2>

        <ResponsiveForm
          onSubmit={handleSubSubmit}
          columns="grid-cols-1 sm:grid-cols-3 lg:grid-cols-5"
          gap="gap-4"
          className="mt-4 mb-3"
        >
          <FormSelect
            value={subForm.operatorTypeId || ""}
            onChange={(e) => {
              const newOperatorId = e.target.value;

              // If adding a new record, reset the dependent fields
              if (!editSubId) {
                setSubForm({
                  ...initialSubTypes,
                  operatorTypeId: newOperatorId,
                });
              } else {
                // If editing, just update operatorTypeId, keep other fields
                setSubForm((prev) => ({
                  ...prev,
                  operatorTypeId: newOperatorId,
                }));
              }
            }}
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
            value={subForm.carDoorType || ""}
            onChange={(e) => {
              const selectedId = parseInt(e.target.value);
              setSubForm((prevForm) => ({
                ...prevForm,
                carDoorType: selectedId,
              }));
            }}
          >
            <option value="">Select Car Door Type</option>
            {carDoorTypes
              .filter(
                (type) => type.operatorElevatorId == subForm.operatorTypeId
              )
              .map((type) => (
                <option key={type.id} value={type.id}>
                  {type.carDoorType}
                </option>
              ))}
          </FormSelect>

          <FormInput
            type="text"
            placeholder="Enter Car Door SubType"
            value={subForm.carDoorSubType || ""}
            onChange={(e) =>
              setSubForm({ ...subForm, carDoorSubType: e.target.value })
            }
            required
          />

          <FormInput
            type="number"
            placeholder="Enter Price"
            value={subForm.price || ""}
            onChange={(e) => setSubForm({ ...subForm, price: e.target.value })}
            required
          />

          <div className="flex gap-2">
            <FormButton type="submit" variant="primary">
              {editSubId ? "Update" : "Add"}
            </FormButton>

            {editSubId && (
              <FormButton
                type="button"
                variant="secondary"
                onClick={() => {
                  setEditSubId(null);
                  setSubForm(initialSubTypes);
                }}
              >
                Cancel
              </FormButton>
            )}
          </div>
        </ResponsiveForm>

        <ReusableTable
          title="Landing Door Subtype List"
          columns={columnslandingDoorSubType}
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
};

export default CarDoorManagement;
