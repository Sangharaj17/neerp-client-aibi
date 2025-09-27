
import axiosInstance from '@/utils/axiosInstance';

// 🔹 Fetch filtered leads (New Installation / Modernization)
export const getFilteredLeads = async () => {
  try {
    const response = await axiosInstance.get("/api/leadmanagement/leads/filter");
    return response.data; // ✅ ApiResponse wrapper if used, else plain list
  } catch (error) {
    console.error("Error fetching filtered leads:", error);
    throw error;
  }
};

// 🔹 Fetch single lead by ID
export const getLeadById = async (leadId) => {
  try {
    const response = await axiosInstance.get(`/api/leadmanagement/leads/${leadId}`);
    return response.data; // ✅ single lead object
  } catch (error) {
    console.error("Error fetching lead by ID:", error);
    throw error;
  }
};

// 🔹 Fetch enquiry by leadId and enquiryId
export async function getEnquiryByLeadAndEnquiry(leadId, enquiryId) {
  try {
    const response = await axiosInstance.get(
      `/api/leadmanagement/enquiries/${leadId}/${enquiryId}`
    );
    return response.data; // Assuming it's plain EnquiryResponseDTO, not wrapped
  } catch (error) {
    console.error("Error fetching enquiry:", error);
    throw error;
  }
}
