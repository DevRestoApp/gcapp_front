import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
    View,
    StyleSheet,
    StatusBar,
    Alert,
    Text,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import OrderSelection from "@/src/client/components/waiter/OrderSelection";
import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";

// Example usage of the updated OrderSelection component
export default function OrderSelectionScreen() {
    const router = useRouter();

    // Example order data - this would come from your state management/API
    const [currentOrder, setCurrentOrder] = useState({
        id: "order-123",
        table: "12", // Pre-filled table value
        location: 'Ресторан "Дастархан"', // Pre-filled location
        room: "Общий зал",
        items: [
            { dishId: "1", quantity: 2, price: 5600 }, // 2x Бесбармак
            { dishId: "2", quantity: 1, price: 3200 }, // 1x Манты
            { dishId: "4", quantity: 1, price: 2400 }, // 1x Борщ
        ],
        status: "draft",
        createdAt: new Date(),
    });

    // Handle order updates
    const handleOrderUpdate = (updatedOrder: any) => {
        setCurrentOrder(updatedOrder);
        console.log("Order updated:", updatedOrder);

        // Here you would typically:
        // 1. Update your state management (Redux, Context, etc.)
        // 2. Save to local storage/cache
        // 3. Sync with backend API
    };

    // Handle table change
    const handleTableChange = (table: string) => {
        console.log("Table changed to:", table);
        // Additional logic if needed beyond the order update
    };

    // Handle room change
    const handleRoomChange = (room: string) => {
        console.log("Room changed to:", room);
        // Additional logic if needed beyond the order update
    };

    // Handle dish press (view details)
    const handleDishPress = (dish: any) => {
        Alert.alert(dish.name, `${dish.description}\n\n${dish.price}`, [
            { text: "Закрыть", style: "cancel" },
            {
                text: "Добавить в заказ",
                onPress: () => {
                    console.log("Adding dish to order:", dish.id);
                    // Navigate to menu or add dish logic
                },
            },
        ]);
    };

    // Handle add dish navigation
    const handleAddDish = () => {
        console.log("Navigate to menu to add dishes");
        // This would navigate to the menu screen
        // router.push('/waiter/menu');
    };

    // Handle cancel order
    const handleCancelOrder = () => {
        console.log("Order cancelled");

        // Clear the order
        setCurrentOrder({
            ...currentOrder,
            table: "",
            items: [],
            status: "cancelled",
        });

        router.push("/waiter/cancel");
    };

    // Handle complete order
    const handleCompleteOrder = () => {
        const totalAmount = currentOrder.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0,
        );
        const totalItems = currentOrder.items.reduce(
            (sum, item) => sum + item.quantity,
            0,
        );

        // Update order status
        const completedOrder = {
            ...currentOrder,
            status: "completed",
            completedAt: new Date(),
        };

        setCurrentOrder(completedOrder);

        router.push("/waiter/payment");
    };

    // Render action buttons
    const renderActionButtons = () => (
        <View style={styles.actionsSection}>
            <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancelOrder}
                activeOpacity={0.8}
            >
                <Text style={styles.cancelButtonText}>Отменить заказ</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.completeButton]}
                onPress={handleCompleteOrder}
                activeOpacity={0.8}
            >
                <Text style={[styles.completeButtonText]}>Завершить</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView
            style={{ ...styles.container, ...backgroundsStyles.generalBg }}
        >
            <StatusBar barStyle="light-content" backgroundColor="#000" />

            <OrderSelection
                order={currentOrder}
                onOrderUpdate={handleOrderUpdate}
                onTableChange={handleTableChange}
                onRoomChange={handleRoomChange}
                onDishPress={handleDishPress}
                onAddDish={handleAddDish}
                onCancelOrder={handleCancelOrder}
                onCompleteOrder={handleCompleteOrder}
            />

            {renderActionButtons()}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    // Action buttons styles
    actionsSection: {
        flexDirection: "row",
        gap: 12,
        marginTop: 8,
    },
    completeButton: {
        flex: 1,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#4CAF50",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#4CAF50",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    completeButtonDisabled: {
        backgroundColor: "rgba(43, 43, 44, 1)",
        shadowColor: "#000",
        shadowOpacity: 0.1,
    },
    completeButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    completeButtonTextDisabled: {
        color: "rgba(255, 255, 255, 0.4)",
    },
    cancelButton: {
        flex: 1,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#FF4444",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#FF4444",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    cancelButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});
