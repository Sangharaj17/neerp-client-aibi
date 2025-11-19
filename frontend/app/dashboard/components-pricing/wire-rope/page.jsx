"use client";
import { useState, useEffect, useMemo } from "react";
import { SlidersHorizontal, SquareStack } from "lucide-react";
import { toast } from "react-hot-toast";
import ReusableTable from "@/components/UI/ReusableTable";
import PageHeader from "@/components/UI/PageHeader";
import { confirmDeleteWithToast } from "@/components/UI/toastUtils";
import ResponsiveForm from "@/components/UI/ResponsiveForm";
import {
  FormInput,
  FormButton,
  FormSelect,
  FormInputWithSuffix,
} from "@/components/UI/FormElements";
import axiosInstance from "@/utils/axiosInstance";
import { API_ENDPOINTS } from "@/utils/apiEndpoints";

export default function WireRope() {
  const [typeEditId, setTypeEditId] = useState(null);
  const [searchTypeTerm, setSearchTypeTerm] = useState("");
  const [wireRopeTypes, setWireRopeTypes] = useState([]);

  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [wireRopes, setWireRopes] = useState([]);
  const [machineTypes, setMachineTypes] = useState([]);
  const [floors, setFloors] = useState([]);
  // const [operatorTypes, setOperatorTypes] = useState([]);

  const [loading, setLoading] = useState(true);

  const initialsType = {
    machineTypeId: "",
    wireRopeSize: "",
    wireRopeType: "",
  };
  const [typeForm, setTypeForm] = useState(initialsType);

  const initials = {
    wireRopeTypeId: "",
    wireRopeName: "",
    machineTypeId: "",
    floor: "",
    wireRopeQty: "",
    price: "",
    wireRopeSize: "",
  };
  const [form, setForm] = useState(initials);

  const sanitize = (value) => {
    if (typeof value === "string") {
      return value.trim().toUpperCase();
    }
    return value ?? "";
  };

  // const API_WIRE_ROPE_TYPES = "/api/wire-rope-types";
  // const API_WIRE_ROPE = "/api/wire-ropes";
  // const API_FLOOR = "/api/floors";
  // const API_OPERATOR = "/api/operator-elevator";
  const API_WIRE_ROPE_TYPES = API_ENDPOINTS.WIRE_ROPE_TYPES;
  const API_WIRE_ROPE = API_ENDPOINTS.WIRE_ROPE;
  const API_FLOOR = API_ENDPOINTS.FLOORS;
  const API_MACHINE = API_ENDPOINTS.TYPE_OF_LIFT;

  const columnsType = [
    {
      key: "machineTypeName",
      label: "Machine Type",
      sortable: true,
      align: "text-left",
    },
    {
      key: "wireRopeSize",
      label: "Rope Size (mm)",
      sortable: true,
      align: "text-center",
    },
    {
      key: "wireRopeType",
      label: "Wire Rope Type",
      sortable: true,
      align: "text-left",
    },
  ];

  const columns = [
    {
      key: "wireRopeTypeName",
      label: "Wire Rope Type",
      sortable: true,
      editable: false,
    },
    {
      key: "wireRopeSize",
      label: "Rope Size (mm)",
      sortable: true,
      editable: false,
    },
    {
      key: "wireRopeName",
      label: "Rope Name",
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
      key: "floorName",
      label: "Floor",
      sortable: true,
      editable: false,
      render: (item) => `${item.floorId} (${item.floorName})`,
    },
    {
      key: "wireRopeQty",
      label: "Quantity",
      sortable: true,
      editable: false,
    },
    {
      key: "price",
      label: "Price",
      sortable: true,
      editable: false,
    },
  ];

  const fetchWireRopeType = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(API_WIRE_ROPE_TYPES);
      setWireRopeTypes(res.data?.data || []);
    } catch (error) {
      console.error("Error loading wire rope types:", error);
      const message =
        error.response?.data?.message ||
        error.message ||
        "Error loading wire rope types";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const fetchWireRope = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(API_WIRE_ROPE);

      const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setWireRopes(list);
    } catch (error) {
      console.error("Error loading wire ropes:", error);
      const message =
        error.response?.data?.message ||
        error.message ||
        "Error loading wire ropes";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOthers = async () => {
    const tenant = localStorage.getItem("tenant");
    try {
      const [machineRes, floorRes] = await Promise.all([
        axiosInstance.get(API_MACHINE),
        axiosInstance.get(API_FLOOR),
      ]);

      const machineList = Array.isArray(machineRes.data?.data)
        ? machineRes.data.data
        : [];

      const floorsList = Array.isArray(floorRes.data?.data)
        ? floorRes.data.data
        : floorRes.data?.lopSubTypes || [];

      setMachineTypes(machineList);
      setFloors(floorsList);
    } catch (err) {
      console.error("Failed to fetch machine type or floor data:", err);
      const message =
        err.response?.data?.message ||
        "Failed to fetch machine type or floor data.";
      toast.error(message);
    }
  };

  useEffect(() => {
    fetchWireRopeType();
    fetchWireRope();
    fetchOthers();
  }, []);

  const handleTypeSubmit = async (e) => {
    e.preventDefault();
    const { machineTypeId, wireRopeSize, wireRopeType } = typeForm;
    const size = Number(wireRopeSize);
    const typeName = sanitize(wireRopeType);

    if (!machineTypeId) {
      toast.error("Machine Type must be selected.");
      return;
    }
    if (isNaN(size) || size <= 0) {
      toast.error("Wire Rope Size must be a valid number.");
      return;
    }
    if (!typeName) {
      toast.error("Wire Rope Type cannot be empty");
      return;
    }

    const name = sanitize(typeForm.wireRopeType);
    if (!name) {
      toast.error("wireRopeType Type cannot be empty");
      return;
    }

    const isDuplicate = wireRopeTypes.some(
      (lt) =>
        lt.machineTypeId === Number(machineTypeId) &&
        lt.wireRopeSize === size &&
        lt.wireRopeType.toUpperCase() === name.toUpperCase() &&
        lt.id !== typeEditId
    );
    if (isDuplicate) {
      toast.error("Wire Rope Type already exists for this floor.");
      return;
    }

    try {
      const method = typeEditId ? "put" : "post";
      const url = typeEditId
        ? API_WIRE_ROPE_TYPES + `/${typeEditId}`
        : API_WIRE_ROPE_TYPES;

      await axiosInstance[method](url, {
        machineTypeId: Number(machineTypeId),
        wireRopeSize: size,
        wireRopeType: typeName,
      });

      toast.success(`Wire Rope Type ${typeEditId ? "updated" : "created"}`);
      setTypeForm(initialsType);
      setTypeEditId("");
      fetchWireRopeType();
      fetchWireRope();
    } catch (err) {
      console.error("Error saving Wire Rope Type:", err);
      const message =
        err.response?.data?.message || err.message || "Something went wrong";
      toast.error(message);
    }
  };

  const handleTypeEdit = (wireRopeTypeObj) => {
    const numericId = Number(wireRopeTypeObj.id);
    const found = wireRopeTypes.find((l) => l.id === numericId);

    if (!found) {
      toast.error("Wire Rope Type not found");
      return;
    }

    setTypeForm({
      machineTypeId: found.machineTypeId,
      wireRopeSize: found.wireRopeSize,
      wireRopeType: found.wireRopeType || "",
    });

    setTypeEditId(numericId);
  };

  const handleTypeCancel = () => {
    setTypeForm(initialsType);
    setTypeEditId(null);
  };

  const handleTypeDelete = (id) => {
    if (!id || isNaN(id)) {
      toast.error("Invalid ID for deletion.");
      return;
    }

    const selected = wireRopeTypes.find((d) => d.id === id);
    if (!selected) {
      toast.error("Wire Rope Type not found.");
      return;
    }

    const typeId = selected.id;
    const isUsed = wireRopes.some((item) => item.wireRopeTypeId === typeId);

    if (isUsed) {
      toast.error(
        "Cannot delete wire rope type. It is currently in use by a  floor."
      );
      return;
    }

    confirmDeleteWithToast(selected.wireRopeType, async () => {
      try {
        await axiosInstance.delete(`${API_WIRE_ROPE_TYPES}/${id}`);

        toast.success("Wire Rope Type deleted");

        if (editId === id) {
          setTypeForm(initialsType);
          setTypeEditId(null);
        }

        fetchWireRopeType();
      } catch (err) {
        console.error("Error deleting Wire Rope Type:", err);
        const message =
          err.response?.data?.message ||
          err.message ||
          "Error deleting wire rope type";
        toast.error(message);
      }
    });
  };

  const filteredTypeList = useMemo(() => {
    if (!searchTypeTerm) return wireRopeTypes;
    const lowerCaseSearch = searchTypeTerm.toLowerCase();

    return wireRopeTypes.filter((lt) => {
      const machineName =
        machineTypes.find((o) => o.id === lt.machineTypeId)?.machineTypeName ||
        "";
      return (
        lt.wireRopeType?.toLowerCase().includes(lowerCaseSearch) ||
        String(lt.wireRopeSize).includes(lowerCaseSearch) ||
        machineName.toLowerCase().includes(lowerCaseSearch)
      );
    });
  }, [wireRopeTypes, searchTypeTerm, machineTypes]);

  //--------------------WIRE ROPE MANAGEMENT LOGIC---------------------------------

  // Filtered wire rope types based on selected operator (EXISTING)
  const filteredWireRopeTypes = useMemo(() => {
    console.log("------form.machineTypeId-------------->", form.machineTypeId);
    const mId = Number(form.machineTypeId);
    if (!mId) return wireRopeTypes;

    console.log("------wireRopeTypes-------------->", wireRopeTypes);

    // Filter the full list by the Machine Type ID selected in the main form
    return wireRopeTypes.filter((type) => type.machineTypeId === mId);
  }, [wireRopeTypes, form.machineTypeId]);

  // NEW: Extract unique sizes based on the filtered types
  const uniqueWireRopeSizes = useMemo(() => {
    if (!form.machineTypeId) return [];

    const sizes = new Set();

    filteredWireRopeTypes.forEach((type) => {
      sizes.add(type.wireRopeSize);
    });

    console.log("===filteredWireRopeTypes====>", filteredWireRopeTypes);
    // Convert Set to sorted Array for dropdown
    return Array.from(sizes).sort((a, b) => a - b);
  }, [filteredWireRopeTypes, form.machineTypeId]);

  // UPDATED: Wire Rope Type Options, now filtered by Operator AND Size
  const finalWireRopeTypeOptions = useMemo(() => {
    const size = form.wireRopeSize ? Number(form.wireRopeSize) : null;
    if (!size) return filteredWireRopeTypes;

    return filteredWireRopeTypes.filter((type) => type.wireRopeSize === size);
  }, [filteredWireRopeTypes, form.wireRopeSize]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      wireRopeTypeId,
      wireRopeName,
      machineTypeId,
      floor,
      wireRopeQty,
      price,
    } = form;

    if (!machineTypeId) {
      toast.error("Machine Type must be selected.");
      return;
    }
    if (!wireRopeTypeId) {
      // Check the combination ID
      toast.error("Wire Rope Type must be selected.");
      return;
    }
    if (!wireRopeName || wireRopeName.trim() === "") {
      toast.error("Wire rope name cannot be blank.");
      return;
    }
    if (!machineTypeId) {
      toast.error("Machine Type must be selected.");
      return;
    }
    if (!floor) {
      toast.error("Floor must be selected.");
      return;
    }
    const selectedWireRopeType = wireRopeTypes.find(
      (t) => t.id === Number(wireRopeTypeId)
    );
    const wireRopeSize = selectedWireRopeType
      ? selectedWireRopeType.wireRopeSize
      : null;

    if (!wireRopeSize) {
      toast.error("Wire Rope Type is invalid or missing size data.");
      return;
    }

    if (isNaN(Number(wireRopeSize)) || Number(wireRopeSize) <= 0) {
      toast.error("Wire Rope Size is invalid.");
      return;
    }

    // UPDATED: Duplicate check on (operatorTypeId, wireRopeType, wireRopeName, machineTypeId, floor)
    const isDuplicate = wireRopes.some(
      (lt) =>
        lt.wireRopeTypeId === Number(wireRopeTypeId) &&
        lt.wireRopeName.trim().toLowerCase() ===
          wireRopeName.trim().toLowerCase() &&
        lt.machineTypeId === Number(machineTypeId) &&
        lt.floorId === Number(floor) &&
        lt.id !== editId
    );
    if (isDuplicate) {
      toast.error("Wire Rope configuration already exists for this floor.");
      return;
    }

    try {
      const method = editId ? "put" : "post";
      const url = editId ? API_WIRE_ROPE + `/${editId}` : API_WIRE_ROPE;

      await axiosInstance[method](url, {
        wireRopeTypeId: Number(wireRopeTypeId),
        wireRopeName: form.wireRopeName,
        machineTypeId: Number(form.machineTypeId),
        floorId: Number(form.floor),
        wireRopeQty: Number(form.wireRopeQty),
        price: form.price,
        wireRopeSize: wireRopeSize,
      });

      toast.success(`Wire Rope ${editId ? "updated" : "created"}`);
      setForm(initials);
      setEditId("");
      fetchWireRope();
    } catch (err) {
      console.error("Error saving Wire Rope:", err);
      const message =
        err.response?.data?.message || err.message || "Something went wrong";
      toast.error(message);
    }
  };

  const handleEdit = (wireRopeObj) => {
    const numericId = Number(wireRopeObj.id);
    // console.log(numericId,"-----wireRopes--------",wireRopeObj);
    const found = wireRopes.find((l) => l.id === numericId);

    if (!found) {
      toast.error("Wire Rope not found");
      return;
    }

    const wireRopeType = wireRopeTypes.find(
      (ct) => ct.id === wireRopeObj.wireRopeTypeId
    );

    const floor = floors.find((ct) => ct.id === wireRopeObj.floorId);

    const machineType = machineTypes.find(
      (ot) => ot.id === wireRopeObj.machineTypeId
    );

    if (!found) {
      toast.error("Wire Rope not found");
      return;
    }

    setForm({
      wireRopeTypeId: wireRopeType ? wireRopeType.id : "",
      wireRopeName: found.wireRopeName,
      machineTypeId: machineType ? machineType.id : "",
      floor: floor ? floor.id : "",
      wireRopeQty: found.wireRopeQty,
      price: found.price,
      wireRopeSize: wireRopeType ? wireRopeType.wireRopeSize : "",
    });

    setEditId(numericId);
  };

  const handleCancel = () => {
    setForm(initials);
    setEditId(null);
  };

  const handleDelete = (id) => {
    if (!id || isNaN(id)) {
      toast.error("Invalid ID for deletion.");
      return;
    }
    const selected = wireRopes.find((d) => d.id === id);
    if (!selected) {
      toast.error("Wire Rope not found.");
      return;
    }
    confirmDeleteWithToast(selected.wireRopeTypeName, async () => {
      try {
        await axiosInstance.delete(`${API_WIRE_ROPE}/${id}`);

        toast.success("Wire Rope deleted");

        if (editId === id) {
          setForm(initials);
          setEditId(null);
        }

        fetchWireRope();
      } catch (err) {
        console.error("Error deleting Wire Rope:", err);
        const message =
          err.response?.data?.message ||
          err.message ||
          "Error deleting Wire Rope";
        toast.error(message);
      }
    });
  };

  const filteredList = useMemo(() => {
    if (!searchTerm) return wireRopes;
    const lowerCaseSearch = searchTerm.toLowerCase();

    return wireRopes.filter((lt) => {
      return (
        lt.wireRopeTypeName?.toLowerCase().includes(lowerCaseSearch) ||
        lt.wireRopeName?.toLowerCase().includes(lowerCaseSearch) ||
        lt.machineTypeName?.toLowerCase().includes(lowerCaseSearch) ||
        lt.floorName?.toLowerCase().includes(lowerCaseSearch) ||
        String(lt.floorId).includes(lowerCaseSearch) ||
        String(lt.wireRopeQty).includes(lowerCaseSearch) ||
        String(lt.price).includes(lowerCaseSearch) ||
        String(lt.wireRopeSize).includes(lowerCaseSearch)
      );
    });
  }, [wireRopes, searchTerm]);

  return (
    <div className="space-y-8 w-full p-6 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <PageHeader
          title="Wire Rope Management"
          description="Manage different wire rope configurations."
          icon={SlidersHorizontal}
        />
        <div className="flex flex-col items-center justify-center text-center text-gray-500 mt-4 md:ml-4 md:mt-0 border-l-4 border-yellow-400 bg-yellow-50 rounded-lg p-2">
          <p className="font-semibold text-yellow-700">
            ⚠️ Please add at least one **Wire Rope Type** first.
          </p>
          <p className="text-sm mt-1">
            You can't add Wire Rope entries until a type is available.
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-800 flex items-center gap-2">
          <SquareStack className="w-5 h-5 text-gray-600" />
          Wire Rope Types
        </h2>
        <div className="flex flex-col md:flex-row md:space-x-4">
          <div className="w-full md:w-1/3">
            <ResponsiveForm
              onSubmit={handleTypeSubmit}
              columns="grid-cols-1"
              className="mt-4"
            >
              <FormSelect
                label="Machine Type"
                value={typeForm.machineTypeId || ""}
                onChange={(e) =>
                  setTypeForm({ ...typeForm, machineTypeId: e.target.value })
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

              <FormInputWithSuffix
                label="Wire Rope Size (mm)"
                placeholder="Enter Rope Size"
                type="number"
                value={typeForm.wireRopeSize || ""}
                onChange={(e) =>
                  setTypeForm({ ...typeForm, wireRopeSize: e.target.value })
                }
                required
                suffix="mm"
                step="0.01"
              />

              <FormInput
                label="Rope Type Name"
                type="text"
                placeholder="Enter Wire Rope Type Name"
                value={typeForm.wireRopeType || ""}
                onChange={(e) =>
                  setTypeForm({ ...typeForm, wireRopeType: e.target.value })
                }
                required
              />

              <div className="col-span-auto gap-2 flex items-center">
                <FormButton type="submit" variant="primary">
                  {typeEditId ? "Update" : "ADD"}
                </FormButton>

                {/* {typeEditId && ( */}
                <FormButton
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setTypeEditId(null);
                    setTypeForm({ initialsType });
                  }}
                >
                  Cancel
                </FormButton>
                {/* )} */}
              </div>
            </ResponsiveForm>
          </div>

          {/* The ReusableTable component */}
          <div className="w-full mt-4 md:w-2/3 md:mt-0">
            <ReusableTable
              title="Wire Rope Type List"
              columns={columnsType}
              data={filteredTypeList}
              onEdit={(item) => handleTypeEdit(item)}
              onDelete={(id) => handleTypeDelete(id)}
              searchTerm={searchTypeTerm}
              onSearchChange={setSearchTypeTerm}
              height="250px"
              pageSize={10}
              combineActions={false}
              loading={loading}
            />
          </div>
        </div>
      </div>

      {/* Bracket Floor Section */}
      <div className="bg-gray-50 border border-gray-500 rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-800 flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-gray-600" />
          Wire Rope
        </h2>

        <ResponsiveForm
          onSubmit={handleSubmit}
          columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          className="mt-4"
        >
          <FormSelect
            label="Machine Type"
            value={form.machineTypeId || ""}
            onChange={(e) => {
              setForm({
                ...form,
                machineTypeId: e.target.value,
                wireRopeTypeId: "",
                wireRopeSize: "",
              });
            }}
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

          <FormSelect
            label="Wire Rope Size (Filter)"
            value={form.wireRopeSize || ""}
            onChange={(e) => {
              // Reset wireRopeType when size filter changes
              setForm({
                ...form,
                wireRopeSize: e.target.value,
                wireRopeTypeId: "",
              });
            }}
            required={false} // Make filter optional
            disabled={!form.machineTypeId || uniqueWireRopeSizes.length === 0}
          >
            <option value="">Select Rope Size </option>
            {uniqueWireRopeSizes.map((size) => (
              <option key={size} value={size}>
                {size} mm
              </option>
            ))}
          </FormSelect>

          <FormSelect
            label="Wire Rope Type (Main Selection)"
            value={form.wireRopeTypeId || ""}
            onChange={(e) => {
              const selectedType = finalWireRopeTypeOptions.find(
                (t) => t.id === Number(e.target.value)
              );
              setForm({
                ...form,
                wireRopeTypeId: e.target.value,
                // If size was not selected/filtered, update it here based on type selection
                wireRopeSize: selectedType
                  ? selectedType.wireRopeSize
                  : form.wireRopeSize,
              });
            }}
            required
            disabled={
              !form.machineTypeId || finalWireRopeTypeOptions.length === 0
            }
          >
            <option value="" disabled>
              Select Wire Rope Type
            </option>
            {/* Renders types matching both operator and size filter */}
            {finalWireRopeTypeOptions.map((type) => (
              <option key={type.id} value={type.id}>
                {type.wireRopeType} ({type.wireRopeSize} mm)
              </option>
            ))}
          </FormSelect>

          <FormInput
            label="Rope Name"
            placeholder="Enter Wire Rope Name"
            value={form.wireRopeName || ""}
            onChange={(e) => setForm({ ...form, wireRopeName: e.target.value })}
            required
          />

          <FormSelect
            label="Floor"
            value={form.floor || ""}
            onChange={(e) => setForm({ ...form, floor: e.target.value })}
            required
          >
            <option value="" disabled>
              Select Floor
            </option>
            {floors.map((type) => (
              <option key={type.id} value={type.id}>
                {type.id} ({type.floorName})
              </option>
            ))}
          </FormSelect>

          <FormInput
            label="Quantity"
            type="number"
            placeholder="Enter Quantity"
            value={form.wireRopeQty || ""}
            onChange={(e) => setForm({ ...form, wireRopeQty: e.target.value })}
            required
          />

          <FormInput
            label="Price"
            type="number"
            placeholder="Enter Price"
            value={form.price || ""}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />

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

        <ReusableTable
          title="Wire Rope List"
          columns={columns}
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
    </div>
  );
}
