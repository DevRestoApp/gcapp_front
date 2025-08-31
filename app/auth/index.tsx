import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
    const router = useRouter();

    const handleLogin = async () => {
        // здесь вызов API и проверка данных
        await AsyncStorage.setItem("userToken", "dummy_token"); // временный токен
        router.replace("/"); // переход на Home
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput placeholder="Email" style={styles.input} />
            <TextInput
                placeholder="Password"
                style={styles.input}
                secureTextEntry
            />
            <Button title="Login" onPress={handleLogin} />
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
