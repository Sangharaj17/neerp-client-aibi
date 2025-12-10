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
import { API_ENDPOINTS } from "@/utils/apiEndpoints";

export default function FastenerPage() {
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [fastners, setFastners] = useState([]);
  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(true);

  const initials = {
    fastenerName: "",
    floor: "",
    price: "",
  };

  const [form, setForm] = useState(initials);

  const sanitize = (value) => value.trim().toUpperCase();

  const API_FASTENERS = API_ENDPOINTS.FASTENERS;
  const API_FLOOR = API_ENDPOINTS.FLOORS;

  const columns = [
    {
      key: "fastenerName",
      label: "fastner",
      sortable: true,
      editable: false,
    },
    {
      key: "floorName",
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

  const fetchfastner = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(API_FASTENERS);

      const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setFastners(list);
    } catch (error) {
      console.error("Error fetching fastner :", error);
      toast.error(
        error.response?.data?.message || "Error loading fastner types"
      );
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

  useEffect(() => {
    fetchfastner();
    fetchFloors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = sanitize(form.fastenerName);
    if (!name) {
      toast.error("fastner cannot be empty");
      return;
    }

    const isNameDuplicate = fastners.some(
      (lt) =>
        lt.fastenerName.toUpperCase() === name.toUpperCase() && lt.id !== editId
    );

    if (isNameDuplicate) {
      toast.error("Fastener name already exists in the system.");
      return;
    }

    //console.log(JSON.stringify(fastner, null, 2)+"-----"+editId+"==========="+form.operatorTypeId+"----"+form.floor);
    const isDuplicate = fastners.some(
      (lt) =>
        //lt.fastenerName.toUpperCase() === name.toUpperCase() &&
        lt.id !== editId && lt.floorId === Number(form.floor)
    );
    if (isDuplicate) {
      toast.error("fastner already exists for this floor.");
      return;
    }

    try {
      const url = editId ? `${API_FASTENERS}/${editId}` : API_FASTENERS;

      const payload = {
        fastenerName: name,
        floorId: form.floor,
        price: form.price,
      };

      if (editId) {
        await axiosInstance.put(url, payload);
        toast.success("fastner updated");
      } else {
        await axiosInstance.post(url, payload);
        toast.success("fastner created");
      }

      setForm(initials);
      setEditId("");
      fetchfastner();
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
    const found = fastners.find((l) => l.id === numericId);

    if (!found) {
      toast.error("fastner not found");
      return;
    }

    // Find the floor object and get its id
    const floor = floors.find((f) => f.floorName === CopObj.floorName);

    setForm({
      fastenerName: found.fastenerName,
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
    const selected = fastners.find((d) => d.id === id);
    if (!selected) {
      toast.error("fastner not found.");
      return;
    }
    confirmDeleteWithToast(selected.fastenerName, async () => {
      try {
        await axiosInstance.delete(`${API_FASTENERS}/${id}`);
        toast.success("fastner deleted");

        if (editId === id) {
          setForm(initials);
          setEditId(null);
        }

        fetchfastner();
      } catch (err) {
        toast.error(
          err.response?.data?.message || err.message || "Error deleting fastner"
        );
      }
    });
  };

  const filteredList = fastners.filter((lt) =>
    lt.fastenerName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 w-full p-4 min-h-screen">
      {/* Header */}
      <PageHeader
        title="Fastener Type"
        description="Manage and list fastener types."
        icon={SlidersHorizontal}
      />

      {/* Form Section */}
      <div className="border-b pb-4">
        <ResponsiveForm
          onSubmit={handleSubmit}
          columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-5"
        >
          <FormInput
            type="text"
            placeholder="Enter fastener"
            value={form.fastenerName}
            onChange={(e) => setForm({ ...form, fastenerName: e.target.value })}
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
                {type.id} ({type.floorName})
              </option>
            ))}
          </FormSelect>
          <FormInput
            type="number"
            placeholder="Enter Price"
            value={form.price || ""}
            onChange={(e) =>
              setForm({ ...form, price: Number(e.target.value) })
            }
            required
          />

          <div className="col-span-auto gap-2 flex items-center">
            <FormButton variant="primary">
              {editId ? "Update" : "ADD"}
            </FormButton>

            <FormButton
              type="button"
              variant="secondary"
              onClick={handleCancel}
            >
              Cancel
            </FormButton>
          </div>
        </ResponsiveForm>
      </div>

      <ReusableTable
        title="Fastener List"
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
