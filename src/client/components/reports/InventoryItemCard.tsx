import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { textStyles } from "@/src/client/styles/ui/text.styles";
import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";

interface InventoryItemCardProps {
    name: string;
    price: string;
    quantity: number;
}

export function InventoryItemCard({
    name,
    price,
    quantity,
}: InventoryItemCardProps) {
    let quantityBg;
    let quantityTextColor;
    if (quantity > 30) {
        quantityBg = backgroundsStyles.positiveBg;
        quantityTextColor = textStyles.positive;
    } else {
        quantityBg = backgroundsStyles.negativeBg;
        quantityTextColor = textStyles.negative;
    }

    return (
        <View style={styles.itemCard}>
            <View style={styles.itemHeader}>
                <Text style={styles.itemName}>{name}</Text>
                <View style={[styles.quantityBadge, quantityBg]}>
                    <Text style={[styles.quantityText, quantityTextColor]}>
                        Кол-во: {quantity}
                    </Text>
                </View>
            </View>
            <Text style={styles.itemPrice}>{price}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    itemCard: {
        padding: 16,
        borderRadius: 20,
        backgroundColor: "#2C2C2E",
        gap: 8,
    },
    itemHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    itemName: {
        fontSize: 18,
        fontWeight: "600",
        lineHeight: 24,
        flex: 1,
        ...textStyles.white,
    },
    quantityBadge: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        marginLeft: 8,
    },
    quantityText: {
        fontSize: 14,
        lineHeight: 18,
        fontWeight: "600",
    },
    itemPrice: {
        fontSize: 14,
        lineHeight: 20,
        color: "#797A80",
    },
});
