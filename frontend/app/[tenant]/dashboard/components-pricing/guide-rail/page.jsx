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
import CounterFrameType from "../frame-type/page";
import axiosInstance from "@/utils/axiosInstance";

export default function GuideRailPage() {
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [guideRail, setGuideRail] = useState([]);
  const [liftTypes, setLiftTypes] = useState([]);
  const [floors, setFloors] = useState([]);
  const [frameTypes, setFrameTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const initials = {
    counterFrameName: "",
    counterFrameType: "",
    liftTypeId: "",
    floor: "",
    price: "",
  };

  const [form, setForm] = useState(initials);

  const sanitize = (value) => value.trim().toUpperCase();

  const API_GUIDE_RAIL = "/api/counter-weights";
  const API_FRAME_TYPES = "/api/counter-frame-types";
  const API_FLOOR = "/api/floors";
  const API_LIFT_TYPE = "/api/type-of-lift";

  const columns = [
    {
      key: "counterFrameName",
      label: "Car Bracket Type",
      sortable: true,
      editable: false,
    },
    {
      key: "counterFrameTypeName",
      label: "Counter Frame Type",
      sortable: true,
      editable: false,
    },
    {
      key: "typeOfLiftName",
      label: "Lift Type",
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

  const fetchGuideRail = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(API_GUIDE_RAIL);
      const list = Array.isArray(data) ? data : data?.data || [];
      setGuideRail(list);
    } catch (error) {
      console.error(error);
      toast.error("Error loading Guide Rail types");
    } finally {
      setLoading(false);
    }
  };

  const fetchOthers = async () => {
    const tenant = localStorage.getItem("tenant");
    try {
      setLoading(true);

      const [liftRes, floorRes, framesRes] = await Promise.all([
        axiosInstance.get(API_LIFT_TYPE),
        axiosInstance.get(API_FLOOR),
        axiosInstance.get(API_FRAME_TYPES),
      ]);

      const operatorList = Array.isArray(liftRes.data?.data)
        ? liftRes.data.data
        : [];
        
      const floorsList = Array.isArray(floorRes.data?.data)
        ? floorRes.data.data
        : floorRes.data?.lopSubTypes || [];

      const framesList = Array.isArray(framesRes.data) ? framesRes.data : [];

      setLiftTypes(operatorList);
      setFloors(floorsList);
      setFrameTypes(framesList);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch operator, floor, or frame type data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuideRail();
    fetchOthers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = sanitize(form.counterFrameName);
    if (!name) {
      toast.error("GuideRail Type cannot be empty");
      return;
    }

    const isDuplicate = guideRail.some(
      (lt) =>
        lt.counterFrameName.toUpperCase() === name.toUpperCase() &&
        lt.id !== editId &&
        lt.operatorTypeId == form.operatorTypeId &&
        lt.floor == form.floor
    );
    if (isDuplicate) {
      toast.error("Guide Rail Type already exists for this floor.");
      return;
    }

    try {
      const url = editId ? `${API_GUIDE_RAIL}/${editId}` : API_GUIDE_RAIL;
      const method = editId ? "put" : "post";

      const { data } = await axiosInstance({
        method,
        url,
        data: {
          counterFrameName: name,
          counterFrameTypeId: form.counterFrameType,
          typeOfLiftId: form.liftTypeId,
          floorsId: form.floor,
          price: form.price,
        },
      });

      toast.success(`guideRail Type ${editId ? "updated" : "created"}`);
      setForm(initials);
      setEditId("");
      fetchGuideRail();
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Error saving guide rail type"
      );
    }
  };

  const handleEdit = (CopObj) => {
    console.log(CopObj);
    const numericId = Number(CopObj.id);
    const found = guideRail.find((l) => l.id === numericId);

    if (!found) {
      toast.error("guideRail Type not found");
      return;
    }

    // Find the floor object and get its id
    const floor = floors.find((f) => f.floorName === CopObj.floorName);

    // Find the operator type and get its id
    const liftType = liftTypes.find(
      (ot) => ot.liftTypeName === CopObj.typeOfLiftName
    );

    const frameType = frameTypes.find(
      (ft) => ft.frameTypeName === CopObj.counterFrameTypeName
    );

    setForm({
      counterFrameName: found.counterFrameName,
      counterFrameType: frameType ? frameType.id : "",
      liftTypeId: liftType ? liftType.id : "",
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
    const selected = guideRail.find((d) => d.id === id);
    if (!selected) {
      toast.error("Guide Rail not found.");
      return;
    }
    confirmDeleteWithToast(selected.counterFrameName, async () => {
      try {
        const { data } = await axiosInstance.delete(`${API_GUIDE_RAIL}/${id}`);

        toast.success("Guide Rail deleted");

        if (editId === id) {
          setForm(initials);
          setEditId(null);
        }

        fetchGuideRail();
      } catch (err) {
        console.error(err);
        toast.error(
          err.response?.data?.message ||
            err.message ||
            "Error deleting Guide Rail"
        );
      }
    });
  };

  const filteredList = guideRail.filter((lt) =>
    lt.counterFrameName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 w-full p-6 min-h-screen">
      {/* Header */}
      <PageHeader
        title="Guide Rail - Car & Counter Weight"
        description="Manage guide rails and floor-based configurations."
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
            placeholder="Enter Car Bracket Type"
            value={form.counterFrameName}
            onChange={(e) =>
              setForm({ ...form, counterFrameName: e.target.value })
            }
          />

          <FormSelect
            value={form.counterFrameType || ""}
            onChange={(e) =>
              setForm({ ...form, counterFrameType: e.target.value })
            }
            required
          >
            <option value="" disabled>
              Select Counter Frame Type
            </option>
            {frameTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.frameTypeName}
              </option>
            ))}
          </FormSelect>

          <FormSelect
            value={form.liftTypeId || ""}
            onChange={(e) => setForm({ ...form, liftTypeId: e.target.value })}
            required
          >
            <option value="" disabled>
              Select Lift Type
            </option>
            {liftTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.liftTypeName}
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
        title="Guide Rail List"
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
