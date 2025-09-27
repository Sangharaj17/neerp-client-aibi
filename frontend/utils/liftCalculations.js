import axiosInstance from "@/utils/axiosInstance";
import { API_ENDPOINTS } from "@/utils/apiEndpoints";
import { toast } from "react-hot-toast";

// 🔹 Prices based on liftType, capacityType, capacityValue, typeOfLift
// export const calculateLiftMaterialPrices = async ({ liftType, capacityType, capacityValue, typeOfLift, cabinType }) => {
export const calculateLiftMaterialPrices = async ({ liftType, capacityType, capacityValue, typeOfLift }) => {
  try {
    const [ardPrice, machinePrice, cabinPrice] = await Promise.all([
      fetchArdPrice(liftType, capacityType, capacityValue),
      fetchMachinePrice(liftType, capacityType, capacityValue, typeOfLift),
      //fetchCabinPrice(cabinType, capacityType, capacityValue),
    ]);

    //const totalAmount = ardPrice + machinePrice + cabinPrice;
    const totalAmount = ardPrice + machinePrice;

    //return { ardPrice, machinePrice, cabinPrice, totalAmount };
    return { ardPrice, machinePrice, totalAmount };
  } catch (err) {
    console.error("Lift material price fetch error:", err);
    // return { ardPrice: 0, machinePrice: 0, cabinPrice: 0, totalAmount: 0 };
    return { ardPrice: 0, machinePrice: 0, totalAmount: 0 };
  }
};


// 🔹 Prices based on floorDesignations
export const calculateFloorPrices = async (floorDesignations) => {
  try {
    const [harnessPrice, governorPrice] = await Promise.all([
      fetchHarnessPrice(floorDesignations),
      fetchGovernorRopePriceByNm(floorDesignations),
    ]);

    // Truffing logic
    let truffingPrice = 0;
    if (floorDesignations?.startsWith("G+")) {
      const floorNum = parseInt(floorDesignations.replace("G+", ""), 10);
      if (!isNaN(floorNum)) {
        const qty = 9 + (floorNum - 1) * 2;
        truffingPrice = qty * 0; // update when API gives unit price
      }
    }

    const totalAmount = harnessPrice + governorPrice + truffingPrice;

    return { harnessPrice, governorPrice, truffingPrice, totalAmount };
  } catch (err) {
    console.error("Floor price fetch error:", err);
    return { harnessPrice: 0, governorPrice: 0, truffingPrice: 0, totalAmount: 0 };
  }
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
  
  
  const fetchArdPrice = async (liftType, capacityType, capacityValue) => {
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
      console.log("===apiRes= ard==>", apiRes);

      if (apiRes.success && Array.isArray(apiRes.data) && apiRes.data.length > 0) {
        return apiRes.data[0].price || 0; // ✅ first ARD’s price
      }

      toast.warning(apiRes.message || "No ARD devices found for given criteria");
      return 0;
    } catch (error) {
      toast.error("No ARD price found. Please check the availability.");
      return 0;
    }
  };

  const fetchMachinePrice = async (liftType, capacityType, capacityValue, typeOfLift) => {
    try {
      const res = await axiosInstance.get(
        API_ENDPOINTS.OTHER_MATERIAL + "/searchByLiftyType_Operator_Capacity",
        {
          params: {
            operatorId: liftType,
            capacityTypeId: capacityType,
            capacityValueId: capacityValue,
            typeOfLift: typeOfLift,
          },
        }
      );

      const apiRes = res.data;
      console.log("===apiRes=other material==>", apiRes);

      if (apiRes.success && Array.isArray(apiRes.data) && apiRes.data.length > 0) {
        return apiRes.data[0].price || 0; // ✅ first ARD’s price
      }

      toast.warning(apiRes.message || "No material found for " + liftType + "-" + capacityValue + "-" + typeOfLift);
      return 0;
    } catch (error) {
      toast.error("No machine price found. Please check the availability.");
      return 0;
    }
  };

  const fetchHarnessPrice = async (floorDesignations) => {
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
        return apiRes.data[0].price || 0; // ✅ first ARD’s price
      }

      toast.warning(apiRes.message || "No harness found for " + floorDesignations);
      return 0;
    } catch (error) {
      toast.error("No harness price found. Please check the availability.");
      return 0;
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
      `${API_ENDPOINTS.GOVERNOR_ROPES}/byFloor/${floorId-1}`
    );

      const apiRes = res.data;
      console.log("===apiRes=GOVERNOR_ROPES==>", apiRes);

      if (apiRes.success && Array.isArray(apiRes.data) && apiRes.data.length > 0) {
        return apiRes.data[0].price || 0; // ✅ first GOVERNOR_ROPES price
      }

      toast.warning(apiRes.message || "No governor rope found for " + floorDesignations);
      return 0;
    } catch (error) {
      toast.error("No governor rope price found. Please check the availability.");
      return 0;
    }
  };

  const fetchGovernorRopePriceByNm = async (floorDesignations) => {
    try {
      const floorDesignation = encodeURIComponent(floorDesignations);
      const res = await axiosInstance.get(
      `${API_ENDPOINTS.GOVERNOR_ROPES}/searchByFloorDesignation?floorDesignations=${floorDesignation}`
    );

      const apiRes = res.data;
      console.log("===apiRes=GOVERNOR_ROPES by designation==>", apiRes);

      if (apiRes.success && Array.isArray(apiRes.data) && apiRes.data.length > 0) {
        return apiRes.data[0].price || 0; // ✅ first GOVERNOR_ROPES price
      }

      toast.warning(apiRes.message || "No governor rope found for " + floorDesignations);
      return 0;
    } catch (error) {
      toast.error("No governor rope price found. Please check the availability.");
      return 0;
    }
  };
