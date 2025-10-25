import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";
import { ReportHeader } from "@/src/client/components/reports/header";
import { cardStyles } from "@/src/client/styles/ui/components/card.styles";
import ListItemIcon from "@/src/client/components/ceo/ListItemIcon";
import { AntDesign } from "@expo/vector-icons";

const checks = {
    label: "Товары с критическим остатком",
    value: "Название товара",
};
const checks2 = {
    label: "Товары с критическим остатком",
    value: "Название товара",
};

const renderItemsCard = () => {
    return (
        <View style={cardStyles.section}>
            <Text style={cardStyles.sectionTitle}>Сегодня</Text>
            <View style={cardStyles.card}>
                <TouchableOpacity
                    onPress={() => {
                        router.push("reports/orders/history");
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 12,
                        }}
                    >
                        <ListItemIcon
                            label={checks.label}
                            value={
                                checks.type
                                    ? renderValueBadge(
                                          checks.value,
                                          checks.type,
                                      )
                                    : checks.value
                            }
                            withChevron={true}
                        />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        router.push("reports/orders/history");
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 12,
                        }}
                    >
                        <ListItemIcon
                            label={checks2.label}
                            value={
                                checks2.type
                                    ? renderValueBadge(
                                          checks2.value,
                                          checks2.type,
                                      )
                                    : checks2.value
                            }
                            withChevron={true}
                        />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default function Warehouse() {
    const router = useRouter();
    const [activeCategory, setActiveCategory] = useState("Овощи");
    const [searchText, setSearchText] = useState("");

    return (
        <SafeAreaView style={styles.container}>
            <ReportHeader title={"Складские отчеты"}></ReportHeader>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {renderItemsCard()}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 16,
        gap: 16,
        paddingBottom: 32,
    },
    container: {
        flex: 1,
        ...backgroundsStyles.generalBg,
    },
});
