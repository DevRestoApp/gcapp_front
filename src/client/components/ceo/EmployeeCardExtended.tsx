import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { textStyles } from "@/src/client/styles/ui/text.styles";
import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";
import { Entypo } from "@expo/vector-icons";

interface StatItem {
    icon?: React.ReactNode; // Can be IconCard component or any icon
    label: string;
    value: string;
}

interface EmployeeCardProps {
    name: string;
    amount?: string; // for simple variant
    avatar: string;
    role?: string; // for full variant
    stats?: StatItem[]; // Array of stats to display
    onPress?: () => void;
}

export default function EmployeeCardExtended({
    name,
    amount,
    avatar,
    role,
    stats,
    onPress,
}: EmployeeCardProps) {
    // Full variant (for employee management screen)
    return (
        <TouchableOpacity
            style={styles.fullCard}
            onPress={onPress}
            activeOpacity={0.9}
            disabled={!onPress}
        >
            {/* Employee Info Row */}
            <View style={styles.employeeInfo}>
                <View style={styles.employeeDetails}>
                    {/* Левая часть: аватар + имя/процент */}
                    <View style={styles.leftSection}>
                        <Image source={{ uri: avatar }} style={styles.avatar} />

                        <View style={styles.textContainer}>
                            <Text style={styles.name}>{name}</Text>

                            {amount && (
                                <View style={styles.amountContainer}>
                                    <MaterialCommunityIcons
                                        name="lightning-bolt"
                                        size={16}
                                        color={textStyles.positive.color}
                                    />
                                    <Text style={textStyles.positive}>
                                        Выполнил квест на {amount} %
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Правая часть: роль */}
                    {role && <Text style={styles.role}>{role}</Text>}
                </View>
            </View>

            {/* Stats Section - dynamically rendered from stats array */}
            {stats && stats.length > 0 && (
                <View style={styles.statsSection}>
                    {stats.map((stat, index) => (
                        <View key={index} style={styles.statItem}>
                            <View style={styles.statLabel}>
                                {stat.icon}
                                <Text style={styles.statLabelText}>
                                    {stat.label}
                                </Text>
                            </View>
                            <Text style={styles.statValue}>{stat.value}</Text>
                        </View>
                    ))}
                </View>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    // Simple variant styles
    simpleCard: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 12,
    },
    leftSection: {
        flexDirection: "row", // аватар + текст рядом
        alignItems: "center",
        gap: 8,
    },
    employeeContent: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        flex: 1,
    },
    employeeText: {
        flex: 1,
        gap: 4,
    },
    employeeName: {
        color: "#FFFFFF",
        fontSize: 16,
        lineHeight: 20,
    },
    employeeAmount: {
        color: "rgba(255, 255, 255, 0.75)",
        fontSize: 12,
        lineHeight: 16,
    },
    bold: {
        fontWeight: "bold",
    },
    chevronContainer: {
        padding: 8,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
    },

    // Full variant styles
    fullCard: {
        backgroundColor: "rgba(35, 35, 36, 1)",
        borderRadius: 20,
        padding: 12,
        gap: 12,
    },
    employeeInfo: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    employeeDetails: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 12,
        flex: 1,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    textContainer: {
        gap: 4,
        flex: 1,
    },
    amountContainer: {
        flexDirection: "row",
        alignSelf: "flex-start",
        padding: 4,
        borderRadius: 12,
        ...backgroundsStyles.positiveBg,
    },
    name: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "400",
        lineHeight: 20,
    },
    role: {
        color: "rgba(255, 255, 255, 0.75)",
        fontSize: 12,
        fontWeight: "400",
        lineHeight: 16,
    },
    statsSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 8,
        flexWrap: "wrap",
    },
    statItem: {
        flex: 1,
        minWidth: "45%",
        backgroundColor: "rgba(43, 43, 44, 1)",
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 8,
        gap: 4,
    },
    statLabel: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    statLabelText: {
        color: "rgba(255, 255, 255, 0.75)",
        fontSize: 12,
        fontWeight: "400",
        lineHeight: 16,
    },
    statValue: {
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: "600",
        lineHeight: 16,
    },
});
