import axios from "axios";
import Constants from "expo-constants";
import { storage } from "@/src/server/storage";
import { logger } from "./logger"; // Import your logger

const { EXPO_PUBLIC_API_URL } = Constants.expoConfig?.extra || {};

console.log("🔍 API baseURL: ewkere", EXPO_PUBLIC_API_URL);

const api = axios.create({
    baseURL: EXPO_PUBLIC_API_URL,
    timeout: 30000, // 30 second timeout
});

// Request interceptor - add auth token
api.interceptors.request.use(
    async (config) => {
        const token = await storage.getItem("access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    async (error) => {
        // Log request errors (rare, but can happen)
        await logger.logError(error, "API Request Interceptor");
        return Promise.reject(error);
    },
);

// Response interceptor - handle errors and log to Telegram
api.interceptors.response.use(
    (response) => {
        // Success - just return the response
        return response;
    },
    async (error) => {
        // Extract error details
        const url = error.config?.url || "unknown";
        const method = error.config?.method?.toUpperCase() || "GET";
        const baseURL = error.config?.baseURL || "";
        const fullURL = `${baseURL}${url}`;

        // Log to console for development
        console.error("API Error:", {
            url: fullURL,
            method,
            status: error.response?.status,
            message: error.message,
        });

        // Log to Telegram (only in production or if enabled)
        try {
            await logger.logNetworkError(error, fullURL, method);
        } catch (logError) {
            // Don't let logging errors affect the app
            console.error("Failed to log to Telegram:", logError);
        }

        // Handle specific error cases
        if (error.response) {
            // Server responded with error status
            const status = error.response.status;

            switch (status) {
                case 401:
                    // Unauthorized - token might be expired
                    console.log("Unauthorized - clearing token");
                    await storage.removeItem("access_token");
                    // You might want to redirect to login here
                    break;

                case 403:
                    // Forbidden
                    console.log("Forbidden - insufficient permissions");
                    break;

                case 404:
                    // Not found
                    console.log("Resource not found");
                    break;

                case 500:
                case 502:
                case 503:
                case 504:
                    // Server errors
                    console.log("Server error - please try again later");
                    break;

                default:
                    console.log(`Error: ${status}`);
            }
        } else if (error.request) {
            // Request was made but no response received
            console.log("Network error - no response from server");

            // This is likely your Android localhost issue!
            if (error.message.includes("Network Error")) {
                console.log("Check your API_URL configuration!");
            }
        } else {
            // Something else happened
            console.log("Error setting up request:", error.message);
        }

        return Promise.reject(error);
    },
);

export default api;
