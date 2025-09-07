import { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";

// ADD ur providers here
export function AppProviders({ children }: { children: ReactNode }) {
    return <AuthProvider>{children}</AuthProvider>;
}
