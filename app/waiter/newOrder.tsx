import { View, StyleSheet } from "react-native";
import NewOrderSelection from "@/src/client/components/waiter/NewOrderSelection";
import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";

export default function NewOrder() {
    return (
        <View style={{ ...styles.container, ...backgroundsStyles.generalBg }}>
            <NewOrderSelection></NewOrderSelection>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
});
