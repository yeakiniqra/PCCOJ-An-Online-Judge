import { create } from "zustand";
import apiClient from "@/services/Api";
import useAuthStore from "./AuthStore";

const useParticipateStore = create((set) => ({
    participation: null,
    loading: false,
    error: null,
    success: false,

    participateInContest: async (contestId) => {
        set({ loading: true, error: null, success: false });

        const token = useAuthStore.getState().token; 

        try {
            const response = await apiClient.post(
                `/participate/${contestId}/participate/`,
                {}, // POST body is empty
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );
            set({ participation: response.data, loading: false, success: true });
        } catch (error) {
            set({
                error: error.response?.data?.detail || "Failed to participate.",
                loading: false,
            });
        }
    },

    resetParticipation: () => {
        set({ participation: null, success: false, error: null });
    },
}));


export default useParticipateStore;
