import React, { useState, useEffect, useMemo } from "react";
import {
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import Loading from "@/src/client/components/Loading";

import EmployeeCard from "@/src/client/components/ceo/EmployeeCard";
import MetricCard from "@/src/client/components/ceo/MetricCard";
import ListItem from "@/src/client/components/ceo/ListItem";
import ReportCard from "@/src/client/components/ceo/ReportCard";
import ValueBadge from "@/src/client/components/ValueBadge";

import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";
import { cardStyles } from "@/src/client/styles/ui/components/card.styles";
import { useRouter } from "expo-router";
import { getAnalyticsData } from "@/src/server/ceo/analytics";

const getAnalyticsDataFunc = async () => {
    try {
        const date = new Date();

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); // месяцы начинаются с 0
        const year = date.getFullYear();

        const formattedDate = `${day}.${month}.${year}`;

        return await getAnalyticsData({ date: formattedDate });
    } catch (error) {
        return error;
    }
};

export default function AnalyticsScreen() {
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [analyticsData, setData] = useState<any>(null);

    const router = useRouter();

    // fetch once when screen loads
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const res = await getAnalyticsDataFunc();
                setData(res);
            } catch (err) {
                console.error("Failed to load analytics data:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading || !analyticsData) {
        return (
            <View
                style={{ ...styles.container, ...backgroundsStyles.generalBg }}
            >
                <View style={styles.header}>
                    <View style={styles.headerTop}>
                        <Text style={styles.headerTitle}>Аналитика</Text>
                    </View>
                </View>
                <Loading />;
            </View>
        );
    }

    const renderValueBadge = (value, type) => (
        <ValueBadge value={value} type={type} />
    );

    if (isLoading) {
        return (
            <View
                style={{ ...styles.container, ...backgroundsStyles.generalBg }}
            >
                <View style={styles.header}>
                    <View style={styles.headerTop}>
                        <Text style={styles.headerTitle}>Аналитика</Text>
                    </View>
                </View>
                <Loading />;
            </View>
        );
    }

    return (
        <View style={{ ...styles.container, ...backgroundsStyles.generalBg }}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <Text style={styles.headerTitle}>Аналитика</Text>
                </View>
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Искать данные"
                        placeholderTextColor="#797A80"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <Ionicons
                        name="search"
                        size={20}
                        color="#797A80"
                        style={styles.searchIcon}
                    />
                </View>
            </View>

            {/* Scrollable Content */}
            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* General Metrics */}
                <TouchableOpacity
                    onPress={() => {
                        router.push("/ceo/reports");
                    }}
                >
                    {analyticsData?.metrics?.length > 0 && (
                        <View style={cardStyles.section}>
                            <Text style={cardStyles.sectionTitle}>
                                Общие показатели
                            </Text>
                            <View style={cardStyles.card}>
                                {analyticsData?.metrics?.map(
                                    (metric, index) => (
                                        <React.Fragment key={metric.id}>
                                            {index > 0 && (
                                                <View
                                                    style={cardStyles.divider}
                                                />
                                            )}
                                            <MetricCard {...metric} />
                                        </React.Fragment>
                                    ),
                                )}
                            </View>
                        </View>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        router.push("/reports/expenses");
                    }}
                >
                    {/* Profit & Loss Report */}
                    {analyticsData?.reports?.length > 0 && (
                        <View style={cardStyles.section}>
                            <Text style={cardStyles.sectionTitle}>
                                Отчет о прибылях и убытках
                            </Text>
                            <View style={cardStyles.card}>
                                <Text style={cardStyles.subsectionTitle}>
                                    Сегодня
                                </Text>
                                <View style={cardStyles.reportsContainer}>
                                    {analyticsData?.reports?.map((report) => (
                                        <ReportCard
                                            key={report.id}
                                            {...report}
                                        />
                                    ))}
                                </View>
                                <TouchableOpacity style={styles.button}>
                                    <Text style={styles.buttonText}>
                                        Посмотреть все
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        router.push("/reports/orders");
                    }}
                >
                    {/* Orders Report */}
                    {analyticsData?.orders?.length > 0 && (
                        <View style={cardStyles.section}>
                            <Text style={cardStyles.sectionTitle}>
                                Отчеты по заказам
                            </Text>
                            <View style={cardStyles.card}>
                                {analyticsData?.orders?.map((item, index) => (
                                    <React.Fragment key={item.id}>
                                        {index > 0 && (
                                            <View style={cardStyles.divider} />
                                        )}
                                        <ListItem
                                            label={item.label}
                                            value={
                                                item.type
                                                    ? renderValueBadge(
                                                          item.value,
                                                          item.type,
                                                      )
                                                    : item.value
                                            }
                                        />
                                    </React.Fragment>
                                ))}
                            </View>
                        </View>
                    )}
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        router.push("/reports/moneyflow");
                    }}
                >
                    {/* Financial Reports */}
                    {analyticsData?.financial?.length > 0 && (
                        <View style={cardStyles.section}>
                            <Text style={cardStyles.sectionTitle}>
                                Денежные отчеты
                            </Text>
                            <View style={cardStyles.card}>
                                {analyticsData?.financial?.map(
                                    (item, index) => (
                                        <React.Fragment key={item.id}>
                                            {index > 0 && (
                                                <View
                                                    style={cardStyles.divider}
                                                />
                                            )}
                                            <ListItem
                                                label={item.label}
                                                value={
                                                    item.type
                                                        ? renderValueBadge(
                                                              item.value,
                                                              item.type,
                                                          )
                                                        : item.value
                                                }
                                            />
                                        </React.Fragment>
                                    ),
                                )}
                            </View>
                        </View>
                    )}
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        router.push("/reports/storage");
                    }}
                >
                    {/* Inventory Reports */}
                    {analyticsData?.inventory?.length > 0 && (
                        <View style={cardStyles.section}>
                            <Text style={cardStyles.sectionTitle}>
                                Складские отчеты
                            </Text>
                            <View style={cardStyles.card}>
                                {analyticsData?.inventory?.map(
                                    (item, index) => (
                                        <React.Fragment key={item.id}>
                                            {index > 0 && (
                                                <View
                                                    style={cardStyles.divider}
                                                />
                                            )}
                                            <ListItem
                                                label={item.label}
                                                value={
                                                    item.type
                                                        ? renderValueBadge(
                                                              item.value,
                                                              item.type,
                                                          )
                                                        : item.value
                                                }
                                            />
                                        </React.Fragment>
                                    ),
                                )}
                            </View>
                        </View>
                    )}
                </TouchableOpacity>

                {/* Employee Reports */}
                {analyticsData?.employees?.length > 0 && (
                    <View style={cardStyles.section}>
                        <Text style={cardStyles.sectionTitle}>
                            Отчеты по персоналу
                        </Text>
                        <View style={cardStyles.card}>
                            {analyticsData?.employees?.map(
                                (employee, index) => (
                                    <React.Fragment key={employee.id}>
                                        {index > 0 && (
                                            <View style={cardStyles.divider} />
                                        )}
                                        <EmployeeCard
                                            name={employee.name}
                                            amount={employee.amount}
                                            avatar={employee.avatar}
                                            role={""}
                                            totalAmount={""}
                                            shiftTime={""}
                                            variant="simple"
                                            showStats={false}
                                            onPress={() => {
                                                router.push(
                                                    "/reports/employees",
                                                );
                                            }}
                                        />
                                    </React.Fragment>
                                ),
                            )}
                            <TouchableOpacity style={styles.button}>
                                <Text style={styles.buttonText}>
                                    Все сотрудники
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                <View style={{ height: 16 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        backgroundColor: "rgba(28, 28, 30, 0.8)",
    },
    headerTop: {
        height: 56,
        paddingHorizontal: 16,
        justifyContent: "center",
    },
    headerTitle: {
        color: "#FFFFFF",
        fontSize: 32,
        fontWeight: "bold",
        letterSpacing: -0.24,
    },
    searchContainer: {
        paddingHorizontal: 16,
        paddingBottom: 12,
        position: "relative",
    },
    searchInput: {
        height: 44,
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderRadius: 20,
        backgroundColor: "#2C2C2E",
        borderWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.12)",
        color: "#FFFFFF",
        fontSize: 16,
        paddingRight: 40,
    },
    searchIcon: {
        position: "absolute",
        right: 28,
        top: 12,
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
    },
    reportCard: {
        padding: 12,
        backgroundColor: "#3A3A3C",
        borderRadius: 20,
    },
    reportContent: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 12,
    },
    reportMain: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        flex: 1,
    },
    reportIcon: {
        width: 40,
        height: 40,
        padding: 10,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    reportText: {
        flex: 1,
        gap: 4,
    },
    reportTitle: {
        color: "#FFFFFF",
        fontSize: 16,
        lineHeight: 20,
    },
    reportValue: {
        fontSize: 14,
        lineHeight: 18,
    },
    button: {
        height: 44,
        paddingHorizontal: 14,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
        backgroundColor: "#FFFFFF",
        marginTop: 16,
    },
    buttonText: {
        color: "#2C2D2E",
        fontSize: 16,
        fontWeight: "bold",
        lineHeight: 24,
    },
    employeeCard: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 12,
    },
    employeeContent: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        flex: 1,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    employeeText: {
        flex: 1,
        gap: 4,
    },
    employeeName: {
        color: "#FFFFFF",
        fontSize: 16,
        lineHeight: 20,
    },
    employeeAmount: {
        color: "rgba(255, 255, 255, 0.75)",
        fontSize: 12,
        lineHeight: 16,
    },
    bold: {
        fontWeight: "bold",
    },
});
