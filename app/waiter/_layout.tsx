import { Tabs } from "expo-router";

export default function WaiterLayout() {
    return (
        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen name="index" options={{ title: "Смена" }} />
            <Tabs.Screen name="salary" options={{ title: "Зарплата" }} />
            <Tabs.Screen name="motivation" options={{ title: "Мотивация" }} />
            <Tabs.Screen name="profile" options={{ title: "Профиль" }} />
        </Tabs>
    );
}
