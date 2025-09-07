import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

//TODO создавать reusable компоненты в папке @src/client/components
//TODO перенести все стили в @src/client/styles глобальные и локальные

export default function WaiterHome() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🍽 Официант</Text>
            <Text style={styles.subtitle}>Список заказов и текущие столы</Text>

            <Button
                title="Перейти к заказам"
                onPress={() => router.push("/waiter/orders")}
                color="#4caf50"
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
