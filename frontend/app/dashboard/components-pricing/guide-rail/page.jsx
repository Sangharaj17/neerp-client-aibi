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
import { renderDecoded, decodeHtmlEntities } from "@/utils/validation";

export default function GuideRailPage() {
  const [typeEditId, setTypeEditId] = useState(null);
  const [searchTypeTerm, setSearchTypeTerm] = useState("");
  const [guideRailTypes, setGuideRailTypes] = useState([]);

  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [guideRails, setGuideRails] = useState([]);
  //const [operatorTypes, setOperatorTypes] = useState([]);
  const [floors, setFloors] = useState([]);

  const [loading, setLoading] = useState(true);

  const initialsType = {
    guideRailType: "",
  };
  const [typeForm, setTypeForm] = useState(initialsType);

  const initials = {
    guideRail: "",
    guideRailType: "",
    floor: "",
    price: "",
  };
  const [form, setForm] = useState(initials);

  const sanitize = (value) => {
    // First, remove the HTML-encoded ampersand
    const decodedValue = value.replace(/&amp;/g, "&");

    // Then, apply your existing sanitization logic
    return decodedValue.trim().toUpperCase();
  };

  const API_GUIDE_RAIL_TYPES = API_ENDPOINTS.GUIDE_RAIL_TYPE;
  const API_GUIDE_RAIL = API_ENDPOINTS.GUIDE_RAIL;
  const API_FLOOR = API_ENDPOINTS.FLOORS;

  const columnsType = [
    {
      key: "name",
      label: "Guide Rail Type",
      sortable: true,
      align: "text-left",
    },
  ];

  const columns = [
    {
      key: "counterWeightName",
      label: "Guide Rail",
      sortable: true,
      editable: false,
      render: renderDecoded("counterWeightName"),
    },
    {
      key: "counterWeightTypeName",
      label: "Guide Rail Type",
      sortable: true,
      editable: false,
      render: renderDecoded("counterWeightTypeName"),
    },
    {
      key: "floorId",
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

  const fetchGuideRailType = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(API_GUIDE_RAIL_TYPES);
      const list = Array.isArray(data) ? data : data?.data || [];
      setGuideRailTypes(list);
    } catch (error) {
      console.error(error);
      toast.error("Error loading Guide Rail types");
    } finally {
      setLoading(false);
    }
  };

  const fetchGuideRail = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(API_GUIDE_RAIL);
      const list = Array.isArray(data) ? data : data?.data || [];
      setGuideRails(list);
    } catch (error) {
      console.error(error);
      toast.error("Error loading Guide Rails");
    } finally {
      setLoading(false);
    }
  };

  const fetchFloors = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(API_FLOOR);
      const list = Array.isArray(data) ? data : data?.data || [];
      setFloors(list);
    } catch (error) {
      console.error(error);
      toast.error("Error loading floors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuideRailType();
    fetchGuideRail();
    fetchFloors();
  }, []);

  const handleTypeSubmit = async (e) => {
    e.preventDefault();
    const name = sanitize(typeForm.guideRailType);
    if (!name) {
      toast.error("Guide Rail Type cannot be empty");
      return;
    }

    const isDuplicate = guideRailTypes.some(
      (lt) =>
        lt.name.toUpperCase() === name.toUpperCase() && lt.id !== typeEditId
    );
    if (isDuplicate) {
      toast.error("Guide rail Type already exists for this floor.");
      return;
    }

    try {
      const method = typeEditId ? "put" : "post";
      const url = typeEditId
        ? API_GUIDE_RAIL_TYPES + `/${typeEditId}`
        : API_GUIDE_RAIL_TYPES;

      await axiosInstance[method](url, { name: name });

      toast.success(`Guide Rail Type ${typeEditId ? "updated" : "created"}`);
      setTypeForm(initialsType);
      setTypeEditId("");
      fetchGuideRail();
      fetchGuideRailType();
    } catch (err) {
      console.error("Error saving Guide rail Type:", err);
      const message =
        err.response?.data?.message || err.message || "Something went wrong";
      toast.error(message);
    }
  };

  const handleTypeEdit = (guideRailTypeObj) => {
    const numericId = Number(guideRailTypeObj.id);
    const found = guideRailTypes.find((l) => l.id === numericId);

    if (!found) {
      toast.error("Guide Rail Type not found");
      return;
    }

    setTypeForm({
      guideRailType: found.name || "",
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

    const selected = guideRailTypes.find((d) => d.id === id);
    if (!selected) {
      toast.error("Guide Rail Type not found.");
      return;
    }

    const typeName = selected.name;

    const isUsed = guideRails.some(
      (item) => Number(item.counterWeightTypeId) === Number(id)
    );

    if (isUsed) {
      toast.error(
        "Cannot delete guide rail type. It is currently in use by a  floor."
      );
      return;
    }

    confirmDeleteWithToast(selected.name, async () => {
      try {
        await axiosInstance.delete(`${API_GUIDE_RAIL_TYPES}/${id}`);

        toast.success("Guide Rail Type deleted");

        if (editId === id) {
          setTypeForm(initialsType);
          setTypeEditId(null);
        }

        fetchGuideRailType();
      } catch (err) {
        console.error("Error deleting Guide Rail Type:", err);
        const message =
          err.response?.data?.message ||
          err.message ||
          "Error deleting guide rail type";
        toast.error(message);
      }
    });
  };

  const filteredTypeList = guideRailTypes.filter((lt) =>
    lt.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = sanitize(form.guideRail);
    if (!name || !form.floor || !form.guideRailType) {
      toast.error("guide rail, guide rail type and Floor cannot be empty");
      return;
    }

    //console.log("Guide Rail Data:", JSON.stringify(guideRail, null, 2));
    //console.log(JSON.stringify(guideRail, null, 2)+"-----"+editId+"========"+form.counterFrameType+"==="+form.liftTypeId+"----"+form.floor);
    const isDuplicate = guideRails.some(
      (lt) =>
        // decodeHtmlEntities(lt.counterWeightName).toUpperCase() === name.toUpperCase() &&
        lt.id !== editId &&
        lt.counterWeightTypeId === Number(form.guideRailType) &&
        lt.floorId === Number(form.floor)
    );
    if (isDuplicate) {
      toast.error(
        "A Guide Rail with this guide rail Type already exists for the selected floor."
      );
      return;
    }

    try {
      const url = editId ? `${API_GUIDE_RAIL}/${editId}` : API_GUIDE_RAIL;
      const method = editId ? "put" : "post";

      const { data } = await axiosInstance({
        method,
        url,
        data: {
          counterWeightName: name,
          counterWeightTypeId: form.guideRailType,
          floorsId: form.floor,
          price: form.price,
        },
      });

      toast.success(`guideRail ${editId ? "updated" : "created"}`);
      setForm(initials);
      setEditId("");
      fetchGuideRail();
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || err.message || "Error saving guide rail "
      );
    }
  };

  const handleEdit = (CopObj) => {
    const numericId = Number(CopObj.id);
    const found = guideRails.find((l) => l.id === numericId);

    if (!found) {
      toast.error("guideRail not found");
      return;
    }

    // Find the floor object and get its id
    const floor = floors.find((f) => f.floorName === CopObj.floorName);

    const counterWeightType = guideRailTypes.find(
      (ft) => ft.name === CopObj.counterWeightTypeName
    );

    setForm({
      guideRail: decodeHtmlEntities(found.counterWeightName),
      guideRailType: counterWeightType ? counterWeightType.id : "",
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
    const selected = guideRails.find((d) => d.id === id);
    if (!selected) {
      toast.error("Guide Rail not found.");
      return;
    }
    confirmDeleteWithToast(selected.counterWeightName, async () => {
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

  const filteredList = guideRails.filter((lt) =>
    lt.counterWeightName?.toLowerCase().includes(searchTerm.toLowerCase())
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
      <div className="bg-gray-50 border border-gray-500 rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-800 flex items-center gap-2">
          <SquareStack className="w-5 h-5 text-gray-600" />
          Guide Rail Types
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
                value={typeForm.guideRailType || ""}
                onChange={(e) =>
                  setTypeForm({ ...typeForm, guideRailType: e.target.value })
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
              title="Guide Rail Type List"
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

      <div className="bg-gray-50 border border-gray-500 rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-800 flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-gray-600" />
          Guide Rail
        </h2>

        <ResponsiveForm
          onSubmit={handleSubmit}
          columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          className="mt-4"
        >
          <FormInput
            type="text"
            placeholder="Enter Guide Rail Name"
            value={form.guideRail || ""}
            onChange={(e) =>
              setForm({ ...form, guideRail: e.target.value })
            }
            required
          />

          <FormSelect
            value={form.guideRailType || ""}
            onChange={(e) =>
              setForm({ ...form, guideRailType: e.target.value })
            }
            required
          >
            <option value="" disabled>
              Select Guide Rail Type
            </option>
            {guideRailTypes.map((type) => (
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
                {/* {type.floorName} */}
                {type.id}
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

            <FormButton
              type="button"
              variant="secondary"
              onClick={handleCancel}
            >
              Cancel
            </FormButton>
          </div>
        </ResponsiveForm>

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

      {/* <div className="bg-white border border-gray-200 rounded-lg p-6">
        <ResponsiveForm
          onSubmit={handleSubmit}
          columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-5"
          className="mt-4"
        >
          <FormInput
            type="text"
            placeholder="Enter Guide Rail Type Name"
            value={form.guideRail}
            onChange={(e) =>
              setForm({ ...form, guideRail: e.target.value })
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
      /> */}
    </div>
  );
}
