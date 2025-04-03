import { create } from "zustand";
import apiClient from "@/services/Api";

const useFetchContest = create((set) => ({
  contests: [],
  contestDetails: null,
  contestsLoading: false,
  contestDetailsLoading: false,
  error: null,

  fetchContests: async () => {
    set({ contestsLoading: true, error: null });
    try {
      const response = await apiClient.get("/contest/");
      set({ contests: response.data, contestsLoading: false });
    } catch (error) {
      set({ error: error.message, contestsLoading: false });
    }
  },

  fetchContestById: async (id) => {
    set({ contestDetailsLoading: true, error: null });
    try {
      const response = await apiClient.get(`/contest/${id}/`);
      set({ contestDetails: response.data, contestDetailsLoading: false });
      console.log(response.data);
    } catch (error) {
      set({ error: error.message, contestDetailsLoading: false });
    }
  },
}));

export default useFetchContest;
