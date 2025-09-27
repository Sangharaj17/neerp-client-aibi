"use client";

import toast from "react-hot-toast";
import React, { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { getTenantHeaders } from "@/app/[tenant]/utils/tenantHeaders";
import axiosInstance from "@/utils/axiosInstance";
import { API_ENDPOINTS } from "@/utils/apiEndpoints";

const API = {
  // unit: "/api/unit",
  // capacityType: "/api/capacityTypes",
  // weight: "/api/weights",
  // personCapacity: "/api/personCapacity",
  unit: API_ENDPOINTS.UNIT,
  capacityType: API_ENDPOINTS.CAPACITY_TYPES,
  weight: API_ENDPOINTS.WEIGHTS,
  personCapacity: API_ENDPOINTS.PERSON_CAPACITY,
};

export default function UnitCapacityCrud() {
  const [units, setUnits] = useState([]);
  const [capacityTypes, setCapacityTypes] = useState([]);
  const [weight, setWeight] = useState([]);
  const [personCaps, setPersonCaps] = useState([]);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [isPersonDuplicate, setIsPersonDuplicate] = useState(false);
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
    weightCapType: 2, // If needed, capacityType for Kg
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
    setWeightForm({
      editId: null,
      weightUnit: "",
      weightValue: "",
      weightCapType: 2, // Kg CapacityType (id = 2)
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
      (ct) => normalize(ct.type) === "kgs" || normalize(ct.type) === "kg"
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
        +w.unit === +weightForm.weightUnit &&
        +w.weightValue === +weightForm.weightValue &&
        +w.capacityType === +weightForm.weightCapType
    );

    setIsDuplicate(duplicate);
  }, [weightForm, weight]);

  useEffect(() => {
    if (!personForm.personWeight) {
      setPersonForm((prev) => ({ ...prev, personWeight: "68" }));
    }
  }, [personForm.personName, personForm.personCount]);

  const fetchAll = async () => {
    // const [u, t, k, p] = await Promise.all([
    //   fetch(API.unit, { headers: getTenantHeaders() })
    //     .then((r) => r.json())
    //     .then((r) => r.data || []),

    //   fetch(API.capacityType, { headers: getTenantHeaders() })
    //     .then((r) => r.json())
    //     .then((r) => r.data || []),

    //   fetch(API.kgs, { headers: getTenantHeaders() })
    //     .then((r) => r.json())
    //     .then((r) => r.data || []),

    //   fetch(API.personCapacity, { headers: getTenantHeaders() })
    //     .then((r) => r.json())
    //     .then((r) => r.data || []),
    // ]);

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
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const postData = async (endpoint, data, editId = null, onSuccessReset) => {
    if (endpoint === "personCapacity") {
      // Check for a duplicate here before any network request is made
      const duplicate = personCaps.some(
        (p) =>
          +p.personCount === +data.personCount &&
          p.label?.toLowerCase() === data.label?.toLowerCase() &&
          +p.individualWeight === +data.individualWeight &&
          +p.unitId === +data.unitId &&
          // Exclude the current item when updating to allow for self-matches
          p.id !== editId
      );

      if (duplicate) {
        toast.error("This entry is a duplicate of an existing record.");
        return; // Stop the function from proceeding
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
    const toastId = toast.loading("Deleting...");
    try {
      await axiosInstance.delete(`${API[endpoint]}/${id}`);

      // Reset the correct form if editing the deleted item
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

  // useEffect(() => {
  //   const duplicate = personCaps.some(
  //     (p) =>
  //       // Check for same personCount
  //       +p.personCount === +personForm.personCount &&
  //       // Check for same personLabel (case-insensitive)
  //       p.label?.toLowerCase() === personForm.personLabel?.toLowerCase() &&
  //       // Check for same personWeight
  //       +p.individualWeight === +personForm.personWeight &&
  //       // Check for same personUnit
  //       +p.unitId === +personForm.personUnit &&
  //       // EXCLUDE the current item from the check when editing
  //       p.id !== personForm.editId
  //   );
  //   setIsPersonDuplicate(duplicate);
  // }, [personForm, personCaps]);

  return (
    <div className="space-y-10 p-6 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Units */}
        <Section title="Units" searchKey="unit" setSearch={setSearch}>
          <form
            onSubmit={(e) => {
              e.preventDefault();

              // Unit name/desc validation
              const isNumeric = (value) => /^\d+$/.test(value);
              if (isNumeric(unitForm.unit) || isNumeric(unitForm.unitDesc)) {
                toast.error(
                  "Unit Name and Description should be strings, not numbers."
                );
                return;
              }

              postData(
                "unit",
                { unitName: unitForm.unit, description: unitForm.unitDesc },
                unitForm.editId,
                resetUnitForm
              );
            }}
            className="flex gap-2"
          >
            <input
              value={unitForm.unit}
              onChange={(e) =>
                setUnitForm({ ...unitForm, unit: e.target.value })
              }
              required
              placeholder="Unit Name"
              className="border px-2 py-1 rounded-md"
            />
            <input
              value={unitForm.unitDesc}
              onChange={(e) =>
                setUnitForm({ ...unitForm, unitDesc: e.target.value })
              }
              required
              placeholder="Unit Description"
              className="border px-2 py-1 rounded-md"
            />
            {unitForm.editId ? (
              <>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-1 rounded-md hover:bg-green-700"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={resetUnitForm}
                  className="bg-gray-400 text-white px-4 py-1 rounded-md hover:bg-gray-500"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700"
              >
                Add
              </button>
            )}
          </form>

          <Table
            headers={["#", "Name", "Description", "Actions"]}
            rows={(Array.isArray(units) ? units : [])
              .filter((u) =>
                u.unitName?.toLowerCase().includes(search.unit.toLowerCase())
              )
              .map((u, i) => [
                i + 1,
                u.unitName,
                u.description,
                <div className="flex gap-2 justify-center">
                  {u.id === 1 && u.unitName === "Kg" ? (
                    <span className="text-gray-500 text-sm italic">
                      Not editable or deletable
                    </span>
                  ) : (
                    <>
                      <button
                        onClick={() =>
                          setUnitForm({
                            ...unitForm,
                            editId: u.id,
                            unit: u.unitName,
                            unitDesc: u.description,
                          })
                        }
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <Pencil
                          size={16}
                          className="text-blue-500 cursor-pointer hover:text-blue-700"
                        />
                      </button>
                      <button
                        onClick={() => deleteData("unit", u.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <Trash2
                          size={16}
                          className="text-red-400 cursor-pointer hover:text-red-700"
                        />
                      </button>
                    </>
                  )}
                </div>,
              ])}
          />
        </Section>

        {/* Capacity Types */}
        <Section title="Capacity Types" searchKey="type" setSearch={setSearch}>
          {/* <form
            onSubmit={(e) => {
              e.preventDefault();
              postData(
                "capacityType",
                { type: capacityTypeForm.type },
                capacityTypeForm.editId,
                resetCapacityTypeForm
              );
            }}
            className="flex gap-2"
          >
            <input
              value={capacityTypeForm.type}
              onChange={(e) =>
                setCapacityTypeForm({
                  ...capacityTypeForm,
                  type: e.target.value,
                })
              }
              placeholder="Type (Kg, Persons)"
              required
              className="border px-2 py-1 rounded-md"
            />
            {capacityTypeForm.editId ? (
              <>
                <button type="submit" 
      className="bg-green-600 text-white px-4 py-1 rounded-md hover:bg-green-700"
    >Update</button>
                <button type="button" onClick={resetCapacityTypeForm}
      className="bg-gray-400 text-white px-4 py-1 rounded-md hover:bg-gray-500"
    >
                  Cancel
                </button>
              </>
            ) : (
              <button type="submit"
    className="bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700"
  >Add</button>
            )}
          </form> */}
          <Table
            //headers={["#", "Type", "Actions"]}
            headers={["#", "Type"]}
            rows={capacityTypes
              .filter((t) =>
                t.type.toLowerCase().includes(search.type.toLowerCase())
              )
              .map((t, i) => [
                i + 1,
                t.type,

                // <div className="flex gap-2 justify-center">
                //   <button
                //     onClick={() =>
                //       setCapacityTypeForm({
                //         ...capacityTypeForm,
                //         editId: t.id,
                //         type: t.type,
                //       })
                //     }
                //     className="text-blue-600 hover:text-blue-800"
                //     title="Edit"
                //   >
                //     <Pencil size={16} />
                //   </button>
                //   <button
                //     onClick={() => deleteData("capacityType", t.id)}
                //     className="text-red-600 hover:text-red-800"
                //     title="Delete"
                //   >
                //     <Trash2 size={16} />
                //   </button>
                // </div>,
              ])}
          />
        </Section>
      </div>

      {/* weight */}
      <Section title="Weight Capacity" searchKey="weight" setSearch={setSearch}>
        <form
          onSubmit={(e) => {
            e.preventDefault();

            if (
              isNaN(weightForm.weightValue) ||
              weightForm.weightValue === ""
            ) {
              toast.error("Weight value must be a number.");
              return;
            }

            postData(
              "weight",
              {
                unitId: weightForm.weightUnit || 1,
                weightValue: +weightForm.weightValue,
                capacityTypeId: weightForm.weightCapType,
                //capacity_type: kgsForm.kgsCapType,
                //capacity_type: 2, // Kg CapacityType (id = 2)
              },
              weightForm.editId,
              resetWeightForm
            );
          }}
          className={`flex gap-2 flex-wrap ${
            weightForm.editId ? "bg-yellow-50 p-2 rounded-md" : ""
          }`}
        >
          <select
            value={weightForm.weightUnit}
            onChange={(e) =>
              setWeightForm({ ...weightForm, weightUnit: e.target.value })
            }
            className="border px-2 py-1"
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
            onChange={(e) =>
              setWeightForm({ ...weightForm, weightValue: e.target.value })
            }
            type="number"
            placeholder="Weight Value"
            className="border px-2 py-1 rounded-md"
          />
          {/* <select
            value={kgsForm.kgsCapType}
            onChange={(e) =>
              setKgsForm({ ...kgsForm, kgsCapType: e.target.value })
            }
            className="border px-2 py-1 rounded-md"
          >
            <option value="">Select Capacity Type</option>
            {capacityTypes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.type}
              </option>
            ))}
          </select> */}
          {weightForm.editId ? (
            <>
              <button
                disabled={isDuplicate}
                className={`${
                  isDuplicate ? "bg-gray-400" : "bg-green-600"
                } text-white px-3 py-1 rounded`}
              >
                Update
              </button>
              <button
                type="button"
                onClick={resetWeightForm}
                className="bg-gray-400 text-white px-3 py-1 rounded"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              disabled={isDuplicate}
              className={`${
                isDuplicate ? "bg-gray-400" : "bg-blue-600"
              } text-white px-3 py-1 rounded`}
            >
              Add
            </button>
          )}
          {isDuplicate && (
            <p className="text-red-500 text-sm mt-1">
              This weight already exists for the selected unit and type.
            </p>
          )}
        </form>

        <div className="max-h-[200px] overflow-y-auto rounded">
          <Table
            headers={["#", "Unit", "Weight", "Capacity Type", "Actions"]}
            rows={weight
              .filter((k) => `${k.weightValue}`.includes(search.weight))
              .map((k, i) => [
                i + 1,
                units.find((u) => u.id === k.unitId)?.unitName || "-",
                k.weightValue,
                capacityTypes.find((c) => c.id === k.capacityTypeId)?.type ||
                  "-",
                <div className="flex gap-2 justify-left">
                  <button
                    onClick={() =>
                      setWeightForm({
                        editId: k.id,
                        weightUnit: k.unitId,
                        weightValue: k.weightValue,
                        weightCapType: k.capacityTypeId,
                      })
                    }
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit"
                  >
                    <Pencil
                      size={16}
                      className="text-blue-500 cursor-pointer hover:text-blue-700"
                    />
                  </button>
                  <button
                    onClick={() => deleteData("weight", k.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <Trash2
                      size={16}
                      className="text-red-400 cursor-pointer hover:text-red-700"
                    />
                  </button>
                </div>,
              ])}
          />
        </div>
      </Section>

      {/* Person Capacity */}
      <Section title="Person Capacity" searchKey="person" setSearch={setSearch}>
        <form
          onSubmit={(e) => {
            e.preventDefault();

            if (
              isNaN(personForm.personCount) ||
              (!personForm.personWeight && isNaN(68)) || // fallback will be 68
              !isNaN(personForm.personLabel)
            ) {
              toast.error(
                "Count and Weight must be numbers. Name must be a string."
              );
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
          className={`flex gap-2 flex-wrap ${
            personForm.editId ? "bg-yellow-50 p-2 rounded-md" : ""
          }`}
        >
          <input
            type="number"
            value={personForm.personCount}
            onChange={(e) =>
              setPersonForm({ ...personForm, personCount: e.target.value })
            }
            placeholder="Count"
            className="border px-2 py-1 rounded-md"
          />
          <input
            value={personForm.personLabel ?? ""}
            onChange={(e) =>
              setPersonForm({ ...personForm, personLabel: e.target.value })
            }
            placeholder="Name"
            className="border px-2 py-1 rounded-md"
          />
          <input
            type="number"
            value={personForm.personWeight}
            onChange={(e) =>
              setPersonForm({ ...personForm, personWeight: e.target.value })
            }
            placeholder="Number to calculate weight(68)"
            className="border px-2 py-1 rounded-md"
          />
          <select
            value={personForm.personUnit}
            onChange={(e) =>
              setPersonForm({ ...personForm, personUnit: e.target.value })
            }
            className="border px-2 py-1 rounded-md"
          >
            <option value="">Unit</option>
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.unitName}
              </option>
            ))}
          </select>
          {/* <select
            value={personForm.personCapType}
            onChange={(e) =>
              setPersonForm({ ...personForm, personCapType: e.target.value })
            }
            className="border px-2 py-1"
          >
            <option value="">Capacity Type</option>
            {capacityTypes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.type}
              </option>
            ))}
          </select> */}
          {personForm.editId ? (
            <>
              <button
                type="submit"
                className={`bg-green-600" text-white px-3 py-1 rounded`}
                //disabled={isPersonDuplicate}
              >
                Update
              </button>
              <button
                type="button"
                onClick={resetPersonForm}
                className="bg-gray-400 text-white px-3 py-1 rounded"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              type="submit"
              className={`bg-blue-600 text-white px-3 py-1 rounded`}
              // className={`${
              //   isPersonDuplicate ? "bg-gray-400" : "bg-blue-600"
              // } text-white px-3 py-1 rounded`}
              //disabled={isPersonDuplicate}
            >
              Add
            </button>
          )}
        </form>
        <div className="max-h-[200px] overflow-y-auto rounded">
          <Table
            headers={[
              "#",
              "Count (Persons)",
              "Label",
              "Individual Weight (Kg)",
              "Unit",
              "Capacity Type",
              "Combined Weight",
              "Actions",
            ]}
            rows={personCaps
              .filter((p) =>
                p.label.toLowerCase().includes(search.person.toLowerCase())
              )
              .map((p, i) => [
                i + 1,
                p.personCount,
                p.label,
                p.individualWeight,
                units.find((u) => u.id === p.unitId)?.unitName || "-",
                capacityTypes.find((c) => c.id === p.capacityTypeId)?.type ||
                  "-",
                p.displayName,
                <div className="flex gap-2 justify-center">
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
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit"
                  >
                    <Pencil
                      size={16}
                      className="text-blue-500 cursor-pointer hover:text-blue-700"
                    />
                  </button>
                  <button
                    onClick={() => deleteData("personCapacity", p.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <Trash2
                      size={16}
                      className="text-red-400 cursor-pointer hover:text-red-700"
                    />
                  </button>
                </div>,
              ])}
          />
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children, searchKey, setSearch }) {
  return (
    <div className="space-y-2 p-4 bg-white rounded shadow-lg border border-gray-200">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{title}</h2>
        <input
          type="text"
          placeholder="Search..."
          onChange={(e) =>
            setSearch((prev) => ({ ...prev, [searchKey]: e.target.value }))
          }
          className="border px-2 py-1 text-sm w-48  rounded-md"
        />
      </div>
      {children}
    </div>
  );
}

// function Table({ headers, rows }) {
//   return (
//     <div className="overflow-x-auto">
//       <table className="min-w-full text-sm border">
//         <thead className="bg-gray-100">
//           <tr>
//             {headers.map((h, i) => (
//               <th key={i} className="border px-2 py-1">
//                 {h}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {rows.map((row, ri) => (
//             <tr key={ri} className="border-t">
//               {row.map((cell, ci) => (
//                 <td key={ci} className="px-2 py-1 text-center">
//                   {cell}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

export async function fetchDataArray(url) {
  try {
    const res = await axiosInstance.get(url);
    return Array.isArray(res.data?.data) ? res.data.data : [];
  } catch (error) {
    console.error(
      "Error fetching data:",
      error.response?.data || error.message
    );
    return [];
  }
}

const Table = ({ headers, rows }) => {
  return (
    <table className="min-w-full text-sm text-left border-separate border-spacing-0">
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th
              key={index}
              className="sticky top-0 bg-white z-10 px-4 py-2 border-b border-gray-200"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex} className="even:bg-gray-50">
            {row.map((cell, cellIndex) => (
              <td
                key={cellIndex}
                className="px-4 py-2 border-b border-gray-100"
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
