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
import { ButtonStyles } from "@/src/client/styles/ui/buttons/Button.styles";
import { sizes } from "@/src/utils/utils";

import SegmentedControl from "@/src/client/components/Tabs";
import Entypo from "@expo/vector-icons/Entypo";
import { OrderHistoryCard } from "@/src/client/components/reports/OrderHistoryItem";
import { icons } from "@/src/client/icons/icons";
import { useManager } from "@/src/contexts/ManagerProvider";
import { ReportHeader } from "@/src/client/components/reports/header";
import Loading from "@/src/client/components/Loading";

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

export default function ExpensesScreen() {
    const router = useRouter();

    // Get data from context instead of local state
    const {
        setSelectedExpenseTab,
        locations,
        loading,
        error,
        refetch,
        queryInputs,
        setDate,
        setPeriod,
        setLocation,
    } = useManager();

    const [days, setDays] = useState<Day[]>([]);
    const [activeTab, setActiveTab] = useState<"expense" | "income">("expense");

    // Set initial value in useEffect instead of during render
    useEffect(() => {
        setSelectedExpenseTab("expense");
    }, []); // Empty dependency array = runs once on mount

    // Render header
    const renderHeader = () => (
        <View style={styles.headerSection}>
            <ReportHeader
                title="Расходы"
                date={queryInputs.date}
                period={queryInputs.period}
                location={queryInputs.organization_id}
                onBack={() => router.push("/manager")}
                onDateChange={setDate}
                onPeriodChange={setPeriod}
                onLocationChange={setLocation}
                organizations={locations}
                showPeriodSelector={false}
            />
        </View>
    );

    const renderTabs = () => {
        const tabs = [
            { label: "Расход", value: "expense" },
            { label: "Доход", value: "income" },
        ];

        return (
            <View>
                <SegmentedControl
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                ></SegmentedControl>
            </View>
        );
    };

    const renderAddButton = () => {
        return (
            <TouchableOpacity
                onPress={() => router.push(`/manager/expenses/${activeTab}`)}
                style={ButtonStyles.addButtonManager}
                activeOpacity={0.7}
            >
                <Entypo name="plus" size={sizes.m} color="black" />
            </TouchableOpacity>
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
                    <Loading text={"Загрузка данных"} />
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
