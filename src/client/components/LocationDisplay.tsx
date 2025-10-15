import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface LocationDisplayProps {
    location: string;
}

export default function LocationDisplay({ location }: LocationDisplayProps) {
    return (
        <View style={styles.section}>
            <Text style={styles.title}>Локация</Text>
            <View style={styles.locationContainer}>
                <Text style={styles.locationText}>{location}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        gap: 16,
        width: "100%",
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        color: "white",
        lineHeight: 28,
    },
    locationContainer: {
        height: 44,
        borderRadius: 20,
        paddingHorizontal: 16,
        backgroundColor: "rgba(43, 43, 44, 1)",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.1)",
    },
    locationText: {
        fontSize: 16,
        color: "#fff",
        fontWeight: "500",
    },
});
