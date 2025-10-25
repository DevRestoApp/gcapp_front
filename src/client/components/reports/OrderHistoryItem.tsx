import React, { ReactNode } from "react";
import { View, Text } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import IconCard from "@/src/client/components/IconCard";

import { textStyles } from "@/src/client/styles/ui/text.styles";

interface OrderHistoryCardProps {
    key?: string;
    tableNumber: string;
    amount: string;
    time: string;
    icon?: ReactNode;
}

export function OrderHistoryCard({
    key,
    tableNumber,
    amount,
    time,
    icon,
}: OrderHistoryCardProps) {
    return (
        <View
            style={{
                flexDirection: "column",
                padding: 12,
                gap: 12,
                borderRadius: 20,
                backgroundColor: "rgba(43, 43, 44, 1)",
            }}
        >
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                    gap: 12,
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 12,
                        flex: 1,
                    }}
                >
                    {/* Icon Container */}
                    <IconCard type={"default"} icon={icon}></IconCard>

                    <View style={{ flexDirection: "column", gap: 4, flex: 1 }}>
                        <Text
                            style={{
                                color: "white",
                                fontSize: 16,
                                fontWeight: "500",
                                lineHeight: 20,
                            }}
                        >
                            {tableNumber}
                        </Text>
                        <View
                            style={{
                                alignSelf: "flex-start",
                                paddingHorizontal: 4,
                                paddingVertical: 2,
                                borderRadius: 12,
                                backgroundColor: "rgba(52, 199, 89, 0.15)",
                            }}
                        >
                            <Text
                                style={{
                                    color: "#34C759",
                                    fontSize: 14,
                                    lineHeight: 18,
                                }}
                            >
                                {amount}
                            </Text>
                        </View>
                    </View>
                </View>

                <Text
                    style={{
                        color: "rgba(255, 255, 255, 0.75)",
                        fontSize: 12,
                        lineHeight: 16,
                    }}
                >
                    {time}
                </Text>
            </View>
        </View>
    );
}
