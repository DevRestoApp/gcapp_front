import "dotenv/config";
import { ExpoConfig } from "@expo/config-types";

declare const process: any;

// Helper to validate URL
const getValidUrl = (url: string | undefined, fallback: string): string => {
    if (!url) return fallback;
    try {
        new URL(url);
        return url;
    } catch {
        console.warn(`Invalid URL: ${url}, using fallback: ${fallback}`);
        return fallback;
    }
};

const config: ExpoConfig = {
    name: process.env.APP_NAME || "GCApp",
    slug: "gcapp_front",
    scheme: "com.gcapp.mobile",
    version: "1.0.1",
    runtimeVersion: "1.0.1",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
        image: "./assets/splash.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff",
    },
    extra: {
        IIKO_API: process.env.IIKO_API || "IIKOTOKEN",
        API_URL: getValidUrl(process.env.API_URL, "http://localhost:8008"),
        EXPO_PUBLIC_API_URL: getValidUrl(
            process.env.EXPO_PUBLIC_API_URL,
            "http://localhost:8008",
        ),
        EXPO_PUBLIC_TELEGRAM_BOT_TOKEN:
            process.env.EXPO_PUBLIC_TELEGRAM_BOT_TOKEN || "",
        EXPO_PUBLIC_TELEGRAM_CHAT_ID:
            process.env.EXPO_PUBLIC_TELEGRAM_CHAT_ID || "",
        eas: {
            projectId: "33d9dc6a-69d6-409d-bfe2-efbc0c9f7345",
        },
    },
    android: {
        package: "com.gcapp.mobile",
        versionCode: 3,
        permissions: ["INTERNET", "ACCESS_NETWORK_STATE", "ACCESS_WIFI_STATE"],
        adaptiveIcon: {
            foregroundImage: "./assets/adaptive-icon.png",
            backgroundColor: "#ffffff",
        },
    },
    ios: {
        bundleIdentifier: "com.gcapp.mobile",
        supportsTablet: true,
    },
    plugins: [
        "expo-secure-store",
        [
            "expo-build-properties",
            {
                android: {
                    usesCleartextTraffic: true,
                    networkInspector: true,
                },
            },
        ],
    ],
};

export default config;
