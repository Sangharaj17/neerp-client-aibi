
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
