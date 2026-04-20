import React, {
    useState,
    useCallback,
    useRef,
    useMemo,
    useEffect,
} from "react";
import {
    View,
    Text,
    FlatList,
    ScrollView,
    StyleSheet,
    StatusBar,
    Alert,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Entypo } from "@expo/vector-icons";

import { QuestHeader } from "@/src/client/components/reports/QuestHeader";
import QuestCard, {
    QuestEmployees,
} from "@/src/client/components/ceo/QuestCard";
import TaskCard, { Task } from "@/src/client/components/waiter/TaskCard";
import AddQuestModal, {
    AddQuestModalRef,
} from "@/src/client/components/modals/AddQuestModal";
import Loading from "@/src/client/components/Loading";
import SegmentedControl from "@/src/client/components/Tabs";

import { loadingStyles } from "@/src/client/styles/ui/loading.styles";
import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";
import { ButtonStyles } from "@/src/client/styles/ui/buttons/Button.styles";
import { useManager } from "@/src/contexts/ManagerProvider";

export default function QuestManagementScreen() {
    const router = useRouter();
    const { openModal } = useLocalSearchParams<{ openModal?: string }>();
    const {
        quests,
        tasks,
        employees,
        shifts,
        loading,
        refetch,
        createQuestAction,
        createTaskWrapper,
        locations,
        setDate: setInputDate,
        fetchTasksWrapper,
        fetchQuestsData,
        setQuests,
    } = useManager();

    const safeQuests = quests.quests || [];
    const safeTasks = tasks || [];
    const safeEmployees = employees || [];
    const safeShifts = shifts || { questsCount: 0 };

    const [selectedDate, setSelectedDate] = useState<string>(() =>
        new Date().toLocaleDateString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }),
    );
    const [selectedEmployee, setSelectedEmployee] = useState<string>("");
    const [selectedCompleted, setSelectedCompleted] = useState<string>("");
    const [questsLoading, setQuestsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<"quest" | "task">("quest");

    const tabs = [
        { label: "Квесты", value: "quest" },
        { label: "Задачи", value: "task" },
    ];

    const addQuestModalRef = useRef<AddQuestModalRef>(null);

    useEffect(() => {
        if (openModal === "true") {
            setTimeout(() => addQuestModalRef.current?.open(activeTab), 300);
        }
    }, [openModal]);

    const handleDateChange = useCallback(
        async (dateStr: string) => {
            setInputDate(dateStr);
            setSelectedDate(dateStr);

            setQuestsLoading(true);
            try {
                const questsResponse = await fetchQuestsData({
                    date: dateStr,
                });
                setQuests(questsResponse);
                await fetchTasksWrapper({
                    date: dateStr,
                });
            } catch (error) {
                console.error("Error fetching quests:", error);
            } finally {
                setQuestsLoading(false);
            }
        },
        [setInputDate, fetchQuestsData, setQuests, fetchTasksWrapper],
    );

    const handleEmployeeChange = useCallback((employeeId: string) => {
        setSelectedEmployee(employeeId);
    }, []);

    const handleCompletedChange = useCallback((value: string) => {
        setSelectedCompleted(value);
    }, []);

    const filteredQuests = useMemo(() => {
        let result = safeQuests;
        if (selectedEmployee) {
            result = result.filter((q: any) =>
                q.employeeNames?.includes(
                    safeEmployees.find((e) => String(e.id) === selectedEmployee)
                        ?.name,
                ),
            );
        }
        if (selectedCompleted === "true") {
            result = result.filter(
                (q: any) => q.progress >= q.target || q.current >= q.progress,
            );
        } else if (selectedCompleted === "false") {
            result = result.filter(
                (q: any) => q.progress < q.target && q.current < q.progress,
            );
        }
        return result;
    }, [safeQuests, selectedEmployee, selectedCompleted, safeEmployees]);

    const filteredTasks = useMemo(() => {
        let result = safeTasks;
        if (selectedEmployee) {
            result = result.filter(
                (t: any) => String(t.employee_id) === selectedEmployee,
            );
        }
        if (selectedCompleted === "true") {
            result = result.filter((t: any) => t.is_completed);
        } else if (selectedCompleted === "false") {
            result = result.filter((t: any) => !t.is_completed);
        }
        return result;
    }, [safeTasks, selectedEmployee, selectedCompleted]);

    const handleAddQuest = useCallback(
        async (data: {
            title: string;
            description: string;
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
                    description: data.description,
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
        [selectedDate, safeEmployees.length, createQuestAction, refetch],
    );

    const handleAddTask = useCallback(
        async (data: {
            title: string;
            description: string;
            user_id: number;
            organization_id: number;
            due_date: string;
        }) => {
            try {
                // TODO убрать user.id === 10 при релизе
                await createTaskWrapper({
                    title: data.title,
                    description: data.description,
                    employee_id: data.user_id === 10 ? 322256 : data.user_id,
                    organization_id: data.organization_id,
                    due_date: data.due_date,
                });
                await refetch();
            } catch (error) {
                console.error("Failed to create task:", error);
                Alert.alert("Ошибка", "Не удалось создать задачу");
            }
        },
        [createTaskWrapper, refetch],
    );

    const renderQuestItem = useCallback(
        ({ item }: { item: QuestEmployees }) => (
            <QuestCard
                quest={item}
                onPress={() =>
                    router.push({
                        pathname: `/manager/motivation/${item.id}`,
                        params: {
                            type: "quest",
                        },
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
                        pathname: `/manager/motivation/${item.id}`,
                        params: {
                            type: "task",
                        },
                    })
                }
            />
        ),
        [],
    );

    const questKeyExtractor = useCallback(
        (item: QuestEmployees) => item.id,
        [],
    );
    const taskKeyExtractor = useCallback(
        (item: Task) => item.id.toString(),
        [],
    );
    const ItemSeparator = useCallback(
        () => <View style={styles.itemSeparator} />,
        [],
    );

    const renderLoadingState = () => (
        <View style={loadingStyles.loadingContainer}>
            <Loading text="Загрузка данных" />
        </View>
    );

    const questHeaderProps = {
        title: `Квесты (${safeShifts.questsCount || 0})`,
        onBack: () => router.push("/manager"),
        date: selectedDate,
        onDateChange: handleDateChange,
        employee: selectedEmployee,
        onEmployeeChange: handleEmployeeChange,
        employees: safeEmployees.map((e: any) => ({
            id: String(e.id),
            name: e.name,
        })),
        completed: selectedCompleted,
        onCompletedChange: handleCompletedChange,
    };

    if (loading) {
        return (
            <SafeAreaView
                style={[styles.container, backgroundsStyles.generalBg]}
            >
                <StatusBar
                    barStyle="light-content"
                    backgroundColor="rgba(25, 25, 26, 1)"
                />
                <QuestHeader {...questHeaderProps} />
                {renderLoadingState()}
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, backgroundsStyles.generalBg]}>
            <StatusBar
                barStyle="light-content"
                backgroundColor="rgba(25, 25, 26, 1)"
            />

            <QuestHeader {...questHeaderProps} />

            {questsLoading ? (
                renderLoadingState()
            ) : (
                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <SegmentedControl
                        tabs={tabs}
                        activeTab={activeTab}
                        onTabChange={(value) =>
                            setActiveTab(value as "quest" | "task")
                        }
                        containerStyle={styles.segmentedControl}
                    />

                    {activeTab === "quest" ? (
                        <>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>
                                    Квесты
                                    {selectedDate ? ` на ${selectedDate}` : ""}
                                </Text>
                                <Text style={styles.sectionSubtitle}>
                                    {filteredQuests.length}{" "}
                                    {filteredQuests.length === 1
                                        ? "квест"
                                        : "квестов"}
                                </Text>
                            </View>
                            <FlatList
                                data={filteredQuests}
                                renderItem={renderQuestItem}
                                keyExtractor={questKeyExtractor}
                                ItemSeparatorComponent={ItemSeparator}
                                ListEmptyComponent={
                                    <View style={styles.emptyState}>
                                        <Text style={styles.emptyIcon}>🎯</Text>
                                        <Text style={styles.emptyText}>
                                            Нет квестов на выбранную дату
                                        </Text>
                                        <Text style={styles.emptySubtext}>
                                            Создайте новый квест, нажав на
                                            кнопку "+"
                                        </Text>
                                    </View>
                                }
                                scrollEnabled={false}
                            />
                        </>
                    ) : (
                        <>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>
                                    Задачи
                                    {selectedDate ? ` на ${selectedDate}` : ""}
                                </Text>
                                <Text style={styles.sectionSubtitle}>
                                    {filteredTasks.length}{" "}
                                    {filteredTasks.length === 1
                                        ? "задача"
                                        : "задач"}
                                </Text>
                            </View>
                            <FlatList
                                data={filteredTasks}
                                renderItem={renderTaskItem}
                                keyExtractor={taskKeyExtractor}
                                ItemSeparatorComponent={ItemSeparator}
                                ListEmptyComponent={
                                    <View style={styles.emptyState}>
                                        <Text style={styles.emptyIcon}>📋</Text>
                                        <Text style={styles.emptyText}>
                                            Нет задач на выбранную дату
                                        </Text>
                                        <Text style={styles.emptySubtext}>
                                            Создайте новую задачу, нажав на
                                            кнопку "+"
                                        </Text>
                                    </View>
                                }
                                scrollEnabled={false}
                            />
                        </>
                    )}
                </ScrollView>
            )}

            <TouchableOpacity
                onPress={() => addQuestModalRef.current?.open(activeTab)}
                style={ButtonStyles.addButtonManager}
                activeOpacity={0.7}
            >
                <Entypo name="plus" size={24} color="black" />
            </TouchableOpacity>

            <AddQuestModal
                ref={addQuestModalRef}
                onAddQuest={handleAddQuest}
                onAddTask={handleAddTask}
                onCancel={() => {}}
                employees={employees}
                locations={locations}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollView: { flex: 1 },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 170,
    },
    segmentedControl: {
        paddingHorizontal: 0,
        paddingTop: 0,
        paddingBottom: 16,
    },
    sectionHeader: {
        marginBottom: 12,
        gap: 4,
    },
    sectionTitle: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
        lineHeight: 28,
    },
    sectionSubtitle: { color: "#797A80", fontSize: 14, lineHeight: 18 },
    itemSeparator: { height: 12 },
    emptyState: {
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 40,
        gap: 12,
    },
    emptyIcon: { fontSize: 48, opacity: 0.3 },
    emptyText: {
        color: "rgba(255, 255, 255, 0.75)",
        fontSize: 16,
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
