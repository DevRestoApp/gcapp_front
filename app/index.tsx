import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Constants from "expo-constants";

import { useAuth } from "@/src/contexts/AuthContext";

export default function Home() {
    const router = useRouter();
    const { IIKO_API } = Constants.expoConfig?.extra || {};
    const { user, token, logout } = useAuth();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🏢 Добро пожаловать в GCApp</Text>
            <Text style={styles.subtitle}>
                Выберите свою роль, чтобы войти:
            </Text>

            <View style={styles.buttonGroup}>
                <Button
                    title="Официант"
                    onPress={() => router.push("/waiter")}
                    color="#4caf50"
                />
                <Button
                    title="Менеджер"
                    onPress={() => router.push("/manager")}
                    color="#2196f3"
                />
                <Button
                    title="Управляющий"
                    onPress={() => router.push("/ceo")}
                    color="#f44336"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
        backgroundColor: "#f5f5f5",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 24,
    },
    buttonGroup: {
        width: "100%",
        gap: 12,
    },
});
