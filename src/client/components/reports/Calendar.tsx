import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CalendarProps {
    visible: boolean;
    onClose: () => void;
    onDateSelect: (date: string) => void; // Returns formatted string "DD.MM.YYYY"
    initialDate?: string; // Accepts formatted string "DD.MM.YYYY"
}

export function ReportCalendar({
    visible,
    onClose,
    onDateSelect,
    initialDate,
}: CalendarProps) {
    // Parse initial date or use today
    const parseInitialDate = () => {
        if (initialDate) {
            const [day, month, year] = initialDate.split(".");
            return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        }
        return new Date();
    };

    const [currentDate, setCurrentDate] = useState(parseInitialDate());
    const [selectedDate, setSelectedDate] = useState<Date | null>(
        parseInitialDate(),
    );

    const monthNames = [
        "Январь",
        "Февраль",
        "Март",
        "Апрель",
        "Май",
        "Июнь",
        "Июль",
        "Август",
        "Сентябрь",
        "Октябрь",
        "Ноябрь",
        "Декабрь",
    ];

    const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();

    let firstWeekDay = firstDayOfMonth.getDay() - 1;
    if (firstWeekDay === -1) firstWeekDay = 6;

    const prevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const handleDateClick = (day: number) => {
        const date = new Date(year, month, day);
        date.setHours(0, 0, 0, 0);
        setSelectedDate(date);
    };

    const isSelectedDate = (day: number) => {
        if (!selectedDate) return false;
        const date = new Date(year, month, day);
        date.setHours(0, 0, 0, 0);
        return date.getTime() === selectedDate.getTime();
    };

    const formatDate = (date: Date) => {
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    const handleApply = () => {
        if (selectedDate) {
            const formattedDate = formatDate(selectedDate);
            onDateSelect(formattedDate);
            onClose();
        }
    };

    const handleReset = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        setSelectedDate(today);
        setCurrentDate(today);
    };

    const renderDays = () => {
        const days = [];

        // Empty cells before first day
        for (let i = 0; i < firstWeekDay; i++) {
            days.push(<View key={`empty-${i}`} style={styles.dayCell} />);
        }

        // Days of month
        for (let day = 1; day <= daysInMonth; day++) {
            const isSelected = isSelectedDate(day);

            days.push(
                <TouchableOpacity
                    key={day}
                    onPress={() => handleDateClick(day)}
                    style={[
                        styles.dayCell,
                        isSelected && styles.dayCellSelected,
                    ]}
                >
                    <Text
                        style={[
                            styles.dayText,
                            isSelected && styles.dayTextSelected,
                        ]}
                    >
                        {day}
                    </Text>
                </TouchableOpacity>,
            );
        }

        return days;
    };

    const days = renderDays();
    const rows = [];
    for (let i = 0; i < days.length; i += 7) {
        rows.push(
            <View key={`row-${i}`} style={styles.weekRow}>
                {days.slice(i, i + 7)}
            </View>,
        );
    }

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <View
                    style={styles.calendarContainer}
                    onStartShouldSetResponder={() => true}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity
                            onPress={prevMonth}
                            style={styles.navButton}
                        >
                            <Ionicons
                                name="chevron-back"
                                size={24}
                                color="#FFFFFF"
                            />
                        </TouchableOpacity>

                        <Text style={styles.monthText}>
                            {monthNames[month]} {year}
                        </Text>

                        <TouchableOpacity
                            onPress={nextMonth}
                            style={styles.navButton}
                        >
                            <Ionicons
                                name="chevron-forward"
                                size={24}
                                color="#FFFFFF"
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Week Days */}
                    <View style={styles.weekDaysRow}>
                        {weekDays.map((day, index) => (
                            <View key={day} style={styles.weekDayCell}>
                                <Text
                                    style={[
                                        styles.weekDayText,
                                        index === 0 &&
                                            styles.weekDayTextHighlight,
                                    ]}
                                >
                                    {day}
                                </Text>
                            </View>
                        ))}
                    </View>

                    {/* Days Grid */}
                    <View style={styles.daysGrid}>{rows}</View>

                    {/* Action Buttons */}
                    <View style={styles.actionButtons}>
                        <TouchableOpacity
                            onPress={handleReset}
                            style={styles.resetButton}
                        >
                            <Text style={styles.resetButtonText}>Сегодня</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleApply}
                            style={[
                                styles.applyButton,
                                !selectedDate && styles.applyButtonDisabled,
                            ]}
                            disabled={!selectedDate}
                        >
                            <Text
                                style={[
                                    styles.applyButtonText,
                                    !selectedDate &&
                                        styles.applyButtonTextDisabled,
                                ]}
                            >
                                Применить
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    calendarContainer: {
        backgroundColor: "#1C1C1E",
        borderRadius: 20,
        padding: 16,
        width: "90%",
        maxWidth: 400,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    navButton: {
        padding: 8,
    },
    monthText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "600",
    },
    weekDaysRow: {
        flexDirection: "row",
        marginBottom: 8,
    },
    weekDayCell: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 8,
    },
    weekDayText: {
        color: "#8E8E93",
        fontSize: 13,
    },
    weekDayTextHighlight: {
        color: "#FFFFFF",
    },
    daysGrid: {
        marginBottom: 16,
    },
    weekRow: {
        flexDirection: "row",
    },
    dayCell: {
        flex: 1,
        aspectRatio: 1,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
    },
    dayCellSelected: {
        backgroundColor: "#3C82FD",
    },
    dayText: {
        color: "#FFFFFF",
        fontSize: 16,
    },
    dayTextSelected: {
        color: "#FFFFFF",
        fontWeight: "600",
    },
    actionButtons: {
        flexDirection: "row",
        gap: 12,
    },
    resetButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: "#2C2C2E",
        alignItems: "center",
    },
    resetButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
    applyButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: "#3C82FD",
        alignItems: "center",
    },
    applyButtonDisabled: {
        backgroundColor: "#2C2C2E",
    },
    applyButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
    applyButtonTextDisabled: {
        color: "#8E8E93",
    },
});
