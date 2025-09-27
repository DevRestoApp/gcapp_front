import React, {
    useState,
    useImperativeHandle,
    forwardRef,
    useCallback,
    useEffect,
} from "react";
import {
    Modal,
    View,
    StyleSheet,
    TouchableWithoutFeedback,
    Animated,
    BackHandler,
    StatusBar,
    Dimensions,
} from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export type ModalWrapperRef = {
    open: () => void;
    close: () => void;
    isVisible: () => boolean;
};

interface ModalWrapperProps {
    children: React.ReactNode;
    onClose?: () => void;
    onOpen?: () => void;
    closeOnBackdropPress?: boolean;
    closeOnBackPress?: boolean;
    animationType?: "none" | "slide" | "fade" | "scale";
    backdropOpacity?: number;
    containerStyle?: any;
    contentStyle?: any;
}

const ModalWrapper = forwardRef<ModalWrapperRef, ModalWrapperProps>(
    (
        {
            children,
            onClose,
            onOpen,
            closeOnBackdropPress = true,
            closeOnBackPress = true,
            animationType = "fade",
            backdropOpacity = 0.5,
            containerStyle,
            contentStyle,
        },
        ref,
    ) => {
        const [visible, setVisible] = useState(false);
        const [animatedValue] = useState(new Animated.Value(0));

        // Imperative handle
        useImperativeHandle(
            ref,
            () => ({
                open: () => handleOpen(),
                close: () => handleClose(),
                isVisible: () => visible,
            }),
            [visible],
        );

        // Handle Android back button
        useEffect(() => {
            if (!visible || !closeOnBackPress) return;

            const backHandler = BackHandler.addEventListener(
                "hardwareBackPress",
                () => {
                    handleClose();
                    return true;
                },
            );

            return () => backHandler.remove();
        }, [visible, closeOnBackPress]);

        // Animation handlers
        const animateIn = useCallback(() => {
            Animated.timing(animatedValue, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }, [animatedValue]);

        const animateOut = useCallback(
            (callback?: () => void) => {
                Animated.timing(animatedValue, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true,
                }).start(callback);
            },
            [animatedValue],
        );

        // Modal control handlers
        const handleOpen = useCallback(() => {
            setVisible(true);
            onOpen?.();
            // Animate in after modal is visible
            requestAnimationFrame(() => {
                animateIn();
            });
        }, [onOpen, animateIn]);

        const handleClose = useCallback(() => {
            animateOut(() => {
                setVisible(false);
                onClose?.();
            });
        }, [onClose, animateOut]);

        const handleBackdropPress = useCallback(() => {
            if (closeOnBackdropPress) {
                handleClose();
            }
        }, [closeOnBackdropPress, handleClose]);

        // Animation styles
        const getAnimationStyle = () => {
            switch (animationType) {
                case "scale":
                    return {
                        transform: [
                            {
                                scale: animatedValue.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0.8, 1],
                                }),
                            },
                        ],
                        opacity: animatedValue,
                    };
                case "slide":
                    return {
                        transform: [
                            {
                                translateY: animatedValue.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [50, 0],
                                }),
                            },
                        ],
                        opacity: animatedValue,
                    };
                case "fade":
                default:
                    return {
                        opacity: animatedValue,
                    };
            }
        };

        const backdropStyle = {
            opacity: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, backdropOpacity],
            }),
        };

        if (!visible) {
            return null;
        }

        return (
            <>
                <StatusBar
                    backgroundColor="rgba(0,0,0,0.5)"
                    barStyle="light-content"
                />
                <Modal
                    visible={visible}
                    transparent
                    animationType="none" // We handle animations manually
                    onRequestClose={handleClose}
                    statusBarTranslucent
                >
                    {/* Animated backdrop */}
                    <Animated.View style={[styles.backdrop, backdropStyle]} />

                    {/* Overlay with touch handling */}
                    <TouchableWithoutFeedback onPress={handleBackdropPress}>
                        <View style={[styles.overlay, containerStyle]}>
                            {/* Modal content with animation */}
                            <TouchableWithoutFeedback onPress={() => {}}>
                                <Animated.View
                                    style={[
                                        styles.modalContent,
                                        getAnimationStyle(),
                                        contentStyle,
                                    ]}
                                >
                                    {children}
                                </Animated.View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            </>
        );
    },
);

ModalWrapper.displayName = "ModalWrapper";
export default ModalWrapper;

const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "#000",
    },
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 20,
    },
    modalContent: {
        width: "100%",
        maxWidth: Math.min(screenWidth - 32, 390),
        borderRadius: 20,
        backgroundColor: "rgba(35, 35, 36, 1)",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
        // Remove default padding - let children handle their own spacing
    },
});
