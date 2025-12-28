import { Text, View, StyleSheet } from "react-native";
import React from "react";
import { Entypo } from "@expo/vector-icons";

import { ListItemProps } from "@/src/client/types/waiter";

export default function ListItem({
    label,
    value,
    withChevron = true,
}: ListItemProps) {
    // Check if value is a React element (not a string/number/boolean)
    const isReactElement = React.isValidElement(value);

    return (
        <View style={styles.listItem}>
            <View style={styles.listContent}>
                <Text style={styles.listLabel} numberOfLines={1}>
                    {label}
                </Text>
                {isReactElement ? (
                    // Render React element directly (like <ValueBadge />)
                    value
                ) : (
                    // Wrap primitive values in Text component
                    <Text style={styles.listValue}>{String(value)}</Text>
                )}
            </View>
            {withChevron && (
                <View style={styles.chevronContainer}>
                    <Entypo name="chevron-right" size={20} color="#FFFFFF" />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    listItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    listContent: {
        flex: 1,
        justifyContent: "center",
        gap: 4,
    },
    listLabel: {
        color: "rgba(255, 255, 255, 0.75)",
        fontSize: 12,
        lineHeight: 16,
    },
    listValue: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
        lineHeight: 20,
    },
    chevronContainer: {
        padding: 8,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
    },
});
