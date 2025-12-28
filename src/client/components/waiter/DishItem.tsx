import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface DishItemProps {
    id: string;
    name: string;
    description: string;
    price: string;
    image?: string; // Keep for future use
    initialQuantity?: number;
    onQuantityChange?: (id: string, quantity: number) => void;
    variant?: "interactive" | "informative";
    onPress?: (id: string) => void;
    showQuantity?: boolean;
    maxLines?: number;
    disabled?: boolean;
}

export default function DishItem({
    id,
    name,
    description,
    price,
    initialQuantity = 0,
    onQuantityChange,
    variant = "interactive",
    onPress,
    showQuantity = true,
    maxLines = 2,
    disabled = false,
}: DishItemProps) {
    const [quantity, setQuantity] = useState(initialQuantity);

    // Sync quantity with prop changes
    useEffect(() => {
        setQuantity(initialQuantity);
    }, [initialQuantity]);

    // Quantity handlers
    const handleDecrease = useCallback(() => {
        if (disabled) return;

        const newQuantity = Math.max(0, quantity - 1);
        setQuantity(newQuantity);
        onQuantityChange?.(id, newQuantity);
    }, [disabled, quantity, onQuantityChange, id]);

    const handleIncrease = useCallback(() => {
        if (disabled) return;

        const newQuantity = quantity + 1;
        setQuantity(newQuantity);
        onQuantityChange?.(id, newQuantity);
    }, [disabled, quantity, onQuantityChange, id]);

    // Item press handler
    const handlePress = useCallback(() => {
        if (disabled) return;
        onPress?.(id);
    }, [disabled, onPress, id]);

    // Format price
    const formatPrice = (priceString: string) => {
        const match = priceString.match(/(\d[\d\s]*)/);
        if (match) {
            const number = match[1].replace(/\s/g, "");
            return `${parseInt(number).toLocaleString()} тг`;
        }
        return priceString;
    };

    // Render info section
    const renderInfo = () => (
        <View style={styles.info}>
            <View style={styles.titleRow}>
                <Text style={styles.title} numberOfLines={2}>
                    {name}
                </Text>
                {quantity > 0 && variant === "interactive" && (
                    <View style={styles.quantityBadge}>
                        <Text style={styles.quantityBadgeText}>{quantity}</Text>
                    </View>
                )}
            </View>
            {description && (
                <Text style={styles.description} numberOfLines={maxLines}>
                    {description}
                </Text>
            )}
            {variant === "informative" && (
                <Text style={styles.priceInline}>{formatPrice(price)}</Text>
            )}
        </View>
    );

    // Render quantity controls (interactive mode)
    const renderQuantityControls = () => {
        if (variant !== "interactive" || !showQuantity) return null;

        return (
            <View style={styles.quantityBox}>
                <TouchableOpacity
                    onPress={handleDecrease}
                    disabled={quantity === 0 || disabled}
                    style={[
                        styles.button,
                        (quantity === 0 || disabled) && styles.buttonDisabled,
                    ]}
                    hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                    activeOpacity={0.7}
                >
                    <Text
                        style={[
                            styles.buttonText,
                            (quantity === 0 || disabled) &&
                                styles.buttonTextDisabled,
                        ]}
                    >
                        −
                    </Text>
                </TouchableOpacity>

                <View style={styles.quantityDisplay}>
                    <Text style={styles.quantity}>{quantity}</Text>
                </View>

                <TouchableOpacity
                    onPress={handleIncrease}
                    disabled={disabled}
                    style={[styles.button, disabled && styles.buttonDisabled]}
                    hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                    activeOpacity={0.7}
                >
                    <Text
                        style={[
                            styles.buttonText,
                            disabled && styles.buttonTextDisabled,
                        ]}
                    >
                        +
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    // Render bottom section
    const renderBottomSection = () => {
        if (variant === "informative") {
            return null;
        }

        return (
            <>
                <View style={styles.divider} />
                <View style={styles.bottomRow}>
                    <Text style={styles.price}>{formatPrice(price)}</Text>
                    {renderQuantityControls()}
                </View>
            </>
        );
    };

    // Main container - touchable if onPress is provided
    const ContainerComponent = onPress ? TouchableOpacity : View;
    const containerProps = onPress
        ? {
              onPress: handlePress,
              activeOpacity: 0.8,
              disabled: disabled,
          }
        : {};

    return (
        <ContainerComponent
            style={[
                styles.container,
                variant === "informative" && styles.containerInformative,
                disabled && styles.containerDisabled,
            ]}
            {...containerProps}
        >
            {renderInfo()}
            {renderBottomSection()}
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "rgba(35, 35, 36, 1)",
        borderRadius: 20,
        padding: 16,
        marginBottom: 12,
    },
    containerInformative: {
        padding: 12,
    },
    containerDisabled: {
        opacity: 0.6,
    },

    // Info styles
    info: {
        gap: 8,
    },
    titleRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
        lineHeight: 24,
        flex: 1,
    },
    description: {
        fontSize: 14,
        color: "rgba(121, 122, 128, 1)",
        lineHeight: 20,
    },
    priceInline: {
        fontSize: 16,
        fontWeight: "600",
        color: "#fff",
        marginTop: 4,
    },
    quantityBadge: {
        backgroundColor: "#fff",
        borderRadius: 12,
        minWidth: 24,
        height: 24,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    quantityBadgeText: {
        color: "#000",
        fontSize: 12,
        fontWeight: "700",
    },

    // Bottom section styles
    divider: {
        height: 1,
        backgroundColor: "rgba(43, 43, 44, 1)",
        marginVertical: 12,
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
        flex: 1,
    },

    // Quantity controls styles
    quantityBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(43, 43, 44, 1)",
        borderRadius: 18,
        paddingHorizontal: 6,
        height: 36,
        minWidth: 100,
    },
    button: {
        width: 28,
        height: 28,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 14,
    },
    buttonDisabled: {
        opacity: 0.3,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#fff",
    },
    buttonTextDisabled: {
        color: "rgba(255, 255, 255, 0.3)",
    },
    quantityDisplay: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    quantity: {
        minWidth: 20,
        textAlign: "center",
        fontSize: 16,
        fontWeight: "600",
        color: "#fff",
    },
});
