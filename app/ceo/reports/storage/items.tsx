import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { textStyles } from "@/src/client/styles/ui/text.styles";
import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";

import { InventoryItemCard } from "@/src/client/components/reports/InventoryItemCard";
import { useReports } from "@/src/contexts/ReportDataProvider";

// InventoryItemCard Component
interface InventoryItem {
    id: number;
    name: string;
    price: string;
    quantity: number;
}

export default function Warehouse() {
    const { goods } = useReports();

    const router = useRouter();
    const [activeCategory, setActiveCategory] = useState("Овощи");
    const [searchText, setSearchText] = useState("");

    // TODO написать пойск по категории в инпуте
    // TODO написать апи для получения списка со склада

    const categories = goods.categories.map((el) => el.category_name);

    const items: InventoryItem[] = goods.categories.flatMap((cat) =>
        cat.items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.amount,
            category: cat.category_name,
        })),
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Склад</Text>

                <View style={styles.placeholder} />
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <View style={styles.searchInputWrapper}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Искать товар"
                        placeholderTextColor="#797A80"
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                    <Ionicons
                        name="search"
                        size={20}
                        color="#797A80"
                        style={styles.searchIcon}
                    />
                </View>
            </View>

            {/* Content */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Section Title */}
                <Text style={styles.sectionTitle}>Склад</Text>

                {/* Category Filters */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoriesContainer}
                >
                    {categories.map((category) => (
                        <TouchableOpacity
                            key={category}
                            onPress={() => setActiveCategory(category)}
                            style={[
                                styles.categoryButton,
                                activeCategory === category &&
                                    styles.categoryButtonActive,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.categoryText,
                                    activeCategory === category &&
                                        styles.categoryTextActive,
                                ]}
                            >
                                {category}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Inventory Items */}
                <View style={styles.itemsContainer}>
                    {items.map((item) => (
                        <InventoryItemCard
                            key={item.id}
                            name={item.name}
                            price={item.price}
                            quantity={item.quantity}
                        />
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        ...backgroundsStyles.generalBg,
    },
    header: {
        flexDirection: "row",
        height: 56,
        paddingHorizontal: 16,
        justifyContent: "space-between",
        alignItems: "center",
    },
    backButton: {
        width: 28,
        height: 28,
        justifyContent: "center",
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "600",
        textAlign: "center",
        ...textStyles.white,
    },
    placeholder: {
        width: 28,
        height: 28,
    },
    searchContainer: {
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    searchInputWrapper: {
        position: "relative",
        width: "100%",
        height: 44,
    },
    searchInput: {
        width: "100%",
        height: 44,
        paddingHorizontal: 12,
        paddingVertical: 12,
        paddingRight: 40,
        borderRadius: 20,
        backgroundColor: "#2C2C2E",
        fontSize: 16,
        lineHeight: 20,
        ...textStyles.white,
    },
    searchIcon: {
        position: "absolute",
        right: 12,
        top: 12,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 112,
        gap: 20,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: "700",
        lineHeight: 28,
        ...textStyles.white,
    },
    categoriesContainer: {
        gap: 8,
        paddingRight: 16,
    },
    categoryButton: {
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderRadius: 20,
        backgroundColor: "#2C2C2E",
    },
    categoryButtonActive: {
        backgroundColor: "#FFFFFF",
    },
    categoryText: {
        fontSize: 16,
        lineHeight: 20,
        color: "#797A80",
    },
    categoryTextActive: {
        color: "#2C2D2E",
    },
    itemsContainer: {
        gap: 12,
    },
});
