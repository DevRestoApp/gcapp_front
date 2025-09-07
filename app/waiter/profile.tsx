import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function WaiterProfile() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Профиль официанта</Text>
            <Text style={styles.text}>Имя: Иван Петров</Text>
            <Text style={styles.text}>Смена: дневная</Text>

            <View style={{ marginTop: 20 }}>
                <Button
                    title="Сменить официанта"
                    onPress={() => router.push("/waiter/change-waiter")}
                />
                <Button
                    title="Зарплата"
                    onPress={() => router.push("/waiter/salary")}
                />
                <Button
                    title="Мотивация"
                    onPress={() => router.push("/waiter/motivation")}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center" },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 12 },
    text: { fontSize: 18, marginVertical: 4 },
});
