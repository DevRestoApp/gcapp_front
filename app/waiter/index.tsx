import React, { useState, useEffect, useRef, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
    Pressable,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import EarningsCard from "@/src/client/components/waiter/EarningsCard";
import TimerCard from "@/src/client/components/waiter/TimerCard";
import MotivationCard from "@/src/client/components/waiter/MotivationCard";
import ActiveOrdersSection from "@/src/client/components/waiter/ActiveOrderSection";
import ShiftTimeModal from "@/src/client/components/modals/ShiftTimeModal";
import ShiftCloseModal, {
    ShiftCloseModalRef,
} from "@/src/client/components/modals/ShiftCloseModal";
import { ReportCalendar } from "@/src/client/components/reports/Calendar";

import { useWaiter } from "@/src/contexts/WaiterProvider";
import { useAuth } from "@/src/contexts/AuthContext";
import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";
import { ButtonStyles } from "@/src/client/styles/ui/buttons/Button.styles";

// ============================================================================
// Helpers
// ============================================================================

const formatDateForAPI = (date: Date): string =>
    date.toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

const parseDateStr = (str: string): Date => {
    const [day, month, year] = str.split(".");
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
};

// ============================================================================
// Component
// ============================================================================

export default function Index() {
    const router = useRouter();
    const { user, selectedLocation } = useAuth();
    const {
        fetchQuest,
        fetchShiftStatus,
        fetchOrders,
        startShift,
        endShift,
        shiftStatus,
        quests,
        orders,
        setSelectedOrderId,
        setSelectedOrder,
    } = useWaiter();

    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedDateStr, setSelectedDateStr] = useState<string>(() =>
        formatDateForAPI(new Date()),
    );
    const [showCalendar, setShowCalendar] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isStartingShift, setIsStartingShift] = useState(false);
    const [isEndingShift, setIsEndingShift] = useState(false);
    const [isRefreshingShift, setIsRefreshingShift] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const shiftCloseModalRef = useRef<ShiftCloseModalRef>(null);
    const isActive = shiftStatus?.isActive ?? false;

    // ========================================================================
    // Data fetching
    // ========================================================================

    const fetchData = useCallback(async () => {
        if (!selectedDate || !user?.id) return;

        setIsLoading(true);
        try {
            await Promise.all([
                fetchShiftStatus(user.id, {
                    date: formatDateForAPI(selectedDate),
                }),
                fetchQuest(user.id, { date: formatDateForAPI(selectedDate) }),
                fetchOrders({
                    user_id: user.id,
                    organization_id: selectedLocation,
                    date: formatDateForAPI(selectedDate),
                }),
            ]);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    }, [
        selectedDate,
        user?.id,
        fetchShiftStatus,
        fetchQuest,
        fetchOrders,
        selectedLocation,
    ]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleRefresh = useCallback(async () => {
        setIsRefreshing(true);
        try {
            await fetchData();
        } finally {
            setIsRefreshing(false);
        }
    }, [fetchData]);

    // ========================================================================
    // Handlers
    // ========================================================================

    const handleDateSelect = useCallback((dateStr: string) => {
        setSelectedDateStr(dateStr);
        setSelectedDate(parseDateStr(dateStr));
    }, []);

    const handleShiftStart = useCallback(async () => {
        if (!user?.id) throw new Error("User ID not found");

        setIsStartingShift(true);
        try {
            await startShift(user.id, selectedLocation);
            await fetchData();
        } catch (error) {
            console.error("Failed to start shift:", error);
            throw error;
        } finally {
            setIsStartingShift(false);
        }
    }, [user?.id, selectedLocation, startShift, fetchData]);

    const handleOpenCloseModal = useCallback(async () => {
        if (user?.id) {
            setIsRefreshingShift(true);
            try {
                await fetchShiftStatus(user.id, {
                    date: formatDateForAPI(selectedDate),
                });
            } finally {
                setIsRefreshingShift(false);
            }
        }
        shiftCloseModalRef.current?.open();
    }, [user?.id, selectedDate, fetchShiftStatus]);

    const handleCloseShift = useCallback(
        async (data: {
            startTime: string;
            endTime: string;
            sales_total: number;
            sales_number: number;
            duration: string;
        }) => {
            if (!user?.id) return;

            setIsEndingShift(true);
            try {
                await endShift(user.id, selectedLocation);

                await fetchData();
            } catch (error) {
                console.error("Failed to end shift:", error);
            } finally {
                setIsEndingShift(false);
            }
        },
        [user?.id, selectedLocation, endShift, fetchData],
    );

    const handleOrderClick = useCallback(
        (itemId: number, item: any) => {
            setSelectedOrderId(itemId);
            setSelectedOrder(item);
            router.push({
                pathname: "/waiter/order",
                params: {
                    orderId: String(itemId),
                    orderData: JSON.stringify(item),
                    date: formatDateForAPI(selectedDate),
                },
            });
        },
        [setSelectedOrderId, setSelectedOrder, router, selectedDate],
    );

    // ========================================================================
    // Render helpers
    // ========================================================================

    const renderMotivationCard = () => {
        if (!quests?.length) return null;
        const percentage = (quests[0].current / quests[0].target) * 100;
        return (
            <View style={styles.motivationContainer}>
                <TouchableOpacity
                    onPress={() => router.push("/waiter/motivation")}
                >
                    <MotivationCard
                        goalText={quests[0].description || ""}
                        targetAmount={String(quests[0].target)}
                        currentProgress={String(quests[0].current)}
                        progressPercentage={percentage}
                    />
                </TouchableOpacity>
            </View>
        );
    };

    // ========================================================================
    // Loading state
    // ========================================================================

    if (isLoading && !shiftStatus) {
        return (
            <SafeAreaView
                style={[styles.container, backgroundsStyles.generalBg]}
            >
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Смена</Text>
                </View>
                <View style={styles.filtersContainer}>
                    <TouchableOpacity
                        style={styles.filterButton}
                        onPress={() => setShowCalendar(true)}
                    >
                        <Ionicons
                            name="calendar-outline"
                            size={20}
                            color="#FFFFFF"
                        />
                        <Text style={styles.filterText}>{selectedDateStr}</Text>
                    </TouchableOpacity>
                </View>
                <ReportCalendar
                    visible={showCalendar}
                    onClose={() => setShowCalendar(false)}
                    onDateSelect={handleDateSelect}
                    initialDate={selectedDateStr}
                />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#fff" />
                    <Text style={styles.loadingText}>Загрузка...</Text>
                </View>
            </SafeAreaView>
        );
    }

    // ========================================================================
    // Main render
    // ========================================================================

    return (
        <SafeAreaView style={[styles.container, backgroundsStyles.generalBg]}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Смена</Text>
            </View>

            <View style={styles.filtersContainer}>
                <TouchableOpacity
                    style={styles.filterButton}
                    onPress={() => setShowCalendar(true)}
                >
                    <Ionicons
                        name="calendar-outline"
                        size={20}
                        color="#FFFFFF"
                    />
                    <Text style={styles.filterText}>{selectedDateStr}</Text>
                </TouchableOpacity>
            </View>

            <ReportCalendar
                visible={showCalendar}
                onClose={() => setShowCalendar(false)}
                onDateSelect={handleDateSelect}
                initialDate={selectedDateStr}
            />

            {isActive ? (
                <ScrollView
                    style={styles.activeShiftContainer}
                    contentContainerStyle={styles.activeShiftContent}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={handleRefresh}
                            tintColor="#fff"
                        />
                    }
                >
                    <View style={styles.row}>
                        <View style={styles.half}>
                            <TimerCard
                                startTime={shiftStatus?.startTime || ""}
                            />
                        </View>
                        <View style={styles.half}>
                            <EarningsCard
                                amount={
                                    shiftStatus?.totalEarnings?.toString() ||
                                    "0"
                                }
                            />
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {renderMotivationCard()}

                    {orders && (
                        <ActiveOrdersSection
                            orders={orders}
                            isLoading={isLoading}
                            onOrderClick={handleOrderClick}
                            showStatus={true}
                            date={formatDateForAPI(selectedDate)}
                        />
                    )}

                    <View style={styles.endShiftButtonContainer}>
                        <Pressable
                            style={[
                                ButtonStyles.buttonWhite,
                                styles.endShiftButton,
                                (isEndingShift || isRefreshingShift) &&
                                    styles.buttonDisabled,
                            ]}
                            onPress={handleOpenCloseModal}
                            disabled={isEndingShift || isRefreshingShift}
                        >
                            {isEndingShift || isRefreshingShift ? (
                                <ActivityIndicator
                                    size="small"
                                    color="#2C2D2E"
                                />
                            ) : (
                                <Text style={styles.endShiftButtonText}>
                                    Закончить смену
                                </Text>
                            )}
                        </Pressable>
                    </View>

                    <ShiftCloseModal
                        ref={shiftCloseModalRef}
                        startTime={shiftStatus?.startTime || "09:00"}
                        elapsedTime={shiftStatus?.elapsedTime || "00:00:00"}
                        sales_total={shiftStatus?.totalOrders || 0}
                        sales_number={shiftStatus?.totalEarnings || 0}
                        onCloseShift={handleCloseShift}
                        onCancel={() => {}}
                    />
                </ScrollView>
            ) : (
                <ScrollView
                    style={styles.main}
                    contentContainerStyle={styles.inactiveShiftContent}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={handleRefresh}
                            tintColor="#fff"
                        />
                    }
                >
                    <Text style={styles.greetingSmall}>
                        Добрый день, {user?.name || "Адилет"}!
                    </Text>
                    <Text style={styles.greetingBig}>
                        Начните сегодняшнюю смену
                    </Text>
                    <View style={styles.card}>
                        <ShiftTimeModal
                            type="start"
                            onShiftStart={handleShiftStart}
                            isLoading={isStartingShift}
                        />
                    </View>
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
    container: { flex: 1 },

    header: {
        paddingHorizontal: 16,
        height: 56,
        justifyContent: "center",
    },
    headerTitle: {
        color: "#fff",
        fontSize: 32,
        fontWeight: "600",
        letterSpacing: -0.24,
    },
    filtersContainer: {
        flexDirection: "row",
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    filterButton: {
        flexDirection: "row",
        paddingHorizontal: 12,
        paddingVertical: 12,
        alignItems: "center",
        gap: 4,
        borderRadius: 16,
        backgroundColor: "#1C1C1E",
    },
    filterText: {
        color: "#FFFFFF",
        fontSize: 16,
        lineHeight: 20,
    },

    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
    },
    loadingText: { color: "#fff", fontSize: 16 },
    refreshIndicator: {
        position: "absolute",
        top: 8,
        right: 16,
        zIndex: 10,
    },
    buttonDisabled: { opacity: 0.6 },

    main: { flex: 1 },
    inactiveShiftContent: {
        alignItems: "center",
        paddingHorizontal: 16,
    },
    greetingSmall: { fontSize: 16, color: "#aaa", marginBottom: 4 },
    greetingBig: {
        fontSize: 20,
        color: "#fff",
        fontWeight: "700",
        marginBottom: 16,
    },
    card: {
        width: "100%",
        borderRadius: 16,
        padding: 16,
        marginTop: 16,
    },

    activeShiftContainer: { flex: 1 },
    activeShiftContent: { padding: 16, paddingBottom: 32 },
    row: { flexDirection: "row", gap: 16, marginBottom: 16 },
    half: { flex: 1 },
    divider: {
        height: 1,
        backgroundColor: "rgba(255,255,255,0.2)",
        marginBottom: 16,
    },
    motivationContainer: { marginBottom: 16 },
    endShiftButtonContainer: { marginTop: 24, width: "100%" },
    endShiftButton: { width: "100%" },
    endShiftButtonText: {
        color: "#2C2D2E",
        fontWeight: "600",
        fontSize: 16,
    },
});
