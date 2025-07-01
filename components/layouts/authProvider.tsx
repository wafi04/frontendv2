'use client';

import React, { createContext, useContext, ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { UserData } from "@/types/auth";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface AuthContextType {
    user: UserData | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    error: Error | null;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const queryClient = useQueryClient();

    const { data, isLoading, error } = useAuth();

    const logout = async () => {
        try {
            // Clear user data from query cache
            await queryClient.removeQueries({ queryKey: ["user"] });

            // Redirect to login page
            window.location.href === "/login";
        } catch (err) {
            toast.error("failed to logout")
        }
    };

    const contextValue: AuthContextType = {
        user: data?.data || null,
        isLoading,
        isAuthenticated: !!data?.data && data?.status,
        error,
        logout,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuthContext must be used within AuthProvider");
    }
    return context;
}