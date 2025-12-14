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
import { useManager } from "@/src/contexts/ManagerProvider";

import { FormContainer } from "@/src/client/components/form/FormContainer";
import { FormField } from "@/src/client/components/form/FormFields";
import { OptionPicker } from "@/src/client/components/form/OptionPicker";
import { CommentInput } from "@/src/client/components/form/Comment";
import { NumberInput } from "@/src/client/components/form/NumberInput";
import { Ionicons } from "@expo/vector-icons";

export default function IncomeScreen() {
    const router = useRouter();

    // Get data from context instead of local state
    const { loading, setDate: setInputDate } = useCeo();
    const { selectedExpenseTab } = useManager();

    const [days, setDays] = useState<Day[]>([]);

    // Form states
    const [category, setCategory] = useState("");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState("");
    const [comment, setComment] = useState("");
    const [showCalendar, setShowCalendar] = useState(false);

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

    // Render header
    const renderHeader = () => (
        <View style={styles.headerSection}>
            <View style={styles.headerRow}>
                <TouchableOpacity
                    onPress={() => router.push("/manager/expenses")}
                    style={styles.backButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Доходы</Text>
            </View>
            <Calendar days={days} onDayPress={handleDayPress} />
        </View>
    );

    const renderForm = () => {
        const categoryOptions = [
            { label: "Аренда", value: "rent" },
            { label: "Зарплата", value: "salary" },
            { label: "Ком. услуга", value: "asd" },
            { label: "Товары", value: "stuff" },
            { label: "Другое", value: "other" },
        ];

        const handleSubmit = () => {
            console.log({ category, date, comment });
            // TODO implement proper save handle
        };

        return (
            <FormContainer
                title="Добавить доходы"
                description="Заполните нужную информацию"
                onSubmit={handleSubmit}
                submitText="Сохранить"
            >
                <FormField label="Категория">
                    <OptionPicker
                        options={categoryOptions}
                        value={category}
                        onChange={setCategory}
                        placeholder="Выберите статью"
                    />
                </FormField>
                <FormField label="Сумма">
                    <NumberInput
                        value={amount}
                        onChange={setAmount}
                        placeholder="Выберите сумму"
                        currency={"тг"}
                        maxLength={20}
                    />
                </FormField>

                <FormField label="Коментарий">
                    <CommentInput
                        value={comment}
                        onChange={setComment}
                        placeholder="Напишите коментарий"
                    />
                </FormField>
            </FormContainer>
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

                        {renderForm()}
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
        gap: 16,
    },
    headerTitle: {
        color: "#fff",
        fontSize: 32,
        fontWeight: "600",
        letterSpacing: -0.24,
        flex: 1,
    }, // Section
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
    listContainer: {
        gap: 12,
    },
    noDataContainer: {
        padding: 40,
        alignItems: "center",
    },
    noDataText: {
        color: "#666",
        fontSize: 16,
        textAlign: "center",
    },
    backButton: {
        width: 28,
        height: 28,
        justifyContent: "center",
        alignItems: "center",
    },
});
