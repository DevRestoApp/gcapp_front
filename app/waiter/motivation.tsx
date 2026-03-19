import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    StatusBar,
    Alert,
    ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Calendar from "@/src/client/components/Calendar";
import { Day } from "@/src/client/types/waiter";
import QuestCard, { Quest } from "@/src/client/components/waiter/QuestCard";
import TaskCard, { Task } from "@/src/client/components/waiter/TaskCard";
import Loading from "@/src/client/components/Loading";
import { useWaiter } from "@/src/contexts/WaiterProvider";
import { useAuth } from "@/src/contexts/AuthContext";

import { loadingStyles } from "@/src/client/styles/ui/loading.styles";
import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";

export default function MotivationScreen() {
    const { quests, fetchQuest, fetchTasks, tasks } = useWaiter();
    const { user, selectedLocation } = useAuth();
    const waiterId = user?.id;

    const [days, setDays] = useState<Day[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const loadData = useCallback(
        async (date: string) => {
            setLoading(true);
            try {
                await Promise.all([
                    fetchTasks({
                        user_id: Number(waiterId),
                        date,
                        organization_id: selectedLocation,
                    }),
                    fetchQuest(waiterId, { date }),
                ]);
            } catch (error) {
                console.error("Error fetching data:", error);
                Alert.alert("Ошибка", "Не удалось загрузить данные");
            } finally {
                setLoading(false);
            }
        },
        [waiterId, selectedLocation, fetchQuest, fetchTasks],
    );

    useEffect(() => {
        const today = new Date();
        const weekDays: Day[] = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(today);
            date.setDate(today.getDate() - (6 - i));
            return {
                date: date.getDate().toString(),
                day: date.toLocaleDateString("ru-RU", { weekday: "short" }),
                active: i === 6,
            };
        });

        setDays(weekDays);

        const todayStr = today.toLocaleDateString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
        setSelectedDate(todayStr);
        loadData(todayStr);
    }, []);

    const handleDayPress = useCallback(
        (index: number) => {
            setDays((prev) =>
                prev.map((day, i) => ({ ...day, active: i === index })),
            );

            const today = new Date();
            const selectedDay = new Date(today);
            selectedDay.setDate(today.getDate() - (6 - index));

            const dateStr = selectedDay.toLocaleDateString("ru-RU", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            });

            setSelectedDate(dateStr);
            loadData(dateStr);
        },
        [loadData],
    );

    const renderQuestItem = useCallback(
        ({ item }: { item: Quest }) => <QuestCard quest={item} />,
        [],
    );

    const renderTaskItem = useCallback(
        ({ item }: { item: Task }) => <TaskCard task={item} />,
        [],
    );

    const questKeyExtractor = useCallback((item: Quest) => item.id, []);
    const taskKeyExtractor = useCallback(
        (item: Task) => item.id.toString(),
        [],
    );

    const ItemSeparator = useCallback(
        () => <View style={styles.itemSeparator} />,
        [],
    );

    const renderEmptyQuests = useCallback(
        () => (
            <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>🎯</Text>
                <Text style={styles.emptyText}>Нет активных квестов</Text>
                <Text style={styles.emptySubtext}>
                    Квесты появятся в начале рабочего дня
                </Text>
            </View>
        ),
        [],
    );

    const renderEmptyTasks = useCallback(
        () => (
            <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>📋</Text>
                <Text style={styles.emptyText}>Нет активных задач</Text>
                <Text style={styles.emptySubtext}>
                    Задачи появятся в начале рабочего дня
                </Text>
            </View>
        ),
        [],
    );

    return (
        <SafeAreaView style={[styles.container, backgroundsStyles.generalBg]}>
            <StatusBar
                barStyle="light-content"
                backgroundColor="rgba(25, 25, 26, 1)"
            />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Мотивация</Text>
            </View>

            <Calendar days={days} onDayPress={handleDayPress} />

            {loading ? (
                <View style={loadingStyles.loadingContainer}>
                    <Loading text="Загрузка данных" />
                </View>
            ) : (
                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <Text style={styles.dateTitle}>{selectedDate}</Text>

                    <Text style={styles.sectionTitle}>Квесты</Text>
                    <FlatList
                        data={quests}
                        renderItem={renderQuestItem}
                        keyExtractor={questKeyExtractor}
                        ListEmptyComponent={renderEmptyQuests}
                        ItemSeparatorComponent={ItemSeparator}
                        scrollEnabled={false}
                    />

                    <Text
                        style={[styles.sectionTitle, styles.sectionTitleTasks]}
                    >
                        Задачи
                    </Text>
                    <FlatList
                        data={tasks}
                        renderItem={renderTaskItem}
                        keyExtractor={taskKeyExtractor}
                        ListEmptyComponent={renderEmptyTasks}
                        ItemSeparatorComponent={ItemSeparator}
                        scrollEnabled={false}
                    />
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
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
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 170,
    },
    dateTitle: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
        lineHeight: 28,
        paddingBottom: 20,
    },
    sectionTitle: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
        lineHeight: 24,
        marginBottom: 12,
    },
    sectionTitleTasks: {
        marginTop: 24,
    },
    itemSeparator: {
        height: 12,
    },
    emptyState: {
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 40,
        gap: 8,
    },
    emptyIcon: {
        fontSize: 48,
        opacity: 0.3,
    },
    emptyText: {
        color: "rgba(255, 255, 255, 0.75)",
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
    },
    emptySubtext: {
        color: "rgba(255, 255, 255, 0.5)",
        fontSize: 13,
        textAlign: "center",
        lineHeight: 18,
    },
});
