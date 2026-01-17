import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { WaiterProvider } from "@/src/contexts/WaiterProvider";

const TAB_BAR_STYLE = {
    backgroundColor: "#242424",
    borderTopWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
};

const SCREEN_OPTIONS = {
    headerShown: false,
    tabBarStyle: TAB_BAR_STYLE,
    tabBarActiveTintColor: "#ffffff", // Or your brand color
    tabBarInactiveTintColor: "#8E8E93",
    tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: "600",
    },
};

export default function WaiterLayout() {
    return (
        <WaiterProvider>
            <Tabs screenOptions={SCREEN_OPTIONS}>
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
                <Tabs.Screen name="payment" options={{ href: null }} />
                <Tabs.Screen name="cancel" options={{ href: null }} />
            </Tabs>
        </WaiterProvider>
    );
}
