import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function WaiterLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: "#242424",
                    height: 70,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Смена",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name="refresh-circle"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="salary"
                options={{
                    title: "Зарплата",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="wallet" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="motivation"
                options={{
                    title: "Мотивация",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="star" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Профиль",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" size={size} color={color} />
                    ),
                }}
            />
            {/* Вложенный стек для модальных/доп. экранов */}
            <Tabs.Screen name="menu" options={{ href: null }} />
            <Tabs.Screen name="newOrder" options={{ href: null }} />
            <Tabs.Screen name="order" options={{ href: null }} />
        </Tabs>
    );
}
