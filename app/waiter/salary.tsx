import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    StatusBar,
    ActivityIndicator,
    Alert,
    FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Calendar from "@/src/client/components/Calendar";
import { Day } from "@/src/client/types/waiter";
import QuestCard, { Quest } from "@/src/client/components/waiter/QuestCard";
import Loading from "@/src/client/components/Loading";

import { loadingStyles } from "@/src/client/styles/ui/loading.styles";

interface DailyEarnings {
    date: string;
    tablesCompleted: number;
    totalRevenue: number;
    salary: number;
    salaryPercentage: number;
    bonuses: number;
    questBonus: number;
    questDescription: string;
    penalties: number;
    totalEarnings: number;
}

interface QuestProgress {
    target: number;
    current: number;
    reward: number;
    description: string;
    isCompleted: boolean;
}

interface SalaryScreenProps {
    waiterId?: string;
}

export default function SalaryScreen({
    waiterId = "waiter-123",
}: SalaryScreenProps) {
    const [days, setDays] = useState<Day[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [dailyEarnings, setDailyEarnings] = useState<DailyEarnings | null>(
        null,
    );
    const [questProgress, setQuestProgress] = useState<QuestProgress | null>(
        null,
    );
    const [quests, setQuests] = useState<Quest[]>([]);
    const [loading, setLoading] = useState(false);

    // Initialize calendar days
    useEffect(() => {
        const today = new Date();
        const weekDays: Day[] = [];

        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() - (6 - i));

            weekDays.push({
                date: date.getDate().toString(),
                day: date.toLocaleDateString("ru-RU", { weekday: "short" }),
                active: i === 6, // Last day is active by default
            });
        }

        setDays(weekDays);

        // Set today's date as selected
        const todayStr = today.toLocaleDateString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
        setSelectedDate(todayStr);

        // Fetch data for today
        fetchDailyEarnings(todayStr);
    }, []);

    // Fetch daily earnings from database
    const fetchDailyEarnings = useCallback(
        async (date: string) => {
            setLoading(true);

            try {
                // Replace with your actual API endpoint
                // const response = await fetch(`/api/waiter/${waiterId}/earnings?date=${date}`);
                // const data = await response.json();

                // Simulated API response
                await new Promise((resolve) => setTimeout(resolve, 500));

                const mockData: DailyEarnings = {
                    date: date,
                    tablesCompleted: 39,
                    totalRevenue: 1000192,
                    salary: 58192,
                    salaryPercentage: 5,
                    bonuses: 5157,
                    questBonus: 15000,
                    questDescription: "Бонус определенный сумма",
                    penalties: 0,
                    totalEarnings: 78349,
                };

                const mockQuest: QuestProgress = {
                    target: 15,
                    current: 6,
                    reward: 15000,
                    description: "Квест на сегодня",
                    isCompleted: true,
                };

                setDailyEarnings(mockData);
                setQuestProgress(mockQuest);
            } catch (error) {
                console.error("Error fetching earnings:", error);
                Alert.alert("Ошибка", "Не удалось загрузить данные о зарплате");
            } finally {
                setLoading(false);
            }
        },
        [waiterId],
    );

    // Key extractor for FlatList
    const keyExtractor = (item: Quest) => item.id;

    // Item separator
    const ItemSeparator = () => <View style={styles.itemSeparator} />;

    const fetchQuests = useCallback(
        async (date: string) => {
            setLoading(true);

            try {
                // Replace with your actual API endpoint
                // const response = await fetch(`/api/waiter/${waiterId}/quests?date=${date}`);
                // const data = await response.json();

                // Simulated API response
                await new Promise((resolve) => setTimeout(resolve, 500));

                const mockQuests: Quest[] = [
                    {
                        id: "1",
                        title: "Квест на сегодня",
                        description: "Продай 15 десерт",
                        reward: 15000,
                        current: 3,
                        target: 15,
                        unit: "десерт",
                        completed: false,
                    },
                    {
                        id: "2",
                        title: "Квест на сегодня",
                        description: "Lorem Ipsum is simpl...",
                        reward: 15000,
                        current: 3,
                        target: 15,
                        unit: "десерт",
                        completed: false,
                    },
                    {
                        id: "3",
                        title: "Квест на сегодня",
                        description:
                            "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
                        reward: 15000,
                        current: 3,
                        target: 15,
                        unit: "десерт",
                        completed: false,
                    },
                    {
                        id: "4",
                        title: "Квест на сегодня",
                        description: "Продай 20 стейк",
                        reward: 5000,
                        current: 20,
                        target: 20,
                        unit: "стейк",
                        completed: true,
                    },
                ];

                setQuests(mockQuests);
            } catch (error) {
                console.error("Error fetching quests:", error);
                Alert.alert("Ошибка", "Не удалось загрузить квесты");
            } finally {
                setLoading(false);
            }
        },
        [waiterId],
    );

    // Handle day selection
    const handleDayPress = useCallback(
        (index: number) => {
            const newDays = days.map((day, i) => ({
                ...day,
                active: i === index,
            }));
            setDays(newDays);

            // Calculate the date for selected day
            const today = new Date();
            const selectedDay = new Date(today);
            selectedDay.setDate(today.getDate() - (6 - index));

            const dateStr = selectedDay.toLocaleDateString("ru-RU", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            });

            setSelectedDate(dateStr);
            fetchDailyEarnings(dateStr);
            fetchQuests(dateStr);
        },
        [days, fetchDailyEarnings, fetchQuests],
    );

    // Render header
    const renderHeader = () => (
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Зарплата</Text>
        </View>
    );

    // Render earnings summary card
    const renderEarningsSummary = () => {
        if (!dailyEarnings) return null;

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
                                {dailyEarnings.tablesCompleted} столов
                            </Text>
                        </View>
                    </View>
                    <Text style={styles.cardAmount}>
                        {dailyEarnings.totalRevenue.toLocaleString()} тг
                    </Text>
                </View>

                <View style={styles.divider} />

                {/* Breakdown */}
                <View style={styles.breakdown}>
                    {/* Salary */}
                    <View style={styles.breakdownItem}>
                        <View style={styles.breakdownLeft}>
                            <Text style={styles.breakdownTitle}>Зарплата</Text>
                            <Text style={styles.breakdownSubtitle}>
                                {dailyEarnings.salaryPercentage}% общий кассы
                            </Text>
                        </View>
                        <View style={styles.badgeDefault}>
                            <Text style={styles.badgeDefaultText}>
                                {dailyEarnings.salary.toLocaleString()} тг
                            </Text>
                        </View>
                    </View>

                    {/* Bonuses */}
                    <View style={styles.breakdownItemSimple}>
                        <Text style={styles.breakdownLabel}>Бонусы</Text>
                        <View style={styles.badgeSuccess}>
                            <Text style={styles.badgeSuccessText}>
                                {dailyEarnings.bonuses.toLocaleString()} тг
                            </Text>
                        </View>
                    </View>

                    {/* Quest */}
                    <View style={styles.breakdownItem}>
                        <View style={styles.breakdownLeft}>
                            <Text style={styles.breakdownTitle}>Квест</Text>
                            <Text style={styles.breakdownSubtitle}>
                                {dailyEarnings.questDescription}
                            </Text>
                        </View>
                        <View style={styles.badgeInfo}>
                            <Text style={styles.badgeInfoText}>
                                {dailyEarnings.questBonus.toLocaleString()} тг
                            </Text>
                        </View>
                    </View>

                    {/* Penalties */}
                    <View style={styles.breakdownItemSimple}>
                        <Text style={styles.breakdownLabel}>Штрафы</Text>
                        <View style={styles.badgeDanger}>
                            <Text style={styles.badgeDangerText}>
                                {dailyEarnings.penalties.toLocaleString()} тг
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.divider} />

                {/* Total */}
                <Text style={styles.total}>
                    Зарплата: {dailyEarnings.totalEarnings.toLocaleString()} тг
                </Text>
            </View>
        );
    };

    // Render motivation section
    const renderLoadingState = () => <Loading></Loading>;

    const renderQuestItem = ({ item }: { item: Quest }) => (
        <QuestCard quest={item} />
    );

    // Render section title
    const renderSectionTitle = () => (
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Сегодня</Text>
        </View>
    );

    // Render empty state
    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🎯</Text>
            <Text style={styles.emptyText}>Нет активных квестов</Text>
            <Text style={styles.emptySubtext}>
                Квесты появятся в начале рабочего дня
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                barStyle="light-content"
                backgroundColor="rgba(25, 25, 26, 1)"
            />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {renderHeader()}

                <Calendar days={days} onDayPress={handleDayPress} />

                <View style={styles.content}>
                    <Text style={styles.dateTitle}>{selectedDate}</Text>

                    {loading ? (
                        <View style={loadingStyles.loadingContainer}>
                            <ActivityIndicator size="large" color="#fff" />
                            <Text style={loadingStyles.loadingText}>
                                Загрузка данных...
                            </Text>
                        </View>
                    ) : (
                        <>
                            {renderEarningsSummary()}

                            {loading ? (
                                renderLoadingState()
                            ) : (
                                <FlatList
                                    data={quests}
                                    renderItem={renderQuestItem}
                                    keyExtractor={keyExtractor}
                                    ListHeaderComponent={renderSectionTitle}
                                    ListEmptyComponent={renderEmptyState}
                                    ItemSeparatorComponent={ItemSeparator}
                                    contentContainerStyle={styles.listContent}
                                    showsVerticalScrollIndicator={false}
                                />
                            )}
                        </>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgba(25, 25, 26, 1)",
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 114,
    },

    // Header
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

    // Content
    content: {
        paddingHorizontal: 16,
        gap: 28,
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
    iconText: {
        fontSize: 24,
        color: "#20C774",
    },
    cardHeaderInfo: {
        gap: 4,
        flex: 1,
    },
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

    // Divider
    divider: {
        height: 1,
        backgroundColor: "rgba(43, 43, 44, 1)",
    },

    // Breakdown
    breakdown: {
        gap: 12,
    },
    breakdownItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    breakdownLeft: {
        flex: 1,
        gap: 2,
    },
    breakdownTitle: {
        color: "#fff",
        fontSize: 14,
        lineHeight: 18,
    },
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
    badgeDefaultText: {
        color: "#fff",
        fontSize: 14,
        lineHeight: 18,
    },
    badgeSuccess: {
        backgroundColor: "rgba(13, 194, 104, 0.08)",
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 12,
    },
    badgeSuccessText: {
        color: "#20C774",
        fontSize: 14,
        lineHeight: 18,
    },
    badgeInfo: {
        backgroundColor: "rgba(5, 72, 255, 0.06)",
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 12,
    },
    badgeInfoText: {
        color: "#3880FC",
        fontSize: 14,
        lineHeight: 18,
    },
    badgeDanger: {
        backgroundColor: "rgba(237, 10, 52, 0.08)",
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 12,
    },
    badgeDangerText: {
        color: "#EE1E44",
        fontSize: 14,
        lineHeight: 18,
    },

    // Total
    total: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
        lineHeight: 24,
    },

    // Section
    section: {
        gap: 16,
    },
    sectionTitle: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
        lineHeight: 28,
    },
    sectionHeader: {
        marginBottom: 16,
    },

    // Quest Card
    questCard: {
        backgroundColor: "rgba(13, 194, 104, 0.08)",
        borderRadius: 20,
        padding: 12,
        gap: 16,
    },
    questHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    questHeaderLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        flex: 1,
    },
    questIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        justifyContent: "center",
        alignItems: "center",
    },
    questIconText: {
        fontSize: 24,
    },
    questHeaderInfo: {
        gap: 4,
        flex: 1,
    },
    questSubtitle: {
        color: "#fff",
        fontSize: 12,
        lineHeight: 16,
    },
    questTitle: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
        lineHeight: 24,
    },
    questReward: {
        color: "#0DC268",
        fontSize: 20,
        fontWeight: "bold",
        lineHeight: 24,
    },
    questDivider: {
        height: 1,
        backgroundColor: "rgba(255, 255, 255, 0.05)",
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
        color: "rgba(255, 255, 255, 0.75)",
        fontSize: 12,
        lineHeight: 16,
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
    itemSeparator: {
        height: 16,
    },
    // List
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 170,
        flexGrow: 1,
    },

    // Empty state
    emptyState: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 80,
        gap: 12,
    },
    emptyIcon: {
        fontSize: 64,
        opacity: 0.3,
    },
    emptyText: {
        color: "rgba(255, 255, 255, 0.75)",
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
    },
    emptySubtext: {
        color: "rgba(255, 255, 255, 0.5)",
        fontSize: 14,
        textAlign: "center",
        lineHeight: 20,
    },
});
