import React, {
    useState,
    useCallback,
    useMemo,
    useEffect,
    useRef,
} from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    StatusBar,
    Modal,
    FlatList,
    Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Ellipse, Path } from "react-native-svg";

import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";
import Loading from "@/src/client/components/Loading";
import { useAuth } from "@/src/contexts/AuthContext";
import { AdminIcon, WaiterIcon, CEOIcon } from "@/src/client/icons/icons";
import { BlurView } from "expo-blur";

// ============================================================================
// Types
// ============================================================================

interface Role {
    id: string;
    title: string;
    description?: string;
    IconComponent: React.ComponentType;
}

interface Organization {
    name: string;
    code: string;
    id: number;
    is_active: boolean;
}

interface RolePickerProps {
    onRoleSelect?: (roleId: string) => void;
    availableRoles?: Role[];
    locations?: Organization[];
}

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_ROLES: Role[] = [
    { id: "admin", title: "Админ", IconComponent: AdminIcon },
    { id: "owner", title: "Владелец", IconComponent: CEOIcon },
    { id: "waiter", title: "Официант", IconComponent: WaiterIcon },
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
    const { fetchOrganizations, selectedLocation, setSelectedLocation } =
        useAuth();

    // Controls which screen is shown: "enter" or "rolePicker"
    const [screen, setScreen] = useState<"enter" | "rolePicker">("enter");

    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingOrgs, setIsFetchingOrgs] = useState(false);
    const [organizations, setOrganizations] = useState<Organization[]>([]);

    const hasFetchedOrgs = useRef(false);

    // ========================================================================
    // Effects
    // ========================================================================

    useEffect(() => {
        const loadOrganizations = async () => {
            if (selectedRole === "waiter" && !hasFetchedOrgs.current) {
                setIsFetchingOrgs(true);
                hasFetchedOrgs.current = true;
                try {
                    const orgs = await fetchOrganizations();
                    setOrganizations(orgs || []);
                } catch (error) {
                    console.error("Error fetching organizations:", error);
                    setOrganizations([]);
                    hasFetchedOrgs.current = false;
                } finally {
                    setIsFetchingOrgs(false);
                }
            } else if (selectedRole !== "waiter") {
                setOrganizations([]);
                hasFetchedOrgs.current = false;
            }
        };

        loadOrganizations();
    }, [selectedRole]);

    // ========================================================================
    // Computed Values
    // ========================================================================

    const LOCATIONS = useMemo(() => {
        if (organizations && organizations.length > 0) {
            return organizations
                .filter((org) => org.is_active)
                .map((org) => ({
                    label: org.name,
                    value: org.id,
                }));
        }
        return [];
    }, [organizations]);

    const needsLocationSelection = selectedRole === "waiter";
    const canProceed =
        selectedRole && (!needsLocationSelection || selectedLocation);

    // ========================================================================
    // Helper Functions
    // ========================================================================

    const getLocationLabel = (value: string) => {
        if (!value) return "Выбрать локацию...";
        const item = LOCATIONS.find((l) => l.value === value);
        return item ? item.label : "Выбрать локацию...";
    };

    // ========================================================================
    // Event Handlers
    // ========================================================================

    const handleRoleSelect = useCallback(
        (roleId: string) => {
            setSelectedRole(roleId);
            if (roleId !== "waiter") {
                setSelectedLocation("");
            }
            onRoleSelect?.(roleId);
        },
        [onRoleSelect],
    );

    const handleLocationSelect = useCallback((locationId: number) => {
        setSelectedLocation(locationId);
        setShowLocationModal(false);
    }, []);

    const handleLogin = useCallback(async () => {
        if (!selectedRole) return;
        if (needsLocationSelection && !selectedLocation) return;

        setIsLoading(true);

        try {
            await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));

            const route =
                NAVIGATION_ROUTES[
                    selectedRole as keyof typeof NAVIGATION_ROUTES
                ] || "/";

            router.replace(route);
        } catch (error) {
            console.error("Error during role selection:", error);
        } finally {
            setIsLoading(false);
        }
    }, [selectedRole, selectedLocation, needsLocationSelection, router]);

    // ========================================================================
    // Enter Screen
    // ========================================================================

    if (screen === "enter") {
        return (
            <View style={enterStyles.container}>
                <StatusBar barStyle="light-content" backgroundColor="#19191A" />

                {/* Gradient background blobs */}
                <View style={enterStyles.blobContainer} pointerEvents="none">
                    <Svg width={735} height={959} viewBox="0 0 735 959">
                        <Ellipse
                            cx="176"
                            cy="652"
                            rx="176"
                            ry="226"
                            fill="#05334A"
                        />
                        <Ellipse
                            cx="238"
                            cy="259"
                            rx="176"
                            ry="226"
                            fill="#2A244A"
                        />
                        <Ellipse
                            cx="505"
                            cy="269"
                            rx="176"
                            ry="269"
                            fill="#740925"
                        />
                        <Ellipse
                            cx="505"
                            cy="733.5"
                            rx="230"
                            ry="225.5"
                            fill="#030E4E"
                        />
                    </Svg>
                    <BlurView
                        style={StyleSheet.absoluteFill}
                        intensity={90}
                        tint="dark"
                    />
                </View>

                {/* Logo */}
                <View style={enterStyles.logoContainer}>
                    <Svg width={44} height={44} viewBox="0 0 44 44" fill="none">
                        <Path
                            d="M44 14.668V29.332H29.3347V44H14.6653C14.6653 35.8982 8.09846 29.332 0 29.332V14.668H14.6653V0H29.3347C29.3347 8.10175 35.9015 14.668 44 14.668Z"
                            fill="white"
                        />
                    </Svg>
                </View>

                {/* Bottom content */}
                <View style={enterStyles.bottomContent}>
                    <Text style={enterStyles.title}>
                        Эффективность на каждом уровне.
                    </Text>
                    <TouchableOpacity
                        style={enterStyles.button}
                        onPress={() => setScreen("rolePicker")}
                        activeOpacity={0.8}
                    >
                        <Text style={enterStyles.buttonText}>Войти</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    // ========================================================================
    // RolePicker Screen
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
        const { IconComponent } = role;

        return (
            <TouchableOpacity
                key={role.id}
                style={[styles.roleCard, isSelected && styles.roleCardSelected]}
                onPress={() => handleRoleSelect(role.id)}
                disabled={isLoading}
                activeOpacity={0.7}
            >
                <IconComponent />
                <View style={styles.roleContent}>
                    <Text style={styles.roleTitle}>{role.title}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    const renderRoleCards = () => (
        <View style={styles.rolesContainer}>
            {availableRoles.map(renderRoleCard)}
        </View>
    );

    const renderLocationPicker = () => {
        if (!needsLocationSelection) return null;

        return (
            <View style={styles.locationPickerContainer}>
                <Text style={styles.locationPickerLabel}>Выберите локацию</Text>
                <TouchableOpacity
                    style={styles.locationPickerButton}
                    onPress={() => setShowLocationModal(true)}
                    disabled={isLoading || isFetchingOrgs}
                >
                    {isFetchingOrgs ? (
                        <View style={styles.loadingContainer}>
                            <Loading />
                            <Text style={styles.locationPickerText}>
                                Загрузка локаций...
                            </Text>
                        </View>
                    ) : (
                        <>
                            <Text
                                style={[
                                    styles.locationPickerText,
                                    !selectedLocation &&
                                        styles.locationPickerPlaceholder,
                                ]}
                                numberOfLines={1}
                            >
                                {getLocationLabel(selectedLocation)}
                            </Text>
                            <Ionicons
                                name="chevron-down"
                                size={20}
                                color="#FFFFFF"
                            />
                        </>
                    )}
                </TouchableOpacity>
            </View>
        );
    };

    const renderLocationModal = () => (
        <Modal
            visible={showLocationModal}
            transparent
            animationType="fade"
            onRequestClose={() => setShowLocationModal(false)}
        >
            <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={() => setShowLocationModal(false)}
            >
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Выберите локацию</Text>
                    </View>
                    <FlatList
                        data={LOCATIONS}
                        keyExtractor={(item) => item.value}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.modalItem,
                                    item.value === selectedLocation &&
                                        styles.modalItemSelected,
                                ]}
                                onPress={() => handleLocationSelect(item.value)}
                            >
                                <Text
                                    style={[
                                        styles.modalItemText,
                                        item.value === selectedLocation &&
                                            styles.modalItemTextSelected,
                                    ]}
                                >
                                    {item.label}
                                </Text>
                                {item.value === selectedLocation && (
                                    <Ionicons
                                        name="checkmark"
                                        size={20}
                                        color="#FFFFFF"
                                    />
                                )}
                            </TouchableOpacity>
                        )}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>
                                    Нет доступных локаций
                                </Text>
                            </View>
                        }
                    />
                </View>
            </TouchableOpacity>
        </Modal>
    );

    const renderLoginButton = () => (
        <TouchableOpacity
            style={[
                styles.loginButton,
                (!canProceed || isLoading || isFetchingOrgs) &&
                    styles.loginButtonDisabled,
            ]}
            onPress={handleLogin}
            disabled={!canProceed || isLoading || isFetchingOrgs}
            activeOpacity={0.8}
        >
            {isLoading ? (
                <Loading />
            ) : (
                <Text style={styles.loginButtonText}>Войти</Text>
            )}
        </TouchableOpacity>
    );

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
                    {renderLocationPicker()}
                </ScrollView>

                <View style={styles.bottomSection}>{renderLoginButton()}</View>
            </View>

            {renderLocationModal()}
        </SafeAreaView>
    );
}

// ============================================================================
// Enter Screen Styles
// ============================================================================

const enterStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#19191A",
        alignItems: "center",
        justifyContent: "space-between",
        overflow: "hidden",
    },
    blobContainer: {
        position: "absolute",
        top: -57,
        left: -173,
        width: 735,
        height: 959,
    },
    logoContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: 112,
        zIndex: 10,
    },
    bottomContent: {
        width: "100%",
        alignItems: "center",
        gap: 16,
        paddingHorizontal: 16,
        paddingBottom: 40,
        zIndex: 10,
    },
    title: {
        color: "#FFFFFF",
        textAlign: "center",
        fontSize: 28,
        fontWeight: "800",
        lineHeight: 36,
        maxWidth: 358,
        width: "100%",
    },
    button: {
        width: "100%",
        maxWidth: 358,
        height: 44,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
        lineHeight: 24,
    },
});

// ============================================================================
// RolePicker Styles
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
        paddingTop: 16,
    },
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
    rolesContainer: {
        paddingHorizontal: 16,
        gap: 12,
    },
    roleCard: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        padding: 12,
        borderRadius: 20,
        backgroundColor: "rgba(35, 35, 36, 1)",
    },
    roleCardSelected: {
        backgroundColor: "rgba(45, 45, 46, 1)",
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
    locationPickerContainer: {
        paddingHorizontal: 16,
        paddingTop: 24,
        gap: 12,
    },
    locationPickerLabel: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
        letterSpacing: -0.24,
    },
    locationPickerButton: {
        flexDirection: "row",
        paddingHorizontal: 16,
        paddingVertical: 14,
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
        borderRadius: 20,
        backgroundColor: "rgba(35, 35, 36, 1)",
    },
    locationPickerText: {
        flex: 1,
        color: "#FFFFFF",
        fontSize: 16,
        lineHeight: 20,
    },
    locationPickerPlaceholder: {
        color: "#797A80",
    },
    loadingContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        flex: 1,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "#1C1C1E",
        borderRadius: 20,
        width: "85%",
        maxHeight: "60%",
        overflow: "hidden",
    },
    modalHeader: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#2C2C2E",
    },
    modalTitle: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
    },
    modalItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#2C2C2E",
    },
    modalItemSelected: {
        backgroundColor: "rgba(60, 130, 253, 0.1)",
    },
    modalItemText: {
        color: "#FFFFFF",
        fontSize: 16,
        lineHeight: 20,
        flex: 1,
    },
    modalItemTextSelected: {
        color: "#FFFFFF",
        fontWeight: "600",
    },
    emptyContainer: {
        padding: 40,
        alignItems: "center",
    },
    emptyText: {
        color: "#797A80",
        fontSize: 16,
    },
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
});
