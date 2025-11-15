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
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import DishItem from "@/src/client/components/waiter/DishItem";
import DishDetailModal, {
    DishDetailModalRef,
} from "@/src/client/components/modals/DishDetailModal";
import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";
import { loadingStyles } from "@/src/client/styles/ui/loading.styles";

// ============================================================================
// Types
// ============================================================================

interface Dish {
    id: string;
    name: string;
    description: string;
    price: string;
    image: string;
    category: string;
}

interface Category {
    id: string;
    name: string;
}

interface MenuScreenProps {
    restaurantId?: string;
}

// ============================================================================
// Constants
// ============================================================================

const MOCK_CATEGORIES: Category[] = [
    { id: "1", name: "Завтраки" },
    { id: "2", name: "Горячие блюда" },
    { id: "3", name: "Супы" },
    { id: "4", name: "Гарниры" },
    { id: "5", name: "Холодные закуски" },
    { id: "6", name: "Десерты" },
    { id: "7", name: "Напитки" },
];

const MOCK_DISHES: Dish[] = [
    {
        id: "1",
        name: "Бесбармак по-казахски",
        description:
            "Состав: отварное мясо (конина, баранина или говядина), домашняя лапша, бульон, лук.",
        price: "Цена : 5 600 тг",
        image: "https://api.builder.io/api/v1/image/assets/TEMP/a029ad2c2b910105a5e7642e2ea862cfbe5dc138?width=120",
        category: "Горячие блюда",
    },
    {
        id: "2",
        name: "Манты с мясом",
        description:
            "Состав: тесто, мясная начинка из баранины и говядины, лук, специи.",
        price: "Цена : 3 200 тг",
        image: "https://api.builder.io/api/v1/image/assets/TEMP/a029ad2c2b910105a5e7642e2ea862cfbe5dc138?width=120",
        category: "Горячие блюда",
    },
    {
        id: "3",
        name: "Плов узбекский",
        description:
            "Состав: рис, мясо, морковь, лук, растительное масло, специи.",
        price: "Цена : 4 800 тг",
        image: "https://api.builder.io/api/v1/image/assets/TEMP/a029ad2c2b910105a5e7642e2ea862cfbe5dc138?width=120",
        category: "Горячие блюда",
    },
    {
        id: "4",
        name: "Борщ красный",
        description:
            "Состав: свекла, капуста, морковь, лук, мясной бульон, сметана.",
        price: "Цена : 2 400 тг",
        image: "https://api.builder.io/api/v1/image/assets/TEMP/a029ad2c2b910105a5e7642e2ea862cfbe5dc138?width=120",
        category: "Супы",
    },
    {
        id: "5",
        name: "Шурпа баранья",
        description:
            "Состав: баранина, картофель, морковь, лук, зелень, специи.",
        price: "Цена : 3 800 тг",
        image: "https://api.builder.io/api/v1/image/assets/TEMP/a029ad2c2b910105a5e7642e2ea862cfbe5dc138?width=120",
        category: "Супы",
    },
    {
        id: "6",
        name: "Омлет с беконом",
        description:
            "Состав: яйца, бекон, молоко, сыр, зелень, масло сливочное.",
        price: "Цена : 1 800 тг",
        image: "https://api.builder.io/api/v1/image/assets/TEMP/a029ad2c2b910105a5e7642e2ea862cfbe5dc138?width=120",
        category: "Завтраки",
    },
    {
        id: "7",
        name: "Сырники с джемом",
        description:
            "Состав: творог, яйца, мука, сахар, ванилин, джем, сметана.",
        price: "Цена : 1 400 тг",
        image: "https://api.builder.io/api/v1/image/assets/TEMP/a029ad2c2b910105a5e7642e2ea862cfbe5dc138?width=120",
        category: "Завтраки",
    },
];

const MOCK_DELAY = 800;
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

    const [dishes, setDishes] = useState<Dish[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Горячие блюда");
    const [quantities, setQuantities] = useState<Record<string, number>>({});
    const [selectedDish, setSelectedDish] = useState<Dish | null>(null);

    // ========================================================================
    // Refs
    // ========================================================================

    const modalRef = useRef<DishDetailModalRef>(null);

    // ========================================================================
    // Data Fetching
    // ========================================================================

    const fetchMenuData = useCallback(async () => {
        setLoading(true);

        try {
            // API Integration Point: Fetch menu data
            // Example:
            // const [dishesResponse, categoriesResponse] = await Promise.all([
            //   fetch(`YOUR_API_URL/api/restaurant/${restaurantId}/dishes`),
            //   fetch(`YOUR_API_URL/api/restaurant/${restaurantId}/categories`),
            // ]);
            // const dishesData = await dishesResponse.json();
            // const categoriesData = await categoriesResponse.json();
            // setDishes(dishesData.dishes);
            // setCategories(categoriesData.categories);

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));

            setDishes(MOCK_DISHES);
            setCategories(MOCK_CATEGORIES);
        } catch (error) {
            console.error("Error fetching menu data:", error);
            Alert.alert("Ошибка", "Не удалось загрузить меню");
        } finally {
            setLoading(false);
        }
    }, [restaurantId]);

    useEffect(() => {
        fetchMenuData();

        // Refresh data periodically
        const interval = setInterval(fetchMenuData, REFRESH_INTERVAL);
        return () => clearInterval(interval);
    }, [fetchMenuData]);

    // ========================================================================
    // Computed Values
    // ========================================================================

    const filteredDishes = useMemo(() => {
        return dishes.filter((dish) => {
            const matchesSearch =
                searchQuery.trim() === "" ||
                dish.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase().trim()) ||
                dish.description
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase().trim());
            const matchesCategory = dish.category === selectedCategory;
            return matchesSearch && matchesCategory;
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
        (dishId: string, quantity: number) => {
            setQuantities((prev) => ({
                ...prev,
                [dishId]: Math.max(0, quantity),
            }));
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

    const handleDishPress = useCallback((dish: Dish) => {
        setSelectedDish(dish);
        // Use setTimeout to ensure state is updated before opening modal
        setTimeout(() => {
            modalRef.current?.open();
        }, 0);
    }, []);

    const handleModalClose = useCallback(() => {
        setSelectedDish(null);
    }, []);

    const handleAddToOrder = useCallback(
        (quantity: number) => {
            if (selectedDish && quantity > 0) {
                handleQuantityChange(selectedDish.id, quantity);

                Alert.alert(
                    "Добавлено в заказ",
                    `${selectedDish.name} (${quantity} шт.) добавлено в заказ`,
                    [{ text: "OK" }],
                    { cancelable: true },
                );

                modalRef.current?.close();
                setSelectedDish(null);
            }
        },
        [selectedDish, handleQuantityChange],
    );

    const handleViewCart = useCallback(() => {
        // TODO: Navigate to cart screen
        // router.push('/cart');
        Alert.alert("Корзина", `В корзине ${totalCartItems} товаров`);
    }, [totalCartItems]);

    // ========================================================================
    // Render Functions
    // ========================================================================

    const renderLoadingState = () => (
        <View style={loadingStyles.loadingContainer}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={loadingStyles.loadingText}>Загрузка меню...</Text>
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

    const renderCategoryButton = (category: Category) => {
        const isSelected = selectedCategory === category.name;
        const dishCount = getCategoryDishCount(category.name);

        return (
            <TouchableOpacity
                key={category.id}
                onPress={() => handleCategoryChange(category.name)}
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
                    {category.name}
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

    const renderCategoriesSection = () => (
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

    const renderDishItem = (dish: Dish) => (
        <DishItem
            key={dish.id}
            id={dish.id}
            name={dish.name}
            description={dish.description}
            price={dish.price}
            image={dish.image}
            variant="interactive"
            initialQuantity={quantities[dish.id] || 0}
            onQuantityChange={handleQuantityChange}
            onPress={() => handleDishPress(dish)}
        />
    );

    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
                {searchQuery
                    ? "По вашему запросу ничего не найдено"
                    : `В категории "${selectedCategory}" пока нет блюд`}
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
                        ? `Найдено ${filteredDishes.length} блюд`
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

        return (
            <TouchableOpacity
                style={styles.cartButton}
                onPress={handleViewCart}
                activeOpacity={0.8}
            >
                <Text style={styles.cartButtonText}>
                    Корзина ({totalCartItems})
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
                    dish={selectedDish}
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
