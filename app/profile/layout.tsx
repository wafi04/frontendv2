"use client"
import { Navbar } from "@/components/custom/navbar";
import { ProtectedRoute } from "@/components/layouts/authenticated";
import { AuthProvider } from "@/components/layouts/authProvider";
import { ReactNode } from "react";

export default function Page({ children }: { children: ReactNode }) {
    return (
        <AuthProvider>
            <Navbar />
            <ProtectedRoute requiredRole={["member", "platinum", "admin", "superadmin"]}>
                {children}
            </ProtectedRoute >
        </AuthProvider>
    )
}