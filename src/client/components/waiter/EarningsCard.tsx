import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface EarningsCardProps {
    amount: string;
}

export default function EarningsCard({ amount }: EarningsCardProps) {
    return (
        <View style={styles.card}>
            {/* Icon */}
            <View style={styles.iconWrapper}>
                <Ionicons name="logo-usd" size={24} color="#0DC268" />
            </View>

            {/* Content */}
            <View style={styles.textWrapper}>
                <Text style={styles.label}>Сегодняшний счет</Text>
                <Text style={styles.amount}> 15000 тг{amount}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 8,
        padding: 12,
        borderRadius: 20,
        width: 175,
        backgroundColor: "rgba(35, 35, 36, 1)",
    },
    iconWrapper: {
        width: 28,
        height: 28,
        justifyContent: "center",
        alignItems: "center",
    },
    textWrapper: {
        flexDirection: "column",
        width: "100%",
    },
    label: {
        color: "#797A80",
        fontSize: 12,
        fontWeight: "400",
        lineHeight: 16,
        fontFamily: "Inter",
    },
    amount: {
        color: "white",
        fontSize: 22,
        fontWeight: "600",
        lineHeight: 30,
        fontFamily: "Inter",
    },
});
