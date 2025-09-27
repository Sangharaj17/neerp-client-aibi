"use client";
import { useState, useEffect } from "react";
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
  const [operatorTypes, setOperatorTypes] = useState([]);
  const [floors, setFloors] = useState([]);

  const [loading, setLoading] = useState(true);

  const initialsType = {
    wireRopeType: "",
  };
  const [typeForm, setTypeForm] = useState(initialsType);

  const initials = {
    wireRopeType: "",
    operatorTypeId: "",
    floor: "",
    wireRopeQty: "",
    price: "",
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
  const API_OPERATOR = API_ENDPOINTS.OPERATOR;

  const columnsType = [
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
      key: "operatorElevatorName",
      label: "Operator Type",
      sortable: true,
      align: "text-left",
    },
    {
      key: "floorName",
      label: "Floor",
      sortable: true,
      editable: false,
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
      const [operatorRes, floorRes] = await Promise.all([
        axiosInstance.get(API_OPERATOR),
        axiosInstance.get(API_FLOOR),
      ]);

      const operatorList = Array.isArray(operatorRes.data?.data)
        ? operatorRes.data.data
        : [];

      const floorsList = Array.isArray(floorRes.data?.data)
        ? floorRes.data.data
        : floorRes.data?.lopSubTypes || [];

      setOperatorTypes(operatorList);
      setFloors(floorsList);
    } catch (err) {
      console.error("Failed to fetch operator or floor data:", err);
      const message =
        err.response?.data?.message ||
        "Failed to fetch operator or floor data.";
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
    const name = sanitize(typeForm.wireRopeType);
    if (!name) {
      toast.error("wireRopeType Type cannot be empty");
      return;
    }

    const isDuplicate = wireRopeTypes.some(
      (lt) =>
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

      await axiosInstance[method](url, { wireRopeType: name });

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

    const typeName = selected.wireRopeType;

    const isUsed = wireRopes.some((item) => item.wireRopeTypeName === typeName);

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

  const filteredTypeList = wireRopeTypes.filter((lt) =>
    lt.wireRopeType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //-----------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();
    const wireRopeTypeId = sanitize(form.wireRopeType);
    if (!wireRopeTypeId) {
      toast.error("Wire Rope Type Type cannot be empty");
      return;
    }

    //console.log(JSON.stringify(wireRopes, null, 2)+"-----"+editId+"========"+form.wireRopeType+"==="+form.operatorTypeId+"----"+form.floor);
    const isDuplicate = wireRopes.some(
      (lt) =>
        lt.wireRopeTypeId === Number(form.wireRopeType) &&
        lt.operatorElevatorId === Number(form.operatorTypeId) &&
        lt.id !== editId &&
        lt.floorId === Number(form.floor)
    );
    if (isDuplicate) {
      toast.error("Wire Rope already exists for this floor.");
      return;
    }

    try {
      const method = editId ? "put" : "post";
      const url = editId ? API_WIRE_ROPE + `/${editId}` : API_WIRE_ROPE;

      await axiosInstance[method](url, {
        wireRopeTypeId: wireRopeTypeId,
        operatorElevatorId: form.operatorTypeId,
        floorId: form.floor,
        wireRopeQty: form.wireRopeQty,
        price: form.price,
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
    const found = wireRopes.find((l) => l.id === numericId);

    const floor = floors.find((ct) => ct.floorName === wireRopeObj.floorName);

    const operatorType = operatorTypes.find(
      (ot) => ot.name === wireRopeObj.operatorElevatorName
    );

    if (!found) {
      toast.error("Wire Rope not found");
      return;
    }

    setForm({
      wireRopeType: numericId,
      operatorTypeId: operatorType ? operatorType.id : "",
      floor: floor ? floor.id : "",
      wireRopeQty: found.wireRopeQty,
      price: found.price,
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
  const filteredList = wireRopes.filter((lt) =>
    lt.wireRopeTypeName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-2"
              className="mt-4"
            >
              <FormInput
                type="text"
                placeholder="Enter Wire Rope Type"
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
            value={form.wireRopeType || ""}
            onChange={(e) => setForm({ ...form, wireRopeType: e.target.value })}
            required
          >
            <option value="" disabled>
              Select Wire Rope Type
            </option>
            {wireRopeTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.wireRopeType}
              </option>
            ))}
          </FormSelect>

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

          <FormInput
            type="number"
            placeholder="Enter Quantity"
            value={form.wireRopeQty || ""}
            onChange={(e) => setForm({ ...form, wireRopeQty: e.target.value })}
            required
          />

          <FormInput
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
