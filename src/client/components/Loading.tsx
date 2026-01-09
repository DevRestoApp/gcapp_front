import { loadingStyles } from "@/src/client/styles/ui/loading.styles";
import { ActivityIndicator, Text, View } from "react-native";
import React from "react";

interface LoadingProps {
    text?: string;
}

export default function Loading({ text }: LoadingProps = {}) {
    return (
        <View style={loadingStyles.loadingContainer}>
            <ActivityIndicator size="large" color="#fff" />
            {text ? (
                <Text style={loadingStyles.loadingText}>{text}...</Text>
            ) : (
                <Text style={loadingStyles.loadingText}>Загрузка...</Text>
            )}
        </View>
    );
}
