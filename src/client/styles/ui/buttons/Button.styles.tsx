import { StyleSheet } from "react-native";

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
});
