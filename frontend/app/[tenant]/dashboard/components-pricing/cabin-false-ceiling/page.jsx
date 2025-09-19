"use client";
import { useState, useEffect } from "react";
import { SlidersHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import ReusableTable from "@/components/UI/ReusableTable";
import PageHeader from "@/components/UI/PageHeader";
import { confirmDeleteWithToast } from "@/components/UI/toastUtils";
import axiosInstance from "@/utils/axiosInstance";

export default function CabinCeiling() {
  const [cabinCeiling, setCabinCeiling] = useState("");
  const [cabinCeilingPrice, setCabinCeilingPrice] = useState(null);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [cabinCeilings, setCabinCeilings] = useState([]);

  const columns = [
    { key: "ceilingName", label: "Cabin Ceiling Name" },
    { key: "price", label: "Price" },
  ];

  const sanitize = (value) => value.trim().toUpperCase();

  const API = "/api/cabin-ceiling";

  const fetchCabinCeilings = async () => {
    try {
      const res = await axiosInstance.get(API);
      setCabinCeilings(res.data?.data || []);
    } catch (error) {
      console.error("Error fetching Cabin Ceilings:", error);
      toast.error("Error loading Cabin Ceiling");
    }
  };

  useEffect(() => {
    fetchCabinCeilings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = sanitize(cabinCeiling);
    if (!name) {
      toast.error("Cabin Ceiling cannot be empty");
      return;
    }

    const isDuplicate = cabinCeilings.some(
      (lt) => lt.ceilingName.toUpperCase() === name && lt.id !== editId
    );
    if (isDuplicate) {
      toast.error("Cabin Ceiling already exists");
      return;
    }

    try {
      const payload = {
        ceilingName: name,
        price: cabinCeilingPrice,
      };

      let res;
      if (editId) {
        // 🔹 Update existing
        res = await axiosInstance.put(`${API}/${editId}`, payload);
      } else {
        // 🔹 Create new
        res = await axiosInstance.post(API, payload);
      }

      toast.success(`Cabin Ceiling ${editId ? "updated" : "created"}`);

      setCabinCeiling("");
      setCabinCeilingPrice(null);
      setEditId(null);
      fetchCabinCeilings();
    } catch (err) {
      console.error("Error saving Cabin Ceiling:", err);
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleEdit = (cabinCeilingObj) => {
    // console.log("Editing ID:", cabinCeilingObj);
    // console.log("Editing ID:----", cabinCeilings);
    const numericId = Number(cabinCeilingObj.ceilingId); // ensure number
    const found = cabinCeilings.find((l) => l.ceilingId === numericId);
    if (!found) {
      toast.error("Cabin Ceiling not found");
      return;
    }
    // console.log("Editing ID---------:", numericId);
    setCabinCeiling(found.ceilingName);
    setCabinCeilingPrice(found.price);
    setEditId(numericId);
  };

  const handleCancel = () => {
    setCabinCeiling("");
    setCabinCeilingPrice(null);
    setEditId(null);
  };

  const handleDelete = (rowOrId) => {
    const id = typeof rowOrId === "object" ? rowOrId?.id : rowOrId;
    //console.log("Delete Row Object:", id);

    if (!id) {
      toast.error("Invalid Landing Door SubType selected for deletion");
      return;
    }
    const selected = cabinCeilings.find((d) => d.ceilingId === id);

    //console.log(cabinCeilings,"Selected Cabin Ceiling for deletion:", selected);
    if (!selected) {
      toast.error("Cabin Ceiling  not found.");
      return;
    }

    confirmDeleteWithToast(selected.ceilingName, async () => {
      try {
        // 🔹 Delete request
        await axiosInstance.delete(`${API}/${id}`);

        toast.success("Landing Door SubType deleted successfully");

        // 🔹 Fetch updated list
        const { data } = await axiosInstance.get(API);
        setCabinCeilings(Array.isArray(data?.data) ? data.data : []);
      } catch (err) {
        console.error("Error deleting Landing Door SubType:", err);
        toast.error(
          err.response?.data?.message || "Error deleting Landing Door SubType"
        );
      }
    });
  };

  // const handleDelete = async (rowOrId) => {
  //   const id = typeof rowOrId === "object" ? rowOrId.id : rowOrId;

  //   if (!id) {
  //     toast.error("Invalid ID for deletion.");
  //     return;
  //   }

  //   const confirmed = window.confirm(
  //     "Are you sure you want to delete this item?"
  //   );
  //   if (!confirmed) return;

  //   try {
  //     const response = await fetch(`${API}/${id}`, {
  //       method: "DELETE",
  //     });

  //     if (!response.ok) {
  //       const error = await response.json();
  //       throw new Error(error.message || "Failed to delete item.");
  //     }

  //     toast.success("Item deleted successfully.");
  //     fetchCabinCeilings(); // or your actual refresh method
  //   } catch (err) {
  //     toast.error(err.message);
  //   }
  // };

  // const handleDelete = async (id) => {
  //   try {
  //     const res = await fetch(API + `/${id}`, {
  //       method: "DELETE",
  //     });
  //     if (!res.ok) throw new Error("Delete failed");
  //     toast.success("Cabin Ceiling deleted");
  //     if (editId === id) {
  //       setCabinCeiling("");
  //       setEditId(null);
  //     }
  //     fetchCabinCeilings();
  //   } catch (err) {
  //     toast.error(err.message);
  //   }
  // };

  const filteredList = cabinCeilings
    .filter((lt) =>
      lt.ceilingName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .map((lt) => ({
      ...lt,
      id: lt.ceilingId, // Ensure 'id' is present for ReusableTable
    }));

  return (
    <div className="space-y-8 w-full p-6 min-h-screen">
      {/* Header */}
      <PageHeader
        title="Cabin Ceiling"
        description="Manage and categorize types of Cabin Ceiling."
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
            placeholder="Enter Cabin Ceiling"
            value={cabinCeiling || ""}
            onChange={(e) => setCabinCeiling(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 w-full sm:w-64 text-sm focus:outline-none"
            required
          />
          <input
            type="number"
            placeholder="Enter Price"
            value={cabinCeilingPrice || ""}
            onChange={(e) => setCabinCeilingPrice(e.target.value)}
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
        title="Cabin Ceiling List"
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
