import { View, StyleSheet } from "react-native";
import EarningsCard from "./EarningsCard";
import TimerCard from "./TimerCard";
import MotivationCard from "./MotivationCard";
import AddOrder from "./AddOrder";

export default function ActiveShiftWrapper() {
    return (
        <View style={styles.container}>
            {/* Top row */}
            <View style={styles.row}>
                <View style={styles.half}>
                    {<TimerCard timeElapsed={"15"}></TimerCard>}
                </View>
                <View style={styles.half}>
                    {<EarningsCard amount={"15"}></EarningsCard>}
                </View>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Bottom full-width */}
            <View style={styles.bottom}>
                {
                    <MotivationCard
                        goalText={"ewkere"}
                        targetAmount={"15"}
                        currentProgress={"3"}
                    ></MotivationCard>
                }
            </View>

            <View style={styles.newOrderContainer}>
                <AddOrder></AddOrder>
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
