import { create } from "zustand";
import apiClient from "@/services/Api";
import useAuthStore from "./AuthStore";

const usePracticeSubmitStore = create((set) => ({
    submissions: [],
    submissionDetail: null,
    submitting: false,
    loading: false,
    error: null,

    // Fetch all submissions
    fetchSubmissions: async () => {
        const token = useAuthStore.getState().token;
        set({ loading: true, error: null });

        try {
            const response = await apiClient.get("/practicesubmit/", {
                headers: { Authorization: `Token ${token}` },
            });
            set({ submissions: response.data, loading: false });
        } catch (err) {
            console.error("Error fetching submissions", err);
            set({ error: err, loading: false });
        }
    },

    // Fetch submission by ID
    fetchSubmissionDetail: async (id) => {
        const token = useAuthStore.getState().token;
        set({ loading: true, error: null });

        try {
            const response = await apiClient.get(`/practicesubmit/${id}/`, {
                headers: { Authorization: `Token ${token}` },
            });
            set({ submissionDetail: response.data, loading: false });
            return response.data; // Useful for redirect or showing result
        } catch (err) {
            console.error("Error fetching submission detail", err);
            set({ error: err, loading: false });
        }
    },

    // Submit code
    submitPracticeCode: async ({ problemId, code, language }) => {
        const token = useAuthStore.getState().token;
        set({ submitting: true, error: null });

        try {
            const response = await apiClient.post(
                `/practicesubmit/${problemId}/submit/`,
                {
                    problem: problemId,
                    code,
                    language,
                },
                {
                    headers: { Authorization: `Token ${token}` },
                }
            );

        
            set((state) => ({
                submissions: [response.data, ...state.submissions],
                submissionResult: response.data,
                submitting: false,
            }));

            return response.data; // Useful for redirect or showing result
        } catch (err) {
            console.error("Error submitting code", err);
            set({ error: err, submitting: false });
            throw err;
        }
    },

    // Reset submission state
    resetSubmission: () => {
        set({
            submissionResult: null,
            error: null,
            submitting: false,
        });
    },
}));

export default usePracticeSubmitStore;
