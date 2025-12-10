import axiosInstance from "@/utils/axiosInstance";
import { API_ENDPOINTS } from "@/utils/apiEndpoints";
import { toast } from "react-hot-toast";

// 🔹 Prices based on liftType, capacityType, capacityValue, typeOfLift
// export const calculateLiftMaterialPrices = async ({ liftType, capacityType, capacityValue, typeOfLift, cabinType }) => {
export const calculateLiftMaterialPrices = async ({ liftType, capacityType, capacityValue, typeOfLift, floors, leadID, existingItem, existingArd, existingArdAmount, setErrors }) => {
  try {
    console.log("==========existingArdAmount====2222========>", existingArdAmount);
    const [ardResult, machineResult, cabinPrice] = await Promise.all([
      fetchArdPrice(liftType, capacityType, capacityValue, leadID, existingArd, existingArdAmount, setErrors),
      fetchMachinePrice(liftType, capacityType, capacityValue, typeOfLift, floors, leadID, existingItem, setErrors),
      //fetchCabinPrice(cabinType, capacityType, capacityValue),
    ]);

    const ardPrice = ardResult.price; // Capture the price
    const ardMaterial = ardResult.ardMaterial; // ✅ Capture the material object

    const machinePrice = machineResult.price;
    const machineMaterial = machineResult.machineMaterial;

    //const totalAmount = ardPrice + machinePrice + cabinPrice;
    //const totalAmount = ardPrice + machinePrice;
    const totalAnt = ardPrice + machinePrice;

    //return { ardPrice, machinePrice, cabinPrice, totalAmount };
    return { ardPrice, machinePrice, totalAnt, machineMaterial, ardMaterial };
  } catch (err) {
    console.error("Lift material price fetch error:", err);
    // return { ardPrice: 0, machinePrice: 0, cabinPrice: 0, totalAmount: 0 };
    return { ardPrice: 0, machinePrice: 0, totalAmount: 0, machineMaterial: null, ardMaterial: null };
  }
};


// 🔹 Prices based on floorDesignations
export const calculateFloorPrices = async (floorDesignations, floors, setErrors) => {
  try {
    const [harnessResult, governorResult, truffingResult] = await Promise.all([
      fetchHarnessPrice(floorDesignations, setErrors),
      fetchGovernorRopePriceByNm(floorDesignations, setErrors),
      calculateTruffingPrice(floors, setErrors),
    ]);

    // Extract materials
    const harnessMaterial = harnessResult.material || null;
    const governorMaterial = governorResult.material || null;
    const truffingMaterial = truffingResult.material || null;

    // Extract prices
    const harnessPrice = harnessResult.price || 0;
    const governorPrice = governorResult.price || 0;

    // Truffing logic
    // let truffingPrice = 0;
    // if (floorDesignations?.startsWith("G+")) {
    //   const floorNum = parseInt(floorDesignations.replace("G+", ""), 10);
    //   if (!isNaN(floorNum)) {
    //     const qty = 9 + (floorNum - 1) * 2;
    //     truffingPrice = qty * 0; // update when API gives unit price
    //   }
    // }


    // const floorNum = floors > 1 ? floors - 1 : 1;
    // const qty = 9 + (floorNum - 1) * 2;
    // truffingPrice = qty * 0; // update when API gives unit price

    const truffingPrice = truffingResult.price;
    // Extract truffing details
    const truffingQty = truffingResult.qty;
    const truffingType = truffingResult.type;

    const totalAmount = harnessPrice + governorPrice + truffingPrice;

    return { harnessPrice, governorPrice, truffingPrice, truffingQty, truffingType, totalAmount, harnessMaterial, governorMaterial, truffingMaterial };
  } catch (err) {
    console.error("Floor price fetch error:", err);
    return {
      harnessPrice: 0, governorPrice: 0, truffingPrice: 0, totalAmount: 0,
      harnessMaterial: null, governorMaterial: null, truffingMaterial: null
    };
  }
};


const evaluateRule = (rule, floor) => {
  try {
    const expression = rule.replaceAll("floor", floor);
    // eslint-disable-next-line no-new-func
    return new Function(`return ${expression}`)();
  } catch (err) {
    console.error("Error evaluating ruleExpression:", err);
    return 0;
  }
};

const fetchOtherMaterialsByMainId = async (mainId, setErrors) => {
  try {
    const res = await axiosInstance.get(`${API_ENDPOINTS.OTHER_MATERIAL}/byMainId/${mainId}`);
    // res.data contains the ApiResponse { success, message, data }

    if (setErrors) setErrors((prev) => {
      const updated = { ...prev };
      delete updated.otherMaterials;
      return updated;
    });

    return res.data;
  } catch (err) {
    console.error("Failed to fetch Other Materials by mainId", err);
    if (setErrors) setErrors((prev) => ({ ...prev, otherMaterials: "Failed to fetch Other Materials" }));
    return {
      success: false,
      message: "Error fetching Other Materials",
      data: null,
    };
  }
};

const calculateTruffingPrice = async (floors, setErrors) => {
  // 1. Get the target floor count
  const floorNumber = Number(floors);
  if (!floorNumber) return { price: 0, qty: 0, type: "", error: "Invalid floor number" };

  const targetFloor = floorNumber > 1 ? floorNumber - 1 : 1;

  // 2. Fetch Other Material rule for mainId = 1
  // Assuming fetchOtherMaterialsByMainId also returns a standard object (e.g., {success, data})
  const response = await fetchOtherMaterialsByMainId(1, setErrors);

  if (response.success && Array.isArray(response.data) && response.data.length > 0) {
    const material = response.data[0];
    const ruleExpression = material.otherMaterialMainRule;
    const basePrice = material.price || 0;

    if (ruleExpression) {
      const quantity = evaluateRule(ruleExpression, targetFloor);
      const truffingPrice = quantity * basePrice;
      const unitPrice = quantity > 0 ? truffingPrice / quantity : 0;

      const truffingMaterial = {
        // id, leadId, quotationLiftDetailId will be set in fetchFloorPrices
        materialId: material.id,
        materialName: material.otherMaterialName,
        materialDisplayName: material.otherMaterialDisplayName || material.otherMaterialName,
        quantity: quantity,
        quantityUnit: "",
        unitPrice: unitPrice,
        price: truffingPrice,
        materialType: "Truffing",
      };

      // Success, clear any potential previous errors related to truffing
      if (setErrors) setErrors((prev) => {
        const updated = { ...prev };
        delete updated.truffingPrice;
        return updated;
      });

      return {
        price: truffingPrice,
        qty: quantity,
        type: material.otherMaterialName,
        material: truffingMaterial,
        error: null
      };
    }
  }

  // Default/Error return
  const message = "Truffing price rule not found or calculation failed.";
  if (setErrors) setErrors((prev) => ({ ...prev, truffingPrice: message }));

  return { price: 0, qty: 0, type: "", material: null, error: message };
};

// export const calculateLiftAmounts = async (formData) => {
//   const { liftType, capacityType, capacityValue, floorDesignations, typeOfLift, cabinType, floors } = formData;

//   console.log("------in calculations-------->", formData);

//   try {

//     const [ardPrice, machinePrice, cabinPrice, governorPrice, harnessPrice] = await Promise.all([
//       fetchArdPrice(liftType, capacityType, capacityValue),
//       fetchMachinePrice(liftType, capacityType, capacityValue, typeOfLift),
//       fetchCabinPrice(cabinType, capacityType, capacityValue),
//       //fetchGovernorRopePrice(floors, floorDesignations),
//       fetchGovernorRopePriceByNm(floorDesignations),
//       fetchHarnessPrice(floorDesignations),
//     ]);


//     // Truffing logic
//     let truffingPrice = 0;
//     if (floorDesignations?.startsWith("G+")) {
//       const floorNum = parseInt(floorDesignations.replace("G+", ""), 10);
//       if (!isNaN(floorNum)) {
//         const qty = 9 + (floorNum - 1) * 2;
//         truffingPrice = qty * 0; // update when API gives unit price
//       }
//     }

//     // Total
//     const totalAmount =
//       ardPrice + machinePrice + harnessPrice + governorPrice + cabinPrice + truffingPrice;
//     console.log("=====totalAmount======>", totalAmount);

//     return {
//       ardPrice,
//       machinePrice,
//       harnessPrice,
//       governorPrice,
//       cabinPrice,
//       truffingPrice,
//       totalAmount,
//     };
//   } catch (err) {
//     console.error("Calculation fetch error:", err);
//     return {
//       ardPrice: 0,
//       machinePrice: 0,
//       harnessPrice: 0,
//       governorPrice: 0,
//       cabinPrice: 0,
//       truffingPrice: 0,
//       totalAmount: 0,
//     };
//   }
// };


// Helper to fetch ARD Price


const fetchArdPrice = async (liftType, capacityType, capacityValue, leadID, existingArd, existingArdAmount, setErrors) => {
  try {
    const res = await axiosInstance.get(
      API_ENDPOINTS.ARD_DEVICE + "/searchByOperatorAndCapacity",
      {
        params: {
          operatorId: liftType,
          capacityTypeId: capacityType,
          capacityValueId: capacityValue,
        },
      }
    );

    const apiRes = res.data;
    console.log("==========existingArdAmount============>", existingArdAmount);
    console.log(existingArd, "===apiRes= ard==>", apiRes);

    if (apiRes.success && Array.isArray(apiRes.data) && apiRes.data.length > 0) {
      const ard = apiRes.data[0];
      const newCalculatedPrice = ard.price || 0; // Price calculated from API

      // --- 🎯 New Logic to Preserve Existing Price ---
      let finalPrice = newCalculatedPrice;

      if (
        // existingArd && 
        // existingArd.materialId === ard.id && // Ensure material ID matches the API result
        // existingArd.price > 0 
        existingArdAmount > 0 && existingArdAmount != newCalculatedPrice
      ) {
        // If the material is the same and a price already exists (from the copy), use it.
        // This preserves manually entered/copied prices.
        // finalPrice = existingArd.price; 
        finalPrice = existingArdAmount;
      }

      // 1. Create the ARD material object
      const ardMaterial = {
        id: existingArd?.id || null,

        leadId: existingArd?.leadId || leadID || null,
        quotationLiftDetailId: existingArd?.quotationLiftDetailId || null,

        materialId: ard.id,
        materialName: ard.ardDevice, // Assuming the name field is ardDeviceName

        materialDisplayName: ard.ardDevice,
        quantity: 1, // ARD is typically a quantity of 1
        quantityUnit: "",
        unitPrice: finalPrice,
        price: finalPrice,
        operatorType: existingArd?.operatorId || liftType,
        materialType: "ARD", // Use a distinct materialType
      };

      // ✅ Clear previous error if exists
      if (setErrors) setErrors((prev) => {
        const updated = { ...prev };
        delete updated.ardAmount;
        return updated;
      });

      // 2. Return the price AND the material object
      return { price: finalPrice, ardMaterial: ardMaterial };
    }

    const message = apiRes.message || "No ARD devices found for given criteria";
    toast.warning(message);

    // Add error to form state
    if (setErrors) setErrors((prev) => ({ ...prev, ardAmount: message }));

    return { price: 0, ardMaterial: null };
  } catch (error) {
    const message = "No ARD amount found. Please check the availability.";
    toast.error(message);

    if (setErrors) setErrors((prev) => ({ ...prev, ardAmount: message }));

    return { price: 0, ardMaterial: null };
  }
};

const fetchMachinePrice = async (liftType, capacityType, capacityValue, typeOfLift, floors, leadID, existingItem, setErrors) => {
  try {

    // const res = await axiosInstance.get(
    //   API_ENDPOINTS.OTHER_MATERIAL + "/searchMachineByLiftType_Operator_Capacity_Floors",
    //   {
    //     params: {
    //       operatorId: liftType,
    //       capacityTypeId: capacityType,
    //       capacityValueId: capacityValue,
    //       typeOfLift: typeOfLift,
    //       floors: floors,
    //     },
    //   }
    // );


    const res = await axiosInstance.get(
      API_ENDPOINTS.OTHER_MATERIAL + "/searchMachineByCapacity_LiftType_MainType",
      {
        params: {
          capacityTypeId: capacityType,
          capacityValueId: capacityValue,
          typeOfLift: typeOfLift,
          materialMainType: "Machines",
        },
      }
    );


    const apiRes = res.data;
    console.log("===apiRes=other material==>", apiRes);

    if (apiRes.success && Array.isArray(apiRes.data) && apiRes.data.length > 0) {
      const price = apiRes.data[0].price || 0;



      const machine = apiRes.data[0];

      console.log(machine, "---------existingMachineSelectedMaterials--------", existingItem);

      const unitPrice = machine.quantity > 0 ? machine.price / machine.quantity : 0;

      const newMachineSelectedMaterials = {
        // Preserve existing DB ID for UPDATE, otherwise set to null for INSERT
        id: existingItem?.id || null,

        leadId: existingItem?.leadId || leadID || null,
        quotationLiftDetailId: existingItem?.quotationLiftDetailId || null,
        materialId: machine.id,
        materialName: machine.otherMaterialName,
        materialDisplayName: machine.otherMaterialDisplayName || machine.otherMaterialName,
        // materialName: machine.otherMaterialName +" / "+ machine.otherMaterialDisplayName,
        quantity: machine.quantity,
        quantityUnit: "",
        unitPrice: unitPrice,
        price: (machine.quantity * machine.price) || 0,
        operatorType: existingItem?.operatorType || liftType,
        materialType: "Machine", // Use the exact string "Fastener"
      };

      console.log("---------newMachineSelectedMaterials--------", newMachineSelectedMaterials);




      // ✅ Clear previous error if exists
      if (setErrors) setErrors((prev) => {
        const updated = { ...prev };
        delete updated.machinePrice;
        return updated;
      });

      return {
        price: price,
        machineMaterial: newMachineSelectedMaterials
      };
    }

    const message = apiRes.message || `No material found for ${liftType}-${capacityValue}-${typeOfLift}`;
    toast.warning(message);

    if (setErrors) setErrors((prev) => ({ ...prev, machinePrice: message }));

    return { price: 0, machineMaterial: null };
  } catch (error) {
    const message = "No machine price found. Please check the availability.";
    toast.error(message);

    if (setErrors) setErrors((prev) => ({ ...prev, machinePrice: message }));

    return { price: 0, machineMaterial: null };
  }
};

const fetchHarnessPrice = async (floorDesignations, setErrors) => {
  try {
    const res = await axiosInstance.get(
      API_ENDPOINTS.HARNESS + "/searchByFloorDesignation",
      {
        params: {
          floorDesignations: floorDesignations,
        },
      }
    );

    const apiRes = res.data;
    console.log("===apiRes=harness==>", apiRes);

    if (apiRes.success && Array.isArray(apiRes.data) && apiRes.data.length > 0) {
      const material = apiRes.data[0];
      const price = material.price || 0;
      const unitPrice = price;

      const harnessMaterial = {
        // id, leadId, quotationLiftDetailId will be set in fetchFloorPrices
        materialId: material.id,
        materialName: material.name, // Assuming the name field is harnessName
        materialDisplayName: material.name,
        quantity: 1, // Assuming quantity is 1 for harness
        quantityUnit: "",
        unitPrice: unitPrice,
        price: price,
        materialType: "WiringHarness",
      };

      // ✅ Clear previous error if price found
      if (setErrors) setErrors((prev) => {
        const updated = { ...prev };
        delete updated.harnessPrice;
        return updated;
      });

      return { price: price, material: harnessMaterial };
    }

    const message = apiRes.message || `No harness found for ${floorDesignations}`;
    toast.warning(message);

    if (setErrors) setErrors((prev) => ({ ...prev, harnessPrice: message }));

    return { price: 0, material: null };
  } catch (error) {
    const message = "No harness price found. Please check the availability.";
    toast.error(message);

    if (setErrors) setErrors((prev) => ({ ...prev, harnessPrice: message }));
    return { price: 0, material: null };
  }
};

// const fetchCabinPrice = async (cabinType, capacityType, capacityValue) => {
//   try {
//     const res = await axiosInstance.get(
//       API_ENDPOINTS.CABIN_SUBTYPE + "/searchByCabinTypeAndCapacity",
//       {
//         params: {
//           cabinType: cabinType,
//           capacityTypeId: capacityType,
//           capacityValueId: capacityValue,
//         },
//       }
//     );

//     const apiRes = res.data;
//     console.log("===apiRes= cabinType==>", apiRes);

//     if (apiRes.success && Array.isArray(apiRes.data) && apiRes.data.length > 0) {
//       return apiRes.data[0].prize || 0; // ✅ first ARD’s price
//     }

//     toast.warning(apiRes.message || "No Cabin Type found for given criteria");
//     return 0;
//   } catch (error) {
//     toast.error("No Cabin price found. Please check the availability.");
//     return 0;
//   }
// };

const fetchGovernorRopePrice = async (floors, floorDesignations) => {
  const floorId = parseInt(floors, 10);
  if (isNaN(floorId) || floorId <= 0) {
    toast.error("Invalid floor ID provided.");
    return 0;
  }
  try {
    const res = await axiosInstance.get(
      `${API_ENDPOINTS.GOVERNOR_ROPES}/byFloor/${floorId - 1}`
    );

    const apiRes = res.data;
    console.log("===apiRes=GOVERNOR_ROPES==>", apiRes);

    if (apiRes.success && Array.isArray(apiRes.data) && apiRes.data.length > 0) {
      const price = apiRes.data[0].price || 0;

      // ✅ Clear previous error if price found
      if (setErrors) setErrors((prev) => {
        const updated = { ...prev };
        delete updated.governorRopePrice;
        return updated;
      });

      return price;
    }

    toast.warning(apiRes.message || "No governor rope found for " + floorDesignations);
    return 0;
  } catch (error) {
    toast.error("No governor rope price found. Please check the availability.");
    return 0;
  }
};

const fetchGovernorRopePriceByNm = async (floorDesignations, setErrors) => {
  try {
    const floorDesignation = encodeURIComponent(floorDesignations);
    const res = await axiosInstance.get(
      `${API_ENDPOINTS.GOVERNOR_ROPES}/searchByFloorDesignation?floorDesignations=${floorDesignation}`
    );

    const apiRes = res.data;
    console.log("===apiRes=GOVERNOR_ROPES by designation==>", apiRes);

    if (apiRes.success && Array.isArray(apiRes.data) && apiRes.data.length > 0) {
      const material = apiRes.data[0];
      const price = material.price || 0;
      const unitPrice = material.quantity > 0 ? material.price / material.quantity : 0;

      const governorMaterial = {
        materialId: material.id,
        materialName: material.governorName,
        materialDisplayName: material.governorName,
        quantity: material.quantity,
        quantityUnit: "mtrs",
        unitPrice: unitPrice,
        price: material.quantity * material.price,
        materialType: "Governor",
      };

      // ✅ Clear previous error if price found
      if (setErrors) setErrors((prev) => {
        const updated = { ...prev };
        delete updated.governorRopePrice;
        return updated;
      });

      return { price: price, material: governorMaterial };
    }

    const message = apiRes.message || `No governor rope found for ${floorDesignations}`;
    toast.warning(message);

    if (setErrors) setErrors((prev) => ({ ...prev, governorRopePrice: message }));

    return { price: 0, material: null };
  } catch (error) {
    const message = "No governor rope price found. Please check the availability.";
    toast.error(message);

    if (setErrors) setErrors((prev) => ({ ...prev, governorRopePrice: message }));

    return { price: 0, material: null };
  }
};




