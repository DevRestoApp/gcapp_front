import { Dimensions, Platform } from "react-native";
import { StyleSheet } from "react-native";
import { sizes } from "@/src/utils/utils";

const { width } = Dimensions.get("window");
const scale = width / 375;

export const ButtonStyles = StyleSheet.create({
    buttonWhite: {
        height: 44, // h-11
        borderRadius: 20, // rounded-[20px]
        backgroundColor: "#FFFFFF", // bg-white
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
    },
    buttonText: {
        color: "#000000", // text-black
        fontSize: 16, // text-base
        fontWeight: "600", // font-semibold
        lineHeight: 22, // leading-6
        fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
    },
    addButtonManager: {
        width: Math.min(sizes.l * scale, 80), // Cap at 80px for tablets
        height: Math.min(sizes.l * scale, 80),
        borderRadius: Math.min(sizes.m * scale, 40),
        backgroundColor: "#ffffff",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        bottom: 16 * scale,
        right: 16 * scale,
    },
    addButtonManagerText: {
        color: "#000000",
        fontSize: 20,
        fontWeight: "600",
        lineHeight: 24,
    },
});
