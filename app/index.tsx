import React, { useState, useCallback } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    StatusBar,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";

// ============================================================================
// Types
// ============================================================================

interface Role {
    id: string;
    title: string;
    description: string;
    icon: string;
}

interface RolePickerProps {
    onRoleSelect?: (roleId: string) => void;
    availableRoles?: Role[];
}

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_ROLES: Role[] = [
    {
        id: "admin",
        title: "Админ",
        description: "Здесь будет краткий описание",
        icon: "https://api.builder.io/api/v1/image/assets/TEMP/bd0d9d4d83dc41e04175af2ec4e77596361c0d68?width=88",
    },
    {
        id: "owner",
        title: "Владелец",
        description: "Здесь будет краткий описание",
        icon: "https://api.builder.io/api/v1/image/assets/TEMP/5755be83d68683e11fc669e4355160df16297489?width=88",
    },
    {
        id: "waiter",
        title: "Официант",
        description: "Здесь будет краткий описание",
        icon: "https://api.builder.io/api/v1/image/assets/TEMP/bd0d9d4d83dc41e04175af2ec4e77596361c0d68?width=88",
    },
];

const NAVIGATION_ROUTES = {
    admin: "/manager",
    owner: "/ceo",
    waiter: "/waiter",
} as const;

const MOCK_DELAY = 500;

// ============================================================================
// Main Component
// ============================================================================

export default function RolePicker({
    onRoleSelect,
    availableRoles = DEFAULT_ROLES,
}: RolePickerProps = {}) {
    const router = useRouter();
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // ========================================================================
    // Event Handlers
    // ========================================================================

    const handleRoleSelect = useCallback(
        (roleId: string) => {
            setSelectedRole(roleId);
            onRoleSelect?.(roleId);
        },
        [onRoleSelect],
    );

    const handleLogin = useCallback(async () => {
        if (!selectedRole) return;

        setIsLoading(true);

        try {
            // API Integration Point: Authenticate with selected role
            // Example:
            // const response = await fetch('YOUR_API_URL/api/auth/role', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({ roleId: selectedRole }),
            // });
            // const data = await response.json();
            //
            // if (data.success) {
            //   // Store auth token/session
            //   await AsyncStorage.setItem('authToken', data.token);
            //   await AsyncStorage.setItem('userRole', selectedRole);
            // }

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));

            // Navigate based on role
            const route =
                NAVIGATION_ROUTES[
                    selectedRole as keyof typeof NAVIGATION_ROUTES
                ] || "/";
            router.replace(route);
        } catch (error) {
            console.error("Error during role selection:", error);
            // Handle error (show Alert/Toast)
            // Alert.alert('Ошибка', 'Не удалось войти. Попробуйте снова.');
        } finally {
            setIsLoading(false);
        }
    }, [selectedRole, router]);

    // ========================================================================
    // Render Functions
    // ========================================================================

    const renderHeader = () => (
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Выберите роль</Text>
            <Text style={styles.headerSubtitle}>
                Чтобы продолжить выберите роль
            </Text>
        </View>
    );

    const renderRoleCard = (role: Role) => {
        const isSelected = selectedRole === role.id;

        return (
            <TouchableOpacity
                key={role.id}
                style={[styles.roleCard, isSelected && styles.roleCardSelected]}
                onPress={() => handleRoleSelect(role.id)}
                disabled={isLoading}
                activeOpacity={0.7}
            >
                <Image
                    source={{ uri: role.icon }}
                    style={styles.roleIcon}
                    resizeMode="cover"
                />
                <View style={styles.roleContent}>
                    <Text style={styles.roleTitle}>{role.title}</Text>
                    <Text style={styles.roleDescription}>
                        {role.description}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    const renderRoleCards = () => (
        <View style={styles.rolesContainer}>
            {availableRoles.map(renderRoleCard)}
        </View>
    );

    const renderLoginButton = () => (
        <TouchableOpacity
            style={[
                styles.loginButton,
                (!selectedRole || isLoading) && styles.loginButtonDisabled,
            ]}
            onPress={handleLogin}
            disabled={!selectedRole || isLoading}
            activeOpacity={0.8}
        >
            {isLoading ? (
                <ActivityIndicator size="small" color="#2C2D2E" />
            ) : (
                <Text style={styles.loginButtonText}>Войти</Text>
            )}
        </TouchableOpacity>
    );

    const renderHomeIndicator = () => (
        <View style={styles.homeIndicatorContainer}>
            <View style={styles.homeIndicator} />
        </View>
    );

    const renderBottomSection = () => (
        <View style={styles.bottomSection}>
            {renderLoginButton()}
            {renderHomeIndicator()}
        </View>
    );

    // ========================================================================
    // Main Render
    // ========================================================================

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
                    {renderRoleCards()}
                </ScrollView>

                {renderBottomSection()}
            </View>
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
        paddingTop: 78,
    },

    // Header
    header: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        gap: 4,
    },
    headerTitle: {
        color: "#fff",
        fontSize: 32,
        fontWeight: "600",
        letterSpacing: -0.24,
    },
    headerSubtitle: {
        color: "#797A80",
        fontSize: 16,
        fontWeight: "400",
        lineHeight: 20,
    },

    // Roles Container
    rolesContainer: {
        paddingHorizontal: 16,
        gap: 12,
    },

    // Role Card
    roleCard: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 12,
        padding: 12,
        borderRadius: 20,
        backgroundColor: "rgba(35, 35, 36, 1)",
    },
    roleCardSelected: {
        backgroundColor: "rgba(45, 45, 46, 1)",
    },
    roleIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
    },
    roleContent: {
        flex: 1,
        gap: 2,
    },
    roleTitle: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "600",
        letterSpacing: -0.24,
    },
    roleDescription: {
        color: "#797A80",
        fontSize: 14,
        fontWeight: "400",
        lineHeight: 18,
    },

    // Bottom Section
    bottomSection: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        gap: 16,
        alignItems: "center",
    },
    loginButton: {
        width: "100%",
        maxWidth: 358,
        height: 44,
        borderRadius: 20,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
    },
    loginButtonDisabled: {
        opacity: 0.5,
    },
    loginButtonText: {
        color: "#2C2D2E",
        fontSize: 16,
        fontWeight: "600",
        lineHeight: 24,
        textAlign: "center",
    },

    // Home Indicator
    homeIndicatorContainer: {
        width: "100%",
        height: 34,
        justifyContent: "center",
        alignItems: "center",
    },
    homeIndicator: {
        width: 131,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: "#fff",
    },
});
