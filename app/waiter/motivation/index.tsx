import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    StatusBar,
    Alert,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import QuestCard, { Quest } from "@/src/client/components/waiter/QuestCard";
import TaskCard, { Task } from "@/src/client/components/waiter/TaskCard";
import { ReportCalendar } from "@/src/client/components/reports/Calendar";
import Loading from "@/src/client/components/Loading";
import { useWaiter } from "@/src/contexts/WaiterProvider";
import { useAuth } from "@/src/contexts/AuthContext";

import { loadingStyles } from "@/src/client/styles/ui/loading.styles";
import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";
import SegmentedControl from "@/src/client/components/Tabs";

export default function MotivationScreen() {
    const router = useRouter();
    const { quests, fetchQuest, fetchTasks, tasks } = useWaiter();
    const { user, selectedLocation } = useAuth();
    const waiterId = user?.id;

    const [selectedDate, setSelectedDate] = useState<string>("");
    const [showCalendar, setShowCalendar] = useState(false);
    const [loading, setLoading] = useState(false);

    const tabs = [
        { label: "Квест", value: "quest" },
        { label: "Задача", value: "task" },
    ];
    const [activeTab, setActiveTab] = useState<"quest" | "task">("task");

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
        const todayStr = new Date().toLocaleDateString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
        setSelectedDate(todayStr);
        loadData(todayStr);
    }, []);

    const handleDateSelect = useCallback(
        (date: string) => {
            setSelectedDate(date);
            loadData(date);
        },
        [loadData],
    );

    const renderQuestItem = useCallback(
        ({ item }: { item: Quest }) => (
            <QuestCard
                quest={item}
                onPress={() =>
                    router.push({
                        pathname: `/waiter/motivation/${item.id}`,
                        params: { type: "quest" },
                    })
                }
            />
        ),
        [router],
    );

    const renderTaskItem = useCallback(
        ({ item }: { item: Task }) => (
            <TaskCard
                task={item}
                onPress={() =>
                    router.push({
                        pathname: `/waiter/motivation/${item.id}`,
                        params: { type: "task" },
                    })
                }
            />
        ),
        [router],
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
                    <SegmentedControl
                        tabs={tabs}
                        activeTab={activeTab}
                        onTabChange={(value) => {
                            setActiveTab(value as "quest" | "task");
                        }}
                        containerStyle={styles.segmentedControl}
                    />

                    {activeTab === "quest" ? (
                        <>
                            <FlatList
                                data={quests}
                                renderItem={renderQuestItem}
                                keyExtractor={questKeyExtractor}
                                ListEmptyComponent={renderEmptyQuests}
                                ItemSeparatorComponent={ItemSeparator}
                                scrollEnabled={false}
                            />
                        </>
                    ) : (
                        <>
                            <FlatList
                                data={tasks}
                                renderItem={renderTaskItem}
                                keyExtractor={taskKeyExtractor}
                                ListEmptyComponent={renderEmptyTasks}
                                ItemSeparatorComponent={ItemSeparator}
                                scrollEnabled={false}
                            />
                        </>
                    )}
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
    segmentedControl: {
        paddingHorizontal: 0,
        paddingTop: 0,
        paddingBottom: 16,
    },
    sectionTitle: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
        lineHeight: 24,
        marginBottom: 12,
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
