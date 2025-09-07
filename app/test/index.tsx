import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from "react-native";

export default function Index() {
    // Days of the week in Russian
    const days = [
        { date: 12, day: "Пн", active: false },
        { date: 13, day: "Вт", active: true },
        { date: 14, day: "Ср", active: false },
        { date: 15, day: "Чт", active: false },
        { date: 16, day: "Пт", active: false },
        { date: 17, day: "Сб", active: false },
        { date: 18, day: "Вс", active: false },
    ];

    return (
        <View style={styles.container}>
            {/* Status Bar */}
            <View style={styles.statusBar}>
                <Text style={styles.timeText}>12:48</Text>
                <View style={styles.statusIcons}>
                    {/* Симуляция иконок */}
                    <View style={styles.signalBars}>
                        <View style={[styles.bar, { height: 12 }]} />
                        <View style={[styles.bar, { height: 16 }]} />
                        <View style={[styles.bar, { height: 20 }]} />
                        <View style={[styles.bar, { height: 24 }]} />
                    </View>
                    <View style={styles.battery} />
                </View>
            </View>

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Смена</Text>
            </View>

            {/* Calendar */}
            <View style={styles.calendarRow}>
                {days.map((day, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dayBox,
                            day.active && styles.dayBoxActive,
                        ]}
                    >
                        <Text
                            style={[
                                styles.dayDate,
                                day.active ? styles.textDark : styles.textLight,
                            ]}
                        >
                            {day.date}
                        </Text>
                        <Text
                            style={[
                                styles.dayLabel,
                                day.active ? styles.textDark : styles.textLight,
                            ]}
                        >
                            {day.day}
                        </Text>
                    </View>
                ))}
            </View>

            {/* Content */}
            <ScrollView
                style={styles.main}
                contentContainerStyle={{ alignItems: "center" }}
            >
                {/* Greeting */}
                <Text style={styles.greetingSmall}>Добрый день, Адилет!</Text>
                <Text style={styles.greetingBig}>
                    Начните сегодняшнюю смену
                </Text>

                {/* Goal Card */}
                <View style={styles.card}>
                    <Text style={styles.cardSubtitle}>Цель на сегодня</Text>
                    <Text style={styles.cardTitle}>Обслуживать 15 стол</Text>
                    <TouchableOpacity style={styles.startButton}>
                        <Text style={styles.startButtonText}>Начать смену</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                <Text style={styles.navActive}>Смена</Text>
                <Text style={styles.navText}>Зарплата</Text>
                <Text style={styles.navText}>Мотивация</Text>
                <Text style={styles.navText}>Профиль</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#121212" },
    statusBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    timeText: { color: "#fff", fontSize: 18, fontWeight: "600" },
    statusIcons: { flexDirection: "row", alignItems: "center" },
    signalBars: {
        flexDirection: "row",
        alignItems: "flex-end",
        marginRight: 8,
    },
    bar: {
        width: 3,
        backgroundColor: "#fff",
        marginHorizontal: 1,
        borderRadius: 2,
    },
    battery: {
        width: 24,
        height: 12,
        borderWidth: 1,
        borderColor: "#fff",
        borderRadius: 2,
    },
    header: { paddingHorizontal: 16, paddingVertical: 12 },
    headerTitle: { fontSize: 28, fontWeight: "700", color: "#fff" },

    calendarRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        marginVertical: 16,
    },
    dayBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "transparent",
    },
    dayBoxActive: { backgroundColor: "#fff" },
    dayDate: { fontSize: 16, fontWeight: "700" },
    dayLabel: { fontSize: 12 },
    textDark: { color: "#2C2D2E" },
    textLight: { color: "#fff" },

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
        borderTopWidth: 1,
        borderTopColor: "#333",
    },
    navText: { color: "#aaa", fontSize: 12 },
    navActive: { color: "#fff", fontSize: 12, fontWeight: "600" },
});
