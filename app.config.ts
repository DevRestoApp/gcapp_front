import "dotenv/config";
import { ExpoConfig } from "@expo/config-types";

const config: ExpoConfig = {
    name: process.env.APP_NAME || "GCApp",
    slug: "gcapp_front",
    version: "1.0.0",
    extra: {
        IIKO_API: process.env.IIKO_API || "IIKOTOKEN",
    },
};

export default config;
