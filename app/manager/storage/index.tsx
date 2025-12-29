import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    StatusBar,
    ActivityIndicator,
    FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { Day } from "@/src/client/types/waiter";
import { loadingStyles } from "@/src/client/styles/ui/loading.styles";
import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";

import { useManager } from "@/src/contexts/ManagerProvider";
import SegmentedControl from "@/src/client/components/Tabs";
import { OrderHistoryCard } from "@/src/client/components/reports/OrderHistoryItem";
import { icons } from "@/src/client/icons/icons";
import Entypo from "@expo/vector-icons/Entypo";
import DocumentCard, {
    DetailRow,
    CommentRow,
} from "@/src/client/components/DocumentCard";

import {
    WarehouseDocumentsItemType,
    WarehouseDocumentsOutput,
} from "@/src/server/types/storage";
import { getWarehouseDocuments } from "@/src/server/general/warehouse";

import { ReportHeader } from "@/src/client/components/reports/header";

const formatDataItem = (item: any, index: number, itemType: string) => {
    const tableNumber =
        item.name ||
        item.item ||
        item.reason ||
        item.source ||
        `Элемент ${index + 1}`;

    const rawAmount = item.amount || item.quantity || 0;
    const formattedAmount =
        typeof rawAmount === "number"
            ? `${rawAmount >= 0 ? "+" : ""}${rawAmount.toLocaleString("ru-RU")} тг`
            : rawAmount;

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

    const {
        selectedStorageTab,
        setSelectedStorageTab,
        queryInputs,
        setDate,
        setPeriod,
        setLocation,
    } = useManager();

    const [days, setDays] = useState<Day[]>([]);
    const [activeTab, setActiveTab] = useState<
        "receipts" | "inventory" | "writeoffs"
    >("receipts");
    const [receipts, setReceipts] = useState<
        WarehouseDocumentsItemType[] | null
    >(null);
    const [writeoffs, setWriteoffs] = useState<
        WarehouseDocumentsItemType[] | null
    >(null);
    const [inventory, setInventory] = useState<
        WarehouseDocumentsItemType[] | null
    >(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setSelectedStorageTab(activeTab);
    }, [activeTab, setSelectedStorageTab]);

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

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await getWarehouseDocuments({});

                const receipts = response.documents.filter(
                    (doc) => doc.document_type === "RECEIPT",
                );
                const writeoffs = response.documents.filter(
                    (doc) => doc.document_type === "WRITEOFF",
                );
                const inventory = response.documents.filter(
                    (doc) => doc.document_type === "INVENTORY",
                );
                setReceipts(receipts);
                setWriteoffs(writeoffs);
                setInventory(inventory);
            } catch (err: any) {
                setError(err.message || "Failed to fetch documents");
                console.error("Error fetching documents:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDocuments();
    }, []);

    const renderHeader = () => (
        <View style={styles.headerSection}>
            <ReportHeader
                title="Склад"
                date={queryInputs.date}
                period={queryInputs.period}
                location={queryInputs.organization_id}
                onBack={() => router.push("/manager")}
                onDateChange={setDate}
                onPeriodChange={setPeriod}
                onLocationChange={setLocation}
            />
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
        const formattedDate = (date: string | Date) => {
            const today = new Date(date);
            const day = today.getDate().toString().padStart(2, "0");
            const month = (today.getMonth() + 1).toString().padStart(2, "0");
            const year = today.getFullYear();
            return `${day}.${month}.${year}`;
        };

        let data = null;
        if (activeTab === "receipts") {
            console.log("receipts: ", receipts, " |");
            data = receipts;
        }
        if (activeTab === "inventory") {
            console.log("inventory: ", inventory, " |");
            data = inventory;
        }
        if (activeTab === "writeoffs") {
            console.log("writeoffs: ", writeoffs, " |");
            data = writeoffs;
        }

        const limitedData = data?.slice(0, 10) || [];

        if (!data || data.length === 0) {
            return (
                <View style={styles.listContainer}>
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateText}>
                            Нет документов для отображения
                        </Text>
                    </View>
                </View>
            );
        }

        return (
            <View style={styles.listContainer}>
                <FlatList
                    data={limitedData}
                    keyExtractor={(item) =>
                        item.id?.toString() || Math.random().toString()
                    }
                    renderItem={({ item }) => (
                        <DocumentCard
                            documentNumber={`${
                                activeTab === "receipts"
                                    ? "Поступление"
                                    : activeTab === "inventory"
                                      ? "Инвентаризация"
                                      : "Списание"
                            } №${item.document_number || item.id}`}
                            timestamp={formattedDate(item.date) || ""}
                            category={item.items[0]?.item_name || ""}
                            onPress={() => console.log("Pressed", item.id)}
                        >
                            <CommentRow comment={item.comment ?? ""} />
                        </DocumentCard>
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                    ItemSeparatorComponent={() => (
                        <View style={styles.cardSeparator} />
                    )}
                    scrollEnabled={false}
                />
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
                        {renderTabs()}
                        {renderItemList()}
                    </>
                )}
            </ScrollView>
            {renderAddButton()}
        </SafeAreaView>
    );
}

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
    card: {
        backgroundColor: "rgba(35, 35, 36, 1)",
        borderRadius: 20,
        padding: 12,
        gap: 16,
    },
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
    divider: {
        height: 1,
        backgroundColor: "rgba(43, 43, 44, 1)",
    },
    emptyState: {
        alignItems: "center",
        gap: 8,
        paddingVertical: 40,
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
        paddingHorizontal: 16,
        gap: 16,
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
    listContent: {
        paddingBottom: 0,
    },
    emptyStateText: {
        color: "rgba(255, 255, 255, 0.6)",
        fontSize: 16,
        textAlign: "center",
    },
    showMoreButton: {
        backgroundColor: "rgba(35, 35, 36, 1)",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 16,
    },
    showMoreText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    cardSeparator: {
        height: 16,
    },
});
