"use client";

import toast from "react-hot-toast";
import React, { useState, useEffect } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import { API_ENDPOINTS } from "@/utils/apiEndpoints";

const API = {
  unit: API_ENDPOINTS.UNIT,
  capacityType: API_ENDPOINTS.CAPACITY_TYPES,
  weight: API_ENDPOINTS.WEIGHTS,
  personCapacity: API_ENDPOINTS.PERSON_CAPACITY,
};

const getDefaultWeightsData = (unitId, capacityTypeId) => [
  { unitId, weightValue: 100, capacityTypeId },
  { unitId, weightValue: 150, capacityTypeId },
  { unitId, weightValue: 200, capacityTypeId },
  { unitId, weightValue: 250, capacityTypeId },
  { unitId, weightValue: 300, capacityTypeId },
  { unitId, weightValue: 500, capacityTypeId },
  { unitId, weightValue: 750, capacityTypeId },
  { unitId, weightValue: 1000, capacityTypeId },
  { unitId, weightValue: 1500, capacityTypeId },
  { unitId, weightValue: 2000, capacityTypeId },
  { unitId, weightValue: 2500, capacityTypeId },
  { unitId, weightValue: 3000, capacityTypeId },
];

const getDefaultPersonCapsData = (unitId, capacityTypeId) => [
  { personCount: 4, label: "Persons", individualWeight: 68, unitId, capacityTypeId },
  { personCount: 5, label: "Persons", individualWeight: 68, unitId, capacityTypeId },
  { personCount: 6, label: "Persons", individualWeight: 68, unitId, capacityTypeId },
  { personCount: 8, label: "Persons", individualWeight: 68, unitId, capacityTypeId },
  { personCount: 10, label: "Persons", individualWeight: 68, unitId, capacityTypeId },
  { personCount: 13, label: "Persons", individualWeight: 68, unitId, capacityTypeId },
  { personCount: 15, label: "Persons", individualWeight: 68, unitId, capacityTypeId },
  { personCount: 20, label: "Persons", individualWeight: 68, unitId, capacityTypeId },
];

export default function UnitCapacityCrud() {
  const [units, setUnits] = useState([]);
  const [capacityTypes, setCapacityTypes] = useState([]);
  const [weight, setWeight] = useState([]);
  const [personCaps, setPersonCaps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [search, setSearch] = useState({
    unit: "",
    type: "",
    weight: "",
    person: "",
  });

  const [unitForm, setUnitForm] = useState({
    editId: null,
    unit: "",
    unitDesc: "",
  });

  const [capacityTypeForm, setCapacityTypeForm] = useState({
    editId: null,
    type: "",
  });

  const [weightForm, setWeightForm] = useState({
    editId: null,
    weightUnit: "",
    weightValue: "",
    weightCapType: "",
  });

  const [personForm, setPersonForm] = useState({
    editId: null,
    personCount: "",
    personLabel: "Persons",
    personWeight: "",
    personUnit: "",
    personCapType: "",
  });

  const resetUnitForm = () =>
    setUnitForm({ editId: null, unit: "", unitDesc: "" });

  const resetCapacityTypeForm = () =>
    setCapacityTypeForm({ editId: null, type: "" });

  const resetWeightForm = () => {
    const normalize = (str) => str?.toLowerCase().replace(/\s/g, "");
    const kgUnit = units.find(
      (u) => normalize(u.unitName) === "kg" || normalize(u.unitName) === "kgs"
    );
    const weightCapType = capacityTypes.find(
      (ct) => normalize(ct.type) === "weight" || normalize(ct.type) === "kg"
    );

    setWeightForm({
      editId: null,
      weightUnit: kgUnit?.id || "",
      weightValue: "",
      weightCapType: weightCapType?.id || "",
    });
  };

  const resetPersonForm = () => {
    setPersonForm({
      editId: null,
      personCount: "",
      personLabel: "Persons",
      personWeight: "",
      personUnit: "",
      personCapType: "",
    });
  };

  useEffect(() => {
    const normalize = (str) => str?.toLowerCase().replace(/\s/g, "");

    const kgUnit = units.find(
      (u) => normalize(u.unitName) === "kg" || normalize(u.unitName) === "kgs"
    );

    const personCapType = capacityTypes.find(
      (ct) =>
        normalize(ct.type) === "person" || normalize(ct.type) === "persons"
    );

    if (kgUnit || personCapType) {
      setPersonForm((prev) => ({
        ...prev,
        personWeight: prev.personWeight || "68",
        personUnit: kgUnit?.id || prev.personUnit,
        personCapType: personCapType?.id || prev.personCapType,
      }));
    }

    const kgsType = capacityTypes.find(
      (ct) => normalize(ct.type) === "weight" || normalize(ct.type) === "kg"
    );

    if (kgUnit || kgsType) {
      setWeightForm((prev) => ({
        ...prev,
        weightUnit: kgUnit?.id || prev.weightUnit,
        weightCapType: kgsType?.id || prev.weightCapType,
      }));
    }
  }, [units, capacityTypes]);

  useEffect(() => {
    const duplicate = weight.some(
      (w) =>
        +w.unitId === +weightForm.weightUnit &&
        +w.weightValue === +weightForm.weightValue &&
        +w.capacityTypeId === +weightForm.weightCapType
    );

    setIsDuplicate(duplicate);
  }, [weightForm, weight]);

  useEffect(() => {
    if (!personForm.personWeight) {
      setPersonForm((prev) => ({ ...prev, personWeight: "68" }));
    }
  }, [personForm.personName, personForm.personCount]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [u, t, k, p] = await Promise.all([
        fetchDataArray(API.unit),
        fetchDataArray(API.capacityType),
        fetchDataArray(API.weight),
        fetchDataArray(API.personCapacity),
      ]);

      setUnits(Array.isArray(u) ? u : []);
      setCapacityTypes(Array.isArray(t) ? t : []);
      setWeight(Array.isArray(k) ? k : []);
      setPersonCaps(Array.isArray(p) ? p : []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const postData = async (endpoint, data, editId = null, onSuccessReset) => {
    if (endpoint === "personCapacity") {
      const duplicate = personCaps.some(
        (p) =>
          +p.personCount === +data.personCount &&
          p.label?.toLowerCase() === data.label?.toLowerCase() &&
          +p.individualWeight === +data.individualWeight &&
          +p.unitId === +data.unitId &&
          p.id !== editId
      );

      if (duplicate) {
        toast.error("This entry is a duplicate of an existing record.");
        return;
      }
    }

    const method = editId ? "PUT" : "POST";
    const url = editId ? `${API[endpoint]}/${editId}` : API[endpoint];

    const toastId = toast.loading(editId ? "Updating..." : "Adding...");
    try {
      let res;

      if (method === "POST") {
        res = await axiosInstance.post(url, data);
      } else if (method === "PUT" || method === "PATCH") {
        res = await axiosInstance.put(url, data);
      } else {
        throw new Error("Unsupported method for this action.");
      }

      const result = res.data;

      if (!result || result.success === false) {
        throw new Error(
          result.message || `Failed to ${editId ? "update" : "add"}`
        );
      }

      await fetchAll();
      if (onSuccessReset) onSuccessReset();

      toast.success(editId ? "Updated successfully!" : "Added successfully!", {
        id: toastId,
      });
    } catch (error) {
      console.error("Error in submit:", error);
      toast.error(`Error: ${error.response?.data?.message || error.message}`, {
        id: toastId,
      });
    }
  };

  const deleteData = async (endpoint, id) => {
    if (!confirm("Are you sure you want to delete this item?")) {
      return;
    }

    const toastId = toast.loading("Deleting...");
    try {
      await axiosInstance.delete(`${API[endpoint]}/${id}`);

      if (endpoint === "unit" && unitForm.editId === id) resetUnitForm();
      if (endpoint === "capacityType" && capacityTypeForm.editId === id)
        resetCapacityTypeForm();
      if (endpoint === "weight" && weightForm.editId === id) resetWeightForm();
      if (endpoint === "personCapacity" && personForm.editId === id)
        resetPersonForm();

      await fetchAll();
      toast.success("Deleted successfully!", { id: toastId });
    } catch (error) {
      toast.error(`Error: ${error.response?.data?.message || error.message}`, {
        id: toastId,
      });
    }
  };

  const addDefaultWeights = async () => {
    const toastId = toast.loading("Adding default weights...");

    try {
      // Find the Kg unit
      const normalize = (str) => str?.toLowerCase().replace(/\s/g, "");
      const kgUnit = units.find(
        (u) => normalize(u.unitName) === "kg" || normalize(u.unitName) === "kgs"
      );

      // Find the Weight capacity type
      const weightCapType = capacityTypes.find(
        (ct) => normalize(ct.type) === "weight" || normalize(ct.type) === "kg"
      );

      if (!kgUnit) {
        toast.error("Please create a 'Kg' unit first", { id: toastId });
        return;
      }

      if (!weightCapType) {
        toast.error("Please ensure 'Weight' capacity type exists", { id: toastId });
        return;
      }

      const dataToPost = getDefaultWeightsData(kgUnit.id, weightCapType.id);
      let addedCount = 0;

      for (const data of dataToPost) {
        const isAlreadyExisting = weight.some(
          (w) =>
            +w.unitId === +data.unitId &&
            +w.weightValue === +data.weightValue &&
            +w.capacityTypeId === +data.capacityTypeId
        );

        if (!isAlreadyExisting) {
          try {
            await axiosInstance.post(API.weight, data);
            addedCount++;
          } catch (error) {
            console.error(`Failed to add weight ${data.weightValue}:`, error);
          }
        }
      }

      await fetchAll();

      if (addedCount > 0) {
        toast.success(`Added ${addedCount} default weight(s)`, { id: toastId });
      } else {
        toast.success("All default weights already exist", { id: toastId });
      }
    } catch (error) {
      console.error("Error adding default weights:", error);
      toast.error("Failed to add default weights", { id: toastId });
    }
  };

  const addDefaultPersonCaps = async () => {
    const toastId = toast.loading("Adding default person capacities...");

    try {
      const normalize = (str) => str?.toLowerCase().replace(/\s/g, "");
      const kgUnit = units.find(
        (u) => normalize(u.unitName) === "kg" || normalize(u.unitName) === "kgs"
      );
      const personCapType = capacityTypes.find(
        (ct) => normalize(ct.type) === "person" || normalize(ct.type) === "persons"
      );

      if (!kgUnit) {
        toast.error("Please create a 'Kg' unit first", { id: toastId });
        return;
      }

      if (!personCapType) {
        toast.error("Please ensure 'Person' capacity type exists", { id: toastId });
        return;
      }

      const dataToPost = getDefaultPersonCapsData(kgUnit.id, personCapType.id);
      let addedCount = 0;

      for (const data of dataToPost) {
        const isDuplicate = personCaps.some(
          (p) =>
            +p.personCount === +data.personCount &&
            p.label?.toLowerCase() === data.label?.toLowerCase() &&
            +p.individualWeight === +data.individualWeight &&
            +p.unitId === +data.unitId
        );

        if (!isDuplicate) {
          try {
            await axiosInstance.post(API.personCapacity, data);
            addedCount++;
          } catch (error) {
            console.error(`Failed to add person capacity ${data.personCount}:`, error);
          }
        }
      }

      await fetchAll();

      if (addedCount > 0) {
        toast.success(`Added ${addedCount} default person capacit${addedCount > 1 ? 'ies' : 'y'}`, { id: toastId });
      } else {
        toast.success("All default person capacities already exist", { id: toastId });
      }
    } catch (error) {
      console.error("Error adding default person capacities:", error);
      toast.error("Failed to add default person capacities", { id: toastId });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1400px] mx-auto p-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">Capacity & Unit Management</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage units, capacity types, weights, and person capacities</p>
        </div>

        {/* Units and Capacity Types Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Units Section */}
          <div className="border border-neutral-200 rounded-lg overflow-hidden bg-white">
            <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-medium text-neutral-900">Units</h2>
                <input
                  type="text"
                  placeholder="Search units..."
                  value={search.unit}
                  onChange={(e) => setSearch((prev) => ({ ...prev, unit: e.target.value }))}
                  className="h-8 w-48 rounded-lg border border-neutral-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                />
              </div>
            </div>

            <div className="p-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();

                  const isNumeric = (value) => /^\d+$/.test(value);
                  if (isNumeric(unitForm.unit) || isNumeric(unitForm.unitDesc)) {
                    toast.error("Unit Name and Description must be text, not numbers");
                    return;
                  }

                  postData(
                    "unit",
                    { unitName: unitForm.unit, description: unitForm.unitDesc },
                    unitForm.editId,
                    resetUnitForm
                  );
                }}
                className={`flex gap-2 flex-wrap p-4 rounded-lg mb-4 ${
                  unitForm.editId ? "bg-amber-50 border border-amber-200" : "bg-neutral-50"
                }`}
              >
                <input
                  value={unitForm.unit}
                  onChange={(e) => setUnitForm({ ...unitForm, unit: e.target.value })}
                  required
                  placeholder="Unit Name"
                  className="h-9 flex-1 min-w-[150px] rounded-lg border border-neutral-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                />
                <input
                  value={unitForm.unitDesc}
                  onChange={(e) => setUnitForm({ ...unitForm, unitDesc: e.target.value })}
                  required
                  placeholder="Description"
                  className="h-9 flex-1 min-w-[150px] rounded-lg border border-neutral-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                />
                {unitForm.editId ? (
                  <>
                    <button
                      type="submit"
                      className="h-9 px-4 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      onClick={resetUnitForm}
                      className="h-9 px-4 rounded-lg bg-neutral-400 text-white text-sm font-medium hover:bg-neutral-500 transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    type="submit"
                    className="h-9 px-4 rounded-lg bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
                  >
                    <Plus className="inline-block w-4 h-4 mr-1" />
                    Add
                  </button>
                )}
              </form>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-neutral-50 border-b border-neutral-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600">#</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600">Description</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-100">
                    {units
                      .filter((u) => u.unitName?.toLowerCase().includes(search.unit.toLowerCase()))
                      .map((u, i) => (
                        <tr key={u.id} className="hover:bg-neutral-50 transition-colors">
                          <td className="px-4 py-3 text-neutral-600">{i + 1}</td>
                          <td className="px-4 py-3 font-medium text-neutral-900">{u.unitName}</td>
                          <td className="px-4 py-3 text-neutral-600">{u.description}</td>
                          <td className="px-4 py-3">
                            {u.id === 1 && u.unitName === "Kg" ? (
                              <span className="text-xs text-neutral-400 italic">System default</span>
                            ) : (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() =>
                                    setUnitForm({
                                      editId: u.id,
                                      unit: u.unitName,
                                      unitDesc: u.description,
                                    })
                                  }
                                  className="text-xs text-neutral-600 hover:text-neutral-900 transition-colors"
                                >
                                  Edit
                                </button>
                                <span className="text-neutral-300">·</span>
                                <button
                                  onClick={() => deleteData("unit", u.id)}
                                  className="text-xs text-red-600 hover:text-red-700 transition-colors"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Capacity Types Section */}
          <div className="border border-neutral-200 rounded-lg overflow-hidden bg-white">
            <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-medium text-neutral-900">Capacity Types</h2>
                <input
                  type="text"
                  placeholder="Search types..."
                  value={search.type}
                  onChange={(e) => setSearch((prev) => ({ ...prev, type: e.target.value }))}
                  className="h-8 w-48 rounded-lg border border-neutral-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                />
              </div>
            </div>

            <div className="p-6">
              <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-800">
                  Capacity types are system-defined and cannot be edited. They include "Person" and "Weight".
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-neutral-50 border-b border-neutral-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600">#</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-100">
                    {capacityTypes
                      .filter((t) => t.type.toLowerCase().includes(search.type.toLowerCase()))
                      .map((t, i) => (
                        <tr key={t.id} className="hover:bg-neutral-50 transition-colors">
                          <td className="px-4 py-3 text-neutral-600">{i + 1}</td>
                          <td className="px-4 py-3 font-medium text-neutral-900">{t.type}</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-50 text-green-700">
                              Active
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Weight Capacity Section */}
        <div className="border border-neutral-200 rounded-lg overflow-hidden bg-white mb-6">
          <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-medium text-neutral-900">Weight Capacity</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={addDefaultWeights}
                  className="h-9 px-4 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition-colors"
                >
                  Add Defaults
                </button>
                <input
                  type="text"
                  placeholder="Search weights..."
                  value={search.weight}
                  onChange={(e) => setSearch((prev) => ({ ...prev, weight: e.target.value }))}
                  className="h-8 w-48 rounded-lg border border-neutral-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="p-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();

                if (isNaN(weightForm.weightValue) || weightForm.weightValue === "") {
                  toast.error("Weight value must be a number");
                  return;
                }

                if (!weightForm.weightUnit) {
                  toast.error("Please select a unit");
                  return;
                }

                if (!weightForm.weightCapType) {
                  toast.error("Please ensure capacity types are initialized. Try refreshing the page.");
                  return;
                }

                postData(
                  "weight",
                  {
                    unitId: weightForm.weightUnit,
                    weightValue: +weightForm.weightValue,
                    capacityTypeId: weightForm.weightCapType,
                  },
                  weightForm.editId,
                  resetWeightForm
                );
              }}
              className={`flex gap-2 flex-wrap p-4 rounded-lg mb-4 ${
                weightForm.editId ? "bg-amber-50 border border-amber-200" : "bg-neutral-50"
              }`}
            >
              <select
                value={weightForm.weightUnit}
                onChange={(e) => setWeightForm({ ...weightForm, weightUnit: e.target.value })}
                className="h-9 rounded-lg border border-neutral-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
              >
                <option value="">Select Unit</option>
                {units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.unitName}
                  </option>
                ))}
              </select>
              <input
                value={weightForm.weightValue}
                onChange={(e) => setWeightForm({ ...weightForm, weightValue: e.target.value })}
                type="number"
                placeholder="Weight Value"
                className="h-9 flex-1 min-w-[150px] rounded-lg border border-neutral-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
              />
              {weightForm.editId ? (
                <>
                  <button
                    type="submit"
                    disabled={isDuplicate}
                    className={`h-9 px-4 rounded-lg text-white text-sm font-medium transition-colors ${
                      isDuplicate ? "bg-neutral-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={resetWeightForm}
                    className="h-9 px-4 rounded-lg bg-neutral-400 text-white text-sm font-medium hover:bg-neutral-500 transition-colors"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  type="submit"
                  disabled={isDuplicate}
                  className={`h-9 px-4 rounded-lg text-white text-sm font-medium transition-colors ${
                    isDuplicate ? "bg-neutral-400 cursor-not-allowed" : "bg-neutral-900 hover:bg-neutral-800"
                  }`}
                >
                  <Plus className="inline-block w-4 h-4 mr-1" />
                  Add
                </button>
              )}
              {isDuplicate && (
                <p className="text-xs text-red-600 w-full">
                  This weight already exists for the selected unit and type
                </p>
              )}
            </form>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600">#</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600">Unit</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600">Weight</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600">Capacity Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-100">
                  {weight
                    .filter((k) => `${k.weightValue}`.includes(search.weight))
                    .map((k, i) => (
                      <tr key={k.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-4 py-3 text-neutral-600">{i + 1}</td>
                        <td className="px-4 py-3 text-neutral-900">
                          {units.find((u) => u.id === k.unitId)?.unitName || "-"}
                        </td>
                        <td className="px-4 py-3 font-medium text-neutral-900">{k.weightValue}</td>
                        <td className="px-4 py-3 text-neutral-600">
                          {capacityTypes.find((c) => c.id === k.capacityTypeId)?.type || "-"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                setWeightForm({
                                  editId: k.id,
                                  weightUnit: k.unitId,
                                  weightValue: k.weightValue,
                                  weightCapType: k.capacityTypeId,
                                })
                              }
                              className="text-xs text-neutral-600 hover:text-neutral-900 transition-colors"
                            >
                              Edit
                            </button>
                            <span className="text-neutral-300">·</span>
                            <button
                              onClick={() => deleteData("weight", k.id)}
                              className="text-xs text-red-600 hover:text-red-700 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Person Capacity Section */}
        <div className="border border-neutral-200 rounded-lg overflow-hidden bg-white">
          <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-medium text-neutral-900">Person Capacity</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={addDefaultPersonCaps}
                  className="h-9 px-4 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition-colors"
                >
                  Add Defaults
                </button>
                <input
                  type="text"
                  placeholder="Search persons..."
                  value={search.person}
                  onChange={(e) => setSearch((prev) => ({ ...prev, person: e.target.value }))}
                  className="h-8 w-48 rounded-lg border border-neutral-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="p-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();

                if (
                  isNaN(personForm.personCount) ||
                  (!personForm.personWeight && isNaN(68)) ||
                  !isNaN(personForm.personLabel)
                ) {
                  toast.error("Count and Weight must be numbers. Label must be text");
                  return;
                }

                const finalWeight = personForm.personWeight || 68;

                postData(
                  "personCapacity",
                  {
                    personCount: +personForm.personCount,
                    label: personForm.personLabel,
                    individualWeight: +finalWeight,
                    unitId: personForm.personUnit,
                    capacityTypeId: personForm.personCapType,
                  },
                  personForm.editId,
                  resetPersonForm
                );
              }}
              className={`flex gap-2 flex-wrap p-4 rounded-lg mb-4 ${
                personForm.editId ? "bg-amber-50 border border-amber-200" : "bg-neutral-50"
              }`}
            >
              <input
                type="number"
                value={personForm.personCount}
                onChange={(e) => setPersonForm({ ...personForm, personCount: e.target.value })}
                placeholder="Count"
                className="h-9 w-24 rounded-lg border border-neutral-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
              />
              <input
                value={personForm.personLabel ?? ""}
                onChange={(e) => setPersonForm({ ...personForm, personLabel: e.target.value })}
                placeholder="Label"
                className="h-9 flex-1 min-w-[100px] rounded-lg border border-neutral-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
              />
              <input
                type="number"
                value={personForm.personWeight}
                onChange={(e) => setPersonForm({ ...personForm, personWeight: e.target.value })}
                placeholder="Weight (default: 68)"
                className="h-9 w-40 rounded-lg border border-neutral-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
              />
              <select
                value={personForm.personUnit}
                onChange={(e) => setPersonForm({ ...personForm, personUnit: e.target.value })}
                className="h-9 rounded-lg border border-neutral-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
              >
                <option value="">Select Unit</option>
                {units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.unitName}
                  </option>
                ))}
              </select>
              {personForm.editId ? (
                <>
                  <button
                    type="submit"
                    className="h-9 px-4 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={resetPersonForm}
                    className="h-9 px-4 rounded-lg bg-neutral-400 text-white text-sm font-medium hover:bg-neutral-500 transition-colors"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  type="submit"
                  className="h-9 px-4 rounded-lg bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
                >
                  <Plus className="inline-block w-4 h-4 mr-1" />
                  Add
                </button>
              )}
            </form>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600">#</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600">Count</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600">Label</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600">Individual Weight</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600">Unit</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600">Capacity Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600">Total Weight</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-100">
                  {personCaps
                    .filter((p) => p.label.toLowerCase().includes(search.person.toLowerCase()))
                    .map((p, i) => (
                      <tr key={p.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-4 py-3 text-neutral-600">{i + 1}</td>
                        <td className="px-4 py-3 font-medium text-neutral-900">{p.personCount}</td>
                        <td className="px-4 py-3 text-neutral-600">{p.label}</td>
                        <td className="px-4 py-3 text-neutral-600">{p.individualWeight}</td>
                        <td className="px-4 py-3 text-neutral-600">
                          {units.find((u) => u.id === p.unitId)?.unitName || "-"}
                        </td>
                        <td className="px-4 py-3 text-neutral-600">
                          {capacityTypes.find((c) => c.id === p.capacityTypeId)?.type || "-"}
                        </td>
                        <td className="px-4 py-3 text-neutral-900">{p.displayName}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                setPersonForm({
                                  editId: p.id,
                                  personCount: p.personCount,
                                  personLabel: p.label,
                                  personWeight: p.individualWeight,
                                  personUnit: p.unitId,
                                  personCapType: p.capacityTypeId,
                                })
                              }
                              className="text-xs text-neutral-600 hover:text-neutral-900 transition-colors"
                            >
                              Edit
                            </button>
                            <span className="text-neutral-300">·</span>
                            <button
                              onClick={() => deleteData("personCapacity", p.id)}
                              className="text-xs text-red-600 hover:text-red-700 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export async function fetchDataArray(url) {
  try {
    const res = await axiosInstance.get(url);
    if (Array.isArray(res.data?.data)) {
      return res.data.data;
    } else if (Array.isArray(res.data)) {
      return res.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching data:", error.response?.data || error.message);
    return [];
  }
}
