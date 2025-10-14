import React, { useState, useRef } from "react";
import {
    TouchableOpacity,
    ScrollView,
    StatusBar,
    StyleSheet,
    View,
    Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";

import { useRouter, useLocalSearchParams } from "expo-router";
import Svg, { Path } from "react-native-svg";

import { useEmployee } from "@/src/contexts/EmployeeContext";
import { ModalWrapperRef } from "@/src/client/components/modals/ModalWrapper";
import EmployeeCard from "@/src/client/components/ceo/EmployeeCard";
import TableNumberGrid from "@/src/client/components/TableNumberGrid";
import RoomNumberGrid from "@/src/client/components/RoomNumberGrid";
import DropdownMenuDots from "@/src/client/components/DropdownMenuDots";
import ShiftTimeModal from "@/src/client/components/modals/ShiftTimeModal";

const rooms = [
    "Общий зал",
    "Открытая VIP-беседка",
    "Летняя терраса",
    "VIP-залы",
];

// TODO add useEffect to get info about all rooms + active and disabled tables

export default function EmployeeDetailScreen() {
    const { id } = useLocalSearchParams();
    const { selectedEmployee } = useEmployee();
    const editModalRef = useRef<ModalWrapperRef>(null);
    const dropdownRef = useRef<any>(null);

    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"info" | "history">("info");
    const [selectedRooms, setSelectedRooms] = useState<string[]>([]);

    const toggleRoom = (room: string) => {
        setSelectedRooms((prev) =>
            prev.includes(room)
                ? prev.filter((r) => r !== room)
                : [...prev, room],
        );
    };

    return (
        <SafeAreaView style={styles.container}>
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
                        onPress={() => router.back()}
                        style={styles.headerButton}
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
                    <DropdownMenuDots ref={dropdownRef}>
                        <TouchableOpacity
                            style={styles.headerMenuItem}
                            onPress={() => {
                                dropdownRef.current?.close();
                                editModalRef.current?.open();
                            }}
                        >
                            <Feather name="edit" size={20} color="white" />
                            <Text style={styles.headerMenuTitle}>
                                Редактировать время
                            </Text>
                        </TouchableOpacity>
                    </DropdownMenuDots>
                </View>

                <ShiftTimeModal
                    ref={editModalRef}
                    type="edit"
                    initialTime="09:30"
                    onShiftEdit={(time) => {
                        console.log("New time:", time);
                        // Handle the time update here

                        // Close dropdown after modal completes
                        dropdownRef.current?.close();
                    }}
                />

                {/* Segmented Control */}
                <View style={styles.segmentedControlContainer}>
                    <View style={styles.segmentedControl}>
                        <TouchableOpacity
                            onPress={() => setActiveTab("info")}
                            style={[
                                styles.segmentButton,
                                activeTab === "info" &&
                                    styles.segmentButtonActive,
                            ]}
                            activeOpacity={0.7}
                        >
                            <Text
                                style={[
                                    styles.segmentText,
                                    activeTab === "info" &&
                                        styles.segmentTextActive,
                                ]}
                            >
                                Инфо
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setActiveTab("history")}
                            style={[
                                styles.segmentButton,
                                activeTab === "history" &&
                                    styles.segmentButtonActive,
                            ]}
                            activeOpacity={0.7}
                        >
                            <Text
                                style={[
                                    styles.segmentText,
                                    activeTab === "history" &&
                                        styles.segmentTextActive,
                                ]}
                            >
                                История
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Info Tab Content */}
                {activeTab === "info" && (
                    <View style={styles.contentContainer}>
                        <EmployeeCard
                            name={selectedEmployee.name}
                            role={selectedEmployee.role}
                            avatarUrl={selectedEmployee.avatarUrl}
                            totalAmount={selectedEmployee.totalAmount}
                            shiftTime={selectedEmployee.shiftTime}
                            statsSectionActive={activeTab === "info"}
                            onPress={() => {}}
                        />
                        <Text style={styles.headerTitle}>
                            Выберите помещение
                        </Text>
                        <RoomNumberGrid
                            rooms={rooms}
                            selectedRoom={"2"}
                        ></RoomNumberGrid>
                        <Text style={styles.headerTitle}>Стол</Text>
                        <TableNumberGrid
                            tableCount={21}
                            columns={7}
                            selectedTable={5}
                            disabledTables={[3, 7, 12]} // These tables will be grayed out
                            onTableSelect={(tableNumber) => {
                                router.push(`/tables/${tableNumber}`);
                            }}
                        />
                    </View>
                )}

                {/* History Tab Content */}
                {activeTab === "history" && (
                    <View style={styles.contentContainer}>
                        <Text style={styles.sectionTitle}>История</Text>
                        {/* Add history content here */}
                    </View>
                )}
            </ScrollView>

            {/* Bottom Fixed Section */}
            <View style={styles.bottomSection}>
                <TouchableOpacity
                    style={styles.penaltyButton}
                    activeOpacity={0.9}
                >
                    <Text style={styles.penaltyButtonText}>Написать штраф</Text>
                </TouchableOpacity>
                {/* Bottom Navigation Placeholder - 94px height */}
                <View style={styles.bottomNavPlaceholder} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgba(25, 25, 26, 1)",
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 166,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: 56,
        paddingHorizontal: 16,
        backgroundColor: "rgba(25, 25, 26, 1)",
    },
    headerButton: {
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
    headerMenuItem: {
        flexDirection: "row",
        paddingVertical: 6,
        paddingHorizontal: 10,
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: 12,
        gap: 6,
    },
    headerMenuTitle: {
        color: "#FFFFFF",
        fontSize: 16,
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
    contentContainer: {
        paddingHorizontal: 16,
        paddingTop: 28,
        gap: 28,
    },
    section: {
        gap: 16,
    },
    sectionTitle: {
        color: "#FFFFFF",
        fontSize: 24,
        fontWeight: "700",
        lineHeight: 28,
    },
    employeeCard: {
        backgroundColor: "rgba(35, 35, 36, 1)",
        borderRadius: 20,
        padding: 12,
        gap: 12,
    },
    employeeHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    employeeInfo: {
        flex: 1,
        gap: 4,
    },
    employeeName: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "400",
        lineHeight: 20,
    },
    employeeRole: {
        color: "rgba(255, 255, 255, 0.75)",
        fontSize: 12,
        fontWeight: "400",
        lineHeight: 16,
    },
    statusBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: "rgba(13, 194, 104, 0.08)",
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    statusText: {
        color: "#0DC268",
        fontSize: 12,
        fontWeight: "400",
        lineHeight: 16,
    },
    statsRow: {
        flexDirection: "row",
        gap: 8,
    },
    statCard: {
        flex: 1,
        backgroundColor: "rgba(43, 43, 44, 1)",
        borderRadius: 12,
        padding: 8,
        gap: 8,
    },
    statInfo: {
        gap: 4,
    },
    statLabel: {
        color: "rgba(255, 255, 255, 0.75)",
        fontSize: 12,
        fontWeight: "400",
        lineHeight: 16,
    },
    statValue: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
        lineHeight: 16,
    },
    roomsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    roomButton: {
        height: 44,
        paddingHorizontal: 12,
        borderRadius: 16,
        backgroundColor: "rgba(43, 43, 44, 1)",
        alignItems: "center",
        justifyContent: "center",
    },
    roomButtonActive: {
        backgroundColor: "rgba(13, 194, 104, 0.12)",
    },
    roomButtonText: {
        color: "#797A80",
        fontSize: 16,
        fontWeight: "400",
        textAlign: "center",
        letterSpacing: -0.24,
    },
    bottomSection: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(25, 25, 26, 0.85)",
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 16,
        gap: 16,
        height: 166,
    },
    penaltyButton: {
        width: "100%",
        height: 44,
        borderRadius: 20,
        backgroundColor: "rgba(237, 10, 52, 0.08)",
        alignItems: "center",
        justifyContent: "center",
    },
    penaltyButtonText: {
        color: "#EE1E44",
        fontSize: 16,
        fontWeight: "600",
        lineHeight: 24,
        textAlign: "center",
    },
    bottomNavPlaceholder: {
        height: 94,
    },
});
