import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    ScrollView,
    Alert,
    Modal,
    FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { ButtonStyles } from "@/src/client/styles/ui/buttons/Button.styles";
import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";
import { useWaiter } from "@/src/contexts/WaiterProvider";

import { RoomsType, TablesType } from "@/src/server/types/waiter";
import Loading from "@/src/client/components/Loading";
import { useAuth } from "@/src/contexts/AuthContext";

export default function NewOrder() {
    const router = useRouter();
    const { fetchTables, fetchRooms } = useWaiter();
    const { selectedLocation } = useAuth();

    // State
    const [selectedTable, setSelectedTable] = useState<string>("");
    const [selectedRoom, setSelectedRoom] = useState<string>("");
    const [rooms, setRooms] = useState<RoomsType[]>([]);
    const [tables, setTables] = useState<TablesType[]>([]);
    const [roomsLoading, setRoomsLoading] = useState(true);
    const [tablesLoading, setTablesLoading] = useState(false);
    const [showRoomModal, setShowRoomModal] = useState(false);
    const [showTableModal, setShowTableModal] = useState(false);

    // Fetch rooms on mount
    useEffect(() => {
        const loadRooms = async () => {
            try {
                console.log("selectedLocation", selectedLocation);
                setRoomsLoading(true);
                const response = await fetchRooms({
                    organization_id: selectedLocation,
                });
                setRooms(response);

                // Auto-select first room if available
                if (response && response.length > 0) {
                    setSelectedRoom(response[0].id.toString());
                }
            } catch (error) {
                console.error("Error fetching rooms:", error);
                Alert.alert("Ошибка", "Не удалось загрузить помещения");
            } finally {
                setRoomsLoading(false);
            }
        };

        loadRooms();
    }, [selectedLocation]);

    // Fetch tables when room changes
    useEffect(() => {
        if (!selectedRoom) return;

        const loadTables = async () => {
            try {
                setTablesLoading(true);
                const response = await fetchTables({
                    room_id: parseInt(selectedRoom),
                });
                setTables(response);
                // Reset selected table when room changes
                setSelectedTable("");
            } catch (error) {
                console.error("Error fetching tables:", error);
                Alert.alert("Ошибка", "Не удалось загрузить столы");
            } finally {
                setTablesLoading(false);
            }
        };

        loadTables();
    }, [selectedRoom]);

    // Helper functions
    const getRoomLabel = (value: string) => {
        if (!value) return "Выбрать помещение...";
        const room = rooms.find((r) => r.id.toString() === value);
        return room ? room.name : "Выбрать помещение...";
    };

    const getTableLabel = (value: string) => {
        if (!value) return "Выбрать стол...";
        const table = tables.find((t) => t.id.toString() === value);
        return table ? `Стол ${table.number}` : "Выбрать стол...";
    };

    // Handlers
    const handleRoomSelect = (roomId: string) => {
        setSelectedRoom(roomId);
        setShowRoomModal(false);
    };

    const handleTableSelect = (tableId: string) => {
        setSelectedTable(tableId);
        setShowTableModal(false);
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
    const renderRoomPicker = () => {
        return (
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Выберите помещение</Text>
                <TouchableOpacity
                    style={styles.pickerButton}
                    onPress={() => setShowRoomModal(true)}
                    disabled={roomsLoading}
                >
                    {roomsLoading ? (
                        <View style={styles.loadingContainer}>
                            <Loading />
                            <Text style={styles.pickerText}>
                                Загрузка помещений...
                            </Text>
                        </View>
                    ) : (
                        <>
                            <Text
                                style={[
                                    styles.pickerText,
                                    !selectedRoom && styles.pickerPlaceholder,
                                ]}
                                numberOfLines={1}
                            >
                                {getRoomLabel(selectedRoom)}
                            </Text>
                            <Ionicons
                                name="chevron-down"
                                size={20}
                                color="#FFFFFF"
                            />
                        </>
                    )}
                </TouchableOpacity>
            </View>
        );
    };

    const renderTablePicker = () => {
        return (
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Стол</Text>
                <TouchableOpacity
                    style={styles.pickerButton}
                    onPress={() => setShowTableModal(true)}
                    disabled={tablesLoading || !selectedRoom}
                >
                    {tablesLoading ? (
                        <View style={styles.loadingContainer}>
                            <Loading />
                            <Text style={styles.pickerText}>
                                Загрузка столов...
                            </Text>
                        </View>
                    ) : (
                        <>
                            <Text
                                style={[
                                    styles.pickerText,
                                    !selectedTable && styles.pickerPlaceholder,
                                ]}
                                numberOfLines={1}
                            >
                                {getTableLabel(selectedTable)}
                            </Text>
                            <Ionicons
                                name="chevron-down"
                                size={20}
                                color="#FFFFFF"
                            />
                        </>
                    )}
                </TouchableOpacity>
            </View>
        );
    };

    const renderRoomModal = () => (
        <Modal
            visible={showRoomModal}
            transparent
            animationType="fade"
            onRequestClose={() => setShowRoomModal(false)}
        >
            <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={() => setShowRoomModal(false)}
            >
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>
                            Выберите помещение
                        </Text>
                    </View>
                    <FlatList
                        data={rooms}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.modalItem,
                                    item.id.toString() === selectedRoom &&
                                        styles.modalItemSelected,
                                ]}
                                onPress={() =>
                                    handleRoomSelect(item.id.toString())
                                }
                            >
                                <Text
                                    style={[
                                        styles.modalItemText,
                                        item.id.toString() === selectedRoom &&
                                            styles.modalItemTextSelected,
                                    ]}
                                >
                                    {item.name}
                                </Text>
                                {item.id.toString() === selectedRoom && (
                                    <Ionicons
                                        name="checkmark"
                                        size={20}
                                        color="#FFFFFF"
                                    />
                                )}
                            </TouchableOpacity>
                        )}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>
                                    Нет доступных помещений
                                </Text>
                            </View>
                        }
                    />
                </View>
            </TouchableOpacity>
        </Modal>
    );

    const renderTableModal = () => (
        <Modal
            visible={showTableModal}
            transparent
            animationType="fade"
            onRequestClose={() => setShowTableModal(false)}
        >
            <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={() => setShowTableModal(false)}
            >
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Выберите стол</Text>
                    </View>
                    <FlatList
                        data={tables}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.modalItem,
                                    item.id.toString() === selectedTable &&
                                        styles.modalItemSelected,
                                ]}
                                onPress={() =>
                                    handleTableSelect(item.id.toString())
                                }
                            >
                                <Text
                                    style={[
                                        styles.modalItemText,
                                        item.id.toString() === selectedTable &&
                                            styles.modalItemTextSelected,
                                    ]}
                                >
                                    Стол {item.number}
                                </Text>
                                {item.id.toString() === selectedTable && (
                                    <Ionicons
                                        name="checkmark"
                                        size={20}
                                        color="#FFFFFF"
                                    />
                                )}
                            </TouchableOpacity>
                        )}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>
                                    Нет доступных столов
                                </Text>
                            </View>
                        }
                    />
                </View>
            </TouchableOpacity>
        </Modal>
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

    // Show loading only on initial load
    if (roomsLoading && rooms.length === 0) {
        return (
            <SafeAreaView
                style={[styles.container, backgroundsStyles.generalBg]}
            >
                <View style={styles.centerLoadingContainer}>
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
                    {renderRoomPicker()}
                    {renderTablePicker()}
                    {renderDishesSection()}
                </View>
            </ScrollView>

            {renderRoomModal()}
            {renderTableModal()}
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
    centerLoadingContainer: {
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
        gap: 12,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#fff",
        lineHeight: 28,
    },

    // Picker Button
    pickerButton: {
        flexDirection: "row",
        paddingHorizontal: 16,
        paddingVertical: 14,
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
        borderRadius: 20,
        backgroundColor: "rgba(35, 35, 36, 1)",
    },
    pickerText: {
        flex: 1,
        color: "#FFFFFF",
        fontSize: 16,
        lineHeight: 20,
    },
    pickerPlaceholder: {
        color: "#797A80",
    },
    loadingContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        flex: 1,
    },

    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "#1C1C1E",
        borderRadius: 20,
        width: "85%",
        maxHeight: "60%",
        overflow: "hidden",
    },
    modalHeader: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#2C2C2E",
    },
    modalTitle: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
    },
    modalItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#2C2C2E",
    },
    modalItemSelected: {
        backgroundColor: "rgba(60, 130, 253, 0.1)",
    },
    modalItemText: {
        color: "#FFFFFF",
        fontSize: 16,
        lineHeight: 20,
        flex: 1,
    },
    modalItemTextSelected: {
        color: "#FFFFFF",
        fontWeight: "600",
    },
    emptyContainer: {
        padding: 40,
        alignItems: "center",
    },
    emptyText: {
        color: "#797A80",
        fontSize: 16,
    },

    // Dishes Section
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
