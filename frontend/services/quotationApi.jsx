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
export const getQuotationById = async (quotationId) => {
  try {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.QUOTATIONS}/${quotationId}`
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
export const getPagewiseQuotations = async (page = 0, size = 10, sort = "id") => {
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

