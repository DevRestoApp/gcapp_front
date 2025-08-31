import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Layout() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            const token = await AsyncStorage.getItem("userToken");
            setIsLoggedIn(!!token);
        };
        checkAuth();
    }, []);

    if (isLoggedIn === null) {
        return null;
    }

    return (
        <Stack>
            {isLoggedIn ? (
                <Stack.Screen name="index" /> // Home / выбор роли
            ) : (
                <Stack.Screen name="auth/index" /> // экран авторизации
            )}
        </Stack>
    );
}
