import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
} from "react-native";
import { ButtonStyles } from "@/src/client/styles/ui/buttons/Button.styles";

interface NewOrderSelectionProps {
    onTableChange?: (table: string) => void;
    onRoomChange?: (room: string) => void;
    onAddDish?: () => void;
}

export default function NewOrderSelection({
    onTableChange,
    onRoomChange,
    onAddDish,
}: NewOrderSelectionProps) {
    const router = useRouter();

    const [selectedTable, setSelectedTable] = useState("");
    const [selectedRoom, setSelectedRoom] = useState("Общий зал");

    const rooms = [
        "Общий зал",
        "Открытая VIP-беседка",
        "Летняя терраса",
        "VIP-залы",
    ];

    const handleTableChange = (value: string) => {
        setSelectedTable(value);
        onTableChange?.(value);
    };

    const handleRoomSelect = (room: string) => {
        setSelectedRoom(room);
        onRoomChange?.(room);
    };

    return (
        <View style={styles.container}>
            {/* Table Selection */}
            <View style={styles.section}>
                <Text style={styles.title}>Выберите стол</Text>
                <TextInput
                    value={selectedTable}
                    onChangeText={handleTableChange}
                    placeholder="Стол"
                    placeholderTextColor="#797A80"
                    style={styles.input}
                />
            </View>

            {/* Room Selection */}
            <View style={styles.section}>
                <Text style={styles.title}>Выберите помещения</Text>
                <View style={styles.roomsContainer}>
                    {rooms.map((room) => (
                        <TouchableOpacity
                            key={room}
                            onPress={() => handleRoomSelect(room)}
                            style={[
                                styles.roomButton,
                                selectedRoom === room &&
                                    styles.roomButtonActive,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.roomButtonText,
                                    selectedRoom === room &&
                                        styles.roomButtonTextActive,
                                ]}
                            >
                                {room}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Dishes Section */}
            <View style={styles.section}>
                <Text style={styles.title}>Блюда (0)</Text>
                <View style={styles.dishesContainer}>
                    {/* Empty State */}
                    <View style={{ alignItems: "center" }}>
                        <Image
                            source={{
                                uri: "https://api.builder.io/api/v1/image/assets/TEMP/8cbeba4afdd0ca5e403967f3817b6ce47b0fb0ba?width=200",
                            }}
                            style={{
                                width: 100,
                                height: 100,
                                resizeMode: "contain",
                            }}
                        />
                        <Text style={styles.emptyText}>Нет список блюда</Text>
                    </View>

                    {/* Add Button */}
                    <TouchableOpacity
                        style={[
                            ButtonStyles.buttonWhite,
                            { marginTop: 16, width: "100%" },
                        ]}
                        onPress={() => router.push("/waiter/menu")}
                    >
                        <Text style={ButtonStyles.buttonText}>Добавить</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 28,
        paddingHorizontal: 16,
        width: "100%",
        maxWidth: 390,
        alignSelf: "center",
    },
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
    input: {
        height: 44,
        borderRadius: 20,
        paddingHorizontal: 12,
        fontSize: 16,
        backgroundColor: "rgba(35, 35, 36, 1)",
        color: "#797A80",
        borderWidth: 0.5,
        borderColor: "rgba(0,0,0,0.12)",
    },
    roomsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    roomButton: {
        height: 44,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: "rgba(43, 43, 44, 1)",
        justifyContent: "center",
    },
    roomButtonActive: {
        backgroundColor: "#FFFFFF",
    },
    roomButtonText: {
        fontSize: 16,
        color: "#797A80",
    },
    roomButtonTextActive: {
        color: "#2C2D2E",
        fontWeight: "500",
    },
    dishesContainer: {
        gap: 16,
        padding: 12,
        borderRadius: 20,
        backgroundColor: "rgba(35, 35, 36, 1)",
    },
    emptyText: {
        marginTop: 8,
        fontSize: 16,
        color: "rgba(255,255,255,0.75)",
        textAlign: "center",
    },
});
