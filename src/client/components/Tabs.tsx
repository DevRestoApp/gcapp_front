import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface Tab {
    label: string;
    value: string;
}

interface SegmentedControlProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (value: string) => void;
    containerStyle?: object;
    maxColumns?: number; // Maximum columns per row
}

export default function SegmentedControl({
    tabs,
    activeTab,
    onTabChange,
    containerStyle,
    maxColumns = 3,
}: SegmentedControlProps) {
    const useGridLayout = tabs.length > maxColumns;
    const columns = useGridLayout ? maxColumns : tabs.length;

    return (
        <View style={[styles.segmentedControlContainer, containerStyle]}>
            <View
                style={[
                    styles.segmentedControl,
                    useGridLayout && styles.segmentedControlGrid,
                ]}
            >
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab.value}
                        onPress={() => onTabChange(tab.value)}
                        style={[
                            styles.segmentButton,
                            useGridLayout
                                ? {
                                      width: `${100 / columns - 0.5}%`,
                                      minWidth: 70,
                                  }
                                : { flex: 1 },
                            activeTab === tab.value &&
                                styles.segmentButtonActive,
                        ]}
                        activeOpacity={0.7}
                    >
                        <Text
                            style={[
                                styles.segmentText,
                                activeTab === tab.value &&
                                    styles.segmentTextActive,
                            ]}
                        >
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    segmentedControlContainer: {
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    segmentedControl: {
        flexDirection: "row",
        backgroundColor: "rgba(35, 35, 36, 1)",
        borderRadius: 12,
        padding: 2,
        gap: 2,
    },
    segmentedControlGrid: {
        flexWrap: "wrap",
    },
    segmentButton: {
        height: 32,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    segmentButtonActive: {
        backgroundColor: "rgba(25, 25, 26, 1)",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
    },
    segmentText: {
        fontSize: 16,
        fontWeight: "400",
        lineHeight: 20,
        color: "#BFC1C5",
    },
    segmentTextActive: {
        color: "#FFFFFF",
    },
});
