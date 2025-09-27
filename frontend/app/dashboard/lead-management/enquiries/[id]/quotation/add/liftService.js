import axiosInstance from "@/utils/axiosInstance";
import { API_ENDPOINTS } from "@/utils/apiEndpoints";
import { useEffect, useMemo } from "react";

const fieldLabels = {}; // Declare it at component level (outside render return)

export function getLabel(key, labelText) {
  fieldLabels[key] = labelText;
  return labelText;
}


// 🔹 Fetch Cabin Types based on capacity
export const fetchCabinSubTypes = async (capacityType, capacityValue, cabinType) => {
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

    return res.data?.data || [];
  } catch (err) {
    console.error("Error fetching cabin types", err);
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

    if (res.data?.success && res.data?.data) {
      return {
        price: res.data.data.price || 0,
        success: true,
        message: res.data.message || "AirSystem price fetched successfully",
      };
    } else {
      return {
        price: 0,
        success: false,
        message: res.data?.message || "No price available or assigned",
      };
    }
  } catch (err) {
    console.error("Error fetching AirSystem price:", err);
    return {
      price: 0,
      success: false,
      message: "Failed to fetch Air System price",
    };
  }
};


// 🔹 Fetch Car Entrance Types by liftType
export const fetchCarEntranceTypes = async (liftType) => {
  if (!liftType) return [];
  try {
    const res = await axiosInstance.get(`${API_ENDPOINTS.CAR_DOOR_TYPE}/searchByLiftType`, {
      params: { operatorElevatorId: liftType },
    });
    return res.data?.data || [];
  } catch (err) {
    console.error("Error fetching Car Entrance Types", err);
    return [];
  }
};

// 🔹 Fetch Car Entrance SubTypes by carEntranceId
export const fetchCarEntranceSubTypes = async (carEntranceId) => {
  if (!carEntranceId) return [];
  try {
    const res = await axiosInstance.get(`${API_ENDPOINTS.CAR_DOOR_SUBTYPE}/searchByCarDoorType`, {
      params: { carDoorTypeId: carEntranceId },
    });
    return res.data?.data || [];
  } catch (err) {
    console.error("Error fetching Car Entrance SubTypes", err);
    return [];
  }
};

// 🔹 Fetch Landing Entrance Types by liftType
export const fetchLandingEntranceSubType = async (liftType) => {
  if (!liftType) return [];
  try {
    const res = await axiosInstance.get(`${API_ENDPOINTS.LANDING_DOOR_SUBTYPE}/searchByLiftType`, {
      params: { operatorTypeId: liftType },
    });
    return res.data?.data || [];
  } catch (err) {
    console.error("Error fetching Landing Entrance Sub Types", err);
    return [];
  }
};

// 🔹 Fetch control panel types filtered by liftType + capacityType
export const fetchControlPanelTypes = async (liftType, capacityType, capacityValue, typeOfLiftId) => {
  try {
    const res = await axiosInstance.get(`${API_ENDPOINTS.CONTROL_PANEL}/search`, {
      params: {
        operatorTypeId: liftType,
        capacityTypeId: capacityType,
        machineTypeId: typeOfLiftId,
        capacityValue: capacityValue,
      },
    });
    return res.data?.data || [];
  } catch (err) {
    console.error("Error fetching control panels", err);
    return [];
  }
};

// 🔹 Fetch LOP/COP based on liftType + floor
export const fetchLOP = async (liftType, floor) => {
  try {
    const res = await axiosInstance.get(`${API_ENDPOINTS.LOP_SUBTYPE}/search`, {
      params: { operatorTypeId: liftType, floorId: (floor - 1) },
    });
    return res.data?.data || [];
  } catch (err) {
    console.error("Error fetching LOP", err);
    return [];
  }
};

export const fetchCOP = async (liftType, floor) => {
  try {
    const res = await axiosInstance.get(`${API_ENDPOINTS.COP_TYPE}/search`, {
      params: { operatorTypeId: liftType, floorId: floor },
    });
    return res.data?.data || [];
  } catch (err) {
    console.error("Error fetching COP", err);
    return [];
  }
};

export const fetchCapacityDimension = async (capacityType, capacityValue) => {
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

    // console.log(res,"-------res-------------",res.data?.data);

    // API should return a single dimension object (or null if not found)
    return res.data || null;
  } catch (err) {
    console.error("Error fetching capacity dimension", err);
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

export const fetchRopingTypePrice = async (ropingTypeId, capacityType, capacityValue, liftTypeId) => {
  try {
    const res = await axiosInstance.get(`${API_ENDPOINTS.COUNTER_FRAME_TYPES}/search`, {
      params: {
        counterFrameTypeId: ropingTypeId, // roping_type
        capacityTypeId: capacityType,
        capacityValue: capacityValue,
        operatorTypeId: liftTypeId,      // lift_type
      },
    });

    const data = res.data;

    if (Array.isArray(data)) {
      return data.length > 0 ? data[0].price || 0 : 0;
    } else {
      return data?.price || 0;
    }
  } catch (err) {
    console.error("Error fetching roping type price", err);
    return 0;
  }
};

export const fetchFastner = async (floor) => {
  try {
    const res = await axiosInstance.get(`${API_ENDPOINTS.FASTENERS}/floor/${floor}`);
    return res.data?.data || [];
  } catch (err) {
    console.error("Error fetching fasteners", err);
    return [];
  }
};



// setPrice = "cabinCeilingPrice"
// setFormData = { setFormData }
// formData = { formData }

// guideRailPrice: lift.data?.guideRailPrice || 0,
//       bracketTypePrice: lift.data?.bracketTypePrice || "",
//       ropingTypePrice: lift.data?.ropingTypePrice || "",
//       lopTypePrice: lift.data?.lopTypePrice || "",
//       copTypePrice: lift.data?.copTypePrice || "", 
export const PriceBelowSelect = ({
  id = "id",
  options,
  label,
  formValue,               // single id or array of ids
  color = "green-600",
  isAirSystem = false,
  priceVal = 0,
  setPrice = "",
  setFormData,
  formData = {},           // must pass whole formData (openings, landingEntranceCount etc.)
}) => {
  const { totalPrice, breakdownParts, price1, price2 } = useMemo(() => {
    if (isAirSystem) return { totalPrice: priceVal || 0, breakdownParts: [], price1: 0, price2: 0 };

    const totalOpenings = Number(formData.openings) || 0;
    const splitCount = Number(formData.landingEntranceCount) || 0;

    // helper to find option
    const findOpt = (sid) => options.find(o => String(o[id]) === String(sid));
    const unitOf = (opt) => (opt?.price ?? opt?.prize ?? 0);

    let price1 = 0, price2 = 0;
    let breakdownParts = [];

    // ✅ Default single price (no split)
    if (
      setPrice &&
      setPrice !== "landingEntrancePrice1" &&
      setPrice !== "landingEntrancePrice2"
    ) {
      const sid = Array.isArray(formValue) ? formValue[0] : formValue;
      const opt = findOpt(sid);
      if (opt) {
        const unit = unitOf(opt);
        price1 = unit; // just the unit price
        // breakdownParts.push(`${opt.name} = ₹ ${unit.toLocaleString()}`);
      }
    }

    // ---- Landing Entrance 1 (always independent) ----
    if (setPrice === "landingEntrancePrice1") {
      const sid1 = Array.isArray(formValue) ? formValue[0] : formValue;
      const opt1 = findOpt(sid1);

      if (opt1) {
        const floors1 = splitCount || totalOpenings; // if ALL selected, use total
        const unit1 = unitOf(opt1);
        price1 = unit1 * floors1;

        breakdownParts.push(
          `${opt1.name} (${floors1} × ₹${unit1.toLocaleString()}) = ₹ ${price1.toLocaleString()}`
        );
      }
    }

    // ---- Landing Entrance 2 (only if selected) ----
    if (setPrice === "landingEntrancePrice2") {
      const sid2 = Array.isArray(formValue) ? formValue[1] : null;
      const opt2 = findOpt(sid2);

      if (opt2) {
        // default remaining floors
        let floors2 = Math.max(totalOpenings - splitCount, 0);

        // override with explicit From/To
        if (formData.landingEntranceSubType2_fromFloor && formData.landingEntranceSubType2_toFloor) {
          const from = Number(formData.landingEntranceSubType2_fromFloor);
          const to = Number(formData.landingEntranceSubType2_toFloor);
          if (!isNaN(from) && !isNaN(to) && to >= from) {
            floors2 = to - from + 1;
          }
        }

        const unit2 = unitOf(opt2);
        price2 = unit2 * floors2;

        breakdownParts.push(
          `${opt2.name} (${floors2} × ₹${unit2.toLocaleString()}) = ₹ ${price2.toLocaleString()}`
        );
      }
    }

    return {
      totalPrice: price1 + price2,
      breakdownParts,
      price1,
      price2,
    };
  }, [isAirSystem, priceVal, options, formValue, id, formData, setPrice]);


  // write total back into formData
  useEffect(() => {
    if (!setFormData || !setPrice) return;

    // setFormData(prev => {
    //   if ((prev[setPrice] || 0) === (totalPrice || 0)) return prev;
    //   return { ...prev, [setPrice]: totalPrice || 0 };
    // });

    setFormData((prev) => {
      const next = { ...prev };

      // if (price1 !== undefined && prev.landingEntrancePrice1 !== price1) {
      //   next.landingEntrancePrice1 = price1;
      // }
      // if (price2 !== undefined && prev.landingEntrancePrice2 !== price2) {
      //   next.landingEntrancePrice2 = price2;
      // }

      if (setPrice === "landingEntrancePrice1") {
        if (price1 !== undefined && prev.landingEntrancePrice1 !== price1) {
          next.landingEntrancePrice1 = price1;
        }
      } else if (setPrice === "landingEntrancePrice2") {
        if (price2 !== undefined && prev.landingEntrancePrice2 !== price2) {
          next.landingEntrancePrice2 = price2;
        }
      } else {
        console.log(setPrice + '======>price1:- ' + price1 + "---------price2:- " + price2 + "---totalPrice------" + totalPrice);
        if (prev[setPrice] !== totalPrice) {
          next[setPrice] = totalPrice || 0;
        }
      }

      return next;
    });
  }, [price1, price2, setPrice, setFormData]);

  // nothing to display
  if (!totalPrice || totalPrice === 0) return null;

  return (
    <div className={`absolute right-0 mt-[3.7rem] text-sm ${color}`}>
      {label ? (
        <>
          {/* Hide total for Landing Entrance 1 & 2 */}
          {!(setPrice === "landingEntrancePrice1" || setPrice === "landingEntrancePrice2") && (
            <span>
              {label}: <span className="font-medium">₹ {totalPrice.toLocaleString()}</span>
            </span>
          )}

          {breakdownParts && breakdownParts.length > 0 && breakdownParts && (
            <div className="text-xs mt-1 space-y-1">
              {breakdownParts.map((b, i) => (
                <div key={i}>{b}</div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          {!(setPrice === "landingEntrancePrice1" || setPrice === "landingEntrancePrice2") && (
            <span>
              Price: <span className="font-medium">₹ {totalPrice.toLocaleString()}</span>
            </span>
          )}
          {breakdownParts && breakdownParts.length > 0 && (
            <div className="text-xs text-gray-500 mt-1 space-y-1">
              {breakdownParts.map((b, i) => (
                <div key={i}>{b}</div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );

};



