import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useRouter } from "expo-router";
import Svg, { Path } from "react-native-svg";
import EmployeeCard from "@/src/client/components/ceo/EmployeeCard";

import { useEmployee, Employee } from "@/src/contexts/EmployeeContext";
import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";

const employeesData: Employee[] = [
    {
        id: "1",
        name: "Аслан Аманов",
        role: "Оффицант",
        avatarUrl:
            "https://api.builder.io/api/v1/image/assets/TEMP/3a1a0f795dd6cebc375ac2f7fbeab6a0d791efc8?width=80",
        totalAmount: "56 897 тг",
        shiftTime: "00:56:25",
        isActive: true,
    },
    {
        id: "2",
        name: "Аида Таманова",
        role: "Оффицант",
        avatarUrl:
            "https://api.builder.io/api/v1/image/assets/TEMP/4bd88d9313f5402e21d3f064a4ad85d264b177bb?width=80",
        totalAmount: "56 897 тг",
        shiftTime: "00:56:25",
        isActive: true,
    },
    {
        id: "3",
        name: "Арман Ашимов",
        role: "Бармен",
        avatarUrl:
            "https://api.builder.io/api/v1/image/assets/TEMP/4a47f1eee62770da0326efa94f2187fd2ec7547d?width=80",
        totalAmount: "56 897 тг",
        shiftTime: "00:56:25",
        isActive: true,
    },
    {
        id: "4",
        name: "Тима Янь",
        role: "Хостес",
        avatarUrl:
            "https://api.builder.io/api/v1/image/assets/TEMP/b97cb7d8a6a91ffcc6568eea52ade41a7e8dec91?width=80",
        totalAmount: "56 897 тг",
        shiftTime: "00:56:25",
        isActive: true,
    },
    {
        id: "5",
        name: "Асылай Арнатова",
        role: "Официант",
        avatarUrl:
            "https://api.builder.io/api/v1/image/assets/TEMP/da6152e88e4a02dca62dd7161b21651c66d6c6ce?width=80",
        totalAmount: "56 897 тг",
        shiftTime: "00:56:25",
        isActive: true,
    },
    {
        id: "7",
        name: "Тима Янь",
        role: "Хостес",
        avatarUrl:
            "https://api.builder.io/api/v1/image/assets/TEMP/b97cb7d8a6a91ffcc6568eea52ade41a7e8dec91?width=80",
        totalAmount: "56 897 тг",
        shiftTime: "00:56:25",
        isActive: false,
    },
    {
        id: "8",
        name: "Асылай Арнатова",
        role: "Официант",
        avatarUrl:
            "https://api.builder.io/api/v1/image/assets/TEMP/da6152e88e4a02dca62dd7161b21651c66d6c6ce?width=80",
        totalAmount: "56 897 тг",
        shiftTime: "00:56:25",
        isActive: false,
    },
];

export default function EmployeesScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"open" | "all">("open");

    const { setSelectedEmployee } = useEmployee();

    const filteredEmployees =
        activeTab === "open"
            ? employeesData.filter((emp) => emp.isActive)
            : employeesData;

    return (
        <SafeAreaView
            style={{ ...styles.container, ...backgroundsStyles.generalBg }}
        >
            <StatusBar
                barStyle="light-content"
                backgroundColor="rgba(25, 25, 26, 1)"
            />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => router.push("/ceo")}
                        style={styles.backButton}
                        activeOpacity={0.7}
                    >
                        <Svg
                            width="28"
                            height="28"
                            viewBox="0 0 28 28"
                            fill="none"
                        >
                            <Path
                                d="M9.58992 14.8405C9.42578 14.6765 9.33346 14.4541 9.33325 14.2221V13.7788C9.33594 13.5473 9.42789 13.3258 9.58992 13.1605L15.5866 7.17548C15.6961 7.06505 15.8452 7.00293 16.0008 7.00293C16.1563 7.00293 16.3054 7.06505 16.4149 7.17548L17.2433 8.00381C17.353 8.11134 17.4148 8.25851 17.4148 8.41215C17.4148 8.56578 17.353 8.71295 17.2433 8.82048L12.0516 14.0005L17.2433 19.1805C17.3537 19.29 17.4158 19.4391 17.4158 19.5946C17.4158 19.7502 17.3537 19.8993 17.2433 20.0088L16.4149 20.8255C16.3054 20.9359 16.1563 20.998 16.0008 20.998C15.8452 20.998 15.6961 20.9359 15.5866 20.8255L9.58992 14.8405Z"
                                fill="white"
                            />
                        </Svg>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Сотрудники</Text>
                    <View style={styles.headerSpacer} />
                </View>

                {/* Segmented Control */}
                <View style={styles.segmentedControlContainer}>
                    <View style={styles.segmentedControl}>
                        <TouchableOpacity
                            onPress={() => setActiveTab("open")}
                            style={[
                                styles.segmentButton,
                                activeTab === "open" &&
                                    styles.segmentButtonActive,
                            ]}
                            activeOpacity={0.7}
                        >
                            <Text
                                style={[
                                    styles.segmentText,
                                    activeTab === "open" &&
                                        styles.segmentTextActive,
                                ]}
                            >
                                Открытий
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setActiveTab("all")}
                            style={[
                                styles.segmentButton,
                                activeTab === "all" &&
                                    styles.segmentButtonActive,
                            ]}
                            activeOpacity={0.7}
                        >
                            <Text
                                style={[
                                    styles.segmentText,
                                    activeTab === "all" &&
                                        styles.segmentTextActive,
                                ]}
                            >
                                Все
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Employees Section */}
                <View style={styles.employeesSection}>
                    <Text style={styles.sectionTitle}>
                        Сотрудники ({filteredEmployees.length})
                    </Text>

                    <View style={styles.employeesList}>
                        {filteredEmployees.map((employee) => (
                            <EmployeeCard
                                key={employee.id}
                                name={employee.name}
                                role={employee.role}
                                avatarUrl={employee.avatarUrl}
                                totalAmount={employee.totalAmount}
                                shiftTime={employee.shiftTime}
                                statsSectionActive={activeTab === "open"}
                                onPress={() => {
                                    setSelectedEmployee(employee);
                                    // Navigate to employee detail page
                                    router.push({
                                        pathname: `/employees/${employee.id}`,
                                    });
                                }}
                            />
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 128,
    },
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
    },
    headerSpacer: {
        width: 28,
        height: 28,
    },
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
    segmentButton: {
        flex: 1,
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
    employeesSection: {
        paddingHorizontal: 16,
        gap: 16,
    },
    sectionTitle: {
        color: "#FFFFFF",
        fontSize: 24,
        fontWeight: "700",
        lineHeight: 28,
    },
    employeesList: {
        gap: 12,
    },
});
