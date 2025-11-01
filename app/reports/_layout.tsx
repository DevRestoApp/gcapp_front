// app/(reports)/_layout.tsx
import React from "react";
import { Stack } from "expo-router";
import { ReportsProvider } from "@/src/contexts/ReportDataProvider";

export default function ReportsLayout() {
    return (
        <ReportsProvider>
            <Stack
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen name="index" />
            </Stack>
        </ReportsProvider>
    );
}
