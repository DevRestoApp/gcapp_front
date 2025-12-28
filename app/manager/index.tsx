import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    StatusBar,
    Image,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import Calendar from "@/src/client/components/Calendar";
import { Day } from "@/src/client/types/waiter";
import { loadingStyles } from "@/src/client/styles/ui/loading.styles";
import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";

import { useManager } from "@/src/contexts/ManagerProvider";
import EmployeeCardFines from "@/src/client/components/ceo/EmployeeCardFines";
import { MaterialIcons } from "@expo/vector-icons";
import ListItemIcon from "@/src/client/components/ceo/ListItemIcon";

export default function IndexScreen() {
    const router = useRouter();

    // Get data from context instead of local state
    const {
        employees,
        shifts,
        finesSummary,
        quests,
        loading,
        queryInputs,
        error,
        refetch,
        analytics,
        setDate: setInputDate,
    } = useManager();

    const [days, setDays] = useState<Day[]>([]);

    // Initialize calendar
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
    }, []);

    // Handle day selection
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

            // Update selected date in context
            // updateshiftData?({ selectedDate: dateStr });
        },
        [days],
    );

    // Navigation handlers
    const handleEmployeesPress = useCallback(() => {
        router.push("/manager/employees");
    }, [router]);

    const handlePenaltiesPress = useCallback(() => {
        router.push("/manager/penalties");
    }, [router]);

    const handleMotivationPress = useCallback(() => {
        router.push("/manager/motivation");
    }, [router]);

    // Render header
    const renderHeader = () => (
        <View style={styles.headerSection}>
            <View style={styles.headerRow}>
                <Text style={styles.headerTitle}>Смена</Text>
            </View>
            <Calendar days={days} onDayPress={handleDayPress} />
        </View>
    );

    // Render employees section
    const renderEmployeesSection = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Сотрудники</Text>
            <View style={styles.card}>
                {/* Open Employees Row */}
                <TouchableOpacity
                    style={styles.infoRow}
                    onPress={handleEmployeesPress}
                    activeOpacity={0.7}
                >
                    <View style={styles.iconContainer}>
                        <FontAwesome name="user-o" size={20} color="white" />
                    </View>
                    <View style={styles.infoContent}>
                        <Text style={styles.infoValue}>
                            {employees?.length} официанта
                        </Text>
                    </View>
                    <Text style={styles.chevron}>›</Text>
                </TouchableOpacity>

                <View style={styles.divider} />

                {/* Total Amount Row */}
                <TouchableOpacity
                    style={styles.infoRow}
                    onPress={handleEmployeesPress}
                    activeOpacity={0.7}
                >
                    <View style={styles.iconContainer}>
                        <FontAwesome name="dollar" size={20} color="white" />
                    </View>
                    <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Общая сумма</Text>
                        <Text style={styles.infoValue}>
                            {analytics?.metrics[0]?.value}
                        </Text>
                    </View>
                    <Text style={styles.chevron}>›</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    // Render fines section
    const renderFinesSection = () => {
        return (
            <View style={styles.section}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.sectionTitle}>Штрафы</Text>
                    <Text style={styles.countBadge}>
                        {" "}
                        ({finesSummary.fines.length})
                    </Text>
                </View>
                <View style={styles.card}>
                    {finesSummary.fines.length > 0 ? (
                        <View>
                            {finesSummary.fines.map((el, index) => (
                                <EmployeeCardFines
                                    key={el.id || index}
                                    name={el.employeeName}
                                    avatar=""
                                    amount={String(el.amount)}
                                    reason={el.reason}
                                />
                            ))}
                        </View>
                    ) : (
                        <View style={styles.emptyState}>
                            <Image
                                source={{
                                    uri: "https://api.builder.io/api/v1/image/assets/TEMP/3a2062fc9fe28a4ced85562fb2ca8299b6cae617?width=160",
                                }}
                                style={styles.emptyIcon}
                                resizeMode="contain"
                            />
                            <Text style={styles.emptyText}>
                                Нет списка штрафов
                            </Text>
                        </View>
                    )}
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={handlePenaltiesPress}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.addButtonText}>Добавить</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    // Render motivation section
    const renderMotivationSection = () => {
        const dateStr = new Date().toLocaleDateString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
        const label =
            queryInputs.date === dateStr
                ? "Задания на сегодня"
                : "Задания на " + queryInputs.date;
        const quest = "Задании: " + quests.quests?.length.toString();
        return (
            <View style={styles.section}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.sectionTitle}>Мотивация</Text>
                    <Text style={styles.countBadge}>
                        {" "}
                        ({shifts?.motivationCount || 0})
                    </Text>
                </View>
                <View style={styles.card}>
                    <ListItemIcon
                        label={label}
                        value={quest}
                        icon={
                            <MaterialIcons
                                name="task-alt"
                                size={20}
                                color="white"
                            />
                        }
                        withChevron={true}
                    />
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={handleMotivationPress}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.addButtonIcon}>+</Text>
                        <Text style={styles.addButtonText}>Добавить</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView
            style={{ ...styles.container, ...backgroundsStyles.generalBg }}
        >
            <StatusBar
                barStyle="light-content"
                backgroundColor="rgba(25, 25, 26, 1)"
            />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {loading ? (
                    <View style={loadingStyles.loadingContainer}>
                        <ActivityIndicator size="large" color="#fff" />
                        <Text style={loadingStyles.loadingText}>
                            Загрузка данных...
                        </Text>
                    </View>
                ) : (
                    <>
                        {renderHeader()}
                        {renderEmployeesSection()}
                        {renderFinesSection()}
                        {renderMotivationSection()}
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

// ... keep all existing styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#19191A",
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 128,
    },

    // Header Section
    headerSection: {
        gap: 16,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: 56,
        paddingHorizontal: 16,
    },
    headerTitle: {
        color: "#fff",
        fontSize: 32,
        fontWeight: "600",
        letterSpacing: -0.24,
        flex: 1,
    },

    // Section
    section: {
        paddingHorizontal: 16,
        gap: 16,
    },
    sectionTitle: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
        lineHeight: 28,
    },
    countBadge: {
        color: "#797A80",
    },

    // Card
    card: {
        backgroundColor: "rgba(35, 35, 36, 1)",
        borderRadius: 20,
        padding: 12,
        gap: 16,
    },

    // Info Row
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 16,
        backgroundColor: "rgba(43, 43, 44, 1)",
        justifyContent: "center",
        alignItems: "center",
    },
    iconText: {
        fontSize: 20,
        color: "green",
    },
    infoContent: {
        flex: 1,
        gap: 4,
    },
    infoLabel: {
        color: "rgba(255, 255, 255, 0.75)",
        fontSize: 12,
        lineHeight: 16,
    },
    infoValue: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        lineHeight: 20,
    },
    chevron: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "300",
    },

    // Divider
    divider: {
        height: 1,
        backgroundColor: "rgba(43, 43, 44, 1)",
    },

    // Empty State
    emptyState: {
        alignItems: "center",
        gap: 8,
    },
    emptyIcon: {
        width: 80,
        height: 80,
    },
    emptyText: {
        color: "rgba(255, 255, 255, 0.75)",
        fontSize: 16,
        textAlign: "center",
        lineHeight: 20,
    },

    // Add Button
    addButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        height: 44,
        borderRadius: 20,
        backgroundColor: "#fff",
    },
    addButtonIcon: {
        color: "#111213",
        fontSize: 20,
        fontWeight: "600",
    },
    addButtonText: {
        color: "#2C2D2E",
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
        lineHeight: 24,
    },
});
