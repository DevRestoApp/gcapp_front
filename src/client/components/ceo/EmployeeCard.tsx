import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";
import { Entypo } from "@expo/vector-icons";

interface EmployeeCardProps {
    name: string;
    amount?: string; // for simple variant
    avatar: string;
    role?: string; // for full variant
    totalAmount?: string; // for full variant
    shiftTime?: string; // for full variant
    variant?: "simple" | "full"; // determines which variant to show
    showStats?: boolean; // for full variant - shows stats section
    onPress?: () => void;
}

export default function EmployeeCard({
    name,
    amount,
    avatar,
    role,
    totalAmount,
    shiftTime,
    variant = "simple",
    showStats = false,
    onPress,
}: EmployeeCardProps) {
    // Simple variant (for analytics screen)
    if (variant === "simple") {
        console.log("simple", {
            name,
            amount,
            avatar,
            role,
            totalAmount,
            shiftTime,
            variant,
            showStats,
            onPress,
        });
        return (
            <TouchableOpacity
                style={styles.simpleCard}
                onPress={onPress}
                activeOpacity={0.7}
                disabled={!onPress}
            >
                <View style={styles.employeeContent}>
                    <Image source={{ uri: avatar }} style={styles.avatar} />
                    <View style={styles.employeeText}>
                        <Text style={styles.employeeName}>{name}</Text>
                        <Text style={styles.employeeAmount} numberOfLines={1}>
                            Общий сумма:{" "}
                            <Text style={styles.bold}>{amount}</Text>
                        </Text>
                    </View>
                </View>
                {onPress && (
                    <View style={styles.chevronContainer}>
                        <Entypo
                            name="chevron-right"
                            size={20}
                            color="#FFFFFF"
                        />
                    </View>
                )}
            </TouchableOpacity>
        );
    }

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

            {/* Stats Section - only shown if showStats is true */}
            {showStats && totalAmount && shiftTime && (
                <View style={styles.statsSection}>
                    {/* Total Amount */}
                    <View style={styles.statItem}>
                        <View style={styles.statLabel}>
                            <Svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                            >
                                <Path
                                    d="M7 0.333008C10.6819 0.333008 13.667 3.3181 13.667 7C13.667 10.6819 10.6819 13.667 7 13.667C3.3181 13.667 0.333008 10.6819 0.333008 7C0.333008 3.3181 3.3181 0.333008 7 0.333008ZM4.83301 5.45312C4.55703 5.4533 4.33304 5.67809 4.33301 5.9541C4.33301 6.23014 4.55702 6.45588 4.83301 6.45605H6.23535V9.83301C6.23535 10.1092 6.45921 10.333 6.73535 10.333H7.26465C7.54079 10.333 7.76465 10.1092 7.76465 9.83301V6.45605H7.76465C9.44297 5.4533 9.16699 5.45312H4.83301ZM4.83301 3.66699C4.55706 3.66717 4.33308 3.89199 4.33301 4.16797C4.33301 4.444 4.55702 4.66974 4.83301 4.66992H9.16699C9.44299 4.66975 9.66699 4.444 9.66699 4.16797C9.66692 3.89199 9.44294 3.66717 9.16699 3.66699H4.83301Z"
                                    fill="#0DC268"
                                />
                            </Svg>
                            <Text style={styles.statLabelText}>
                                Общий сумма:
                            </Text>
                        </View>
                        <Text style={styles.statValue}>{totalAmount}</Text>
                    </View>

                    {/* Shift Time */}
                    <View style={styles.statItem}>
                        <View style={styles.statLabel}>
                            <Svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                            >
                                <Path
                                    d="M8 1.5C6.71442 1.5 5.45772 1.88122 4.3888 2.59545C3.31988 3.30968 2.48676 4.32484 1.99479 5.51256C1.50282 6.70028 1.37409 8.00721 1.6249 9.26809C1.8757 10.529 2.49477 11.6872 3.40381 12.5962C4.31285 13.5052 5.47104 14.1243 6.73192 14.3751C7.99279 14.6259 9.29973 14.4972 10.4874 14.0052C11.6752 13.5132 12.6903 12.6801 13.4046 11.6112C14.1188 10.5423 14.5 9.28558 14.5 8C14.4967 6.27711 13.8108 4.62573 12.5925 3.40746C11.3743 2.18918 9.7229 1.5033 8 1.5V1.5ZM11.5 8.5H8C7.86739 8.5 7.74022 8.44732 7.64645 8.35355C7.55268 8.25979 7.5 8.13261 7.5 8V4.5C7.5 4.36739 7.55268 4.24021 7.64645 4.14645C7.74022 4.05268 7.86739 4 8 4C8.13261 4 8.25979 4.05268 8.35356 4.14645C8.44732 4.24021 8.5 4.36739 8.5 4.5V7.5H11.5C11.6326 7.5 11.7598 7.55268 11.8536 7.64645C11.9473 7.74021 12 7.86739 12 8C12 8.13261 11.9473 8.25979 11.8536 8.35355C11.7598 8.44732 11.6326 8.5 11.5 8.5Z"
                                    fill="#FF9E00"
                                />
                            </Svg>
                            <Text style={styles.statLabelText}>
                                Время смена:
                            </Text>
                        </View>
                        <Text style={styles.statValue}>{shiftTime}</Text>
                    </View>
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
        alignItems: "center",
        gap: 8,
    },
    statItem: {
        flex: 1,
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
