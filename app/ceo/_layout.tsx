import { Tabs } from "expo-router";
import { Ionicons, AntDesign } from "@expo/vector-icons";

export default function CeoLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: "#242424",
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
                name="analytics"
                options={{
                    title: "Аналитика",
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign name="line-chart" size={24} color={color} />
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
            <Tabs.Screen name="employees" options={{ href: null }} />
        </Tabs>
    );
}
