import axiosInstance from "@/utils/axiosInstance";
import { API_ENDPOINTS } from "@/utils/apiEndpoints";
import { useEffect, useMemo, useRef } from "react";
import toast from "react-hot-toast";
import { showErrorToast } from "@/components/UI/toastUtils";


export const clearError = (setErrors, field) => {
  setErrors((prev) => {
    // Do nothing if no previous errors
    if (!prev || typeof prev !== "object" || Object.keys(prev).length === 0) return prev;

    // If that field doesn't exist, leave as-is
    if (!Object.prototype.hasOwnProperty.call(prev, field)) return prev;

    const newErrors = { ...prev };
    // delete newErrors[field];
    return newErrors;
  });
};


export const fieldLabels = {}; // Declare it at component level (outside render return)

export function getLabel(key, labelText) {
  fieldLabels[key] = labelText;
  return labelText;
}

function decodeHtmlEntities(text) {
  if (!text) return "";
  const txt = document.createElement("textarea");
  txt.innerHTML = text;
  return txt.value;
}

function formatDateTime(dateStr) {
  if (!dateStr) return "";

  const date = new Date(dateStr);
  if (isNaN(date)) return dateStr;

  const day = String(date.getDate()).padStart(2, "0");
  const monthName = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${day} / ${monthName} / ${year} ${hours}:${minutes}:${seconds}`;
}


export function getReadableValue(key, value, formData, initialOptions = {}) {
  if (value == null || value === "") return "";

  const findById = (arr, val) =>
    arr?.find((opt) => String(opt.id) === String(val)) || null;

  const getNameFromObject = (val) => {
    if (!val) return null;
    if (typeof val === "object") {
      if ("name" in val) return val.name;
      if ("displayName" in val) return val.displayName;
      if ("subTypeName" in val) return val.subTypeName;
      if ("cabinType" in val) return val.cabinType;
      if ("weightValue" in val) return `${val.weightValue} ${val.unitNM || ""}`.trim();
    }
    return null;
  };

  switch (key) {
    case "leadDate":
    case "enqDate":
    case "quotationDate":
      return formatDateTime(value);


    case "liftType":
      return getNameFromObject(value) || findById(initialOptions.operatorTypes, value)?.name || value;

    case "typeOfLift":
      return getNameFromObject(value) || findById(initialOptions.liftTypes, value)?.name || value;

    case "capacityType":
      return getNameFromObject(value) || findById(initialOptions.capacityTypes, value)?.type || value;

    case "capacityValue": {
      const capacityType = formData.capacityType;
      if (String(capacityType) === "1" || String(capacityType).toLowerCase() === "person") {
        const opt = getNameFromObject(value) || findById(initialOptions.personOptions, value);
        return opt?.displayName || value;
      }
      if (String(capacityType) === "2" || String(capacityType).toLowerCase() === "kg") {
        const opt = getNameFromObject(value) || findById(initialOptions.kgOptions, value);
        return opt ? `${opt.weightValue} ${opt.unitNM || ""}`.trim() : value;
      }
      return value;
    }

    case "airSystem":
      return getNameFromObject(value) || findById(initialOptions.airSystem, value)?.name || value;

    case "lightFitting":
      return getNameFromObject(value) || findById(initialOptions.lightFittings, value)?.name || value;

    case "cabinType":
      return getNameFromObject(value) || findById(initialOptions.cabinTypes, value)?.cabinType || value;

    case "cabinSubType": {
      const opt = findById(initialOptions.cabinSubTypes, value);
      if (!opt) return value;
      const capacityDisplay = opt.personCapacityDTO
        ? opt.personCapacityDTO.displayName
        : opt.weightDTO
          ? `${opt.weightDTO.weightValue} ${opt.weightDTO.unitNM}`
          : "";
      return capacityDisplay ? `${opt.cabinSubName} - ${capacityDisplay}` : opt.cabinSubName;
    }

    case "cabinFlooring": {
      const opt = findById(initialOptions.cabinFlooring, value);
      return opt ? opt.flooringName : value;
    }

    case "cabinCeiling": {
      const opt = initialOptions.cabinCeiling?.find(
        (c) => String(c.ceilingId) === String(value)
      );
      return opt ? opt.ceilingName : value;
    }

    // case "carEntrance": {
    //   const opt = findById(initialOptions.carEntranceTypes, value);
    //   return opt ? opt.carDoorType : value;
    // }

    // case "carEntranceSubType": {
    //   const opt = findById(initialOptions.carEntranceSubTypes, value);
    //   return opt ? opt.carDoorSubType : value;
    // }

    // case "landingEntranceSubType1":
    // case "landingEntranceSubType2": {
    //   const opt = findById(initialOptions.landingEntranceSubTypes, value);
    //   return opt ? opt.name : value;
    // }

    case "landingEntranceCount": {
      if (value === Number(formData.openings)) return "ALL";
      return value;
    }

    case "controlPanelMake":
      return getNameFromObject(value) || findById(initialOptions.controlPanelTypes, value)?.name || value;

    case "wiringHarness":
      return getNameFromObject(value) || findById(initialOptions.wiringHarness, value)?.name || value;

    case "carEntrance":
      return getNameFromObject(value) || findById(initialOptions.carEntranceTypes, value)?.name || value;

    case "carEntranceSubType":
      return getNameFromObject(value) || findById(initialOptions.carEntranceSubTypes, value)?.name || value;

    case "landingEntranceSubType1":
    case "landingEntranceSubType2":
      return getNameFromObject(value) || findById(initialOptions.landingEntranceSubTypes, value)?.name || value;

    case "guideRail": {
      const opt = findById(initialOptions.guideRail, value);
      if (!opt) return value;
      return `${decodeHtmlEntities(opt.counterWeightName)} [${opt.floorName}-${opt.counterWeightTypeName}]`;
    }

    case "bracketType": {
      const opt = findById(initialOptions.bracketTypes, value);
      if (!opt) return value;
      return `${opt.bracketTypeName} [${opt.floorName}]`;
    }

    case "ropingType": {
      const opt = findById(initialOptions.wireRopes, value);
      if (!opt) return value;
      return `${opt.wireRopeTypeName} [${opt.floorName}]`;
    }

    case "lopType":
      return getNameFromObject(value) || findById(initialOptions.lopTypes, value)?.name || value;

    case "copType": {
      const opt = findById(initialOptions.copTypes, value);
      return opt ? decodeHtmlEntities(opt.copName) : value;
    }

    case "operationType": {
      const opt = findById(initialOptions.operationType, value);
      return opt ? decodeHtmlEntities(opt.name) : value;
    }

    case "mainMachineSet":
      return getNameFromObject(value) || findById(initialOptions.mainMachineSets, value)?.name || value;

    case "carRails":
      return getNameFromObject(value) || findById(initialOptions.carRails, value)?.name || value;

    case "counterWeightRails":
      return getNameFromObject(value) || findById(initialOptions.counterWeightRails, value)?.name || value;

    case "wireRope":
      return getNameFromObject(value) || findById(initialOptions.wireRopes, value)?.name || value;

    case "fastenerType": {
      // Try to find the fastener in initialOptions
      const opt = findById(initialOptions.fasteners, value);

      // If found, use its name
      if (opt) {
        return `${decodeHtmlEntities(opt.name || opt.fastenerName)} - ₹${opt.price || formData.fastenerPrice || 0}`;
      }

      // Fallback: value may exist but not loaded in initialOptions
      if (value) {
        return `Fastener #${value} - ₹${formData.fastenerPrice || 0}`;
      }

      return "";
    }

    case "stdFeatures": {
      if (!Array.isArray(value) || value.length === 0) return "";

      // Map selected IDs to feature names
      const selectedNames = value
        .map((id) => {
          const feature = initialOptions.features?.find(f => f.id === id);
          return feature ? decodeHtmlEntities(feature.name) : null;
        })
        .filter(Boolean); // remove nulls

      return selectedNames.join(", ");
    }

    case "installationAmount": {
      if (!formData.installationAmount) return "";
      return `₹${formData.installationAmount} (Rule ID: ${formData.installationAmountRuleId || "-"})`;
    }

    case "installationAmountRuleId": {
      const opt = findById(initialOptions.installationRules, value);

      if (opt) {
        return `${decodeHtmlEntities(opt.name || opt.ruleName || "Installation Rule")} - ₹${formData.installationAmount || opt.amount || 0}`;
      }

      // Fallback if not found in options
      if (value) {
        return `Installation Rule #${value} - ₹${formData.installationAmount || 0}`;
      }

      return "";
    }



    default:
      return getNameFromObject(value) || value;
  }
}



// export function getReadableValue(key, value, formData, initialOptions = {}) {
//   if (value == null || value === "") return "";

//   const tryFind = (arr, prop = "id", label = "name") =>
//     arr?.find((opt) => opt[prop] === Number(value))?.[label] || value;

//   switch (key) {
//     case "liftType":
//       return tryFind(initialOptions.operatorTypes);

//     case "capacityType":
//       return tryFind(initialOptions.capacityTypes, "id", "type");

//     case "capacityValue": {
//       const capacityType = formData.capacityType;

//       // 👤 Person capacity
//       if (String(capacityType) === "1" || String(capacityType).toLowerCase() === "person") {
//         const opt = tryFind(initialOptions.personOptions);
//         return opt ? opt.displayName : value;
//       }

//       // ⚖️ Kg capacity
//       if (String(capacityType) === "2" || String(capacityType).toLowerCase() === "kg") {
//         const opt = tryFind(initialOptions.kgOptions);
//         // ✅ Combine weight and unitNM, e.g. "300 Kg"
//         return opt ? `${opt.weightValue} ${opt.unitNM || ""}`.trim() : value;
//       }

//       return value;
//     }

//     case "airSystem":
//       return tryFind(initialOptions.airSystemOptions);

//     case "lightFitting":
//       return tryFind(initialOptions.lightFittingOptions);

//     case "cabinType":
//       return tryFind(initialOptions.cabinTypes);

//     case "cabinSubType":
//       return tryFind(initialOptions.cabinSubTypes);

//     // add more mappings as needed
//     default:
//       return value;
//   }
// }




// 🔹 Fetch Cabin Types based on capacity


export const fetchCabinSubTypes = async (capacityType, capacityValue, cabinType, setErrors) => {
  try {
    if (!capacityType || !capacityValue || !cabinType) {
      return [];
    }

    const res = await axiosInstance.get(
      `${API_ENDPOINTS.CABIN_SUBTYPE}/searchByCabinTypeAndCapacity`,
      {
        params: {
          cabinType: cabinType,
          capacityTypeId: capacityType,
          capacityValueId: capacityValue,
        },
      }
    );

    const data = res.data?.data || [];

    if (data.length === 0) {
      const errorMessage = "No Cabin Sub Types found for the selected criteria.";
      if (setErrors) setErrors((prev) => ({ ...prev, cabinSubTypes: errorMessage }));
      return [];
    }

    // Clear error if fetch is successful
    if (setErrors) setErrors((prev) => {
      const updated = { ...prev };
      delete updated.cabinSubTypes;
      return updated;
    });

    return data;

  } catch (err) {
    console.error("Error fetching cabin types", err);
    if (setErrors) setErrors((prev) => ({ ...prev, cabinSubTypes: "Failed to fetch cabin subtypes" }));
    return [];
  }
};


// 🔹 Fetch Air System Price
export const fetchAirSystemPrice = async ({ airTypeId, capacityTypeId, personId, weightId }) => {
  try {
    const res = await axiosInstance.post(`${API_ENDPOINTS.AIR_SYSTEM}/price`, {
      airTypeId: Number(airTypeId),
      capacityTypeId,
      ...(capacityTypeId === 1 ? { personId } : { weightId }),
    });

    // console.log("Error fetching AirSystem price:", res.data);

    if (res.data?.success && res.data?.data) {
      // if (setErrors) setErrors((prev) => {
      //   const updated = { ...prev };
      //   delete updated.airSystemPrice;
      //   return updated;
      // });

      return {
        airSystemId: res.data.data.id || 0,
        airTypeName: res.data.data.airTypeName || "",
        price: res.data.data.price || 0,
        success: true,
        message: res.data.message || "AirSystem price fetched successfully",
      };
    } else {
      // console.log("--------eeeeeeee----------->",res.data?.message);
      const message = res.data?.message || "No price available or assigned";
      // if (setErrors) setErrors((prev) => ({ ...prev, airSystemPrice: message }));
      return { price: 0, success: false, message };
    }
  } catch (err) {
    console.error("Error fetching AirSystem price:", err);
    // if (setErrors) setErrors((prev) => ({ ...prev, airSystemPrice: "Failed to fetch Air System price" }));
    return { price: 0, success: false, message: "Failed to fetch Air System price" };
  }
};


// 🔹 Fetch Car Entrance Types by liftType
export const fetchCarEntranceTypes = async (liftType, setErrors) => {
  if (!liftType) return [];
  try {
    const res = await axiosInstance.get(`${API_ENDPOINTS.CAR_DOOR_TYPE}/searchByLiftType`, {
      params: { operatorElevatorId: liftType },
    });

    const data = res.data?.data || [];

    // Set error if no records found
    if (data.length === 0) {
      const errorMessage = "No Car Entrance Types found for the selected lift type.";
      if (setErrors) setErrors((prev) => ({ ...prev, carEntranceTypes: errorMessage }));
      return [];
    }

    // Clear error on success
    if (setErrors) setErrors((prev) => {
      const updated = { ...prev };
      delete updated.carEntranceTypes;
      return updated;
    });

    return res.data?.data || [];
  } catch (err) {
    console.error("Error fetching Car Entrance Types", err);
    if (setErrors) setErrors((prev) => ({ ...prev, carEntranceTypes: "Failed to fetch Car Entrance Types" }));
    return [];
  }
};

// 🔹 Fetch Car Entrance SubTypes by carEntranceId
export const fetchCarEntranceSubTypes = async (carEntranceId, setErrors) => {
  if (!carEntranceId) return [];
  try {
    const res = await axiosInstance.get(`${API_ENDPOINTS.CAR_DOOR_SUBTYPE}/searchByCarDoorType`, {
      params: { carDoorTypeId: carEntranceId },
    });

    const data = res.data?.data || [];
    if (data.length === 0) {
      const errorMessage = "No Car Entrance Sub Types found for the selected entrance type.";
      if (setErrors) setErrors((prev) => ({ ...prev, carEntranceSubTypes: errorMessage }));
      return [];
    }

    if (setErrors) setErrors((prev) => {
      const updated = { ...prev };
      delete updated.carEntranceSubTypes;
      return updated;
    });

    return res.data?.data || [];
  } catch (err) {
    console.error("Error fetching Car Entrance SubTypes", err);
    if (setErrors) setErrors((prev) => ({ ...prev, carEntranceSubTypes: "Failed to fetch Car Entrance SubTypes" }));
    return [];
  }
};

// 🔹 Fetch Landing Entrance Types by liftType
export const fetchLandingEntranceSubType = async (liftType, setErrors) => {
  if (!liftType) return [];
  try {
    const res = await axiosInstance.get(`${API_ENDPOINTS.LANDING_DOOR_SUBTYPE}/searchByLiftType`, {
      params: { operatorTypeId: liftType },
    });

    const data = res.data?.data || [];

    //Set error if no records found
    if (data.length === 0) {
      const errorMessage = "No Landing Entrance Sub Types found for the selected lift type.";
      if (setErrors) setErrors((prev) => ({ ...prev, landingEntranceSubTypes: errorMessage }));
      return [];
    }

    if (setErrors) setErrors((prev) => {
      const updated = { ...prev };
      delete updated.landingEntranceSubTypes;
      return updated;
    });

    return res.data?.data || [];
  } catch (err) {
    console.error("Error fetching Landing Entrance Sub Types", err);
    if (setErrors) setErrors((prev) => ({ ...prev, landingEntranceSubTypes: "Failed to fetch Landing Entrance Sub Types" }));
    return [];
  }
};

// 🔹 Fetch control panel types filtered by liftType + capacityType
export const fetchControlPanelTypes = async (liftType, capacityType, capacityValue, typeOfLiftId, setErrors) => {
  try {
    const res = await axiosInstance.get(`${API_ENDPOINTS.CONTROL_PANEL}/search`, {
      params: {
        operatorTypeId: liftType,
        capacityTypeId: capacityType,
        machineTypeId: typeOfLiftId,
        capacityValue: capacityValue,
      },
    });

    const data = res.data?.data || [];

    // Set error if no records found
    if (data.length === 0) {
      const errorMessage = "No Control Panel Types found for the selected criteria.";
      if (setErrors) setErrors((prev) => ({ ...prev, controlPanelTypes: errorMessage }));
      return [];
    }

    if (setErrors) setErrors((prev) => {
      const updated = { ...prev };
      delete updated.controlPanelTypes;
      return updated;
    });

    return res.data?.data || [];
  } catch (err) {
    console.error("Error fetching control panels", err);
    if (setErrors) setErrors((prev) => ({ ...prev, controlPanelTypes: "Failed to fetch control panels" }));
    return [];
  }
};

// 🔹 Fetch LOP/COP based on liftType + floor
export const fetchLOP = async (liftType, floor, setErrors) => {
  try {
    const res = await axiosInstance.get(`${API_ENDPOINTS.LOP_SUBTYPE}/search`, {
      params: { operatorTypeId: liftType, floorId: (floor) },
    });

    const data = res.data?.data || [];

    //Set error if no records found
    if (data.length === 0) {
      const errorMessage = "No LOP options found for the selected criteria.";
      if (setErrors) setErrors((prev) => ({ ...prev, lop: errorMessage }));
      return [];
    }

    if (setErrors) setErrors((prev) => {
      const updated = { ...prev };
      delete updated.lop;
      return updated;
    });

    return res.data?.data || [];
  } catch (err) {
    console.error("Error fetching LOP", err);
    if (setErrors) setErrors((prev) => ({ ...prev, lop: "Failed to fetch LOP" }));
    return [];
  }
};

export const fetchCOP = async (liftType, floor, setErrors) => {
  try {
    const res = await axiosInstance.get(`${API_ENDPOINTS.COP_TYPE}/search`, {
      params: { operatorTypeId: liftType, floorId: floor },
    });

    const data = res.data?.data || [];

    //Set error if no records found
    if (data.length === 0) {
      const errorMessage = "No COP options found for the selected criteria.";
      if (setErrors) setErrors((prev) => ({ ...prev, cop: errorMessage }));
      return [];
    }

    if (setErrors) setErrors((prev) => {
      const updated = { ...prev };
      delete updated.cop;
      return updated;
    });

    return res.data?.data || [];
  } catch (err) {
    console.error("Error fetching COP", err);
    if (setErrors) setErrors((prev) => ({ ...prev, cop: "Failed to fetch COP" }));
    return [];
  }
};

export const fetchCapacityDimension = async (capacityType, capacityValue, setErrors) => {
  try {
    if (!capacityType || !capacityValue) {
      return null;
    }

    const res = await axiosInstance.get(
      `${API_ENDPOINTS.CAPACITY_DIMENSIONS}/searchByCapacity`,
      {
        params: {
          capacityTypeId: capacityType,
          capacityValueId: capacityValue,
        },
      }
    );

    const dimension = res.data?.data || res.data || null;

    // Set error if no record found (assuming null/undefined is the indicator)
    if (!dimension || (Array.isArray(dimension) && dimension.length === 0)) {
      const errorMessage = "No Capacity Dimension found for the selected capacity.";
      if (setErrors) setErrors((prev) => ({ ...prev, capacityDimension: errorMessage }));
      return null;
    }

    if (setErrors) setErrors((prev) => {
      const updated = { ...prev };
      delete updated.capacityDimension;
      return updated;
    });

    // console.log(res,"-------res-------------",res.data?.data);

    // API should return a single dimension object (or null if not found)
    return res.data || null;
  } catch (err) {
    console.error("Error fetching capacity dimension", err);
    if (setErrors) setErrors((prev) => ({ ...prev, capacityDimension: "Failed to fetch capacity dimension" }));
    return null;
  }
};

export function getOptionPrice(id, options, key = "id") {
  if (!id || !options) return 0;
  const option = options.find((opt) => String(opt[key]) === String(id));
  if (!option) return 0;

  if (typeof option.price === "number") return option.price;
  if (typeof option.prize === "number") return option.prize;
  return 0;
}

export const fetchRopingTypePrice = async (ropingTypeId, capacityType, capacityValue, typeOfLiftId, setErrors) => {
  if (!ropingTypeId || !capacityType || !capacityValue || !typeOfLiftId) {
    const message = "Please select Roping Type, Capacity, and Machine Type to fetch the price.";

    if (setErrors) {
      // Set the specific warning message for missing input
      setErrors((prev) => ({
        ...prev,
        ropingTypePrice: message
      }));
    }
    // Return the expected object structure with error details
    return { price: 0, found: false, error: message };
  }

  try {
    const res = await axiosInstance.get(`${API_ENDPOINTS.COUNTER_FRAME_TYPES}/search`, {
      params: {
        counterFrameTypeId: ropingTypeId,
        capacityTypeId: capacityType,
        capacityValue: capacityValue,
        machineTypeId: typeOfLiftId,
      },
    });

    const data = res.data;
    let price = 0;
    let name = "";
    let found = false;

    // Determine the price and whether a record was actually found
    if (Array.isArray(data)) {
      price = data.length > 0 ? data[0].price || 0 : 0;
      name = data.length > 0 ? data[0].counterFrameName || "" : "";
      found = data.length > 0;
    } else if (data && typeof data === 'object') {
      price = data.price || 0;
      name = data.counterFrameName || "";
      found = price > 0 || (data.price === 0 && 'price' in data); // Treat 0 as found if the key exists
    }

    if (!found) {
      const errorMessage = "No price found for the selected Roping Type criteria.";
      if (setErrors) setErrors((prev) => ({ ...prev, ropingTypePrice: errorMessage }));
      return { price: 0, name: "", found: false, error: errorMessage };
    }

    // Clear existing error if we found a record
    if (setErrors) setErrors((prev) => {
      const updated = { ...prev };
      delete updated.ropingTypePrice;
      return updated;
    });

    // Return both the price and a status
    return { price, name, found, error: null };

  } catch (err) {
    console.error("Error fetching roping type price", err);
    const message = "Failed to fetch roping type price";
    if (setErrors) setErrors((prev) => ({ ...prev, ropingTypePrice: message }));
    return { price: 0, name: "", found: false, error: message };
  }
};

// In liftService.js
export const fetchFastner = async (floor, setErrors) => {
  if (!floor) {
    if (setErrors) {
      // Set the specific warning message for missing input
      setErrors((prev) => ({
        ...prev,
        guideRail: "Failed to fetch fastener price. Please select Floors first."
      }));
    }
    return [];
  }

  try {
    const res = await axiosInstance.get(`${API_ENDPOINTS.FASTENERS}/floor/${floor}`);

    // Check if the API returned a successful data array/object
    const data = res.data?.data;
    const foundData = Array.isArray(data) ? data.length > 0 : (data && Object.keys(data).length > 0);

    if (foundData) {
      // Clear error on success
      if (setErrors) setErrors((prev) => {
        const updated = { ...prev };
        delete updated.fastenerPrice; // Use fastenerPrice to match formData
        return updated;
      });
      return { success: true, data: data };
    } else {
      // No data found, but API call was successful
      const message = "No fastener price found for this floor count.";
      if (setErrors) setErrors((prev) => ({ ...prev, fastenerPrice: message }));
      return { success: false, data: [], message: message };
    }

  } catch (err) {
    console.error("Error fetching fasteners", err);
    const message = "Failed to fetch fastener price due to network error.";
    if (setErrors) setErrors((prev) => ({ ...prev, fastenerPrice: message }));
    return { success: false, data: [], message: message };
  }
};


export const fetchInstallationRule = async (floorId, liftType, setErrors) => {
  if (!floorId) {
    if (setErrors) {
      // Set the specific warning message for missing input
      setErrors((prev) => ({
        ...prev,
        installationRule: "Failed to fetch installation rule. Please select Floor or operator type first."
      }));
    }
    return [];
  }
  try {
    const res = await axiosInstance.get(
      `${API_ENDPOINTS.INSTALLATION_RULES}/search`,
      { params: { floorId, liftType } }
    );

    const materials = res.data || [];
    // If no records found
    if (materials.length === 0) {
      const errorMessage = "No Other Materials (excluding Others) options found for the selected operator.";

      // Set error state
      if (setErrors) {
        setErrors((prev) => ({
          ...prev,
          installationRule: errorMessage
        }));
      }
      return []; // Return empty array since no options exist
    }

    if (setErrors) setErrors((prev) => {
      const updated = { ...prev };
      delete updated.installationRule;
      return updated;
    });

    return res.data; // return full {success, message, data}
  } catch (err) {
    console.error("Error fetching installation rule", err);
    if (setErrors) setErrors((prev) => ({ ...prev, installationRule: "Failed to fetch installation rule" }));
    return { success: false, message: "Error fetching installation rule", data: null };
  }
};

// export const fetchOtherMaterialsByMainId = async (mainId, setErrors) => {
//   try {
//     const res = await axiosInstance.get(`${API_ENDPOINTS.OTHER_MATERIAL}/byMainId/${mainId}`);
//     // res.data contains the ApiResponse { success, message, data }

//     if (setErrors) setErrors((prev) => {
//       const updated = { ...prev };
//       delete updated.otherMaterials;
//       return updated;
//     });

//     return res.data;
//   } catch (err) {
//     console.error("Failed to fetch Other Materials by mainId", err);
//     if (setErrors) setErrors((prev) => ({ ...prev, otherMaterials: "Failed to fetch Other Materials" }));
//     return {
//       success: false,
//       message: "Error fetching Other Materials",
//       data: null,
//     };
//   }
// };


export const fetchOtherMaterialExcludeOthers = async (operatorId, setErrors) => {
  if (!operatorId) {
    if (setErrors) {
      // Set the specific warning message for missing input
      setErrors((prev) => ({
        ...prev,
        otherMaterialsExcludeOthers: "Failed to fetch Other Materials. Please select Operator Type first."
      }));
    }
    return [];
  }
  try {
    // const res = await axiosInstance.get(
    //   `${API_ENDPOINTS.OTHER_MATERIAL}/byOperator/${operatorId}/excludeOthers`
    // );

    //  const res = await axiosInstance.get(
    //   `${API_ENDPOINTS.OTHER_MATERIAL}/byMainTypeContains/Default`
    // );

    const res = await axiosInstance.get(
      `${API_ENDPOINTS.OTHER_MATERIAL}/byOperator/${operatorId}/mainTypeContains/CommonPrice`
    );

    const materials = res.data || [];
    // If no records found
    if (materials.length === 0) {
      const errorMessage = "No Other Materials (excluding Others) options found for the selected operator.";

      // Set error state
      if (setErrors) {
        setErrors((prev) => ({
          ...prev,
          otherMaterialsExcludeOthers: errorMessage
        }));
      }
      return []; // Return empty array since no options exist
    }


    if (setErrors) setErrors((prev) => {
      const updated = { ...prev };
      delete updated.otherMaterialsExcludeOthers;
      return updated;
    });

    return res.data?.data || [];
  } catch (err) {
    console.error("Error fetching Other Materials (excluding Others):", err);
    if (setErrors) setErrors((prev) => ({ ...prev, otherMaterialsExcludeOthers: "Failed to fetch Other Materials" }));
    return [];
  }
};


export const fetchGuideRails = async (floors, operatorType, setErrors) => {
  // if (!floors) return [];
  if (!floors) {
    if (setErrors) {
      // Set the specific warning message for missing input
      setErrors((prev) => ({
        ...prev,
        guideRail: "Failed to load guide rails. Please select Floors first."
      }));
    }
    return [];
  }

  if (!operatorType) {
    if (setErrors) {
      // Set the specific warning message for missing input
      setErrors((prev) => ({
        ...prev,
        guideRail: "Failed to load guide rails. Please select operator type first."
      }));
    }
    return [];
  }

  try {
    // const response = await axiosInstance.get(`${API_ENDPOINTS.GUIDE_RAIL}/${operatorType}/floor/${floors}`);
    const response = await axiosInstance.get(`${API_ENDPOINTS.GUIDE_RAIL}/floor/${floors}`);
    const guideRails = response.data || [];

    console.log("Fetched Guide Rails for floor", floors, guideRails);

    // If no records found
    if (guideRails.length === 0) {
      const errorMessage = "No guide rail options found for the selected operator or floor.";

      // Set error state
      if (setErrors) {
        setErrors((prev) => ({
          ...prev,
          guideRail: errorMessage
        }));
      }
      return []; // Return empty array since no options exist
    }

    // ✅ Clear error on success
    if (setErrors) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated.guideRail;
        return updated;
      });
    }

    return guideRails;
  } catch (error) {
    console.error("❌ Error fetching guide rails:", error);
    toast.error("Failed to load guide rails");

    // ❌ Set error on failure
    if (setErrors) {
      setErrors((prev) => ({
        ...prev,
        guideRail: "Failed to load guide rails",
      }));
    }
    return [];
  }
};


export const fetchBracketTypes = async (floors, setErrors) => {
  if (!floors) {
    if (setErrors) {
      // Set the specific warning message for missing input
      setErrors((prev) => ({
        ...prev,
        bracketTypes: "Failed to fetch bracket types. Please select Floors first."
      }));
    }
    return [];
  }

  try {
    // const response = await axiosInstance.get(`${API_ENDPOINTS.BRACKETS}/floor/${floors}`);
    const res = await axiosInstance.get(`${API_ENDPOINTS.BRACKETS}/floor/${floors}`);

    const bracketTypes = res.data?.data || [];

    if (bracketTypes.length === 0) {
      const errorMessage = "No bracket options found for the selected floor.";

      // Set error state
      if (setErrors) {
        setErrors((prev) => ({
          ...prev,
          bracketTypes: errorMessage
        }));
      }
      return []; // Return empty array since no options exist
    }

    // ✅ Clear error on success
    if (setErrors) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated.bracketTypes;
        return updated;
      });
    }

    return bracketTypes;
  } catch (err) {
    console.error("Error fetching bracket types:", err);// ❌ Set error on failure
    const message = "Failed to fetch bracket types";
    toast.error(message);
    if (setErrors) {
      setErrors((prev) => ({
        ...prev,
        bracketTypes: message
      }));
    }
    return [];
  }
};

export const fetchWireRopes = async (floorId, machineTypeId, setErrors) => {
  if (!floorId || !machineTypeId) {
    if (setErrors) {
      setErrors((prev) => ({ ...prev, wireRopes: "Failed to fetch wire ropes.Please select Floor and Operator Type first." }));
    }
    return [];
  }

  try {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.WIRE_ROPE}/floor/${floorId}/machine/${machineTypeId}`
    );
    const wireRopes = response.data || [];

    if (wireRopes.length === 0) {
      const errorMessage = "No wire ropes options found for the selected floor or operator Type.";

      // Set error state
      if (setErrors) {
        setErrors((prev) => ({
          ...prev,
          wireRopes: errorMessage
        }));
      }
      return []; // Return empty array since no options exist
    }

    // ✅ Clear error on success
    if (setErrors) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated.wireRopes;
        return updated;
      });
    }

    return wireRopes;
  } catch (error) {
    console.error("Error fetching wire ropes:", error);
    toast.error("Failed to load wire ropes");
    if (setErrors) setErrors((prev) => ({ ...prev, wireRopes: "Failed to fetch wire ropes" }));
    return [];
  }
};

export const fetchLoads = async (setErrors) => {
  try {
    const res = await axiosInstance.get(`${API_ENDPOINTS.LOAD}`, {
      headers: { "X-Tenant": localStorage.getItem("tenant") },
    });

    const apiRes = res.data;
    console.log("===apiRes=load==>", apiRes);

    if (apiRes.length === 0) {
      const errorMessage = "No load options found.";

      // Set error state
      if (setErrors) {
        setErrors((prev) => ({
          ...prev,
          loadPerAmt: errorMessage
        }));
      }
      return []; // Return empty array since no options exist
    }

    // ✅ Success: data found
    if (apiRes.success && Array.isArray(apiRes.data) && apiRes.data.length > 0) {
      const loadRecord = apiRes.data[0];
      const loadAmount = loadRecord?.loadAmount ?? 0;

      // ✅ Clear any previous load error
      if (setErrors)
        setErrors((prev) => {
          const updated = { ...prev };
          delete updated.loadPerAmt;
          return updated;
        });

      return loadAmount; // ✅ Return only the numeric value
    }

    // ⚠️ If no data found
    const message = apiRes.message || "No load setting found.";
    showErrorToast(message);

    if (setErrors)
      setErrors((prev) => ({ ...prev, loadPerAmt: message }));

    return 0; // Return 0 if not found
  } catch (error) {
    console.error("Error fetching load:", error);
    const message = "Failed to fetch load. Please check server or tenant.";
    showErrorToast(message);

    if (setErrors)
      setErrors((prev) => ({ ...prev, loadPerAmt: message }));

    return 0; // Return 0 on error
  }
};


// export const fetchGuideRails = async (floors, setErrors) => {
//   if (!floors) return [];

//   try {
//     const response = await axiosInstance.get(`${API_ENDPOINTS.GUIDE_RAIL}`);
//     const allGuideRails = response.data || [];
//     console.log(floors, "Fetched Guide Rails:", allGuideRails);

//     // 🔹 Filter based on floor ID or name depending on your backend data
//     // const filtered = allGuideRails.filter(
//     //   (gr) => Number(gr.floorId) === Number(floors) // adjust logic if needed
//     // );
//     // console.log("Filtered Guide Rails:", filtered);

//     // return filtered;
//     return allGuideRails;
//   } catch (error) {
//     console.error("❌ Error fetching guide rails:", error);
//     toast.error("Failed to load guide rails");
//     if (setErrors) setErrors((prev) => ({ ...prev, guideRail: "Failed to load guide rails" }));
//     return [];
//   }
// };




// setPrice = "cabinCeilingPrice"
// setFormData = { setFormData }
// formData = { formData }

// guideRailPrice: lift.data?.guideRailPrice || 0,
//       bracketTypePrice: lift.data?.bracketTypePrice || "",
//       ropingTypePrice: lift.data?.ropingTypePrice || "",
//       lopTypePrice: lift.data?.lopTypePrice || "",
//       copTypePrice: lift.data?.copTypePrice || "", 

// Function to handle the custom rounding logic for Guide Rail quantity

const calculateRoundedGuideRailQuantity = (noOfStops) => {
  // 1. Calculate Raw Quantity: ((($no_of_stops * 3) + 3) * 2) / 5
  const rawQty = (((noOfStops * 3) + 3) * 2) / 5;

  // 2. Custom Rounding Logic (PHP logic replicated)
  const whole = Math.floor(rawQty);
  let decimalPart = rawQty - whole;
  let roundedDecimal;

  // JavaScript Floating Point Safety: Ensure we're comparing decimals correctly
  // Round to a reasonable precision before checking
  const decimalCheck = parseFloat(decimalPart.toFixed(10));

  if (decimalCheck < 0.0001) { // Very close to 0
    roundedDecimal = 0;
  } else if (decimalCheck >= 0.0001 && decimalCheck <= 0.5) { // 0.1 to 0.5 -> 0.5
    roundedDecimal = 0.5;
  } else { // 0.6 to 0.9 -> 1
    roundedDecimal = 1;
  }

  // $guide_rail_qty1 = $whole + $decimal;
  return whole + roundedDecimal;
};

// export const PriceBelowSelect = ({
//   id = "id",
//   options,
//   label,
//   formValue,               // single id or array of ids
//   color = "green-600",
//   isAirSystem = false,
//   isArdSystem = false,
//   showPrice = true,
//   priceVal = 0,
//   setPrice = "",
//   setName = "",
//   nameKey = "name",
//   itemMainName = "",
//   itemUnit = "",
//   setFormData,
//   formData = {},           // must pass whole formData (openings, landingEntranceCount etc.)
//   isOnlyLabel = false,
//   lead_id,
//   lift,
// }) => {
//   const lead = lead_id ?? formData.leadId;;
//   const operator = lift ?? formData.liftType;
//   if (isOnlyLabel) {
//     if (!label) return null;

//     return (
//       <div className={`absolute right-8 mt-[4.1rem] text-xs font-semibold tracking-wide ${color}`}>
//         <span className="font-medium space-y-1">{label}</span>
//       </div>
//     );
//   }

//   if (!showPrice) {
//     return null;
//   }

//   const { totalPrice, breakdownParts, price1, price2, quantity, selectedName, newMaterial } = useMemo(() => {
//     // if (isArdSystem) return { totalPrice: priceVal || 0, breakdownParts: [], price1: 0, price2: 0 };
//     if (!options) {
//       return {
//         totalPrice: priceVal || 0,
//         breakdownParts: [],
//         price1: 0,
//         price2: 0,
//         selectedName: "",
//         newMaterial: null,
//       };
//     }
//     const totalOpenings = Number(formData.openings) || 0;
//     const splitCount = Number(formData.landingEntranceCount) || 0;

//     const noOfStops = Number(formData.stops) || 0;
//     const liftQuantity = Number(formData.liftQuantity) || 1;

//     console.log(options, "-------options----------->");

//     // helper to find option
//     const findOpt = (sid) => options.find(o => String(o[id]) === String(sid));
//     const unitOf = (opt) => (opt?.price ?? opt?.prize ?? 0);

//     let price1 = 0, price2 = 0;
//     let breakdownParts = [];
//     let finalGuideRailQty = 0;

//     const sid = Array.isArray(formValue) ? formValue[0] : formValue;
//     const opt = findOpt(sid);

//     let materialId = opt ? opt[id] : null;
//     let quantity = 1; // Default quantity
//     // NAME ASSIGNMENT LOGIC:
//     let selectedName = "";
//     if (opt && formValue) {
//       quantity = Number(opt.quantity || opt.wireRopeQty
//       ) || 1;
//       // selectedName = opt[nameKey] || opt.name || "";
//       if (Array.isArray(nameKey)) {
//         selectedName = nameKey
//           .map(key => opt[key])
//           .filter(Boolean) // Remove null, undefined, or empty strings
//           .join(' / ');    // Join the available names with a separator
//       } else {
//         // Original logic for single key
//         selectedName = opt[nameKey] || opt.name || "";
//       }
//     }

//     let finalPrice = priceVal || 0;

//     // --- SPECIAL AIR SYSTEM LOGIC ---
//     if (isAirSystem) {
//       console.log("----formData.selectedMaterials-------", formData.selectedMaterials);
//       const existingMaterials = formData.selectedMaterials || [];

//       console.log("----In AIr-------", existingMaterials);
//       // Try to find if an Air System material already exists
//       const existingIndex = existingMaterials.findIndex(
//         (item) =>
//           item.materialType?.toLowerCase().includes("Air System".toLowerCase())
//       );

//       console.log("----In AIr--existingIndex-----", existingIndex);
//       console.log("----In AIr---existingMaterials[existingIndex]----", existingMaterials[existingIndex]);

//       const existing = existingIndex !== -1 ? existingMaterials[existingIndex] : {};

//       const airMaterial = {
//         ...existing,  // keep id, quotationLiftDetailId, etc.
//         id: existing.id,
//         leadId: formData.leadId ?? existing.leadId,
//         quotationLiftDetailId: existing.quotationLiftDetailId,
//         materialId: materialId ?? existing.materialId,
//         materialName: selectedName || existing.materialName || "Air System",
//         materialDisplayName: selectedName || existing.materialName || "Air System",
//         quantity: 1,
//         quantityUnit: existing.quantityUnit || "",
//         unitPrice: finalPrice ?? existing.price ?? 0,//-----as quantity =1
//         price: finalPrice ?? existing.price ?? 0,
//         operatorType: formData.liftType ?? existing.operatorType,
//         materialType: itemMainName || existing.materialType || "Air System",
//       };

//       // Prepare updated materials list (for reference/debugging, optional)
//       let updatedMaterials = [...existingMaterials];
//       if (existingIndex !== -1) {
//         updatedMaterials[existingIndex] = airMaterial; // Update
//       } else {
//         updatedMaterials.push(airMaterial); // Add new
//       }

//       // ✅ Return the airMaterial for parent to use
//       return {
//         totalPrice: finalPrice,
//         breakdownParts: [],
//         price1: 0,
//         price2: 0,
//         selectedName,
//         newMaterial: airMaterial,
//       };
//     }

//     // console.log(materialId, "---materialId---", selectedName);
//     // --- GUIDERAIL LOGIC ---
//     if (setPrice === "guideRailPrice") {

//       if (opt && noOfStops > 0) {
//         const unitPrice = unitOf(opt);

//         // Calculate rounded quantity (PHP $guide_rail_qty1)
//         const roundedQty1 = calculateRoundedGuideRailQuantity(noOfStops);

//         // Calculate final quantity (PHP $guide_rail_qty2)
//         finalGuideRailQty = roundedQty1 * liftQuantity;

//         // Calculate total price (PHP $guide_rail_price)
//         price1 = unitPrice * finalGuideRailQty;

//         // Optional breakdown
//         breakdownParts.push(
//           // `${opt.counterWeightName} (${finalGuideRailQty.toFixed(2)} × ₹${unitPrice.toLocaleString()}) = ₹ ${price1.toLocaleString()}`
//           `(${finalGuideRailQty.toFixed(2)} × ₹${unitPrice.toLocaleString()}) = ₹ ${price1.toLocaleString()}`
//         );

//         quantity = finalGuideRailQty || 0;
//       }
//     }
//     // -------------------------

//     // --- LOP TYPE LOGIC: unitPrice * noOfStops ---
//     else if (setPrice === "lopTypePrice") {
//       if (opt && noOfStops > 0) {
//         const unitPrice = unitOf(opt);

//         // Use noOfStops as the quantity/multiplier
//         const count = noOfStops;

//         price1 = unitPrice * count;

//         breakdownParts.push(
//           `(${count} × ₹${unitPrice.toLocaleString()}) = ₹ ${price1.toLocaleString()}`
//         );

//         quantity = count;
//       }
//     }

//     // ---------------------------------------------

//     // ✅ Default single price (for other non-split items)
//     else if (
//       setPrice &&
//       setPrice !== "landingEntrancePrice1" &&
//       setPrice !== "landingEntrancePrice2"
//     ) {
//       if (setPrice == "airSystemPrice") {
//         console.log("=====airSystemPrice====>", opt);
//       }
//       // const sid = Array.isArray(formValue) ? formValue[0] : formValue;
//       // const opt = findOpt(sid);
//       if (opt) {
//         const unit = unitOf(opt);
//         price1 = unit * quantity; // just the unit price
//         // breakdownParts.push(`${opt.name} = ₹ ${unit.toLocaleString()}`);
//         if (quantity > 1) {
//           breakdownParts.push(
//             `${selectedName}: (${quantity} × ₹${unit.toLocaleString()}) = ₹ ${price1.toLocaleString()}`
//           );
//         } else {
//           breakdownParts.push(
//             `: ₹ ${price1.toLocaleString()}`
//           );
//         }
//       }
//     }

//     // ---- Landing Entrance 1 (always independent) ----
//     if (setPrice === "landingEntrancePrice1") {
//       const sid1 = Array.isArray(formValue) ? formValue[0] : formValue;
//       const opt1 = findOpt(sid1);

//       if (opt1) {
//         const floors1 = splitCount || totalOpenings; // if ALL selected, use total
//         const unit1 = unitOf(opt1);
//         price1 = unit1 * floors1;

//         breakdownParts.push(
//           `${opt1.name} (${floors1} × ₹${unit1.toLocaleString()}) = ₹ ${price1.toLocaleString()}`
//         );

//         quantity = floors1; // set quantity for Landing Entrance 1
//       }
//     }

//     // ---- Landing Entrance 2 (only if selected) ----
//     if (setPrice === "landingEntrancePrice2") {
//       const sid2 = Array.isArray(formValue) ? formValue[1] : null;
//       const opt2 = findOpt(sid2);

//       let materialId = opt2 ? opt2[id] : null;
//       if (opt2 && formValue) {
//         selectedName = opt2[nameKey] || opt2.name || "";
//       }
//       console.log(materialId, "------", selectedName);

//       if (opt2) {
//         // default remaining floors
//         let floors2 = Math.max(totalOpenings - splitCount, 0);

//         // override with explicit From/To
//         if (formData.landingEntranceSubType2_fromFloor && formData.landingEntranceSubType2_toFloor) {
//           const from = Number(formData.landingEntranceSubType2_fromFloor);
//           const to = Number(formData.landingEntranceSubType2_toFloor);
//           if (!isNaN(from) && !isNaN(to) && to >= from) {
//             floors2 = to - from + 1;
//           }
//         }

//         const unit2 = unitOf(opt2);
//         price2 = unit2 * floors2;

//         breakdownParts.push(
//           `${opt2.name} (${floors2} × ₹${unit2.toLocaleString()}) = ₹ ${price2.toLocaleString()}`
//         );

//         quantity = floors2; // set quantity for Landing Entrance 2
//       }
//     }


//     const totalPrice = price1 + price2;

//     // 🧩 Find if the same material type already exists in selectedMaterials
//     const existingMaterials = formData.selectedMaterials || [];
//     const existingIndex = existingMaterials.findIndex(
//       (item) =>
//         item.materialType?.toLowerCase() === itemMainName?.toLowerCase()
//     );

//     console.log(existingMaterials, ">>>>>>>> existingMaterials[existingIndex] >>>>>>>", existingMaterials[existingIndex]);
//     console.log(operator, ">>>>>>>>operator>>>>>lead>>>>>>>", lead);
//     // ✅ Build newMaterial with existing id (if found)

//     const unitPrice = quantity > 0 ? totalPrice / quantity : 0;
//     const newMaterial = {
//       id: existingIndex !== -1 ? existingMaterials[existingIndex].id : null,
//       leadId: lead,
//       quotationLiftDetailId: formData.quotLiftDetailId || null,
//       materialId: materialId,          // ID of the selected option
//       materialName: selectedName,
//       materialDisplayName: selectedName,
//       quantity: quantity,
//       quantityUnit: itemUnit,
//       quantity: quantity,
//       unitPrice: unitPrice,
//       price: totalPrice,               // The total calculated price
//       operatorType: operator,  // Assuming liftType is available
//       materialType: itemMainName,      // "Guide Rail", "Door", etc.
//     };

//     if (setPrice === "cabinPrice") {
//       console.log("----->newMaterial----->", newMaterial);
//     }

//     return {
//       totalPrice: price1 + price2,
//       breakdownParts,
//       price1,
//       price2,
//       selectedName,
//       newMaterial,
//       quantity,
//     };
//   }, [isAirSystem, priceVal, options, formValue, id, formData, setPrice, nameKey, itemMainName, formData.liftType, formData.leadId,]);


//   // write total back into formData
//   useEffect(() => {
//     if (!setFormData || !setPrice && !setName) return;

//     // setFormData(prev => {
//     //   if ((prev[setPrice] || 0) === (totalPrice || 0)) return prev;
//     //   return { ...prev, [setPrice]: totalPrice || 0 };
//     // });

//     setFormData((prev) => {
//       const next = { ...prev };
//       let updated = false;

//       // if (price1 !== undefined && prev.landingEntrancePrice1 !== price1) {
//       //   next.landingEntrancePrice1 = price1;
//       // }
//       // if (price2 !== undefined && prev.landingEntrancePrice2 !== price2) {
//       //   next.landingEntrancePrice2 = price2;
//       // }

//       if (setPrice === "landingEntrancePrice1") {
//         if (price1 !== undefined && prev.landingEntrancePrice1 !== price1) {
//           next.landingEntrancePrice1 = price1;
//           next.landingEntranceCount = quantity;
//           updated = true;
//         }
//       } else if (setPrice === "landingEntrancePrice2") {
//         if (price2 !== undefined && prev.landingEntrancePrice2 !== price2) {
//           next.landingEntrancePrice2 = price2;
//           const totalOpenings = Number(prev.openings) || 0;
//           const splitCount = Number(prev.landingEntranceCount) || 0;

//           let fromFloor = Number(prev.landingEntranceSubType2_fromFloor);
//           let toFloor = Number(prev.landingEntranceSubType2_toFloor);

//           // CASE 2 — Auto-generate from/to if not set
//           if (isNaN(fromFloor) || isNaN(toFloor) || toFloor < fromFloor) {
//             fromFloor = splitCount + 1;
//             toFloor = totalOpenings;
//           }

//           next.landingEntranceSubType2_fromFloor = fromFloor;
//           next.landingEntranceSubType2_toFloor = toFloor;

//           updated = true;
//         }
//       } else if (setPrice) {
//         console.log(setPrice + '======>price1:- ' + price1 + "---------price2:- " + price2 + "---totalPrice------" + totalPrice);
//         if (prev[setPrice] !== totalPrice) {
//           next[setPrice] = totalPrice || 0;
//           updated = true;
//         }
//       }

//       if (setName && prev[setName] !== selectedName) {
//         next[setName] = selectedName;
//         updated = true;
//       }

//       // 3. ✅ NEW: SAVE STRUCTURED MATERIAL OBJECT
//       // Field name is created from the setPrice prop (e.g., guideRailPrice -> guideRailMaterial)
//       const materialFieldName = setPrice ? `${setPrice.replace('Price', '')}Material` : null;
//       // const materialFieldName = setPrice ? `${setPrice.replace(/Price\d*/, '')}Material` : null;

//       console.log(newMaterial, "Material Field Name:", materialFieldName);

//       if (materialFieldName) {
//         // Check if the item is valid (has a materialId and total price > 0)
//         console.log("---newMaterial:---", newMaterial);
//         // if (newMaterial.materialId && newMaterial.price > 0) {
//         if (newMaterial.materialId) {
//           // Check if the object is changing (using JSON.stringify for a simple deep compare)
//           console.log("JSON.stringify(prev[materialFieldName]):", JSON.stringify(prev[materialFieldName]));
//           console.log("JSON.stringify(newMaterial):", JSON.stringify(newMaterial));
//           console.log("Are they equal?", JSON.stringify(prev[materialFieldName]) === JSON.stringify(newMaterial));
//           console.log("prev[materialFieldName]", prev[materialFieldName]);

//           if (JSON.stringify(prev[materialFieldName]) !== JSON.stringify(newMaterial)) {
//             next[materialFieldName] = newMaterial;
//             updated = true;
//           }
//         } else {
//           // If selection is cleared, set the material object to null/undefined
//           if (prev[materialFieldName] !== undefined && prev[materialFieldName] !== null) {
//             next[materialFieldName] = null;
//             updated = true;
//           }
//         }
//       }


//       console.log(materialFieldName, "---next---", next[materialFieldName]);

//       return updated ? next : prev;
//     });
//   }, [
//     price1,
//     price2,
//     quantity,
//     totalPrice,
//     selectedName,
//     setPrice,
//     setName,
//     setFormData
//   ]);

//   // nothing to display
//   if (showPrice && (!totalPrice || totalPrice === 0)) return null;

//   return (
//     <div className={`absolute right-8 mt-[4.1rem] text-xs font-semibold tracking-wide ${color}`}>
//       {label ? (
//         <>
//           {/* Hide total for Landing Entrance 1 & 2...if not landingentrance */}
//           {/* {!(setPrice === "landingEntrancePrice1" || setPrice === "landingEntrancePrice2") && (
//             <span>
//               {label}
//               {showPrice && (
//                 <span className="font-medium space-y-1">
//                   :{" "}₹ {totalPrice.toLocaleString()}
//                 </span>
//               )}
//             </span>
//           )}

//           {breakdownParts && breakdownParts.length > 0 && breakdownParts && (
//             <div className="text-xs space-y-1">
//               {breakdownParts.map((b, i) => (
//                 <div key={i}>{b}</div>
//               ))}
//             </div>
//           )} */}

//           {!(setPrice === "landingEntrancePrice1" || setPrice === "landingEntrancePrice2") && showPrice && (
//             <span>
//               {/* Check if a breakdown exists */}
//               {breakdownParts && breakdownParts.length > 0 ? (
//                 // Condition 1: Breakdown exists
//                 <>
//                   {label}
//                   <span className="font-medium space-y-1">
//                     {breakdownParts.map((b, i) => (
//                       <span key={i}>{b}</span>
//                     ))}
//                   </span>
//                 </>
//               ) : (
//                 // Condition 2: No breakdown, show label followed by price
//                 <>
//                   {label}
//                   <span className="font-medium space-y-1">
//                     :{" "}₹ {totalPrice.toLocaleString()}
//                   </span>
//                 </>
//               )}
//             </span>
//           )}


//           {(setPrice === "landingEntrancePrice1" || setPrice === "landingEntrancePrice2") && showPrice && (
//             <span>
//               {/* Check if a breakdown exists */}
//               {breakdownParts && breakdownParts.length > 0 ? (
//                 // Condition 1: Breakdown exists
//                 <>
//                   {label}
//                   <span className="font-medium space-y-1">
//                     {breakdownParts.map((b, i) => (
//                       <span key={i}>{b}</span>
//                     ))}
//                   </span>
//                 </>
//               ) : (
//                 // Condition 2: No breakdown, show label followed by price
//                 <>
//                   {label}
//                   <span className="font-medium space-y-1">
//                     :{" "}₹ {totalPrice.toLocaleString()}
//                   </span>
//                 </>
//               )}
//             </span>
//           )}


//         </>
//       ) : (
//         <>
//           {showPrice && !(setPrice === "landingEntrancePrice1" || setPrice === "landingEntrancePrice2") && (
//             <span>
//               Price
//               {breakdownParts && breakdownParts.length > 0 ? (
//                 // Condition 1: Breakdown exists
//                 <>
//                   <span className="font-medium space-y-1">
//                     {breakdownParts.map((b, i) => (
//                       <span key={i}>{b}</span>
//                     ))}
//                   </span>
//                 </>
//               ) : (
//                 // Condition 2: No breakdown, show label followed by price
//                 <>

//                   <span className="font-medium space-y-1">
//                     {" "}₹ {totalPrice.toLocaleString()}
//                   </span>
//                 </>
//               )}
//             </span>
//           )}
//           {/* {breakdownParts && breakdownParts.length > 0 && (
//             <div className="font-medium space-y-1">
//               {breakdownParts.map((b, i) => (
//                 <div key={i}>{b}</div>
//               ))}
//             </div>
//           )} */}
//         </>
//       )}
//     </div>
//   );

// };

export const calculateTotal = (formData) => {
  return priceKeys.reduce((sum, key) => sum + Number(formData[key] || 0), 0);
};

export const handleRefresh = async (
  fieldLabel,
  refreshFnOrField,   // can be string (field name) or function
  fetchOptionsFn,      // pass your local fetchOptions function here
  setFormData,
  fieldsToReset = []
) => {
  if (!setFormData) return;

  // ✅ Step 1: Reset specified fields in the form
  if (Array.isArray(fieldsToReset) && fieldsToReset.length > 0) {
    setFormData((prev) => {
      const updated = { ...prev };
      fieldsToReset.forEach((key) => {
        if (key in updated) updated[key] = "";
      });
      return updated;
    });
  }

  // ✅ Step 2: Validate argument
  const isString = typeof refreshFnOrField === "string";
  const isFunction = typeof refreshFnOrField === "function";
  const isEmpty = refreshFnOrField == null; // null or undefined

  if (!isString && !isFunction && !isEmpty) {
    console.warn("⚠️ Invalid refresh argument passed to handleRefresh");
    return;
  }

  // ✅ Step 3: Run toast + refresh logic
  await toast.promise(
    (async () => {
      if (isFunction) {
        await refreshFnOrField(); // e.g. a custom refresh function
      } else if (isString && fetchOptionsFn) {
        await fetchOptionsFn(refreshFnOrField); // call your local fetchOptions
      }
      else if (isEmpty) {
        return true;
      }
      else {
        console.warn("⚠️ fetchOptions function missing or invalid");
      }
    })(),
    {
      loading: `Refreshing ${fieldLabel}...`,
      success: `${fieldLabel} refreshed successfully!`,
      error: `Failed to refresh ${fieldLabel}!`,
    }
  );
};



// export const handleRefresh = async (
//   fieldLabel,
//   refreshFn,
//   setFormData,
//   fieldsToReset = []
// ) => {
//   if (typeof refreshFn !== "function" || typeof setFormData !== "function") return;

//   // ✅ Step 1: Clear selected formData fields (if any)
//   if (Array.isArray(fieldsToReset) && fieldsToReset.length > 0) {
//     setFormData((prev) => {
//       const updated = { ...prev };
//       fieldsToReset.forEach((key) => {
//         if (key in updated) updated[key] = ""; // or null if you prefer
//       });
//       return updated;
//     });
//   }

//   // ✅ Step 2: Show loading & handle refresh
//   await toast.promise(
//     (async () => {
//       await refreshFn(); // e.g., loadGuideRails()
//     })(),
//     {
//       loading: `Refreshing ${fieldLabel}...`,
//       success: `${fieldLabel} refreshed successfully!`,
//       error: `Failed to refresh ${fieldLabel}!`,
//     }
//   );
// };


// export const handleRefresh = async (fieldLabel, refreshFn) => {
//   if (typeof refreshFn !== "function") return;

//   await toast.promise(
//     (async () => {
//       await refreshFn(); // your actual fetch / reload logic
//     })(),
//     {
//       loading: `Refreshing ${fieldLabel}...`,
//       success: `${fieldLabel} refreshed successfully!`,
//       error: `Failed to refresh ${fieldLabel}!`,
//     }
//   );
// };


// export const handleRefresh = async (fieldLabel, refreshFn) => {
//   await toast.promise(
//     (async () => {
//       // Optional: run custom logic for that field
//       if (typeof refreshFn === "function") await refreshFn();
//       else await new Promise((resolve) => setTimeout(resolve, 1500)); // fallback delay
//     })(),
//     {
//       loading: `Refreshing ${fieldLabel} prices...`,
//       success: `${fieldLabel} prices refreshed!`,
//       error: `Failed to refresh ${fieldLabel} prices!`,
//     }
//   );
// };


export const fetchTax = async (setErrors) => {
  try {
    const res = await axiosInstance.get(
      "/api/v1/settings/COMPANY_SETTINGS_1/NI-quot-tax",
      {
        headers: { "X-Tenant": localStorage.getItem("tenant") },
      }
    );

    const apiRes = res.data;
    console.log("===apiRes Tax===>", apiRes);

    // Check APIResponse format
    if (!apiRes.success || apiRes.data === null || apiRes.data === undefined) {
      const message = apiRes.message || "No tax setting found.";

      if (setErrors) {
        setErrors((prev) => ({ ...prev, tax: message }));
      }
      // toast.warning(message);
      showErrorToast(message);
      return 0;
    }

    const taxAmount = apiRes.data;

    // Clear previous errors
    if (setErrors) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated.tax;
        return updated;
      });
    }

    return taxAmount;
  } catch (error) {
    console.error("Error fetching tax:", error);
    const message = "Failed to fetch tax. Please check company settings.";

    if (setErrors) {
      setErrors((prev) => ({ ...prev, tax: message }));
    }

    showErrorToast(message);
    return 0;
  }
};


//------------------------>working with selected materials--------->
// export const PriceBelowSelect = ({
//   id = "id",
//   options,
//   label,
//   formValue,               // single id or array of ids
//   color = "green-600",
//   isAirSystem = false,
//   isArdSystem = false,
//   showPrice = true,
//   priceVal = 0,
//   setPrice = "",
//   setName = "",
//   nameKey = "name",
//   itemMainName = "",
//   itemUnit = "",
//   setFormData,
//   formData = {},           // must pass whole formData (openings, landingEntranceCount etc.)
//   isOnlyLabel = false,
//   lead_id,
//   lift,
// }) => {
//   const lead = lead_id ?? formData.leadId;
//   const operator = lift ?? formData.liftType;

//   // 1. ✅ State/Ref to track if the component has mounted
//   const isInitialMount = useRef(true);

//   if (isOnlyLabel) {
//     if (!label) return null;

//     return (
//       <div className={`absolute right-8 mt-[4.1rem] text-xs font-semibold tracking-wide ${color}`}>
//         <span className="font-medium space-y-1">{label}</span>
//       </div>
//     );
//   }

//   if (!showPrice) {
//     return null;
//   }

//   const { totalPrice, breakdownParts, price1, price2, quantity, selectedName, newMaterial } = useMemo(() => {
//     // if (isArdSystem) return { totalPrice: priceVal || 0, breakdownParts: [], price1: 0, price2: 0 };
//     if (!options) {
//       return {
//         totalPrice: priceVal || 0,
//         breakdownParts: [],
//         price1: 0,
//         price2: 0,
//         selectedName: "",
//         newMaterial: null,
//       };
//     }
//     const totalOpenings = Number(formData.openings) || 0;
//     const splitCount = Number(formData.landingEntranceCount) || 0;

//     const noOfStops = Number(formData.stops) || 0;
//     const liftQuantity = Number(formData.liftQuantity) || 1;

//     console.log(options, "-------options--------formValue--->",formValue);

//     // helper to find option
//     const findOpt = (sid) => options.find(o => String(o[id]) === String(sid));
//     const unitOf = (opt) => (opt?.price ?? opt?.prize ?? 0);

//     let price1 = 0, price2 = 0;
//     let breakdownParts = [];
//     let finalGuideRailQty = 0;

//     const sid = Array.isArray(formValue) ? formValue[0] : formValue;
//     const opt = findOpt(sid);

//     console.log(options, "-------options----------->",sid,"..........",opt);

//     let materialId = opt ? opt[id] : null;
//     let quantity = 1; // Default quantity
//     // NAME ASSIGNMENT LOGIC:
//     let selectedName = "";
//     if (opt && formValue) {
//       quantity = Number(opt.quantity || opt.wireRopeQty
//       ) || 1;
//       // selectedName = opt[nameKey] || opt.name || "";
//       if (Array.isArray(nameKey)) {
//         selectedName = nameKey
//           .map(key => opt[key])
//           .filter(Boolean) // Remove null, undefined, or empty strings
//           .join(' / ');    // Join the available names with a separator
//       } else {
//         // Original logic for single key
//         selectedName = opt[nameKey] || opt.name || "";
//       }
//     }

//     let finalPrice = priceVal || 0;

//     // --- SPECIAL AIR SYSTEM LOGIC ---
//     if (isAirSystem) {
//       console.log("----formData.selectedMaterials-------", formData.selectedMaterials);
//       const existingMaterials = formData.selectedMaterials || [];

//       console.log("----In AIr-------", existingMaterials);
//       // Try to find if an Air System material already exists
//       const existingIndex = existingMaterials.findIndex(
//         (item) =>
//           item.materialType?.toLowerCase().includes("Air System".toLowerCase())
//       );

//       console.log("----In AIr--existingIndex-----", existingIndex);
//       console.log("----In AIr---existingMaterials[existingIndex]----", existingMaterials[existingIndex]);

//       const existing = existingIndex !== -1 ? existingMaterials[existingIndex] : {};

//       const airMaterial = {
//         ...existing,  // keep id, quotationLiftDetailId, etc.
//         id: existing.id,
//         leadId: formData.leadId ?? existing.leadId,
//         quotationLiftDetailId: existing.quotationLiftDetailId,
//         materialId: materialId ?? existing.materialId,
//         materialName: selectedName || existing.materialName || "Air System",
//         materialDisplayName: selectedName || existing.materialName || "Air System",
//         quantity: 1,
//         quantityUnit: existing.quantityUnit || "",
//         unitPrice: finalPrice ?? existing.price ?? 0,//-----as quantity =1
//         price: finalPrice ?? existing.price ?? 0,
//         operatorType: formData.liftType ?? existing.operatorType,
//         materialType: itemMainName || existing.materialType || "Air System",
//       };

//       // Prepare updated materials list (for reference/debugging, optional)
//       let updatedMaterials = [...existingMaterials];
//       if (existingIndex !== -1) {
//         updatedMaterials[existingIndex] = airMaterial; // Update
//       } else {
//         updatedMaterials.push(airMaterial); // Add new
//       }

//       // ✅ Return the airMaterial for parent to use
//       return {
//         totalPrice: finalPrice,
//         breakdownParts: [],
//         price1: 0,
//         price2: 0,
//         selectedName,
//         newMaterial: airMaterial,
//       };
//     }

//     // console.log(materialId, "---materialId---", selectedName);
//     // --- GUIDERAIL LOGIC ---
//     if (setPrice === "guideRailPrice") {

//       if (opt && noOfStops > 0) {
//         const unitPrice = unitOf(opt);

//         // Calculate rounded quantity (PHP $guide_rail_qty1)
//         // Note: Assuming calculateRoundedGuideRailQuantity is available
//         const roundedQty1 = 1 // calculateRoundedGuideRailQuantity(noOfStops); 

//         // Calculate final quantity (PHP $guide_rail_qty2)
//         finalGuideRailQty = roundedQty1 * liftQuantity;

//         // Calculate total price (PHP $guide_rail_price)
//         price1 = unitPrice * finalGuideRailQty;

//         // Optional breakdown
//         breakdownParts.push(
//           // `${opt.counterWeightName} (${finalGuideRailQty.toFixed(2)} × ₹${unitPrice.toLocaleString()}) = ₹ ${price1.toLocaleString()}`
//           `(${finalGuideRailQty.toFixed(2)} × ₹${unitPrice.toLocaleString()}) = ₹ ${price1.toLocaleString()}`
//         );

//         quantity = finalGuideRailQty || 0;
//       }
//     }
//     // -------------------------

//     // --- LOP TYPE LOGIC: unitPrice * noOfStops ---
//     else if (setPrice === "lopTypePrice") {
//       if (opt && noOfStops > 0) {
//         const unitPrice = unitOf(opt);

//         // Use noOfStops as the quantity/multiplier
//         const count = noOfStops;

//         price1 = unitPrice * count;

//         breakdownParts.push(
//           `(${count} × ₹${unitPrice.toLocaleString()}) = ₹ ${price1.toLocaleString()}`
//         );

//         quantity = count;
//       }
//     }

//     // ---------------------------------------------

//     // ✅ Default single price (for other non-split items)
//     else if (
//       setPrice &&
//       setPrice !== "landingEntrancePrice1" &&
//       setPrice !== "landingEntrancePrice2"
//     ) {
//       if (setPrice == "airSystemPrice") {
//         console.log("=====airSystemPrice====>", opt);
//       }
//       // const sid = Array.isArray(formValue) ? formValue[0] : formValue;
//       // const opt = findOpt(sid);
//       if (opt) {
//         const unit = unitOf(opt);
//         price1 = unit * quantity; // just the unit price
//         // breakdownParts.push(`${opt.name} = ₹ ${unit.toLocaleString()}`);
//         if (quantity > 1) {
//           breakdownParts.push(
//             `${selectedName}: (${quantity} × ₹${unit.toLocaleString()}) = ₹ ${price1.toLocaleString()}`
//           );
//         } else {
//           breakdownParts.push(
//             `: ₹ ${price1.toLocaleString()}`
//           );
//         }
//       }
//     }

//     // ---- Landing Entrance 1 (always independent) ----
//     else if (setPrice === "landingEntrancePrice1") {
//       const sid1 = Array.isArray(formValue) ? formValue[0] : formValue;
//       const opt1 = findOpt(sid1);
//       console.log(materialId, "---landingEntrancePrice1---", selectedName);

//       if (opt1) {
//         const floors1 = splitCount || totalOpenings; // if ALL selected, use total
//         const unit1 = unitOf(opt1);
//         price1 = unit1 * floors1;

//         breakdownParts.push(
//           `${opt1.name} (${floors1} × ₹${unit1.toLocaleString()}) = ₹ ${price1.toLocaleString()}`
//         );

//         quantity = floors1; // set quantity for Landing Entrance 1
//       }
//     }

//     // ---- Landing Entrance 2 (only if selected) ----
//     else if (setPrice === "landingEntrancePrice2") {
//       const sid2 = Array.isArray(formValue) ? formValue[1] : null;
//       const opt2 = findOpt(sid2);

//       let materialId = opt2 ? opt2[id] : null;
//       if (opt2 && formValue) {
//         selectedName = opt2[nameKey] || opt2.name || "";
//       }
//       console.log(materialId, "---landingEntrancePrice2---", selectedName);

//       if (opt2) {
//         // default remaining floors
//         let floors2 = Math.max(totalOpenings - splitCount, 0);

//         // override with explicit From/To
//         if (formData.landingEntranceSubType2_fromFloor && formData.landingEntranceSubType2_toFloor) {
//           const from = Number(formData.landingEntranceSubType2_fromFloor);
//           const to = Number(formData.landingEntranceSubType2_toFloor);
//           if (!isNaN(from) && !isNaN(to) && to >= from) {
//             floors2 = to - from + 1;
//           }
//         }

//         const unit2 = unitOf(opt2);
//         price2 = unit2 * floors2;

//         breakdownParts.push(
//           `${opt2.name} (${floors2} × ₹${unit2.toLocaleString()}) = ₹ ${price2.toLocaleString()}`
//         );

//         quantity = floors2; // set quantity for Landing Entrance 2
//       }
//     }


//     const totalPrice = price1 + price2;

//     // 🧩 Find if the same material type already exists in selectedMaterials
//     const existingMaterials = formData.selectedMaterials || [];
//     const existingIndex = existingMaterials.findIndex(
//       (item) =>
//         item.materialType?.toLowerCase() === itemMainName?.toLowerCase()
//     );

//     console.log(existingMaterials, ">>>>>>>> existingMaterials[existingIndex] >>>>>>>", existingMaterials[existingIndex]);
//     console.log(operator, ">>>>>>>>operator>>>>>lead>>>>>>>", lead);
//     // ✅ Build newMaterial with existing id (if found)

//     const unitPrice = quantity > 0 ? totalPrice / quantity : 0;
//     const newMaterial = {
//       id: existingIndex !== -1 ? existingMaterials[existingIndex].id : null,
//       leadId: lead,
//       quotationLiftDetailId: formData.quotLiftDetailId || null,
//       materialId: materialId,          // ID of the selected option
//       materialName: selectedName,
//       materialDisplayName: selectedName,
//       quantity: quantity,
//       quantityUnit: itemUnit,
//       unitPrice: unitPrice,
//       price: totalPrice,               // The total calculated price
//       operatorType: operator,  // Assuming liftType is available
//       materialType: itemMainName,      // "Guide Rail", "Door", etc.
//     };

//     if (setPrice === "cabinPrice") {
//       console.log("----->newMaterial----->", newMaterial);
//     }

//     return {
//       totalPrice: price1 + price2,
//       breakdownParts,
//       price1,
//       price2,
//       selectedName,
//       newMaterial,
//       quantity,
//     };
//   }, [isAirSystem, priceVal, options, formValue, id, formData.openings, formData.landingEntranceCount, formData.stops, formData.liftQuantity, setPrice, nameKey, itemMainName, formData.liftType, formData.leadId, formData.quotLiftDetailId, formData.landingEntranceSubType2_fromFloor, formData.landingEntranceSubType2_toFloor,]);


//   // write total back into formData
//   // 2. ✅ Apply initial mount check here to prevent execution on first render
//   useEffect(() => {

//     // Skip execution on initial component mount
//     if (isInitialMount.current) {
//       isInitialMount.current = false;
//       return;
//     }

//     if (!setFormData || !setPrice && !setName) return;

//     setFormData((prev) => {
//       const next = { ...prev };
//       let updated = false;

//       if (setPrice === "landingEntrancePrice1") {
//         if (price1 !== undefined && prev.landingEntrancePrice1 !== price1) {
//           next.landingEntrancePrice1 = price1;
//           next.landingEntranceCount = quantity;
//           updated = true;
//         }
//       } else if (setPrice === "landingEntrancePrice2") {
//         if (price2 !== undefined && prev.landingEntrancePrice2 !== price2) {
//           next.landingEntrancePrice2 = price2;
//           const totalOpenings = Number(prev.openings) || 0;
//           const splitCount = Number(prev.landingEntranceCount) || 0;

//           let fromFloor = Number(prev.landingEntranceSubType2_fromFloor);
//           let toFloor = Number(prev.landingEntranceSubType2_toFloor);

//           // CASE 2 — Auto-generate from/to if not set
//           if (isNaN(fromFloor) || isNaN(toFloor) || toFloor < fromFloor) {
//             fromFloor = splitCount + 1;
//             toFloor = totalOpenings;
//           }

//           next.landingEntranceSubType2_fromFloor = fromFloor;
//           next.landingEntranceSubType2_toFloor = toFloor;

//           updated = true;
//         }
//       } else if (setPrice) {
//         console.log(setPrice + '======>price1:- ' + price1 + "---------price2:- " + price2 + "---totalPrice------" + totalPrice);
//         if (prev[setPrice] !== totalPrice) {
//           next[setPrice] = totalPrice || 0;
//           updated = true;
//         }
//       }

//       if (setName && prev[setName] !== selectedName) {
//         next[setName] = selectedName;
//         updated = true;
//       }

//       // 3. ✅ SAVE STRUCTURED MATERIAL OBJECT
//       const materialFieldName = setPrice ? `${setPrice.replace('Price', '')}Material` : null;

//       console.log(newMaterial, "Material Field Name:", materialFieldName);

//       if (materialFieldName) {
//         if (newMaterial.materialId) {
//           console.log("---newMaterial:---", newMaterial);
//           console.log("JSON.stringify(prev[materialFieldName]):", JSON.stringify(prev[materialFieldName]));
//           console.log("JSON.stringify(newMaterial):", JSON.stringify(newMaterial));
//           console.log("Are they equal?", JSON.stringify(prev[materialFieldName]) === JSON.stringify(newMaterial));
//           console.log("prev[materialFieldName]", prev[materialFieldName]);

//           if (JSON.stringify(prev[materialFieldName]) !== JSON.stringify(newMaterial)) {
//             next[materialFieldName] = newMaterial;
//             updated = true;
//           }
//         } else {
//           // If selection is cleared, set the material object to null/undefined
//           if (prev[materialFieldName] !== undefined && prev[materialFieldName] !== null) {
//             next[materialFieldName] = null;
//             updated = true;
//           }
//         }
//       }


//       console.log(materialFieldName, "---next---", next[materialFieldName]);

//       return updated ? next : prev;
//     });
//   }, [
//     price1,
//     price2,
//     quantity,
//     totalPrice,
//     selectedName,
//     setPrice,
//     setName,
//     setFormData,
//     newMaterial, // Include newMaterial so the effect reacts to calculation changes
//   ]);

//   // nothing to display
//   if (showPrice && (!totalPrice || totalPrice === 0)) return null;

//   return (
//     <div className={`absolute right-8 mt-[4.1rem] text-xs font-semibold tracking-wide ${color}`}>
//       {label ? (
//         <>
//           {!(setPrice === "landingEntrancePrice1" || setPrice === "landingEntrancePrice2") && showPrice && (
//             <span>
//               {/* Check if a breakdown exists */}
//               {breakdownParts && breakdownParts.length > 0 ? (
//                 // Condition 1: Breakdown exists
//                 <>
//                   {label}
//                   <span className="font-medium space-y-1">
//                     {breakdownParts.map((b, i) => (
//                       <span key={i}>{b}</span>
//                     ))}
//                   </span>
//                 </>
//               ) : (
//                 // Condition 2: No breakdown, show label followed by price
//                 <>
//                   {label}
//                   <span className="font-medium space-y-1">
//                     :{" "}₹ {totalPrice.toLocaleString()}
//                   </span>
//                 </>
//               )}
//             </span>
//           )}


//           {(setPrice === "landingEntrancePrice1" || setPrice === "landingEntrancePrice2") && showPrice && (
//             <span>
//               {/* Check if a breakdown exists */}
//               {breakdownParts && breakdownParts.length > 0 ? (
//                 // Condition 1: Breakdown exists
//                 <>
//                   {label}
//                   <span className="font-medium space-y-1">
//                     {breakdownParts.map((b, i) => (
//                       <span key={i}>{b}</span>
//                     ))}
//                   </span>
//                 </>
//               ) : (
//                 // Condition 2: No breakdown, show label followed by price
//                 <>
//                   {label}
//                   <span className="font-medium space-y-1">
//                     :{" "}₹ {totalPrice.toLocaleString()}
//                   </span>
//                 </>
//               )}
//             </span>
//           )}


//         </>
//       ) : (
//         <>
//           {showPrice && !(setPrice === "landingEntrancePrice1" || setPrice === "landingEntrancePrice2") && (
//             <span>
//               Price
//               {breakdownParts && breakdownParts.length > 0 ? (
//                 // Condition 1: Breakdown exists
//                 <>
//                   <span className="font-medium space-y-1">
//                     {breakdownParts.map((b, i) => (
//                       <span key={i}>{b}</span>
//                     ))}
//                   </span>
//                 </>
//               ) : (
//                 // Condition 2: No breakdown, show label followed by price
//                 <>

//                   <span className="font-medium space-y-1">
//                     {" "}₹ {totalPrice.toLocaleString()}
//                   </span>
//                 </>
//               )}
//             </span>
//           )}
//         </>
//       )}
//     </div>
//   );

// };



//------------------------>working without selected materials--------->
// export const PriceBelowSelect = ({
//   id = "id",
//   options,
//   label,
//   formValue,               // single id or array of ids
//   color = "green-600",
//   isAirSystem = false,
//   showPrice = true,
//   priceVal = 0,
//   setPrice = "",
//   // setName = "",
//   // nameKey = "name",
//   // itemMainName = "",
//   // itemUnit = "",
//   setFormData,
//   formData = {},           // must pass whole formData (openings, landingEntranceCount etc.)
//   isOnlyLabel = false,
//   // lead_id,
//   // lift,
// }) => {
//   // const lead = lead_id ?? formData.leadId;
//   // const operator = lift ?? formData.liftType;

//   // 1. ✅ State/Ref to track if the component has mounted
//   const isInitialMount = useRef(true);

//   if (isOnlyLabel) {
//     if (!label) return null;

//     return (
//       <div className={`absolute right-8 mt-[4.1rem] text-xs font-semibold tracking-wide ${color}`}>
//         <span className="font-medium space-y-1">{label}</span>
//       </div>
//     );
//   }

//   if (!showPrice) {
//     return null;
//   }

//   // const { totalPrice, breakdownParts, price1, price2, quantity, selectedName, newMaterial } = useMemo(() => {
//   const { totalPrice, breakdownParts, price1, price2, quantity } = useMemo(() => {
//     // if (isArdSystem) return { totalPrice: priceVal || 0, breakdownParts: [], price1: 0, price2: 0 };
//     if (!options) {
//       return {
//         totalPrice: priceVal || 0,
//         breakdownParts: [],
//         price1: 0,
//         price2: 0,
//       };
//     }
//     const totalOpenings = Number(formData.openings) || 0;
//     const splitCount = Number(formData.landingEntranceCount) || 0;

//     const noOfStops = Number(formData.stops) || 0;
//     const liftQuantity = Number(formData.liftQuantity) || 1;

//     console.log(options, "-------options--------formValue--->", formValue);

//     // helper to find option
//     const findOpt = (sid) => options.find(o => String(o[id]) === String(sid));
//     const unitOf = (opt) => (opt?.price ?? opt?.prize ?? 0);

//     let price1 = 0, price2 = 0;
//     let breakdownParts = [];
//     let finalGuideRailQty = 0;

//     const sid = Array.isArray(formValue) ? formValue[0] : formValue;
//     const opt = findOpt(sid);

//     console.log(options, "-------options----------->", sid, "..........", opt);

//     // let materialId = opt ? opt[id] : null;
//     let quantity = 1; // Default quantity

//     // NAME ASSIGNMENT LOGIC:
//     // let selectedName = "";
//     if (opt && formValue) {
//       quantity = Number(opt.quantity || opt.wireRopeQty
//       ) || 1;

//       // if (Array.isArray(nameKey)) {
//       //   selectedName = nameKey
//       //     .map(key => opt[key])
//       //     .filter(Boolean) // Remove null, undefined, or empty strings
//       //     .join(' / ');    // Join the available names with a separator
//       // } else {
//       //   // Original logic for single key
//       //   selectedName = opt[nameKey] || opt.name || "";
//       // }
//     }

//     let finalPrice = priceVal || 0;

//     // --- SPECIAL AIR SYSTEM LOGIC ---
//     // if (isAirSystem) {
//     //   console.log("----formData.selectedMaterials-------", formData.selectedMaterials);
//     //   const existingMaterials = formData.selectedMaterials || [];

//     //   console.log("----In AIr-------", existingMaterials);
//     //   // Try to find if an Air System material already exists
//     //   const existingIndex = existingMaterials.findIndex(
//     //     (item) =>
//     //       item.materialType?.toLowerCase().includes("Air System".toLowerCase())
//     //   );

//     //   console.log("----In AIr--existingIndex-----", existingIndex);
//     //   console.log("----In AIr---existingMaterials[existingIndex]----", existingMaterials[existingIndex]);

//     //   const existing = existingIndex !== -1 ? existingMaterials[existingIndex] : {};

//     //   const airMaterial = {
//     //     ...existing,  // keep id, quotationLiftDetailId, etc.
//     //     id: existing.id,
//     //     leadId: formData.leadId ?? existing.leadId,
//     //     quotationLiftDetailId: existing.quotationLiftDetailId,
//     //     materialId: materialId ?? existing.materialId,
//     //     materialName: selectedName || existing.materialName || "Air System",
//     //     materialDisplayName: selectedName || existing.materialName || "Air System",
//     //     quantity: 1,
//     //     quantityUnit: existing.quantityUnit || "",
//     //     unitPrice: finalPrice ?? existing.price ?? 0,//-----as quantity =1
//     //     price: finalPrice ?? existing.price ?? 0,
//     //     operatorType: formData.liftType ?? existing.operatorType,
//     //     materialType: itemMainName || existing.materialType || "Air System",
//     //   };

//     //   // Prepare updated materials list (for reference/debugging, optional)
//     //   let updatedMaterials = [...existingMaterials];
//     //   if (existingIndex !== -1) {
//     //     updatedMaterials[existingIndex] = airMaterial; // Update
//     //   } else {
//     //     updatedMaterials.push(airMaterial); // Add new
//     //   }

//     //   // ✅ Return the airMaterial for parent to use
//     //   return {
//     //     totalPrice: finalPrice,
//     //     breakdownParts: [],
//     //     price1: 0,
//     //     price2: 0,
//     //     selectedName,
//     //     newMaterial: airMaterial,
//     //   };
//     // }

//     // console.log(materialId, "---materialId---", selectedName);
//     // --- GUIDERAIL LOGIC ---
//     if (setPrice === "guideRailPrice") {

//       if (opt && noOfStops > 0) {
//         const unitPrice = unitOf(opt);

//         // Calculate rounded quantity (PHP $guide_rail_qty1)
//         // Note: Assuming calculateRoundedGuideRailQuantity is available
//         const roundedQty1 = 1 // calculateRoundedGuideRailQuantity(noOfStops); 

//         // Calculate final quantity (PHP $guide_rail_qty2)
//         finalGuideRailQty = roundedQty1 * liftQuantity;

//         // Calculate total price (PHP $guide_rail_price)
//         price1 = unitPrice * finalGuideRailQty;

//         // Optional breakdown
//         breakdownParts.push(
//           // `${opt.counterWeightName} (${finalGuideRailQty.toFixed(2)} × ₹${unitPrice.toLocaleString()}) = ₹ ${price1.toLocaleString()}`
//           `(${finalGuideRailQty.toFixed(2)} × ₹${unitPrice.toLocaleString()}) = ₹ ${price1.toLocaleString()}`
//         );

//         quantity = finalGuideRailQty || 0;
//       }
//     }
//     // -------------------------

//     // --- LOP TYPE LOGIC: unitPrice * noOfStops ---
//     else if (setPrice === "lopTypePrice") {
//       if (opt && noOfStops > 0) {
//         const unitPrice = unitOf(opt);

//         // Use noOfStops as the quantity/multiplier
//         const count = noOfStops;

//         price1 = unitPrice * count;

//         breakdownParts.push(
//           `(${count} × ₹${unitPrice.toLocaleString()}) = ₹ ${price1.toLocaleString()}`
//         );

//         quantity = count;
//       }
//     }

//     // ---------------------------------------------

//     // ✅ Default single price (for other non-split items)
//     else if (
//       setPrice &&
//       setPrice !== "landingEntrancePrice1" &&
//       setPrice !== "landingEntrancePrice2"
//     ) {
//       // if (setPrice == "airSystemPrice") {
//       //   console.log("=====airSystemPrice====>", opt);
//       // }
//       // const sid = Array.isArray(formValue) ? formValue[0] : formValue;
//       // const opt = findOpt(sid);
//       if (opt) {
//         const unit = unitOf(opt);
//         price1 = unit * quantity; // just the unit price
//         // breakdownParts.push(`${opt.name} = ₹ ${unit.toLocaleString()}`);
//         if (quantity > 1) {
//           breakdownParts.push(
//             `${selectedName}: (${quantity} × ₹${unit.toLocaleString()}) = ₹ ${price1.toLocaleString()}`
//           );
//         } else {
//           breakdownParts.push(
//             `: ₹ ${price1.toLocaleString()}`
//           );
//         }
//       }
//     }

//     // ---- Landing Entrance 1 (always independent) ----
//     else if (setPrice === "landingEntrancePrice1") {
//       const sid1 = Array.isArray(formValue) ? formValue[0] : formValue;
//       const opt1 = findOpt(sid1);
//       // console.log(materialId, "---landingEntrancePrice1---", selectedName);

//       if (opt1) {
//         const floors1 = splitCount || totalOpenings; // if ALL selected, use total
//         const unit1 = unitOf(opt1);
//         price1 = unit1 * floors1;

//         breakdownParts.push(
//           `${opt1.name} (${floors1} × ₹${unit1.toLocaleString()}) = ₹ ${price1.toLocaleString()}`
//         );

//         quantity = floors1; // set quantity for Landing Entrance 1
//       }
//     }

//     // ---- Landing Entrance 2 (only if selected) ----
//     else if (setPrice === "landingEntrancePrice2") {
//       const sid2 = Array.isArray(formValue) ? formValue[1] : null;
//       const opt2 = findOpt(sid2);

//       // let materialId = opt2 ? opt2[id] : null;
//       // if (opt2 && formValue) {
//       //   selectedName = opt2[nameKey] || opt2.name || "";
//       // }
//       // console.log(materialId, "---landingEntrancePrice2---", selectedName);

//       if (opt2) {
//         // default remaining floors
//         let floors2 = Math.max(totalOpenings - splitCount, 0);

//         // override with explicit From/To
//         if (formData.landingEntranceSubType2_fromFloor && formData.landingEntranceSubType2_toFloor) {
//           const from = Number(formData.landingEntranceSubType2_fromFloor);
//           const to = Number(formData.landingEntranceSubType2_toFloor);
//           if (!isNaN(from) && !isNaN(to) && to >= from) {
//             floors2 = to - from + 1;
//           }
//         }

//         const unit2 = unitOf(opt2);
//         price2 = unit2 * floors2;

//         breakdownParts.push(
//           `${opt2.name} (${floors2} × ₹${unit2.toLocaleString()}) = ₹ ${price2.toLocaleString()}`
//         );

//         quantity = floors2; // set quantity for Landing Entrance 2
//       }
//     }


//     const totalPrice = price1 + price2;

//     // // 🧩 Find if the same material type already exists in selectedMaterials
//     // const existingMaterials = formData.selectedMaterials || [];
//     // const existingIndex = existingMaterials.findIndex(
//     //   (item) =>
//     //     item.materialType?.toLowerCase() === itemMainName?.toLowerCase()
//     // );

//     // console.log(existingMaterials, ">>>>>>>> existingMaterials[existingIndex] >>>>>>>", existingMaterials[existingIndex]);
//     // console.log(operator, ">>>>>>>>operator>>>>>lead>>>>>>>", lead);
//     // // ✅ Build newMaterial with existing id (if found)

//     // const unitPrice = quantity > 0 ? totalPrice / quantity : 0;
//     // const newMaterial = {
//     //   id: existingIndex !== -1 ? existingMaterials[existingIndex].id : null,
//     //   leadId: lead,
//     //   quotationLiftDetailId: formData.quotLiftDetailId || null,
//     //   materialId: materialId,          // ID of the selected option
//     //   materialName: selectedName,
//     //   materialDisplayName: selectedName,
//     //   quantity: quantity,
//     //   quantityUnit: itemUnit,
//     //   unitPrice: unitPrice,
//     //   price: totalPrice,               // The total calculated price
//     //   operatorType: operator,  // Assuming liftType is available
//     //   materialType: itemMainName,      // "Guide Rail", "Door", etc.
//     // };

//     // if (setPrice === "cabinPrice") {
//     //   console.log("----->newMaterial----->", newMaterial);
//     // }

//     return {
//       totalPrice: price1 + price2,
//       breakdownParts,
//       price1,
//       price2,
//       // selectedName,
//       // newMaterial,
//       quantity,
//     };
//   // }, [isAirSystem, priceVal, options, formValue, id, formData.openings, formData.landingEntranceCount, formData.stops, formData.liftQuantity, setPrice, nameKey, itemMainName, formData.liftType, formData.leadId, formData.quotLiftDetailId, formData.landingEntranceSubType2_fromFloor, formData.landingEntranceSubType2_toFloor,]);
//    }, [isAirSystem, priceVal, options, formValue, id, formData.openings, formData.landingEntranceCount, formData.stops, formData.liftQuantity, setPrice, formData.liftType, formData.leadId, formData.quotLiftDetailId, formData.landingEntranceSubType2_fromFloor, formData.landingEntranceSubType2_toFloor,]);



//   // write total back into formData
//   // 2. ✅ Apply initial mount check here to prevent execution on first render
//   useEffect(() => {

//     // Skip execution on initial component mount
//     if (isInitialMount.current) {
//       isInitialMount.current = false;
//       return;
//     }

//     if (!setFormData || !setPrice && !setName) return;

//     setFormData((prev) => {
//       const next = { ...prev };
//       let updated = false;

//       if (setPrice === "landingEntrancePrice1") {
//         if (price1 !== undefined && prev.landingEntrancePrice1 !== price1) {
//           next.landingEntrancePrice1 = price1;
//           next.landingEntranceCount = quantity;
//           updated = true;
//         }
//       } else if (setPrice === "landingEntrancePrice2") {
//         if (price2 !== undefined && prev.landingEntrancePrice2 !== price2) {
//           next.landingEntrancePrice2 = price2;
//           const totalOpenings = Number(prev.openings) || 0;
//           const splitCount = Number(prev.landingEntranceCount) || 0;

//           let fromFloor = Number(prev.landingEntranceSubType2_fromFloor);
//           let toFloor = Number(prev.landingEntranceSubType2_toFloor);

//           // CASE 2 — Auto-generate from/to if not set
//           if (isNaN(fromFloor) || isNaN(toFloor) || toFloor < fromFloor) {
//             fromFloor = splitCount + 1;
//             toFloor = totalOpenings;
//           }

//           next.landingEntranceSubType2_fromFloor = fromFloor;
//           next.landingEntranceSubType2_toFloor = toFloor;

//           updated = true;
//         }
//       } else if (setPrice) {
//         console.log(setPrice + '======>price1:- ' + price1 + "---------price2:- " + price2 + "---totalPrice------" + totalPrice);
//         if (prev[setPrice] !== totalPrice) {
//           next[setPrice] = totalPrice || 0;
//           updated = true;
//         }
//       }

//       // if (setName && prev[setName] !== selectedName) {
//       //   next[setName] = selectedName;
//       //   updated = true;
//       // }

//       // // 3. ✅ SAVE STRUCTURED MATERIAL OBJECT
//       // const materialFieldName = setPrice ? `${setPrice.replace('Price', '')}Material` : null;

//       // console.log(newMaterial, "Material Field Name:", materialFieldName);

//       // if (materialFieldName) {
//       //   if (newMaterial.materialId) {
//       //     console.log("---newMaterial:---", newMaterial);
//       //     console.log("JSON.stringify(prev[materialFieldName]):", JSON.stringify(prev[materialFieldName]));
//       //     console.log("JSON.stringify(newMaterial):", JSON.stringify(newMaterial));
//       //     console.log("Are they equal?", JSON.stringify(prev[materialFieldName]) === JSON.stringify(newMaterial));
//       //     console.log("prev[materialFieldName]", prev[materialFieldName]);

//       //     if (JSON.stringify(prev[materialFieldName]) !== JSON.stringify(newMaterial)) {
//       //       next[materialFieldName] = newMaterial;
//       //       updated = true;
//       //     }
//       //   } else {
//       //     // If selection is cleared, set the material object to null/undefined
//       //     if (prev[materialFieldName] !== undefined && prev[materialFieldName] !== null) {
//       //       next[materialFieldName] = null;
//       //       updated = true;
//       //     }
//       //   }
//       // }


//       // console.log(materialFieldName, "---next---", next[materialFieldName]);

//       return updated ? next : prev;
//     });
//   }, [
//     price1,
//     price2,
//     quantity,
//     totalPrice,
//     // selectedName,
//     setPrice,
//     // setName,
//     setFormData,
//     // newMaterial, // Include newMaterial so the effect reacts to calculation changes
//   ]);

//   // nothing to display
//   if (showPrice && (!totalPrice || totalPrice === 0)) return null;

//   return (
//     <div className={`absolute right-8 mt-[4.1rem] text-xs font-semibold tracking-wide ${color}`}>
//       {label ? (
//         <>
//           {!(setPrice === "landingEntrancePrice1" || setPrice === "landingEntrancePrice2") && showPrice && (
//             <span>
//               {/* Check if a breakdown exists */}
//               {breakdownParts && breakdownParts.length > 0 ? (
//                 // Condition 1: Breakdown exists
//                 <>
//                   {label}
//                   <span className="font-medium space-y-1">
//                     {breakdownParts.map((b, i) => (
//                       <span key={i}>{b}</span>
//                     ))}
//                   </span>
//                 </>
//               ) : (
//                 // Condition 2: No breakdown, show label followed by price
//                 <>
//                   {label}
//                   <span className="font-medium space-y-1">
//                     :{" "}₹ {totalPrice.toLocaleString()}
//                   </span>
//                 </>
//               )}
//             </span>
//           )}


//           {(setPrice === "landingEntrancePrice1" || setPrice === "landingEntrancePrice2") && showPrice && (
//             <span>
//               {/* Check if a breakdown exists */}
//               {breakdownParts && breakdownParts.length > 0 ? (
//                 // Condition 1: Breakdown exists
//                 <>
//                   {label}
//                   <span className="font-medium space-y-1">
//                     {breakdownParts.map((b, i) => (
//                       <span key={i}>{b}</span>
//                     ))}
//                   </span>
//                 </>
//               ) : (
//                 // Condition 2: No breakdown, show label followed by price
//                 <>
//                   {label}
//                   <span className="font-medium space-y-1">
//                     :{" "}₹ {totalPrice.toLocaleString()}
//                   </span>
//                 </>
//               )}
//             </span>
//           )}


//         </>
//       ) : (
//         <>
//           {showPrice && !(setPrice === "landingEntrancePrice1" || setPrice === "landingEntrancePrice2") && (
//             <span>
//               Price
//               {breakdownParts && breakdownParts.length > 0 ? (
//                 // Condition 1: Breakdown exists
//                 <>
//                   <span className="font-medium space-y-1">
//                     {breakdownParts.map((b, i) => (
//                       <span key={i}>{b}</span>
//                     ))}
//                   </span>
//                 </>
//               ) : (
//                 // Condition 2: No breakdown, show label followed by price
//                 <>

//                   <span className="font-medium space-y-1">
//                     {" "}₹ {totalPrice.toLocaleString()}
//                   </span>
//                 </>
//               )}
//             </span>
//           )}
//         </>
//       )}
//     </div>
//   );

// };





// export const PriceBelowSelect = ({
//   id = "id",
//   options,
//   label,
//   formValue,               // single id or array of ids
//   color = "green-600",
//   isAirSystem = false,
//   isArdSystem = false,
//   showPrice = true,
//   priceVal = 0,
//   setPrice = "",
//   setName = "",
//   nameKey = "name",
//   itemMainName = "",
//   itemUnit = "",
//   setFormData,
//   formData = {},           // must pass whole formData (openings, landingEntranceCount etc.)
//   isOnlyLabel = false,
//   lead_id,
//   lift,
//   onMaterialChange,
//   selectedMaterialFrmParent,
// }) => {
//   const lead = lead_id ?? formData.leadId;
//   const operator = lift ?? formData.liftType;

//   // 1. ✅ State/Ref to track if the component has mounted
//   const isInitialMount = useRef(true);

//   if (isOnlyLabel) {
//     if (!label) return null;

//     return (
//       <div className={`absolute right-8 mt-[4.1rem] text-xs font-semibold tracking-wide ${color}`}>
//         <span className="font-medium space-y-1">{label}</span>
//       </div>
//     );
//   }

//   if (!showPrice) {
//     return null;
//   }

//   const { totalPrice, breakdownParts, price1, price2, quantity, selectedName, newMaterial } = useMemo(() => {
//     // if (isArdSystem) return { totalPrice: priceVal || 0, breakdownParts: [], price1: 0, price2: 0 };
//     if (!formValue || (Array.isArray(formValue) && formValue.length === 0)) {
//       return {
//         totalPrice: priceVal || 0,
//         breakdownParts: [],
//         price1: 0,
//         price2: 0,
//         selectedName: "",
//         newMaterial: null, // ⭐️ RETURN NULL WHEN NO SELECTION
//       };
//     }

//     if (!options) {
//       return {
//         totalPrice: priceVal || 0,
//         breakdownParts: [],
//         price1: 0,
//         price2: 0,
//         selectedName: "",
//         newMaterial: null,
//       };
//     }
//     const totalOpenings = Number(formData.openings) || 0;
//     const splitCount = Number(formData.landingEntranceCount) || 0;

//     const noOfStops = Number(formData.stops) || 0;
//     const liftQuantity = Number(formData.liftQuantity) || 1;

//     console.log(options, "-------options--------formValue--->", formValue);

//     // helper to find option
//     const findOpt = (sid) => options.find(o => String(o[id]) === String(sid));
//     const unitOf = (opt) => (opt?.price ?? opt?.prize ?? 0);

//     let price1 = 0, price2 = 0;
//     let breakdownParts = [];
//     let finalGuideRailQty = 0;

//     const sid = Array.isArray(formValue) ? formValue[0] : formValue;
//     const opt = findOpt(sid);

//     console.log(options, "-------options----------->", sid, "..........", opt);

//     let materialId = opt ? opt[id] : null;
//     let quantity = 1; // Default quantity
//     // NAME ASSIGNMENT LOGIC:
//     let selectedName = "";
//     if (opt && formValue) {
//       quantity = Number(opt.quantity || opt.wireRopeQty
//       ) || 1;
//       // selectedName = opt[nameKey] || opt.name || "";
//       if (Array.isArray(nameKey)) {
//         selectedName = nameKey
//           .map(key => opt[key])
//           .filter(Boolean) // Remove null, undefined, or empty strings
//           .join(' / ');    // Join the available names with a separator
//       } else {
//         // Original logic for single key
//         selectedName = opt[nameKey] || opt.name || "";
//       }
//     }

//     let finalPrice = priceVal || 0;

//     // --- SPECIAL AIR SYSTEM LOGIC ---
//     if (isAirSystem) {
//       console.log("----formData.selectedMaterials-------", formData.selectedMaterials);
//       const existingMaterials = formData.selectedMaterials || [];

//       console.log("----In AIr-------", existingMaterials);
//       // Try to find if an Air System material already exists
//       const existingIndex = existingMaterials.findIndex(
//         (item) =>
//           item.materialType?.toLowerCase().includes("Air System".toLowerCase())
//       );

//       console.log("----In AIr--existingIndex-----", existingIndex);
//       console.log("----In AIr---existingMaterials[existingIndex]----", existingMaterials[existingIndex]);

//       const existing = existingIndex !== -1 ? existingMaterials[existingIndex] : {};

//       const airMaterial = {
//         ...existing,  // keep id, quotationLiftDetailId, etc.
//         id: existing?.id || null,
//         leadId: formData.leadId ?? existing.leadId,
//         quotationLiftDetailId: existing?.quotationLiftDetailId || null,
//         materialId: materialId ?? existing.materialId,
//         materialName: selectedName || existing.materialName || "Air System",
//         materialDisplayName: selectedName || existing.materialName || "Air System",
//         quantity: 1,
//         quantityUnit: existing.quantityUnit || "",
//         unitPrice: finalPrice ?? existing.price ?? 0,//-----as quantity =1
//         price: finalPrice ?? existing.price ?? 0,
//         operatorType: formData.liftType ?? existing.operatorType,
//         materialType: itemMainName || existing.materialType || "Air System",
//       };

//       // Prepare updated materials list (for reference/debugging, optional)
//       let updatedMaterials = [...existingMaterials];
//       if (existingIndex !== -1) {
//         updatedMaterials[existingIndex] = airMaterial; // Update
//       } else {
//         updatedMaterials.push(airMaterial); // Add new
//       }

//       // ✅ Return the airMaterial for parent to use
//       return {
//         totalPrice: finalPrice,
//         breakdownParts: [],
//         price1: 0,
//         price2: 0,
//         selectedName,
//         newMaterial: airMaterial,
//       };
//     }

//     // console.log(materialId, "---materialId---", selectedName);
//     // --- GUIDERAIL LOGIC ---
//     if (setPrice === "guideRailPrice") {

//       if (opt && noOfStops > 0) {
//         const unitPrice = unitOf(opt);

//         // Calculate rounded quantity (PHP $guide_rail_qty1)
//         // Note: Assuming calculateRoundedGuideRailQuantity is available
//         const roundedQty1 = 1 // calculateRoundedGuideRailQuantity(noOfStops); 

//         // Calculate final quantity (PHP $guide_rail_qty2)
//         finalGuideRailQty = roundedQty1 * liftQuantity;

//         // Calculate total price (PHP $guide_rail_price)
//         price1 = unitPrice * finalGuideRailQty;

//         // Optional breakdown
//         breakdownParts.push(
//           // `${opt.counterWeightName} (${finalGuideRailQty.toFixed(2)} × ₹${unitPrice.toLocaleString()}) = ₹ ${price1.toLocaleString()}`
//           `(${finalGuideRailQty.toFixed(2)} × ₹${unitPrice.toLocaleString()}) = ₹ ${price1.toLocaleString()}`
//         );

//         quantity = finalGuideRailQty || 0;
//       }
//     }
//     // -------------------------

//     // --- LOP TYPE LOGIC: unitPrice * noOfStops ---
//     else if (setPrice === "lopTypePrice") {
//       if (opt && noOfStops > 0) {
//         const unitPrice = unitOf(opt);

//         // Use noOfStops as the quantity/multiplier
//         const count = noOfStops;

//         price1 = unitPrice * count;

//         breakdownParts.push(
//           `(${count} × ₹${unitPrice.toLocaleString()}) = ₹ ${price1.toLocaleString()}`
//         );

//         quantity = count;
//       }
//     }

//     // ---------------------------------------------

//     // ✅ Default single price (for other non-split items)
//     else if (
//       setPrice &&
//       setPrice !== "landingEntrancePrice1" &&
//       setPrice !== "landingEntrancePrice2"
//     ) {
//       if (setPrice == "airSystemPrice") {
//         console.log("=====airSystemPrice====>", opt);
//       }
//       // const sid = Array.isArray(formValue) ? formValue[0] : formValue;
//       // const opt = findOpt(sid);
//       if (opt) {
//         const unit = unitOf(opt);
//         price1 = unit * quantity; // just the unit price
//         // breakdownParts.push(`${opt.name} = ₹ ${unit.toLocaleString()}`);
//         if (quantity > 1) {
//           breakdownParts.push(
//             `${selectedName}: (${quantity} × ₹${unit.toLocaleString()}) = ₹ ${price1.toLocaleString()}`
//           );
//         } else {
//           breakdownParts.push(
//             `: ₹ ${price1.toLocaleString()}`
//           );
//         }
//       }
//     }

//     // ---- Landing Entrance 1 (always independent) ----
//     else if (setPrice === "landingEntrancePrice1") {
//       const sid1 = Array.isArray(formValue) ? formValue[0] : formValue;
//       const opt1 = findOpt(sid1);
//       console.log(materialId, "---landingEntrancePrice1---", selectedName);

//       if (opt1) {
//         const floors1 = splitCount || totalOpenings; // if ALL selected, use total
//         const unit1 = unitOf(opt1);
//         price1 = unit1 * floors1;

//         breakdownParts.push(
//           `${opt1.name} (${floors1} × ₹${unit1.toLocaleString()}) = ₹ ${price1.toLocaleString()}`
//         );

//         quantity = floors1; // set quantity for Landing Entrance 1
//       }
//     }

//     // ---- Landing Entrance 2 (only if selected) ----
//     else if (setPrice === "landingEntrancePrice2") {
//       const sid2 = Array.isArray(formValue) ? formValue[1] : null;
//       const opt2 = findOpt(sid2);

//       let materialId = opt2 ? opt2[id] : null;
//       if (opt2 && formValue) {
//         selectedName = opt2[nameKey] || opt2.name || "";
//       }
//       console.log(materialId, "---landingEntrancePrice2---", selectedName);

//       if (opt2) {
//         // default remaining floors
//         let floors2 = Math.max(totalOpenings - splitCount, 0);

//         // override with explicit From/To
//         if (formData.landingEntranceSubType2_fromFloor && formData.landingEntranceSubType2_toFloor) {
//           const from = Number(formData.landingEntranceSubType2_fromFloor);
//           const to = Number(formData.landingEntranceSubType2_toFloor);
//           if (!isNaN(from) && !isNaN(to) && to >= from) {
//             floors2 = to - from + 1;
//           }
//         }

//         const unit2 = unitOf(opt2);
//         price2 = unit2 * floors2;

//         breakdownParts.push(
//           `${opt2.name} (${floors2} × ₹${unit2.toLocaleString()}) = ₹ ${price2.toLocaleString()}`
//         );

//         quantity = floors2; // set quantity for Landing Entrance 2
//       }
//     }


//     const totalPrice = price1 + price2;

//     const selectedMaterial = formData.selectedMaterials ?? [];
//     // 🧩 Find if the same material type already exists in selectedMaterials
//     console.log(selectedMaterialFrmParent,">>>>>>>> formData.selectedMaterials >>>>>>>", formData.selectedMaterials);

//     if (!Array.isArray(selectedMaterial) || selectedMaterial.length === 0) {
//       return {
//         totalPrice: price1 + price2,
//         breakdownParts,
//         price1,
//         price2,
//         selectedName : "",
//         newMaterial : [],
//         quantity,
//       };
//     }

//     const existingMaterials = selectedMaterial || [];

//     console.log(existingMaterials, "00000000000000000000> existingMaterials[existingIndex] 0000000000000000");

//     // const alreadyExists = existingMaterials.some(
//     //   item =>
//     //     item.materialType?.toLowerCase() === itemMainName?.toLowerCase()
//     // );

//     // console.log(alreadyExists, "00000000000000000000> alreadyExists 0000000000000000",itemMainName);


//     // if (alreadyExists) {
//     //   return {
//     //     totalPrice: price1 + price2,
//     //     breakdownParts,
//     //     price1,
//     //     price2,
//     //     selectedName : "",
//     //     newMaterial : [],
//     //     quantity,
//     //   };
//     // }

//     const existingIndex = existingMaterials.findIndex(
//       (item) =>
//         item.materialType?.toLowerCase() === itemMainName?.toLowerCase() 
//     );

//     console.log(existingMaterials, ">>>>>>>> existingMaterials[existingIndex] >>>>>>>", existingMaterials[existingIndex]);
//     console.log(operator, ">>>>>>>>operator>>>>>lead>>>>>>>", lead);
//     // ✅ Build newMaterial with existing id (if found)

//     const unitPrice = quantity > 0 ? totalPrice / quantity : 0;
//     const newMaterial = {
//       id: existingIndex !== -1 ? existingMaterials[existingIndex].id : null,
//       leadId: lead,
//       quotationLiftDetailId: formData.quotLiftDetailId || null,
//       materialId: materialId,          // ID of the selected option
//       materialName: selectedName,
//       materialDisplayName: selectedName,
//       quantity: quantity,
//       quantityUnit: itemUnit,
//       unitPrice: unitPrice,
//       price: totalPrice,               // The total calculated price
//       operatorType: operator,  // Assuming liftType is available
//       materialType: itemMainName,      // "Guide Rail", "Door", etc.
//     };

//     if (setPrice === "cabinSubTypePrice") {
//       console.log("----->newMaterial----->", newMaterial);
//     }

//     return {
//       totalPrice: price1 + price2,
//       breakdownParts,
//       price1,
//       price2,
//       selectedName,
//       newMaterial,
//       quantity,
//     };
//   }, [isAirSystem, priceVal, options, formValue, id, formData.openings, formData.landingEntranceCount, formData.stops, formData.liftQuantity, setPrice, nameKey, itemMainName, formData.liftType, formData.leadId, formData.quotLiftDetailId, formData.landingEntranceSubType2_fromFloor, formData.landingEntranceSubType2_toFloor,]);


//   // write total back into formData
//   // 2. ✅ Apply initial mount check here to prevent execution on first render
//   useEffect(() => {

//     // Skip execution on initial component mount
//     if (isInitialMount.current) {
//       isInitialMount.current = false;
//       return;
//     }

//     if (!setFormData || !setPrice && !setName) return;

//     let materialUpdated = false;

//     // --- ⭐️ STEP 1: Handle Material Change via Callback ---
//     if (onMaterialChange && itemMainName) {
//       // Check if the material object has changed its contents
//       const materialFieldName = setPrice ? `${setPrice.replace('Price', '')}Material` : null;

//       // We must check if the newMaterial object is different from the one 
//       // currently stored in the *intermediate* field (if it were still used)
//       // or check against the last material sent, but simplest is to check against prev form data

//       // Since we removed the intermediate field, we check if newMaterial is logically different
//       // from the last time we ran this effect. The easiest way is to let the parent handle the check
//       // via its own JSON.stringify comparison (as implemented in the parent handler above).

//       const isMaterialValid = newMaterial && newMaterial.materialId;
//       const materialObjectToSend = isMaterialValid ? newMaterial : null;

//       // Check if the old intermediate field (if it were still present) is different
//       // If the price or name is changing, the material object implicitly changes.
//       if (isMaterialValid || (!isMaterialValid && formData[materialFieldName])) {
//         onMaterialChange(itemMainName, materialObjectToSend);
//         materialUpdated = true;
//       }
//     }
//     // --- ⭐️ END OF MATERIAL CHANGE ---

//     setFormData((prev) => {
//       const next = { ...prev };
//       let priceNameUpdated = false;
//       let updated = false;

//       if (setPrice === "landingEntrancePrice1") {
//         if (price1 !== undefined && prev.landingEntrancePrice1 !== price1) {
//           next.landingEntrancePrice1 = price1;
//           next.landingEntranceCount = quantity;
//           priceNameUpdated = true;
//         }
//       } else if (setPrice === "landingEntrancePrice2") {
//         if (price2 !== undefined && prev.landingEntrancePrice2 !== price2) {
//           next.landingEntrancePrice2 = price2;
//           const totalOpenings = Number(prev.openings) || 0;
//           const splitCount = Number(prev.landingEntranceCount) || 0;

//           let fromFloor = Number(prev.landingEntranceSubType2_fromFloor);
//           let toFloor = Number(prev.landingEntranceSubType2_toFloor);

//           // CASE 2 — Auto-generate from/to if not set
//           if (isNaN(fromFloor) || isNaN(toFloor) || toFloor < fromFloor) {
//             fromFloor = splitCount + 1;
//             toFloor = totalOpenings;
//           }

//           next.landingEntranceSubType2_fromFloor = fromFloor;
//           next.landingEntranceSubType2_toFloor = toFloor;

//           priceNameUpdated = true;
//         }
//       } else if (setPrice) {
//         console.log(setPrice + '======>price1:- ' + price1 + "---------price2:- " + price2 + "---totalPrice------" + totalPrice);
//         if (prev[setPrice] !== totalPrice) {
//           next[setPrice] = totalPrice || 0;
//           priceNameUpdated = true;
//         }
//       }

//       if (setName && prev[setName] !== selectedName) {
//         next[setName] = selectedName;
//         priceNameUpdated = true;
//       }

//       // // 3. ✅ SAVE STRUCTURED MATERIAL OBJECT
//       // const materialFieldName = setPrice ? `${setPrice.replace('Price', '')}Material` : null;

//       // console.log(newMaterial, "Material Field Name:", materialFieldName);

//       // if (materialFieldName) {
//       //   if (newMaterial.materialId) {
//       //     console.log("---newMaterial:---", newMaterial);
//       //     console.log("JSON.stringify(prev[materialFieldName]):", JSON.stringify(prev[materialFieldName]));
//       //     console.log("JSON.stringify(newMaterial):", JSON.stringify(newMaterial));
//       //     console.log("Are they equal?", JSON.stringify(prev[materialFieldName]) === JSON.stringify(newMaterial));
//       //     console.log("prev[materialFieldName]", prev[materialFieldName]);

//       //     if (JSON.stringify(prev[materialFieldName]) !== JSON.stringify(newMaterial)) {
//       //       next[materialFieldName] = newMaterial;
//       //       updated = true;
//       //     }
//       //   } else {
//       //     // If selection is cleared, set the material object to null/undefined
//       //     if (prev[materialFieldName] !== undefined && prev[materialFieldName] !== null) {
//       //       next[materialFieldName] = null;
//       //       updated = true;
//       //     }
//       //   }
//       // }


//       // console.log(materialFieldName, "---next---", next[materialFieldName]);

//       return updated ? next : prev;
//     });
//   }, [
//     price1,
//     price2,
//     quantity,
//     totalPrice,
//     selectedName,
//     setPrice,
//     setName,
//     setFormData,
//     newMaterial, // Include newMaterial so the effect reacts to calculation changes
//   ]);

//   // nothing to display
//   if (showPrice && (!totalPrice || totalPrice === 0)) return null;

//   return (
//     <div className={`absolute right-8 mt-[4.1rem] text-xs font-semibold tracking-wide ${color}`}>
//       {label ? (
//         <>
//           {!(setPrice === "landingEntrancePrice1" || setPrice === "landingEntrancePrice2") && showPrice && (
//             <span>
//               {/* Check if a breakdown exists */}
//               {breakdownParts && breakdownParts.length > 0 ? (
//                 // Condition 1: Breakdown exists
//                 <>
//                   {label}
//                   <span className="font-medium space-y-1">
//                     {breakdownParts.map((b, i) => (
//                       <span key={i}>{b}</span>
//                     ))}
//                   </span>
//                 </>
//               ) : (
//                 // Condition 2: No breakdown, show label followed by price
//                 <>
//                   {label}
//                   <span className="font-medium space-y-1">
//                     :{" "}₹ {totalPrice.toLocaleString()}
//                   </span>
//                 </>
//               )}
//             </span>
//           )}


//           {(setPrice === "landingEntrancePrice1" || setPrice === "landingEntrancePrice2") && showPrice && (
//             <span>
//               {/* Check if a breakdown exists */}
//               {breakdownParts && breakdownParts.length > 0 ? (
//                 // Condition 1: Breakdown exists
//                 <>
//                   {label}
//                   <span className="font-medium space-y-1">
//                     {breakdownParts.map((b, i) => (
//                       <span key={i}>{b}</span>
//                     ))}
//                   </span>
//                 </>
//               ) : (
//                 // Condition 2: No breakdown, show label followed by price
//                 <>
//                   {label}
//                   <span className="font-medium space-y-1">
//                     :{" "}₹ {totalPrice.toLocaleString()}
//                   </span>
//                 </>
//               )}
//             </span>
//           )}


//         </>
//       ) : (
//         <>
//           {showPrice && !(setPrice === "landingEntrancePrice1" || setPrice === "landingEntrancePrice2") && (
//             <span>
//               Price
//               {breakdownParts && breakdownParts.length > 0 ? (
//                 // Condition 1: Breakdown exists
//                 <>
//                   <span className="font-medium space-y-1">
//                     {breakdownParts.map((b, i) => (
//                       <span key={i}>{b}</span>
//                     ))}
//                   </span>
//                 </>
//               ) : (
//                 // Condition 2: No breakdown, show label followed by price
//                 <>

//                   <span className="font-medium space-y-1">
//                     {" "}₹ {totalPrice.toLocaleString()}
//                   </span>
//                 </>
//               )}
//             </span>
//           )}
//         </>
//       )}
//     </div>
//   );

// };










export const PriceBelowSelect = ({
  id = "id",
  options,
  label,
  formValue,
  color = "green-600",
  isAirSystem = false,
  isArdSystem = false,
  showPrice = true,
  priceVal = 0,
  setPrice = "",
  setName = "",
  nameKey = "name",
  itemMainName = "",
  itemUnit = "",
  setFormData,
  formData = {}, // must pass whole formData (openings, landingEntranceCount etc.)
  isOnlyLabel = false,
  lead_id,
  lift,
  // ❌ REMOVED: onMaterialChange,
  // ❌ REMOVED: selectedMaterialFrmParent, 
}) => {
  const lead = lead_id ?? formData.leadId;
  const operator = lift ?? formData.liftType;

  // 1. ✅ State/Ref to track if the component has mounted
  const isInitialMount = useRef(true);

  if (isOnlyLabel) {
    if (!label) return null;

    return (
      <div className={`absolute right-8 mt-[4.1rem] text-xs font-semibold tracking-wide ${color}`}>
        <span className="font-medium space-y-1">{label}</span>
      </div>
    );
  }

  if (!showPrice) {
    return null;
  }

  const { totalPrice, breakdownParts, price1, price2, quantity, selectedName } = useMemo(() => {
    // ⭐️ Only calculate price and quantity, not newMaterial

    if (!formValue || (Array.isArray(formValue) && formValue.length === 0)) {
      return {
        totalPrice: priceVal || 0,
        breakdownParts: [],
        price1: 0,
        price2: 0,
        selectedName: "",
        // newMaterial: null, // ❌ Removed newMaterial
        quantity: 0, // Set quantity to 0 when no selection
      };
    }

    if (!options) {
      return {
        totalPrice: priceVal || 0,
        breakdownParts: [],
        price1: 0,
        price2: 0,
        selectedName: "",
        // newMaterial: null, // ❌ Removed newMaterial
        quantity: 0,
      };
    }

    // --- Helper calculations (keep existing) ---
    const totalOpenings = Number(formData.openings) || 0;
    const splitCount = Number(formData.landingEntranceCount) || 0;
    const noOfStops = Number(formData.stops) || 0;
    const liftQuantity = Number(formData.liftQuantity) || 1;
    const findOpt = (sid) => options.find(o => String(o[id]) === String(sid));
    const unitOf = (opt) => (opt?.price ?? opt?.prize ?? 0);

    let price1 = 0, price2 = 0;
    let breakdownParts = [];
    let finalGuideRailQty = 0;

    const sid = Array.isArray(formValue) ? formValue[0] : formValue;
    const opt = findOpt(sid);

    let materialId = opt ? opt[id] : null;
    let quantity = 1; // Default quantity
    let selectedName = "";

    if (opt && formValue) {
      quantity = Number(opt.quantity || opt.wireRopeQty) || 1;

      if (Array.isArray(nameKey)) {
        selectedName = nameKey
          .map(key => opt[key])
          .filter(Boolean)
          .join(' / ');
      } else {
        selectedName = opt[nameKey] || opt.name || "";
      }
    }

    let finalPrice = priceVal || 0;

    // --- SPECIAL AIR SYSTEM LOGIC (Price calculation only) ---
    if (isAirSystem) {
      finalPrice = finalPrice;
      quantity = 1;
      price1 = finalPrice;
      price2 = 0;

      breakdownParts.push(
        `: ₹ ${price1.toLocaleString()}`
      );

      return {
        totalPrice: finalPrice,
        breakdownParts: [],
        price1: 0,
        price2: 0,
        selectedName,
        // newMaterial: airMaterial, // ❌ Removed material creation
        quantity,
      };
    }

    // --- GUIDERAIL LOGIC --- (Keep as is for price/quantity)
    if (setPrice === "guideRailPrice") {
      if (opt && noOfStops > 0) {
        const unitPrice = unitOf(opt);
        const roundedQty1 = 1 // calculateRoundedGuideRailQuantity(noOfStops); 
        finalGuideRailQty = roundedQty1 * liftQuantity;
        price1 = unitPrice * finalGuideRailQty;

        breakdownParts.push(
          `(${finalGuideRailQty.toFixed(2)} × ₹${unitPrice.toLocaleString()}) = ₹ ${price1.toLocaleString()}`
        );
        quantity = finalGuideRailQty || 0;
      }
    }
    // --- LOP TYPE LOGIC --- (Keep as is for price/quantity)
    else if (setPrice === "lopTypePrice") {
      if (opt && noOfStops > 0) {
        const unitPrice = unitOf(opt);
        const count = noOfStops;
        price1 = unitPrice * count;
        breakdownParts.push(
          `(${count} × ₹${unitPrice.toLocaleString()}) = ₹ ${price1.toLocaleString()}`
        );
        quantity = count;
      }
    }

    // ✅ Default single price (Keep as is for price/quantity)
    else if (
      setPrice &&
      setPrice !== "landingEntrancePrice1" &&
      setPrice !== "landingEntrancePrice2"
    ) {
      if (opt) {
        const unit = unitOf(opt);
        price1 = unit * quantity;
        if (quantity > 1) {
          // breakdownParts.push(
          //   `${selectedName}: (${quantity} × ₹${unit.toLocaleString()}) = ₹ ${price1.toLocaleString()}`
          // );
          breakdownParts.push(
            `(${quantity} × ₹${unit.toLocaleString()}) = ₹ ${price1.toLocaleString()}`
          );
        } else {
          breakdownParts.push(
            `: ₹ ${price1.toLocaleString()}`
          );
        }
      }
    }

    // ---- Landing Entrance 1 & 2 logic (Keep as is for price/quantity) ----
    else if (setPrice === "landingEntrancePrice1") {
      const sid1 = Array.isArray(formValue) ? formValue[0] : formValue;
      const opt1 = findOpt(sid1);
      if (opt1) {
        const floors1 = splitCount || totalOpenings;
        const unit1 = unitOf(opt1);
        price1 = unit1 * floors1;
        // breakdownParts.push(
        //   `${opt1.name} (${floors1} × ₹${unit1.toLocaleString()}) = ₹ ${price1.toLocaleString()}`
        // );
        breakdownParts.push(
          `(${floors1} × ₹${unit1.toLocaleString()}) = ₹ ${price1.toLocaleString()}`
        );
        quantity = floors1;
      }
    }
    else if (setPrice === "landingEntrancePrice2") {
      const sid2 = Array.isArray(formValue) ? formValue[1] : null;
      const opt2 = findOpt(sid2);
      let materialId = opt2 ? opt2[id] : null;
      if (opt2 && formValue) {
        selectedName = opt2[nameKey] || opt2.name || "";
      }
      if (opt2) {
        let floors2 = Math.max(totalOpenings - splitCount, 0);
        if (formData.landingEntranceSubType2_fromFloor && formData.landingEntranceSubType2_toFloor) {
          const from = Number(formData.landingEntranceSubType2_fromFloor);
          const to = Number(formData.landingEntranceSubType2_toFloor);
          if (!isNaN(from) && !isNaN(to) && to >= from) {
            floors2 = to - from + 1;
          }
        }
        const unit2 = unitOf(opt2);
        price2 = unit2 * floors2;
        // breakdownParts.push(
        //   `${opt2.name} (${floors2} × ₹${unit2.toLocaleString()}) = ₹ ${price2.toLocaleString()}`
        // );
        breakdownParts.push(
          `(${floors2} × ₹${unit2.toLocaleString()}) = ₹ ${price2.toLocaleString()}`
        );
        quantity = floors2;
      }
    }
    // --- END Price/Quantity Calculation ---

    const totalPrice = price1 + price2;

    // ❌ REMOVED all the selectedMaterial / existingMaterials / existingIndex lookups.
    // ❌ REMOVED the newMaterial object creation.

    return {
      totalPrice: price1 + price2,
      breakdownParts,
      price1,
      price2,
      selectedName,
      // newMaterial: null, // ⭐️ Ensure newMaterial is not returned
      quantity,
    };
  }, [
    isAirSystem, priceVal, options, formValue, id, formData.openings, formData.landingEntranceCount,
    formData.stops, formData.liftQuantity, setPrice, nameKey, itemMainName, formData.liftType,
    formData.leadId, formData.quotLiftDetailId, formData.landingEntranceSubType2_fromFloor,
    formData.landingEntranceSubType2_toFloor,
  ]);


  // ❌ STEP 2: Simplify useEffect
  useEffect(() => {
    // Skip execution on initial component mount
    // if (isInitialMount.current) {
    //   isInitialMount.current = false;
    //   return;
    // }

    if (!setFormData || (!setPrice && !setName)) return;

    // ❌ REMOVED: All onMaterialChange logic (STEP 1 in old code)

    setFormData((prev) => {
      const next = { ...prev };
      let updated = false;

      // Update price fields (Keep this logic)
      // if (setPrice === "landingEntrancePrice1") {
      //   console.log("Updating landingEntrancePrice1:", price1, "Prev:", prev.landingEntrancePrice1);
      //   if (price1 !== undefined && prev.landingEntrancePrice1 !== price1) {
      //     next.landingEntrancePrice1 = price1;
      //     next.landingEntranceCount = quantity;
      //     updated = true;
      //   }
      //   console.log("Updated landingEntrancePrice1 to:", next.landingEntrancePrice1);
      // } else if (setPrice === "landingEntrancePrice2") {
      //   if (price2 !== undefined && prev.landingEntrancePrice2 !== price2) {
      //     next.landingEntrancePrice2 = price2;
      //     // ... (keep from/to floor logic)
      //     const totalOpenings = Number(prev.openings) || 0;
      //     const splitCount = Number(prev.landingEntranceCount) || 0;
      //     let fromFloor = Number(prev.landingEntranceSubType2_fromFloor);
      //     let toFloor = Number(prev.landingEntranceSubType2_toFloor);
      //     if (isNaN(fromFloor) || isNaN(toFloor) || toFloor < fromFloor) {
      //       fromFloor = splitCount + 1;
      //       toFloor = totalOpenings;
      //     }
      //     next.landingEntranceSubType2_fromFloor = fromFloor;
      //     next.landingEntranceSubType2_toFloor = toFloor;
      //     updated = true;
      //   }
      // } 

      // --------------------- PRICE / FLOOR SYNC LOGIC ---------------------
      if (setPrice === "landingEntrancePrice1" || setPrice === "landingEntrancePrice2") {
        const totalOpenings = Number(prev.openings) || 0;

        // Current user selections
        const count1 = Number(prev.landingEntranceCount) || 0;     // Subtype-1 count
        let from2 = Number(prev.landingEntranceSubType2_fromFloor);
        let to2 = Number(prev.landingEntranceSubType2_toFloor);

        let newCount1 = count1;

        // ---------------- SUBTYPE 1 SELECTED ----------------
        if (setPrice === "landingEntrancePrice1" && price1 !== undefined) {
          // Save price
          next.landingEntrancePrice1 = price1;

          // If user selects "ALL"
          if (quantity === "ALL" || Number(quantity) === totalOpenings) {
            newCount1 = totalOpenings;

            // Subtype 2 disappears
            next.landingEntrancePrice2 = 0;
            next.landingEntranceSubType2_fromFloor = "";
            next.landingEntranceSubType2_toFloor = "";
            next.landingEntranceSubType2 = "";
          }
          else {
            // Keep numeric quantity
            newCount1 = Number(quantity) || 0;

            const remaining = totalOpenings - newCount1;

            if (remaining <= 0) {
              // Nothing left for Subtype-2
              next.landingEntrancePrice2 = 0;
              next.landingEntranceSubType2_fromFloor = "";
              next.landingEntranceSubType2_toFloor = "";
            } else {
              // Auto-adjust Subtype-2 range
              next.landingEntranceSubType2_fromFloor = newCount1 + 1;
              next.landingEntranceSubType2_toFloor = totalOpenings;
            }
          }

          next.landingEntranceCount = newCount1;
          updated = true;
        }

        // ---------------- SUBTYPE 2 SELECTED ----------------
        if (setPrice === "landingEntrancePrice2" && price2 !== undefined) {
          next.landingEntrancePrice2 = price2;

          // If subtype 1 = ALL, subtype 2 must be disabled
          if (newCount1 === totalOpenings) {
            next.landingEntrancePrice2 = 0;
            next.landingEntranceSubType2_fromFloor = "";
            next.landingEntranceSubType2_toFloor = "";
          }
          else {
            // If from/to invalid → auto-correct
            if (
              isNaN(from2) ||
              isNaN(to2) ||
              from2 <= newCount1 ||
              to2 > totalOpenings ||
              to2 < from2
            ) {
              next.landingEntranceSubType2_fromFloor = newCount1 + 1;
              next.landingEntranceSubType2_toFloor = totalOpenings;
            }
          }

          updated = true;
        }
      }

      else if (setPrice) {
        if (prev[setPrice] !== totalPrice) {
          next[setPrice] = totalPrice || 0;
          updated = true;
        }
      }

      // Update name field (Keep this logic)
      if (setName && prev[setName] !== selectedName) {
        next[setName] = selectedName;
        updated = true;
      }

      // ❌ REMOVED: All material object saving logic (STEP 3 in old code)

      return updated ? next : prev;
    });
  }, [
    price1, price2, quantity, totalPrice, selectedName, setPrice, setName, setFormData,
    // ❌ REMOVED: newMaterial from dependencies
  ]);

  // nothing to display
  if (showPrice && (!totalPrice || totalPrice === 0)) return null;

  // --- JSX Rendering (Keep as is) ---
  return (
    <div className={`absolute right-8 mt-[4.1rem] text-xs font-semibold tracking-wide ${color}`}>
      {label ? (
        <>
          {!(setPrice === "landingEntrancePrice1" || setPrice === "landingEntrancePrice2") && showPrice && (
            <span>
              {breakdownParts && breakdownParts.length > 0 ? (
                <>
                  {label}
                  <span className="font-medium space-y-1">
                    {breakdownParts.map((b, i) => (
                      <span key={i}>{b}</span>
                    ))}
                  </span>
                </>
              ) : (
                <>
                  {label}
                  <span className="font-medium space-y-1">
                    :{" "}₹ {totalPrice.toLocaleString()}
                  </span>
                </>
              )}
            </span>
          )}
          {/* ... (rest of landing entrance price display logic) */}
          {(setPrice === "landingEntrancePrice1" || setPrice === "landingEntrancePrice2") && showPrice && (
            <span>
              {breakdownParts && breakdownParts.length > 0 ? (
                <>
                  {label}
                  <span className="font-medium space-y-1">
                    {breakdownParts.map((b, i) => (
                      <span key={i}>{b}</span>
                    ))}
                  </span>
                </>
              ) : (
                <>
                  {label}
                  <span className="font-medium space-y-1">
                    :{" "}₹ {totalPrice.toLocaleString()}
                  </span>
                </>
              )}
            </span>
          )}
        </>
      ) : (
        <>
          {showPrice && !(setPrice === "landingEntrancePrice1" || setPrice === "landingEntrancePrice2") && (
            <span>
              Price
              {breakdownParts && breakdownParts.length > 0 ? (
                <>
                  <span className="font-medium space-y-1">
                    {breakdownParts.map((b, i) => (
                      <span key={i}>{b}</span>
                    ))}
                  </span>
                </>
              ) : (
                <>
                  <span className="font-medium space-y-1">
                    {" "}₹ {totalPrice.toLocaleString()}
                  </span>
                </>
              )}
            </span>
          )}
        </>
      )}
    </div>
  );
};




