import { View, Text, Image, StyleSheet } from "react-native";

interface MotivationCardProps {
    goalText: string;
    targetAmount: string;
    currentProgress: string;
    progressPercentage?: number;
    iconUrl?: string;
}

export default function MotivationCard({
    goalText,
    targetAmount,
    currentProgress,
    progressPercentage = 0,

    // TODO icons should be downladed and kept in 1 place
    iconUrl = "https://api.builder.io/api/v1/image/assets/TEMP/72729180555bd254ed63f46e2f99f64f9ef170e1?width=88",
}: MotivationCardProps) {
    return (
        <View style={styles.card}>
            {/* Header with icon and goal info */}
            <View style={styles.header}>
                <View style={styles.iconAndText}>
                    {iconUrl && (
                        <Image source={{ uri: iconUrl }} style={styles.icon} />
                    )}
                    <View style={styles.goalTextWrapper}>
                        <Text style={styles.label}>Цель на сегодня</Text>
                        <Text style={styles.goal}>{goalText}</Text>
                    </View>
                </View>
                <Text style={styles.targetAmount}>{targetAmount}</Text>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Progress section */}
            <View style={styles.progressSection}>
                <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>Прогрес</Text>
                    <Text style={styles.progressValue}>{currentProgress}</Text>
                </View>

                {/* Progress bar */}
                <View style={styles.progressBarBackground}>
                    <View
                        style={[
                            styles.progressBarFill,
                            { width: `${Math.min(progressPercentage, 100)}%` },
                        ]}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 16,
        padding: 12,
        borderRadius: 20,
        width: "100%",
        backgroundColor: "rgba(35, 35, 36, 1)",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        width: "100%",
    },
    iconAndText: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        gap: 4,
    },
    icon: {
        width: 44,
        height: 44,
        borderRadius: 8,
    },
    goalTextWrapper: {
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 4,
    },
    label: {
        fontSize: 12,
        fontWeight: "400",
        lineHeight: 16,
        color: "rgba(255,255,255,0.75)",
        fontFamily: "Inter",
    },
    goal: {
        fontSize: 20,
        fontWeight: "700",
        lineHeight: 24,
        color: "white",
        fontFamily: "Inter",
    },
    targetAmount: {
        fontSize: 20,
        fontWeight: "700",
        lineHeight: 24,
        color: "white",
        fontFamily: "Inter",
    },
    divider: {
        width: "100%",
        height: 1,
        backgroundColor: "rgba(43, 43, 44, 1)",
    },
    progressSection: {
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 8,
        width: "100%",
    },
    progressHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
    },
    progressLabel: {
        fontSize: 12,
        fontWeight: "400",
        lineHeight: 16,
        color: "rgba(255,255,255,0.75)",
        fontFamily: "Inter",
    },
    progressValue: {
        fontSize: 12,
        fontWeight: "500",
        lineHeight: 16,
        color: "white",
        fontFamily: "Inter",
    },
    progressBarBackground: {
        width: "100%",
        height: 8,
        borderRadius: 12,
        backgroundColor: "rgba(43, 43, 44, 1)",
        overflow: "hidden",
    },
    progressBarFill: {
        height: 8,
        borderRadius: 12,
        backgroundColor: "#22c55e", // Tailwind green-500
    },
});
