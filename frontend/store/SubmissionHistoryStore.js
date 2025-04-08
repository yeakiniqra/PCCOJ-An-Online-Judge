import { create } from "zustand";
import apiClient from "@/services/Api";
import useAuthStore from "./AuthStore";

const useSubmissionStore = create((set, get) => ({
  submissions: [],
  loading: false,
  error: null,
  selectedSubmission: null,
  
  fetchAllSubmissions: async () => {
    const { token } = useAuthStore.getState();
    
    set({ loading: true, error: null });
    
    try {
      const response = await apiClient.get("/submission/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      
      console.log("Fetched submissions:", response.data);
      set({ submissions: response.data, loading: false });
    } catch (error) {
      console.error("Failed to fetch submissions:", error);
      set({ 
        error: error.response?.data?.detail || "Failed to fetch submissions", 
        loading: false 
      });
    }
  },
  
  fetchSubmissionById: async (id) => {
    const { token } = useAuthStore.getState();
    
    set({ loading: true, error: null });
    
    try {
      const response = await apiClient.get(`/submission/${id}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      
      console.log("Fetched submission details:", response.data);
      set({ selectedSubmission: response.data, loading: false });
    } catch (error) {
      console.error("Failed to fetch submission details:", error);
      set({ 
        error: error.response?.data?.detail || "Failed to fetch submission details", 
        loading: false 
      });
    }
  },
  
  clearSelectedSubmission: () => {
    set({ selectedSubmission: null });
  },
}));

export default useSubmissionStore;