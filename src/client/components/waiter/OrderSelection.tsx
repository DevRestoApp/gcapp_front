import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";
import TableInput from "@/src/client/components/TableInput";
import LocationDisplay from "@/src/client/components/LocationDisplay";
import RoomSelector from "@/src/client/components/RoomSelector";
import DishesSection from "@/src/client/components/DishesSection";
import OrderSummary from "@/src/client/components/OrderSummary";

// ============================================================================
// Types
// ============================================================================

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
    name?: string;
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
    order: Order;
    dishes?: Dish[];
    onOrderUpdate?: (updatedOrder: Order) => void;
    onTableChange?: (table: string) => void;
    onRoomChange?: (room: string) => void;
    onAddDish?: () => void;
    onDishPress?: (dish: Dish) => void;
    onCancelOrder?: () => void;
    onCompleteOrder?: () => void;
}

// ============================================================================
// Component
// ============================================================================

export default function OrderSelection({
    order,
    dishes, // ✅ Пустой массив по умолчанию вместо моки
    onOrderUpdate,
    onAddDish,
    onDishPress,
    onCancelOrder,
    onCompleteOrder,
}: OrderSelectionProps) {
    const router = useRouter();

    // ========================================================================
    // State
    // ========================================================================

    const [selectedTable, setSelectedTable] = useState(order.table || "");
    const [selectedRoom, setSelectedRoom] = useState(order.room || "");

    const updateOrder = useCallback(
        (updates: Partial<Order>) => {
            const updatedOrder = { ...order, ...updates };
            onOrderUpdate?.(updatedOrder);
        },
        [order, onOrderUpdate],
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
    }, [onAddDish, router]);

    // ========================================================================
    // Render
    // ========================================================================

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            {/* Отображение локации/ресторана */}
            <LocationDisplay location={order.location} />

            {/* Секция с блюдами */}
            {dishes.length > 0 && (
                <DishesSection
                    dishes={dishes}
                    onDishPress={handleDishPress}
                    onAddMoreDishes={handleAddMoreDishes}
                />
            )}

            {/* Сводка по заказу */}
            <OrderSummary
                items={order.items}
                table={selectedTable}
                location={order.location}
                room={selectedRoom}
            />
        </ScrollView>
    );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        gap: 28,
        paddingHorizontal: 16,
        paddingVertical: 20,
        paddingBottom: 40,
        width: "100%",
        alignSelf: "center",
    },
});
