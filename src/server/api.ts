import axios from "axios";
import Constants from "expo-constants";
import { storage } from "@/src/server/storage";

const { API_URL } = Constants.expoConfig?.extra || {};

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = storage.getItem("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
