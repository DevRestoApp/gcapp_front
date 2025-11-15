import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Alert } from "react-native";
import TableInput from "@/src/client/components/TableInput";
import LocationDisplay from "@/src/client/components/LocationDisplay";
import RoomSelector from "@/src/client/components/RoomSelector";
import DishesSection from "@/src/client/components/DishesSection";
import OrderSummary from "@/src/client/components/OrderSummary";

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

    const [selectedTable, setSelectedTable] = useState(order.table || "");
    const [selectedRoom, setSelectedRoom] = useState(order.room || "Общий зал");

    const rooms = [
        "Общий зал",
        "Открытая VIP-беседка",
        "Летняя терраса",
        "VIP-залы",
    ];

    useEffect(() => {
        setSelectedTable(order.table || "");
        setSelectedRoom(order.room || "Общий зал");
    }, [order]);

    const updateOrder = useCallback(
        (updates: Partial<Order>) => {
            const updatedOrder = { ...order, ...updates };
            onOrderUpdate?.(updatedOrder);
        },
        [order, onOrderUpdate],
    );

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

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            <TableInput
                value={selectedTable}
                onChangeText={handleTableChange}
            />

            <LocationDisplay location={order.location} />

            <RoomSelector
                rooms={rooms}
                selectedRoom={selectedRoom}
                onRoomSelect={handleRoomSelect}
            />

            <DishesSection
                dishes={dishes}
                onDishPress={handleDishPress}
                onAddMoreDishes={handleAddMoreDishes}
            />

            <OrderSummary
                items={order.items}
                table={selectedTable}
                location={order.location}
                room={selectedRoom}
            />
        </ScrollView>
    );
}

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
