import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export interface QuestEmployees {
    id: string;
    title: string;
    description: string;
    reward: number;
    target: number;
    unit: string;
    progress: number;
    current: number;
}

interface QuestCardEmployeesProps {
    quest: QuestEmployees;
    onPress?: () => void; // Make onPress optional
}

const renderCard = ({ quest }: { quest: QuestEmployees }) => {
    const isFullyCompleted = quest.progress === quest.current;

    return (
        <View style={[styles.card, isFullyCompleted && styles.cardCompleted]}>
            {/* Header Row */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View
                        style={[
                            styles.iconContainer,
                            isFullyCompleted && styles.iconContainerCompleted,
                        ]}
                    >
                        <Text style={styles.iconText}>
                            {isFullyCompleted ? "🏆" : "🎯"}
                        </Text>
                    </View>
                    <View style={styles.headerInfo}>
                        <Text
                            style={[
                                styles.subtitle,
                                isFullyCompleted && styles.subtitleCompleted,
                            ]}
                        >
                            {quest.title}
                        </Text>
                        <Text style={styles.description} numberOfLines={2}>
                            {quest.description}
                        </Text>
                    </View>
                </View>
                <Text
                    style={[
                        styles.reward,
                        isFullyCompleted && styles.rewardCompleted,
                    ]}
                >
                    {quest.reward.toLocaleString()} тг
                </Text>
            </View>

            {/* Divider */}
            <View
                style={[
                    styles.divider,
                    isFullyCompleted && styles.dividerCompleted,
                ]}
            />

            {/* Quest Target Info */}
            <View style={styles.targetSection}>
                <Text style={styles.targetLabel}>Цель квеста</Text>
                <Text style={styles.targetValue}>
                    {quest.target} {quest.unit}
                </Text>
            </View>
        </View>
    );
};

export default function QuestCard({ quest, onPress }: QuestCardEmployeesProps) {
    if (onPress) {
        return (
            <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
                {renderCard({ quest })}
            </TouchableOpacity>
        );
    }

    return renderCard({ quest });
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "rgba(35, 35, 36, 1)",
        borderRadius: 20,
        padding: 16,
        gap: 16,
    },
    cardCompleted: {
        backgroundColor: "rgba(13, 194, 104, 0.08)",
        borderWidth: 1,
        borderColor: "rgba(13, 194, 104, 0.2)",
    },

    // Header
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        flex: 1,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        justifyContent: "center",
        alignItems: "center",
    },
    iconContainerCompleted: {
        backgroundColor: "rgba(13, 194, 104, 0.2)",
    },
    iconText: {
        fontSize: 24,
    },
    headerInfo: {
        gap: 4,
        flex: 1,
    },
    subtitle: {
        color: "#797A80",
        fontSize: 12,
        lineHeight: 16,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    subtitleCompleted: {
        color: "rgba(13, 194, 104, 0.8)",
    },
    description: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        lineHeight: 20,
    },
    reward: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
        lineHeight: 24,
        textAlign: "right",
    },
    rewardCompleted: {
        color: "#0DC268",
    },

    // Divider
    divider: {
        height: 1,
        backgroundColor: "rgba(43, 43, 44, 1)",
    },
    dividerCompleted: {
        backgroundColor: "rgba(13, 194, 104, 0.1)",
    },

    // Target Section
    targetSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 4,
    },
    targetLabel: {
        color: "#797A80",
        fontSize: 14,
        lineHeight: 18,
    },
    targetValue: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
        lineHeight: 18,
    },

    // Progress
    progressSection: {
        gap: 8,
    },
    progressHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    progressLabel: {
        color: "#797A80",
        fontSize: 12,
        lineHeight: 16,
    },
    progressLabelCompleted: {
        color: "rgba(13, 194, 104, 0.8)",
    },
    progressValue: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
        lineHeight: 18,
    },
    progressBarContainer: {
        height: 8,
        borderRadius: 12,
        backgroundColor: "rgba(43, 43, 44, 1)",
        overflow: "hidden",
    },
    progressBarFill: {
        height: "100%",
        backgroundColor: "#20C774",
        borderRadius: 12,
        minWidth: 2, // Ensure some visual feedback even for small progress
    },
    progressBarFillCompleted: {
        backgroundColor: "#0DC268",
    },
    completionStatus: {
        color: "#BFC1C5",
        fontSize: 12,
        lineHeight: 16,
        textAlign: "center",
        fontStyle: "italic",
    },

    // Employees Section
    employeesSection: {
        gap: 8,
    },
    employeesLabel: {
        color: "#797A80",
        fontSize: 12,
        lineHeight: 16,
    },
    employeesList: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    employeeBadge: {
        backgroundColor: "rgba(13, 194, 104, 0.15)",
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    employeeBadgeText: {
        color: "#0DC268",
        fontSize: 12,
        fontWeight: "500",
        lineHeight: 16,
    },
});
