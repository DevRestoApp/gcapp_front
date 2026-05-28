import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    StatusBar,
    Alert,
    FlatList,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import SalaryQuestCard, {
    SalaryQuest,
} from "@/src/client/components/waiter/SalaryQuestCard";
import { ReportCalendar } from "@/src/client/components/reports/Calendar";
import Loading from "@/src/client/components/Loading";
import { useWaiter } from "@/src/contexts/WaiterProvider";
import { useAuth } from "@/src/contexts/AuthContext";

import { loadingStyles } from "@/src/client/styles/ui/loading.styles";
import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";

// ============================================================================
// Helpers
// ============================================================================

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

    const waiter_id = user.id === 10 ? 32256 : user.id;

    const [selectedDate, setSelectedDate] = useState<string>(() =>
        formatDate(new Date()),
    );
    const [showCalendar, setShowCalendar] = useState(false);
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
        loadData(selectedDate);
    }, []);

    const handleDateSelect = useCallback(
        (date: string) => {
            setSelectedDate(date);
            loadData(date);
        },
        [loadData],
    );

    // ── Render helpers ────────────────────────────────────────────────────────

    const renderEarningsSummary = () => {
        if (!salary) return null;

        return (
            <View style={styles.card}>
                {/* Breakdown */}
                <View style={styles.breakdown}>
                    <View style={styles.breakdownItem}>
                        <View style={styles.breakdownLeft}>
                            <Text style={styles.breakdownTitle}>Зарплата</Text>
                        </View>
                        <View style={styles.badgeDefault}>
                            <Text style={styles.badgeDefaultText}>
                                {salary.salary.toLocaleString()} тг
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

                <View style={styles.filtersContainer}>
                    <TouchableOpacity
                        style={styles.filterButton}
                        onPress={() => setShowCalendar(true)}
                    >
                        <Ionicons
                            name="calendar-outline"
                            size={20}
                            color="#FFFFFF"
                        />
                        <Text style={styles.filterText}>
                            {selectedDate || "Выбрать..."}
                        </Text>
                    </TouchableOpacity>
                </View>

                <ReportCalendar
                    visible={showCalendar}
                    onClose={() => setShowCalendar(false)}
                    onDateSelect={handleDateSelect}
                    initialDate={selectedDate}
                />

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

    filtersContainer: {
        flexDirection: "row",
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    filterButton: {
        flexDirection: "row",
        paddingHorizontal: 12,
        paddingVertical: 12,
        alignItems: "center",
        gap: 4,
        borderRadius: 16,
        backgroundColor: "#1C1C1E",
    },
    filterText: {
        color: "#FFFFFF",
        fontSize: 16,
        lineHeight: 20,
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
