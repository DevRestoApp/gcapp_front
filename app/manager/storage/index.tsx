import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    StatusBar,
    FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

import { Day } from "@/src/client/types/waiter";
import { loadingStyles } from "@/src/client/styles/ui/loading.styles";
import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";

import { useManager } from "@/src/contexts/ManagerProvider";
import { useStorage } from "@/src/contexts/StorageProvider";

import SegmentedControl from "@/src/client/components/Tabs";
import Entypo from "@expo/vector-icons/Entypo";
import DocumentCard, {
    DetailRow,
    CommentRow,
} from "@/src/client/components/DocumentCard";

import {
    WarehouseDocumentsItemType,
    WarehouseDocumentsType,
} from "@/src/server/types/storage";
import { getWarehouseDocuments } from "@/src/server/general/warehouse";

import { ReportHeader } from "@/src/client/components/reports/header";
import Loading from "@/src/client/components/Loading";
import { ButtonStyles } from "@/src/client/styles/ui/buttons/Button.styles";
import { sizes } from "@/src/utils/utils";

const tabLabelMap: Record<string, string> = {
    incomingInvoice: "Приходная накладная",
    outgoingInvoice: "Расходная накладная",
    inventory: "Инвентаризация",
    writeoffs: "Акт списания",
};

export default function StorageScreen() {
    const router = useRouter();

    const {
        locations,
        setSelectedStorageTab,
        queryInputs,
        setDate,
        setPeriod,
        setLocation,
    } = useManager();

    const { setIsNew } = useStorage();

    const { setDocument } = useStorage();
    const [days, setDays] = useState<Day[]>([]);
    const [activeTab, setActiveTab] = useState<
        "incomingInvoice" | "outgoingInvoice" | "inventory" | "writeoffs"
    >("incomingInvoice");
    const [writeoffs, setWriteoffs] = useState<
        WarehouseDocumentsItemType[] | null
    >(null);
    const [inventory, setInventory] = useState<
        WarehouseDocumentsItemType[] | null
    >(null);
    const [incomingInvoice, setIncomingInvoice] = useState<
        WarehouseDocumentsItemType[] | null
    >(null);
    const [outgoingInvoice, setOutgoingInvoice] = useState<
        WarehouseDocumentsItemType[] | null
    >(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setSelectedStorageTab(activeTab);
    }, [activeTab, setSelectedStorageTab]);

    // Extract fetchDocuments as a standalone function
    const fetchDocuments = useCallback(async () => {
        try {
            // TODO проверить почему documents тянется 2 раза за раз
            setLoading(true);
            setError(null);

            const response = await getWarehouseDocuments({});

            setLoading(false);
            const writeoffs = response.documents.filter(
                (doc) => doc.document_type === "WRITEOFF",
            );
            const inventory = response.documents.filter(
                (doc) => doc.document_type === "INVENTORY",
            );
            const incomingInvoice = response.documents.filter(
                (doc) => doc.document_type === "INCOMING_INVOICE",
            );
            const outgoingInvoice = response.documents.filter(
                (doc) => doc.document_type === "OUTGOING_INVOICE",
            );
            setWriteoffs(writeoffs);
            setInventory(inventory);
            setIncomingInvoice(incomingInvoice);
            setOutgoingInvoice(outgoingInvoice);
        } catch (err: any) {
            setError(err.message || "Failed to fetch documents");
            console.error("Error fetching documents:", err);
        }
    }, []);

    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);

    // Refetch when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            fetchDocuments();
        }, [fetchDocuments]),
    );

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
                organizations={locations}
                showPeriodSelector={false}
            />
        </View>
    );

    const renderAddButton = () => {
        return (
            <TouchableOpacity
                onPress={() => {
                    setIsNew(true);
                    router.push(`/manager/storage/add`);
                }}
                style={ButtonStyles.addButtonManager}
                activeOpacity={0.7}
            >
                <Entypo name="plus" size={sizes.m} color="black" />
            </TouchableOpacity>
        );
    };

    const renderTabs = () => {
        const tabs = [
            { label: "Приходная накладная", value: "incomingInvoice" },
            { label: "Расходная накладная", value: "outgoingInvoice" },
            { label: "Инвентаризация", value: "inventory" },
            { label: "Акт списания", value: "writeoffs" },
        ];

        return (
            <SegmentedControl
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={(value) => {
                    setActiveTab(
                        value as
                            | "incomingInvoice"
                            | "outgoingInvoice"
                            | "inventory"
                            | "writeoffs",
                    );
                    setSelectedStorageTab(value);
                }}
                maxColumns={2}
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

        let data: WarehouseDocumentsType[] | null = [];
        if (activeTab === "incomingInvoice") {
            data = incomingInvoice;
        }
        if (activeTab === "outgoingInvoice") {
            data = outgoingInvoice;
        }
        if (activeTab === "inventory") {
            data = inventory;
        }
        if (activeTab === "writeoffs") {
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
                            documentNumber={`${tabLabelMap[activeTab]} №${item.document_number || item.id}`}
                            timestamp={formattedDate(item.date) || ""}
                            category={item.items[0]?.item_name || ""}
                            onPress={() => {
                                setDocument(item);
                                setIsNew(false);
                                router.push("/manager/storage/item");
                            }}
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
                        <Loading text={"Загрузка данных"} />
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
