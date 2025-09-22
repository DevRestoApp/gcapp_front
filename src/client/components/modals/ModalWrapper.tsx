import React, { useState, useImperativeHandle, forwardRef } from "react";
import {
    Modal,
    View,
    StyleSheet,
    TouchableWithoutFeedback,
} from "react-native";

export type ModalWrapperRef = {
    open: () => void;
    close: () => void;
};

type Props = {
    children: React.ReactNode;
};

const ModalWrapper = forwardRef<ModalWrapperRef, Props>(({ children }, ref) => {
    const [visible, setVisible] = useState(false);

    useImperativeHandle(ref, () => ({
        open: () => setVisible(true),
        close: () => setVisible(false),
    }));

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={() => setVisible(false)}
        >
            {/* overlay */}
            <TouchableWithoutFeedback onPress={() => setVisible(false)}>
                <View style={styles.overlay}>
                    {/* modal content */}
                    <TouchableWithoutFeedback>
                        <View style={styles.modalContent}>{children}</View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
});

ModalWrapper.displayName = "ModalWrapper";
export default ModalWrapper;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.8)", // DialogOverlay bg-black/80
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 16,
    },
    modalContent: {
        width: "100%",
        maxWidth: 390, // max-w-[390px]
        borderRadius: 20, // rounded-[20px]
        padding: 16, // p-4
        backgroundColor: "rgba(35, 35, 36, 1)", // bg-[#232324]
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
});
