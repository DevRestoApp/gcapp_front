import React from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    StyleSheet,
} from "react-native";
import { Svg, Path } from "react-native-svg";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";

import { useMoneyFlow } from "./_layout";
import { OrderHistoryCard } from "@/src/client/components/reports/OrderHistoryItem";
import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";
import { cardStyles } from "@/src/client/styles/ui/components/card.styles";
import { textStyles } from "@/src/client/styles/ui/text.styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SimpleHeader } from "@/src/client/components/Header";
import { icons } from "@/src/client/icons/icons";

// ChevronLeft Icon Component
function ChevronLeftIcon() {
    return (
        <Svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <Path
                d="M15 18L9 12L15 6"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}

export default function MoneyFlowDetail() {
    const router = useRouter();
    const { type } = useLocalSearchParams<{ type: string }>();
    const moneyFlowData = useMoneyFlow();

    console.log("moneyFlowData", moneyFlowData);

    // Get the appropriate data based on the type parameter
    const data = moneyFlowData[type as keyof typeof moneyFlowData];

    // Filter out the setMoneyFlowData function
    const currentData = typeof data === "function" ? null : data;
    console.log("currentData", currentData);

    const handleGoBack = () => {
        router.back();
    };

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

    if (!currentData) {
        return (
            <SafeAreaView
                style={{ ...styles.container, ...backgroundsStyles.generalBg }}
            >
                <StatusBar barStyle="light-content" />

                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={handleGoBack}
                        style={styles.iconButton}
                        activeOpacity={0.7}
                    >
                        <ChevronLeftIcon />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>Детали</Text>

                    <View style={styles.iconButton} />
                </View>

                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Нет данных</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView
            style={{ ...styles.container, ...backgroundsStyles.generalBg }}
        >
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <SimpleHeader title={currentData.label}></SimpleHeader>

            {/* Content */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
            >
                <Text style={styles.sectionTitle}>Сегодня</Text>

                {currentData.data && currentData.data.length > 0 ? (
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
                                    icon={icons[type]}
                                    type={formattedItem.type}
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
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        height: 60,
        paddingHorizontal: 16,
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        backgroundColor: "#19191A",
    },
    iconButton: {
        width: 28,
        height: 28,
        justifyContent: "center",
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "700",
        ...textStyles.white,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 160,
    },
    summaryCard: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    summaryLabel: {
        color: "#999",
        fontSize: 14,
        fontWeight: "500",
    },
    summaryValue: {
        fontSize: 24,
        fontWeight: "700",
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: "700",
        lineHeight: 28,
        marginBottom: 16,
        ...textStyles.white,
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
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyText: {
        fontSize: 16,
        ...textStyles.white,
    },
});
