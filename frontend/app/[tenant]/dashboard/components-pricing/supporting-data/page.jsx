"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { SlidersHorizontal, SquareStack } from "lucide-react";
import ReusableTable from "@/components/UI/ReusableTable";
import PageHeader from "@/components/UI/PageHeader";
import { confirmDeleteWithToast } from "@/components/UI/toastUtils";
import ResponsiveForm from "@/components/UI/ResponsiveForm";
import { FormInput, FormButton } from "@/components/UI/FormElements";
import axiosInstance from "@/utils/axiosInstance";

export default function SupportingData() {
  const [floors, setFloors] = useState([]);
  const [prefix, setPrefix] = useState("G+");
  const [totalFloors, setTotalFloors] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const columns = [{ key: "floorName", label: "Floor Name" }];

  useEffect(() => {
    fetchFloors();
  }, []);

  const fetchFloors = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/api/floors"); // axiosInstance handles baseURL & X-Tenant
      if (res.data.success) {
        setFloors(res.data.data);
      } else {
        toast.error(res.data.message || "Failed to fetch floors");
      }
    } catch (err) {
      console.error("Error fetching floors:", err);
      toast.error(err.response?.data?.message || "Error fetching floors");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();

    confirmDeleteWithToast(
      //"all existing floors and create new ones", // itemName
      "/update floors",
      async () => {
        try {
          const res = await axiosInstance.post("/api/floors/generate", {
            totalFloors,
            prefix,
          });

          if (res.data.success) {
            toast.success(res.data.message || "Floors generated successfully");
            fetchFloors(); // refresh the floor list
          } else {
            toast.error(res.data.message || "Failed to generate floors");
          }
        } catch (err) {
          if (err.response) {
            toast.error(
              err.response.data?.message || "Failed to generate floors"
            );
          } else {
            // Network error or unexpected error
            toast.error("Error generating floors");
          }
          //console.error(err);
        }
      }
    );
  };

  const filteredList = floors.filter(
    (floor) =>
      floor.floorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(floor.id).includes(searchTerm) // optional: search by ID too
  );

  return (
    <div className="space-y-8 w-full p-6 min-h-screen">
      {/* Header */}
      <PageHeader
        title="Supporting Data"
        description="Manage supporting data for lift configuration."
        icon={SlidersHorizontal}
      />

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-800 flex items-center gap-2">
          <SquareStack className="w-5 h-5 text-gray-600" /> Floors
        </h2>
        <ResponsiveForm onSubmit={handleGenerate}>
          <FormInput
            type="text"
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
            placeholder="Prefix (e.g., G+)"
            required
          />
          <FormInput
            type="number"
            value={totalFloors}
            onChange={(e) => setTotalFloors(Number(e.target.value))}
            min="1"
            placeholder="Total Floors"
            required
          />
          <div className="col-span-auto gap-2 flex items-center">
            <FormButton type="submit" loading={loading}>
              Generate
            </FormButton>
          </div>
        </ResponsiveForm>

        <ReusableTable
          title="Flooring List"
          columns={columns}
          data={filteredList}
          onEdit={null} // you said no edit option for floors
          onDelete={null} // or pass handleDelete if needed
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
