import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import Svg, { Path } from "react-native-svg";

import QuestCardEmployees from "@/src/client/components/ceo/QuestCardEmployees";
import EmployeeCardExtended from "@/src/client/components/ceo/EmployeeCardExtended";
import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";
import { useManager } from "@/src/contexts/ManagerProvider";
import Loading from "@/src/client/components/Loading";
import type { QuestDetail, EmployeeProgress } from "@/src/server/types/ceo";
import type { Tasks } from "@/src/server/types/ceo"; // adjust path if needed

// ============================================================================
// Component
// ============================================================================

export default function QuestDetailScreen() {
    const router = useRouter();
    const { id, type } = useLocalSearchParams<{
        id: string;
        type: "quest" | "task";
    }>();
    const { fetchQuestDetailWrapper, queryInputs, tasks, completeTaskWrapper } =
        useManager();

    const isTask = type === "task";
    const questId = Array.isArray(id) ? id[0] : id;
    const taskId = Array.isArray(id) ? Number(id[0]) : Number(id);

    // ── Quest state ───────────────────────────────────────────────────────────
    const [quest, setQuest] = useState<QuestDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // ── Task state ────────────────────────────────────────────────────────────
    const [completing, setCompleting] = useState(false);

    // ── Derived: selected task from context ───────────────────────────────────
    const selectedTask: Tasks | null = useMemo(
        () => (isTask ? (tasks?.find((t) => t.id === taskId) ?? null) : null),
        [isTask, tasks, taskId],
    );

    // ── Fetch quest detail (only when type=quest) ─────────────────────────────
    const loadQuestDetail = useCallback(async () => {
        if (isTask || !questId) return;

        setLoading(true);
        setError(null);
        try {
            const data = await fetchQuestDetailWrapper(Number(questId), {
                organization_id: queryInputs.organization_id
                    ? Number(queryInputs.organization_id)
                    : undefined,
            });
            setQuest(data);
        } catch (err: any) {
            console.error("Error fetching quest detail:", err);
            setError(err?.message ?? "Не удалось загрузить квест");
            Alert.alert("Ошибка", "Не удалось загрузить данные квеста", [
                { text: "OK", onPress: () => router.back() },
            ]);
        } finally {
            setLoading(false);
        }
    }, [questId, fetchQuestDetailWrapper, queryInputs.organization_id, isTask]);

    useEffect(() => {
        if (isTask) {
            // tasks come from context — no async fetch needed
            setLoading(false);
        } else {
            loadQuestDetail();
        }
    }, [isTask, loadQuestDetail]);

    // ── Complete task handler ─────────────────────────────────────────────────
    const handleCompleteTask = useCallback(async () => {
        if (!selectedTask) return;

        setCompleting(true);
        try {
            await completeTaskWrapper(selectedTask.id);
        } catch (err: any) {
            console.error("Error completing task:", err);
        } finally {
            setCompleting(false);
            router.push(`/manager/motivation/`);
        }
    }, [selectedTask, completeTaskWrapper, router]);

    // ── Sorted leaderboard ────────────────────────────────────────────────────
    const sortedProgress = useMemo(
        () =>
            quest
                ? [...quest.employeeProgress].sort((a, b) => a.rank - b.rank)
                : [],
        [quest],
    );

    // ── Helpers ───────────────────────────────────────────────────────────────
    const getRankIcon = (rank: number): string => {
        switch (rank) {
            case 1:
                return "🥇";
            case 2:
                return "🥈";
            case 3:
                return "🥉";
            default:
                return `#${rank}`;
        }
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "—";
        const d = new Date(dateStr);
        return d.toLocaleDateString("ru-RU", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    // ── Render: header ────────────────────────────────────────────────────────
    const renderHeader = () => {
        const title = isTask
            ? (selectedTask?.title ?? "Задача")
            : (quest?.title ?? "Квест");

        return (
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
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

    // ── Render: task content ──────────────────────────────────────────────────
    const renderTaskContent = () => {
        if (!selectedTask) {
            return (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Задача не найдена</Text>
                </View>
            );
        }

        const isCompleted = selectedTask.is_completed;

        const stats = [
            {
                icon: (
                    <Text style={styles.statIcon}>
                        {isCompleted ? "✅" : "⏳"}
                    </Text>
                ),
                label: "Статус:",
                value: isCompleted ? "Выполнена" : "В процессе",
            },
            {
                icon: <Text style={styles.statIcon}>👤</Text>,
                label: "Сотрудник:",
                value: selectedTask.employee_name,
            },
            {
                icon: <Text style={styles.statIcon}>📅</Text>,
                label: "Дедлайн:",
                value: selectedTask.due_date,
            },
            {
                icon: <Text style={styles.statIcon}>🗓</Text>,
                label: "Создана:",
                value: formatDate(selectedTask.created_at),
            },
        ];

        return (
            <View style={styles.taskContainer}>
                {/* Description card */}
                <View style={styles.taskDescriptionCard}>
                    <Text style={styles.taskDescriptionLabel}>Описание</Text>
                    <Text style={styles.taskDescriptionText}>
                        {selectedTask.description || "Описание отсутствует"}
                    </Text>
                </View>

                {/* Progress bar */}
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

                {/* Stats card */}
                <EmployeeCardExtended
                    name={selectedTask.employee_name}
                    role=""
                    stats={stats}
                />
            </View>
        );
    };

    // ── Render: quest employee item ───────────────────────────────────────────
    const renderEmployeeItem = useCallback(
        ({ item }: { item: EmployeeProgress }) => {
            const stats = [
                {
                    icon: <Text style={styles.statIcon}>🏆</Text>,
                    label: "Позиция:",
                    value: getRankIcon(item.rank),
                },
                {
                    icon: (
                        <Text style={styles.statIcon}>
                            {item.completed ? "✅" : "⏳"}
                        </Text>
                    ),
                    label: "Баллы:",
                    value: `${item.points.toLocaleString()} тг`,
                },
                {
                    icon: <Text style={styles.statIcon}>📊</Text>,
                    label: "Прогресс:",
                    value: `${item.progress}%`,
                },
                {
                    icon: (
                        <Text style={styles.statIcon}>
                            {item.completed ? "🎉" : "💪"}
                        </Text>
                    ),
                    label: "Статус:",
                    value: item.completed ? "Выполнен" : "В процессе",
                },
            ];

            return (
                <EmployeeCardExtended
                    name={item.employeeName}
                    role=""
                    stats={stats}
                />
            );
        },
        [],
    );

    const keyExtractor = useCallback(
        (item: EmployeeProgress) => `${questId}-${item.employeeId}`,
        [questId],
    );

    const ItemSeparator = useCallback(
        () => <View style={styles.itemSeparator} />,
        [],
    );

    const QuestListHeader = useCallback(() => {
        if (!quest) return null;
        return (
            <View style={styles.listHeader}>
                <QuestCardEmployees quest={quest} />
                <View style={styles.sectionSpacer} />
                <View style={styles.leaderboardHeader}>
                    <Text style={styles.leaderboardTitle}>Лидерборд 🏆</Text>
                    <Text style={styles.leaderboardSubtitle}>
                        {sortedProgress.length} участника
                    </Text>
                </View>
            </View>
        );
    }, [quest, sortedProgress.length]);

    // ── Render: bottom complete button (task only) ────────────────────────────
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
                            ✓ Завершить задачу
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        );
    };

    // ── States ────────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <SafeAreaView
                style={[styles.container, backgroundsStyles.generalBg]}
            >
                <StatusBar
                    barStyle="light-content"
                    backgroundColor="rgba(25, 25, 26, 1)"
                />
                {renderHeader()}
                <Loading text="Загрузка данных" />
            </SafeAreaView>
        );
    }

    if (!isTask && (error || !quest)) {
        return (
            <SafeAreaView
                style={[styles.container, backgroundsStyles.generalBg]}
            >
                <StatusBar
                    barStyle="light-content"
                    backgroundColor="rgba(25, 25, 26, 1)"
                />
                {renderHeader()}
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>
                        {error ?? "Квест не найден"}
                    </Text>
                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={loadQuestDetail}
                    >
                        <Text style={styles.retryButtonText}>
                            Попробовать снова
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    // ── Task screen ───────────────────────────────────────────────────────────
    if (isTask) {
        return (
            <SafeAreaView
                style={[styles.container, backgroundsStyles.generalBg]}
            >
                <StatusBar
                    barStyle="light-content"
                    backgroundColor="rgba(25, 25, 26, 1)"
                />
                {renderHeader()}
                <FlatList
                    data={[]}
                    renderItem={null}
                    ListHeaderComponent={
                        <View style={styles.listContent}>
                            {renderTaskContent()}
                        </View>
                    }
                    contentContainerStyle={styles.listContentPadding}
                    showsVerticalScrollIndicator={false}
                />
                {renderCompleteButton()}
            </SafeAreaView>
        );
    }

    // ── Quest screen ──────────────────────────────────────────────────────────
    return (
        <SafeAreaView style={[styles.container, backgroundsStyles.generalBg]}>
            <StatusBar
                barStyle="light-content"
                backgroundColor="rgba(25, 25, 26, 1)"
            />
            {renderHeader()}
            <FlatList
                data={sortedProgress}
                renderItem={renderEmployeeItem}
                keyExtractor={keyExtractor}
                ListHeaderComponent={QuestListHeader}
                ItemSeparatorComponent={ItemSeparator}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>
                            Нет данных по участникам
                        </Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
    container: { flex: 1 },

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

    // List
    listContent: { paddingHorizontal: 16, paddingBottom: 128 },
    listContentPadding: { paddingBottom: 128 },
    listHeader: { paddingBottom: 8 },
    sectionSpacer: { height: 32 },
    leaderboardHeader: { marginBottom: 16, gap: 4 },
    leaderboardTitle: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
        lineHeight: 28,
    },
    leaderboardSubtitle: { color: "#797A80", fontSize: 14, lineHeight: 18 },
    itemSeparator: { height: 16 },
    statIcon: { fontSize: 14 },

    // Error / empty
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 16,
        gap: 16,
    },
    errorText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
    },
    retryButton: {
        backgroundColor: "rgba(35, 35, 36, 1)",
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 20,
    },
    retryButtonText: { color: "#fff", fontSize: 16, fontWeight: "500" },
    emptyState: { paddingVertical: 40, alignItems: "center" },
    emptyText: { color: "rgba(255, 255, 255, 0.5)", fontSize: 16 },

    // Task layout
    taskContainer: { gap: 16, paddingTop: 16 },
    taskDescriptionCard: {
        backgroundColor: "rgba(35, 35, 36, 1)",
        borderRadius: 16,
        padding: 16,
        gap: 8,
    },
    taskDescriptionLabel: {
        color: "#797A80",
        fontSize: 12,
        fontWeight: "500",
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    taskDescriptionText: {
        color: "#fff",
        fontSize: 15,
        lineHeight: 22,
    },

    // Progress bar
    progressSection: { gap: 8 },
    progressLabelRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    progressLabel: { color: "#797A80", fontSize: 13 },
    progressValue: { color: "#fff", fontSize: 13, fontWeight: "600" },
    progressTrack: {
        height: 6,
        backgroundColor: "rgba(255,255,255,0.1)",
        borderRadius: 3,
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        backgroundColor: "rgba(255,255,255,0.3)",
        borderRadius: 3,
    },
    progressFillCompleted: {
        backgroundColor: "#34C759",
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
