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
import { useWaiter } from "@/src/contexts/WaiterProvider";

import { RoomsType, TablesType } from "@/src/server/types/waiter";
import Loading from "@/src/client/components/Loading";

export default function NewOrder() {
    const router = useRouter();
    const { fetchTables, fetchRooms } = useWaiter();

    // State
    const [selectedTable, setSelectedTable] = useState("");
    const [selectedRoom, setSelectedRoom] = useState<RoomsType | null>(null);
    const [rooms, setRooms] = useState<RoomsType[]>([]);
    const [tables, setTables] = useState<TablesType[]>([]);
    const [roomsLoading, setRoomsLoading] = useState(true);
    const [tablesLoading, setTablesLoading] = useState(false);

    // Fetch rooms on mount
    useEffect(() => {
        const loadRooms = async () => {
            try {
                setRoomsLoading(true);
                const response = await fetchRooms({});
                setRooms(response);

                // Auto-select first room if available
                if (response && response.length > 0) {
                    setSelectedRoom(response[0]);
                }
            } catch (error) {
                console.error("Error fetching rooms:", error);
                Alert.alert("Ошибка", "Не удалось загрузить помещения");
            } finally {
                setRoomsLoading(false);
            }
        };

        loadRooms();
    }, []);

    // Fetch tables when room changes
    useEffect(() => {
        if (!selectedRoom) return;

        const loadTables = async () => {
            try {
                setTablesLoading(true);
                const response = await fetchTables({
                    room_id: selectedRoom.id,
                });
                setTables(response);
            } catch (error) {
                console.error("Error fetching tables:", error);
                Alert.alert("Ошибка", "Не удалось загрузить столы");
            } finally {
                setTablesLoading(false);
            }
        };

        loadTables();
    }, [selectedRoom]);

    // Handlers
    const handleTableChange = (value: string) => {
        setSelectedTable(value);
    };

    const handleRoomSelect = (room: RoomsType) => {
        setSelectedRoom(room);
        setSelectedTable(""); // Reset table when room changes
    };

    const handleAddDish = () => {
        if (!selectedTable.trim()) {
            Alert.alert("Ошибка", "Пожалуйста, выберите стол");
            return;
        }

        // TODO: Save selected table and room to context or pass as params
        router.push("/waiter/menu");
    };

    // Render functions
    const renderTableSection = () => {
        if (tablesLoading) {
            return (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Стол</Text>
                    <Loading text="Загрузка столов" />
                </View>
            );
        }

        return (
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
    };

    const renderRoomSection = () => {
        if (roomsLoading) {
            return (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Выберите помещение</Text>
                    <Loading text="Загрузка помещений" />
                </View>
            );
        }

        if (rooms.length === 0) {
            return (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Выберите помещение</Text>
                    <Text style={styles.emptyText}>
                        Нет доступных помещений
                    </Text>
                </View>
            );
        }

        return (
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
    };

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

    // Show loading only on initial load
    if (roomsLoading && rooms.length === 0) {
        return (
            <SafeAreaView
                style={[styles.container, backgroundsStyles.generalBg]}
            >
                <View style={styles.loadingContainer}>
                    <Loading text="Загрузка данных" />
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
                    {renderRoomSection()}
                    {renderTableSection()}
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
    emptyText: {
        fontSize: 16,
        color: "rgba(255, 255, 255, 0.6)",
        textAlign: "center",
        padding: 16,
    },
    addButton: {
        width: "100%",
    },
});
