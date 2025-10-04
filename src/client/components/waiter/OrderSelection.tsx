import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "expo-router";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Alert,
} from "react-native";
import DishItem from "./DishItem";

interface Dish {
    id: string;
    name: string;
    description: string;
    price: string;
    image: string;
    category: string;
}

interface OrderItem {
    dishId: string;
    quantity: number;
    price: number;
}

interface Order {
    id?: string;
    table: string;
    location: string;
    room: string;
    items: OrderItem[];
    status?: string;
    createdAt?: Date;
}

interface OrderSelectionProps {
    order: Order; // Required order data
    dishes?: Dish[]; // Available dishes for display
    onOrderUpdate?: (updatedOrder: Order) => void;
    onTableChange?: (table: string) => void;
    onRoomChange?: (room: string) => void;
    onAddDish?: () => void;
    onDishPress?: (dish: Dish) => void;
    onCancelOrder?: () => void;
    onCompleteOrder?: () => void;
}

// Sample dishes data
const sampleDishes: Dish[] = [
    {
        id: "1",
        name: "Бесбармак по-казахски",
        description:
            "Состав: отварное мясо (конина, баранина или говядина), домашняя лапша, бульон, лук.",
        price: "Цена : 5 600 тг",
        image: "https://api.builder.io/api/v1/image/assets/TEMP/a029ad2c2b910105a5e7642e2ea862cfbe5dc138?width=120",
        category: "Горячие блюда",
    },
    {
        id: "2",
        name: "Манты с мясом",
        description:
            "Состав: тесто, мясная начинка из баранины и говядины, лук, специи.",
        price: "Цена : 3 200 тг",
        image: "https://api.builder.io/api/v1/image/assets/TEMP/a029ad2c2b910105a5e7642e2ea862cfbe5dc138?width=120",
        category: "Горячие блюда",
    },
    {
        id: "3",
        name: "Плов узбекский",
        description:
            "Состав: рис, мясо, морковь, лук, растительное масло, специи.",
        price: "Цена : 4 800 тг",
        image: "https://api.builder.io/api/v1/image/assets/TEMP/a029ad2c2b910105a5e7642e2ea862cfbe5dc138?width=120",
        category: "Горячие блюда",
    },
    {
        id: "4",
        name: "Борщ красный",
        description:
            "Состав: свекла, капуста, морковь, лук, мясной бульон, сметана.",
        price: "Цена : 2 400 тг",
        image: "https://api.builder.io/api/v1/image/assets/TEMP/a029ad2c2b910105a5e7642e2ea862cfbe5dc138?width=120",
        category: "Супы",
    },
    {
        id: "5",
        name: "Омлет с беконом",
        description:
            "Состав: яйца, бекон, молоко, сыр, зелень, масло сливочное.",
        price: "Цена : 1 800 тг",
        image: "https://api.builder.io/api/v1/image/assets/TEMP/a029ad2c2b910105a5e7642e2ea862cfbe5dc138?width=120",
        category: "Завтраки",
    },
];

export default function OrderSelection({
    order,
    dishes = sampleDishes,
    onOrderUpdate,
    onTableChange,
    onRoomChange,
    onAddDish,
    onDishPress,
    onCancelOrder,
    onCompleteOrder,
}: OrderSelectionProps) {
    const router = useRouter();

    // Initialize state from order data
    const [selectedTable, setSelectedTable] = useState(order.table || "");
    const [selectedRoom, setSelectedRoom] = useState(order.room || "Общий зал");

    // Update local state when order prop changes
    useEffect(() => {
        setSelectedTable(order.table || "");
        setSelectedRoom(order.room || "Общий зал");
    }, [order]);

    const rooms = [
        "Общий зал",
        "Открытая VIP-беседка",
        "Летняя терраса",
        "VIP-залы",
    ];

    // Calculate order totals
    const calculateOrderTotal = () => {
        return order.items.reduce(
            (total, item) => total + item.price * item.quantity,
            0,
        );
    };

    const getTotalItemsCount = () => {
        return order.items.reduce((total, item) => total + item.quantity, 0);
    };

    const formatPrice = (price: number) => {
        return `${price.toLocaleString()} тг`;
    };

    // Update order helper
    const updateOrder = useCallback(
        (updates: Partial<Order>) => {
            const updatedOrder = { ...order, ...updates };
            onOrderUpdate?.(updatedOrder);
        },
        [order, onOrderUpdate],
    );

    // Handlers
    const handleTableChange = useCallback(
        (value: string) => {
            setSelectedTable(value);
            updateOrder({ table: value });
            onTableChange?.(value);
        },
        [updateOrder, onTableChange],
    );

    const handleRoomSelect = useCallback(
        (room: string) => {
            setSelectedRoom(room);
            updateOrder({ room });
            onRoomChange?.(room);
        },
        [updateOrder, onRoomChange],
    );

    const handleDishPress = useCallback(
        (dishId: string) => {
            const dish = dishes.find((d) => d.id === dishId);
            if (dish) {
                onDishPress?.(dish);
            }
        },
        [dishes, onDishPress],
    );

    const handleAddMoreDishes = useCallback(() => {
        onAddDish?.();
        router.push("/waiter/menu");
    }, [onAddDish, router]);

    const handleCancelOrder = useCallback(() => {
        Alert.alert(
            "Отменить заказ",
            "Вы уверены, что хотите отменить заказ? Все данные будут потеряны.",
            [
                {
                    text: "Нет",
                    style: "cancel",
                },
                {
                    text: "Да, отменить",
                    style: "destructive",
                    onPress: () => onCancelOrder?.(),
                },
            ],
        );
    }, [onCancelOrder]);

    const handleCompleteOrder = useCallback(() => {
        const totalItems = getTotalItemsCount();
        const totalAmount = calculateOrderTotal();

        if (totalItems === 0) {
            Alert.alert(
                "Пустой заказ",
                "Добавьте блюда в заказ перед завершением",
                [{ text: "OK" }],
            );
            return;
        }

        if (selectedTable.trim().length === 0) {
            Alert.alert("Укажите стол", "Пожалуйста, введите номер стола", [
                { text: "OK" },
            ]);
            return;
        }

        Alert.alert(
            "Завершить заказ",
            `Стол: ${selectedTable}\nЛокация: ${order.location}\nПомещение: ${selectedRoom}\nБлюд: ${totalItems}\nСумма: ${formatPrice(totalAmount)}`,
            [
                {
                    text: "Отмена",
                    style: "cancel",
                },
                {
                    text: "Завершить",
                    onPress: () => onCompleteOrder?.(),
                },
            ],
        );
    }, [selectedTable, selectedRoom, order.location, onCompleteOrder]);

    // Render table selection section
    const renderTableSelection = () => (
        <View style={styles.section}>
            <Text style={styles.title}>Стол</Text>
            <TextInput
                value={selectedTable}
                onChangeText={handleTableChange}
                placeholder="Введите номер стола"
                placeholderTextColor="#797A80"
                style={[
                    styles.input,
                    selectedTable.trim().length > 0 && styles.inputFilled,
                ]}
                keyboardType="default"
                returnKeyType="next"
                autoCapitalize="none"
                maxLength={20}
            />
            {selectedTable.trim().length === 0 && (
                <Text style={styles.helperText}>Обязательное поле</Text>
            )}
        </View>
    );

    // Render location info section
    const renderLocationInfo = () => (
        <View style={styles.section}>
            <Text style={styles.title}>Локация</Text>
            <View style={styles.locationContainer}>
                <Text style={styles.locationText}>{order.location}</Text>
            </View>
        </View>
    );

    // Render room selection section
    const renderRoomSelection = () => (
        <View style={styles.section}>
            <Text style={styles.title}>Выберите помещение</Text>
            <View style={styles.roomsContainer}>
                {rooms.map((room) => {
                    const isSelected = selectedRoom === room;
                    return (
                        <TouchableOpacity
                            key={room}
                            onPress={() => handleRoomSelect(room)}
                            style={[
                                styles.roomButton,
                                isSelected && styles.roomButtonActive,
                            ]}
                            activeOpacity={0.7}
                        >
                            <Text
                                style={[
                                    styles.roomButtonText,
                                    isSelected && styles.roomButtonTextActive,
                                ]}
                                numberOfLines={1}
                            >
                                {room}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );

    // Render dishes section
    const renderDishesSection = () => (
        <View style={styles.section}>
            <View style={styles.dishesHeader}>
                <Text style={styles.title}>
                    Рекомендуемые блюда ({dishes.length})
                </Text>
                <TouchableOpacity
                    onPress={handleAddMoreDishes}
                    style={styles.addMoreButton}
                    activeOpacity={0.7}
                >
                    <Text style={styles.addMoreButtonText}>Все блюда</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.dishesContainer}>
                {dishes.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateIcon}>🍽️</Text>
                        <Text style={styles.emptyText}>Нет доступных блюд</Text>
                        <TouchableOpacity
                            style={styles.emptyActionButton}
                            onPress={handleAddMoreDishes}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.emptyActionButtonText}>
                                Перейти к меню
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        <ScrollView
                            style={styles.dishesList}
                            contentContainerStyle={styles.dishesContent}
                            showsVerticalScrollIndicator={false}
                            nestedScrollEnabled
                        >
                            {dishes.map((dish) => (
                                <DishItem
                                    key={dish.id}
                                    id={dish.id}
                                    name={dish.name}
                                    description={dish.description}
                                    price={dish.price}
                                    image={dish.image}
                                    variant="informative"
                                    onPress={handleDishPress}
                                    maxLines={2}
                                />
                            ))}
                        </ScrollView>

                        {/* Add Dish Button at bottom of dishes */}
                        <TouchableOpacity
                            style={styles.addDishButton}
                            onPress={handleAddMoreDishes}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.addDishButtonText}>
                                + Добавить блюдо
                            </Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </View>
    );

    // Render order summary section
    const renderOrderSummary = () => {
        const totalItems = getTotalItemsCount();
        const totalAmount = calculateOrderTotal();

        return (
            <View style={styles.summarySection}>
                <Text style={styles.summaryTitle}>Итого по заказу</Text>

                <View style={styles.summaryContent}>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>
                            Количество блюд:
                        </Text>
                        <Text style={styles.summaryValue}>{totalItems}</Text>
                    </View>

                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Стол:</Text>
                        <Text style={styles.summaryValue}>
                            {selectedTable || "Не указан"}
                        </Text>
                    </View>

                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Локация:</Text>
                        <Text style={styles.summaryValue}>
                            {order.location}
                        </Text>
                    </View>

                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Помещение:</Text>
                        <Text style={styles.summaryValue}>{selectedRoom}</Text>
                    </View>

                    <View style={styles.summaryDivider} />

                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryTotalLabel}>
                            Общая сумма:
                        </Text>
                        <Text style={styles.summaryTotalValue}>
                            {formatPrice(totalAmount)}
                        </Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            {renderTableSelection()}
            {renderLocationInfo()}
            {renderRoomSelection()}
            {renderDishesSection()}
            {renderOrderSummary()}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
    content: {
        gap: 28,
        paddingHorizontal: 16,
        paddingVertical: 20,
        paddingBottom: 40,
        width: "100%",
        maxWidth: 390,
        alignSelf: "center",
    },

    // Section styles
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

    // Input styles
    input: {
        height: 44,
        borderRadius: 20,
        paddingHorizontal: 16,
        fontSize: 16,
        backgroundColor: "rgba(35, 35, 36, 1)",
        color: "#fff",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.1)",
    },
    inputFilled: {
        borderColor: "#fff",
        color: "#fff",
    },
    helperText: {
        fontSize: 12,
        color: "#FF6B6B",
        marginTop: 4,
        marginLeft: 4,
    },

    // Location info styles
    locationContainer: {
        height: 44,
        borderRadius: 20,
        paddingHorizontal: 16,
        backgroundColor: "rgba(43, 43, 44, 1)",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.1)",
    },
    locationText: {
        fontSize: 16,
        color: "#fff",
        fontWeight: "500",
    },

    // Room selection styles
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
        borderWidth: 1,
        borderColor: "transparent",
    },
    roomButtonActive: {
        backgroundColor: "#FFFFFF",
        borderColor: "#FFFFFF",
    },
    roomButtonText: {
        fontSize: 14,
        color: "#797A80",
        fontWeight: "500",
    },
    roomButtonTextActive: {
        color: "#2C2D2E",
        fontWeight: "600",
    },

    // Dishes section styles
    dishesHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    addMoreButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        backgroundColor: "rgba(43, 43, 44, 1)",
    },
    addMoreButtonText: {
        fontSize: 12,
        color: "#fff",
        fontWeight: "500",
    },
    dishesContainer: {
        borderRadius: 20,
        backgroundColor: "rgba(35, 35, 36, 1)",
        overflow: "hidden",
    },
    dishesList: {
        maxHeight: 300,
    },
    dishesContent: {
        padding: 12,
        gap: 8,
    },
    addDishButton: {
        margin: 12,
        height: 44,
        borderRadius: 20,
        backgroundColor: "rgba(43, 43, 44, 1)",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.2)",
        borderStyle: "dashed",
    },
    addDishButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "500",
    },

    // Empty state styles
    emptyState: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 40,
        paddingHorizontal: 20,
        gap: 12,
    },
    emptyStateIcon: {
        fontSize: 48,
        opacity: 0.6,
    },
    emptyText: {
        fontSize: 16,
        color: "rgba(255,255,255,0.75)",
        textAlign: "center",
        lineHeight: 22,
    },
    emptyActionButton: {
        backgroundColor: "rgba(43, 43, 44, 1)",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 16,
        marginTop: 8,
    },
    emptyActionButtonText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "500",
    },

    // Order summary styles
    summarySection: {
        backgroundColor: "rgba(35, 35, 36, 1)",
        borderRadius: 20,
        padding: 20,
        gap: 16,
    },
    summaryTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "white",
        textAlign: "center",
    },
    summaryContent: {
        gap: 12,
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    summaryLabel: {
        fontSize: 14,
        color: "rgba(121, 122, 128, 1)",
        flex: 1,
    },
    summaryValue: {
        fontSize: 14,
        color: "#fff",
        fontWeight: "500",
        textAlign: "right",
    },
    summaryDivider: {
        height: 1,
        backgroundColor: "rgba(43, 43, 44, 1)",
        marginVertical: 4,
    },
    summaryTotalLabel: {
        fontSize: 16,
        color: "#fff",
        fontWeight: "600",
        flex: 1,
    },
    summaryTotalValue: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "700",
        textAlign: "right",
    },
});
