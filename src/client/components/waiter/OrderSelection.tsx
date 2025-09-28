import React, { useState, useCallback } from "react";
import { useRouter } from "expo-router";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Alert,
} from "react-native";
import DishItem from "./DishItem"; // Import our flexible DishItem
import { ButtonStyles } from "@/src/client/styles/ui/buttons/Button.styles";

interface Dish {
    id: string;
    name: string;
    description: string;
    price: string;
    image: string;
    category: string;
}

interface OrderSelectionProps {
    onTableChange?: (table: string) => void;
    onRoomChange?: (room: string) => void;
    onAddDish?: () => void;
    onDishPress?: (dish: Dish) => void;
    dishes?: Dish[]; // Optional dishes list
}

// Sample dishes data
const sampleDishes: Dish[] = [
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
        name: "Омлет с беконом",
        description:
            "Состав: яйца, бекон, молоко, сыр, зелень, масло сливочное.",
        price: "Цена : 1 800 тг",
        image: "https://api.builder.io/api/v1/image/assets/TEMP/a029ad2c2b910105a5e7642e2ea862cfbe5dc138?width=120",
        category: "Завтраки",
    },
];

export default function OrderSelection({
    onTableChange,
    onRoomChange,
    onAddDish,
    onDishPress,
    dishes = sampleDishes,
}: OrderSelectionProps) {
    const router = useRouter();

    const [selectedTable, setSelectedTable] = useState("");
    const [selectedRoom, setSelectedRoom] = useState("Общий зал");

    const rooms = [
        "Общий зал",
        "Открытая VIP-беседка",
        "Летняя терраса",
        "VIP-залы",
    ];

    // Handlers
    const handleTableChange = useCallback(
        (value: string) => {
            setSelectedTable(value);
            onTableChange?.(value);
        },
        [onTableChange],
    );

    const handleRoomSelect = useCallback(
        (room: string) => {
            setSelectedRoom(room);
            onRoomChange?.(room);
        },
        [onRoomChange],
    );

    const handleDishPress = useCallback(
        (dishId: string) => {
            const dish = dishes.find((d) => d.id === dishId);
            if (dish) {
                onDishPress?.(dish);
            }
        },
        [dishes, onDishPress],
    );

    const handleAddMoreDishes = useCallback(() => {
        onAddDish?.();
        router.push("/waiter/menu");
    }, [onAddDish, router]);

    const isFormValid = selectedTable.trim().length > 0;

    // Render table selection section
    const renderTableSelection = () => (
        <View style={styles.section}>
            <Text style={styles.title}>Выберите стол</Text>
            <TextInput
                value={selectedTable}
                onChangeText={handleTableChange}
                placeholder="Введите номер стола"
                placeholderTextColor="#797A80"
                style={[
                    styles.input,
                    selectedTable.trim().length > 0 && styles.inputFilled,
                ]}
                keyboardType="default"
                returnKeyType="next"
                autoCapitalize="none"
                maxLength={20}
            />
            {selectedTable.trim().length === 0 && (
                <Text style={styles.helperText}>Обязательное поле</Text>
            )}
        </View>
    );

    // Render room selection section
    const renderRoomSelection = () => (
        <View style={styles.section}>
            <Text style={styles.title}>Выберите помещение</Text>
            <View style={styles.roomsContainer}>
                {rooms.map((room) => {
                    const isSelected = selectedRoom === room;
                    return (
                        <TouchableOpacity
                            key={room}
                            onPress={() => handleRoomSelect(room)}
                            style={[
                                styles.roomButton,
                                isSelected && styles.roomButtonActive,
                            ]}
                            activeOpacity={0.7}
                        >
                            <Text
                                style={[
                                    styles.roomButtonText,
                                    isSelected && styles.roomButtonTextActive,
                                ]}
                                numberOfLines={1}
                            >
                                {room}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );

    // Render dishes section
    const renderDishesSection = () => (
        <View style={styles.section}>
            <View style={styles.dishesHeader}>
                <Text style={styles.title}>
                    Рекомендуемые блюда ({dishes.length})
                </Text>
                <TouchableOpacity
                    onPress={handleAddMoreDishes}
                    style={styles.addMoreButton}
                    activeOpacity={0.7}
                >
                    <Text style={styles.addMoreButtonText}>Посмотреть все</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.dishesContainer}>
                {dishes.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateIcon}>🍽️</Text>
                        <Text style={styles.emptyText}>Нет доступных блюд</Text>
                        <TouchableOpacity
                            style={styles.emptyActionButton}
                            onPress={handleAddMoreDishes}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.emptyActionButtonText}>
                                Перейти к меню
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
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
                                onPress={handleDishPress}
                                maxLines={2}
                            />
                        ))}
                    </ScrollView>
                )}
            </View>
        </View>
    );

    // Render action buttons
    const renderActionButtons = () => (
        <View style={styles.actionsSection}>
            <TouchableOpacity
                style={[
                    styles.primaryButton,
                    !isFormValid && styles.primaryButtonDisabled,
                ]}
                onPress={() => {
                    if (!isFormValid) {
                        Alert.alert(
                            "Заполните форму",
                            "Пожалуйста, выберите стол",
                            [{ text: "OK" }],
                        );
                        return;
                    }

                    Alert.alert(
                        "Заказ создан",
                        `Стол: ${selectedTable}\nПомещение: ${selectedRoom}`,
                        [
                            {
                                text: "Продолжить",
                                onPress: () => router.push("/waiter/menu"),
                            },
                        ],
                    );
                }}
                disabled={!isFormValid}
                activeOpacity={0.8}
            >
                <Text
                    style={[
                        styles.primaryButtonText,
                        !isFormValid && styles.primaryButtonTextDisabled,
                    ]}
                >
                    Создать заказ
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleAddMoreDishes}
                activeOpacity={0.7}
            >
                <Text style={styles.secondaryButtonText}>Перейти к меню</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            {renderTableSelection()}
            {renderRoomSelection()}
            {renderDishesSection()}
            {renderActionButtons()}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
    content: {
        gap: 28,
        paddingHorizontal: 16,
        paddingVertical: 20,
        paddingBottom: 40,
        width: "100%",
        maxWidth: 390,
        alignSelf: "center",
    },

    // Section styles
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

    // Input styles
    input: {
        height: 44,
        borderRadius: 20,
        paddingHorizontal: 16,
        fontSize: 16,
        backgroundColor: "rgba(35, 35, 36, 1)",
        color: "#fff",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.1)",
    },
    inputFilled: {
        borderColor: "#fff",
        color: "#fff",
    },
    helperText: {
        fontSize: 12,
        color: "#FF6B6B",
        marginTop: 4,
        marginLeft: 4,
    },

    // Room selection styles
    roomsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    roomButton: {
        height: 44,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: "rgba(43, 43, 44, 1)",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "transparent",
    },
    roomButtonActive: {
        backgroundColor: "#FFFFFF",
        borderColor: "#FFFFFF",
    },
    roomButtonText: {
        fontSize: 14,
        color: "#797A80",
        fontWeight: "500",
    },
    roomButtonTextActive: {
        color: "#2C2D2E",
        fontWeight: "600",
    },

    // Dishes section styles
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

    // Empty state styles
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

    // Action buttons styles
    actionsSection: {
        gap: 12,
        marginTop: 8,
    },
    primaryButton: {
        height: 48,
        borderRadius: 24,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    primaryButtonDisabled: {
        backgroundColor: "rgba(43, 43, 44, 1)",
        shadowOpacity: 0,
        elevation: 0,
    },
    primaryButtonText: {
        color: "#000",
        fontSize: 16,
        fontWeight: "600",
    },
    primaryButtonTextDisabled: {
        color: "rgba(255, 255, 255, 0.4)",
    },
    secondaryButton: {
        height: 48,
        borderRadius: 24,
        backgroundColor: "rgba(43, 43, 44, 1)",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.1)",
    },
    secondaryButtonText: {
        color: "rgba(255, 255, 255, 0.9)",
        fontSize: 16,
        fontWeight: "500",
    },
});
