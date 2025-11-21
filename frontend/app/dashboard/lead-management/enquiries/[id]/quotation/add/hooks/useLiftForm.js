import { useState, useMemo, useEffect } from "react";
import toast from "react-hot-toast";
import { fetchAirSystemPrice, getOptionPrice } from "../liftService";


// ----------------------------------------------------
// Custom hook to handle form state and calculations
// ----------------------------------------------------
export default function useLiftForm(lift, setErrors, liftRatePriceKeys, initialOptions, onUserActivity) {


  const mapLiftToFormData = (lift) => {

    const safeNumber = (val) => {
      if (val === null || val === undefined || val === "") return "";
      const num = Number(val);
      return isNaN(num) ? "" : num;
    };

    // ADD THIS LINE
    // console.log('Initial airSystem value:', safeNumber(lift.data?.airSystem));
    // Determine initial floors from the lift object.
    const initialFloors =
      lift.floors || // <-- NEW: Check flat 'lift.floors' first
      lift.noOfFloors?.id ||
      "";

    // Calculate initial stops based on lift data.
    // If a specific number of stops is provided, use it. Otherwise, use the number of floors.
    const initialStops = lift.noOfStops && lift.noOfStops !== ""
      ? Number(lift.noOfStops)
      : Number(initialFloors) || 0;

    // Calculate initial openings based on lift data.
    // Use the specific number of openings if available, otherwise default to the number of floors.
    const initialOpenings = lift.noOfOpenings && lift.noOfOpenings !== ""
      ? Number(lift.noOfOpenings)
      : initialStops; // ✅ This line ensures openings defaults to the number of stops

    return {
      id: lift.id || "",
      leadId: lift.data?.leadId ?? lift.lead?.leadId ?? "",
      leadDate: lift.data?.leadDate ?? lift.lead?.leadDate ?? "",
      leadType: lift.data?.leadType ?? lift.lead?.leadType ?? "",

      enquiryId: lift.data?.enquiryId ?? lift.enquiryId ?? "",

      enquiryTypeId: lift.data?.enquiryTypeId ?? lift.enquiryTypeId ?? "",

      enquiryTypeName: lift.data?.enquiryTypeName ?? lift.enquiryTypeName ?? "",

      enqDate: lift.data?.enqDate ?? lift.enqDate ?? "",

      quotationId: lift.data?.quotationId ?? lift.quotation?.id ?? "",

      // liftId: lift.data?.liftId ?? lift.id ?? "",

      // enquiryId: lift.data?.enquiryId ?? lift.enquiryId ?? "",

      //---------------- LIFT SPECIFICATION ----------------
      liftQuantity: lift.data?.liftQuantity ?? 1,
      liftType:
        lift.data?.liftType ??
        lift.liftTypeId ??
        lift.liftType?.id ??
        "",

      typeOfLift:
        lift.data?.typeOfLift ??
        lift.typeOfLiftId ??
        lift.typeOfLift?.id ??
        "",

      machineRoom:
        lift.data?.reqMachineRoom ??
        lift.machineRoomId ??
        lift.reqMachineRoom?.id ??
        "",

      capacityType:
        lift.data?.capacityType ??
        lift.capacityTypeId ??
        lift.capacityTerm?.id ??
        "",

      // capacityValue:
      //   lift.data?.capacityValue ??
      //   (
      //     lift.capacityTypeId === 1 || lift.capacityType === 1
      //       ? (lift.personCapacityId ?? lift.personCapacity?.id)
      //       : (lift.weightId ?? lift.weight?.id)
      //   ) ??
      //   "",

      // capacityValue:
      //   lift.data?.capacityValue ??
      //   (
      //     lift.capacityTypeId === 1 || lift.capacityType === 1
      //       ? (lift.personCapacityId ?? (typeof lift.personCapacity === "object" ? lift.personCapacity?.id : lift.personCapacity))
      //       : (lift.weightId ?? (typeof lift.weight === "object" ? lift.weight?.id : lift.weight))
      //   ) ??
      //   "",

      capacityValue:
        // 1. Prefer the explicit capacityValue if it exists
        lift.data?.capacityValue ??
        // 2. Determine capacity based on capacityType/capacityTypeId
        (
          // Check if capacity type is 'Person' (assuming ID 1)
          lift.capacityTypeId === 1 || lift.capacityType === 1
            ? (
              // Use personCapacityId, or if personCapacity is an object, use its id, otherwise use personCapacity itself
              lift.personCapacityId ??
              (typeof lift.personCapacity === "object" ? lift.personCapacity?.id : lift.personCapacity)
            )
            : (
              // Use weightId, or if weight is an object, use its id, otherwise use weight itself
              lift.weightId ??
              (typeof lift.weight === "object" ? lift.weight?.id : lift.weight)
            )
        ) ??
        // 3. Final Fallback (Simplified logic based on the intent of the broken third section)
        // NOTE: If you need to check lift.capacityTerm?.id, you should check lift.data.capacityTerm, 
        // but the final part of your original expression was syntactically impossible to fix directly.
        (
          lift.capacityTerm?.id === 1 // Assuming lift.capacityTerm is a safe object
            ? lift.personCapacity?.id ?? lift.personCapacity
            : lift.weight?.id ?? lift.weight
        ) ??
        // 4. Default to empty string
        "",

      stops: lift.data?.stops ?? safeNumber(initialStops),
      floors: lift.data?.floors ?? safeNumber(initialFloors),
      openings: lift.data?.openings ?? safeNumber(initialOpenings),

      floorDesignations: lift.data?.floorDesignations ?? lift.floorsDesignation ?? "",

      floorSelections: lift.floorSelectionIds ?? lift.data?.floorSelections ?? lift.floorSelections?.map(f => f.id) ?? [],

      carTravel:
        lift.data?.carTravel ??
        lift.carTravel ??
        (safeNumber(initialFloors) > 0 ? (safeNumber(initialFloors) - 1) * 3000 : 0),

      speed: lift.data?.speed ?? "",

      cabinType:
        lift.data?.cabinType ??
        lift.cabinTypeId ??
        lift.cabinType?.id ??
        "",

      cabinSubType:
        lift.data?.cabinSubType ??
        lift.cabinSubTypeId ??
        lift.cabinSubType ??
        "",

      // cabinType: lift.data?.cabinType ?? lift.cabinType?.id ?? "",
      // cabinSubType: lift.data?.cabinSubType ?? lift.cabinSubType?.id ?? "",

      lightFitting: safeNumber(lift.data?.lightFitting),
      // lightFitting: lift.data?.lightFitting ?? "",
      cabinFlooring: lift.data?.cabinFlooring ?? "",
      cabinCeiling: lift.data?.cabinCeiling ?? "",
      // airSystem: Number(lift.data?.airSystem) ?? "",
      // carEntrance: lift.data?.carEntrance ?? "",
      // carEntranceSubType: lift.data?.carEntranceSubType ?? "",
      airType: safeNumber(lift.data?.airType),
      airSystem: safeNumber(lift.data?.airSystem),
      // airSystem: lift.data?.airSystem ?? "",
      carEntrance: lift.data?.carEntrance ?? "",
      carEntranceSubType: safeNumber(lift.data?.carEntranceSubType) ?? "",

      landingEntranceSubType1: safeNumber(lift.data?.landingEntranceSubType1) ?? "",
      landingEntranceSubType2: safeNumber(lift.data?.landingEntranceSubType2) ?? "",
      landingEntranceCount: lift.data?.landingEntranceCount ?? "",
      landingEntranceSubType2_fromFloor:
        lift.data?.landingEntranceSubType2_fromFloor ?? 0,
      landingEntranceSubType2_toFloor:
        lift.data?.landingEntranceSubType2_toFloor ?? 0,

      //---------------- CABIN DESIGN ----------------
      controlPanelType: lift.data?.controlPanelType ?? "",
      manufacture: lift.data?.manufacture ?? "",
      controlPanelMake: lift.data?.controlPanelMake ?? "",
      wiringHarness: lift.data?.wiringHarness ?? "",

      // controlPanelMake:
      //   lift.data?.controlPanelMake?.id ?? lift.controlPanelMake?.id ?? "",
      // In your useLiftForm hook (or wherever formData is initialized)
      // controlPanelMake: lift.data?.controlPanelMake
      //   ? {
      //     // id: lift.data.controlPanelMake.id,
      //     // name: lift.data.controlPanelMake.name
      //     id: lift.data.controlPanelMakeId,
      //     name: lift.data.controlPanelMakeName
      //   }
      //     : null,

      // wiringHarness: lift.data?.wiringHarness
      //   ? {
      //     // id: lift.data.wiringHarness.id,
      //     // name: lift.data.wiringHarness.name
      //     id: lift.data.wiringHarnessId,
      //     name: lift.data.wiringHarnessName
      //   }
      //     : null,

      // wiringHarness:
      //   lift.data?.wiringHarness?.id ?? lift.wiringHarness?.id ?? "",
      guideRail: safeNumber(lift.data?.guideRail) ?? "",
      guideRailName: lift.data?.guideRailName ?? lift.guideRailName ?? "",
      bracketType: safeNumber(lift.data?.bracketType) ?? "",
      ropingType: lift.data?.ropingType ?? "",
      lopType: lift.data?.lopType ?? "",
      copType: lift.data?.copType ?? "",
      overhead: lift.data?.overhead ?? 4800,
      operationType: lift.data?.operationType ?? "",
      machineRoomDepth: lift.data?.machineRoomDepth ?? lift.data?.machineRoom1 ?? 0,
      machineRoomWidth: lift.data?.machineRoomWidth ?? lift.data?.machineRoom2 ?? 0,
      shaftWidth: lift.data?.shaftWidth ?? lift.shaftsWidth ?? 0,
      shaftDepth: lift.data?.shaftDepth ?? lift.shaftsDepth ?? 0,
      carInternalWidth: lift.data?.carInternalWidth ?? lift.carInternalWidth ?? 0,
      carInternalDepth: lift.data?.carInternalDepth ?? lift.carInternalDepth ?? 0,
      carInternalHeight: lift.data?.carInternalHeight ?? 2100,

      //---------------- FEATURES ----------------
      // stdFeatures: lift.data?.stdFeatures ?? lift.features?.map(f => f.id) ?? [],
      stdFeatures: lift.stdFeatureIds ?? lift.data?.stdFeatures ?? lift.features?.map(f => f.id) ?? [],

      autoRescue: lift.data?.autoRescue ?? false,

      vfdMainDrive:
        safeNumber(
          lift.data?.vfdMainDrive || // 1. Use new flat ID from unsaved form data
          // lift.vfdMainDrive?.id ||    // 2. Use ID from existing object (the primary fallback)
          lift.vfdMainDrive ||        // 3. Fallback to a flat ID if lift.vfdMainDrive IS NOT an object
          0
        ) || "",
      vfdMainDriveName:
        lift.data?.vfdMainDriveName ?? lift.vfdMainDriveName ?? "",


      // --- Door Operator ---
      doorOperator: safeNumber(lift.data?.doorOperator ?? lift.doorOperator ?? lift.doorOperator?.id ?? 0) || "",
      doorOperatorName: lift.data?.doorOperatorName ?? lift.doorOperatorName ?? lift.doorOperator?.name ?? "",

      // --- Main Machine Set ---
      mainMachineSet: safeNumber(lift.data?.mainMachineSet ?? lift.mainMachineSet ?? lift.mainMachineSet?.id ?? 0) || "",
      mainMachineSetName: lift.data?.mainMachineSetName ?? lift.mainMachineSetName ?? lift.mainMachineSet?.name ?? "",

      // --- Car Rails ---
      carRails: safeNumber(lift.data?.carRails ?? lift.carRails ?? lift.carRails?.id ?? 0) || "",
      carRailsName: lift.data?.carRailsName ?? lift.carRailsName ?? lift.carRails?.name ?? "",

      // --- Counter Weight Rails ---
      counterWeightRails: safeNumber(lift.data?.counterWeightRails ?? lift.counterWeightRails ?? 0) || "",
      counterWeightRailsName: lift.data?.counterWeightRailsName ?? lift.counterWeightRailsName ?? lift.counterWeightRails?.name ?? "",

      // --- Wire Rope ---
      wireRope: safeNumber(lift.data?.wireRope ?? lift.wireRope ?? 0) || "",
      wireRopeName: lift.data?.wireRopeName ?? lift.wireRopeName ?? lift.wireRope?.name ?? "",


      // // vfdMainDrive: lift.data?.vfdMainDrive?.id ?? "",
      // vfdMainDrive: lift.data?.vfdMainDrive
      //   ? {
      //     id: lift.data.vfdMainDrive.id,
      //     name: lift.data.vfdMainDrive.name
      //   }
      //   : lift.vfdMainDrive
      //     ? {
      //       id: lift.vfdMainDrive.id,
      //       name: lift.vfdMainDrive.name
      //     }
      //     : null,

      // // doorOperator: lift.data?.doorOperator?.id ?? "",
      // doorOperator: lift.data?.doorOperator
      //   ? {
      //     id: lift.data.doorOperator.id,
      //     name: lift.data.doorOperator.name
      //   }
      //   : lift.doorOperator
      //     ? {
      //       id: lift.doorOperator.id,
      //       name: lift.doorOperator.name
      //     }
      //     : null,

      // // mainMachineSet: lift.data?.mainMachineSet?.id ?? "",
      // mainMachineSet: lift.data?.mainMachineSet
      //   ? {
      //     id: lift.data.mainMachineSet.id,
      //     name: lift.data.mainMachineSet.name
      //   }
      //   : lift.mainMachineSet
      //     ? {
      //       id: lift.mainMachineSet.id,
      //       name: lift.mainMachineSet.name
      //     }
      //     : null,

      // // carRails: lift.data?.carRails?.id ?? "",
      // carRails: lift.data?.carRails
      //   ? {
      //     id: lift.data.carRails.id,
      //     name: lift.data.carRails.name
      //   }
      //   : lift.carRails
      //     ? {
      //       id: lift.carRails.id,
      //       name: lift.carRails.name
      //     }
      //     : null,

      // // counterWeightRails: lift.data?.counterWeightRails?.id ?? "",
      // counterWeightRails: lift.data?.counterWeightRails
      //   ? {
      //     id: lift.data.counterWeightRails.id,
      //     name: lift.data.counterWeightRails.name
      //   }
      //   : lift.counterWeightRails
      //     ? {
      //       id: lift.counterWeightRails.id,
      //       name: lift.counterWeightRails.name
      //     }
      //     : null,

      // // wireRope: lift.data?.wireRope?.id ?? "",
      // wireRope: lift.data?.wireRope
      //   ? {
      //     id: lift.data.wireRope.id,
      //     name: lift.data.wireRope.name
      //   }
      //   : lift.wireRope
      //     ? {
      //       id: lift.wireRope.id,
      //       name: lift.wireRope.name
      //     }
      //     : null,

      warrantyPeriod: lift.data?.warrantyPeriod ?? "",
      pwdIncludeExclude: lift.data?.pwdIncludeExclude ?? false,
      scaffoldingIncludeExclude: lift.data?.scaffoldingIncludeExclude ?? false,
      installationAmountRuleId: lift.data?.installationAmountRuleId ?? "",

      //---------------- PRICE FIELDS ----------------
      cabinPrice: lift.data?.cabinPrice ?? 0,
      lightFittingPrice: lift.data?.lightFittingPrice ?? 0,
      cabinFlooringPrice: lift.data?.cabinFlooringPrice ?? 0,
      cabinCeilingPrice: lift.data?.cabinCeilingPrice ?? 0,
      airSystemPrice: lift.data?.airSystemPrice ?? 0,
      carEntrancePrice: lift.data?.carEntrancePrice ?? 0,
      landingEntrancePrice1: lift.data?.landingEntrancePrice1 ?? 0,
      landingEntrancePrice2: lift.data?.landingEntrancePrice2 ?? 0,

      controlPanelTypePrice: lift.data?.controlPanelTypePrice ?? 0,
      wiringHarnessPrice: lift.data?.wiringHarnessPrice ?? 0,
      guideRailPrice: lift.data?.guideRailPrice ?? 0,
      bracketTypePrice: lift.data?.bracketTypePrice ?? 0,
      wireRopePrice: lift.data?.wireRopePrice ?? 0,
      ropingTypePrice: lift.data?.ropingTypePrice ?? 0,
      lopTypePrice: lift.data?.lopTypePrice ?? 0,
      copTypePrice: lift.data?.copTypePrice ?? 0,

      //---------------- COMMERCIAL ----------------
      pwdAmount: lift.data?.pwdAmount ?? 0,
      bambooScaffolding: lift.data?.bambooScaffolding ?? 0,
      ardAmount: lift.data?.ardAmount ?? 0,
      overloadDevice: lift.data?.overloadDevice ?? 0,
      transportCharges: lift.data?.transportCharges ?? 0,
      otherCharges: lift.data?.otherCharges ?? 0,
      powerBackup: lift.data?.powerBackup ?? 0,
      fabricatedStructure: lift.data?.fabricatedStructure ?? 0,
      electricalWork: lift.data?.electricalWork ?? 0,
      ibeamChannel: lift.data?.ibeamChannel ?? 0,
      duplexSystem: lift.data?.duplexSystem ?? 0,
      telephonicIntercom: lift.data?.telephonicIntercom ?? 0,
      gsmIntercom: lift.data?.gsmIntercom ?? 0,
      numberLockSystem: lift.data?.numberLockSystem ?? 0,
      thumbLockSystem: lift.data?.thumbLockSystem ?? 0,
      tax: lift.data?.tax ?? 18, // Default to 18% if not provided
      loadPerAmt: lift.data?.loadPerAmt ?? 0,
      loadAmt: lift.data?.loadAmt ?? 0,

      truffingQty: lift.data?.truffingQty ?? "",
      truffingType: lift.data?.truffingType ?? "",

      // ardPrice: lift.data?.ardPrice ?? 0,
      machinePrice: lift.data?.machinePrice ?? 0,
      governorPrice: lift.data?.governorPrice ?? 0,
      truffingPrice: lift.data?.truffingPrice ?? 0,
      fastenerPrice: lift.data?.fastenerPrice ?? 0,
      installationAmount: lift.data?.installationAmount ?? "",
      manualPrice: lift.data?.manualPrice ?? 0,
      commonPrice: lift.data?.commonPrice ?? 0,
      otherPrice: lift.data?.otherPrice ?? 0,
      manualDetails: lift.data?.manualDetails ?? [],
      commonDetails: lift.data?.commonDetails ?? [],
      otherDetails: lift.data?.otherDetails ?? [],

      selectedMaterials: lift.selectedMaterials || [],

      totalAmount: lift.data?.totalAmount ?? 0,
      totalAmountWithoutGST: lift.data?.totalAmountWithoutGST ?? 0,
      totalAmountWithoutLoad: lift.data?.totalAmountWithoutLoad ?? 0,
      liftRate: lift.data?.liftRate ?? 0,
      isLiftRateManual: false,
      commercialTotal: lift.data?.commercialTotal ?? lift.data?.total_amt_commercial ?? 0,
      commercialTaxAmount: lift.data?.commercialTaxAmount ?? lift.data?.tax_amount ?? 0,
      commercialFinalAmount: lift.data?.commercialFinalAmount ?? lift.data?.final_amt ?? 0,

      fastenerType: lift.data?.fastenerType ?? "",
      pitDepth: lift.data?.pitDepth ?? 1500,
      mainSupplySystem:
        lift.data?.mainSupplySystem ?? "415 Volts, 3 Phase, 50HZ A.C. (By Client)",
      auxlSupplySystem:
        lift.data?.auxlSupplySystem ?? "220/230 Volts, Single Phase 50Hz A.C. (By Client)",
      signals:
        lift.data?.signals ??
        "Alarm Bell, Up/Dn. Direction Indicators at all landings",
    };

  };

  const [dataMapped, setDataMapped] = useState(false);

  // 1. Initial State Definition (Runs only on mount)
  // You call the mapping function here.
  const [formData, setFormData] = useState(() => mapLiftToFormData(lift));


  // ----------------------------------------------------
  // Data Synchronization (Runs when 'lift' changes)
  // ----------------------------------------------------
  useEffect(() => {
    // Run ONLY when 'lift' changes to load new data
    setDataMapped(false); // Start loading flag

    // 3a. Re-calculate and set formData based on the new 'lift' prop.
    setFormData(mapLiftToFormData(lift));

    // 3b. Set dataMapped = true to signal data is in state
    setDataMapped(true);

  }, [lift, setFormData]); // setFormData is needed for linting, but it's stable.

  // ----------------------------------------------------
  // 4. Load Completion Signal (Add this second useEffect here)
  // ----------------------------------------------------
  useEffect(() => {
    // This effect runs when the data is mapped and the component is ready
    if (dataMapped && onUserActivity && typeof onUserActivity === 'function') {

      // CRITICAL: Use a short timeout to defer execution and let the UI paint
      const timer = setTimeout(() => {
        onUserActivity(); // This calls setIsInitialLoad(false) in LiftModal
      }, 50);

      return () => clearTimeout(timer); // Cleanup
    }
  }, [dataMapped, onUserActivity]);

  // const [errors, setErrors] = useState({});
  // const [formData, setFormData] = useState(() => {

  //   const safeNumber = (val) => {
  //     if (val === null || val === undefined || val === "") return "";
  //     const num = Number(val);
  //     return isNaN(num) ? "" : num;
  //   };

  //   // ADD THIS LINE
  //   // console.log('Initial airSystem value:', safeNumber(lift.data?.airSystem));
  //   // Determine initial floors from the lift object.
  //   const initialFloors =
  //     lift.floors || // <-- NEW: Check flat 'lift.floors' first
  //     lift.noOfFloors?.id ||
  //     "";

  //   // Calculate initial stops based on lift data.
  //   // If a specific number of stops is provided, use it. Otherwise, use the number of floors.
  //   const initialStops = lift.noOfStops && lift.noOfStops !== ""
  //     ? Number(lift.noOfStops)
  //     : Number(initialFloors) || 0;

  //   // Calculate initial openings based on lift data.
  //   // Use the specific number of openings if available, otherwise default to the number of floors.
  //   const initialOpenings = lift.noOfOpenings && lift.noOfOpenings !== ""
  //     ? Number(lift.noOfOpenings)
  //     : initialStops; // ✅ This line ensures openings defaults to the number of stops

  //   return {
  //     id: lift.id || "",
  //     leadId: lift.data?.leadId ?? lift.lead?.leadId ?? "",
  //     leadDate: lift.data?.leadDate ?? lift.lead?.leadDate ?? "",
  //     leadType: lift.data?.leadType ?? lift.lead?.leadType ?? "",

  //     enquiryId: lift.data?.enquiryId ?? lift.enquiryId ?? "",

  //     enquiryTypeId: lift.data?.enquiryTypeId ?? lift.enquiryTypeId ?? "",

  //     enquiryTypeName: lift.data?.enquiryTypeName ?? lift.enquiryTypeName ?? "",

  //     enqDate: lift.data?.enqDate ?? lift.enqDate ?? "",

  //     quotationId: lift.data?.quotationId ?? lift.quotation?.id ?? "",

  //     // liftId: lift.data?.liftId ?? lift.id ?? "",

  //     // enquiryId: lift.data?.enquiryId ?? lift.enquiryId ?? "",

  //     //---------------- LIFT SPECIFICATION ----------------
  //     liftQuantity: lift.data?.liftQuantity ?? 1,
  //     liftType:
  //       lift.data?.liftType ??
  //       lift.liftTypeId ??
  //       lift.liftType?.id ??
  //       "",

  //     typeOfLift:
  //       lift.data?.typeOfLift ??
  //       lift.typeOfLiftId ??
  //       lift.typeOfLift?.id ??
  //       "",

  //     machineRoom:
  //       lift.data?.reqMachineRoom ??
  //       lift.machineRoomId ??
  //       lift.reqMachineRoom?.id ??
  //       "",

  //     capacityType:
  //       lift.data?.capacityType ??
  //       lift.capacityTypeId ??
  //       lift.capacityTerm?.id ??
  //       "",

  //     // capacityValue:
  //     //   lift.data?.capacityValue ??
  //     //   (
  //     //     lift.capacityTypeId === 1 || lift.capacityType === 1
  //     //       ? (lift.personCapacityId ?? lift.personCapacity?.id)
  //     //       : (lift.weightId ?? lift.weight?.id)
  //     //   ) ??
  //     //   "",

  //     capacityValue:
  //       lift.data?.capacityValue ??
  //       (
  //         lift.capacityTypeId === 1 || lift.capacityType === 1
  //           ? (lift.personCapacityId ?? (typeof lift.personCapacity === "object" ? lift.personCapacity?.id : lift.personCapacity))
  //           : (lift.weightId ?? (typeof lift.weight === "object" ? lift.weight?.id : lift.weight))
  //       ) ??
  //       "",

  //     stops: lift.data?.stops ?? safeNumber(initialStops),
  //     floors: lift.data?.floors ?? safeNumber(initialFloors),
  //     openings: lift.data?.openings ?? safeNumber(initialOpenings),

  //     floorDesignations: lift.data?.floorDesignations ?? lift.floorsDesignation ?? "",

  //     floorSelections: lift.floorSelectionIds ?? lift.data?.floorSelections ?? lift.floorSelections?.map(f => f.id) ?? [],

  //     carTravel:
  //       lift.data?.carTravel ??
  //       lift.carTravel ??
  //       (safeNumber(initialFloors) > 0 ? (safeNumber(initialFloors) - 1) * 3000 : 0),

  //     speed: lift.data?.speed ?? "",

  //     cabinType:
  //       lift.data?.cabinType ??
  //       lift.cabinTypeId ??
  //       lift.cabinType?.id ??
  //       "",

  //     cabinSubType:
  //       lift.data?.cabinSubType ??
  //       lift.cabinSubTypeId ??
  //       lift.cabinSubType ??
  //       "",

  //     // cabinType: lift.data?.cabinType ?? lift.cabinType?.id ?? "",
  //     // cabinSubType: lift.data?.cabinSubType ?? lift.cabinSubType?.id ?? "",

  //     lightFitting: safeNumber(lift.data?.lightFitting),
  //     // lightFitting: lift.data?.lightFitting ?? "",
  //     cabinFlooring: lift.data?.cabinFlooring ?? "",
  //     cabinCeiling: lift.data?.cabinCeiling ?? "",
  //     // airSystem: Number(lift.data?.airSystem) ?? "",
  //     // carEntrance: lift.data?.carEntrance ?? "",
  //     // carEntranceSubType: lift.data?.carEntranceSubType ?? "",
  //     airType: safeNumber(lift.data?.airType),
  //     airSystem: safeNumber(lift.data?.airSystem),
  //     // airSystem: lift.data?.airSystem ?? "",
  //     carEntrance: lift.data?.carEntrance ?? "",
  //     carEntranceSubType: lift.data?.carEntranceSubType ?? "",

  //     landingEntranceSubType1: safeNumber(lift.data?.landingEntranceSubType1) ?? "",
  //     landingEntranceSubType2: safeNumber(lift.data?.landingEntranceSubType2) ?? "",
  //     landingEntranceCount: lift.data?.landingEntranceCount ?? "",
  //     landingEntranceSubType2_fromFloor:
  //       lift.data?.landingEntranceSubType2_fromFloor ?? 0,
  //     landingEntranceSubType2_toFloor:
  //       lift.data?.landingEntranceSubType2_toFloor ?? 0,

  //     //---------------- CABIN DESIGN ----------------
  //     controlPanelType: lift.data?.controlPanelType ?? "",
  //     manufacture: lift.data?.manufacture ?? "",
  //     controlPanelMake: lift.data?.controlPanelMake ?? "",
  //     wiringHarness: lift.data?.wiringHarness ?? "",

  //     // controlPanelMake:
  //     //   lift.data?.controlPanelMake?.id ?? lift.controlPanelMake?.id ?? "",
  //     // In your useLiftForm hook (or wherever formData is initialized)
  //     // controlPanelMake: lift.data?.controlPanelMake
  //     //   ? {
  //     //     // id: lift.data.controlPanelMake.id,
  //     //     // name: lift.data.controlPanelMake.name
  //     //     id: lift.data.controlPanelMakeId,
  //     //     name: lift.data.controlPanelMakeName
  //     //   }
  //     //     : null,

  //     // wiringHarness: lift.data?.wiringHarness
  //     //   ? {
  //     //     // id: lift.data.wiringHarness.id,
  //     //     // name: lift.data.wiringHarness.name
  //     //     id: lift.data.wiringHarnessId,
  //     //     name: lift.data.wiringHarnessName
  //     //   }
  //     //     : null,

  //     // wiringHarness:
  //     //   lift.data?.wiringHarness?.id ?? lift.wiringHarness?.id ?? "",
  //     guideRail: safeNumber(lift.data?.guideRail) ?? "",
  //     guideRailName: lift.data?.guideRailName ?? lift.guideRailName ?? "",
  //     bracketType: safeNumber(lift.data?.bracketType) ?? "",
  //     ropingType: lift.data?.ropingType ?? "",
  //     lopType: lift.data?.lopType ?? "",
  //     copType: lift.data?.copType ?? "",
  //     overhead: lift.data?.overhead ?? 4800,
  //     operationType: lift.data?.operationType ?? "",
  //     machineRoomDepth: lift.data?.machineRoomDepth ?? lift.data?.machineRoom1 ?? 0,
  //     machineRoomWidth: lift.data?.machineRoomWidth ?? lift.data?.machineRoom2 ?? 0,
  //     shaftWidth: lift.data?.shaftWidth ?? lift.shaftsWidth ?? 0,
  //     shaftDepth: lift.data?.shaftDepth ?? lift.shaftsDepth ?? 0,
  //     carInternalWidth: lift.data?.carInternalWidth ?? lift.carInternalWidth ?? 0,
  //     carInternalDepth: lift.data?.carInternalDepth ?? lift.carInternalDepth ?? 0,
  //     carInternalHeight: lift.data?.carInternalHeight ?? 2100,

  //     //---------------- FEATURES ----------------
  //     // stdFeatures: lift.data?.stdFeatures ?? lift.features?.map(f => f.id) ?? [],
  //     stdFeatures: lift.stdFeatureIds ?? lift.data?.stdFeatures ?? lift.features?.map(f => f.id) ?? [],

  //     autoRescue: lift.data?.autoRescue ?? false,

  //     vfdMainDrive:
  //       safeNumber(
  //         lift.data?.vfdMainDrive || // 1. Use new flat ID from unsaved form data
  //         // lift.vfdMainDrive?.id ||    // 2. Use ID from existing object (the primary fallback)
  //         lift.vfdMainDrive ||        // 3. Fallback to a flat ID if lift.vfdMainDrive IS NOT an object
  //         0
  //       ) || "",
  //     vfdMainDriveName:
  //       lift.data?.vfdMainDriveName ?? lift.vfdMainDriveName ?? "",


  //     // --- Door Operator ---
  //     doorOperator: safeNumber(lift.data?.doorOperator ?? lift.doorOperator ?? lift.doorOperator?.id ?? 0) || "",
  //     doorOperatorName: lift.data?.doorOperatorName ?? lift.doorOperatorName ?? lift.doorOperator?.name ?? "",

  //     // --- Main Machine Set ---
  //     mainMachineSet: safeNumber(lift.data?.mainMachineSet ?? lift.mainMachineSet ?? lift.mainMachineSet?.id ?? 0) || "",
  //     mainMachineSetName: lift.data?.mainMachineSetName ?? lift.mainMachineSetName ?? lift.mainMachineSet?.name ?? "",

  //     // --- Car Rails ---
  //     carRails: safeNumber(lift.data?.carRails ?? lift.carRails ?? lift.carRails?.id ?? 0) || "",
  //     carRailsName: lift.data?.carRailsName ?? lift.carRailsName ?? lift.carRails?.name ?? "",

  //     // --- Counter Weight Rails ---
  //     counterWeightRails: safeNumber(lift.data?.counterWeightRails ?? lift.counterWeightRails ?? 0) || "",
  //     counterWeightRailsName: lift.data?.counterWeightRailsName ?? lift.counterWeightRailsName ?? lift.counterWeightRails?.name ?? "",

  //     // --- Wire Rope ---
  //     wireRope: safeNumber(lift.data?.wireRope ?? lift.wireRope ?? 0) || "",
  //     wireRopeName: lift.data?.wireRopeName ?? lift.wireRopeName ?? lift.wireRope?.name ?? "",


  //     // // vfdMainDrive: lift.data?.vfdMainDrive?.id ?? "",
  //     // vfdMainDrive: lift.data?.vfdMainDrive
  //     //   ? {
  //     //     id: lift.data.vfdMainDrive.id,
  //     //     name: lift.data.vfdMainDrive.name
  //     //   }
  //     //   : lift.vfdMainDrive
  //     //     ? {
  //     //       id: lift.vfdMainDrive.id,
  //     //       name: lift.vfdMainDrive.name
  //     //     }
  //     //     : null,

  //     // // doorOperator: lift.data?.doorOperator?.id ?? "",
  //     // doorOperator: lift.data?.doorOperator
  //     //   ? {
  //     //     id: lift.data.doorOperator.id,
  //     //     name: lift.data.doorOperator.name
  //     //   }
  //     //   : lift.doorOperator
  //     //     ? {
  //     //       id: lift.doorOperator.id,
  //     //       name: lift.doorOperator.name
  //     //     }
  //     //     : null,

  //     // // mainMachineSet: lift.data?.mainMachineSet?.id ?? "",
  //     // mainMachineSet: lift.data?.mainMachineSet
  //     //   ? {
  //     //     id: lift.data.mainMachineSet.id,
  //     //     name: lift.data.mainMachineSet.name
  //     //   }
  //     //   : lift.mainMachineSet
  //     //     ? {
  //     //       id: lift.mainMachineSet.id,
  //     //       name: lift.mainMachineSet.name
  //     //     }
  //     //     : null,

  //     // // carRails: lift.data?.carRails?.id ?? "",
  //     // carRails: lift.data?.carRails
  //     //   ? {
  //     //     id: lift.data.carRails.id,
  //     //     name: lift.data.carRails.name
  //     //   }
  //     //   : lift.carRails
  //     //     ? {
  //     //       id: lift.carRails.id,
  //     //       name: lift.carRails.name
  //     //     }
  //     //     : null,

  //     // // counterWeightRails: lift.data?.counterWeightRails?.id ?? "",
  //     // counterWeightRails: lift.data?.counterWeightRails
  //     //   ? {
  //     //     id: lift.data.counterWeightRails.id,
  //     //     name: lift.data.counterWeightRails.name
  //     //   }
  //     //   : lift.counterWeightRails
  //     //     ? {
  //     //       id: lift.counterWeightRails.id,
  //     //       name: lift.counterWeightRails.name
  //     //     }
  //     //     : null,

  //     // // wireRope: lift.data?.wireRope?.id ?? "",
  //     // wireRope: lift.data?.wireRope
  //     //   ? {
  //     //     id: lift.data.wireRope.id,
  //     //     name: lift.data.wireRope.name
  //     //   }
  //     //   : lift.wireRope
  //     //     ? {
  //     //       id: lift.wireRope.id,
  //     //       name: lift.wireRope.name
  //     //     }
  //     //     : null,

  //     warrantyPeriod: lift.data?.warrantyPeriod ?? "",
  //     pwdIncludeExclude: lift.data?.pwdIncludeExclude ?? false,
  //     scaffoldingIncludeExclude: lift.data?.scaffoldingIncludeExclude ?? false,
  //     installationAmountRuleId: lift.data?.installationAmountRuleId ?? "",

  //     //---------------- PRICE FIELDS ----------------
  //     cabinPrice: lift.data?.cabinPrice ?? 0,
  //     lightFittingPrice: lift.data?.lightFittingPrice ?? 0,
  //     cabinFlooringPrice: lift.data?.cabinFlooringPrice ?? 0,
  //     cabinCeilingPrice: lift.data?.cabinCeilingPrice ?? 0,
  //     airSystemPrice: lift.data?.airSystemPrice ?? 0,
  //     carEntrancePrice: lift.data?.carEntrancePrice ?? 0,
  //     landingEntrancePrice1: lift.data?.landingEntrancePrice1 ?? 0,
  //     landingEntrancePrice2: lift.data?.landingEntrancePrice2 ?? 0,

  //     controlPanelTypePrice: lift.data?.controlPanelTypePrice ?? 0,
  //     wiringHarnessPrice: lift.data?.wiringHarnessPrice ?? 0,
  //     guideRailPrice: lift.data?.guideRailPrice ?? 0,
  //     bracketTypePrice: lift.data?.bracketTypePrice ?? 0,
  //     wireRopePrice: lift.data?.wireRopePrice ?? 0,
  //     ropingTypePrice: lift.data?.ropingTypePrice ?? 0,
  //     lopTypePrice: lift.data?.lopTypePrice ?? 0,
  //     copTypePrice: lift.data?.copTypePrice ?? 0,

  //     //---------------- COMMERCIAL ----------------
  //     pwdAmount: lift.data?.pwdAmount ?? 0,
  //     bambooScaffolding: lift.data?.bambooScaffolding ?? 0,
  //     ardAmount: lift.data?.ardAmount ?? 0,
  //     overloadDevice: lift.data?.overloadDevice ?? 0,
  //     transportCharges: lift.data?.transportCharges ?? 0,
  //     otherCharges: lift.data?.otherCharges ?? 0,
  //     powerBackup: lift.data?.powerBackup ?? 0,
  //     fabricatedStructure: lift.data?.fabricatedStructure ?? 0,
  //     electricalWork: lift.data?.electricalWork ?? 0,
  //     ibeamChannel: lift.data?.ibeamChannel ?? 0,
  //     duplexSystem: lift.data?.duplexSystem ?? 0,
  //     telephonicIntercom: lift.data?.telephonicIntercom ?? 0,
  //     gsmIntercom: lift.data?.gsmIntercom ?? 0,
  //     numberLockSystem: lift.data?.numberLockSystem ?? 0,
  //     thumbLockSystem: lift.data?.thumbLockSystem ?? 0,
  //     tax: lift.data?.tax ?? 18, // Default to 18% if not provided
  //     loadPerAmt: lift.data?.loadPerAmt ?? 0,
  //     loadAmt: lift.data?.loadAmt ?? 0,

  //     truffingQty: lift.data?.truffingQty ?? "",
  //     truffingType: lift.data?.truffingType ?? "",

  //     // ardPrice: lift.data?.ardPrice ?? 0,
  //     machinePrice: lift.data?.machinePrice ?? 0,
  //     governorPrice: lift.data?.governorPrice ?? 0,
  //     truffingPrice: lift.data?.truffingPrice ?? 0,
  //     fastenerPrice: lift.data?.fastenerPrice ?? 0,
  //     installationAmount: lift.data?.installationAmount ?? "",
  //     manualPrice: lift.data?.manualPrice ?? 0,
  //     commonPrice: lift.data?.commonPrice ?? 0,
  //     otherPrice: lift.data?.otherPrice ?? 0,
  //     manualDetails: lift.data?.manualDetails ?? [],
  //     commonDetails: lift.data?.commonDetails ?? [],
  //     otherDetails: lift.data?.otherDetails ?? [],

  //     selectedMaterials: lift.selectedMaterials || [],

  //     totalAmount: lift.data?.totalAmount ?? 0,
  //     totalAmountWithoutGST: lift.data?.totalAmountWithoutGST ?? 0,
  //     totalAmountWithoutLoad: lift.data?.totalAmountWithoutLoad ?? 0,
  //     liftRate: lift.data?.liftRate ?? 0,
  //     isLiftRateManual: false,
  //     commercialTotal: lift.data?.commercialTotal ?? lift.data?.total_amt_commercial ?? 0,
  //     commercialTaxAmount: lift.data?.commercialTaxAmount ?? lift.data?.tax_amount ?? 0,
  //     commercialFinalAmount: lift.data?.commercialFinalAmount ?? lift.data?.final_amt ?? 0,

  //     fastenerType: lift.data?.fastenerType ?? "",
  //     pitDepth: lift.data?.pitDepth ?? 1500,
  //     mainSupplySystem:
  //       lift.data?.mainSupplySystem ?? "415 Volts, 3 Phase, 50HZ A.C. (By Client)",
  //     auxlSupplySystem:
  //       lift.data?.auxlSupplySystem ?? "220/230 Volts, Single Phase 50Hz A.C. (By Client)",
  //     signals:
  //       lift.data?.signals ??
  //       "Alarm Bell, Up/Dn. Direction Indicators at all landings",
  //   };


  //   // return {
  //   //   leadId: lift.lead?.leadId || "",
  //   //   leadDate: lift.lead?.leadDate || "",
  //   //   leadType: lift.lead?.leadType || "",

  //   //   enquiryId: lift.enquiryId || "",
  //   //   enquiryType: lift.enquiryType?.enquiryTypeName || "",
  //   //   enqDate: lift.enqDate || "",
  //   //   quotationId: lift.quotation?.id || "",
  //   //   liftId: lift.id || "",
  //   //   quotationDate: lift.quotation?.quotationDate || "",

  //   //   //-----------------for lift specification -------------------
  //   //   //liftQuantity: lift.data?.liftQuantity || "",
  //   //   liftQuantity: 1,
  //   //   liftType: lift.liftType?.id || "",
  //   //   typeOfLift: lift.typeOfLift?.id || "",

  //   //   capacityType: lift.capacityTerm?.id || "",
  //   //   capacityValue: lift.capacityTerm?.id === 1
  //   //     ? lift.personCapacity?.id || ""
  //   //     : lift.weight?.id || "",

  //   //   //✅ Use the calculated initial values here
  //   //   stops: initialStops,
  //   //   floors: initialFloors,
  //   //   openings: initialOpenings,

  //   //   floorDesignations: lift.floorsDesignation || "",
  //   //   floorSelections: lift.floorSelections?.map(f => f.code) || [],
  //   //   carTravel: lift.noOfFloors?.id > 0 ? (lift.noOfFloors.id - 1) * 3000 : 0,

  //   //   speed: lift.data?.speed || "",
  //   //   cabinType: lift.cabinType?.id || "",
  //   //   cabinSubType: lift.cabinSubType?.id || "",
  //   //   lightFitting: lift.data?.lightFitting || "",
  //   //   cabinFlooring: lift.data?.cabinFlooring || "",
  //   //   cabinCeiling: lift.data?.cabinCeiling || "",
  //   //   airSystem: lift.data?.airSystem || "",
  //   //   carEntrance: lift.data?.carEntrance || "",
  //   //   carEntranceSubType: lift.data?.carEntranceSubType || "",


  //   //   //landingEntrance: lift.data?.landingEntrance || "",
  //   //   //landingEntranceCount: lift.data?.landingEntranceCount || "",
  //   //   //landingEntrance2: lift.data?.landingEntrance2 || "",

  //   //   landingEntranceSubType1: lift.data?.landingEntranceSubType1 || "",
  //   //   landingEntranceSubType2: lift.data?.landingEntranceSubType2 || "",
  //   //   landingEntranceCount: lift.data?.landingEntranceCount || "",
  //   //   landingEntranceSubType2_fromFloor: lift.data?.landingEntranceSubType2_fromFloor || 0,
  //   //   landingEntranceSubType2_toFloor: lift.data?.landingEntranceSubType2_fromFloor || 0,

  //   //   //----------------for cabin design -----------------------------
  //   //   //technicalSpec1: lift.data?.technicalSpec1 || "",
  //   //   controlPanelType: lift.data?.controlPanelType || "",
  //   //   manufacture: lift.data?.manufacture || "",
  //   //   controlPanelMake: lift.data?.controlPanelMake || "",
  //   //   wiringHarness: lift.data?.wiringHarness || "",
  //   //   guideRail: lift.data?.guideRail || "",
  //   //   bracketType: lift.data?.bracketType || "",
  //   //   ropingType: lift.data?.ropingType || "",
  //   //   lopType: lift.data?.lopType || "",
  //   //   copType: lift.data?.copType || "",
  //   //   overhead: lift.data?.overhead || 4800,
  //   //   operationType: lift.data?.operationType || "",
  //   //   // machineRoom1: lift.data?.machineRoom1 || "",
  //   //   // machineRoom2: lift.data?.machineRoom2 || "",
  //   //   machineRoomDepth: lift.data?.machineRoom1 || 0,
  //   //   machineRoomWidth: lift.data?.machineRoom2 || 0,
  //   //   shaftWidth: lift.shaftsWidth || 0,
  //   //   shaftDepth: lift.shaftsDepth || 0,
  //   //   carInternalWidth: lift.carInternalWidth || 0,
  //   //   carInternalDepth: lift.carInternalDepth || 0,
  //   //   carInternalHeight: lift.data?.carInternalHeight || 2100,

  //   //   //-----------------for features ------------------------------
  //   //   // emergencyFireman: lift.data?.emergencyFireman || false,
  //   //   // emergencyCarLight: lift.data?.emergencyCarLight || false,
  //   //   // infraredDoor: lift.data?.infraredDoor || false,
  //   //   // doorTimeProtection: lift.data?.doorTimeProtection || false,
  //   //   // alarmButton: lift.data?.alarmButton || false,
  //   //   // extraDoorTime: lift.data?.extraDoorTime || false,
  //   //   // doorOpenClose: lift.data?.doorOpenClose || false,
  //   //   // manualRescue: lift.data?.manualRescue || false,
  //   //   // autoFanCut: lift.data?.autoFanCut || false,
  //   //   // overloadWarning: lift.data?.overloadWarning || false,
  //   //   // ✅ new property to track checked features
  //   //   stdFeatures: lift.features?.map((f) => f.id) || [],

  //   //   autoRescue: lift.data?.autoRescue || false,
  //   //   vfdMainDrive: lift.data?.vfdMainDrive || "",
  //   //   doorOperator: lift.data?.doorOperator || "",
  //   //   mainMachineSet: lift.data?.mainMachineSet || "",
  //   //   carRails: lift.data?.carRails || "",
  //   //   counterWeightRails: lift.data?.counterWeightRails || "",
  //   //   wireRope: lift.data?.wireRope || "",
  //   //   warrantyPeriod: lift.data?.warrantyPeriod || "",
  //   //   pwdIncludeExclude: lift.data?.pwdIncludeExclude || false,
  //   //   scaffoldingIncludeExclude: lift.data?.scaffoldingIncludeExclude || false,
  //   //   installationAmountRuleId: lift.data?.installationAmountRuleId || "",
  //   //   //totalAmount: lift.data?.totalAmount || "",

  //   //   //------------------ price-------------------
  //   //   // tab 1
  //   //   cabinPrice: lift.data?.cabinPrice || 0,
  //   //   lightFittingPrice: lift.data?.lightFittingPrice || 0,
  //   //   cabinFlooringPrice: lift.data?.cabinFlooringPrice || 0,
  //   //   cabinCeilingPrice: lift.data?.cabinCeilingPrice || 0,
  //   //   airSystemPrice: lift.data?.airSystemPrice || 0,
  //   //   carEntrancePrice: lift.data?.carEntrancePrice || 0,
  //   //   landingEntrancePrice1: lift.data?.landingEntranceSubType1Price || 0,
  //   //   landingEntrancePrice2: lift.data?.landingEntranceSubType2Price || 0,

  //   //   // tab 2
  //   //   controlPanelTypePrice: lift.data?.controlPanelTypePrice || 0,
  //   //   wiringHarnessPrice: lift.data?.wiringHarnessPrice || 0,
  //   //   guideRailPrice: lift.data?.guideRailPrice || 0,
  //   //   bracketTypePrice: lift.data?.bracketTypePrice || "",
  //   //   wireRopePrice: lift.data?.wireRopePrice || 0,
  //   //   ropingTypePrice: lift.data?.ropingTypePrice || 0,
  //   //   lopTypePrice: lift.data?.lopTypePrice || "",
  //   //   copTypePrice: lift.data?.copTypePrice || "",

  //   //   // tab 4
  //   //   pwdAmount: lift.data?.pwdAmount || 0,
  //   //   bambooScaffolding: lift.data?.bambooScaffolding || 0,
  //   //   ardAmount: lift.data?.ardAmount || 0,
  //   //   overloadDevice: lift.data?.overloadDevice || 0,
  //   //   transportCharges: lift.data?.transportCharges || 0,
  //   //   otherCharges: lift.data?.otherCharges || 0,
  //   //   powerBackup: lift.data?.powerBackup || 0,
  //   //   fabricatedStructure: lift.data?.fabricatedStructure || 0,
  //   //   electricalWork: lift.data?.electricalWork || 0,
  //   //   ibeamChannel: lift.data?.ibeamChannel || 0,
  //   //   duplexSystem: lift.data?.duplexSystem || 0,
  //   //   telephonicIntercom: lift.data?.telephonicIntercom || 0,
  //   //   gsmIntercom: lift.data?.gsmIntercom || 0,
  //   //   numberLockSystem: lift.data?.numberLockSystem || 0,
  //   //   thumbLockSystem: lift.data?.thumbLockSystem || 0,

  //   //   truffingQty: lift.data?.truffingQty || "",
  //   //   truffingType: lift.data?.truffingType || "",

  //   //   //----------internal calculation price--------
  //   //   ardPrice: lift.data?.ardPrice || 0,
  //   //   machinePrice: lift.data?.machinePrice || 0,
  //   //   governorPrice: lift.data?.governorPrice || 0,
  //   //   truffingPrice: lift.data?.truffingPrice || 0,
  //   //   fastenerPrice: lift.data?.fastenerPrice || 0,
  //   //   installationAmount: lift.data?.installationAmount || "",
  //   //   manualPrice: lift.data?.manualPrice || 0,


  //   //   totalAmount: lift.data?.totalAmount || 0,
  //   //   liftRate: lift.data?.liftRate || 0,
  //   //   commercialTotal: lift.data?.total_amt_commercial || 0, // new commercial calc
  //   //   commercialTaxAmount: lift.data?.tax_amount || 0,
  //   //   commercialFinalAmount: lift.data?.final_amt || 0,
  //   //   //-----extra ---------------------------------
  //   //   fastenerType: lift.data?.fastenerType || "",
  //   //   pitDepth: 1500,
  //   //   mainSupplySystem: lift.data?.mainSupplySystem || "415 Volts, 3 Phase, 50HZ A.C. (By Client)",
  //   //   auxlSupplySystem: lift.data?.auxlSupplySystem || "220/230 Volts, Single Phase 50Hz A.C. (By Client)",
  //   //   signals: lift.data?.signals || "Alarm Bell, Up/Dn. Direction Indicators at all landings",
  //   // };
  // });

  // Generic handler for most fields
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (onUserActivity) onUserActivity();

    setFormData((prev) => {
      let updated = { ...prev, [name]: value };

      // ✅ Reset dependent field if capacityType changes
      if (name === "capacityType") {
        updated.capacityValue = ""; // clear capacityValue
      }

      if (name === "liftRate") {
        isLiftRateManual: true;
      }

      // ✅ Validation: Car Internal Depth must be < Shaft Depth
      if (name === "carInternalDepth") {
        const carDepth = parseInt(value) || 0;
        const shaftDepth = parseInt(prev.shaftDepth) || 0;

        if (carDepth >= shaftDepth && shaftDepth > 0) {
          toast.error(
            "Car Internal depth size must be less than Shaft depth size. Please Enter Correct Size"
          );
          updated.carInternalDepth = ""; // reset invalid value
        } else {
          // ✅ Auto-fill defaults if validation passes
          updated.carInternalHeight = 2100;
          updated.pitDepth = 1500;
          updated.mainSupplySystem = "415 Volts, 3 Phase, 50HZ A.C. (By Client)";
          updated.auxlSupplySystem =
            "220/230 Volts, Single Phase 50Hz A.C. (By Client)";
          updated.signals =
            "Alarm Bell, Up/Dn. Direction Indicators at all landings";
        }
      }

      if (name === "ardAmount") {
        const ardValue = parseFloat(value) || 0;
        const existingMaterials = prev.selectedMaterials || [];
        let updatedMaterials = [...existingMaterials];

        // Check if ARD already exists
        const existingArdIndex = updatedMaterials.findIndex(
          (item) => item.materialType?.toLowerCase().includes("ARD (Manual Entry)".toLowerCase())
        );

        // Create new ARD material
        const newArdMaterial = {
          id: existingArdIndex !== -1 ? updatedMaterials[existingArdIndex].id : undefined,
          leadId: prev.leadId,
          quotationLiftDetailId: prev.quotationId,
          materialId: 0, // Because this is user-entered, not from API
          materialName: "Manual ARD Amount",
          matrialDisplayName: "Manual ARD Amount",
          quantity: 1,
          quantityUnit: "",
          price: ardValue,
          operatorType: prev.liftType,
          materialType: "ARD (Manual Entry)",
        };

        // If ARD already exists, update it; else push it
        if (existingArdIndex !== -1) {
          updatedMaterials[existingArdIndex] = newArdMaterial;
        } else {
          updatedMaterials.push(newArdMaterial);
        }

        updated.selectedMaterials = updatedMaterials;
      }

      return updated;
    });

    setErrors((prevErrors) => {
      if (!prevErrors[name]) return prevErrors;
      const updatedErrors = { ...prevErrors };
      delete updatedErrors[name];
      return updatedErrors;
    });
  };

  // const handleChange = (e) => {
  //   const { name, value } = e.target;

  //   setFormData((prev) => {
  //     // if capacityType is changed, reset capacityValue
  //     if (name === "capacityType") {
  //       return {
  //         ...prev,
  //         [name]: value,
  //         capacityValue: "", // 👈 clear capacityValue
  //       };
  //     }

  //     return {
  //       ...prev,
  //       [name]: value,
  //     };
  //   });
  // };


  // Dedicated handler for checkboxes
  const handleCheckbox = (id) => {
    if (onUserActivity) onUserActivity();

    setFormData((prev) => {
      const currentSelections = prev.floorSelections || [];
      console.log(currentSelections, "<<<currentSelections");
      const updatedSelections = currentSelections.includes(id)
        ? currentSelections.filter((f) => f !== id)
        : [...currentSelections, id];
      console.log(updatedSelections, "<<<updatedSelections");
      return { ...prev, floorSelections: updatedSelections };
    });
  };

  // Memoized calculations for all derived values
  const calculations = useMemo(() => {
    const {
      capacityType,
      capacityValue,
      floors,
      //floors: baseFloors,
      floorSelections,
      speed,
      cabinType,
      lightFitting,
      cabinFlooring,
      cabinCeiling,
      airSystem,
      //airSystemPrice,
      carDoorSubType,

      controlPanelType,
      wiringHarnessPrice,
      carEntranceSubType,
      guideRail,
      bracketType,
      ropingType,
      lopType,
      copType,

      liftRate,
      liftQuantity,
      pwdAmount,
      bambooScaffolding,
      ardAmount,
      overloadDevice,
      transportCharges,
      otherCharges,
      powerBackup,
      fabricatedStructure,
      installationAmount,
      electricalWork,
      ibeamChannel,
      duplexSystem,
      telephonicIntercom,
      gsmIntercom,
      numberLockSystem,
      thumbLockSystem,
      //...rest
    } = formData;

    const tabKeys = {
      tab1: [
        "cabinPrice",
        "lightFittingPrice",
        "cabinFlooringPrice",
        "cabinCeilingPrice",
        "airSystemPrice",
        "carEntrancePrice",
        "landingEntrancePrice1",
        "landingEntrancePrice2",
      ],
      tab2: [
        "controlPanelTypePrice",
        "guideRailPrice",
        "bracketTypePrice",
        "wireRopePrice",
        "lopTypePrice",
        "copTypePrice",
      ],
      tab3: [], // no price fields yet
      tab4: [
        "liftRate",
        "pwdAmount",
        "bambooScaffolding",
        "ardAmount",
        "overloadDevice",
        "transportCharges",
        "otherCharges",
        "powerBackup",
        "fabricatedStructure",
        "installationAmount",
        "electricalWork",
        "ibeamChannel",
        "duplexSystem",
        "telephonicIntercom",
        "gsmIntercom",
        "numberLockSystem",
        "thumbLockSystem",
      ],
    };

    // ✅ Generic helper to calculate total for any tab
    const calcTabTotal = (keys) =>
      keys.reduce((sum, key) => sum + Number(formData[key] || 0), 0);

    // ✅ Combine all tab keys to find duplicates
    const allTabKeys = Object.values(tabKeys).flat();
    const duplicateKeys = allTabKeys.filter((key) =>
      liftRatePriceKeys.includes(key)
    );

    // ✅ Duplicate sum
    const duplicateSum = duplicateKeys.reduce(
      (sum, key) => sum + Number(formData[key] || 0),
      0
    );

    console.log(" ====> ", calcTabTotal(tabKeys.tab4), " - ", duplicateSum)

    // ✅ Calculate each tab total using the helper
    const tab1Total = calcTabTotal(tabKeys.tab1);
    const tab2Total = calcTabTotal(tabKeys.tab2);
    const tab3Total = calcTabTotal(tabKeys.tab3);
    const tab4Total = calcTabTotal(tabKeys.tab4);



    // ✅ Final total (avoid double counting)
    const grandTotal =
      tab1Total + tab2Total + tab3Total + tab4Total - duplicateSum;


    console.log(grandTotal, " = ", tab1Total, " + ", tab2Total, " + ", tab3Total, " + ", tab4Total)

    return {
      //stops,
      //openings,
      //carTravel,
      //airSystemPrice,
      tabTotals: { tab1: tab1Total, tab2: tab2Total, tab3: tab3Total, tab4: tab4Total },
      grandTotal,
    };
  }, [formData, initialOptions]);


  useEffect(() => {
    const loadAirSystemPrice = async () => {
      if (!formData.airType || !formData.capacityType || !formData.capacityValue) return;

      const result = await fetchAirSystemPrice({
        airTypeId: formData.airType,
        capacityTypeId: formData.capacityType,
        personId: formData.capacityType === 1 ? formData.capacityValue : null,
        weightId: formData.capacityType === 2 ? formData.capacityValue : null,
        // setErrors,
      });

      if (!result.success) {
        const message = result.message;
        setErrors((prev) => ({ ...prev, airSystemPrice: message }));
        toast.error(message);
      } else {
        // Clear the error on success
        setErrors((prev) => {
          const updated = { ...prev };
          delete updated.airSystemPrice;
          return updated;
        });
      }

      setFormData((prev) => ({
        ...prev,
        airSystem: result.airSystemId,
        airSystemPrice: result.price,
      }));

      if (!result.success) {
        toast.error(result.message);
      }
    };

    loadAirSystemPrice();
  }, [formData.airType, formData.capacityType, formData.capacityValue]);



  // useEffect(() => {
  //   // keep formData.airSystemPrice in sync with calculations.airSystemPrice
  //   setFormData((prev) => {
  //     if (prev.airSystemPrice === calculations.airSystemPrice) return prev; // avoid infinite loop
  //     return { ...prev, airSystemPrice: calculations.airSystemPrice };
  //   });
  // }, [calculations.airSystemPrice, setFormData]);

  // const derivedValues = useMemo(() => {
  //   const stops = formData.noOfStops
  //     ? Number(formData.noOfStops)
  //     : Number(formData.floors) || 0;

  //   const openings = formData.noOfOpenings
  //     ? Number(formData.noOfOpenings)
  //     : stops;

  //   const carTravel = formData.floors > 0 ? (formData.floors - 1) * 3000 : 0;

  //   return { stops, openings, carTravel };
  // }, [formData.floors, formData.noOfStops, formData.noOfOpenings]);

  return { formData, setFormData, handleChange, handleCheckbox, calculations };
}



// function getAirSystemPrice(airTypeId, capacityType, capacityValue, options) {
//   console.log(",airTypeId, capacityType, capacityValue, options", airTypeId, capacityType, capacityValue, options);
//   if (!airTypeId || !capacityType || !capacityValue || !options) return 0;

//   const option = options.find((opt) => {
//     // match air system
//     if (String(opt.airTypeId) !== String(airTypeId)) return false;

//     // match capacity depending on type
//     if (String(capacityType) === "1") {
//       // Person
//       return String(opt.personCapacityId) === String(capacityValue);
//     } else if (String(capacityType) === "2") {
//       // Weight
//       return String(opt.weightId) === String(capacityValue);
//     }

//     return false;
//   });

//   return option?.price || 0;
// }


// ----------------------------------------------------
//Helper function to find price from options array
// ----------------------------------------------------



