import React, { useState, useMemo, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import Svg, { Path } from "react-native-svg";

import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";
import { useWaiter } from "@/src/contexts/WaiterProvider";
import { useAuth } from "@/src/contexts/AuthContext";

// ============================================================================
// Component
// ============================================================================

export default function WaiterMotivationDetail() {
    const router = useRouter();
    const { id, type } = useLocalSearchParams<{
        id: string;
        type: "quest" | "task";
    }>();
    const { tasks, quests, completeTaskWrapper, fetchTasks } = useWaiter();
    const { user, selectedLocation } = useAuth();

    const isTask = type === "task";
    const taskId = Array.isArray(id) ? Number(id[0]) : Number(id);
    const questId = Array.isArray(id) ? id[0] : id;

    const [completing, setCompleting] = useState(false);

    // ── Derived data ────────────────────────────────────────────────────────
    const selectedTask = useMemo(
        () => (isTask ? (tasks?.find((t) => t.id === taskId) ?? null) : null),
        [isTask, tasks, taskId],
    );

    const selectedQuest = useMemo(
        () =>
            !isTask ? (quests?.find((q) => q.id === questId) ?? null) : null,
        [isTask, quests, questId],
    );

    // ── Complete task ───────────────────────────────────────────────────────
    const handleCompleteTask = useCallback(async () => {
        if (!selectedTask) return;

        setCompleting(true);
        try {
            await completeTaskWrapper(Number(selectedTask.id));
            const today = new Date().toLocaleDateString("ru-RU", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            });
            await fetchTasks({
                user_id: Number(user?.id),
                date: today,
                organization_id: selectedLocation,
            });
            router.push("waiter/motivation");
        } catch (err) {
            console.error("Error completing task:", err);
            setCompleting(false);
        }
    }, [
        selectedTask,
        completeTaskWrapper,
        fetchTasks,
        user?.id,
        selectedLocation,
        router,
    ]);

    // ── Header ──────────────────────────────────────────────────────────────
    const renderHeader = () => {
        const title = isTask
            ? (selectedTask?.title ?? "Задача")
            : (selectedQuest?.title ?? "Квест");

        return (
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.push("waiter/motivation")}
                    style={styles.backButton}
                    activeOpacity={0.7}
                >
                    <Svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                        <Path
                            d="M9.58992 14.8405C9.42578 14.6765 9.33346 14.4541 9.33325 14.2221V13.7788C9.33594 13.5473 9.42789 13.3258 9.58992 13.1605L15.5866 7.17548C15.6961 7.06505 15.8452 7.00293 16.0008 7.00293C16.1563 7.00293 16.3054 7.06505 16.4149 7.17548L17.2433 8.00381C17.353 8.11134 17.4148 8.25851 17.4148 8.41215C17.4148 8.56578 17.353 8.71295 17.2433 8.82048L12.0516 14.0005L17.2433 19.1805C17.3537 19.29 17.4158 19.4391 17.4158 19.5946C17.4158 19.7502 17.3537 19.8993 17.2433 20.0088L16.4149 20.8255C16.3054 20.9359 16.1563 20.998 16.0008 20.998C15.8452 20.998 15.6961 20.9359 15.5866 20.8255L9.58992 14.8405Z"
                            fill="white"
                        />
                    </Svg>
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>
                    {title}
                </Text>
                <View style={styles.headerSpacer} />
            </View>
        );
    };

    // ── Task content ────────────────────────────────────────────────────────
    const renderTaskContent = () => {
        if (!selectedTask) {
            return (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Задача не найдена</Text>
                </View>
            );
        }

        const isCompleted = selectedTask.is_completed;

        return (
            <View style={styles.contentContainer}>
                {/* Description */}
                <View style={styles.card}>
                    <Text style={styles.cardLabel}>Описание</Text>
                    <Text style={styles.cardText}>
                        {selectedTask.description || "Описание отсутствует"}
                    </Text>
                </View>

                {/* Progress */}
                <View style={styles.progressSection}>
                    <View style={styles.progressLabelRow}>
                        <Text style={styles.progressLabel}>Прогресс</Text>
                        <Text style={styles.progressValue}>
                            {isCompleted ? "100%" : "0%"}
                        </Text>
                    </View>
                    <View style={styles.progressTrack}>
                        <View
                            style={[
                                styles.progressFill,
                                { width: isCompleted ? "100%" : "0%" },
                                isCompleted && styles.progressFillCompleted,
                            ]}
                        />
                    </View>
                </View>

                {/* Info rows */}
                <View style={styles.card}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Статус</Text>
                        <Text
                            style={[
                                styles.infoValue,
                                isCompleted && styles.infoValueCompleted,
                            ]}
                        >
                            {isCompleted ? "Выполнена" : "В процессе"}
                        </Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Сотрудник</Text>
                        <Text style={styles.infoValue}>
                            {selectedTask.employee_name}
                        </Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Срок</Text>
                        <Text
                            style={[
                                styles.infoValue,
                                !isCompleted && styles.dueDateActive,
                            ]}
                        >
                            {selectedTask.due_date}
                        </Text>
                    </View>
                </View>
            </View>
        );
    };

    // ── Quest content (read-only) ───────────────────────────────────────────
    const renderQuestContent = () => {
        if (!selectedQuest) {
            return (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Квест не найден</Text>
                </View>
            );
        }

        const isCompleted =
            selectedQuest.completed ||
            selectedQuest.current >= selectedQuest.target;
        const progress = Math.min(
            (selectedQuest.current / selectedQuest.target) * 100,
            100,
        );

        return (
            <View style={styles.contentContainer}>
                {/* Description */}
                <View style={styles.card}>
                    <Text style={styles.cardLabel}>Описание</Text>
                    <Text style={styles.cardText}>
                        {selectedQuest.description || "Описание отсутствует"}
                    </Text>
                </View>

                {/* Progress */}
                <View style={styles.progressSection}>
                    <View style={styles.progressLabelRow}>
                        <Text style={styles.progressLabel}>Прогресс</Text>
                        <Text style={styles.progressValue}>
                            {selectedQuest.current}/{selectedQuest.target}{" "}
                            {selectedQuest.unit}
                        </Text>
                    </View>
                    <View style={styles.progressTrack}>
                        <View
                            style={[
                                styles.progressFill,
                                { width: `${progress}%` },
                                isCompleted && styles.progressFillCompleted,
                            ]}
                        />
                    </View>
                </View>

                {/* Info rows */}
                <View style={styles.card}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Статус</Text>
                        <Text
                            style={[
                                styles.infoValue,
                                isCompleted && styles.infoValueCompleted,
                            ]}
                        >
                            {isCompleted ? "Выполнен" : "В процессе"}
                        </Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Награда</Text>
                        <Text style={styles.infoValueReward}>
                            {selectedQuest.reward.toLocaleString()} тг
                        </Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Цель</Text>
                        <Text style={styles.infoValue}>
                            {selectedQuest.target} {selectedQuest.unit}
                        </Text>
                    </View>
                </View>
            </View>
        );
    };

    // ── Complete button (task only) ─────────────────────────────────────────
    const renderCompleteButton = () => {
        if (!isTask || !selectedTask || selectedTask.is_completed) return null;

        return (
            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={[
                        styles.completeButton,
                        completing && styles.completeButtonDisabled,
                    ]}
                    onPress={handleCompleteTask}
                    activeOpacity={0.8}
                    disabled={completing}
                >
                    {completing ? (
                        <ActivityIndicator color="#fff" size="small" />
                    ) : (
                        <Text style={styles.completeButtonText}>
                            Завершить задачу
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        );
    };

    // ── Main render ─────────────────────────────────────────────────────────
    return (
        <SafeAreaView style={[styles.container, backgroundsStyles.generalBg]}>
            <StatusBar
                barStyle="light-content"
                backgroundColor="rgba(25, 25, 26, 1)"
            />
            {renderHeader()}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {isTask ? renderTaskContent() : renderQuestContent()}
            </ScrollView>
            {renderCompleteButton()}
        </SafeAreaView>
    );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollView: { flex: 1 },
    scrollContent: { paddingBottom: 128 },

    // Header
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: 56,
        paddingHorizontal: 16,
        backgroundColor: "rgba(25, 25, 26, 1)",
    },
    backButton: {
        width: 28,
        height: 28,
        alignItems: "center",
        justifyContent: "center",
    },
    headerTitle: {
        color: "#FFFFFF",
        fontSize: 20,
        fontWeight: "600",
        lineHeight: 28,
        letterSpacing: -0.24,
        flex: 1,
        textAlign: "center",
        marginHorizontal: 16,
    },
    headerSpacer: { width: 28, height: 28 },

    // Content
    contentContainer: {
        paddingHorizontal: 16,
        paddingTop: 16,
        gap: 16,
    },

    // Card
    card: {
        backgroundColor: "rgba(35, 35, 36, 1)",
        borderRadius: 16,
        padding: 16,
        gap: 12,
    },
    cardLabel: {
        color: "#797A80",
        fontSize: 12,
        fontWeight: "500",
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    cardText: {
        color: "#fff",
        fontSize: 15,
        lineHeight: 22,
    },

    // Info rows
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    infoLabel: {
        color: "#797A80",
        fontSize: 14,
        lineHeight: 18,
    },
    infoValue: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "500",
        lineHeight: 18,
    },
    infoValueCompleted: {
        color: "#0DC268",
    },
    infoValueReward: {
        color: "#FFC800",
        fontSize: 16,
        fontWeight: "700",
    },
    dueDateActive: {
        color: "#F5A623",
    },
    divider: {
        height: 1,
        backgroundColor: "rgba(43, 43, 44, 1)",
    },

    // Progress
    progressSection: { gap: 8 },
    progressLabelRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 4,
    },
    progressLabel: { color: "#797A80", fontSize: 13 },
    progressValue: { color: "#fff", fontSize: 13, fontWeight: "600" },
    progressTrack: {
        height: 8,
        backgroundColor: "rgba(43, 43, 44, 1)",
        borderRadius: 4,
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        backgroundColor: "rgba(255,255,255,0.3)",
        borderRadius: 4,
    },
    progressFillCompleted: {
        backgroundColor: "#20C774",
    },

    // Empty
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 60,
    },
    emptyText: {
        color: "#797A80",
        fontSize: 16,
    },

    // Complete button
    bottomBar: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 16,
        paddingBottom: 36,
        paddingTop: 12,
        backgroundColor: "rgba(25, 25, 26, 0.95)",
    },
    completeButton: {
        backgroundColor: "#34C759",
        borderRadius: 16,
        height: 56,
        alignItems: "center",
        justifyContent: "center",
    },
    completeButtonDisabled: {
        opacity: 0.6,
    },
    completeButtonText: {
        color: "#fff",
        fontSize: 17,
        fontWeight: "600",
        letterSpacing: -0.2,
    },
});
