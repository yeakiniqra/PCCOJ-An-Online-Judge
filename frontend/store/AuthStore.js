import { create } from "zustand";
import { persist } from "zustand/middleware";
import apiClient from "@/services/Api";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (credentials) => {
        try {
          const response = await apiClient.post("/auth/user_login/", credentials);
          const { token, user_id } = response.data;
          set({ token, isAuthenticated: true });
          await get().fetchUserProfile();
        } catch (error) {
          console.error("Login failed", error);
          throw error;
        }
      },

      logout: async () => {
        try {
          await apiClient.post("/auth/user_logout/", {}, {
            headers: { Authorization: `Token ${get().token}` },
          });
        } catch (error) {
          console.error("Logout failed", error);
        } finally {
          set({ user: null, token: null, isAuthenticated: false });
        }
      },

      register: async (userData) => {
        try {
          const response = await apiClient.post("/auth/user_register/", userData);
          return response.data;
        } catch (error) {
          console.error("Registration failed", error);
          throw error;
        }
      },

      fetchUserProfile: async () => {
        try {
          const response = await apiClient.get("/auth/user_profile/", {
            headers: { Authorization: `Token ${get().token}` },
          });
          set({ user: response.data });
        } catch (error) {
          console.error("Fetching user profile failed", error);
        }
      },

      updateUserProfile: async (updatedData) => {
        try {
          const response = await apiClient.put("/auth/user_profile/", updatedData, {
            headers: { Authorization: `Token ${get().token}` },
          });
          set({ user: response.data });
        } catch (error) {
          console.error("Updating user profile failed", error);
          throw error;
        }
      },
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
    }
  )
);

export default useAuthStore;
