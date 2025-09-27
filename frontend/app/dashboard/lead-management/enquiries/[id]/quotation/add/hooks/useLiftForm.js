import { useState, useMemo, useEffect } from "react";
import toast from "react-hot-toast";
import { fetchAirSystemPrice, getOptionPrice } from "../liftService";

// ----------------------------------------------------
// Custom hook to handle form state and calculations
// ----------------------------------------------------
export default function useLiftForm(lift, initialOptions) {


  const [formData, setFormData] = useState(() => {
    // Determine initial floors from the lift object.
    const initialFloors = lift.noOfFloors?.id || "";

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
      //-----------------for lift specification -------------------
      //liftQuantity: lift.data?.liftQuantity || "",
      leadType: lift.lead?.leadType || "",
      liftQuantity: 1,
      liftType: lift.liftType?.id || "",
      typeOfLift: lift.typeOfLift?.id || "",

      capacityType: lift.capacityTerm?.id || "",
      capacityValue: lift.capacityTerm?.id === 1
        ? lift.personCapacity?.id || ""
        : lift.weight?.id || "",

      //✅ Use the calculated initial values here
      stops: initialStops,
      floors: initialFloors,
      openings: initialOpenings,

      floorDesignations: lift.floorsDesignation || "",
      floorSelections: lift.floorSelections?.map(f => f.code) || [],
      carTravel: lift.noOfFloors?.id > 0 ? (lift.noOfFloors.id - 1) * 3000 : 0,

      speed: lift.data?.speed || "",
      cabinType: lift.cabinType?.id || "",
      cabinSubType: lift.cabinSubType?.id || "",
      lightFitting: lift.data?.lightFitting || "",
      cabinFlooring: lift.data?.cabinFlooring || "",
      cabinCeiling: lift.data?.cabinCeiling || "",
      airSystem: lift.data?.airSystem || "",
      carEntrance: lift.data?.carEntrance || "",
      carEntranceSubType: lift.data?.carEntranceSubType || "",


      //landingEntrance: lift.data?.landingEntrance || "",
      //landingEntranceCount: lift.data?.landingEntranceCount || "",
      //landingEntrance2: lift.data?.landingEntrance2 || "",

      landingEntranceSubType1: lift.data?.landingEntranceSubType1 || "",
      landingEntranceSubType2: lift.data?.landingEntranceSubType2 || "",
      landingEntranceCount: lift.data?.landingEntranceCount || "",
      landingEntranceSubType2_fromFloor: lift.data?.landingEntranceSubType2_fromFloor || 0,
      landingEntranceSubType2_toFloor: lift.data?.landingEntranceSubType2_fromFloor || 0,

      //----------------for cabin design -----------------------------
      //technicalSpec1: lift.data?.technicalSpec1 || "",
      controlPanelType: lift.data?.controlPanelType || "",
      manufacture: lift.data?.manufacture || "",
      controlPanelMake: lift.data?.controlPanelMake || "",
      wiringHarness: lift.data?.wiringHarness || "",
      guideRail: lift.data?.guideRail || "",
      bracketType: lift.data?.bracketType || "",
      ropingType: lift.data?.ropingType || "",
      lopType: lift.data?.lopType || "",
      copType: lift.data?.copType || "",
      overhead: lift.data?.overhead || 4800,
      operationType: lift.data?.operationType || "",
      // machineRoom1: lift.data?.machineRoom1 || "",
      // machineRoom2: lift.data?.machineRoom2 || "",
      machineRoomDepth: lift.data?.machineRoom1 || 0,
      machineRoomWidth: lift.data?.machineRoom2 || 0,
      shaftWidth: lift.shaftsWidth || 0,
      shaftDepth: lift.shaftsDepth || 0,
      carInternalWidth: lift.carInternalWidth || 0,
      carInternalDepth: lift.carInternalDepth || 0,
      carInternalHeight: lift.data?.carInternalHeight || 2100,

      //-----------------for features ------------------------------
      // emergencyFireman: lift.data?.emergencyFireman || false,
      // emergencyCarLight: lift.data?.emergencyCarLight || false,
      // infraredDoor: lift.data?.infraredDoor || false,
      // doorTimeProtection: lift.data?.doorTimeProtection || false,
      // alarmButton: lift.data?.alarmButton || false,
      // extraDoorTime: lift.data?.extraDoorTime || false,
      // doorOpenClose: lift.data?.doorOpenClose || false,
      // manualRescue: lift.data?.manualRescue || false,
      // autoFanCut: lift.data?.autoFanCut || false,
      // overloadWarning: lift.data?.overloadWarning || false,
      // ✅ new property to track checked features
      selectedFeatures: lift.features?.map((f) => f.id) || [],

      autoRescue: lift.data?.autoRescue || false,
      vfdMainDrive: lift.data?.vfdMainDrive || "",
      doorOperator: lift.data?.doorOperator || "",
      mainMachineSet: lift.data?.mainMachineSet || "",
      carRails: lift.data?.carRails || "",
      counterWeightRails: lift.data?.counterWeightRails || "",
      wireRope: lift.data?.wireRope || "Usha Martine",
      warrantyPeriod: lift.data?.warrantyPeriod || "",
      liftRate: lift.data?.liftRate || "",
      pwdIncludeExclude: lift.data?.pwdIncludeExclude || false,
      pwdAmount: lift.data?.pwdAmount || "",
      scaffoldingIncludeExclude: lift.data?.scaffoldingIncludeExclude || false,
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
      //totalAmount: lift.data?.totalAmount || "",

      //------------------ price-------------------
      cabinPrice: lift.data?.cabinPrice || 0,
      lightFittingPrice: lift.data?.lightFittingPrice || 0,
      cabinFlooringPrice: lift.data?.cabinFlooringPrice || 0,
      cabinCeilingPrice: lift.data?.cabinCeilingPrice || 0,
      airSystemPrice: lift.data?.airSystemPrice || 0,
      carEntrancePrice: lift.data?.carEntrancePrice || 0,
      landingEntrancePrice1: lift.data?.landingEntranceSubType1Price || 0,
      landingEntrancePrice2: lift.data?.landingEntranceSubType2Price || 0,

      controlPanelTypePrice: lift.data?.controlPanelTypePrice || 0,
      wiringHarnessPrice: lift.data?.wiringHarnessPrice || 0,
      guideRailPrice: lift.data?.guideRailPrice || 0,
      bracketTypePrice: lift.data?.bracketTypePrice || "",
      wireRopePrice: lift.data?.wireRopePrice || 0,
      ropingTypePrice: lift.data?.ropingTypePrice || 0,
      lopTypePrice: lift.data?.lopTypePrice || "",
      copTypePrice: lift.data?.copTypePrice || "",
      //----------internal calculation price--------
      ardPrice: lift.data?.ardPrice || 0,
      machinePrice: lift.data?.machinePrice || 0,
      governorPrice: lift.data?.governorPrice || 0,
      truffingPrice: lift.data?.truffingPrice || 0,
      totalAmount: lift.data?.totalAmount || 0,
      fastenerPrice: lift.data?.fastenerPrice || 0,
      //-----extra ---------------------------------
      fastenerType: lift.data?.fastenerType || "",
      pitDepth: 1500,
      mainSupplySystem: lift.data?.mainSupplySystem || "",
      auxlSupplySystem: lift.data?.auxlSupplySystem || "",
      signals: lift.data?.signals || "",

    };
  });

  // Generic handler for most fields
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      let updated = { ...prev, [name]: value };

      // ✅ Reset dependent field if capacityType changes
      if (name === "capacityType") {
        updated.capacityValue = ""; // clear capacityValue
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

      return updated;
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
  const handleCheckbox = (floor) => {
    setFormData((prev) => {
      const currentSelections = prev.floorSelections || [];
      const updatedSelections = currentSelections.includes(floor)
        ? currentSelections.filter((f) => f !== floor)
        : [...currentSelections, floor];
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

    // const airSystemPrice = getAirSystemPrice(formData.airSystem, formData.capacityType, formData.capacityValue, initialOptions.airSystemPrices);
    //console.log("=====airSystemPrice===========", airSystemPrice);

    // Tab-wise total calculations
    const tab1Total =
      //getOptionPrice(speed, initialOptions.speeds) +
      getOptionPrice(cabinType, initialOptions.cabinTypes) +
      getOptionPrice(lightFitting, initialOptions.lightFittings) +
      getOptionPrice(cabinFlooring, initialOptions.cabinFlooring) +
      getOptionPrice(cabinCeiling, initialOptions.cabinCeiling, "ceilingId") +
      getOptionPrice(formData.carEntranceSubType, initialOptions.carEntranceSubTypes) +
      (formData.airSystemPrice || 0);

    // Tab 2 total calculation
    // formData.wiringHarnessPrice = getwiringHarnessPrice(floors, initialOptions.wiringHarness);

    const tab2Total =
      getOptionPrice(controlPanelType, initialOptions.controlPanelTypes) +
      // formData.wiringHarnessPrice +
      getOptionPrice(formData.guideRail, initialOptions.guideRail) +
      getOptionPrice(formData.bracketType, initialOptions.bracketTypes) +
      getOptionPrice(formData.ropingType, initialOptions.wireRopes) +
      getOptionPrice(formData.lopType, initialOptions.lopTypes) +
      getOptionPrice(formData.copType, initialOptions.copTypes)
      ; // No price-based fields in Tab 2

    const tab3Total = 0; // No price-based fields in Tab 3

    const tab4Total =
      Number(liftRate || 0) +
      Number(liftQuantity || 0) +
      Number(pwdAmount || 0) +
      Number(bambooScaffolding || 0) +
      Number(ardAmount || 0) +
      Number(overloadDevice || 0) +
      Number(transportCharges || 0) +
      Number(otherCharges || 0) +
      Number(powerBackup || 0) +
      Number(fabricatedStructure || 0) +
      Number(installationAmount || 0) +
      Number(electricalWork || 0) +
      Number(ibeamChannel || 0) +
      Number(duplexSystem || 0) +
      Number(telephonicIntercom || 0) +
      Number(gsmIntercom || 0) +
      Number(numberLockSystem || 0) +
      Number(thumbLockSystem || 0);

    const grandTotal = tab1Total + tab2Total + tab3Total + tab4Total;

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
      if (!formData.airSystem || !formData.capacityType || !formData.capacityValue) return;

      const result = await fetchAirSystemPrice({
        airTypeId: formData.airSystem,
        capacityTypeId: formData.capacityType,
        personId: formData.capacityType === 1 ? formData.capacityValue : null,
        weightId: formData.capacityType === 2 ? formData.capacityValue : null,
      });

      setFormData((prev) => ({
        ...prev,
        airSystemPrice: result.price,
      }));

      if (!result.success) {
        toast.error(result.message);
      }
    };

    loadAirSystemPrice();
  }, [formData.airSystem, formData.capacityType, formData.capacityValue]);



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



