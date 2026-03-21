import React, { useState, useEffect, useRef, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";

import Calendar from "@/src/client/components/Calendar";
import EarningsCard from "@/src/client/components/waiter/EarningsCard";
import TimerCard from "@/src/client/components/waiter/TimerCard";
import MotivationCard from "@/src/client/components/waiter/MotivationCard";
import ActiveOrdersSection from "@/src/client/components/waiter/ActiveOrderSection";
import ShiftTimeModal from "@/src/client/components/modals/ShiftTimeModal";
import ShiftCloseModal, {
    ShiftCloseModalRef,
} from "@/src/client/components/modals/ShiftCloseModal";

import { useWaiter } from "@/src/contexts/WaiterProvider";
import { useAuth } from "@/src/contexts/AuthContext";
import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";
import { ButtonStyles } from "@/src/client/styles/ui/buttons/Button.styles";
import { Day } from "@/src/client/types/waiter";

// ============================================================================
// Helpers
// ============================================================================

const formatDateForAPI = (date: Date): string =>
    date.toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

const buildWeekDays = (): Day[] => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() - (6 - i));
        return {
            date: date.getDate().toString(),
            day: date.toLocaleDateString("ru-RU", { weekday: "short" }),
            active: i === 6,
        };
    });
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
    console.log("quests: ", quests);

    const [days, setDays] = useState<Day[]>(() => buildWeekDays());
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [isLoading, setIsLoading] = useState(false);
    const [isStartingShift, setIsStartingShift] = useState(false);
    const [isEndingShift, setIsEndingShift] = useState(false);

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

    // ========================================================================
    // Handlers
    // ========================================================================

    const handleDayPress = useCallback((index: number) => {
        setDays((prev) => prev.map((d, i) => ({ ...d, active: i === index })));

        const today = new Date();
        const pressed = new Date(today);
        pressed.setDate(today.getDate() - (6 - index));
        setSelectedDate(pressed);
    }, []);

    const handleShiftStart = useCallback(async () => {
        if (!user?.id) throw new Error("User ID not found");

        setIsStartingShift(true);
        try {
            await startShift(user.id, selectedLocation);
            console.log("selectedLocation: ", selectedLocation);
            await fetchData();
        } catch (error) {
            console.error("Failed to start shift:", error);
            throw error;
        } finally {
            setIsStartingShift(false);
        }
    }, [user?.id, selectedLocation, startShift, fetchData]);

    const handleOpenCloseModal = useCallback(() => {
        shiftCloseModalRef.current?.open();
    }, []);

    const handleCloseShift = useCallback(
        async (data: {
            startTime: string;
            endTime: string;
            totalOrdersSold: number;
            totalRevenue: number;
            duration: string;
        }) => {
            if (!user?.id) return;

            setIsEndingShift(true);
            try {
                await endShift(user.id, selectedLocation);

                console.log("selectedLocation: ", selectedLocation);
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
                },
            });
        },
        [setSelectedOrderId, setSelectedOrder, router],
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
            <View style={[styles.container, backgroundsStyles.generalBg]}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Смена</Text>
                </View>
                <Calendar days={days} onDayPress={handleDayPress} />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#fff" />
                    <Text style={styles.loadingText}>Загрузка...</Text>
                </View>
            </View>
        );
    }

    // ========================================================================
    // Main render
    // ========================================================================

    return (
        <View style={[styles.container, backgroundsStyles.generalBg]}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Смена</Text>
            </View>

            <Calendar days={days} onDayPress={handleDayPress} />

            {isActive ? (
                <ScrollView
                    style={styles.activeShiftContainer}
                    contentContainerStyle={styles.activeShiftContent}
                >
                    {isLoading && (
                        <View style={styles.refreshIndicator}>
                            <ActivityIndicator size="small" color="#fff" />
                        </View>
                    )}

                    <View style={styles.row}>
                        <View style={styles.half}>
                            <TimerCard
                                timeElapsed={
                                    shiftStatus?.elapsedTime || "00:00:00"
                                }
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
                        />
                    )}

                    <View style={styles.endShiftButtonContainer}>
                        <Pressable
                            style={[
                                ButtonStyles.buttonWhite,
                                styles.endShiftButton,
                                isEndingShift && styles.buttonDisabled,
                            ]}
                            onPress={handleOpenCloseModal}
                            disabled={isEndingShift}
                        >
                            {isEndingShift ? (
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
                        totalOrdersSold={shiftStatus?.totalOrders || 0}
                        totalRevenue={shiftStatus?.totalEarnings || 0}
                        onCloseShift={handleCloseShift}
                        onCancel={() => {}}
                    />
                </ScrollView>
            ) : (
                <ScrollView
                    style={styles.main}
                    contentContainerStyle={styles.inactiveShiftContent}
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
        </View>
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
