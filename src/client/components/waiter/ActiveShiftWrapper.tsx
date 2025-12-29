import { View, StyleSheet, Text, Pressable } from "react-native";
import React, { useRef } from "react";

import EarningsCard from "./EarningsCard";
import TimerCard from "./TimerCard";
import MotivationCard from "./MotivationCard";
import ActiveOrdersSection from "./ActiveOrderSection";
import ShiftCloseModal, {
    ShiftCloseModalRef,
} from "@/src/client/components/modals/ShiftCloseModal";
import { ButtonStyles } from "@/src/client/styles/ui/buttons/Button.styles";

export default function ActiveShiftWrapper() {
    const shiftCloseModalRef = useRef<ShiftCloseModalRef>(null);

    const handleOpenModal = () => {
        shiftCloseModalRef.current?.open();
    };

    const handleCloseShift = (data: {
        startTime: string;
        endTime: string;
        totalOrdersSold: number;
        totalRevenue: number;
        duration: string;
    }) => {
        console.log("Shift closed:", data);
    };

    const handleCancel = () => {
        console.log("Shift close canceled");
    };

    return (
        <View style={styles.container}>
            {/* Top row */}
            <View style={styles.row}>
                <View style={styles.half}>
                    {<TimerCard timeElapsed={"00:00:00"}></TimerCard>}
                </View>
                <View style={styles.half}>
                    {<EarningsCard amount={"15000"}></EarningsCard>}
                </View>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Bottom full-width */}
            <View style={styles.bottom}>
                {
                    <MotivationCard
                        goalText={"Продать десерт"}
                        targetAmount={"15"}
                        currentProgress={"3"}
                    ></MotivationCard>
                }
            </View>

            <View>
                <ActiveOrdersSection></ActiveOrdersSection>
            </View>

            <View>
                <ShiftCloseModal
                    ref={shiftCloseModalRef}
                    startTime="09:00"
                    totalOrdersSold={45}
                    totalRevenue={456000}
                    onCloseShift={(data) => {
                        console.log("Shift closed:", data);
                        // Navigate to login or generate report
                    }}
                    onCancel={() => console.log("Cancelled")}
                />

                <Pressable
                    style={[ButtonStyles.buttonWhite, { width: "100%" }]}
                    onPress={handleOpenModal}
                >
                    <Text>Закончить смену</Text>
                </Pressable>

                {/* The modal itself */}
                <ShiftCloseModal
                    ref={shiftCloseModalRef}
                    startTime="09:00"
                    totalOrdersSold={42}
                    totalRevenue={123456}
                    onCloseShift={handleCloseShift}
                    onCancel={handleCancel}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1A1A1A", // dark 85% background
        padding: 16,
    },
    row: {
        flexDirection: "row",
        marginBottom: 16,
    },
    half: {
        flex: 1,
        alignItems: "center",
    },
    divider: {
        height: 1,
        backgroundColor: "rgba(255,255,255,0.2)",
        marginBottom: 16,
    },
    bottom: {
        flex: 1,
        marginBottom: 16,
    },
    newOrderContainer: {
        width: "100%",
    },
});
