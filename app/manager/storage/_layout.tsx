import React from "react";
import { Stack } from "expo-router";
import { StorageProvider } from "@/src/contexts/StorageProvider";

export default function ReportsLayout() {
    return (
        <StorageProvider>
            <Stack
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen name="index" />
            </Stack>
        </StorageProvider>
    );
}
