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

export default function WiringPluableHarness() {
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [harnes, setHarnes] = useState("");
  const [harness, setHarness] = useState([]);
  const [floor, setFloor] = useState("");
  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(true);

  const initials = {
    harness: "",
    floor: "",
    price: "",
  };

  const [form, setForm] = useState(initials);

  const sanitize = (value) => value.trim().toUpperCase();

  // const API_HARNESS = "/api/harness";
  // const API_FLOOR = "/api/floors";
  const API_HARNESS = API_ENDPOINTS.HARNESS;
  const API_FLOOR = API_ENDPOINTS.FLOORS;

  const fetchHarness = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(API_HARNESS);
      setHarness(res.data?.data || []);
    } catch (error) {
      console.error("Error loading harness types:", error);
      toast.error(
        error.response?.data?.message || "Error loading harness types"
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
      console.error("Error loading floors:", error);
      toast.error(error.response?.data?.message || "Error loading floors");
    }
  };

  useEffect(() => {
    fetchHarness();
    fetchFloors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = sanitize(form.harness);
    if (!name) {
      toast.error("Harness Type cannot be empty");
      return;
    }

    console.log(harness,"====",form.floor);
    const isDuplicate = harness.some(
      (lt) =>
        //lt.name.toUpperCase() === name.toUpperCase() &&
        lt.id !== editId &&
        lt.floorId == form.floor
        //lt.price != form.price
    );
    if (isDuplicate) {
      toast.error("An entry for this floor already exists.");
      return;
    }

    try {
      const method = editId ? "PUT" : "POST";
      const url = editId ? `${API_HARNESS}/${editId}` : `${API_HARNESS}`;

      const payload = {
        name: name,
        floorId: form.floor,
        price: form.price,
      };

      if (editId) {
        // 🔹 Update (PUT)
        await axiosInstance.put(url, payload);
        toast.success("Harness Type updated");
      } else {
        // 🔹 Create (POST)
        await axiosInstance.post(url, payload);
        toast.success("Harness Type created");
      }
      setForm(initials);
      setEditId("");
      fetchHarness();
    } catch (err) {
      console.error("Error saving harness type:", err);
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // 1. Updated handleEdit function
  const handleEdit = (harnesObj) => {
    const numericId = Number(harnesObj.id);
    const found = harness.find((l) => l.id === numericId);

    //const floorId = floors.find((ct) => ct.floorName === harnesObj.floorName);

    const selectedFloorId = harnesObj.floorId; 

    if (!found) {
      toast.error("Harness Type not found");
      return;
    }

    setForm({
      harness: found.name,
      //floor: floorId,
      floor: selectedFloorId,
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
    const selected = harness.find((d) => d.id === id);
    if (!selected) {
      toast.error("Harness not found.");
      return;
    }
    confirmDeleteWithToast(selected.harnessName, async () => {
      try {
        await axiosInstance.delete(`${API_HARNESS}/${id}`);

        toast.success("Harness deleted");

        if (editId === id) {
          setForm(initials);
          setEditId(null);
        }

        fetchHarness();
      } catch (error) {
        console.error("Error deleting harness:", error);
        toast.error(error.response?.data?.message || "Error deleting harness");
      }
    });
  };

  // 2. Updated filteredList function
  const filteredList = harness.filter((lt) =>
    // Correctly use harnessName for filtering
    lt.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 w-full p-6 min-h-screen">
      {/* Header */}
      <PageHeader
        title="Wiring Pluggable Harness"
        description="Manage Wiring Pluggable Harness."
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
            placeholder="Enter Harness"
            value={form.harness}
            onChange={(e) => setForm({ ...form, harness: e.target.value })}
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
                {type.id+1} ({type.floorName})
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
      </div>

      <ReusableTable
        title="Wiring Pluggable Harness List"
        columns={[
          {
            key: "name",
            label: "Harness",
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
        ]}
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
