import { View, Text, StyleSheet } from "react-native";

export default function WaiterSalary() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Зарплата</Text>
            <Text style={styles.text}>
                Ваши начисления за этот месяц: 45 000 ₽
            </Text>
            <Text style={styles.text}>Бонусы: 5 000 ₽</Text>
            <Text style={styles.text}>Итого: 50 000 ₽</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center" },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 12 },
    text: { fontSize: 18, marginVertical: 4 },
});
