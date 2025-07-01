'use client';

import React, { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "./authProvider";

interface ProtectedRouteProps {
    children: ReactNode;
    requiredRole?: string[];
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading, user } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;

        if (!isAuthenticated) {
            router.push("/login");
            return;
        }

        if (requiredRole && requiredRole.length > 0) {
            if (!user?.role || !requiredRole.includes(user.role)) {
                router.push("/unauthorized");
                return;
            }
        }
    }, [isLoading, isAuthenticated, user, requiredRole, router]);

    // Early returns untuk kondisi yang tidak memenuhi
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="text-gray-600">Authenticating...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    if (requiredRole && requiredRole.length > 0) {
        if (!user?.role || !requiredRole.includes(user.role)) {
            return null;
        }
    }

    return <>{children}</>;
}

// Hook alternatif untuk penggunaan yang lebih fleksibel
export function useProtectedRoute(requiredRole?: string[]) {
    const { isAuthenticated, isLoading, user } = useAuthContext();
    const router = useRouter();

    const canAccess = React.useMemo(() => {
        if (isLoading) return false;
        if (!isAuthenticated) return false;

        if (requiredRole && requiredRole.length > 0) {
            return Boolean(user?.role && requiredRole.includes(user.role));
        }

        return true;
    }, [isAuthenticated, isLoading, user, requiredRole]);

    useEffect(() => {
        if (isLoading) return;

        if (!isAuthenticated) {
            router.push("/login");
            return;
        }

        if (requiredRole && requiredRole.length > 0) {
            if (!user?.role || !requiredRole.includes(user.role)) {
                router.push("/unauthorized");
                return;
            }
        }
    }, [isLoading, isAuthenticated, user, requiredRole, router]);

    return { canAccess, isLoading, user };
}