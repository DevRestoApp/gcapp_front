import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { AppProviders } from "@/src/contexts/AppProviders";
import { useAuth } from "@/src/contexts/AuthContext";

function AuthWrapper() {
    const { token } = useAuth();
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        if (token === undefined) return;

        const inAuthGroup = segments[0] === "auth";

        if (!token && !inAuthGroup) {
            router.replace("/auth");
        } else if (token && inAuthGroup) {
            router.replace("/ceo");
        }
    }, [token, segments]);

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
