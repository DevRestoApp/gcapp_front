import React from "react";
import { View, Text, StyleSheet } from "react-native";

export interface Task {
    id: number | string;
    title: string;
    description: string;
    user_id: number;
    user_name: string;
    organization_id: number;
    is_completed: boolean;
    due_date: string;
    created_at: string;
}

interface TaskCardProps {
    task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
    const isCompleted = task.is_completed;

    return (
        <View style={[styles.card, isCompleted && styles.cardCompleted]}>
            {/* Header Row */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View
                        style={[
                            styles.iconContainer,
                            isCompleted && styles.iconContainerCompleted,
                        ]}
                    >
                        <Text style={styles.iconText}>
                            {isCompleted ? "✓" : "📋"}
                        </Text>
                    </View>
                    <View style={styles.headerInfo}>
                        <Text
                            style={[
                                styles.title,
                                isCompleted && styles.titleCompleted,
                            ]}
                        >
                            {task.title}
                        </Text>
                        <Text style={styles.description} numberOfLines={2}>
                            {task.description}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Divider */}
            <View
                style={[styles.divider, isCompleted && styles.dividerCompleted]}
            />

            {/* Meta info */}
            <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Исполнитель</Text>
                <Text style={styles.metaValue}>{task.user_name}</Text>
            </View>
            <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Срок</Text>
                <Text
                    style={[
                        styles.metaValue,
                        !isCompleted && styles.dueDateActive,
                    ]}
                >
                    {task.due_date}
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
                        Статус
                    </Text>
                    <Text
                        style={[
                            styles.progressValue,
                            isCompleted && styles.progressValueCompleted,
                        ]}
                    >
                        {isCompleted ? "Выполнено" : "В процессе"}
                    </Text>
                </View>
                <View style={styles.progressBarContainer}>
                    <View
                        style={[
                            styles.progressBarFill,
                            { width: isCompleted ? "100%" : "0%" },
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
    iconContainerCompleted: {
        backgroundColor: "rgba(13, 194, 104, 0.2)",
    },
    iconText: {
        fontSize: 22,
    },
    headerInfo: {
        gap: 4,
        flex: 1,
    },
    title: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        lineHeight: 20,
    },
    titleCompleted: {
        color: "rgba(255, 255, 255, 0.75)",
    },
    description: {
        color: "#797A80",
        fontSize: 12,
        lineHeight: 16,
    },

    // Divider
    divider: {
        height: 1,
        backgroundColor: "rgba(43, 43, 44, 1)",
    },
    dividerCompleted: {
        backgroundColor: "rgba(255, 255, 255, 0.03)",
    },

    // Meta
    metaRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    metaLabel: {
        color: "#797A80",
        fontSize: 12,
        lineHeight: 16,
    },
    metaValue: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "500",
        lineHeight: 16,
    },
    dueDateActive: {
        color: "#F5A623",
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
        color: "#797A80",
        fontSize: 12,
        fontWeight: "500",
        lineHeight: 16,
    },
    progressValueCompleted: {
        color: "#0DC268",
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
