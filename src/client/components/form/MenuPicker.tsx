import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    Modal,
} from "react-native";

import { getMenu } from "@/src/server/general/menu";

// ============================================================================
// Types
// ============================================================================

export interface MenuItem {
    id: number;
    name: string;
    price: number;
    description: string;
    image: string;
    category: string;
}

interface MenuPickerProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (item: MenuItem) => void;
    selectedItem?: MenuItem | null;
    title?: string;
}

// ============================================================================
// Main Component
// ============================================================================

export default function MenuPicker({
    visible,
    onClose,
    onSelect,
    selectedItem = null,
    title = "Выберите блюдо",
}: MenuPickerProps) {
    // ========================================================================
    // State Management
    // ========================================================================

    const [dishes, setDishes] = useState<MenuItem[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("");

    // ========================================================================
    // Data Fetching
    // ========================================================================

    const fetchMenuData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await getMenu({});

            if (!response?.items || !Array.isArray(response.items)) {
                throw new Error("Invalid menu data");
            }

            const uniqueCategories = Array.from(
                new Set(response.items.map((item: MenuItem) => item.category)),
            ).filter(Boolean) as string[];

            setDishes(response.items);
            setCategories(uniqueCategories);

            if (!selectedCategory && uniqueCategories.length > 0) {
                setSelectedCategory(uniqueCategories[0]);
            }
        } catch (err: any) {
            setError(err.message || "Failed to load menu");
            console.error("Error fetching menu:", err);
        } finally {
            setLoading(false);
        }
    }, [selectedCategory]);

    useEffect(() => {
        if (visible) {
            fetchMenuData();
        }
    }, [visible, fetchMenuData]);

    // ========================================================================
    // Computed Values
    // ========================================================================

    const filteredDishes = useMemo(() => {
        return dishes.filter((dish) => {
            if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase().trim();
                const matchesName = dish.name.toLowerCase().includes(query);
                const matchesDesc = dish.description
                    ?.toLowerCase()
                    .includes(query);
                if (!matchesName && !matchesDesc) return false;
            }

            if (selectedCategory && dish.category !== selectedCategory) {
                return false;
            }

            return true;
        });
    }, [dishes, searchQuery, selectedCategory]);

    const getCategoryDishCount = useCallback(
        (category: string) => {
            return dishes.filter((dish) => dish.category === category).length;
        },
        [dishes],
    );

    // ========================================================================
    // Event Handlers
    // ========================================================================

    const handleSearchChange = useCallback((text: string) => {
        setSearchQuery(text);
    }, []);

    const handleClearSearch = useCallback(() => {
        setSearchQuery("");
    }, []);

    const handleCategoryChange = useCallback((category: string) => {
        setSelectedCategory(category);
        setSearchQuery("");
    }, []);

    const handleDishSelect = useCallback(
        (dish: MenuItem) => {
            onSelect(dish);
            onClose();
        },
        [onSelect, onClose],
    );

    const handleRetry = useCallback(() => {
        fetchMenuData();
    }, [fetchMenuData]);

    // ========================================================================
    // Render Functions
    // ========================================================================

    const renderLoadingState = () => (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>Загрузка меню...</Text>
        </View>
    );

    const renderErrorState = () => (
        <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={handleRetry} style={styles.retryButton}>
                <Text style={styles.retryButtonText}>Попробовать снова</Text>
            </TouchableOpacity>
        </View>
    );

    const renderSearchSection = () => (
        <View style={styles.searchWrapper}>
            <TextInput
                value={searchQuery}
                onChangeText={handleSearchChange}
                placeholder="Искать блюда..."
                placeholderTextColor="#797A80"
                style={styles.searchInput}
                returnKeyType="search"
            />
            {searchQuery.length > 0 && (
                <TouchableOpacity
                    onPress={handleClearSearch}
                    style={styles.clearButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Text style={styles.clearButtonText}>×</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    const renderCategoryButton = (category: string, index: number) => {
        const isSelected = selectedCategory === category;
        const dishCount = getCategoryDishCount(category);

        return (
            <TouchableOpacity
                key={`category-${index}-${category}`}
                onPress={() => handleCategoryChange(category)}
                style={[
                    styles.categoryButton,
                    isSelected && styles.categoryButtonActive,
                ]}
                activeOpacity={0.7}
            >
                <Text
                    style={[
                        styles.categoryText,
                        isSelected && styles.categoryTextActive,
                    ]}
                >
                    {category}
                </Text>
                {dishCount > 0 && (
                    <View
                        style={[
                            styles.categoryBadge,
                            isSelected && styles.categoryBadgeActive,
                        ]}
                    >
                        <Text
                            style={[
                                styles.categoryBadgeText,
                                isSelected && styles.categoryBadgeTextActive,
                            ]}
                        >
                            {dishCount}
                        </Text>
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    const renderCategoriesSection = () => {
        if (categories.length === 0) return null;

        return (
            <View style={styles.categoriesSection}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoriesScrollContent}
                >
                    {categories.map(renderCategoryButton)}
                </ScrollView>
            </View>
        );
    };

    const renderDishItem = (dish: MenuItem) => {
        const isSelected = selectedItem?.id === dish.id;

        return (
            <TouchableOpacity
                key={`dish-${dish.id}`}
                style={[styles.dishItem, isSelected && styles.dishItemSelected]}
                onPress={() => handleDishSelect(dish)}
                activeOpacity={0.7}
            >
                <View style={styles.dishInfo}>
                    <Text style={styles.dishName} numberOfLines={2}>
                        {dish.name}
                    </Text>
                    {dish.description && (
                        <Text style={styles.dishDescription} numberOfLines={2}>
                            {dish.description}
                        </Text>
                    )}
                    <Text style={styles.dishPrice}>
                        {dish.price.toLocaleString("ru-RU")} тг
                    </Text>
                </View>
                {isSelected && (
                    <View style={styles.checkmark}>
                        <Text style={styles.checkmarkText}>✓</Text>
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
                {searchQuery
                    ? "По вашему запросу ничего не найдено"
                    : selectedCategory
                      ? `В категории "${selectedCategory}" пока нет блюд`
                      : "Меню пусто"}
            </Text>
            {searchQuery && (
                <TouchableOpacity
                    onPress={handleClearSearch}
                    style={styles.clearSearchButton}
                >
                    <Text style={styles.clearSearchButtonText}>
                        Очистить поиск
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );

    const renderDishesSection = () => (
        <View style={styles.dishesSection}>
            {searchQuery.trim() !== "" && (
                <Text style={styles.searchResultsText}>
                    {filteredDishes.length > 0
                        ? `Найдено ${filteredDishes.length} ${filteredDishes.length === 1 ? "блюдо" : "блюд"}`
                        : "Блюда не найдены"}
                </Text>
            )}

            {filteredDishes.length > 0 ? (
                <ScrollView
                    style={styles.dishesList}
                    showsVerticalScrollIndicator={false}
                >
                    {filteredDishes.map(renderDishItem)}
                </ScrollView>
            ) : (
                renderEmptyState()
            )}
        </View>
    );

    // ========================================================================
    // Main Render
    // ========================================================================

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={false}
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>{title}</Text>
                    <TouchableOpacity
                        onPress={onClose}
                        style={styles.closeButton}
                    >
                        <Text style={styles.closeButtonText}>×</Text>
                    </TouchableOpacity>
                </View>

                {/* Content */}
                {loading ? (
                    renderLoadingState()
                ) : error ? (
                    renderErrorState()
                ) : (
                    <View style={styles.content}>
                        {renderSearchSection()}
                        {renderCategoriesSection()}
                        {renderDishesSection()}
                    </View>
                )}
            </View>
        </Modal>
    );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#19191A",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingTop: 60,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(43, 43, 44, 1)",
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
    },
    closeButton: {
        width: 32,
        height: 32,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 16,
        backgroundColor: "rgba(35, 35, 36, 1)",
    },
    closeButtonText: {
        fontSize: 24,
        color: "#fff",
        fontWeight: "300",
    },

    content: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 20,
    },

    // Loading/Error States
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        color: "#fff",
        fontSize: 16,
        marginTop: 12,
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    errorText: {
        color: "#FF6B6B",
        fontSize: 16,
        textAlign: "center",
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 20,
    },
    retryButtonText: {
        color: "#000",
        fontSize: 16,
        fontWeight: "600",
    },

    // Search Section
    searchWrapper: {
        position: "relative",
        marginBottom: 20,
    },
    searchInput: {
        height: 48,
        borderRadius: 24,
        paddingHorizontal: 20,
        paddingRight: 50,
        backgroundColor: "rgba(35, 35, 36, 1)",
        color: "#fff",
        fontSize: 16,
    },
    clearButton: {
        position: "absolute",
        right: 15,
        top: 12,
        width: 24,
        height: 24,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 12,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
    clearButtonText: {
        color: "#797A80",
        fontSize: 16,
        fontWeight: "bold",
    },

    // Categories Section
    categoriesSection: {
        marginBottom: 24,
    },
    categoriesScrollContent: {
        paddingRight: 16,
    },
    categoryButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginRight: 10,
        backgroundColor: "rgba(35, 35, 36, 1)",
    },
    categoryButtonActive: {
        backgroundColor: "#fff",
    },
    categoryText: {
        color: "#797A80",
        fontSize: 14,
        fontWeight: "500",
    },
    categoryTextActive: {
        color: "#000",
        fontWeight: "600",
    },
    categoryBadge: {
        backgroundColor: "rgba(121, 122, 128, 0.2)",
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 6,
        paddingHorizontal: 6,
    },
    categoryBadgeActive: {
        backgroundColor: "rgba(0, 0, 0, 0.1)",
    },
    categoryBadgeText: {
        color: "#797A80",
        fontSize: 12,
        fontWeight: "600",
    },
    categoryBadgeTextActive: {
        color: "#000",
    },

    // Search Results
    searchResultsText: {
        color: "#797A80",
        fontSize: 14,
        marginBottom: 16,
        textAlign: "center",
    },

    // Dishes Section
    dishesSection: {
        flex: 1,
    },
    dishesList: {
        flex: 1,
    },
    dishItem: {
        backgroundColor: "rgba(35, 35, 36, 1)",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    dishItemSelected: {
        backgroundColor: "rgba(60, 130, 253, 0.2)",
        borderWidth: 2,
        borderColor: "#3C82FD",
    },
    dishInfo: {
        flex: 1,
        gap: 4,
    },
    dishName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#fff",
    },
    dishDescription: {
        fontSize: 14,
        color: "rgba(121, 122, 128, 1)",
    },
    dishPrice: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#fff",
        marginTop: 4,
    },
    checkmark: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: "#3C82FD",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 12,
    },
    checkmarkText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },

    // Empty State
    emptyState: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 60,
    },
    emptyStateText: {
        color: "rgba(255, 255, 255, 0.6)",
        fontSize: 16,
        textAlign: "center",
        marginBottom: 20,
    },
    clearSearchButton: {
        backgroundColor: "rgba(35, 35, 36, 1)",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    clearSearchButtonText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "500",
    },
});
