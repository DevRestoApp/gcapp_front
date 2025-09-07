import { View, Text, StyleSheet } from "react-native";

export default function WaiterMotivation() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Мотивация</Text>
            <Text style={styles.text}>Выполнено заказов: 120</Text>
            <Text style={styles.text}>Рейтинг гостей: ⭐️ 4.8</Text>
            <Text style={styles.text}>Следующий бонус при 150 заказах!</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center" },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 12 },
    text: { fontSize: 18, marginVertical: 4 },
});
