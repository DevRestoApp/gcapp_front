import React, { useState } from "react";
import {
    View,
    Text,
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
import ListItem from "@/src/client/components/ceo/ListItem";

const checks = {
    label: "Товары с критическим остатком",
    value: "Название товара",
};

const checks2 = {
    label: "Товары с критическим остатком",
    value: "Название товара",
};

// --- TYPES ---
interface InventoryItem {
    id: string;
    date: string;
    value: number;
    label: string;
    type?: string;
}

type InventoryData = InventoryItem[];

// --- MOCK DATA ---
const fetchInventoryData = (): InventoryData => {
    return [
        {
            id: 1,
            label: "Сумма товаров на начало периода",
            value: "120 568 598 тг",
        },
        {
            id: 2,
            label: "Сумма товаров на конец периода",
            value: "256 840 568 тг",
        },
        {
            id: 3,
            label: "Товары с критическим остатком",
            value: "-15 800 тг",
            type: "negative",
        },
        { id: 4, label: "Остатки на складе", value: "1 241 163,28 тг" },
    ];
};

// --- COMPONENTS ---
const RenderItemsCard = () => {
    const router = useRouter();
    return (
        <View style={cardStyles.section}>
            <Text style={cardStyles.sectionTitle}>Отчеты</Text>
            <View style={cardStyles.card}>
                {[checks, checks2].map((item, i) => (
                    <TouchableOpacity
                        key={i}
                        onPress={() => router.push("reports/storage/items")}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 12,
                            }}
                        >
                            <ListItemIcon
                                label={item.label}
                                value={item.value}
                                withChevron={true}
                            />
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const RenderInventoryData = ({ data }: { data: InventoryData }) => {
    if (data.length === 0) return null;

    return (
        <View style={cardStyles.section}>
            <Text style={cardStyles.sectionTitle}>Товары</Text>
            <View style={cardStyles.card}>
                {data.map((item, index) => (
                    <React.Fragment key={item.id}>
                        {index > 0 && <View style={cardStyles.divider} />}
                        <ListItem
                            label={item.label}
                            value={item.value}
                            withChevron={false}
                        />
                    </React.Fragment>
                ))}
            </View>
        </View>
    );
};

export default function Warehouse() {
    const [inventoryData] = useState<InventoryData>(fetchInventoryData());
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <ReportHeader title="Складские отчеты" />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <RenderInventoryData data={inventoryData} />
                <RenderItemsCard />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    scrollView: { flex: 1 },
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
