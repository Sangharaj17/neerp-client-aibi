"use client";

import React, { useState, useEffect, useMemo } from "react";
import { SlidersHorizontal, SquareStack } from "lucide-react";
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

export default function LandingDoorTypeAndSubType() {
  const API_URL = "/api/landing-door-type";
  const API_OPERATOR_URL = "/api/operator-elevator";
  const API_SUBTYPE_URL = "/api/landing-door-subType";

  const [operatorTypes, setOperatorTypes] = useState([]);
  const [landingDoorTypes, setLandingDoorTypes] = useState([]);
  const [landingDoorSubTypes, setLandingDoorSubTypes] = useState([]);

  const [editTypeId, setEditTypeId] = useState(null);
  const [editSubId, setEditSubId] = useState(null);
  const [typeSearch, setTypeSearch] = useState("");
  const [subSearch, setSubSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Use separate state for each form to prevent cross-contamination
  const [typeForm, setTypeForm] = useState({
    operatorTypeId: "",
    landingDoorType: "",
  });
  const [subForm, setSubForm] = useState({
    operatorTypeId: "",
    landingDoorType: "",
    landingDoorSubType: "",
    price: "",
  });

  const fetchAll = async () => {
    const tenant = localStorage.getItem("tenant");
    try {
      setLoading(true);

      const [operatorRes, landingDoorTypeRes, landingDoorSubTypeRes] =
        await Promise.all([
          axiosInstance.get(API_OPERATOR_URL),
          axiosInstance.get(API_URL),
          axiosInstance.get(API_SUBTYPE_URL),
        ]);

      const operatorList = Array.isArray(operatorRes.data?.data)
        ? operatorRes.data.data
        : [];

      const doorTypeList = Array.isArray(landingDoorTypeRes.data?.data)
        ? landingDoorTypeRes.data.data
        : landingDoorTypeRes.data?.landingDoorTypes || [];

      const doorSubTypeList = Array.isArray(landingDoorSubTypeRes.data?.data)
        ? landingDoorSubTypeRes.data.data
        : landingDoorSubTypeRes.data?.landingDoorSubTypes || [];

      setOperatorTypes(operatorList);
      setLandingDoorTypes(doorTypeList);
      setLandingDoorSubTypes(doorSubTypeList);
    } catch (err) {
      toast.error("Failed to fetch operator or door data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // Handler for editing Landing Door Type
  const handleTypeEdit = (item) => {
    if (!item) {
      toast.error("Landing Door Type not found.");
      return;
    }
    setTypeForm({
      operatorTypeId: item.operatorTypeId || "",
      landingDoorType: item.doorType || "",
    });
    setEditTypeId(item.doorTypeId);
    // Reset the subtype form when editing a type
    setSubForm({
      operatorTypeId: "",
      landingDoorType: "",
      landingDoorSubType: "",
      price: "",
    });
    setEditSubId(null);
  };

  const handleTypeSubmit = async (e) => {
    e.preventDefault();

    const name = typeForm.landingDoorType.trim().toUpperCase();
    if (!name) {
      toast.error("Landing Door Type cannot be empty");
      return;
    }

    if (!typeForm.operatorTypeId) {
      toast.error("Operator Type must be selected");
      return;
    }

    const isDuplicate = landingDoorTypes.some(
      (t) =>
        t.doorType?.toUpperCase() === name &&
        t.operatorTypeId == typeForm.operatorTypeId &&
        t.doorTypeId !== editTypeId
    );

    if (isDuplicate) {
      toast.error("Landing Door Type already exists with selected Operator.");
      return;
    }

    try {
      const url = editTypeId ? `${API_URL}/${editTypeId}` : API_URL;
      const method = editTypeId ? "put" : "post";

      const payload = {
        doorType: name,
        operatorTypeId: typeForm.operatorTypeId,
      };

      const { data } = await axiosInstance({
        method,
        url,
        data: payload,
      });

      toast.success(
        `Landing Door Type ${editTypeId ? "updated" : "added"} successfully`
      );

      // Reset form and edit state
      setTypeForm({ operatorTypeId: "", landingDoorType: "" });
      setEditTypeId(null);

      // Refresh the list
      await fetchAll();
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Error saving landing door type"
      );
    }
  };

  const handleTypeDelete = async (id) => {
    if (!id || isNaN(id)) {
      toast.error("Invalid ID for deletion.");
      console.error("Invalid delete ID:", id);
      return;
    } // Check if any subtypes are linked to this landing door type

    const hasSubtypes = landingDoorSubTypes.some(
      (sub) => sub.landingDoorTypeId === id
    );

    if (hasSubtypes) {
      toast.error(
        "Cannot delete. This Landing Door Type is in use by a subtype."
      );
      return;
    }

    const selected = landingDoorTypes.find((d) => d.doorTypeId === id);
    if (!selected) {
      toast.error("Landing Door Type not found.");
      return;
    }

    confirmDeleteWithToast(selected.doorType, async () => {
      try {
        await axiosInstance.delete(`${API_URL}/${id}`);

        toast.success("Landing Door Type deleted successfully");

        // Refresh the list
        const { data } = await axiosInstance.get(API_URL);
        setLandingDoorTypes(Array.isArray(data?.data) ? data.data : []);
      } catch (err) {
        console.error(err);
        toast.error(err.message || "Error deleting Landing Door Type");
      }
    });
  };

  // Handler for editing Landing Door Subtype
  const handleSubEdit = (item) => {
    if (!item) {
      toast.error("Landing Door SubType not found.");
      return;
    }

    setSubForm({
      operatorTypeId: item.operatorTypeId || "",
      landingDoorType: item.landingDoorTypeId || "",
      landingDoorSubType: item.subType || "",
      price: item.price || "",
    });
    setEditSubId(item.id);
    // Reset the type form when editing a subtype
    setTypeForm({
      operatorTypeId: "",
      landingDoorType: "",
    });
    setEditTypeId(null);
  };

  const handleSubSubmit = async (e) => {
    e.preventDefault();

    const name = subForm.landingDoorSubType.trim().toUpperCase();

    // Basic validations
    if (!name) {
      toast.error("Landing Door SubType cannot be empty");
      return;
    }
    if (!subForm.operatorTypeId) {
      toast.error("Operator Type must be selected");
      return;
    }
    if (!subForm.landingDoorType) {
      toast.error("Landing Door Type must be selected");
      return;
    }
    if (!subForm.price || isNaN(subForm.price) || subForm.price <= 0) {
      toast.error("Price must be a valid positive number");
      return;
    }

    // Check for duplicate
    const isDuplicate = landingDoorSubTypes.some(
      (t) =>
        t.subType?.toUpperCase() === name &&
        t.operatorTypeId == subForm.operatorTypeId &&
        t.landingDoorTypeId == subForm.landingDoorType &&
        t.subTypeId !== editSubId
    );
    if (isDuplicate) {
      toast.error(
        "Landing Door SubType already exists with selected Operator and Door Type."
      );
      return;
    }

    try {
      const url = editSubId
        ? `${API_SUBTYPE_URL}/${editSubId}`
        : API_SUBTYPE_URL;
      const method = editSubId ? "put" : "post";

      const payload = {
        subType: name,
        operatorTypeId: subForm.operatorTypeId,
        doorTypeId: subForm.landingDoorType,
        price: parseFloat(subForm.price),
      };

      await axiosInstance({
        method,
        url,
        data: payload,
      });

      toast.success(
        `Landing Door SubType ${editSubId ? "updated" : "added"} successfully`
      );

      // Reset form and edit states
      setSubForm({
        operatorTypeId: "",
        landingDoorType: "",
        landingDoorSubType: "",
        price: "",
      });
      setEditSubId(null);
      setEditTypeId(null);

      // Refresh subtype list
      const { data } = await axiosInstance.get(API_SUBTYPE_URL);
      setLandingDoorSubTypes(Array.isArray(data?.data) ? data.data : []);
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Error saving Landing Door SubType."
      );
    }
  };

  const handleSubDelete = async (id) => {
    if (!id || isNaN(id)) {
      toast.error("Invalid ID for deletion.");
      console.error("Invalid delete ID:", id);
      return;
    }
    //console.log(landingDoorSubTypes);
    //console.log("Deleting subtype with ID:", id);
    const selected = landingDoorSubTypes.find((d) => d.id === id);
    if (!selected) {
      toast.error("Landing Door SubType not found.");
      return;
    }
    confirmDeleteWithToast(selected.subType, async () => {
      try {
        // Delete the subtype
        await axiosInstance.delete(`${API_SUBTYPE_URL}/${id}`);

        toast.success("Landing Door SubType deleted successfully");

        // Refresh the subtype list
        const { data } = await axiosInstance.get(API_SUBTYPE_URL);
        setLandingDoorSubTypes(Array.isArray(data?.data) ? data.data : []);
      } catch (err) {
        console.error(err);
        toast.error(
          err.response?.data?.message ||
            err.message ||
            "Error deleting Landing Door SubType"
        );
      }
    });
  };

  const filteredTypes = useMemo(() => {
    const term = typeSearch.toLowerCase();
    return landingDoorTypes
      .filter((t) => t?.doorType?.toLowerCase().includes(term))
      .map((t) => ({
        ...t,
        id: t.doorTypeId,
      }));
  }, [landingDoorTypes, typeSearch]);

  const transformedSubTypes = useMemo(() => {
    const term = subSearch.toLowerCase();
    return landingDoorSubTypes
      .filter((t) => t?.name?.toLowerCase().includes(term))
      .map((t) => ({
        id: t.id,
        subType: t.name,
        price: t.prize ?? "-",
        operatorTypeName:
          operatorTypes.find((o) => o.id === t.operatorTypeId)?.name ||
          "Unknown Operator",
        mainDoorType:
          landingDoorTypes.find((d) => d.doorTypeId === t.landingDoorTypeId)
            ?.doorType || "Unknown Type",
        operatorTypeId: t.operatorTypeId,
        landingDoorTypeId: t.landingDoorTypeId,
      }));
  }, [landingDoorSubTypes, subSearch, operatorTypes, landingDoorTypes]);

  const columnslandingDoorType = [
    {
      key: "operatorTypeName",
      label: "Operator Type",
      sortable: true,
      align: "text-left",
    },
    {
      key: "doorType",
      label: "Landing Door Type",
      align: "text-center",
      sortable: true,
    },
  ];

  const columnslandingDoorSubType = [
    {
      key: "operatorTypeName",
      label: "Operator Type",
      sortable: true,
      align: "text-left",
    },
    {
      key: "mainDoorType",
      label: "Landing Door Type",
      sortable: true,
      align: "text-left",
    },
    {
      key: "subType",
      label: "Landing Door SubType",
      align: "text-left",
      sortable: true,
    },
    {
      key: "price",
      label: "Price",
      align: "text-center",
      sortable: true,
    },
  ];

  return (
    <div className="space-y-8 w-full p-6 min-h-screen">
      <PageHeader
        title="Landing Door Types & SubTypes - Price Management"
        description="Manage and categorize types of landing door and their subtypes."
        icon={SlidersHorizontal}
      />

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-800 flex items-center gap-2">
          <SquareStack className="w-5 h-5 text-gray-600" />
          Landing Door Types
        </h2>
        <ResponsiveForm
          onSubmit={handleTypeSubmit}
          columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          className="mt-4"
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
            value={typeForm.landingDoorType || ""}
            onChange={(e) =>
              setTypeForm({ ...typeForm, landingDoorType: e.target.value })
            }
            required
          />

          <div className="col-span-auto gap-2 flex items-center">
            <FormButton type="submit" variant="primary">
              {editTypeId ? "Update" : "Add"}
            </FormButton>

            {editTypeId && (
              <FormButton
                type="button"
                variant="secondary"
                onClick={() => {
                  setEditTypeId(null);
                  setTypeForm({ operatorTypeId: "", landingDoorType: "" });
                }}
              >
                Cancel
              </FormButton>
            )}
          </div>
        </ResponsiveForm>

        <ReusableTable
          title="Landing Door Type List"
          columns={columnslandingDoorType}
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

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-800 flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-gray-600" />
          Landing Door SubTypes
        </h2>

        <ResponsiveForm
          onSubmit={handleSubSubmit}
          columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-5"
          className="mt-4 mb-3"
        >
          <FormSelect
            value={subForm.operatorTypeId || ""}
            onChange={(e) => {
              const newOperatorId = e.target.value;

              if (!editSubId) {
                // Add Mode: reset dependent fields
                setSubForm((prevForm) => ({
                ...prevForm,
                  operatorTypeId: newOperatorId,
                }));
              } else {
                // Edit Mode: keep other values, just change operatorTypeId
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
            value={subForm.landingDoorType || ""}
            onChange={(e) => {
              const selectedId = parseInt(e.target.value);
              setSubForm((prevForm) => ({
                ...prevForm,
                landingDoorType: selectedId,
              }));
            }}
          >
            <option value="">Select Landing Door Type</option>
            {landingDoorTypes
              .filter((type) => type.operatorTypeId == subForm.operatorTypeId)
              .map((type) => (
                <option key={type.doorTypeId} value={type.doorTypeId}>
                  {type.doorType}
                </option>
              ))}
          </FormSelect>

          <FormInput
            type="text"
            placeholder="Enter Landing Door SubType"
            value={subForm.landingDoorSubType || ""}
            onChange={(e) =>
              setSubForm({ ...subForm, landingDoorSubType: e.target.value })
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

          <div className="col-span-auto gap-2 flex items-center">
            <FormButton className="w-auto" type="submit" variant="primary">
              {editSubId ? "Update" : "Add"}
            </FormButton>

            {editSubId && (
              <FormButton
                className="w-auto"
                type="button"
                variant="secondary"
                onClick={() => {
                  setEditSubId(null);
                  setSubForm({
                    operatorTypeId: "",
                    landingDoorType: "",
                    landingDoorSubType: "",
                    price: "",
                  });
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
}
