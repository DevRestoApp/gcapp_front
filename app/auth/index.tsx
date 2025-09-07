import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { login as loginRequest } from "@/src/server/auth";
import { useAuth } from "@/src/contexts/AuthContext";

export default function Login() {
    const router = useRouter();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Ошибка", "Введите email и пароль");
            return;
        }

        try {
            setLoading(true);

            const response = await loginRequest({ login: email, password });

            if (response.success) {
                const userObj = {
                    id: response.user_id,
                    email: email,
                    role: response.role,
                };
                await login(userObj, response.access_token);
                router.replace("/"); // кидаем на главную
            } else {
                Alert.alert("Ошибка", "Неверные данные");
            }
        } catch (err) {
            Alert.alert("Ошибка входа", "Проверьте данные и попробуйте снова");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Вход</Text>

            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <TextInput
                placeholder="Пароль"
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                secureTextEntry
            />

            {loading ? (
                <ActivityIndicator size="large" color="#2196f3" />
            ) : (
                <Button title="Войти" onPress={handleLogin} />
            )}
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
        marginVertical: 10,
        borderWidth: 1,
        borderRadius: 8,
    },
});
