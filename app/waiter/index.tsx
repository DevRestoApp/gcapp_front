import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    TouchableOpacity,
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
    const { user } = useAuth();
    const {
        fetchQuest,
        fetchShiftStatus,
        fetchOrder,
        startShift,
        endShift,
        shiftStatus,
        quests,
        orders,
    } = useWaiter();
    const [days, setDays] = useState<Day[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const shiftCloseModalRef = useRef<ShiftCloseModalRef>(null);

    useEffect(() => {
        initializeCalendar();
    }, []);

    // Fetch shift status when selected date changes
    useEffect(() => {
        if (!selectedDate || !user?.id) return;

        const run = async () => {
            const formattedDate = formatDateForAPI(selectedDate);

            await fetchShiftStatus(user.id, { date: formattedDate });
            await fetchQuest(user.id, { date: formattedDate });
            await fetchOrder({
                user_id: user.id,
            });
        };

        run();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDate, user?.id]);

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

        try {
            await startShift(user.id, user.organization_id || null);

            // Refresh shift status after starting
            const formattedDate = formatDateForAPI(selectedDate);
            await fetchShiftStatus(user.id, { date: formattedDate });
        } catch (error) {
            console.error("Failed to start shift:", error);
            throw error;
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

        try {
            await endShift(user.id, user.organization_id || null);

            console.log("Shift closed:", data);

            // Refresh shift status after ending
            const formattedDate = formatDateForAPI(selectedDate);
            await fetchShiftStatus(user.id, { date: formattedDate });

            // TODO: Navigate to report or summary screen
        } catch (error) {
            console.error("Failed to end shift:", error);
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
        } else {
            return <View></View>;
        }
    };

    const renderOrderCard = () => {
        return <ActiveOrdersSection orders={orders} />;
    };

    // const isActive = shiftStatus?.isActive || false;
    const isActive = true; //tempo

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

                    {/* Motivation Card
                     //TODO добавить апи
                     */}

                    {renderMotivationCard()}

                    {/* Active Orders
                     // TODO add api for orders
                     */}
                    {renderOrderCard()}

                    {/* End Shift Button */}
                    <View style={styles.endShiftButtonContainer}>
                        <Pressable
                            style={[
                                ButtonStyles.buttonWhite,
                                styles.endShiftButton,
                            ]}
                            onPress={handleOpenCloseModal}
                        >
                            <Text style={styles.endShiftButtonText}>
                                Закончить смену
                            </Text>
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
