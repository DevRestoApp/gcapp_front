import React, { useState, useRef, useCallback } from "react";
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
import AddPenaltyModal, {
    AddPenaltyModalRef,
} from "@/src/client/components/modals/AddPenaltyModal";

import { useCeo } from "../_layout";
import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";

export default function PenaltiesScreen() {
    const router = useRouter();
    const { employees, addFine, shiftData } = useCeo();
    const [activeTab, setActiveTab] = useState<"open" | "all">("open");
    const [selectedEmployeeForPenalty, setSelectedEmployeeForPenalty] =
        useState<any>(null);

    const addPenaltyModalRef = useRef<AddPenaltyModalRef>(null);

    const filteredEmployees =
        activeTab === "open"
            ? employees.filter((emp) => emp.isActive)
            : employees;

    // Handle employee card press to open penalty modal
    const handleEmployeePress = useCallback((employee: any) => {
        setSelectedEmployeeForPenalty(employee);
        addPenaltyModalRef.current?.open();
    }, []);

    // Handle penalty submission
    const handleAddPenalty = useCallback(
        (data: {
            employeeId: string;
            employeeName: string;
            reason: string;
            amount: number;
        }) => {
            addFine({
                employeeId: data.employeeId,
                employeeName: data.employeeName,
                reason: data.reason,
                amount: data.amount,
                date: new Date().toISOString(),
            });
            setSelectedEmployeeForPenalty(null);
        },
        [addFine],
    );

    // Handle modal cancel
    const handleModalCancel = useCallback(() => {
        setSelectedEmployeeForPenalty(null);
    }, []);

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
                    <Text style={styles.headerTitle}>
                        Штрафы ({shiftData.finesCount})
                    </Text>
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
                                Открытые
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
                        Выберите сотрудника для штрафа (
                        {filteredEmployees.length})
                    </Text>

                    <View style={styles.employeesList}>
                        {filteredEmployees.map((employee) => (
                            <EmployeeCard
                                key={employee.id}
                                name={employee.name}
                                role={employee.role}
                                avatar={employee.avatarUrl}
                                totalAmount={employee.totalAmount}
                                shiftTime={employee.shiftTime}
                                showStats={activeTab === "open"}
                                onPress={() => handleEmployeePress(employee)}
                            />
                        ))}
                    </View>
                </View>
            </ScrollView>

            {/* Add Penalty Modal */}
            <AddPenaltyModal
                ref={addPenaltyModalRef}
                employees={employees}
                onAddPenalty={handleAddPenalty}
                onCancel={handleModalCancel}
            />
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
