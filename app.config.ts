import "dotenv/config";
import { ExpoConfig } from "@expo/config-types";

declare const process: any;

const config: ExpoConfig = {
    name: process.env.APP_NAME || "GCApp",
    slug: "gcapp_front",
    version: "1.0.1",
    runtimeVersion: "1.0.1",
    extra: {
        IIKO_API: process.env.IIKO_API || "IIKOTOKEN",
        API_URL: process.env.API_URL || "http://localhost:8008",
        EXPO_PUBLIC_API_URL:
            process.env.EXPO_PUBLIC_API_URL || "http://localhost:8008",
        eas: {
            projectId: "33d9dc6a-69d6-409d-bfe2-efbc0c9f7345",
        },
    },
    android: {
        package: "com.gcapp.mobile",
        versionCode: 1,
        adaptiveIcon: {
            foregroundImage: "./assets/adaptive-icon.png",
            backgroundColor: "#ffffff",
        },
    },
    plugins: ["expo-secure-store"],
};

export default config;
