import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Registration() {
    const router = useRouter();

    const handleRegister = async () => {
        // Здесь будет логика регистрации через API
        // Для примера просто сохраняем "токен" и переходим на Home
        try {
            await AsyncStorage.setItem("userToken", "dummy_token");
            Alert.alert(
                "Успешная регистрация!",
                "Вы будете перенаправлены на главный экран.",
            );
            router.replace("/"); // Переход на экран выбора роли
        } catch (err) {
            Alert.alert("Ошибка", "Не удалось зарегистрироваться");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Регистрация</Text>

            <TextInput placeholder="Имя" style={styles.input} />
            <TextInput
                placeholder="Email"
                style={styles.input}
                keyboardType="email-address"
            />
            <TextInput
                placeholder="Пароль"
                style={styles.input}
                secureTextEntry
            />
            <TextInput
                placeholder="Подтверждение пароля"
                style={styles.input}
                secureTextEntry
            />

            <Button title="Зарегистрироваться" onPress={handleRegister} />

            <Text style={styles.link} onPress={() => router.push("/auth")}>
                Уже есть аккаунт? Войти
            </Text>
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
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
    input: {
        width: "100%",
        padding: 10,
        marginVertical: 8,
        borderWidth: 1,
        borderRadius: 8,
    },
    link: { color: "blue", marginTop: 15 },
});
