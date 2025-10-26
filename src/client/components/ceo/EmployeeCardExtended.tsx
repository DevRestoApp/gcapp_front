import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";
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
                    <Image source={{ uri: avatar }} style={styles.avatar} />
                    <View style={styles.textContainer}>
                        <Text style={styles.name}>{name}</Text>
                        {role && <Text style={styles.role}>{role}</Text>}
                    </View>
                </View>
                {onPress && (
                    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <Path
                            d="M15.7799 11.2799C15.9206 11.4204 15.9997 11.611 15.9999 11.8099V12.1899C15.9976 12.3883 15.9188 12.5781 15.7799 12.7199L10.6399 17.8499C10.546 17.9445 10.4182 17.9978 10.2849 17.9978C10.1516 17.9978 10.0238 17.9445 9.92992 17.8499L9.21992 17.1399C9.12586 17.0477 9.07285 16.9215 9.07285 16.7899C9.07285 16.6582 9.12586 16.532 9.21992 16.4399L13.6699 11.9999L9.21992 7.55985C9.12526 7.46597 9.07202 7.33817 9.07202 7.20485C9.07202 7.07153 9.12526 6.94374 9.21992 6.84985L9.92992 6.14985C10.0238 6.0552 10.1516 6.00195 10.2849 6.00195C10.4182 6.00195 10.546 6.0552 10.6399 6.14985L15.7799 11.2799Z"
                            fill="white"
                        />
                    </Svg>
                )}
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
        alignItems: "center",
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
