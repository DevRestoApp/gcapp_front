import React, { useState, useRef } from "react";
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Modal,
    TouchableWithoutFeedback,
} from "react-native";
import Svg, { Path } from "react-native-svg";

const DropdownMenuDots = ({ children, buttonStyle, menuStyle }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
    const buttonRef = useRef(null);

    const handleToggle = () => {
        if (!isOpen && buttonRef.current) {
            buttonRef.current.measure((fx, fy, width, height, px, py) => {
                setMenuPosition({
                    top: py + height,
                    right: 10, // Adjust as needed
                });
                setIsOpen(true);
            });
        } else {
            setIsOpen(false);
        }
    };

    return (
        <View>
            <TouchableOpacity
                ref={buttonRef}
                style={[styles.headerButton, buttonStyle]}
                activeOpacity={0.7}
                onPress={handleToggle}
            >
                <Svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <Path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M0.666748 3.00033C0.666748 1.71166 1.71142 0.666992 3.00008 0.666992C4.28875 0.666992 5.33342 1.71166 5.33342 3.00033C5.33342 4.28899 4.28875 5.33366 3.00008 5.33366C1.71142 5.33366 0.666748 4.28899 0.666748 3.00033ZM3.00008 7.66699C1.71142 7.66699 0.666748 8.71166 0.666748 10.0003C0.666748 11.289 1.71142 12.3337 3.00008 12.3337C4.28875 12.3337 5.33342 11.289 5.33342 10.0003C5.33342 8.71166 4.28875 7.66699 3.00008 7.66699ZM0.666748 17.0003C0.666748 15.7117 1.71142 14.667 3.00008 14.667C4.28875 14.667 5.33342 15.7117 5.33342 17.0003C5.33342 18.289 4.28875 19.3337 3.00008 19.3337C1.71142 19.3337 0.666748 18.289 0.666748 17.0003Z"
                        fill="white"
                    />
                </Svg>
            </TouchableOpacity>

            <Modal
                visible={isOpen}
                transparent
                animationType="fade"
                onRequestClose={() => setIsOpen(false)}
            >
                <TouchableWithoutFeedback onPress={() => setIsOpen(false)}>
                    <View style={styles.overlay}>
                        <TouchableWithoutFeedback>
                            <View
                                style={[
                                    styles.menu,
                                    {
                                        top: menuPosition.top,
                                        right: menuPosition.right,
                                    },
                                    menuStyle,
                                ]}
                            >
                                {children}
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    headerButton: {
        padding: 8,
    },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.3)",
    },
    menu: {
        position: "absolute",
        backgroundColor: "rgba(35, 35, 36, 1)",
        borderRadius: 8,
        padding: 8,
        minWidth: 150,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});

export default DropdownMenuDots;
