import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    StatusBar,
    ActivityIndicator,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { login as loginRequest } from "@/src/server/auth";
import { useAuth } from "@/src/contexts/AuthContext";
import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";

// ============================================================================
// Types
// ============================================================================

interface LoginFormData {
    nickname: string;
    email: string;
    password: string;
}

// ============================================================================
// Constants
// ============================================================================

const INITIAL_FORM_DATA: LoginFormData = {
    nickname: "",
    email: "",
    password: "",
};

// ============================================================================
// Main Component
// ============================================================================

export default function Login() {
    console.log("Login screen rendered");
    const router = useRouter();
    const { login, token } = useAuth();

    const [formData, setFormData] = useState<LoginFormData>(INITIAL_FORM_DATA);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessages] = useState("");

    // ========================================================================
    // Effects
    // ========================================================================

    useEffect(() => {
        console.log("Login screen mounted token: ", token);
        if (token) {
            console.log("tok", token);
            console.log(
                "User is already logged in, redirecting to home screen",
            );
            router.replace("/");
        }
    }, [token, router]);

    // ========================================================================
    // Form Handlers
    // ========================================================================

    const updateFormField = useCallback(
        (field: keyof LoginFormData, value: string) => {
            setFormData((prev) => ({ ...prev, [field]: value }));
        },
        [],
    );

    const togglePasswordVisibility = useCallback(() => {
        setShowPassword((prev) => !prev);
    }, []);

    const validateForm = useCallback((): boolean => {
        if (!formData.email || !formData.password) {
            Alert.alert("Ошибка", "Введите логин и пароль");
            return false;
        }
        return true;
    }, [formData]);

    const handleLogin = useCallback(async () => {
        if (!validateForm()) return;

        try {
            setLoading(true);
            const response = await loginRequest({
                login: formData.email,
                password: formData.password,
            });

            if (response.success) {
                const userObj = {
                    id: response.user_id,
                    email: formData.email,
                    role: response.role,
                };
                console.log("LOGIN REQUEST");

                await login(userObj, response.access_token);
                console.log("LOGIN REQUEST");

                router.replace("/");
            } else {
                Alert.alert("Ошибка", "Неверные данные");
            }
        } catch (err) {
            Alert.alert("Ошибка входа", "Проверьте данные и попробуйте снова");

            setError(true);
            setErrorMessages(JSON.stringify(err.stack));
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [formData, validateForm, login, router]);

    const handleForgotPassword = useCallback(() => {
        // Navigate to forgot password screen
        console.log("Navigate to forgot password");
        // router.push("/forgot-password");
    }, []);

    // ========================================================================
    // Render Functions
    // ========================================================================

    const renderHeader = () => (
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Войти</Text>
            <Text style={styles.headerSubtitle}>
                Введите данные чтобы войти
            </Text>
        </View>
    );

    const renderInputField = (
        label: string,
        value: string,
        onChangeText: (text: string) => void,
        options?: {
            secureTextEntry?: boolean;
            keyboardType?: "default" | "email-address";
            autoCapitalize?: "none" | "sentences" | "words" | "characters";
            rightElement?: React.ReactNode;
        },
    ) => (
        <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{label}</Text>
            <View style={styles.inputWrapper}>
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    style={styles.input}
                    placeholderTextColor="#797A80"
                    secureTextEntry={options?.secureTextEntry}
                    keyboardType={options?.keyboardType || "default"}
                    autoCapitalize={options?.autoCapitalize || "none"}
                />
                {options?.rightElement}
            </View>
        </View>
    );

    const renderPasswordToggle = () => (
        <TouchableOpacity
            style={styles.passwordToggle}
            onPress={togglePasswordVisibility}
            activeOpacity={0.7}
        >
            <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#fff"
            />
        </TouchableOpacity>
    );

    const renderForm = () => (
        <View style={styles.formContainer}>
            {renderInputField(
                "Логин",
                formData.email,
                (text) => updateFormField("email", text),
                {
                    keyboardType: "email-address",
                    autoCapitalize: "none",
                },
            )}

            {renderInputField(
                "Пароль",
                formData.password,
                (text) => updateFormField("password", text),
                {
                    secureTextEntry: !showPassword,
                    rightElement: renderPasswordToggle(),
                },
            )}

            <TouchableOpacity
                style={styles.forgotPasswordButton}
                onPress={handleForgotPassword}
                activeOpacity={0.7}
            >
                <Text style={styles.forgotPasswordText}>Забыли пароль?</Text>
            </TouchableOpacity>
        </View>
    );

    const renderLoginButton = () => (
        <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator size="small" color="#2C2D2E" />
            ) : (
                <Text style={styles.loginButtonText}>Войти</Text>
            )}
        </TouchableOpacity>
    );

    const renderErrorMessage = () => (
        <View>
            <Text style={{ color: "red" }}>{errorMessage}</Text>
        </View>
    );

    const renderBottomSection = () => (
        <View style={styles.bottomSection}>{renderLoginButton()}</View>
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
                    keyboardShouldPersistTaps="handled"
                >
                    {renderHeader()}
                    {renderForm()}
                    {error && renderErrorMessage()}
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
        paddingTop: 24,
    },

    // Header
    header: {
        paddingHorizontal: 16,
        paddingBottom: 24,
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

    // Form
    formContainer: {
        paddingHorizontal: 16,
        gap: 16,
    },
    inputContainer: {
        gap: 8,
    },
    inputLabel: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "400",
        lineHeight: 18,
        letterSpacing: -0.15,
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        height: 44,
        paddingHorizontal: 12,
        borderRadius: 10,
        backgroundColor: "rgba(35, 35, 36, 1)",
    },
    input: {
        flex: 1,
        color: "#fff",
        fontSize: 16,
        fontWeight: "400",
        lineHeight: 20,
        letterSpacing: -0.32,
    },
    passwordToggle: {
        width: 44,
        height: 44,
        justifyContent: "center",
        alignItems: "center",
        marginRight: -12,
    },
    forgotPasswordButton: {
        alignSelf: "flex-end",
    },
    forgotPasswordText: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "400",
        lineHeight: 16,
        letterSpacing: -0.08,
        textAlign: "right",
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
