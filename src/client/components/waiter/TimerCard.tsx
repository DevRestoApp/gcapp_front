import { View, Text, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";

interface TimerCardProps {
    timeElapsed: string;
}

export default function TimerCard({ timeElapsed }: TimerCardProps) {
    return (
        <View style={styles.card}>
            {/* Clock Icon */}
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                <Path
                    d="M12 2.25C10.0716 2.25 8.18657 2.82183 6.58319 3.89317C4.97982 4.96452 3.73013 6.48726 2.99218 8.26884C2.25422 10.0504 2.06114 12.0108 2.43735 13.9021C2.81355 15.7934 3.74215 17.5307 5.10571 18.8943C6.46928 20.2579 8.20656 21.1865 10.0979 21.5627C11.9892 21.9389 13.9496 21.7458 15.7312 21.0078C17.5127 20.2699 19.0355 19.0202 20.1068 17.4168C21.1782 15.8134 21.75 13.9284 21.75 12C21.745 9.41566 20.7162 6.93859 18.8888 5.11118C17.0614 3.28378 14.5843 2.25496 12 2.25V2.25ZM17.25 12.75H12C11.8011 12.75 11.6103 12.671 11.4697 12.5303C11.329 12.3897 11.25 12.1989 11.25 12V6.75C11.25 6.55109 11.329 6.36032 11.4697 6.21967C11.6103 6.07902 11.8011 6 12 6C12.1989 6 12.3897 6.07902 12.5303 6.21967C12.671 6.36032 12.75 6.55109 12.75 6.75V11.25H17.25C17.4489 11.25 17.6397 11.329 17.7803 11.4697C17.921 11.6103 18 11.8011 18 12C18 12.1989 17.921 12.3897 17.7803 12.5303C17.6397 12.671 17.4489 12.75 17.25 12.75Z"
                    fill="#FF9E00"
                />
            </Svg>

            {/* Content */}
            <View style={styles.content}>
                <Text style={styles.label}>Прошло времени</Text>
                <Text style={styles.time}>{timeElapsed}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 12,
        padding: 12,
        borderRadius: 20,
        width: 175,
        backgroundColor: "rgba(35, 35, 36, 1)",
    },
    content: {
        flexDirection: "column",
        alignItems: "flex-start",
        width: "100%",
    },
    label: {
        color: "#797A80",
        fontSize: 12,
        fontWeight: "400",
        lineHeight: 16,
        letterSpacing: -0.24,
        fontFamily: "Inter",
    },
    time: {
        color: "#FFFFFF",
        fontSize: 24,
        fontWeight: "600",
        lineHeight: 30,
        letterSpacing: -0.24,
        fontFamily: "Inter",
    },
});
