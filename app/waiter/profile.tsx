import React, { useState, useEffect, useRef, useCallback } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    StatusBar,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Loading from "@/src/client/components/Loading";

import AccountActionsModal, {
    AccountActionsModalRef,
} from "@/src/client/components/modals/LogoutModal";
import { loadingStyles } from "@/src/client/styles/ui/loading.styles";
import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";
import { useAuth } from "@/src/contexts/AuthContext";

// ============================================================================
// Types
// ============================================================================

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

// ============================================================================
// Constants
// ============================================================================

const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes
const TIME_UPDATE_INTERVAL = 1000; // 1 second
const MOCK_DELAY = 800;

// ============================================================================
// Main Component
// ============================================================================

export default function ProfileScreen({
    // TODO убрать user-123
    userId = "user-123",
}: ProfileScreenProps) {
    const router = useRouter();
    const { logout, user } = useAuth();
    const logoutModalRef = useRef<AccountActionsModalRef>(null);

    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [elapsedTime, setElapsedTime] = useState("00:00:00");
    const [loading, setLoading] = useState(true);

    // ========================================================================
    // Data Fetching
    // ========================================================================

    const fetchProfileData = useCallback(async () => {
        setLoading(true);

        try {
            // TODO убрать мокдату
            // Replace with your actual API endpoint
            // const response = await fetch(`YOUR_API_URL/api/waiter/${userId}/profile`);
            // const data = await response.json();

            // Simulated API response
            await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));

            // TODO убрать анхуй моку
            const mockData: ProfileData = {
                id: userId,
                name: user?.name ?? "",
                role: "Официант",
                avatar: "",
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
    }, [userId]);

    useEffect(() => {
        fetchProfileData();

        const interval = setInterval(fetchProfileData, REFRESH_INTERVAL);
        return () => clearInterval(interval);
    }, [fetchProfileData]);

    // ========================================================================
    // Time Calculation
    // ========================================================================

    const calculateElapsedTime = useCallback((): string => {
        if (!profileData) return "00:00:00";

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
    }, [profileData]);

    useEffect(() => {
        if (!profileData) return;

        const updateTime = () => {
            setElapsedTime(calculateElapsedTime());
        };

        updateTime();
        const interval = setInterval(updateTime, TIME_UPDATE_INTERVAL);

        return () => clearInterval(interval);
    }, [profileData, calculateElapsedTime]);

    // ========================================================================
    // Event Handlers
    // ========================================================================

    const handleLogout = useCallback(() => {
        logoutModalRef.current?.open();
    }, []);

    const handleConfirmLogout = useCallback(async () => {
        await logout();
        router.replace("/auth");
    }, [router]);

    // ========================================================================
    // Render Functions
    // ========================================================================

    const renderLoadingState = () => (
        <View style={loadingStyles.loadingContainer}>
            <Loading />
            <Text style={loadingStyles.loadingText}>Загрузка профиля...</Text>
        </View>
    );

    const renderHeader = () => (
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Профиль</Text>
        </View>
    );

    const renderProfileInfo = () => {
        if (!profileData) return null;

        return (
            <View style={styles.profileSection}>
                <View style={styles.avatarContainer}>
                    <View style={styles.avatarBorder}>
                        {profileData.avatar && (
                            <Image
                                source={{ uri: profileData.avatar }}
                                style={styles.avatar}
                                resizeMode="cover"
                            />
                        )}
                    </View>
                </View>

                <View style={styles.nameSection}>
                    <Text style={styles.name}>{profileData.name}</Text>
                    <Text style={styles.role}>{profileData.role}</Text>
                </View>
            </View>
        );
    };

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

    // ========================================================================
    // Main Render
    // ========================================================================

    if (loading) {
        return (
            <SafeAreaView
                style={[styles.container, backgroundsStyles.generalBg]}
            >
                <StatusBar
                    barStyle="light-content"
                    backgroundColor="rgba(25, 25, 26, 1)"
                />
                {renderLoadingState()}
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, backgroundsStyles.generalBg]}>
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
                </ScrollView>

                {renderLogoutButton()}
            </View>

            <AccountActionsModal
                ref={logoutModalRef}
                userName={profileData?.name}
                currentRole={profileData?.role} // Add this line
                onLogout={handleConfirmLogout}
                onChangeRole={() => router.push("/")}
            />
        </SafeAreaView>
    );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
