import api from "./api";
import { storage } from "./storage";
import { logger } from "./logger";

export async function register({
    login,
    password,
}: {
    login: string;
    password: string;
}) {
    try {
        const res = await api.post("/register", { login, password });
        const { access_token } = res.data;

        await storage.setItem("access_token", access_token);

        // Log successful registration
        await logger.logInfo("User registered successfully", { login });

        return res.data;
    } catch (error: any) {
        // Log registration error
        await logger.logError(error, `Registration failed for user: ${login}`);
        throw error;
    }
}

export async function login({
    login,
    password,
}: {
    login: string;
    password: string;
}) {
    try {
        const res = await api.post("/login", { login, password });
        console.log("auth", res.data);
        const { access_token, user } = res.data;

        await storage.setItem("access_token", access_token);
        await storage.setItem("user", user);

        // Log successful login
        await logger.logInfo("User logged in successfully", {
            login,
            userId: user?.id,
        });

        return res.data;
    } catch (error: any) {
        // Log login error with context
        await logger.logError(error, `Login failed for user: ${login}`);
        throw error;
    }
}

export async function getMe() {
    try {
        const res = await api.get("/me");
        return res.data;
    } catch (error: any) {
        // Log getMe error
        await logger.logError(error, "Failed to fetch user profile (/me)");
        throw error;
    }
}

export async function logout() {
    try {
        await storage.removeItem("access_token");
        await storage.removeItem("user");

        // Log successful logout
        await logger.logInfo("User logged out successfully");
    } catch (error: any) {
        // Log logout error
        await logger.logError(error, "Logout failed");
        throw error;
    }
}
