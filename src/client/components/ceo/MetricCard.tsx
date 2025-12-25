import { Text, View, StyleSheet } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";
import { textStyles } from "@/src/client/styles/ui/text.styles";

interface MetricCardProps {
    id: any;
    label: string;
    value: string;
    change?: {
        value: string;
        trend: "up" | "down";
    };
}

export default function MetricCard({
    id,
    label,
    value,
    change,
}: MetricCardProps) {
    return (
        <View style={styles.metricCard}>
            <View style={styles.metricContent}>
                <Text style={styles.metricLabel}>{label}</Text>
                <Text style={styles.metricValue}>{value}</Text>
            </View>
            {change && (
                <View style={styles.changeContainer}>
                    <Text
                        style={[
                            styles.changeText,
                            change.trend === "down"
                                ? textStyles.negative
                                : textStyles.positive,
                        ]}
                    >
                        {change.value}
                    </Text>
                    <View
                        style={[
                            styles.trendBadge,
                            change.trend === "down"
                                ? backgroundsStyles.negativeBg
                                : backgroundsStyles.positiveBg,
                        ]}
                    >
                        {change.trend === "down" ? (
                            <Ionicons
                                name="arrow-down"
                                size={20}
                                color="#FF3B30"
                            />
                        ) : (
                            <Ionicons
                                name="arrow-up"
                                size={20}
                                color="#34C759"
                            />
                        )}
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    metricCard: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    metricContent: {
        flex: 1,
        justifyContent: "center",
        gap: 4,
    },
    metricLabel: {
        color: "rgba(255, 255, 255, 0.75)",
        fontSize: 12,
        lineHeight: 16,
    },
    metricValue: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
        lineHeight: 20,
    },
    changeContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    changeText: {
        fontSize: 12,
        lineHeight: 16,
    },
    trendBadge: {
        padding: 4,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
});
