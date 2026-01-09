import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    StatusBar,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Calendar from "@/src/client/components/Calendar";
import { Day } from "@/src/client/types/waiter";
import QuestCard, { Quest } from "@/src/client/components/waiter/QuestCard";
import Loading from "@/src/client/components/Loading";

import { loadingStyles } from "@/src/client/styles/ui/loading.styles";
import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";

interface MotivationScreenProps {
    waiterId?: string;
}

export default function MotivationScreen({
    waiterId = "waiter-123",
}: MotivationScreenProps) {
    const [days, setDays] = useState<Day[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>("");
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
                active: i === 6, // Last day (today) is active by default
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

        // Fetch quests for today
        fetchQuests(todayStr);
    }, []);

    // Fetch quests from database/API
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
            fetchQuests(dateStr);
        },
        [days, fetchQuests],
    );

    // Render header
    const renderHeader = () => (
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Мотивация</Text>
        </View>
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

    // Render loading state
    const renderLoadingState = () => (
        <View style={loadingStyles.loadingContainer}>
            <Loading text={"Загрузка квестов"} />
        </View>
    );

    // Render quest item
    const renderQuestItem = ({ item }: { item: Quest }) => (
        <QuestCard quest={item} />
    );

    // Key extractor for FlatList
    const keyExtractor = (item: Quest) => item.id;

    // Item separator
    const ItemSeparator = () => <View style={styles.itemSeparator} />;

    return (
        <SafeAreaView
            style={{ ...styles.container, ...backgroundsStyles.generalBg }}
        >
            <StatusBar
                barStyle="light-content"
                backgroundColor="rgba(25, 25, 26, 1)"
            />

            {renderHeader()}

            <Calendar days={days} onDayPress={handleDayPress} />

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
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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

    // List
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 170,
        flexGrow: 1,
    },
    sectionHeader: {
        marginBottom: 16,
    },
    sectionTitle: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
        lineHeight: 28,
    },
    itemSeparator: {
        height: 16,
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
