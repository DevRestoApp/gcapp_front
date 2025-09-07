import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
} from "react";

import { storage } from "../server/storage";

type User = {
    id: string;
    email: string;
    role: string;
};

type AuthContextType = {
    user: User | null;
    token: string | null;
    login: (user: User, token: string) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            const savedToken = await storage.getItem("access_token");
            const savedUser = await storage.getItem("user");
            if (savedToken && savedUser && savedUser !== "undefined") {
                setToken(savedToken);
                setUser(JSON.parse(savedUser));
            }
        };
        load();
    }, []);

    const login = async (user: User, token: string) => {
        setUser(user);
        setToken(token);
        console.log("this used");
        await storage.setItem("access_token", token);
        console.log(user);
        await storage.setItem("user", JSON.stringify(user));
    };

    const logout = async () => {
        setUser(null);
        setToken(null);
        await storage.removeItem("access_token");
        await storage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
};
