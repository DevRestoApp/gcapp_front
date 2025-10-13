import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from "react-native";
import Calendar from "@/src/client/components/Calendar";
import { Day } from "@/src/client/types/waiter";
import ActiveShiftWrapper from "@/src/client/components/waiter/ActiveShiftWrapper";
import ShiftTimeModal from "@/src/client/components/modals/ShiftTimeModal";

// TODO переписать на получение из storage либо из базы
const isActive = false;

export default function Index() {
    const [days, setDays] = useState<Day[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>("");

    useEffect(() => {
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

        // Set today's date as selected
        const todayStr = today.toLocaleDateString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
        setSelectedDate(todayStr);
    }, []);

    const handleDayPress = (index: number) => {
        // положить какую нибудь логику по нажатию на день календаря
        setDays((prev) => prev.map((d, i) => ({ ...d, active: i === index })));
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Смена</Text>
            </View>

            {/* Календарь */}
            <Calendar days={days} onDayPress={handleDayPress} />

            {/* Контент */}

            {isActive ? (
                <ScrollView>
                    <ActiveShiftWrapper></ActiveShiftWrapper>
                </ScrollView>
            ) : (
                <ScrollView
                    style={styles.main}
                    contentContainerStyle={{ alignItems: "center" }}
                >
                    <Text style={styles.greetingSmall}>
                        Добрый день, Адилет!
                    </Text>
                    <Text style={styles.greetingBig}>
                        Начните сегодняшнюю смену
                    </Text>

                    <View style={styles.card}>
                        <Text style={styles.cardSubtitle}>Цель на сегодня</Text>
                        <Text style={styles.cardTitle}>
                            Обслуживать 15 стол
                        </Text>
                        <TouchableOpacity>
                            <ShiftTimeModal
                                type="start"
                                onShiftStart={(time) =>
                                    // can put some action
                                    console.log(time)
                                }
                            />
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "rgba(25, 25, 26, 1)" },

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

    main: { flex: 1, paddingHorizontal: 16 },
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
    startButtonText: { color: "#2C2D2E", fontWeight: "600", fontSize: 16 },
});
