import { View, StyleSheet } from "react-native";
import NewOrderSelection from "@/src/client/components/waiter/NewOrderSelection";

export default function NewOrder() {
    return (
        <View style={styles.container}>
            <NewOrderSelection></NewOrderSelection>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#121212" },
});
