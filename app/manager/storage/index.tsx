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
import SegmentedControl from "@/src/client/components/Tabs";
import { OrderHistoryCard } from "@/src/client/components/reports/OrderHistoryItem";
import { icons } from "@/src/client/icons/icons";
import Entypo from "@expo/vector-icons/Entypo";
import { useEmployee } from "@/src/contexts/EmployeeContext";

// Helper function to format data items for OrderHistoryCard
const formatDataItem = (item: any, index: number, itemType: string) => {
    // Extract the display name
    const tableNumber =
        item.name ||
        item.item ||
        item.reason ||
        item.source ||
        `Элемент ${index + 1}`;

    // Extract and format the amount
    const rawAmount = item.amount || item.quantity || 0;
    const formattedAmount =
        typeof rawAmount === "number"
            ? `${rawAmount >= 0 ? "+" : ""}${rawAmount.toLocaleString("ru-RU")} тг`
            : rawAmount;

    // Extract time if available, otherwise use current time or empty
    const time = item.time || "";
    let formattedType = "positive";
    if (itemType === "negative") {
        formattedType = "negative";
    }

    return {
        id: item.id || index,
        tableNumber,
        amount: formattedAmount,
        time,
        type: formattedType,
    };
};

export default function StorageScreen() {
    const router = useRouter();

    const { setSelectedStorageTab } = useManager();

    // Get data from context instead of local state
    const { loading, setDate: setInputDate } = useCeo();

    const [days, setDays] = useState<Day[]>([]);
    const [activeTab, setActiveTab] = useState<
        "receipts" | "inventory" | "writeoffs"
    >("receipts");
    // initial valur for provider state
    setSelectedStorageTab("receipts");

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
                <Text style={styles.headerTitle}>Склад</Text>
            </View>
            <Calendar days={days} onDayPress={handleDayPress} />
        </View>
    );

    const renderAddButton = () => {
        return (
            <TouchableOpacity
                onPress={() => router.push("/manager/storage/add")}
                style={styles.addButton}
                activeOpacity={0.7}
            >
                <Entypo name="plus" size={40} color="black" />
            </TouchableOpacity>
        );
    };

    const renderTabs = () => {
        const tabs = [
            { label: "Поступления", value: "receipts" },
            { label: "Инвентаризация", value: "inventory" },
            { label: "Списания", value: "writeoffs" },
        ];

        return (
            <SegmentedControl
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={(value) => {
                    setActiveTab(
                        value as "receipts" | "inventory" | "writeoffs",
                    );
                    setSelectedStorageTab(value);
                }}
            />
        );
    };

    const renderItemList = () => {
        if (activeTab === "expense") {
            // TODO add real data api

            const currentData = {
                data: [],
                type: "negative",
            };
            return currentData.data && currentData.data.length > 0 ? (
                <View style={styles.listContainer}>
                    {currentData.data.map((item, index) => {
                        const formattedItem = formatDataItem(
                            item,
                            index,
                            currentData.type,
                        );
                        return (
                            <OrderHistoryCard
                                key={formattedItem.id}
                                tableNumber={formattedItem.tableNumber}
                                amount={formattedItem.amount}
                                time={formattedItem.time}
                                icon={icons["dishes"]}
                                type={currentData.type}
                            />
                        );
                    })}
                </View>
            ) : (
                <View style={styles.noDataContainer}>
                    <Text style={styles.noDataText}>
                        Нет данных для отображения
                    </Text>
                </View>
            );
        } else {
            // TODO add real data api
            const currentData = {
                data: [],
                type: "positive",
            };
            return currentData.data && currentData.data.length > 0 ? (
                <View style={styles.listContainer}>
                    {currentData.data.map((item, index) => {
                        const formattedItem = formatDataItem(
                            item,
                            index,
                            currentData.type,
                        );
                        return (
                            <OrderHistoryCard
                                key={formattedItem.id}
                                tableNumber={formattedItem.tableNumber}
                                amount={formattedItem.amount}
                                time={formattedItem.time}
                                icon={icons["writeoffs"]}
                                type={currentData.type}
                            />
                        );
                    })}
                </View>
            ) : (
                <View style={styles.noDataContainer}>
                    <Text style={styles.noDataText}>
                        Нет данных для отображения
                    </Text>
                </View>
            );
        }
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
                        {renderTabs()}

                        {renderItemList()}
                    </>
                )}
            </ScrollView>
            {renderAddButton()}
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
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: "#ffffff",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        bottom: 16,
        right: 16,
    },
    addButtonText: {
        color: "#000000",
        fontSize: 20,
        fontWeight: "600",
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
});
