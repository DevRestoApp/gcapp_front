import React from "react";
import { View, Text, StyleSheet } from "react-native";
import RoomNumberGrid from "@/src/client/components/RoomNumberGrid";

interface RoomSelectorProps {
    rooms: string[];
    selectedRoom: string;
    onRoomSelect: (room: string) => void;
}

export default function RoomSelector({
    rooms,
    selectedRoom,
    onRoomSelect,
}: RoomSelectorProps) {
    return (
        <View style={styles.section}>
            <Text style={styles.title}>Выберите помещение</Text>
            <RoomNumberGrid
                rooms={rooms}
                selectedRoom={selectedRoom}
                onRoomSelect={onRoomSelect}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        gap: 16,
        width: "100%",
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        color: "white",
        lineHeight: 28,
    },
});
