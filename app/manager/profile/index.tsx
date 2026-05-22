import React, { useCallback } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";
import { useAuth } from "@/src/contexts/AuthContext";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type MenuItemType = "changePassword";

const MENU_ITEMS = [
    {
        id: "changePassword" as MenuItemType,
        icon: <MaterialIcons name="password" size={24} color="white" />,
        label: "Сменить пароль",
    },
] as const;

export default function ProfileScreen() {
    const router = useRouter();
    const { logout, user, setSelectedLocation } = useAuth();

    const handleMenuItemPress = useCallback((item: MenuItemType) => {
        switch (item) {
            case "changePassword":
                router.push("/manager/profile/changePassword");
                break;
        }
    }, []);

    const handleLogout = useCallback(async () => {
        await logout();
        router.replace("/auth");
    }, [router]);

    const handleChangeRole = useCallback(() => {
        setSelectedLocation(null);
        router.replace("/");
    }, [router]);

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
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Профиль</Text>
                    </View>

                    {/* Profile Info */}
                    <View style={styles.profileSection}>
                        <View style={styles.avatarContainer}>
                            <View style={styles.avatarBorder} />
                        </View>
                        <View style={styles.nameSection}>
                            <Text style={styles.name}>{user?.email ?? ""}</Text>
                            <Text style={styles.role}>Админ</Text>
                        </View>
                    </View>

                    {/* Menu Items */}
                    <View style={styles.menuSection}>
                        {MENU_ITEMS.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.menuItem}
                                onPress={() => handleMenuItemPress(item.id)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.menuItemLeft}>
                                    <View style={styles.menuIcon}>
                                        {item.icon}
                                    </View>
                                    <Text style={styles.menuItemText}>
                                        {item.label}
                                    </Text>
                                </View>
                                <Text style={styles.chevron}>›</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>

                {/* Bottom Buttons */}
                <View style={styles.bottomSection}>
                    <TouchableOpacity
                        style={styles.changeRoleButton}
                        onPress={handleChangeRole}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.changeRoleButtonText}>
                            Сменить роль
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={handleLogout}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.logoutButtonText}>Выйти</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

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
    bottomSection: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        gap: 12,
    },
    changeRoleButton: {
        height: 44,
        borderRadius: 20,
        backgroundColor: "rgba(35, 35, 36, 1)",
        justifyContent: "center",
        alignItems: "center",
    },
    changeRoleButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        lineHeight: 24,
    },
    logoutButton: {
        height: 44,
        borderRadius: 20,
        backgroundColor: "rgba(255, 59, 48, 0.15)",
        justifyContent: "center",
        alignItems: "center",
    },
    logoutButtonText: {
        color: "#FF3B30",
        fontSize: 16,
        fontWeight: "600",
        lineHeight: 24,
    },
});
