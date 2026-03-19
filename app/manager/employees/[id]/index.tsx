import React, { useState, useRef, useEffect, useCallback } from "react";
import {
    TouchableOpacity,
    ScrollView,
    StatusBar,
    StyleSheet,
    View,
    Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import { useRouter, useLocalSearchParams } from "expo-router";
import Svg, { Path } from "react-native-svg";

import { useEmployee } from "@/src/contexts/EmployeeContext";
import { useManager } from "@/src/contexts/ManagerProvider";
import { ModalWrapperRef } from "@/src/client/components/modals/ModalWrapper";
import EmployeeCard from "@/src/client/components/ceo/EmployeeCard";
import DropdownMenuDots from "@/src/client/components/DropdownMenuDots";
import Loading from "@/src/client/components/Loading";
import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";
import ActiveOrdersSection from "@/src/client/components/waiter/ActiveOrderSection";
import SegmentedControl from "@/src/client/components/Tabs";

export default function EmployeeDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    const { selectedEmployee } = useEmployee();
    const { fetchEmployeeOrders } = useManager();

    const editModalRef = useRef<ModalWrapperRef>(null);
    const dropdownRef = useRef<any>(null);

    const [activeTab, setActiveTab] = useState<"info" | "history">("info");
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingOrderId, setLoadingOrderId] = useState<number | null>(null);

    const tabs = [{ label: "Информация", value: "info" }];

    // ── Fetch orders on mount ─────────────────────────────────────────────────

    useEffect(() => {
        if (!selectedEmployee) return;

        const loadOrders = async () => {
            setIsLoading(true);
            try {
                const userId =
                    selectedEmployee.id !== 322256 ? selectedEmployee.id : 10;
                const response = await fetchEmployeeOrders({
                    user_id: userId,
                });
                const filtered = response.orders.filter(
                    (order) => order.status === "CREATED",
                );
                setOrders(filtered);
            } catch (error) {
                console.error("Error fetching employee orders:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadOrders();
    }, [selectedEmployee?.id]);

    // ── Handlers ──────────────────────────────────────────────────────────────

    const handleOrderClick = useCallback(
        ({ itemId, item }: { itemId: string; item: any }) => {
            const orderId = Number(itemId);
            setLoadingOrderId(orderId);
            router.push({
                pathname: `/manager/employees/${id}/order/${itemId}`,
                params: { orderData: JSON.stringify(item) },
            });
            setTimeout(() => setLoadingOrderId(null), 500);
        },
        [id, router],
    );

    // ── Guard ─────────────────────────────────────────────────────────────────

    if (!selectedEmployee) {
        return (
            <SafeAreaView
                style={[styles.container, backgroundsStyles.generalBg]}
            >
                <StatusBar
                    barStyle="light-content"
                    backgroundColor="rgba(25, 25, 26, 1)"
                />
                <Loading text="Загрузка..." />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, backgroundsStyles.generalBg]}>
            <StatusBar
                barStyle="light-content"
                backgroundColor="rgba(25, 25, 26, 1)"
            />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.headerButton}
                        activeOpacity={0.7}
                    >
                        <Svg
                            width="28"
                            height="28"
                            viewBox="0 0 28 28"
                            fill="none"
                        >
                            <Path
                                d="M9.58992 14.8405C9.42578 14.6765 9.33346 14.4541 9.33325 14.2221V13.7788C9.33594 13.5473 9.42789 13.3258 9.58992 13.1605L15.5866 7.17548C15.6961 7.06505 15.8452 7.00293 16.0008 7.00293C16.1563 7.00293 16.3054 7.06505 16.4149 7.17548L17.2433 8.00381C17.353 8.11134 17.4148 8.25851 17.4148 8.41215C17.4148 8.56578 17.353 8.71295 17.2433 8.82048L12.0516 14.0005L17.2433 19.1805C17.3537 19.29 17.4158 19.4391 17.4158 19.5946C17.4158 19.7502 17.3537 19.8993 17.2433 20.0088L16.4149 20.8255C16.3054 20.9359 16.1563 20.998 16.0008 20.998C15.8452 20.998 15.6961 20.9359 15.5866 20.8255L9.58992 14.8405Z"
                                fill="white"
                            />
                        </Svg>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Сотрудники</Text>
                    <DropdownMenuDots ref={dropdownRef}>
                        <TouchableOpacity
                            style={styles.headerMenuItem}
                            onPress={() => {
                                dropdownRef.current?.close();
                                editModalRef.current?.open();
                            }}
                        >
                            <Feather name="edit" size={20} color="white" />
                            <Text style={styles.headerMenuTitle}>
                                Редактировать время
                            </Text>
                        </TouchableOpacity>
                    </DropdownMenuDots>
                </View>

                {/* Segmented Control */}
                <SegmentedControl
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={(value) =>
                        setActiveTab(value as "info" | "history")
                    }
                />

                {/* Info Tab */}
                {activeTab === "info" && (
                    <View style={styles.contentContainer}>
                        <EmployeeCard
                            name={selectedEmployee.name}
                            amount=""
                            avatar={selectedEmployee.avatarUrl || undefined}
                            role={selectedEmployee.role}
                            totalAmount={selectedEmployee.totalAmount}
                            shiftTime={selectedEmployee.shiftTime}
                            variant="full"
                            showStats
                            onPress={() => {}}
                        />
                        <ActiveOrdersSection
                            orders={orders}
                            isLoading={isLoading}
                            onOrderClick={handleOrderClick}
                            showStatus={true}
                            showAddOrderButton={false}
                            disableDefaultOrderClickPush={true}
                        />
                    </View>
                )}

                {/* History Tab */}
                {activeTab === "history" && (
                    <View style={styles.contentContainer}>
                        <Text style={styles.sectionTitle}>История</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollView: { flex: 1 },
    scrollContent: { paddingBottom: 166 },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: 56,
        paddingHorizontal: 16,
        backgroundColor: "rgba(25, 25, 26, 1)",
    },
    headerButton: {
        width: 28,
        height: 28,
        alignItems: "center",
        justifyContent: "center",
    },
    headerTitle: {
        color: "#FFFFFF",
        fontSize: 20,
        fontWeight: "600",
        lineHeight: 28,
        letterSpacing: -0.24,
    },
    headerMenuItem: {
        flexDirection: "row",
        paddingVertical: 6,
        paddingHorizontal: 10,
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: 12,
        gap: 6,
    },
    headerMenuTitle: {
        color: "#FFFFFF",
        fontSize: 16,
    },
    contentContainer: {
        paddingHorizontal: 16,
        paddingTop: 28,
        gap: 28,
    },
    sectionTitle: {
        color: "#FFFFFF",
        fontSize: 24,
        fontWeight: "700",
        lineHeight: 28,
    },
});
