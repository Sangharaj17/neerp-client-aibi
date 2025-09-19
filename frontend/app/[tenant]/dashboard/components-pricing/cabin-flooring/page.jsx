"use client";
import { useState, useEffect } from "react";
import { SlidersHorizontal } from "lucide-react";
import { toast } from "react-hot-toast";
import ReusableTable from "@/components/UI/ReusableTable";
import PageHeader from "@/components/UI/PageHeader";
import { confirmDeleteWithToast } from "@/components/UI/toastUtils";
import axiosInstance from "@/utils/axiosInstance";

export default function CabinFlooring() {
  const [cabinFlooring, setCabinFlooring] = useState("");
  const [cabinFlooringPrice, setCabinFlooringPrice] = useState(null);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [cabinFloorings, setCabinFloorings] = useState([]);

  const columns = [
    { key: "flooringName", label: "Cabin Flooring Name" },
    { key: "price", label: "Price" },
  ];

  const sanitize = (value) => value.trim().toUpperCase();

  const API = "/api/cabin-flooring";

  const fetchCabinFloorings = async () => {
    try {
      const res = await axiosInstance.get(API);
      setCabinFloorings(res.data?.data || []);
    } catch (error) {
      console.error("Error loading Cabin Flooring:", error);
      toast.error(
        error.response?.data?.message || "Error loading Cabin Flooring"
      );
    }
  };

  useEffect(() => {
    fetchCabinFloorings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = sanitize(cabinFlooring);
    if (!name) {
      toast.error("Cabin Flooring cannot be empty");
      return;
    }

    const isDuplicate = cabinFloorings.some(
      (lt) => lt.flooringName.toUpperCase() === name && lt.id !== editId
    );
    if (isDuplicate) {
      toast.error("Cabin Flooring already exists");
      return;
    }

    try {
      const payload = {
        flooringName: name,
        price: cabinFlooringPrice,
      };

      if (editId) {
        // 🔹 Update
        await axiosInstance.put(`${API}/${editId}`, payload);
      } else {
        // 🔹 Create
        await axiosInstance.post(API, payload);
      }

      toast.success(`Cabin Flooring ${editId ? "updated" : "created"}`);
      setCabinFlooring("");
      setCabinFlooringPrice(null);
      setEditId(null);
      fetchCabinFloorings();
    } catch (err) {
      console.error("Error saving Cabin Flooring:", err);
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleEdit = (cabinFlooringObj) => {
    console.log("Editing ID:", cabinFlooringObj);
    const numericId = Number(cabinFlooringObj.id); // ensure number
    const found = cabinFloorings.find((l) => l.id === numericId);
    if (!found) {
      toast.error("Cabin Flooring not found");
      return;
    }
    console.log("Editing ID---------:", numericId);
    setCabinFlooring(found.flooringName);
    setCabinFlooringPrice(found.price);
    setEditId(numericId);
  };

  const handleCancel = () => {
    setCabinFlooring("");
    setCabinFlooringPrice(null);
    setEditId(null);
  };

  const handleDelete = (id) => {
    const selected = cabinFloorings.find((d) => d.id === id);
    if (!selected) {
      toast.error("Invalid Cabin Flooring selected for deletion");
      return;
    }

    confirmDeleteWithToast(selected.flooringName, async () => {
      try {
        await axiosInstance.delete(`${API}/${id}`);

        toast.success(`${selected.flooringName} deleted successfully`);

        if (editId === id) {
          setCabinFlooring("");
          setEditId(null);
        }

        fetchCabinFloorings();
      } catch (err) {
        console.error("Error deleting Cabin Flooring:", err);
        toast.error(err.response?.data?.message || "Delete failed");
      }
    });
  };

  const filteredList = cabinFloorings.filter((lt) =>
    lt.flooringName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 w-full p-6 min-h-screen">
      {/* Header */}
      <PageHeader
        title="Cabin Flooring"
        description="Manage and categorize types of Cabin Flooring."
        icon={SlidersHorizontal}
      />

      {/* Form Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <input
            type="text"
            placeholder="Enter Cabin Flooring"
            value={cabinFlooring || ""}
            onChange={(e) => setCabinFlooring(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 w-full sm:w-64 text-sm focus:outline-none"
          />
          <input
            type="number"
            placeholder="Enter Price"
            value={cabinFlooringPrice || ""}
            onChange={(e) => setCabinFlooringPrice(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 w-full sm:w-64 text-sm focus:outline-none"
            required
          />
          <button
            type="submit"
            className="bg-gray-800 text-white px-6 py-2 rounded-md text-sm hover:bg-gray-700"
          >
            {editId ? "Update" : "ADD"}
          </button>
          {editId && (
            <button
              type="button"
              onClick={handleCancel}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-100"
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      <ReusableTable
        title="Cabin Flooring List"
        columns={columns}
        data={filteredList}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        height="350px"
        combineActions={false} // toggle this between true/false
        inlineEditing={false} // 🔥 Toggle here to enable/disable inline edit
      />
    </div>
  );
}
