"use client";

import React, { useState, useMemo, useEffect } from "react";

import toast from "react-hot-toast";
import Checkbox from "@/components/UI/Checkbox";

export default function LiftModal({ lift, onClose, onSave }) {
  const [activeTab, setActiveTab] = useState(0);
  const [errors, setErrors] = useState({});

  const tabClass = (index) =>
    `px-4 py-2 rounded-t-md border-b-2 ${
      activeTab === index
        ? "bg-blue-600 text-white font-semibold"
        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
    }`;

  const fieldLabels = {}; // Declare it at component level (outside render return)

  function getLabel(key, labelText) {
    fieldLabels[key] = labelText;
    return labelText;
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft" && activeTab > 0) {
        setActiveTab((prev) => prev - 1);
      } else if (e.key === "ArrowRight" && activeTab < 3) {
        setActiveTab((prev) => prev + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTab]);

  const personOptions = [
    "01 Person/240Kg",
    "02 Persons/360Kg",
    "04 Persons/480Kg",
    "06 Persons/720Kg",
    "08 Persons/960Kg",
    "10 Persons/1200Kg",
    "13 Persons/1560Kg",
    "15 Persons/1800Kg",
  ];
  const kgOptions = ["100Kg", "150Kg", "200Kg", "250Kg", "300Kg", "400Kg"];
  const floorOptions = Array.from({ length: 21 }, (_, i) => i + 1);
  const stopsOptions = Array.from({ length: 19 }, (_, i) => i + 1);
  const speedOptions = ["0.25", "0.30", "0.50", "1", "1.5", "2"];
  const cabinTypes = ["M.S. Powder Coated", "Stainless Steel", "Glass Cabin"];
  const carEntranceTypes = [
    "IMPERFORATE MANUAL CABIN DOOR",
    "M.S. TELESCOPIC MANUAL CABIN DOOR WITH SMALL VISION",
    "COLLAPSIBLE MANUAL CABIN DOOR",
  ];
  const carEntranceSubTypes = {
    "IMPERFORATE MANUAL CABIN DOOR": ["Single Panel", "Center Opening"],
    "M.S. TELESCOPIC MANUAL CABIN DOOR WITH SMALL VISION": [
      "2 Panel",
      "3 Panel",
    ],
    "COLLAPSIBLE MANUAL CABIN DOOR": [
      "Mild Steel",
      "Powder Coated",
      "SS Finish",
    ],
  };
  const cabinFlooring = ["Chequered Plate", "Flooring By Customer", "PVC Mat"];
  const cabinCeiling = [
    "Standard False Flooring",
    "Designer False Flooring",
    "Acrylic False Flooring",
  ];
  const airSystem = ["FAN", "Blower"];
  const landingEntrance = [
    "M.S. SWING MANUAL LANDING DOOR",
    "IMPERFORATE MANUAL LANDING DOOR",
    "",
  ];

  const [formData, setFormData] = useState(() => ({
    liftType: lift.data?.liftType || "",
    capacityType: lift.data?.capacityType || "",
    capacityValue: lift.data?.capacityValue || "",
    stops: lift.data?.stops || "",
    floors: lift.data?.floors || "",
    openings: lift.data?.openings || "",
    floorDesignations: lift.data?.floorDesignations || "",
    carTravel: lift.data?.carTravel || "",
    speed: lift.data?.speed || "",
    cabinType: lift.data?.cabinType || "",
    lightFitting: lift.data?.lightFitting || "",
    cabinFlooring: lift.data?.cabinFlooring || "",
    cabinCeiling: lift.data?.cabinCeiling || "",
    airSystem: lift.data?.airSystem || "",
    carEntrance: lift.data?.carEntrance || "",
    carEntranceSubType: lift.data?.carEntranceSubType || "",
    landingEntrance: lift.data?.landingEntrance || "",
    landingEntranceCount: lift.data?.landingEntranceCount || "",

    //tab2
    technicalSpec1: lift.data?.technicalSpec1 || "",
    controlPanelMake: lift.data?.controlPanelMake || "",
    wiringHarness: lift.data?.wiringHarness || "",
    guideRail: lift.data?.guideRail || "",
    bracketType: lift.data?.bracketType || "",
    ropingType: lift.data?.ropingType || "",
    lopType: lift.data?.lopType || "",
    copType: lift.data?.copType || "",
    overhead: lift.data?.overhead || "",
    operationType: lift.data?.operationType || "",
    machineRoom1: lift.data?.machineRoom1 || "",
    machineRoom2: lift.data?.machineRoom2 || "",
    shaftWidth: lift.data?.shaftWidth || "",
    shaftDepth: lift.data?.shaftDepth || "",
    carInternalWidth: lift.data?.carInternalWidth || "",
    carInternalDepth: lift.data?.carInternalDepth || "",
    carInternalHeight: lift.data?.carInternalHeight || "",

    //tab3
    // Standard Features (Checkboxes)
    emergencyFireman: lift.data?.emergencyFireman || false,
    emergencyCarLight: lift.data?.emergencyCarLight || false,
    infraredDoor: lift.data?.infraredDoor || false,
    doorTimeProtection: lift.data?.doorTimeProtection || false,
    alarmButton: lift.data?.alarmButton || false,
    extraDoorTime: lift.data?.extraDoorTime || false,
    doorOpenClose: lift.data?.doorOpenClose || false,
    manualRescue: lift.data?.manualRescue || false,
    autoFanCut: lift.data?.autoFanCut || false,
    overloadWarning: lift.data?.overloadWarning || false,
    autoRescue: lift.data?.autoRescue || false,

    // Part Makers & Payment Terms (Dropdowns/Input)
    vfdMainDrive: lift.data?.vfdMainDrive || "",
    doorOperator: lift.data?.doorOperator || "",
    mainMachineSet: lift.data?.mainMachineSet || "",
    carRails: lift.data?.carRails || "",
    counterWeightRails: lift.data?.counterWeightRails || "",
    wireRope: lift.data?.wireRope || "Usha Martine",
    warrantyPeriod: lift.data?.warrantyPeriod || "",

    example: false,

    // Tab 4 - Commercial Terms (Amount)
    liftRate: lift.data?.liftRate || "",
    liftQuantity: lift.data?.liftQuantity || "",
    pwdIncludeExclude: lift.data?.pwdIncludeExclude || "",
    pwdAmount: lift.data?.pwdAmount || "",
    scaffoldingIncludeExclude: lift.data?.scaffoldingIncludeExclude || "",
    bambooScaffolding: lift.data?.bambooScaffolding || "",
    ardAmount: lift.data?.ardAmount || "",
    overloadDevice: lift.data?.overloadDevice || "",

    transportCharges: lift.data?.transportCharges || "",
    otherCharges: lift.data?.otherCharges || "",
    powerBackup: lift.data?.powerBackup || "",
    fabricatedStructure: lift.data?.fabricatedStructure || "",
    installationAmount: lift.data?.installationAmount || "",
    electricalWork: lift.data?.electricalWork || "",
    ibeamChannel: lift.data?.ibeamChannel || "",

    duplexSystem: lift.data?.duplexSystem || "",
    telephonicIntercom: lift.data?.telephonicIntercom || "",
    gsmIntercom: lift.data?.gsmIntercom || "",
    numberLockSystem: lift.data?.numberLockSystem || "",
    thumbLockSystem: lift.data?.thumbLockSystem || "",
    totalAmount: lift.data?.totalAmount || "",
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    // Real-time validation for current field
    setErrors((prev) => {
      const updatedErrors = { ...prev };
      if (value) {
        delete updatedErrors[name]; // remove error if filled
      } else {
        updatedErrors[name] = "This field is required"; // set error if empty
      }
      return updatedErrors;
    });
  };

  // const validate = () => {
  //   return (
  //     formData.liftType &&
  //     formData.capacityType &&
  //     formData.capacityValue &&
  //     formData.stops &&
  //     formData.floors &&
  //     formData.openings &&
  //     formData.floorDesignations &&
  //     formData.carTravel &&
  //     formData.speed &&
  //     formData.cabinType &&
  //     formData.lightFitting &&
  //     formData.cabinFlooring &&
  //     formData.cabinCeiling &&
  //     formData.airSystem &&
  //     formData.carEntrance &&
  //     formData.carEntranceSubType &&
  //     formData.landingEntrance
  //   );
  // };

  const tabFields = {
    0: [
      // Lift Specification
      "liftType",
      "capacityType",
      "capacityValue",
      "stops",
      "floors",
      "openings",
      "floorDesignations",
      "carTravel",
      "speed",
      "cabinType",
      // "lightFitting",
      // "cabinFlooring",
      // "cabinCeiling",
      "airSystem",
      "carEntrance",
      "carEntranceSubType",
      "landingEntrance",
    ],
    1: [
      // Cabin Design
      "technicalSpec1",
      "controlPanelMake",
      "wiringHarness",
      "guideRail",
      "bracketType",
      "ropingType",
      "lopType",
      "copType",
      "overhead",
      // "operationType",
       "machineRoom1",
       "machineRoom2",
      "shaftWidth",
      "shaftDepth",
      "carInternalWidth",
      "carInternalDepth",
      // "carInternalHeight",
    ],
    2: [
      // Features
      "vfdMainDrive",
      "doorOperator",
      "mainMachineSet",
      "carRails",
      "counterWeightRails",
      "wireRope",
      "warrantyPeriod",
    ],
    3: [
      // Commercial Terms
      "liftRate",
      "liftQuantity",
      // "pwdIncludeExclude",
      "pwdAmount",
      // "scaffoldingIncludeExclude",
      // "bambooScaffolding",
      // "ardAmount",
      // "overloadDevice",
      // "transportCharges",
      // "otherCharges",
      // "powerBackup",
      // "fabricatedStructure",
      // "installationAmount",
      // "electricalWork",
      // "ibeamChannel",
      // "duplexSystem",
      // "telephonicIntercom",
      // "gsmIntercom",
      // "numberLockSystem",
      // "thumbLockSystem",
      // "totalAmount",
    ],
  };

  const isFieldEmpty = (value) => {
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === "boolean") return false; // ✅ don't treat false as empty
    if (typeof value === "string")
      return value.trim() === "" || value === "Please Select";
    return value === undefined || value === null;
  };

  const validate = () => {
    const allFields = Object.values(tabFields).flat();

    // const missing = allFields.filter((field) => {
    //   const value = formData[field];
    //   return Array.isArray(value) ? value.length === 0 : !value;
    // });
    const missing = allFields.filter((field) => isFieldEmpty(formData[field]));

    if (missing.length > 0) {
      setErrors(
        missing.reduce((acc, field) => {
          acc[field] = "This field is required";
          return acc;
        }, {})
      );
      toast.dismiss();
      toast.error("Please fill all required fields.");
      return false;
    }

    setErrors({});
    return true;
  };

  const incompleteTabs = useMemo(() => {
    return Object.entries(tabFields)
      .filter(([tabIndex, fields]) =>
        fields.some((field) => isFieldEmpty(formData[field]))
      )
      .map(([tabIndex]) => parseInt(tabIndex));
  }, [formData]);

  // const validate = () => {
  //   const requiredFields = [
  //     // tab 0
  //     "liftType",
  //     "capacityType",
  //     "capacityValue",
  //     "stops",
  //     "floors",
  //     "openings",
  //     "floorDesignations",
  //     "carTravel",
  //     "speed",
  //     "cabinType",
  //     "lightFitting",
  //     "cabinFlooring",
  //     "cabinCeiling",
  //     "airSystem",
  //     "carEntrance",
  //     "carEntranceSubType",
  //     "landingEntrance",

  //     // tab 1
  //     "technicalSpec1",
  //     "controlPanelMake",
  //     "wiringHarness",
  //     "guideRail",
  //     "bracketType",
  //     "ropingType",
  //     "lopType",
  //     "copType",
  //     "overhead",
  //     "operationType",
  //     "machineRoom1",
  //     "machineRoom2",
  //     "shaftWidth",
  //     "shaftDepth",
  //     "carInternalWidth",
  //     "carInternalDepth",
  //     "carInternalHeight",

  //     // tab 2
  //     "vfdMainDrive",
  //     "doorOperator",
  //     "mainMachineSet",
  //     "carRails",
  //     "counterWeightRails",
  //     "warrantyPeriod",

  //     //tab 3
  //     "liftRate",
  //     "liftQuantity",
  //     "pwdIncludeExclude",
  //     "pwdAmount",
  //     "scaffoldingIncludeExclude",
  //     "bambooScaffolding",
  //     "ardAmount",
  //     "overloadDevice",
  //     "transportCharges",
  //     "otherCharges",
  //     "powerBackup",
  //     "fabricatedStructure",
  //     "installationAmount",
  //     "electricalWork",
  //     "ibeamChannel",
  //     "duplexSystem",
  //     "telephonicIntercom",
  //     "gsmIntercom",
  //     "numberLockSystem",
  //     "thumbLockSystem",
  //     "totalAmount",
  //   ];

  //   const missing = requiredFields.filter((field) => {
  //     const value = formData[field];
  //     if (Array.isArray(value)) return value.length === 0;
  //     return !value;
  //   });

  //   if (missing.length > 0) {
  //     // ✅ Set individual field errors
  //     setErrors(
  //       missing.reduce((acc, field) => {
  //         acc[field] = "This field is required";
  //         return acc;
  //       }, {})
  //     );

  //     // ✅ Only toast if not already shown
  //     toast.dismiss(); // Prevent duplicate toasts
  //     toast.error("Please fill all required fields.");
  //     return false;
  //   }

  //   setErrors({});
  //   return true;
  // };

  const handleSave = () => {
    const isValid = validate();

    if (!isValid) return;

    onSave(lift.id, formData, isValid, fieldLabels);
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  return (
    // <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
    //   <div className="bg-white w-[90%] max-w-5xl h-[90vh] rounded-lg shadow-lg flex flex-col">
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="bg-white p-4 rounded shadow-lg border w-[90%] max-w-5xl h-[90vh] rounded-lg shadow-lg flex flex-col">
        {/* Modal Header (fixed) */}
        <div className="sticky top-0 z-10 bg-white border-b px-6 pt-4">
          <h2 className="text-lg font-bold mb-3">Lift Quotation</h2>

          <div className="flex gap-2">
            {[
              "Lift Specification",
              "Cabin Design",
              "Features",
              "Commercial Terms",
            ].map((label, index) => {
              const isActive = activeTab === index;
              const isIncomplete = incompleteTabs.includes(index);

              return (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`px-4 py-2 rounded-t-md text-sm font-medium border-b-2 transition-all duration-200
          ${
            isActive
              ? "border-blue-600 text-blue-600 bg-white"
              : "border-transparent text-gray-500 hover:text-blue-600 hover:border-blue-300"
          }
        `}
                >
                  {label}
                  {isIncomplete && (
                    <span className="ml-1 text-red-500">⚠️</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Tab Content */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-4 gap-x-3 gap-y-6">
          {activeTab === 0 && (
            <>
              <h4 className="text-md font-semibold col-span-4">
                Basic Specification
              </h4>

              <Select
                //label="Lift Type *"
                label={getLabel("liftType", "Lift Type")}
                name="liftType"
                value={formData.liftType}
                onChange={handleChange}
                error={errors.liftType}
                required
              >
                <option key="" value="">
                  Please Select
                </option>
                <option key="Manual" value="Manual">
                  Manual
                </option>
                <option key="Automatic" value="Automatic">
                  Automatic
                </option>
              </Select>

              <RadioGroup
                //label="Capacity Type *"
                label={getLabel("capacityType", "Capacity Type")}
                name="capacityType"
                options={["Persons", "Kg"]}
                selected={formData.capacityType}
                onChange={handleChange}
                error={errors.capacityType}
                required
              />

              {formData.capacityType === "Persons" ? (
                <Select
                  //label="Select Persons *"
                  label={getLabel("capacityValue", "Select Persons")}
                  name="capacityValue"
                  value={formData.capacityValue}
                  onChange={handleChange}
                  error={errors.capacityValue}
                  required
                >
                  <option key="" value="">
                    Please Select
                  </option>
                  {personOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </Select>
              ) : (
                <Select
                  //label="Enter Kg *"
                  label={getLabel("capacityValue", "Enter Kg")}
                  name="capacityValue"
                  value={formData.capacityValue}
                  onChange={handleChange}
                  error={errors.capacityValue}
                  required
                >
                  <option key="" value="">
                    Please Select
                  </option>
                  {kgOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </Select>
              )}

              <Select
                //label="No. of Stops *"
                label={getLabel("stops", "No. of Stops")}
                name="stops"
                value={formData.stops}
                onChange={handleChange}
                error={errors.stops}
                required
              >
                <option key="" value="">
                  Please Select
                </option>
                {stopsOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </Select>

              <Select
                label={getLabel("floors", "No. of Floors")}
                name="floors"
                value={formData.floors}
                onChange={handleChange}
                error={errors.floors}
                required
              >
                <option key="" value="">
                  Please Select
                </option>
                {floorOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </Select>

              <Select
                label={getLabel("openings", "No. of Openings ")}
                required
                name="openings"
                value={formData.openings}
                onChange={handleChange}
                error={errors.openings}
              >
                <option key="" value="">
                  Please Select
                </option>
                {floorOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </Select>

              <Input
                label={getLabel("floorDesignations", "Floor Designations ")}
                required
                name="floorDesignations"
                value={formData.floorDesignations}
                onChange={handleChange}
                placeholder="E.g. G+29"
                error={errors.floorDesignations}
              />

              <Input
                label={getLabel("carTravel", "Car Travel ")}
                required
                name="carTravel"
                value={formData.carTravel}
                onChange={handleChange}
                placeholder="E.g. 3000"
                error={errors.carTravel}
              />

              <Select
                label={getLabel("speed", "Speed ")}
                required
                name="speed"
                value={formData.speed}
                onChange={handleChange}
                error={errors.speed}
              >
                <option key="" value="">
                  Please Select
                </option>
                {speedOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </Select>

              <Select
                label={getLabel("cabinType", "Cabin Type ")}
                required
                name="cabinType"
                value={formData.cabinType}
                onChange={handleChange}
                error={errors.cabinType}
              >
                <option key="" value="">
                  Please Select
                </option>
                {cabinTypes.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </Select>

              <Input
                label={getLabel("lightFitting", "Light Fitting")}
                name="lightFitting"
                value={formData.lightFitting}
                onChange={handleChange}
                placeholder="E.g. LED Light Fitting"
                error={errors.lightFitting}
              />

              <Select
                label={getLabel("cabinFlooring", "Cabin Flooring")}
                name="cabinFlooring"
                value={formData.cabinFlooring}
                onChange={handleChange}
                error={errors.cabinFlooring}
              >
                <option key="" value="">
                  Please Select
                </option>
                {cabinFlooring.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </Select>

              <Select
                label={getLabel("cabinCeiling", "Cabin Ceiling")}
                name="cabinCeiling"
                value={formData.cabinCeiling}
                onChange={handleChange}
                error={errors.cabinCeiling}
              >
                <option key="" value="">
                  Please Select
                </option>
                {cabinCeiling.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </Select>

              <Select
                label={getLabel("airSystem", "Air System ")}
                required
                name="airSystem"
                value={formData.airSystem}
                onChange={handleChange}
                error={errors.airSystem}
              >
                <option key="" value="">
                  Please Select
                </option>
                {airSystem.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </Select>

              <Select
                label={getLabel("carEntrance", "Car Entrance ")}
                required
                name="carEntrance"
                value={formData.carEntrance}
                onChange={handleChange}
                error={errors.carEntrance}
              >
                <option key="" value="">
                  Please Select
                </option>
                {carEntranceTypes.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </Select>

              <Select
                label={getLabel("carEntranceSubType", "Car Entrance Sub Type")}
                name="carEntranceSubType"
                value={formData.carEntranceSubType}
                onChange={handleChange}
                error={errors.carEntranceSubType}
                required
              >
                <option key="" value="">
                  Please Select
                </option>
                {(carEntranceSubTypes[formData.carEntrance] || []).map(
                  (opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  )
                )}
              </Select>

              <Select
                label={getLabel("landingEntrance", "Landing Entrance ")}
                required
                name="landingEntrance"
                value={formData.landingEntrance}
                onChange={handleChange}
                error={errors.landingEntrance}
              >
                <option key="" value="">
                  Please Select
                </option>
                {landingEntrance.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </Select>

              <Select
                label={getLabel(
                  "landingEntranceCount",
                  "Landing Entrance Count"
                )}
                name="landingEntranceCount"
                value={formData.landingEntranceCount || ""}
                onChange={handleChange}
                className="mt-0"
                labelClassName="opacity-0"
              >
                <option value="">ALL</option>
                {Array.from({ length: 20 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </Select>
            </>
          )}

          {activeTab === 1 && (
            <>
              <h4 className="text-md font-semibold col-span-4">
                Technical Specification
              </h4>

              <Select
                label={getLabel("technicalSpec1", "Control Panel Type ")}
                required
                name="technicalSpec1"
                value={formData.technicalSpec1}
                onChange={handleChange}
                error={errors.technicalSpec1}
              >
                <option key="" value="">
                  Please Select
                </option>
                <option
                  key="CONTROL PANEL FOR V3F"
                  value="CONTROL PANEL FOR V3F"
                >
                  CONTROL PANEL FOR V3F
                </option>
                <option
                  key="CONTROL PANEL FOR HYDRAULIC"
                  value="CONTROL PANEL FOR HYDRAULIC"
                >
                  CONTROL PANEL FOR HYDRAULIC
                </option>
              </Select>

              <Select
                label={getLabel("controlPanelMake", "Control Panel Make ")}
                required
                name="controlPanelMake"
                value={formData.controlPanelMake}
                onChange={handleChange}
                error={errors.controlPanelMake}
              >
                <option key="" value="">
                  Please Select
                </option>
                <option key="Make 1" value="Make 2">
                  Make 1
                </option>
                <option key="Make 2" value="Make 2">
                  Make 2
                </option>
              </Select>

              <Select
                label={getLabel("wiringHarness", "Wiring Harness ")}
                required
                name="wiringHarness"
                value={formData.wiringHarness}
                onChange={handleChange}
                error={errors.wiringHarness}
              >
                <option key="" value="">
                  Please Select
                </option>
                <option key="Yes" value="Yes">
                  Yes
                </option>
                <option key="No" value="No">
                  No
                </option>
              </Select>

              <Select
                label={getLabel("guideRail", "Guide Rail ")}
                required
                name="guideRail"
                value={formData.guideRail}
                onChange={handleChange}
                error={errors.guideRail}
              >
                <option key="" value="">
                  Please Select
                </option>
                <option key="Guide Rail A" value="Guide Rail A">
                  Guide Rail A
                </option>
                <option key="Guide Rail B" value="Guide Rail B">
                  Guide Rail B
                </option>
              </Select>

              <Select
                label={getLabel("bracketType", "Bracket Type ")}
                required
                name="bracketType"
                value={formData.bracketType}
                onChange={handleChange}
                error={errors.bracketType}
              >
                <option key="" value="">
                  Please Select
                </option>
                <option key="Bracket A" value="Bracket A">
                  Bracket A
                </option>
                <option key="Bracket B" value="Bracket B">
                  Bracket B
                </option>
              </Select>

              <Select
                label={getLabel("ropingType", "Roping Type ")}
                required
                name="ropingType"
                value={formData.ropingType}
                onChange={handleChange}
                error={errors.ropingType}
              >
                <option key="" value="">
                  Please Select
                </option>
                <option key="1:1" value="1:1">
                  1:1
                </option>
                <option key="2:1" value="2:1">
                  2:1
                </option>
              </Select>

              <Select
                label={getLabel("lopType", "Lop Type ")}
                required
                name="lopType"
                value={formData.lopType}
                onChange={handleChange}
                error={errors.lopType}
              >
                <option key="" value="">
                  Please Select
                </option>
                <option key="Type A" value="Type B">
                  Type A
                </option>
                <option key="Type B" value="Type B">
                  Type B
                </option>
              </Select>

              <Select
                label={getLabel("copType", "Cop Type ")}
                required
                name="copType"
                value={formData.copType}
                onChange={handleChange}
                error={errors.copType}
              >
                <option key="" value="">
                  Please Select
                </option>
                <option key="COP A" value="COP A">
                  COP A
                </option>
                <option key="COP B" value="COP B">
                  COP B
                </option>
              </Select>

              <Input
                label={getLabel("overhead", "Overhead ")}
                required
                name="overhead"
                value={formData.overhead}
                onChange={handleChange}
                error={errors.overhead}
              />

              <Select
                label={getLabel("operationType", "Operation Type")}
                name="operationType"
                value={formData.operationType}
                onChange={handleChange}
                error={errors.operationType}
              >
                <option key="" value="">
                  Please Select
                </option>
                <option key="Simplex" value="Simplex">
                  Simplex
                </option>
                <option key="Duplex" value="Duplex">
                  Duplex
                </option>
              </Select>

              <Input
                label={getLabel("machineRoom1", "Machine Room (Height)")}
                required
                name="machineRoom1"
                value={formData.machineRoom1}
                onChange={handleChange}
                error={errors.machineRoom1}
              />

              <Input
                label={getLabel("machineRoom2", "Machine Room (Width)")}
                name="machineRoom2"
                required
                value={formData.machineRoom2}
                onChange={handleChange}
                error={errors.machineRoom2}
              />

              <Input
                label={getLabel("shaftWidth", "Shaft Width (mm) ")}
                required
                name="shaftWidth"
                value={formData.shaftWidth}
                onChange={handleChange}
                error={errors.shaftWidth}
              />

              <Input
                label={getLabel("shaftDepth", "Shaft Depth (mm) ")}
                required
                name="shaftDepth"
                value={formData.shaftDepth}
                onChange={handleChange}
                error={errors.shaftDepth}
              />

              <Input
                label={getLabel("carInternalWidth", "CAR internal Width (mm) ")}
                required
                name="carInternalWidth"
                value={formData.carInternalWidth}
                onChange={handleChange}
                error={errors.carInternalWidth}
              />

              <Input
                label={getLabel("carInternalDepth", "CAR internal Depth (mm) ")}
                required
                name="carInternalDepth"
                value={formData.carInternalDepth}
                onChange={handleChange}
                error={errors.carInternalDepth}
              />

              <Input
                label={getLabel(
                  "carInternalHeight",
                  "CAR internal Height (mm)"
                )}
                name="carInternalHeight"
                value={formData.carInternalHeight}
                onChange={handleChange}
                error={errors.carInternalHeight}
              />
            </>
          )}

          {activeTab === 2 && (
            <>
              <h4 className="text-md font-semibold col-span-4">
                Standard Features, Part makers & Payment Terms
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 col-span-4">
                <div className="flex flex-col gap-2">
                  <h5 className="text-sm font-semibold mb-2">
                    Standard Features
                  </h5>

                  <Checkbox
                    label={getLabel(
                      "emergencyFireman",
                      "Emergency Fireman's Service"
                    )}
                    name="emergencyFireman"
                    checked={formData.emergencyFireman}
                    onChange={handleCheckboxChange}
                  />
                  <Checkbox
                    label={getLabel(
                      "emergencyCarLight",
                      "Emergency Car Light Unit"
                    )}
                    name="emergencyCarLight"
                    checked={formData.emergencyCarLight}
                    onChange={handleCheckboxChange}
                  />
                  <Checkbox
                    label={getLabel(
                      "infraredDoor",
                      "Infrared Curtain Door Protection"
                    )}
                    name="infraredDoor"
                    checked={formData.infraredDoor}
                    onChange={handleCheckboxChange}
                  />
                  <Checkbox
                    label={getLabel(
                      "doorTimeProtection",
                      "Door Time Protection"
                    )}
                    name="doorTimeProtection"
                    checked={formData.doorTimeProtection}
                    onChange={handleCheckboxChange}
                  />
                  <Checkbox
                    label={getLabel("alarmButton", "Emergency Alarm Button")}
                    name="alarmButton"
                    checked={formData.alarmButton}
                    onChange={handleCheckboxChange}
                  />
                  <Checkbox
                    label={getLabel(
                      "extraDoorTime",
                      "Extra Door Time of Lobby & Parking"
                    )}
                    name="extraDoorTime"
                    checked={formData.extraDoorTime}
                    onChange={handleCheckboxChange}
                  />
                  <Checkbox
                    label={getLabel("doorOpenClose", "Door Open/Close Button")}
                    name="doorOpenClose"
                    checked={formData.doorOpenClose}
                    onChange={handleCheckboxChange}
                  />
                  <Checkbox
                    label={getLabel("manualRescue", "Manual Rescue Operation")}
                    name="manualRescue"
                    checked={formData.manualRescue}
                    onChange={handleCheckboxChange}
                  />
                  <Checkbox
                    label={getLabel("autoFanCut", "Auto Fan Cut Off")}
                    name="autoFanCut"
                    checked={formData.autoFanCut}
                    onChange={handleCheckboxChange}
                  />
                  <Checkbox
                    label={getLabel(
                      "overloadWarning",
                      "Overload Warning Device"
                    )}
                    name="overloadWarning"
                    checked={formData.overloadWarning}
                    onChange={handleCheckboxChange}
                  />
                  <Checkbox
                    label={getLabel("autoRescue", "Auto Rescue Device")}
                    name="autoRescue"
                    checked={formData.autoRescue}
                    onChange={handleCheckboxChange}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <h5 className="text-sm font-semibold mb-2">
                    Part Makers & Payment Terms
                  </h5>

                  <Select
                    label={getLabel("vfdMainDrive", "VFD - Main Drive ")}
                    required
                    name="vfdMainDrive"
                    value={formData.vfdMainDrive}
                    onChange={handleChange}
                    error={errors.vfdMainDrive}
                  >
                    <option key="" value="">
                      Please Select
                    </option>
                    <option key="Make A" value="Make A">
                      Make A
                    </option>
                    <option key="Make B" value="Make B">
                      Make B
                    </option>
                  </Select>

                  <Select
                    label={getLabel("doorOperator", "Door Operator ")}
                    required
                    name="doorOperator"
                    value={formData.doorOperator}
                    onChange={handleChange}
                    error={errors.doorOperator}
                  >
                    <option key="" value="">
                      Please Select
                    </option>
                    <option key="Make A" value="Make A">
                      Make A
                    </option>
                    <option key="Make B" value="Make B">
                      Make B
                    </option>
                  </Select>

                  <Select
                    label={getLabel("mainMachineSet", "Main Machine Set ")}
                    required
                    name="mainMachineSet"
                    value={formData.mainMachineSet}
                    onChange={handleChange}
                    error={errors.mainMachineSet}
                  >
                    <option key="" value="">
                      Please Select
                    </option>
                    <option key="Make A" value="Make A">
                      Make A
                    </option>
                    <option key="Make B" value="Make B">
                      Make B
                    </option>
                  </Select>

                  <Select
                    label={getLabel("carRails", "Car Rails ")}
                    required
                    name="carRails"
                    value={formData.carRails}
                    onChange={handleChange}
                    error={errors.carRails}
                  >
                    <option key="" value="">
                      Please Select
                    </option>
                    <option key="Make A" value="Make A">
                      Make A
                    </option>
                    <option key="Make B" value="Make B">
                      Make B
                    </option>
                  </Select>

                  <Select
                    label={getLabel(
                      "counterWeightRails",
                      "Counter Weight Rails "
                    )}
                    required
                    name="counterWeightRails"
                    value={formData.counterWeightRails}
                    onChange={handleChange}
                    error={errors.counterWeightRails}
                  >
                    <option key="" value="">
                      Please Select
                    </option>
                    <option key="Make A" value="Make A">
                      Make A
                    </option>
                    <option key="Make B" value="Make B">
                      Make B
                    </option>
                  </Select>

                  <Input
                    label={getLabel("wireRope", "Wire Rope ")}
                    required
                    name="wireRope"
                    value={formData.wireRope}
                    onChange={handleChange}
                    error={errors.wireRope}
                  />

                  <Select
                    label={getLabel("warrantyPeriod", "Warranty Period ")}
                    required
                    name="warrantyPeriod"
                    value={formData.warrantyPeriod}
                    onChange={handleChange}
                    error={errors.warrantyPeriod}
                  >
                    <option key="" value="">
                      Please Select
                    </option>
                    <option key="12 months" value="12 months">
                      12 months
                    </option>
                    <option key="18 months" value="18 months">
                      18 months
                    </option>
                    <option key="24 months" value="24 months">
                      24 months
                    </option>
                  </Select>
                </div>
              </div>
            </>
          )}

          {activeTab === 3 && (
            <>
              <h4 className="text-md font-semibold col-span-4">
                Commercial Terms (Amount)
              </h4>

              <Input
                label={getLabel("liftRate", "Lift Rate ")}
                required
                name="liftRate"
                value={formData.liftRate}
                onChange={handleChange}
                error={errors.liftRate}
              />

              <Input
                label={getLabel("liftQuantity", "Lift Quantity ")}
                required
                name="liftQuantity"
                value={formData.liftQuantity}
                onChange={handleChange}
                error={errors.liftQuantity}
              />

              <RadioGroup
                label={getLabel(
                  "pwdIncludeExclude",
                  "PWD Including and Excluding"
                )}
                name="pwdIncludeExclude"
                options={["Including", "Excluding"]}
                selected={formData.pwdIncludeExclude}
                onChange={handleChange}
                error={errors.pwdIncludeExclude}
              />

              <Input
                label={getLabel("pwdAmount", "PWD (Amount) ")}
                required
                name="pwdAmount"
                value={formData.pwdAmount}
                onChange={handleChange}
                error={errors.pwdAmount}
              />

              <RadioGroup
                label={getLabel(
                  "scaffoldingIncludeExclude",
                  "Scaffolding Including and Excluding"
                )}
                name="scaffoldingIncludeExclude"
                options={["Including", "Excluding"]}
                selected={formData.scaffoldingIncludeExclude}
                // value={formData.scaffoldingIncludeExclude}
                onChange={handleChange}
                error={errors.scaffoldingIncludeExclude}
              />

              <Input
                label={getLabel("bambooScaffolding", "Bamboo Scaffolding")}
                name="bambooScaffolding"
                value={formData.bambooScaffolding}
                onChange={handleChange}
                error={errors.bambooScaffolding}
              />

              <Input
                label={getLabel("ardAmount", "ARD (Amount)")}
                name="ardAmount"
                value={formData.ardAmount}
                onChange={handleChange}
                error={errors.ardAmount}
              />

              <Input
                label={getLabel("overloadDevice", "Overload Device")}
                name="overloadDevice"
                value={formData.overloadDevice}
                onChange={handleChange}
                error={errors.overloadDevice}
              />

              <Input
                label={getLabel("transportCharges", "Transport Charges")}
                name="transportCharges"
                value={formData.transportCharges}
                onChange={handleChange}
                error={errors.transportCharges}
              />

              <Input
                label={getLabel("otherCharges", "Other Charges")}
                name="otherCharges"
                value={formData.otherCharges}
                onChange={handleChange}
                error={errors.otherCharges}
              />

              <Input
                label={getLabel("powerBackup", "Power Backup")}
                name="powerBackup"
                value={formData.powerBackup}
                onChange={handleChange}
                error={errors.powerBackup}
              />

              <Input
                label={getLabel("fabricatedStructure", "Fabricated Structure")}
                name="fabricatedStructure"
                value={formData.fabricatedStructure}
                onChange={handleChange}
                error={errors.fabricatedStructure}
              />

              <Input
                label={getLabel("installationAmount", "Installation Amount")}
                name="installationAmount"
                value={formData.installationAmount}
                onChange={handleChange}
                error={errors.installationAmount}
              />

              <Input
                label={getLabel("electricalWork", "Electrical Work")}
                name="electricalWork"
                value={formData.electricalWork}
                onChange={handleChange}
                error={errors.electricalWork}
              />

              <Input
                label={getLabel("ibeamChannel", "I-beam Channel")}
                name="ibeamChannel"
                value={formData.ibeamChannel}
                onChange={handleChange}
                error={errors.ibeamChannel}
              />

              <Input
                label={getLabel("duplexSystem", "Duplex System")}
                name="duplexSystem"
                value={formData.duplexSystem}
                onChange={handleChange}
                error={errors.duplexSystem}
              />

              <Input
                label={getLabel("telephonicIntercom", "Telephonic Intercom")}
                name="telephonicIntercom"
                value={formData.telephonicIntercom}
                onChange={handleChange}
                error={errors.telephonicIntercom}
              />

              <Input
                label={getLabel("gsmIntercom", "GSM Intercom")}
                name="gsmIntercom"
                value={formData.gsmIntercom}
                onChange={handleChange}
                error={errors.gsmIntercom}
              />

              <Input
                label={getLabel("numberLockSystem", "Number Lock System")}
                name="numberLockSystem"
                value={formData.numberLockSystem}
                onChange={handleChange}
                error={errors.numberLockSystem}
              />

              <Input
                label={getLabel("thumbLockSystem", "Thumb Lock System")}
                name="thumbLockSystem"
                value={formData.thumbLockSystem}
                onChange={handleChange}
                error={errors.thumbLockSystem}
              />

              <Input
                label={getLabel("totalAmount", "Total Amount")}
                name="totalAmount"
                value={formData.totalAmount}
                onChange={handleChange}
                error={errors.totalAmount}
              />
            </>
          )}
        </div>

        {/* Modal Footer (fixed) */}
        <div className="p-4 border-t bg-white sticky bottom-0 z-10 flex justify-between items-center">
          {/* Quotation Price on left */}
          <div className="text-lg font-semibold text-gray-700">
            Quotation Price: ₹{" "}
            {formData.totalAmount
              ? Number(formData.totalAmount).toLocaleString()
              : "0"}
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center gap-4">
            {/* Previous button - disabled on first tab */}
            <button
              onClick={() => setActiveTab((prev) => Math.max(0, prev - 1))}
              disabled={activeTab === 0}
              className={`px-4 py-2 rounded ${
                activeTab === 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Previous
            </button>
            {/* Next button - disabled on last tab */}
            <button
              onClick={() => setActiveTab((prev) => Math.min(3, prev + 1))}
              disabled={activeTab === 3}
              className={`px-4 py-2 rounded ${
                activeTab === 3
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Next
            </button>
          </div>

          {/* Cancel and Save buttons on right */}
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const Input = ({
  label,
  name,
  tooltip,
  error,
  labelClassName = "",
  required = false,
  ...props
}) => (
  <div>
    <label className={`block text-gray-700 text-sm mb-1 ${labelClassName}`}>
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <input
      {...props}
      name={name}
      title={tooltip}
      className={`w-full border rounded px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 ${
        error ? "border-red-500" : "border-gray-300"
      }`}
    />
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

const Select = ({
  label,
  name,
  error,
  children,
  labelClassName = "",
  required = false,
  ...props
}) => (
  <div className="mb-4">
    <label className={`block text-gray-700 text-sm mb-1 ${labelClassName}`}>
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <select
      name={name}
      {...props} // ✅ this no longer includes labelClassName
      className={`w-full border rounded px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 ${
        error ? "border-red-500" : "border-gray-300"
      }`}
    >
      {children}
    </select>
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

const RadioGroup = ({
  label,
  name,
  options,
  selected,
  onChange,
  error,
  required = false,
}) => (
  <div className="mb-4">
    <label className="block text-gray-700 text-sm mb-1">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <div className="flex gap-4">
      {options.map((opt) => (
        <label
          key={opt}
          className="text-gray-700 text-sm flex items-center gap-1"
        >
          <input
            type="radio"
            name={name}
            value={opt}
            checked={selected === opt}
            onChange={onChange}
            className={`text-blue-500 ${error ? "ring-1 ring-red-500" : ""}`}
          />
          {opt}
        </label>
      ))}
    </div>
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);
