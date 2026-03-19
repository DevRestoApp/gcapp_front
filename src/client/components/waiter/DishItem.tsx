import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface DishItemProps {
    id: string;
    name: string;
    description: string;
    price: string;
    image?: string;
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
    // В informative режиме — полностью controlled через initialQuantity (источник правды в родителе)
    // В interactive режиме — локальный стейт (standalone компонент)
    const isControlled = variant === "informative";

    const [localQuantity, setLocalQuantity] = useState(initialQuantity);

    // Sync только для interactive режима при внешнем изменении
    useEffect(() => {
        if (!isControlled) {
            setLocalQuantity(initialQuantity);
        }
    }, [initialQuantity, isControlled]);

    const quantity = isControlled ? initialQuantity : localQuantity;

    const handleDecrease = useCallback(() => {
        if (disabled || quantity <= 0) return;
        const next = quantity - 1;
        if (!isControlled) setLocalQuantity(next);
        onQuantityChange?.(id, next);
    }, [disabled, quantity, isControlled, onQuantityChange, id]);

    const handleIncrease = useCallback(() => {
        if (disabled) return;
        const next = quantity + 1;
        if (!isControlled) setLocalQuantity(next);
        onQuantityChange?.(id, next);
    }, [disabled, quantity, isControlled, onQuantityChange, id]);

    const handlePress = useCallback(() => {
        if (disabled) return;
        onPress?.(id);
    }, [disabled, onPress, id]);

    const formatPrice = (priceString: string) => {
        const match = priceString.match(/(\d[\d\s]*)/);
        if (match) {
            return `${parseInt(match[1].replace(/\s/g, "")).toLocaleString()} тг`;
        }
        return priceString;
    };

    const renderInfo = () => (
        <View style={styles.info}>
            <View style={styles.titleRow}>
                <Text style={styles.title} numberOfLines={2}>
                    {name}
                </Text>
                {quantity > 0 && (
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
                <View style={styles.informativeBottom}>
                    <Text style={styles.priceInline}>{formatPrice(price)}</Text>
                    {showQuantity && (
                        <View style={styles.quantityBoxInformative}>
                            <TouchableOpacity
                                onPress={handleDecrease}
                                disabled={disabled}
                                style={[
                                    styles.button,
                                    disabled && styles.buttonDisabled,
                                ]}
                                hitSlop={{
                                    top: 8,
                                    bottom: 8,
                                    left: 8,
                                    right: 8,
                                }}
                                activeOpacity={0.7}
                            >
                                <Text
                                    style={[
                                        styles.buttonText,
                                        disabled && styles.buttonTextDisabled,
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
                                style={[
                                    styles.button,
                                    disabled && styles.buttonDisabled,
                                ]}
                                hitSlop={{
                                    top: 8,
                                    bottom: 8,
                                    left: 8,
                                    right: 8,
                                }}
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
                    )}
                </View>
            )}
        </View>
    );

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

    const renderBottomSection = () => {
        if (variant === "informative") return null;
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

    const ContainerComponent = onPress ? TouchableOpacity : View;
    const containerProps = onPress
        ? { onPress: handlePress, activeOpacity: 0.8, disabled }
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
    containerInformative: { padding: 12 },
    containerDisabled: { opacity: 0.6 },

    info: { gap: 8 },
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
    informativeBottom: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 4,
    },
    priceInline: {
        fontSize: 16,
        fontWeight: "600",
        color: "#fff",
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
    quantityBadgeText: { color: "#000", fontSize: 12, fontWeight: "700" },

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
    price: { fontSize: 18, fontWeight: "bold", color: "#fff", flex: 1 },

    quantityBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(43, 43, 44, 1)",
        borderRadius: 18,
        paddingHorizontal: 6,
        height: 36,
        minWidth: 100,
    },
    quantityBoxInformative: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(43, 43, 44, 1)",
        borderRadius: 18,
        paddingHorizontal: 6,
        height: 32,
        minWidth: 90,
    },
    button: {
        width: 28,
        height: 28,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 14,
    },
    buttonDisabled: { opacity: 0.3 },
    buttonText: { fontSize: 18, fontWeight: "600", color: "#fff" },
    buttonTextDisabled: { color: "rgba(255, 255, 255, 0.3)" },
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
