import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
    useCallback,
} from "react";

import { storage } from "../server/storage";
import { getOrganizationsData } from "@/src/server/general/organizations";

type User = {
    id: number;
    email: string;
    role: string;
    organization_id: number;
};

type AuthContextType = {
    user: User | null;
    token: string | null | undefined; // undefined = ещё загружается
    login: (user: User, token: string) => Promise<void>;
    logout: () => Promise<void>;
    locations: any[];
    selectedLocation: number | null;
    setSelectedLocation: (organization_id: number) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

const fetchOrganizations = async (): Promise<any> => {
    try {
        const response = await getOrganizationsData();
        return response.organizations;
    } catch (e) {
        console.log(e);
        return null;
    }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null | undefined>(undefined);
    const [locations, setLocations] = useState<any[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<number | null>(
        null,
    );

    const fetchAll = useCallback(async () => {
        try {
            const organizations = await fetchOrganizations();

            setLocations(organizations);
        } catch (err: any) {
            console.error("❌ Error fetching Manager data:", err);
        }
    }, []);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    useEffect(() => {
        const load = async () => {
            const savedToken = await storage.getItem("access_token");
            const savedUser = await storage.getItem("user");

            setToken(savedToken ?? null); // undefined → null
            if (savedUser && savedUser !== "undefined") {
                setUser(JSON.parse(savedUser));
            }
        };
        load();
    }, []);

    const login = async (user: User, token: string) => {
        setUser(user);
        setToken(token);
        await storage.setItem("access_token", token);
        await storage.setItem("user", JSON.stringify(user));
    };

    const logout = async () => {
        setUser(null);
        setToken(null);
        await storage.removeItem("access_token");
        await storage.removeItem("user");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                logout,
                locations,
                setSelectedLocation,
                selectedLocation,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
};
