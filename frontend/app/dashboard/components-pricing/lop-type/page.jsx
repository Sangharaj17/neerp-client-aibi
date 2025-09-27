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
import { API_ENDPOINTS } from "@/utils/apiEndpoints";

export default function LopTypeAndSubType() {
  // const API_URL = "/api/lop-type";
  // const API_SUBTYPE_URL = "/api/lop-sub-type";
  // const API_OPERATOR_URL = "/api/operator-elevator";
  // const API_FLOOR_URL = "/api/floors";

  const API_URL = API_ENDPOINTS.LOP_TYPE;
  const API_SUBTYPE_URL = API_ENDPOINTS.LOP_SUBTYPE;
  const API_OPERATOR_URL = API_ENDPOINTS.OPERATOR;
  const API_FLOOR_URL = API_ENDPOINTS.FLOORS;

  const [operatorTypes, setOperatorTypes] = useState([]);
  const [floors, setFloors] = useState([]);
  const [lopTypes, setLopTypes] = useState([]);
  const [lopSubTypes, setLopSubTypes] = useState([]);

  const [editTypeId, setEditTypeId] = useState(null);
  const [editSubId, setEditSubId] = useState(null);
  const [typeSearch, setTypeSearch] = useState("");
  const [subSearch, setSubSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Use separate state for each form to prevent cross-contamination
  const initialTypes = [
    {
      operatorTypeId: "",
      lopType: "",
    },
  ];

  const initialSubTypes = [
    {
      operatorTypeId: "",
      lopType: "",
      floor: "",
      lopSubType: "",
      price: "",
    },
  ];

  const [typeForm, setTypeForm] = useState({ initialTypes });
  const [subForm, setSubForm] = useState({ initialSubTypes });

  const fetchAll = async () => {
    const tenant = localStorage.getItem("tenant");
    try {
      setLoading(true);
      const [operatorRes, lopTypeRes, lopSubTypeRes, floorRes] =
        await Promise.all([
          axiosInstance.get(API_OPERATOR_URL),
          axiosInstance.get(API_URL),
          axiosInstance.get(API_SUBTYPE_URL),
          axiosInstance.get(API_FLOOR_URL),
        ]);

      const operatorList = Array.isArray(operatorRes.data?.data)
        ? operatorRes.data.data
        : [];

      const lopTypeList = Array.isArray(lopTypeRes.data?.data)
        ? lopTypeRes.data.data
        : lopTypeRes.data?.lopTypes || [];

      const lopSubTypeList = Array.isArray(lopSubTypeRes.data?.data)
        ? lopSubTypeRes.data.data
        : lopSubTypeRes.data?.lopSubTypes || [];

      const floorsList = Array.isArray(floorRes.data?.data)
        ? floorRes.data.data
        : floorRes.data?.lopSubTypes || [];

      setOperatorTypes(operatorList);
      setLopTypes(lopTypeList);
      setLopSubTypes(lopSubTypeList);
      setFloors(floorsList);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to fetch operator or door data."
      );
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
      toast.error("LOP Type not found.");
      return;
    }
    setTypeForm({
      operatorTypeId: item.operatorTypeId || "",
      lopType: item.lopType || "",
    });
    setEditTypeId(item.lopTypeId);
    // Reset the subtype form when editing a type
    setSubForm({ initialSubTypes });
    setEditSubId(null);
  };

  const handleTypeSubmit = async (e) => {
    e.preventDefault();

    const name = typeForm.lopType.trim().toUpperCase();
    if (!name) {
      toast.error("LOP Type cannot be empty");
      return;
    }

    if (!typeForm.operatorTypeId) {
      toast.error("Operator Type must be selected");
      return;
    }

    const isDuplicate = lopTypes.some(
      (t) =>
        t.lopType?.toUpperCase() === name &&
        t.operatorTypeId == typeForm.operatorTypeId &&
        t.lopTypeId !== editTypeId
    );

    if (isDuplicate) {
      toast.error(
        "This LOP Type already exists for the selected Operator and Floor."
      );
      return;
    }

    try {
      const method = editTypeId ? "put" : "post";
      const url = editTypeId ? `${API_URL}/${editTypeId}` : API_URL;

      const payload = {
        lopType: typeForm.lopType.trim().toUpperCase(),
        operatorTypeId: typeForm.operatorTypeId,
      };

      const response = await axiosInstance({
        method,
        url,
        data: payload,
      });

      toast.success(
        `LOP Door Type ${editTypeId ? "updated" : "added"} successfully`
      );

      // Reset form and edit state
      setTypeForm({ initialTypes });
      setEditTypeId(null);
      await fetchAll();
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || err.message || "Error saving lop type"
      );
    }
  };

  const handleTypeDelete = async (id) => {
    if (!id || isNaN(id)) {
      toast.error("Invalid ID for deletion.");
      console.error("Invalid delete ID:", id);
      return;
    } // Check if any subtypes are linked to this lop type

    const hasSubtypes = lopSubTypes.some((sub) => sub.lopTypeId === id);

    if (hasSubtypes) {
      toast.error("Cannot delete. This lop Type is in use by a subtype.");
      return;
    }

    const selected = lopTypes.find((d) => d.lopTypeId === id);
    if (!selected) {
      toast.error("LOP Type not found.");
      return;
    }

    confirmDeleteWithToast(selected.lopType, async () => {
      try {
        await axiosInstance.delete(`${API_URL}/${id}`);

        toast.success("LOP Type deleted successfully");

        // Refresh LOP Types
        const { data } = await axiosInstance.get(API_URL);
        setLopTypes(Array.isArray(data?.data) ? data.data : []);
      } catch (err) {
        console.error(err);
        toast.error(
          err.response?.data?.message ||
            err.message ||
            "Error deleting Lop Type"
        );
      }
    });
  };

  // Handler for editing Landing Door Subtype
  const handleSubEdit = (item) => {
    if (!item) {
      toast.error("Lop SubType not found.");
      return;
    }

    setSubForm({
      operatorTypeId: item.operatorTypeId || "",
      lopType: item.lopTypeId || "",
      floor: item.floorId || "",
      lopSubType: item.name || "",
      price: item.price || "",
    });
    setEditSubId(item.id);
    // Reset the type form when editing a subtype
    setTypeForm({ initialTypes });
    setEditTypeId(null);
  };

  const handleSubSubmit = async (e) => {
    e.preventDefault();

    const name = subForm.lopSubType.trim().toUpperCase();

    // Basic validations
    if (!name) {
      toast.error("Lop SubType cannot be empty");
      return;
    }

    // Check for duplicate lop_name globally
    const nameDuplicate = lopSubTypes.some(
      (t) => t.name?.toUpperCase() === name && t.id !== editSubId
    );

    if (nameDuplicate) {
      toast.error("LOP SubType name already exists.");
      return;
    }

    if (!subForm.operatorTypeId) {
      toast.error("Operator Type must be selected");
      return;
    }
    if (!subForm.lopType) {
      toast.error("Lop Type must be selected");
      return;
    }
    if (!subForm.price || isNaN(subForm.price) || subForm.price <= 0) {
      toast.error("Price must be a valid positive number");
      return;
    }

    // console.log(
    //   JSON.stringify(lopSubTypes, null, 2) +
    //     "-----" +
    //     editSubId +
    //     "===========" +
    //     subForm.operatorTypeId +
    //     "----" +
    //     subForm.lopType
    // );
    // Check for duplicate
    const isDuplicate = lopSubTypes.some(
      (t) =>
        //t.name?.toUpperCase() === name &&
        t.operatorTypeId === Number(subForm.operatorTypeId) &&
        t.lopTypeId === Number(subForm.lopType) &&
        t.floorId === Number(subForm.floor) &&
        t.subTypeId !== editSubId
    );
    if (isDuplicate) {
      toast.error(
        "LOP SubType already exists with selected Operator, floor and Door Type."
      );
      return;
    }

    try {
      const url = editSubId
        ? `${API_SUBTYPE_URL}/${editSubId}`
        : API_SUBTYPE_URL;
      const method = editSubId ? "put" : "post";

      const payload = {
        name: subForm.lopSubType.trim().toUpperCase(),
        price: parseFloat(subForm.price),
        floorId: subForm.floor,
        lopTypeId: subForm.lopType,
        operatorTypeId: subForm.operatorTypeId,
      };

      await axiosInstance({ method, url, data: payload });

      toast.success(
        `LOP SubType ${editSubId ? "updated" : "added"} successfully`
      );

      // Reset form and edit state
      setSubForm({
        operatorTypeId: "",
        lopType: "",
        floor: "",
        lopSubType: "",
        price: "",
      });
      setEditSubId(null);
      setEditTypeId(null);

      const { data } = await axiosInstance.get(API_SUBTYPE_URL);
      setLopSubTypes(Array.isArray(data?.data) ? data.data : []);
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Error saving Lop SubType."
      );
    }
  };

  const handleSubDelete = async (id) => {
    if (!id || isNaN(id)) {
      toast.error("Invalid ID for deletion.");
      console.error("Invalid delete ID:", id);
      return;
    }
    const selected = lopSubTypes.find((d) => d.id === id);
    if (!selected) {
      toast.error("LOP SubType not found.");
      return;
    }
    confirmDeleteWithToast(selected.name, async () => {
      try {
        await axiosInstance.delete(`${API_SUBTYPE_URL}/${id}`);

        toast.success("LOP SubType deleted successfully");

        // Refresh subtype list
        const { data } = await axiosInstance.get(API_SUBTYPE_URL);
        setLopSubTypes(Array.isArray(data?.data) ? data.data : []);
      } catch (err) {
        console.error(err);
        toast.error(
          err.response?.data?.message ||
            err.message ||
            "Error deleting LOP SubType"
        );
      }
    });
  };

  const filteredTypes = useMemo(() => {
    const term = typeSearch.toLowerCase();
    return lopTypes
      .filter((t) => t?.lopType?.toLowerCase().includes(term))
      .map((t) => ({
        ...t,
        id: t.lopTypeId,
      }));
  }, [lopTypes, typeSearch]);

  const transformedSubTypes = useMemo(() => {
    const term = subSearch.toLowerCase();
    return lopSubTypes
      .filter((t) => t?.name?.toLowerCase().includes(term))
      .map((t) => ({
        id: t.id,
        name: t.name,
        price: t.price ?? "-",
        operatorTypeName: t.operatorTypeName || "Unknown Operator",
        lopTypeName: t.lopTypeName || "Unknown Type",
        floorName: t.floorName || "-",
        operatorTypeId: t.operatorTypeId,
        lopTypeId: t.lopTypeId,
        floorId: t.floorId,
      }));
  }, [lopSubTypes, subSearch]);

  const columnslopType = [
    {
      key: "operatorTypeName",
      label: "Operator Type",
      sortable: true,
      align: "text-left",
    },
    {
      key: "lopType",
      label: "LOP Type",
      align: "text-left",
      sortable: true,
    },
  ];

  const columnslopSubType = [
    {
      key: "operatorTypeName",
      label: "Operator Type",
      sortable: true,
      align: "text-left",
    },
    {
      key: "lopTypeName",
      label: "LOP Type",
      sortable: true,
      align: "text-left",
    },
    {
      key: "name",
      label: "LOP SubType",
      align: "text-left",
      sortable: true,
    },
    {
      key: "floorName",
      label: "Floor",
      sortable: true,
      align: "text-left",
    },
    {
      key: "price",
      label: "Price",
      align: "text-left",
      sortable: true,
    },
  ];

  return (
    <div className="space-y-8 w-full p-6 min-h-screen">
      <PageHeader
        title="LOP Types & SubTypes - Price Management"
        description="Manage and categorize types of lop and their subtypes."
        icon={SlidersHorizontal}
      />

      {/* type form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-800 flex items-center gap-2">
          <SquareStack className="w-5 h-5 text-gray-600" />
          Lop Types
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
            placeholder="Enter LOP Type"
            value={typeForm.lopType || ""}
            onChange={(e) =>
              setTypeForm({ ...typeForm, lopType: e.target.value })
            }
            required
          />

          <div className="col-span-auto gap-2 flex items-center">
            <FormButton type="submit" variant="primary">
              {editTypeId ? "Update" : "Add"}
            </FormButton>

            {/* {editTypeId && ( */}
            <FormButton
              type="button"
              variant="secondary"
              onClick={() => {
                setEditTypeId(null);
                setTypeForm({ initialTypes });
              }}
            >
              Cancel
            </FormButton>
            {/* )} */}
          </div>
        </ResponsiveForm>

        <ReusableTable
          title="LOP Type List"
          columns={columnslopType}
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

      {/* sub type form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-800 flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-gray-600" />
          LOP SubTypes
        </h2>

        <ResponsiveForm
          onSubmit={handleSubSubmit}
          columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-6"
          className="mt-4 mb-3"
        >
          {/* Operator Type Dropdown */}
          <FormSelect
            value={subForm.operatorTypeId || ""}
            onChange={(e) => {
              const newOperatorId = e.target.value;

              if (!editSubId) {
                setSubForm({
                  ...initialSubTypes,
                  operatorTypeId: newOperatorId,
                });
              } else {
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

          {/* LOP Type Dropdown */}
          <FormSelect
            value={subForm.lopType || ""}
            onChange={(e) => {
              const selectedId = parseInt(e.target.value);
              setSubForm((prevForm) => ({
                ...prevForm,
                lopType: selectedId,
                floor: editSubId ? prevForm.floor : "",
              }));
            }}
            required
          >
            <option value="">Select LOP Type</option>
            {lopTypes
              .filter((type) => type.operatorTypeId == subForm.operatorTypeId)
              .map((type) => (
                <option key={type.lopTypeId} value={type.lopTypeId}>
                  {type.lopType}
                </option>
              ))}
          </FormSelect>

          {/* Floor Dropdown (only show if LOP Type selected) */}
          <FormSelect
            value={subForm.floor || ""}
            onChange={(e) =>
              setSubForm((prevForm) => ({
                ...prevForm,
                floor: e.target.value,
              }))
            }
            disabled={!subForm.lopType} // Disable until LOP Type is selected
            required
          >
            <option value="">Select Floor</option>
            {floors.map((floor) => (
              <option key={floor.id} value={floor.id}>
                {floor.floorName}
              </option>
            ))}
          </FormSelect>

          {/* LOP SubType Input */}
          <FormInput
            type="text"
            placeholder="Enter LOP SubType"
            value={subForm.lopSubType || ""}
            onChange={(e) =>
              setSubForm({ ...subForm, lopSubType: e.target.value })
            }
            required
          />

          {/* Price Input */}
          <FormInput
            type="number"
            placeholder="Enter Price"
            value={subForm.price || ""}
            onChange={(e) => setSubForm({ ...subForm, price: e.target.value })}
            required
          />

          {/* Buttons */}
          <div className="col-span-auto gap-2 flex items-center">
            <FormButton className="w-auto" type="submit" variant="primary">
              {editSubId ? "Update" : "Add"}
            </FormButton>

            {/* {editSubId && ( */}
            <FormButton
              className="w-auto"
              type="button"
              variant="secondary"
              onClick={() => {
                setEditSubId(null);
                setSubForm({ initialSubTypes });
              }}
            >
              Cancel
            </FormButton>
            {/* )} */}
          </div>
        </ResponsiveForm>

        <ReusableTable
          title="LOP Subtype List"
          columns={columnslopSubType}
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
