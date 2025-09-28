import { View, StyleSheet } from "react-native";
import OrderSelection from "@/src/client/components/waiter/OrderSelection";

export default function Order() {
    return (
        <View style={styles.container}>
            <OrderSelection></OrderSelection>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#121212" },
});
