import React from "react";
import { View, Text, StyleSheet } from "react-native";

export interface Quest {
    id: string;
    title: string;
    description: string;
    reward: number;
    current: number;
    target: number;
    unit: string; // e.g., "десерт", "стейк", "столов"
    completed: boolean;
}

interface QuestCardProps {
    quest: Quest;
}

export default function QuestCard({ quest }: QuestCardProps) {
    const getProgressPercentage = () => {
        return Math.min((quest.current / quest.target) * 100, 100);
    };

    const isCompleted = quest.completed || quest.current >= quest.target;

    return (
        <View style={[styles.card, isCompleted && styles.cardCompleted]}>
            {/* Header Row */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={styles.iconContainer}>
                        <Text style={styles.iconText}>
                            {isCompleted ? "✓" : "🎯"}
                        </Text>
                    </View>
                    <View style={styles.headerInfo}>
                        <Text
                            style={[
                                styles.subtitle,
                                isCompleted && styles.subtitleCompleted,
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
                        isCompleted && styles.rewardCompleted,
                    ]}
                >
                    {quest.reward.toLocaleString()} тг
                </Text>
            </View>

            {/* Divider */}
            <View
                style={[styles.divider, isCompleted && styles.dividerCompleted]}
            />

            {/* Progress */}
            <View style={styles.progressSection}>
                <View style={styles.progressHeader}>
                    <Text
                        style={[
                            styles.progressLabel,
                            isCompleted && styles.progressLabelCompleted,
                        ]}
                    >
                        Прогресс
                    </Text>
                    <Text style={styles.progressValue}>
                        {quest.current}/{quest.target} {quest.unit}
                    </Text>
                </View>
                <View style={styles.progressBarContainer}>
                    <View
                        style={[
                            styles.progressBarFill,
                            { width: `${getProgressPercentage()}%` },
                        ]}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "rgba(35, 35, 36, 1)",
        borderRadius: 20,
        padding: 12,
        gap: 16,
    },
    cardCompleted: {
        backgroundColor: "rgba(13, 194, 104, 0.08)",
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
        gap: 8,
        flex: 1,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        justifyContent: "center",
        alignItems: "center",
    },
    iconText: {
        fontSize: 24,
    },
    headerInfo: {
        gap: 4,
        flex: 1,
    },
    subtitle: {
        color: "#fff",
        fontSize: 12,
        lineHeight: 16,
    },
    subtitleCompleted: {
        color: "rgba(255, 255, 255, 0.75)",
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
        backgroundColor: "rgba(255, 255, 255, 0.03)",
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
        color: "rgba(255, 255, 255, 0.75)",
    },
    progressValue: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "500",
        lineHeight: 16,
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
    },
});
