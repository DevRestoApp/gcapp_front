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
    owner: "qoqosyk",
    scheme: "com.gcapp.mobile2",
    version: "1.0.1",
    runtimeVersion: "1.0.1",
    updates: {
        url: "https://u.expo.dev/33d9dc6a-69d6-409d-bfe2-efbc0c9f7345",
    },
    orientation: "portrait",
    icon: "./assets/logo.png",
    userInterfaceStyle: "light",
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
        EXPO_PUBLIC_SKIP_LOCATION_CHECK:
            process.env.EXPO_PUBLIC_SKIP_LOCATION_CHECK || "false",
        eas: {
            projectId: "33d9dc6a-69d6-409d-bfe2-efbc0c9f7345",
        },
    },
    android: {
        icon: "./assets/logo.png",
        package: "com.gcapp.mobile2",
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
        bundleIdentifier: "com.gcapp.mobile2",
        buildNumber: "1",
        supportsTablet: true,
        infoPlist: {
            NSLocationWhenInUseUsageDescription:
                "Приложению нужна геолокация для проверки того, что вы находитесь на рабочем месте.",
        },
    },
    plugins: [
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
                    targetSdkVersion: 35,
                    usesCleartextTraffic: true,
                    networkInspector: true,
                },
            },
        ],
    ],
};

export default config;
