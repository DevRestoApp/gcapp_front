import "dotenv/config";
import { ExpoConfig } from "@expo/config-types";

declare const process: any;

const config: ExpoConfig = {
    name: process.env.APP_NAME || "GCApp",
    slug: "gcapp_front",
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
        API_URL: process.env.API_URL,
        EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
        TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
        TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID,
        eas: {
            projectId: "33d9dc6a-69d6-409d-bfe2-efbc0c9f7345",
        },
    },
    android: {
        package: "com.gcapp.mobile",
        versionCode: 2,
        usesCleartextTraffic: true, // ✅ This is the correct way
        permissions: ["INTERNET", "ACCESS_NETWORK_STATE", "ACCESS_WIFI_STATE"],
        adaptiveIcon: {
            foregroundImage: "./assets/adaptive-icon.png",
            backgroundColor: "#ffffff",
        },
    },
    plugins: [
        "expo-secure-store",
        [
            "expo-build-properties",
            {
                android: {
                    usesCleartextTraffic: true, // ✅ Also set in plugin
                    networkInspector: true,
                },
            },
        ],
    ],
    ios: {
        bundleIdentifier: "com.gcapp.mobile",
        supportsTablet: true,
        // iOS allows localhost by default in dev
    },
    plugins: [
        "expo-secure-store",
        [
            "expo-build-properties",
            {
                android: {
                    usesCleartextTraffic: true,
                    networkInspector: true, // Enables network debugging
                },
            },
        ],
    ],
};

export default config;
