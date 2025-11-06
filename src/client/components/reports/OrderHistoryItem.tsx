import React, { ReactNode } from "react";
import { View, Text, StyleProp, TextStyle, ViewStyle } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import IconCard from "@/src/client/components/IconCard";

import { textStyles } from "@/src/client/styles/ui/text.styles";
import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";

interface OrderHistoryCardProps {
    key?: string;
    tableNumber: string;
    amount: string;
    time: string;
    icon?: ReactNode;
    type?: "positive" | "negative" | "default";
}

export function OrderHistoryCard({
    key,
    tableNumber,
    amount,
    time,
    icon,
    type,
}: OrderHistoryCardProps) {
    let textStyle: StyleProp<TextStyle>;
    let bgStyle: StyleProp<TextStyle>;

    switch (type) {
        case "positive":
            textStyle = textStyles.positive;
            bgStyle = backgroundsStyles.positiveBg;
            break;
        case "negative":
            textStyle = textStyles.negative;
            bgStyle = backgroundsStyles.negativeBg;
            break;
        default:
            textStyle = textStyles.white;
            bgStyle = backgroundsStyles.generalBg;
            break;
    }
    console.log(type);
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
                            style={[
                                bgStyle,
                                {
                                    alignSelf: "flex-start",
                                    paddingHorizontal: 4,
                                    paddingVertical: 2,
                                    borderRadius: 12,
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    textStyle,
                                    { fontSize: 14, lineHeight: 18 },
                                ]}
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
