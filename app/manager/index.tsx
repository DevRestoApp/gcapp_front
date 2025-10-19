import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";

export default function ManagerHome() {
    const router = useRouter();

    return (
        <View style={{ ...styles.container, ...backgroundsStyles.generalBg }}>
            <Text style={styles.title}>📊 Менеджер</Text>
            <Text style={styles.subtitle}>Отчеты, статистика и управление</Text>

            <Button
                title="Посмотреть отчеты"
                onPress={() => router.push("/manager/reports")}
                color="#2196f3"
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
