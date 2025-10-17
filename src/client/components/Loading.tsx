import { loadingStyles } from "@/src/client/styles/ui/loading.styles";
import { ActivityIndicator, Text, View } from "react-native";
import React from "react";

export default function Loading() {
    return (
        <View style={loadingStyles.loadingContainer}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={loadingStyles.loadingText}>Загрузка данных...</Text>
        </View>
    );
}
