import { Text, View, StyleSheet } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";

import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";
import { textStyles } from "@/src/client/styles/ui/text.styles";

export default function ReportCard({ title, value, date, type }) {
    const isIncome = type === "income";
    const isExpense = type === "expense";

    return (
        <View style={styles.reportCard}>
            <View style={styles.reportContent}>
                <View style={styles.reportMain}>
                    {type && (
                        <View
                            style={[
                                styles.reportIcon,
                                isExpense
                                    ? backgroundsStyles.positiveBg
                                    : backgroundsStyles.negativeBg,
                            ]}
                        >
                            {isExpense ? (
                                <AntDesign
                                    name="arrow-up"
                                    size={20}
                                    color="#34C759"
                                />
                            ) : (
                                <AntDesign
                                    name="arrow-down"
                                    size={20}
                                    color="#FF3B30"
                                />
                            )}
                        </View>
                    )}
                    <View style={styles.reportText}>
                        <Text style={styles.reportTitle} numberOfLines={1}>
                            {title}
                        </Text>
                        <Text
                            style={[
                                styles.reportValue,
                                isExpense
                                    ? textStyles.negative
                                    : isIncome
                                      ? textStyles.positive
                                      : textStyles.white,
                            ]}
                        >
                            {value}
                        </Text>
                    </View>
                </View>
                {date && <Text style={styles.dateText}>{date}</Text>}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    reportCard: {
        padding: 12,
        backgroundColor: "#3A3A3C",
        borderRadius: 20,
    },
    reportContent: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 12,
    },
    reportMain: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        flex: 1,
    },
    reportIcon: {
        width: 40,
        height: 40,
        padding: 10,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    reportText: {
        flex: 1,
        gap: 4,
    },
    dateText: {
        color: "rgba(255, 255, 255, 0.75)",
        fontSize: 12,
        lineHeight: 16,
    },
    reportTitle: {
        color: "#FFFFFF",
        fontSize: 16,
        lineHeight: 20,
    },
    reportValue: {
        fontSize: 14,
        lineHeight: 18,
    },
});
