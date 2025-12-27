import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from "react-native";

interface DishItemProps {
    id: string;
    name: string;
    description: string;
    price: string;
    image: string;
    initialQuantity?: number;
    onQuantityChange?: (id: string, quantity: number) => void;
    // New props for flexibility
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
    image,
    initialQuantity = 0,
    onQuantityChange,
    variant = "interactive",
    onPress,
    showQuantity = true,
    maxLines = 2,
    disabled = false,
}: DishItemProps) {
    const [quantity, setQuantity] = useState(initialQuantity);
    const [imageLoading, setImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);

    // Sync quantity with prop changes
    useEffect(() => {
        setQuantity(initialQuantity);
    }, [initialQuantity]);

    // Reset image states when image URL changes
    useEffect(() => {
        setImageLoading(true);
        setImageError(false);
    }, [image]);

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

    // Image handlers
    const handleImageLoad = useCallback(() => {
        setImageLoading(false);
    }, []);

    const handleImageError = useCallback(() => {
        setImageLoading(false);
        setImageError(true);
    }, []);

    // Format price
    const formatPrice = (priceString: string) => {
        const match = priceString.match(/(\d[\d\s]*)/);
        if (match) {
            const number = match[1].replace(/\s/g, "");
            return `${parseInt(number).toLocaleString()} тг`;
        }
        return priceString;
    };

    // Render image section
    const renderImage = () => (
        <View style={styles.imageContainer}>
            {imageError ? (
                <View style={styles.imagePlaceholder}>
                    <Text style={styles.imagePlaceholderText}>📷</Text>
                </View>
            ) : (
                <>
                    {image && (
                        <Image
                            source={{ uri: image }}
                            style={styles.image}
                            onLoad={handleImageLoad}
                            onError={handleImageError}
                            resizeMode="cover"
                        />
                    )}
                    {imageLoading && (
                        <View style={styles.imageLoader}>
                            <ActivityIndicator size="small" color="#fff" />
                        </View>
                    )}
                </>
            )}
            {quantity > 0 && variant === "interactive" && (
                <View style={styles.quantityBadge}>
                    <Text style={styles.quantityBadgeText}>{quantity}</Text>
                </View>
            )}
        </View>
    );

    // Render info section
    const renderInfo = () => (
        <View style={styles.info}>
            <Text style={styles.title} numberOfLines={2}>
                {name}
            </Text>
            <Text style={styles.description} numberOfLines={maxLines}>
                {description}
            </Text>
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
            return null; // Price is already shown inline in info section
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
            {/* Top section: image + info */}
            <View style={styles.topRow}>
                {renderImage()}
                {renderInfo()}
            </View>

            {/* Bottom section: price + quantity (interactive mode only) */}
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

    // Top row styles
    topRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 12,
    },

    // Image styles
    imageContainer: {
        position: "relative",
        marginRight: 12,
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 12,
    },
    imagePlaceholder: {
        width: 70,
        height: 70,
        borderRadius: 12,
        backgroundColor: "rgba(43, 43, 44, 1)",
        justifyContent: "center",
        alignItems: "center",
    },
    imagePlaceholderText: {
        fontSize: 24,
        opacity: 0.5,
    },
    imageLoader: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        borderRadius: 12,
    },
    quantityBadge: {
        position: "absolute",
        top: -6,
        right: -6,
        backgroundColor: "#fff",
        borderRadius: 12,
        minWidth: 24,
        height: 24,
        justifyContent: "center",
        alignItems: "center",
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

    // Info styles
    info: {
        flex: 1,
        gap: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
        lineHeight: 24,
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
