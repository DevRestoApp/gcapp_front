import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Day } from "../types/waiter";
import { styles } from "../styles/waiter/Calendar.styles";

interface CalendarProps {
    days: Day[];
    onDayPress: (index: number) => void;
}

export default function Calendar({ days, onDayPress }: CalendarProps) {
    return (
        <View style={styles.calendarRow}>
            {days.map((day, index) => (
                <TouchableOpacity
                    key={index}
                    onPress={() => onDayPress(index)}
                    style={[styles.dayBox, day.active && styles.dayBoxActive]}
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
                </TouchableOpacity>
            ))}
        </View>
    );
}
