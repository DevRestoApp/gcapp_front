import React from "react";
import {
    AntDesign,
    Ionicons,
    MaterialCommunityIcons,
} from "@expo/vector-icons";
import { textStyles } from "@/src/client/styles/ui/text.styles";

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
        <AntDesign
            name="arrow-down"
            size={20}
            color={textStyles.negative.color}
        />
    ),
    incomes: (
        <AntDesign
            name="arrow-up"
            size={20}
            color={textStyles.positive.color}
        />
    ),
};
