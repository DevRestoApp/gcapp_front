import React, {
    useState,
    useRef,
    useCallback,
    useMemo,
    useEffect,
} from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import DishItem from "@/src/client/components/waiter/DishItem";
import DishDetailModal, {
    DishDetailModalRef,
} from "@/src/client/components/modals/DishDetailModal";
import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";
import { loadingStyles } from "@/src/client/styles/ui/loading.styles";
import { getMenu } from "@/src/server/general/menu";

import Loading from "@/src/client/components/Loading";

// ============================================================================
// Types
// ============================================================================

interface MenuItem {
    id: number;
    name: string;
    price: number;
    description: string;
    image: string;
    category: string;
}

interface MenuScreenProps {
    restaurantId?: string;
}

// ============================================================================
// Constants
// ============================================================================

const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

// ============================================================================
// Main Component
// ============================================================================

export default function MenuScreen({
    restaurantId = "restaurant-123",
}: MenuScreenProps = {}) {
    // ========================================================================
    // State Management
    // ========================================================================

    const [dishes, setDishes] = useState<MenuItem[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [quantities, setQuantities] = useState<Record<number, number>>({});
    const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);

    const modalRef = useRef<DishDetailModalRef>(null);

    // ========================================================================
    // Data Fetching
    // ========================================================================

    const fetchMenuData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await getMenu({});

            if (!response?.items || !Array.isArray(response.items)) {
                throw new Error("Invalid menu data received");
            }

            // Extract unique categories
            const uniqueCategories = Array.from(
                new Set(response.items.map((item: MenuItem) => item.category)),
            ).filter(Boolean) as string[];

            setDishes(response.items);
            setCategories(uniqueCategories);

            // Set first category as default if not already set
            if (!selectedCategory && uniqueCategories.length > 0) {
                setSelectedCategory(uniqueCategories[0]);
            }

            console.log(
                `Loaded ${response.items.length} dishes in ${uniqueCategories.length} categories`,
            );
        } catch (err: any) {
            const errorMessage = err.message || "Failed to load menu";
            setError(errorMessage);
            console.error("Error fetching menu:", err);
            Alert.alert("Ошибка", "Не удалось загрузить меню");
        } finally {
            setLoading(false);
        }
    }, [selectedCategory]);

    useEffect(() => {
        fetchMenuData();

        const interval = setInterval(fetchMenuData, REFRESH_INTERVAL);
        return () => clearInterval(interval);
    }, [fetchMenuData]);

    // ========================================================================
    // Computed Values
    // ========================================================================

    const filteredDishes = useMemo(() => {
        return dishes.filter((dish) => {
            // Search filter
            if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase().trim();
                const matchesName = dish.name.toLowerCase().includes(query);
                const matchesDesc = dish.description
                    ?.toLowerCase()
                    .includes(query);
                if (!matchesName && !matchesDesc) return false;
            }

            // Category filter
            if (selectedCategory && dish.category !== selectedCategory) {
                return false;
            }

            return true;
        });
    }, [dishes, searchQuery, selectedCategory]);

    const totalCartItems = useMemo(() => {
        return Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
    }, [quantities]);

    const getCategoryDishCount = useCallback(
        (category: string) => {
            return dishes.filter((dish) => dish.category === category).length;
        },
        [dishes],
    );

    // ========================================================================
    // Event Handlers
    // ========================================================================

    const handleQuantityChange = useCallback(
        (dishId: number, quantity: number) => {
            setQuantities((prev) => {
                const newQuantities = { ...prev };
                if (quantity <= 0) {
                    delete newQuantities[dishId];
                } else {
                    newQuantities[dishId] = quantity;
                }
                return newQuantities;
            });
        },
        [],
    );

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

    const handleDishPress = useCallback((dish: MenuItem) => {
        setSelectedDish(dish);
        setTimeout(() => modalRef.current?.open(), 0);
    }, []);

    const handleModalClose = useCallback(() => {
        setSelectedDish(null);
    }, []);

    const handleAddToOrder = useCallback(
        (quantity: number) => {
            if (!selectedDish || quantity <= 0) return;

            handleQuantityChange(selectedDish.id, quantity);

            Alert.alert(
                "Добавлено в заказ",
                `${selectedDish.name} (${quantity} шт.) — ${(selectedDish.price * quantity).toLocaleString("ru-RU")} тг`,
                [{ text: "OK" }],
                { cancelable: true },
            );

            modalRef.current?.close();
            setSelectedDish(null);
        },
        [selectedDish, handleQuantityChange],
    );

    const handleViewCart = useCallback(() => {
        // Calculate total
        const total = Object.entries(quantities).reduce((sum, [id, qty]) => {
            const dish = dishes.find((d) => d.id === Number(id));
            return sum + (dish ? dish.price * qty : 0);
        }, 0);

        Alert.alert(
            "Корзина",
            `Товаров: ${totalCartItems}\nСумма: ${total.toLocaleString("ru-RU")} тг`,
        );
    }, [totalCartItems, quantities, dishes]);

    const handleRetry = useCallback(() => {
        fetchMenuData();
    }, [fetchMenuData]);

    // ========================================================================
    // Render Functions
    // ========================================================================

    const renderLoadingState = () => (
        <View style={loadingStyles.loadingContainer}>
            <Loading text={"Загрузка меню"} />
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
                clearButtonMode="while-editing"
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

    const renderDishItem = (dish: MenuItem) => (
        <DishItem
            key={`dish-${dish.id}`}
            id={String(dish.id)}
            name={dish.name}
            description={dish.description || ""}
            price={`${dish.price.toLocaleString("ru-RU")} тг`}
            image={""}
            variant="interactive"
            initialQuantity={quantities[dish.id] || 0}
            onQuantityChange={(id, qty) => handleQuantityChange(dish.id, qty)}
            onPress={() => handleDishPress(dish)}
        />
    );

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
                <View style={styles.dishesList}>
                    {filteredDishes.map(renderDishItem)}
                </View>
            ) : (
                renderEmptyState()
            )}
        </View>
    );

    const renderCartButton = () => {
        if (totalCartItems === 0) return null;

        const totalPrice = Object.entries(quantities).reduce(
            (sum, [id, qty]) => {
                const dish = dishes.find((d) => d.id === Number(id));
                return sum + (dish ? dish.price * qty : 0);
            },
            0,
        );

        return (
            <TouchableOpacity
                style={styles.cartButton}
                onPress={handleViewCart}
                activeOpacity={0.8}
            >
                <Text style={styles.cartButtonText}>
                    Корзина ({totalCartItems}) •{" "}
                    {totalPrice.toLocaleString("ru-RU")} тг
                </Text>
            </TouchableOpacity>
        );
    };

    // ========================================================================
    // Main Render
    // ========================================================================

    if (loading) {
        return (
            <SafeAreaView
                style={[styles.container, backgroundsStyles.generalBg]}
            >
                {renderLoadingState()}
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView
                style={[styles.container, backgroundsStyles.generalBg]}
            >
                {renderErrorState()}
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, backgroundsStyles.generalBg]}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {renderSearchSection()}
                {renderCategoriesSection()}
                {renderDishesSection()}
            </ScrollView>

            {renderCartButton()}

            {selectedDish && (
                <DishDetailModal
                    ref={modalRef}
                    dish={{
                        id: String(selectedDish.id),
                        name: selectedDish.name,
                        description: selectedDish.description || "",
                        price: `${selectedDish.price.toLocaleString("ru-RU")} тг`,
                        image: selectedDish.image,
                        category: selectedDish.category,
                    }}
                    onClose={handleModalClose}
                    initialQuantity={quantities[selectedDish.id] || 0}
                    onQuantityChange={(qty) =>
                        handleQuantityChange(selectedDish.id, qty)
                    }
                    onAddToOrder={handleAddToOrder}
                />
            )}
        </SafeAreaView>
    );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 100,
        flexGrow: 1,
    },

    // Error State
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
        borderWidth: 1,
        borderColor: "transparent",
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
        borderWidth: 1,
        borderColor: "transparent",
    },
    categoryButtonActive: {
        backgroundColor: "#fff",
        borderColor: "#fff",
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
        gap: 12,
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
        lineHeight: 24,
    },
    clearSearchButton: {
        backgroundColor: "rgba(35, 35, 36, 1)",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.1)",
    },
    clearSearchButtonText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "500",
    },

    // Cart Button
    cartButton: {
        position: "absolute",
        bottom: 20,
        left: 16,
        right: 16,
        height: 50,
        backgroundColor: "#fff",
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    cartButtonText: {
        color: "#000",
        fontSize: 16,
        fontWeight: "600",
    },
});
