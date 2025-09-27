"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";
import { SlidersHorizontal, SquareStack } from "lucide-react";
import ReusableTable from "@/components/UI/ReusableTable";
import PageHeader from "@/components/UI/PageHeader";
import { confirmDeleteWithToast } from "@/components/UI/toastUtils";
import ResponsiveForm from "@/components/UI/ResponsiveForm";
import {
  FormInput,
  FormButton,
  FormSection,
  FormSelect,
  FormRadioGroup,
} from "@/components/UI/FormElements";
import axiosInstance from "@/utils/axiosInstance";
import { API_ENDPOINTS } from "@/utils/apiEndpoints";

export default function SupportingData() {
  const API_FLOORS = API_ENDPOINTS.FLOORS;
  const API_ADDITIONAL_FLOORS = API_ENDPOINTS.ADDITIONAL_FLOORS;
  const API_SPEED = API_ENDPOINTS.SPEED;
  const API_COMPONENT = API_ENDPOINTS.COMPONENT;
  const API_MANUFACTURER = API_ENDPOINTS.MANUFACTURER;
  const API_WARRANTY = API_ENDPOINTS.WARRANTY;
  const API_FEATURES = API_ENDPOINTS.FEATURES;
  const API_OPERATION_TYPE = API_ENDPOINTS.OPERATION_TYPE;

  const API_CAPACITY_TYPES = API_ENDPOINTS.CAPACITY_TYPES;
  const API_PERSON_CAPACITY = API_ENDPOINTS.PERSON_CAPACITY;
  const API_WEIGHTS = API_ENDPOINTS.WEIGHTS;
  const API_CAPACITY_DIMENSIONS = API_ENDPOINTS.CAPACITY_DIMENSIONS;

  const [activeForm, setActiveForm] = useState("floors"); // "floors" | "addFloors" | "speeds"

  const [floors, setFloors] = useState([]);
  const [prefix, setPrefix] = useState("G+");
  const [totalFloors, setTotalFloors] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const [form, setForm] = useState({ code: "", label: "" });
  const [additionalFloors, setAdditionalFloors] = useState([]);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  const [formSpeed, setFormSpeed] = useState({ value: "" });
  const [speeds, setSpeeds] = useState([]);
  const [editIdSpeed, setEditIdSpeed] = useState(null);
  const [searchSpeed, setSearchSpeed] = useState("");

  // Manufacturers
  const [manufacturers, setManufacturers] = useState([]);
  const [formManufacturer, setFormManufacturer] = useState({
    value: "",
    componentId: "",
  });
  const [editIdManufacturer, setEditIdManufacturer] = useState(null);
  const [searchManufacturer, setSearchManufacturer] = useState("");

  // Components
  const [components, setComponents] = useState([]);
  const [formComponent, setFormComponent] = useState({
    value: "",
  });
  const [editIdComponent, setEditIdComponent] = useState(null);
  const [searchComponent, setSearchComponent] = useState("");

  // Warranty
  const [Warranty, setWarranty] = useState([]);
  const [formWarranty, setFormWarranty] = useState({
    value: 0,
  });
  const [warrantyMessage, setWarrantyMessage] = useState("");
  // const [editIdWarranty, setEditIdWarranty] = useState(null);
  // const [searchWarranty, setSearchWarranty] = useState("");

  // Features
  const [features, setFeatures] = useState([]);
  const [formFeatures, setFormFeatures] = useState({
    value: "",
  });
  const [editIdFeatures, setEditIdFeatures] = useState(null);
  const [searchFeatures, setSearchFeatures] = useState("");

  // operationType
  const [operationTypes, setOperationTypes] = useState([]);
  const [formOperationType, setFormOperationType] = useState({
    value: "",
  });
  const [editIdOperationType, setEditIdOperationType] = useState(null);
  const [searchOperationType, setSearchOperationType] = useState("");

  //capacity and dimensions

  const [capDims, setCapDims] = useState([]);
  const [capacityTypes, setCapacityTypes] = useState([]);
  const [personCapacities, setPersonCapacities] = useState([]);
  const [weightCapacities, setWeightCapacities] = useState([]);
  const initDim = {
    shaftsWidth: 0,
    shaftsDepth: 0,
    reqMachineWidth: 0,
    reqMachineDepth: 0,
    carInternalWidth: 0,
    carInternalDepth: 0,
  };
  const [dimensions, setDimensions] = useState(initDim);
  const initForm = {
    capacityTypeId: 1,
    capacityValueId: "",
    shaftsWidth: "",
    shaftsDepth: "",
    reqMachineWidth: "",
    reqMachineDepth: "",
    carInternalWidth: "",
    carInternalDepth: "",
  };
  const [formCapDim, setFormCapDim] = useState(initForm);
  const [editIdCapDim, setEditIdCapDim] = useState(null);
  const [searchCapDim, setSearchCapDim] = useState("");

  const [loading, setLoading] = useState(false);

  const columns = [{ key: "floorName", label: "Floor Name" }];
  const columnsAddFloors = [
    { key: "code", label: "Code", sortable: true, align: "text-left" },
    { key: "label", label: "Label", sortable: true, align: "text-left" },
  ];
  const columnsSpeed = [
    { key: "value", label: "Speed (m/s)", sortable: true, align: "text-left" },
  ];
  const columnsManu = [
    {
      key: "componentName",
      label: "Component",
      sortable: true,
      align: "text-left",
    },
    { key: "name", label: "Manufacturer", sortable: true, align: "text-left" },
  ];
  const columnsComp = [
    { key: "name", label: "Component", sortable: true, align: "text-left" },
  ];
  const columnsWarranty = [
    {
      key: "name",
      label: "Warranty Months",
      sortable: true,
      align: "text-left",
    },
  ];

  const columnsFeatures = [
    {
      key: "name",
      label: "Lift Features",
      sortable: true,
      align: "text-left",
    },
    {
      key: "active",
      label: "Status",
      sortable: true,
      align: "text-left",
      render: (item) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            // Use the 'active' property from the data item
            item.active
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {/* Use the 'active' property for the text label */}
          {item.active ? "Active" : "Inactive"}
        </span>
      ),
    },
    // Add a new column for the toggle button
    {
      key: "toggleStatus",
      label: "Toggle Status",
      align: "text-center",
      render: (item) => (
        <button
          onClick={() => handleToggleStatus(item)}
          className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
            item.active
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-green-500 text-white hover:bg-green-600"
          }`}
        >
          {item.active ? "Deactivate" : "Activate"}
        </button>
      ),
    },
  ];

  const columnsOperationType = [
    {
      key: "name",
      label: "Operation Types",
      sortable: true,
      align: "text-left",
    },
    {
      key: "active",
      label: "Status",
      sortable: true,
      align: "text-left",
      render: (item) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            // Use the 'active' property from the data item
            item.active
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {/* Use the 'active' property for the text label */}
          {item.active ? "Active" : "Inactive"}
        </span>
      ),
    },
    // Add a new column for the toggle button
    {
      key: "toggleStatus",
      label: "Toggle Status",
      align: "text-center",
      render: (item) => (
        <button
          onClick={() => handleToggleStatusOp(item)}
          className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
            item.active
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-green-500 text-white hover:bg-green-600"
          }`}
        >
          {item.active ? "Deactivate" : "Activate"}
        </button>
      ),
    },
  ];

  const columnsCapDim = [
    {
      key: "capacityTypeName",
      label: "Capacity Type",
      sortable: true,
      align: "text-left",
    },
    {
      key: "capacityValue",
      label: "Capacity Value",
      sortable: true,
      align: "text-left",
    },
    {
      key: "shaftsWidth",
      label: "Shaft Widh",
      sortable: true,
      align: "text-left",
    },
    {
      key: "shaftsDepth",
      label: "Shaft Depth",
      sortable: true,
      align: "text-left",
    },
    {
      key: "reqMachineWidth",
      label: "Machine Width",
      sortable: true,
      align: "text-left",
    },
    {
      key: "reqMachineDepth",
      label: "Machine Depth",
      sortable: true,
      align: "text-left",
    },
    {
      key: "carInternalWidth",
      label: "Internal Width",
      sortable: true,
      align: "text-left",
    },
    {
      key: "carInternalDepth",
      label: "Internal Depth",
      sortable: true,
      align: "text-left",
    },
  ];

  const sanitize = (value) => value.trim();

  // ================= Floors =================
  useEffect(() => {
    fetchFloors();
  }, []);

  const fetchFloors = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(API_FLOORS);
      if (res.data.success) {
        setFloors(res.data.data);
      } else {
        toast.error(res.data.message || "Failed to fetch floors");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error fetching floors");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    confirmDeleteWithToast("/update floors", async () => {
      try {
        const res = await axiosInstance.post("/api/floors/generate", {
          totalFloors,
          prefix,
        });
        if (res.data.success) {
          toast.success(res.data.message || "Floors generated successfully");
          fetchFloors();
        } else {
          toast.error(res.data.message || "Failed to generate floors");
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Error generating floors");
      }
    });
  };

  const filteredList = floors.filter(
    (floor) =>
      floor.floorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(floor.id).includes(searchTerm)
  );

  // ================= Additional Floors =================
  useEffect(() => {
    fetchAdditionalFloors();
  }, []);

  const fetchAdditionalFloors = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(API_ADDITIONAL_FLOORS, {
        headers: { "X-Tenant": localStorage.getItem("tenant") },
      });
      const data = res.data;
      const list = Array.isArray(data) ? data : data?.data || [];
      setAdditionalFloors(list);
    } catch (err) {
      setAdditionalFloors([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredListAddFloors = useMemo(() => {
    return additionalFloors.filter(
      (item) =>
        item.code.toLowerCase().includes(search.toLowerCase()) ||
        item.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [additionalFloors, search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.code.trim() || !form.label.trim()) {
      toast.error("Both Code and Label are required.");
      return;
    }
    const duplicate = additionalFloors.some(
      (f) => f.code === form.code && f.id !== editId
    );
    if (duplicate) {
      toast.error("This Code already exists.");
      return;
    }
    try {
      const url = editId
        ? `${API_ADDITIONAL_FLOORS}/${editId}`
        : API_ADDITIONAL_FLOORS;
      const method = editId ? "put" : "post";
      const response = await axiosInstance[method](url, form, {
        headers: { "X-Tenant": localStorage.getItem("tenant") },
      });
      toast.success(response.data.message || "Saved successfully");
      fetchAdditionalFloors();
      setEditId(null);
      setForm({ code: "", label: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    }
  };

  const handleEdit = (item) => {
    setForm({ code: item.code, label: item.label });
    setEditId(item.id);
  };

  const handleDelete = (id) => {
    const selected = additionalFloors.find((f) => f.id === id);
    if (!selected) return;
    confirmDeleteWithToast(selected.code, async () => {
      try {
        await axiosInstance.delete(`${API_ADDITIONAL_FLOORS}/${id}`, {
          headers: { "X-Tenant": localStorage.getItem("tenant") },
        });
        toast.success(`${selected.code} deleted successfully`);
        if (editId === id) {
          setEditId(null);
          setForm({ code: "", label: "" });
        }
        fetchAdditionalFloors();
      } catch (err) {
        toast.error(err.response?.data?.message || "Delete failed");
      }
    });
  };

  // ================= Speeds =================
  useEffect(() => {
    fetchSpeeds();
  }, []);

  const fetchSpeeds = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(API_SPEED, {
        headers: { "X-Tenant": localStorage.getItem("tenant") },
      });
      setSpeeds(res.data || []);
    } catch (err) {
      setSpeeds([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredSpeeds = useMemo(
    () =>
      speeds.filter((s) =>
        s.value.toString().toLowerCase().includes(searchSpeed.toLowerCase())
      ),
    [speeds, searchSpeed]
  );

  const handleSubmitSpeed = async (e) => {
    e.preventDefault();
    const val = parseFloat(formSpeed.value);
    if (isNaN(val) || val <= 0) {
      toast.error("Enter a valid speed (m/s).");
      return;
    }
    const duplicate = speeds.some(
      (s) => s.value === val && s.id !== editIdSpeed
    );
    if (duplicate) {
      toast.error("Speed already exists.");
      return;
    }
    try {
      const url = editIdSpeed ? `${API_SPEED}/${editIdSpeed}` : API_SPEED;
      const method = editIdSpeed ? "put" : "post";
      await axiosInstance[method](
        url,
        { value: val },
        { headers: { "X-Tenant": localStorage.getItem("tenant") } }
      );
      toast.success("Speed saved successfully");
      fetchSpeeds();
      setFormSpeed({ value: "" });
      setEditIdSpeed(null);
    } catch {
      toast.error("Failed to save speed.");
    }
  };

  const handleEditSpeed = (item) => {
    setFormSpeed({ value: item.value });
    setEditIdSpeed(item.id);
  };

  const handleDeleteSpeed = (id) => {
    const selected = speeds.find((s) => s.id === id);
    if (!selected) return;
    confirmDeleteWithToast(selected.value, async () => {
      try {
        await axiosInstance.delete(`${API_SPEED}/${id}`, {
          headers: { "X-Tenant": localStorage.getItem("tenant") },
        });
        toast.success("Deleted successfully");
        fetchSpeeds();
      } catch {
        toast.error("Failed to delete speed.");
      }
    });
  };

  // ================= Fetch =================
  // ================= Fetch Functions =================
  const fetchManufacturers = async () => {
    try {
      const res = await axiosInstance.get(API_MANUFACTURER, {
        headers: { "X-Tenant": localStorage.getItem("tenant") },
      });
      const allManufacturers = Object.values(res.data.data || {}).flat();
      setManufacturers(allManufacturers);
    } catch (err) {
      console.error("Error fetching manufacturers:", err);
      setManufacturers([]);
    }
  };

  const fetchComponents = async () => {
    try {
      const res = await axiosInstance.get(API_COMPONENT, {
        headers: { "X-Tenant": localStorage.getItem("tenant") },
      });
      setComponents(res.data.data || []);
    } catch (err) {
      console.error("Error fetching components:", err);
      setComponents([]);
    }
  };

  const fetchWarranties = async () => {
    try {
      const res = await axiosInstance.get(API_WARRANTY, {
        headers: { "X-Tenant": localStorage.getItem("tenant") },
      });
      const warrantyData = res.data || [];
      setWarranty(warrantyData);
      if (warrantyData.length > 0) {
        const maxMonths = Math.max(...warrantyData.map((w) => w.warrantyMonth));
        setWarrantyMessage(
          `You have set warranties from 1 to ${maxMonths} months`
        );
      } else {
        setWarrantyMessage("");
      }
    } catch (err) {
      console.error("Error fetching warranties:", err);
      setWarranty([]);
      setWarrantyMessage("");
    }
  };

  const fetchFeatures = async () => {
    try {
      const res = await axiosInstance.get(API_FEATURES, {
        headers: { "X-Tenant": localStorage.getItem("tenant") },
      });
      setFeatures(res.data || []);
    } catch (err) {
      console.error("Error fetching features:", err);
      setFeatures([]);
    }
  };

  const fetchOperationTypes = async () => {
    try {
      const res = await axiosInstance.get(API_OPERATION_TYPE, {
        headers: { "X-Tenant": localStorage.getItem("tenant") },
      });
      setOperationTypes(res.data || []);
    } catch (err) {
      console.error("Error fetching operation types:", err);
      setOperationTypes([]);
    }
  };

  // ================= useEffect Hook =================
  useEffect(() => {
    setLoading(true);
    const loadAllData = async () => {
      await Promise.all([
        fetchManufacturers(),
        fetchComponents(),
        fetchWarranties(),
        fetchFeatures(),
        fetchOperationTypes(),
      ]);
      setLoading(false);
    };

    loadAllData();
  }, []);
  // useEffect(() => {
  //   fetchData();
  // }, []);

  // const fetchData = async () => {
  //   try {
  //     setLoading(true);
  //     const [manuRes, compRes, warrantyRes, featuresRes, operatingTypeRes] =
  //       await Promise.all([
  //         axiosInstance.get(API_MANUFACTURER, {
  //           headers: { "X-Tenant": localStorage.getItem("tenant") },
  //         }),
  //         axiosInstance.get(API_COMPONENT, {
  //           headers: { "X-Tenant": localStorage.getItem("tenant") },
  //         }),
  //         axiosInstance.get(API_WARRANTY, {
  //           headers: { "X-Tenant": localStorage.getItem("tenant") },
  //         }),
  //         axiosInstance.get(API_FEATURES, {
  //           headers: { "X-Tenant": localStorage.getItem("tenant") },
  //         }),
  //         axiosInstance.get(API_OPERATION_TYPE, {
  //           headers: { "X-Tenant": localStorage.getItem("tenant") },
  //         }),
  //       ]);

  //     //setManufacturers(manuRes.data.data || []);
  //     const allManufacturers = Object.values(manuRes.data.data || {}).flat();
  //     setManufacturers(allManufacturers);
  //     setComponents(compRes.data.data || []);
  //     const warrantyData = warrantyRes.data || [];
  //     setWarranty(warrantyData);
  //     setFeatures(featuresRes.data || []);
  //     setOperationTypes(operatingTypeRes.data || []);

  //     // ✅ If warranties exist, show message
  //     if (warrantyData.length > 0) {
  //       const maxMonths = Math.max(...warrantyData.map((w) => w.warrantyMonth));
  //       setWarrantyMessage(
  //         `You have set warranties from 1 to ${maxMonths} months`
  //       );
  //     } else {
  //       setWarrantyMessage(""); // or "No warranties configured yet"
  //     }
  //   } catch (err) {
  //     setManufacturers([]);
  //     setComponents([]);
  //     setWarranty([]);
  //     setFeatures([]);
  //     setOperationTypes([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // ================= Filtered Lists =================
  const filteredManufacturers = useMemo(
    () =>
      manufacturers.filter((m) => {
        const search = searchManufacturer.toLowerCase();
        return (
          m.name.toLowerCase().includes(search) ||
          m.componentName.toLowerCase().includes(search)
        );
      }),
    [manufacturers, searchManufacturer]
  );

  const filteredComponents = useMemo(
    () =>
      components.filter((c) =>
        c.name.toLowerCase().includes(searchComponent.toLowerCase())
      ),
    [components, searchComponent]
  );

  // ================= Manufacturer Handlers =================
  const handleSubmitManufacturer = async (e) => {
    e.preventDefault();
    const name = sanitize(formManufacturer.value);
    const componentId = formManufacturer.componentId;

    if (!name || !componentId)
      return toast.error("Manufacturer name and component are required");

    const duplicate = manufacturers.some(
      (m) =>
        m.name.toUpperCase() === name.toUpperCase() &&
        m.componentId === componentId &&
        m.id !== editIdManufacturer
    );
    if (duplicate)
      return toast.error(
        "This manufacturer already exists for the selected component"
      );

    try {
      const url = editIdManufacturer
        ? `${API_MANUFACTURER}/${editIdManufacturer}`
        : API_MANUFACTURER;
      const method = editIdManufacturer ? "put" : "post";
      const res = await axiosInstance[method](
        url,
        { name, componentId },
        { headers: { "X-Tenant": localStorage.getItem("tenant") } }
      );
      toast.success(res.data.message || "Saved successfully");
      setEditIdManufacturer(null);
      setFormManufacturer({ value: "", componentId: "" });
      fetchManufacturers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    }
  };

  const handleEditManufacturer = (m) => {
    setFormManufacturer({ value: m.name, componentId: m.componentId });
    setEditIdManufacturer(m.id);
  };

  const handleDeleteManufacturer = (id) => {
    const selected = manufacturers.find((m) => m.id === id);
    if (!selected) return;

    confirmDeleteWithToast(selected.name, async () => {
      try {
        await axiosInstance.delete(`${API_MANUFACTURER}/${id}`, {
          headers: { "X-Tenant": localStorage.getItem("tenant") },
        });
        toast.success(`${selected.name} deleted successfully`);
        if (editIdManufacturer === id) setEditIdManufacturer(null);
        setFormManufacturer({ value: "", componentId: "" });
        fetchManufacturers();
      } catch (err) {
        toast.error(err.response?.data?.message || "Delete failed");
      }
    });
  };

  // ================= Component Handlers =================
  const handleSubmitComponent = async (e) => {
    e.preventDefault();
    const name = sanitize(formComponent.value);
    if (!name) return toast.error("Component name is required");

    const duplicate = components.some(
      (c) =>
        c.name.toUpperCase() === name.toUpperCase() && c.id !== editIdComponent
    );
    if (duplicate) return toast.error("This component already exists");

    try {
      const url = editIdComponent
        ? `${API_COMPONENT}/${editIdComponent}`
        : API_COMPONENT;
      const method = editIdComponent ? "put" : "post";
      const res = await axiosInstance[method](
        url,
        { name },
        { headers: { "X-Tenant": localStorage.getItem("tenant") } }
      );
      toast.success(res.data.message || "Saved successfully");
      setEditIdComponent(null);
      setFormComponent({ value: "" });
      fetchComponents();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    }
  };

  const handleEditComponent = (c) => {
    setFormComponent({ value: c.name });
    setEditIdComponent(c.id);
  };

  const handleDeleteComponent = (id) => {
    const selected = components.find((c) => c.id === id);
    if (!selected) return;

    // 🔒 Check if this component is used in any manufacturer
    const isUsed = manufacturers.some((m) => m.componentId === id);
    if (isUsed) {
      toast.error(
        `Cannot delete "${selected.name}" as it is linked with manufacturers.`
      );
      return;
    }

    confirmDeleteWithToast(selected.name, async () => {
      try {
        await axiosInstance.delete(`${API_COMPONENT}/${id}`, {
          headers: { "X-Tenant": localStorage.getItem("tenant") },
        });
        toast.success(`${selected.name} deleted successfully`);
        if (editIdComponent === id) setEditIdComponent(null);
        setFormComponent({ value: "" });
        fetchComponents();
      } catch (err) {
        toast.error(err.response?.data?.message || "Delete failed");
      }
    });
  };

  // =============== Generate warranties ==============
  const handleGenerateWarranty = async (e) => {
    e.preventDefault();

    const totalMonths = parseInt(formWarranty.value, 10);

    if (!totalMonths || totalMonths <= 0) {
      toast.error("Please enter a valid number of months");
      return;
    }

    confirmDeleteWithToast("existing warranties", async () => {
      try {
        const res = await axiosInstance.post(
          `/api/warranties/generate/${totalMonths}`,
          {},
          { headers: { "X-Tenant": localStorage.getItem("tenant") } }
        );

        if (res.data) {
          toast.success(
            `You have set warranties from 1 to ${totalMonths} months`
          );
          setWarrantyMessage(
            `You have set warranties from 1 to ${totalMonths} months`
          );

          fetchWarranties();
          setFormWarranty({ value: 0 });
        } else {
          toast.error(res.data?.message || "Failed to generate warranties");
        }
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Error generating warranties"
        );
      }
    });
  };

  // ================== FEATURES CRUD ==================
  const handleSubmitFeature = async (e) => {
    e.preventDefault();

    const newValue = formFeatures.value.trim();

    // ✅ Validation
    if (!newValue) {
      toast.error("Feature name is required!");
      return;
    }
    if (/^\d+$/.test(newValue)) {
      toast.error("Feature name cannot be only numbers!");
      return;
    }
    if (
      features.some(
        (f) =>
          f.name.toLowerCase() === newValue.toLowerCase() &&
          f.id !== editIdFeatures
      )
    ) {
      toast.error("Feature name must be unique!");
      return;
    }

    try {
      if (editIdFeatures) {
        // ✅ Update feature
        const res = await axiosInstance.put(
          `${API_FEATURES}/${editIdFeatures}`,
          { name: newValue, isActive: true }, // backend entity
          { headers: { "X-Tenant": localStorage.getItem("tenant") } }
        );

        setFeatures((prev) =>
          prev.map((f) => (f.id === editIdFeatures ? res.data : f))
        );
        toast.success("Feature updated successfully!");
        setEditIdFeatures(null);
      } else {
        // ✅ Add new feature
        const res = await axiosInstance.post(
          API_FEATURES,
          { name: newValue, isActive: true },
          { headers: { "X-Tenant": localStorage.getItem("tenant") } }
        );

        setFeatures((prev) => [...prev, res.data]);
        toast.success("Feature added successfully!");
      }

      // Reset form
      setFormFeatures({ value: "" });
    } catch (err) {
      toast.error("Error while saving feature!");
    }
  };

  const handleEditFeature = (feature) => {
    setFormFeatures({ value: feature.name });
    setEditIdFeatures(feature.id);
  };

  const handleDeleteFeature = async (id) => {
    try {
      await axiosInstance.delete(`${API_FEATURES}/${id}`, {
        headers: { "X-Tenant": localStorage.getItem("tenant") },
      });
      setFeatures((prev) => prev.filter((f) => f.id !== id));
      toast.success("Feature deleted successfully!");
    } catch (err) {
      toast.error("Error deleting feature!");
    }
  };

  const filteredFeatures = features.filter(
    (feature) =>
      feature.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(feature.id).includes(searchTerm)
  );

  // Add this new function to your parent component
  const handleToggleStatus = async (feature) => {
    try {
      const newStatus = !feature.active; // Toggle the current status

      // Make the API call to update the feature status
      const res = await axiosInstance.put(
        `${API_FEATURES}/${feature.id}`,
        { name: feature.name, active: newStatus }, // Send the new status
        { headers: { "X-Tenant": localStorage.getItem("tenant") } }
      );

      // Update the local state with the new data from the API response
      setFeatures((prevFeatures) =>
        prevFeatures.map((f) => (f.id === feature.id ? res.data : f))
      );

      toast.success(`Feature status updated successfully!`);
    } catch (err) {
      toast.error("Failed to update feature status.");
      console.error(err);
    }
  };

  // ================== FEATURES CRUD ==================
  const handleSubmitOperationType = async (e) => {
    e.preventDefault();

    const newValue = formOperationType.value.trim();

    // ✅ Validation
    if (!newValue) {
      toast.error("Operation Type is required!");
      return;
    }
    if (/^\d+$/.test(newValue)) {
      toast.error("Operation Type cannot be only numbers!");
      return;
    }
    if (
      operationTypes.some(
        (f) =>
          f.name.toLowerCase() === newValue.toLowerCase() &&
          f.id !== editIdOperationType
      )
    ) {
      toast.error("Operation Type must be unique!");
      return;
    }

    try {
      if (editIdOperationType) {
        // ✅ Update feature
        const res = await axiosInstance.put(
          `${API_OPERATION_TYPE}/${editIdOperationType}`,
          { name: newValue, isActive: true }, // backend entity
          { headers: { "X-Tenant": localStorage.getItem("tenant") } }
        );

        setOperationTypes((prev) =>
          prev.map((f) => (f.id === editIdOperationType ? res.data : f))
        );
        toast.success("Operation type updated successfully!");
        setEditIdOperationType(null);
      } else {
        // ✅ Add new feature
        const res = await axiosInstance.post(
          API_OPERATION_TYPE,
          { name: newValue, isActive: true },
          { headers: { "X-Tenant": localStorage.getItem("tenant") } }
        );

        setOperationTypes((prev) => [...prev, res.data]);
        toast.success("Operation Type added successfully!");
      }

      // Reset form
      setFormOperationType({ value: "" });
    } catch (err) {
      toast.error("Error while saving operation type!");
    }
  };

  const handleEditOperationType = (opTyp) => {
    setFormOperationType({ value: opTyp.name });
    setEditIdOperationType(opTyp.id);
  };

  const handleDeleteOperationType = async (id) => {
    try {
      await axiosInstance.delete(`${API_OPERATION_TYPE}/${id}`, {
        headers: { "X-Tenant": localStorage.getItem("tenant") },
      });
      setOperationTypes((prev) => prev.filter((f) => f.id !== id));
      toast.success("Operation Type deleted successfully!");
    } catch (err) {
      toast.error("Error deleting Operation Type!");
    }
  };

  const filteredOperationType = operationTypes.filter(
    (opType) =>
      opType.name.toLowerCase().includes(searchOperationType.toLowerCase()) ||
      String(opType.id).includes(searchOperationType)
  );

  // Add this new function to your parent component
  const handleToggleStatusOp = async (opTy) => {
    try {
      const newStatus = !opTy.active; // Toggle the current status

      // Make the API call to update the feature status
      const res = await axiosInstance.put(
        `${API_OPERATION_TYPE}/${opTy.id}`,
        { name: opTy.name, active: newStatus }, // Send the new status
        { headers: { "X-Tenant": localStorage.getItem("tenant") } }
      );

      // Update the local state with the new data from the API response
      setOperationTypes((prevOperationTypes) =>
        prevOperationTypes.map((ot) => (ot.id === opTy.id ? res.data : ot))
      );

      toast.success(`Operation Type status updated successfully!`);
    } catch (err) {
      toast.error("Failed to update Operation Type status.");
      console.error(err);
    }
  };

  //====================capacity and dimensions ========================================
  const fetchAll = async () => {
    setLoading(null);
    const tenant = localStorage.getItem("tenant");
    try {
      setLoading(true);
      //const [capacityTypeRes, personRes, weightRes, capDimRes] =
      const [capacityTypeRes, personRes, weightRes] = await Promise.all([
        axiosInstance.get(API_CAPACITY_TYPES),
        axiosInstance.get(API_PERSON_CAPACITY),
        axiosInstance.get(API_WEIGHTS),
        //axiosInstance.get(API_CAPACITY_DIMENSIONS),
      ]);

      const capTypesData = capacityTypeRes.data;
      const persons = personRes.data;
      const weights = weightRes.data;
      //const capDims = capDimRes.data;

      const capTypes = Array.isArray(capTypesData?.data)
        ? capTypesData.data
        : [];

      setCapacityTypes(capTypes);
      setPersonCapacities(Array.isArray(persons?.data) ? persons.data : []);
      setWeightCapacities(Array.isArray(weights?.data) ? weights.data : []);
      //setCapDims(Array.isArray(capDims?.data) ? capDims.data : []);

      // ✅ Set default capacity type to first value (if exists)
      if (capTypes.length > 0) {
        setFormCapDim((prevForm) => ({
          ...prevForm,
          capacityTypeId: capTypes[0].id,
          capacityValueId: "",
        }));
      }
    } catch (err) {
      console.error("Failed to fetch capacity data", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchComDim = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(API_CAPACITY_DIMENSIONS, {
        headers: { "X-Tenant": localStorage.getItem("tenant") },
      });
      setCapDims(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching components:", err);
      setCapDims([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    fetchComDim();
  }, []);

  const capacityOptionsMap = {
    Person: {
      data: personCapacities,
      label: "Select Persons",
      valueKey: "displayName",
      formKey: "personId",
    },
    Weight: {
      data: weightCapacities,
      label: "Select Weight",
      valueKey: "weightFull",
      formKey: "weightId",
    },
  };

  //const selectedType = capacityOptionsMap[form.capacityType];
  const selectedType = capacityTypes.find(
    (ct) => ct.id === Number(formCapDim.capacityTypeId)
  );
  // console.log(selectedType);
  // console.log(capacityOptionsMap);
  const capacityMeta = selectedType
    ? capacityOptionsMap[selectedType.type]
    : null;

  // ➡️ Handle form changes for all inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormCapDim((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  // ➡️ Handle Radio/Select changes
  const handleCapacityTypeChange = (e) => {
    const selectedId = parseInt(e.target.value, 10);
    setFormCapDim((prevForm) => ({
      ...prevForm,
      capacityTypeId: selectedId,
      // Reset capacity value when type changes
      capacityValueId: "",
    }));
  };

  // ➡️ Create / Update
  const handleSubmitCapDim = async (e) => {
    e.preventDefault();

    if (!formCapDim.capacityTypeId || Number(formCapDim.capacityTypeId) === 0) {
      toast.error("Please select a Capacity Type.");
      return;
    }

    if (!formCapDim.capacityValueId) {
      toast.error("Please select a Capacity Value.");
      return;
    }

    try {
      const tenant = localStorage.getItem("tenant");

      // Check for duplicate combination before submitting
      const isDuplicate = capDims.some(
        (cd) =>
          cd.capacityTypeId === Number(formCapDim.capacityTypeId) &&
          cd.capacityValueId === Number(formCapDim.capacityValueId) &&
          cd.id !== editIdCapDim
      );

      if (isDuplicate) {
        toast.error(
          "This combination of Capacity Type and Value already exists."
        );
        return;
      }

      // Decide which field to send
      const selectedType = capacityTypes.find(
        (ct) => ct.id === formCapDim.capacityTypeId
      );

      const payload = {
        capacityTypeId: Number(formCapDim.capacityTypeId),
        shaftsWidth: Number(formCapDim.shaftsWidth),
        shaftsDepth: Number(formCapDim.shaftsDepth),
        reqMachineWidth: Number(formCapDim.reqMachineWidth),
        reqMachineDepth: Number(formCapDim.reqMachineDepth),
        carInternalWidth: Number(formCapDim.carInternalWidth),
        carInternalDepth: Number(formCapDim.carInternalDepth),
      };

      if (selectedType?.type === "Person") {
        payload.personCapacityId = Number(formCapDim.capacityValueId);
      } else if (selectedType?.type === "Weight") {
        payload.weightId = Number(formCapDim.capacityValueId);
      }

      if (editIdCapDim) {
        // 🔹 Update
        await axiosInstance.put(
          `${API_CAPACITY_DIMENSIONS}/${editIdCapDim}`,
          payload,
          { headers: { "X-Tenant": tenant } }
        );
        toast.success("Capacity Dimension updated successfully");
      } else {
        // 🔹 Create
        await axiosInstance.post(API_CAPACITY_DIMENSIONS, payload, {
          headers: { "X-Tenant": tenant },
        });
        toast.success("Capacity Dimension added successfully");
      }

      //await fetchAll();
      await fetchComDim();
      setFormCapDim(initForm);
      setEditIdCapDim(null);
    } catch (err) {
      console.error("Save failed", err);
      toast.error("Failed to save capacity dimension");
    }
  };

  // ➡️ Edit
  const handleEditCapDim = (row) => {
    setFormCapDim({
      capacityTypeId: row.capacityTypeId,
      capacityValueId: row.capacityValueId,
      shaftsWidth: row.shaftsWidth,
      shaftsDepth: row.shaftsDepth,
      reqMachineWidth: row.reqMachineWidth,
      reqMachineDepth: row.reqMachineDepth,
      carInternalWidth: row.carInternalWidth,
      carInternalDepth: row.carInternalDepth,
    });
    setEditIdCapDim(row.id);
  };

  // ➡️ Delete
  const handleDeleteCapDim = async (id) => {
    try {
      const tenant = localStorage.getItem("tenant");
      await axiosInstance.delete(`${API_CAPACITY_DIMENSIONS}/${id}`, {
        headers: { "X-Tenant": tenant },
      });
      toast.success("Capacity Dimension deleted successfully");
      //await fetchAll();
      await fetchComDim();
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Failed to delete capacity dimension");
    }
  };

  const filteredCapDim = (capDims || []).filter((item) =>
    Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(searchCapDim.toLowerCase())
  );

  // ================= Render =================
  return (
    <div className="space-y-8 w-full p-6 min-h-screen">
      <PageHeader
        title="Supporting Data"
        description="Manage supporting data for lift configuration."
        icon={SlidersHorizontal}
      />

      {/* Toggle Buttons */}
      <div className="flex gap-3 mb-6">
        <FormButton
          type="button"
          variant={activeForm === "floors" ? "primary" : "secondary"}
          onClick={() => setActiveForm("floors")}
        >
          Floors
        </FormButton>
        <FormButton
          type="button"
          variant={activeForm === "addFloors" ? "primary" : "secondary"}
          onClick={() => setActiveForm("addFloors")}
        >
          Additional Floors
        </FormButton>
        <FormButton
          type="button"
          variant={activeForm === "speeds" ? "primary" : "secondary"}
          onClick={() => setActiveForm("speeds")}
        >
          Speeds
        </FormButton>
        <FormButton
          type="button"
          variant={activeForm === "compNmanu" ? "primary" : "secondary"}
          onClick={() => setActiveForm("compNmanu")}
        >
          Components & Manufacturers
        </FormButton>
        <FormButton
          type="button"
          variant={activeForm === "warranties" ? "primary" : "secondary"}
          onClick={() => setActiveForm("warranties")}
        >
          Warranties
        </FormButton>
        <FormButton
          type="button"
          variant={activeForm === "features" ? "primary" : "secondary"}
          onClick={() => setActiveForm("features")}
        >
          Features
        </FormButton>
        <FormButton
          type="button"
          variant={activeForm === "operationType" ? "primary" : "secondary"}
          onClick={() => setActiveForm("operationType")}
        >
          Operation Type
        </FormButton>
        <FormButton
          type="button"
          variant={
            activeForm === "capacityDimensions" ? "primary" : "secondary"
          }
          onClick={() => setActiveForm("capacityDimensions")}
        >
          Capacity & Dimensions
        </FormButton>
      </div>

      {/* Floors Form */}
      {activeForm === "floors" && (
        <FormSection title="Floors" icon={SquareStack}>
          <ResponsiveForm
            onSubmit={handleGenerate}
            className="flex flex-wrap items-center gap-4 max-w-3xl"
          >
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
            <FormButton type="submit" loading={loading}>
              Generate
            </FormButton>
          </ResponsiveForm>

          <ReusableTable
            title="Flooring List"
            columns={columns}
            data={filteredList}
            onEdit={null}
            onDelete={null}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            height="350px"
            combineActions={false}
            inlineEditing={false}
            loading={loading}
          />
        </FormSection>
      )}

      {/* Additional Floors Form */}
      {activeForm === "addFloors" && (
        <FormSection title="Additional Floors" icon={SquareStack}>
          <ResponsiveForm
            onSubmit={handleSubmit}
            className="flex flex-wrap items-center gap-4 max-w-3xl"
          >
            <FormInput
              type="text"
              placeholder="Enter Code"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              required
            />
            <FormInput
              type="text"
              placeholder="Enter Label"
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              required
            />
            <FormButton variant="primary">
              {editId ? "Update" : "Add"}
            </FormButton>
            {editId && (
              <FormButton
                type="button"
                variant="secondary"
                onClick={() => {
                  setEditId(null);
                  setForm({ code: "", label: "" });
                }}
              >
                Cancel
              </FormButton>
            )}
          </ResponsiveForm>

          <ReusableTable
            title="Additional Floors List"
            columns={columnsAddFloors}
            data={filteredListAddFloors}
            onEdit={handleEdit}
            onDelete={handleDelete}
            searchTerm={search}
            onSearchChange={setSearch}
            height="300px"
            pageSize={10}
            combineActions
            loading={loading}
          />
        </FormSection>
      )}

      {/* Speeds Form */}
      {activeForm === "speeds" && (
        <FormSection title="Speeds" icon={SquareStack}>
          <ResponsiveForm
            onSubmit={handleSubmitSpeed}
            className="flex flex-wrap items-center gap-4 max-w-3xl"
          >
            <FormInput
              type="number"
              step="0.01"
              placeholder="Enter speed (m/s)"
              value={formSpeed.value}
              onChange={(e) => setFormSpeed({ value: e.target.value })}
              required
            />
            <FormButton variant="primary">
              {editIdSpeed ? "Update" : "Add"}
            </FormButton>
            {editIdSpeed && (
              <FormButton
                type="button"
                variant="secondary"
                onClick={() => {
                  setEditIdSpeed(null);
                  setFormSpeed({ value: "" });
                }}
              >
                Cancel
              </FormButton>
            )}
          </ResponsiveForm>

          <ReusableTable
            title="Speed List"
            columns={columnsSpeed}
            data={filteredSpeeds}
            onEdit={handleEditSpeed}
            onDelete={handleDeleteSpeed}
            searchTerm={searchSpeed}
            onSearchChange={setSearchSpeed}
            height="250px"
            pageSize={10}
            combineActions
            loading={loading}
          />
        </FormSection>
      )}

      {activeForm === "compNmanu" && (
        <>
          <FormSection title="Components" icon={SquareStack}>
            <ResponsiveForm
              onSubmit={handleSubmitComponent}
              className="flex flex-wrap items-center gap-4 max-w-3xl"
            >
              <FormInput
                type="text"
                value={formComponent.value}
                onChange={(e) =>
                  setFormComponent({
                    ...formComponent,
                    value: e.target.value,
                  })
                }
                placeholder="Enter Component Name"
                required
              />
              <div className="col-span-auto gap-2 flex items-center">
                <FormButton type="submit" variant="primary">
                  {editIdComponent ? "Update" : "Add Component"}
                </FormButton>

                {editIdComponent && (
                  <FormButton
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setEditIdComponent(null);
                      setFormComponent({ value: "" });
                    }}
                  >
                    Cancel
                  </FormButton>
                )}
              </div>
            </ResponsiveForm>

            <ReusableTable
              title="Component List"
              columns={columnsComp}
              data={filteredComponents}
              onEdit={handleEditComponent}
              onDelete={handleDeleteComponent}
              searchTerm={searchComponent}
              onSearchChange={setSearchComponent}
              height="350px"
              combineActions={false}
              inlineEditing={false}
              loading={loading}
            />
          </FormSection>

          <FormSection title="Manufacturer" icon={SquareStack}>
            <ResponsiveForm
              onSubmit={handleSubmitManufacturer}
              className="flex flex-wrap items-center gap-4 max-w-3xl"
            >
              <FormSelect
                value={formManufacturer.componentId || ""}
                onChange={(e) =>
                  setFormManufacturer({
                    ...formManufacturer,
                    componentId: e.target.value,
                  })
                }
                required
              >
                <option value="" disabled>
                  Select Component
                </option>
                {components.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </FormSelect>
              <FormInput
                type="text"
                value={formManufacturer.value}
                onChange={(e) =>
                  setFormManufacturer({
                    ...formManufacturer,
                    value: e.target.value,
                  })
                }
                placeholder="Enter Manufacturer Name"
                required
              />
              {/* <FormButton type="submit" loading={loading}>
                Add Manufacturer
              </FormButton> */}
              <div className="col-span-auto gap-2 flex items-center">
                <FormButton type="submit" variant="primary">
                  {editIdManufacturer ? "Update" : "Add Manufacturer"}
                </FormButton>

                {editIdManufacturer && (
                  <FormButton
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setEditIdComponent(null);
                      setFormManufacturer({ value: "", componentId: "" });
                    }}
                  >
                    Cancel
                  </FormButton>
                )}
              </div>
            </ResponsiveForm>

            <ReusableTable
              title="Manufacturers List"
              columns={columnsManu}
              data={filteredManufacturers}
              onEdit={handleEditManufacturer}
              onDelete={handleDeleteManufacturer}
              searchTerm={searchManufacturer}
              onSearchChange={setSearchManufacturer}
              height="350px"
              combineActions={false}
              inlineEditing={false}
              loading={loading}
            />
          </FormSection>
        </>
      )}

      {activeForm === "warranties" && (
        <FormSection title="Warranties" icon={SquareStack}>
          <ResponsiveForm
            onSubmit={handleGenerateWarranty}
            className="flex flex-wrap items-center gap-4 max-w-3xl"
          >
            <FormInput
              type="number"
              min="1"
              value={formWarranty.value || ""}
              onChange={(e) =>
                setFormWarranty({ ...formWarranty, value: e.target.value })
              }
              placeholder="Enter the max warranty months"
              required
            />
            <FormButton type="submit" loading={loading}>
              Generate Warranties
            </FormButton>
          </ResponsiveForm>
          {warrantyMessage && (
            <div className="mt-4 bg-white rounded-xl shadow-md p-4 border border-gray-200">
              <p className="text-green-700 font-bold text-center text-lg">
                {warrantyMessage}
              </p>
            </div>
          )}
        </FormSection>
      )}

      {activeForm === "features" && (
        <FormSection title="Features" icon={SquareStack}>
          <ResponsiveForm
            onSubmit={handleSubmitFeature}
            className="flex flex-wrap items-center gap-4 max-w-3xl"
          >
            <FormInput
              type="text"
              value={formFeatures.value}
              onChange={(e) =>
                setFormFeatures({
                  ...formFeatures,
                  value: e.target.value,
                })
              }
              placeholder="Enter Lift Features Name"
              required
            />
            <div className="col-span-auto gap-2 flex items-center">
              <FormButton type="submit" variant="primary">
                {editIdFeatures ? "Update" : "Add Features"}
              </FormButton>

              {editIdFeatures && (
                <FormButton
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setEditIdFeatures(null);
                    setFormFeatures({ value: "" });
                  }}
                >
                  Cancel
                </FormButton>
              )}
            </div>
          </ResponsiveForm>
          <ReusableTable
            title="Features List"
            columns={columnsFeatures}
            data={filteredFeatures}
            onEdit={handleEditFeature}
            onDelete={handleDeleteFeature}
            searchTerm={searchFeatures}
            onSearchChange={setSearchFeatures}
            height="350px"
            combineActions={false}
            inlineEditing={false}
            loading={loading}
          />
        </FormSection>
      )}

      {activeForm === "operationType" && (
        <FormSection title="operation Types" icon={SquareStack}>
          <ResponsiveForm
            onSubmit={handleSubmitOperationType}
            className="flex flex-wrap items-center gap-4 max-w-3xl"
          >
            <FormInput
              type="text"
              value={formOperationType.value || ""}
              onChange={(e) =>
                setFormOperationType({
                  ...formOperationType,
                  value: e.target.value,
                })
              }
              placeholder="Enter Operation Type"
              required
            />
            <div className="col-span-auto gap-2 flex items-center">
              <FormButton type="submit" variant="primary">
                {editIdOperationType ? "Update" : "Add"}
              </FormButton>

              {/* {editIdFeatures && ( */}
              <FormButton
                type="button"
                variant="secondary"
                onClick={() => {
                  setEditIdOperationType(null);
                  setFormOperationType({ value: "" });
                }}
              >
                Cancel
              </FormButton>
              {/* )} */}
            </div>
          </ResponsiveForm>
          <ReusableTable
            title="Operation Type List"
            columns={columnsOperationType}
            data={filteredOperationType}
            onEdit={handleEditOperationType}
            onDelete={handleDeleteOperationType}
            searchTerm={searchOperationType}
            onSearchChange={setSearchOperationType}
            height="350px"
            combineActions={false}
            inlineEditing={false}
            loading={loading}
          />
        </FormSection>
      )}

      {activeForm === "capacityDimensions" && (
        <FormSection title="Capacity And Dimensions" icon={SquareStack}>
          <ResponsiveForm onSubmit={handleSubmitCapDim} className="w-full px-6">
            <div
              className="
                grid grid-cols-1 
                md:grid-cols-2 
                lg:grid-cols-[minmax(200px,auto)_minmax(200px,auto)_repeat(6,minmax(165px,1fr))_auto] 
                gap-4 items-end w-full
              "
            >
              {/* Capacity Type (radio) */}
              <div className="flex flex-col">
                <label
                  htmlFor="shaftsWidth"
                  className="text-sm font-medium text-blue-600 mb-4"
                >
                  Capacity Type
                </label>
                <FormRadioGroup
                  //label="Capacity Type"
                  name="capacityTypeId"
                  options={capacityTypes.map((ct) => ({
                    value: ct.id,
                    label: ct.type,
                  }))}
                  selected={formCapDim.capacityTypeId}
                  onChange={handleCapacityTypeChange}
                  required
                />
              </div>

              {/* Dropdown */}
              {capacityMeta && (
                <div className="flex flex-col">
                  <label
                    htmlFor="shaftsWidth"
                    className="text-sm font-medium text-blue-600 mb-1"
                  >
                    Capacity Value
                  </label>
                  <FormSelect
                    label={capacityMeta.label}
                    name="capacityValueId"
                    value={formCapDim.capacityValueId}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>
                      {capacityMeta.label}
                    </option>
                    {capacityMeta.data.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item[capacityMeta.valueKey]}
                      </option>
                    ))}
                  </FormSelect>
                </div>
              )}

              {/* Inputs in same row */}
              <div className="flex flex-col">
                <label
                  htmlFor="shaftsWidth"
                  className="text-sm font-medium text-blue-600 mb-1"
                >
                  Shaft Width (mm)
                </label>
                <FormInput
                  label="Shafts Width"
                  type="number"
                  name="shaftsWidth"
                  value={formCapDim.shaftsWidth || ""}
                  onChange={handleChange}
                  placeholder="Shafts Width (mm)"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="shaftsWidth"
                  className="text-sm font-medium text-blue-600 mb-1 "
                >
                  Shafts Depth (mm)
                </label>
                <FormInput
                  label="Shafts Depth"
                  type="number"
                  name="shaftsDepth"
                  value={formCapDim.shaftsDepth || ""}
                  onChange={handleChange}
                  placeholder="Shafts Depth (mm)"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="shaftsWidth"
                  className="text-sm font-medium text-blue-600 mb-1"
                >
                  Machine Width
                </label>
                <FormInput
                  label="Machine Width"
                  type="number"
                  name="reqMachineWidth"
                  value={formCapDim.reqMachineWidth || ""}
                  onChange={handleChange}
                  placeholder="Machine Width (mm)"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="shaftsWidth"
                  className="text-sm font-medium text-blue-600 mb-1"
                >
                  Machine Depth
                </label>
                <FormInput
                  label="Machine Depth"
                  type="number"
                  name="reqMachineDepth"
                  value={formCapDim.reqMachineDepth || ""}
                  onChange={handleChange}
                  placeholder="Machine Depth (mm)"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="shaftsWidth"
                  className="text-sm font-medium text-blue-600 mb-1"
                >
                  Car Internal Width
                </label>
                <FormInput
                  label="Car Internal Width"
                  type="number"
                  name="carInternalWidth"
                  value={formCapDim.carInternalWidth || ""}
                  onChange={handleChange}
                  placeholder="Car Internal Width (mm)"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="shaftsWidth"
                  className="text-sm font-medium text-blue-600 mb-1"
                >
                  Car Internal Depth
                </label>
                <FormInput
                  label="Car Internal Depth"
                  type="number"
                  name="carInternalDepth"
                  value={formCapDim.carInternalDepth || ""}
                  onChange={handleChange}
                  placeholder="Car Internal Depth (mm)"
                  required
                />
              </div>

              {/* Buttons at the end */}
              <div className="flex gap-2 justify-end">
                <FormButton type="submit" variant="primary">
                  {editIdCapDim ? "Update" : "Add"}
                </FormButton>
                <FormButton
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setEditIdCapDim(null);
                    setFormCapDim(initForm);
                  }}
                >
                  Cancel
                </FormButton>
              </div>
            </div>
          </ResponsiveForm>

          <ReusableTable
            title="Capacity Dimensions List"
            columns={columnsCapDim}
            data={filteredCapDim}
            onEdit={handleEditCapDim}
            onDelete={handleDeleteCapDim}
            searchTerm={searchCapDim}
            onSearchChange={setSearchCapDim}
            height="350px"
            combineActions={false}
            inlineEditing={false}
            loading={loading}
          />
        </FormSection>
      )}
    </div>
  );
}
