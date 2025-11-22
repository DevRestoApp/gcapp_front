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

import Calendar from "@/src/client/components/Calendar";
import { Day } from "@/src/client/types/waiter";
import { loadingStyles } from "@/src/client/styles/ui/loading.styles";
import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";

import { useCeo } from "@/src/contexts/CeoProvider";

export default function IndexScreen() {
    const router = useRouter();

    // Get data from context instead of local state
    const { employees, shiftData, loading, error, refetch } = useCeo();

    console.log("emps", employees);

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

            // Update selected date in context
            // updateshiftData?({ selectedDate: dateStr });
        },
        [days],
    );

    // Navigation handlers
    const handleEmployeesPress = useCallback(() => {
        router.push("/employees");
    }, [router]);

    const handlePenaltiesPress = useCallback(() => {
        router.push("/ceo/penalties");
    }, [router]);

    const handleMotivationPress = useCallback(() => {
        router.push("/ceo/motivation");
    }, [router]);

    // Render header
    const renderHeader = () => (
        <View style={styles.headerSection}>
            <View style={styles.headerRow}>
                <Text style={styles.headerTitle}>Смена</Text>
                <View style={styles.timerBadge}>
                    <Text style={styles.timerIcon}>⏰</Text>
                    <Text style={styles.timerText}>
                        {shiftData?.elapsedTime}
                    </Text>
                </View>
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
                        <Text style={styles.iconText}>👥</Text>
                    </View>
                    <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>
                            Открытых сотрудники
                        </Text>
                        <Text style={styles.infoValue}>
                            {shiftData?.openEmployees} официанта
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
                        <Text style={styles.iconText}>₸</Text>
                    </View>
                    <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Общая сумма</Text>
                        <Text style={styles.infoValue}>
                            {shiftData?.totalAmount.toLocaleString()} тг
                        </Text>
                    </View>
                    <Text style={styles.chevron}>›</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    // Render fines section
    const renderFinesSection = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>
                Штрафы{" "}
                <Text style={styles.countBadge}>({shiftData?.finesCount})</Text>
            </Text>
            <View style={styles.card}>
                <View style={styles.emptyState}>
                    <Image
                        source={{
                            uri: "https://api.builder.io/api/v1/image/assets/TEMP/3a2062fc9fe28a4ced85562fb2ca8299b6cae617?width=160",
                        }}
                        style={styles.emptyIcon}
                        resizeMode="contain"
                    />
                    <Text style={styles.emptyText}>Нет список штрафов</Text>
                </View>
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

    // Render motivation section
    const renderMotivationSection = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>
                Мотивация{" "}
                <Text style={styles.countBadge}>
                    ({shiftData?.motivationCount})
                </Text>
            </Text>
            <TouchableOpacity
                style={styles.addButton}
                onPress={handleMotivationPress}
                activeOpacity={0.8}
            >
                <Text style={styles.addButtonIcon}>+</Text>
                <Text style={styles.addButtonText}>Добавить</Text>
            </TouchableOpacity>
        </View>
    );

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
        gap: 28,
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
    timerBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: "rgba(255, 158, 0, 0.08)",
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 16,
    },
    timerIcon: {
        fontSize: 16,
    },
    timerText: {
        color: "#FF9E00",
        fontSize: 16,
        fontWeight: "600",
        letterSpacing: -0.064,
        lineHeight: 20,
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
