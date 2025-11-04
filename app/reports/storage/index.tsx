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
import Loading from "@/src/client/components/Loading";
import { useReports } from "@/src/contexts/ReportDataProvider";

const checks = {
    label: "Товары с критическим остатком",
    value: "Нет данных",
};

const checks2 = {
    label: "Остатки на складе",
    value: "Нет данных",
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
    const {
        analytics,
        filters,
        setDate,
        setPeriod,
        setLocation,
        loading,
        error,
    } = useReports();

    const inventoryData =
        analytics?.inventory.map((item) => {
            return {
                id: item.id,
                date: "29.10",
                label: item.label,
                value: item.value,
            };
        }) ?? [];
    const router = useRouter();

    // Loading state
    if (loading) {
        return (
            <View style={[styles.container, backgroundsStyles.generalBg]}>
                <ReportHeader
                    title="Общие показатели"
                    date={filters.date}
                    period={filters.period}
                    location={filters.organization_id}
                    onBack={() => router.push("/reports")}
                    onDateChange={setDate}
                    onPeriodChange={setPeriod}
                    onLocationChange={setLocation}
                />
                <View>
                    <Loading size="large" color="#3C82FD" />
                </View>
            </View>
        );
    }

    // Error state
    if (error) {
        return (
            <View style={[styles.container, backgroundsStyles.generalBg]}>
                <ReportHeader
                    title="Общие показатели"
                    date={filters.date}
                    period={filters.period}
                    location={filters.organization_id}
                    onBack={() => router.push("/reports")}
                    onDateChange={setDate}
                    onPeriodChange={setPeriod}
                    onLocationChange={setLocation}
                />
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ReportHeader
                title="Складские отчеты"
                date={filters.date}
                period={filters.period}
                location={filters.organization_id}
                onBack={() => router.push("/reports")}
                onDateChange={setDate}
                onPeriodChange={setPeriod}
                onLocationChange={setLocation}
            />
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
