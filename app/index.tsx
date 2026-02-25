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
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Ellipse, Path } from "react-native-svg";
import * as Location from "expo-location";

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
    // Add these to your org data from API when available
    latitude?: number;
    longitude?: number;
}

interface RolePickerProps {
    onRoleSelect?: (roleId: string) => void;
    availableRoles?: Role[];
    /** Skip geo check — set true in dev/staging builds */
    skipLocationCheck?: boolean;
    /** Allowed radius in meters (default: 200m) */
    allowedRadiusMeters?: number;
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
const DEFAULT_RADIUS_METERS = 200;

// ============================================================================
// Geo Helpers
// ============================================================================

/**
 * Haversine formula — returns distance in meters between two coords.
 */
function getDistanceMeters(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
): number {
    const R = 6371000; // Earth radius in meters
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ============================================================================
// Main Component
// ============================================================================

export default function RolePicker({
    onRoleSelect,
    availableRoles = DEFAULT_ROLES,
    skipLocationCheck = true, // ← set true in dev builds via app config
    allowedRadiusMeters = DEFAULT_RADIUS_METERS,
}: RolePickerProps = {}) {
    const router = useRouter();
    const { token, fetchOrganizations, selectedLocation, setSelectedLocation } =
        useAuth();

    const [screen, setScreen] = useState<"enter" | "rolePicker">(
        token ? "rolePicker" : "enter",
    );

    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingOrgs, setIsFetchingOrgs] = useState(false);
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    console.log("organizations", organizations);

    // Geo state
    const [isCheckingLocation, setIsCheckingLocation] = useState(false);
    const [locationError, setLocationError] = useState<string | null>(null);

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
                setLocationError(null);
            }
        };
        loadOrganizations();
    }, [selectedRole]);

    // ========================================================================
    // Computed
    // ========================================================================

    const LOCATIONS = useMemo(() => {
        if (!organizations?.length) return [];
        return organizations
            .filter((org) => org.is_active)
            .map((org) => ({ label: org.name, value: org.id, org }));
    }, [organizations]);

    const needsLocationSelection = selectedRole === "waiter";
    const canProceed =
        selectedRole && (!needsLocationSelection || selectedLocation);

    const getLocationLabel = (value: string | number) => {
        if (!value) return "Выбрать локацию...";
        const item = LOCATIONS.find((l) => l.value === value);
        return item ? item.label : "Выбрать локацию...";
    };

    // ========================================================================
    // Geo Verification
    // ========================================================================

    /**
     * Requests device location and checks if user is within allowed radius
     * of the selected organization. Returns true if check passes.
     */
    const verifyUserLocation = useCallback(async (): Promise<boolean> => {
        // Dev bypass
        if (skipLocationCheck) {
            console.log("[GeoCheck] Skipped (skipLocationCheck=true)");
            return true;
        }

        const selectedOrg = LOCATIONS.find(
            (l) => l.value === selectedLocation,
        )?.org;

        // If the org has no coords stored yet — allow entry and warn in console
        if (!selectedOrg?.latitude || !selectedOrg?.longitude) {
            console.warn(
                "[GeoCheck] Organization has no coordinates — skipping check",
            );
            return true;
        }

        setIsCheckingLocation(true);
        setLocationError(null);

        try {
            // Request permission
            const { status } =
                await Location.requestForegroundPermissionsAsync();
            console.log("[GeoCheck] Location permission status:", status);
            if (status !== "granted") {
                setLocationError(
                    "Нет доступа к геолокации. Разрешите доступ в настройках.",
                );
                return false;
            }

            // Get current position (high accuracy, 10s timeout)
            const position = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

            const distance = getDistanceMeters(
                position.coords.latitude,
                position.coords.longitude,
                selectedOrg.latitude,
                selectedOrg.longitude,
            );

            console.log(
                `[GeoCheck] Distance to org: ${Math.round(distance)}m (limit: ${allowedRadiusMeters}m)`,
            );

            if (distance > allowedRadiusMeters) {
                const distanceText =
                    distance >= 1000
                        ? `${(distance / 1000).toFixed(1)} км`
                        : `${Math.round(distance)} м`;

                setLocationError(
                    `Вы находитесь слишком далеко от заведения (${distanceText}). Войти можно только на месте работы.`,
                );
                return false;
            }

            return true;
        } catch (err) {
            console.error("[GeoCheck] Error:", err);
            setLocationError(
                "Не удалось определить местоположение. Попробуйте снова.",
            );
            return false;
        } finally {
            setIsCheckingLocation(false);
        }
    }, [skipLocationCheck, selectedLocation, LOCATIONS, allowedRadiusMeters]);

    // ========================================================================
    // Event Handlers
    // ========================================================================

    const handleRoleSelect = useCallback(
        (roleId: string) => {
            setSelectedRole(roleId);
            setLocationError(null);
            if (roleId !== "waiter") setSelectedLocation("");
            onRoleSelect?.(roleId);
        },
        [onRoleSelect],
    );

    const handleLocationSelect = useCallback((locationId: number) => {
        setSelectedLocation(locationId);
        setLocationError(null);
        setShowLocationModal(false);
    }, []);

    const handleLogin = useCallback(async () => {
        if (!selectedRole) return;
        if (needsLocationSelection && !selectedLocation) return;

        // Run geo check for waiters
        console.log("here1");
        if (needsLocationSelection) {
            console.log("here");
            const locationOk = await verifyUserLocation();
            console.log("locationOk", locationOk);
            if (!locationOk) return; // Error already set in state — shown in UI
        }

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
    }, [
        selectedRole,
        selectedLocation,
        needsLocationSelection,
        verifyUserLocation,
        router,
    ]);

    // ========================================================================
    // Enter Screen
    // ========================================================================

    if (screen === "enter") {
        return (
            <View style={enterStyles.container}>
                <StatusBar barStyle="light-content" backgroundColor="#19191A" />

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

                <View style={enterStyles.logoContainer}>
                    <Svg width={44} height={44} viewBox="0 0 44 44" fill="none">
                        <Path
                            d="M44 14.668V29.332H29.3347V44H14.6653C14.6653 35.8982 8.09846 29.332 0 29.332V14.668H14.6653V0H29.3347C29.3347 8.10175 35.9015 14.668 44 14.668Z"
                            fill="white"
                        />
                    </Svg>
                </View>

                <View style={enterStyles.bottomContent}>
                    <Text style={enterStyles.title}>
                        Эффективность на каждом уровне.
                    </Text>
                    <TouchableOpacity
                        style={enterStyles.button}
                        onPress={() => router.push("/auth")}
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
            {/* Dev mode indicator */}
            {skipLocationCheck && (
                <View style={styles.devBadge}>
                    <Text style={styles.devBadgeText}>
                        🛠 Геопроверка отключена (DEV)
                    </Text>
                </View>
            )}
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

                {/* Geo error message */}
                {locationError && (
                    <View style={styles.locationErrorContainer}>
                        <Ionicons
                            name="location-outline"
                            size={16}
                            color="#FF6B6B"
                        />
                        <Text style={styles.locationErrorText}>
                            {locationError}
                        </Text>
                    </View>
                )}
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
                        keyExtractor={(item) => String(item.value)}
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

    const renderLoginButton = () => {
        const busy = isLoading || isCheckingLocation;
        console.log("isCheckingLocation", isCheckingLocation);
        const buttonLabel = isCheckingLocation
            ? "Проверка локации..."
            : "Войти";
        return (
            <TouchableOpacity
                style={[
                    styles.loginButton,
                    (!canProceed || busy || isFetchingOrgs) &&
                        styles.loginButtonDisabled,
                ]}
                onPress={handleLogin}
                disabled={!canProceed || busy || isFetchingOrgs}
                activeOpacity={0.8}
            >
                {busy ? (
                    <Loading />
                ) : (
                    <Text style={styles.loginButtonText}>{buttonLabel}</Text>
                )}
            </TouchableOpacity>
        );
    };

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
    container: { flex: 1 },
    mainContainer: { flex: 1, justifyContent: "space-between" },
    scrollView: { flex: 1 },
    scrollContent: { paddingTop: 16 },
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
    devBadge: {
        marginTop: 8,
        alignSelf: "flex-start",
        backgroundColor: "rgba(255, 200, 0, 0.15)",
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: "rgba(255, 200, 0, 0.3)",
    },
    devBadgeText: {
        color: "#FFC800",
        fontSize: 12,
        fontWeight: "500",
    },
    rolesContainer: { paddingHorizontal: 16, gap: 12 },
    roleCard: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        padding: 12,
        borderRadius: 20,
        backgroundColor: "rgba(35, 35, 36, 1)",
    },
    roleCardSelected: { backgroundColor: "rgba(45, 45, 46, 1)" },
    roleContent: { flex: 1, gap: 2 },
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
    locationPickerPlaceholder: { color: "#797A80" },
    loadingContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        flex: 1,
    },
    locationErrorContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 8,
        backgroundColor: "rgba(255, 107, 107, 0.1)",
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: "rgba(255, 107, 107, 0.2)",
    },
    locationErrorText: {
        flex: 1,
        color: "#FF6B6B",
        fontSize: 14,
        lineHeight: 20,
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
    modalItemSelected: { backgroundColor: "rgba(60, 130, 253, 0.1)" },
    modalItemText: {
        color: "#FFFFFF",
        fontSize: 16,
        lineHeight: 20,
        flex: 1,
    },
    modalItemTextSelected: { color: "#FFFFFF", fontWeight: "600" },
    emptyContainer: { padding: 40, alignItems: "center" },
    emptyText: { color: "#797A80", fontSize: 16 },
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
    loginButtonDisabled: { opacity: 0.5 },
    loginButtonText: {
        color: "#2C2D2E",
        fontSize: 16,
        fontWeight: "600",
        lineHeight: 24,
        textAlign: "center",
    },
});
