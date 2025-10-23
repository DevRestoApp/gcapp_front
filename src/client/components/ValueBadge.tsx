import { Text, View, StyleSheet } from "react-native";
import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";
import { textStyles } from "@/src/client/styles/ui/text.styles";
import React from "react";

interface ValueBadgeProps {
    value: string;
    type: string;
}

export default function ValueBadge({ value, type }: ValueBadgeProps) {
    if (type === "positive") {
        return (
            <View style={[styles.badge, backgroundsStyles.positiveBg]}>
                <Text style={[styles.badgeText, textStyles.positive]}>
                    {value}
                </Text>
            </View>
        );
    }
    if (type === "negative") {
        return (
            <View style={[styles.badge, backgroundsStyles.negativeBg]}>
                <Text style={[styles.badgeText, textStyles.negative]}>
                    {value}
                </Text>
            </View>
        );
    }
    return null;
}

const styles = StyleSheet.create({
    badge: {
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "flex-start",
    },
    badgeText: {
        fontSize: 16,
        fontWeight: "bold",
        lineHeight: 20,
    },
});
