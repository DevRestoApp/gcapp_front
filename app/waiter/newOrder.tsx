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
import { useAuth } from "@/src/contexts/AuthContext";
import { RoomsType, TablesType } from "@/src/server/types/waiter";
import Loading from "@/src/client/components/Loading";

// ─── Sub-components ──────────────────────────────────────────────────────────

type PickerButtonProps = {
    label: string;
    isLoading?: boolean;
    loadingText?: string;
    disabled?: boolean;
    onPress: () => void;
};

function PickerButton({
    label,
    isLoading,
    loadingText,
    disabled,
    onPress,
}: PickerButtonProps) {
    const isPlaceholder = label.includes("...") || label.includes("Выбрать");

    return (
        <TouchableOpacity
            style={styles.pickerButton}
            onPress={onPress}
            disabled={disabled || isLoading}
            activeOpacity={0.7}
        >
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <Loading />
                    <Text style={styles.pickerText}>{loadingText}</Text>
                </View>
            ) : (
                <>
                    <Text
                        style={[
                            styles.pickerText,
                            isPlaceholder && styles.pickerPlaceholder,
                        ]}
                        numberOfLines={1}
                    >
                        {label}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color="#FFFFFF" />
                </>
            )}
        </TouchableOpacity>
    );
}

type SelectionModalProps<T> = {
    visible: boolean;
    title: string;
    data: T[];
    selectedId: string;
    emptyText: string;
    keyExtractor: (item: T) => string;
    labelExtractor: (item: T) => string;
    onSelect: (id: string) => void;
    onClose: () => void;
};

function SelectionModal<T>({
    visible,
    title,
    data,
    selectedId,
    emptyText,
    keyExtractor,
    labelExtractor,
    onSelect,
    onClose,
}: SelectionModalProps<T>) {
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
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{title}</Text>
                    </View>
                    <FlatList
                        data={data}
                        keyExtractor={keyExtractor}
                        renderItem={({ item }) => {
                            const id = keyExtractor(item);
                            const isSelected = id === selectedId;
                            return (
                                <TouchableOpacity
                                    style={[
                                        styles.modalItem,
                                        isSelected && styles.modalItemSelected,
                                    ]}
                                    onPress={() => onSelect(id)}
                                >
                                    <Text
                                        style={[
                                            styles.modalItemText,
                                            isSelected &&
                                                styles.modalItemTextSelected,
                                        ]}
                                    >
                                        {labelExtractor(item)}
                                    </Text>
                                    {isSelected && (
                                        <Ionicons
                                            name="checkmark"
                                            size={20}
                                            color="#FFFFFF"
                                        />
                                    )}
                                </TouchableOpacity>
                            );
                        }}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>
                                    {emptyText}
                                </Text>
                            </View>
                        }
                    />
                </View>
            </TouchableOpacity>
        </Modal>
    );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function NewOrder() {
    const router = useRouter();
    const {
        fetchTables,
        fetchRooms,
        setSelectedTable,
        setSelectedRoom,
        selectedTable,
        selectedRoom,
    } = useWaiter();
    const { selectedLocation } = useAuth();

    const [selectedRoomId, setSelectedRoomId] = useState("");
    const [selectedTableId, setSelectedTableId] = useState("");
    const [rooms, setRooms] = useState<RoomsType[]>([]);
    const [tables, setTables] = useState<TablesType[]>([]);
    const [roomsLoading, setRoomsLoading] = useState(true);
    const [tablesLoading, setTablesLoading] = useState(false);
    const [showRoomModal, setShowRoomModal] = useState(false);
    const [showTableModal, setShowTableModal] = useState(false);

    // Fetch rooms on mount
    useEffect(() => {
        (async () => {
            try {
                setRoomsLoading(true);
                const response = await fetchRooms({
                    organization_id: selectedLocation,
                });
                setRooms(response);
                if (response?.length > 0) {
                    setSelectedRoomId(response[0].id.toString());
                }
            } catch {
                Alert.alert("Ошибка", "Не удалось загрузить помещения");
            } finally {
                setRoomsLoading(false);
            }
        })();
    }, [selectedLocation]);

    // Fetch tables when room changes
    useEffect(() => {
        if (!selectedRoomId) return;
        (async () => {
            try {
                setTablesLoading(true);
                const response = await fetchTables({
                    room_id: parseInt(selectedRoomId),
                });
                setTables(response);
                setSelectedTableId("");
            } catch {
                Alert.alert("Ошибка", "Не удалось загрузить столы");
            } finally {
                setTablesLoading(false);
            }
        })();
    }, [selectedRoomId]);

    // Derived labels
    const roomLabel = selectedRoomId
        ? (rooms.find((r) => r.id.toString() === selectedRoomId)?.name ??
          "Выбрать помещение...")
        : "Выбрать помещение...";

    const tableLabel = selectedTableId
        ? (() => {
              const t = tables.find((t) => t.id.toString() === selectedTableId);
              return t ? `Стол ${t.number}` : "Выбрать стол...";
          })()
        : "Выбрать стол...";

    // Handlers
    const handleRoomSelect = (id: string) => {
        setSelectedRoomId(id);
        setShowRoomModal(false);
    };

    const handleTableSelect = (id: string) => {
        setSelectedTableId(id);
        setShowTableModal(false);
    };

    const handleAddDish = () => {
        if (!selectedTableId) {
            Alert.alert("Ошибка", "Пожалуйста, выберите стол");
            return;
        }

        const room = rooms.find((r) => r.id.toString() === selectedRoomId);
        const table = tables.find((t) => t.id.toString() === selectedTableId);

        if (room) setSelectedRoom({ id: room.id.toString(), name: room.name });
        if (table)
            setSelectedTable({
                id: table.id.toString(),
                number: table.number,
            });

        router.push("/waiter/menu");
    };

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

                    {/* Room picker */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            Выберите помещение
                        </Text>
                        <PickerButton
                            label={roomLabel}
                            isLoading={roomsLoading}
                            loadingText="Загрузка помещений..."
                            onPress={() => setShowRoomModal(true)}
                        />
                    </View>

                    {/* Table picker */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Стол</Text>
                        <PickerButton
                            label={tableLabel}
                            isLoading={tablesLoading}
                            loadingText="Загрузка столов..."
                            disabled={!selectedRoomId}
                            onPress={() => setShowTableModal(true)}
                        />
                    </View>

                    {/* Dishes section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Блюда (0)</Text>
                        <View style={styles.dishesContainer}>
                            <View style={styles.emptyStateContainer}>
                                <Image
                                    source={{
                                        uri: "https://api.builder.io/api/v1/image/assets/TEMP/8cbeba4afdd0ca5e403967f3817b6ce47b0fb0ba?width=200",
                                    }}
                                    style={styles.emptyStateImage}
                                />
                                <Text style={styles.emptyStateText}>
                                    Нет списка блюд
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={[
                                    ButtonStyles.buttonWhite,
                                    styles.addButton,
                                ]}
                                onPress={handleAddDish}
                                activeOpacity={0.7}
                            >
                                <Text style={ButtonStyles.buttonText}>
                                    Добавить блюдо
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>

            <SelectionModal
                visible={showRoomModal}
                title="Выберите помещение"
                data={rooms}
                selectedId={selectedRoomId}
                emptyText="Нет доступных помещений"
                keyExtractor={(r) => r.id.toString()}
                labelExtractor={(r) => r.name}
                onSelect={handleRoomSelect}
                onClose={() => setShowRoomModal(false)}
            />

            <SelectionModal
                visible={showTableModal}
                title="Выберите стол"
                data={tables}
                selectedId={selectedTableId}
                emptyText="Нет доступных столов"
                keyExtractor={(t) => t.id.toString()}
                labelExtractor={(t) => `Стол ${t.number}`}
                onSelect={handleTableSelect}
                onClose={() => setShowTableModal(false)}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollView: { flex: 1 },
    scrollContent: { paddingBottom: 32 },
    content: { gap: 28, paddingHorizontal: 16, paddingTop: 16 },
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
    section: { gap: 12 },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#fff",
        lineHeight: 28,
    },
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
    pickerText: { flex: 1, color: "#FFFFFF", fontSize: 16, lineHeight: 20 },
    pickerPlaceholder: { color: "#797A80" },
    loadingContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        flex: 1,
    },
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
    modalItemSelected: { backgroundColor: "rgba(60, 130, 253, 0.1)" },
    modalItemText: { color: "#FFFFFF", fontSize: 16, lineHeight: 20, flex: 1 },
    modalItemTextSelected: { color: "#FFFFFF", fontWeight: "600" },
    emptyContainer: { padding: 40, alignItems: "center" },
    emptyText: { color: "#797A80", fontSize: 16 },
    dishesContainer: {
        gap: 16,
        padding: 16,
        borderRadius: 20,
        backgroundColor: "rgba(35, 35, 36, 1)",
    },
    emptyStateContainer: { alignItems: "center", paddingVertical: 24 },
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
    addButton: { width: "100%" },
});
