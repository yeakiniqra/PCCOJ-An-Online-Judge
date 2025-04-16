import { create } from "zustand";
import apiClient from "@/services/Api";
import useAuthStore from "./AuthStore";

const usePracticeProblemStore = create((set, get) => ({
  problems: [],
  problemDetail: null,
  stats: null,
  tags: [],
  submissions: [],

  loading: false,
  error: null,

  // Fetch all public problems
  fetchProblems: async () => {
    set({ loading: true, error: null });
    try {
      const res = await apiClient.get("/practice/");
      set({ problems: res.data, loading: false });
    } catch (err) {
      set({ error: err, loading: false });
    }
  },

  // Fetch a single problem detail
  fetchProblemDetail: async (slug) => {
    const token = useAuthStore.getState().token;
    set({ loading: true, error: null });
    try {
      const res = await apiClient.get(`/practice/${slug}/`, {
        headers: { Authorization: `Token ${token}` },
      });
      set({ problemDetail: res.data, loading: false });
    } catch (err) {
      set({ error: err, loading: false });
    }
  },

  // Fetch user's practice stats
  fetchStats: async () => {
    const token = useAuthStore.getState().token;
    set({ loading: true, error: null });
    try {
      const res = await apiClient.get("/practice/stats/", {
        headers: { Authorization: `Token ${token}` },
      });
      set({ stats: res.data, loading: false });
    } catch (err) {
      set({ error: err, loading: false });
    }
  },

  // Fetch problem tags
  fetchTags: async () => {
    const token = useAuthStore.getState().token;
    set({ loading: true, error: null });
    try {
      const res = await apiClient.get("/practice/tags/", {
        headers: { Authorization: `Token ${token}` },
      });
      set({ tags: res.data, loading: false });
    } catch (err) {
      set({ error: err, loading: false });
    }
  },

  // Fetch user's submissions for a specific problem
  fetchSubmissions: async (slug) => {
    const token = useAuthStore.getState().token;
    set({ loading: true, error: null });
    try {
      const res = await apiClient.get(`/practice/${slug}/submissions/`, {
        headers: { Authorization: `Token ${token}` },
      });
      set({ submissions: res.data, loading: false });
    } catch (err) {
      set({ error: err, loading: false });
    }
  },

  // Optional: clear state
  clearProblemDetail: () => set({ problemDetail: null, submissions: [] }),
}));

export default usePracticeProblemStore;
