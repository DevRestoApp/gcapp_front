import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import Svg, { Path } from "react-native-svg";

import QuestCardEmployees from "@/src/client/components/ceo/QuestCardEmployees";
import EmployeeCardExtended from "@/src/client/components/ceo/EmployeeCardExtended";
import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";
import { useCeo } from "@/src/contexts/CeoProvider";
import Loading from "@/src/client/components/Loading";
import type { QuestDetail, EmployeeProgress } from "@/src/server/types/ceo";

// ============================================================================
// Component
// ============================================================================

export default function QuestDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { fetchQuestDetailWrapper, queryInputs } = useCeo();

    const questId = Array.isArray(id) ? id[0] : id;

    const [quest, setQuest] = useState<QuestDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // ── Fetch quest detail ────────────────────────────────────────────────────

    const loadQuestDetail = useCallback(async () => {
        if (!questId) return;

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
    }, [questId, fetchQuestDetailWrapper, queryInputs.organization_id]);

    useEffect(() => {
        loadQuestDetail();
    }, [loadQuestDetail]);

    // ── employeeProgress уже приходит отсортированным по rank из API ─────────
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

    // ── Render helpers ────────────────────────────────────────────────────────

    const renderHeader = () => (
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
                {quest?.title ?? "Квест"}
            </Text>
            <View style={styles.headerSpacer} />
        </View>
    );

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

    const ListHeader = useCallback(() => {
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

    if (error || !quest) {
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
                ListHeaderComponent={ListHeader}
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
    listContent: { paddingHorizontal: 16, paddingBottom: 128 },
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
});
