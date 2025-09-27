"use client";

import React, { useState, useMemo, useEffect } from "react";

import toast from "react-hot-toast";
import Checkbox from "@/components/UI/Checkbox";
import axiosInstance from "@/utils/axiosInstance";
import { API_ENDPOINTS } from "@/utils/apiEndpoints";
import { decodeHtmlEntities } from "@/utils/validation";
import { calculateLiftMaterialPrices, calculateFloorPrices } from "@/utils/liftCalculations";
import useLiftForm from "./hooks/useLiftForm";
import { fetchCabinSubTypes, fetchCarEntranceTypes, fetchLandingEntranceSubType, fetchCarEntranceSubTypes, getOptionPrice, PriceBelowSelect, getLabel, fetchControlPanelTypes, fetchLOP, fetchCOP, fetchCapacityDimension, fetchRopingTypePrice, fetchFastner } from "./liftService";


export default function LiftModal({ lift, onClose, onSave }) {
  const [activeTab, setActiveTab] = useState(0);
  const [errors, setErrors] = useState({});

  const tabLabels = [
    "Lift Specification",
    "Cabin Design",
    "Features",
    "Commercial Terms",
  ];

  const tabColors = [
    "text-blue-600",
    "text-green-600",
    "text-purple-600",
    "text-orange-600",
  ];

  const tabClass = (index) =>
    `px-4 py-2 rounded-t-md border-b-2 ${activeTab === index
      ? "bg-blue-600 text-white font-semibold"
      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
    }`;


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
      //"technicalSpec1",
      "controlPanelType",
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

  const [initialOptions, setInitialOptions] = useState({
    personOptions: [],
    kgOptions: [],
    capacityTypes: [],
    liftTypes: [],
    operatorTypes: [],
    floors: [],
    floorOptions: [],
    stopsOptions: [],
    openingOptions: [],
    speeds: [],
    floorAddLabels: {},
    floorAddOption: [],
    cabinSubTypes: [],
    lightFittings: [],
    cabinFlooring: [],
    cabinCeiling: [],
    //filteredCabinTypes: [],
    airSystem: [],
    //airSystemPrices: [],
    carEntranceSubTypes: [],
    carEntranceTypes: [],
    //landingEntrance: [],
    landingEntranceSubTypes: [],
    controlPanelTypes: [],
    wiringHarness: [],
    guideRail: [],
    bracketTypes: [],
    wireRopes: [],
    lopTypes: [],
    copTypes: [],

    manufacturers: [],
    operationType: [],
    capaDim: [],

    features: [],
    warranty: [],
  });

  const {
    formData,
    setFormData,
    handleChange,
    handleCheckbox,
    calculations,
  } = useLiftForm(lift, initialOptions);


  // 🔹 recalc when all required fields are ready
  // 🔹 Effect for lift/material prices
  useEffect(() => {
    // const fetchMaterialPrices = async () => {
    //   if (!formData.liftType || !formData.capacityType || !formData.capacityValue || !formData.typeOfLift || !formData.cabinType) return;

    const fetchMaterialPrices = async () => {
      if (!formData.liftType || !formData.capacityType || !formData.capacityValue || !formData.typeOfLift) return;

      // const materialResults = await calculateLiftMaterialPrices({
      //   liftType: formData.liftType,
      //   capacityType: formData.capacityType,
      //   capacityValue: formData.capacityValue,
      //   typeOfLift: formData.typeOfLift,
      //   cabinType: formData.cabinType,
      // });
      const materialResults = await calculateLiftMaterialPrices({
        liftType: formData.liftType,
        capacityType: formData.capacityType,
        capacityValue: formData.capacityValue,
        typeOfLift: formData.typeOfLift,
      });

      setFormData(prev => ({
        ...prev,
        ardPrice: materialResults.ardPrice,
        machinePrice: materialResults.machinePrice,
        //cabinPrice: materialResults.cabinPrice,
      }));
    };

    const loadControlPanelTypes = async () => {
      if (formData.capacityType && formData.capacityValue) {
        try {
          const controlPanelTypes =
            (await fetchControlPanelTypes(
              formData.liftType,
              formData.capacityType,
              formData.capacityValue,
              formData.typeOfLift
            )) || [];

          if (controlPanelTypes.length === 0) {
            toast.error("No control panels available for the selected capacity");
          }

          setInitialOptions((prev) => ({
            ...prev,
            controlPanelTypes,
          }));
        } catch (err) {
          console.error("Error fetching control panel types:", err);
          toast.error("Failed to load control panel types");
          setInitialOptions((prev) => ({ ...prev, controlPanelTypes: [] }));
        }
      } else {
        setInitialOptions((prev) => ({ ...prev, controlPanelTypes: [] }));
      }
    };


    fetchMaterialPrices();
    loadControlPanelTypes();
    // }, [formData.liftType, formData.capacityType, formData.capacityValue, formData.typeOfLift, formData.cabinType]);
  }, [formData.liftType, formData.capacityType, formData.capacityValue, formData.typeOfLift]);

  // 🔹 Effect for floor-based prices
  useEffect(() => {
    const fetchFloorPrices = async () => {
      if (!formData.floorDesignations) return;

      const floorResults = await calculateFloorPrices(formData.floorDesignations);

      // setInternalCal(prev => {
      //   const totalAmount = floorResults.totalAmount + (prev.ardPrice || 0) + (prev.machinePrice || 0) + (prev.cabinPrice || 0);
      //   return { ...prev, ...floorResults, totalAmount };
      // });

      setFormData(prev => ({
        ...prev,
        wiringHarnessPrice: floorResults.harnessPrice,
        governorPrice: floorResults.governorPrice,
        truffingPrice: floorResults.truffingPrice,
      }));
    };

    fetchFloorPrices();
  }, [formData.floorDesignations]);

  useEffect(() => {
    const fetchFastenerPrice = async () => {
      if (!formData.floors && !formData.floorDesignations) return;

      // Get the floor-1
      const selectedFloor = Number(formData.floors);
      const targetFloor = selectedFloor > 1 ? selectedFloor - 1 : 1;

      const fasteners = await fetchFastner(targetFloor);
      console.log("========fasteners======>",fasteners)

      // Assuming API returns an array and you pick the first item
      if (fasteners.length > 0) {
        const fastener = fasteners[0];
        setFormData((prev) => ({
          ...prev,
          fastenerPrice: fastener.price || 0,
          fastenerType: fastener.id || "",
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          fastenerPrice: fasteners.price || 0,
          fastenerType: fasteners.id || "",
        }));
      }
    };

    fetchFastenerPrice();
  }, [formData.floors, formData.floorDesignations]);


  // useEffect(() => {
  //   if (
  //     formData.openings &&
  //     formData.landingEntranceCount &&
  //     !formData.landingEntranceSubType2_fromFloor &&
  //     !formData.landingEntranceSubType2_toFloor
  //   ) {
  //     setFormData((prev) => ({
  //       ...prev,
  //       landingEntranceSubType2_fromFloor: Number(formData.landingEntranceCount) + 1,
  //       landingEntranceSubType2_toFloor: Number(formData.openings),
  //     }));
  //   }
  // }, [formData.openings, formData.landingEntranceCount, formData.landingEntranceSubType2_fromFloor, formData.landingEntranceSubType2_toFloor]);

  //   useEffect(() => {
  //   if (formData.openings && formData.landingEntranceCount) {
  //     setFormData((prev) => ({
  //       ...prev,
  //       landingEntranceSubType2_fromFloor: Number(formData.landingEntranceCount) + 1,
  //       landingEntranceSubType2_toFloor: Number(formData.openings),
  //     }));
  //   }
  // }, [formData.openings, formData.landingEntranceCount]);



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


  // 🔹 When capacityType / capacityValue / cabinType changes
  useEffect(() => {
    // Reset dependent fields when capacity type/value changes
    setFormData((prev) => ({
      ...prev,
      totalAmount: prev.totalAmount - prev.ardPrice - prev.machinePrice,
      ardPrice: 0,
      machinePrice: 0,
      cabinPrice: 0,
      cabinSubType: "",
      airSystem: "",
      airSystemPrice: 0,
    }));

    const loadCabinSubTypes = async () => {
      if (formData.capacityType && formData.capacityValue) {
        const cabinSubTypes = await fetchCabinSubTypes(
          formData.capacityType,
          formData.capacityValue,
          formData.cabinType
        );

        if (cabinSubTypes.length === 0) {
          toast.error("No cabin subtypes available for the selected capacity");
        }

        setInitialOptions((prev) => ({ ...prev, cabinSubTypes: cabinSubTypes }));
      } else {
        setInitialOptions((prev) => ({ ...prev, cabinSubTypes: [] }));
      }
    };

    loadCabinSubTypes();
  }, [formData.capacityType, formData.capacityValue, formData.cabinType]);

  //if length is 1 the set bydefault 1st option as selected
  useEffect(() => {
    if (initialOptions.cabinSubTypes.length === 1) {
      const onlyOption = initialOptions.cabinSubTypes[0];
      setFormData((prev) => ({
        ...prev,
        cabinSubType: onlyOption.id, // auto-select
      }));
    }
  }, [initialOptions.cabinSubTypes]);

  // 🔹 Fetch Car Entrance, Landing Entrance Types when liftType changes
  useEffect(() => {
    const loadEntranceOptions = async () => {
      if (!formData.liftType) return;

      try {
        const [carTypes, landingTypes] = await Promise.all([
          fetchCarEntranceTypes(formData.liftType),
          fetchLandingEntranceSubType(formData.liftType),
        ]);

        setInitialOptions(prev => ({
          ...prev,
          carEntranceTypes: carTypes,
          landingEntranceSubTypes: landingTypes,
          carEntranceSubTypes: [],
        }));

        // Reset dependent fields
        setFormData(prev => ({
          ...prev,
          carEntrance: "",
          carEntranceSubType: "",
          landingEntranceSubType1: "",
          landingEntranceSubType2: "",
          landingEntranceCount: Number(prev.openings) || 0,
        }));
      } catch (err) {
        console.error("Error fetching entrance options", err);
      }
    };

    loadEntranceOptions();
  }, [formData.liftType]);


  // 🔹 Fetch Car Entrance SubTypes when carEntrance changes
  useEffect(() => {
    const loadCarEntranceSubTypes = async () => {
      if (!formData.carEntrance) return;
      const subTypes = await fetchCarEntranceSubTypes(formData.carEntrance);
      setInitialOptions(prev => ({ ...prev, carEntranceSubTypes: subTypes }));
      setFormData(prev => ({ ...prev, carEntranceSubType: "" })); // reset dependent field
    };
    loadCarEntranceSubTypes();
  }, [formData.carEntrance]);

  useEffect(() => {
    const loadLOPCOPOptions = async () => {
      if (!formData.liftType || !formData.floors) return;

      try {
        // If formData.floors can be multiple, you may loop or pick the first floor
        const floorId = Array.isArray(formData.floors) ? formData.floors[0] : formData.floors;

        const lopSubTypes = await fetchLOP(formData.liftType, floorId);

        const copSubTypes = await fetchCOP(formData.liftType, floorId);

        setInitialOptions(prev => ({
          ...prev,
          lopTypes: lopSubTypes,
          copTypes: copSubTypes,
        }));

        // Reset dependent LOP fields if needed
        setFormData(prev => ({
          ...prev,
          lopType: "", // reset selected LOP
          copTypes: "",
        }));
      } catch (err) {
        console.error("Error fetching LOP options", err);
      }
    };

    loadLOPCOPOptions();
  }, [formData.liftType, formData.floors]);


  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [
          operatorRes,
          liftTypesRes,
          capacityTypeRes,
          personsRes,
          weightRes,
          floorsRes,
          speedRes,
          additionalRes,
          lightFittingsRes,
          cabinFlooringRes,
          cabinCelingRes,
          airRes,
          //airSystemPriceRes,
          //carDoorTypesRes,
          //carDoorSubTypesRes,
          //landingDoorTypesRes,
          //landingDoorSubTypesRes,
          //controlPanelTypesRes,
          wiringHarnessRes,
          guideRailRes,
          bracketsTypesRes,
          wireRopeRes,
          //lopTypeRes,
          //copTypeRes,
          manufactureRes,
          operationTypeRes,
          capaDimRes,
          featuresRes,
          warrantyRes,
        ] = await Promise.all([
          axiosInstance.get(API_ENDPOINTS.OPERATOR),
          axiosInstance.get(API_ENDPOINTS.TYPE_OF_LIFT),
          axiosInstance.get(API_ENDPOINTS.CAPACITY_TYPES),
          axiosInstance.get(API_ENDPOINTS.PERSON_CAPACITY),
          axiosInstance.get(API_ENDPOINTS.WEIGHTS),
          axiosInstance.get(API_ENDPOINTS.FLOORS),
          axiosInstance.get(API_ENDPOINTS.SPEED),
          axiosInstance.get(API_ENDPOINTS.ADDITIONAL_FLOORS),
          axiosInstance.get(API_ENDPOINTS.LIGHT_FITTINGS),
          axiosInstance.get(API_ENDPOINTS.CABIN_FLOORING),
          axiosInstance.get(API_ENDPOINTS.CABIN_CEILING),
          axiosInstance.get(API_ENDPOINTS.AIR_TYPE),
          //axiosInstance.get(API_ENDPOINTS.AIR_SYSTEM),
          //axiosInstance.get(API_ENDPOINTS.CAR_DOOR_TYPE),
          //axiosInstance.get(API_ENDPOINTS.CAR_DOOR_SUBTYPE),
          //axiosInstance.get(API_ENDPOINTS.LANDING_DOOR_TYPE),

          //axiosInstance.get(API_ENDPOINTS.CONTROL_PANEL),
          axiosInstance.get(API_ENDPOINTS.HARNESS),
          axiosInstance.get(API_ENDPOINTS.GUIDE_RAIL),
          axiosInstance.get(API_ENDPOINTS.BRACKETS),
          axiosInstance.get(API_ENDPOINTS.WIRE_ROPE),
          //axiosInstance.get(API_ENDPOINTS.LOP_SUBTYPE),
          //axiosInstance.get(API_ENDPOINTS.COP_TYPE),
          axiosInstance.get(API_ENDPOINTS.MANUFACTURER),
          axiosInstance.get(API_ENDPOINTS.OPERATION_TYPE),
          axiosInstance.get(API_ENDPOINTS.CAPACITY_DIMENSIONS),

          axiosInstance.get(API_ENDPOINTS.FEATURES),
          axiosInstance.get(API_ENDPOINTS.WARRANTY),
        ]);

        const additionalFloors = Array.isArray(additionalRes.data) ? additionalRes.data : [];
        const additionalFloorCodes = additionalFloors.map(f => f.code);
        const labels = {};
        additionalFloors.forEach(f => { labels[f.code] = f.label; });
        const floorsData = Array.isArray(floorsRes.data?.data) ? floorsRes.data.data : [];
        const totalFloorsCount = floorsData.length + additionalFloorCodes.length;

        const allManufacturers = Object.values(manufactureRes.data.data || {}).flat();

        //console.log(allManufacturers, "=====allManufacturers=======", warrantyRes.data, "in resoooooooooooo====", featuresRes.data);

        setInitialOptions(prevOptions => ({
          ...prevOptions,
          personOptions: personsRes.data?.data || [],
          kgOptions: weightRes.data?.data || [],
          capacityTypes: capacityTypeRes.data?.data || [],
          liftTypes: liftTypesRes.data?.data || [],
          operatorTypes: operatorRes.data?.data || [],
          floors: floorsData,
          floorOptions: Array.from({ length: floorsData.length }, (_, i) => i + 1),
          stopsOptions: totalFloorsCount > 1 ? Array.from({ length: totalFloorsCount }, (_, i) => i + 1) : [1],
          openingOptions: Array.from({ length: 2 * totalFloorsCount }, (_, i) => i + 1),
          speeds: speedRes.data || [],
          floorAddOption: additionalFloorCodes,
          floorAddLabels: labels,
          //cabinTypes: cabinTypesRes.data.data || [],
          lightFittings: lightFittingsRes.data?.data || [],
          cabinFlooring: cabinFlooringRes.data?.data || [],
          cabinCeiling: cabinCelingRes.data?.data || [],
          airSystem: airRes.data?.data || [],
          //airSystemPrices: airSystemPriceRes.data?.data || [],
          //carEntranceTypes: carDoorTypesRes.data?.data || [],
          //carEntranceSubTypes: carDoorSubTypesRes.data?.data || [],
          //landingEntrance: landingDoorTypesRes.data?.data || [],
          //landingEntranceSubTypes: landingDoorSubTypesRes.data?.data || [],
          //controlPanelTypes: controlPanelTypesRes.data?.data || [],
          wiringHarness: wiringHarnessRes.data?.data || [],
          guideRail: guideRailRes.data || [],
          bracketTypes: bracketsTypesRes.data?.data || [],
          wireRopes: wireRopeRes.data || [],
          //lopTypes: lopTypeRes.data?.data || [],
          //copTypes: copTypeRes.data || [],

          manufacturers: allManufacturers,
          operationType: operationTypeRes.data || [],
          capaDim: capaDimRes.data || [],
          features: featuresRes.data || [],
          warranty: warrantyRes.data || [],
        }));
      } catch (err) {
        console.error("Error fetching options", err);
      }
    };

    fetchOptions();
  }, []);

  console.log("lift=====>", lift);

  useEffect(() => {
    const loadCapacityDimension = async () => {
      if (formData.capacityType && formData.capacityValue) {
        const dimension = await fetchCapacityDimension(
          formData.capacityType,
          formData.capacityValue
        );

        if (!dimension) {
          toast.error("No capacity dimension available for the selected values");
          return;
        }

        // Update formData with dimension fields
        setFormData((prev) => ({
          ...prev,
          shaftWidth: dimension.shaftsWidth || "",
          shaftDepth: dimension.shaftsDepth || "",
          machineRoomDepth: dimension.reqMachineDepth || "",
          machineRoomWidth: dimension.reqMachineWidth || "",
          carInternalWidth: dimension.carInternalWidth || "",
          carInternalDepth: dimension.carInternalDepth || "",
          carInternalHeight: 2100,
        }));
      }
    };

    loadCapacityDimension();
  }, [formData.capacityType, formData.capacityValue, setFormData]);


  useEffect(() => {
    console.log("Current formData:", formData);
  }, [formData]);

  //✅ Auto-update carTravel whenever floors change
  useEffect(() => {
    console.log("in useeffect Current formData222:", formData);
    const noOfFloors = Number(
      formData.floors ? formData.floors : 0
    );
    const currentSelections = formData.floorSelections || [];

    const updatedStops = noOfFloors + currentSelections.length;
    //const updatedOpenings = updatedStops * 2;
    const updatedOpenings = updatedStops;
    const updatedCarTravel = noOfFloors > 0 ? (updatedStops - 1) * 3000 : 0;

    // 🔹 If user selected a specific floor index (from dropdown)
    let updatedFloorDesignations = "";

    // 1️⃣ If initialOptions.floors is ready, get designation from it
    if (initialOptions.floors?.length) {
      const selectedIndex = Math.max(0, Number(formData.floors) - 2);
      const selectedFloor = initialOptions.floors[selectedIndex] || null;
      updatedFloorDesignations = selectedFloor?.floorName || lift?.floorsDesignation || "";
    }
    // 2️⃣ Fallback to lift data on initial load
    else if (lift?.floorsDesignation) {
      updatedFloorDesignations = lift.floorsDesignation;
    }
    setFormData(prev => ({
      ...prev,
      stops: updatedStops,
      openings: updatedOpenings,
      carTravel: updatedCarTravel,
      floorDesignations: updatedFloorDesignations,
      landingEntranceCount: "",
      guideRail: "",
      guideRailPrice: 0,
    }));
  }, [formData.floors, formData.floorSelections]); // ✅ depend on floors and floorSelections

  // Reset dependent fields on change
  const handleChangeWithReset = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      let updated = { ...prev, [name]: value };

      if (name === "capacityType") {
        updated.capacityValue = "";
        updated.ardPrice = 0;
        updated.machinePrice = 0;
        updated.cabinPrice = 0;
        updated.shaftWidth = 0;
        updated.shaftDepth = 0;
        updated.reqMachineDepth = 0;
        updated.reqMachineWidth = 0;
        updated.carInternalWidth = 0;
        updated.carInternalDepth = 0;
        updated.carInternalHeight = 0;
        updated.ropingType = "";
        updated.ropingTypePrice = 0;
        updated.wireRopePrice = 0;
      }

      if (name === "capacityValue") {
        updated.ropingType = "";
        updated.ropingTypePrice = 0;
        updated.wireRopePrice = 0;
      }

      if (name === "floors") {
        updated.stops = "";
        updated.openings = "";
        updated.floorDesignations = "";
        updated.ropingType = "";
        updated.ropingTypePrice = 0;
        updated.wireRopePrice = 0;
        updated.fastenerType = "";
        updated.fastenerPrice = 0;
      }

      if (name === "liftType") {
        updated.carEntrance = "";
        updated.capacityValue = "";
        updated.carEntranceSubType = "";
        updated.landingEntranceSubType1 = "";
        updated.landingEntranceSubType2 = "";
      }

      if (name === "carEntrance") {
        updated.carEntranceSubType = "";
      }

      if (name === "landingEntranceSubType1" && value === "") {
        updated.landingEntranceCount = Number(prev.openings) || 0;
      }

      if (name === "landingEntranceCount") {
        const openings = Number(prev.openings) || 0;
        if (Number(value) === openings) {
          updated.landingEntranceSubType2_fromFloor = 0;
          updated.landingEntranceSubType2_toFloor = 0;
        } else {
          updated.landingEntranceSubType2_fromFloor = Number(value) + 1 || "";
          updated.landingEntranceSubType2_toFloor = openings || "";
        }
      }

      // ✅ Reset when ropingType set back to "Please Select"
      if (name === "ropingType" && value === "") {
        updated.ropingTypePrice = 0;
        updated.wireRopePrice = 0;
      }

      return updated;
    });

    // ✅ Only run async fetch if ropingType has a real value
    if (name === "ropingType" && value) {
      if (!formData.capacityType || !formData.capacityValue) {
        toast.error("Please select Capacity Type and Capacity Value first");
        return;
      }

      const selectedRope = initialOptions.wireRopes.find(
        (opt) => String(opt.id) === String(value)
      );

      const ropeTypeId = selectedRope?.wireRopeTypeId || null;

      if (!ropeTypeId) {
        toast.error("Invalid Rope selection");
        return;
      }

      fetchRopingTypePrice(
        ropeTypeId,
        formData.capacityType,
        formData.capacityValue,
        formData.liftType
      ).then((price) => {
        setFormData((prev) => ({
          ...prev,
          ropingTypePrice: price,
        }));
      });
    }
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

    // 👉 Custom validation rules
    const newErrors = {};

    // Stops ≤ Floors
    if (formData.stops > formData.floors) {
      newErrors.stops = "No. of Stops cannot be greater than No. of Floors";
    }

    // Openings ≤ 2 × Floors
    if (formData.openings > 2 * formData.floors) {
      newErrors.openings = "No. of Openings cannot exceed 2 × No. of Floors";
    }

    // ✅ Car internal width < Shaft width
    if (
      formData.carInternalWidth &&
      formData.shaftWidth &&
      Number(formData.carInternalWidth) >= Number(formData.shaftWidth)
    ) {
      newErrors.carInternalWidth =
        "Car internal width must be less than Shaft width";
    }

    // ✅ Car internal depth < Shaft depth
    if (
      formData.carInternalDepth &&
      formData.shaftDepth &&
      Number(formData.carInternalDepth) >= Number(formData.shaftDepth)
    ) {
      newErrors.carInternalDepth =
        "Car internal depth must be less than Shaft depth";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.dismiss();
      toast.error("Please fix validation errors.");
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

  const handleSave = () => {
    const isValid = validate();
    if (!isValid) return;

    onSave(lift.id, { ...formData, ...calculations }, true, {}); // Pass all data including calculations
  };

  // const handleCheckboxChange = () => {
  //   console.log("================>");
  // };

  const handleFeatureChange = (id) => {
    setFormData((prev) => {
      const alreadySelected = prev.selectedFeatures.includes(id);
      return {
        ...prev,
        selectedFeatures: alreadySelected
          ? prev.selectedFeatures.filter((fid) => fid !== id) // remove if unchecked
          : [...prev.selectedFeatures, id], // add if checked
      };
    });
  };


  // ------------------------ helper function to populate dropdown of makes or manufactures-----------------------------------
  const getComponentData = (manufacturers, componentId, fallbackLabel = "") => {
    const filtered = manufacturers.filter((m) => m.componentId === componentId);
    const componentName = filtered[0]?.componentName || fallbackLabel;
    return { componentName, data: filtered };
  };

  const { componentName: vfdLabel, data: vfdManufacturers } = getComponentData(
    initialOptions.manufacturers,
    4,
    "VFD - Main Drive" // fallback if not found
  );

  const { componentName: doorOperatorLabel, data: doorOperatorManufacturers } = getComponentData(
    initialOptions.manufacturers,
    12,
    "Door Operator" // fallback if not found
  );

  const { componentName: mainMachineSetLabel, data: mainMachineSetManufacturers } = getComponentData(
    initialOptions.manufacturers,
    5,
    "Main Machine Set" // fallback if not found
  );

  const { componentName: carRailsLabel, data: carRailsManufacturers } = getComponentData(
    initialOptions.manufacturers,
    6,
    "Car Rails" // fallback if not found
  );

  const { componentName: counterWeightRailsLabel, data: counterWeightRailsManufacturers } = getComponentData(
    initialOptions.manufacturers,
    7,
    "Counter Weight Rails" // fallback if not found
  );

  const { componentName: wireRopeLabel, data: wireRopeManufacturers } = getComponentData(
    initialOptions.manufacturers,
    8,
    "Wire Rope" // fallback if not found
  );
  //------------------------------------------------------------------


  return (
    // <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
    //   <div className="bg-white w-[90%] max-w-5xl h-[90vh] rounded-lg shadow-lg flex flex-col">
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="bg-white p-4 rounded shadow-xl border w-[90%] max-w-7xl h-[90vh] rounded-lg  flex flex-col">
        {/* Modal Header (fixed) */}
        <div className="sticky top-0 z-10 bg-blue-400 border-b pt-4">
          <div className="flex items-center gap-2 px-6 text-white">
            <h2 className="text-2xl font-bold mb-3">Lift Quotation</h2>

            <div className="flex text-xs text-white gap-3 ml-auto">
              {/* <div className="sticky top-0 z-10 bg-white border-b px-6 pt-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold mb-3">Lift Quotation</h2>

            <div className="flex text-xs text-gray-700 gap-3 ml-auto"> */}
              {initialOptions.floorAddOption.map((floor) => (
                <span key={floor}>
                  {floor} = {initialOptions.floorAddLabels[floor]}
                </span>
              ))}
            </div>
          </div>
          {/* <div className="flex gap-2"> */}
          <div className="flex gap-2 bg-white">
            {tabLabels.map((label, index) => {
              const isActive = activeTab === index;
              const isIncomplete = incompleteTabs.includes(index);

              return (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`px-4 py-2 rounded-t-md text-sm font-medium border-b-2 transition-all duration-200
          ${isActive
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
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-4 gap-x-3 gap-y-6 px-6">
          {activeTab === 0 && (
            <>
              <h4 className="text-md font-semibold col-span-4">
                Basic Specification
              </h4>

              <Select
                //label="Lift Type *"
                label={getLabel("liftType", "Lift Operator Type")}
                name="liftType"
                value={formData.liftType}
                onChange={handleChangeWithReset}
                error={errors.liftType}
                required
              >
                <option key="" value="">
                  Please Select
                </option>
                {initialOptions.operatorTypes.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.name}
                  </option>
                ))}
              </Select>

              <RadioGroup
                //label="Capacity Type *"
                label={getLabel("capacityType", "Capacity Type")}
                name="capacityType"
                options={initialOptions.capacityTypes.map((ct) => ({
                  label: ct.type, // 👈 what user sees
                  value: ct.id,           // 👈 what gets stored in formData.capacityType
                }))}
                selected={formData.capacityType}
                onChange={handleChangeWithReset}
                error={errors.capacityType}
                required
              />

              {Number(formData.capacityType) === 1 ? (
                <Select
                  //label="Select Persons *"
                  label={getLabel("capacityValue", "Select Persons")}
                  name="capacityValue"
                  value={formData.capacityValue}
                  onChange={handleChangeWithReset}
                  error={errors.capacityValue}
                  required
                >
                  <option key="" value="">
                    Please Select
                  </option>
                  {initialOptions.personOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.displayName}
                    </option>
                  ))}
                </Select>
              ) : (
                <Select
                  //label="Enter Kg *"
                  label={getLabel("capacityValue", "Enter Kg")}
                  name="capacityValue"
                  value={formData.capacityValue}
                  onChange={handleChangeWithReset}
                  error={errors.capacityValue}
                  required
                >
                  <option key="" value="">
                    Please Select
                  </option>
                  {initialOptions.kgOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.weightValue} {opt.unitNM}
                    </option>
                  ))}
                </Select>
              )}

              <Select
                //label="No. of Stops *"
                label={getLabel("stops", "No. of Stops")}
                name="stops"
                value={formData.stops}
                onChange={handleChangeWithReset}
                error={errors.stops}
                required
              >
                <option key="" value="">
                  Please Select
                </option>
                {initialOptions.stopsOptions.map((opt) => (
                  <option key={opt} value={Number(opt)}>
                    {opt}
                  </option>
                ))}
              </Select>

              <Select
                label={getLabel("floors", "No. of Floors")}
                name="floors"
                value={formData.floors}
                onChange={handleChangeWithReset}
                error={errors.floors}
                required
              >
                <option key="" value="">
                  Please Select
                </option>
                {initialOptions.floors.map((opt, index) => (
                  <option key={opt.id} value={index + 1}>
                    {index + 1}
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
                {initialOptions.openingOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </Select>

              <div>
                <Input
                  label={getLabel("floorDesignations", "Floor Designations ")}
                  required
                  name="floorDesignations"
                  value={formData.floorDesignations}
                  //onChange={handleChange}
                  placeholder="E.g. G+29"
                  error={errors.floorDesignations}
                  disabled
                />
                {/* ✅ Checkboxes below input */}
                <div className="flex flex-wrap gap-4 mt-2">
                  {initialOptions.floorAddOption.map((floor) => (
                    <label
                      key={floor}
                      className="text-gray-700 text-sm flex items-center gap-1"
                    >
                      <input
                        type="checkbox"
                        value={floor}
                        checked={formData.floorSelections.includes(floor)}
                        onChange={() => handleCheckbox(floor)}
                        className="text-blue-500"
                      />
                      {floor}
                    </label>
                  ))}
                </div>
              </div>


              <Input
                label={getLabel("carTravel", "Car Travel ")}
                required
                name="carTravel"
                value={formData.carTravel}
                //onChange={handleChange}
                placeholder="E.g. 3000"
                error={errors.carTravel}
                disabled
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
                {initialOptions.speeds.map((opt) => (
                  <option key={opt.id} value={opt.value}>
                    {opt.value}
                  </option>
                ))}
              </Select>

              <div className="relative flex flex-col">
                <Select
                  label={getLabel("cabinSubType", "Cabin SubType ")}
                  required
                  name="cabinSubType"
                  value={formData.cabinSubType}
                  onChange={handleChange}
                  error={errors.cabinSubType}
                >
                  <option key="" value="">
                    Please Select
                  </option>
                  {initialOptions.cabinSubTypes.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.cabinSubName}{" "}
                      {opt.personCapacityDTO
                        ? ` - ${opt.personCapacityDTO.displayName}`
                        : opt.weightDTO
                          ? ` - ${opt.weightDTO.weightValue} ${opt.weightDTO.unitNM}`
                          : ""}
                    </option>
                  ))}
                </Select>
                {/* Price below dropdown */}
                <PriceBelowSelect
                  options={initialOptions.cabinSubTypes}
                  formValue={formData.cabinSubType}
                  color={tabColors[activeTab]}
                  setPrice="cabinPrice"
                  setFormData={setFormData}
                  label={`Price for ${formData.capacityType === 1
                    ? initialOptions.personOptions?.find(opt => opt.id === Number(formData.capacityValue))?.displayName || ""
                    : initialOptions.kgOptions?.find(opt => opt.id === Number(formData.capacityValue))?.weightFull || ""
                    }`}
                />
                {/* {tabColors.map((label, i) => (
                  <PriceDisplay
                    key={i}
                    label={"price"}
                    price={calculations.tabTotals[`tab${i + 1}`]}
                    color={tabColors[i]}
                  />
                ))} */}
              </div>

              <div className="relative flex flex-col">
                <Select
                  label={getLabel("lightFitting", "Light Fitting")}
                  name="lightFitting"
                  value={formData.lightFitting}
                  onChange={handleChange}
                  error={errors.lightFitting}
                >
                  <option key="" value="">
                    Please Select
                  </option>
                  {initialOptions.lightFittings.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name}
                    </option>
                  ))}
                </Select>
                <PriceBelowSelect
                  options={initialOptions.lightFittings}
                  formValue={formData.lightFitting}
                  setPrice="lightFittingPrice"
                  setFormData={setFormData}
                  formData={formData}
                  color={tabColors[activeTab]}
                />
              </div>

              <div className="relative flex flex-col">
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
                  {initialOptions.cabinFlooring.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.flooringName}
                    </option>
                  ))}
                </Select>
                <PriceBelowSelect
                  options={initialOptions.cabinFlooring}
                  formValue={formData.cabinFlooring}
                  setPrice="cabinFlooringPrice"
                  setFormData={setFormData}
                  formData={formData}
                  color={tabColors[activeTab]}
                />
              </div>

              <div className="relative flex flex-col">
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
                  {initialOptions.cabinCeiling.map((opt) => (
                    <option key={opt.ceilingId} value={opt.ceilingId}>
                      {opt.ceilingName}
                    </option>
                  ))}
                </Select>
                <PriceBelowSelect
                  id="ceilingId"
                  options={initialOptions.cabinCeiling}
                  formValue={formData.cabinCeiling}
                  setPrice="cabinCeilingPrice"
                  setFormData={setFormData}
                  formData={formData}
                  color={tabColors[activeTab]}
                />
              </div>

              <div className="relative flex flex-col">
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
                  {initialOptions.airSystem.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name}
                    </option>
                  ))}
                </Select>
                {/* {formData.airSystem && formData.capacityType && formData.capacityValue && (
                  <PriceBelowSelect
                    options={initialOptions.airSystemPrices}
                    formValue={{
                      airSystemId: formData.airSystem,
                      capacityType: formData.capacityType,
                      capacityValue: formData.capacityValue,
                    }}
                    label="Air System"
                    color={tabColors[activeTab]}
                    isAirSystem={true}
                    priceVal={formData.airSystemPrice}
                  />
                )} */}
                {formData.airSystem && formData.capacityType && formData.capacityValue && (
                  <PriceBelowSelect
                    label={`Price for ${formData.capacityType === 1
                      ? initialOptions.personOptions?.find(opt => opt.id === Number(formData.capacityValue))?.displayName || ""
                      : initialOptions.kgOptions?.find(opt => opt.id === Number(formData.capacityValue))?.weightFull || ""
                      }`}
                    color={tabColors[activeTab]}
                    isAirSystem={true}
                    priceVal={formData.airSystemPrice} // ✅ now updated only when user selects
                  />
                )}

              </div>


              <Select
                label={getLabel("carEntrance", "Car Entrance ")}
                required
                name="carEntrance"
                value={formData.carEntrance}
                onChange={handleChangeWithReset}
                error={errors.carEntrance}
              >
                <option key="" value="">
                  Please Select
                </option>
                {initialOptions.carEntranceTypes.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.carDoorType}
                  </option>
                ))}
              </Select>

              <div className="relative flex flex-col">
                <Select
                  label={getLabel("carEntranceSubType", "Car Entrance Sub Type")}
                  name="carEntranceSubType"
                  value={formData.carEntranceSubType}
                  onChange={handleChangeWithReset}
                  error={errors.carEntranceSubType}
                  required
                >
                  <option key="" value="">
                    Please Select
                  </option>
                  {initialOptions.carEntranceSubTypes.map((opt) => (
                    <option key={opt.id} value={opt.id}>{opt.carDoorSubType}</option>
                  ))}
                </Select>
                <PriceBelowSelect
                  options={initialOptions.carEntranceSubTypes}
                  formValue={formData.carEntranceSubType}
                  color={tabColors[activeTab]}
                  setPrice="carEntrancePrice"
                  setFormData={setFormData}
                  formData={formData}
                  label={`Price for ${initialOptions.operatorTypes?.find(
                    (opt) => opt.id === Number(formData.liftType)
                  )?.name || ""
                    }`}
                // label={`Price for ${initialOptions.carEntranceSubTypes.find(
                //   (opt) => opt.id === Number(formData.carEntranceSubType)
                // )?.carDoorSubType || ""
                //   } - ${initialOptions.operatorTypes?.find(
                //     (opt) => opt.id === Number(formData.liftType)
                //   )?.name || ""
                //   }`}
                />
              </div>



              {/* Always show first Landing Entrance dropdown */}
              <Select
                label={getLabel("landingEntranceSubType1", "Landing Entrance ")}
                required
                name="landingEntranceSubType1"
                value={formData.landingEntranceSubType1}
                onChange={handleChangeWithReset}
                error={errors.landingEntranceSubType1}
              >
                <option key="" value="">
                  Please Select
                </option>
                {initialOptions.landingEntranceSubTypes.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.name}
                  </option>
                ))}
              </Select>

              {/* Landing Entrance Count */}
              <div className="relative flex flex-col">
                <Select
                  label={getLabel(
                    "landingEntranceCount",
                    "Floor For Landing Entrance"
                  )}
                  name="landingEntranceCount"
                  value={formData.landingEntranceCount || ""}
                  onChange={handleChangeWithReset}
                  className="mt-0"
                //labelClassName="opacity-0"
                >
                  <option key="all" value={Number(formData.openings) || 0}>ALL</option>
                  {Array.from({ length: (Number(formData.openings) || 0) }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </Select>
                <PriceBelowSelect
                  options={initialOptions.landingEntranceSubTypes}
                  formValue={[
                    formData.landingEntranceSubType1,   // first part
                    formData.landingEntranceSubType2,   // second part
                  ]}
                  color={tabColors[activeTab]}
                  setPrice="landingEntrancePrice1"
                  setFormData={setFormData}
                  formData={formData} // 👈 pass full formData so we can use openings & count
                  label="Price for Landing Door"
                />
              </div>

              {/* Show second Landing Entrance dropdown only if landingEntranceCount is not ALL */}
              {formData.landingEntranceCount &&
                formData.landingEntranceCount !== "" &&
                Number(formData.landingEntranceCount) !== Number(formData.openings) && (
                  <>

                    <Select
                      label={getLabel("landingEntranceSubType2", "Landing Entrance (Remaining Floor)")}
                      name="landingEntranceSubType2"
                      value={formData.landingEntranceSubType2 || ""}
                      onChange={handleChangeWithReset}
                      error={errors.landingEntranceSubType2}
                      required
                    >
                      <option key="" value="">
                        Please Select
                      </option>
                      {initialOptions.landingEntranceSubTypes.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.name}
                        </option>
                      ))}
                    </Select>

                    {/* Flex container for From/To Floor dropdowns */}
                    {/* <div className="flex gap-4 col-span-1"> */}
                    <div className="relative grid grid-cols-2 gap-4 col-span-1">

                      {/* From Floor */}
                      <Select
                        label="From Floor"
                        name="landingEntranceSubType2_fromFloor"
                        // value={formData.landingEntranceSubType2_fromFloor || (Number(formData.landingEntranceCount) + 1)}
                        value={formData.landingEntranceSubType2_fromFloor || ""}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Please Select</option>
                        {Array.from(
                          { length: Number(formData.openings) - Number(formData.landingEntranceCount) },
                          (_, i) => i + Number(formData.landingEntranceCount) + 1
                        ).map((floor) => (
                          <option key={floor} value={floor}>
                            {floor}
                          </option>
                        ))}
                      </Select>

                      {/* To Floor */}
                      <Select
                        label="To Floor"
                        name="landingEntranceSubType2_toFloor"
                        // value={formData.landingEntranceSubType2_toFloor || Number(formData.openings)}
                        value={formData.landingEntranceSubType2_toFloor || ""}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Please Select</option>
                        {Array.from(
                          { length: Number(formData.openings) - Number(formData.landingEntranceCount) },
                          (_, i) => i + Number(formData.landingEntranceCount) + 1
                        ).map((floor) => (
                          <option key={floor} value={floor}>
                            {floor}
                          </option>
                        ))}
                      </Select>
                      <PriceBelowSelect
                        options={initialOptions.landingEntranceSubTypes}
                        formValue={[   // first part
                          formData.landingEntranceSubType1,
                          formData.landingEntranceSubType2, // 👈 optional, for split floors
                        ]}
                        color={tabColors[activeTab]}
                        setPrice="landingEntrancePrice2"
                        setFormData={setFormData}
                        formData={formData} // 👈 pass full formData so we can use openings & count
                        label="Price for Landing Door"
                      />
                    </div>
                  </>
                )}



            </>
          )}

          {activeTab === 1 && (
            <>
              <h4 className="text-md font-semibold col-span-4">
                Technical Specification
              </h4>

              {/* <Select
                label={getLabel("technicalSpec1", "Control Panel Type ")}
                required
                name="technicalSpec1"
                value={formData.technicalSpec1}
                onChange={handleChange}
                error={errors.technicalSpec1}
              > */}
              <div className="relative flex flex-col">
                <Select
                  label={getLabel("controlPanelType", "Control Panel Type ")}
                  required
                  name="controlPanelType"
                  value={formData.controlPanelType}
                  onChange={handleChange}
                  error={errors.controlPanelType}
                >
                  <option key="" value="">
                    Please Select
                  </option>
                  {initialOptions.controlPanelTypes.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.controlPanelType}
                    </option>
                  ))}
                </Select>
                <PriceBelowSelect
                  options={initialOptions.controlPanelTypes}
                  formValue={formData.controlPanelType}
                  color={tabColors[activeTab]}
                  // formValueNm=""
                  setPrice="controlPanelTypePrice"
                  setFormData={setFormData}
                  formData={formData}
                  label={`Price for ${formData.capacityType === 1
                    ? initialOptions.personOptions?.find(opt => opt.id === Number(formData.capacityValue))?.displayName || ""
                    : initialOptions.kgOptions?.find(opt => opt.id === Number(formData.capacityValue))?.weightFull || ""
                    }`}
                />
              </div>

              <Select
                label={getLabel("controlPanelMake", "Control Panel Make ")}
                required
                name="controlPanelMake"
                value={formData.controlPanelMake?.id || ""}
                onChange={(e) => {
                  const selectedId = Number(e.target.value);
                  const selected = initialOptions.manufacturers.find(
                    (m) => m.id === selectedId
                  );
                  setFormData((prev) => ({
                    ...prev,
                    controlPanelMake: selected
                      ? { id: selected.id, name: selected.name }
                      : null,
                  }));
                }}
                error={errors.controlPanelMake}
              >
                <option key="" value="">
                  Please Select
                </option>
                {initialOptions.manufacturers
                  .filter((m) => m.componentName === "Control Panel")
                  .map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name.toUpperCase()}
                    </option>
                  ))}
              </Select>

              <div className="relative flex flex-col">
                <Select
                  label={getLabel("wiringHarness", "Wiring Harness ")}
                  required
                  name="wiringHarness"
                  value={formData.wiringHarness?.id || ""}
                  onChange={(e) => {
                    const selectedId = Number(e.target.value);
                    const selected = initialOptions.manufacturers.find(
                      (m) => m.id === selectedId
                    );
                    setFormData((prev) => ({
                      ...prev,
                      wiringHarness: selected
                        ? { id: selected.id, name: selected.name }
                        : null,
                    }));
                  }}
                  error={errors.wiringHarness}
                >
                  <option key="" value="">
                    Please Select
                  </option>
                  {initialOptions.manufacturers
                    .filter((m) => m.componentName === "Wiring Harness")
                    .map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name.toUpperCase()}
                      </option>
                    ))}
                </Select>
                {/* <PriceBelowSelect
                  //options={filteredControlPanel}
                  //formValue={formData.wiringHarnessPrice}
                  color={tabColors[activeTab]}
                  priceVal={formData.wiringHarnessPrice}
                  label={`Price for ${formData.floorDesignations}`}
                /> */}
              </div>

              <div className="relative flex flex-col">
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
                  {initialOptions.guideRail
                    .filter(opt => {
                      // Find the floor object that matches the selected floors ID
                      const selectedFloor = initialOptions.floors.find(
                        (f) => f.id === Number(formData.floors - 1)
                      );

                      // If a floor is selected, filter guide rails by its name
                      if (selectedFloor) {
                        return opt.floorName === selectedFloor.floorName;
                      }

                      // If no floor is selected, don't show any guide rail options
                      return false;
                    })
                    .map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {decodeHtmlEntities(opt.counterWeightName)} [{opt.floorName}-{opt.counterWeightTypeName}]
                      </option>
                    ))}
                </Select>
                <PriceBelowSelect
                  options={initialOptions.guideRail}
                  formValue={formData.guideRail}
                  setPrice="guideRailPrice"
                  setFormData={setFormData}
                  formData={formData}
                  color={tabColors[activeTab]}
                  label={`Price for ${formData.floorDesignations}`}
                />
              </div>

              <div className="relative flex flex-col">
                <Select
                  label={getLabel("bracketType", "Bracket Type ")}
                  required
                  name="bracketType"
                  value={formData.bracketType || ""}
                  onChange={handleChange}
                  error={errors.bracketType}
                >
                  <option key="" value="">
                    Please Select
                  </option>
                  {initialOptions.bracketTypes
                    .filter(opt => {
                      // Find the floor object that matches the selected floors ID
                      const selectedFloor = initialOptions.floors.find(
                        (f) => f.id === Number(formData.floors - 1)
                      );

                      // If a floor is selected, filter guide rails by its name
                      if (selectedFloor) {
                        return opt.floorName === selectedFloor.floorName;
                      }

                      // If no floor is selected, don't show any guide rail options
                      return false;
                    })
                    .map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.bracketTypeName} [{opt.floorName}]
                      </option>
                    ))}
                </Select>
                <PriceBelowSelect
                  options={initialOptions.bracketTypes}
                  formValue={formData.bracketType}
                  setPrice="bracketTypePrice"
                  setFormData={setFormData}
                  formData={formData}
                  color={tabColors[activeTab]}
                  label={`Price for ${formData.floorDesignations}`}
                />
              </div>

              <div className="relative flex flex-col">
                <Select
                  label={getLabel("ropingType", "Roping Type ")}
                  required
                  name="ropingType"
                  value={formData.ropingType || ""}
                  onChange={handleChangeWithReset}
                  error={errors.ropingType}
                >
                  <option key="" value="">
                    Please Select
                  </option>
                  {formData.capacityType && formData.capacityValue && ( // ✅ only show if both are selected
                    initialOptions.wireRopes
                      .filter(opt => {
                        // Find the floor object that matches the selected floors ID
                        const selectedFloor = initialOptions.floors.find(
                          (f) => f.id === Number(formData.floors - 1)
                        );

                        // Find the lift type object that matches the selected lift type ID
                        const selectedLiftType = initialOptions.operatorTypes.find(
                          (lt) => lt.id === Number(formData.liftType)
                        );

                        // If both a floor and a lift type are selected, apply both filters
                        if (selectedFloor && selectedLiftType) {
                          return opt.floorName === selectedFloor.floorName && opt.operatorElevatorName === selectedLiftType.name;
                        }

                        // If no floor or lift type is selected, don't show any wire rope options
                        return false;
                      })
                      .map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.wireRopeTypeName} [{opt.floorName}]
                        </option>
                      ))
                  )}
                </Select>
                {formData.capacityType && formData.capacityValue ? (
                  <PriceBelowSelect
                    options={initialOptions.wireRopes}
                    formValue={formData.ropingType}
                    setPrice="wireRopePrice"
                    setFormData={setFormData}
                    formData={formData}
                    color={tabColors[activeTab]}
                    label={`Price for ${formData.floorDesignations}`}
                  />
                ) : (
                  <div className="absolute right-0 mt-[3.7rem] text-sm text-red-600">
                    {!formData.capacityType && "Please select Capacity Type."}
                    {!formData.capacityValue && " Please select Capacity Value."}
                  </div>
                )}
              </div>

              <div className="relative flex flex-col">
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
                  {initialOptions.lopTypes.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name}
                    </option>
                  ))}
                </Select>
                <PriceBelowSelect
                  options={initialOptions.lopTypes}
                  formValue={formData.lopType}
                  setPrice="lopTypePrice"
                  setFormData={setFormData}
                  formData={formData}
                  color={tabColors[activeTab]}
                  label={`Price for ${initialOptions.operatorTypes?.find(
                    (opt) => opt.id === Number(formData.liftType)
                  )?.name || ""
                    } [${formData.floorDesignations || ""}]`}
                />
              </div>

              <div className="relative flex flex-col">
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
                  {initialOptions.copTypes.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.copName}
                    </option>
                  ))}
                </Select>
                <PriceBelowSelect
                  options={initialOptions.copTypes}
                  formValue={formData.copType}
                  setPrice="copTypePrice"
                  setFormData={setFormData}
                  formData={formData}
                  color={tabColors[activeTab]} label={`Price for ${initialOptions.operatorTypes?.find(
                    (opt) => opt.id === Number(formData.liftType)
                  )?.name || ""
                    } [${formData.floorDesignations || ""}]`}

                />
              </div>

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
                {initialOptions.operationType
                  .filter(opt => opt.active)
                  .map(opt => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name}
                    </option>
                  ))}
              </Select>

              <Input
                label={getLabel("machineRoomDepth", "Machine Room (Height)")}
                required
                name="machineRoomDepth"
                value={formData.machineRoomDepth}
                onChange={handleChange}
                error={errors.machineRoomDepth}
              />

              <Input
                label={getLabel("machineRoomWidth", "Machine Room (Width)")}
                name="machineRoomWidth"
                required
                value={formData.machineRoomWidth}
                onChange={handleChange}
                error={errors.machineRoomWidth}
              />

              <Input
                label={getLabel("shaftWidth", "Shaft Width (mm) ")}
                required
                name="shaftWidth"
                value={formData.shaftWidth || ""}
                onChange={handleChange}
                error={errors.shaftWidth}
                disabled
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
                value={formData.carInternalHeight || "2100"}
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

                  {initialOptions.features
                    .filter((f) => f.active)
                    .map((feature) => {
                      const fieldName =
                        "feature_" +
                        feature.id +
                        "_" +
                        feature.name.replace(/\s+/g, "_").toLowerCase();

                      return (
                        <Checkbox
                          key={feature.id}
                          label={feature.name}
                          name={fieldName}
                          checked={formData.selectedFeatures.includes(feature.id)} // ✅ FIXED
                          onChange={() => handleFeatureChange(feature.id)}
                        />
                      );
                    })}



                  {/* <Checkbox
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
                  /> */}
                </div>

                <div className="flex flex-col gap-1">
                  <h5 className="text-sm font-semibold mb-2">
                    Part Makers & Payment Terms
                  </h5>

                  <Select
                    label={getLabel("vfdMainDrive", vfdLabel)}
                    required
                    name="vfdMainDrive"
                    value={formData.vfdMainDrive?.id || ""}
                    onChange={(e) => {
                      const selectedId = Number(e.target.value);
                      const selected = vfdManufacturers.find((m) => m.id === selectedId);
                      setFormData((prev) => ({
                        ...prev,
                        vfdMainDrive: selected
                          ? { id: selected.id, name: selected.name }
                          : null,
                      }));
                    }}
                    error={errors.vfdMainDrive}
                  >
                    <option key="" value="">
                      Please Select
                    </option>
                    {vfdManufacturers.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name.toUpperCase()}
                      </option>
                    ))}
                  </Select>

                  <Select
                    label={getLabel("doorOperator", doorOperatorLabel)}
                    required
                    name="doorOperator"
                    value={formData.doorOperator?.id || ""}
                    onChange={(e) => {
                      const selectedId = Number(e.target.value);
                      const selected = doorOperatorManufacturers.find((m) => m.id === selectedId);
                      setFormData((prev) => ({
                        ...prev,
                        doorOperator: selected
                          ? { id: selected.id, name: selected.name }
                          : null,
                      }));
                    }}
                    error={errors.doorOperator}
                  >
                    <option key="" value="">
                      Please Select
                    </option>
                    {doorOperatorManufacturers.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name.toUpperCase()}
                      </option>
                    ))}
                  </Select>

                  <Select
                    label={getLabel("mainMachineSet", vfdLabel)}
                    required
                    name="mainMachineSet"
                    value={formData.mainMachineSet?.id || ""}
                    onChange={(e) => {
                      const selectedId = Number(e.target.value);
                      const selected = mainMachineSetManufacturers.find((m) => m.id === selectedId);
                      setFormData((prev) => ({
                        ...prev,
                        mainMachineSet: selected
                          ? { id: selected.id, name: selected.name }
                          : null,
                      }));
                    }}
                    error={errors.mainMachineSet}
                  >
                    <option key="" value="">
                      Please Select
                    </option>
                    {mainMachineSetManufacturers.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name.toUpperCase()}
                      </option>
                    ))}
                  </Select>

                  <Select
                    label={getLabel("carRails", carRailsLabel)}
                    required
                    name="carRails"
                    value={formData.carRails?.id || ""}
                    onChange={(e) => {
                      const selectedId = Number(e.target.value);
                      const selected = carRailsManufacturers.find((m) => m.id === selectedId);
                      setFormData((prev) => ({
                        ...prev,
                        carRails: selected
                          ? { id: selected.id, name: selected.name }
                          : null,
                      }));
                    }}
                    error={errors.carRails}
                  >
                    <option key="" value="">
                      Please Select
                    </option>
                    {carRailsManufacturers.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name.toUpperCase()}
                      </option>
                    ))}
                  </Select>

                  <Select
                    label={getLabel("counterWeightRails", counterWeightRailsLabel)}
                    required
                    name="counterWeightRails"
                    value={formData.counterWeightRails?.id || ""}
                    onChange={(e) => {
                      const selectedId = Number(e.target.value);
                      const selected = counterWeightRailsManufacturers.find((m) => m.id === selectedId);
                      setFormData((prev) => ({
                        ...prev,
                        counterWeightRails: selected
                          ? { id: selected.id, name: selected.name }
                          : null,
                      }));
                    }}
                    error={errors.counterWeightRails}
                  >
                    <option key="" value="">
                      Please Select
                    </option>
                    {counterWeightRailsManufacturers.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name.toUpperCase()}
                      </option>
                    ))}
                  </Select>

                  <Select
                    label={getLabel("wireRope", wireRopeLabel)}
                    required
                    name="wireRope"
                    value={formData.wireRope?.id || ""}
                    onChange={(e) => {
                      const selectedId = Number(e.target.value);
                      const selected = wireRopeManufacturers.find((m) => m.id === selectedId);
                      setFormData((prev) => ({
                        ...prev,
                        wireRope: selected
                          ? { id: selected.id, name: selected.name }
                          : null,
                      }));
                    }}
                    error={errors.wireRope}
                  >
                    <option key="" value="">
                      Please Select
                    </option>
                    {wireRopeManufacturers.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name.toUpperCase()}
                      </option>
                    ))}
                  </Select>

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
                    {initialOptions.warranty
                      .map(opt => (
                        <option key={opt.id} value={opt.id}>
                          {opt.warrantyMonth}
                        </option>
                      ))}
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
          {/* <div className="text-lg font-semibold text-gray-700">
            Quotation Price: ₹{" "}
            {formData.totalAmount
              ? Number(formData.totalAmount).toLocaleString()
              : "0"}
          </div> */}

          {/* Quotation Price on left */}
          <div className="flex flex-col text-gray-700">
            {/* Tab totals in one line */}
            <div className="flex gap-6 text-sm font-medium flex-wrap">
              {tabLabels.map((label, i) => (
                <span key={i} className={tabColors[i]}>
                  {label}: ₹ {calculations.tabTotals[`tab${i + 1}`].toLocaleString()}
                </span>
              ))}
            </div>

            {/* Grand total below */}
            <div className="text-xl font-bold mt-2 text-rose-700">
              Quotation Price: ₹ {calculations.grandTotal.toLocaleString()}
            </div>
          </div>




          {/* Navigation buttons */}
          <div className="flex items-center gap-4">
            {/* Previous button - disabled on first tab */}
            <button
              onClick={() => setActiveTab((prev) => Math.max(0, prev - 1))}
              disabled={activeTab === 0}
              className={`px-4 py-2 rounded ${activeTab === 0
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
              className={`px-4 py-2 rounded ${activeTab === 3
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
        <div className="mt-4 p-3 border rounded bg-gray-50 flex flex-wrap gap-2">
          <h3 className="w-full font-bold text-lg mb-2">Calculation Summary</h3>

          <p>ARD Prize: ₹{formData.ardPrice}</p>
          <p>| Machine Prize: ₹{formData.machinePrice}</p>
          <p>| Harness Prize: ₹{formData.wiringHarnessPrice}</p>
          <p>| Governor Prize: ₹{formData.governorPrice}</p>

          <p>
            | Roping Prize: ₹{formData.ropingTypePrice}
            {Number(formData.ropingTypePrice) > 0 && formData.capacityValue && (
              <span className="block text-xs text-red-600">
                {`Price for ${formData.capacityType === 1
                  ? initialOptions.personOptions?.find(
                    (opt) => opt.id === Number(formData.capacityValue)
                  )?.displayName || ""
                  : initialOptions.kgOptions?.find(
                    (opt) => opt.id === Number(formData.capacityValue)
                  )?.weightFull || ""
                  }`}
              </span>
            )}
          </p>

          <p>
            | Fastner Prize: ₹{formData.fastenerPrice}
            {Number(formData.fastenerPrice) > 0 && formData.floorDesignations && (
              <span className="block text-xs text-red-600">
                {`Price for ${formData.floorDesignations}`}
              </span>
            )}
          </p>

          <p>| Truffing Prize: ₹{formData.truffingPrice}</p>
          <p>| Truffing Prize: ₹{formData.truffingPrice}</p>
          <p>| Truffing Prize: ₹{formData.truffingPrice}</p>
          <p>| Truffing Prize: ₹{formData.truffingPrice}</p>
          <p>| Truffing Prize: ₹{formData.truffingPrice}</p>
          <p>| Truffing Prize: ₹{formData.truffingPrice}</p>
          <p>| Truffing Prize: ₹{formData.truffingPrice}</p>
          <p>| Truffing Prize: ₹{formData.truffingPrice}</p>
          <p className="w-full font-bold text-blue-600">Total: ₹{formData.totalAmount}</p>
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
  value = "",
  ...props
}) => {
  const hasValue = value !== "" && value !== null && value !== undefined;

  const baseClasses =
    "w-full rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200";
  const borderClasses = error
    ? "border-2 border-red-500 bg-white"
    : hasValue
      ? "border-2 border-gray-700 bg-gray-100"
      : "border border-gray-300 bg-white";

  return (
    <div>
      <label className={`block text-gray-700 text-sm mb-1 ${labelClassName}`}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        {...props}
        name={name}
        title={tooltip}
        value={value}
        className={`${baseClasses} ${borderClasses}`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};



const Select = ({
  label,
  name,
  error,
  children,
  labelClassName = "",
  required = false,
  value,       // incoming value (could be id or object)
  ...props
}) => {
  // robust test whether a real selection exists
  const hasSelection = React.useMemo(() => {
    if (value === undefined || value === null) return false;
    if (typeof value === "string") return value.trim() !== "";
    if (typeof value === "number") return !Number.isNaN(value);
    if (typeof value === "object") {
      // support value being an object or nested id
      if (value.id !== undefined && value.id !== null) return true;
      // fallback: object with any keys -> treat as selection
      return Object.keys(value).length > 0;
    }
    return Boolean(value);
  }, [value]);

  const baseClasses =
    "w-full rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200";
  const borderClasses = error
    ? "border-2 border-red-500"
    : hasSelection
      ? "border-2 border-gray-700"
      : "border border-gray-300";
  const bgClasses = hasSelection ? "bg-gray-100" : "bg-white";

  return (
    <div className="mb-4">
      <label className={`block text-gray-700 text-sm mb-1 ${labelClassName}`}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <select
        name={name}
        value={value ?? ""}
        {...props}
        className={`${baseClasses} ${borderClasses} ${bgClasses} transition-colors duration-150`}
      >
        {children}
      </select>

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};


const RadioGroup = ({ label, name, options, selected, onChange, error, required }) => {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-semibold">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="flex gap-4">
        {options.map((opt, idx) => {
          // Support string OR object
          const value = typeof opt === "string" ? opt : opt.value;
          const displayLabel = typeof opt === "string" ? opt : opt.label;

          return (
            <label key={value || idx} className="flex items-center gap-2">
              <input
                type="radio"
                name={name}
                value={value}
                required={required} // ✅ enforce required
                checked={String(selected) === String(value)} // type-safe compare
                onChange={() => onChange({ target: { name, value } })}
              />
              <span>{displayLabel}</span>
            </label>
          );
        })}
      </div>
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};



// const RadioGroup = ({
//   label,
//   name,
//   options,
//   selected,
//   onChange,
//   error,
//   required = false,
// }) => (
//   <div className="mb-4">
//     <label className="block text-gray-700 text-sm mb-1">
//       {label}
//       {required && <span className="text-red-500 ml-1">*</span>}
//     </label>
//     <div className="flex gap-4">
//       {options.map((opt) => (
//         <label
//           key={opt.value}
//           className="text-gray-700 text-sm flex items-center gap-1"
//         >
//           <input
//             type="radio"
//             name={name}
//             value={opt.value}
//             checked={String(selected) === String(opt.value)}
//             onChange={onChange}
//             className={`text-blue-500 ${error ? "ring-1 ring-red-500" : ""}`}
//           />
//           {opt.label}
//         </label>
//       ))}
//     </div>
//     {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
//   </div>
// );
