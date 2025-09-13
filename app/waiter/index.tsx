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

export default function Index() {
    const [days, setDays] = useState<Day[]>([]);

    // Генерация текущей недели
    useEffect(() => {
        const generateWeek = (): Day[] => {
            const today = new Date();
            const currentDayIndex = today.getDay();

            const startOfWeek = new Date(today);
            const diff = currentDayIndex === 0 ? -6 : 1 - currentDayIndex;
            startOfWeek.setDate(today.getDate() + diff);

            const weekDays = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

            return Array.from({ length: 7 }).map((_, i) => {
                const d = new Date(startOfWeek);
                d.setDate(startOfWeek.getDate() + i);
                return {
                    date: d.getDate(),
                    day: weekDays[d.getDay()],
                    active: d.toDateString() === today.toDateString(),
                };
            });
        };

        setDays(generateWeek());
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
            <ScrollView
                style={styles.main}
                contentContainerStyle={{ alignItems: "center" }}
            >
                <Text style={styles.greetingSmall}>Добрый день, Адилет!</Text>
                <Text style={styles.greetingBig}>
                    Начните сегодняшнюю смену
                </Text>

                <View style={styles.card}>
                    <Text style={styles.cardSubtitle}>Цель на сегодня</Text>
                    <Text style={styles.cardTitle}>Обслуживать 15 стол</Text>
                    <TouchableOpacity style={styles.startButton}>
                        <Text style={styles.startButtonText}>Начать смену</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#121212" },
    header: { paddingHorizontal: 16, paddingVertical: 12 },
    headerTitle: { fontSize: 28, fontWeight: "700", color: "#fff" },

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
    startButton: {
        backgroundColor: "#fff",
        paddingVertical: 12,
        borderRadius: 24,
        alignItems: "center",
    },
    startButtonText: { color: "#2C2D2E", fontWeight: "600", fontSize: 16 },
    bottomNav: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: 12,
    },
    navText: { color: "#aaa", fontSize: 12 },
    navActive: { color: "#fff", fontSize: 12, fontWeight: "600" },
});
