import React from "react";
import { Tabs } from "expo-router";
import { Ionicons, AntDesign } from "@expo/vector-icons";

import { CeoProvider } from "@/src/contexts/CeoProvider";

// ============================================================================
// Constants
// ============================================================================

const TAB_BAR_STYLE = {
    backgroundColor: "#242424",
    borderTopWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
};

const SCREEN_OPTIONS = {
    headerShown: false,
    tabBarStyle: TAB_BAR_STYLE,
    tabBarActiveTintColor: "#4CAF50", // Or your brand color
    tabBarInactiveTintColor: "#8E8E93",
    tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: "600",
    },
};

// ============================================================================
// Main Component
// ============================================================================

export default function CeoLayout() {
    return (
        <CeoProvider>
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
                    name="analytics"
                    options={{
                        title: "Аналитика",
                        tabBarIcon: ({ color, size }) => (
                            <AntDesign
                                name="line-chart"
                                size={size}
                                color={color}
                            />
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
            </Tabs>
        </CeoProvider>
    );
}
