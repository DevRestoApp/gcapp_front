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
import { useRouter } from "expo-router";

import DishItem from "@/src/client/components/waiter/DishItem";
import DishDetailModal, {
    DishDetailModalRef,
} from "@/src/client/components/modals/DishDetailModal";
import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";
import { loadingStyles } from "@/src/client/styles/ui/loading.styles";
import { getMenu } from "@/src/server/general/menu";
import Loading from "@/src/client/components/Loading";
import { useWaiter } from "@/src/contexts/WaiterProvider";
import { DishItemCreateOrderType as DishItemType } from "@/src/client/types/waiter";

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

type QuantitiesMap = Record<number, number>;

// ============================================================================
// Constants
// ============================================================================

const REFRESH_INTERVAL = 5 * 60 * 1000;
const DEFAULT_RESTAURANT_ID = "restaurant-123";

const MESSAGES = {
    ERROR_LOAD_MENU: "Не удалось загрузить меню",
    ERROR_TITLE: "Ошибка",
    LOADING_MENU: "Загрузка меню",
    SEARCH_PLACEHOLDER: "Искать блюда...",
    RETRY: "Попробовать снова",
    ADDED_TO_ORDER: "Добавлено в заказ",
    CART: "Корзина",
    ITEMS: "Товаров",
    TOTAL: "Сумма",
    CLEAR_SEARCH: "Очистить поиск",
    NO_RESULTS: "По вашему запросу ничего не найдено",
    EMPTY_CATEGORY: "пока нет блюд",
    EMPTY_MENU: "Меню пусто",
    FOUND: "Найдено",
    DISH: "блюдо",
    DISHES: "блюд",
    NOT_FOUND: "Блюда не найдены",
} as const;

// ============================================================================
// Utility Functions
// ============================================================================

const extractUniqueCategories = (items: MenuItem[]): string[] =>
    Array.from(new Set(items.map((item) => item.category))).filter(
        Boolean,
    ) as string[];

const formatPrice = (price: number): string =>
    `${price.toLocaleString("ru-RU")} тг`;

const getDishCountText = (count: number): string =>
    count === 1 ? MESSAGES.DISH : MESSAGES.DISHES;

// ============================================================================
// Custom Hooks
// ============================================================================

const useMenuData = (restaurantId: string) => {
    const [dishes, setDishes] = useState<MenuItem[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>("");

    const fetchMenuData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getMenu({});
            if (!response?.items || !Array.isArray(response.items)) {
                throw new Error("Invalid menu data received");
            }
            const uniqueCategories = extractUniqueCategories(response.items);
            setDishes(response.items);
            setCategories(uniqueCategories);
            if (!selectedCategory && uniqueCategories.length > 0) {
                setSelectedCategory(uniqueCategories[0]);
            }
        } catch (err: any) {
            setError(err.message || MESSAGES.ERROR_LOAD_MENU);
            Alert.alert(MESSAGES.ERROR_TITLE, MESSAGES.ERROR_LOAD_MENU);
        } finally {
            setLoading(false);
        }
    }, [selectedCategory]);

    useEffect(() => {
        fetchMenuData();
        const interval = setInterval(fetchMenuData, REFRESH_INTERVAL);
        return () => clearInterval(interval);
    }, [fetchMenuData]);

    return {
        dishes,
        categories,
        loading,
        error,
        selectedCategory,
        setSelectedCategory,
        refetch: fetchMenuData,
    };
};

const useMenuFilters = (dishes: MenuItem[], selectedCategory: string) => {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredDishes = useMemo(
        () =>
            dishes.filter((dish) => {
                if (searchQuery.trim()) {
                    const query = searchQuery.toLowerCase().trim();
                    if (
                        !dish.name.toLowerCase().includes(query) &&
                        !dish.description?.toLowerCase().includes(query)
                    )
                        return false;
                }
                if (selectedCategory && dish.category !== selectedCategory)
                    return false;
                return true;
            }),
        [dishes, searchQuery, selectedCategory],
    );

    const clearSearch = useCallback(() => setSearchQuery(""), []);
    return { searchQuery, setSearchQuery, clearSearch, filteredDishes };
};

// ============================================================================
// Main Component
// ============================================================================

export default function MenuScreen({
    restaurantId = DEFAULT_RESTAURANT_ID,
}: MenuScreenProps = {}) {
    const router = useRouter();

    const {
        dishes,
        categories,
        loading,
        error,
        selectedCategory,
        setSelectedCategory,
        refetch,
    } = useMenuData(restaurantId);

    const { searchQuery, setSearchQuery, clearSearch, filteredDishes } =
        useMenuFilters(dishes, selectedCategory);

    const { selectedDishes, setSelectedDishes } = useWaiter();

    const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
    const modalRef = useRef<DishDetailModalRef>(null);

    // ── Computed ─────────────────────────────────────────────────────────────

    const getCategoryDishCount = useCallback(
        (category: string) =>
            dishes.filter((d) => d.category === category).length,
        [dishes],
    );

    // Cart totals derived from context (source of truth)
    const { totalItems, totalPrice } = useMemo(() => {
        const items = selectedDishes.reduce((sum, d) => sum + d.amount, 0);
        const price = selectedDishes.reduce((sum, d) => sum + d.sum, 0);
        return { totalItems: items, totalPrice: price };
    }, [selectedDishes]);

    // Per-dish quantities for badge display on cards
    const quantityMap = useMemo(() => {
        return selectedDishes.reduce<QuantitiesMap>((acc, d) => {
            acc[d.productId] = d.amount;
            return acc;
        }, {});
    }, [selectedDishes]);

    // ── Handlers ─────────────────────────────────────────────────────────────

    const handleCategoryChange = useCallback(
        (category: string) => {
            setSelectedCategory(category);
            clearSearch();
        },
        [setSelectedCategory, clearSearch],
    );

    // Opens the modal — the only way to add/edit a dish
    const handleDishPress = useCallback((dish: MenuItem) => {
        setSelectedDish(dish);
        setTimeout(() => modalRef.current?.open(), 0);
    }, []);

    const handleModalClose = useCallback(() => {
        setSelectedDish(null);
    }, []);

    /**
     * Called from DishDetailModal on confirm.
     * Upserts the dish (with optional comment) into WaiterProvider.selectedDishes.
     */
    const handleAddToOrder = useCallback(
        (quantity: number, comment?: string) => {
            if (!selectedDish || quantity <= 0) return;

            const newItem: DishItemType = {
                ...selectedDish,
                productId: selectedDish.id,
                amount: quantity,
                price: selectedDish.price,
                sum: selectedDish.price * quantity,
                comment: comment?.trim() || undefined,
            };

            setSelectedDishes((prev) => {
                const idx = prev.findIndex(
                    (d) => d.productId === selectedDish.id,
                );
                if (idx !== -1) {
                    const updated = [...prev];
                    updated[idx] = newItem;
                    return updated;
                }
                return [...prev, newItem];
            });

            Alert.alert(
                MESSAGES.ADDED_TO_ORDER,
                `${selectedDish.name} (${quantity} шт.) — ${formatPrice(selectedDish.price * quantity)}`,
                [{ text: "OK" }],
                { cancelable: true },
            );

            modalRef.current?.close();
            setSelectedDish(null);
        },
        [selectedDish, setSelectedDishes],
    );

    const handleViewCart = useCallback(() => {
        router.push("/waiter/newOrder");
    }, [totalItems, totalPrice]);

    // ── Render helpers ────────────────────────────────────────────────────────

    const renderLoadingState = () => (
        <View style={loadingStyles.loadingContainer}>
            <Loading text={MESSAGES.LOADING_MENU} />
        </View>
    );

    const renderErrorState = () => (
        <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={refetch} style={styles.retryButton}>
                <Text style={styles.retryButtonText}>{MESSAGES.RETRY}</Text>
            </TouchableOpacity>
        </View>
    );

    const renderSearchSection = () => (
        <View style={styles.searchWrapper}>
            <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder={MESSAGES.SEARCH_PLACEHOLDER}
                placeholderTextColor="#797A80"
                style={styles.searchInput}
                returnKeyType="search"
                clearButtonMode="while-editing"
            />
            {searchQuery.length > 0 && (
                <TouchableOpacity
                    onPress={clearSearch}
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
                {getCategoryDishCount(category) > 0 && (
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
                            {getCategoryDishCount(category)}
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
        const qty = quantityMap[dish.id] || 0;
        return (
            <DishItem
                key={`dish-${dish.id}`}
                id={String(dish.id)}
                name={dish.name}
                description={dish.description || ""}
                price={formatPrice(dish.price)}
                image=""
                variant="informative"
                initialQuantity={qty}
                showQuantity={true}
                // No-op: quantity can only be changed through the modal
                onQuantityChange={() => {}}
                onPress={() => handleDishPress(dish)}
            />
        );
    };

    const renderEmptyState = () => {
        const msg = searchQuery
            ? MESSAGES.NO_RESULTS
            : selectedCategory
              ? `В категории "${selectedCategory}" ${MESSAGES.EMPTY_CATEGORY}`
              : MESSAGES.EMPTY_MENU;
        return (
            <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>{msg}</Text>
                {searchQuery && (
                    <TouchableOpacity
                        onPress={clearSearch}
                        style={styles.clearSearchButton}
                    >
                        <Text style={styles.clearSearchButtonText}>
                            {MESSAGES.CLEAR_SEARCH}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    const renderDishesSection = () => {
        const resultsText =
            filteredDishes.length > 0
                ? `${MESSAGES.FOUND} ${filteredDishes.length} ${getDishCountText(filteredDishes.length)}`
                : MESSAGES.NOT_FOUND;
        return (
            <View style={styles.dishesSection}>
                {searchQuery.trim() !== "" && (
                    <Text style={styles.searchResultsText}>{resultsText}</Text>
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
    };

    const renderCartButton = () => {
        if (totalItems === 0) return null;
        console.log(selectedDishes);
        return (
            <TouchableOpacity
                style={styles.cartButton}
                onPress={handleViewCart}
                activeOpacity={0.8}
            >
                <Text style={styles.cartButtonText}>
                    {MESSAGES.CART} ({totalItems}) • {formatPrice(totalPrice)}
                </Text>
            </TouchableOpacity>
        );
    };

    const renderModal = () => {
        if (!selectedDish) return null;
        return (
            <DishDetailModal
                ref={modalRef}
                dish={{
                    id: String(selectedDish.id),
                    name: selectedDish.name,
                    description: selectedDish.description || "",
                    price: formatPrice(selectedDish.price),
                    image: selectedDish.image,
                    category: selectedDish.category,
                }}
                onClose={handleModalClose}
                initialQuantity={quantityMap[selectedDish.id] || 0}
                initialComment={
                    selectedDishes.find((d) => d.productId === selectedDish.id)
                        ?.comment ?? ""
                }
                onAddToOrder={handleAddToOrder}
            />
        );
    };

    // ── Main render ───────────────────────────────────────────────────────────

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
            {renderModal()}
        </SafeAreaView>
    );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 100,
        flexGrow: 1,
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
    retryButtonText: { color: "#000", fontSize: 16, fontWeight: "600" },
    searchWrapper: { position: "relative", marginBottom: 20 },
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
    clearButtonText: { color: "#797A80", fontSize: 16, fontWeight: "bold" },
    categoriesSection: { marginBottom: 24 },
    categoriesScrollContent: { paddingRight: 16 },
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
    categoryButtonActive: { backgroundColor: "#fff", borderColor: "#fff" },
    categoryText: { color: "#797A80", fontSize: 14, fontWeight: "500" },
    categoryTextActive: { color: "#000", fontWeight: "600" },
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
    categoryBadgeActive: { backgroundColor: "rgba(0, 0, 0, 0.1)" },
    categoryBadgeText: { color: "#797A80", fontSize: 12, fontWeight: "600" },
    categoryBadgeTextActive: { color: "#000" },
    searchResultsText: {
        color: "#797A80",
        fontSize: 14,
        marginBottom: 16,
        textAlign: "center",
    },
    dishesSection: { flex: 1 },
    dishesList: { gap: 12 },
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
    clearSearchButtonText: { color: "#fff", fontSize: 14, fontWeight: "500" },
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
    cartButtonText: { color: "#000", fontSize: 16, fontWeight: "600" },
});
