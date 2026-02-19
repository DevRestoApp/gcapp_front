import React from "react";
import {
    AntDesign,
    Ionicons,
    MaterialCommunityIcons,
} from "@expo/vector-icons";
import { textStyles } from "@/src/client/styles/ui/text.styles";
import { View } from "react-native";
import Svg, { Circle, Path, Line, Ellipse, Rect } from "react-native-svg";

export const icons = {
    dishes: (
        <MaterialCommunityIcons
            name="food-variant"
            size={20}
            color={textStyles.white.color}
        />
    ),
    writeoffs: (
        <Ionicons
            name="receipt-sharp"
            size={20}
            color={textStyles.white.color}
        />
    ),
    expenses: (
        <Ionicons
            name="arrow-down"
            size={20}
            color={textStyles.negative.color}
        />
    ),
    incomes: (
        <Ionicons name="arrow-up" size={20} color={textStyles.positive.color} />
    ),
};

export function AdminIcon() {
    return (
        <View style={container("#F59E0B")}>
            <Svg width={36} height={36} viewBox="0 0 24 24" fill="none">
                <Path
                    d="M12 3l7 3v5c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6l7-3z"
                    stroke="white"
                    strokeWidth={1.8}
                    strokeLinejoin="round"
                    fill="none"
                />
                <Path
                    d="M12 9v3m0 3h.01"
                    stroke="white"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                />
            </Svg>
        </View>
    );
}

export function WaiterIcon() {
    return (
        <View style={container("#06B6D4")}>
            <Svg width={36} height={36} viewBox="0 0 24 24" fill="none">
                <Ellipse
                    cx="12"
                    cy="11"
                    rx="7"
                    ry="2.5"
                    stroke="white"
                    strokeWidth={1.8}
                    fill="none"
                />
                <Path
                    d="M5 11c0 3 2 5 7 5s7-2 7-5"
                    stroke="white"
                    strokeWidth={1.8}
                    fill="none"
                />
                <Path
                    d="M12 6v3"
                    stroke="white"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                />
                <Circle cx="12" cy="5" r="1" fill="white" />
            </Svg>
        </View>
    );
}

export function CEOIcon() {
    return (
        <View style={container("#7C3AED")}>
            <Svg width={36} height={36} viewBox="0 0 24 24" fill="none">
                <Path
                    d="M3 9l3.5 3L12 6l5.5 6L21 9l-2 9H5L3 9z"
                    stroke="white"
                    strokeWidth={1.8}
                    strokeLinejoin="round"
                    fill="none"
                />
                <Circle cx="6.5" cy="8" r="1" fill="white" />
                <Circle cx="17.5" cy="8" r="1" fill="white" />
                <Circle cx="12" cy="5" r="1" fill="white" />
            </Svg>
        </View>
    );
}

const container = (backgroundColor: string) => ({
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    backgroundColor,
});
