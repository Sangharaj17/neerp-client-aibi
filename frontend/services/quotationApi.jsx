import axiosInstance from "@/utils/axiosInstance";
import { API_ENDPOINTS } from "@/utils/apiEndpoints";

export const saveQuotation = async (payload) => {
  try {
    const response = await axiosInstance.post(
      `${API_ENDPOINTS.QUOTATIONS}/save`,
      payload
    );

    return response?.data;
  } catch (error) {
    console.error("❌ Error in saveQuotation API:", error);
    throw error;
  }
};

/**
 * Mark multiple lifts as saved (isSaved=true, isFinalized=false)
 * @param object {liftIds, quotationMainId, remarks, createdByEmployeeId} - IDs of lifts to mark as saved
 * @returns {Promise<Object>} - API response
 */
export const markLiftsAsSaved = async (requestData) => {
  try {
    const response = await axiosInstance.put(
      `${API_ENDPOINTS.QUOTATIONS}/mark-saved`,
      requestData
    );

    return response?.data;
  } catch (error) {
    console.error("❌ Error in markLiftsAsSaved API:", error);
    throw error;
  }
};

export const getMissingLifts = async (leadId, combinedEnquiryId) => {
  try {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.ENQUIRIES}/missing-lifts`,
      {
        params: { leadId, combinedEnquiryId },
      }
    );
    return response?.data;
  } catch (err) {
    console.error("❌ Error fetching missing lifts:", err);
    return [];
  }
};

export const getExistingLifts = async (leadId, combinedEnquiryId) => {
  try {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.QUOTATIONS}/by-lead-and-combined-enquiry`,
      {
        params: { leadId, combinedEnquiryId },
      }
    );
    return response.data?.data || [];
  } catch (err) {
    console.error("❌ Error fetching existing lifts:", err);
    return [];
  }
};

/**
 * Get quotation by ID
 * @param {number} quotationId - The ID of the quotation
 * @returns {Promise<ApiResponse<QuotationMainResponseDTO>>}
 */
export const getQuotationById = async (quotationId, tenantId) => {
  try {
    const headers = {};
    // 🚨 CRITICAL CHANGE: If tenantId is provided, set the X-Tenant header explicitly.
    if (tenantId) {
      headers["X-Tenant"] = tenantId;
    }

    const response = await axiosInstance.get(
      `${API_ENDPOINTS.QUOTATIONS}/${quotationId}`,
      { headers: headers } // Pass the dynamic headers to the request
    );
    return response.data;
  } catch (err) {
    console.error(`❌ Error fetching quotation by ID ${quotationId}:`, err);
    const errorMessage =
      err.response?.data?.message ||
      `Failed to fetching quotation by ID ${quotationId}.`;
    return { success: false, message: errorMessage, data: null };
  }
};

/**
 * Fetches a list of all QuotationMain records.
 * @returns {Promise<ApiResponse<List<QuotationMainResponseDTO>>>}
 */
export const getAllQuotations = async () => {
  try {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.QUOTATIONS}/all-quotations-without-lifts`
    );
    return response?.data;
  } catch (err) {
    console.error("❌ Error fetching all quotations:", err);
    return { success: false, message: "Failed to fetch quotations.", data: [] };
  }
};

/**
 * Fetches paginated QuotationMain records.
 * @returns {Promise<ApiResponse<PaginationResponse<QuotationMainResponseDTO>>>}
 */
export const getPagewiseQuotations = async (
  page = 0,
  size = 10,
  sort = "id"
) => {
  try {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.QUOTATIONS}/pagination-quotations-without-lifts`,
      {
        params: { page, size, sort },
      }
    );
    return response?.data;
  } catch (err) {
    console.error("❌ Error fetching paginated quotations:", err);
    return { success: false, message: "Failed to fetch quotations.", data: [] };
  }
};

/**
 * Sends a request to finalize a specific quotation.
 * @param {number} quotationId - The ID of the quotation to finalize.
 * @param {number} employeeId - The ID of the employee/user who finalize.
 * @returns {Promise<ApiResponse<Void>>}
 */
export const finalizeQuotation = async (quotationId, employeeId) => {
  try {
    const response = await axiosInstance.put(
      `${API_ENDPOINTS.QUOTATIONS}/${quotationId}/finalize`,
      { employeeId: employeeId }
    );
    return response?.data;
  } catch (err) {
    console.error(`❌ Error finalizing quotation ID ${quotationId}:`, err);
    const errorMessage =
      err.response?.data?.message ||
      `Failed to finalize quotation ID ${quotationId}.`;
    return { success: false, message: errorMessage, data: null };
  }
};

export const deleteQuotationApi = async (quotationId, employeeId) => {
  try {
    const response = await axiosInstance.put(
      `${API_ENDPOINTS.QUOTATIONS}/${quotationId}/delete-by-status`,
      { employeeId: employeeId }
    );
    return response?.data;
  } catch (err) {
    console.error(`❌ Error Deleting quotation ID ${quotationId}:`, err);
    const errorMessage =
      err.response?.data?.message ||
      `Failed to delete quotation ID ${quotationId}.`;
    return { success: false, message: errorMessage, data: null };
  }
};

/**
 * Fetches all features and converts them into a Map for fast ID-to-Name lookup.
 * @returns {Promise<Map<number, string>>} A Map where keys are feature IDs and values are feature names.
 */
export const getFeatureNameMap = async (tenantId) => {
  try {
    const headers = {};
    // 🚨 CRITICAL CHANGE: If tenantId is provided, set the X-Tenant header explicitly.
    if (tenantId) {
      headers["X-Tenant"] = tenantId;
    }

    // Assuming API_FEATURES is defined and axiosInstance is available
    // const response = await axiosInstance.get(API_ENDPOINTS.FEATURES);
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.FEATURES}`,
      { headers: headers } // Pass the dynamic headers to the request
    );

    const allFeatures = response.data; // Adjust based on your API response structure (e.g., if data is wrapped)

    // Ensure response.data.data is an array before mapping
    if (!Array.isArray(allFeatures)) {
      console.error("FEATURES did not return an array:", allFeatures);
      return new Map();
    }

    // Convert the array into a Map for fast lookup (ID -> Name)
    const featureNameMap = new Map(allFeatures.map((f) => [f.id, f.name]));

    return featureNameMap;
  } catch (err) {
    console.error("❌ Error fetching all features:", err);
    // Return an empty Map on failure to prevent the main function from crashing
    return new Map();
  }
};

export const fetchComponents = async () => {
  try {
    const res = await axiosInstance.get(API_ENDPOINTS.COMPONENT);
    return res.data || [];
  } catch (err) {
    console.error("Error fetching components:", err);
    return { success: false, message: "Error fetching components.", data: [] };
  }
};

export const fetchQuotationsByQuotationNo = async (quotationNo) => {
  try {
    if (!quotationNo) {
      return {
        success: false,
        message: "Quotation Number is required",
        data: [],
      };
    }

    const response = await axiosInstance.get(
      `${API_ENDPOINTS.QUOTATIONS}/by-quotation-no`,
      {
        params: { quotationNo },
      }
    );

    return response?.data; // ApiResponse object
  } catch (err) {
    console.error("❌ Error fetching quotations by Quotation No:", err);

    return {
      success: false,
      message: err?.response?.data?.message || "Failed to fetch quotations.",
      data: [],
    };
  }
};

export const getRevisionsLifts = async (quotationMainId, action) => {
  console.log("🚀 getRevisionsLifts called with ID:", quotationMainId, "and action:", action);
  console.log("-------------->",(!quotationMainId || action !== "revise" || action !== "editRevision"));
  if (!quotationMainId || (action !== "revise" && action !== "editRevision")) return [];

  console.log("🚀............ getRevisionsLifts called with ID:", quotationMainId, "and action:", action);
  try {
    // const response = await axiosInstance.get(
    //   `${API_ENDPOINTS.QUOTATIONS}/${quotationMainId}`
    // ); 

    const response = await axiosInstance.get(
      `${API_ENDPOINTS.QUOTATIONS}/revised/${quotationMainId}`
    );

    const api = response.data;
    console.log("==========api==========>", api);

    // 🔹 ApiResponse Format: { status, message, data }
    if (!api.success || !api.data) {
      console.warn("⚠ No revision data returned");
      return [];
    }

    console.log("📌 Revision API Response:", api);
    return api.data; // This is QuotationMainResponseDTO
  } catch (err) {
    console.error("❌ Failed to load revision:", err);

    return [];
  }
};

// export const fetchRevisions = async (id, action) => {
//   if (!id || action !== "revise") return; // 'id' here is the old QuotationMainId
//   const oldQuotationMainId = Number(id);

//   try {
//     const response = await axiosInstance.get(
//       `${API_ENDPOINTS.QUOTATIONS}/${id}`
//     );

//     console.log("=========response=========>", response);
//     return response.data?.data || [];
//   } catch (err) {
//     console.error("❌ Failed to load revision:", err);

//     return {
//       success: false,
//       message: err?.response?.data?.message || "Failed to fetch quotations.",
//       data: [],
//     };
//   }
// };

export const createRevision = async (requestBody, originalLiftId) => {
  
  console.log(originalLiftId,"🚀 createRevision called with:", requestBody);
  try {
    const response = await axiosInstance.post(
      `${API_ENDPOINTS.QUOTATIONS}/revise/${originalLiftId}`, // New endpoint
      requestBody
    );

    return response?.data;
  } catch (error) {
    console.error("❌ Error in createRevision API:", error);
    // Throwing the error allows the calling component to catch it
    throw error;
  }
};

export const addMissingRevisedLift = async (requestBody, originalLiftId) => {
  
  console.log(originalLiftId,"🚀 createRevision called with:", requestBody);
  console.log("🚀 Request Body lifts:", requestBody) ;
  try {
    const response = await axiosInstance.post(
      `${API_ENDPOINTS.QUOTATIONS}/${originalLiftId}/add-lift`, // New endpoint
      requestBody
    );

    return response?.data;

    // return {
    //   success: true,
    //   message: "Lift added successfully (mock)",
    //   data: {
    //     originalLiftId,
    //     ...requestBody
    //   }
    // };
  } catch (error) {
    console.error("❌ Error in createRevision API:", error);
    // Throwing the error allows the calling component to catch it
    throw error;
  }
};

export const groupAndSortMaterials = (materials = []) => {
  if (!Array.isArray(materials)) return [];

  // 1️⃣ Group items by materialType
  const grouped = materials.reduce((acc, item) => {
    const key = item.materialType || "Unknown";

    if (!acc[key]) acc[key] = [];
    acc[key].push(item);

    return acc;
  }, {});

  // 2️⃣ Sort materialTypes alphabetically
  const sortedTypes = Object.keys(grouped).sort();

  // 3️⃣ Sort items inside each materialType by materialDisplayName
  const finalList = [];

  sortedTypes.forEach((type) => {
    const sortedItems = grouped[type].sort((a, b) =>
      (a.materialDisplayName || "").localeCompare(b.materialDisplayName || "")
    );

    // 4️⃣ Push into final list (keeping original object structure)
    finalList.push(...sortedItems);
  });

  return finalList;
};

