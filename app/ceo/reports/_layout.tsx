// app/(reports)/_layout.tsx
import React from "react";
import { Stack } from "expo-router";
import { ReportsProvider } from "@/src/contexts/ReportDataProvider";

// TODO сохраниласб проблема с фетчами всех запросов, потому что они прыгают с директории ceo на reports
// TODO а _layout с фетчами только в reports надо как то пофиксить
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
