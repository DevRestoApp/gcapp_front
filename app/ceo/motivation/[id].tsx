import React, { useState, useEffect, useMemo } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    StatusBar,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import Svg, { Path } from "react-native-svg";

import QuestCardEmployees, {
    QuestEmployees,
} from "@/src/client/components/ceo/QuestCardEmployees";
import EmployeeCardExtended from "@/src/client/components/ceo/EmployeeCardExtended";
import { loadingStyles } from "@/src/client/styles/ui/loading.styles";
import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";
import { useCeo } from "../_layout";

interface EmployeeQuestProgress {
    id: string;
    name: string;
    role: string;
    avatarUrl: string;
    totalAmount: string;
    shiftTime: string;
    isActive: boolean;
    questProgress: number; // Progress for this specific quest (0-100)
    questCompleted: boolean;
    questPoints: number; // Points earned from quest
    questRank: number; // Ranking in this quest
}

export default function QuestDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const { quests, employees, loading } = useCeo();

    const [questLoading, setQuestLoading] = useState(false);
    const questId = Array.isArray(id) ? id[0] : id;

    // Find the specific quest
    const quest = useMemo(() => {
        return quests.find((q) => q.id === questId) || null;
    }, [quests, questId]);

    // Generate employee quest progress data
    const employeeQuestProgress = useMemo(() => {
        if (!quest) return [];

        const progressData: EmployeeQuestProgress[] = employees.map(
            (employee, index) => {
                const isCompleted =
                    quest.employeeNames?.includes(employee.name) || false;
                const progress = isCompleted ? 100 : Math.random() * 80; // Mock progress data
                const points = isCompleted
                    ? quest.reward
                    : Math.floor((progress / 100) * quest.reward);

                return {
                    ...employee,
                    questProgress: Math.round(progress),
                    questCompleted: isCompleted,
                    questPoints: points,
                    questRank: index + 1, // Will be sorted later
                };
            },
        );

        // Sort by quest points (descending) and assign ranks
        const sortedData = progressData.sort(
            (a, b) => b.questPoints - a.questPoints,
        );
        return sortedData.map((employee, index) => ({
            ...employee,
            questRank: index + 1,
        }));
    }, [quest, employees]);

    // Handle quest not found
    useEffect(() => {
        if (!loading && !quest) {
            Alert.alert(
                "Квест не найден",
                "Квест с указанным ID не существует",
                [
                    {
                        text: "OK",
                        onPress: () => router.back(),
                    },
                ],
            );
        }
    }, [quest, loading, router]);

    // Render header
    const renderHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backButton}
                activeOpacity={0.7}
            >
                <Svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <Path
                        d="M9.58992 14.8405C9.42578 14.6765 9.33346 14.4541 9.33325 14.2221V13.7788C9.33594 13.5473 9.42789 13.3258 9.58992 13.1605L15.5866 7.17548C15.6961 7.06505 15.8452 7.00293 16.0008 7.00293C16.1563 7.00293 16.3054 7.06505 16.4149 7.17548L17.2433 8.00381C17.353 8.11134 17.4148 8.25851 17.4148 8.41215C17.4148 8.56578 17.353 8.71295 17.2433 8.82048L12.0516 14.0005L17.2433 19.1805C17.3537 19.29 17.4158 19.4391 17.4158 19.5946C17.4158 19.7502 17.3537 19.8993 17.2433 20.0088L16.4149 20.8255C16.3054 20.9359 16.1563 20.998 16.0008 20.998C15.8452 20.998 15.6961 20.9359 15.5866 20.8255L9.58992 14.8405Z"
                        fill="white"
                    />
                </Svg>
            </TouchableOpacity>
            <Text style={styles.headerTitle} numberOfLines={1}>
                {quest?.title || "Квест"}
            </Text>
            <View style={styles.headerSpacer} />
        </View>
    );

    // Render leaderboard header
    const renderLeaderboardHeader = () => (
        <View style={styles.leaderboardHeader}>
            <Text style={styles.leaderboardTitle}>Лидерборд 🏆</Text>
            <Text style={styles.leaderboardSubtitle}>
                {employeeQuestProgress.length} участника
            </Text>
        </View>
    );

    // Render employee item for leaderboard
    const renderEmployeeItem = ({
        item,
        index,
    }: {
        item: EmployeeQuestProgress;
        index: number;
    }) => {
        // Create rank icon based on position
        const getRankIcon = (rank: number) => {
            switch (rank) {
                case 1:
                    return "🥇";
                case 2:
                    return "🥈";
                case 3:
                    return "🥉";
                default:
                    return `#${rank}`;
            }
        };

        // Generate stats for the employee
        const stats = [
            {
                icon: (
                    <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <Path
                            d="M8 1.5C6.71442 1.5 5.45772 1.88122 4.3888 2.59545C3.31988 3.30968 2.48676 4.32484 1.99479 5.51256C1.50282 6.70028 1.37409 8.00721 1.6249 9.26809C1.8757 10.529 2.49477 11.6872 3.40381 12.5962C4.31285 13.5052 5.47104 14.1243 6.73192 14.3751C7.99279 14.6259 9.29973 14.4972 10.4874 14.0052C11.6752 13.5132 12.6903 12.6801 13.4046 11.6112C14.1188 10.5423 14.5 9.28558 14.5 8C14.4967 6.27711 13.8108 4.62573 12.5925 3.40746C11.3743 2.18918 9.7229 1.5033 8 1.5V1.5Z"
                            fill="#FF9E00"
                        />
                    </Svg>
                ),
                label: "Позиция:",
                value: getRankIcon(item.questRank),
            },
            {
                icon: (
                    <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <Path
                            d="M7 0.333008C10.6819 0.333008 13.667 3.3181 13.667 7C13.667 10.6819 10.6819 13.667 7 13.667C3.3181 13.667 0.333008 10.6819 0.333008 7C0.333008 3.3181 3.3181 0.333008 7 0.333008Z"
                            fill={item.questCompleted ? "#0DC268" : "#FF9E00"}
                        />
                    </Svg>
                ),
                label: "Баллы:",
                value: `${item.questPoints.toLocaleString()} тг`,
            },
            {
                icon: (
                    <Text style={{ fontSize: 14 }}>
                        {item.questCompleted ? "✅" : "⏳"}
                    </Text>
                ),
                label: "Прогресс:",
                value: `${item.questProgress}%`,
            },
            {
                icon: (
                    <Text style={{ fontSize: 14 }}>
                        {item.questCompleted ? "🎉" : "💪"}
                    </Text>
                ),
                label: "Статус:",
                value: item.questCompleted ? "Выполнен" : "В процессе",
            },
        ];

        return (
            <EmployeeCardExtended
                name={item.name}
                role={item.role}
                avatar={item.avatarUrl}
                stats={stats}
                onPress={() => {
                    // Optional: Navigate to employee detail
                    console.log("Navigate to employee detail:", item.id);
                }}
            />
        );
    };

    // Key extractor for FlatList
    const keyExtractor = (item: EmployeeQuestProgress) =>
        `${questId}-${item.id}`;

    // Item separator
    const ItemSeparator = () => <View style={styles.itemSeparator} />;

    // Render loading state
    if (loading || questLoading) {
        return (
            <SafeAreaView
                style={{ ...styles.container, ...backgroundsStyles.generalBg }}
            >
                <StatusBar
                    barStyle="light-content"
                    backgroundColor="rgba(25, 25, 26, 1)"
                />
                {renderHeader()}
                <View style={loadingStyles.loadingContainer}>
                    <ActivityIndicator size="large" color="#fff" />
                    <Text style={loadingStyles.loadingText}>
                        Загрузка квеста...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    // Render quest not found
    if (!quest) {
        return (
            <SafeAreaView
                style={{ ...styles.container, ...backgroundsStyles.generalBg }}
            >
                <StatusBar
                    barStyle="light-content"
                    backgroundColor="rgba(25, 25, 26, 1)"
                />
                {renderHeader()}
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Квест не найден</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView
            style={{ ...styles.container, ...backgroundsStyles.generalBg }}
        >
            <StatusBar
                barStyle="light-content"
                backgroundColor="rgba(25, 25, 26, 1)"
            />

            {renderHeader()}

            <FlatList
                data={employeeQuestProgress}
                renderItem={renderEmployeeItem}
                keyExtractor={keyExtractor}
                ListHeaderComponent={() => (
                    <View style={styles.listHeader}>
                        {/* Quest Card */}
                        <QuestCardEmployees quest={quest} />

                        {/* Spacer */}
                        <View style={styles.sectionSpacer} />

                        {/* Leaderboard Header */}
                        {renderLeaderboardHeader()}
                    </View>
                )}
                ItemSeparatorComponent={ItemSeparator}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    // Header
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: 56,
        paddingHorizontal: 16,
        backgroundColor: "rgba(25, 25, 26, 1)",
    },
    backButton: {
        width: 28,
        height: 28,
        alignItems: "center",
        justifyContent: "center",
    },
    headerTitle: {
        color: "#FFFFFF",
        fontSize: 20,
        fontWeight: "600",
        lineHeight: 28,
        letterSpacing: -0.24,
        flex: 1,
        textAlign: "center",
        marginHorizontal: 16,
    },
    headerSpacer: {
        width: 28,
        height: 28,
    },

    // List
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 128,
    },
    listHeader: {
        paddingBottom: 8,
    },
    sectionSpacer: {
        height: 32,
    },

    // Leaderboard
    leaderboardHeader: {
        marginBottom: 16,
        gap: 4,
    },
    leaderboardTitle: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
        lineHeight: 28,
    },
    leaderboardSubtitle: {
        color: "#797A80",
        fontSize: 14,
        lineHeight: 18,
    },
    itemSeparator: {
        height: 16,
    },

    // Error states
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 16,
    },
    errorText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
    },
});
