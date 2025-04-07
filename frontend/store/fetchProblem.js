import { create } from "zustand";
import apiClient from "@/services/Api";
import useAuthStore from "./AuthStore";

const useFetchProblemStore = create((set) => ({
  problems: [],
  problemDetails: null,
  loading: false,
  error: null,

  fetchProblems: async () => {
    set({ loading: true, error: null });

    const token = useAuthStore.getState().token;

    try {
      const response = await apiClient.get("/problem/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      set({ problems: response.data, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.detail || "Failed to fetch problems.",
        loading: false,
      });
    }
  },

  fetchProblemById: async (id) => {
    set({ loading: true, error: null });

    const token = useAuthStore.getState().token;

    try {
      const response = await apiClient.get(`/problem/${id}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      set({ problemDetails: response.data, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.detail || "Failed to fetch problem.",
        loading: false,
      });
    }
  },

  resetProblemState: () => {
    set({ problems: [], problemDetails: null, error: null, loading: false });
  }
}));

export default useFetchProblemStore;
