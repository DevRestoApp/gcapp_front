import React from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StatusBar,
} from "react-native";
import { Svg, Path } from "react-native-svg";
import { SafeAreaView } from "react-native-safe-area-context";

import { useRouter } from "expo-router";

import { OrderHistoryCard } from "@/src/client/components/reports/OrderHistoryItem";

// ChevronLeft Icon Component
function ChevronLeftIcon() {
    return (
        <Svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <Path
                d="M15 18L9 12L15 6"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}

export default function OrderHistory() {
    const router = useRouter();

    const orders = [
        { id: 1, tableNumber: "15 стол", amount: "+56 000 тг", time: "19:21" },
        { id: 2, tableNumber: "8 стол", amount: "+ 85 000 тг", time: "19:21" },
        { id: 3, tableNumber: "8 стол", amount: "+ 85 000 тг", time: "19:21" },
        { id: 4, tableNumber: "8 стол", amount: "+ 85 000 тг", time: "19:21" },
        { id: 5, tableNumber: "15 стол", amount: "+56 000 тг", time: "19:21" },
        { id: 6, tableNumber: "15 стол", amount: "+56 000 тг", time: "19:21" },
        { id: 7, tableNumber: "15 стол", amount: "+56 000 тг", time: "19:21" },
    ];

    const handleGoBack = () => {
        router.push("/reports/orders");
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#0A0A0A" }}>
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <View
                style={{
                    flexDirection: "row",
                    height: 56,
                    paddingHorizontal: 16,
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "#0A0A0A",
                }}
            >
                <TouchableOpacity
                    onPress={handleGoBack}
                    style={{
                        width: 28,
                        height: 28,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    activeOpacity={0.7}
                >
                    <ChevronLeftIcon />
                </TouchableOpacity>

                <Text
                    style={{
                        color: "white",
                        fontSize: 20,
                        fontWeight: "600",
                        lineHeight: 28,
                        letterSpacing: -0.24,
                    }}
                >
                    История заказа
                </Text>

                <View style={{ width: 28, height: 28 }} />
            </View>

            {/* Content */}
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingTop: 20,
                    paddingBottom: 160,
                }}
            >
                <Text
                    style={{
                        color: "white",
                        fontSize: 24,
                        fontWeight: "700",
                        lineHeight: 28,
                        marginBottom: 16,
                    }}
                >
                    Сегодня
                </Text>

                <View style={{ gap: 12 }}>
                    {orders.map((order) => (
                        <OrderHistoryCard
                            key={order.id}
                            tableNumber={order.tableNumber}
                            amount={order.amount}
                            time={order.time}
                        />
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
