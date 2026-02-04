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
import Calendar from "@/src/client/components/Calendar";
import { Day } from "@/src/client/types/waiter";
import ShiftTimeModal from "@/src/client/components/modals/ShiftTimeModal";
import ShiftCloseModal, {
    ShiftCloseModalRef,
} from "@/src/client/components/modals/ShiftCloseModal";
import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";
import { ButtonStyles } from "@/src/client/styles/ui/buttons/Button.styles";

import EarningsCard from "@/src/client/components/waiter/EarningsCard";
import TimerCard from "@/src/client/components/waiter/TimerCard";
import MotivationCard from "@/src/client/components/waiter/MotivationCard";
import ActiveOrdersSection from "@/src/client/components/waiter/ActiveOrderSection";

import { useWaiter } from "@/src/contexts/WaiterProvider";
import { useAuth } from "@/src/contexts/AuthContext";
import { useRouter } from "expo-router";

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
    } = useWaiter();

    const [days, setDays] = useState<Day[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [isLoading, setIsLoading] = useState(false);
    const [isStartingShift, setIsStartingShift] = useState(false);
    const [isEndingShift, setIsEndingShift] = useState(false);
    const shiftCloseModalRef = useRef<ShiftCloseModalRef>(null);

    // Initialize calendar once on mount
    useEffect(() => {
        initializeCalendar();
    }, []);

    // Fetch data when dependencies change
    const fetchData = useCallback(async () => {
        if (!selectedDate || !user?.id) return;

        setIsLoading(true);
        try {
            const formattedDate = formatDateForAPI(selectedDate);

            // Execute all fetches in parallel for better performance
            await Promise.all([
                fetchShiftStatus(user.id, { date: formattedDate }),
                fetchQuest(user.id, { date: formattedDate }),
                fetchOrders({ user_id: user.id }),
            ]);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    }, [selectedDate, user?.id, fetchShiftStatus, fetchQuest, fetchOrders]);

    // Fetch data when selected date or user changes
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const initializeCalendar = () => {
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
        setSelectedDate(today);
    };

    const formatDateForAPI = (date: Date): string => {
        return date.toLocaleDateString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const handleDayPress = (index: number) => {
        setDays((prev) => prev.map((d, i) => ({ ...d, active: i === index })));

        const today = new Date();
        const pressedDate = new Date(today);
        pressedDate.setDate(today.getDate() - (6 - index));

        setSelectedDate(pressedDate);
    };

    const handleShiftStart = async () => {
        if (!user?.id) {
            console.error("User ID not found");
            throw new Error("User ID not found");
        }

        setIsStartingShift(true);
        try {
            await startShift(user.id, selectedLocation || null);

            // Refresh data after starting shift
            await fetchData();
        } catch (error) {
            console.error("Failed to start shift:", error);
            throw error;
        } finally {
            setIsStartingShift(false);
        }
    };

    const handleOpenCloseModal = () => {
        shiftCloseModalRef.current?.open();
    };

    const handleCloseShift = async (data: {
        startTime: string;
        endTime: string;
        totalOrdersSold: number;
        totalRevenue: number;
        duration: string;
    }) => {
        if (!user?.id) {
            console.error("User ID not found");
            return;
        }

        setIsEndingShift(true);
        try {
            await endShift(user.id, selectedLocation || null);

            console.log("Shift closed:", data);

            // Refresh data after ending shift
            await fetchData();

            // TODO: Navigate to report or summary screen
        } catch (error) {
            console.error("Failed to end shift:", error);
        } finally {
            setIsEndingShift(false);
        }
    };

    const handleCancelClose = () => {
        console.log("Shift close canceled");
    };

    const renderMotivationCard = () => {
        if (quests && quests.length > 0) {
            return (
                <View style={styles.motivationContainer}>
                    <TouchableOpacity
                        onPress={() => router.push("/waiter/motivation")}
                    >
                        <MotivationCard
                            goalText={quests[0].description || ""}
                            targetAmount={String(quests[0].target)}
                            currentProgress={String(quests[0].current)}
                            progressPercentage={15}
                        />
                    </TouchableOpacity>
                </View>
            );
        }
        return null;
    };

    const renderOrderCard = () => {
        if (!orders) {
            return null;
        }
        return <ActiveOrdersSection orders={orders} isLoading={isLoading} />;
    };

    const isActive = shiftStatus?.isActive || false;

    // Loading state UI
    if (isLoading && !shiftStatus) {
        return (
            <View
                style={{ ...styles.container, ...backgroundsStyles.generalBg }}
            >
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

    return (
        <View style={{ ...styles.container, ...backgroundsStyles.generalBg }}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Смена</Text>
            </View>

            <Calendar days={days} onDayPress={handleDayPress} />

            {isActive ? (
                <ScrollView
                    style={styles.activeShiftContainer}
                    contentContainerStyle={styles.activeShiftContent}
                >
                    {/* Loading overlay for data refresh */}
                    {isLoading && (
                        <View style={styles.refreshIndicator}>
                            <ActivityIndicator size="small" color="#fff" />
                        </View>
                    )}

                    {/* Top row - Timer and Earnings */}
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

                    {/* Divider */}
                    <View style={styles.divider} />

                    {/* Motivation Card */}
                    {renderMotivationCard()}

                    {/* Active Orders */}
                    {renderOrderCard()}

                    {/* End Shift Button */}
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

                    {/* Close Shift Modal */}
                    <ShiftCloseModal
                        ref={shiftCloseModalRef}
                        startTime={shiftStatus?.startTime || "09:00"}
                        totalOrdersSold={shiftStatus?.totalOrders || 0}
                        totalRevenue={shiftStatus?.totalEarnings || 0}
                        onCloseShift={handleCloseShift}
                        onCancel={handleCancelClose}
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
                        <Text style={styles.cardSubtitle}>Цель на сегодня</Text>
                        <Text style={styles.cardTitle}>
                            Обслуживать 15 стол
                        </Text>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    // Header
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

    // Loading states
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
    },
    loadingText: {
        color: "#fff",
        fontSize: 16,
    },
    refreshIndicator: {
        position: "absolute",
        top: 8,
        right: 16,
        zIndex: 10,
    },
    buttonDisabled: {
        opacity: 0.6,
    },

    // Inactive shift styles
    main: {
        flex: 1,
    },
    inactiveShiftContent: {
        alignItems: "center",
        paddingHorizontal: 16,
    },
    greetingSmall: {
        fontSize: 16,
        color: "#aaa",
        marginBottom: 4,
    },
    greetingBig: {
        fontSize: 20,
        color: "#fff",
        fontWeight: "700",
        marginBottom: 16,
    },
    card: {
        width: "100%",
        backgroundColor: "#1E1E1E",
        borderRadius: 16,
        padding: 16,
        marginTop: 16,
    },
    cardSubtitle: {
        fontSize: 14,
        color: "#aaa",
        marginBottom: 4,
    },
    cardTitle: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "600",
        marginBottom: 16,
    },

    // Active shift styles
    activeShiftContainer: {
        flex: 1,
    },
    activeShiftContent: {
        padding: 16,
        paddingBottom: 32,
    },
    row: {
        flexDirection: "row",
        gap: 16,
        marginBottom: 16,
    },
    half: {
        flex: 1,
    },
    divider: {
        height: 1,
        backgroundColor: "rgba(255,255,255,0.2)",
        marginBottom: 16,
    },
    motivationContainer: {
        marginBottom: 16,
    },
    endShiftButtonContainer: {
        marginTop: 24,
        width: "100%",
    },
    endShiftButton: {
        width: "100%",
    },
    endShiftButtonText: {
        color: "#2C2D2E",
        fontWeight: "600",
        fontSize: 16,
    },
});
