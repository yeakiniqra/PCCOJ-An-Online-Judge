'use client';
import { createContext, useState, useEffect,useContext } from "react";
import apiClient from "@/services/Api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    // Login function
    const login = async (username, password) => {
        try {
            const response = await apiClient.post("/auth/user_login/", {
                username,
                password,
            });

            const { token, user_id } = response.data;
            localStorage.setItem("token", token);
            await fetchUserProfile(); // Fetch profile after login

            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.error || "Login failed" };
        }
    };

    // Register function
    const register = async (userData) => {
        try {
            await apiClient.post("/auth/user_register/", userData);
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.error || "Registration failed" };
        }
    };

    // Logout function
    const logout = async () => {
        try {
            await apiClient.post("/auth/user_logout/", {}, {
                headers: { Authorization: `Token ${localStorage.getItem("token")}` },
            });

            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    // Fetch user profile
    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const response = await apiClient.get("/auth/user_profile/", {
                headers: { Authorization: `Token ${token}` },
            });

            setUser(response.data);
            localStorage.setItem("user", JSON.stringify(response.data));
        } catch (error) {
            console.error("Failed to fetch user profile", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, fetchUserProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
