import React, {
    useRef,
    useState,
    useMemo,
    forwardRef,
    useImperativeHandle,
    useEffect,
    useCallback,
} from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from "react-native";
import ModalWrapper, { ModalWrapperRef } from "./ModalWrapper";
import Loading from "@/src/client/components/Loading";
import { CommentInput } from "@/src/client/components/form/Comment";

import { Dish } from "@/src/client/types/waiter";
const { width: screenWidth } = Dimensions.get("window");

interface DishDetailModalProps {
    dish: Dish;
    initialQuantity?: number;
    initialComment?: string;
    /** quantity + comment — caller writes to WaiterProvider */
    onAddToOrder?: (quantity: number, comment?: string) => void;
    onClose?: () => void;
}

export type DishDetailModalRef = {
    open: () => void;
    close: () => void;
};

// ============================================================================
// Helpers
// ============================================================================

const parsePriceNumber = (price: string): number => {
    const match = price.match(/(\d[\d\s]*)/);
    if (!match) return 0;
    return parseInt(match[1].replace(/\s/g, ""), 10);
};

const formatPriceStr = (price: string): string =>
    `${parsePriceNumber(price).toLocaleString()} тг`;

// ============================================================================
// Component
// ============================================================================

const DishDetailModal = forwardRef<DishDetailModalRef, DishDetailModalProps>(
    (
        {
            dish,
            initialQuantity = 0,
            initialComment = "",
            onAddToOrder,
            onClose,
        },
        ref,
    ) => {
        const modalRef = useRef<ModalWrapperRef>(null);

        const [quantity, setQuantity] = useState(initialQuantity);
        const [comment, setComment] = useState(initialComment);
        const [imageLoading, setImageLoading] = useState(true);
        const [imageError, setImageError] = useState(false);

        // Sync when dish changes or modal re-opens with different dish
        useEffect(() => {
            setQuantity(initialQuantity);
            setComment(initialComment);
        }, [initialQuantity, initialComment, dish.id]);

        useEffect(() => {
            setImageLoading(true);
            setImageError(false);
        }, [dish.id]);

        useImperativeHandle(ref, () => ({
            open: () => modalRef.current?.open(),
            close: () => modalRef.current?.close(),
        }));

        const handleClose = useCallback(() => {
            onClose?.();
            modalRef.current?.close();
        }, [onClose]);

        const handleDecrease = useCallback(() => {
            if (quantity <= 0) return;
            setQuantity((q) => q - 1);
        }, [quantity]);

        const handleIncrease = useCallback(() => {
            setQuantity((q) => q + 1);
        }, []);

        const handleAddToOrder = useCallback(() => {
            if (quantity <= 0) return;
            onAddToOrder?.(quantity, comment);
        }, [quantity, comment, onAddToOrder]);

        const totalPrice = useMemo(() => {
            if (quantity <= 0) return null;
            const unit = parsePriceNumber(dish.price);
            return `${(unit * quantity).toLocaleString()} тг`;
        }, [dish.price, quantity]);

        // ── Render helpers ────────────────────────────────────────────────────

        const renderImageSection = () => (
            <View style={styles.imageContainer}>
                {imageError ? (
                    <View style={styles.imagePlaceholder}>
                        <Text style={styles.imagePlaceholderText}>
                            Изображение недоступно
                        </Text>
                    </View>
                ) : (
                    <>
                        <Image
                            source={{ uri: dish.image }}
                            style={styles.image}
                            onLoad={() => setImageLoading(false)}
                            onError={() => {
                                setImageLoading(false);
                                setImageError(true);
                            }}
                            resizeMode="cover"
                        />
                        {imageLoading && (
                            <View style={styles.imageLoader}>
                                <Loading />
                            </View>
                        )}
                    </>
                )}
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={handleClose}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    activeOpacity={0.7}
                >
                    <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
            </View>
        );

        const renderContentSection = () => (
            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={2}>
                    {dish.name}
                </Text>
                <Text style={styles.description} numberOfLines={3}>
                    {dish.description}
                </Text>
                <View style={styles.divider} />
                <View style={styles.priceSection}>
                    <Text style={styles.priceLabel}>Цена за порцию:</Text>
                    <Text style={styles.price}>
                        {formatPriceStr(dish.price)}
                    </Text>
                </View>
                {totalPrice && (
                    <View style={styles.totalSection}>
                        <Text style={styles.totalLabel}>Общая стоимость:</Text>
                        <Text style={styles.totalPrice}>{totalPrice}</Text>
                    </View>
                )}
            </View>
        );

        const renderActionsSection = () => (
            <View style={styles.actionsContainer}>
                <View style={styles.actions}>
                    {/* Quantity selector */}
                    <View style={styles.quantitySection}>
                        <Text style={styles.quantityLabel}>Количество:</Text>
                        <View style={styles.quantityBox}>
                            <TouchableOpacity
                                onPress={handleDecrease}
                                disabled={quantity === 0}
                                style={[
                                    styles.qtyButton,
                                    quantity === 0 && styles.qtyButtonDisabled,
                                ]}
                                hitSlop={{
                                    top: 5,
                                    bottom: 5,
                                    left: 5,
                                    right: 5,
                                }}
                                activeOpacity={0.7}
                            >
                                <Text
                                    style={[
                                        styles.qtyText,
                                        quantity === 0 &&
                                            styles.qtyTextDisabled,
                                    ]}
                                >
                                    −
                                </Text>
                            </TouchableOpacity>
                            <View style={styles.qtyValueContainer}>
                                <Text style={styles.qtyValue}>{quantity}</Text>
                            </View>
                            <TouchableOpacity
                                onPress={handleIncrease}
                                style={styles.qtyButton}
                                hitSlop={{
                                    top: 5,
                                    bottom: 5,
                                    left: 5,
                                    right: 5,
                                }}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.qtyText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Comment */}
                    <CommentInput
                        value={comment}
                        onChange={setComment}
                        placeholder="Комментарий к блюду..."
                        maxLength={200}
                    />

                    {/* Add to order */}
                    <TouchableOpacity
                        style={[
                            styles.addButton,
                            quantity === 0 && styles.addButtonDisabled,
                        ]}
                        onPress={handleAddToOrder}
                        disabled={quantity === 0}
                        activeOpacity={0.8}
                    >
                        <Text
                            style={[
                                styles.addButtonText,
                                quantity === 0 && styles.addButtonTextDisabled,
                            ]}
                        >
                            {quantity === 0
                                ? "Выберите количество"
                                : `Добавить в заказ (${quantity})`}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );

        return (
            <ModalWrapper ref={modalRef} onClose={onClose}>
                <View style={styles.modalContainer}>
                    {renderImageSection()}
                    {renderContentSection()}
                    {renderActionsSection()}
                </View>
            </ModalWrapper>
        );
    },
);

DishDetailModal.displayName = "DishDetailModal";
export default DishDetailModal;

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
    modalContainer: {
        width: "100%",
        maxWidth: Math.min(screenWidth - 32, 400),
        borderRadius: 24,
        backgroundColor: "rgba(35, 35, 36, 1)",
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    imageContainer: {
        height: 220,
        position: "relative",
        backgroundColor: "rgba(43, 43, 44, 1)",
    },
    image: { width: "100%", height: "100%" },
    imagePlaceholder: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(43, 43, 44, 1)",
    },
    imagePlaceholderText: { color: "rgba(255, 255, 255, 0.5)", fontSize: 14 },
    imageLoader: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
    },
    closeButton: {
        position: "absolute",
        top: 16,
        right: 16,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    closeText: { color: "#fff", fontSize: 18, fontWeight: "600" },
    content: { padding: 20 },
    title: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 8,
        lineHeight: 28,
    },
    description: {
        color: "rgba(121, 122, 128, 1)",
        fontSize: 15,
        lineHeight: 22,
        marginBottom: 16,
    },
    divider: {
        height: 1,
        backgroundColor: "rgba(43, 43, 44, 1)",
        marginVertical: 16,
    },
    priceSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    priceLabel: { color: "rgba(121, 122, 128, 1)", fontSize: 14 },
    price: { color: "#fff", fontSize: 18, fontWeight: "bold" },
    totalSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: "rgba(43, 43, 44, 1)",
    },
    totalLabel: { color: "rgba(121, 122, 128, 1)", fontSize: 14 },
    totalPrice: { color: "#fff", fontSize: 20, fontWeight: "bold" },
    actionsContainer: { padding: 20, paddingTop: 0 },
    actions: { gap: 16 },
    quantitySection: { alignItems: "center" },
    quantityLabel: {
        color: "rgba(121, 122, 128, 1)",
        fontSize: 14,
        marginBottom: 12,
    },
    quantityBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(43, 43, 44, 1)",
        borderRadius: 24,
        paddingHorizontal: 8,
        height: 48,
        minWidth: 140,
    },
    qtyButton: {
        width: 32,
        height: 32,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 16,
    },
    qtyButtonDisabled: { opacity: 0.3 },
    qtyText: { color: "#fff", fontSize: 20, fontWeight: "600" },
    qtyTextDisabled: { color: "rgba(255, 255, 255, 0.3)" },
    qtyValueContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        minHeight: 32,
    },
    qtyValue: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
        minWidth: 30,
        textAlign: "center",
    },
    addButton: {
        height: 52,
        borderRadius: 26,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    addButtonDisabled: {
        backgroundColor: "rgba(43, 43, 44, 1)",
        shadowOpacity: 0,
        elevation: 0,
    },
    addButtonText: { color: "#000", fontSize: 16, fontWeight: "600" },
    addButtonTextDisabled: { color: "rgba(255, 255, 255, 0.4)" },
});
