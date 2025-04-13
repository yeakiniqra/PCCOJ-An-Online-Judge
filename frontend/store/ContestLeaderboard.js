import { create } from "zustand";
import apiClient from "@/services/Api";
import useAuthStore from "./AuthStore";

const useLeaderboardStore = create((set, get) => ({
  leaderboards: {}, // contestId -> leaderboard data
  loading: false,
  error: null,

  fetchLeaderboard: async (contestId) => {
    const { token } = useAuthStore.getState();
    if (!token || !contestId) return;

    set({ loading: true, error: null });

    try {
      const response = await apiClient.get(`/submission/leaderboard/?contest=${contestId}`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      set((state) => ({
        leaderboards: {
          ...state.leaderboards,
          [contestId]: response.data,
        },
        loading: false,
        error: null,
      }));
    } catch (error) {
      set({ loading: false, error: error.response?.data || "Failed to load leaderboard" });
    }
  },

  getLeaderboardByContest: (contestId) => {
    return get().leaderboards[contestId] || [];
  },
}));

export default useLeaderboardStore;
