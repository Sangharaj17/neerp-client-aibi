"use client";
import { useState, useEffect } from "react";
import { SlidersHorizontal } from "lucide-react";
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

export default function COPtypePage() {
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [cops, setCops] = useState([]);
  const [operatorTypes, setOperatorTypes] = useState([]);
  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(true);

  const initials = {
    copName: "",
    operatorTypeId: "",
    floor: "",
    price: "",
  };

  const [form, setForm] = useState(initials);

  const sanitize = (value) => value.trim().toUpperCase();

  const API_COP = "/api/cops";
  const API_FLOOR = "/api/floors";
  const API_OPERATOR = "/api/operator-elevator";

  const columns = [
    {
      key: "copName",
      label: "Cops",
      sortable: true,
      editable: false,
    },
    {
      key: "operatorTypeName",
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
      key: "price",
      label: "Price",
      sortable: true,
      editable: false,
    },
  ];

  const fetchCops = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(API_COP);

      const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setCops(list);
    } catch (error) {
      console.error("Error fetching Cops types:", error);
      toast.error(error.response?.data?.message || "Error loading Cops types");
    } finally {
      setLoading(false);
    }
  };

  const fetchFloors = async () => {
    try {
      const res = await axiosInstance.get(API_FLOOR);
      setFloors(res.data?.data || []);
    } catch (error) {
      console.error("Error fetching Floors:", error);
      toast.error(error.response?.data?.message || "Error loading Floors");
    }
  };

  // const fetchFloors = async () => {
  //   try {
  //     const res = await fetch(API_FLOOR);
  //     if (!res.ok) throw new Error("Failed to fetch");
  //     const data = await res.json();
  //     setFloors(data?.data || []);
  //   } catch (error) {
  //     toast.error("Error loading Cops types");
  //   }
  // };

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
      toast.error("Failed to fetch operator or floor data.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCops();
    fetchOthers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = sanitize(form.copName);
    if (!name) {
      toast.error("Cops Type cannot be empty");
      return;
    }

    const isDuplicate = cops.some(
      (lt) =>
        lt.copName.toUpperCase() === name.toUpperCase() &&
        lt.id !== editId &&
        lt.operatorTypeId == form.operatorTypeId &&
        lt.floor == form.floor
    );
    if (isDuplicate) {
      toast.error("Cops Type already exists for this floor.");
      return;
    }

    try {
      const url = editId ? `${API_COP}/${editId}` : API_COP;

      const payload = {
        copName: name,
        operatorTypeId: form.operatorTypeId,
        floorId: form.floor,
        price: form.price,
      };

      if (editId) {
        await axiosInstance.put(url, payload);
        toast.success("Cops Type updated");
      } else {
        await axiosInstance.post(url, payload);
        toast.success("Cops Type created");
      }

      setForm(initials);
      setEditId("");
      fetchCops();
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (CopObj) => {
    const numericId = Number(CopObj.id);
    const found = cops.find((l) => l.id === numericId);

    if (!found) {
      toast.error("Cops Type not found");
      return;
    }

    // Find the floor object and get its id
    const floor = floors.find((f) => f.floorName === CopObj.floorName);

    // Find the operator type and get its id
    const operatorType = operatorTypes.find(
      (ot) => ot.name === CopObj.operatorTypeName
    );

    setForm({
      copName: found.copName,
      operatorTypeId: operatorType ? operatorType.id : "",
      floor: floor ? floor.id : "",
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
    const selected = cops.find((d) => d.id === id);
    if (!selected) {
      toast.error("Cops not found.");
      return;
    }
    confirmDeleteWithToast(selected.copName, async () => {
      try {
        await axiosInstance.delete(`${API_COP}/${id}`);
        toast.success("Cops deleted");

        if (editId === id) {
          setForm(initials);
          setEditId(null);
        }

        fetchCops();
      } catch (err) {
        toast.error(
          err.response?.data?.message || err.message || "Error deleting Cops"
        );
      }
    });
  };

  const filteredList = cops.filter((lt) =>
    lt.copName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 w-full p-6 min-h-screen">
      {/* Header */}
      <PageHeader
        title="Control Panel (COP) Type"
        description="Manage and list control panel types."
        icon={SlidersHorizontal}
      />

      {/* Form Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <ResponsiveForm
          onSubmit={handleSubmit}
          columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-5"
          className="mt-4"
        >
          <FormInput
            type="text"
            placeholder="Enter Cops"
            value={form.copName}
            onChange={(e) => setForm({ ...form, copName: e.target.value })}
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
            placeholder="Enter Price"
            value={form.price || ""}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />

          <div className="col-span-auto gap-2 flex items-center">
            <FormButton variant="primary">
              {editId ? "Update" : "ADD"}
            </FormButton>

            {editId && (
              <FormButton
                type="button"
                variant="secondary"
                onClick={handleCancel}
              >
                Cancel
              </FormButton>
            )}
          </div>
        </ResponsiveForm>
      </div>

      <ReusableTable
        title="Cops List"
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
  );
}
