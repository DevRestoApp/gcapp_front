import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function AdminHome() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🛠 Управляющий</Text>
            <Text style={styles.subtitle}>
                Управление пользователями и настройками
            </Text>

            <Button
                title="Управление пользователями"
                onPress={() => router.push("/ceo/users")}
                color="#f44336"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    title: { fontSize: 28, fontWeight: "bold", marginBottom: 12 },
    subtitle: { fontSize: 18, marginBottom: 20 },
});
