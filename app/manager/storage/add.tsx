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

import { loadingStyles } from "@/src/client/styles/ui/loading.styles";
import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";

import { useManager } from "@/src/contexts/ManagerProvider";

import { Ionicons } from "@expo/vector-icons";
import StorageForm from "./forms";

export default function AddScreen() {
    const router = useRouter();
    // Get data from context instead of local state
    const { loading, setDate: setInputDate, selectedStorageTab } = useManager();

    // ... keep calendar initialization and handleDayPress ...
    const renderHeader = () => {
        const names = {
            receipts: "Поступления",
            inventory: "Инвентаризация",
            writeoffs: "Списания",
        };
        return (
            <View style={styles.headerSection}>
                <View style={styles.headerRow}>
                    <TouchableOpacity
                        onPress={() => router.replace("/manager/storage")}
                        style={styles.backButton}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Ionicons
                            name="chevron-back"
                            size={28}
                            color="#FFFFFF"
                        />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>
                        {names[selectedStorageTab]}
                    </Text>
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

                        {StorageForm()}
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
