"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Package,
  ChevronDown,
  ChevronRight,
  Menu,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { dataNavAdmin } from "@/data/navbarAdmin";

export interface NavItem {
  nama: string;
  path?: string;
  icon?: React.ReactNode;
  children?: NavItem[];
}

interface SidebarNavProps {
  items: NavItem[];
  isCollapsed?: boolean;
}

function SidebarNav({ items, isCollapsed = false }: SidebarNavProps) {
  const pathname = usePathname();
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (itemName: string) => {
    setOpenItems((prev) =>
      prev.includes(itemName)
        ? prev.filter((name) => name !== itemName)
        : [...prev, itemName]
    );
  };

  const isActive = (path?: string) => {
    if (!path) return false;
    return pathname === path; // hanya cocok jika persis sama
  };
  const hasActiveChild = (children?: NavItem[]) => {
    if (!children) return false;
    return children.some((child) => isActive(child.path));
  };

  return (
    <div className="space-y-2 mt-2">
      {items.map((item) => {
        const isItemActive = isActive(item.path);
        const hasActiveChildren = hasActiveChild(item.children);
        const isOpen = openItems.includes(item.nama) || hasActiveChildren;

        if (item.children) {
          return (
            <Collapsible
              key={item.nama}
              open={isOpen}
              onOpenChange={() => toggleItem(item.nama)}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant={hasActiveChildren ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-between font-normal",
                    hasActiveChildren && "bg-secondary"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    {!isCollapsed && <span>{item.nama}</span>}
                  </div>
                  {!isCollapsed && (
                    <div className="ml-auto">
                      {isOpen ? (
                        <ChevronDown className="size-4" />
                      ) : (
                        <ChevronRight className="size-4" />
                      )}
                    </div>
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 mt-2 gap-2">
                {item.children.map((child) => (
                  <Link key={child.nama} href={child.path || "#"}>
                    <Button
                      variant={isActive(child.path) ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start font-normal pl-12 ",
                        isActive(child.path) && "bg-secondary font-medium"
                      )}
                    >
                      {child.nama}
                    </Button>
                  </Link>
                ))}
              </CollapsibleContent>
            </Collapsible>
          );
        }

        return (
          <Link key={item.nama} href={item.path || "#"}>
            <Button
              variant={isItemActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start font-normal",
                isItemActive && "bg-secondary font-medium"
              )}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                {!isCollapsed && <span>{item.nama}</span>}
              </div>
            </Button>
          </Link>
        );
      })}
    </div>
  );
}

interface SidebarProps {
  className?: string;
}

export function SidebarAdmin({ className }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden fixed top-4 left-4 z-50"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0">
          <div className="flex h-full flex-col">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 font-semibold"
              >
                <Package className="h-6 w-6" />
                <span>Admin Panel</span>
              </Link>
            </div>
            <ScrollArea className="flex-1 px-3 py-4">
              <SidebarNav items={dataNavAdmin} />
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden md:flex fixed left-0 top-0 z-30 h-full bg-background border-r transition-all duration-300",
          isCollapsed ? "w-16" : "w-64",
          className
        )}
      >
        <div className="flex h-full w-full flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 justify-between">
            <Link
              href="/dashboard"
              className={cn(
                "flex items-center gap-2 font-semibold transition-opacity duration-200",
                isCollapsed && "opacity-0 pointer-events-none"
              )}
            >
              <Package className="h-6 w-6" />
              <span>Admin Panel</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="h-8 w-8 relative"
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4 absolute left-0 rotate-90" />
              )}
            </Button>
          </div>
          <ScrollArea className="flex-1 px-3 py-4">
            <SidebarNav items={dataNavAdmin} isCollapsed={isCollapsed} />
          </ScrollArea>
        </div>
      </div>
    </>
  );
}

interface SidebarInternalProps {
  className?: string;
  onCollapseChange?: (collapsed: boolean) => void;
}

export function SidebarAdminInternal({
  className,
  onCollapseChange,
}: SidebarInternalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleCollapseToggle = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    onCollapseChange?.(newCollapsed);
  };

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden fixed top-4 left-4 z-50"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0">
          <SheetHeader className="px-3"> 
              <SheetTitle>
               <Link
                href="/dashboard"
                className="flex items-center gap-2 px-3 mt-3 font-semibold"
              >
                <Package className="h-6 w-6" />
                <SheetDescription>
                    Admin Panel
              </SheetDescription>
              </Link>
              
              </SheetTitle>
          </SheetHeader>
  
            <ScrollArea className="flex-1 px-3 ">
              <SidebarNav items={dataNavAdmin} />
            </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden md:flex fixed left-0 top-0 mt-5 z-30 h-full bg-background border-r transition-all duration-300",
          isCollapsed ? "w-16" : "w-64",
          className
        )}
      >
        <div className="flex h-full w-full flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 justify-between">
            {!isCollapsed ? (
              <>
                <Link
                  href="/dashboard"
                  className={cn(
                    "flex items-center gap-2 font-semibold transition-opacity duration-200",
                    isCollapsed && "opacity-0 pointer-events-none"
                  )}
                >
                  <Package className="h-6 w-6" />
                  <span>Admin Panel</span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCollapseToggle}
                  className={isCollapsed ? "h-8 w-8" : ""}
                >
                  <ChevronLeft className="size-4 " />
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCollapseToggle}
                className={isCollapsed ? "h-8 w-8" : ""}
              >
                <ChevronRight className="size-4 " />
              </Button>
            )}
          </div>
          <ScrollArea className="flex-1 px-3 py-4">
            <SidebarNav items={dataNavAdmin} isCollapsed={isCollapsed} />
          </ScrollArea>
        </div>
      </div>
    </>
  );
}
