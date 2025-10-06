import React, { useState, useEffect, useRef, useCallback } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    StatusBar,
    ActivityIndicator,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useRouter } from "expo-router";
import LogoutConfirmationModal, {
    LogoutConfirmationModalRef,
} from "@/src/client/components/modals/LogoutModal";

import { loadingStyles } from "@/src/client/styles/ui/loading.styles";

interface ProfileData {
    id: string;
    name: string;
    role: string;
    avatar: string;
    shiftStartTime: string;
    todaysEarnings: number;
}

interface ProfileScreenProps {
    userId?: string;
}

export default function ProfileScreen({
    userId = "user-123",
}: ProfileScreenProps) {
    const router = useRouter();
    const logoutModalRef = useRef<LogoutConfirmationModalRef>(null);

    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [elapsedTime, setElapsedTime] = useState("00:00:00");
    const [loading, setLoading] = useState(true);

    // Fetch profile data from API
    useEffect(() => {
        const fetchProfileData = async () => {
            setLoading(true);

            try {
                // Replace with your actual API endpoint
                // const response = await fetch(`YOUR_API_URL/api/waiter/${userId}/profile`);
                // const data = await response.json();

                // Simulated API response
                await new Promise((resolve) => setTimeout(resolve, 800));

                const mockData: ProfileData = {
                    id: userId,
                    name: "Адилет Дегитаев",
                    role: "Официант",
                    avatar: "https://api.builder.io/api/v1/image/assets/TEMP/e0e80a9a8e34ae933a9711def284c06ceaaf5c18?width=144",
                    shiftStartTime: "09:00",
                    todaysEarnings: 53000,
                };

                setProfileData(mockData);
            } catch (error) {
                console.error("Error fetching profile data:", error);
                Alert.alert("Ошибка", "Не удалось загрузить данные профиля");
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();

        // Refresh data every 5 minutes
        const interval = setInterval(fetchProfileData, 5 * 60 * 1000);

        // Cleanup function - this is what useEffect should return
        return () => clearInterval(interval);
    }, [userId]);

    const renderLoadingState = () => (
        <View style={loadingStyles.loadingContainer}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={loadingStyles.loadingText}>Загрузка профиля...</Text>
        </View>
    );

    // Calculate elapsed time
    useEffect(() => {
        if (!profileData) return;

        const calculateElapsedTime = () => {
            const [startHours, startMinutes] = profileData.shiftStartTime
                .split(":")
                .map(Number);
            const now = new Date();
            const currentHours = now.getHours();
            const currentMinutes = now.getMinutes();
            const currentSeconds = now.getSeconds();

            let elapsedSeconds =
                (currentHours - startHours) * 3600 +
                (currentMinutes - startMinutes) * 60 +
                currentSeconds;

            if (elapsedSeconds < 0) {
                elapsedSeconds += 24 * 3600;
            }

            const hours = Math.floor(elapsedSeconds / 3600);
            const minutes = Math.floor((elapsedSeconds % 3600) / 60);
            const seconds = elapsedSeconds % 60;

            return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        };

        const updateTime = () => {
            setElapsedTime(calculateElapsedTime());
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);

        return () => clearInterval(interval);
    }, [profileData]);

    // Handle menu item press
    const handleMenuItemPress = useCallback((item: string) => {
        switch (item) {
            case "references":
                // Navigate to references screen
                console.log("Navigate to references");
                break;
            case "faq":
                // Navigate to FAQ screen
                console.log("Navigate to FAQ");
                break;
            case "about":
                // Navigate to about screen
                console.log("Navigate to about");
                break;
        }
    }, []);

    // Handle logout
    const handleLogout = useCallback(() => {
        logoutModalRef.current?.open();
    }, []);

    const handleConfirmLogout = useCallback(() => {
        // Clear user session/token
        // Navigate to login screen
        console.log("User logged out");
        router.replace("/login");
    }, [router]);

    // Render header
    const renderHeader = () => (
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Профиль</Text>
        </View>
    );

    // Render profile info
    const renderProfileInfo = () => {
        if (!profileData) return null;

        return (
            <View style={styles.profileSection}>
                {/* Avatar */}
                <View style={styles.avatarContainer}>
                    <View style={styles.avatarBorder}>
                        <Image
                            source={{ uri: profileData.avatar }}
                            style={styles.avatar}
                            resizeMode="cover"
                        />
                    </View>
                </View>

                {/* Name and Role */}
                <View style={styles.nameSection}>
                    <Text style={styles.name}>{profileData.name}</Text>
                    <Text style={styles.role}>{profileData.role}</Text>
                </View>

                {/* Stats Cards */}
                <View style={styles.statsContainer}>
                    {/* Time Card */}
                    <View style={styles.statCard}>
                        <View style={styles.statIcon}>
                            <Text style={styles.timeIconText}>⏰</Text>
                        </View>
                        <View style={styles.statContent}>
                            <Text style={styles.statLabel}>Прошло времени</Text>
                            <Text style={styles.statValue}>{elapsedTime}</Text>
                        </View>
                    </View>

                    {/* Earnings Card */}
                    <View style={styles.statCard}>
                        <View style={styles.statIcon}>
                            <Text style={styles.earningsIconText}>₸</Text>
                        </View>
                        <View style={styles.statContent}>
                            <Text style={styles.statLabel}>
                                Сегодняшний счет
                            </Text>
                            <Text style={styles.statValue}>
                                {profileData.todaysEarnings.toLocaleString()} тг
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    // Render menu items
    const renderMenuItems = () => (
        <View style={styles.menuSection}>
            {/* References */}
            <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleMenuItemPress("references")}
                activeOpacity={0.7}
            >
                <View style={styles.menuItemLeft}>
                    <View style={styles.menuIcon}>
                        <Text style={styles.menuIconText}>📚</Text>
                    </View>
                    <Text style={styles.menuItemText}>Справки</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>

            {/* FAQ */}
            <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleMenuItemPress("faq")}
                activeOpacity={0.7}
            >
                <View style={styles.menuItemLeft}>
                    <View style={styles.menuIcon}>
                        <Text style={styles.menuIconText}>💬</Text>
                    </View>
                    <Text style={styles.menuItemText}>Частые вопросы</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>

            {/* About */}
            <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleMenuItemPress("about")}
                activeOpacity={0.7}
            >
                <View style={styles.menuItemLeft}>
                    <View style={styles.menuIcon}>
                        <Text style={styles.menuIconText}>ℹ️</Text>
                    </View>
                    <Text style={styles.menuItemText}>О приложении</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
        </View>
    );

    // Render logout button
    const renderLogoutButton = () => (
        <View style={styles.logoutSection}>
            <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
                activeOpacity={0.8}
            >
                <Text style={styles.logoutButtonText}>Выйти</Text>
            </TouchableOpacity>
        </View>
    );

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar
                    barStyle="light-content"
                    backgroundColor="rgba(25, 25, 26, 1)"
                />
                {renderLoadingState()}
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                barStyle="light-content"
                backgroundColor="rgba(25, 25, 26, 1)"
            />

            <View style={styles.mainContainer}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {renderHeader()}
                    {renderProfileInfo()}
                    {renderMenuItems()}
                </ScrollView>

                {renderLogoutButton()}
            </View>

            <LogoutConfirmationModal
                ref={logoutModalRef}
                userName={profileData?.name}
                onConfirmLogout={handleConfirmLogout}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgba(25, 25, 26, 1)",
    },
    mainContainer: {
        flex: 1,
        justifyContent: "space-between",
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        gap: 40,
    },

    // Header
    header: {
        paddingHorizontal: 16,
        height: 56,
        justifyContent: "center",
    },
    headerTitle: {
        color: "#fff",
        fontSize: 32,
        fontWeight: "600",
        letterSpacing: -0.24,
    },

    // Profile Section
    profileSection: {
        alignItems: "center",
        gap: 20,
        paddingHorizontal: 16,
    },
    avatarContainer: {
        alignItems: "center",
    },
    avatarBorder: {
        width: 88,
        height: 88,
        borderRadius: 44,
        borderWidth: 4,
        borderColor: "#4DEF8E",
        padding: 4,
        justifyContent: "center",
        alignItems: "center",
    },
    avatar: {
        width: 72,
        height: 72,
        borderRadius: 36,
    },
    nameSection: {
        alignItems: "center",
        gap: 8,
        width: "100%",
    },
    name: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "600",
        letterSpacing: -0.24,
        textAlign: "center",
    },
    role: {
        color: "rgba(255, 255, 255, 0.75)",
        fontSize: 16,
        letterSpacing: -0.24,
        textAlign: "center",
    },

    // Stats Cards
    statsContainer: {
        flexDirection: "row",
        width: "100%",
        gap: 16,
    },
    statCard: {
        flex: 1,
        backgroundColor: "rgba(35, 35, 36, 1)",
        borderRadius: 20,
        padding: 12,
        gap: 12,
    },
    statIcon: {
        width: 24,
        height: 24,
        justifyContent: "center",
        alignItems: "center",
    },
    timeIconText: {
        fontSize: 20,
    },
    earningsIconText: {
        fontSize: 20,
        color: "#0DC268",
    },
    statContent: {
        gap: 4,
    },
    statLabel: {
        color: "#797A80",
        fontSize: 12,
        letterSpacing: -0.24,
        lineHeight: 16,
    },
    statValue: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "600",
        letterSpacing: -0.24,
        lineHeight: 30,
    },

    // Menu Section
    menuSection: {
        paddingHorizontal: 16,
        gap: 16,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 12,
        paddingHorizontal: 12,
    },
    menuItemLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        flex: 1,
    },
    menuIcon: {
        width: 20,
        height: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    menuIconText: {
        fontSize: 16,
    },
    menuItemText: {
        color: "#fff",
        fontSize: 16,
        letterSpacing: -0.24,
        lineHeight: 20,
    },
    chevron: {
        color: "rgba(255, 255, 255, 0.75)",
        fontSize: 24,
        fontWeight: "300",
    },

    // Logout Section
    logoutSection: {
        backgroundColor: "rgba(25, 25, 26, 0.85)",
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 16,
    },
    logoutButton: {
        height: 44,
        borderRadius: 20,
        backgroundColor: "rgba(35, 35, 36, 1)",
        justifyContent: "center",
        alignItems: "center",
    },
    logoutButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
        lineHeight: 24,
    },
});
