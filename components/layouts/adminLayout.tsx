"use client";
import { cn } from "@/lib/utils";
import { SidebarAdminInternal } from "./sidebarAdmin";
import { useState } from "react";

export function AdminLayout({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
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
        <div className="p-4 pt-16 md:pt-4">{children}</div>
      </div>
    </div>
  );
}
