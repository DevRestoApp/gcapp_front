import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

interface DishItemProps {
    id: string;
    name: string;
    description: string;
    price: string;
    image: string;
    initialQuantity?: number;
    onQuantityChange?: (id: string, quantity: number) => void;
}

export default function DishItem({
    id,
    name,
    description,
    price,
    image,
    initialQuantity = 0,
    onQuantityChange,
}: DishItemProps) {
    const [quantity, setQuantity] = useState(initialQuantity);

    const handleDecrease = () => {
        const newQuantity = Math.max(0, quantity - 1);
        setQuantity(newQuantity);
        onQuantityChange?.(id, newQuantity);
    };

    const handleIncrease = () => {
        const newQuantity = quantity + 1;
        setQuantity(newQuantity);
        onQuantityChange?.(id, newQuantity);
    };

    return (
        <View style={styles.container}>
            {/* Верхняя часть: картинка + информация */}
            <View style={styles.topRow}>
                <Image source={{ uri: image }} style={styles.image} />

                <View style={styles.info}>
                    <Text style={styles.title}>{name}</Text>
                    <Text style={styles.description} numberOfLines={1}>
                        {description}
                    </Text>
                </View>
            </View>

            {/* Разделитель */}
            <View style={styles.divider} />

            {/* Нижняя часть: цена + счётчик */}
            <View style={styles.bottomRow}>
                <Text style={styles.price}>{price}</Text>

                <View style={styles.quantityBox}>
                    <TouchableOpacity
                        onPress={handleDecrease}
                        disabled={quantity === 0}
                        style={styles.button}
                    >
                        <Text style={[styles.buttonText, { color: "#797A80" }]}>
                            −
                        </Text>
                    </TouchableOpacity>

                    <Text style={styles.quantity}>{quantity}</Text>

                    <TouchableOpacity
                        onPress={handleIncrease}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>＋</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "rgba(35, 35, 36, 1)",
        borderRadius: 20,
        padding: 12,
        marginBottom: 12,
    },
    topRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 10,
    },
    info: {
        flex: 1,
        marginLeft: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
    },
    description: {
        fontSize: 14,
        color: "rgba(121, 122, 128, 1)",
    },
    divider: {
        height: 1,
        backgroundColor: "rgba(43, 43, 44, 1)",
        marginVertical: 8,
    },
    bottomRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    price: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
    },
    quantityBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(43, 43, 44, 1)",
        borderRadius: 12,
        paddingHorizontal: 8,
        height: 36,
    },
    button: {
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    buttonText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
    },
    quantity: {
        minWidth: 24,
        textAlign: "center",
        fontSize: 16,
        fontWeight: "600",
        color: "#fff",
    },
});
