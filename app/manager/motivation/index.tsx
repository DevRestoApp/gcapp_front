import React, { useState, useEffect, useCallback, useRef } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    StatusBar,
    Alert,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Svg, { Path } from "react-native-svg";
import { Entypo } from "@expo/vector-icons";

import Calendar from "@/src/client/components/Calendar";
import { Day } from "@/src/client/types/waiter";
import QuestCard, {
    QuestEmployees,
} from "@/src/client/components/ceo/QuestCard";
import AddQuestModal, {
    AddQuestModalRef,
} from "@/src/client/components/modals/AddQuestModal";

import { loadingStyles } from "@/src/client/styles/ui/loading.styles";
import Loading from "@/src/client/components/Loading";
import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";
import { useManager } from "@/src/contexts/ManagerProvider";
import { ButtonStyles } from "@/src/client/styles/ui/buttons/Button.styles";

export default function QuestManagementScreen() {
    const router = useRouter();
    const {
        quests,
        employees,
        shifts,
        loading,
        refetch,
        createQuestAction,
        locations,
        setDate: setInputDate,
    } = useManager();

    const safeQuests = quests.quests || [];
    const safeEmployees = employees || [];
    const safeShifts = shifts || { questsCount: 0 };

    const [days, setDays] = useState<Day[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [questsLoading, setQuestsLoading] = useState(false);

    const addQuestModalRef = useRef<AddQuestModalRef>(null);

    useEffect(() => {
        const today = new Date();
        const weekDays: Day[] = [];

        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() - (6 - i));

            weekDays.push({
                date: date.getDate().toString(),
                day: date.toLocaleDateString("ru-RU", { weekday: "short" }),
                active: i === 6,
            });
        }

        setDays(weekDays);

        const todayStr = today.toLocaleDateString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
        setSelectedDate(todayStr);
    }, []);

    const handleDayPress = useCallback(
        (index: number) => {
            const newDays = days.map((day, i) => ({
                ...day,
                active: i === index,
            }));
            setDays(newDays);

            const today = new Date();
            const selectedDay = new Date(today);
            selectedDay.setDate(today.getDate() - (6 - index));

            const dateStr = selectedDay.toLocaleDateString("ru-RU", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            });

            setInputDate(dateStr);
            setSelectedDate(dateStr);

            setQuestsLoading(true);
            try {
                // change to getQuests api point
            } catch (error) {
                console.error("Error fetching quests:", error);
                Alert.alert("Ошибка", "Не удалось загрузить квесты");
            } finally {
                setQuestsLoading(false);
            }
        },
        [days],
    );

    const handleAddQuest = useCallback(
        async (data: {
            title: string;
            amount: number;
            reward: number;
            unit: string;
            durationDate: any;
        }) => {
            if (!createQuestAction) {
                Alert.alert("Ошибка", "Функция создания квеста недоступна");
                return;
            }

            try {
                createQuestAction({
                    title: data.title,
                    reward: data.reward,
                    target: data.amount,
                    unit: data.unit,
                    totalEmployees: safeEmployees.length,
                    completedEmployees: 0,
                    employeeNames: [],
                    date: selectedDate,
                    durationDate: data.durationDate,
                });

                await refetch();
            } catch (error) {
                console.error("Failed to create quest:", error);
                Alert.alert("Ошибка", "Не удалось создать квест");
            }
        },
        [selectedDate, safeEmployees.length, createQuestAction],
    );

    const renderHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity
                onPress={() => router.push("/manager")}
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
                Квесты ({safeShifts.questsCount || 0})
            </Text>

            {/* Empty view to keep title centered */}
            <View style={styles.backButton} />
        </View>
    );

    const renderSectionTitle = () => (
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Квесты на {selectedDate}</Text>
            <Text style={styles.sectionSubtitle}>
                {safeQuests.length}{" "}
                {safeQuests.length === 1 ? "квест" : "квестов"}
            </Text>
        </View>
    );

    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🎯</Text>
            <Text style={styles.emptyText}>Нет квестов на выбранную дату</Text>
            <Text style={styles.emptySubtext}>
                Создайте новый квест, нажав на кнопку &#34;+&#34;
            </Text>
        </View>
    );

    const renderLoadingState = () => (
        <View>
            <Loading text={"Загрузка квестов"} />
        </View>
    );

    const renderQuestItem = ({ item }: { item: QuestEmployees }) => (
        <QuestCard
            quest={item}
            onPress={() => router.push(`/manager/motivation/${item.id}`)}
        />
    );

    const renderAddButton = () => (
        <TouchableOpacity
            onPress={() => addQuestModalRef.current?.open()}
            style={ButtonStyles.addButtonManager}
            activeOpacity={0.7}
        >
            <Entypo name="plus" size={24} color="black" />
        </TouchableOpacity>
    );

    const keyExtractor = (item: QuestEmployees) => item.id;
    const ItemSeparator = () => <View style={styles.itemSeparator} />;

    if (loading) {
        return (
            <SafeAreaView
                style={{ ...styles.container, ...backgroundsStyles.generalBg }}
            >
                <StatusBar
                    barStyle="light-content"
                    backgroundColor="rgba(25, 25, 26, 1)"
                />
                {renderHeader()}
                {renderLoadingState()}
            </SafeAreaView>
        );
    }

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

            {questsLoading ? (
                renderLoadingState()
            ) : (
                <FlatList
                    data={safeQuests}
                    renderItem={renderQuestItem}
                    keyExtractor={keyExtractor}
                    ListHeaderComponent={renderSectionTitle}
                    ListEmptyComponent={renderEmptyState}
                    ItemSeparatorComponent={ItemSeparator}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}

            {renderAddButton()}

            <AddQuestModal
                ref={addQuestModalRef}
                onAddQuest={handleAddQuest}
                onCancel={() => {}}
                employees={employees}
                organizations={locations}
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
