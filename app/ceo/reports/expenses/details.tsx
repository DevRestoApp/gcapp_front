import React, { useEffect, useState } from "react";
import {
    View,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Text,
    TouchableOpacity,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { getProfitLossDetails } from "@/src/server/reports/profitloss";
import type { getProfitlossDetailsType } from "@/src/server/types/ceo";

import { cardStyles } from "@/src/client/styles/ui/components/card.styles";
import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";
import { textStyles } from "@/src/client/styles/ui/text.styles";

export default function ExpensesDetails() {
    const router = useRouter();
    const params = useLocalSearchParams<{
        item_id: string;
        item_type: string;
        date_from: string;
        date_to: string;
        organization_id?: string;
    }>();

    const [data, setData] = useState<getProfitlossDetailsType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const hasOrganizationId = !!params.organization_id;
    const isExpense = params.item_type === "expense";

    useEffect(() => {
        fetchDetails();
    }, []);

    const fetchDetails = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await getProfitLossDetails({
                item_id: params.item_id,
                item_type: params.item_type,
                date_from: params.date_from,
                date_to: params.date_to,
                organization_id: params.organization_id
                    ? Number(params.organization_id)
                    : null,
            });

            setData(response);
        } catch (err) {
            console.error("Error fetching details:", err);
            setError("Не удалось загрузить детали");
        } finally {
            setLoading(false);
        }
    };

    const renderDetailItem = ({
        item,
    }: {
        item: { comment: string; date: string; amount: number; name: string };
    }) => (
        <View style={styles.detailCard}>
            <View style={styles.detailRow}>
                <View style={styles.detailInfo}>
                    {item.comment ? (
                        <Text style={styles.detailComment} numberOfLines={2}>
                            {item.comment}
                        </Text>
                    ) : null}
                </View>
                <View style={styles.detailRight}>
                    <Text
                        style={[
                            styles.detailAmount,
                            isExpense
                                ? textStyles.negative
                                : textStyles.positive,
                        ]}
                    >
                        {item.amount.toFixed(2)}
                    </Text>
                    <Text style={styles.detailDate}>{item.date}</Text>
                </View>
            </View>
        </View>
    );

    const renderOrgSection = ({
        item: org,
    }: {
        item: {
            organization_id: number;
            organization_name: string;
            amount: number;
            details: {
                comment: string;
                date: string;
                amount: number;
                name: string;
            }[];
        };
    }) => (
        <View style={styles.orgSection}>
            <View style={styles.orgHeader}>
                <Text style={styles.orgName}>{org.organization_name}</Text>
                <Text
                    style={[
                        styles.orgAmount,
                        isExpense ? textStyles.negative : textStyles.positive,
                    ]}
                >
                    {org.amount.toFixed(2)}
                </Text>
            </View>
            {org.details.map((detail, index) => (
                <View key={index}>{renderDetailItem({ item: detail })}</View>
            ))}
        </View>
    );

    const renderListHeader = () => {
        if (!data) return null;
        return (
            <View style={styles.headerInfo}>
                <Text style={cardStyles.subsectionTitle}>{data.item_name}</Text>
                <Text
                    style={[
                        styles.totalValue,
                        isExpense ? textStyles.negative : textStyles.positive,
                    ]}
                >
                    Итого: {data.total.toFixed(2)}
                </Text>
            </View>
        );
    };

    const renderContent = () => {
        if (!data) return null;

        // Case 1: specific organization — show only its details
        if (hasOrganizationId && data.by_organization.length === 1) {
            const org = data.by_organization[0];
            return (
                <FlatList
                    data={org.details}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={renderDetailItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={renderListHeader}
                    ItemSeparatorComponent={() => (
                        <View style={styles.separator} />
                    )}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>Нет данных</Text>
                    }
                />
            );
        }

        // Case 2: all locations — grouped by organization
        return (
            <FlatList
                data={data.by_organization}
                keyExtractor={(item) => item.organization_id.toString()}
                renderItem={renderOrgSection}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={renderListHeader}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>Нет данных</Text>
                }
            />
        );
    };

    const renderHeader = () => (
        <View style={styles.navHeader}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.navTitle}>Детали</Text>
                <View style={styles.placeholder} />
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={[styles.container, backgroundsStyles.generalBg]}>
                {renderHeader()}
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#3C82FD" />
                </View>
            </View>
        );
    }

    if (error) {
        return (
            <View style={[styles.container, backgroundsStyles.generalBg]}>
                {renderHeader()}
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, backgroundsStyles.generalBg]}>
            {renderHeader()}
            {renderContent()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    navHeader: {
        width: "100%",
        backgroundColor: "#19191A",
        marginTop: 12,
    },
    header: {
        flexDirection: "row",
        height: 56,
        paddingHorizontal: 16,
        justifyContent: "space-between",
        alignItems: "center",
    },
    backButton: {
        width: 28,
        height: 28,
        justifyContent: "center",
        alignItems: "center",
    },
    placeholder: {
        width: 28,
        height: 28,
    },
    navTitle: {
        fontSize: 20,
        fontWeight: "700",
        textAlign: "center",
        color: "#FFFFFF",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: "#FFFFFF",
        textAlign: "center",
    },
    listContent: {
        padding: 16,
        paddingBottom: 32,
        gap: 8,
    },
    headerInfo: {
        marginBottom: 8,
    },
    totalValue: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 4,
    },
    separator: {
        height: 8,
    },
    detailCard: {
        padding: 12,
        backgroundColor: "#232324",
        borderRadius: 20,
    },
    detailRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
    },
    detailInfo: {
        flex: 1,
        gap: 4,
    },
    detailLabel: {
        color: "rgba(255, 255, 255, 0.5)",
        fontSize: 14,
        lineHeight: 20,
    },
    detailName: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "600",
    },
    detailComment: {
        color: "rgba(255, 255, 255, 0.5)",
        fontSize: 13,
        lineHeight: 18,
    },
    detailRight: {
        alignItems: "flex-end",
        gap: 4,
    },
    detailAmount: {
        fontSize: 14,
        fontWeight: "bold",
        lineHeight: 20,
    },
    detailDate: {
        color: "rgba(255, 255, 255, 0.75)",
        fontSize: 12,
        lineHeight: 16,
    },
    orgSection: {
        gap: 8,
    },
    orgHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
        paddingHorizontal: 4,
    },
    orgName: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "bold",
    },
    orgAmount: {
        fontSize: 16,
        fontWeight: "bold",
    },
    emptyText: {
        color: "rgba(255, 255, 255, 0.5)",
        fontSize: 16,
        textAlign: "center",
        marginTop: 40,
    },
});
