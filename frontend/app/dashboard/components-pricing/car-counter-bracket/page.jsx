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

export default function WiringPluablebrackets() {
  const [typeEditId, setTypeEditId] = useState(null);
  const [searchTypeTerm, setSearchTypeTerm] = useState("");
  const [bracketTypes, setBracketTypes] = useState([]);

  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [brackets, setBrackets] = useState([]);
  const [floors, setFloors] = useState([]);

  const [loading, setLoading] = useState(true);

  const initialsType = {
    bracketType: "",
  };
  const [typeForm, setTypeForm] = useState(initialsType);

  const initials = {
    carBracketSubType: "",
    bracketType: "",
    floor: "",
    price: "",
  };
  const [form, setForm] = useState(initials);

  const sanitize = (value) => value.trim().toUpperCase();

  // const API_TYPES = "/api/bracket-types";
  // const API_BRACKETS = "/api/brackets";
  // const API_FLOORS = "/api/floors";

  const API_TYPES = API_ENDPOINTS.BRACKETS_TYPES;
  const API_BRACKETS = API_ENDPOINTS.BRACKETS;
  const API_FLOORS = API_ENDPOINTS.FLOORS;

  const columnsType = [
    {
      key: "name",
      label: "Bracket Type",
      sortable: true,
      align: "text-left",
    },
  ];

  const columns = [
    {
      key: "bracketTypeName",
      label: "Brackets Type",
      sortable: true,
      editable: false,
    },
    {
      key: "carBracketSubType", // 👇 ADD NEW COLUMN
      label: "Sub Type",
      sortable: true,
      editable: false,
    },
    {
      key: "floorId",
      label: "Floor",
      sortable: true,
      editable: false,
      render: (item) => `${item.floorId} (${item.floorName})`,
    },
    {
      key: "price",
      label: "Price",
      sortable: true,
      editable: false,
    },
  ];

  const fetchTypeBrackets = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(API_TYPES);
      setBracketTypes(res.data?.data || []);
    } catch (error) {
      console.error(
        "Error loading bracket types:",
        error.response?.data || error.message
      );
      toast.error("Error loading bracket types");
    } finally {
      setLoading(false);
    }
  };

  const fetchBrackets = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(API_BRACKETS);
      setBrackets(res.data?.data || []);
    } catch (error) {
      console.error(
        "Error loading brackets:",
        error.response?.data || error.message
      );
      toast.error("Error loading brackets");
    } finally {
      setLoading(false);
    }
  };

  const fetchFloors = async () => {
    try {
      const res = await axiosInstance.get(API_FLOORS);
      setFloors(res.data?.data || []);
    } catch (error) {
      console.error(
        "Error loading floors types",
        error.response?.data || error.message
      );
      toast.error("Error loading floor types");
    }
  };

  useEffect(() => {
    fetchTypeBrackets();
    fetchBrackets();
    fetchFloors();
  }, []);

  const handleTypeSubmit = async (e) => {
    e.preventDefault();
    const name = sanitize(typeForm.bracketType);
    if (!name) {
      toast.error("Brackets Type cannot be empty");
      return;
    }

    const isDuplicate = bracketTypes.some(
      (lt) =>
        lt.name.toUpperCase() === name.toUpperCase() && lt.id !== typeEditId
    );
    if (isDuplicate) {
      toast.error("Brackets Type already exists for this floor.");
      return;
    }

    try {
      const method = typeEditId ? "put" : "post";
      const url = typeEditId ? API_TYPES + `/${typeEditId}` : API_TYPES;

      const res = await axiosInstance[method](url, { name });

      toast.success(`Bracket Type ${typeEditId ? "updated" : "created"}`);
      setTypeForm(initialsType);
      setTypeEditId("");
      fetchTypeBrackets();
      fetchBrackets();
    } catch (err) {
      console.log(
        "Error saving bracket type:",
        err.response?.data || err.message
      );
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleTypeEdit = (bracketObj) => {
    const numericId = Number(bracketObj.id);
    const found = bracketTypes.find((l) => l.id === numericId);

    if (!found) {
      toast.error("Bracket Type not found");
      return;
    }

    setTypeForm({
      bracketType: found.name || "",
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

    const selected = bracketTypes.find((d) => d.id === id);
    if (!selected) {
      toast.error("Bracket not found.");
      return;
    }

    const typeName = selected.name;

    const isUsed = brackets.some(
      (bracket) => bracket.bracketTypeName === typeName
    );

    if (isUsed) {
      toast.error(
        "Cannot delete bracket type. It is currently in use by a bracket floor."
      );
      return;
    }

    // confirmDeleteWithToast(selected.name, async () => {
    const nm =
      selected.bracketTypeName +
      " - " +
      selected.carBracketSubType +
      " - " +
      selected.floorName;
    confirmDeleteWithToast(nm, async () => {
      try {
        await axiosInstance.delete(`/types/${id}`); // ✅ relative path, baseURL is already in axiosInstance

        toast.success("Bracket Type deleted");

        if (editId === id) {
          setTypeForm(initialsType);
          setTypeEditId(null);
        }

        fetchTypeBrackets();
      } catch (err) {
        console.error(
          "Error deleting bracket type:",
          err.response?.data || err.message
        );
        toast.error(
          err.response?.data?.message || "Error deleting bracket type"
        );
      }
    });
  };

  const filteredTypeList = bracketTypes.filter((lt) =>
    lt.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //-----------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();
    const bracketTypeId = form.bracketType;
    const subType = form.carBracketSubType
      ? sanitize(form.carBracketSubType)
      : ""; // Sanitize the new field

    if (!bracketTypeId || !subType) {
      // Check both fields are present
      toast.error("Bracket Type and Sub Type cannot be empty");
      return;
    }

    //console.log(JSON.stringify(brackets, null, 2)+"====="+bracketTypeId+"----"+editId+"*****"+form.floor)
    const isDuplicate = brackets.some(
      (lt) =>
        lt.bracketTypeId === Number(bracketTypeId) &&
        lt.id !== editId &&
        lt.floorId === Number(form.floor) &&
        lt.carBracketSubType === subType
    );
    if (isDuplicate) {
      toast.error(
        "A Bracket with this Type, Sub Type, and Floor already exists."
      );
      return;
    }

    try {
      const method = editId ? "put" : "post";
      const url = editId ? API_BRACKETS + `/${editId}` : API_BRACKETS;

      const payload = {
        bracketTypeId: bracketTypeId,
        carBracketSubType: subType,
        floorId: form.floor,
        price: form.price,
      };

      await axiosInstance[method](url, payload);

      toast.success(`Bracket ${editId ? "updated" : "created"}`);
      setForm(initials);
      setEditId("");
      fetchBrackets();
    } catch (err) {
      console.error("Error saving bracket:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (bracketObj) => {
    const numericId = Number(bracketObj.id);
    const found = brackets.find((l) => l.id === numericId);

    const bracketType = bracketTypes.find(
      (bt) => bt.name === bracketObj.bracketTypeName
    );

    const floor = floors.find((ct) => ct.floorName === bracketObj.floorName);

    if (!found) {
      toast.error("brackets Type not found");
      return;
    }

    setForm({
      bracketType: bracketType ? bracketType.id : "",
      floor: floor ? floor.id : "",
      carBracketSubType: found.carBracketSubType || "",
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
    const selected = brackets.find((d) => d.id === id);
    if (!selected) {
      toast.error("Bracket not found.");
      return;
    }
    const nm = selected.bracketTypeName + " - " + selected.floorName;
    confirmDeleteWithToast(nm, async () => {
      try {
        await axiosInstance.delete(`${API_BRACKETS}/${id}`);

        toast.success("Bracket deleted");

        if (editId === id) {
          setForm(initials);
          setEditId(null);
        }

        fetchBrackets();
      } catch (err) {
        toast.error(err.message || "Error deleting bracket");
      }
    });
  };

  const filteredList = brackets.filter((lt) =>
    // Correctly use bracketsName for filtering
    lt.bracketTypeName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 w-full p-6 min-h-screen">
      {/* Header */}
      <PageHeader
        title="Car Bracket"
        description="Add car & counterweight bracket pair for each floor level."
        icon={SlidersHorizontal}
      />

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-800 flex items-center gap-2">
          <SquareStack className="w-5 h-5 text-gray-600" />
          Bracket Types
        </h2>
        <ResponsiveForm
          onSubmit={handleTypeSubmit}
          columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          className="mt-4"
        >
          <FormInput
            type="text"
            placeholder="Enter Bracket Type"
            value={typeForm.bracketType || ""}
            onChange={(e) =>
              setTypeForm({ ...typeForm, bracketType: e.target.value })
            }
            required
          />

          <div className="col-span-auto gap-2 flex items-center">
            <FormButton type="submit" variant="primary">
              {typeEditId ? "Update" : "Add"}
            </FormButton>

            {/* {typeEditId && ( */}
            <FormButton
              type="button"
              variant="secondary"
              onClick={() => {
                setTypeEditId(null);
                setTypeForm({ bracketType: "" });
              }}
            >
              Cancel
            </FormButton>
            {/* )} */}
          </div>
        </ResponsiveForm>

        <ReusableTable
          title="Bracket Type List"
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

      {/* Bracket Floor Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-800 flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-gray-600" />
          Bracket Floor Types
        </h2>
        <ResponsiveForm
          onSubmit={handleSubmit}
          columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          className="mt-4"
        >
          <FormSelect
            value={form.bracketType || ""}
            onChange={(e) => setForm({ ...form, bracketType: e.target.value })}
            required
          >
            <option value="" disabled>
              Select Bracket Type
            </option>
            {bracketTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </FormSelect>

          <FormInput
            type="text"
            placeholder="Enter Bracket Sub Type"
            value={form.carBracketSubType || ""}
            onChange={(e) =>
              setForm({ ...form, carBracketSubType: e.target.value })
            }
            required
          />

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
                {type.id + 1} ({type.floorName})
              </option>
            ))}
          </FormSelect>

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
          title="Bracket Floor List"
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
