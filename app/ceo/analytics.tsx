import React, { useState, useMemo } from "react";
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

import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";

// Mock data
const analyticsData = {
    metrics: [
        {
            id: 1,
            label: "Выручка",
            value: "19 589 699 тг",
            change: { value: "-28%", trend: "down" },
        },
        {
            id: 2,
            label: "Чеки",
            value: "886",
            change: { value: "-41%", trend: "down" },
        },
        {
            id: 3,
            label: "Срендний чек",
            value: "22 110,27 тг",
            change: { value: "+21%", trend: "up" },
        },
        { id: 4, label: "Возвраты", value: "0" },
        {
            id: 5,
            label: "Скидки",
            value: "1 241 163,28 тг",
            change: { value: "-37%", trend: "down" },
        },
        { id: 6, label: "НДС", value: "0,00 тг" },
    ],
    reports: [
        {
            id: 1,
            title: "Итого Расходы",
            value: "+14 000 568 тг",
            date: "07.09",
            type: "expense",
        },
        {
            id: 2,
            title: "Итого Прибыль от основной деятельности",
            value: "+14 000 568 тг",
            date: "07.09",
            type: "income",
        },
        {
            id: 3,
            title: "Итого чистая прибыль",
            value: "+14 000 568 тг",
            date: "07.09",
            type: "income",
        },
    ],
    orders: [
        { id: 1, label: "Средний чек", value: "120 568 тг" },
        {
            id: 2,
            label: "Сумма возвратов",
            value: "-15 800 тг",
            type: "negative",
        },
        {
            id: 3,
            label: "Среднее количество позиций в заказе",
            value: "1 241 163,28 тг",
        },
        {
            id: 4,
            label: "Популярные блюда по количеству и сумме",
            value: "Манты 56 (256 840 тг)",
        },
        {
            id: 5,
            label: "Непопулярные блюда по количеству и сумме",
            value: "Каша 2 (2 840 тг)",
        },
    ],
    financial: [
        {
            id: 1,
            label: "Сумма всех проданных блюд по себестоимости",
            value: "120 568 598 тг",
        },
        { id: 2, label: "Сумма списаний", value: "256 840 568 тг" },
        {
            id: 3,
            label: "Сумма доходов",
            value: "+150 800 тг",
            type: "positive",
        },
        {
            id: 4,
            label: "Сумма расходов",
            value: "-15 800 тг",
            type: "negative",
        },
    ],
    inventory: [
        {
            id: 1,
            label: "Сумма товаров на начало периода",
            value: "120 568 598 тг",
        },
        {
            id: 2,
            label: "Сумма товаров на конец периода",
            value: "256 840 568 тг",
        },
        {
            id: 3,
            label: "Товары с критическим остатком",
            value: "-15 800 тг",
            type: "negative",
        },
        { id: 4, label: "Остатки на складе", value: "1 241 163,28 тг" },
    ],
    employees: [
        {
            id: 1,
            name: "Аслан Аманов",
            amount: "256 024 тг",
            avatar: "https://api.builder.io/api/v1/image/assets/TEMP/3a1a0f795dd6cebc375ac2f7fbeab6a0d791efc8?width=80",
        },
        {
            id: 2,
            name: "Айгүл Айтен",
            amount: "256 024 тг",
            avatar: "https://api.builder.io/api/v1/image/assets/TEMP/4bd88d9313f5402e21d3f064a4ad85d264b177bb?width=80",
        },
        {
            id: 3,
            name: "Асан Асылов",
            amount: "256 024 тг",
            avatar: "https://api.builder.io/api/v1/image/assets/TEMP/b97cb7d8a6a91ffcc6568eea52ade41a7e8dec91?width=80",
        },
    ],
};

export default function AnalyticsScreen() {
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Filter data based on search query
    const filteredData = useMemo(() => {
        if (!searchQuery.trim()) return analyticsData;

        const query = searchQuery.toLowerCase();
        return {
            metrics: analyticsData.metrics.filter(
                (item) =>
                    item.label.toLowerCase().includes(query) ||
                    item.value.toLowerCase().includes(query),
            ),
            reports: analyticsData.reports.filter(
                (item) =>
                    item.title.toLowerCase().includes(query) ||
                    item.value.toLowerCase().includes(query),
            ),
            orders: analyticsData.orders.filter(
                (item) =>
                    item.label.toLowerCase().includes(query) ||
                    item.value.toLowerCase().includes(query),
            ),
            financial: analyticsData.financial.filter(
                (item) =>
                    item.label.toLowerCase().includes(query) ||
                    item.value.toLowerCase().includes(query),
            ),
            inventory: analyticsData.inventory.filter(
                (item) =>
                    item.label.toLowerCase().includes(query) ||
                    item.value.toLowerCase().includes(query),
            ),
            employees: analyticsData.employees.filter(
                (item) =>
                    item.name.toLowerCase().includes(query) ||
                    item.amount.toLowerCase().includes(query),
            ),
        };
    }, [searchQuery]);

    const renderValueBadge = (value, type) => {
        if (type === "positive") {
            return (
                <View style={[styles.badge, backgroundsStyles.positiveBg]}>
                    <Text
                        style={[styles.badgeText, backgroundsStyles.positive]}
                    >
                        {value}
                    </Text>
                </View>
            );
        }
        if (type === "negative") {
            return (
                <View style={[styles.badge, backgroundsStyles.negativeBg]}>
                    <Text
                        style={[styles.badgeText, backgroundsStyles.negative]}
                    >
                        {value}
                    </Text>
                </View>
            );
        }
        return null;
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <View style={styles.container}>
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
                {filteredData.metrics.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            Общие показатели
                        </Text>
                        <View style={styles.card}>
                            {filteredData.metrics.map((metric, index) => (
                                <React.Fragment key={metric.id}>
                                    {index > 0 && (
                                        <View style={styles.divider} />
                                    )}
                                    <MetricCard {...metric} />
                                </React.Fragment>
                            ))}
                        </View>
                    </View>
                )}

                {/* Profit & Loss Report */}
                {filteredData.reports.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            Отчет о прибылях и убытках
                        </Text>
                        <View style={styles.card}>
                            <Text style={styles.subsectionTitle}>Сегодня</Text>
                            <View style={styles.reportsContainer}>
                                {filteredData.reports.map((report) => (
                                    <ReportCard key={report.id} {...report} />
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

                {/* Orders Report */}
                {filteredData.orders.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            Отчеты по заказам
                        </Text>
                        <View style={styles.card}>
                            {filteredData.orders.map((item, index) => (
                                <React.Fragment key={item.id}>
                                    {index > 0 && (
                                        <View style={styles.divider} />
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

                {/* Financial Reports */}
                {filteredData.financial.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Денежные отчеты</Text>
                        <View style={styles.card}>
                            {filteredData.financial.map((item, index) => (
                                <React.Fragment key={item.id}>
                                    {index > 0 && (
                                        <View style={styles.divider} />
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

                {/* Inventory Reports */}
                {filteredData.inventory.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            Складские отчеты
                        </Text>
                        <View style={styles.card}>
                            {filteredData.inventory.map((item, index) => (
                                <React.Fragment key={item.id}>
                                    {index > 0 && (
                                        <View style={styles.divider} />
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

                {/* Employee Reports */}
                {filteredData.employees.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            Отчеты по персоналу
                        </Text>
                        <View style={styles.card}>
                            {filteredData.employees.map((employee, index) => (
                                <React.Fragment key={employee.id}>
                                    {index > 0 && (
                                        <View style={styles.divider} />
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
                                        onPress={() => {}}
                                    />
                                </React.Fragment>
                            ))}
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
        backgroundColor: "#1C1C1E",
    },
    header: {
        backgroundColor: "rgba(28, 28, 30, 0.8)",
        paddingTop: 50,
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
    section: {
        marginTop: 32,
    },
    sectionTitle: {
        color: "#FFFFFF",
        fontSize: 24,
        fontWeight: "bold",
        lineHeight: 28,
        marginBottom: 16,
    },
    card: {
        padding: 12,
        backgroundColor: "#2C2C2E",
        borderRadius: 20,
        gap: 8,
    },
    divider: {
        height: 1,
        backgroundColor: "#3A3A3C",
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
    subsectionTitle: {
        color: "#FFFFFF",
        fontSize: 24,
        fontWeight: "bold",
        lineHeight: 28,
        marginBottom: 8,
    },
    reportsContainer: {
        gap: 12,
        marginTop: 8,
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
    badge: {
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "flex-start",
    },
    badgeText: {
        fontSize: 16,
        fontWeight: "bold",
        lineHeight: 20,
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
