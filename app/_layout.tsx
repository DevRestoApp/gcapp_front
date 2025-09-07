import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { AuthProvider } from "@/src/contexts/AuthContext";
import { storage } from "@/src/server/storage";

export default function Layout() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            const token = await storage.getItem("access_token");
            setIsLoggedIn(!!token);
        };
        checkAuth();
    }, []);

    if (isLoggedIn === null) {
        return null;
    }

    return (
        <AuthProvider>
            <Stack>
                {isLoggedIn ? (
                    <Stack.Screen name="index" />
                ) : (
                    <Stack.Screen name="auth/index" />
                )}
            </Stack>
        </AuthProvider>
    );
}
