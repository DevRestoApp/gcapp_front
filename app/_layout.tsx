import { Stack, Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { AppProviders } from "@/src/contexts/AppProviders";
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
        <AppProviders>
            <Stack screenOptions={{ headerShown: false }}>
                {isLoggedIn ? (
                    <Redirect href="/index" />
                ) : (
                    <Redirect href="/auth/index" />
                )}
            </Stack>
        </AppProviders>
    );
}
