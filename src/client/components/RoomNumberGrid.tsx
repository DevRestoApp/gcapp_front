import { Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { RoomNumberGridStyles } from "@/src/client/styles/ui/buttons/RoomNumberGrid.styles";

interface TableNumberGridProps {
    rooms?: string[];
    selectedRoom: string;
}

export default function RoomNumberGrid({
    rooms = ["1", "2", "больница"],
    selectedRoom = "2",
}: TableNumberGridProps) {
    const [selected, setSelected] = useState<string | null>(selectedRoom);

    const handleRoomChange = (room: string) => {
        console.log("Room changed to:", room);
        // Additional logic if needed beyond the order update
    };

    return (
        <View style={RoomNumberGridStyles.roomsContainer}>
            {rooms.map((room) => {
                const isSelected = selectedRoom === room;
                return (
                    <TouchableOpacity
                        key={room}
                        onPress={() => {}}
                        style={[
                            RoomNumberGridStyles.roomButton,
                            isSelected && RoomNumberGridStyles.roomButtonActive,
                        ]}
                        activeOpacity={0.7}
                    >
                        <Text
                            style={[
                                RoomNumberGridStyles.roomButtonText,
                                isSelected &&
                                    RoomNumberGridStyles.roomButtonTextActive,
                            ]}
                            numberOfLines={1}
                        >
                            {room}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}
