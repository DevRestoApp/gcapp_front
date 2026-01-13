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

import { loadingStyles } from "@/src/client/styles/ui/loading.styles";
import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";

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
import { HeaderSimple } from "@/src/client/components/reports/headerSimple";

export default function StorageScreen() {
    const { document } = useStorage();
    const router = useRouter();
    console.log("doc", document);

    console.log(document);
    const type =
        document?.type === "receipts"
            ? "Поступление"
            : document?.type === "inventory"
              ? "Инвентаризация"
              : "Списание";

    const renderAddButton = () => {
        return (
            <TouchableOpacity
                onPress={() => router.push(`/manager/storage/addItem`)}
                style={ButtonStyles.addButtonManager}
                activeOpacity={0.7}
            >
                <Entypo name="plus" size={sizes.m} color="black" />
            </TouchableOpacity>
        );
    };

    const renderHeader = () => (
        <View style={styles.headerSection}>
            <HeaderSimple
                title={type}
                onBack={() => router.push("/manager/storage")}
            />
        </View>
    );

    const renderItemList = () => {
        const formattedDate = (date: string | Date) => {
            const today = new Date(date);
            const day = today.getDate().toString().padStart(2, "0");
            const month = (today.getMonth() + 1).toString().padStart(2, "0");
            const year = today.getFullYear();
            return `${day}.${month}.${year}`;
        };
        const data = document?.items;

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
                    data={data}
                    keyExtractor={(item) =>
                        item.id?.toString() || Math.random().toString()
                    }
                    renderItem={({ item }) => (
                        <DocumentCard
                            documentNumber={item?.item_name || ""}
                            timestamp={formattedDate(item.created_at) || ""}
                            category=""
                            onPress={() => {}}
                        >
                            <DetailRow label={"Цена"} value={item.price} />
                            <DetailRow
                                label={"Количество"}
                                value={item.amount}
                            />
                            <DetailRow label={"asd"} value={"zxc"} />
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

            {renderHeader()}

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {renderItemList()}
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
