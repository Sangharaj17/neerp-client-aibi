"use client";

import React, { useCallback, useState, useMemo, useEffect } from "react";

import toast from "react-hot-toast";
import FullScreenLoader from "@/components/UI/FullScreenLoader";
import Checkbox from "@/components/UI/Checkbox";
import SmallPopover from "@/components/UI/SmallPopover";
import axiosInstance from "@/utils/axiosInstance";
import { API_ENDPOINTS } from "@/utils/apiEndpoints";
import { decodeHtmlEntities } from "@/utils/validation";
import { calculateLiftMaterialPrices, calculateFloorPrices } from "@/utils/liftCalculations";
import useLiftForm from "./hooks/useLiftForm";
import { fetchCabinSubTypes, fetchCarEntranceTypes, fetchLandingEntranceSubType, fetchCarEntranceSubTypes, getOptionPrice, PriceBelowSelect, getLabel, fetchControlPanelTypes, fetchLOP, fetchCOP, fetchCapacityDimension, fetchRopingTypePrice, fetchFastner, fetchInstallationRule, calculateTotal, fetchOtherMaterialsByMainId, fetchOtherMaterialExcludeOthers, clearError, handleRefresh, fetchGuideRails, fetchBracketTypes, fetchWireRopes, fetchLoads } from "./liftService";
import { RefreshCcw } from "lucide-react";


export default function LiftModal({ lift, onClose, onSave }) {
  const [activeTab, setActiveTab] = useState(0);
  const [errorTabs, setErrorTabs] = useState([]);
  const [errors, setErrors] = useState({});

  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [showManualDetails, setShowManualDetails] = useState(false);
  const [showCommonDetails, setShowCommonDetails] = useState(false);

  const [manualDetails, setManualDetails] = useState([]);
  const [commonDetails, setCommonDetails] = useState([]);
  const [otherDetails, setOtherDetails] = useState([]);
  const [adjustedPriceKeys, setAdjustedPriceKeys] = useState([]);
  const includeExcludeOptions = ["Including", "Excluding"];

  const [selectedMaterials, setSelectedMaterials] = useState([]);


  useEffect(() => {
    setIsInitialLoad(true);
  }, [lift.enquiryId]); // or whatever identifies the current record

  const handleLoadComplete = useCallback(() => {
    // This is the function passed as 'onUserActivity'
    setIsInitialLoad(false);
  }, [/* No dependencies needed, setIsInitialLoad is stable */]);

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

  const liftRatePriceKeys = [
    "cabinPrice",
    "airSystemPrice",
    "carEntrancePrice",
    "landingEntrancePrice1",
    "landingEntrancePrice2",
    "controlPanelTypePrice",
    "wiringHarnessPrice",
    "guideRailPrice",
    "bracketTypePrice",
    "wireRopePrice",
    "ropingTypePrice",
    "lopTypePrice",
    "copTypePrice",
    "machinePrice",
    "governorPrice",
    "truffingPrice",
    "fastenerPrice",
    "manualPrice",
    "commonPrice",
    "otherPrice",
  ];

  const priceKeys = [
    "cabinPrice",//-----
    "lightFittingPrice",
    "cabinFlooringPrice",
    "cabinCeilingPrice",
    "airSystemPrice",//-----
    "carEntrancePrice",//-----
    "landingEntrancePrice1",//-----
    "landingEntrancePrice2",//-----
    "controlPanelTypePrice",//-----
    "wiringHarnessPrice",//-----
    "guideRailPrice",//-----
    "bracketTypePrice",//-----
    "wireRopePrice",//-----
    "ropingTypePrice",//-----
    "lopTypePrice",//-----
    "copTypePrice",//-----
    // "ardPrice",
    "machinePrice",//-----
    "governorPrice",//-----
    "truffingPrice",//-----
    "fastenerPrice",//-----
    "pwdAmount",
    "bambooScaffolding",
    "ardAmount",
    "overloadDevice",
    "transportCharges",
    "otherCharges",
    "installationAmount",
    "powerBackup",
    "fabricatedStructure",
    "electricalWork",
    "ibeamChannel",
    "duplexSystem",
    "telephonicIntercom",
    "gsmIntercom",
    "numberLockSystem",
    "thumbLockSystem",
    "manualPrice", //-----
    "commonPrice", //-----
    // "tax",
    "liftRate",
  ];

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
      "lightFitting", //------
      "cabinFlooring", //------
      "cabinCeiling", //------
      "airSystem",
      "carEntrance",
      "carEntranceSubType",
      "landingEntranceSubType1",
      //"landingEntranceSubType2",
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
      "operationType", //------
      "machineRoomDepth",
      "machineRoomWidth",
      "shaftWidth",
      "shaftDepth",
      "carInternalWidth",
      "carInternalDepth",
      "carInternalHeight", //------
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
      "tax",
    ],
  };


  const selectedMaterialKeys = [
    'guideRailMaterial',//setPrice name concat with Material
    'cabinFlooringMaterial',
    'cabinCeilingMaterial',
    'cabinMaterial',
    'landingEntrance1Material',
    'landingEntrance2Material',
    'controlPanelTypeMaterial',
    'bracketTypeMaterial',
    'carEntranceTypeMaterial',
    'carEntranceMaterial',
    'lopTypeMaterial',
    'copTypeMaterial',
    'airSystemMaterial',
    // ... add all other calculated materials here
  ];

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
    airType: [],
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

    // load: [],
  });

  const {
    formData,
    setFormData,
    handleChange,
    handleCheckbox,
    calculations,
    // errors,
    // setErrors,
    markFormTouched,
  } = useLiftForm(lift, setErrors, liftRatePriceKeys, initialOptions, handleLoadComplete);

  // const {
  //   formData,
  //   setFormData,
  //   handleChange,
  //   handleCheckbox,
  //   calculations,
  //   // errors,
  //   // setErrors,
  //   markFormTouched,
  // } = useLiftForm(lift, setErrors, liftRatePriceKeys, initialOptions, () => setIsInitialLoad(false));

  // Dynamically watch all price keys without manually listing them
  // useEffect(() => {
  //   const total = priceKeys.reduce((sum, key) => sum + Number(formData[key] || 0), 0);
  //   setFormData((prev) => ({ ...prev, totalAmount: total }));

  //   const priceList = priceKeys.map((key) => `${key}: ${formData[key]}`);
  //   console.log(priceList.join("\n"));
  // }, priceKeys.map((key) => formData[key])); // auto dependency array

  useEffect(() => {
    console.log("---change--------------");
    const liftRateTotal = liftRatePriceKeys.reduce(
      (sum, key) => sum + Number(formData[key] || 0),
      0
    );

    console.log("---liftRatePriceKeys--------------", liftRatePriceKeys);
    console.log("---****************------------");
    console.log(liftRateTotal, "---priceKeys--------------", priceKeys);
    const adjustedPriceKeys1 = priceKeys.filter(
      (key) => !liftRatePriceKeys.includes(key)
    );

    setAdjustedPriceKeys(adjustedPriceKeys1);

    console.log("Keys included in 'total':", adjustedPriceKeys1);

    // Check if carEntrancePrice is in the filtered list
    console.log("Is carEntrancePrice in 'total' keys?", adjustedPriceKeys1.includes("carEntrancePrice"));

    const total = adjustedPriceKeys1.reduce((sum, key) => {
      if (key === "carEntrancePrice") {
        console.log("CarEntrancePrice being summed:", formData[key]);
      }
      return sum + Number(formData[key] || 0);
    }, 0);

    console.log("Total ===>:", total);

    const liftQuantity = Number(formData.liftQuantity || 0);
    const taxRate = Number(formData.tax || 18);



    // ✅ Commercial Total (non-rounded)
    const commercialTotal =
      // liftRateTotal +
      Number(formData.fabricatedStructure || 0) * liftQuantity +
      Number(formData.ardAmount || 0) * liftQuantity +
      Number(formData.overloadDevice || 0) * liftQuantity +
      Number(formData.pwdAmount || 0) * liftQuantity +
      Number(formData.transportCharges || 0) * liftQuantity +
      Number(formData.otherCharges || 0) * liftQuantity +
      Number(formData.powerBackup || 0) * liftQuantity +
      Number(formData.bambooScaffolding || 0) * liftQuantity +
      Number(formData.electricalWork || 0) * liftQuantity +
      Number(formData.ibeamChannel || 0) * liftQuantity +
      Number(formData.duplexSystem || 0) * liftQuantity +
      Number(formData.telephonicIntercom || 0) * liftQuantity +
      Number(formData.gsmIntercom || 0) * liftQuantity +
      Number(formData.numberLockSystem || 0) * liftQuantity +
      Number(formData.thumbLockSystem || 0) * liftQuantity +
      Number(formData.installationAmount || 0) * liftQuantity;

    // const totalWithLiftRate = liftRateTotal + total;
    const totalWithLiftRateWithoutGST = total;//-lift rate included in total by priceKey
   
    // ✅ Floating Tax Calculations (keep decimals)
    const commercialTaxAmount = (commercialTotal * taxRate) / 100;
    const commercialFinalAmount = commercialTotal + commercialTaxAmount;

    const totalIncludingTax = totalWithLiftRateWithoutGST + (totalWithLiftRateWithoutGST * taxRate) / 100;

    const loadPerAmtPer = Number(formData.loadPerAmt || 0);
    const loadAmt = (totalIncludingTax * loadPerAmtPer) / 100;

    // // ✅ Keep two decimal places (convert back to number)
    // setFormData((prev) => ({
    //   ...prev,
    //   totalAmountWithoutGST: parseFloat(totalWithLiftRateWithoutGST.toFixed(2)),
    //   totalAmountWithoutLoad: parseFloat(totalIncludingTax.toFixed(2)),
    //   // (formData.totalAmount + formData.loadAmt).toFixed(2)
    //   totalAmount: parseFloat((totalIncludingTax + loadAmt).toFixed(2)),
    //   loadAmt: parseFloat(loadAmt.toFixed(2)),
    //   liftRate: parseFloat(liftRateTotal.toFixed(2)),
    //   commercialTotal: parseFloat(commercialTotal.toFixed(2)),
    //   commercialTaxAmount: parseFloat(commercialTaxAmount.toFixed(2)),
    //   commercialFinalAmount: parseFloat(commercialFinalAmount.toFixed(2)),
    // }));

    setFormData((prev) => {
        const updates = {
            ...prev,
            totalAmountWithoutGST: parseFloat(totalWithLiftRateWithoutGST.toFixed(2)),
            totalAmountWithoutLoad: parseFloat(totalIncludingTax.toFixed(2)),
            totalAmount: parseFloat((totalIncludingTax + loadAmt).toFixed(2)),
            loadAmt: parseFloat(loadAmt.toFixed(2)),
            commercialTotal: parseFloat(commercialTotal.toFixed(2)),
            commercialTaxAmount: parseFloat(commercialTaxAmount.toFixed(2)),
            commercialFinalAmount: parseFloat(commercialFinalAmount.toFixed(2)),
        };

        if (!prev.isLiftRateManual) {
            updates.liftRate = parseFloat(liftRateTotal.toFixed(2));
        }

        return updates;
    });

    console.log("Total (with decimals):", total.toFixed(2));
    console.log("Total incl. GST:", totalIncludingTax.toFixed(2));
  }, [...priceKeys.map((key) => formData[key]),
  formData.liftQuantity,
  formData.tax,
  formData.loadPerAmt,
  formData.liftRate,
  formData.fabricatedStructure,
  formData.ardAmount,
  formData.overloadDevice,
  formData.pwdAmount,
  formData.transportCharges,
  formData.otherCharges,
  formData.powerBackup,
  formData.bambooScaffolding,
  formData.electricalWork,
  formData.ibeamChannel,
  formData.duplexSystem,
  formData.telephonicIntercom,
  formData.gsmIntercom,
  formData.numberLockSystem,
  formData.thumbLockSystem,
  formData.installationAmount, formData.carEntranceSubType,]);


  /**
   * Custom Hook to sync individual structured material objects from formData
   * into a single formData.selectedMaterials array. It relies on the 
   * **materialType** being unique for each item being synced.
   * * @param {object} formData - The complete form state object.
   * @param {function} setFormData - The state setter function.
   * @param {string[]} selectedMaterialKeys - Array of formData keys holding structured material objects.
   */
  const useMaterialSync = (formData, setFormData, selectedMaterialKeys) => {

    // Create a dependency array from the values of the keys we want to watch.
    const materialDeps = selectedMaterialKeys.map(key => formData[key]);

    // Ensure the effect re-runs when any of the watched material objects change
    useEffect(() => {

      // 1. Compile the array of newly calculated/synced materials
      const newlyCalculatedMaterials = selectedMaterialKeys
        .map(key => formData[key]) // Get the structured material object (e.g., formData.guideRailMaterial)
        .filter(item => item && item.materialType); // Filter out nulls or items without a materialType

      // 2. Identify the unique material types that are being synced/overridden
      const newlyCalculatedMaterialTypes = newlyCalculatedMaterials
        .map(item => item.materialType?.toLowerCase());

      // 3. Keep existing materials from formData.selectedMaterials ONLY if their 
      //    materialType is NOT one of the newly calculated types.
      const existingOtherMaterials = (formData.selectedMaterials || [])
        .filter(existingItem =>
          // Keep the item if its type is NOT in the list of types we're replacing
          !newlyCalculatedMaterialTypes.includes(existingItem.materialType?.toLowerCase())
        );

      // 4. Create the final unified list: preserved items + newly calculated/synced items
      const finalMaterials = [...existingOtherMaterials, ...newlyCalculatedMaterials];

      // 5. Compare and update state only if a meaningful change occurred
      const currentMaterialsString = JSON.stringify(formData.selectedMaterials || []);
      const newMaterialsString = JSON.stringify(finalMaterials);

      if (currentMaterialsString !== newMaterialsString) {
        setFormData(prev => ({
          ...prev,
          selectedMaterials: finalMaterials,
        }));
      }

    }, [
      setFormData,
      formData.selectedMaterials,
      ...materialDeps // Run when any of the watched material objects change
    ]);
  };

  /**
   * Updates or adds a single material item to the selectedMaterials array based on its materialType.
   * It filters out existing items of the same type and adds the new item.
   *
   * @param {Array} currentMaterials - The existing formData.selectedMaterials array.
   * @param {string} materialTypeToReplace - The materialType string (e.g., "fastener", "guiderail") to filter out.
   * @param {object} newMaterialObject - The new material object to add/update.
   * @returns {Array} The new, merged selectedMaterials array.
   */
  const updateSelectedMaterial = (
    currentMaterials = [],
    materialTypeToReplace,
    newMaterialObject
  ) => {
    if (!materialTypeToReplace || !newMaterialObject) {
      return currentMaterials;
    }

    // 1. Filter out all existing items matching the material type (case-insensitive)
    const materialsToKeep = currentMaterials.filter(
      (item) => item.materialType?.toLowerCase() !== materialTypeToReplace.toLowerCase()
    );

    // 2. Create the new combined list: materials to keep + new item
    const newSelectedMaterials = [
      ...materialsToKeep,
      newMaterialObject,
    ];

    return newSelectedMaterials;
  };





  // useEffect(() => {

  //   // const total = priceKeys.reduce((sum, key) => sum + Number(formData[key] || 0), 0);

  //   const liftRateTotal = liftRatePriceKeys.reduce(
  //     (sum, key) => sum + Number(formData[key] || 0),
  //     0
  //   );

  //   // ✅ 2. Calculate totalAmount (includes all price keys)
  //   // const total = priceKeys.reduce(
  //   //   (sum, key) => sum + Number(formData[key] || 0),
  //   //   0
  //   // );

  //   // Step 1: Filter out liftRatePriceKeys from priceKeys
  //   const adjustedPriceKeys1 = priceKeys.filter(
  //     (key) => !liftRatePriceKeys.includes(key)
  //   );

  //   setAdjustedPriceKeys(adjustedPriceKeys1);

  //   console.log("=adjustedPriceKeys=====>", adjustedPriceKeys);

  //   // Step 2: Add 'liftRate' to represent the total of liftRatePriceKeys
  //   // adjustedPriceKeys.push("liftRate");

  //   // ✅ Now use adjustedPriceKeys instead of original priceKeys
  //   const total = adjustedPriceKeys.reduce((sum, key) => {
  //     // if (key === "liftRate") return sum + liftRateTotal;
  //     return sum + Number(formData[key] || 0);
  //   }, 0);


  //   // Commercial total (rate1 + all extras)
  //   const liftQuantity = Number(formData.liftQuantity || 0);
  //   // const rate = liftRateTotal;
  //   // const rate = Number(formData.liftRate || total);
  //   // const rate1 = rate * liftQuantity;
  //   console.log("=rate=====>", liftRateTotal, "====total===>", total);

  //   const commercialTotal =
  //     liftRateTotal +
  //     Number(formData.fabricatedStructure || 0) * liftQuantity +
  //     Number(formData.ardAmount || 0) * liftQuantity +
  //     Number(formData.overloadDevice || 0) * liftQuantity +
  //     Number(formData.pwdAmount || 0) * liftQuantity +
  //     Number(formData.transportCharges || 0) * liftQuantity +
  //     Number(formData.otherCharges || 0) * liftQuantity +
  //     Number(formData.powerBackup || 0) * liftQuantity +
  //     Number(formData.bambooScaffolding || 0) * liftQuantity +
  //     Number(formData.electricalWork || 0) * liftQuantity +
  //     Number(formData.ibeamChannel || 0) * liftQuantity +
  //     Number(formData.duplexSystem || 0) * liftQuantity +
  //     Number(formData.telephonicIntercom || 0) * liftQuantity +
  //     Number(formData.gsmIntercom || 0) * liftQuantity +
  //     Number(formData.numberLockSystem || 0) * liftQuantity +
  //     Number(formData.thumbLockSystem || 0) * liftQuantity +
  //     Number(formData.installationAmount || 0) * liftQuantity;

  //   // Tax amount (18%)
  //   // const commercialTaxAmount = Math.floor((commercialTotal * 18) / 100);
  //   const taxRate = Number(formData.tax || 18);
  //   const commercialTaxAmount = Math.floor((commercialTotal * taxRate) / 100);

  //   const commercialFinalAmount = commercialTotal + commercialTaxAmount;

  //   const totalIncludingTax = (total + Math.floor((total * taxRate) / 100));

  //   const loadPerAmtPer = formData.loadPerAmt;

  //   setFormData((prev) => ({
  //     ...prev,
  //     totalAmountWithoutGST: total,
  //     totalAmount: totalIncludingTax,
  //     loadAmt: ((totalIncludingTax * loadPerAmtPer) / 100),
  //     liftRate: liftRateTotal,
  //     // liftRate: Number(formData.liftRate || rate),
  //     commercialTotal: commercialTotal, // new commercial calc
  //     commercialTaxAmount: commercialTaxAmount,
  //     commercialFinalAmount: commercialFinalAmount,
  //   }));

  //   const priceList = priceKeys.map((key) => `${key}: ${formData[key]}`);
  //   console.log("total Amount Include: ", priceList.join("\n"));
  //   console.log("total Amount : ", total);

  //   console.log("--------------------");

  //   const liftRatePriceList = liftRatePriceKeys.map((key) => `${key}: ${formData[key]}`);
  //   console.log("lift Rate Amount Include: ", liftRatePriceList.join("\n"));
  //   console.log("lift Rate Amount : ", liftRateTotal);
  // }, [...priceKeys.map((key) => formData[key])]);




  useMaterialSync(formData, setFormData, selectedMaterialKeys);

  const handlePriceAutoUpdate = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    if (name === "carEntranceSubType") {
      const item = initialOptions.carEntranceSubTypes.find(x => x.id == value);
      if (item) {
        setFormData(prev => ({
          ...prev,
          carEntrancePrice: item.price || 0
        }));
      }
    }
  };


  const loadWireRope = async () => {
    if (formData.floors) {
      try {
        const wireRopes = await fetchWireRopes(formData.floors, formData.typeOfLift, setErrors);

        if (wireRopes.length === 0) {
          toast.error("No wire ropes available for the selected floor");
        }
        console.log(formData.floors, "-------", formData.liftType, "wireRopes==========>", wireRopes);
        setInitialOptions((prev) => ({
          ...prev,
          wireRopes: wireRopes,
        }));
      } catch (err) {
        console.error("Error fetching wire ropes:", err);
        toast.error("Failed to load wire ropes");
        setInitialOptions((prev) => ({ ...prev, wireRopes: [] }));
      }
    } else {
      setInitialOptions((prev) => ({ ...prev, wireRopes: [] }));
    }
  };


  const loadBracketTypes = async () => {
    if (formData.floors) {
      try {
        const bracketTypesRes = await fetchBracketTypes(formData.floors, setErrors);

        if (!bracketTypesRes || bracketTypesRes.length === 0) {
          toast.error("No bracket types available for the selected floor");
        }

        setInitialOptions((prev) => ({
          ...prev,
          bracketTypes: bracketTypesRes || [],
        }));
      } catch (err) {
        console.error("Error fetching bracket types:", err);
        toast.error("Failed to load bracket types");
        setInitialOptions((prev) => ({ ...prev, bracketTypes: [] }));
      }
    } else {
      setInitialOptions((prev) => ({ ...prev, bracketTypes: [] }));
    }
  };

  const loadGuideRails = async () => {
    if (formData.floors) {
      try {
        const guideRails = await fetchGuideRails(formData.floors, formData.liftType, setErrors);

        if (guideRails.length === 0) {
          toast.error("No guide rails available for the selected floor");
        }

        setInitialOptions((prev) => ({
          ...prev,
          guideRail: guideRails,
        }));
      } catch (err) {
        console.error("Error fetching guide rails:", err);
        toast.error("Failed to load guide rails");
        setInitialOptions((prev) => ({ ...prev, guideRail: [] }));
      }
    } else {
      setInitialOptions((prev) => ({ ...prev, guideRail: [] }));
    }
  };

  const loadControlPanelTypes = async () => {
    if (formData.capacityType && formData.capacityValue) {
      try {
        const controlPanelTypes =
          (await fetchControlPanelTypes(
            formData.liftType,
            formData.capacityType,
            formData.capacityValue,
            formData.typeOfLift,
            setErrors
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
      const existingSelectedMaterials = formData.selectedMaterials || [];

      // const existingMachineItems = existingSelectedMaterials.filter(item => {
      //   return item.materialType?.toLowerCase() === "machine";
      // });

      // // Get the first existing Fastener item to preserve its ID
      // const existingItem = existingMachineItems[0];

      // 2. Find existing 'Machine' material to pass its DB ID
      const existingMachineIndex = existingSelectedMaterials.findIndex(item =>
        item.materialType?.toLowerCase() === "machine".toLowerCase()
      );
      const existingMachineItem = existingMachineIndex !== -1 ? existingSelectedMaterials[existingMachineIndex] : undefined;

      // --- 2. Get existing ARD item ---
      const existingArdIndex = existingSelectedMaterials.findIndex(item =>
        item.materialType?.toLowerCase() === "ard".toLowerCase() // Use "ard" here
      );
      // Note: We don't pass this to calculateLiftMaterialPrices, but we need it for ID preservation
      const existingArdItem = existingArdIndex !== -1 ? existingSelectedMaterials[existingArdIndex] : undefined;
      console.log("==========existingArdAmount=====00000000=======>", formData.ardAmount);
      const materialResults = await calculateLiftMaterialPrices({
        liftType: formData.liftType,
        capacityType: formData.capacityType,
        capacityValue: formData.capacityValue,
        typeOfLift: formData.typeOfLift,
        floors: formData.floors,
        leadID: formData.leadId,
        existingItem: existingMachineItem,
        existingArd: existingArdItem,
        existingArdAmount: formData.ardAmount,
        setErrors,
      });

      setFormData(prev => {
        // 1. Get the current list of materials from the PREVIOUS state
        const existingSelectedMaterials = prev.selectedMaterials || [];
        let updatedSelectedMaterials = [...existingSelectedMaterials];

        // --- RE-LOCATE ARD/MACHINE UPDATE LOGIC HERE ---

        // (A) Find existing ARD/Machine indexes again based on prev.selectedMaterials
        const existingArdIndex = existingSelectedMaterials.findIndex(item => item.materialType?.toLowerCase() === "ard");
        const existingMachineIndex = existingSelectedMaterials.findIndex(item => item.materialType?.toLowerCase() === "machine");

        // (B) Process ARD Material (Using materialResults which is calculated outside)
        let newArdSelectedMaterials = materialResults.ardMaterial;
        if (newArdSelectedMaterials) { /* ... ID setup ... */ }
        if (newArdSelectedMaterials && materialResults.ardPrice > 0) {
          if (existingArdIndex !== -1) {
            updatedSelectedMaterials[existingArdIndex] = newArdSelectedMaterials;
          } else {
            updatedSelectedMaterials.push(newArdSelectedMaterials);
          }
        } else if (existingArdIndex !== -1) {
          updatedSelectedMaterials.splice(existingArdIndex, 1);
        }

        // (C) Process Machine Material (Using materialResults which is calculated outside)
        let newMachineSelectedMaterials = materialResults.machineMaterial;
        if (newMachineSelectedMaterials) { /* ... ID setup ... */ }
        if (newMachineSelectedMaterials && materialResults.machinePrice > 0) {
          if (existingMachineIndex !== -1) {
            updatedSelectedMaterials[existingMachineIndex] = newMachineSelectedMaterials;
          } else {
            updatedSelectedMaterials.push(newMachineSelectedMaterials);
          }
        } else if (existingMachineIndex !== -1) {
          updatedSelectedMaterials.splice(existingMachineIndex, 1);
        }

        // --- END OF RE-LOCATED LOGIC ---

        // Note: You must ensure leadId and quotationId are available in `prev` or outside

        return {
          ...prev,
          ardAmount: materialResults.ardPrice,
          machinePrice: materialResults.machinePrice,
          selectedMaterials: updatedSelectedMaterials, // Save the final merged array
        };
      });

    };

    fetchMaterialPrices();
    loadControlPanelTypes();
    loadGuideRails();
    loadBracketTypes();
    loadWireRope();
    // }, [formData.liftType, formData.capacityType, formData.capacityValue, formData.typeOfLift, formData.cabinType]);
  }, [formData.liftType, formData.capacityType, formData.capacityValue, formData.typeOfLift, formData.floors, formData.floorSelections, setErrors]);

  // useEffect(() => {
  //   // Only update liftRate if it's not explicitly set or equals previous totalAmount
  //   setFormData(prev => ({
  //     ...prev,
  //     liftRate: prev.totalAmount, // set liftRate = totalAmount if liftRate is null/undefined
  //   }));
  // }, [formData.totalAmount]);


  // 🔹 Effect for floor-based prices
  useEffect(() => {
    const fetchFloorPrices = async () => {
      if (!formData.floorDesignations || !formData.floors) return;

      const floorResults = await calculateFloorPrices(formData.floorDesignations, formData.floors, setErrors);

      const {
        harnessMaterial,
        governorMaterial,
        truffingMaterial
      } = floorResults;

      const existingSelectedMaterials = formData.selectedMaterials || [];
      let updatedSelectedMaterials = [...existingSelectedMaterials];

      // Array of materials to process
      const materialsToProcess = [
        { type: 'WiringHarness', material: harnessMaterial, price: floorResults.harnessPrice },
        { type: 'Governor', material: governorMaterial, price: floorResults.governorPrice },
        { type: 'Truffing', material: truffingMaterial, price: floorResults.truffingPrice },
      ];

      setFormData(prev => {
        // ✅ READ THE LATEST STATE HERE:
        const existingSelectedMaterials = prev.selectedMaterials || [];
        let updatedSelectedMaterials = [...existingSelectedMaterials];

        // 4. Loop through materialsToProcess and merge with the latest state
        materialsToProcess.forEach(({ type, material, price }) => {
          const materialType = type;

          // Find the existing item index in the current list (prev state)
          const indexToUpdate = updatedSelectedMaterials.findIndex(item =>
            item.materialType?.toLowerCase() === materialType.toLowerCase()
          );

          // Get the existing item to preserve its DB ID (if any)
          const existingItem = indexToUpdate !== -1 ? updatedSelectedMaterials[indexToUpdate] : null;

          if (material && price > 0) {
            // Prepare the final material object with form IDs and existing DB ID
            const finalMaterial = {
              ...material,
              id: existingItem?.id || null,
              leadId: prev.leadId, // Use prev.leadId
              quotationLiftDetailId: prev.quotationId, // Use prev.quotationId
              operatorType: prev.liftType,
            };

            // Add or Update
            if (indexToUpdate !== -1) {
              updatedSelectedMaterials[indexToUpdate] = finalMaterial;
            } else {
              updatedSelectedMaterials.push(finalMaterial);
            }
          } else if (indexToUpdate !== -1) {
            // Remove if not found/price <= 0
            updatedSelectedMaterials.splice(indexToUpdate, 1);
          }
        });

        // 5. Return the new state object
        return {
          ...prev,
          wiringHarnessPrice: floorResults.harnessPrice,
          governorPrice: floorResults.governorPrice,
          truffingPrice: floorResults.truffingPrice,
          truffingQty: floorResults.truffingQty,
          truffingType: floorResults.truffingType,
          selectedMaterials: updatedSelectedMaterials, // Save the fully merged array
        };
      });
    };

    fetchFloorPrices();
  }, [formData.floorDesignations, formData.floors]);


  // useEffect(() => {
  //   const fetchFastenerPrice = async () => {
  //     if (!formData.floors && !formData.floorDesignations) return;

  //     // Get the floor-1
  //     const selectedFloor = Number(formData.floors);
  //     const targetFloor = selectedFloor > 1 ? selectedFloor - 1 : 1;

  //     const fasteners = await fetchFastner(targetFloor);
  //     //console.log("========fasteners======>",fasteners)

  //     // Assuming API returns an array and you pick the first item
  //     if (fasteners.length > 0) {
  //       const fastener = fasteners[0];
  //       setFormData((prev) => ({
  //         ...prev,
  //         fastenerPrice: fastener.price || 0,
  //         fastenerType: fastener.id || "",
  //       }));
  //     } else {
  //       setFormData((prev) => ({
  //         ...prev,
  //         fastenerPrice: fasteners.price || 0,
  //         fastenerType: fasteners.id || "",
  //       }));
  //     }
  //   };

  //   fetchFastenerPrice();


  //   const fetchTruffingRuleAndPrice = async () => {
  //     if (!formData.floors) return;

  //     const floorNumber = Number(formData.floors);
  //     const targetFloor = floorNumber > 1 ? floorNumber - 1 : 1;


  //     // Fetch Other Material rule for mainId = 1
  //     const response = await fetchOtherMaterialsByMainId(1);

  //     if (response.success && response.data && response.data.length > 0) {
  //       const material = response.data[0]; // pick first item
  //       const ruleExpression = material.otherMaterialMainRule; // e.g., "9 + (floor - 1) * 2"
  //       const basePrice = material.price || 0;

  //       if (ruleExpression) {
  //         // Evaluate rule safely
  //         const quantity = evaluateRule(ruleExpression, targetFloor);

  //         setFormData(prev => ({
  //           ...prev,
  //           truffingQty: quantity,
  //           truffingPrice: quantity * basePrice,
  //           truffingType: material.otherMaterialName,
  //         }));
  //       }
  //     }
  //   };

  //   fetchTruffingRuleAndPrice();
  // }, [formData.floors, formData.floorDesignations]);


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

  // In your component's useEffect

  useEffect(() => {
    const floorNumber = Number(formData.floors);
    if (!floorNumber) return;

    const targetFloor = floorNumber > 1 ? floorNumber - 1 : 1;

    const fetchPrices = async () => {
      // 1️⃣ Fetch Fastener
      try {
        const result = await fetchFastner(targetFloor, setErrors);

        if (result.success && result.data) {
          const fasteners = result.data;
          const fastener = Array.isArray(fasteners) && fasteners.length > 0
            ? fasteners[0]
            : (fasteners || {});

          const liftType = Number(formData.liftType);
          const leadId = formData.leadId;
          const quotLiftDetailId = formData.quotationId;
          const existingSelectedMaterials = formData.selectedMaterials || [];

          const existingFastenerItems = existingSelectedMaterials.filter(item => {
            return item.materialType?.toLowerCase() === "fastener".toLowerCase();
          });

          // Get the first existing Fastener item to preserve its ID
          const existingItem = existingFastenerItems[0];

          console.log(fastener, "---------existingFastenerSelectedMaterials--------", existingItem);

          const newFastenerSelectedMaterials = {
            // Preserve existing DB ID for UPDATE, otherwise set to null for INSERT
            id: existingItem?.id || null,

            leadId: leadId,
            quotationLiftDetailId: quotLiftDetailId || null,
            materialId: fastener.id,
            materialName: fastener.fastenerName,
            materialDisplayName: fastener.fastenerName,
            quantity: 1,
            quantityUnit: "Set",
            price: fastener.price || 0,
            operatorType: existingItem?.operatorType || liftType,
            materialType: "Fastener", // Use the exact string "Fastener"
          };

          console.log("---------newFastenerSelectedMaterials--------", newFastenerSelectedMaterials);

          // setFormData(prev => ({
          //   ...prev,
          //   fastenerPrice: fastener.price || 0,
          //   fastenerType: fastener.id || "",
          // }));
          setFormData(prev => {
            // // 1. Filter out the old Fastener record(s) from the list
            // const materialsWithoutFastener = (prev.selectedMaterials || []).filter(item =>
            //   item.materialType?.toLowerCase() !== "fastener"
            // );

            // // 2. Create the new combined list: preserved materials + new Fastener item
            // const newSelectedMaterials = [
            //   ...materialsWithoutFastener,
            //   newFastenerSelectedMaterials
            // ];

            const newSelectedMaterials = updateSelectedMaterial(
              prev.selectedMaterials,
              "fastener", // The material type to find and replace
              newFastenerSelectedMaterials // The new object to insert
            );

            return {
              ...prev,
              fastenerPrice: newFastenerSelectedMaterials.price,
              fastenerType: newFastenerSelectedMaterials.materialId,
              selectedMaterials: newSelectedMaterials, // Update the master list
            };
          });

        } else {
          // setFormData(prev => ({
          //   ...prev,
          //   fastenerPrice: 0,
          //   fastenerType: "",
          // }));
          setFormData(prev => {
            // 1. Filter out the old Fastener record(s) when cleaning up
            const materialsWithoutFastener = (prev.selectedMaterials || []).filter(item =>
              item.materialType?.toLowerCase() !== "fastener"
            );

            return {
              ...prev,
              fastenerPrice: 0,
              fastenerType: "",
              selectedMaterials: materialsWithoutFastener, // Remove the Fastener item from the master list
            };
          });
          // Optional: Show a toast here, but the service function already sets the error.
        }
      } catch (err) {
        console.error("Error fetching fastener:", err);
        // setFormData(prev => ({
        //   ...prev,
        //   fastenerPrice: 0,
        //   fastenerType: "",
        // }));
        setFormData(prev => {
          const materialsWithoutFastener = (prev.selectedMaterials || []).filter(item =>
            item.materialType?.toLowerCase() !== "fastener"
          );

          return {
            ...prev,
            fastenerPrice: 0,
            fastenerType: "",
            selectedMaterials: materialsWithoutFastener,
          };
        });
      }
    };

    fetchPrices();
  }, [formData.floors, formData.floorDesignations]);

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


  const loadCabinSubTypes = async () => {
    if (formData.capacityType && formData.capacityValue) {
      const cabinSubTypes = await fetchCabinSubTypes(
        formData.capacityType,
        formData.capacityValue,
        formData.cabinType,
        setErrors
      );

      if (cabinSubTypes.length === 0) {
        toast.error("No cabin subtypes available for the selected capacity");
      }

      setInitialOptions((prev) => ({ ...prev, cabinSubTypes: cabinSubTypes }));
    } else {
      setInitialOptions((prev) => ({ ...prev, cabinSubTypes: [] }));
    }
  };

  // 🔹 When capacityType / capacityValue / cabinType changes
  useEffect(() => {
    // Reset dependent fields when capacity type/value changes
    // const defaultAirSystem = lift.data?.airSystem
    // ? safeNumber(lift.data.airSystem)
    // : ""; // or "" if you prefer empty

    setFormData((prev) => ({
      ...prev,
      // totalAmount: prev.totalAmount - prev.ardPrice - prev.machinePrice,
      // ardPrice: 0,
      ardAmount: 0,
      machinePrice: 0,
      cabinPrice: 0,
      //cabinSubType: "",
      // airSystem: "",
      // airSystemPrice: 0,
    }));

    loadCabinSubTypes();
  }, [formData.capacityType, formData.capacityValue, formData.cabinType]);

  //if length is 1 the set bydefault 1st option as selected
  // useEffect(() => {
  //   if (initialOptions.cabinSubTypes.length === 1) {
  //     const onlyOption = initialOptions.cabinSubTypes[0];
  //     setFormData((prev) => ({
  //       ...prev,
  //       cabinSubType: onlyOption.id, // auto-select
  //     }));
  //   }
  // }, [initialOptions.cabinSubTypes]);

  const loadEntranceOptions = async () => {
    if (!formData.liftType) return;

    try {
      const [carTypes, landingTypes] = await Promise.all([
        fetchCarEntranceTypes(formData.liftType, setErrors),
        fetchLandingEntranceSubType(formData.liftType, setErrors),
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
        // carEntrance: "",
        // carEntranceSubType: "",
        // landingEntranceSubType1: "",
        // landingEntranceSubType2: "",
        // landingEntranceCount: Number(prev.openings) || 0,
      }));
    } catch (err) {
      console.error("Error fetching entrance options", err);
    }
  };

  //   const loadOtherMaterialsOld = async () => {
  //     if (!formData.liftType) return; // wait until operatorId is selected

  //     try {
  //       const materials = await fetchOtherMaterialExcludeOthers(formData.liftType, setErrors);

  //       console.log("Fetched Other Materials:", materials);

  //       const noOfStops = parseFloat(formData.stops) || 1;

  //       // ✅ Separate materials based on main type
  //       const defaultMaterials = materials.filter(
  //         (item) =>
  //           item.otherMaterialMainName &&
  //           item.otherMaterialMainName.toLowerCase() === "CommonPrice"
  //       );
  //       console.log(noOfStops,"Fetched CommonPrice:", defaultMaterials);

  //       const operatorMaterials = materials.filter(
  //         (item) =>
  //           item.otherMaterialMainName &&
  //           item.otherMaterialMainName.toLowerCase() === "ManualPrice"
  //       );
  //       console.log("Fetched ManualPrice:", operatorMaterials);

  //       // ✅ Calculate total (sum of quantity × price) - COMMON PRICE
  //       const commonPrice = defaultMaterials.reduce((acc, item) => {
  //         const qty = parseFloat(item.quantity) || 0;
  //         const price = parseFloat(item.price) || 0;
  //         let itemTotal = qty * price; // Default calculation

  //         // 👇 NEW LOGIC: Apply additional multiplier if it's "Magnet SQR Material"
  //         if (item.otherMaterialName && item.otherMaterialName.toLowerCase() === "magnet sqr material") {
  //             itemTotal = itemTotal * noOfStops;
  //         }

  //         return acc + itemTotal;
  //       }, 0);

  //       // ✅ Calculate total (sum of quantity × price) - MANUAL PRICE
  //       const manualPrice = operatorMaterials.reduce((acc, item) => {
  //         const qty = parseFloat(item.quantity) || 0;
  //         const price = parseFloat(item.price) || 0;
  //         let itemTotal = qty * price; // Default calculation

  //         // 👇 NEW LOGIC: Apply additional multiplier if it's "Magnet SQR Material"
  //         if (item.otherMaterialName && item.otherMaterialName.toLowerCase() === "magnet sqr material") {
  //             itemTotal = itemTotal * noOfStops;
  //         }

  //         return acc + itemTotal;
  //       }, 0);

  //       setManualDetails(operatorMaterials);
  //       setCommonDetails(defaultMaterials);

  //       console.log("🧮 Manual Price (Default):", manualPrice);
  //       console.log("🧮 Common Price (DefaultOperator):", commonPrice);

  //       // ✅ Update form data
  //       setFormData((prev) => ({
  //         ...prev,
  //         manualDetails: operatorMaterials,
  //         commonDetails: defaultMaterials,
  //         manualPrice,
  //         commonPrice,
  //       }));
  //     } catch (err) {
  //       console.error("Error fetching Other Materials (excluding Others)", err);
  //     }
  //   };

  const loadOtherMaterials = useCallback(async () => {
    if (!formData.liftType) return; // wait until operatorId (liftType) is selected

    const liftType = Number(formData.liftType);
    const existingSelectedMaterials = formData.selectedMaterials || [];
    const leadId = formData.leadId;
    const quotLiftDetailId = formData.quotationId;
    const noofStops = Number(formData.stops) || 1;

    try {
      // ✅ Fetch all OtherMaterials (irrespective of operator)
      const res = await axiosInstance.get(`${API_ENDPOINTS.OTHER_MATERIAL}`);
      const materials = res.data || []; // directly returns list
      console.log("Fetched All Other Materials:", materials);

      // ✅ Separate materials based on main type (case-insensitive)
      const commonDetails = materials.filter(
        (item) =>
          item.otherMaterialMainName &&
          item.otherMaterialMainName.toLowerCase() === "commonprice".toLowerCase()
      );

      // ✅ ManualPrice → only include records matching selected operator
      console.log("Operator ID for filtering ManualPrice:", formData.liftType);
      const manualDetails = materials.filter(
        (item) =>
          item.otherMaterialMainName &&
          item.otherMaterialMainName.toLowerCase() === "manualprice".toLowerCase() &&
          item.operatorTypeId === liftType // filter by selected operator
      );

      const otherDetails = materials.filter(
        (item) =>
          item.otherMaterialMainName &&
          item.otherMaterialMainName.toLowerCase() === "others".toLowerCase()
      );

      console.log("Fetched CommonPrice:", commonDetails);
      console.log("Fetched ManualPrice (filtered by operator):", manualDetails);
      console.log("Fetched Others:", otherDetails);


      console.log("noofStops:", noofStops);
      // ✅ Calculate totals
      const calcTotal = (list) =>
        list.reduce((acc, item, index) => {
          const qty = parseFloat(item.quantity) || 0;
          const price = parseFloat(item.price) || 0;
          const itemName = item.otherMaterialName || 'Unknown Material';
          const isMagnetSqr = itemName.toLowerCase() === "magnet sqr material";

          // console.log(`--- Item ${index + 1}: ${itemName} ---`);
          // console.log(`[Input] Quantity (qty): ${qty}`);
          // console.log(`[Input] Unit Price (price): ${price}`);
          // console.log(`[Input] Accumulator (acc): ${acc.toFixed(2)}`);

          let calculatedPrice = price * qty;

          // Apply special rule here for Magnet SQR Material total calculation
          if (isMagnetSqr) {
            // console.log(`[Debug] Magnet SQR detected. Stops multiplier (noofStops): ${noofStops}`);

            // Re-calculate with the multiplier
            calculatedPrice = price * qty * noofStops;

            // console.log(calculatedPrice.toFixed(2), "---------otherMaterialName--------", itemName.toLowerCase());
          }

          // --- STEP 2: Log calculated price and new accumulator ---
          const newAccumulator = acc + calculatedPrice;
          // console.log(`[Output] Calculated Item Total: ${calculatedPrice.toFixed(2)}`);
          // console.log(`[Output] New Accumulator: ${newAccumulator.toFixed(2)}`);

          return newAccumulator;
        }, 0);
      // const calcTotal = (list) =>
      //   list.reduce((acc, item) => {
      //     const qty = parseFloat(item.quantity) || 0;
      //     const price = parseFloat(item.price) || 0;
      //     // return acc + qty * price;

      //     let calculatedPrice = price * qty;


      //     // Apply special rule here for Magnet SQR Material total calculation
      //     if (item.otherMaterialName?.toLowerCase() === "magnet sqr material") {
      //       calculatedPrice = price * qty * noofStops;
      //       console.log(calculatedPrice, "---------otherMaterialName--------", item.otherMaterialName?.toLowerCase());
      //     }

      //     return acc + calculatedPrice;
      //   }, 0); 

      const commonPrice = calcTotal(commonDetails);
      const manualPrice = calcTotal(manualDetails);
      const otherPrice = calcTotal(otherDetails);

      console.log("🧮 Common Price:", commonPrice);
      console.log("🧮 Manual Price:", manualPrice);
      console.log("🧮 Other Price:", otherPrice);

      // ✅ Update state
      setCommonDetails(commonDetails);
      setManualDetails(manualDetails);
      setOtherDetails(otherDetails);

      // ***************************************************
      const allMaterialsToSave = [
        ...commonDetails,
        ...manualDetails,
        ...otherDetails,
      ];

      // 5. Mapping and ID Persistence
      const finalSelectedMaterials = allMaterialsToSave.map(item => {
        const existingMaterial = existingSelectedMaterials.find(
          (m) => m.materialId === item.id
        );

        const itemPrice = Number(item.price) || 0;
        const itemQuantity = Number(item.quantity) || 0;
        let itemTotalPrize = itemPrice * itemQuantity; // 75 * 4 = 300
        const itemQuantityUnit = item.quantityUnit ? item.quantityUnit : "";
        const finalQunatity = itemQuantity;

        if (item.otherMaterialName?.toLowerCase() === "magnet sqr material") {
            itemTotalPrize = itemPrice * itemQuantity * noofStops;
        }

        return {
          // Use the database ID if it exists, otherwise null for a new insert
          id: existingMaterial?.id || null,
          leadId: leadId,
          quotationLiftDetailId: quotLiftDetailId || null, // to be set later
          materialId: item.id,
          materialName: item.otherMaterialName,
          materialDisplayName: item.otherMaterialDisplayName || item.otherMaterialName || "",
          // materialName: item.otherMaterialName +" / "+ item.otherMaterialDisplayName,
          quantity: finalQunatity,
          quantityUnit: itemQuantityUnit,
          price: itemTotalPrize || 0,
          operatorType: item.operatorTypeId || liftType,
          materialType: item.otherMaterialMainName || "",
        };
      });

      console.log("Final Selected Materials to Save:", finalSelectedMaterials);

      setSelectedMaterials(finalSelectedMaterials);
      // *****************************************************

      // setFormData((prev) => ({
      //   ...prev,
      //   commonDetails,
      //   manualDetails,
      //   otherDetails,
      //   commonPrice,
      //   manualPrice,
      //   otherPrice,
      //   selectedMaterials: finalSelectedMaterials,
      // }));
      setFormData((prev) => {
        // 1. Keep materials NOT managed by loadOtherMaterials (like Guide Rail, Fastener)
        const materialsToPreserve = (prev.selectedMaterials || []).filter(
          (m) => m.materialType?.toLowerCase() !== "commonprice" &&
            m.materialType?.toLowerCase() !== "manualprice" &&
            m.materialType?.toLowerCase() !== "others"
        );

        // 2. Combine preserved items with the new final selected materials (from the fetch)
        const newSelectedMaterials = [
          ...materialsToPreserve,
          ...finalSelectedMaterials,
        ];

        return {
          ...prev,
          commonDetails,
          manualDetails,
          otherDetails,
          commonPrice,
          manualPrice,
          otherPrice,
          // ✅ Use the MERGED list
          selectedMaterials: newSelectedMaterials,
        }
      });
    } catch (err) {
      console.error("Error fetching Other Materials:", err);
    }
  }, [setFormData, setSelectedMaterials]);



  // 🔹 Fetch Car Entrance, Landing Entrance Types when liftType changes
  useEffect(() => {
    loadEntranceOptions();

    // const loadOtherMaterials = async () => {
    //   if (!formData.liftType) return; // wait until operatorId is selected

    //   try {
    //     const materials = await fetchOtherMaterialExcludeOthers(formData.liftType, setErrors);

    //     // ✅ Compute total price (price × quantity for each material)
    //     const totalPrice = materials.reduce((acc, item) => {
    //       const qty = parseFloat(item.quantity) || 0;
    //       const price = parseFloat(item.price) || 0;
    //       return acc + qty * price;
    //     }, 0);

    //     console.log("Fetched Other Materials:", materials);
    //     console.log("🧮 Total Price:", totalPrice);

    //     // Optionally reset dependent fields when operator changes
    //     setFormData(prev => ({
    //       ...prev,
    //       manualPrice: totalPrice, // clear selected material
    //     }));
    //   } catch (err) {
    //     console.error("Error fetching Other Materials (excluding Others)", err);
    //   }
    // };

    loadOtherMaterials();
  }, [formData.liftType]);


  const loadCarEntranceSubTypes = async () => {
    if (!formData.carEntrance) return;

    const subTypes = await fetchCarEntranceSubTypes(formData.carEntrance, setErrors);
    setInitialOptions(prev => ({ ...prev, carEntranceSubTypes: subTypes }));


    if (!isInitialLoad) {
      setFormData(prev => ({ ...prev, carEntranceSubType: "" }));
    }
  };

  // 🔹 Fetch Car Entrance SubTypes when carEntrance changes
  useEffect(() => {
    if (!formData.carEntrance) return;

    loadCarEntranceSubTypes(formData.carEntrance).then((list) => {
      if (!Array.isArray(list)) return; // safety

      // Restore saved value only if exists in loaded list
      if (formData.carEntranceSubType) {
        const exists = list.some(
          (opt) => opt.id === Number(formData.carEntranceSubType)
        );

        if (!exists) {
          setFormData(prev => ({
            ...prev,
            carEntranceSubType: ""
          }));
        }
      }
    });
  }, [formData.carEntrance]);


  useEffect(() => {
    console.log("[useEffect] errors state updated →", errors);
    if (typeof setErrors === "function") {
      // setErrors((prev) => ({ ...prev, [key]: message }));
    } else {
      console.warn("setErrors is not a function at this point!", errors);
    }
  }, [errors]);

  const loadLOPOptions = async () => {
    if (!formData.liftType || !formData.floors) return;

    try {
      // If formData.floors can be multiple, you may loop or pick the first floor
      const floorId = Array.isArray(formData.floors) ? formData.floors[0] : formData.floors;

      const lopSubTypes = await fetchLOP(formData.liftType, floorId, setErrors);

      setInitialOptions(prev => ({
        ...prev,
        lopTypes: lopSubTypes,
      }));

      // Reset dependent LOP fields if needed
      if (!isInitialLoad) {
        setFormData(prev => ({
          ...prev,
          lopType: "",
        }));
      }
    } catch (err) {
      console.error("Error fetching LOP options", err);
    }
  };

  const loadCOPOptions = async () => {
    if (!formData.liftType || !formData.floors) return;

    try {
      // If formData.floors can be multiple, you may loop or pick the first floor
      const floorId = Array.isArray(formData.floors) ? formData.floors[0] : formData.floors;

      const copSubTypes = await fetchCOP(formData.liftType, floorId, setErrors);

      setInitialOptions(prev => ({
        ...prev,
        copTypes: copSubTypes,
      }));

      // Reset dependent LOP fields if needed
      if (!isInitialLoad) {
        setFormData(prev => ({
          ...prev,// reset selected COP
          copTypes: "",
        }));
      }
    } catch (err) {
      console.error("Error fetching COP options", err);
    }
  };

  useEffect(() => {
    const fetchInstallationAmt = async () => {
      if (!formData.floors || !formData.liftType) return;

      const res = await fetchInstallationRule(formData.floors, formData.liftType, setErrors);

      if (res.success && res.data) {
        setFormData((prev) => ({
          ...prev,
          installationAmount: res.data.amount || 0,
          installationAmountRuleId: res.data.id || "",
        }));
        setErrors((prev) => ({ ...prev, installation: "" }));
        // clearError(setErrors, "installation");
      } else {
        // setErrors((prev) => ({ ...prev, installation: res.message || "No installation rule found" }));
        setErrors((prev) => ({ ...prev, installation: res.message || "No installation rule found" }));
        toast.error(res.message || "No installation rule found");
        setFormData((prev) => ({
          ...prev,
          installationAmount: 0,
          installationAmountRuleId: "",
        }));
      }
    };

    fetchInstallationAmt();

    loadLOPOptions();
    loadCOPOptions();
  }, [formData.liftType, formData.floors]);


  const fetchOptions = async (refreshField = null) => {
    try {
      // 🟢 Step 1: Prepare endpoints
      const endpoints = {
        operatorTypes: API_ENDPOINTS.OPERATOR,
        liftTypes: API_ENDPOINTS.TYPE_OF_LIFT,
        capacityTypes: API_ENDPOINTS.CAPACITY_TYPES,
        personOptions: API_ENDPOINTS.PERSON_CAPACITY,
        kgOptions: API_ENDPOINTS.WEIGHTS,
        floors: API_ENDPOINTS.FLOORS,
        speeds: API_ENDPOINTS.SPEED,
        additionalFloors: API_ENDPOINTS.ADDITIONAL_FLOORS,
        lightFittings: API_ENDPOINTS.LIGHT_FITTINGS,
        cabinFlooring: API_ENDPOINTS.CABIN_FLOORING,
        cabinCeiling: API_ENDPOINTS.CABIN_CEILING,
        airType: API_ENDPOINTS.AIR_TYPE,
        wiringHarness: API_ENDPOINTS.HARNESS,
        // guideRail: API_ENDPOINTS.GUIDE_RAIL,
        // bracketTypes: API_ENDPOINTS.BRACKETS,
        // wireRopes: API_ENDPOINTS.WIRE_ROPE,
        manufacturers: API_ENDPOINTS.MANUFACTURER,
        operationType: API_ENDPOINTS.OPERATION_TYPE,
        capaDim: API_ENDPOINTS.CAPACITY_DIMENSIONS,
        features: API_ENDPOINTS.FEATURES,
        warranty: API_ENDPOINTS.WARRANTY,
        // load: API_ENDPOINTS.LOAD,
      };

      // 🟢 Step 2: Handle field-wise refresh (single)
      if (refreshField) {
        const endpoint = endpoints[refreshField];
        if (!endpoint) {
          console.warn(`⚠️ No endpoint mapped for ${refreshField}`);
          return;
        }

        const res = await axiosInstance.get(endpoint);

        // Special handling for manufacturer flattening
        if (refreshField === "manufacturers") {
          const allManufacturers = Object.values(res.data.data || {}).flat();
          setInitialOptions((prev) => ({
            ...prev,
            manufacturers: allManufacturers,
          }));
          return;
        }

        setInitialOptions((prev) => ({
          ...prev,
          [refreshField]: res.data?.data || res.data || [],
        }));

        return;
      }

      // 🟢 Step 3: Fetch all endpoints in parallel
      const results = await Promise.all(
        Object.values(endpoints).map((url) => axiosInstance.get(url))
      );

      // 🟢 Step 4: Extract important references
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
        cabinCeilingRes,
        airRes,
        wiringHarnessRes,
        // guideRailRes,
        // bracketsTypesRes,
        // wireRopeRes,
        manufactureRes,
        operationTypeRes,
        capaDimRes,
        featuresRes,
        warrantyRes,
        // loadRes,
      ] = results;

      // 🟢 Step 5: Recreate your original logic
      const additionalFloors = Array.isArray(additionalRes.data) ? additionalRes.data : [];
      const additionalFloorIds = additionalFloors.map(f => f.id);
      const additionalFloorCodes = additionalFloors.map(f => f.code);

      const labels = {};
      additionalFloors.forEach(f => { labels[f.code] = f.label; });

      const floorsData = Array.isArray(floorsRes.data?.data) ? floorsRes.data.data : [];
      const totalFloorsCount = floorsData.length + additionalFloorCodes.length;

      const allManufacturers = Object.values(manufactureRes.data.data || {}).flat();

      // 🟢 Step 6: Set all in one go
      setInitialOptions((prevOptions) => ({
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
        floorAddOption: additionalFloors,
        floorAddLabels: labels,
        lightFittings: lightFittingsRes.data?.data || [],
        cabinFlooring: cabinFlooringRes.data?.data || [],
        cabinCeiling: cabinCeilingRes.data?.data || [],
        airType: airRes.data?.data || [],
        wiringHarness: wiringHarnessRes.data?.data || [],
        // guideRail: guideRailRes.data || [],
        // bracketTypes: bracketsTypesRes.data?.data || [],
        // wireRopes: wireRopeRes.data || [],
        manufacturers: allManufacturers,
        operationType: operationTypeRes.data || [],
        capaDim: capaDimRes.data || [],
        features: featuresRes.data || [],
        warranty: warrantyRes.data || [],
        // load: loadRes.data || [],
      }));
    } catch (err) {
      console.error("Error fetching options:", err);
      throw err;
    }
  };


  // const fetchOptions = async (refreshField = null) => {
  //   try {
  //     // 🟢 Step 1: Prepare endpoints
  //     const endpoints = {
  //       operatorTypes: API_ENDPOINTS.OPERATOR,
  //       liftTypes: API_ENDPOINTS.TYPE_OF_LIFT,
  //       capacityTypes: API_ENDPOINTS.CAPACITY_TYPES,
  //       personOptions: API_ENDPOINTS.PERSON_CAPACITY,
  //       kgOptions: API_ENDPOINTS.WEIGHTS,
  //       floors: API_ENDPOINTS.FLOORS,
  //       speeds: API_ENDPOINTS.SPEED,
  //       additionalFloors: API_ENDPOINTS.ADDITIONAL_FLOORS,
  //       lightFittings: API_ENDPOINTS.LIGHT_FITTINGS,
  //       cabinFlooring: API_ENDPOINTS.CABIN_FLOORING,
  //       cabinCeiling: API_ENDPOINTS.CABIN_CEILING,
  //       airSystem: API_ENDPOINTS.AIR_TYPE,
  //       wiringHarness: API_ENDPOINTS.HARNESS,
  //       guideRail: API_ENDPOINTS.GUIDE_RAIL,
  //       bracketTypes: API_ENDPOINTS.BRACKETS,
  //       wireRopes: API_ENDPOINTS.WIRE_ROPE,
  //       manufacturers: API_ENDPOINTS.MANUFACTURER,
  //       operationType: API_ENDPOINTS.OPERATION_TYPE,
  //       capaDim: API_ENDPOINTS.CAPACITY_DIMENSIONS,
  //       features: API_ENDPOINTS.FEATURES,
  //       warranty: API_ENDPOINTS.WARRANTY,
  //     };

  //     // 🟢 Step 2: If refreshField provided → fetch only that
  //     if (refreshField) {
  //       const endpoint = endpoints[refreshField];
  //       if (!endpoint) {
  //         console.warn(`⚠️ No endpoint mapped for ${refreshField}`);
  //         return;
  //       }

  //       const res = await axiosInstance.get(endpoint);
  //       setInitialOptions((prev) => ({
  //         ...prev,
  //         [refreshField]: res.data?.data || res.data || [],
  //       }));
  //       return;
  //     }

  //     // 🟢 Step 3: If no refreshField → fetch all
  //     const results = await Promise.all(
  //       Object.values(endpoints).map((url) => axiosInstance.get(url))
  //     );

  //     // 🟢 Step 4: Map results back to keys
  //     const newOptions = {};
  //     Object.keys(endpoints).forEach((key, index) => {
  //       newOptions[key] = results[index].data?.data || results[index].data || [];
  //     });

  //     setInitialOptions((prev) => ({
  //       ...prev,
  //       ...newOptions,
  //     }));
  //   } catch (err) {
  //     console.error("Error fetching options:", err);
  //     throw err;
  //   }
  // };

  const loadLoad = async (setFormData, setErrors) => {
    const loadAmount = await fetchLoads(setErrors);

    if (loadAmount !== null && !isNaN(loadAmount)) {
      setFormData((prev) => ({
        ...prev,
        loadPerAmt: loadAmount,
      }));

      return loadAmount; // ✅ Return for further use if needed
    }

    return null; // If failed
  };

  useEffect(() => {
    const init = async () => {
      await fetchOptions();
      await loadLoad(setFormData, setErrors);
    };

    init(); // Call the async function
  }, []);


  // useEffect(() => {
  //   fetchOptions();
  //   const loadAmount = fetchLoads();
  //   alert(loadAmount);
  //   setInitialOptions(prev => ({
  //       ...prev,
  //       loadPerAmt: loadAmount,
  //     }));
  //   // expose for global refresh use
  //   // window.fetchOptions = fetchOptions;
  // }, []);



  // useEffect(() => {
  //   const fetchOptions = async () => {
  //     try {
  //       const [
  //         operatorRes,
  //         liftTypesRes,
  //         capacityTypeRes,
  //         personsRes,
  //         weightRes,
  //         floorsRes,
  //         speedRes,
  //         additionalRes,
  //         lightFittingsRes,
  //         cabinFlooringRes,
  //         cabinCelingRes,
  //         airRes,
  //         //airSystemPriceRes,
  //         //carDoorTypesRes,
  //         //carDoorSubTypesRes,
  //         //landingDoorTypesRes,
  //         //landingDoorSubTypesRes,
  //         //controlPanelTypesRes,
  //         wiringHarnessRes,
  //         guideRailRes,
  //         bracketsTypesRes,
  //         wireRopeRes,
  //         //lopTypeRes,
  //         //copTypeRes,
  //         manufactureRes,
  //         operationTypeRes,
  //         capaDimRes,
  //         featuresRes,
  //         warrantyRes,
  //       ] = await Promise.all([
  //         axiosInstance.get(API_ENDPOINTS.OPERATOR),
  //         axiosInstance.get(API_ENDPOINTS.TYPE_OF_LIFT),
  //         axiosInstance.get(API_ENDPOINTS.CAPACITY_TYPES),
  //         axiosInstance.get(API_ENDPOINTS.PERSON_CAPACITY),
  //         axiosInstance.get(API_ENDPOINTS.WEIGHTS),
  //         axiosInstance.get(API_ENDPOINTS.FLOORS),
  //         axiosInstance.get(API_ENDPOINTS.SPEED),
  //         axiosInstance.get(API_ENDPOINTS.ADDITIONAL_FLOORS),
  //         axiosInstance.get(API_ENDPOINTS.LIGHT_FITTINGS),
  //         axiosInstance.get(API_ENDPOINTS.CABIN_FLOORING),
  //         axiosInstance.get(API_ENDPOINTS.CABIN_CEILING),
  //         axiosInstance.get(API_ENDPOINTS.AIR_TYPE),
  //         //axiosInstance.get(API_ENDPOINTS.AIR_SYSTEM),
  //         //axiosInstance.get(API_ENDPOINTS.CAR_DOOR_TYPE),
  //         //axiosInstance.get(API_ENDPOINTS.CAR_DOOR_SUBTYPE),
  //         //axiosInstance.get(API_ENDPOINTS.LANDING_DOOR_TYPE),

  //         //axiosInstance.get(API_ENDPOINTS.CONTROL_PANEL),
  //         axiosInstance.get(API_ENDPOINTS.HARNESS),
  //         axiosInstance.get(API_ENDPOINTS.GUIDE_RAIL),
  //         axiosInstance.get(API_ENDPOINTS.BRACKETS),
  //         axiosInstance.get(API_ENDPOINTS.WIRE_ROPE),
  //         //axiosInstance.get(API_ENDPOINTS.LOP_SUBTYPE),
  //         //axiosInstance.get(API_ENDPOINTS.COP_TYPE),
  //         axiosInstance.get(API_ENDPOINTS.MANUFACTURER),
  //         axiosInstance.get(API_ENDPOINTS.OPERATION_TYPE),
  //         axiosInstance.get(API_ENDPOINTS.CAPACITY_DIMENSIONS),

  //         axiosInstance.get(API_ENDPOINTS.FEATURES),
  //         axiosInstance.get(API_ENDPOINTS.WARRANTY),
  //       ]);

  //       const additionalFloors = Array.isArray(additionalRes.data) ? additionalRes.data : [];

  //       const additionalFloorIds = additionalFloors.map(f => f.id);
  //       const additionalFloorCodes = additionalFloors.map(f => f.code);
  //       console.log("additionalFloorCodes", additionalFloorCodes);
  //       console.log("additionalFloors", additionalFloors);
  //       console.log("additionalRes", additionalRes);

  //       const labels = {};
  //       additionalFloors.forEach(f => { labels[f.code] = f.label; });

  //       const floorsData = Array.isArray(floorsRes.data?.data) ? floorsRes.data.data : [];
  //       const totalFloorsCount = floorsData.length + additionalFloorCodes.length;

  //       const allManufacturers = Object.values(manufactureRes.data.data || {}).flat();

  //       //console.log(allManufacturers, "=====allManufacturers=======", warrantyRes.data, "in resoooooooooooo====", featuresRes.data);

  //       setInitialOptions(prevOptions => ({
  //         ...prevOptions,
  //         personOptions: personsRes.data?.data || [],
  //         kgOptions: weightRes.data?.data || [],
  //         capacityTypes: capacityTypeRes.data?.data || [],
  //         liftTypes: liftTypesRes.data?.data || [],
  //         operatorTypes: operatorRes.data?.data || [],
  //         floors: floorsData,
  //         floorOptions: Array.from({ length: floorsData.length }, (_, i) => i + 1),
  //         stopsOptions: totalFloorsCount > 1 ? Array.from({ length: totalFloorsCount }, (_, i) => i + 1) : [1],
  //         openingOptions: Array.from({ length: 2 * totalFloorsCount }, (_, i) => i + 1),
  //         speeds: speedRes.data || [],
  //         floorAddOption: additionalFloors,
  //         floorAddLabels: labels,
  //         //cabinTypes: cabinTypesRes.data.data || [],
  //         lightFittings: lightFittingsRes.data?.data || [],
  //         cabinFlooring: cabinFlooringRes.data?.data || [],
  //         cabinCeiling: cabinCelingRes.data?.data || [],
  //         airSystem: airRes.data?.data || [],
  //         //airSystemPrices: airSystemPriceRes.data?.data || [],
  //         //carEntranceTypes: carDoorTypesRes.data?.data || [],
  //         //carEntranceSubTypes: carDoorSubTypesRes.data?.data || [],
  //         //landingEntrance: landingDoorTypesRes.data?.data || [],
  //         //landingEntranceSubTypes: landingDoorSubTypesRes.data?.data || [],
  //         //controlPanelTypes: controlPanelTypesRes.data?.data || [],
  //         wiringHarness: wiringHarnessRes.data?.data || [],
  //         guideRail: guideRailRes.data || [],
  //         bracketTypes: bracketsTypesRes.data?.data || [],
  //         wireRopes: wireRopeRes.data || [],
  //         //lopTypes: lopTypeRes.data?.data || [],
  //         //copTypes: copTypeRes.data || [],

  //         manufacturers: allManufacturers,
  //         operationType: operationTypeRes.data || [],
  //         capaDim: capaDimRes.data || [],
  //         features: featuresRes.data || [],
  //         warranty: warrantyRes.data || [],
  //       }));
  //     } catch (err) {
  //       console.error("Error fetching options", err);
  //     }
  //   };

  //   fetchOptions();
  // }, []);

  console.log("lift=====>", lift);

  useEffect(() => {
    const loadCapacityDimension = async () => {
      if (formData.capacityType && formData.capacityValue) {
        const dimension = await fetchCapacityDimension(
          formData.capacityType,
          formData.capacityValue,
          setErrors
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
    console.log("selectedMaterials:", formData.selectedMaterials);
  }, [formData]);

  useEffect(() => {
    console.log("✅ Selected Materials Updated:", formData.selectedMaterials);

    // const updatedFastener = formData.selectedMaterials.find(
    //   item => item.materialType?.toLowerCase() === "fastener"
    // );
    // console.log("✅ Updated Fastener Item:", updatedFastener);

    const materialNames = formData.selectedMaterials
      .map(item => item.materialName)
      // Filter out any null, undefined, or empty names just in case
      .filter(name => name);

    // 2. Log the combined list
    console.log(materialNames.length, "✅ Selected Materials Names:", materialNames.join(', '));


    const commonPriceItems = formData.selectedMaterials.filter(
      // Filter items where materialType (case-insensitively) is "common price"
      item => item.materialType?.toLowerCase() === "commonprice"
    );

    // Get the count (length) of the filtered array
    const commonPriceLength = commonPriceItems.length;

    console.log(commonPriceItems, `📏 Length of 'commonPrice' materials: ${commonPriceLength}`);

  }, [formData.selectedMaterials]);


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

    if (!isInitialLoad) {
      setFormData(prev => ({
        ...prev,
        stops: updatedStops,
        openings: updatedOpenings,
        carTravel: updatedCarTravel,
        floorDesignations: updatedFloorDesignations,
        landingEntranceCount: "",
        landingEntranceSubType2: "",
        landingEntranceSubType2_fromFloor: "",
        landingEntranceSubType2_toFloor: "",
        landingEntrancePrice1: 0,
        landingEntrancePrice2: 0,
        guideRail: "",
        guideRailPrice: 0,
      }));
    }
  }, [formData.floors, formData.floorSelections]); // ✅ depend on floors and floorSelections

  // Function to update the materials list with Roping Type (Counter Frame) and Wire Rope
  const updateRopingMaterials = (
    prevSelectedMaterials,
    formData,
    ropingTypePrice,
    wireRopePrice, // Assuming this is the price for the actual rope
    selectedRope, // The object from initialOptions.wireRopes
    counterFrameRopeName
  ) => {
    const updatedMaterials = [...prevSelectedMaterials];

    // --- 1. Roping Type Material (Counter Frame/Mechanism Price) ---
    const ropingMaterialType = "RopingType"; // Use a specific type for the price
    const ropingIndex = updatedMaterials.findIndex(item => item.materialType === ropingMaterialType);

    console.log("================>",selectedRope)
    if (ropingTypePrice > 0 && selectedRope) {
      const newRopingMaterial = {
        id: ropingIndex !== -1 ? updatedMaterials[ropingIndex].id : null,
        leadId: formData.leadId,
        quotationLiftDetailId: formData.quotationId,
        materialId: selectedRope.id,
        materialName: "Mechanism/RopingType", // Differentiate the name
        materialDisplayName: selectedRope.wireRopeTypeName+ " | " +counterFrameRopeName,
        quantity: 1,
        quantityUnit: "Set",
        price: ropingTypePrice,
        operatorType: formData.liftType,
        materialType: ropingMaterialType,
      };

      if (ropingIndex !== -1) {
        updatedMaterials[ropingIndex] = newRopingMaterial;
      } else {
        updatedMaterials.push(newRopingMaterial);
      }
    } else if (ropingIndex !== -1) {
      updatedMaterials.splice(ropingIndex, 1);
    }

    // --- 2. Wire Rope Material (Actual Rope Price) ---
    const wireRopeMaterialType = "WireRope";
    const wireRopeIndex = updatedMaterials.findIndex(item => item.materialType === wireRopeMaterialType);

    // You need the wireRopePrice, which should come from formData or be calculated here.
    // We'll use the passed wireRopePrice (which will be `prev.wireRopePrice` in the final setFormData)

    if (wireRopePrice > 0 && selectedRope) {
      const newWireRopeMaterial = {
        id: wireRopeIndex !== -1 ? updatedMaterials[wireRopeIndex].id : null,
        leadId: formData.leadId,
        quotationLiftDetailId: formData.quotationId,
        materialId: selectedRope.id,
        materialName: "Rope/Wire Roping", // Differentiate the name
        // quantity: formData.floors, // Placeholder for calculated rope quantity
        materialDisplayName: selectedRope.wireRopeTypeName + " | " + selectedRope.wireRopeName,
        quantity: selectedRope.wireRopeQty,
        quantityUnit: "mtrs",
        // price: wireRopePrice * selectedRope.wireRopeQty,
        price: wireRopePrice,
        operatorType: formData.liftType,
        materialType: wireRopeMaterialType,
      };

      if (wireRopeIndex !== -1) {
        updatedMaterials[wireRopeIndex] = newWireRopeMaterial;
      } else {
        updatedMaterials.push(newWireRopeMaterial);
      }
    } else if (wireRopeIndex !== -1) {
      updatedMaterials.splice(wireRopeIndex, 1);
    }

    return updatedMaterials;
  };

  // Reset dependent fields on change
  const handleChangeWithReset = (e) => {
    const { name, value } = e.target;

    // 🔹 Only mark form as interacted if it’s still initial load
    if (isInitialLoad) setIsInitialLoad(false);

    setFormData((prev) => {
      let updated = { ...prev, [name]: value };

      if (name === "capacityType") {
        updated.capacityValue = "";
        // updated.ardPrice = 0;
        updated.ardAmount = 0;
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

    // ✅ CLEAR ERROR MESSAGE when a valid value is selected
    setErrors((prevErrors) => {
      if (!prevErrors[name]) return prevErrors;
      const newErrors = { ...prevErrors };
      delete newErrors[name];
      return newErrors;
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
        formData.typeOfLift,
        setErrors
      ).then((result) => {
        console.log(ropeTypeId, "-----selectedRope-------", selectedRope);
        console.log("-----internalCalculation-------", result);
        const ropingPrice = result.price;
        const counterFrameRopeName = result.name;
        const message = "No price set";

        let newOverloadDeviceValue = formData.overloadDevice; // Default to current value
        if (selectedRope && selectedRope.wireRopeTypeName) {
          const ropingName = selectedRope.wireRopeTypeName;
          if (ropingName.includes("1:1")) {
            newOverloadDeviceValue = 9000;
          } else if (ropingName.includes("2:1")) {
            newOverloadDeviceValue = 13500;
          }
        }

        if (ropingPrice === 0) {
          // Set the error if the price is exactly 0
          setErrors((prev) => ({ ...prev, ropingTypePrice: message }));
          toast.error(message);
        } else {
          // Clear the error on success (if not already cleared by the service)
          setErrors((prev) => {
            const updated = { ...prev };
            delete updated.ropingTypePrice;
            return updated;
          });
        }
        // setFormData((prev) => ({
        //   ...prev,
        //   ropingTypePrice: price,
        // }));

        setFormData((prev) => {
          // Get the Wire Rope price already set by the PriceBelowSelect component 
          // OR the previous value if PriceBelowSelect hasn't updated yet.
          const currentWireRopePrice = prev.wireRopePrice || 0;

          // ✅ CALL THE MATERIAL UPDATE FUNCTION
          const updatedSelectedMaterials = updateRopingMaterials(
            prev.selectedMaterials || [],
            prev, // Pass the previous form data (which includes leadId, quotationId)
            ropingPrice,
            currentWireRopePrice,
            selectedRope,
            counterFrameRopeName
          );

          return {
            ...prev,
            ropingTypePrice: ropingPrice,
            overloadDevice: newOverloadDeviceValue,
            selectedMaterials: updatedSelectedMaterials, // Save the merged list
          };
        });

      });
    }
  };



  const isFieldEmpty = (value) => {
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === "boolean") return false; // ✅ don't treat false as empty
    if (typeof value === "string")
      return value.trim() === "" || value === "Please Select";
    if (typeof value === "object" && value !== null)
      return Object.keys(value).length === 0; // empty object
    return value === undefined || value === null;
  };

  const validate = () => {
    const allFields = Object.values(tabFields).flat();

    // 🔍 Detect missing required fields
    const missing = allFields.filter((field) => {
      const value = formData[field];
      const empty = isFieldEmpty(value);
      if (empty) {
        console.log("Empty field detected:", field, "value:", value);
      }
      return empty;
    });

    // 🟥 Build required field errors
    const requiredErrors = missing.reduce((acc, field) => {
      acc[field] = "This field is required";
      return acc;
    }, {});

    // 🟠 Custom validation errors
    const newErrors = {};

    // Stops ≤ Floors
    if (formData.stops > (formData.floors + formData.floorSelections.length)) {
      newErrors.stops = "No. of Stops cannot be greater than No. of Floors";
    }

    // Openings ≤ 2 × Floors
    if (formData.openings > 2 * (formData.floors + formData.floorSelections.length)) {
      newErrors.openings =
        "No. of Openings cannot exceed [2 × (No. of Floors + Additional Floors(T,B1,B2...))]";
    }

    // Landing Entrance conditional validation
    if (
      formData.landingEntranceCount &&
      Number(formData.landingEntranceCount) !== Number(formData.openings)
    ) {
      if (isFieldEmpty(formData.landingEntranceSubType2)) {
        newErrors.landingEntranceSubType2 =
          "Landing Entrance (Remaining Floor) is required";
      }
      if (isFieldEmpty(formData.landingEntranceSubType2_fromFloor)) {
        newErrors.landingEntranceSubType2_fromFloor = "From Floor is required";
      }
      if (isFieldEmpty(formData.landingEntranceSubType2_toFloor)) {
        newErrors.landingEntranceSubType2_toFloor = "To Floor is required";
      }
      if (
        formData.landingEntranceSubType2_fromFloor &&
        formData.landingEntranceSubType2_toFloor &&
        Number(formData.landingEntranceSubType2_fromFloor) >
        Number(formData.landingEntranceSubType2_toFloor)
      ) {
        newErrors.landingEntranceSubType2_fromFloor =
          "From Floor cannot be greater than To Floor";
      }
    }

    // Car internal width < Shaft width
    if (
      formData.carInternalWidth &&
      formData.shaftWidth &&
      Number(formData.carInternalWidth) >= Number(formData.shaftWidth)
    ) {
      newErrors.carInternalWidth =
        "Car internal width must be less than Shaft width";
    }

    // Car internal depth < Shaft depth
    if (
      formData.carInternalDepth &&
      formData.shaftDepth &&
      Number(formData.carInternalDepth) >= Number(formData.shaftDepth)
    ) {
      newErrors.carInternalDepth =
        "Car internal depth must be less than Shaft depth";
      formData.pitDepth = 1500;
      formData.carInternalHeight = 2100;
      formData.mainSupplySystem =
        "415 Volts, 3 Phase, 50HZ A.C. (By Client)";
      formData.auxlSupplySystem =
        "220/230 Volts, Single Phase 50Hz A.C. (By Client)";
      formData.signals =
        "Alarm Bell, Up/Dn. Direction Indicators at all landings";
    }

    // ✅ Merge both error sets
    const combinedErrors = { ...requiredErrors, ...newErrors };


    // If there are errors
    if (Object.keys(combinedErrors).length > 0) {
      if (Object.keys(combinedErrors).length > 0) {
        setErrors(prevErrors => ({
          ...prevErrors,      // keep previous errors
          ...combinedErrors,  // add/override with new ones
        }));
      }

      for (const [key, value] of Object.entries(errors)) {
        if (!value || value.trim() === "") {
          console.warn("⚠️ Empty error message detected for field:", key, errors);
        }
      }


      // Highlight tabs with errors
      const tabsWithErrors = Object.entries(tabFields)
        .filter(([tabIndex, fields]) =>
          fields.some((field) => combinedErrors[field])
        )
        .map(([tabIndex]) => parseInt(tabIndex));

      setErrorTabs(tabsWithErrors);

      // Different toast messages
      toast.dismiss();
      if (Object.keys(requiredErrors).length > 0 && Object.keys(newErrors).length > 0) {
        toast.error("Please fill all required fields and fix validation errors.");
      } else if (Object.keys(requiredErrors).length > 0) {
        toast.error("Please fill all required fields.");
      } else {
        toast.error("Please fix validation errors.");
      }

      return false;
    }

    // ✅ All good
    setErrors({});
    return true;
  };


  // const validate = () => {
  //   const allFields = Object.values(tabFields).flat();

  //   // const missing = allFields.filter((field) => {
  //   //   const value = formData[field];
  //   //   return Array.isArray(value) ? value.length === 0 : !value;
  //   // });

  //   // const missing = allFields.filter((field) => isFieldEmpty(formData[field]));

  //   const missing = allFields.filter((field) => {
  //     const value = formData[field];
  //     const empty = isFieldEmpty(value);
  //     if (empty) {
  //       console.log("Empty field detected:", field, "value:", value);
  //     }
  //     return empty;
  //   });

  //   if (missing.length > 0) {
  //     setErrors(
  //       missing.reduce((acc, field) => {
  //         acc[field] = "This field is required";
  //         return acc;
  //       }, {})
  //     );
  //     toast.dismiss();
  //     toast.error("Please fill all required fields.");
  //     return false;
  //   }

  //   // 👉 Custom validation rules
  //   const newErrors = {};

  //   // Stops ≤ Floors
  //   if (formData.stops > (formData.floors + formData.floorSelections.length)) {
  //     newErrors.stops = "No. of Stops cannot be greater than No. of Floors";
  //   }

  //   // Openings ≤ 2 × Floors
  //   if (formData.openings > 2 * (formData.floors + formData.floorSelections.length)) {
  //     newErrors.openings = "No. of Openings cannot exceed value of [ 2 × (No. of Floors + Additional Floors(T,B1,B2...)) ]";
  //   }

  //   // ✅ Landing Entrance conditional validation
  //   if (
  //     formData.landingEntranceCount &&
  //     Number(formData.landingEntranceCount) !== Number(formData.openings)
  //   ) {
  //     // If not "ALL" floors → must fill subtype2 and range fields
  //     if (isFieldEmpty(formData.landingEntranceSubType2)) {
  //       newErrors.landingEntranceSubType2 = "Landing Entrance (Remaining Floor) is required";
  //     }

  //     if (isFieldEmpty(formData.landingEntranceSubType2_fromFloor)) {
  //       newErrors.landingEntranceSubType2_fromFloor = "From Floor is required";
  //     }

  //     if (isFieldEmpty(formData.landingEntranceSubType2_toFloor)) {
  //       newErrors.landingEntranceSubType2_toFloor = "To Floor is required";
  //     }

  //     // Validate logical range
  //     if (
  //       formData.landingEntranceSubType2_fromFloor &&
  //       formData.landingEntranceSubType2_toFloor &&
  //       Number(formData.landingEntranceSubType2_fromFloor) >
  //       Number(formData.landingEntranceSubType2_toFloor)
  //     ) {
  //       newErrors.landingEntranceSubType2_fromFloor =
  //         "From Floor cannot be greater than To Floor";
  //     }
  //   }


  //   // ✅ Car internal width < Shaft width
  //   if (
  //     formData.carInternalWidth &&
  //     formData.shaftWidth &&
  //     Number(formData.carInternalWidth) >= Number(formData.shaftWidth)
  //   ) {
  //     newErrors.carInternalWidth =
  //       "Car internal width must be less than Shaft width";
  //   }

  //   // ✅ Car internal depth < Shaft depth
  //   if (
  //     formData.carInternalDepth &&
  //     formData.shaftDepth &&
  //     Number(formData.carInternalDepth) >= Number(formData.shaftDepth)
  //   ) {
  //     newErrors.carInternalDepth =
  //       "Car internal depth must be less than Shaft depth";
  //     formData.pitDepth = 1500;
  //     formData.carInternalHeight = 2100;
  //     formData.mainSupplySystem = "415 Volts, 3 Phase, 50HZ A.C. (By Client)";
  //     formData.auxlSupplySystem = "220/230 Volts, Single Phase 50Hz A.C. (By Client)";
  //     formData.signals = "Alarm Bell, Up/Dn. Direction Indicators at all landings";
  //   }

  //   if (Object.keys(newErrors).length > 0) {
  //     console.log(newErrors);
  //     setErrors(newErrors);

  //     // ✅ Determine which tabs have at least one error
  //     const tabsWithErrors = Object.entries(tabFields)
  //       .filter(([tabIndex, fields]) =>
  //         fields.some((field) => newErrors[field])
  //       )
  //       .map(([tabIndex]) => parseInt(tabIndex));

  //     setErrorTabs(tabsWithErrors); // ✅ updates which tabs show red dot


  //     toast.dismiss();
  //     toast.error("Please fix validation errors.");
  //     return false;
  //   }

  //   setErrors({});
  //   return true;
  // };

  useEffect(() => {
    const tabsWithErrors = Object.entries(tabFields)
      .filter(([tabIndex, fields]) =>
        fields.some((field) => errors[field])
      )
      .map(([tabIndex]) => parseInt(tabIndex));

    setErrorTabs(tabsWithErrors);
  }, [errors, formData]);

  const incompleteTabs = useMemo(() => {
    return Object.entries(tabFields)
      .filter(([tabIndex, fields]) =>
        fields.some((field) => isFieldEmpty(formData[field]))
      )
      .map(([tabIndex]) => parseInt(tabIndex));
  }, [formData]);

  // const handleSave = () => {
  //   const isValid = validate();
  //   if (!isValid) return;

  //   const formattedDate = new Date(quotationDate).toISOString().split("T")[0];

  //   const finalData = {
  //     ...formData,
  //     enqDate: formattedDate, // ✅ add this
  //   };

  //   console.log("=====before save=========>", finalData);

  //   onSave(lift.enquiryId, finalData, isValid, tabFields, initialOptions);
  // };


  const handleSave = () => {
    const isValid = validate();
    if (!isValid) return;

    // onSave(lift.enquiryId, { ...formData, ...calculations }, true, {}); // Pass all data including calculations
    console.log(formData, "=====before save in handlesave=========>", lift);
    // onSave(lift.enquiryId, formData, isValid, tabFields, initialOptions);
    onSave(lift.enquiryId, formData, isValid, tabFields, initialOptions);
  };

  const handleCheckboxChange = () => {
    console.log("================>");
  };

  const handleFeatureChange = (id) => {
    setFormData((prev) => {
      const alreadySelected = prev.stdFeatures.includes(id);
      return {
        ...prev,
        stdFeatures: alreadySelected
          ? prev.stdFeatures.filter((fid) => fid !== id) // remove if unchecked
          : [...prev.stdFeatures, id], // add if checked
      };
    });
  };


  // ------------------------ helper function to populate dropdown of makes or manufactures-----------------------------------

  const getComponentData = (manufacturers, componentNameToSearch, fallbackLabel = "") => {
    const filtered = manufacturers.filter((m) => m.componentName === componentNameToSearch);
    const componentName = filtered[0]?.componentName || fallbackLabel;
    return { componentName, data: filtered };
  };

  const { componentName: vfdLabel, data: vfdManufacturers } = getComponentData(
    initialOptions.manufacturers,
    "VFD - Main Drive",
    "VFD - Main Drive" // fallback if not found
  );

  const { componentName: doorOperatorLabel, data: doorOperatorManufacturers } = getComponentData(
    initialOptions.manufacturers,
    "Door Operator",
    "Door Operator" // fallback if not found
  );

  const { componentName: mainMachineSetLabel, data: mainMachineSetManufacturers } = getComponentData(
    initialOptions.manufacturers,
    "Main Machine Set",
    "Main Machine Set" // fallback if not found
  );

  const { componentName: carRailsLabel, data: carRailsManufacturers } = getComponentData(
    initialOptions.manufacturers,
    "Car Rails",
    "Car Rails" // fallback if not found
  );

  const { componentName: counterWeightRailsLabel, data: counterWeightRailsManufacturers } = getComponentData(
    initialOptions.manufacturers,
    "Counter Weight Rails",
    "Counter Weight Rails" // fallback if not found
  );

  const { componentName: wireRopeLabel, data: wireRopeManufacturers } = getComponentData(
    initialOptions.manufacturers,
    "Wire Rope",
    "Wire Rope" // fallback if not found
  );


  // const getComponentData = (manufacturers, componentId, fallbackLabel = "") => {
  //   const filtered = manufacturers.filter((m) => m.componentId === componentId);
  //   const componentName = filtered[0]?.componentName || fallbackLabel;
  //   return { componentName, data: filtered };
  // };

  // const { componentName: vfdLabel, data: vfdManufacturers } = getComponentData(
  //   initialOptions.manufacturers,
  //   4,
  //   "VFD - Main Drive" // fallback if not found
  // );

  // const { componentName: doorOperatorLabel, data: doorOperatorManufacturers } = getComponentData(
  //   initialOptions.manufacturers,
  //   12,
  //   "Door Operator" // fallback if not found
  // );

  // const { componentName: mainMachineSetLabel, data: mainMachineSetManufacturers } = getComponentData(
  //   initialOptions.manufacturers,
  //   5,
  //   "Main Machine Set" // fallback if not found
  // );

  // const { componentName: carRailsLabel, data: carRailsManufacturers } = getComponentData(
  //   initialOptions.manufacturers,
  //   6,
  //   "Car Rails" // fallback if not found
  // );

  // const { componentName: counterWeightRailsLabel, data: counterWeightRailsManufacturers } = getComponentData(
  //   initialOptions.manufacturers,
  //   7,
  //   "Counter Weight Rails" // fallback if not found
  // );

  // const { componentName: wireRopeLabel, data: wireRopeManufacturers } = getComponentData(
  //   initialOptions.manufacturers,
  //   8,
  //   "Wire Rope" // fallback if not found
  // );
  //------------------------------------------------------------------

  // const normalizeValue = (val) => {
  //   if (val === undefined || val === null || val === "") return "";
  //   // if number in string format, keep numeric but compatible with string comparison
  //   const num = Number(val);
  //   return Number.isNaN(num) ? val : num; // returns number if valid number, else original string
  // };


  // useEffect(() => {
  //   if (!lift?.data) return;

  //   const dropdownFields = [
  //     "airSystem",
  //     "carEntrance",
  //     "carEntranceSubType",
  //     "landingEntranceSubType1",
  //     "landingEntranceSubType2",
  //     "landingEntranceCount",
  //     "landingEntranceSubType2_fromFloor",
  //     "landingEntranceSubType2_toFloor"
  //   ];

  //   const updated = { ...formData };
  //   dropdownFields.forEach((field) => {
  //     updated[field] = normalizeValue(lift.data?.[field]);
  //   });

  //   setFormData((prev) => ({ ...prev, ...updated }));
  // }, [lift]);

  // Find the selected Roping Type object to get its display name

  const selectedRopingType = initialOptions.wireRopes.find(
    (opt) => String(opt.id) === String(formData.ropingType)
  );

  // Determine the Capacity/Weight display name
  const capacityDisplayName =
    formData.capacityType === 1
      ? initialOptions.personOptions?.find(
        (opt) => opt.id === Number(formData.capacityValue)
      )?.displayName || "N/A"
      : initialOptions.kgOptions?.find(
        (opt) => opt.id === Number(formData.capacityValue)
      )?.weightFull || "N/A";

  // Construct the final contextual message
  const ropingContextMessage = `Price for ${capacityDisplayName} - ${selectedRopingType?.wireRopeTypeName || 'Rope Type'}`;


  return (
    // <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
    //   <div className="bg-white w-[90%] max-w-5xl h-[90vh] rounded-lg shadow-lg flex flex-col">
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white p-4 rounded shadow-xl border w-[90%] max-w-7xl h-[94vh] shadow-2xl rounded-2xl border border-blue-100 flex flex-col">

        {/* <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-7xl bg-gradient-to-br from-white to-blue-50 shadow-2xl rounded-2xl border border-blue-100 overflow-hidden flex flex-col h-[94vh]"></div> */}

        {/* Modal Header (fixed) */}
        <div className="sticky top-0 z-20 bg-gradient-to-r from-blue-500 to-blue-600 shadow-md">
          {/* Header Section */}
          <div className="flex items-center justify-between px-6 py-3 text-white">
            {/* Title */}
            <h2 className="text-2xl font-bold tracking-wide flex items-center gap-2">
              🚀 Lift Quotation
            </h2>

            {/* Floor Legend */}
            <div className="flex flex-wrap justify-end text-xs gap-3 bg-white/10 px-3 py-1 rounded-lg backdrop-blur-sm">
              {initialOptions.floorAddOption.map((floor) => (
                <span key={floor.id} className="whitespace-nowrap">
                  <span className="font-semibold">{floor.code}</span> = {floor.label}
                </span>
              ))}
            </div>
          </div>

          {/* Tab Section */}
          <div className="bg-gray-50 border-b flex items-end px-3 overflow-x-auto scrollbar-hide">

            {tabLabels.map((label, index) => {
              const isActive = activeTab === index;
              const isIncomplete = incompleteTabs.includes(index);
              const hasError = errorTabs.includes(index);

              return (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`relative flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all duration-200 border-b-2
          ${isActive
                      ? "text-blue-600 border-blue-600 bg-white rounded-t-md shadow-sm"
                      : "text-gray-500 border-transparent hover:text-blue-600 hover:bg-gray-100"
                    }`}
                >
                  {/* Red Dot Indicator for Error */}
                  {hasError && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  )}

                  {/* Label */}
                  <span className="flex items-center gap-1">
                    {label}
                    {isIncomplete && <span className="text-red-500 text-xs">⚠️</span>}
                  </span>
                </button>
              );
            })}
          </div>
        </div>


        {/* Scrollable Tab Content */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-4 gap-x-4 gap-y-4 px-6 bg-white border border-gray-200 shadow-xl p-2 transition-all duration-300">
          {activeTab === 0 && (
            <>
              <h4 className="text-lg font-semibold text-gray-700 flex items-center gap-2 col-span-4">
                <span className="w-1.5 h-5 bg-blue-500 rounded-sm"></span>
                Basic Specification
              </h4>

              <div className="relative flex flex-col">
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
                <button
                  type="button"
                  onClick={() => handleRefresh(
                    "Lift Operator Type",
                    "operatorTypes",
                    fetchOptions,
                    setFormData,
                    ["liftType"]
                  )}
                  className="absolute right-1 top-[65px] text-blue-600 hover:text-blue-800 transition-colors"
                  title="Refresh Lift Operator Type"
                >
                  <RefreshCcw className="w-4 h-4" />
                </button>
              </div>

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
                <div className="relative flex flex-col">
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
                  <button
                    type="button"
                    onClick={() => handleRefresh(
                      "Person Capacity",
                      "personOptions",
                      fetchOptions,
                      setFormData,
                      ["capacityValue"]
                    )}
                    className="absolute right-1 top-[65px] text-blue-600 hover:text-blue-800 transition-colors"
                    title="Refresh Person Capacity"
                  >
                    <RefreshCcw className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="relative flex flex-col">
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
                  <button
                    type="button"
                    onClick={() => handleRefresh(
                      "Weight Capacity",
                      "kgOptions",
                      fetchOptions,
                      setFormData,
                      ["capacityValue"]
                    )}
                    className="absolute right-1 top-[65px] text-blue-600 hover:text-blue-800 transition-colors"
                    title="Refresh Weight Capacity"
                  >
                    <RefreshCcw className="w-4 h-4" />
                  </button>
                </div>
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

              <div className="relative flex flex-col">
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
                  {/* {initialOptions.floors.map((opt, index) => (
                  <option key={opt.id} value={index + 1}>
                    {index + 1}
                  </option>
                ))} */}
                  {initialOptions.floors.map((opt, index) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.id}
                    </option>
                  ))}
                </Select>
                <button
                  type="button"
                  onClick={() => handleRefresh(
                    "Floors",
                    "floors",
                    fetchOptions,
                    setFormData,
                    ["floors"]
                  )}
                  className="absolute right-1 top-[65px] text-blue-600 hover:text-blue-800 transition-colors"
                  title="Refresh floors"
                >
                  <RefreshCcw className="w-4 h-4" />
                </button>
              </div>


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
                      key={floor.id}
                      className="text-gray-700 text-sm flex items-center gap-1"
                    >
                      <input
                        type="checkbox"
                        // value={floor}
                        checked={formData.floorSelections?.includes(floor.id) || false}
                        onChange={() => handleCheckbox(floor.id)}
                        className="accent-blue-500"
                      />
                      {floor.code}
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

              <div className="relative flex flex-col">
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
                <button
                  type="button"
                  onClick={() => handleRefresh(
                    "Speeds",
                    "speeds",
                    fetchOptions,
                    setFormData,
                    ["speed"]
                  )}
                  className="absolute right-1 top-[65px] text-blue-600 hover:text-blue-800 transition-colors"
                  title="Refresh Speed"
                >
                  <RefreshCcw className="w-4 h-4" />
                </button>
              </div>

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
                <button
                  type="button"
                  onClick={() => handleRefresh(
                    "Cabin SubType",
                    null,
                    loadCabinSubTypes,
                    setFormData,
                    ["cabinSubType", "cabinPrice"]
                  )}
                  className="absolute right-1 top-[65px] text-blue-600 hover:text-blue-800 transition-colors"
                  title="Refresh Cabin SubType"
                >
                  <RefreshCcw className="w-4 h-4" />
                </button>
                {/* Price below dropdown */}
                <PriceBelowSelect
                  options={initialOptions.cabinSubTypes}
                  formValue={formData.cabinSubType}
                  color={tabColors[activeTab]}
                  setPrice="cabinPrice"

                  //add key in selectedMaterialKeys
                  setName="cabinName"//formData. (name from formData)
                  nameKey="cabinSubName"// key from dropdown used
                  itemMainName="Cabin SubType"//name saved for materialType in selectedMaterial 
                  itemUnit="Unit"

                  lead_id={formData.leadId}   // Pass leadId explicitly
                  lift={formData.liftType}

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
                <button
                  type="button"
                  onClick={() => handleRefresh(
                    "Light Fitting",
                    "lightFittings",
                    fetchOptions,
                    setFormData,
                    ["lightFitting", "lightFittingPrice"]
                  )}
                  className="absolute right-1 top-[65px] text-blue-600 hover:text-blue-800 transition-colors"
                  title="Refresh Light Fitting"
                >
                  <RefreshCcw className="w-4 h-4" />
                </button>
                <PriceBelowSelect
                  options={initialOptions.lightFittings}
                  formValue={formData.lightFitting}
                  setPrice="lightFittingPrice"
                  lead_id={formData.leadId}
                  lift={formData.liftType}
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
                <button
                  type="button"
                  onClick={() => handleRefresh(
                    "Cabin Flooring",
                    "cabinFlooring",//from endpoints of fetchOptions
                    fetchOptions,
                    setFormData,
                    ["cabinFlooring", "cabinFlooringPrice"]//formData fields to reset
                  )}
                  className="absolute right-1 top-[65px] text-blue-600 hover:text-blue-800 transition-colors"
                  title="Refresh Cabin Flooring"
                >
                  <RefreshCcw className="w-4 h-4" />
                </button>
                <PriceBelowSelect
                  options={initialOptions.cabinFlooring}
                  formValue={formData.cabinFlooring}
                  setPrice="cabinFlooringPrice"

                  setName="cabinFlooringName"
                  nameKey="flooringName"// key from dropdown used
                  itemMainName="Cabin Flooring"
                  lead_id={formData.leadId}
                  lift={formData.liftType}

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
                <button
                  type="button"
                  onClick={() => handleRefresh(
                    "Cabin Ceiling",
                    "cabinCeiling",//from endpoints of fetchOptions
                    fetchOptions,
                    setFormData,
                    ["cabinCeiling", "cabinCeilingPrice"]//formData fields to reset
                  )}
                  className="absolute right-1 top-[65px] text-blue-600 hover:text-blue-800 transition-colors"
                  title="Refresh Cabin Ceiling"
                >
                  <RefreshCcw className="w-4 h-4" />
                </button>
                <PriceBelowSelect
                  id="ceilingId"
                  options={initialOptions.cabinCeiling}
                  formValue={formData.cabinCeiling}
                  setPrice="cabinCeilingPrice"

                  setName="cabinCeilingName"//formData. (name from formData)
                  nameKey="ceilingName"// key from dropdown used
                  itemMainName="Cabin Ceiling"//name saved for materialType in selectedMaterial 
                  lead_id={formData.leadId}
                  lift={formData.liftType}

                  setFormData={setFormData}
                  formData={formData}
                  color={tabColors[activeTab]}
                />
              </div>

              <div className="relative flex flex-col">
                <Select
                  label={getLabel("airType", "Air Type ")}
                  required
                  name="airType"
                  value={formData.airType}
                  onChange={handleChange}
                  error={errors.airType}
                >
                  <option key="" value="">
                    Please Select
                  </option>
                  {initialOptions.airType.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name}
                    </option>
                  ))}
                </Select>

                <button
                  type="button"
                  onClick={() => handleRefresh(
                    "Air Type",
                    "airType",//from endpoints of fetchOptions
                    fetchOptions,
                    setFormData,
                    ["airType", "airSystem", "airSystemPrice"]//formData fields to reset
                  )}
                  className="absolute right-1 top-[65px] text-blue-600 hover:text-blue-800 transition-colors"
                  title="Refresh Air System"
                >
                  <RefreshCcw className="w-4 h-4" />
                </button>
                {formData.airType && formData.capacityType && formData.capacityValue && (
                  <PriceBelowSelect
                    options={initialOptions.airType}
                    formValue={formData.airType}
                    setPrice="airSystemPrice"
                    itemMainName="Air System"
                    setFormData={setFormData}
                    formData={formData}
                    lead_id={formData.leadId}
                    lift={formData.liftType}

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


              <div className="relative flex flex-col">
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
                    <option key={opt.id} value={String(opt.id)}>
                      {opt.carDoorType}
                    </option>
                  ))}
                </Select>
                <button
                  type="button"
                  onClick={() => handleRefresh(
                    "Car Entrance",
                    null,
                    loadEntranceOptions,
                    setFormData,
                    ["carEntrance", "carEntranceSubType"]
                  )}
                  className="absolute right-1 top-[65px] text-blue-600 hover:text-blue-800 transition-colors"
                  title="Refresh Car Entrance"
                >
                  <RefreshCcw className="w-4 h-4" />
                </button>
                <PriceBelowSelect
                  options={initialOptions.carEntranceTypes}
                  formValue={formData.carEntrance}
                  color={tabColors[activeTab]}

                  // --- Crucial Props for Material Tracking ---
                  setPrice="carEntranceTypePrice" // Dummy price key (not the actual price key)
                  setName="carEntranceTypeName" // Name tracker
                  nameKey="carDoorType" // Key to pull the name from the option object
                  itemMainName="Car Entrance Type" // MaterialType for the DB object
                  lead_id={formData.leadId}
                  lift={formData.liftType}

                  setFormData={setFormData}
                  formData={formData}

                  // --- Crucial Props for Display Control ---
                  // showPrice={false} // Disable price calculation and display
                />
              </div>

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
                <button
                  type="button"
                  onClick={() => handleRefresh(
                    "Car Entrance Sub Type",
                    null,
                    loadCarEntranceSubTypes,
                    setFormData,
                    ["carEntranceSubType", "carEntrancePrice"]
                  )}
                  className="absolute right-1 top-[65px] text-blue-600 hover:text-blue-800 transition-colors"
                  title="Refresh Car Entrance Sub Type"
                >
                  <RefreshCcw className="w-4 h-4" />
                </button>
                <PriceBelowSelect
                  options={initialOptions.carEntranceSubTypes}
                  formValue={formData.carEntranceSubType}
                  color={tabColors[activeTab]}
                  setPrice="carEntrancePrice"

                  setName="carEntranceSubTypeName"
                  nameKey="carDoorSubType"
                  itemMainName="Car Entrance Sub Type"
                  itemUnit="Unit"
                  lead_id={formData.leadId}
                  lift={formData.liftType}

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


              <div className="relative flex flex-col">
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
                <button
                  type="button"
                  onClick={() => handleRefresh(
                    "Landing Entrance",
                    null,
                    loadEntranceOptions,
                    setFormData,
                    ["landingEntranceSubType1", "landingEntranceCount"]
                  )}
                  className="absolute right-1 top-[65px] text-blue-600 hover:text-blue-800 transition-colors"
                  title="Refresh Landing Entrance"
                >
                  <RefreshCcw className="w-4 h-4" />
                </button>
              </div>

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

                  setName="landingEntranceSubType1Name" // Field to store the name
                  // nameKey={["landingDoorTypeName", "name"]}
                  itemMainName="Landing Entrance 1"     // MaterialType name for newMaterial object
                  // ✅ Set the unit
                  itemUnit="Opening"
                  lead_id={formData.leadId}
                  lift={formData.liftType}

                  setFormData={setFormData}
                  formData={formData} // 👈 pass full formData so we can use openings & count
                  label="Price for Landing Door "
                />
              </div>

              {/* Show second Landing Entrance dropdown only if landingEntranceCount is not ALL */}
              {formData.landingEntranceCount &&
                formData.landingEntranceCount !== "" &&
                Number(formData.landingEntranceCount) !== Number(formData.openings) && (
                  <>
                    <div className="relative flex flex-col">
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
                      <button
                        type="button"
                        onClick={() => handleRefresh(
                          "Landing Entrance (Remaining Floor)",
                          null,
                          loadEntranceOptions,
                          setFormData,
                          [
                            "landingEntranceSubType2",
                            // "landingEntranceSubType2_fromFloor",
                            // "landingEntranceSubType2_toFloor"
                          ]
                        )}
                        className="absolute right-1 top-[65px] text-blue-600 hover:text-blue-800 transition-colors"
                        title="Refresh Landing Entrance (Remaining Floor)"
                      >
                        <RefreshCcw className="w-4 h-4" />
                      </button>
                    </div>

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

                        setName="landingEntranceSubType2Name" // Field to store the name
                        itemMainName="Landing Entrance 2"     // MaterialType name for newMaterial object
                        // ✅ Set the unit
                        itemUnit="Opening"
                        lead_id={formData.leadId}
                        lift={formData.liftType}

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
              <h4 className="text-lg font-semibold text-gray-700 flex items-center gap-2 col-span-4">
                <span className="w-1.5 h-5 bg-blue-500 rounded-sm"></span>
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
                {/* ✅ Refresh icon below */}
                <button
                  type="button"
                  onClick={() => handleRefresh(
                    "Control Panel Type",
                    loadControlPanelTypes,
                    setFormData,
                    ["controlPanelType", "controlPanelTypePrice"]
                  )}
                  className="absolute right-1 top-[65px] text-blue-600 hover:text-blue-800 transition-colors"
                  title="Refresh Control Panel Types"
                >
                  <RefreshCcw className="w-4 h-4" />
                </button>
                <PriceBelowSelect
                  options={initialOptions.controlPanelTypes}
                  formValue={formData.controlPanelType}
                  color={tabColors[activeTab]}
                  // formValueNm=""
                  setPrice="controlPanelTypePrice"
                  setName="controlPanelTypeName"
                  nameKey="controlPanelType"
                  itemMainName="Control Panel Type"
                  lead_id={formData.leadId}
                  lift={formData.liftType}

                  setFormData={setFormData}
                  formData={formData}
                  label={`Price for ${formData.capacityType === 1
                    ? initialOptions.personOptions?.find(opt => opt.id === Number(formData.capacityValue))?.displayName || ""
                    : initialOptions.kgOptions?.find(opt => opt.id === Number(formData.capacityValue))?.weightFull || ""
                    }`}
                />
              </div>

              <div className="relative flex flex-col">
                <Select
                  label={getLabel("controlPanelMake", "Control Panel Make ")}
                  required
                  name="controlPanelMake"
                  value={String(formData.controlPanelMake || "")}
                  onChange={(e) => {
                    const selectedId = Number(e.target.value);
                    const selected = initialOptions.manufacturers.find(
                      (m) => m.id === selectedId
                    );
                    setFormData((prev) => ({
                      ...prev,
                      // controlPanelMake: selected
                      //   ? { id: selected.id, name: selected.name }
                      //   : null,
                      controlPanelMake: selected?.id || "",
                      // Update the flat Name field
                      // controlPanelMakeName: selected?.name || "",
                    }));
                    setErrors((prev) => {
                      if (!prev.controlPanelMake) return prev;
                      const updated = { ...prev };
                      delete updated.controlPanelMake;
                      return updated;
                    });
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
                <button
                  type="button"
                  onClick={() => handleRefresh(
                    "Control Panel Manufacturers",
                    "manufacturers",
                    setFormData,
                    ["controlPanelMake"]
                  )}
                  className="absolute right-1 top-[65px] text-blue-600 hover:text-blue-800 transition-colors"
                  title="Refresh Control Panel Manufacturers"
                >
                  <RefreshCcw className="w-4 h-4" />
                </button>
              </div>

              <div className="relative flex flex-col">
                <Select
                  label={getLabel("wiringHarness", "Wiring Harness ")}
                  required
                  name="wiringHarness"
                  value={String(formData.wiringHarness || "")}
                  onChange={(e) => {
                    const selectedId = Number(e.target.value);
                    const selected = initialOptions.manufacturers.find(
                      (m) => m.id === selectedId
                    );
                    setFormData((prev) => ({
                      ...prev,
                      // wiringHarness: selected
                      //   ? { id: selected.id, name: selected.name }
                      //   : null,
                      wiringHarness: selected?.id || "",
                    }));
                    setErrors((prev) => {
                      if (!prev.wiringHarness) return prev;
                      const updated = { ...prev };
                      delete updated.wiringHarness;
                      return updated;
                    });
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
                <button
                  type="button"
                  onClick={() => handleRefresh(
                    "Wiring Harness",
                    "manufacturers",
                    setFormData,
                    ["wiringHarness"]
                  )}
                  className="absolute right-1 top-[65px] text-blue-600 hover:text-blue-800 transition-colors"
                  title="Refresh Wiring Harness"
                >
                  <RefreshCcw className="w-4 h-4" />
                </button>
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
                  {initialOptions.guideRail.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {decodeHtmlEntities(opt.counterWeightName)}
                    </option>
                  ))}
                </Select>
                {/* ✅ Refresh icon below */}
                <button
                  onClick={() => handleRefresh(
                    "Guide Rail",
                    loadGuideRails,
                    setFormData,
                    ["guideRail", "guideRailPrice"]
                  )}
                  className="absolute right-1 top-[65px] text-blue-600 hover:text-blue-800"
                >
                  <RefreshCcw className="w-4 h-4" />
                </button>
                <PriceBelowSelect
                  options={initialOptions.guideRail}
                  formValue={formData.guideRail}
                  setPrice="guideRailPrice"
                  setName="guideRailName"
                  nameKey="counterWeightName"
                  itemMainName="Guide Rail"
                  lead_id={formData.leadId}
                  lift={formData.liftType}
                  setFormData={setFormData}
                  formData={formData}
                  color={tabColors[activeTab]}
                  label={`Price for ${formData.stops} Stops`}
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


                  {initialOptions.bracketTypes.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.bracketTypeName} [{opt.carBracketSubType}]
                    </option>
                  ))}
                </Select>
                <button
                  onClick={() => handleRefresh(
                    "Bracket Type",
                    loadBracketTypes,
                    setFormData,
                    ["bracketType", "bracketTypePrice"]
                  )}
                  className="absolute right-1 top-[65px] text-blue-600 hover:text-blue-800"
                >
                  <RefreshCcw className="w-4 h-4" />
                </button>
                <PriceBelowSelect
                  options={initialOptions.bracketTypes}
                  formValue={formData.bracketType}
                  setPrice="bracketTypePrice"
                  setName="bracketTypeName"
                  // nameKey="bracketTypeName"
                  nameKey={["bracketTypeName", "carBracketSubType"]}
                  itemMainName="Bracket Type"
                  itemUnit="Set"
                  lead_id={formData.leadId}
                  lift={formData.liftType}
                  setFormData={setFormData}
                  formData={formData}
                  color={tabColors[activeTab]}
                  label={`Price for ${formData.floorDesignations}`}
                />
              </div>

              <div className="relative flex flex-col">
                <Select
                  label={getLabel("ropingType", "Wire Roping Type ")}
                  required
                  name="ropingType"
                  value={formData.ropingType || ""}
                  onChange={handleChangeWithReset}
                  error={errors.ropingType}
                >
                  <option key="" value="">
                    Please Select
                  </option>
                  {formData.capacityType && formData.capacityValue && (
                    initialOptions.wireRopes.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.wireRopeTypeName} [{opt.wireRopeName}]
                      </option>
                    ))

                  )}
                </Select>
                <button
                  onClick={() => handleRefresh(
                    "Roping Type",
                    loadWireRope,
                    setFormData,
                    ["ropingType", "wireRopePrice", "ropingTypePrice"]
                  )}
                  className="absolute right-1 top-[65px] text-blue-600 hover:text-blue-800"
                >
                  <RefreshCcw className="w-4 h-4" />
                </button>
                {formData.capacityType && formData.capacityValue ? (
                  <PriceBelowSelect
                    options={initialOptions.wireRopes}
                    formValue={formData.ropingType}
                    setPrice="wireRopePrice"
                    setFormData={setFormData}
                    lead_id={formData.leadId}
                    lift={formData.liftType}
                    formData={formData}
                    color={tabColors[activeTab]}
                    label={`Wire Rope Price for ${formData.floorDesignations}`}
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
                <button
                  onClick={() => handleRefresh(
                    "Lop Type",
                    loadLOPOptions,
                    setFormData,
                    ["lopType", "lopTypePrice"]
                  )}
                  className="absolute right-1 top-[65px] text-blue-600 hover:text-blue-800"
                >
                  <RefreshCcw className="w-4 h-4" />
                </button>
                <PriceBelowSelect
                  options={initialOptions.lopTypes}
                  formValue={formData.lopType}
                  setPrice="lopTypePrice"

                  setName="lopTypeName"
                  nameKey="name"
                  itemMainName="Lop Type"
                  itemUnit="Set"
                  lead_id={formData.leadId}
                  lift={formData.liftType}


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
                <button
                  onClick={() => handleRefresh(
                    "Cop Type",
                    loadCOPOptions,
                    setFormData,
                    ["copType", "copTypePrice"]
                  )}
                  className="absolute right-1 top-[65px] text-blue-600 hover:text-blue-800"
                >
                  <RefreshCcw className="w-4 h-4" />
                </button>
                <PriceBelowSelect
                  options={initialOptions.copTypes}
                  formValue={formData.copType}
                  setPrice="copTypePrice"

                  setName="copTypeName"
                  nameKey="copName"
                  itemMainName="Cop Type"
                  itemUnit="Unit"
                  lead_id={formData.leadId}
                  lift={formData.liftType}

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

              <div className="relative flex flex-col">
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
                <button
                  type="button"
                  onClick={() => handleRefresh(
                    "Operation Type",
                    "operationType",
                    fetchOptions,
                    setFormData,
                    ["operationType"]
                  )}
                  className="absolute right-1 top-[65px] text-blue-600 hover:text-blue-800 transition-colors"
                  title="Refresh Operation Type"
                >
                  <RefreshCcw className="w-4 h-4" />
                </button>
              </div>

              <Input
                label={getLabel("machineRoomDepth", "Machine Room (Height)")}
                required
                name="machineRoomDepth"
                value={formData.machineRoomDepth}
                onChange={handleChange}
                error={errors.machineRoomDepth}
                disabled={true}
              />

              <Input
                label={getLabel("machineRoomWidth", "Machine Room (Width)")}
                name="machineRoomWidth"
                required
                value={formData.machineRoomWidth}
                onChange={handleChange}
                error={errors.machineRoomWidth}
                disabled={true}
              />

              <Input
                label={getLabel("shaftWidth", "Shaft Width (mm) ")}
                required
                name="shaftWidth"
                value={formData.shaftWidth || ""}
                onChange={handleChange}
                error={errors.shaftWidth}
                disabled={true}
              />

              <Input
                label={getLabel("shaftDepth", "Shaft Depth (mm) ")}
                required
                name="shaftDepth"
                value={formData.shaftDepth}
                onChange={handleChange}
                error={errors.shaftDepth}
                disabled={true}
              />

              <Input
                label={getLabel("carInternalWidth", "CAR internal Width (mm) ")}
                required
                name="carInternalWidth"
                value={formData.carInternalWidth}
                onChange={handleChange}
                error={errors.carInternalWidth}
                disabled={true}
              />

              <Input
                label={getLabel("carInternalDepth", "CAR internal Depth (mm) ")}
                required
                name="carInternalDepth"
                value={formData.carInternalDepth}
                onChange={handleChange}
                error={errors.carInternalDepth}
                disabled={true}
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
                disabled={true}
              />
            </>
          )}

          {activeTab === 2 && (
            <>
              <h4 className="text-lg font-semibold text-gray-700 flex items-center gap-2 col-span-4">
                <span className="w-1.5 h-5 bg-blue-500 rounded-sm"></span>
                Standard Features, Part makers & Payment Terms
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 col-span-4">
                <div className="flex flex-col gap-2">
                  <div className="relative flex items-center mb-2">
                    <h5 className="text-sm font-semibold mr-4  mb-2 tracking-wide leading-relaxed text-gray-900">
                      Standard Features
                    </h5>
                    <button
                      type="button"
                      onClick={() => handleRefresh(
                        "Standard Features",
                        "features",//from endpoints of fetchOptions
                        fetchOptions,
                        setFormData,
                        ["stdFeatures"]//formData fields to reset
                      )}
                      className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
                      title="Refresh Standard Features"
                    >
                      <RefreshCcw className="w-4 h-4" />
                    </button>
                  </div>

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
                          checked={formData.stdFeatures.includes(feature.id)} // ✅ FIXED
                          onChange={() => handleFeatureChange(feature.id)}
                        />
                      );
                    })}


                </div>

                <div className="flex flex-col gap-1">
                  <h5 className="text-sm font-semibold mb-2">
                    Part Makers & Payment Terms
                  </h5>

                  <div className="relative flex flex-col">
                    <Select
                      label={getLabel("vfdMainDrive", vfdLabel)}
                      required
                      name="vfdMainDrive"
                      value={formData.vfdMainDrive || ""}
                      onChange={(e) => {
                        const selectedId = Number(e.target.value);
                        const selected = vfdManufacturers.find((m) => m.id === selectedId);
                        setFormData((prev) => ({
                          ...prev,
                          // vfdMainDrive: selected
                          //   ? { id: selected.id, name: selected.name }
                          //   : null,
                          vfdMainDrive: selected?.id || "",
                          // Update the flat Name field
                          vfdMainDriveName: selected?.name || "",
                        }));
                        setErrors((prev) => {
                          if (!prev.vfdMainDrive) return prev;
                          const updated = { ...prev };
                          delete updated.vfdMainDrive;
                          return updated;
                        });
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
                    <button
                      type="button"
                      onClick={() => handleRefresh(
                        vfdLabel,
                        "manufacturers",//from endpoints of fetchOptions
                        fetchOptions,
                        setFormData,
                        ["vfdMainDrive", "vfdMainDriveName"]//formData fields to reset
                      )}
                      className="absolute right-1 top-[65px] text-blue-600 hover:text-blue-800 transition-colors"
                      title={"Refresh " + vfdLabel}
                    >
                      <RefreshCcw className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="relative flex flex-col">
                    <Select
                      label={getLabel("doorOperator", doorOperatorLabel)}
                      required
                      name="doorOperator"
                      value={formData.doorOperator || ""}
                      onChange={(e) => {
                        const selectedId = Number(e.target.value);
                        const selected = doorOperatorManufacturers.find((m) => m.id === selectedId);
                        setFormData((prev) => ({
                          ...prev,
                          // doorOperator: selected
                          //   ? { id: selected.id, name: selected.name }
                          //   : null,
                          doorOperator: selected?.id || "",
                          doorOperatorName: selected?.name || "",
                        }));
                        setErrors((prev) => {
                          if (!prev.doorOperator) return prev;
                          const updated = { ...prev };
                          delete updated.doorOperator;
                          return updated;
                        });
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
                    <button
                      type="button"
                      onClick={() => handleRefresh(
                        doorOperatorLabel,
                        "manufacturers",//from endpoints of fetchOptions
                        fetchOptions,
                        setFormData,
                        ["doorOperator", "doorOperatorName"]//formData fields to reset
                      )}
                      className="absolute right-1 top-[65px] text-blue-600 hover:text-blue-800 transition-colors"
                      title={"Refresh " + doorOperatorLabel}
                    >
                      <RefreshCcw className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="relative flex flex-col">
                    <Select
                      label={getLabel("mainMachineSet", mainMachineSetLabel)}
                      required
                      name="mainMachineSet"
                      value={formData.mainMachineSet || ""}
                      onChange={(e) => {
                        const selectedId = Number(e.target.value);
                        const selected = mainMachineSetManufacturers.find((m) => m.id === selectedId);
                        setFormData((prev) => ({
                          ...prev,
                          // mainMachineSet: selected
                          //   ? { id: selected.id, name: selected.name }
                          //   : null,
                          mainMachineSet: selected?.id || "",
                          mainMachineSetName: selected?.name || "",
                        }));
                        setErrors((prev) => {
                          if (!prev.mainMachineSet) return prev;
                          const updated = { ...prev };
                          delete updated.mainMachineSet;
                          return updated;
                        });
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
                    <button
                      type="button"
                      onClick={() => handleRefresh(
                        mainMachineSetLabel,
                        "manufacturers",//from endpoints of fetchOptions
                        fetchOptions,
                        setFormData,
                        ["mainMachineSet", "mainMachineSetName"]//formData fields to reset
                      )}
                      className="absolute right-1 top-[65px] text-blue-600 hover:text-blue-800 transition-colors"
                      title={"Refresh " + mainMachineSetLabel}
                    >
                      <RefreshCcw className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="relative flex flex-col">
                    <Select
                      label={getLabel("carRails", carRailsLabel)}
                      required
                      name="carRails"
                      value={formData.carRails || ""}
                      onChange={(e) => {
                        const selectedId = Number(e.target.value);
                        const selected = carRailsManufacturers.find((m) => m.id === selectedId);
                        setFormData((prev) => ({
                          ...prev,
                          // carRails: selected
                          //   ? { id: selected.id, name: selected.name }
                          //   : null,
                          carRails: selected?.id || "",
                          carRailsName: selected?.name || "",
                        }));
                        setErrors((prev) => {
                          if (!prev.carRails) return prev;
                          const updated = { ...prev };
                          delete updated.carRails;
                          return updated;
                        });
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
                    <button
                      type="button"
                      onClick={() => handleRefresh(
                        carRailsLabel,
                        "manufacturers",//from endpoints of fetchOptions
                        fetchOptions,
                        setFormData,
                        ["carRails", "carRailsName"]//formData fields to reset
                      )}
                      className="absolute right-1 top-[65px] text-blue-600 hover:text-blue-800 transition-colors"
                      title={"Refresh " + carRailsLabel}
                    >
                      <RefreshCcw className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="relative flex flex-col">
                    <Select
                      label={getLabel("counterWeightRails", counterWeightRailsLabel)}
                      required
                      name="counterWeightRails"
                      value={formData.counterWeightRails || ""}
                      onChange={(e) => {
                        const selectedId = Number(e.target.value);
                        const selected = counterWeightRailsManufacturers.find((m) => m.id === selectedId);
                        setFormData((prev) => ({
                          ...prev,
                          counterWeightRails: selected?.id || "",
                          counterWeightRailsName: selected?.name || "",
                          // counterWeightRails: selected
                          //   ? { id: selected.id, name: selected.name }
                          //   : null,
                        }));
                        setErrors((prev) => {
                          if (!prev.counterWeightRails) return prev;
                          const updated = { ...prev };
                          delete updated.counterWeightRails;
                          return updated;
                        });
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
                    <button
                      type="button"
                      onClick={() => handleRefresh(
                        counterWeightRailsLabel,
                        "manufacturers",//from endpoints of fetchOptions
                        fetchOptions,
                        setFormData,
                        ["counterWeightRails", "counterWeightRailsName"]//formData fields to reset
                      )}
                      className="absolute right-1 top-[65px] text-blue-600 hover:text-blue-800 transition-colors"
                      title={"Refresh " + counterWeightRailsLabel}
                    >
                      <RefreshCcw className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="relative flex flex-col">
                    <Select
                      label={getLabel("wireRope", wireRopeLabel)}
                      required
                      name="wireRope"
                      value={formData.wireRope || ""}
                      onChange={(e) => {
                        const selectedId = Number(e.target.value);
                        const selected = wireRopeManufacturers.find((m) => m.id === selectedId);
                        setFormData((prev) => ({
                          ...prev,
                          wireRope: selected?.id || "",
                          wireRopeName: selected?.name || "",
                          // wireRope: selected
                          //   ? { id: selected.id, name: selected.name }
                          //   : null,
                        }));
                        setErrors((prev) => {
                          if (!prev.wireRope) return prev;
                          const updated = { ...prev };
                          delete updated.wireRope;
                          return updated;
                        });
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
                    <button
                      type="button"
                      onClick={() => handleRefresh(
                        wireRopeLabel,
                        "manufacturers",//from endpoints of fetchOptions
                        fetchOptions,
                        setFormData,
                        ["wireRope", "wireRopeName"]//formData fields to reset
                      )}
                      className="absolute right-1 top-[65px] text-blue-600 hover:text-blue-800 transition-colors"
                      title={"Refresh " + wireRopeLabel}
                    >
                      <RefreshCcw className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="relative flex flex-col">
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
                    <button
                      type="button"
                      onClick={() => handleRefresh(
                        "Warranty Period",
                        "warranty",//from endpoints of fetchOptions
                        fetchOptions,
                        setFormData,
                        ["warrantyPeriod"]//formData fields to reset
                      )}
                      className="absolute right-1 top-[65px] text-blue-600 hover:text-blue-800 transition-colors"
                      title="Refresh Warranty Period"
                    >
                      <RefreshCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 3 && (
            <>
              <h4 className="text-lg font-semibold text-gray-700 flex items-center gap-2 col-span-4">
                <span className="w-1.5 h-5 bg-blue-500 rounded-sm"></span>
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
                disabled={true}
              />


              <RadioGroup
                label={getLabel(
                  "pwdIncludeExclude",
                  "PWD Including and Excluding"
                )}
                name="pwdIncludeExclude"
                options={includeExcludeOptions}
                selected={formData.pwdIncludeExclude ? includeExcludeOptions[0] : includeExcludeOptions[1]}
                onChange={(e) => {
                  // 1. Convert the selected option string to a boolean (true if "Including")
                  const isIncluding = e.target.value === includeExcludeOptions[0];

                  // 2. Prepare the update for the form data
                  const update = {
                    pwdIncludeExclude: isIncluding,
                  };

                  // 3. Conditional logic: If excluding (isIncluding is false), set pwdAmount to 0
                  if (!isIncluding) {
                    update.pwdAmount = "0"; // Reset value to "0" (as a string for input field)
                  }

                  // 4. Update the form data (using setFormData directly for complex logic)
                  setFormData((prev) => ({
                    ...prev,
                    ...update,
                  }));

                  // Also update errors:
                  setErrors((prev) => {
                    if (!prev.pwdIncludeExclude) return prev;
                    const updated = { ...prev };
                    delete updated.pwdIncludeExclude;
                    if (!isIncluding && updated.pwdAmount) {
                      delete updated.pwdAmount; // Clear pwdAmount error if value is reset
                    }
                    return updated;
                  });
                }}
                error={errors.pwdIncludeExclude}
              />

              <div className="relative flex flex-col">
                <Input
                  label={getLabel("pwdAmount", "PWD (Amount) ")}
                  required={formData.pwdIncludeExclude} // ⭐️ Make 'required' conditional
                  name="pwdAmount"
                  value={formData.pwdAmount}
                  onChange={handleChange}
                  error={errors.pwdAmount}
                  // ⭐️ Add the disabled condition
                  disabled={!formData.pwdIncludeExclude}
                  type="number"
                />
                {!formData.pwdIncludeExclude && (
                  <PriceBelowSelect
                    isOnlyLabel={true}
                    label={`Disabled as PWD:excluded`}
                    color={tabColors[activeTab]}
                  />
                )}
              </div>

              <RadioGroup
                label={getLabel(
                  "scaffoldingIncludeExclude",
                  "Scaffolding Including and Excluding"
                )}
                name="scaffoldingIncludeExclude"
                options={includeExcludeOptions}
                selected={formData.scaffoldingIncludeExclude ? includeExcludeOptions[0] : includeExcludeOptions[1]}
                onChange={(e) => {
                  // 1. Convert the selected option string to a boolean
                  const isIncluding = e.target.value === includeExcludeOptions[0]; // true if "Including"

                  // 2. Prepare the update for the form data
                  const update = {
                    scaffoldingIncludeExclude: isIncluding,
                  };

                  // 3. Conditional logic: If excluding (isIncluding is false), set bambooScaffolding to 0
                  if (!isIncluding) {
                    update.bambooScaffolding = "0"; // Using string "0" for input value
                  }

                  // 4. Update the form data (using setFormData directly for complex logic)
                  setFormData((prev) => ({
                    ...prev,
                    ...update,
                  }));

                  // Also update errors:
                  setErrors((prev) => {
                    if (!prev.scaffoldingIncludeExclude) return prev;
                    const updated = { ...prev };
                    delete updated.scaffoldingIncludeExclude;
                    if (!isIncluding && updated.bambooScaffolding) {
                      delete updated.bambooScaffolding; // Clear bamboo scaffolding error if value is reset
                    }
                    return updated;
                  });

                  // NOTE: If you must use handleChange, you'll need to wrap the logic
                  // into a single call or update handleChange to handle multiple fields.
                  // For this level of coupled logic, using setFormData directly is cleaner.
                }}
                error={errors.scaffoldingIncludeExclude}
              />

              <div className="relative flex flex-col">
                <Input
                  label={getLabel("bambooScaffolding", "Bamboo Scaffolding")}
                  name="bambooScaffolding"
                  value={formData.bambooScaffolding}
                  onChange={handleChange}
                  error={errors.bambooScaffolding}
                  // ⭐️ Add the disabled condition
                  disabled={!formData.scaffoldingIncludeExclude}
                  // ⭐️ If using number input, specify type
                  type="number"
                />
                {!formData.scaffoldingIncludeExclude && (
                  <PriceBelowSelect
                    isOnlyLabel={true}
                    label={`Disabled as Scaffolding :excluded`}
                    color={tabColors[activeTab]}
                  />
                )}
              </div>

              <div className="relative flex flex-col">
                <Input
                  label={
                    (formData.liftType === 1 || formData.liftType === 2)
                      ? getLabel("ardAmount", "ARD (Amount)")
                      : getLabel("ardAmount", "UPS")
                  }
                  name="ardAmount"
                  value={formData.ardAmount}
                  onChange={handleChange}
                  error={errors.ardAmount}
                />
                {/* {formData.ardAmount && formData.capacityType && formData.capacityValue && (
                  <PriceBelowSelect
                    label={`Price for ${formData.capacityType === 1
                      ? initialOptions.personOptions?.find(opt => opt.id === Number(formData.capacityValue))?.displayName || ""
                      : initialOptions.kgOptions?.find(opt => opt.id === Number(formData.capacityValue))?.weightFull || ""
                      }`}
                    color={tabColors[activeTab]}
                    isArdSystem={true}
                    showPrice={false}
                  lead_id={formData.leadId}   
                  lift={formData.liftType}
                  priceVal={formData.ardAmount} // ✅ now updated only when user selects
                  />
                )} */}
              </div>


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

              <div className="relative flex flex-col">
                <Input
                  label={getLabel("installationAmount", "Installation Amount")}
                  name="installationAmount"
                  value={formData.installationAmount}
                  onChange={handleChange}
                  error={errors.installationAmount}
                  disabled={true}
                />
                {formData.installationAmount && formData.capacityType && formData.capacityValue && (
                  <PriceBelowSelect
                    label={`Price for ${formData.floorDesignations}`}
                    color={tabColors[activeTab]}
                    isAirSystem={true}
                    showPrice={false}
                  // priceVal={formData.installationAmount} // ✅ now updated only when user selects
                  />
                )}
              </div>

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
                label={getLabel("tax", "Tax (%)")}
                name="tax"
                value={formData.tax}
                onChange={handleChange}
                error={errors.tax}
              />

              <Input
                label={getLabel("totalAmount", "Total Amount(Without Tax)")}
                name="totalAmountWithoutGst"
                value={formData.totalAmountWithoutGST}
                onChange={handleChange}
                disabled={true}
                error={errors.totalAmountWithoutGST}
              />

              <div className="relative flex flex-col">
                <label className="text-sm font-medium mb-1 text-gray-700">
                  Load Amount (%)
                  <span className="text-red-500">*</span>
                </label>

                {/* Box styled like a Select */}
                <div
                  className="border border-gray-100 rounded-lg px-3 py-2.5 bg-white text-gray-800 
               shadow-sm h-[42px] flex items-center justify-between transition-all"
                >
                  <span className="font-medium">
                    {formData.loadPerAmt !== undefined
                      ? `${formData.loadPerAmt}%`
                      : "—"}
                  </span>
                </div>

                {/* Refresh Button */}
                <button
                  type="button"
                  onClick={async () => {
                    // Optionally show loading / disable button here

                    const newLoad = await loadLoad(setFormData, setErrors);

                    if (newLoad !== null) {
                      const totalIncludingTax = formData.totalAmount || 0;

                      // ✅ Recalculate loadAmt
                      setFormData((prev) => ({
                        ...prev,
                        loadAmt: (totalIncludingTax * newLoad) / 100,
                      }));
                    }
                  }}
                  className="absolute right-1 top-[65px] text-blue-600 hover:text-blue-800 transition-colors"
                  title="Refresh Load Amount"
                >
                  <RefreshCcw className="w-4 h-4" />
                </button>
              </div>

            </>
          )}
        </div>

        {/* Modal Footer (fixed) */}
        <div className="sticky bottom-0 z-20 backdrop-blur-md bg-white/80 border-t shadow-md px-6 py-4 flex flex-wrap justify-between items-center gap-4">

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
            <div className="flex gap-6 text-sm tracking-wide font-medium flex-wrap">
              {tabLabels.map((label, i) => (
                <span key={i} className={tabColors[i]}>
                  {label}: ₹ {calculations.tabTotals[`tab${i + 1}`].toLocaleString()}
                </span>
              ))}
            </div>

            {/* Grand total below */}
            {/* <div className="text-xl font-bold mt-2 text-rose-700">
              Component Price: ₹ {calculations.grandTotal.toLocaleString()}
            </div> */}
          </div>
          {/* Navigation buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab((prev) => Math.max(0, prev - 1))}
              disabled={activeTab === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 
        ${activeTab === 0
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600 shadow-sm"
                }`}
            >
              ⬅️ Previous
            </button>

            <button
              onClick={() => setActiveTab((prev) => Math.min(3, prev + 1))}
              disabled={activeTab === 3}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
                ${activeTab === 3
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600 shadow-sm"
                }`}
            >
              Next ➡️
            </button>
          </div>

          {/* Cancel and Save buttons on right */}
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-medium bg-gray-400 text-white hover:bg-gray-500 transition-all duration-200 shadow-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-lg font-semibold 
             bg-gradient-to-r from-emerald-500 to-green-600 
             text-white hover:from-emerald-600 hover:to-green-700 
             transition-all duration-200 shadow-md hover:shadow-lg 
             focus:ring-2 focus:ring-green-300 focus:outline-none"
            // className="px-5 py-2 rounded-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md"
            // disabled={Object.keys(incompleteTabs).length > 0 || Object.keys(errors).length > 0}
            >
              Draft
            </button>
          </div>
        </div>


        <div className="bg-gray-50 border-t border-gray-200 shadow-inner p-3 rounded-t-lg tracking-wide">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide flex items-center gap-2">
              🧾 System Calculation Breakdown
            </h3>
            <span className="text-xs text-gray-500 italic">Auto-generated summary</span>
          </div>

          {/* Summary Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-1 text-xs text-gray-700 leading-relaxed">

            {/* Machine */}
            <p>
              <span className="font-medium text-gray-800">Machine:</span> ₹{formData.machinePrice}
            </p>

            {/* Harness */}
            <p>
              <span className="font-medium text-gray-800">Harness:</span> ₹{formData.wiringHarnessPrice}
              {Number(formData.fastenerPrice) > 0 && formData.floorDesignations && (
                <span className="block text-[10px] text-red-600">
                  Price for {formData.floorDesignations}
                </span>
              )}
            </p>

            {/* Governor */}
            <p>
              <span className="font-medium text-gray-800">Governor:</span> ₹{formData.governorPrice}
              {Number(formData.fastenerPrice) > 0 && formData.floorDesignations && (
                <span className="block text-[10px] text-red-600">
                  Price for {formData.floorDesignations}
                </span>
              )}
            </p>

            {/* Roping */}
            <p>
              <span className="font-medium text-gray-800">Roping:</span> ₹{formData.ropingTypePrice}
              {Number(formData.ropingTypePrice) > 0 && formData.capacityValue && (
                <span className="block text-[10px] text-red-600">
                  {ropingContextMessage}
                </span>
              )}
            </p>

            {/* Fastener */}
            <p>
              <span className="font-medium text-gray-800">Fastener:</span> ₹{formData.fastenerPrice}
              {Number(formData.fastenerPrice) > 0 && formData.floorDesignations && (
                <span className="block text-[10px] text-red-600">
                  Price for {formData.floorDesignations}
                </span>
              )}
            </p>

            {/* Truffing */}
            <p>
              <span className="font-medium text-gray-800">Truffing:</span> ₹{formData.truffingPrice}
              {Number(formData.truffingPrice) > 0 && formData.floorDesignations && (
                <span className="block text-[10px] text-red-600">
                  Price for {formData.floorDesignations}
                </span>
              )}
            </p>

            {/* Manual */}
            <div className="flex items-center gap-1 flex-wrap">
              <span className="font-medium text-gray-800">Manual:</span> ₹{formData.manualPrice}
              <SmallPopover>
                <h3 className="text-sm font-bold mb-2 text-green-700">Manual Price Breakdown</h3>
                {manualDetails.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1 max-h-60 overflow-y-auto">
                    {manualDetails.map((item, i) => (
                      <li key={i} className="text-xs">
                        <span className="font-semibold">{item.otherMaterialName}</span> — ₹{item.price} × {item.quantity} = ₹
                        {(parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-xs">No materials found.</p>
                )}
              </SmallPopover>
            </div>

            {/* Common */}
            <div className="flex items-center gap-1 flex-wrap">
              <span className="font-medium text-gray-800">Common:</span> ₹{formData.commonPrice}
              <SmallPopover>
                <h3 className="text-sm font-bold mb-2 text-green-700">Common Price Breakdown</h3>
                {commonDetails.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1 max-h-60 overflow-y-auto">
                    {commonDetails.map((item, i) => {
                      const qty = parseFloat(item.quantity) || 0;
                      const price = parseFloat(item.price) || 0;
                      const noofStops = Number(formData.stops) || 1; // Assuming formData.stops is available

                      const isMagnetSqr = item.otherMaterialName?.toLowerCase() === "magnet sqr material";

                      let itemTotal = qty * price;

                      // Apply the special rule for total calculation
                      if (isMagnetSqr) {
                        itemTotal = price * qty * noofStops;
                      }

                      return (
                        <li key={i} className="text-xs">
                          <span className="font-semibold">{item.otherMaterialName}</span>
                          — ₹{price} × {qty}

                          {/* Conditional Display: Show Stops multiplier OR Quantity Unit */}
                          {isMagnetSqr
                            ? ` × ${noofStops} Stops` // Display stops for Magnet SQR Material
                            : ` ${item.quantityUnit || ''}` // Display the standard unit (Set, Nos, Pair)
                          }

                          = ₹
                          {/* Display the final calculated total */}
                          {itemTotal.toFixed(2)}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-xs">No materials found.</p>
                )}
              </SmallPopover>
              {/* <SmallPopover>
                <h3 className="text-sm font-bold mb-2 text-green-700">Common Price Breakdown</h3>
                {commonDetails.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1 max-h-60 overflow-y-auto">
                    {commonDetails.map((item, i) => (
                      <li key={i} className="text-xs">
                        <span className="font-semibold">{item.otherMaterialName}</span> — ₹{item.price} × {item.quantity} = ₹
                        {(parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-xs">No materials found.</p>
                )}
              </SmallPopover> */}
            </div>

            {/* Other */}
            <div className="flex items-center gap-1 flex-wrap">
              <span className="font-medium text-gray-800">Other:</span> ₹{formData.otherPrice}
              <SmallPopover>
                <h3 className="text-sm font-bold mb-2 text-green-700">Other Material Breakdown</h3>
                {otherDetails.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1 max-h-60 overflow-y-auto">
                    {otherDetails.map((item, i) => (
                      <li key={i} className="text-xs">
                        <span className="font-semibold">{item.otherMaterialName}</span> — ₹{item.price} × {item.quantity} = ₹
                        {(parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-xs">No materials found.</p>
                )}
              </SmallPopover>
            </div>

            {/* Lift Rate */}
            <div className="flex items-center gap-1 flex-wrap">
              <span className="font-medium text-gray-800">Lift Rate:</span> ₹{formData.liftRate}
              <SmallPopover>
                <h3 className="text-sm font-bold mb-2 text-green-700">Lift Rate Breakdown</h3>
                {liftRatePriceKeys.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1 max-h-60 overflow-y-auto">
                    {liftRatePriceKeys.map((key, i) => {
                      const value = Number(formData[key] || 0);
                      return (
                        <li key={i} className="text-xs">
                          <span className="font-semibold">{key}</span> — ₹{value}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-xs">No materials found.</p>
                )}
              </SmallPopover>
            </div>

            {/* Load */}
            <p>
              <span className="font-medium text-gray-800">Load:</span> {formData.loadPerAmt}% (₹{formData.loadAmt})
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-2"></div>

          {/* Total */}
          <div className="flex items-center justify-between text-lg font-bold text-gray-800">
            <div className="flex items-center gap-2 text-rose-700">
              🧮 Quotation Total (Incl. {formData.tax}% GST & {formData.loadPerAmt}% Load)
            </div>
            <div className="text-rose-700 text-base font-bold flex items-center gap-2 mr-4">
              ₹{formData.totalAmount.toLocaleString()}
              <span className="text-xs font-normal text-gray-500 ml-1">
                [{formData.totalAmountWithoutLoad} + {formData.loadAmt}]
              </span>
              <SmallPopover>
                <h3 className="text-sm font-bold mb-2 text-green-700">Total Breakdown</h3>
                {adjustedPriceKeys.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1 max-h-60 overflow-y-auto">
                    {adjustedPriceKeys.map((key, i) => {
                      const value = Number(formData[key] || 0);
                      return (
                        <li key={i} className="text-xs">
                          <span className="font-semibold">{key}</span> — ₹{value}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-xs">No materials found.</p>
                )}
              </SmallPopover>
            </div>
          </div>
        </div>


      </div>

      {/* <div className="bg-blue-50 p-4 rounded shadow-xl border w-[15%] max-w-xl h-[90vh] rounded-lg  flex flex-col"> */}

      {Object.values(errors).some((msg) => typeof msg === "string" && msg.trim() !== "") && Object.keys(errors).length > 0 && (
        <div className="bg-blue-50 p-4 rounded shadow-xl border w-full md:w-[22%] max-w-xl h-auto md:h-[90vh] rounded-lg flex flex-col">
          <div className="flex flex-col text-right w-full h-full">
            {/* {Object.keys(errors).length > 0 && ( */}

            <div className="flex flex-col mb-3 bg-red-50 border border-red-200 rounded-lg p-4 flex-grow overflow-y-auto shadow-inner">

              {/* 🔴 Header */}
              <h3 className="text-m font-semibold text-red-600 mb-3 flex items-center gap-2">
                <span className="text-red-500 text-[25px]">⚠️</span>
                Please review the following issues:
              </h3>

              {(() => {
                // Separate required field errors and other logic errors
                const requiredErrors = Object.entries(errors).filter(
                  ([, msg]) =>
                    typeof msg === "string" &&
                    msg.toLowerCase().includes("this field is required")
                );
                const otherErrors = Object.entries(errors).filter(
                  ([, msg]) =>
                    typeof msg === "string" &&
                    !msg.toLowerCase().includes("this field is required")
                );

                return (
                  <div className="flex flex-col gap-4">
                    {/* 🟥 Required Field Errors */}
                    {requiredErrors.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-red-500 text-[16px]">❗</span>
                          <span className="font-semibold text-red-700 text-sm">
                            Required Field Errors
                          </span>
                        </div>

                        <div className="flex flex-col gap-2 pl-4">
                          {/* {requiredErrors.map(([key, msg]) => (
                            <div
                              key={key}
                              className="flex items-start gap-2 text-sm text-red-700 bg-white border border-red-100 rounded-md p-2"
                            >
                              <span className="text-red-500 text-[14px] mt-[2px]">●</span>
                              <span>{msg}</span>
                            </div>
                          ))} */}
                          {(() => {
                            const requiredErrors = Object.values(errors).filter(
                              (msg) =>
                                typeof msg === "string" &&
                                msg.toLowerCase().includes("this field is required")
                            );

                            return requiredErrors.length > 1 ? (
                              <div className="bg-red-100 text-red-700 text-sm px-3 py-2 rounded-md mb-3 flex items-start gap-2">
                                <span className="text-red-500 text-[16px] mt-[2px]">●</span>
                                <span>Please fill all mandatory fields before proceeding.</span>
                              </div>
                            ) : null;
                          })()}
                        </div>
                      </div>
                    )}

                    {/* 🟠 Other Validation / Logic Errors */}
                    {otherErrors.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-orange-500 text-[16px]">⚙️</span>
                          <span className="font-semibold text-orange-700 text-sm">
                            Validation & Logic Errors
                          </span>
                        </div>

                        <div className="flex flex-col gap-2 pl-4">
                          {otherErrors.map(([key, msg]) => {
                            if (typeof msg === 'string' && msg.trim() !== "") {
                              return (
                                <div
                                  key={key}
                                  className="flex items-start gap-2 text-sm text-orange-800 bg-orange-50 border border-orange-100 rounded-md p-2 w-full break-words"
                                >
                                  <span className="text-orange-500 text-[14px] mt-[2px]">●</span>
                                  <span>{msg}</span>
                                </div>
                              );
                            }
                            return null;
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* )} */}

          </div>
        </div>
      )}


      {/* Manual Details Popup */}
      {showManualDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-5 w-96">
            <h3 className="text-lg font-bold mb-3 text-blue-700">Manual Price Breakdown</h3>
            {manualDetails.length > 0 ? (
              <ul className="space-y-2 max-h-60 overflow-y-auto">
                {manualDetails.map((item, index) => (
                  <li key={index} className="text-sm">
                    <span className="font-semibold">{item.otherMaterialName}</span> — {item.quantity} × ₹{item.price} = ₹
                    {(parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0)}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-600">No items found</p>
            )}
            <button
              onClick={() => setShowManualDetails(false)}
              className="mt-4 bg-blue-600 text-white px-4 py-1 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Common Details Popup */}
      {showCommonDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-5 w-96">
            <h3 className="text-lg font-bold mb-3 text-green-700">Common Price Breakdown</h3>
            {commonDetails.length > 0 ? (
              <ul className="space-y-2 max-h-60 overflow-y-auto">
                {commonDetails.map((item, index) => {
                  const qty = parseFloat(item.quantity) || 0;
                  const price = parseFloat(item.price) || 0;
                  // Calculate noofStops here (assuming formData.stops is available)
                  const noofStops = Number(formData.stops) || 1;

                  let itemTotal = qty * price;


                  console.log("********item****1111****", item);
                  // Apply the special rule: price = qty * item price * formData.noof stops
                  if (item.otherMaterialName?.toLowerCase() === "magnet sqr material") {
                    itemTotal = price * qty * noofStops;
                    console.log("********item********", item);
                    console.log(itemTotal, "---------otherMaterialName--------", item.otherMaterialName?.toLowerCase()); // Keep console log if needed for debugging
                  }

                  return (
                    <li key={index} className="text-sm">
                      <span className="font-semibold">{item.otherMaterialName}</span>
                      {/* Display calculation summary */}
                      — {qty} × ₹{price}
                      {item.otherMaterialName?.toLowerCase() === "magnet sqr material" && ` × Stops (${noofStops})`}
                      = ₹
                      {/* Display the calculated total */}
                      {itemTotal.toFixed(2)}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-gray-600">No items found</p>
            )}
            <button
              onClick={() => setShowCommonDetails(false)}
              className="mt-4 bg-green-600 text-white px-4 py-1 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {/* {showCommonDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-5 w-96">
            <h3 className="text-lg font-bold mb-3 text-green-700">Common Price Breakdown</h3>
            {commonDetails.length > 0 ? (
              <ul className="space-y-2 max-h-60 overflow-y-auto">
                {commonDetails.map((item, index) => (
                  <li key={index} className="text-sm">
                    <span className="font-semibold">{item.otherMaterialName}</span> — {item.quantity} × ₹{item.price} = ₹
                    {(parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0)}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-600">No items found</p>
            )}
            <button
              onClick={() => setShowCommonDetails(false)}
              className="mt-4 bg-green-600 text-white px-4 py-1 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )} */}

      <>
        {isInitialLoad && <FullScreenLoader />}

        {/* The rest of your Modal JSX here */}
        <div className="lift-modal-container">
          {/* Modal content */}
        </div>
      </>
    </div>


  );
}

export const Input = ({
  label,
  name,
  tooltip,
  error,
  labelClassName = "",
  required = false,
  value = "",
  placeholder = "",
  ...props
}) => {
  const hasValue = value !== "" && value !== null && value !== undefined;

  const baseClasses =
    "w-full rounded-lg px-3 py-2.5 text-sm shadow-sm transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400";
  const borderClasses = error
    ? "border border-red-500 bg-white"
    : hasValue
      ? "border border-gray-300 bg-gray-50"
      : "border border-gray-300 bg-white hover:border-gray-500";
  const bgClasses = hasValue ? "bg-gray-100" : "bg-white";

  return (
    <div className="flex flex-col mb-4">
      <label
        htmlFor={name}
        className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName}`}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <input
        {...props}
        id={name}
        name={name}
        title={tooltip}
        placeholder={placeholder}
        value={value}
        className={`${baseClasses} ${borderClasses} ${bgClasses}`}
      />

      {error && (
        <p className="text-xs text-red-500 mt-1 animate-fadeIn">{error}</p>
      )}
    </div>
  );
};

export const Select = ({
  label,
  name,
  error,
  children,
  labelClassName = "",
  required = false,
  value,
  // placeholder = "Select...",
  ...props
}) => {
  const selectValue =
    value === null || value === undefined || value === "" ? "" : String(value);

  const hasSelection = React.useMemo(() => {
    if (value === undefined || value === null) return false;
    if (typeof value === "string") return value.trim() !== "";
    if (typeof value === "number") return !Number.isNaN(value);
    if (typeof value === "object")
      return value.id !== undefined || Object.keys(value).length > 0;
    return Boolean(value);
  }, [value]);

  const baseClasses =
    "w-full rounded-lg px-3 py-2.5 text-sm shadow-sm transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400";
  const borderClasses = error
    ? "border border-red-500"
    : hasSelection
      ? "border border-gray-300"
      : "border border-gray-300 hover:border-gray-500";
  const bgClasses = hasSelection ? "bg-gray-100" : "bg-white";

  return (
    <div className="flex flex-col mb-4">
      <label
        htmlFor={name}
        className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName}`}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <select
        id={name}
        name={name}
        value={selectValue}
        {...props}
        className={`${baseClasses} ${borderClasses} ${bgClasses}`}
      >
        {/* <option value="">{placeholder}</option> */}
        {children}
      </select>

      {error && (
        <p className="text-xs text-red-500 mt-1 animate-fadeIn">{error}</p>
      )}
    </div>
  );
};


// const Input = ({
//   label,
//   name,
//   tooltip,
//   error,
//   labelClassName = "",
//   required = false,
//   value = "",
//   ...props
// }) => {
//   const hasValue = value !== "" && value !== null && value !== undefined;

//   const baseClasses =
//     "w-full rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200";
//   const borderClasses = error
//     ? "border-2 border-red-500 bg-white"
//     : hasValue
//       ? "border-2 border-gray-700 bg-gray-100"
//       : "border border-gray-300 bg-white";

//   return (
//     <div>
//       <label className={`block text-gray-700 text-sm mb-1 ${labelClassName}`}>
//         {label}
//         {required && <span className="text-red-500 ml-1">*</span>}
//       </label>
//       <input
//         {...props}
//         name={name}
//         title={tooltip}
//         value={value}
//         className={`shadow-sm ${baseClasses} ${borderClasses}`}
//       />
//       {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
//     </div>
//   );
// };

// const Select = ({
//   label,
//   name,
//   error,
//   children,
//   labelClassName = "",
//   required = false,
//   value,       // incoming value (could be id or object)
//   ...props
// }) => {
//   // --- FIX: Ensure the value passed to the <select> tag is always a STRING ---
//   const selectValue =
//     (value === null || value === undefined || value === "")
//       ? ""
//       : String(value);

//   // 2. Extract and log all available option values
//   const optionValues = React.Children.map(children, (child) => {
//     if (React.isValidElement(child) && child.type === 'option') {
//       return String(child.props.value);
//     }
//     return null;
//   }).filter(v => v !== null);

//   // robust test whether a real selection exists
//   // IMPORTANT: The hasSelection logic should now use 'selectValue' or be adjusted 
//   // to ensure styling is correct. Let's adjust it to use the original 'value'
//   // for robust type checking, but we'll use 'selectValue' for the <select> tag.

//   const hasSelection = React.useMemo(() => {
//     // Keep this logic focused on the original value's truthiness
//     if (value === undefined || value === null) return false;
//     if (typeof value === "string") return value.trim() !== "";
//     if (typeof value === "number") return !Number.isNaN(value);
//     if (typeof value === "object") {
//       if (value.id !== undefined && value.id !== null) return true;
//       return Object.keys(value).length > 0;
//     }
//     return Boolean(value);
//   }, [value]);

//   const baseClasses =
//     "w-full rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200";
//   const borderClasses = error
//     ? "border-2 border-red-500"
//     : hasSelection
//       ? "border-2 border-gray-700"
//       : "border border-gray-300";
//   const bgClasses = hasSelection ? "bg-gray-100" : "bg-white";

//   return (
//     <div className="mb-4">
//       <label className={`block text-gray-700 text-sm mb-1 ${labelClassName}`}>
//         {label}
//         {required && <span className="text-red-500 ml-1">*</span>}
//       </label>

//       <select
//         name={name}
//         value={selectValue}
//         {...props}
//         className={`${baseClasses} ${borderClasses} ${bgClasses} transition-colors duration-150`}
//       >
//         {children}
//       </select>

//       {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
//     </div>
//   );
// };

// const Select = ({
//   label,
//   name,
//   error,
//   children,
//   labelClassName = "",
//   required = false,
//   value,
//   onChange, // make sure parent passes this
//   ...props
// }) => {
//   // robust test whether a real selection exists
//   const hasSelection = React.useMemo(() => {
//     if (value === undefined || value === null) return false;
//     if (typeof value === "string") return value.trim() !== "";
//     if (typeof value === "number") return !Number.isNaN(value);
//     if (typeof value === "object") {
//       if (value.id !== undefined && value.id !== null) return true;
//       return Object.keys(value).length > 0;
//     }
//     return Boolean(value);
//   }, [value]);

//   // auto-select first option if value is empty
//   useEffect(() => {
//     if (!hasSelection && children && onChange) {
//       const firstOption = React.Children.toArray(children).find(
//         (child) =>
//           child.props.value !== "" && child.type === "option"
//       );
//       if (firstOption) {
//         onChange({
//           target: { name, value: firstOption.props.value },
//         });
//       }
//     }
//   }, [children, hasSelection, name, onChange]);

//   const baseClasses =
//     "w-full rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200";
//   const borderClasses = error
//     ? "border-2 border-red-500"
//     : hasSelection
//       ? "border-2 border-gray-700"
//       : "border border-gray-300";
//   const bgClasses = hasSelection ? "bg-gray-100" : "bg-white";

//   return (
//     <div className="mb-4">
//       <label className={`block text-gray-700 text-sm mb-1 ${labelClassName}`}>
//         {label}
//         {required && <span className="text-red-500 ml-1">*</span>}
//       </label>

//       <select
//         name={name}
//         value={value ?? ""}
//         onChange={onChange} // ✅ required for controlled input
//         {...props}
//         className={`${baseClasses} ${borderClasses} ${bgClasses} transition-colors duration-150`}
//       >
//         {children}
//       </select>

//       {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
//     </div>
//   );
// };



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
