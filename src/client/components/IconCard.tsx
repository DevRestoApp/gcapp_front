import { View, StyleSheet } from "react-native";
import React from "react";

import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";

export default function IconCard({ type, icon }) {
    let styling;
    switch (type) {
        case "positive":
            styling = backgroundsStyles.positiveBg;
            break;
        case "negative":
            styling = backgroundsStyles.negativeBg;
            break;

        default:
            styling = backgroundsStyles.generalBg;
            break;
    }

    return <View style={[styles.reportIcon, styling]}>{icon}</View>;
}

const styles = StyleSheet.create({
    reportIcon: {
        width: 40,
        height: 40,
        borderRadius: 16,
        backgroundColor: "#1C1C1E",
        alignItems: "center",
        justifyContent: "center",
    },
});
