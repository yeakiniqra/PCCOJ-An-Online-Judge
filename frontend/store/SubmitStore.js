import { create } from "zustand";
import apiClient from "@/services/Api";
import useAuthStore from "./AuthStore";

const useCodeSubmissionStore = create((set, get) => ({
  result: null, // Store the result of the submission
  loading: false,
  error: null,
  
  submitCode: async ({ problemId, code, language }) => {
    const { token } = useAuthStore.getState();
    set({ loading: true, error: null, result: null });
    
    try {
      const response = await apiClient.post(
        `/problem/${problemId}/submit/`,
        {
          problem: problemId,
          code,
          language,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      
      set({ result: response.data, loading: false });
      return response.data; // Return data for direct use in component
      
    } catch (error) {
      console.error("Submission failed:", error);
      const errorMsg =
        error.response?.data?.detail ||
        error.response?.data?.error ||
        "Failed to submit code.";
      
      set({ error: errorMsg, loading: false });
      throw error; // Re-throw to handle in component
    }
  },
  
  resetSubmissionState: () => {
    set({ result: null, error: null, loading: false });
  },
}));

export default useCodeSubmissionStore;