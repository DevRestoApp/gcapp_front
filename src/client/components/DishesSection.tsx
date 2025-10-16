import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
} from "react-native";
import DishItem from "./waiter/DishItem";

interface Dish {
    id: string;
    name: string;
    description: string;
    price: string;
    image: string;
    category: string;
}

interface DishesSectionProps {
    dishes: Dish[];
    onDishPress: (dishId: string) => void;
    onAddMoreDishes: () => void;
}

export default function DishesSection({
    dishes,
    onDishPress,
    onAddMoreDishes,
}: DishesSectionProps) {
    return (
        <View style={styles.section}>
            <View style={styles.dishesHeader}>
                <Text style={styles.title}>
                    Рекомендуемые блюда ({dishes.length})
                </Text>
                <TouchableOpacity
                    onPress={onAddMoreDishes}
                    style={styles.addMoreButton}
                    activeOpacity={0.7}
                >
                    <Text style={styles.addMoreButtonText}>Все блюда</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.dishesContainer}>
                {dishes.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateIcon}>🍽️</Text>
                        <Text style={styles.emptyText}>Нет доступных блюд</Text>
                        <TouchableOpacity
                            style={styles.emptyActionButton}
                            onPress={onAddMoreDishes}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.emptyActionButtonText}>
                                Перейти к меню
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        <ScrollView
                            style={styles.dishesList}
                            contentContainerStyle={styles.dishesContent}
                            showsVerticalScrollIndicator={false}
                            nestedScrollEnabled
                        >
                            {dishes.map((dish) => (
                                <DishItem
                                    key={dish.id}
                                    id={dish.id}
                                    name={dish.name}
                                    description={dish.description}
                                    price={dish.price}
                                    image={dish.image}
                                    variant="informative"
                                    onPress={onDishPress}
                                    maxLines={2}
                                />
                            ))}
                        </ScrollView>

                        <TouchableOpacity
                            style={styles.addDishButton}
                            onPress={onAddMoreDishes}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.addDishButtonText}>
                                + Добавить блюдо
                            </Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        gap: 16,
        width: "100%",
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        color: "white",
        lineHeight: 28,
    },
    dishesHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    addMoreButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        backgroundColor: "rgba(43, 43, 44, 1)",
    },
    addMoreButtonText: {
        fontSize: 12,
        color: "#fff",
        fontWeight: "500",
    },
    dishesContainer: {
        borderRadius: 20,
        backgroundColor: "rgba(35, 35, 36, 1)",
        overflow: "hidden",
    },
    dishesList: {
        maxHeight: 300,
    },
    dishesContent: {
        padding: 12,
        gap: 8,
    },
    addDishButton: {
        margin: 12,
        height: 44,
        borderRadius: 20,
        backgroundColor: "rgba(43, 43, 44, 1)",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.2)",
        borderStyle: "dashed",
    },
    addDishButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "500",
    },
    emptyState: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 40,
        paddingHorizontal: 20,
        gap: 12,
    },
    emptyStateIcon: {
        fontSize: 48,
        opacity: 0.6,
    },
    emptyText: {
        fontSize: 16,
        color: "rgba(255,255,255,0.75)",
        textAlign: "center",
        lineHeight: 22,
    },
    emptyActionButton: {
        backgroundColor: "rgba(43, 43, 44, 1)",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 16,
        marginTop: 8,
    },
    emptyActionButtonText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "500",
    },
});
