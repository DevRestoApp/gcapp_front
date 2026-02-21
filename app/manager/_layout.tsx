import React from "react";
import { Tabs } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { CeoProvider } from "@/src/contexts/CeoProvider";
import { ManagerProvider } from "@/src/contexts/ManagerProvider";

// ============================================================================
// Constants
// ============================================================================

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

// ============================================================================
// Main Component
// ============================================================================

export default function ManagerLayout() {
    return (
        <CeoProvider>
            <ManagerProvider>
                <Tabs screenOptions={SCREEN_OPTIONS}>
                    {/* Main Tabs */}
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
                        name="expenses/index"
                        options={{
                            title: "Расходы",
                            tabBarIcon: ({ color, size }) => (
                                <MaterialCommunityIcons
                                    name="chart-line"
                                    size={size}
                                    color={color}
                                />
                            ),
                        }}
                    />

                    {/*<Tabs.Screen
                        name="storage"
                        options={{
                            title: "Склад",
                            tabBarIcon: ({ color, size }) => (
                                <Ionicons
                                    name="cube"
                                    size={size}
                                    color={color}
                                />
                            ),
                        }}
                    />*/}

                    <Tabs.Screen
                        name="profile"
                        options={{
                            title: "Профиль",
                            tabBarIcon: ({ color, size }) => (
                                <Ionicons
                                    name="person"
                                    size={size}
                                    color={color}
                                />
                            ),
                        }}
                    />

                    {/* Hidden Screens - Not shown in tab bar */}
                    <Tabs.Screen
                        name="penalties/index"
                        options={{
                            href: null,
                            title: "Штрафы",
                        }}
                    />

                    <Tabs.Screen
                        name="motivation/index"
                        options={{
                            href: null,
                            title: "Мотивация",
                        }}
                    />

                    <Tabs.Screen
                        name="motivation/[id]"
                        options={{
                            href: null,
                            title: "Детали мотивации",
                        }}
                    />
                    <Tabs.Screen
                        name="employees"
                        options={{
                            href: null,
                            title: "Сотрудники",
                        }}
                    />
                    <Tabs.Screen
                        name="expenses/expense"
                        options={{
                            href: null,
                        }}
                    />
                    <Tabs.Screen
                        name="expenses/income"
                        options={{
                            href: null,
                        }}
                    />
                    <Tabs.Screen
                        name="expenses/[id]"
                        options={{
                            href: null,
                        }}
                    />
                    <Tabs.Screen
                        name="storage"
                        options={{
                            href: null,
                        }}
                    />
                </Tabs>
            </ManagerProvider>
        </CeoProvider>
    );
}
