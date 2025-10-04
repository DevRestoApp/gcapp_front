import React, { useState } from "react";
import { View, StyleSheet, SafeAreaView, StatusBar, Alert } from "react-native";
import OrderSelection from "@/src/client/components/waiter/OrderSelection";

// Example usage of the updated OrderSelection component
export default function OrderSelectionScreen() {
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

        Alert.alert("Заказ отменен", "Данные заказа очищены", [
            {
                text: "OK",
                onPress: () => {
                    // Navigate back or to orders list
                    console.log("Navigate back after cancellation");
                },
            },
        ]);
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

        console.log("Order completed:", {
            orderId: currentOrder.id,
            table: currentOrder.table,
            location: currentOrder.location,
            room: currentOrder.room,
            totalAmount,
            totalItems,
        });

        // Update order status
        const completedOrder = {
            ...currentOrder,
            status: "completed",
            completedAt: new Date(),
        };

        setCurrentOrder(completedOrder);

        Alert.alert(
            "Заказ завершен",
            `Заказ отправлен на кухню!\n\nСтол: ${currentOrder.table}\nСумма: ${totalAmount.toLocaleString()} тг\nБлюд: ${totalItems}`,
            [
                {
                    text: "OK",
                    onPress: () => {
                        console.log(
                            "Navigate to orders list or create new order",
                        );
                        // Navigate back to orders list or create new order
                    },
                },
            ],
        );
    };

    return (
        <SafeAreaView style={styles.container}>
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
        </SafeAreaView>
    );
}

// Example with empty order (new order)
export function NewOrderExample() {
    const [newOrder, setNewOrder] = useState({
        table: "",
        location: 'VIP-зал "Жемчужина"',
        room: "VIP-залы",
        items: [], // Empty items array
        status: "draft",
        createdAt: new Date(),
    });

    const handleCompleteOrder = () => {
        // This will show validation error since no items
        console.log("Attempting to complete empty order");
    };

    const handleCancelOrder = () => {
        Alert.alert("Пустой заказ", "Нет данных для отмены");
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />

            <OrderSelection
                order={newOrder}
                onOrderUpdate={setNewOrder}
                onCompleteOrder={handleCompleteOrder}
                onCancelOrder={handleCancelOrder}
            />
        </SafeAreaView>
    );
}

// Example with custom dishes
export function CustomDishesExample() {
    const customDishes = [
        {
            id: "special-1",
            name: "Блюдо от шефа",
            description:
                "Эксклюзивное авторское блюдо с сезонными ингредиентами",
            price: "Цена : 12 500 тг",
            image: "https://api.builder.io/api/v1/image/assets/TEMP/a029ad2c2b910105a5e7642e2ea862cfbe5dc138?width=120",
            category: "Авторская кухня",
        },
        {
            id: "special-2",
            name: 'Торт "Медовик"',
            description: "Классический медовый торт с нежным кремом",
            price: "Цена : 3 800 тг",
            image: "https://api.builder.io/api/v1/image/assets/TEMP/a029ad2c2b910105a5e7642e2ea862cfbe5dc138?width=120",
            category: "Десерты",
        },
    ];

    const [specialOrder, setSpecialOrder] = useState({
        table: "VIP-1",
        location: "Банкетный зал",
        room: "VIP-залы",
        items: [{ dishId: "special-1", quantity: 1, price: 12500 }],
        status: "draft",
    });

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />

            <OrderSelection
                order={specialOrder}
                dishes={customDishes}
                onOrderUpdate={setSpecialOrder}
                onDishPress={(dish) => {
                    Alert.alert("Авторское блюдо", dish.description);
                }}
                onCompleteOrder={() => {
                    Alert.alert(
                        "Специальный заказ",
                        "Заказ передан шеф-повару",
                    );
                }}
                onCancelOrder={() => {
                    Alert.alert("Заказ отменен", "Специальный заказ отменен");
                }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
});
