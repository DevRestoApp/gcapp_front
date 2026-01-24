import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Calendar from "@/src/client/components/Calendar";
import { Day } from "@/src/client/types/waiter";
import ActiveShiftWrapper from "@/src/client/components/waiter/ActiveShiftWrapper";
import ShiftTimeModal from "@/src/client/components/modals/ShiftTimeModal";
import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";

import { useWaiter } from "@/src/contexts/WaiterProvider";
import { useAuth } from "@/src/contexts/AuthContext";

export default function Index() {
    const { user } = useAuth();
    const { fetchShiftStatus, startShift, shiftStatus } = useWaiter();
    const [days, setDays] = useState<Day[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    useEffect(() => {
        initializeCalendar();
    }, []);

    // Fetch shift status when selected date changes
    useEffect(() => {
        if (selectedDate && user?.id) {
            const formattedDate = formatDateForAPI(selectedDate);
            fetchShiftStatus(user.id, { date: formattedDate });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDate, user?.id]); // Only depend on selectedDate and user.id

    const initializeCalendar = () => {
        const today = new Date();
        const weekDays: Day[] = [];

        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() - (6 - i));

            weekDays.push({
                date: date.getDate().toString(),
                day: date.toLocaleDateString("ru-RU", { weekday: "short" }),
                active: i === 6, // Last day is active by default
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
        // Update active day in calendar
        setDays((prev) => prev.map((d, i) => ({ ...d, active: i === index })));

        // Calculate the actual date for the pressed day
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
            // organization_id can be null as per requirements
            await startShift(user.id, user.organization_id || null);
        } catch (error) {
            console.error("Failed to start shift:", error);
            throw error; // Re-throw so modal can handle it
        }
    };

    // Determine if shift is active based on shiftStatus from context
    const isActive = shiftStatus?.isActive || false;

    return (
        <View style={{ ...styles.container, ...backgroundsStyles.generalBg }}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Смена</Text>
            </View>

            <Calendar days={days} onDayPress={handleDayPress} />

            {isActive ? (
                <ScrollView>
                    <ActiveShiftWrapper />
                </ScrollView>
            ) : (
                <ScrollView
                    style={styles.main}
                    contentContainerStyle={{ alignItems: "center" }}
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
    container: { flex: 1 },

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

    main: { flex: 1 },
    greetingSmall: { fontSize: 16, color: "#aaa", marginBottom: 4 },
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
    cardSubtitle: { fontSize: 14, color: "#aaa", marginBottom: 4 },
    cardTitle: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "600",
        marginBottom: 16,
    },
});
