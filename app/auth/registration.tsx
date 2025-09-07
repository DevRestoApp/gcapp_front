import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import { register } from "@/src/server/auth";

export default function RegisterScreen() {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [login, setLogin] = useState("");
    const [message, setMessage] = useState("");

    const handleRegister = async () => {
        try {
            const result = await register({ login, password });
            console.log(result);
            setMessage("Регистрация успешна: " + JSON.stringify(result));

            if (result.success) {
                router.replace("/");
            }
        } catch (error: any) {
            setMessage(
                "Ошибка: " + (error.response?.data?.detail || error.message),
            );
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Имя пользователя"
                value={username}
                onChangeText={setUsername}
                style={styles.input}
            />
            <TextInput
                placeholder="Пароль"
                value={password}
                secureTextEntry
                onChangeText={setPassword}
                style={styles.input}
            />
            <TextInput
                placeholder="Email (опционально)"
                value={login}
                onChangeText={setLogin}
                style={styles.input}
            />
            <Button title="Зарегистрироваться" onPress={handleRegister} />
            {message ? <Text>{message}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20 },
    input: {
        borderWidth: 1,
        marginBottom: 10,
        padding: 8,
        borderRadius: 5,
    },
});
