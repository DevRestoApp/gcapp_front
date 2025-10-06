import { StyleSheet } from "react-native";

export const loadingStyles = StyleSheet.create({
    loadingContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 60,
        gap: 16,
    },
    loadingText: {
        color: "rgba(255, 255, 255, 0.75)",
        fontSize: 16,
    },
});
