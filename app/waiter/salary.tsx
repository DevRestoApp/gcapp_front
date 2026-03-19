import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    StatusBar,
    Alert,
    FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Calendar from "@/src/client/components/Calendar";
import { Day } from "@/src/client/types/waiter";
import SalaryQuestCard, {
    SalaryQuest,
} from "@/src/client/components/waiter/SalaryQuestCard";
import Loading from "@/src/client/components/Loading";
import { useWaiter } from "@/src/contexts/WaiterProvider";
import { useAuth } from "@/src/contexts/AuthContext";

import { loadingStyles } from "@/src/client/styles/ui/loading.styles";
import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";

// ============================================================================
// Helpers
// ============================================================================

const buildWeekDays = (): Day[] => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() - (6 - i));
        return {
            date: date.getDate().toString(),
            day: date.toLocaleDateString("ru-RU", { weekday: "short" }),
            active: i === 6,
        };
    });
};

const formatDate = (date: Date): string =>
    date.toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

// ============================================================================
// Component
// ============================================================================

export default function SalaryScreen() {
    const { user, selectedLocation } = useAuth();
    const { salary, fetchSalary } = useWaiter();

    const waiter_id = user.id;

    const [days, setDays] = useState<Day[]>(() => buildWeekDays());
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const loadData = useCallback(
        async (date: string) => {
            setLoading(true);
            try {
                await fetchSalary(waiter_id, {
                    date,
                    ...(selectedLocation
                        ? { organization_id: selectedLocation }
                        : {}),
                });
            } catch (error) {
                console.error("Error fetching salary:", error);
                Alert.alert("Ошибка", "Не удалось загрузить данные");
            } finally {
                setLoading(false);
            }
        },
        [waiter_id, selectedLocation, fetchSalary],
    );

    useEffect(() => {
        const todayStr = formatDate(new Date());
        setSelectedDate(todayStr);
        loadData(todayStr);
    }, []);

    const handleDayPress = useCallback(
        (index: number) => {
            setDays((prev) =>
                prev.map((day, i) => ({ ...day, active: i === index })),
            );

            const today = new Date();
            const pressed = new Date(today);
            pressed.setDate(today.getDate() - (6 - index));

            const dateStr = formatDate(pressed);
            setSelectedDate(dateStr);
            loadData(dateStr);
        },
        [loadData],
    );

    // ── Render helpers ────────────────────────────────────────────────────────

    const renderEarningsSummary = () => {
        if (!salary) return null;

        return (
            <View style={styles.card}>
                {/* Header Row */}
                <View style={styles.cardHeader}>
                    <View style={styles.cardHeaderLeft}>
                        <View style={styles.iconContainer}>
                            <Text style={styles.iconText}>✓</Text>
                        </View>
                        <View style={styles.cardHeaderInfo}>
                            <Text style={styles.cardSubtitle}>
                                Успешно завершен
                            </Text>
                            <Text style={styles.cardTitle}>
                                {salary.tablesCompleted} столов
                            </Text>
                        </View>
                    </View>
                    <Text style={styles.cardAmount}>
                        {salary.totalRevenue.toLocaleString()} тг
                    </Text>
                </View>

                <View style={styles.divider} />

                {/* Breakdown */}
                <View style={styles.breakdown}>
                    <View style={styles.breakdownItem}>
                        <View style={styles.breakdownLeft}>
                            <Text style={styles.breakdownTitle}>Зарплата</Text>
                            <Text style={styles.breakdownSubtitle}>
                                {salary.salaryPercentage}% общий кассы
                            </Text>
                        </View>
                        <View style={styles.badgeDefault}>
                            <Text style={styles.badgeDefaultText}>
                                {salary.salary.toLocaleString()} тг
                            </Text>
                        </View>
                    </View>

                    <View style={styles.breakdownItemSimple}>
                        <Text style={styles.breakdownLabel}>Бонусы</Text>
                        <View style={styles.badgeSuccess}>
                            <Text style={styles.badgeSuccessText}>
                                {salary.bonuses.toLocaleString()} тг
                            </Text>
                        </View>
                    </View>

                    <View style={styles.breakdownItem}>
                        <View style={styles.breakdownLeft}>
                            <Text style={styles.breakdownTitle}>Квест</Text>
                            <Text style={styles.breakdownSubtitle}>
                                {salary.questDescription}
                            </Text>
                        </View>
                        <View style={styles.badgeInfo}>
                            <Text style={styles.badgeInfoText}>
                                {salary.questBonus.toLocaleString()} тг
                            </Text>
                        </View>
                    </View>

                    <View style={styles.breakdownItemSimple}>
                        <Text style={styles.breakdownLabel}>Штрафы</Text>
                        <View style={styles.badgeDanger}>
                            <Text style={styles.badgeDangerText}>
                                {salary.penalties.toLocaleString()} тг
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.divider} />

                <Text style={styles.total}>
                    Зарплата: {salary.totalEarnings.toLocaleString()} тг
                </Text>
            </View>
        );
    };

    const renderQuestItem = useCallback(
        ({ item }: { item: SalaryQuest }) => <SalaryQuestCard quest={item} />,
        [],
    );

    const questKeyExtractor = useCallback((item: SalaryQuest) => item.id, []);
    const ItemSeparator = useCallback(
        () => <View style={styles.itemSeparator} />,
        [],
    );

    // quests живут внутри salary — отдельный fetchQuest не нужен
    const quests: SalaryQuest[] = salary?.quests ?? [];

    return (
        <SafeAreaView style={[styles.container, backgroundsStyles.generalBg]}>
            <StatusBar
                barStyle="light-content"
                backgroundColor="rgba(25, 25, 26, 1)"
            />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Зарплата</Text>
                </View>

                <Calendar days={days} onDayPress={handleDayPress} />

                <View style={styles.content}>
                    <Text style={styles.dateTitle}>{selectedDate}</Text>

                    {loading ? (
                        <View style={loadingStyles.loadingContainer}>
                            <Loading text="Загрузка данных" />
                        </View>
                    ) : (
                        <>
                            {renderEarningsSummary()}

                            {quests.length > 0 && (
                                <>
                                    <View style={styles.sectionHeader}>
                                        <Text style={styles.sectionTitle}>
                                            Квесты
                                        </Text>
                                    </View>
                                    <FlatList
                                        data={quests}
                                        renderItem={renderQuestItem}
                                        keyExtractor={questKeyExtractor}
                                        ItemSeparatorComponent={ItemSeparator}
                                        scrollEnabled={false}
                                    />
                                </>
                            )}

                            {!salary && (
                                <View style={styles.emptyState}>
                                    <Text style={styles.emptyIcon}>💰</Text>
                                    <Text style={styles.emptyText}>
                                        Отсутствует информация по зарплате
                                    </Text>
                                </View>
                            )}
                        </>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollView: { flex: 1 },
    scrollContent: { paddingBottom: 114 },

    header: {
        paddingHorizontal: 16,
        height: 56,
        justifyContent: "center",
    },
    headerTitle: {
        color: "#fff",
        fontSize: 32,
        fontWeight: "600",
        letterSpacing: -0.24,
    },

    content: {
        paddingHorizontal: 16,
        gap: 20,
    },
    dateTitle: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
        lineHeight: 28,
    },

    // Card
    card: {
        backgroundColor: "rgba(35, 35, 36, 1)",
        borderRadius: 20,
        padding: 12,
        gap: 16,
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    cardHeaderLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        flex: 1,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "rgba(32, 199, 116, 0.2)",
        justifyContent: "center",
        alignItems: "center",
    },
    iconText: { fontSize: 24, color: "#20C774" },
    cardHeaderInfo: { gap: 4, flex: 1 },
    cardSubtitle: {
        color: "rgba(255, 255, 255, 0.75)",
        fontSize: 12,
        lineHeight: 16,
    },
    cardTitle: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
        lineHeight: 24,
    },
    cardAmount: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
        lineHeight: 24,
    },

    divider: {
        height: 1,
        backgroundColor: "rgba(43, 43, 44, 1)",
    },

    breakdown: { gap: 12 },
    breakdownItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    breakdownLeft: { flex: 1, gap: 2 },
    breakdownTitle: { color: "#fff", fontSize: 14, lineHeight: 18 },
    breakdownSubtitle: {
        color: "rgba(255, 255, 255, 0.75)",
        fontSize: 12,
        lineHeight: 16,
    },
    breakdownItemSimple: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    breakdownLabel: {
        color: "rgba(255, 255, 255, 0.75)",
        fontSize: 14,
        lineHeight: 18,
    },

    // Badges
    badgeDefault: {
        backgroundColor: "rgba(43, 43, 44, 1)",
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 12,
    },
    badgeDefaultText: { color: "#fff", fontSize: 14, lineHeight: 18 },
    badgeSuccess: {
        backgroundColor: "rgba(13, 194, 104, 0.08)",
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 12,
    },
    badgeSuccessText: { color: "#20C774", fontSize: 14, lineHeight: 18 },
    badgeInfo: {
        backgroundColor: "rgba(5, 72, 255, 0.06)",
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 12,
    },
    badgeInfoText: { color: "#3880FC", fontSize: 14, lineHeight: 18 },
    badgeDanger: {
        backgroundColor: "rgba(237, 10, 52, 0.08)",
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 12,
    },
    badgeDangerText: { color: "#EE1E44", fontSize: 14, lineHeight: 18 },

    total: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
        lineHeight: 24,
    },

    sectionHeader: { marginTop: 4 },
    sectionTitle: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
        lineHeight: 28,
    },

    itemSeparator: { height: 12 },
    emptyState: {
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 60,
        gap: 12,
    },
    emptyIcon: { fontSize: 48, opacity: 0.3 },
    emptyText: {
        color: "rgba(255, 255, 255, 0.75)",
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
    },
});
