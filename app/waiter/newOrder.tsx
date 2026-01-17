import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
    ScrollView,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ButtonStyles } from "@/src/client/styles/ui/buttons/Button.styles";
import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";

interface Room {
    id: string;
    name: string;
}

interface Table {
    id: string;
    number: string;
}

export default function NewOrder() {
    const router = useRouter();

    // State
    const [selectedTable, setSelectedTable] = useState("");
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [tables, setTables] = useState<Table[]>([]);
    const [loading, setLoading] = useState(true);

    // TODO: Fetch rooms from API
    useEffect(() => {
        const fetchRooms = async () => {
            try {
                setLoading(true);
                // TODO: Replace with actual API call
                // const response = await fetch('/api/rooms');
                // const data = await response.json();
                // setRooms(data);

                // Mock data for now
                const mockRooms: Room[] = [
                    { id: "1", name: "Общий зал" },
                    { id: "2", name: "Открытая VIP-беседка" },
                    { id: "3", name: "Летняя терраса" },
                    { id: "4", name: "VIP-залы" },
                ];
                setRooms(mockRooms);
                setSelectedRoom(mockRooms[0]); // Select first room by default
            } catch (error) {
                console.error("Error fetching rooms:", error);
                Alert.alert("Ошибка", "Не удалось загрузить помещения");
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, []);

    // TODO: Fetch tables from API based on selected room
    useEffect(() => {
        if (!selectedRoom) return;

        const fetchTables = async () => {
            try {
                // TODO: Replace with actual API call
                // const response = await fetch(`/api/tables?roomId=${selectedRoom.id}`);
                // const data = await response.json();
                // setTables(data);

                // Mock data for now
                const mockTables: Table[] = [
                    { id: "1", number: "1" },
                    { id: "2", number: "2" },
                    { id: "3", number: "3" },
                    { id: "4", number: "4" },
                    { id: "5", number: "5" },
                ];
                setTables(mockTables);
            } catch (error) {
                console.error("Error fetching tables:", error);
                Alert.alert("Ошибка", "Не удалось загрузить столы");
            }
        };

        fetchTables();
    }, [selectedRoom]);

    // Handlers
    const handleTableChange = (value: string) => {
        setSelectedTable(value);
    };

    const handleRoomSelect = (room: Room) => {
        setSelectedRoom(room);
        setSelectedTable(""); // Reset table selection when room changes
    };

    const handleAddDish = () => {
        // TODO: Validate that table is selected
        if (!selectedTable.trim()) {
            Alert.alert("Ошибка", "Пожалуйста, выберите стол");
            return;
        }

        router.push("/waiter/menu");
    };

    // Render functions
    const renderTableSection = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Стол</Text>
            <TextInput
                value={selectedTable}
                onChangeText={handleTableChange}
                placeholder="Введите номер стола"
                placeholderTextColor="#797A80"
                style={styles.input}
                keyboardType="number-pad"
            />
        </View>
    );

    const renderRoomSection = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Выберите помещение</Text>
            <View style={styles.roomsContainer}>
                {rooms.map((room) => (
                    <TouchableOpacity
                        key={room.id}
                        onPress={() => handleRoomSelect(room)}
                        style={[
                            styles.roomButton,
                            selectedRoom?.id === room.id &&
                                styles.roomButtonActive,
                        ]}
                        activeOpacity={0.7}
                    >
                        <Text
                            style={[
                                styles.roomButtonText,
                                selectedRoom?.id === room.id &&
                                    styles.roomButtonTextActive,
                            ]}
                        >
                            {room.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    const renderDishesSection = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Блюда (0)</Text>
            <View style={styles.dishesContainer}>
                {/* Empty State */}
                <View style={styles.emptyStateContainer}>
                    <Image
                        source={{
                            uri: "https://api.builder.io/api/v1/image/assets/TEMP/8cbeba4afdd0ca5e403967f3817b6ce47b0fb0ba?width=200",
                        }}
                        style={styles.emptyStateImage}
                    />
                    <Text style={styles.emptyStateText}>Нет списка блюд</Text>
                </View>

                {/* Add Dish Button */}
                <TouchableOpacity
                    style={[ButtonStyles.buttonWhite, styles.addButton]}
                    onPress={handleAddDish}
                    activeOpacity={0.7}
                >
                    <Text style={ButtonStyles.buttonText}>Добавить блюдо</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    if (loading) {
        return (
            <SafeAreaView
                style={[styles.container, backgroundsStyles.generalBg]}
            >
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Загрузка...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, backgroundsStyles.generalBg]}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.content}>
                    <Text style={styles.pageTitle}>Новый заказ</Text>
                    {renderTableSection()}
                    {renderRoomSection()}
                    {renderDishesSection()}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 32,
    },
    content: {
        gap: 28,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        color: "#fff",
        fontSize: 16,
    },
    pageTitle: {
        color: "#fff",
        fontSize: 32,
        fontWeight: "600",
        letterSpacing: -0.24,
    },
    section: {
        gap: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#fff",
        lineHeight: 28,
    },
    input: {
        height: 44,
        borderRadius: 20,
        paddingHorizontal: 16,
        fontSize: 16,
        backgroundColor: "rgba(35, 35, 36, 1)",
        color: "#fff",
        borderWidth: 0.5,
        borderColor: "rgba(255, 255, 255, 0.1)",
    },
    roomsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    roomButton: {
        height: 44,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: "rgba(43, 43, 44, 1)",
        justifyContent: "center",
        alignItems: "center",
    },
    roomButtonActive: {
        backgroundColor: "#FFFFFF",
    },
    roomButtonText: {
        fontSize: 16,
        color: "#797A80",
        fontWeight: "500",
    },
    roomButtonTextActive: {
        color: "#2C2D2E",
        fontWeight: "600",
    },
    dishesContainer: {
        gap: 16,
        padding: 16,
        borderRadius: 20,
        backgroundColor: "rgba(35, 35, 36, 1)",
    },
    emptyStateContainer: {
        alignItems: "center",
        paddingVertical: 24,
    },
    emptyStateImage: {
        width: 100,
        height: 100,
        resizeMode: "contain",
        opacity: 0.6,
    },
    emptyStateText: {
        marginTop: 12,
        fontSize: 16,
        color: "rgba(255, 255, 255, 0.6)",
        textAlign: "center",
    },
    addButton: {
        width: "100%",
    },
});
