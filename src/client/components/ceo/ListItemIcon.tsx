import { Text, View, StyleSheet } from "react-native";
import React from "react";
import { Entypo } from "@expo/vector-icons";

import { ListItemProps } from "@/src/client/types/waiter";
import IconCard from "@/src/client/components/IconCard";

export default function ListItemIcon({
    label,
    value,
    icon,
    iconType,
    withChevron,
}: ListItemProps) {
    const isValueNode = typeof value !== "string";

    return (
        <View style={styles.listItem}>
            <View style={styles.listContent}>
                <View style={styles.listContentLeft}>
                    {icon && <IconCard type={iconType} icon={icon}></IconCard>}

                    <View style={{ gap: 6 }}>
                        <Text style={styles.listLabel} numberOfLines={1}>
                            {label}
                        </Text>
                        {!isValueNode ? (
                            <Text style={styles.listValue}>{value}</Text>
                        ) : (
                            value
                        )}
                    </View>
                </View>
                <View style={styles.listContentRight}>
                    {withChevron && (
                        <View style={styles.chevronContainer}>
                            <Entypo
                                name="chevron-right"
                                size={20}
                                color="#FFFFFF"
                            />
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    listItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        width: "100%",
    },
    listContent: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
    },
    listContentLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        flexShrink: 1,
    },
    listContentRight: {
        marginLeft: "auto",
        alignItems: "flex-end",
        flexShrink: 0,
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
