import React, { useState, useEffect, useCallback, useRef } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    StatusBar,
    ActivityIndicator,
    Alert,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Svg, { Path } from "react-native-svg";

import Calendar from "@/src/client/components/Calendar";
import { Day } from "@/src/client/types/waiter";
import QuestCardEmployees, {
    QuestEmployees,
} from "@/src/client/components/ceo/QuestCardEmployees";
import AddQuestModal, {
    AddQuestModalRef,
} from "@/src/client/components/modals/AddQuestModal";

import { loadingStyles } from "@/src/client/styles/ui/loading.styles";
import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";
import { useCeo } from "@/src/contexts/CeoProvider";

export default function QuestManagementScreen() {
    const router = useRouter();
    const {
        quests,
        employees,
        shiftData,
        loading,
        fetchQuestsForDate,
        addQuest,
    } = useCeo();

    const [days, setDays] = useState<Day[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [questsLoading, setQuestsLoading] = useState(false);

    const addQuestModalRef = useRef<AddQuestModalRef>(null);

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
    }, []);

    // Handle day selection
    const handleDayPress = useCallback(
        async (index: number) => {
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

            // Fetch quests for the selected date
            setQuestsLoading(true);
            try {
                await fetchQuestsForDate(dateStr);
            } catch (error) {
                console.error("Error fetching quests:", error);
                Alert.alert("Ошибка", "Не удалось загрузить квесты");
            } finally {
                setQuestsLoading(false);
            }
        },
        [days, fetchQuestsForDate],
    );

    // Handle quest creation
    const handleAddQuest = useCallback(
        async (data: { name: string; amount: number; reward: string }) => {
            try {
                // Add quest to context
                addQuest({
                    title: data.name,
                    description: data.reward,
                    reward: data.amount,
                    target: data.amount,
                    unit: "единиц", // Default unit
                    totalEmployees: employees.length,
                    completedEmployees: 0,
                    employeeNames: [],
                    date: selectedDate,
                });

                console.log("Quest created successfully:", data);
            } catch (error) {
                console.error("Failed to create quest:", error);
            }
        },
        [selectedDate, employees.length, addQuest],
    );

    // Render header with back button and add quest button
    const renderHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity
                onPress={() => router.push("/ceo")}
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

            <Text style={styles.headerTitle}>
                Квесты ({shiftData.questsCount})
            </Text>

            <TouchableOpacity
                onPress={() => addQuestModalRef.current?.open()}
                style={styles.addButton}
                activeOpacity={0.7}
            >
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
        </View>
    );

    // Render section title
    const renderSectionTitle = () => (
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Квесты на {selectedDate}</Text>
            <Text style={styles.sectionSubtitle}>
                {quests.length} {quests.length === 1 ? "квест" : "квестов"}
            </Text>
        </View>
    );

    // Render empty state
    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🎯</Text>
            <Text style={styles.emptyText}>Нет квестов на выбранную дату</Text>
            <Text style={styles.emptySubtext}>
                Создайте новый квест, нажав на кнопку &#34;+&#34;
            </Text>
        </View>
    );

    // Render loading state
    const renderLoadingState = () => (
        <View style={loadingStyles.loadingContainer}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={loadingStyles.loadingText}>Загрузка квестов...</Text>
        </View>
    );

    // Render quest item
    const renderQuestItem = ({ item }: { item: QuestEmployees }) => (
        <QuestCardEmployees
            quest={item}
            onPress={() => router.push(`/ceo/motivation/${item.id}`)}
        />
    );

    // Key extractor for FlatList
    const keyExtractor = (item: QuestEmployees) => item.id;

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

            {loading || questsLoading ? (
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

            {/* Add Quest Modal */}
            <AddQuestModal
                ref={addQuestModalRef}
                onAddQuest={handleAddQuest}
                onCancel={() => {}}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

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
    addButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#ffffff",
        justifyContent: "center",
        alignItems: "center",
    },
    addButtonText: {
        color: "#000000",
        fontSize: 20,
        fontWeight: "600",
        lineHeight: 24,
    },

    // List
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 170,
        flexGrow: 1,
    },
    sectionHeader: {
        marginBottom: 16,
        gap: 4,
    },
    sectionTitle: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
        lineHeight: 28,
    },
    sectionSubtitle: {
        color: "#797A80",
        fontSize: 14,
        lineHeight: 18,
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
