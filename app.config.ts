import "dotenv/config";
import { ExpoConfig } from "@expo/config-types";

declare const process: any;

// Helper to validate URL
const getValidUrl = (url: string | undefined): string => {
    if (!url) {
        console.error("Missing required URL environment variable");
        return "";
    }
    try {
        new URL(url);
        return url;
    } catch {
        console.error(`Invalid URL: ${url}`);
        return "";
    }
};

const config: ExpoConfig = {
    name: process.env.APP_NAME || "GCApp",
    slug: "gcappprod",
    owner: "qoqosyk",
    scheme: "com.gcappprod.mobile",
    version: "1.1.2",
    runtimeVersion: "1.1.2",
    updates: {
        url: "https://u.expo.dev/1005e280-27da-4377-940f-5432cddf9411",
    },
    orientation: "portrait",
    icon: "./assets/logo.png",
    userInterfaceStyle: "light",
    extra: {
        IIKO_API: process.env.IIKO_API || "IIKOTOKEN",
        API_URL: getValidUrl(process.env.API_URL),
        EXPO_PUBLIC_API_URL: getValidUrl(process.env.EXPO_PUBLIC_API_URL),
        TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || "",
        TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID || "",
        EXPO_PUBLIC_SKIP_LOCATION_CHECK:
            process.env.EXPO_PUBLIC_SKIP_LOCATION_CHECK || "false",
        eas: {
            projectId: "1005e280-27da-4377-940f-5432cddf9411",
        },
    },
    android: {
        icon: "./assets/logo.png",
        package: "com.gcappprod.mobile",
        permissions: [
            "INTERNET",
            "ACCESS_NETWORK_STATE",
            "ACCESS_WIFI_STATE",
            "ACCESS_FINE_LOCATION", // ← точная геолокация
            "ACCESS_COARSE_LOCATION", // приблизительная
        ],
        adaptiveIcon: {
            foregroundImage: "./assets/logo.png",
            backgroundColor: "#ffffff",
        },
    },
    ios: {
        bundleIdentifier: "com.gcappprod.mobile",
        buildNumber: "1",
        supportsTablet: true,
        infoPlist: {
            ITSAppUsesNonExemptEncryption: false,
            NSLocationWhenInUseUsageDescription:
                "Приложению нужна геолокация для проверки того, что вы находитесь на рабочем месте.",
        },
    },
    plugins: [
        "expo-font",
        "expo-router",
        "expo-secure-store",
        [
            "expo-location",
            {
                locationWhenInUsePermission:
                    "Приложению нужна геолокация для проверки того, что вы находитесь на рабочем месте.",
            },
        ],
        [
            "expo-build-properties",
            {
                ios: {
                    privacyManifestAggregationEnabled: true,
                },
                android: {
                    compileSdkVersion: 36,
                    targetSdkVersion: 36,
                    buildToolsVersion: "36.0.0",
                    androidGradlePluginVersion: "8.9.0",
                    ndkVersion: "27.1.12297006",
                    usesCleartextTraffic: false,
                    networkInspector: true,
                    useLegacyPackaging: false,
                    packagingOptions: {
                        jniLibs: {
                            useLegacyPackaging: false,
                        },
                    },
                },
            },
        ],
    ],
};

export default config;
