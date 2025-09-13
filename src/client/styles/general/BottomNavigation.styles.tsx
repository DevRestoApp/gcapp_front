// styles/general/BottomNavigation.styles.ts
import { StyleSheet } from "react-native";

export const bottomNavigationStyles = StyleSheet.create({
    bottomNav: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "#242424",
        height: 70,
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        elevation: 5,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: -2 },
        shadowRadius: 6,
    },
    navText: {
        fontSize: 12,
        color: "#8E8E93",
        marginBottom: 5,
    },
    navActive: {
        fontSize: 12,
        color: "#d8d8d8",
        fontWeight: "600",
        marginBottom: 5,
    },
});
