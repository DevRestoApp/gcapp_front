import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { textStyles } from "@/src/client/styles/ui/text.styles";

interface ListItem {
    label: string;
    sublabel: string;
    value: string;
}

interface ListCardProps {
    items: ListItem[];
}

export function ListCard({ items }: ListCardProps) {
    return (
        <View style={styles.listContainer}>
            {items.map((item, index) => (
                <View key={index}>
                    <View style={styles.listItem}>
                        <View style={styles.listItemLeft}>
                            <Text style={styles.label}>{item.label}</Text>
                            <Text style={styles.sublabel}>{item.sublabel}</Text>
                        </View>
                        <Text style={styles.value}>{item.value}</Text>
                    </View>

                    {index < items.length - 1 && (
                        <View style={styles.divider} />
                    )}
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    listContainer: {
        padding: 12,
        borderRadius: 20,
        backgroundColor: "#2C2C2E",
        gap: 12,
    },
    listItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    listItemLeft: {
        flex: 1,
        justifyContent: "center",
        gap: 4,
    },
    label: {
        color: "rgba(255, 255, 255, 0.75)",
        fontSize: 12,
        lineHeight: 16,
    },
    sublabel: {
        fontSize: 16,
        lineHeight: 20,
        ...textStyles.white,
    },
    value: {
        fontSize: 16,
        lineHeight: 20,
        fontWeight: "700",
        ...textStyles.white,
    },
    divider: {
        width: "100%",
        height: 1,
        backgroundColor: "#2C2C2E",
        marginTop: 12,
    },
});
