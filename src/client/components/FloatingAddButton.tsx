import React from "react";
import {
    TouchableOpacity,
    StyleSheet,
    useWindowDimensions,
} from "react-native";
import { Entypo } from "@expo/vector-icons";

interface FloatingAddButtonProps {
    onPress: () => void;
}

export function FloatingAddButton({ onPress }: FloatingAddButtonProps) {
    const { width } = useWindowDimensions();
    const scale = width / 375;

    const size = Math.max(48, Math.min(56 * scale, 72));
    const iconSize = Math.max(22, Math.min(24 * scale, 30));
    const offset = Math.max(16, Math.min(16 * scale, 24));

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                styles.button,
                {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    bottom: offset,
                    right: offset,
                },
            ]}
            activeOpacity={0.7}
        >
            <Entypo name="plus" size={iconSize} color="black" />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#ffffff",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
});
