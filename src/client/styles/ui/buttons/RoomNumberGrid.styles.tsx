import { StyleSheet } from "react-native";

export const RoomNumberGridStyles = StyleSheet.create({
    roomsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    roomButton: {
        height: 44,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: "rgba(43, 43, 44, 1)",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "transparent",
    },
    roomButtonActive: {
        backgroundColor: "#FFFFFF",
        borderColor: "#FFFFFF",
    },
    roomButtonText: {
        fontSize: 14,
        color: "#797A80",
        fontWeight: "500",
    },
    roomButtonTextActive: {
        color: "#2C2D2E",
        fontWeight: "600",
    },
});
