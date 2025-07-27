"use client"
import { Navbar } from "@/components/custom/navbar";
import { AuthProvider } from "@/components/layouts/authProvider";
import { ReactNode } from "react";

export default function Page({ children }: { children: ReactNode }) {
    return (
        <AuthProvider>
            <Navbar />
                {children}
        </AuthProvider>
    )
}