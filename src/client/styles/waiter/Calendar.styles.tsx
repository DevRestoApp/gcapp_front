import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    calendarRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        marginVertical: 16,
    },
    dayBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    dayBoxActive: { backgroundColor: "#fff" },
    dayDate: { fontSize: 16, fontWeight: "700" },
    dayLabel: { fontSize: 12 },
    textDark: { color: "#2C2D2E" },
    textLight: { color: "#fff" },
});
