"use client";
import { cn } from "@/lib/utils";
import { SidebarAdminInternal } from "./sidebarAdmin";
import { useState } from "react";
import { ProtectedRoute } from "./authenticated";
import { AuthProvider } from "./authProvider";

export function AdminLayout({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <AuthProvider>
      <ProtectedRoute requiredRole={["admin", "superadmin"]}>
        <div className="flex w-full min-h-screen">
          <SidebarAdminInternal
            className={className}
            onCollapseChange={setIsSidebarCollapsed}
          />
          <div
            className={cn(
              "flex-1 transition-all duration-300 min-h-screen",
              "pl-0 md:pl-64",
              isSidebarCollapsed && "md:pl-16"
            )}
          >
            <div className="p-10">{children}</div>
          </div>
        </div>
      </ProtectedRoute>
    </AuthProvider>
  );
}
