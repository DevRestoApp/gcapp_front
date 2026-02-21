import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { AppProviders } from "@/src/contexts/AppProviders";
import { useAuth } from "@/src/contexts/AuthContext";

function AuthWrapper() {
    const { token } = useAuth();

    if (token === undefined) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#242424",
                }}
            >
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return <Stack screenOptions={{ headerShown: false }} />;
}

export default function Layout() {
    return (
        <AppProviders>
            <AuthWrapper />
        </AppProviders>
    );
}
